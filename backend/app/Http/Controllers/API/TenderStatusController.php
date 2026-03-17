<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tender;
use App\Models\TenderStatusMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class TenderStatusController extends Controller
{
    /**
     * List all tender statuses (Cached)
     */
    public function index()
    {
        try {
            $data = Cache::remember('tender_status_master_all', 60 * 60, function () {
                return TenderStatusMaster::select('id', 'name', 'color', 'sort_order')
                    ->orderBy('name', 'asc')
                    ->get();
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch tender status list',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new tender status
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:tender_status_masters,name',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => false,
                    'message' => $validator->errors()->first(),
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $tenderStatus = TenderStatusMaster::create([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order,
            ]);

            // Clear cache
            Cache::forget('tender_status_master_all');

            return response()->json([
                'status' => true,
                'message' => 'Tender status created successfully',
                'data' => $tenderStatus
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to create tender status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show single tender status (Cached)
     */
    public function show($id)
    {
        try {
            $data = Cache::remember("tender_status_master_{$id}", 60 * 60, function () use ($id) {
                return TenderStatusMaster::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Tender status not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch tender status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update tender status
     */
    public function update(Request $request, $id)
    {
        try {
            $tenderStatus = TenderStatusMaster::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:tender_status_masters,name,' . $id,
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => false,
                    'message' => $validator->errors()->first(),
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $tenderStatus->update([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order,
            ]);

            // Clear cache
            Cache::forget('tender_status_master_all');
            Cache::forget("tender_status_master_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Tender status updated successfully',
                'data' => $tenderStatus
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Tender status not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update tender status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete tender status
     */
    public function destroy($id)
    {
        try {
            $tenderStatus = TenderStatusMaster::findOrFail($id);
            $tenderStatus->delete();

            // Clear cache
            Cache::forget('tender_status_master_all');
            Cache::forget("tender_status_master_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Tender status deleted successfully'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Tender status not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete tender status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
public function tenderList($status = null)
{
    try {
        if ($status) {
            $statusData = TenderStatusMaster::where('name', $status)->first();
            if (!$statusData) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid status'
                ], 404);
            }
            $tenders = Tender::with(['milestones','documents','tenderStatus'])->where('tender_status_id', $statusData->id)
                ->latest()
                ->take(5)
                ->get();
        } else {
            $tenders = Tender::with(['milestones','documents','tenderStatus'])->latest()
                ->take(5)
                ->get();
        }
        return response()->json([
            'status' => true,
            'message' => 'Tender list fetched successfully',
            'data' => $tenders
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Failed to fetch tenders',
            'error' => $e->getMessage()
        ], 500);

    }
}
}
