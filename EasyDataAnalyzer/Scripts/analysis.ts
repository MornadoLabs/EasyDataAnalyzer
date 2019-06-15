
import 'jquery';

namespace EasyDataAnalyzer.Analysis {

    class AnalysisService {

        private ElementIDs = {
            AnalysisMethod: "analysisMethod",

            AssociationRulesParams: "associationRulesParams",
            AssociationRulesConfidence: "AssociationRulesConfidence",

            ClusteringParams: "clusteringParams",
            ClustersCount: "ClustersCount",

            ImportsCount: "Imports_Count",
            DataTable: "analysisDataTable",

            ImportIdCell: "import",
            FileNameCell: "fileName",
            RecordsCountCell: "recordsCount",
            ErrorsCountCell: "errorsCount",
            ImportDateCell: "importDate",

            OkButton: "okButton",
        };

        private ElementClasses = {
            Selects: "selectDropDown"
        };

        private Urls = {
            LoadSettings: "Analysis/LoadAnalyzeSettings",
        };

        constructor() {
            this.initUIElements();
            this.initButtons();
            this.updateMethodParamsVisible();
        }

        private initUIElements(): void {
            let self = this;

            $('.' + this.ElementClasses.Selects).select2({
                minimumResultsForSearch: -1,
                width: "70%",
            });
            $('#' + this.ElementIDs.AnalysisMethod).change(function () { self.updateMethodParamsVisible(); });
            
            $('#' + this.ElementIDs.DataTable).dataTable();
            $(`#${this.ElementIDs.DataTable} tbody`).on('click', 'tr', function () {
                $(this).toggleClass('selected');
            });
        }

        private initButtons() {
            let self = this;
            $('#' + self.ElementIDs.OkButton).off('click').click(function () {
                let selectedRows = $(`#${self.ElementIDs.DataTable} tbody .selected`);
                let importIds: number[] = [];

                $(selectedRows).each((i) => {
                    let rowId = parseInt($(selectedRows)[i].children[0].children[0].innerHTML);
                    importIds.push(rowId);
                });

                let data = {
                    AnalysisMethod: $('#' + self.ElementIDs.AnalysisMethod).val(),
                    AssociationRulesConfidence: $('#' + self.ElementIDs.AssociationRulesConfidence).val(),
                    ClustersCount: $('#' + self.ElementIDs.ClustersCount).val(),
                    ImportIds: importIds
                }
                window.location.replace(self.Urls.LoadSettings + '?settings=' + JSON.stringify(data));
                //window.location.href = self.Urls.LoadSettings + '?settings=' + JSON.stringify(data);
            });
        }

        private updateMethodParamsVisible() {
            let method = $('#' + this.ElementIDs.AnalysisMethod).val();

            switch (method) {
                case "1":
                    if ($('#' + this.ElementIDs.ClusteringParams).hasClass("display-none")) {
                        $('#' + this.ElementIDs.ClusteringParams).removeClass("display-none");
                    }

                    if (!$('#' + this.ElementIDs.AssociationRulesParams).hasClass("display-none")) {
                        $('#' + this.ElementIDs.AssociationRulesParams).addClass("display-none");
                    }
                    break;
                case "2":
                    if ($('#' + this.ElementIDs.AssociationRulesParams).hasClass("display-none")) {
                        $('#' + this.ElementIDs.AssociationRulesParams).removeClass("display-none");
                    }

                    if (!$('#' + this.ElementIDs.ClusteringParams).hasClass("display-none")) {
                        $('#' + this.ElementIDs.ClusteringParams).addClass("display-none");
                    }
                    break;
                default:
                    if (!$('#' + this.ElementIDs.AssociationRulesParams).hasClass("display-none")) {
                        $('#' + this.ElementIDs.AssociationRulesParams).addClass("display-none");
                    }

                    if (!$('#' + this.ElementIDs.ClusteringParams).hasClass("display-none")) {
                        $('#' + this.ElementIDs.ClusteringParams).addClass("display-none");
                    }
                    break;
            }
        }
        
    }

    export let analysisService = new AnalysisService();
}