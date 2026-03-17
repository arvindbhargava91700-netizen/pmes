<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Billing extends Model
{
    use SoftDeletes;
    protected $guarded = [];

    // Billing belongs to Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Billing Status
    public function status()
    {
        return $this->belongsTo(BillingStatusMaster::class,'billing_status_id');
    }

        public function milestone()
    {
        return $this->belongsTo(TenderMilestone::class,'milestone_id');
    }


    // Created By User
    // public function creator()
    // {
    //     return $this->belongsTo(User::class,'created_by');
    // }

    public static function generateBillingCode()
{
    $year = date('Y');

    $lastBilling = self::whereYear('created_at', $year)
        ->latest('id')
        ->first();
    $nextNumber = 1;
    if ($lastBilling && $lastBilling->bill_number) {
        $parts = explode('-', $lastBilling->bill_number);
        $lastNumber = (int) end($parts);
        $nextNumber = $lastNumber + 1;
    }
    $formattedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    return "BILL-{$year}-{$formattedNumber}";
}
}