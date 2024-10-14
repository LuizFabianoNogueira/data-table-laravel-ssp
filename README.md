<p align="center"><img src="src/Assets/img/laravel.png" alt="Laravel Logo"></p>


# Data Table Laravel - SSP (Server side process)

[![Latest Stable Version](https://poser.pugx.org/luizfabianonogueira/data-table-laravel-ssp/v)](//packagist.org/packages/luizfabianonogueira/data-table-laravel-ssp)
[![Total Downloads](https://poser.pugx.org/luizfabianonogueira/data-table-laravel-ssp/downloads)](//packagist.org/packages/luizfabianonogueira/data-table-laravel-ssp)
[![Latest Unstable Version](https://poser.pugx.org/luizfabianonogueira/data-table-laravel-ssp/v/unstable)](//packagist.org/packages/luizfabianonogueira/data-table-laravel-ssp)
[![License](https://poser.pugx.org/luizfabianonogueira/data-table-laravel-ssp/license)](//packagist.org/packages/luizfabianonogueira/data-table-laravel-ssp)

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=IN%20DEVELOPMENT&color=GREEN&style=for-the-badge)

## Installation

You can install the package via composer:

```bash
composer require luizfabianonogueira/data-table-laravel-ssp
```

## Configuration

You can publish the config file with:
```bash
php artisan vendor:publish --tag="data-table-laravel-ssp-js"
```

In bootstrp/app.php add the following line:
```php
use LuizFabianoNogueira\DataTableLaravelSSP\DataTableLaravelSSPServiceProvider;

return [
    ...
    DataTableLaravelSSPServiceProvider::class,
    ...
];
```

## Usage

In yuor blade file add the following code:

```html
<script src="{{ asset('assets/js/dtl.js') }}"></script>
```

for the dataTable to be loaded you need the following structure

```html
<table id="this-is-my-table"></table>
```

Existem duas formas de carregar seus dadosna tabela:
 - 1 Dynamic: nesse caso vamos apenas indicar qual é a model a ser utilizada. \
Nesse formato o sistema vai fazer uma abstração de sua model e utilizar uma controller propria para gerar o resultado.

```javascript
$(document).ready(function() {
    let columns = [{... ...}];
    $('#this-is-my-table').loadDataTableLaravel({
        request: {
            dynamicModel: 'App\\Models\\User'
        },
        columns:columns
    });
});
```

 - 2 Static: Nesse formato vamos indicar a rota que será utilizada para carregar os dados. \
```javascript
$(document).ready(function() {
    let columns = [{... ...}];
    $('#this-is-my-table').loadDataTableLaravel({
        request: {
            url: ' {{ route('users.index') }} '
        },
        columns:columns
    });
});
```

Mas para que isso seja possivel é necessário que a rota esteja configurada para retornar os dados no formato correto. \
Veja um exemplo abaixo:
Em sua controller adicione o seguinte código:
```php

public function listaDadosParaDataTable(Request $request): JsonResponse
    {
        $list = Model::filters()
            ->search()
            ->paginate(($request->paginate ?? 10));
        return response()->json($list);
    }
```
Observe que utilizamos filters() search() que são scopes que devem ser criados em sua model para que seja possivel a filtragem dos dados. \
Caso não queira utilizar esses scopes basta remover do código.

Veja exemplos de scopes:

Em sua model adicione o seguinte código:
```php
    public function scopeFilters($eloquent)
    {
        $request = Request::toArray();
        if (!empty($request['id'])) {
            if (is_array($request['id'])) {
                $eloquent->whereIn('id', $request['id']);
            } else {
                $eloquent->where('id', $request['id']);
            }
        }

        if (!empty($request['name'])) {
            $eloquent->where('additional.name', 'ilike', '%' . $request['name'] . '%');
        }

        if (!empty($request['description'])) {
            $eloquent->where('additional.description', 'ilike', '%' . $request['description'] . '%');
        }

        return $eloquent;
    }

    public function scopeSearch($eloquent)
    {
        $request = Request::toArray();
        if (isset($request['search']) && !empty($request['search'])){
            $eloquent->where(function ($query) use ($request) {
                $query->where('yourTable.collumn1', 'ILIKE', '%' . $request['search'] . '%')
                    ->orWhere('yourTable.collumn2', 'ILIKE', '%' . $request['search'] . '%')
                    ->orWhere('yourTable.collumn3', 'ILIKE', '%' . $request['search'] . '%')
                    ->orWhere('yourTable.collumn4', 'ILIKE', '%' . $request['search'] . '%');
            });
        }
        return $eloquent;
    }
```

Em yourTable.collumn1 você deve substituir pelo nome da tabela e coluna que deseja fazer a busca.
Fique a vontade para adicionar quantos campos desejar e alterar conforme sua necessidade.
Esses metodos são apenas exemplos de como você pode fazer a busca e filtragem dos dados e podem ser utilizados por qualquer consulta em seu sistema

Agora vamos conhecer as configurações possiveis para a tabela:
A configuração é feita através de um json que deve ser passado para o plugin.

```javascript
let config = {... ...};
$('#this-is-my-table').loadDataTableLaravel(config);
```
### Campos de configuração

- **request: {... ...}**: Objeto que contem as informações necessárias para a requisição dos dados.
    - - **request - url**: string - Url da rota que será utilizada para carregar os dados.
    - - **request - method**: string - Método que será utilizado para carregar os dados. (default: GET) \
```javascript
let config = {... 
    request:{
        url: ' {{ route('users.index') }} ',
        method: 'GET',
        ...
    },
    ...
...};
```
- - **request - dynamicModel**: string - Nome da model que será utilizada para carregar os dados.
Caso utilize o dynamicModel não é necessário passar a url e method.
```javascript
let config = {... 
    request:{
        dynamicModel: 'App\\Models\\User',
        ...
    },
    ...
...};
```
- - **request - headers**: object - Cabeçalhos que serão enviados na requisição. (default: {})
 ```javascript
    let config = {...
        request:{
            headers: {
                "Authorization": "Bearer token",
                "Content-Type": "application/json",
                ...    
            },
            ...
        },
        ...
...};
```
- - **request - params**: object - Parametros que serão enviados na requisição. (default: {})
```javascript
let config = {...
    request:{
        params: {
            "param1": "value1",
            "param2": "value2",
            ...    
        },
        ...
    },
    ...
...};
```

- **columns**: array - Array de objetos que contem as informações das colunas da tabela.
```javascript
let config = {...
    columns: [{... ...}]
...};
```   


### License: LGPL-3.0-or-later

___
___

## Contact & Support

[![LinkedIn](https://img.shields.io/badge/LinkedIn-000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luiz-fabiano-nogueira-b20875170/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-000?style=for-the-badge&logo=whatsapp&logoColor=white)](https://api.whatsapp.com/send?phone=5548991779088)
[![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuizFabianoNogueira)
[![Packagist](https://img.shields.io/badge/Packagist-000?style=for-the-badge&logo=packagist&logoColor=white)](https://packagist.org/packages/luizfabianonogueira/)

📞 **Phone:** [+5548991779088](tel:+5548991779088)  
✉️ **Email:** [luizfabianonogueira@gmail.com](mailto:luizfabianonogueira@gmail.com)

---

### Support My Work

If you enjoyed this project and would like to support my work, any donation via Pix is greatly appreciated!  
Feel free to donate using one of the following Pix keys:

💳 **Email Pix Key:** `luizfabianonogueira@gmail.com`  
📱 **Phone Pix Key:** `48991779088`

Thank you for your support!
