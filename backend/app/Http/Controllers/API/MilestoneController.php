<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MilestoneController extends Controller
{

    /**
     * List all Milestone (Cached)
     */
    public function index()
    {
        try {

            $data = Cache::remember('milestone', 60 * 60, function () {
                return Milestone::select('id','name','status')
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
                'message' => 'Failed to fetch Milestone list',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store new Milestone
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:milestones,name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status = Milestone::create([
                'name' => $request->name,
            ]);

            Cache::forget('milestone');

            return response()->json([
                'status' => true,
                'message' => 'Milestone created successfully'
            ],201);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to create Milestone',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show single Milestone
     */
    public function show($id)
    {
        try {

            $data = Cache::remember("milestone_{$id}", 60 * 60, function () use ($id) {
                return Milestone::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (ModelNotFoundException $e) { 

            return response()->json([
                'status' => false,
                'message' => 'Milestone not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch Milestone',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update Milestone
     */
    public function update(Request $request,$id)
    {
        try {

            $status = Milestone::findOrFail($id);

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
            ]);

            Cache::forget('milestone_all');
            Cache::forget("milestone_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Milestone updated successfully',
                'data' => $status
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Milestone not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to update Milestone',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Delete Milestone
     */
    public function destroy($id)
    {
        try {

            $status = Milestone::findOrFail($id);
            $status->delete();

            Cache::forget('milestone_all');
            Cache::forget("milestone_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Milestone deleted successfully'
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Milestone not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete Milestone',
                'error' => $e->getMessage()
            ],500);
        }
    }

}