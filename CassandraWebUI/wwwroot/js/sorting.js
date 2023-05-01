function showSortModal() {
    $('#sortModal').modal({ backdrop: 'static', keyboard: false });

    $("#sortSelectField").empty();
    for (var i = 0; i != queryTableColumns.filter(x => !x.groupCol).length; i++) {
        $("#sortSelectField").append('<option value="' + queryTableColumns[i].name + '">' + queryTableColumns[i].name + '</option>');
    }

    $("#sortSelectField select").val(queryTableColumns.filter(x => !x.groupCol)[0].name);
    $("#sortAddBtn").addClass("disabled");

    $("#sortModal").modal("show");
}

function removeSortOption(elem) {
    var column = $($(elem).parent().find("span.column")[0]).text();
    $("#sortSelectField").append('<option value="' + column + '">' + column + '</option>');

    if ($("#sortSteps li").length == 0) {
        $("#sortAddBtn").addClass("disabled");
    }

    $(elem).parent().remove();

    $("#addSortOptionBtn").removeClass("disabled");

    if ($("#filterSteps li").length == 0) {
        $("#sortAddBtn").addClass("disabled");
    }
}

function editSortStep() {
    $("#sortSelectField").empty();
    for (var i = 0; i != queryTableColumns.filter(x => !x.groupCol).length; i++) {
        $("#sortSelectField").append('<option value="' + queryTableColumns[i].name + '">' + queryTableColumns[i].name + '</option>');
    }

    for (var i = 0; i != $(".query-action-block.sort span.sort-block").length; i++) {
        var tempColumn = $($(".query-action-block.sort span.sort-block")[i]).find("span.column").text();
        var tempDirection = $($(".query-action-block.sort span.sort-block")[i]).find("span.direction").text();

        $("#sortSelectField option[value='" + tempColumn + "']").remove();
        $("#sortSteps").append(sortElemBlock.replace("{0}", tempColumn).replace("{1}", tempDirection == "ASC" ? "sort-asc" : "sort-desc"));

        if (!$("#sortSelectField").val()) {
            $("#addSortOptionBtn").addClass("disabled");
        }
    }

    $("#sortAddBtn").removeClass("disabled");
    $("#sortModal").modal("show");
}

function closeSortModal() {
    $("#sortModal").modal("hide");

    $("#sortSteps").empty();
    $("#sortErrorAlert").addClass("hidden");
}

function emptySortStep() {
    $("#editSortBlock").addClass("hidden");
    $("#newSortBlock").removeClass("hidden");

    var ajaxData = getQueryAjaxObject();
    getTableData(getTableName(), ajaxData).then(function () {

    }).catch(function (err) {
        //add error show
    });
}

function changeSortOrder(elem) {
    if ($(elem).hasClass("sort-asc")) {
        $($(elem).find("i")[0]).addClass("hidden");
        $($(elem).find("i")[1]).removeClass("hidden");
        $(elem).removeClass("sort-asc");
        $(elem).addClass("sort-desc");
    } else {
        $($(elem).find("i")[0]).removeClass("hidden");
        $($(elem).find("i")[1]).addClass("hidden");
        $(elem).addClass("sort-asc");
        $(elem).removeClass("sort-desc");
    }
}

function addSortOption() {
    var selectedVal = $("#sortSelectField").val();
    $("#sortSelectField option[value='" + selectedVal + "']").remove();
    $("#sortSteps").append(sortElemBlock.replace("{0}", selectedVal).replace("{1}", "sort-asc"));

    if (!$("#sortSelectField").val()) {
        $("#addSortOptionBtn").addClass("disabled");
    }

    $("#sortAddBtn").removeClass("disabled");
}

function addSortStep() {
    var tempQueryBlock = "{0}";
    var ajaxSort = [];

    var sortSteps = $("#sortSteps li");
    if (sortSteps.length > 0) {
        for (var i = 0; i < sortSteps.length; i++) {
            var direction = $($(sortSteps[i]).find("span.direction")).hasClass("sort-asc") ? "ASC" : "DESC";
            var column = $($(sortSteps[i]).find("span.column")).text();

            tempQueryBlock = tempQueryBlock.replace("{0}", queryActionSortElem.replace("{0}", column).replace("{1}", direction)) + "{0}";
            ajaxSort.push({ column: column, direction: direction });
        }
        tempQueryBlock = queryActionSortBlock.replace("{0}", tempQueryBlock);
    }

    var queryAjax = getQueryAjaxObject();
    queryAjax.sort = ajaxSort;
    getTableData(getTableName(), queryAjax).then(function () {
        $("div").remove(".query-action-block.sort");
        $("#editSortBlock").append(tempQueryBlock.replace("{0}", ""));

        $("#newSortBlock").addClass("hidden");
        $("#editSortBlock").removeClass("hidden");

        closeSortModal();
    }).catch(function (err) {
        $("#sortErrorAlertText").html(err);
        $("#sortErrorAlert").removeClass("hidden");
    });
}