function showSelectModal() {
    $('#selectModal').modal({ backdrop: 'static', keyboard: false });

    $("#selectOptionsList").empty();
    for (var i = 0; i != queryTableColumns.length; i++) {
        $("#selectOptionsList").append(queryActionSelectElem.replace("{0}", queryTableColumns[i].name).replace("{1}", "").replace("{2}", "checked"));
    }

    $("#selectModal").modal("show");
}

function closeSelectModal() {
    $('#selectModal').modal("hide");

    $("#selectErrorAlert").addClass("hidden");
}

function emptySelectStep() {
    $("#editSelectBlock").addClass("hidden");
    $("#newSelectBlock").removeClass("hidden");

    var ajaxData = getQueryAjaxObject();
    getTableData(getTableName(), ajaxData).then(function () {

    }).catch(function (err) {
        //add error show
    });
}

function editSelectStep() {
    var tempSelect = [];
    for (var i = 0; i != $(".query-action-block.select span.select-block").length; i++) {
        var tempColumn = $($(".query-action-block.select span.select-block")[i]).find("span.column").text();
        var tempNewName = $($(".query-action-block.select span.select-block")[i]).find("span.new-name").text();

        tempSelect.push({ column: tempColumn, newName: tempNewName, show: true });
    }

    $("#selectOptionsList").empty();
    for (var i = 0; i != queryTableColumns.length; i++) {
        if (tempSelect.filter(x => x.column == queryTableColumns[i].name).length > 0) {
            var tempVal = tempSelect.filter(x => x.column == queryTableColumns[i].name)[0];
            if (tempVal.column == tempVal.newName)
                tempVal.newName = "";

            $("#selectOptionsList").append(queryActionSelectElem.replace("{0}", tempVal.column).replace("{1}", tempVal.newName).replace("{2}", "checked"));
        } else {
            $("#selectOptionsList").append(queryActionSelectElem.replace("{0}", queryTableColumns[i].name).replace("{1}", "").replace("{2}", ""));
        }
    }

    $("#selectModal").modal("show");
}

function changeSwitchValue(elem) {
    if ($(elem).is(":checked")) {
        $($(elem).parent().find("label:first")[0]).text("Show");
    } else {
        $($(elem).parent().find("label:first")[0]).text("Hide");
    }
}

function addSelectStep() {
    var tempSelect = [];
    var tempQueryBlock = queryActionSelectBlock;

    for (var i = 0; i != $("#selectOptionsList li").length; i++) {
        var column = $($("#selectOptionsList li")[i]).find(".select-exist-col").text();
        var newName = $($("#selectOptionsList li")[i]).find(".select-new-col").val();
        var show = $($("#selectOptionsList li")[i]).find(".select-switch").is(":checked");

        if (show) {
            tempSelect.push({ column: column, newName: (newName.length > 0 ? newName : column), show: true });
        }

        if (show) {
            if (newName.length == 0) {
                newName = column;
                tempQueryBlock = tempQueryBlock.replace("{0}", queryActionSelectBlockRepeatable_noChanges.replace("{0}", column).replace("{1}", newName) + "{0}");
            } else {
                tempQueryBlock = tempQueryBlock.replace("{0}", queryActionSelectBlockRepeatable.replace("{0}", column).replace("{1}", newName) + "{0}");

            }
        }
    }

    var ajaxData = getQueryAjaxObject();
    ajaxData.select = tempSelect;
    getTableData(getTableName(), ajaxData).then(function () {
        $("div").remove(".query-action-block.select");
        $("#editSelectBlock").append(tempQueryBlock.replace("{0}", ""));

        $("#newSelectBlock").addClass("hidden");
        $("#editSelectBlock").removeClass("hidden");

        closeSelectModal();
    }).catch(function (err) {
        $("#selectErrorAlertText").html(err);
        $("#selectErrorAlert").removeClass("hidden");
    });
}
