function showGroupModal() {
    $('#groupModal').modal({ backdrop: 'static', keyboard: false });

    $("#groupMainColumnSelectField").empty();
    for (var i = 0; i != queryTableColumns.filter(x => !x.groupCol).length; i++) {
        $("#groupMainColumnSelectField").append('<option value="' + queryTableColumns[i].name + '">' + queryTableColumns[i].name + '</option>');
    }

    $("#groupFunctionSelectField").empty();
    for (var i = 0; i != groupSelectOptions.length; i++) {
        $("#groupFunctionSelectField").append('<option value="' + groupSelectOptions[i] + '">' + groupSelectOptions[i] + '</option>');
    }

    $("#groupSecondaryColumnSelectField").empty();
    if (queryTableColumns.filter(x => !x.groupCol).length > 1) {
        for (var i = 1; i != queryTableColumns.filter(x => !x.groupCol).length; i++) {
            $("#groupSecondaryColumnSelectField").append('<option value="' + queryTableColumns[i].name + '">' + queryTableColumns[i].name + '</option>');
        }
        $("#groupSecondaryColumnSelectField select").val(queryTableColumns[1].name);
    }

    $("#groupFunctionSelectField select").val(groupSelectOptions.filter(x => !x.groupCol)[0]);
    $("#groupMainColumnSelectField select").val(queryTableColumns.filter(x => !x.groupCol)[0].name);

    $("#groupModal").modal("show");
}

function closeGroupModal() {
    $('#groupModal').modal("hide");

    $("#groupErrorAlert").addClass("hidden");
    $("#groupSecondaryOptions").empty();
}

function editGroupStep() {
    var func = $(".query-action-block.group").find("span.function").text();
    var column = $(".query-action-block.group").find("span.column").text();
    $("#addGroupSecondaryOptionBtn").attr("disabled", false);

    $("#groupMainColumnSelectField select").val(column);
    $("#groupFunctionSelectField select").val(func);

    //add secondary columns
    var groupSecOpt = $(".query-action-block.group").find("span.sec-col");
    if (groupSecOpt && groupSecOpt.length > 0) {
        for (var i = 0; i != groupSecOpt.length; i++) {
            var tempBy = $($(".query-action-block.group").find("span.sec-col")[i]).text();

            $("#groupSecondaryColumnSelectField option[value='" + tempBy + "']").remove();
            $("#groupSecondaryOptions").append(groupSecondaryBlock.replace("{0}", tempBy));

            if (!$("#groupSecondaryColumnSelectField").val()) {
                $("#addGroupSecondaryOptionBtn").attr("disabled", true);
            }
        }
    }

    $("#groupModal").modal("show");
}

function emptyGroupStep() {
    $("#editGroupBlock").addClass("hidden");
    $("#newGroupBlock").removeClass("hidden");

    //for group by selected fields
    $("#editSelectBlock").addClass("hidden");
    $("#newSelectBlock").removeClass("hidden");

    var ajaxData = getQueryAjaxObject();
    getTableData(getTableName(), ajaxData).then(function () {

    }).catch(function (err) {
        //add error show
    });
}

function addGroupOptionBtn() {
    var selectedVal = $("#groupSecondaryColumnSelectField").val();
    $("#groupSecondaryColumnSelectField option[value='" + selectedVal + "']").remove();
    $("#groupSecondaryOptions").append(groupSecondaryBlock.replace("{0}", selectedVal));

    if (!$("#groupSecondaryColumnSelectField").val()) {
        $("#addGroupSecondaryOptionBtn").attr("disabled", true);
    }
}

function removeGroupSecondaryOption(elem) {
    var optionVal = $(elem).parent().find("span")[0].innerText; 
    $("#groupSecondaryColumnSelectField").append('<option value="' + optionVal + '">' + optionVal + '</option>');
    $("#addGroupSecondaryOptionBtn").attr("disabled", false);
    $(elem).parent().remove();
}

$('#groupMainColumnSelectField').on('change', function () {

    //remove secondary options
    var selectedOption = queryTableColumns.filter(x => !x.groupCol).filter(x => x.display == $('#groupMainColumnSelectField').val())[0];
    var tempColumnValues = queryTableColumns.filter(x => !x.groupCol).filter(x => x.display != selectedOption.display);

    $("#groupSecondaryColumnSelectField").empty();
    for (var i = 0; i != tempColumnValues.length; i++) {
        $("#groupSecondaryColumnSelectField").append('<option value="' + tempColumnValues[i].name + '">' + tempColumnValues[i].name + '</option>');
    }
    $("#groupSecondaryColumnSelectField select").val(queryTableColumns.filter(x => !x.groupCol)[1].name);

    $('#groupSecondaryOptions').empty();
    $("#addGroupSecondaryOptionBtn").attr("disabled", false);

    //change functions selection
    $("#groupFunctionSelectField").empty();
    for (var i = 0; i != groupSelectOptions.length; i++) {
        $("#groupFunctionSelectField").append('<option value="' + groupSelectOptions[i] + '">' + groupSelectOptions[i] + '</option>');
    }
});

function addGroupStep() {
    var groupFunction = $("#groupFunctionSelectField").val();
    var groupMainColumn = $("#groupMainColumnSelectField").val();
    var tempQueryBlock = queryActionGroupElem.replace("{0}", groupFunction).replace("{1}", groupMainColumn);
    tempQueryBlock = queryActionGroupBlock.replace("{0}", tempQueryBlock);

    var tempGroup = {};
    tempGroup.function = groupFunction;
    tempGroup.column = groupMainColumn;
    tempGroup.by = [];

    var secondaryOptions = $("#groupSecondaryOptions li");
    if (secondaryOptions && secondaryOptions.length > 0) {
        tempQueryBlock = tempQueryBlock.replace("{2}", '<span class="query-option-block option-block-grey">by</span>{2}');
        for (var i = 0; i != secondaryOptions.length; i++) {
            tempQueryBlock = tempQueryBlock.replace("{2}", '<span class="query-option-block option-block-red sec-col">' + $(secondaryOptions[i]).text() + '</span>{2}');
            tempGroup.by.push($(secondaryOptions[i]).text());
        }
    }
    tempQueryBlock = tempQueryBlock.replace("{2}", "");

    var hasSelect = !$("#editSelectBlock").hasClass("hidden");
    if (hasSelect) {
        $("#newSelectBlock").removeClass("hidden");
        $("#editSelectBlock").addClass("hidden");
    }

    var ajaxQuery = getQueryAjaxObject();
    ajaxQuery.group = tempGroup;
    getTableData(getTableName(), ajaxQuery).then(function () {
        $("#editGroupBlock").remove(".query-action-block.group");
        $("#editGroupBlock").append(tempQueryBlock.replace("{0}", ""));

        $("#newGroupBlock").addClass("hidden");
        $("#editGroupBlock").removeClass("hidden");

        //refresh select
        $("#editSelectBlock").remove(".query-action-block.select");

        closeGroupModal();
    }).catch(function (err) {
        $("#groupErrorAlertText").html(err);
        $("#groupErrorAlert").removeClass("hidden");

        if (hasSelect) {
            $("#newSelectBlock").addClass("hidden");
            $("#editSelectBlock").removeClass("hidden");
        }
    });
}