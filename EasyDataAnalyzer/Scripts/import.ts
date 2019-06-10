
import swal from 'sweetalert';

namespace EasyDataAnalyzer.Import {

    export enum ImportParameters {
        DataTimeFormat = 1,
        SetEmptyValueAsNull = 2,
        MoneySeparator = 3
    }

    class ImportService {

        private ElementIDs = {
            DataTable: "headersTable"
        };

        private ElementClasses = {
            Selects: "selectDropDown"
        };

        constructor() {
            this.initUIElements();
            this.initButtons();
        }

        private initUIElements(): void {
            $('.' + this.ElementClasses.Selects).select2();
            $('#' + this.ElementIDs.DataTable).dataTable();
            swal('Success');
        }

        private initButtons(): void {

        }
    }

    export let importService = new ImportService();
}