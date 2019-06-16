import 'jquery';
var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Analysis;
    (function (Analysis) {
        class AnalysisHistoryService {
            constructor() {
                this.ElementIDs = {
                    AnalysisHistoriesCount: "AnalysisHistories_Count",
                    DataTable: "analysisHistoryDataTable",
                    ImportIdCell: "analysis",
                    ImportDateCell: "analysisDate",
                    LoadDataButton: "loadData",
                    LoadResultsButton: "loadResults",
                };
                this.Urls = {
                    LoadParams: "Import/LoadAnalysisParams",
                    LoadData: "Import/LoadAnalysisData",
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
        Analysis.analysisHistory = new AnalysisHistoryService();
    })(Analysis = EasyDataAnalyzer.Analysis || (EasyDataAnalyzer.Analysis = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHlzaXNIaXN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vU2NyaXB0cy9hbmFseXNpc0hpc3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxRQUFRLENBQUM7QUFFaEIsSUFBVSxnQkFBZ0IsQ0FzQ3pCO0FBdENELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxRQUFRLENBc0NsQztJQXRDMEIsV0FBQSxRQUFRO1FBRS9CLE1BQU0sc0JBQXNCO1lBbUJ4QjtnQkFqQlEsZUFBVSxHQUFHO29CQUVqQixzQkFBc0IsRUFBRSx5QkFBeUI7b0JBQ2pELFNBQVMsRUFBRSwwQkFBMEI7b0JBRXJDLFlBQVksRUFBRSxVQUFVO29CQUN4QixjQUFjLEVBQUUsY0FBYztvQkFFOUIsY0FBYyxFQUFFLFVBQVU7b0JBQzFCLGlCQUFpQixFQUFFLGFBQWE7aUJBQ25DLENBQUM7Z0JBRU0sU0FBSSxHQUFHO29CQUNYLFVBQVUsRUFBRSwyQkFBMkI7b0JBQ3ZDLFFBQVEsRUFBRSx5QkFBeUI7aUJBQ3RDLENBQUM7Z0JBR0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUVPLGNBQWM7Z0JBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztnQkFFaEIsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25ELENBQUM7WUFFTyxXQUFXO1lBRW5CLENBQUM7U0FDSjtRQUVVLHdCQUFlLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO0lBQzlELENBQUMsRUF0QzBCLFFBQVEsR0FBUix5QkFBUSxLQUFSLHlCQUFRLFFBc0NsQztBQUFELENBQUMsRUF0Q1MsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQXNDekIiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICdqcXVlcnknO1xyXG5cclxubmFtZXNwYWNlIEVhc3lEYXRhQW5hbHl6ZXIuQW5hbHlzaXMge1xyXG5cclxuICAgIGNsYXNzIEFuYWx5c2lzSGlzdG9yeVNlcnZpY2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIEVsZW1lbnRJRHMgPSB7XHJcblxyXG4gICAgICAgICAgICBBbmFseXNpc0hpc3Rvcmllc0NvdW50OiBcIkFuYWx5c2lzSGlzdG9yaWVzX0NvdW50XCIsXHJcbiAgICAgICAgICAgIERhdGFUYWJsZTogXCJhbmFseXNpc0hpc3RvcnlEYXRhVGFibGVcIixcclxuXHJcbiAgICAgICAgICAgIEltcG9ydElkQ2VsbDogXCJhbmFseXNpc1wiLFxyXG4gICAgICAgICAgICBJbXBvcnREYXRlQ2VsbDogXCJhbmFseXNpc0RhdGVcIixcclxuXHJcbiAgICAgICAgICAgIExvYWREYXRhQnV0dG9uOiBcImxvYWREYXRhXCIsXHJcbiAgICAgICAgICAgIExvYWRSZXN1bHRzQnV0dG9uOiBcImxvYWRSZXN1bHRzXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcmxzID0ge1xyXG4gICAgICAgICAgICBMb2FkUGFyYW1zOiBcIkltcG9ydC9Mb2FkQW5hbHlzaXNQYXJhbXNcIixcclxuICAgICAgICAgICAgTG9hZERhdGE6IFwiSW1wb3J0L0xvYWRBbmFseXNpc0RhdGFcIixcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0VUlFbGVtZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRCdXR0b25zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRVSUVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAkKCcjJyArIHRoaXMuRWxlbWVudElEcy5EYXRhVGFibGUpLmRhdGFUYWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0QnV0dG9ucygpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgYW5hbHlzaXNIaXN0b3J5ID0gbmV3IEFuYWx5c2lzSGlzdG9yeVNlcnZpY2UoKTtcclxufSJdfQ==