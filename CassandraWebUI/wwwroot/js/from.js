//for table names to boost search
var searchResults = [];

function emptyFromStep() {
	//hide all elements
	$("#newSelectBlock").addClass("hidden");
	$("#editSelectBlock").addClass("hidden");

	$("#newFilterBlock").addClass("hidden");
	$("#editFilterBlock").addClass("hidden");

	$("#newGroupBlock").addClass("hidden");
	$("#editGroupBlock").addClass("hidden");

	$("#newSortBlock").addClass("hidden");
	$("#editSortBlock").addClass("hidden");

	//show start view
	$("#newFromBlock").removeClass("hidden");
	$("#editFromBlock").addClass("hidden");

	$("#queryResultTable").addClass("hidden");
	$("#startQueryingNotification").removeClass("hidden");

	$("#queryResultShowMenu").addClass("hidden");
	$("#querySaveBlock").addClass("hidden");
	$("#queryDownloadBlock").addClass("hidden");
}

function searchTables() {
	var searchVal = $("#tableSearchInput").val();
	var tempSearchResults = searchResults.filter(v => v.includes(searchVal));

	tempPopupResults = "";

	var counter = tempSearchResults.length;
	if (counter > 4) counter = 4;
	for (var i = 0; i != counter; i++) {
		tempPopupResults += '<span onclick="setFrom(\'' + tempSearchResults[i] + '\')" class="list-group-item list-group-item-action cursor-pointer">' + tempSearchResults[i] + '</span>';
	}

	$("#tableOptions").html(tempPopupResults);
}

function setFrom(tableName) {
	$("#startQueryingNotification").addClass("hidden");
	$("#mainPageAlert").addClass("hidden");

	getTableData(tableName).then(function () {
		$("div").remove(".query-action-block.from");
		$("#editFromBlock").append(queryActionFromBlock.replace("{0}", tableName));

		$("#newFromBlock").addClass("hidden");
		$("#editFromBlock").removeClass("hidden");

		$("#newSelectBlock").removeClass("hidden");
		$("#newFilterBlock").removeClass("hidden");
		$("#newSortBlock").removeClass("hidden");
		$("#newGroupBlock").removeClass("hidden");

		$("#queryResultShowMenu").removeClass("hidden");
		$("#querySaveBlock").removeClass("hidden");
		$("#queryDownloadBlock").removeClass("hidden");

		$("#newQueryBtn").popover("hide");
	}).catch(function (err) {
		$("#mainPageAlertText").html(err);
		$("#mainPageAlert").removeClass("hidden");

		$("#newQueryBtn").popover("hide");
	});
}

$(document).ready(function () {

	$("#newQueryBtn").popover({
		placement: 'right',
		trigger: 'manual',
		sanitize: false,
		html: true,
		content: function () {
			return searchPopup + searchPopupResults;
		}
	});

	$("#newQueryBtn").click(function () {

		$.ajax({
			url: '/api/GetTables',
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(connectionData),
			success: function (data) {
				var parsedData = JSON.parse(data);
				if (parsedData.status && parsedData.tables) {
					searchPopupResults = "";
					searchResults = parsedData.tables;

					var counter = parsedData.tables.length;
					if (counter > 4) counter = 4;

					for (var i = 0; i != counter; i++) {
						searchPopupResults += '<span onclick="setFrom(\'' + parsedData.tables[i] + '\')" class="list-group-item list-group-item-action cursor-pointer">' + parsedData.tables[i] + '</span>';
					}

					searchPopupResults = '<div><div id="tableOptions" class="list-group">' + searchPopupResults + '</div></div>';

					$("#newQueryBtn").popover("show");
				} else {
					//error
				}
			},
			error: function (err) {
				//error
			},
		});
	});
}); 