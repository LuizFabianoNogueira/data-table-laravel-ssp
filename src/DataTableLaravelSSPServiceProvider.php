<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP;

use Illuminate\Support\ServiceProvider;

class DataTableLaravelSSPServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/Routes/dtl.php');
        $this->loadMigrationsFrom(__DIR__ . '/Migrations');

        $this->publishesMigrations([
            __DIR__.'/Migrations' => database_path('migrations'),
        ], 'zap-sign-migrations');

        $this->publishes([
            __DIR__.'/Config/dtl.php' => config_path(),
        ], 'zap-sign-config');
    }
}
