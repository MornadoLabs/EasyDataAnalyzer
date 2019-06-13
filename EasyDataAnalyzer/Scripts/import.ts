
import swal from 'sweetalert';

namespace EasyDataAnalyzer.Import {

    export enum ImportMethods {
        ExcelImport = 1,
    }

    class ImportService {

        private ElementIDs = {
            DataTable: "headersTable",
            OkButton: "submitButton",
            TempFilePath: "TempFilePath",
            DateFormat: "Parameters_DateFormat",
            NumericSeparator: "Parameters_NumericSeparator",
            EmptyValueIsNull: "Parameters_EmptyValueIsNull",
            HeadersCount: "Headers_Count",
            Header: "header",
            DataType: "dataTypeHeader",
            Priority: "priorityHeader"
        };

        private ElementClasses = {
            Selects: "selectDropDown"
        };

        private Urls = {
            ProcessImport: "Import/ProcessImport",
            LoadErrorFile: "Import/LoadErrorFile"
        };

        constructor() {
            this.initUIElements();
            this.initButtons();
        }

        private initUIElements(): void {
            $('.' + this.ElementClasses.Selects).select2({
                minimumResultsForSearch: -1,
                width: "50%"
            });
            $('#' + this.ElementIDs.DataTable).dataTable();
        }

        private initButtons(): void {
            let self = this;
            $('#' + this.ElementIDs.OkButton).off('click').click(function (e) {
                let recordsCount: number = <number>$('#' + self.ElementIDs.HeadersCount).val();
                let tempFile = $('#' + self.ElementIDs.TempFilePath).val().toString();
                let parameters = {
                    DateFormat: $('#' + self.ElementIDs.DateFormat).val().toString(),
                    NumericSeparator: $('#' + self.ElementIDs.NumericSeparator).val().toString(),
                    EmptyValueIsNull: $('#' + self.ElementIDs.EmptyValueIsNull).val().toString().toLowerCase() == "true"
                };
                let records: ImportHeaderParameters[] = [];

                for (let i = 0; i < recordsCount; i++) {
                    records.push({
                        HeaderName: $('#' + self.ElementIDs.Header + i.toString()).html().toString(),
                        DataType: <number>$('#' + self.ElementIDs.DataType + i.toString()).val(),
                        PriorityLevel: <number>$('#' + self.ElementIDs.Priority + i.toString()).val(),
                    });
                }

                let data: LoadHeadersViewModel = {
                    TempFilePath: tempFile,
                    ImportMethod: ImportMethods.ExcelImport,
                    Parameters: parameters,
                    HeaderParameters: records
                };

                $.ajax({
                    method: 'POST',
                    url: self.Urls.ProcessImport,
                    data: {
                        param: JSON.stringify(data)
                    },
                    success: function (response) {
                        if (response) {
                            let success: boolean = response.result == OperationResult.Success;
                            swal({
                                title: success ? "Імпорт пройшов успішно!" : "Виникли помилки під час імпорту!",
                                text: response.message,
                                icon: success ? "success": "warning",
                                buttons: {
                                    load: {
                                        text: "Завантажити файл помилок",
                                        value: "load",
                                    },
                                    OK: true,
                                },
                            }).then((value: any) => {
                                if (value == "load") {
                                    try {
                                        $.post(self.Urls.LoadErrorFile, { path: response.errorFilePath });
                                        /*$.ajax({
                                            method: 'POST',
                                            url: self.Urls.LoadErrorFile,
                                            data: { path: response.errorFilePath },
                                            success: function (errorFile: File) {
                                                console.log(errorFile.name);
                                            }
                                        });*/
                                        //window.location = response.errorFilePath;                                        
                                    }
                                    catch (ex) {
                                        console.log(ex);
                                    }
                                }
                            });
                        }
                    }
                });
            });

        }
    }

    class LoadHeadersViewModel {
        public TempFilePath: string;
        public ImportMethod: ImportMethods;
        public Parameters: ImportParametersModel;
        public HeaderParameters: ImportHeaderParameters[];
    }

    class ImportHeaderParameters {
        public HeaderName: string;
        public DataType: number;
        public PriorityLevel: number;
    }

    class ImportParametersModel {
        public DateFormat: string;
        public NumericSeparator: string;
        public EmptyValueIsNull: boolean;
    }

    enum OperationResult {
        Success = 1,
        Warning = 2,
        Error = 3,
        Info = 4
    }

    export let importService = new ImportService();
}