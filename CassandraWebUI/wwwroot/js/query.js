//to save column data for other functions
var queryTableColumns = [];

function showTable() {
	$("#queryResultChartBlock").addClass("hidden");
	$("#queryResultTable").removeClass("hidden");

	$("#showTableOption").addClass("active");
	$("#showBarChartOption").removeClass("active");
	$("#showHorizontalBarChartOption").removeClass("active");
	$("#showPieChartOption").removeClass("active");
	$("#showPolarChartOption").removeClass("active");
	$("#showDoughnutChartOption").removeClass("active");
}

function hideTable() {
	$("#queryResultTable").addClass("hidden");
}

function getTableName() {
	return $(".table-name").text();
}

function getQueryAjaxObject() {

	var query = {};

	//from statement
	if (!$("#editFromBlock").hasClass("hidden"))
	{
		var tempFrom = $(".query-action-block.from span.table-name").text();
		query.from = { table: tempFrom };
	}

	//select statement
	if (!$("#editSelectBlock").hasClass("hidden")) {
		var tempSelect = [];
		for (var i = 0; i != $(".query-action-block.select span.select-block").length; i++) {
			var tempColumn = $($(".query-action-block.select span.select-block")[i]).find("span.column").text();
			var tempNewName = $($(".query-action-block.select span.select-block")[i]).find("span.new-name").text();

			tempSelect.push({ column: tempColumn, newName: tempNewName, show: true });
        }
		query.select = tempSelect;
	}

	//where statement
	if (!$("#editFilterBlock").hasClass("hidden")) {
		var tempFilter = [];

		for (var i = 0; i != $(".query-action-block.filter span.filter-block").length; i++) {
			var column = $($(".query-action-block.filter span.filter-block")[i]).find("span.column").text();
			var operand = $($(".query-action-block.filter span.filter-block")[i]).find("span.operand").text();
			var relation = i > 0 ? "AND" : "";

			if (operand == "IN") {
				var inputs = [];
				for (var j = 0; j != $($(".query-action-block.filter span.filter-block")[i]).find("span.input").length; j++) {
					inputs.push($($($(".query-action-block.filter span.filter-block")[i]).find("span.input")[j]).text());
				}
				tempFilter.push({ column: column, operand: operand, inputs: inputs, relation: relation });
			} else {
				var input = $($(".query-action-block.filter span.filter-block")[i]).find("span.input").text();
				tempFilter.push({ column: column, operand: operand, input: input, relation: relation });
            }
		}

		query.filter = tempFilter;
	}

	//order by statement
	if (!$("#editSortBlock").hasClass("hidden")) {
		var tempSort = [];
		for (var i = 0; i != $(".query-action-block.sort span.sort-block").length; i++) {
			var tempColumn = $($(".query-action-block.sort span.sort-block")[i]).find("span.column").text();
			var tempDirection = $($(".query-action-block.sort span.sort-block")[i]).find("span.direction").text();

			tempSort.push({ column: tempColumn, direction: tempDirection });
		}
		query.sort = tempSort;
	}

	//group by statement
	if (!$("#editGroupBlock").hasClass("hidden")) {
		var tempGroup = {};
		tempGroup.function = $(".query-action-block.group").find("span.function").text();
		tempGroup.column = $(".query-action-block.group").find("span.column").text();

		//add secondary columns
		var tempBy = [];
		var groupSecOpt = $(".query-action-block.group").find("span.sec-col");
		if (groupSecOpt && groupSecOpt.length > 0) {
			for (var i = 0; i != groupSecOpt.length; i++) {
				tempBy.push($($(".query-action-block.group").find("span.sec-col")[i]).text());
            }
		}
		tempGroup.by = tempBy;

		query.group = tempGroup;
    }

	return query;
}

//to hide/show columns/rename
var table;

//initialize table function
function initializeTable(columnData, tableData) {
	table = new Tabulator("#queryResultTable", {
		data: tableData,
		columns: columnData,
		movableColumns: true,
		headerSort: false,
		layout: "fitDataTable",
		//layout: "fitColumns",
		//pagination: "local",
		//paginationSize: 10,
		//movableColumns: true,
		//paginationCounter: "rows",
	});
}

function getTableData_NotInitialize(tableName, query, labelColumn, valueColumn) {
	$("#mainPageAlert").addClass("hidden");

	return new Promise(function (resolve, reject) {
		var passingData = connectionData;

		if (query) {
			passingData.query = query;
		} else {
			passingData.query = null;
		}

		$.ajax({
			url: '/api/GetTableData?tableName=' + tableName,
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(passingData),
			success: function (data) {

				var parsedData = JSON.parse(data);
				if (parsedData.status) {
					//get formatted columns data
					var labelIndex;
					var dataIndex;

					//get columns
					for (var i = 0; i < parsedData.tableData.columnData.length; i++) {
						//get indexes for labelIndex + dataIndex		
						if (parsedData.tableData.columnData[i].display_name == labelColumn)
							labelIndex = i;
						if (parsedData.tableData.columnData[i].display_name == valueColumn)
							dataIndex = i;
					}

					//get formatted values
					var tableData = {
						labels: [],
						data: [],
					};

					for (var i = 0; i < parsedData.tableData.columnValues.length; i++) {
						tableData.labels.push(parsedData.tableData.columnValues[i][labelIndex]);
						tableData.data.push(parsedData.tableData.columnValues[i][dataIndex]);
					}

					resolve(tableData);
				} else {
					reject(parsedData.errorMessage);
				}
			},
			error: function (err) {
				reject(err);
			},
		});
	});
}

function getTableData(tableName, query) {
	$("#mainPageAlert").addClass("hidden");

	return new Promise(function (resolve, reject) {
		var passingData = connectionData;

		if (query) {
			passingData.query = query;
		} else {
			passingData.query = null;
        }

		$.ajax({
			url: '/api/GetTableData?tableName=' + tableName,
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(passingData),
			success: function (data) {

				var parsedData = JSON.parse(data);
				if (parsedData.status) {
					//get formatted columns data

					var columns = [];
					queryTableColumns = [];

					//get columns
					for (var i = 0; i < parsedData.tableData.columnData.length; i++) {
						if (parsedData.tableData.columnData[i].show) {

							var newElem = {
								title: parsedData.tableData.columnData[i].display_name,
								field: parsedData.tableData.columnData[i].display_name,
								headerSort: false,
							};
							if (parsedData.tableData.columnData[i].type == "map" || parsedData.tableData.columnData[i].type == "list" || parsedData.tableData.columnData[i].type == "set") {
								newElem.cssClass = "query-result-table__json-column";
							}
							columns.push(newElem);
						}

						queryTableColumns.push({
							name: parsedData.tableData.columnData[i].column_name,
							display: parsedData.tableData.columnData[i].display_name,
							type: parsedData.tableData.columnData[i].type,
							groupCol: parsedData.tableData.columnData[i].groupCol,
							show: parsedData.tableData.columnData[i].show
						});
					}

					//get formatted values
					var values = [];

					for (var i = 0; i < parsedData.tableData.columnValues.length; i++) {
						var newElem = {};
						for (var j = 0; j < parsedData.tableData.columnValues[i].length; j++) {
							if (isJson(parsedData.tableData.columnValues[i][j])) {
								var tempJSON = JSON.parse(parsedData.tableData.columnValues[i][j]);
								tempJSON = JSON.stringify(tempJSON, null, 2);
								Object.assign(newElem, { [columns[j].title]: tempJSON });
							} else {
								Object.assign(newElem, { [columns[j].title]: parsedData.tableData.columnValues[i][j] });
							}
						}
						values.push(newElem);
					}

					initializeTable(columns, values);
					showTable();

					resolve();
				} else {
					reject(parsedData.errorMessage);
				}
			},
			error: function (err) {
				reject(err);
			},
		});
	});
}