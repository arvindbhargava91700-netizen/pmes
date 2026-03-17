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
}