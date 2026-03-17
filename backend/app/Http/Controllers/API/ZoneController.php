<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $zone = Zone::select('id', 'name', 'status')->get();
        return response()->json($zone);
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

            $zone = Zone::create([
                'name' => $request->name,
                'status' => $request->status ?? 1
            ]);
            return response()->json([
                'success' => true,
                'message' => "Zone Add successfully",
                'data' => $zone
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
            $zone = Zone::find($id);
            if (!$zone) {
                return response()->json([
                    'success' => false,
                    "message" => "zone not found"
                ], 404);
            }
            return response()->json([
                'success' => true,
                'id' => $zone->id,
                'ward' => $zone->name,
                'status' => $zone->status

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
            $zone = Zone::find($id);
            if (!$zone) {
                return response()->json([
                    'message' => 'Ward not found'
                ], 404);
            }
            $zone->update([
                'name' => $request->name,
                'status' => $request->status ?? $zone->status
            ]);
            return response()->json([
                'message' => 'Zone updated successfully',
                'data' => $zone
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
            $ward = Zone::find($id);
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
