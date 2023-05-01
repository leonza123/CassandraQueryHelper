$('html').on('click', function (e) {
    //did not click a popover toggle or popover
    if ($("#tableSearchInput")[0] !== e.target &&
        !$(e.target).hasClass("popover-body") &&
        $("#search-addon")[0] != e.target &&
        $("#search-addon")[0] != $(e.target).parent()[0]) {
        $("#newQueryBtn").popover("hide");
    }
});


$(document).ready(function () {

    $("#backBtn").click(function () {
        var url = window.location.protocol + "//" + window.location.host;
        window.location.href = url;
    });

    $("#visualTab").click(function () {
        if (!$("#visualTab").hasClass("active")) {
            $("#codePanel").addClass("hidden");
            $("#visualPanel").removeClass("hidden");

            $("#visualTab").addClass("active");
            $("#codeTab").removeClass("active");

            $("#queryLoadBtn").removeClass("hidden");

            $("#queryDownloadBlock").addClass("hidden");
            $("#queryResultShowMenu").addClass("hidden");

            if ($("#newFromBlock").hasClass("hidden")) {
                $("#querySaveBlock").removeClass("hidden");
                $("#queryDownloadBlock").removeClass("hidden");
                $("#queryResultShowMenu").removeClass("hidden");
                getTableData(getTableName(), getQueryAjaxObject());
            }
        }
    });

    $("#codeTab").click(function () {
        if (!$("#codeTab").hasClass("active")) {
            $("#codePanel").removeClass("hidden");
            $("#visualPanel").addClass("hidden");

            $("#visualTab").removeClass("active");
            $("#codeTab").addClass("active");

            $("#querySaveBlock").addClass("hidden");
            $("#queryDownloadBlock").addClass("hidden");
            $("#queryResultShowMenu").addClass("hidden");
            $("#queryLoadBtn").addClass("hidden");

            if ($("#nosqlCode").val().length > 0) {
                $("#queryDownloadBlock").removeClass("hidden");
                executeCode();               
            }
        }
    });

});