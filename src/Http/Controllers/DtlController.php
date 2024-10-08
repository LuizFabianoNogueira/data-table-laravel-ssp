<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use LuizFabianoNogueira\DataTableLaravelSSP\Models\Dtl;

class DtlController extends BaseController
{
    /**
     * List all data from a model
     *
     * @param Request $request
     * @return JsonResponse|null
     */
    public function list(Request $request): ?JsonResponse
    {
        if (!$request->has('dynamicModel')) {
            return response()->json([
                'error' => 'Model not found'
            ]);
        }

        $model = $request->dynamicModel;

        if (!class_exists($model)) {
            return response()->json([
                'error' => 'Class not found'
            ]);
        }

        try {

           $objModel = new $model();

            $columns = $request->input('columns');
            $order = $request->input('order');

            $query = $objModel::query();

            if (isset($columns) && is_array($columns)) {
                $query->select($columns);
            }
            if (isset($order) && is_array($order)) {
                $query->orderBy($order);
            }

            $data = $query->paginate(($request->input('per_page') > 0) ? $request->input('per_page') : 10);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
