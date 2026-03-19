<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Storage;

class BillingController extends Controller
{

    // LIST BILLINGS
    public function index(Request $request)
    {
        try {

            $query = Billing::with(['project','status','milestone']);

            // filter by status
            if($request->billing_status_id){
                $query->where('billing_status_id',$request->billing_status_id);
            }

            $data = $query->latest()->paginate(10);

            return response()->json([
                'status'=>true,
                'data'=>$data
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status'=>false,
                'message'=>'Failed to fetch billings',
                'error'=>$e->getMessage()
            ],500);
        }
    }


// STORE  BILL
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'project_id' => 'required|integer',
        'milestone_id' => 'required|integer',
        'amount' => 'required|numeric',
        'mb_number' => 'nullable|string',
        'bill_date' => 'required|date',
        'billing_status_id' => 'required|integer',
        'remarks' => 'nullable|string',
        'billing_documents' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => $validator->errors()
        ], 422);
    }

    try {
        $data = $validator->validated();

        if ($request->hasFile('billing_documents')) {

            $file = $request->file('billing_documents');
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs('billing_documents', $filename, 'public');

            $data['billing_documents'] = asset('storage/' . $path);
        }

        $data['bill_number'] = Billing::generateBillingCode();
        $data['created_by'] = auth()->id();

        $billing = Billing::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Billing created successfully',
            'data' => $billing
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Failed to create billing',
            'error' => $e->getMessage()
        ], 500);
    }
}


    // SHOW BILL
    public function show($id)
    {
        try{

            $billing = Billing::with(['project','status','milestone'])->findOrFail($id);

// dd($billing);   
            return response()->json([
                'status'=>true,
                'data'=>$billing
            ]);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Billing not found'
            ],404);
        }
    }


    // UPDATE BILL
    public function update(Request $request,$id)
    {

        $billing = Billing::find($id);

        if(!$billing){
            return response()->json([
                'status'=>false,
                'message'=>'Billing not found'
            ],404);
        }

        $validator = Validator::make($request->all(),[
            'project_id' => 'required|integer',
             'milestone_id' => 'required|integer',
            'amount' => 'required|numeric',
            'mb_number' => 'nullable|string',
            'bill_date' => 'required|date',
            'billing_status_id' => 'required|integer',
            'remarks' => 'nullable|string'
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'message'=>$validator->errors()->first()
            ],422);
        }

        try{

            $billing->update($validator->validated());

            return response()->json([
                'status'=>true,
                'message'=>'Billing updated successfully'
            ]);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to update billing',
                'error'=>$e->getMessage()
            ],500);
        }
    }


    // DELETE BILL
    public function destroy($id)
    {

        try{

            $billing = Billing::find($id);

            if(!$billing){
                return response()->json([
                    'status'=>false,
                    'message'=>'Billing not found'
                ],404);
            }

            $billing->delete();

            return response()->json([
                'status'=>true,
                'message'=>'Billing deleted successfully'
            ]);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to delete billing',
                'error'=>$e->getMessage()
            ],500);
        }
    }

        public function download($file)
{
    $filePath = "billing_documents/$file";

    if (!Storage::disk('public')->exists($filePath)) {
        return response()->json(['message' => 'File not found.'], 404);
    }

    return Storage::disk('public')->download($filePath);
}

}