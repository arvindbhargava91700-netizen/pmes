<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\GrievancePrioritie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class GrievancePriorityController extends Controller
{

    /**
     * List all grievance statuses (Cached)
     */
    public function index()
    {
        try {

            $data = Cache::remember('grievance_prioritie_all', 60 * 60, function () {
                return GrievancePrioritie::select('id','name','sla_hours')
                        ->orderBy('id','asc')
                        ->get();
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch grievance status list',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store new grievance status
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:grievance_status_masters,name',
                'sla_hours' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status = GrievancePrioritie::create([
                'name' => $request->name,
                'sla_hours' => $request->sla_hours,
            ]);

            Cache::forget('grievance_prioritie_all');

            return response()->json([
                'status' => true,
                'message' => 'grievance status created successfully'
            ],201);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to create grievance status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show single Grievance Priority
     */
    public function show($id)
    {
        try {

            $data = Cache::remember("g_priority_status_{$id}", 60 * 60, function () use ($id) {
                return GrievancePrioritie::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (ModelNotFoundException $e) { 

            return response()->json([
                'status' => false,
                'message' => 'Griveance Priority not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch Grievance Priority',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update Grievance Priority
     */
    public function update(Request $request,$id)
    {
        try {

            $status = GrievancePrioritie::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status->update([
                'name' => $request->name,
                'sla_hours' => $request->sla_hours
            ]);

            Cache::forget('grievance_prioritie_all');
            Cache::forget("g_priority_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Griveance Priority updated successfully',
                'data' => $status
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Griveance Priority not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to update Grievance Priority',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Delete Grievance Priority
     */
    public function destroy($id)
    {
        try {

            $status = GrievancePrioritie::findOrFail($id);
            $status->delete();

            Cache::forget('grievance_prioritie_all');
            Cache::forget("g_priority_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Griveance Priority deleted successfully'
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Griveance Priority not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete Grievance Priority',
                'error' => $e->getMessage()
            ],500);
        }
    }

}