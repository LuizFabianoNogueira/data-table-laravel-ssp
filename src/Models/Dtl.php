<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class SseNotify
 *
 * This model represents a notification for Server-Sent Events (SSE).
 * It uses UUIDs for primary keys and has a one-to-one relationship with the User model.
 *
 * @package App\Models
 */
class Dtl extends Model
{
    public function scopeFilters($query)
    {
        return $query;
    }

    public function scopeOrder($query)
    {
        return $query;
    }

    public function scopeSearch($query)
    {
        return $query;
    }

}
