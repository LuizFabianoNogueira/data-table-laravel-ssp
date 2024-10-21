if (typeof $ !== 'undefined') {
    console.log("jQuery is loaded!");
} else {
    let script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.async = true;
    document.head.appendChild(script);
    script.onload = function() {
        console.log('jQuery foi carregado com sucesso!');
    };
}

(function($) {

    let link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const dtlFont = "'Open Sans', sans-serif";

    $.fn.loadDataTableLaravel = function(config) {
        let configuration = {
            countItems : config.columns.length,
            url : (config.request.url ?? "/dtl/list"),
            method : (config.request.method ?? 'GET'),
            params : (config.request.params ?? null),
            columns : (config.columns ?? null),
            txtNoResult : (config.table.txtNoResult ?? 'Sem resultados'),
            alias : (config.table.alias ?? null),

            searchBox : (config.searchBox ?? ''),
            dataParamsDefault : {  search : "" },

            export : (config.export ?? false),
            exportTitle : (config.exportTitle ?? ''),

            afterEvent : (config.afterEvent ?? null),
            loadingData : (config.loadingData ?? 'data:image/gif;base64, '),
            dynamicModel : (config.request.dynamicModel ?? null),

            buttons:(config.buttons ?? null),
            texts:(config.texts ?? null),
        };
        let table = $(this);
        if (config.table.tableClass) {
            $(table).prop('class', config.table.tableClass);
        } else {
            $(table).prop('class', 'table-dtl table-striped-dtl table-hover-dtl');
        }

        if(configuration.searchBox) {
            if(configuration.searchBox.show) {

                let searchBoxRow = document.createElement('div');
                searchBoxRow.setAttribute('class', 'row p-1');
                searchBoxRow.setAttribute('id', 'search-box-row-'+configuration.alias);

                let searchBoxTdL = document.createElement('div');
                searchBoxTdL.setAttribute('id', 'search-box-tdl-'+configuration.alias);
                searchBoxTdL.setAttribute('class', 'col-6 p-1');


                let btnExportCSV = document.createElement('button');
                btnExportCSV.setAttribute('class', 'btn btn-outline-secondary btn-sm m-2 p-1');
                btnExportCSV.append($(this).iconCSV());

                let btnExportPDF = document.createElement('button');
                btnExportPDF.setAttribute('class', 'btn btn-outline-secondary btn-sm m-2 p-1');
                btnExportPDF.append($(this).iconPDF());

                let btnExportExcel = document.createElement('button');
                btnExportExcel.setAttribute('class', 'btn btn-outline-secondary btn-sm m-2 p-1');
                btnExportExcel.append($(this).iconXLS());

                if(configuration.buttons.buttonShowColumns.show === true) {
                    searchBoxTdL.append($(this).buttonShowColumns(configuration));
                }
                if(configuration.buttons.buttonCSV.show === true) {
                    searchBoxTdL.append(btnExportCSV);
                }
                if(configuration.buttons.buttonPDF.show === true) {
                    searchBoxTdL.append(btnExportPDF);
                }
                if(configuration.buttons.buttonXLS.show === true) {
                    searchBoxTdL.append(btnExportExcel);
                }

                searchBoxRow.append(searchBoxTdL);

                let searchBoxTdR = document.createElement('div');
                searchBoxTdR.setAttribute('class', 'col-6 p-1');
                let divBoxSearch = document.createElement('div');
                divBoxSearch.setAttribute('id', 'search-box-tdr-'+configuration.alias);
                divBoxSearch.setAttribute('class', 'input-group');
                divBoxSearch.setAttribute('style', 'display: flex; justify-content: flex-end');
                searchBoxTdR.append(divBoxSearch);
                searchBoxRow.append(searchBoxTdR);

                $(table).before(searchBoxRow);

                if (!configuration.searchBox.searchInput.id) {

                    let searchBox = $('#search-box-tdr-' + configuration.alias);

                    let spanL = document.createElement('span');
                    spanL.setAttribute('class', 'input-group-text');

                    spanL.append($(this).iconLBoxSearch());

                    let buttonSearch = document.createElement('button');
                    buttonSearch.setAttribute('type', 'button');
                    buttonSearch.setAttribute('id', 'button-search-' + configuration.alias);
                    buttonSearch.setAttribute('style', 'border:none; background: none; box-shadow: none; outline: none; color: inherit; font: inherit; cursor: pointer;');
                    buttonSearch.setAttribute('class', '');
                    $(buttonSearch).append(configuration.texts.searchBox.buttonText?? 'Search');

                    $(buttonSearch).on('click', function (event) {
                        event.preventDefault();
                        $(this).addContent(table, configuration);
                    });

                    let spanR = document.createElement('span');
                    spanR.setAttribute('class', 'input-group-text');
                    spanR.style.fontFamily = dtlFont;
                    spanR.style.fontSize = '12px';
                    spanR.append(buttonSearch);

                    $(searchBox).html('');
                    let inputSearch = document.createElement('input');
                    inputSearch.setAttribute('type', 'text');
                    inputSearch.setAttribute('id', 'input-search-' + configuration.alias);
                    inputSearch.setAttribute('name', 'input-search-' + configuration.alias);
                    inputSearch.setAttribute('class', (configuration.searchBox.searchInput.class ?? 'form-control'));
                    inputSearch.setAttribute('style', (configuration.searchBox.searchInput.style ?? ''));
                    inputSearch.setAttribute('placeholder', (configuration.texts.searchBox.placeholder ?? 'Search'));
                    let timer = null;
                    inputSearch.addEventListener('input', function () {
                        let chars = $(this).val();
                        clearTimeout(timer);
                        if (chars.length >= (configuration.searchBox.autoSearchMinLength ?? 3)) {
                            timer = setTimeout(function () {
                                $(table).addContent(table, configuration)
                            }, (configuration.searchBox.autoSearchDelay ?? 1000));
                        }
                    });

                    if(configuration.searchBox.iconLeft.show === true) {
                        $(searchBox).append(spanL);
                    }
                    $(searchBox).append(inputSearch);
                    if(configuration.searchBox.buttonSearch.show === true) {
                        $(searchBox).append(spanR);
                    }

                    if (configuration.searchBox.autoSearchOnEnter !== false) {
                        $(inputSearch).on('keyup', function (event) {
                            event.preventDefault();
                            if (event.which === 13) {
                                $(this).addContent(table, configuration);
                            }
                        });
                    }

                } else {

                    if (configuration.searchBox.searchButton) {
                        $("#" + configuration.searchButton).unbind('click').on('click', function (event) {
                            event.preventDefault();
                            $(this).addContent(table, configuration);
                        });
                    }
                    if (configuration.searchBox.searchInput.id) {
                        let searchInput = $("#" + configuration.searchInput);
                        let timer = null;
                        $(searchInput).unbind('click').on('keyup', function (event) {
                            event.preventDefault();
                            if (event.which === 13) {
                                $(this).addContent(table, configuration);
                            }
                        });
                        $(searchInput).on('keyup', function (event) {
                            event.preventDefault();
                            if (event.which === 13) {
                                $(this).addContent(table, configuration);
                            } else {
                                let chars = $(this).val();
                                clearTimeout(timer);
                                if (chars.length >= 3) {
                                    timer = setTimeout(function () {
                                        $(table).addContent(table, configuration)
                                    }, 1000);
                                }
                            }
                        });
                    } else {}
                }
            }
        }

        $(this).addHeaders(this, configuration);
        $(this).addExport(this, configuration.countItems, configuration);
        $(this).addContent(this, configuration);
    }

    $.fn.addHeaders = function(table, configuration) {
        let COLUMNS = configuration.columns;
        $(table).children('thead').remove();
        let THEAD = document.createElement('thead');
        $(table).append(THEAD);
        let THEAD_TR = document.createElement('tr');
        COLUMNS.forEach(function(dataColumn) {
            if(dataColumn.hidden !== true) {
                let th = document.createElement('th');
                th.setAttribute('data-column', 'dtl-th-'+dataColumn.name);
                th.style.fontFamily = dtlFont;
                if (dataColumn.headerClass) {
                    th.setAttribute('class', dataColumn.headerClass);
                }

                if (dataColumn.columnTitle) {
                    let title = document.createElement('span');

                    title.style.cssText = 'color: #666666; font-size: 14px;';
                    $(title).html(dataColumn.columnTitle + ' ');
                    if (dataColumn.columnSort) {

                        let iconSort = $(this).iconSort();
                        let iconSortASC = $(this).iconSortASC();
                        let iconSortDESC = $(this).iconSortDESC();

                        $(title).append(iconSort);
                        $(title).append(iconSortASC);
                        $(title).append(iconSortDESC);

                        let btnSort = document.createElement('a');
                        btnSort.setAttribute('class', 'dataTableTitleSort');
                        btnSort.style.cssText = 'cursor: pointer;';
                        btnSort.title = 'Ordenar';
                        btnSort.style.textDecoration = 'none';
                        btnSort.style.color = '#666666';

                        btnSort.onclick = function () {
                            $(".fa-sort").each(function (index, element) {
                                $(element).show('fast');
                            });
                            $(iconSort).hide('fast');
                            $(".fa-arrow-up").each(function (index, element) {
                                $(element).hide('fast');
                            });
                            $(".fa-arrow-down").each(function (index, element) {
                                $(element).hide('fast');
                            });
                            let sortDirection = sessionStorage.getItem('sort.' + dataColumn.name);
                            if (!sortDirection) {
                                sortDirection = 'ASC';
                                sessionStorage.setItem('sort.' + dataColumn.name, 'ASC');
                                $(iconSortASC).show('fast');
                            } else if (sortDirection === 'ASC') {
                                sessionStorage.setItem('sort.' + dataColumn.name, 'DESC');
                                $(iconSortDESC).show('fast');
                            } else if (sortDirection === 'DESC') {
                                sessionStorage.setItem('sort.' + dataColumn.name, 'ASC');
                                $(iconSortASC).show('fast');
                            }
                            sessionStorage.setItem('dataTableSortColumn', dataColumn.columnSort);
                            sessionStorage.setItem('dataTableSortDirection', sortDirection);
                            $(this).addContent(table, configuration, null, null, dataColumn.columnSort, sortDirection);
                        };
                        $(btnSort).append(title);
                        $(th).append(btnSort);
                    } else {
                        $(th).append(title);
                    }
                }
                $(THEAD_TR).append(th);
            }
        });
        $(table).children('thead').append(THEAD_TR);
    };

    $.fn.addExport = function (table, countItems, configuration) {
        let exist = $("#data-table-export-line-" + $(table).attr('id'));
        if (exist.length > 0) {
            exist.remove();
        }
        let lineExportTR = document.createElement('tr');
        lineExportTR.id = 'data-table-export-line-' + $(table).attr('id');
        let lineExportTD = document.createElement('td');
        lineExportTD.colSpan = countItems;
        lineExportTD.style.cssText = 'text-align: right;';
        if (configuration.export) {
            let IconExportPDF = document.createElement('i');
            IconExportPDF.style.cssText = 'cursor: pointer; font-size: 24px;';
            IconExportPDF.setAttribute('class', "fa fa-file-pdf-o p-3");
            IconExportPDF.title = 'Exportar-PDF';
            IconExportPDF.onclick = function () {
                $(this).export(configuration, 'PDF');
            };
            lineExportTD.append(IconExportPDF);
            let IconExportExcel = document.createElement('i');
            IconExportExcel.style.cssText = 'cursor: pointer; font-size: 24px;';
            IconExportExcel.setAttribute('class', "fa fa-file-excel-o p-3");
            IconExportExcel.title = 'Exportar-Excel';
            IconExportExcel.onclick = function () {
                $(this).export(configuration, 'EXCEL');
            };
            lineExportTD.append(IconExportExcel);
        }
        lineExportTR.append(lineExportTD);
        $(table).children('thead').prepend(lineExportTR);
    };

    $.fn.addLoading = function(table, countItems, configuration) {
        $(table).children('tbody').fadeOut().remove();
        $(table).children('tfoot').fadeOut().remove();
        let TBODY = '<tbody id="tbodyDataTable-'+ $(table).attr('id') +'"><tr><td colspan="'+countItems+'" style="text-align: center;"> <img width="100px;" src="'+configuration.loadingData+'" /> </td></tr></tbody>';
        $(table).append(TBODY);
    };

    $.fn.addContent = function(table, configuration, urlPaginate = null, goToPage = null, sortColumn = null, sortColumnDirection = null) {
        $(this).addLoading(table, configuration.countItems, configuration);
        let TFOOT = document.createElement('tfoot');

        if (configuration.searchBox.searchInput.id){
            configuration.dataParamsDefault.search = $("#"+configuration.searchBox.searchInput.id).val();
        } else {
            configuration.dataParamsDefault.search = $("#input-search-"+configuration.alias).val();
        }

        let dataParams = Object.assign(configuration.dataParamsDefault, configuration.params)

        if(configuration.dynamicModel) {
            dataParams = Object.assign(dataParams, {dynamicModel: configuration.dynamicModel});
        }

        let beforeSend = function (request) {
            request.setRequestHeader("Authorization", 'bearer '+configuration.token);
            request.setRequestHeader("Content-Type", 'application/json');
        };

        if(configuration.basicAuth) {
            beforeSend = function (request) {
                request.setRequestHeader("Authorization", "Basic " + btoa( configuration.basicAuthCredentials.usr + ":" + configuration.basicAuthCredentials.pwd));
                request.setRequestHeader("Content-Type", 'application/json');
            };
        }

        if (sortColumn) {
            dataParams = Object.assign(dataParams, {sort: sortColumn});
            dataParams = Object.assign(dataParams, {direction: (sortColumnDirection ?? 'ASC')});
        }

        let url = (urlPaginate ? urlPaginate : (goToPage ? configuration.url+"?page="+goToPage : configuration.url+'?') )

        $.ajax({
            url: url,
            method:configuration.method,
            'beforeSend': beforeSend,
            data: dataParams
        }).done(function(request) {
            if(request.error){
                alert(request.error);
            } else {
                let data = request.data;
                request.countItems = data.length;
                if (data && data.length > 0) {
                    $("#tbodyDataTable-" + $(table).attr('id')).children('tr').remove();
                    data.forEach(function (obj) {
                        $(this).addLine($(table).attr('id'), obj, configuration.columns);
                    });
                    TFOOT.append($(this).addPaginate(table, request, configuration));
                    TFOOT.append($(this).addPaginateInfo(table, request, configuration));
                } else {
                    $(this).addNoResults($(table).attr('id'), configuration.txtNoResult, configuration.countItems);
                    TFOOT.append($(this).addPaginate(table, request, configuration));
                    TFOOT.append($(this).addPaginateInfo(table, request, configuration));
                }
            }
        }).fail(function (xhr, ajaxOptions, thrownError){
            $(this).addError(xhr.status+":"+thrownError, configuration.countItems);
        });
        $(table).append(TFOOT);

        if (configuration.afterEvent) {
            eval(configuration.afterEvent + "(dataParams);");
        }

    };

    $.fn.addLine = function(id, objs, COLUMNS) {
        let tr = document.createElement('tr');
        COLUMNS.forEach(function(dataColumn) {
            if(dataColumn.hidden !== true) {
                let td = document.createElement('td');
                td.setAttribute('data-column', 'dtl-td-'+dataColumn.name);
                td.style.fontFamily = dtlFont;
                if (dataColumn.class) {
                    td.setAttribute('class', dataColumn.class);
                }
                if (dataColumn.style) {
                    td.setAttribute('style', dataColumn.style);
                }
                if (!dataColumn.class && !dataColumn.style) {
                    td.style.cssText = "font-size: 12px; color: #999999;";
                }
                let data = objs[dataColumn.data];
                if (dataColumn.render) {
                    let r = dataColumn.render(data, objs);
                    td.append(document.createRange().createContextualFragment(r));
                } else {
                    td.append(data);
                }
                tr.append(td);
            }
        });
        $("#tbodyDataTable-"+id).append(tr);
    };

    $.fn.addNoResults = function(id, txtNoResult, countItems) {
        $("#tbodyDataTable-"+id).fadeOut('fast', function(){
            let TBODYNoResult = '<tr><td colspan="'+countItems+'" style="text-align: center;"><div style="background-color: #FFF; border:solid 2px #b8daff; color: #333;" class="alert alert-info" role="alert">'+txtNoResult+'</div></td></tr>';
            $("#tbodyDataTable-"+id).html(TBODYNoResult);
            $("#tbodyDataTable-"+id).fadeIn();
        });
    };

    $.fn.addError = function(txt, countItems) {
        $("#tbodyDataTable").fadeOut('fast', function() {
            let TBODYNoResult = '<tr><td colspan="' + countItems + '" style="text-align: center;"><div style="background-color: #FFF; border:solid 2px #94456c; color: #94456c;" class="alert alert-info" role="alert">' + txt + '</div></td></tr>';
            $("#tbodyDataTable").html(TBODYNoResult);
            $("#tbodyDataTable").fadeIn();
        });
    };

    $.fn.addPaginate = function(table, request, configuration) {

        let pagesByResults = Math.ceil(request.total / request.per_page);
        let pageNumber = request.per_page > 0 ? pagesByResults : 1;

        let dataPaginate = {
            countItems : (request.countItems ?? 0),
            current_page : (request.current_page ?? 0),
            first_page_url : (request.first_page_url ?? null),
            prev_page_url : (request.prev_page_url ?? null),
            last_page : (request.last_page ?? null),
            last_page_url : (request.last_page_url ?? null),
            next_page_url : (request.next_page_url ?? null),
            path : (request.path ?? null),
            per_page : (request.per_page ?? 0),
            from : (request.from ?? 0),
            to : (request.to ?? 0),
            total : (request.total ?? 0),
            pages : (request.total > 0 ? pageNumber : 1)
        };

        let tr = document.createElement('tr');

        let th = document.createElement('th');
        th.colSpan = parseInt(configuration.countItems);
        th.style.cssText = 'color:#333; font-size:12px; align-items: center; text-align: center;';

        let nav = document.createElement('nav');
        let ul = document.createElement('ul');
        ul.setAttribute('class', 'pagination justify-content-center');

        //BTN First
        let btnFirstLi = document.createElement('li');
        btnFirstLi.setAttribute('class', 'page-item '+(dataPaginate.first_page_url ? (dataPaginate.current_page === 1 ? 'disabled' : '') : 'disabled'));
        let btnFirstA = document.createElement('a');
        btnFirstA.onclick = function() {
            $(this).addContent(table, configuration, dataPaginate.first_page_url);
        };
        btnFirstA.setAttribute('class', "page-link");
        btnFirstA.append(configuration.texts.pagination.first??'Primeiro');
        btnFirstLi.append(btnFirstA);
        ul.append(btnFirstLi);

        //BTN Previous
        let btnPreviousLi = document.createElement('li');
        btnPreviousLi.setAttribute('class', 'page-item '+(dataPaginate.prev_page_url ? '' : 'disabled'));
        let btnPreviousA = document.createElement('a');
        btnPreviousA.onclick = function() {
            $(this).addContent(table, configuration, dataPaginate.prev_page_url);
        };
        btnPreviousA.setAttribute('class', "page-link");
        btnPreviousA.append(configuration.texts.pagination.prev??'Anterior');
        btnPreviousLi.append(btnPreviousA);
        ul.append(btnPreviousLi);

        let minimal_number = dataPaginate.current_page <= 4 ? 1 : (dataPaginate.current_page-3)
        let number = (dataPaginate.current_page > 0 ? minimal_number : 1);

        for (let i = 0; i < 7; i++) {
            //BTN numbers
            let btnNumberLi = document.createElement('li');
            let disable = (number < dataPaginate.current_page ? (number > dataPaginate.pages ? ' disabled ' : ''): (number <= dataPaginate.pages ? '':' disabled '));
            // o código acima não proderia ser substituido por (!number === dataPaginate.current_page)?
            let active = (number === dataPaginate.current_page ? ' active ':'');
            btnNumberLi.setAttribute('class', 'page-item '+disable+active);

            let btnNumberA = document.createElement('a');
            btnNumberA.setAttribute('class', "page-link");
            btnNumberA.setAttribute('page', number.toString());

            btnNumberA.onclick = function(obj) {
                $(this).addContent(table, configuration, null, obj.target.getAttribute('page'));
            };
            btnNumberA.append(number);
            btnNumberLi.append(btnNumberA);
            ul.append(btnNumberLi);
            number++;
        }

        //BTN Next
        let btnNextLi = document.createElement('li');
        btnNextLi.setAttribute('class', 'page-item '+(dataPaginate.next_page_url ? '':'disabled'));
        let btnNextA = document.createElement('a');
        btnNextA.onclick = function() {
            $(this).addContent(table, configuration, dataPaginate.next_page_url);
        };
        btnNextA.setAttribute('class', "page-link");
        btnNextA.append(configuration.texts.pagination.next??'Próxima');
        btnNextLi.append(btnNextA);
        ul.append(btnNextLi);

        //BTN last
        let btnLastLi = document.createElement('li');
        btnLastLi.setAttribute('class', 'page-item '+(dataPaginate.last_page_url ? (dataPaginate.last_page === dataPaginate.current_page ? ' disabled' : '' ):' disabled'));
        let btnLastA = document.createElement('a');
        btnLastA.onclick = function() {
            $(this).addContent(table, configuration, dataPaginate.last_page_url)
        };
        btnLastA.setAttribute('class', "page-link");
        btnLastA.append(configuration.texts.pagination.last??'Última');
        btnLastLi.append(btnLastA);
        ul.append(btnLastLi);

        th.append(ul);
        tr.append(th);

        return tr;
    };

    $.fn.addPaginateInfo = function(table, request, configuration) {

        let pagesByResults = Math.ceil(request.total / request.per_page);
        let pageNumber = request.per_page > 0 ? pagesByResults : 1;

        let dataPaginate = {
            countItems : (request.countItems ?? 0),
            current_page : (request.current_page ?? 0),
            first_page_url : (request.first_page_url ?? null),
            prev_page_url : (request.prev_page_url ?? null),
            last_page : (request.last_page ?? null),
            last_page_url : (request.last_page_url ?? null),
            next_page_url : (request.next_page_url ?? null),
            path : (request.path ?? null),
            per_page : (request.per_page ?? 0),
            from : (request.from ?? 0),
            to : (request.to ?? 0),
            total : (request.total ?? 0),
            pages : (request.total > 0 ? pageNumber : 1)
        };

        let tr = document.createElement('tr');

        let th = document.createElement('th');
        th.colSpan = parseInt(configuration.countItems);
        th.style.cssText = 'color:#999; font-size:10px; border:none;';

        let content = (configuration.texts.pagination.showing??"showing")+" "
            +dataPaginate.countItems+ " "+(configuration.texts.pagination.records??"records")+" ("+
            dataPaginate.from+" "+(configuration.texts.pagination.to??"to")+" "+dataPaginate.to+") "+(configuration.texts.pagination.outOf??"out of")+" "+dataPaginate.total
        th.append(content);
        tr.append(th);

        return tr;
    };

    $.fn.export = function(configuration, exportType) {
        let form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
        form.action = '/export';
        form.style.display = "none";

        let input = document.createElement("input");
        input.type = "hidden";
        input.name = 'search';
        input.value = configuration.dataParamsDefault.search
        form.appendChild(input);

        let input0 = document.createElement("input");
        input0.type = "hidden";
        input0.name = 'exportType';
        input0.value = exportType
        form.appendChild(input0);

        let input1 = document.createElement("input");
        input1.type = "hidden";
        input1.name = 'exportTitle';
        input1.value = configuration.exportTitle
        form.appendChild(input1);

        let input2 = document.createElement("input");
        input2.type = "hidden";
        input2.name = 'url';
        input2.value = configuration.url
        form.appendChild(input2);

        let input3 = document.createElement("input");
        input3.type = "hidden";
        input3.name = 'method';
        input3.value = configuration.method
        form.appendChild(input3);

        let input4 = document.createElement("input");
        input4.type = "hidden";
        input4.name = 'token';
        input4.value = configuration.token
        form.appendChild(input4);

        let input5 = document.createElement("input");
        input5.type = "hidden";
        input5.name = 'columns';
        let columns = '{"columns":[';
        configuration.columns.forEach(function(item){
            if (item.export) {
                let v = '';
                if(columns !== '{"columns":[') {
                    v += ',';
                }
                columns += v;
                columns += '{"name":"'+(item.name ?? '')+'"';
                columns += ',"title":"'+(item.exportTitle ?? '')+'"';
                columns += ',"type":"'+(item.exportType ?? '')+'"';
                columns += ',"dataExport":"'+(item.dataExport ?? '')+'"';
                columns += ',"footerSum":"'+(item.exportFooterSum ?? false)+'"}';
            }
        });
        columns += ']}';
        input5.value = columns;
        form.appendChild(input5);

        let input6 = document.createElement("input");
        input6.type = "hidden";
        input6.name = 'parameters';
        let parameters = [];
        for (let key in configuration.params) {
            if (!configuration.params.hasOwnProperty(key)) continue;
            parameters.push(key + "|" + configuration.params[key]);
        }
        input6.value = parameters;
        form.appendChild(input6);

        let dataTableSortColumn = sessionStorage.getItem('dataTableSortColumn');
        let dataTableSortDirection = sessionStorage.getItem('dataTableSortDirection');

        let input7 = document.createElement("input");
        input7.type = "hidden";
        input7.name = 'sort';
        input7.value = dataTableSortColumn
        form.appendChild(input7);

        let input8 = document.createElement("input");
        input8.type = "hidden";
        input8.name = 'direction';
        input8.value = dataTableSortDirection
        form.appendChild(input8);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    $.fn.buttonShowColumns = function(configuration){
        let COLUMNS = configuration.columns;
        let btnCools = document.createElement('button');
        btnCools.setAttribute('class', 'btn btn-outline-secondary btn-sm ml-3 p-1');
        btnCools.append($(this).iconShowColumns());

        let divDropdownColumns = document.createElement('div');
        divDropdownColumns.setAttribute('id', 'divDropdownColumns');
        divDropdownColumns.setAttribute('class', 'dropdown-menu p-2');
        divDropdownColumns.setAttribute('title', configuration.texts.buttonShowColumns.hoverText??'Hide Columns');
        divDropdownColumns.style.display = 'none';
        let title = document.createElement('h6');
        title.setAttribute('class', 'dropdown-header');
        title.append(configuration.texts.buttonShowColumns.title??'Hide Columns');
        divDropdownColumns.append(title);
        COLUMNS.forEach(function(dataColumn) {
            if(dataColumn.hidden !== true) {
                if (dataColumn.columnTitle) {
                    let line = document.createElement('div');
                    line.setAttribute('class', 'form-check');
                    let label = document.createElement('label');
                    label.setAttribute('for', 'check-'+dataColumn.name);
                    label.setAttribute('class', 'form-check-label');
                    label.style.cssText = 'font-size: 12px; color: #666666; cursor: pointer;';
                    let input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = true;
                    input.setAttribute('class', 'form-check-input');
                    input.setAttribute('id', 'check-'+dataColumn.name);
                    input.style.cssText = 'cursor: pointer;';
                    input.onclick = function() {
                        let header = $('[data-column="dtl-th-' + dataColumn.name + '"]');
                        let column = $('[data-column="dtl-td-' + dataColumn.name + '"]');
                        if($(this).is(':checked')) {
                            $(header).show();
                            $(column).show();
                        } else {
                            $(header).hide();
                            $(column).hide();
                        }
                    };
                    label.append(document.createTextNode(dataColumn.columnTitle));
                    line.append(input)
                    line.appendChild(label)
                    divDropdownColumns.append(line);
                }
            }
        });

        btnCools.appendChild(divDropdownColumns);

        btnCools.addEventListener('mouseover', () => {
            divDropdownColumns.style.display = 'block';
        });

        btnCools.addEventListener('mouseout', () => {
            divDropdownColumns.style.display = 'none';
        });

        btnCools.addEventListener('mouseleave', () => {
            divDropdownColumns.style.display = 'none';
        });

        return btnCools;
    };

    //--------------------------------- ICONS buttons---------------------------------
    let iconSizeWidth = 24;
    let iconSizeHeight = 24;

    $.fn.iconShowColumns = function(){
        const svgNS = "http://www.w3.org/2000/svg";  // Namespace SVG
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("height", "24px");
        svg.setAttribute("width", "24px");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("id", "Layer_1");
        svg.setAttribute("viewBox", "0 0 512 512");
        svg.setAttribute("xmlns", svgNS);
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute("xml:space", "preserve");

        const g = document.createElementNS(svgNS, "g");

        const path1 = document.createElementNS(svgNS, "path");
        path1.setAttribute("style", "fill:#999999;");
        path1.setAttribute("d", "M64,0H24v16h40V0z M16,16H0v40h16V16z M16,96H0v40h16V96z M16,176H0v40h16V176z M16,256H0v40h16V256z M16,336H0v40h16V336z M16,416H0v40h16V416z M16,496H0v16h24v-16H16z M104,496H64v16h40V496z M144,472h-16v40h16V472z M144,392h-16v40h16V392z M144,312h-16v40h16V312z M144,232h-16v40h16V232z M144,152h-16v40h16V152z M144,72h-16v40h16V72z M144,0h-40v16h24v16h16V0z");

        const path2 = document.createElementNS(svgNS, "path");
        path2.setAttribute("style", "fill:#999999;");
        path2.setAttribute("d", "M432,0h-40v16h40V0z M384,16h-16v40h16V16z M384,96h-16v40h16V96z M384,176h-16v40h16V176z M384,256h-16v40h16V256z M384,336h-16v40h16V336z M384,416h-16v40h16V416z M384,496h-16v16h24v-16H384z M472,496h-40v16h40V496z M512,472h-16v40h16V472z M512,392h-16v40h16V392z M512,312h-16v40h16V312z M512,232h-16v40h16V232z M512,152h-16v40h16V152z M512,72h-16v40h16V72z M512,0h-40v16h24v16h16V0z");

        g.appendChild(path1);
        g.appendChild(path2);
        svg.appendChild(g);

        const path3 = document.createElementNS(svgNS, "path");
        path3.setAttribute("style", "fill:#FA8072;");
        path3.setAttribute("d", "M312,16v480H200V16H312 M328,0H184v512h144V0z");

        svg.appendChild(path3);
        return svg;
    };

    $.fn.iconCSV = function(){

        const svgNS = "http://www.w3.org/2000/svg";

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", iconSizeWidth+"px");
        svg.setAttribute("height", iconSizeHeight+"px");
        svg.setAttribute("viewBox", "0 0 400 400");

        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("id", "xxx-word");

        function createPath(d) {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("fill", "#999999");
            path.setAttribute("d", d);
            return path;
        }

        g.appendChild(createPath("M325,105H250a5,5,0,0,1-5-5V25a5,5,0,1,1,10,0V95h70a5,5,0,0,1,0,10Z"));
        g.appendChild(createPath("M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"));
        g.appendChild(createPath("M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"));
        g.appendChild(createPath("M275,280H125a5,5,0,1,1,0-10H275a5,5,0,0,1,0,10Z"));
        g.appendChild(createPath("M200,330H125a5,5,0,1,1,0-10h75a5,5,0,0,1,0,10Z"));
        g.appendChild(createPath("M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"));
        g.appendChild(createPath("M168.48,217.48l8.91,1a20.84,20.84,0,0,1-6.19,13.18q-5.33,5.18-14,5.18-7.31,0-11.86-3.67a23.43,23.43,0,0,1-7-10,37.74,37.74,0,0,1-2.46-13.87q0-12.19,5.78-19.82t15.9-7.64a18.69,18.69,0,0,1,13.2,4.88q5.27,4.88,6.64,14l-8.91.94q-2.46-12.07-10.86-12.07-5.39,0-8.38,5t-3,14.55q0,9.69,3.2,14.63t8.48,4.94a9.3,9.3,0,0,0,7.19-3.32A13.25,13.25,0,0,0,168.48,217.48Z"));
        g.appendChild(createPath("M179.41,223.15l9.34-2q1.68,7.93,12.89,7.93,5.12,0,7.87-2a6.07,6.07,0,0,0,2.75-5,7.09,7.09,0,0,0-1.25-4q-1.25-1.85-5.35-2.91l-10.2-2.66a25.1,25.1,0,0,1-7.73-3.11,12.15,12.15,0,0,1-4-4.9,15.54,15.54,0,0,1-1.5-6.76,14,14,0,0,1,5.31-11.46q5.31-4.32,13.59-4.32a24.86,24.86,0,0,1,12.29,3,13.56,13.56,0,0,1,6.89,8.52l-9.14,2.27q-2.11-6.05-9.84-6.05-4.49,0-6.86,1.88a5.83,5.83,0,0,0-2.36,4.77q0,4.57,7.42,6.41l9.06,2.27q8.24,2.07,11.05,6.11a15.29,15.29,0,0,1,2.81,8.93,14.7,14.7,0,0,1-5.92,12.36q-5.92,4.51-15.33,4.51a28,28,0,0,1-13.89-3.32A16.29,16.29,0,0,1,179.41,223.15Z"));
        g.appendChild(createPath("M250.31,236h-9.77L224.1,182.68h10.16l12.23,40.86L259,182.68h8Z"));

        svg.appendChild(g);

        return svg;
    };

    $.fn.iconPDF = function(){
        const svgNS = "http://www.w3.org/2000/svg"; // Namespace para SVG

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", iconSizeWidth+"px");
        svg.setAttribute("height", iconSizeHeight+"px");
        svg.setAttribute("viewBox", "0 0 400 400");
        svg.setAttribute("fill", "#000000");

        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("id", "SVGRepo_iconCarrier");

        const innerG = document.createElementNS(svgNS, "g");
        innerG.setAttribute("id", "xxx-word");

        const pathsData = [
            "M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z",
            "M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z",
            "M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z",
            "M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z",
            "M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z",
            "M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z",
            "M145,236h-9.61V182.68h21.84q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H145Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H145Z",
            "M183,236V182.68H202.7q10.9,0,17.5,7.71t6.6,19q0,11.33-6.8,18.95T200.55,236Zm9.88-7.85h8a14.36,14.36,0,0,0,10.94-4.84q4.49-4.84,4.49-14.41a21.91,21.91,0,0,0-3.93-13.22,12.22,12.22,0,0,0-10.37-5.41h-9.14Z",
            "M245.59,236H235.7V182.68h33.71v8.24H245.59v14.57h18.75v8H245.59Z"
        ];

        pathsData.forEach(d => {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("fill", "#ff402f");
            path.setAttribute("d", d);
            innerG.appendChild(path);
        });

        g.appendChild(innerG);

        svg.appendChild(g);
        return svg;
    };

    $.fn.iconXLS = function(){
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", iconSizeWidth+"px");
        svg.setAttribute("height", iconSizeHeight+"px");
        svg.setAttribute("viewBox", "0 0 400 400");

        const style = document.createElementNS(svgNS, "style");
        style.textContent = `.cls-1{fill:#0f773d;}`;
        svg.appendChild(style);

        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("id", "xxx-word");

        function addPath(d) {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("fill", "#0f773d");
            path.setAttribute("d", d);
            g.appendChild(path);
        }

        addPath("M325,105H250a5,5,0,0,1-5-5V25a5,5,0,1,1,10,0V95h70a5,5,0,0,1,0,10Z");
        addPath("M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z");
        addPath("M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z");
        addPath("M275,280H125a5,5,0,1,1,0-10H275a5,5,0,0,1,0,10Z");
        addPath("M200,330H125a5,5,0,1,1,0-10h75a5,5,0,0,1,0,10Z");
        addPath("M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z");
        addPath("M152.44,236H117.79V182.68h34.3v7.93H127.4v14.45h19.84v7.73H127.4v14.92h25Z");
        addPath("M190.18,236H180l-8.36-14.37L162.52,236h-7.66L168,215.69l-11.37-19.14h10.2l6.48,11.6,7.38-11.6h7.46L177,213.66Z");
        addPath("M217.4,221.51l7.66.78q-1.49,7.42-5.74,11A15.5,15.5,0,0,1,209,236.82q-8.17,0-12.56-6a23.89,23.89,0,0,1-4.39-14.59q0-8.91,4.8-14.73a15.77,15.77,0,0,1,12.81-5.82q12.89,0,15.35,13.59l-7.66,1.05q-1-7.34-7.23-7.34a6.9,6.9,0,0,0-6.58,4,20.66,20.66,0,0,0-2.05,9.59q0,6,2.13,9.22a6.74,6.74,0,0,0,6,3.24Q215.49,229,217.4,221.51Z");
        addPath("M257,223.42l8,1.09a16.84,16.84,0,0,1-6.09,8.83,18.13,18.13,0,0,1-11.37,3.48q-8.2,0-13.2-5.51t-5-14.92q0-8.94,5-14.8t13.67-5.86q8.44,0,13,5.78t4.61,14.84l0,1H238.61a22.12,22.12,0,0,0,.76,6.45,8.68,8.68,0,0,0,3,4.22,8.83,8.83,0,0,0,5.66,1.8Q254.67,229.83,257,223.42Zm-.55-11.8a9.92,9.92,0,0,0-2.56-7,8.63,8.63,0,0,0-12.36-.18,11.36,11.36,0,0,0-2.89,7.13Z");
        addPath("M282.71,236h-8.91V182.68h8.91Z");

        svg.appendChild(g);
        return svg;
    };

    $.fn.iconLBoxSearch = function(){
        let iconSpanLsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSpanLsvg.setAttribute("width", "24");
        iconSpanLsvg.setAttribute("height", "24");
        iconSpanLsvg.setAttribute("viewBox", "0 0 24 24");
        iconSpanLsvg.setAttribute("fill", "none");

        let iconSpanLPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconSpanLPath.setAttribute("d", "M5 4H17M5 8H13M5 12H9M5 16H8M5 20H11M16.4729 17.4525C17.046 16.8743 17.4 16.0785 17.4 15.2C17.4 13.4327 15.9673 12 14.2 12C12.4327 12 11 13.4327 11 15.2C11 16.9673 12.4327 18.4 14.2 18.4C15.0888 18.4 15.893 18.0376 16.4729 17.4525ZM16.4729 17.4525L19 20");
        iconSpanLPath.setAttribute("stroke", "#464455");
        iconSpanLPath.setAttribute("stroke-linecap", "round");
        iconSpanLPath.setAttribute("stroke-linejoin", "round");

        iconSpanLsvg.append(iconSpanLPath);
        return iconSpanLsvg;
    };

    $.fn.iconSort = function(){
        const iconSortPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconSortPath1.setAttribute("d", "M16 18L16 6M16 6L20 10.125M16 6L12 10.125");
        iconSortPath1.setAttribute("stroke", "#CECECE");
        iconSortPath1.setAttribute("stroke-width", "2");
        iconSortPath1.setAttribute("stroke-linecap", "round");
        iconSortPath1.setAttribute("stroke-linejoin", "round");
        const iconSortPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconSortPath2.setAttribute("d", "M8 6L8 18M8 18L12 13.875M8 18L4 13.875");
        iconSortPath2.setAttribute("stroke", "#CECECE");
        iconSortPath2.setAttribute("stroke-width", "2");
        iconSortPath2.setAttribute("stroke-linecap", "round");
        iconSortPath2.setAttribute("stroke-linejoin", "round");
        const iconSort = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSort.setAttribute("viewBox", "0 0 24 24");
        iconSort.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        iconSort.setAttribute("width", "24");
        iconSort.setAttribute("height", "24");
        iconSort.setAttribute('class', 'fa-sort');
        iconSort.setAttribute('fill', 'none');
        iconSort.style.padding = '2px';
        iconSort.appendChild(iconSortPath1);
        iconSort.appendChild(iconSortPath2);
        return iconSort;
    };

    $.fn.iconSortASC = function(){
        let iconSortASCPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconSortASCPath.setAttribute("d", "M16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.2 0 21.4-17.2 11.3-27.3l-80-96a16 16 0 0 0 -22.6 0l-80 96C-5.4 142.7 1.8 160 16 160zm272 64h128a16 16 0 0 0 16-16v-32a16 16 0 0 0 -16-16h-56l61.3-70.5A32 32 0 0 0 432 65.6V48a16 16 0 0 0 -16-16H288a16 16 0 0 0 -16 16v32a16 16 0 0 0 16 16h56l-61.3 70.5A32 32 0 0 0 272 190.4V208a16 16 0 0 0 16 16zm159.1 234.6l-59.3-160A16 16 0 0 0 372.7 288h-41.4a16 16 0 0 0 -15.1 10.6l-59.3 160A16 16 0 0 0 272 480h24.8a16 16 0 0 0 15.2-11.1l4.4-12.9h71l4.4 12.9A16 16 0 0 0 407.2 480H432a16 16 0 0 0 15.1-21.4zM335.6 400L352 352l16.4 48z");
        let iconSortASC = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSortASC.setAttribute("viewBox", "0 0 448 512");
        iconSortASC.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        iconSortASC.setAttribute("width", "16px");
        iconSortASC.setAttribute("height", "16px");
        iconSortASC.setAttribute('class', 'fa-arrow-up');
        iconSortASC.setAttribute('fill', '#666666');
        iconSortASC.style.display = 'none';
        iconSortASC.style.padding = '2px';
        iconSortASC.appendChild(iconSortASCPath);
        return iconSortASC;
    };

    $.fn.iconSortDESC = function(){
        let iconSortDESCPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        iconSortDESCPath.setAttribute("d", "M176 352h-48V48a16 16 0 0 0 -16-16H80a16 16 0 0 0 -16 16v304H16c-14.2 0-21.4 17.2-11.3 27.3l80 96a16 16 0 0 0 22.6 0l80-96C197.4 369.3 190.2 352 176 352zm240-64H288a16 16 0 0 0 -16 16v32a16 16 0 0 0 16 16h56l-61.3 70.5A32 32 0 0 0 272 446.4V464a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0 -16-16h-56l61.3-70.5A32 32 0 0 0 432 321.6V304a16 16 0 0 0 -16-16zm31.1-85.4l-59.3-160A16 16 0 0 0 372.7 32h-41.4a16 16 0 0 0 -15.1 10.6l-59.3 160A16 16 0 0 0 272 224h24.8a16 16 0 0 0 15.2-11.1l4.4-12.9h71l4.4 12.9A16 16 0 0 0 407.2 224H432a16 16 0 0 0 15.1-21.4zM335.6 144L352 96l16.4 48z");
        let iconSortDESC = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSortDESC.setAttribute("viewBox", "0 0 448 512");
        iconSortDESC.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        iconSortDESC.setAttribute("width", "16px");
        iconSortDESC.setAttribute("height", "16px");
        iconSortDESC.setAttribute('class', 'fa-arrow-down');
        iconSortDESC.setAttribute('fill', '#666666');
        iconSortDESC.style.display = 'none';
        iconSortDESC.style.padding = '2px';
        iconSortDESC.appendChild(iconSortDESCPath);
        return iconSortDESC;
    };

}(jQuery));
