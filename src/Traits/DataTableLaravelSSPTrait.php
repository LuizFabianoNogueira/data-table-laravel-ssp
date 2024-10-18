<?php

namespace LuizFabianoNogueira\DataTableLaravelSSP\Traits;

trait DataTableLaravelSSPTrait
{
    public function scopeDtlFilters($query)
    {
        return $query;
    }

    public function scopeDtlOrder($query)
    {
        $request = request();
        $sort = $request->sort??null;
        if (!empty($sort)) {
            return $query->orderBy($sort, $request->direction ??'ASC');
        }
        return $query;
    }

    public function scopeDtlSearch($query)
    {
        if(isset($this->dtl_search_fields) && is_array($this->dtl_search_fields)) {
            $request = request();
            $search = $request->search??null;
            $dtl_search_fields = $this->dtl_search_fields;
            if (!empty($search)) {
                $query->where(function ($query) use ($search, $dtl_search_fields) {
                    foreach ($dtl_search_fields as $field) {
                        $query->orWhere($field, 'like', '%'.$search.'%');
                    }
                });
            }
        }
        return $query;
    }
}
