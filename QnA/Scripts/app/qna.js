$("#addButton").click(function () {
    var question = $('#question').val();
    var answer = $('#answer').val();

    $('#question').val("");
    $('#answer').val("");

    $('#xmlTextArea').val($('#xmlTextArea').val() + "<catalog><question>" + question + "</question><answer>" + answer + "</answer></catalog>");
});

document.getElementById('get_file').onclick = function () {
    document.getElementById('my_file').click();
};

$('input[type=file]').change(function (e) {
    $('#customfileupload').html($(this).val());
    fileChosen(this, document.getElementById('xmlTextArea'));
});

function readTextFile(file, callback, encoding) {
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
        callback(this.result);
    });
    if (encoding) reader.readAsText(file, encoding);
    else reader.readAsText(file);
}

function fileChosen(input, output) {
    if (input.files && input.files[0]) {
        readTextFile(
            input.files[0],
            function (str) {
                output.value = str;
            }
        );
    }
}

$("#saveXMLButton").click(function () {

    var xml = '<?xml version="1.0" encoding="UTF-8" ?>';
    xml += '<qna>' + $('#xmlTextArea').val() + '</qna>';

    var ajaxInfoMessage = $.ajax({
        type: 'POST',
        url: "/Home/WriteToFile",
        //contentType: "text/xml",
        //dataType: "text",
        data: {
            "xml": xml
        }
    });
    ajaxInfoMessage.done(updateInformation);
});

function updateInformation() {
    //$('informationHeader').append("<p>The file has been successfully saved!</p>");
    document.getElementById('informationHeader').innerHTML = "The file has been successfully saved!";
}