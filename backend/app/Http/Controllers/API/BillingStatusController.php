<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\BillingStatusMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BillingStatusController extends Controller
{

    /**
     * List all Billing statuses (Cached)
     */
    public function index()
    {
        try {

            $data = Cache::remember('billing_status_all', 60 * 60, function () {
                return BillingStatusMaster::select('id','name','color','sort_order')
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
                'message' => 'Failed to fetch Billing status list',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store new Billing status
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:billing_status_masters,name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status = BillingStatusMaster::create([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('billing_status_all');

            return response()->json([
                'status' => true,
                'message' => 'Billing status created successfully'
            ],201);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to create Billing status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show single Billing status
     */
    public function show($id)
    {
        try {

            $data = Cache::remember("billing_status_{$id}", 60 * 60, function () use ($id) {
                return BillingStatusMaster::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (ModelNotFoundException $e) { 

            return response()->json([
                'status' => false,
                'message' => 'Billing status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch Billing status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update Billing status
     */
    public function update(Request $request,$id)
    {
        try {

            $status = BillingStatusMaster::findOrFail($id);

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
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('billing_status_all');
            Cache::forget("billing_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Billing status updated successfully',
                'data' => $status
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Billing status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to update Billing status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Delete Billing status
     */
    public function destroy($id)
    {
        try {

            $status = BillingStatusMaster::findOrFail($id);
            $status->delete();

            Cache::forget('billing_status_all');
            Cache::forget("billing_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Billing status deleted successfully'
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Billing status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete Billing status',
                'error' => $e->getMessage()
            ],500);
        }
    }

}