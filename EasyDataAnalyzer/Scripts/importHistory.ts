
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
        };

        private Urls = {
            LoadParams: "Import/LoadImportParams",
            LoadData: "Import/LoadImportData",
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

        }
    }

    export let importHistory = new ImportHistoryService();
}