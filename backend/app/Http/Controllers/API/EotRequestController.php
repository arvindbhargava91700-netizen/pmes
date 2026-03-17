<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EotApproval;
use App\Models\EotRequest;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EotRequestController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = EotRequest::latest()->paginate(10);
            $stats = [
            'total_request' =>EotRequest::count(),
            'pending' =>EotRequest::where('eot_status_id','2')->count(),
            'approved' =>EotRequest::where('eot_status_id','1')->count(),
            'reject' => EotRequest::where('eot_status_id','3')->count(),
              ];
            return response()->json([
                'status' => true,
                'message' => 'EOT request list fetched successfully',
                 
                'data' => [
                    'stats'   => $stats,
                    'list'=> $data
                ]
            ],200);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch EOT requests',
                'error' => $e->getMessage()
            ],500);
        }
    }


    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(),[
            'eot_number' => 'required|unique:eot_requests,eot_number',
            'project_id' => 'required|integer',
            'contractor_id' => 'required|integer',
            'requested_days' => 'required|integer',
            'reason_type' => 'required|string',
            'ld_applicable' => 'required|boolean',
            'penalty_amount' => 'required|numeric',
            'eot_status_id' => 'required|integer',
            'current_approver_id' => 'nullable|integer',
            'submitted_date' => 'nullable|date',
            'remarks' => 'nullable|string'
        ]);

        if($validator->fails()){

            return response()->json([
                'status'=>false,
                'message'=>$validator->errors()->first(),
                'errors'=>$validator->errors()
            ],422);
        }

        try{
          $data = [
                'eot_number' => $request->eot_number,
                'project_id' => $request->project_id,
                'contractor_id' => $request->contractor_id,
                'requested_days' => $request->requested_days,
                'reason_type' => $request->reason_type,
                'ld_applicable' => $request->ld_applicable,
                'penalty_amount' => $request->penalty_amount,
                'eot_status_id' => $request->eot_status_id,
                'current_approver_id' => $request->current_approver_id,
                'submitted_date' => now(),
                'remarks' => $request->remarks,
                'created_by' => auth()->id()
            ];

            $data = EotRequest::create($data);

            return response()->json([
                'status'=>true,
                'message'=>'EOT request created successfully'
            ],201);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to create EOT request',
                'error'=>$e->getMessage()
            ],500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        try{

            $data = EotRequest::find($id);

            if(!$data){

                return response()->json([
                    'status'=>false,
                    'message'=>'EOT request not found'
                ],404);
            }

            return response()->json([
                'status'=>true,
                'data'=>$data
            ],200);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to fetch EOT request',
                'error'=>$e->getMessage()
            ],500);
        }
    }


    /**
     * Update the specified resource.
     */
    public function update(Request $request, $id)
    {

        $validator = Validator::make($request->all(),[
            'project_id' => 'required|integer',
            'requested_days' => 'required|integer',
            'submitted_date' => 'required|date'
        ]);

        if($validator->fails()){

            return response()->json([
                'status'=>false,
                'message'=>$validator->errors()->first(),
                'errors'=>$validator->errors()
            ],422);
        }

        try{

            $data = EotRequest::find($id);

            if(!$data){

                return response()->json([
                    'status'=>false,
                    'message'=>'EOT request not found'
                ],404);
            }

            $data->update($request->all());

            return response()->json([
                'status'=>true,
                'message'=>'EOT request updated successfully',
                'data'=>$data
            ],200);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to update EOT request',
                'error'=>$e->getMessage()
            ],500);
        }
    }


    /**
     * Remove the specified resource.
     */
    public function destroy($id)
    {

        try{

            $data = EotRequest::find($id);

            if(!$data){

                return response()->json([
                    'status'=>false,
                    'message'=>'EOT request not found'
                ],404);
            }

            $data->delete();

            return response()->json([
                'status'=>true,
                'message'=>'EOT request deleted successfully'
            ],200);

        }catch(\Exception $e){

            return response()->json([
                'status'=>false,
                'message'=>'Failed to delete EOT request',
                'error'=>$e->getMessage()
            ],500);
        }
    }



public function eot_request_approval(Request $request)
{
    $validator = Validator::make($request->all(), [
        'eot_request_id' => 'required|exists:eot_requests,id',
        'status' => 'required|in:approved,rejected',
        'remarks' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => $validator->errors()->first()
        ],422);
    }

    try {

        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Check permission from role_has_permissions table
        |--------------------------------------------------------------------------
        */


        $hasPermission = DB::table('role_has_permissions')
            ->where('permission_id', $user->id)
            ->first();
  

        if(!$hasPermission){
            return response()->json([
                'status'=>false,
                'message'=>'You are not authorized to approve'
            ],403);
        }

        /*
        |--------------------------------------------------------------------------
        | Find approval record
        |--------------------------------------------------------------------------
        */

        $approval = EotApproval::where('eot_request_id',$request->eot_request_id)
                    ->where('approver_id',$user->id)
                    ->where('status','pending')
                    ->first();

        /*
        |--------------------------------------------------------------------------
        | If approval not found → create new
        |--------------------------------------------------------------------------
        */

        if(!$approval){

            $approval = EotApproval::create([
                'eot_request_id' => $request->eot_request_id,
                'approver_id' => $user->id,
                'approver_role' => $hasPermission->role_id,
                'status' => $request->status,
                'approval_level' => 1,
                'remarks' => $request->remarks,
                'action_date' => now()
            ]);

        }else{

            /*
            |--------------------------------------------------------------------------
            | Update approval
            |--------------------------------------------------------------------------
            */

            $approval->update([
                'status'=>$request->status,
                'remarks'=>$request->remarks,
                'action_date'=>now()
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Update EOT Request
        |--------------------------------------------------------------------------
        */

        $eotRequest = EotRequest::find($request->eot_request_id);

        if($request->status == 'rejected'){

            $eotRequest->update([
                'eot_status_id'=>3,
                'current_approver_id'=>$request->eot_request_id
            ]);

            return response()->json([
                'status'=>true,
                'message'=>'EOT request rejected successfully'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Approved
        |--------------------------------------------------------------------------
        */

        $eotRequest->update([
            'eot_status_id'=>1,
            'current_approver_id'=>$request->eot_request_id
        ]);

        return response()->json([
            'status'=>true,
            'message'=>'EOT request approved successfully'
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status'=>false,
            'message'=>'Approval failed',
            'error'=>$e->getMessage()
        ],500);
    }
}


}