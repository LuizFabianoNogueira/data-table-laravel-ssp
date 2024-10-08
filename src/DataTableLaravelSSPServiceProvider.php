<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class DataTableLaravelSSPServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::directive('dtl', static function ($expression) {
            return "<?php echo 'Executando a diretiva @algo com: ' . $expression; ?>";
        });

        $this->loadRoutesFrom(__DIR__ . '/Routes/dtl.php');
        $this->loadMigrationsFrom(__DIR__ . '/Migrations');

        $this->publishesMigrations([
            __DIR__.'/Migrations' => database_path('migrations'),
        ], 'data-table-laravel-migrations');

        $this->publishes([
            __DIR__.'/Config/dtl.php' => config_path(),
        ], 'data-table-laravel-config');

        $this->publishes([
            __DIR__.'/Config/dtl.php' => config_path(),
        ], 'data-table-laravel-js');


    }
}
