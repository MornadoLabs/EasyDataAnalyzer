
import 'jquery';

namespace EasyDataAnalyzer.Import {

    class ImportHistoryService {

        private ElementIDs = {

            ImportsCount: "Imports_Count",
            DataTable: "importHistoryDataTable",

            ImportIdCell: "import",
            FileNameCell: "fileName",
            RecordsCountCell: "recordsCount",
            ErrorsCountCell: "errorsCount",
            ImportDateCell: "importDate",

            LoadParamsButton: "loadParams",
            LoadDataButton: "loadData",

            InfoModal: "infoModal",
            InfoModalHeader: "infoModalHeader",
            InfoModalBody: "infoModalBody",

            ParametersInfoTable: "parametersInfoTable"
        };

        private Urls = {
            LoadParams: "LoadImportParams",
            LoadData: "LoadImportData",
        };

        constructor() {
            this.initUIElements();
            this.initButtons();
        }

        private initUIElements(): void {
            let self = this;

            $('#' + this.ElementIDs.DataTable).dataTable();
        }

        private initButtons() {
            let self = this;
            let count = <number>$('#' + self.ElementIDs.ImportsCount).val();

            for (let i = 0; i < count; i++) {
                $('#' + self.ElementIDs.LoadParamsButton + i.toString())
                    .off('click').click(function () {
                        let importId = $('#' + self.ElementIDs.ImportIdCell + i.toString()).html();
                        $.ajax({
                            url: self.Urls.LoadParams,
                            type: 'GET',
                            cache: false,
                            async: true,
                            dataType: "html",
                            data: { importId: importId }
                        })
                            .done(function (result) {
                                $('#' + self.ElementIDs.InfoModalHeader).html('Параметри імпорту');
                                $('#' + self.ElementIDs.InfoModalBody).html(result);
                                $('#' + self.ElementIDs.ParametersInfoTable).dataTable();
                            }).fail(function (xhr) {
                                console.log('error : ' + xhr.status + ' - ' + xhr.statusText + ' - ' + xhr.responseText);
                            });
                    });

                $('#' + self.ElementIDs.LoadDataButton + i.toString())
                    .off('click').click(function () {
                        let importId = $('#' + self.ElementIDs.ImportIdCell + i.toString()).html();
                        $.ajax({
                            url: self.Urls.LoadData,
                            type: 'GET',
                            cache: false,
                            async: true,
                            dataType: "html",
                            data: { importId: importId }
                        })
                            .done(function (result) {
                                $('#' + self.ElementIDs.InfoModalHeader).html('Дані імпорту');
                                $('#' + self.ElementIDs.InfoModalBody).html(result);
                                $('#' + self.ElementIDs.ParametersInfoTable).dataTable();
                            }).fail(function (xhr) {
                                console.log('error : ' + xhr.status + ' - ' + xhr.statusText + ' - ' + xhr.responseText);
                            });
                    });
            }

        }
    }

    export let importHistory = new ImportHistoryService();
}