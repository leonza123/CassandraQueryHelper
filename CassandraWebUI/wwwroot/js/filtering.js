function showFilterModal() {
    $('#filterModal').modal({ backdrop: 'static', keyboard: false });

    $("#filterColumnSelectField").empty();
    for (var i = 0; i != queryTableColumns.filter(x => !x.groupCol).length; i++) {
        $("#filterColumnSelectField").append('<option value="' + queryTableColumns[i].name + '">' + queryTableColumns[i].name + '</option>');
    }
    $("#filterColumnSelectField select").val(queryTableColumns[0].name);

    var selectedCol = queryTableColumns.filter(x => !x.groupCol)[0];
    $("#filterOperandSelectField").empty();
    if (selectedCol.type == "list" || selectedCol.type == "map" || selectedCol.type == "set") {
        if (selectedCol.type == "map") {
            for (var i = 0; i != filterSelectOptions.length; i++) {
                $("#filterOperandSelectField").append('<option value="' + filterSelectOptions[i] + '">' + filterSelectOptions[i] + '</option>');
            }
        } else {
            for (var i = 0; i != filterSelectOptions.length - 1; i++) {
                $("#filterOperandSelectField").append('<option value="' + filterSelectOptions[i] + '">' + filterSelectOptions[i] + '</option>');
            }
        }
    } else {
        for (var i = 0; i != filterSelectOptions.length - 2; i++) {
            $("#filterOperandSelectField").append('<option value="' + filterSelectOptions[i] + '">' + filterSelectOptions[i] + '</option>');
        }
    }
    $("#filterOperandSelectField select").val(filterSelectOptions[0]);

    $("#filterModal").modal("show");
}

function closeFilterModal() {
    $('#filterModal').modal("hide");

    //remove values
    $("#filterSteps").empty();
    $("#filterValue").val("");
    $("#filterOperandSelectField").val("=");
    $("#inValues").addClass("hidden");
    $("#filterValue").removeClass("hidden");

    $("#filterErrorAlert").addClass("hidden");
}

function editFilterStep() {
    for (var i = 0; i != $(".query-action-block.filter span.filter-block").length; i++) {
        var column = $($(".query-action-block.filter span.filter-block")[i]).find("span.column").text();
        var operand = $($(".query-action-block.filter span.filter-block")[i]).find("span.operand").text();

        if (operand == "IN") {
            var inputs = [];
            for (var j = 0; j != $($(".query-action-block.filter span.filter-block")[i]).find("span.input").length; j++) {
                inputs.push($($($(".query-action-block.filter span.filter-block")[i]).find("span.input")[j]).text());
            }

            var tempHtml = filterElemBlock_IN.replace("{0}", column).replace("{1}", operand);
            for (var i = 0; i != inputs.length; i++) {
                tempHtml = tempHtml.replace("{2}", '<span class="small-margin-between value">' + inputs[i] + '</span>{2}');
            }
            $("#filterSteps").append(tempHtml.replace("{2}", ""));
        } else {
            var input = $($(".query-action-block.filter span.filter-block")[i]).find("span.input").text();
            $("#filterSteps").append(filterElemBlock.replace("{0}", column).replace("{1}", operand).replace("{2}", input));
        }
    }

    $("#addFilterBtn").removeClass("disabled");

    $("#filterModal").modal("show");
}

function emptyFilterStep() {
    $("#editFilterBlock").addClass("hidden");
    $("#newFilterBlock").removeClass("hidden");

    var ajaxData = getQueryAjaxObject();
    getTableData(getTableName(), ajaxData).then(function () {

    }).catch(function (err) {
        //add error show
    });
}

function addFilterOption() {
    var selectedCol = $("#filterColumnSelectField").val();
    var selectedOperand = $("#filterOperandSelectField").val();

    if (!$("#inValues").hasClass("hidden")) {
        var inputValues = [];
        for (var i = 0; i != $("#inValues input.in-value").length; i++) {
            if ($($("#inValues input.in-value")[i]).val() != "") {
                inputValues.push($($("#inValues input.in-value")[i]).val());
            }
        }
        
        if (selectedCol.length > 0 && selectedOperand.length > 0 && inputValues.length > 0) {
            var tempHtml = filterElemBlock_IN.replace("{0}", selectedCol).replace("{1}", selectedOperand);
            for (var i = 0; i != inputValues.length; i++) {
                tempHtml = tempHtml.replace("{2}", '<span class="small-margin-between value">' + inputValues[i] + '</span>{2}');
            }
            $("#filterSteps").append(tempHtml.replace("{2}", ""));
        }
    } else {
        var inputValue = $("#filterValue").val();

        if (selectedCol.length > 0 && selectedOperand.length > 0 && inputValue.length > 0) {
            $("#filterSteps").append(filterElemBlock.replace("{0}", selectedCol).replace("{1}", selectedOperand).replace("{2}", inputValue));
        }
    }

    $("#addFilterBtn").removeClass("disabled");
}

function removeFilterOption(elem) {
    $(elem).parent().remove();

    if ($("#filterSteps li").length == 0) {
        $("#addFilterBtn").addClass("disabled");
    }
}

function addFilterStep() {
    var ajaxFilter = [];
    var tempQueryBlock = "{0}";

    var filterSteps = $("#filterSteps li");
    for (var i = 0; i < filterSteps.length; i++) {
        var column = $($(filterSteps[i]).find("span.column")).text();
        var operand = $($(filterSteps[i]).find("span.operand")).text();
        var relation = i > 0 ? "AND" : "";

        if (operand == "IN") {
            tempQueryBlock = tempQueryBlock.replace("{0}", queryActionFilterElem_IN.replace("{0}", column).replace("{1}", operand) + "{0}");

            var inputs = [];
            for (var j = 0; j != $(filterSteps[i]).find("span.value").length; j++) {
                var inItem = $($(filterSteps[i]).find("span.value")[j]).text();
                inputs.push(inItem);
                tempQueryBlock = tempQueryBlock.replace("{2}", '<span class="query-option-block option-block-red input">' + inItem + '</span>{2}');
            }
            tempQueryBlock = tempQueryBlock.replace("{2}", "");

            ajaxFilter.push({ column: column, operand: operand, inputs: inputs, relation: relation });
        } else {
            var input = $($(filterSteps[i]).find("span.value")).text();

            ajaxFilter.push({ column: column, operand: operand, input: input, relation: relation });
            tempQueryBlock = tempQueryBlock.replace("{0}", queryActionFilterElem.replace("{0}", column).replace("{1}", operand).replace("{2}", input) + "{0}");
        }
    }
    tempQueryBlock = tempQueryBlock.replace("{0}", "");

    var ajaxData = getQueryAjaxObject();
    ajaxData.filter = ajaxFilter;
    getTableData(getTableName(), ajaxData).then(function () {
        $("div").remove(".query-action-block.filter");
        $("#editFilterBlock").append(queryActionFilterBlock.replace("{0}", tempQueryBlock));

        $("#newFilterBlock").addClass("hidden");
        $("#editFilterBlock").removeClass("hidden");

        closeFilterModal();
    }).catch(function (err) {
        $("#filterErrorAlertText").html(err);
        $("#filterErrorAlert").removeClass("hidden");
    });
}

$('#filterOperandSelectField').on('change', function () {
    if ($(this).val() == "IN") {
        $("#filterValue").addClass("hidden");
        $("#inValues").removeClass("hidden");
    } else {
        $("#filterValue").removeClass("hidden");
        $("#inValues").addClass("hidden");
    }
});

$("#filterColumnSelectField").on('change', function () {
    var selectedVal = $(this).val();
    var selectedCol = queryTableColumns.filter(x => !x.groupCol).filter(x => x.name == selectedVal)[0];

    $("#filterOperandSelectField").empty();
    if (selectedCol.type == "list" || selectedCol.type == "map" || selectedCol.type == "set") {
        if (selectedCol.type == "map") {
            for (var i = 0; i != filterSelectOptions.length; i++) {
                $("#filterOperandSelectField").append('<option value="' + filterSelectOptions[i] + '">' + filterSelectOptions[i] + '</option>');
            }
        } else {
            for (var i = 0; i != filterSelectOptions.length - 1; i++) {
                $("#filterOperandSelectField").append('<option value="' + filterSelectOptions[i] + '">' + filterSelectOptions[i] + '</option>');
            }
        }
    } else {
        for (var i = 0; i != filterSelectOptions.length - 2; i++) {
            $("#filterOperandSelectField").append('<option value="' + filterSelectOptions[i] + '">' + filterSelectOptions[i] + '</option>');
        }
    }
    $("#filterOperandSelectField select").val(filterSelectOptions[0]);

    $("#inValues").addClass("hidden");
    $("#filterValue").removeClass("hidden");
});