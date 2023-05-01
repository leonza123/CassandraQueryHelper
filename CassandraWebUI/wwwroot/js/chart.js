//to destroy before creting new
var chart;

function prepareSelectsForDiagram() {
    $("#labelSelectDiagram").empty();
    for (var i = 0; i != queryTableColumns.length; i++) {
        $("#labelSelectDiagram").append('<option value="' + queryTableColumns[i].display + '">' + queryTableColumns[i].display + '</option>');
    }
    $("#labelSelectDiagram").prepend('<option value="default" disabled selected>Select Labels</option>');

    $("#valueSelectDiagram").empty();
    for (var i = 0; i != queryTableColumns.length; i++) {
        $("#valueSelectDiagram").append('<option value="' + queryTableColumns[i].display + '">' + queryTableColumns[i].display + '</option>');
    }
    $("#valueSelectDiagram").prepend('<option value="default" disabled selected>Select Values</option>');
}

function prepareBarDiagram() {
    prepareSelectsForDiagram();

    $("#showTableOption").removeClass("active");
    $("#showBarChartOption").addClass("active");
    $("#showHorizontalBarChartOption").removeClass("active");
    $("#showPieChartOption").removeClass("active");
    $("#showPolarChartOption").removeClass("active");
    $("#showDoughnutChartOption").removeClass("active");

    $("#queryResultTable").addClass("hidden");
    $("#queryResultChartBlock").removeClass("hidden");

    $("#buildChartBtn").attr("chart-type", "bar");
}

function prepareHorizontalBarDiagram() {
    prepareSelectsForDiagram();

    $("#showTableOption").removeClass("active");
    $("#showBarChartOption").removeClass("active");
    $("#showHorizontalBarChartOption").addClass("active");
    $("#showPieChartOption").removeClass("active");
    $("#showPolarChartOption").removeClass("active");
    $("#showDoughnutChartOption").removeClass("active");

    $("#queryResultTable").addClass("hidden");
    $("#queryResultChartBlock").removeClass("hidden");

    $("#buildChartBtn").attr("chart-type", "horizontalBar");
}

function preparePieDiagram() {
    prepareSelectsForDiagram();

    $("#showTableOption").removeClass("active");
    $("#showBarChartOption").removeClass("active");
    $("#showHorizontalBarChartOption").removeClass("active");
    $("#showPieChartOption").addClass("active");
    $("#showPolarChartOption").removeClass("active");
    $("#showDoughnutChartOption").removeClass("active");

    $("#queryResultTable").addClass("hidden");
    $("#queryResultChartBlock").removeClass("hidden");

    $("#buildChartBtn").attr("chart-type", "pie");
}

function preparePolarDiagram() {
    prepareSelectsForDiagram();

    $("#showTableOption").removeClass("active");
    $("#showBarChartOption").removeClass("active");
    $("#showHorizontalBarChartOption").removeClass("active");
    $("#showPieChartOption").removeClass("active");
    $("#showPolarChartOption").addClass("active");
    $("#showDoughnutChartOption").removeClass("active");

    $("#queryResultTable").addClass("hidden");
    $("#queryResultChartBlock").removeClass("hidden");

    $("#buildChartBtn").attr("chart-type", "polarArea");
}

function prepareDoughnutDiagram() {
    prepareSelectsForDiagram();

    $("#showTableOption").removeClass("active");
    $("#showBarChartOption").removeClass("active");
    $("#showHorizontalBarChartOption").removeClass("active");
    $("#showPieChartOption").removeClass("active");
    $("#showPolarChartOption").removeClass("active");
    $("#showDoughnutChartOption").addClass("active");

    $("#queryResultTable").addClass("hidden");
    $("#queryResultChartBlock").removeClass("hidden");

    $("#buildChartBtn").attr("chart-type", "doughnut");
}

function buildChart() {

    var chartType = $("#buildChartBtn").attr("chart-type");

    var labelColumn = $("#labelSelectDiagram").val();
    var valueColumn = $("#valueSelectDiagram").val();

    getTableData_NotInitialize(getTableName(), getQueryAjaxObject(), labelColumn, valueColumn).then(function (tableData) {
        if (chart) {
            chart.destroy();
        }

        var bgColors = [];
        for (var i = 0; i != tableData.data.length; i++) {
            var color = generateRandomColor();
            bgColors.push(color.rgbaOpacityCol);
        }

        chart = new Chart(document.getElementById("queryResultChart"), {
            type: chartType,
            data: {
                labels: tableData.labels,
                datasets: [
                    {
                        backgroundColor: bgColors,
                        data: tableData.data
                    }
                ]
            },
            options: {
                legend: { display: false },
                title: { display: false }
            }
        });

        $("#queryResultTable").addClass("hidden");
        $("#queryResultChartBlock").removeClass("hidden");

    }).catch(function (err) {
        //add error show
    });

}