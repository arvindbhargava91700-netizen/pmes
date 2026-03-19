<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilestoneDependencies;
use App\Models\Tender;
use App\Models\TenderDocument;
use App\Models\TenderMilestone;
use App\Models\TenderTimeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
class TenderController extends Controller
{

      public function tenderCounts()
    {
        try {

            $data = [
                'total_tenders'     => Tender::count(),
                'drafted'           => Tender::where('tender_status_id', 1)->count(), 
                'published'         => Tender::where('tender_status_id', 4)->count(), 
                'under_evaluation'  => Tender::where('tender_status_id', 3)->count(),  
                'awarded'           => Tender::where('tender_status_id', 2)->count(), 
            ];

            return response()->json([
                'status'  => true,
                'message' => 'Tender counts fetched successfully',
                'data'    => $data,
            ], 200);
        } catch (\Throwable $e) {

            Log::error('Tender count API failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong while fetching counts',
            ], 500);
        }
    }
    
    public function index(Request $request)
    {
        try {

            $query = Tender::with([
                'department:id,name',
                'tenderStatus:id,name,color',
                'timeline:id,tender_id,end_date'
            ]);


            if ($request->filled('search')) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('tender_code', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%");
                });
            }


            if ($request->filled('status_id')) {
                $query->where('tender_status_id', $request->status_id);
            }


            if ($request->filled('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            $tenders = $query->orderBy('id', 'desc')->paginate(10);

            if ($tenders->isEmpty()) {
                return response()->json([
                    'status'  => true,
                    'message' => 'No data found',
                    'data'    => [],
                ], 200);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Tender listed successfully!',
                'data'    => $tenders->map(function ($tender) {
                    return [
                        'id'             => $tender->id,
                        'tender_id'      => $tender->tender_code,
                        'title'          => $tender->title,
                        'description'=> $tender->description,
                        'department'     => optional($tender->department)->name,
                        'estimated_cost' => $tender->estimated_cost,
                        'status'         => optional($tender->tenderStatus)->name,
                        'status_color'   => optional($tender->tenderStatus)->color,
                        'closing_date'   => optional($tender->timeline)->end_date,
                        'bid'            => '0',
                    ];
                }),
                'pagination' => [
                    'current_page' => $tenders->currentPage(),
                    'last_page'    => $tenders->lastPage(),
                    'per_page'     => $tenders->perPage(),
                    'total'        => $tenders->total(),
                ]
            ], 200);
        } catch (\Throwable $e) {

            Log::error('Tender list fetch failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong while fetching tenders',
            ], 500);
        }
    }




    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'tender_code' => 'required|string|unique:tenders,tender_code',
            'title' => 'required|string',
            'department_id' => 'required|integer',
            'work_type_id' => 'required|integer',
            'estimated_cost' => 'required|numeric',
            'emd_amount' => 'required|numeric',
            'description' => 'nullable|string',
            'tender_status_id' => 'required|integer',

            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'schedule_type' => 'required|in:daily,weekly,monthly',
            'project_duration_weeks' => 'required|integer|min:1',
            'is_locked' => 'required|in:0,1',

            'milestones' => 'required|array|min:1',
            'milestones.*.sequence_no' => 'required|integer',
            'milestones.*.milestone_title' => 'required|string',
            'milestones.*.description' => 'required|string',
            'milestones.*.duration_weeks' => 'required|integer|min:1',
            'milestones.*.dependencies' => 'nullable|array',
            'milestones.*.dependencies.*' => 'integer',
            'milestones.*.is_critical' => 'required|boolean',

            'documents' => 'nullable|array',
            'documents.*.file_name' => 'required_with:documents|string',
            'documents.*.file_path' => 'required_with:documents|string',
            'documents.*.file_size' => 'required_with:documents|string',
            'documents.*.mime_type' => 'required_with:documents|string',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {

            $tender = Tender::create([
                'tender_code' => $request->tender_code,
                'title' => $request->title,
                'department_id' => $request->department_id,
                'work_type_id' => $request->work_type_id,
                'estimated_cost' => $request->estimated_cost,
                'emd_amount' => $request->emd_amount,
                'description' => $request->description,
                'tender_status_id' => $request->tender_status_id,
                'created_by' => Auth::user()->id ?? 1,
            ]);


            TenderTimeline::create([
                'tender_id' => $tender->id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'schedule_type' => $request->schedule_type,
                'project_duration_weeks' => $request->project_duration_weeks,
                'is_locked' => $request->is_locked,
            ]);


            $milestoneMap = [];

            foreach ($request->milestones as $item) {
                $milestone = TenderMilestone::create([
                    'tender_id' => $tender->id,
                    'sequence_no' => $item['sequence_no'],
                    'title' => $item['milestone_title'],
                    'duration_weeks' => $item['duration_weeks'],
                    'is_critical' => $item['is_critical'],
                    'description' => $item['description'],
                ]);

                $milestoneMap[$item['sequence_no']] = $milestone->id;
            }


            foreach ($request->milestones as $item) {
                if (!empty($item['dependencies'])) {

                    $currentMilestoneId = $milestoneMap[$item['sequence_no']];

                    foreach ($item['dependencies'] as $dependsSequenceNo) {
                        if (isset($milestoneMap[$dependsSequenceNo])) {
                            MilestoneDependencies::create([
                                'milestone_id' => $currentMilestoneId,
                                'depends_on_milestone_id' => $milestoneMap[$dependsSequenceNo],
                            ]);
                        }
                    }
                }
            }


            if ($request->filled('documents')) {
                foreach ($request->documents as $item) {
                    TenderDocument::create([
                        'tender_id' => $tender->id,
                        'file_name' => $item['file_name'],
                        'file_path' => $item['file_path'],
                        'file_size' => $item['file_size'],
                        'mime_type' => $item['mime_type'],
                        'uploaded_by' => Auth::user()->id ?? 1,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Tender Created Successfully',
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            Log::error('Tender create failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong while creating tender',
            ], 500);
        }
    }


    public function show($id)
    {
        try {

            $tender = Tender::with([
                'department:id,name',
                'tenderStatus:id,name,color',
                'timeline:id,tender_id,start_date,end_date,schedule_type,project_duration_weeks,is_locked',
                'milestones:id,tender_id,sequence_no,title,duration_weeks,is_critical',
                'milestones.dependencies:id,milestone_id,depends_on_milestone_id',
                'documents:id,tender_id,file_name,file_path,file_size,mime_type'
            ])->find($id);

            if (!$tender) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Tender not found',
                ], 404);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Tender details fetched successfully',
                'data'    => [
                    'id'              => $tender->id,
                    'tender_code'     => $tender->tender_code,
                    'title'           => $tender->title,
                    'department'      => optional($tender->department)->name,
                    'estimated_cost'  => $tender->estimated_cost,
                    'emd_amount'      => $tender->emd_amount,
                    'status'          => optional($tender->tenderStatus)->name,
                    'status_color'    => optional($tender->tenderStatus)->color,
                    'description'     => $tender->description,

                    'timeline' => [
                        'start_date'             => optional($tender->timeline)->start_date,
                        'end_date'               => optional($tender->timeline)->end_date,
                        'schedule_type'          => optional($tender->timeline)->schedule_type,
                        'project_duration_weeks' => optional($tender->timeline)->project_duration_weeks,
                        'is_locked'              => optional($tender->timeline)->is_locked,
                    ],

                    'milestones' => $tender->milestones->map(function ($milestone) {
                        return [
                            'id'             => $milestone->id,
                            'sequence_no'    => $milestone->sequence_no,
                            'title'          => $milestone->title,
                            'duration_weeks' => $milestone->duration_weeks,
                            'is_critical'    => $milestone->is_critical,
                            'dependencies'   => $milestone->dependencies
                                ->pluck('depends_on_milestone_id'),
                        ];
                    }),

                    'documents' => $tender->documents->map(function ($doc) {
                        return [
                            'file_name' => $doc->file_name,
                            'file_path' => $doc->file_path,
                            'file_size' => $doc->file_size,
                            'mime_type' => $doc->mime_type,
                        ];
                    }),
                ],
            ], 200);
        } catch (\Throwable $e) {

            Log::error('Tender show failed', [
                'tender_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong while fetching tender details',
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [

            'tender_code' => 'required|string|unique:tenders,tender_code,' . $id,
            'title' => 'required|string',
            'department_id' => 'required|integer',
            'work_type_id' => 'required|integer',
            'estimated_cost' => 'required|numeric',
            'emd_amount' => 'required|numeric',
            'description' => 'nullable|string',
            'tender_status_id' => 'required|integer',

            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'schedule_type' => 'required|in:daily,weekly,monthly',
            'project_duration_weeks' => 'required|integer|min:1',
            'is_locked' => 'required|in:0,1',

            'milestones' => 'required|array|min:1',
            'milestones.*.sequence_no' => 'required|integer',
            'milestones.*.milestone_title' => 'required|string',
            'milestones.*.duration_weeks' => 'required|integer|min:1',
            'milestones.*.dependencies' => 'nullable|array',
            'milestones.*.dependencies.*' => 'integer',
            'milestones.*.is_critical' => 'required|boolean',

            'documents' => 'nullable|array',
            'documents.*.file_name' => 'required_with:documents|string',
            'documents.*.file_path' => 'required_with:documents|string',
            'documents.*.file_size' => 'required_with:documents|string',
            'documents.*.mime_type' => 'required_with:documents|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {

            $tender = Tender::find($id);

            if (!$tender) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tender not found',
                ], 404);
            }


            $tender->update([
                'tender_code' => $request->tender_code,
                'title' => $request->title,
                'department_id' => $request->department_id,
                'work_type_id' => $request->work_type_id,
                'estimated_cost' => $request->estimated_cost,
                'emd_amount' => $request->emd_amount,
                'description' => $request->description,
                'tender_status_id' => $request->tender_status_id,
            ]);


            TenderTimeline::updateOrCreate(
                ['tender_id' => $tender->id],
                [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'schedule_type' => $request->schedule_type,
                    'project_duration_weeks' => $request->project_duration_weeks,
                    'is_locked' => $request->is_locked,
                ]
            );


            $oldMilestoneIds = TenderMilestone::where('tender_id', $tender->id)->pluck('id');
            MilestoneDependencies::whereIn('milestone_id', $oldMilestoneIds)->delete();
            TenderMilestone::where('tender_id', $tender->id)->delete();


            $milestoneMap = [];

            foreach ($request->milestones as $item) {
                $milestone = TenderMilestone::create([
                    'tender_id' => $tender->id,
                    'sequence_no' => $item['sequence_no'],
                    'title' => $item['milestone_title'],
                    'duration_weeks' => $item['duration_weeks'],
                    'is_critical' => $item['is_critical'],
                ]);

                $milestoneMap[$item['sequence_no']] = $milestone->id;
            }


            foreach ($request->milestones as $item) {
                if (!empty($item['dependencies'])) {
                    $currentMilestoneId = $milestoneMap[$item['sequence_no']];

                    foreach ($item['dependencies'] as $dependsSequenceNo) {
                        if (isset($milestoneMap[$dependsSequenceNo])) {
                            MilestoneDependencies::create([
                                'milestone_id' => $currentMilestoneId,
                                'depends_on_milestone_id' => $milestoneMap[$dependsSequenceNo],
                            ]);
                        }
                    }
                }
            }


            if ($request->filled('documents')) {
                TenderDocument::where('tender_id', $tender->id)->delete();

                foreach ($request->documents as $item) {
                    TenderDocument::create([
                        'tender_id' => $tender->id,
                        'file_name' => $item['file_name'],
                        'file_path' => $item['file_path'],
                        'file_size' => $item['file_size'],
                        'mime_type' => $item['mime_type'],
                        'uploaded_by' => Auth::user()->id ?? 1,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Tender Updated Successfully',
            ]);
        } catch (\Throwable $e) {

            DB::rollBack();

            Log::error('Tender update failed', [
                'tender_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 500,
                'message' => 'Something went wrong while updating tender',
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $tender = Tender::find($id);

            if (!$tender) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Tender not found',
                ], 404);
            }
            $milestoneIds = TenderMilestone::where('tender_id', $tender->id)
                ->pluck('id');
            if ($milestoneIds->isNotEmpty()) {
                MilestoneDependencies::whereIn('milestone_id', $milestoneIds)->delete();
            }
            TenderMilestone::where('tender_id', $tender->id)->delete();
            TenderDocument::where('tender_id', $tender->id)->delete();
            TenderTimeline::where('tender_id', $tender->id)->delete();
            $tender->delete();
            DB::commit();
            return response()->json([
                'status'  => true,
                'message' => 'Tender deleted successfully',
            ], 200);
        } catch (\Throwable $e) {

            DB::rollBack();

            Log::error('Tender delete failed', [
                'tender_id' => $id,
                'error'     => $e->getMessage(),
            ]);

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong while deleting tender',
            ], 500);
        }
    }

   
}
