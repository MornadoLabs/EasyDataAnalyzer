
namespace EasyDataAnalyzer.Import {

    export enum ImportParameters {
        DataTimeFormat = 1,
        SetEmptyValueAsNull = 2,
        MoneySeparator = 3
    }

    class ImportService {

        constructor() {
            this.initButtons();
        }

        private initButtons(): void {
            $('#btnUpload').on('click', function () {
                let fileExtension = ['xls', 'xlsx'];
                let filename = <any>$('#fUpload').val();
                if (!filename) {
                    alert("Please select a file.");
                    return false;
                }
                else {
                    let extension = filename.replace(/^.*\./, '');
                    if ($.inArray(extension, fileExtension) == -1) {
                        alert("Please select only excel files.");
                        return false;
                    }
                }
                let fdata = new FormData();
                let fileUpload = <any>$("#fUpload").get(0);
                let files = fileUpload.files;
                fdata.append(files[0].name, files[0]);
                /*
                let importParameters = { "1": fdata.get("dataFormat"), "2": fdata.get("emptyValueIsNull"), "3": fdata.get("moneySeparator") };
                fdata.append("importParameters", <any>importParameters);*/

                //$.post("/Import/LoadHeaders", fdata);

                $.ajax({
                    type: "POST",
                    url: "/Import/LoadHeaders?handler=Import",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("XSRF-TOKEN",
                            <string>$('input:hidden[name="__RequestVerificationToken"]').val());
                    },
                    data: fdata,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.length == 0)
                            alert('Some error occured while uploading');
                        else {
                            $('#dvData').html(response);
                        }
                    },
                    error: function (e) {
                        $('#dvData').html(e.responseText);
                    }
                });
            })
        }
    }

    export let importService = new ImportService();
}