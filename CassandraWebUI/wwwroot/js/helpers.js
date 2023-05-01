//JSON check function
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//file help function
function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName, contentType, byte) {
    var blob = new Blob([byte], { type: contentType });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
}

//vizual helpers
function generateRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    let returnColors = {
        rgbaOpacityCol: 'rgba(' + parseInt(randomColor.slice(-6, -4), 16)
            + ', ' + parseInt(randomColor.slice(-4, -2), 16)
            + ', ' + parseInt(randomColor.slice(-2), 16)
            + ', 0.2)',

        rgbaCol: 'rgba(' + parseInt(randomColor.slice(-6, -4), 16)
            + ', ' + parseInt(randomColor.slice(-4, -2), 16)
            + ', ' + parseInt(randomColor.slice(-2), 16)
            + ', 1)',
    };

    return returnColors;
}