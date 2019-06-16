import 'jquery';
var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Import;
    (function (Import) {
        class ImportHistoryService {
            constructor() {
                this.ElementIDs = {
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
                this.Urls = {
                    LoadParams: "Import/LoadImportParams",
                    LoadData: "Import/LoadImportData",
                };
                this.initUIElements();
                this.initButtons();
            }
            initUIElements() {
                let self = this;
                $('#' + this.ElementIDs.DataTable).dataTable();
            }
            initButtons() {
            }
        }
        Import.importHistory = new ImportHistoryService();
    })(Import = EasyDataAnalyzer.Import || (EasyDataAnalyzer.Import = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0SGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1NjcmlwdHMvaW1wb3J0SGlzdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFFBQVEsQ0FBQztBQUVoQixJQUFVLGdCQUFnQixDQXlDekI7QUF6Q0QsV0FBVSxnQkFBZ0I7SUFBQyxJQUFBLE1BQU0sQ0F5Q2hDO0lBekMwQixXQUFBLE1BQU07UUFFN0IsTUFBTSxvQkFBb0I7WUFzQnRCO2dCQXBCUSxlQUFVLEdBQUc7b0JBRWpCLFlBQVksRUFBRSxlQUFlO29CQUM3QixTQUFTLEVBQUUsd0JBQXdCO29CQUVuQyxZQUFZLEVBQUUsUUFBUTtvQkFDdEIsWUFBWSxFQUFFLFVBQVU7b0JBQ3hCLGdCQUFnQixFQUFFLGNBQWM7b0JBQ2hDLGVBQWUsRUFBRSxhQUFhO29CQUM5QixjQUFjLEVBQUUsWUFBWTtvQkFFNUIsZ0JBQWdCLEVBQUUsWUFBWTtvQkFDOUIsY0FBYyxFQUFFLFVBQVU7aUJBQzdCLENBQUM7Z0JBRU0sU0FBSSxHQUFHO29CQUNYLFVBQVUsRUFBRSx5QkFBeUI7b0JBQ3JDLFFBQVEsRUFBRSx1QkFBdUI7aUJBQ3BDLENBQUM7Z0JBR0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUVPLGNBQWM7Z0JBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztnQkFFaEIsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25ELENBQUM7WUFFTyxXQUFXO1lBRW5CLENBQUM7U0FDSjtRQUVVLG9CQUFhLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0lBQzFELENBQUMsRUF6QzBCLE1BQU0sR0FBTix1QkFBTSxLQUFOLHVCQUFNLFFBeUNoQztBQUFELENBQUMsRUF6Q1MsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQXlDekIiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICdqcXVlcnknO1xyXG5cclxubmFtZXNwYWNlIEVhc3lEYXRhQW5hbHl6ZXIuSW1wb3J0IHtcclxuXHJcbiAgICBjbGFzcyBJbXBvcnRIaXN0b3J5U2VydmljZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgRWxlbWVudElEcyA9IHtcclxuXHJcbiAgICAgICAgICAgIEltcG9ydHNDb3VudDogXCJJbXBvcnRzX0NvdW50XCIsXHJcbiAgICAgICAgICAgIERhdGFUYWJsZTogXCJpbXBvcnRIaXN0b3J5RGF0YVRhYmxlXCIsXHJcblxyXG4gICAgICAgICAgICBJbXBvcnRJZENlbGw6IFwiaW1wb3J0XCIsXHJcbiAgICAgICAgICAgIEZpbGVOYW1lQ2VsbDogXCJmaWxlTmFtZVwiLFxyXG4gICAgICAgICAgICBSZWNvcmRzQ291bnRDZWxsOiBcInJlY29yZHNDb3VudFwiLFxyXG4gICAgICAgICAgICBFcnJvcnNDb3VudENlbGw6IFwiZXJyb3JzQ291bnRcIixcclxuICAgICAgICAgICAgSW1wb3J0RGF0ZUNlbGw6IFwiaW1wb3J0RGF0ZVwiLFxyXG5cclxuICAgICAgICAgICAgTG9hZFBhcmFtc0J1dHRvbjogXCJsb2FkUGFyYW1zXCIsXHJcbiAgICAgICAgICAgIExvYWREYXRhQnV0dG9uOiBcImxvYWREYXRhXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcmxzID0ge1xyXG4gICAgICAgICAgICBMb2FkUGFyYW1zOiBcIkltcG9ydC9Mb2FkSW1wb3J0UGFyYW1zXCIsXHJcbiAgICAgICAgICAgIExvYWREYXRhOiBcIkltcG9ydC9Mb2FkSW1wb3J0RGF0YVwiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRVSUVsZW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEJ1dHRvbnMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdFVJRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICQoJyMnICsgdGhpcy5FbGVtZW50SURzLkRhdGFUYWJsZSkuZGF0YVRhYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRCdXR0b25zKCkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbXBvcnRIaXN0b3J5ID0gbmV3IEltcG9ydEhpc3RvcnlTZXJ2aWNlKCk7XHJcbn0iXX0=