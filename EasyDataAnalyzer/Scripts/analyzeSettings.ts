
namespace EasyDataAnalyzer.Analysis {

    class AnalysisSettingService {

        private ElementIDs = {
            X_Field: "xField",
            Y_Field: "yField",
            OkButton: "okButton",
        };

        private ElementClasses = {
            Selects: "selectDropDown"
        };

        private Urls = {
            AnalyzeData: "AnalyzeData",
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
        }

        private initButtons() {
            let self = this;
            $('#' + self.ElementIDs.OkButton).off('click').click(function () {
                let xField = <number>$('#' + self.ElementIDs.X_Field).val();
                let yField = <number>$('#' + self.ElementIDs.Y_Field).val();
                window.location.replace(self.Urls.AnalyzeData + '?xField=' + xField + '&yField=' + yField);
                //window.location.href = self.Urls.AnalyzeData + '?xField=' + xField + '&yField=' + yField;
            });
        }

    }

    export let analysisSettingService = new AnalysisSettingService();
}