//if URL has guid
if (window.location.search.length > 0) {
	var tmpQueryGuid = window.location.search.split("=")[1];
	loadQuery(tmpQueryGuid);
}


function openSaveQueryModal() {
    $('#saveQueryModal').modal({ backdrop: 'static', keyboard: false });

    $("#saveQueryModal").modal("show");
}

function closeSaveQueryModal() {
    $('#saveQueryModal').modal("hide");

    $("#saveQueryAlert").addClass("hidden");
}

function saveQuery() {
    var tempSplitRes = window.location.pathname.split("/");
    var tempQueryGuid = "";
    if (window.location.search.length > 0) {
        tempQueryGuid = window.location.search.split("=")[1];
    }

    var jsonData = {
        guid: tempSplitRes[tempSplitRes.length - 1],
        queryGuid: tempQueryGuid,
        title: $("#queryTitle").val(),
        query: getQueryAjaxObject(),
    };

	$.ajax({
		url: '/api/SaveQuery',
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(jsonData),
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
                var queryID = parsedData.queryGuid;
                window.history.replaceState(null, null, "?query=" + queryID);

                closeSaveQueryModal();
			} else {
				$("#saveQueryAlertText").html(parsedData.errorMessage);
				$("#saveQueryAlert").removeClass("hidden");
			}
		},
		error: function (err) {
			$("#saveQueryAlertText").html(err);
			$("#saveQueryAlert").removeClass("hidden");
		},
	});
}

function loadQuery(queryGuid) {
	var tempSplitRes = window.location.pathname.split("/");
	var tempGuid = tempSplitRes[tempSplitRes.length - 1];

	$.ajax({
		url: '/api/LoadQuery?guid=' + tempGuid + "&queryGuid=" + queryGuid,
		type: "GET",
		contentType: "application/json",
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
				var queryID = parsedData.query.guid;
				window.history.replaceState(null, null, "?query=" + queryID);
				var query = parsedData.query.query;

				//load data for all steps
				//from
				$("div").remove(".query-action-block.from");
				$("#editFromBlock").append(queryActionFromBlock.replace("{0}", query.from.table));
				$("#newFromBlock").addClass("hidden");
				$("#editFromBlock").removeClass("hidden");

				//select
				$("#newSelectBlock").removeClass("hidden");
				$("#editSelectBlock").addClass("hidden");
				if (query.select && query.select.length > 0) {
					var tempQueryBlock = queryActionSelectBlock;
					for (var i = 0; i != query.select.length; i++) {
						var column = query.select[i].column;
						var newName = "";
						if (query.select[i].column != query.select[i].newName) {
							newName = query.select[i].newName;
                        }

						if (newName.length == 0) {
							newName = column;
							tempQueryBlock = tempQueryBlock.replace("{0}", queryActionSelectBlockRepeatable_noChanges.replace("{0}", column).replace("{1}", newName) + "{0}");
						} else {
							tempQueryBlock = tempQueryBlock.replace("{0}", queryActionSelectBlockRepeatable.replace("{0}", column).replace("{1}", newName) + "{0}");
						}
					}
					$("div").remove(".query-action-block.select");
					$("#editSelectBlock").append(tempQueryBlock.replace("{0}", ""));
					$("#newSelectBlock").addClass("hidden");
					$("#editSelectBlock").removeClass("hidden");
				}

				//filter
				$("#newFilterBlock").removeClass("hidden");
				$("#editFilterBlock").addClass("hidden");
				if (query.filter && query.filter.length > 0) {
					var tempQueryBlock = "{0}";
					for (var i = 0; i < query.filter.length; i++) {
						var column = query.filter[i].column;
						var operand = query.filter[i].operand;
						if (operand == "IN") {
							tempQueryBlock = tempQueryBlock.replace("{0}", queryActionFilterElem_IN.replace("{0}", column).replace("{1}", operand) + "{0}");
							for (var j = 0; j != query.filter[i].inputs.length; j++) {
								var inItem = query.filter[i].inputs[j];
								tempQueryBlock = tempQueryBlock.replace("{2}", '<span class="query-option-block option-block-red input">' + inItem + '</span>{2}');
							}
							tempQueryBlock = tempQueryBlock.replace("{2}", "");
						} else {
							var input = query.filter[i].input;
							tempQueryBlock = tempQueryBlock.replace("{0}", queryActionFilterElem.replace("{0}", column).replace("{1}", operand).replace("{2}", input) + "{0}");
						}
					}
					tempQueryBlock = tempQueryBlock.replace("{0}", "");
					$("div").remove(".query-action-block.filter");
					$("#editFilterBlock").append(queryActionFilterBlock.replace("{0}", tempQueryBlock));
					$("#newFilterBlock").addClass("hidden");
					$("#editFilterBlock").removeClass("hidden");
				}

				//group
				$("#newGroupBlock").removeClass("hidden");
				$("#editGroupBlock").addClass("hidden");
				if (query.group) {
					var groupFunction = query.group.function;
					var groupMainColumn = query.group.column;
					var tempQueryBlock = queryActionGroupElem.replace("{0}", groupFunction).replace("{1}", groupMainColumn);
					tempQueryBlock = queryActionGroupBlock.replace("{0}", tempQueryBlock);
					var secondaryOptions = query.group.by;
					if (secondaryOptions && secondaryOptions.length > 0) {
						tempQueryBlock = tempQueryBlock.replace("{2}", '<span class="query-option-block option-block-grey">by</span>{2}');
						for (var i = 0; i != secondaryOptions.length; i++) {
							tempQueryBlock = tempQueryBlock.replace("{2}", '<span class="query-option-block option-block-red sec-col">' + query.group.by[i] + '</span>{2}');
						}
					}
					tempQueryBlock = tempQueryBlock.replace("{2}", "");
					$("#editGroupBlock").remove(".query-action-block.group");
					$("#editGroupBlock").append(tempQueryBlock.replace("{0}", ""));
					$("#newGroupBlock").addClass("hidden");
					$("#editGroupBlock").removeClass("hidden");
				}

				//sort
				$("#newSortBlock").removeClass("hidden");
				$("#editSortBlock").addClass("hidden");
				if (query.sort && query.sort.length > 0) {
					var tempQueryBlock = "{0}";

					for (var i = 0; i < query.sort.length; i++) {
						var direction = query.sort[i].direction;
						var column = query.sort[i].column;
						tempQueryBlock = tempQueryBlock.replace("{0}", queryActionSortElem.replace("{0}", column).replace("{1}", direction)) + "{0}";
					}
					tempQueryBlock = queryActionSortBlock.replace("{0}", tempQueryBlock);
					$("div").remove(".query-action-block.sort");
					$("#editSortBlock").append(tempQueryBlock.replace("{0}", ""));
					$("#newSortBlock").addClass("hidden");
					$("#editSortBlock").removeClass("hidden");
				}

				$("#queryResultShowMenu").removeClass("hidden");
				$("#querySaveBlock").removeClass("hidden");
				$("#queryDownloadBlock").removeClass("hidden");
				$("#startQueryingNotification").addClass("hidden");
				getTableData(query.from.table, getQueryAjaxObject()).then(function () {}).catch(function (err) {});

				$("#queryLoadBtn").popover("hide");
			} else {
				//error
			}
		},
		error: function (err) {
			//error
		},
	});
}

function downloadQuery() {
	var passingData = connectionData;
	passingData.query = getQueryAjaxObject();

	$.ajax({
		url: '/api/DownloadQuery',
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(passingData),
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
				var sampleArr = base64ToArrayBuffer(parsedData.file.content);
				saveByteArray(parsedData.file.name, parsedData.file.contentType, sampleArr);
			} else {
				$("#saveQueryAlertText").html(parsedData.errorMessage);
				$("#saveQueryAlert").removeClass("hidden");
			}
		},
		error: function (err) {
			$("#saveQueryAlertText").html(err);
			$("#saveQueryAlert").removeClass("hidden");
		},
	});
}

function downloadQueryResult() {
	var passingData = connectionData;
	var codeQuery = false;

	if (!$("#visualTab").hasClass("active")) {
		passingData.code = $('#nosqlCode').val();
		codeQuery = true;
		passingData.query = null;
	} else {
		passingData.code = null;
		passingData.query = getQueryAjaxObject();
	}

	$.ajax({
		url: '/api/DownloadQueryResult?codeQuery=' + codeQuery,
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(passingData),
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
				var sampleArr = base64ToArrayBuffer(parsedData.file.content);
				saveByteArray(parsedData.file.name, parsedData.file.contentType, sampleArr);
			} else {
				$("#mainPageAlertText").html(parsedData.errorMessage);
				$("#mainPageAlert").removeClass("hidden");
			}
		},
		error: function (err) {
			$("#mainPageAlertText").html(err);
			$("#mainPageAlert").removeClass("hidden");
		},
	});
}

$(document).ready(function () {

	$("#queryLoadBtn").popover({
		placement: 'bottom',
		trigger: 'manual',
		sanitize: false,
		html: true,
		content: function () {
			return loadQueryPopoverResults;
		}
	});

	$("#queryLoadBtn").click(function () {
		var tempSplitRes = window.location.pathname.split("/");
		var tempGuid = tempSplitRes[tempSplitRes.length - 1];

		$.ajax({
			url: '/api/GetQueries?guid=' + tempGuid,
			type: "GET",
			contentType: "application/json",
			success: function (data) {
				var parsedData = JSON.parse(data);
				if (parsedData.status) {
					loadQueryPopoverResults = "";
					for (var i = 0; i != parsedData.queries.length; i++) {
						loadQueryPopoverResults += '<span onclick="loadQuery(\'' + parsedData.queries[i].guid + '\')" class="list-group-item list-group-item-action cursor-pointer">' + parsedData.queries[i].title + '</span>';
					}

					$("#queryLoadBtn").popover("show");
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