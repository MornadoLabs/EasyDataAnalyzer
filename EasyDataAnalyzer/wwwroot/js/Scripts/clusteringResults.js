import { Chart } from "chart.js";
var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Analysis;
    (function (Analysis) {
        var Results;
        (function (Results) {
            class DatasetModel {
                constructor(data, pointsColor, showLine, showPoint) {
                    let bgColor = [];
                    let brdColor = [];
                    data.forEach((i) => {
                        bgColor.push('rgba(' + pointsColor + ', 0.2)');
                        brdColor.push('rgba(' + pointsColor + ', 1)');
                    });
                    this.showLine = showLine;
                    this.fill = false;
                    this.tension = 0;
                    this.data = data;
                    this.backgroundColor = bgColor;
                    this.borderColor = brdColor;
                    this.borderWidth = 2;
                    this.pointRadius = showPoint ? 5 : 0;
                }
            }
            class ClusteringService {
                constructor() {
                    this.ElementIDs = {
                        ResultChart: "resultChart",
                    };
                    this.Urls = {
                        LoadCharts: "LoadCharts",
                    };
                    this.chartColors = [
                        '255, 99, 132',
                        '200, 80, 255',
                        '50, 100, 255',
                        '45, 250, 255',
                        '0, 255, 20',
                        '230, 255, 60',
                        '255, 80, 10',
                    ];
                    this.initialize();
                }
                initialize() {
                    let self = this;
                    let ResultCanvas = document.getElementById(self.ElementIDs.ResultChart);
                    let ResultContext = ResultCanvas.getContext("2d");
                    $.ajax({
                        url: self.Urls.LoadCharts,
                        async: false,
                        method: "GET",
                        success: (response) => {
                            let resultChart = self.initializeChart(ResultContext, response.clusters, response.xLabel, response.yLabel);
                        }
                    });
                }
                initializeChart(context, data, axesXLable, axesYLabel) {
                    let self = this;
                    let datasets = [];
                    data.forEach((e, i) => {
                        datasets.push(new DatasetModel(e, self.chartColors[i], false, true));
                    });
                    let chart = new Chart(context, {
                        type: 'scatter',
                        data: {
                            datasets: datasets,
                        },
                        options: {
                            legend: {
                                display: false
                            },
                            scales: {
                                xAxes: [{
                                        position: 'bottom',
                                        type: 'linear',
                                        gridLines: {
                                            display: false
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: axesXLable,
                                            fontSize: 16,
                                            fontStyle: 'bold'
                                        }
                                    }],
                                yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: axesYLabel,
                                            fontSize: 16,
                                            fontStyle: 'bold'
                                        }
                                    }]
                            },
                        }
                    });
                    return chart;
                }
            }
            Results.clusteringResults = new ClusteringService();
        })(Results = Analysis.Results || (Analysis.Results = {}));
    })(Analysis = EasyDataAnalyzer.Analysis || (EasyDataAnalyzer.Analysis = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3RlcmluZ1Jlc3VsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9TY3JpcHRzL2NsdXN0ZXJpbmdSZXN1bHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFN0MsSUFBVSxnQkFBZ0IsQ0F5SHpCO0FBekhELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxRQUFRLENBeUhsQztJQXpIMEIsV0FBQSxRQUFRO1FBQUMsSUFBQSxPQUFPLENBeUgxQztRQXpIbUMsV0FBQSxPQUFPO1lBRXZDLE1BQU0sWUFBWTtnQkFDZCxZQUFZLElBQWtCLEVBQUUsV0FBbUIsRUFBRSxRQUFpQixFQUFFLFNBQWtCO29CQUN0RixJQUFJLE9BQU8sR0FBYSxFQUFFLENBQUM7b0JBQzNCLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztvQkFFNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQzt3QkFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDO29CQUNsRCxDQUFDLENBQUMsQ0FBQztvQkFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztvQkFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7b0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO29CQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFdBQVcsR0FB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UUFDM0QsQ0FBQyxFQXpIbUMsT0FBTyxHQUFQLGdCQUFPLEtBQVAsZ0JBQU8sUUF5SDFDO0lBQUQsQ0FBQyxFQXpIMEIsUUFBUSxHQUFSLHlCQUFRLEtBQVIseUJBQVEsUUF5SGxDO0FBQUQsQ0FBQyxFQXpIUyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBeUh6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYXJ0UG9pbnQsIENoYXJ0IH0gZnJvbSBcImNoYXJ0LmpzXCI7XHJcblxyXG5uYW1lc3BhY2UgRWFzeURhdGFBbmFseXplci5BbmFseXNpcy5SZXN1bHRzIHtcclxuXHJcbiAgICBjbGFzcyBEYXRhc2V0TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGE6IENoYXJ0UG9pbnRbXSwgcG9pbnRzQ29sb3I6IHN0cmluZywgc2hvd0xpbmU6IGJvb2xlYW4sIHNob3dQb2ludDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBsZXQgYmdDb2xvcjogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGJyZENvbG9yOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBiZ0NvbG9yLnB1c2goJ3JnYmEoJyArIHBvaW50c0NvbG9yICsgJywgMC4yKScpO1xyXG4gICAgICAgICAgICAgICAgYnJkQ29sb3IucHVzaCgncmdiYSgnICsgcG9pbnRzQ29sb3IgKyAnLCAxKScpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0xpbmUgPSBzaG93TGluZTtcclxuICAgICAgICAgICAgdGhpcy5maWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudGVuc2lvbiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5ib3JkZXJDb2xvciA9IGJyZENvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLmJvcmRlcldpZHRoID0gMjtcclxuICAgICAgICAgICAgdGhpcy5wb2ludFJhZGl1cyA9IHNob3dQb2ludCA/IDUgOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3dMaW5lOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBmaWxsOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyB0ZW5zaW9uOiBudW1iZXI7XHJcbiAgICAgICAgcHVibGljIGRhdGE6IENoYXJ0UG9pbnRbXTtcclxuICAgICAgICBwdWJsaWMgYmFja2dyb3VuZENvbG9yOiBzdHJpbmdbXTtcclxuICAgICAgICBwdWJsaWMgYm9yZGVyQ29sb3I6IHN0cmluZ1tdO1xyXG4gICAgICAgIHB1YmxpYyBib3JkZXJXaWR0aDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBwb2ludFJhZGl1czogbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIENsdXN0ZXJpbmdTZXJ2aWNlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBFbGVtZW50SURzID0ge1xyXG4gICAgICAgICAgICBSZXN1bHRDaGFydDogXCJyZXN1bHRDaGFydFwiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHByaXZhdGUgVXJscyA9IHtcclxuICAgICAgICAgICAgTG9hZENoYXJ0czogXCJMb2FkQ2hhcnRzXCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjaGFydENvbG9yczogc3RyaW5nW10gPSBbXHJcbiAgICAgICAgICAgICcyNTUsIDk5LCAxMzInLFxyXG4gICAgICAgICAgICAnMjAwLCA4MCwgMjU1JyxcclxuICAgICAgICAgICAgJzUwLCAxMDAsIDI1NScsXHJcbiAgICAgICAgICAgICc0NSwgMjUwLCAyNTUnLFxyXG4gICAgICAgICAgICAnMCwgMjU1LCAyMCcsXHJcbiAgICAgICAgICAgICcyMzAsIDI1NSwgNjAnLFxyXG4gICAgICAgICAgICAnMjU1LCA4MCwgMTAnLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgbGV0IFJlc3VsdENhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLkVsZW1lbnRJRHMuUmVzdWx0Q2hhcnQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IFJlc3VsdENvbnRleHQgPSBSZXN1bHRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogc2VsZi5VcmxzLkxvYWRDaGFydHMsXHJcbiAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0Q2hhcnQgPSBzZWxmLmluaXRpYWxpemVDaGFydChSZXN1bHRDb250ZXh0LCByZXNwb25zZS5jbHVzdGVycywgcmVzcG9uc2UueExhYmVsLCByZXNwb25zZS55TGFiZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZUNoYXJ0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZGF0YTogQ2hhcnRQb2ludFtdW10sIGF4ZXNYTGFibGU6IHN0cmluZywgYXhlc1lMYWJlbDogc3RyaW5nKTogQ2hhcnQge1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxldCBkYXRhc2V0czogRGF0YXNldE1vZGVsW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGF0YXNldHMucHVzaChuZXcgRGF0YXNldE1vZGVsKGUsIHNlbGYuY2hhcnRDb2xvcnNbaV0sIGZhbHNlLCB0cnVlKSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjaGFydCA9IG5ldyBDaGFydChjb250ZXh0LCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2NhdHRlcicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM6IGRhdGFzZXRzLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lYXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogYXhlc1hMYWJsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFN0eWxlOiAnYm9sZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlBeGVzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6IGF4ZXNZTGFiZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2JvbGQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGFydDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgY2x1c3RlcmluZ1Jlc3VsdHMgPSBuZXcgQ2x1c3RlcmluZ1NlcnZpY2UoKTtcclxufSJdfQ==