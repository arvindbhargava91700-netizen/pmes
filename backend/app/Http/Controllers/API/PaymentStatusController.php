<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\PaymentStatusMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PaymentStatusController extends Controller
{

    /**
     * List all project statuses (Cached)
     */
    public function index()
    {
        try {

            $data = Cache::remember('payment_status_all', 60 * 60, function () {
                return PaymentStatusMaster::select('id','name','color','sort_order')
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
                'message' => 'Failed to fetch Payment status list',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store new project status
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:payment_status_masters,name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status = PaymentStatusMaster::create([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('payment_status_all');

            return response()->json([
                'status' => true,
                'message' => 'Payment status created successfully'
            ],201);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to create payment status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show single project status
     */
    public function show($id)
    {
        try {

            $data = Cache::remember("payment_status_{$id}", 60 * 60, function () use ($id) {
                return PaymentStatusMaster::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Payment status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch Payment status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update payment status
     */
    public function update(Request $request,$id)
    {
        try {

            $status = PaymentStatusMaster::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:payment_status_masters,name,' . $id
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

            Cache::forget('payment_status_all');
            Cache::forget("payment_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'payment status updated successfully',
                'data' => $status
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'payment status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to update payment status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Delete payment status
     */
    public function destroy($id)
    {
        try {

            $status = PaymentStatusMaster::findOrFail($id);
            $status->delete();

            Cache::forget('payment_status_all');
            Cache::forget("payment_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Payment status deleted successfully'
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Payment status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete Payment status',
                'error' => $e->getMessage()
            ],500);
        }
    }

}