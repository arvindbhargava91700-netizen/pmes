<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grievance extends Model
{
    protected $guarded = [];

        public function priority()
    {
        return $this->belongsTo(GrievancePrioritie::class,'priority_id');
    }
        public function status()
    {
        return $this->belongsTo(GrievanceStatusMaster::class,'grievance_status_id');
    }
    
}
