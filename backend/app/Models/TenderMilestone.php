<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class TenderMilestone extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function tender()
    {
        return $this->belongsTo(Tender::class);
    }

    public function dependencies()
    {
        return $this->hasMany(
            MilestoneDependencies::class,
            'milestone_id'
        );
    }
}
