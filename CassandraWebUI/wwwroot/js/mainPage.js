function showConnetionModal() {
	$('#connectionModal').modal({ backdrop: 'static', keyboard: false });

	$("#connectionModal").modal("show");
}

function closeConnectionModal() {
	$("#connectionModal").modal("hide");
	$("#title").val("");
	$("#host").val("");
	$("#keyspace").val("");
	$("#username").val("");
	$("#password").val("");

	$("#connectionErrorAlert").addClass("hidden");

	if (!$('#togglePassword i').hasClass("fa-eye-slash")) {
		$('#togglePassword i').addClass("fa-eye-slash");
		$('#togglePassword i').removeClass("fa-eye");
	}

	$("#newConnBtn").removeAttr("guid");
}

function editConnection(guid) {
	$.ajax({
		url: '/api/GetConnection?guid=' + guid,
		type: "GET",
		contentType: "application/json",
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
				$("#title").val(parsedData.connection.name);
				$("#host").val(parsedData.connection.hosts);
				$("#keyspace").val(parsedData.connection.keyspace);
				$("#username").val(parsedData.connection.username);
				$("#password").val(parsedData.connection.password);

				$("#newConnBtn").attr("guid", guid);

				showConnetionModal();
			} else {
				//error validation
			}
		},
		error: function (err) {
			//error validation
		},
	});
}

function addConnection() {

	var connectionData = {
		name: $("#title").val(),
		hosts: $("#host").val(),
		keyspace: $("#keyspace").val(),
		username: $("#username").val(),
		password: $("#password").val()
	};

	if ($("#title").val().length == 0 || $("#host").val().length == 0 || $("#keyspace").val().length == 0) {
		$("#connectionErrorAlertText").html("Please, provide data in Title, Host and Keyspace fields.");
		$("#connectionErrorAlert").removeClass("hidden");
		return;
    }

	var guid = $("#newConnBtn").attr("guid") ? $("#newConnBtn").attr("guid") : "";

	$.ajax({
		url: '/api/AddConnection?guid=' + guid,
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(connectionData),
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
				var newElem = mainListElem.replace("{0}", parsedData.connection.name).replace("{1}", parsedData.connection.guid);
				$("#connectionList").append(newElem);

				$("#newConnBtn").removeAttr("guid");

				var base_url = window.location.origin;
				window.location.href = base_url + "/connections/" + parsedData.connection.guid;
			} else {
				$("#connectionErrorAlertText").html(parsedData.errorMessage);
				$("#connectionErrorAlert").removeClass("hidden");
			}
		},
		error: function (err) {
			$("#connectionErrorAlertText").html(err);
			$("#connectionErrorAlert").removeClass("hidden");
		},
	});

}

function showHidePassword() {
	if ($('#password').attr("type") == "text") {
		$('#password').attr('type', 'password');
		$('#togglePassword i').addClass("fa-eye-slash");
		$('#togglePassword i').removeClass("fa-eye");
	} else if ($('#password').attr("type") == "password") {
		$('#password').attr('type', 'text');
		$('#togglePassword i').removeClass("fa-eye-slash");
		$('#togglePassword i').addClass("fa-eye");
	}
}

function connect(guid) {
	var url = window.location.protocol + "//" + window.location.host + "/connections/" + guid;
	window.location.href = url;
}

function removeConnection(guid) {
	$.ajax({
		url: '/api/DeleteConnection?guid=' + guid,
		type: "GET",
		contentType: "application/json",
		success: function (data) {
			var parsedData = JSON.parse(data);
			if (parsedData.status) {
				window.location.reload();
			} else {
				//error validation
			}
		},
		error: function (err) {
			//error validation
		},
	});
}