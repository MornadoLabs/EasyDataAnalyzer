
import 'jquery';

namespace EasyDataAnalyzer.Analysis {

    class AnalysisHistoryService {

        private ElementIDs = {

            AnalysisHistoriesCount: "AnalysisHistories_Count",
            DataTable: "analysisHistoryDataTable",

            ImportIdCell: "analysis",
            ImportDateCell: "analysisDate",

            LoadDataButton: "loadData",
            LoadResultsButton: "loadResults",
        };

        private Urls = {
            LoadParams: "Import/LoadAnalysisParams",
            LoadData: "Import/LoadAnalysisData",
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

    export let analysisHistory = new AnalysisHistoryService();
}