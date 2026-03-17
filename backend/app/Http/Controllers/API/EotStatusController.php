<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\EotStatusMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EotStatusController extends Controller
{

    /**
     * List all Eot statuses (Cached)
     */
    public function index()
    {
        try {

            $data = Cache::remember('eot_status_all', 60 * 60, function () {
                return EotStatusMaster::select('id','name','color','sort_order')
                        ->orderBy('sort_order','asc')
                        ->get();
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch eot status list',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store new Eot status
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:eot_status_masters,name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status = EotStatusMaster::create([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('eot_status_all');

            return response()->json([
                'status' => true,
                'message' => 'Eot status created successfully'
            ],201);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to create eot status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show single Eot status
     */
    public function show($id)
    {
        try {

            $data = Cache::remember("eot_status_{$id}", 60 * 60, function () use ($id) {
                return EotStatusMaster::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'eot status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch eot status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update Eot status
     */
    public function update(Request $request,$id)
    {
        try {

            $status = EotStatusMaster::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:eot_status_masters,name,' . $id
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
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('eot_status_all');
            Cache::forget("eot_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Eot status updated successfully',
                'data' => $status
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Eot status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to update Eot status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Delete Eot status
     */
    public function destroy($id)
    {
        try {

            $status = EotStatusMaster::findOrFail($id);
            $status->delete();

            Cache::forget('eot_status_all');
            Cache::forget("eot_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Eot status deleted successfully'
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Eot status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete Eot status',
                'error' => $e->getMessage()
            ],500);
        }
    }

}