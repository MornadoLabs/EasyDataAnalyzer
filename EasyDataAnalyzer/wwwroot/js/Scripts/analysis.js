import 'jquery';
var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Analysis;
    (function (Analysis) {
        class AnalysisService {
            constructor() {
                this.ElementIDs = {
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
                this.ElementClasses = {
                    Selects: "selectDropDown"
                };
                this.Urls = {
                    LoadSettings: "Analysis/LoadAnalyzeSettings",
                };
                this.initUIElements();
                this.initButtons();
                this.updateMethodParamsVisible();
            }
            initUIElements() {
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
            initButtons() {
                let self = this;
                $('#' + self.ElementIDs.OkButton).off('click').click(function () {
                    let selectedRows = $(`#${self.ElementIDs.DataTable} tbody .selected`);
                    let importIds = [];
                    $(selectedRows).each((i) => {
                        let rowId = parseInt($(selectedRows)[i].children[0].children[0].innerHTML);
                        importIds.push(rowId);
                    });
                    let data = {
                        AnalysisMethod: $('#' + self.ElementIDs.AnalysisMethod).val(),
                        AssociationRulesConfidence: $('#' + self.ElementIDs.AssociationRulesConfidence).val(),
                        ClustersCount: $('#' + self.ElementIDs.ClustersCount).val(),
                        ImportIds: importIds
                    };
                    window.location.replace(self.Urls.LoadSettings + '?settings=' + JSON.stringify(data));
                    //window.location.href = self.Urls.LoadSettings + '?settings=' + JSON.stringify(data);
                });
            }
            updateMethodParamsVisible() {
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
        Analysis.analysisService = new AnalysisService();
    })(Analysis = EasyDataAnalyzer.Analysis || (EasyDataAnalyzer.Analysis = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHlzaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9TY3JpcHRzL2FuYWx5c2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sUUFBUSxDQUFDO0FBRWhCLElBQVUsZ0JBQWdCLENBaUh6QjtBQWpIRCxXQUFVLGdCQUFnQjtJQUFDLElBQUEsUUFBUSxDQWlIbEM7SUFqSDBCLFdBQUEsUUFBUTtRQUUvQixNQUFNLGVBQWU7WUErQmpCO2dCQTdCUSxlQUFVLEdBQUc7b0JBQ2pCLGNBQWMsRUFBRSxnQkFBZ0I7b0JBRWhDLHNCQUFzQixFQUFFLHdCQUF3QjtvQkFDaEQsMEJBQTBCLEVBQUUsNEJBQTRCO29CQUV4RCxnQkFBZ0IsRUFBRSxrQkFBa0I7b0JBQ3BDLGFBQWEsRUFBRSxlQUFlO29CQUU5QixZQUFZLEVBQUUsZUFBZTtvQkFDN0IsU0FBUyxFQUFFLG1CQUFtQjtvQkFFOUIsWUFBWSxFQUFFLFFBQVE7b0JBQ3RCLFlBQVksRUFBRSxVQUFVO29CQUN4QixnQkFBZ0IsRUFBRSxjQUFjO29CQUNoQyxlQUFlLEVBQUUsYUFBYTtvQkFDOUIsY0FBYyxFQUFFLFlBQVk7b0JBRTVCLFFBQVEsRUFBRSxVQUFVO2lCQUN2QixDQUFDO2dCQUVNLG1CQUFjLEdBQUc7b0JBQ3JCLE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLENBQUM7Z0JBRU0sU0FBSSxHQUFHO29CQUNYLFlBQVksRUFBRSw4QkFBOEI7aUJBQy9DLENBQUM7Z0JBR0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ3JDLENBQUM7WUFFTyxjQUFjO2dCQUNsQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBRWhCLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7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SSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDdEU7d0JBQ0QsTUFBTTtpQkFDYjtZQUNMLENBQUM7U0FFSjtRQUVVLHdCQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztJQUN2RCxDQUFDLEVBakgwQixRQUFRLEdBQVIseUJBQVEsS0FBUix5QkFBUSxRQWlIbEM7QUFBRCxDQUFDLEVBakhTLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFpSHpCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCAnanF1ZXJ5JztcclxuXHJcbm5hbWVzcGFjZSBFYXN5RGF0YUFuYWx5emVyLkFuYWx5c2lzIHtcclxuXHJcbiAgICBjbGFzcyBBbmFseXNpc1NlcnZpY2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIEVsZW1lbnRJRHMgPSB7XHJcbiAgICAgICAgICAgIEFuYWx5c2lzTWV0aG9kOiBcImFuYWx5c2lzTWV0aG9kXCIsXHJcblxyXG4gICAgICAgICAgICBBc3NvY2lhdGlvblJ1bGVzUGFyYW1zOiBcImFzc29jaWF0aW9uUnVsZXNQYXJhbXNcIixcclxuICAgICAgICAgICAgQXNzb2NpYXRpb25SdWxlc0NvbmZpZGVuY2U6IFwiQXNzb2NpYXRpb25SdWxlc0NvbmZpZGVuY2VcIixcclxuXHJcbiAgICAgICAgICAgIENsdXN0ZXJpbmdQYXJhbXM6IFwiY2x1c3RlcmluZ1BhcmFtc1wiLFxyXG4gICAgICAgICAgICBDbHVzdGVyc0NvdW50OiBcIkNsdXN0ZXJzQ291bnRcIixcclxuXHJcbiAgICAgICAgICAgIEltcG9ydHNDb3VudDogXCJJbXBvcnRzX0NvdW50XCIsXHJcbiAgICAgICAgICAgIERhdGFUYWJsZTogXCJhbmFseXNpc0RhdGFUYWJsZVwiLFxyXG5cclxuICAgICAgICAgICAgSW1wb3J0SWRDZWxsOiBcImltcG9ydFwiLFxyXG4gICAgICAgICAgICBGaWxlTmFtZUNlbGw6IFwiZmlsZU5hbWVcIixcclxuICAgICAgICAgICAgUmVjb3Jkc0NvdW50Q2VsbDogXCJyZWNvcmRzQ291bnRcIixcclxuICAgICAgICAgICAgRXJyb3JzQ291bnRDZWxsOiBcImVycm9yc0NvdW50XCIsXHJcbiAgICAgICAgICAgIEltcG9ydERhdGVDZWxsOiBcImltcG9ydERhdGVcIixcclxuXHJcbiAgICAgICAgICAgIE9rQnV0dG9uOiBcIm9rQnV0dG9uXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFbGVtZW50Q2xhc3NlcyA9IHtcclxuICAgICAgICAgICAgU2VsZWN0czogXCJzZWxlY3REcm9wRG93blwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcmxzID0ge1xyXG4gICAgICAgICAgICBMb2FkU2V0dGluZ3M6IFwiQW5hbHlzaXMvTG9hZEFuYWx5emVTZXR0aW5nc1wiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRVSUVsZW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEJ1dHRvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVNZXRob2RQYXJhbXNWaXNpYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRVSUVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAkKCcuJyArIHRoaXMuRWxlbWVudENsYXNzZXMuU2VsZWN0cykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogLTEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCI3MCVcIixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyMnICsgdGhpcy5FbGVtZW50SURzLkFuYWx5c2lzTWV0aG9kKS5jaGFuZ2UoZnVuY3Rpb24gKCkgeyBzZWxmLnVwZGF0ZU1ldGhvZFBhcmFtc1Zpc2libGUoKTsgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAkKCcjJyArIHRoaXMuRWxlbWVudElEcy5EYXRhVGFibGUpLmRhdGFUYWJsZSgpO1xyXG4gICAgICAgICAgICAkKGAjJHt0aGlzLkVsZW1lbnRJRHMuRGF0YVRhYmxlfSB0Ym9keWApLm9uKCdjbGljaycsICd0cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0QnV0dG9ucygpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAkKCcjJyArIHNlbGYuRWxlbWVudElEcy5Pa0J1dHRvbikub2ZmKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZFJvd3MgPSAkKGAjJHtzZWxmLkVsZW1lbnRJRHMuRGF0YVRhYmxlfSB0Ym9keSAuc2VsZWN0ZWRgKTtcclxuICAgICAgICAgICAgICAgIGxldCBpbXBvcnRJZHM6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgJChzZWxlY3RlZFJvd3MpLmVhY2goKGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93SWQgPSBwYXJzZUludCgkKHNlbGVjdGVkUm93cylbaV0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MKTtcclxuICAgICAgICAgICAgICAgICAgICBpbXBvcnRJZHMucHVzaChyb3dJZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBBbmFseXNpc01ldGhvZDogJCgnIycgKyBzZWxmLkVsZW1lbnRJRHMuQW5hbHlzaXNNZXRob2QpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIEFzc29jaWF0aW9uUnVsZXNDb25maWRlbmNlOiAkKCcjJyArIHNlbGYuRWxlbWVudElEcy5Bc3NvY2lhdGlvblJ1bGVzQ29uZmlkZW5jZSkudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgQ2x1c3RlcnNDb3VudDogJCgnIycgKyBzZWxmLkVsZW1lbnRJRHMuQ2x1c3RlcnNDb3VudCkudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgSW1wb3J0SWRzOiBpbXBvcnRJZHNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHNlbGYuVXJscy5Mb2FkU2V0dGluZ3MgKyAnP3NldHRpbmdzPScgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAvL3dpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VsZi5VcmxzLkxvYWRTZXR0aW5ncyArICc/c2V0dGluZ3M9JyArIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlTWV0aG9kUGFyYW1zVmlzaWJsZSgpIHtcclxuICAgICAgICAgICAgbGV0IG1ldGhvZCA9ICQoJyMnICsgdGhpcy5FbGVtZW50SURzLkFuYWx5c2lzTWV0aG9kKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjJyArIHRoaXMuRWxlbWVudElEcy5DbHVzdGVyaW5nUGFyYW1zKS5oYXNDbGFzcyhcImRpc3BsYXktbm9uZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjJyArIHRoaXMuRWxlbWVudElEcy5DbHVzdGVyaW5nUGFyYW1zKS5yZW1vdmVDbGFzcyhcImRpc3BsYXktbm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCgnIycgKyB0aGlzLkVsZW1lbnRJRHMuQXNzb2NpYXRpb25SdWxlc1BhcmFtcykuaGFzQ2xhc3MoXCJkaXNwbGF5LW5vbmVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnIycgKyB0aGlzLkVsZW1lbnRJRHMuQXNzb2NpYXRpb25SdWxlc1BhcmFtcykuYWRkQ2xhc3MoXCJkaXNwbGF5LW5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjJcIjpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnIycgKyB0aGlzLkVsZW1lbnRJRHMuQXNzb2NpYXRpb25SdWxlc1BhcmFtcykuaGFzQ2xhc3MoXCJkaXNwbGF5LW5vbmVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnIycgKyB0aGlzLkVsZW1lbnRJRHMuQXNzb2NpYXRpb25SdWxlc1BhcmFtcykucmVtb3ZlQ2xhc3MoXCJkaXNwbGF5LW5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoISQoJyMnICsgdGhpcy5FbGVtZW50SURzLkNsdXN0ZXJpbmdQYXJhbXMpLmhhc0NsYXNzKFwiZGlzcGxheS1ub25lXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyMnICsgdGhpcy5FbGVtZW50SURzLkNsdXN0ZXJpbmdQYXJhbXMpLmFkZENsYXNzKFwiZGlzcGxheS1ub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKCcjJyArIHRoaXMuRWxlbWVudElEcy5Bc3NvY2lhdGlvblJ1bGVzUGFyYW1zKS5oYXNDbGFzcyhcImRpc3BsYXktbm9uZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjJyArIHRoaXMuRWxlbWVudElEcy5Bc3NvY2lhdGlvblJ1bGVzUGFyYW1zKS5hZGRDbGFzcyhcImRpc3BsYXktbm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCgnIycgKyB0aGlzLkVsZW1lbnRJRHMuQ2x1c3RlcmluZ1BhcmFtcykuaGFzQ2xhc3MoXCJkaXNwbGF5LW5vbmVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnIycgKyB0aGlzLkVsZW1lbnRJRHMuQ2x1c3RlcmluZ1BhcmFtcykuYWRkQ2xhc3MoXCJkaXNwbGF5LW5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgYW5hbHlzaXNTZXJ2aWNlID0gbmV3IEFuYWx5c2lzU2VydmljZSgpO1xyXG59Il19