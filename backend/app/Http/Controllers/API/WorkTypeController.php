<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WorkType;
use Illuminate\Support\Facades\Validator;

class WorkTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workTypes = WorkType::select('id', 'workType', 'status')->get();
        return response()->json($workTypes);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'workType' => 'required|string|min:3|max:255',
                'status' => 'nullable|in:0,1'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()->first()
                ]);
            }
            $workType = WorkType::create([
                'workType' => $request->workType,
                'status' => $request->status ?? 1
            ]);
            return response()->json([
                'success' => true,
                'message' => "Work Type Add Successfully",
                'data' => $workType
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $workType = WorkType::find($id);
            if (!$workType) {
                return response()->json([
                    'success' => false,
                    'Message' => "Work Type Not Found"
                ], 404);
            }
            return response()->json([
                'success' => true,
                'id' => $workType->id,
                'workType' => $workType->workType,
                'status' => $workType->status

            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'workType' => 'required|string|min:3|max:255',
                'status' => 'nullable|in:0,1'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }
            $workType = WorkType::find($id);
            if (!$workType) {
                return response()->json([
                    'success' => false,
                    'message' => "Work Type Not Found"
                ], 404);
            }
            $workType->update([
                'workType' => $request->workType,
                'status' => $request->status ?? 1,
            ]);
            return response()->json([
                'message' => 'WorkType updated successfully',
                'data' => $workType
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $workType = WorkType::find($id);
            if (!$workType) {
                return response()->json([
                    'success' => false,
                    'message' => "Work Type Not Found"
                ], 404);
            }
            $workType->delete();
            return response()->json([
                'success' => true,
                'message' => "Work type Delete Successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
