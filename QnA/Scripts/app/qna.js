function QnA(question, answer) {
    var self = this;

    self.question = ko.observable(question);
    self.answer = ko.observable(answer);
    self.showQuestionTemplate = ko.observable(false);
    self.showAnswerTemplate = ko.observable(false);
    self.showQuestion = ko.observable(true);
    self.showAnswer = ko.observable(true);
}

function QnAViewModel() {
    var self = this;

    self.question = ko.observable("");
    self.answer = ko.observable("");

    self.informationHeader = ko.observable("");

    self.qna = ko.observableArray([
        new QnA("What is your name?", "My name is John Cena!"),
        new QnA("What is your pet's name?", "Big"),
        new QnA("Guilty!", "Wat?")
    ]);

    self.addQna = function () {
        if (self.question() !== "" && self.answer() !== "") {
            self.qna.push(new QnA(self.question(), self.answer()));
            self.question('');
            self.answer('');
        }
    }

    self.removeQna = function (qnaObject) { self.qna.remove(qnaObject) }

    self.serializeQNA = function () {
        var finalXML = '<?xml version="1.0" encoding="UTF-8" ?>';
        finalXML += "<qnaTable>";
        self.qna().forEach(function (item) {
            finalXML += "<qna><question>" + item.question() + "</question><answer>" + item.answer() + "</answer></qna>";
        });
        finalXML += "</qnaTable>";
        return finalXML;
    }

    self.saveXML = function () {

        var qnaXML = self.serializeQNA();

        var ajaxInfoMessage = $.ajax({
            type: 'POST',
            url: "/Home/WriteToFile",
            contentType: "text/xml",
            dataType: "text",
            data: qnaXML
        });
        ajaxInfoMessage.done(function () {
            self.informationHeader("The file has been successfully saved!");
            setInterval(function () { self.informationHeader(""); }, 5000);
        });
    }

    var uploadFile = null;

    self.getFile = function () {
        $('#my_file').click();
        $('input[type=file]').change(function (e) {
            var fakeFilePath = $(this).val();
            $('#customfileupload').val(fakeFilePath);
            uploadFile = this;
        });
    }

    self.uploadFile = function () {
        self.fileChosen(uploadFile, null);
        $('#customfileupload').val('');
        uploadFile = null;
        $('input[type=file]').val('');
    }

    self.readTextFile = function (file, callback, encoding) {
        var reader = new FileReader();
        reader.addEventListener('load', function (e) {
            callback(this.result);
        });
        if (encoding) reader.readAsText(file, encoding);
        else reader.readAsText(file);
    }

    self.fileChosen = function (input, output) {
        if (input.files && input.files[0]) {
            self.readTextFile(
                input.files[0],
                self.loadTable 
            );
        }
    } 

    self.loadTable = function (xmlFileData) {
        //remove everything from the qna array
        self.qna.removeAll();

        //get the data and add it to the qna
        var xmlData = $.parseXML(xmlFileData);
        $(xmlData).find("qna").each(function () {
            var question = $(this).find('question').text();
            var answer = $(this).find('answer').text();
            self.qna.push(new QnA(question, answer));
        });
    } 

    self.changeTemplateQuestion = function (modelQna) {
        if (modelQna.showQuestion) {
            modelQna.showQuestion(false);
            modelQna.showQuestionTemplate(true);
        } 
    }

    self.changeTemplateAnswer = function (modelQna) {
        if (modelQna.showAnswer) {
            modelQna.showAnswer(false);
            modelQna.showAnswerTemplate(true);
        }
    }

    self.cancelModifyAnswer = function (modelQna) {
        if (modelQna.showAnswerTemplate) {
            modelQna.showAnswer(true);
            modelQna.showAnswerTemplate(false);
        }
    }

    self.cancelModifyQuestion = function (modelQna) {
        if (modelQna.showQuestionTemplate) {
            modelQna.showQuestion(true);
            modelQna.showQuestionTemplate(false);
        }
    }  
}