function showCodeModal() {
    $('#codeModal').modal({ backdrop: 'static', keyboard: false });

    $("#codeModal").modal("show");
}

function closeCodeModal() {
    $('#codeModal').modal("hide");

    $("#codeErrorAlert").addClass("hidden");
}

function executeCode() {
	var passingData = connectionData;
	passingData.code = $('#nosqlCode').val();

	$.ajax({
		url: '/api/ExecuteCode',
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(passingData),
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {

				var columns = [];

				//get columns
				for (var i = 0; i < parsedData.tableData.columnData.length; i++) {
					var newElem = {
						title: parsedData.tableData.columnData[i].display_name,
						field: parsedData.tableData.columnData[i].column_name,
						headerSort: false,
					};
					columns.push(newElem);
				}

				//get formatted values
				var values = [];
				for (var i = 0; i < parsedData.tableData.columnValues.length; i++) {
					var newElem = {};
					for (var j = 0; j < parsedData.tableData.columnValues[i].length; j++) {
						Object.assign(newElem, { [columns[j].title]: parsedData.tableData.columnValues[i][j] });
					}
					values.push(newElem);
				}

				initializeTable(columns, values);
				showTable();

				$("#startQueryingNotification").addClass("hidden");
				$("#mainPageAlert").addClass("hidden");
				$("#codeErrorAlert").addClass("hidden");
				$("#queryResultShowMenu").removeClass("hidden");
				$("#queryDownloadBlock").removeClass("hidden");

				closeCodeModal();
			} else {
				$("#codeErrorAlertText").html(parsedData.errorMessage);
				$("#codeErrorAlert").removeClass("hidden");
			}
		},
		error: function (err) {
			$("#codeErrorAlertText").html(err);
			$("#codeErrorAlert").removeClass("hidden");
		},
	});
}