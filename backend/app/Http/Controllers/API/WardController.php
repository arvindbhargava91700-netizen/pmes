<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ward;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class WardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ward = Ward::select('id', 'name', 'status')->get();
        return response()->json($ward);
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

            $ward = Ward::create([
                'name' => $request->name,
                'status' => $request->status ?? 1
            ]);
            return response()->json([
                'success' => true,
                'message' => "Ward Add successfully",
                'data' => $ward
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
            $ward = Ward::find($id);
            if (!$ward) {
                return response()->json([
                    'success' => false,
                    "message" => "Ward not found"
                ], 404);
            }
            return response()->json([
                'success' => true,
                'id' => $ward->id,
                'ward' => $ward->name,
                'status' => $ward->status

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
            $validator = Validator::make($request->all(),[
                'name' => "required|string|min:3|max:100",
                'status' => "nullable|in:0,1"
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }
            $ward = Ward::find($id);
            if (!$ward) {
                return response()->json([
                    'message' => 'Ward not found'
                ], 404);
            }
            $ward->update([
                'name' => $request->name,
                'status' => $request->status ?? $ward->status
            ]);
            return response()->json([
                'message' => 'Ward updated successfully',
                'data' => $ward
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
        try{
            $ward=Ward::find($id);
            if(!$ward){
              return response()->json([
                'success'=>false,
                'message'=>"Ward Not Found"
              ],404);
            }
            $ward->delete();
            return response()->json([
                'success'=>true,
                'message'=>"Ward Deleted Successfully"
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'success'=>false,
                'message'=>$e->getMessage()
            ],500);
        }
    }
}
