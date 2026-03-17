<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WorkClassifaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkClassifactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workClassifaction = WorkClassifaction::select('id', 'name', 'status')->get();
        return response()->json($workClassifaction);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:100',
                'status' => 'nullable|in:0,1'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            $workClassifaction = WorkClassifaction::create([
                'name' => $request->name,
                'status' => $request->status ?? 1
            ]);
            return response()->json([
                'success' => true,
                'message' => "WorkClassifaction Add successfully",
                'data' => $workClassifaction
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $workClassifaction = WorkClassifaction::find($id);
            if (!$workClassifaction) {
                return response()->json([
                    'success' => false,
                    "message" => "WorkClassifaction not found"
                ], 404);
            }
            return response()->json([
                'success' => true,
                'id' => $workClassifaction->id,
                'name' => $workClassifaction->name,
                'status' => $workClassifaction->status

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
                'name' => "required|string|min:3|max:100",
                'status' => "nullable|in:0,1"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }
            $workClassifaction = WorkClassifaction::find($id);
            if (!$workClassifaction) {
                return response()->json([
                    'message' => 'Ward not found'
                ], 404);
            }
            $workClassifaction->update([
                'name' => $request->name,
                'status' => $request->status ?? $workClassifaction->status
            ]);
            return response()->json([
                'message' => 'WorkClassifaction updated successfully',
                'data' => $workClassifaction
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
            $ward = workClassifaction::find($id);
            if (!$ward) {
                return response()->json([
                    'success' => false,
                    'message' => "Ward Not Found"
                ], 404);
            }
            $ward->delete();
            return response()->json([
                'success' => true,
                'message' => "Ward Deleted Successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
