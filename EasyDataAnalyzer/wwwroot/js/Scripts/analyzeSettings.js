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
                });
            }
        }
        Analysis.analysisSettingService = new AnalysisSettingService();
    })(Analysis = EasyDataAnalyzer.Analysis || (EasyDataAnalyzer.Analysis = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZVNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vU2NyaXB0cy9hbmFseXplU2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBVSxnQkFBZ0IsQ0EwQ3pCO0FBMUNELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxRQUFRLENBMENsQztJQTFDMEIsV0FBQSxRQUFRO1FBRS9CLE1BQU0sc0JBQXNCO1lBZ0J4QjtnQkFkUSxlQUFVLEdBQUc7b0JBQ2pCLE9BQU8sRUFBRSxRQUFRO29CQUNqQixPQUFPLEVBQUUsUUFBUTtvQkFDakIsUUFBUSxFQUFFLFVBQVU7aUJBQ3ZCLENBQUM7Z0JBRU0sbUJBQWMsR0FBRztvQkFDckIsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQztnQkFFTSxTQUFJLEdBQUc7b0JBQ1gsV0FBVyxFQUFFLGFBQWE7aUJBQzdCLENBQUM7Z0JBR0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUVPLGNBQWM7Z0JBQ2xCLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3pDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxFQUFFLEtBQUs7aUJBQ2YsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVPLFdBQVc7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDakQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUM1RCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBRyxNQUFNLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUMvRixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FFSjtRQUVVLCtCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUNyRSxDQUFDLEVBMUMwQixRQUFRLEdBQVIseUJBQVEsS0FBUix5QkFBUSxRQTBDbEM7QUFBRCxDQUFDLEVBMUNTLGdCQUFnQixLQUFoQixnQkFBZ0IsUUEwQ3pCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbm5hbWVzcGFjZSBFYXN5RGF0YUFuYWx5emVyLkFuYWx5c2lzIHtcclxuXHJcbiAgICBjbGFzcyBBbmFseXNpc1NldHRpbmdTZXJ2aWNlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFbGVtZW50SURzID0ge1xyXG4gICAgICAgICAgICBYX0ZpZWxkOiBcInhGaWVsZFwiLFxyXG4gICAgICAgICAgICBZX0ZpZWxkOiBcInlGaWVsZFwiLFxyXG4gICAgICAgICAgICBPa0J1dHRvbjogXCJva0J1dHRvblwiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHByaXZhdGUgRWxlbWVudENsYXNzZXMgPSB7XHJcbiAgICAgICAgICAgIFNlbGVjdHM6IFwic2VsZWN0RHJvcERvd25cIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHByaXZhdGUgVXJscyA9IHtcclxuICAgICAgICAgICAgQW5hbHl6ZURhdGE6IFwiQW5hbHl6ZURhdGFcIixcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0VUlFbGVtZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRCdXR0b25zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRVSUVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAkKCcuJyArIHRoaXMuRWxlbWVudENsYXNzZXMuU2VsZWN0cykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogLTEsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCI1MCVcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdEJ1dHRvbnMoKSB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgJCgnIycgKyBzZWxmLkVsZW1lbnRJRHMuT2tCdXR0b24pLm9mZignY2xpY2snKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgeEZpZWxkID0gPG51bWJlcj4kKCcjJyArIHNlbGYuRWxlbWVudElEcy5YX0ZpZWxkKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIGxldCB5RmllbGQgPSA8bnVtYmVyPiQoJyMnICsgc2VsZi5FbGVtZW50SURzLllfRmllbGQpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2Uoc2VsZi5VcmxzLkFuYWx5emVEYXRhICsgJz94RmllbGQ9JyArIHhGaWVsZCArICcmeUZpZWxkPScgKyB5RmllbGQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgYW5hbHlzaXNTZXR0aW5nU2VydmljZSA9IG5ldyBBbmFseXNpc1NldHRpbmdTZXJ2aWNlKCk7XHJcbn0iXX0=