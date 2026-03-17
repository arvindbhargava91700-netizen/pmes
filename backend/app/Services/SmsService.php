<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
class SmsService
{
    protected string $url;
    protected string $key;
    protected string $secret;
    public function __construct()
    {
        $this->url = config('sms.url');
        $this->key = config('sms.key');
        $this->secret = config('sms.secret');
        if (!$this->url || !$this->key || !$this->secret) {
            throw new \Exception('SMS configuration is missing');
        }
    }
    public function sendOtp(string $mobileNo, int|string $otp): bool
    {
        $msg = "Your OTP is {$otp}. Valid for 5 minutes. Do not share.";

        try {
            $response = Http::withHeaders([
                    'Key'    => $this->key,
                    'Secret' => $this->secret,
                ])
                ->withOptions([
                    'verify' => false,
                    'curl' => [
                        CURLOPT_SSLVERSION => CURL_SSLVERSION_TLSv1_2,
                    ],
                ])
                ->send('POST', $this->url, [
                    'query' => [
                        'mobileno'     => $mobileNo,
                        'message_text' => $msg,
                    ],
                ]);
            Log::info('SMS API RESPONSE', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('SMS SEND FAILED', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}