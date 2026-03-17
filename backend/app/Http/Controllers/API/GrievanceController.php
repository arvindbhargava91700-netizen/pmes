<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Grievance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GrievanceController extends Controller
{

    /**
     * List all grievances
     */
    public function index()
    {
        try {
            $stats=[
                "open"=> Grievance::where('grievance_status_id',1)->count(),
                "in_progress"=> Grievance::where('grievance_status_id',2)->count(),
                "sla_breached"=> Grievance::where('grievance_status_id',3)->count(),
                "resolved"=> Grievance::where('grievance_status_id',4)->count()
            ];

            $data = Grievance::with(['priority:id,name,sla_hours','status:id,name,color'])->orderBy('id','desc')->get();

            return response()->json([
                'status' => true,
                'list' => [
                    'stats'=> $stats,
                    'data'=> $data,
                ]
            ],200);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch grievances',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store grievance
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(),[
            'grievance_number' => 'required|unique:grievances,grievance_number',
            'title' => 'required|string',
            'description' => 'required|string',
            'priority_id' => 'required|integer',
            'grievance_status_id' => 'required|integer',
            'ward_name' => 'required',
            'location' => 'required|string',
            'assigned_to' => 'required|integer',
            'complainant_name' => 'required|string',
            'complainant_mobile' => 'required|string',
            'is_anonymous' => 'nullable|boolean'
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'message'=>$validator->errors()->first(),
                'errors'=>$validator->errors()
            ],422);
        }

        try{

            $data = $validator->validated();

            // SLA example (optional logic)
            $data['sla_due_at'] = now()->addHours(48);

            $grievance = Grievance::create($data);

            return response()->json([
                'status'=>true,
                'message'=>'Grievance created successfully'
            ],201);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to create grievance',
                'error'=>$e->getMessage()
            ],500);
        }
    }

    /**
     * Show single grievance
     */
    public function show($id)
    {
        try{

            $data = Grievance::find($id);

            if(!$data){
                return response()->json([
                    'status'=>false,
                    'message'=>'Grievance not found'
                ],404);
            }

            return response()->json([
                'status'=>true,
                'data'=>$data
            ],200);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to fetch grievance',
                'error'=>$e->getMessage()
            ],500);
        }
    }

    /**
     * Update grievance
     */
    public function update(Request $request,$id)
    {

        $validator = Validator::make($request->all(),[
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'priority_id' => 'nullable|integer',
            'grievance_status_id' => 'nullable|integer',
            'ward_name' => 'required',
            'location' => 'nullable|string',
            'assigned_to' => 'nullable|integer'
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'message'=>$validator->errors()->first()
            ],422);
        }

        try{

            $grievance = Grievance::find($id);

            if(!$grievance){
                return response()->json([
                    'status'=>false,
                    'message'=>'Grievance not found'
                ],404);
            }

            $grievance->update($validator->validated());

            return response()->json([
                'status'=>true,
                'message'=>'Grievance updated successfully',
                'data'=>$grievance
            ],200);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to update grievance',
                'error'=>$e->getMessage()
            ],500);
        }
    }

    /**
     * Delete grievance
     */
    public function destroy($id)
    {
        try{

            $grievance = Grievance::find($id);

            if(!$grievance){
                return response()->json([
                    'status'=>false,
                    'message'=>'Grievance not found'
                ],404);
            }

            $grievance->delete();

            return response()->json([
                'status'=>true,
                'message'=>'Grievance deleted successfully'
            ],200);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to delete grievance',
                'error'=>$e->getMessage()
            ],500);
        }
    }

}