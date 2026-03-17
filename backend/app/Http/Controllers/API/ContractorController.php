<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contractor;
use App\Models\UserAuthMethod;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Hash;


class ContractorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contractor = Contractor::select('id', 'company_name', 'contractor_name', 'number', 'email', 'user_id', 'added_by', 'status')->get();
        return response()->json($contractor);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'company_name'     => 'required|string|max:255',
                'contractor_name'  => 'required|string|max:255',
                'number'           => 'required|digits_between:10,15',
                'email'            => 'required|email|unique:contractors,email',
                'user_id'          => 'exists:users,id',
                'added_by'         => 'nullable|string|max:255',
                'status'           => 'nullable|in:0,1',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()
                ], 422);
            }

            $name=$request->contractor_name;
            $firstname=strtolower(explode(' ',trim($name))[0]);
            do{
                $username=$firstname.'_'.rand(100,999);
            }
            while(User::where('username',$username)->exists());

            $user = User::create([
                'name'     => $name,
                'username'=>$username,
                'email'    => $request->email,
                'mobile'    => $request->number,
                'status'   => 1
            ]);
               UserAuthMethod::create([
            'user_id' => $user->id,
            'type'    => 'password',
            'password'=> Hash::make('Cmp@123#com'),
            'is_active' => 1
        ]);
            $contractor = Contractor::create([
                'company_name' => $request->company_name,
                'contractor_name' => $request->contractor_name,
                'number' => $request->number,
                'email' => $request->email,
                'user_id' => $user->id,
                'added_by' => Auth::id(),
                'status' => 1
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Contractor Create successfully',
                'data' => $contractor
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
        try{
            $contractor=Contractor::find($id);
            if(!contractor){
                return resource->json([
                    'success'=>false,
                    'message'=>"Contractor Not Found",
                ],404);
            }
            return response()->json([
                'success'=>true,
                'data'=>$contractor
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'success'=>false,
                'message'=>$e->getMessage()
            ],500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    try {

        $validator = Validator::make($request->all(), [
            'company_name'     => 'required|string|max:255',
            'contractor_name'  => 'required|string|max:255',
            'number'           => 'required|digits_between:10,15',
            'email'            => 'required|email|unique:contractors,email,' . $id,
            'status'           => 'nullable|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validator->errors()
            ], 422);
        }

        $name = $request->contractor_name;
        $firstname = strtolower(explode(' ', trim($name))[0]);
        do {
            $username = $firstname . '_' . rand(100,999);
        } while (User::where('username', $username)->exists());

        $contractor = Contractor::find($id);
        if (!$contractor) {
            return response()->json([
                'message' => 'Contractor not found'
            ], 404);
        }

        $user = User::find($contractor->user_id);
        if ($user) {
            $user->update([
                'name'     => $name,
                'username' => $username,
                'email'    => $request->email,
                'mobile'   => $request->number,
            ]);
        }

        $contractor->update([
            'company_name'     => $request->company_name,
            'contractor_name'  => $request->contractor_name,
            'number'           => $request->number,
            'email'            => $request->email,
            'status'           => $request->status ?? $contractor->status,
        ]);

        return response()->json([
            'message' => 'Contractor updated successfully',
            'data' => $contractor
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
            $contractor=Contractor::find($id);
            if(!$contractor){
                return response()->json([
                    'success'=>false,
                    'message'=>"Contractor Not Found"
                ],404);
            }

            $contractor->delete();
            return response->json([
                'success'=>true,
                'message'=>"Contractor Deleted successfully"
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'success'=>false,
                'message'=>$e->getMessage()
            ],500);
        }
    }
}
