<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP;

use Illuminate\Support\ServiceProvider;

class DataTableLaravelSSPServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/Routes/dtl.php');

        $this->publishes([
            __DIR__.'/Config/dtl.php' => config_path(),
        ], 'data-table-laravel-config');
    }
}
