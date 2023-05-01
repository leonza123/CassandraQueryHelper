var mainListElem = '<div class="display-flex align-start main-list-elem">' +
                    '<div>' +
                    '<p>{0}</p>' +
                    '</div>' +
                    '<div>' +
                    '<button item-id="{1}">Launch</button>' +
                    '</div>' +
                    '</div>';

var searchPopup = '<div class="input-group rounded search-panel">' +
                  '<input oninput="searchTables()" id="tableSearchInput" type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />' +
                  '<span class="input-group-text border-0" id="search-addon">' +
                  '<i class="fa fa-search"></i>' +
                  '</span>' +
                  '</div>';

var searchPopupResults = "";

var loadQueryPopoverResults = "";

var queryActionFromBlock = '<div class="query-action-block from overflow-hidden">' +
                             '<span class="query-option-block option-block-grey">Source</span>' +
                             '<span class="query-option-block option-block-orange table-name">{0}</span>' +
                             //'<button>Delete</button>' +
                             '</div>';

var queryActionSelectBlock = '<div class="query-action-block select overflow-hidden">' +
                             '<span class="query-option-block option-block-grey">Get</span>{0}' +
                             //'<button>Delete</button>' +
                             '</div>';

var queryActionSelectBlockRepeatable = '<span class="select-block">' +
                                        '<span class="query-option-block option-block-orange column">{0}</span>' +
                                        '<span class="query-option-block option-block-green">as</span>' +
                                        '<span class="query-option-block option-block-red new-name">{1}</span>' +
                                        '</span>';

var queryActionSelectBlockRepeatable_noChanges = '<span class="select-block">' +
                                                    '<span class="query-option-block option-block-orange column">{0}</span>' +
                                                    '<span class="query-option-block option-block-green hidden">as</span>' +
                                                    '<span class="query-option-block option-block-red new-name hidden">{1}</span>' +
                                                    '</span>';

var queryActionSortBlock = '<div class="query-action-block sort overflow-hidden">' +
                           '<span class="query-option-block option-block-grey">Sort</span>{0}' +
                           //'<button>Delete</button>' +
                           '</div>';

var queryActionSortElem = '<span class="sort-block">' +
                          '<span class="query-option-block option-block-orange column">{0}</span>' +
                          '<span class="query-option-block option-block-green direction">{1}</span>' +
                          '</span>';

var queryActionFilterBlock = '<div class="query-action-block filter overflow-hidden">' +
                             '<span class="query-option-block option-block-grey">Filter</span>{0}' +
                             //'<button>Delete</button>' +
                             '</div>';

var queryActionFilterElem = '<span class="filter-block">' +
                            '<span class="query-option-block option-block-orange column">{0}</span>' +
                            '<span class="query-option-block option-block-green operand">{1}</span>' +
                            '<span class="query-option-block option-block-red input">{2}</span>' +
                            '</span>';

var queryActionFilterElem_IN = '<span class="filter-block">' +
                               '<span class="query-option-block option-block-orange column">{0}</span>' +
                               '<span class="query-option-block option-block-green operand">{1}</span>' +
                               '{2}' +
                               '</span>';

var queryActionGroupBlock = '<div class="query-action-block group overflow-hidden">' +
                            '<span class="query-option-block option-block-grey">Summarize</span>{0}' +
                            //'<button>Delete</button>' +
                            '</div>';

var queryActionGroupElem = '<span class="group-block">' +
                           '<span class="query-option-block option-block-green function">{0}</span>' +
                           '<span class="query-option-block option-block-orange column">{1}</span>' +
                           '{2}' +
                           '</span>';


var queryActionSelectElem = '<li class="list-group-item display-flex">' +
                            '<div class="span-vertical-align form-check form-switch select-switch small-margin-between">' +
                            '<input class="form-check-input cursor-pointer select-switch" type="checkbox" onclick="changeSwitchValue(this)" role="switch" {2}>' +
                            '<label class="margin-left-sm form-check-label" for="flexSwitchCheckChecked">Show</label>' +
                            '</div>' +
                            '<div class="span-vertical-align span-vertical-align select-text small-margin-between select-exist-col">{0}</div>' +
                            '<div class="select-input small-margin-between">' +
                            '<input class="form-control in-value select-new-col" placeholder="New column name" value="{1}" />' +
                            '</div >' +
                            '</li>';

var sortElemBlock = '<li class="list-group-item">' +
                    '<span class="small-margin-between column">{0}</span>' +
                    '<span onclick="removeSortOption(this)" class="small-margin-between cursor-pointer float-right"><i class="fa fa-times"></i></span>' +
                    '<span onclick="changeSortOrder(this)" class="small-margin-between float-right cursor-pointer direction {1}">' +
                    '<i class="fa fa-sort-amount-asc"></i>' +
                    '<i class="fa fa-sort-amount-desc hidden"></i>' +
                    '</span>' +
                    '</li>';

var filterElemBlock = '<li class="list-group-item">' +
                      '<span class="small-margin-between column">{0}</span>' +
                      '<span class="small-margin-between operand">{1}</span>' +
                      '<span class="small-margin-between value">{2}</span>' +
                      '<span onclick="removeFilterOption(this)" class="small-margin-left float-right cursor-pointer small-margin-between"><i class="fa fa-times"></i></span>' +
                      '</li>';

var filterElemBlock_IN = '<li class="list-group-item">' +
                         '<span class="small-margin-between column">{0}</span>' +
                         '<span class="small-margin-between operand">{1}</span>' +
                         '({2})' +
                         '<span onclick="removeFilterOption(this)" class="small-margin-left float-right cursor-pointer small-margin-between"><i class="fa fa-times"></i></span>' +
                         '</li>';

var groupSecondaryBlock = '<li class="list-group-item">' +
                          '<span>{0}</span>' +
                          '<span onclick="removeGroupSecondaryOption(this)" class="small-margin-left cursor-pointer small-margin-between"><i class="fa fa-times"></i></span>' +
                          '</li>';

var groupSelectOptions = ["Count", "Max", "Min", "Sum", "Avg"];
//add udfs to list
if (udfs && udfs.length > 0) {
    for (var i = 0; i != udfs.length; i++) {
        groupSelectOptions.push(udfs[i]);
    }
}

var filterSelectOptions = [ "=", "<", ">", "<=", ">=", "!=", "IN", "CONTAINS", "CONTAINS KEY" ];

//column types
var textType = "text";
var numberType = "num";
var booleanType = "boolean";