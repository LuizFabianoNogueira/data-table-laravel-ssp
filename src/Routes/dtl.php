<?php

use Illuminate\Support\Facades\Route;
use LuizFabianoNogueira\DataTableLaravelSSP\Http\Controllers\DtlController;

Route::controller(DtlController::class)->prefix('dtl')->group(function () {
    Route::get('list', 'list')->name('dtl.dynamic.list');
});
