<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Otp;
use App\Models\User;
use App\Models\UserAuthMethod;
use App\Services\SmsService;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Mews\Captcha\Facades\Captcha;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function generateCaptcha()
    {
        $captcha = Captcha::create('default', true);
        // $captcha['key'] => captcha text
        // $captcha['img'] => base64 image

        $captchaId = (string) Str::uuid();

        Cache::put('captcha_' . $captchaId, strtoupper($captcha['key']), now()->addMinutes(5));

        return response()->json([
            'captcha_id' => $captchaId,
            'image' => $captcha['img'],
        ]);
    }

    public function roleList()
    {
        try {
            $roles = Role::select('id', 'name', 'description')->get();

            return response()->json(
                [
                    'status' => true,
                    'data' => $roles,
                    'message' => 'Role List Fetch Successfully',
                ],
                200,
            );
        } catch (\Throwable $e) {
            // error log for debugging
            Log::error('Role list fetch failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(
                [
                    'status' => false,
                    'data' => [],
                    'message' => 'Something went wrong while fetching roles',
                ],
                500,
            );
        }
    }

    public function passwordLogin(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string',
                'role' => 'required|string',
            ]);

            $user = User::where('username', $request->username)
                ->where('status', 1)
                ->first();

            if (!$user) {
                return response()->json(
                    [
                        'message' => 'Invalid credentials',
                    ],
                    401,
                );
            }

           
            $auth = $user->authMethods()->where('type', 'password')->where('is_active', true)->first();

            if (!$auth || !Hash::check($request->password, $auth->password)) {
                return response()->json(
                    [
                        'message' => 'Invalid credentials',
                    ],
                    401,
                );
            }

         
            if (!$user->hasRole($request->role)) {
                return response()->json(
                    [
                        'message' => 'You are not authorized for this role',
                    ],
                    403,
                );
            }
 
            $token = $user->createToken('auth_token')->plainTextToken;

        
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            return response()->json(
                [
                    'status' => true,
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => $user->load('roles:id,name'),
                ],
                200,
            );
        } catch (ValidationException $e) {
            return response()->json(
                [
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $e->errors(),
                ],
                422,
            );
        } catch (\Throwable $e) {
            Log::error('Password login failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(
                [
                    'status' => false,
                    'message' => 'Something went wrong. Please try again later.',
                ],
                500,
            );
        }
    }

    // SEND OTP
    public function sendOtp(Request $request)
    {
        try {
            // ✅ Validation
            $request->validate([
                'mobile' => 'required|digits:10',
            ]);

            // ✅ Generate OTP
            $otp = random_int(100000, 999999);

            // ✅ Store OTP
            Otp::create([
                'mobile' => $request->mobile,
                'otp' => $otp,
                'expires_at' => now()->addMinutes(5),
            ]);

            // ✅ Send OTP
            $sent = $this->smsService->sendOtp($request->mobile, $otp);

            if (!$sent) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'SMS sending failed',
                    ],
                    500,
                );
            }

            $maskedMobile = $this->maskMobile($request->mobile);

            return response()->json(
                [
                    'status' => true,
                    'message' => "OTP sent successfully to mobile number {$maskedMobile}",
                ],
                200,
            );
        } catch (ValidationException $e) {
            return response()->json(
                [
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $e->errors(),
                ],
                422,
            );
        } catch (\Throwable $e) {
            Log::error('Send OTP failed', [
                'mobile' => $request->mobile ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json(
                [
                    'status' => false,
                    'message' => 'Something went wrong. Please try again later.',
                ],
                500,
            );
        }
    }

    private function maskMobile(string $mobile): string
    {
        if (strlen($mobile) < 10) {
            return $mobile;
        }

        return substr($mobile, 0, 2) . 'XXXX' . substr($mobile, -4);
    }

    // VERIFY OTP
    public function verifyOtp(Request $request)
    {
        try {
            // ✅ Validation
            $request->validate([
                'mobile' => 'required|digits:10',
                'otp' => 'required|digits:6',
            ]);

            // ✅ OTP check
            $otp = Otp::where('mobile', $request->mobile)
                ->where('otp', $request->otp)
                ->where('is_used', false)
                ->where('expires_at', '>', now())
                ->latest()
                ->first();

            if (!$otp) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Invalid or expired OTP',
                    ],
                    401,
                );
            }

            // ✅ Mark OTP as used
            $otp->update(['is_used' => true]);

            // ✅ User check
            $user = User::where('mobile', $request->mobile)->first();

            if (!$user) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'User not found',
                    ],
                    404,
                );
            }

            // ✅ Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            // ✅ Update login details
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            return response()->json(
                [
                    'status' => true,
                    'message' => 'OTP verified successfully',
                    'token' => $token,
                    'user' => $user->load('roles'),
                ],
                200,
            );
        } catch (ValidationException $e) {
            return response()->json(
                [
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $e->errors(),
                ],
                422,
            );
        } catch (\Throwable $e) {
            Log::error('OTP verification failed', [
                'mobile' => $request->mobile ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json(
                [
                    'status' => false,
                    'message' => 'Something went wrong. Please try again later.',
                ],
                500,
            );
        }
    }

    // DSC LOGIN
    public function dscLogin(Request $request)
    {
        $request->validate([
            'dsc_serial_no' => 'required',
        ]);

        $auth = UserAuthMethod::where('type', 'dsc')
            ->where('dsc_serial_no', $request->dsc_serial_no)
            ->where('dsc_expiry', '>', now())
            ->where('is_active', true)
            ->first();

        if (!$auth) {
            return response()->json(['message' => 'Invalid DSC'], 401);
        }

        $user = $auth->user;

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);
        return response()->json([
            'token' => $token,
            'user' => $user->load('roles'),
        ]);
    }

    // USER PROFILE

    // LOGOUT
    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || !$user->currentAccessToken()) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Unauthenticated',
                    ],
                    401,
                );
            }

            // ✅ Delete current token only
            $user->currentAccessToken()->delete();

            return response()->json(
                [
                    'status' => true,
                    'message' => 'Logged out successfully',
                ],
                200,
            );
        } catch (\Throwable $e) {
            Log::error('Logout failed', [
                'user_id' => optional($request->user())->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json(
                [
                    'status' => false,
                    'message' => 'Something went wrong. Please try again later.',
                ],
                500,
            );
        }
    }
}
