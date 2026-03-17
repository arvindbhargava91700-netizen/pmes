<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Department;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::select('id', 'name', 'status')->get();
        return response()->json($departments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:3|max:100',
                'status' => 'nullable|in:0,1',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()->first(),
                ],422);
            }
            $department =  Department::create([
                'name' => $request->name,
                'status' => $request->status ?? 1,
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Department Create successfully',
                'data' => $department
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $Department = Department::find($id);
            if (!$Department) {
                return response()->json([
                    'success' => false,
                    'Message' => "Department Not Found"
                ], 404);
            }
            return response()->json([
                'success' => true,
                'id' => $Department->id,
                'Department name' => $Department->name,
                'status' => $Department->status

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
                'name' => 'required|string|min:3|max:100',
                'status' => 'nullable|in:0,1',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'error' => $validator->errors()->first()
                ], 422);
            }

            $department = Department::find($id);
            if (!$department) {
                return response()->json([
                    'message' => 'Department not found'
                ], 404);
            }
            $department->update([
                'name' => $request->name,
                'status' => $request->status ?? $department->status,
            ]);
            return response()->json([
                'message' => 'Department updated successfully',
                'data' => $department
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
            $department = Department::find($id);
            if (!$department) {
                return response()->json([
                    'success' => false,
                    'message' => "Department not found"
                ], 404);
            }
            $department->delete();
            return response()->json([
                "success" => true,
                "message" => "Department deleted successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
