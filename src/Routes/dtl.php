<?php

use Illuminate\Support\Facades\Route;
use LuizFabianoNogueira\DataTableLaravelSSP\Http\Controllers\DtlController;

Route::controller(DtlController::class)->prefix('dtl')->group(function () {
    Route::get('list', 'list')->name('dtl.dynamic.list');
});

Route::get('/data-table-laravel-ssp/js', static function () {
    $path = __DIR__ . '../../Assets/Js/dtl.js';
    return response()->file($path, ['Content-Type' => 'application/javascript']);
})->name('dtl.js');

Route::get('/data-table-laravel-ssp/css', static function () {
    $path = __DIR__ . '../../Assets/Css/dtl.css';
    return response()->file($path, ['Content-Type' => 'text/css']);
})->name('dtl.css');
