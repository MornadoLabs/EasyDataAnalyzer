var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Analysis;
    (function (Analysis) {
        class AnalysisSettingService {
            constructor() {
                this.ElementIDs = {
                    X_Field: "xField",
                    Y_Field: "yField",
                    OkButton: "okButton",
                };
                this.ElementClasses = {
                    Selects: "selectDropDown"
                };
                this.Urls = {
                    AnalyzeData: "AnalyzeData",
                };
                this.initUIElements();
                this.initButtons();
            }
            initUIElements() {
                $('.' + this.ElementClasses.Selects).select2({
                    minimumResultsForSearch: -1,
                    width: "50%"
                });
            }
            initButtons() {
                let self = this;
                $('#' + self.ElementIDs.OkButton).off('click').click(function () {
                    let xField = $('#' + self.ElementIDs.X_Field).val();
                    let yField = $('#' + self.ElementIDs.Y_Field).val();
                    window.location.replace(self.Urls.AnalyzeData + '?xField=' + xField + '&yField=' + yField);
                    //window.location.href = self.Urls.AnalyzeData + '?xField=' + xField + '&yField=' + yField;
                });
            }
        }
        Analysis.analysisSettingService = new AnalysisSettingService();
    })(Analysis = EasyDataAnalyzer.Analysis || (EasyDataAnalyzer.Analysis = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZVNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vU2NyaXB0cy9hbmFseXplU2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBVSxnQkFBZ0IsQ0EyQ3pCO0FBM0NELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxRQUFRLENBMkNsQztJQTNDMEIsV0FBQSxRQUFRO1FBRS9CLE1BQU0sc0JBQXNCO1lBZ0J4QjtnQkFkUSxlQUFVLEdBQUc7b0JBQ2pCLE9BQU8sRUFBRSxRQUFRO29CQUNqQixPQUFPLEVBQUUsUUFBUTtvQkFDakIsUUFBUSxFQUFFLFVBQVU7aUJBQ3ZCLENBQUM7Z0JBRU0sbUJBQWMsR0FBRztvQkFDckIsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQztnQkFFTSxTQUFJLEdBQUc7b0JBQ1gsV0FBVyxFQUFFLGFBQWE7aUJBQzdCLENBQUM7Z0JBR0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUVPLGNBQWM7Z0JBQ2xCLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3pDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxFQUFFLEtBQUs7aUJBQ2YsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVPLFdBQVc7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDakQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUM1RCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBRyxNQUFNLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDO29CQUMzRiwyRkFBMkY7Z0JBQy9GLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUVKO1FBRVUsK0JBQXNCLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO0lBQ3JFLENBQUMsRUEzQzBCLFFBQVEsR0FBUix5QkFBUSxLQUFSLHlCQUFRLFFBMkNsQztBQUFELENBQUMsRUEzQ1MsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQTJDekIiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubmFtZXNwYWNlIEVhc3lEYXRhQW5hbHl6ZXIuQW5hbHlzaXMge1xyXG5cclxuICAgIGNsYXNzIEFuYWx5c2lzU2V0dGluZ1NlcnZpY2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIEVsZW1lbnRJRHMgPSB7XHJcbiAgICAgICAgICAgIFhfRmllbGQ6IFwieEZpZWxkXCIsXHJcbiAgICAgICAgICAgIFlfRmllbGQ6IFwieUZpZWxkXCIsXHJcbiAgICAgICAgICAgIE9rQnV0dG9uOiBcIm9rQnV0dG9uXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFbGVtZW50Q2xhc3NlcyA9IHtcclxuICAgICAgICAgICAgU2VsZWN0czogXCJzZWxlY3REcm9wRG93blwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcmxzID0ge1xyXG4gICAgICAgICAgICBBbmFseXplRGF0YTogXCJBbmFseXplRGF0YVwiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRVSUVsZW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEJ1dHRvbnMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdFVJRWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgICQoJy4nICsgdGhpcy5FbGVtZW50Q2xhc3Nlcy5TZWxlY3RzKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiAtMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjUwJVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0QnV0dG9ucygpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAkKCcjJyArIHNlbGYuRWxlbWVudElEcy5Pa0J1dHRvbikub2ZmKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCB4RmllbGQgPSA8bnVtYmVyPiQoJyMnICsgc2VsZi5FbGVtZW50SURzLlhfRmllbGQpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHlGaWVsZCA9IDxudW1iZXI+JCgnIycgKyBzZWxmLkVsZW1lbnRJRHMuWV9GaWVsZCkudmFsKCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShzZWxmLlVybHMuQW5hbHl6ZURhdGEgKyAnP3hGaWVsZD0nICsgeEZpZWxkICsgJyZ5RmllbGQ9JyArIHlGaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAvL3dpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VsZi5VcmxzLkFuYWx5emVEYXRhICsgJz94RmllbGQ9JyArIHhGaWVsZCArICcmeUZpZWxkPScgKyB5RmllbGQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBhbmFseXNpc1NldHRpbmdTZXJ2aWNlID0gbmV3IEFuYWx5c2lzU2V0dGluZ1NlcnZpY2UoKTtcclxufSJdfQ==