<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP\Models;

use Illuminate\Database\Eloquent\Model;
use LuizFabianoNogueira\DataTableLaravelSSP\Traits\DataTableLaravelSSPTrait;


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
    use DataTableLaravelSSPTrait;
}
