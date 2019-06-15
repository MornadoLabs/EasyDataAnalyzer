import { Chart } from "chart.js";
var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Analysis;
    (function (Analysis) {
        var Results;
        (function (Results) {
            class DatasetModel {
                constructor(data, showLine, showPoint) {
                    this.showLine = showLine;
                    this.fill = false;
                    this.tension = 0;
                    this.data = data;
                    this.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
                    this.borderColor = ['rgba(255,99,132,1)'];
                    this.borderWidth = 2;
                    this.pointRadius = showPoint ? 5 : 0;
                }
            }
            Results.DatasetModel = DatasetModel;
            class RegressionService {
                constructor() {
                    this.ElementIDs = {
                        YToXChart: "YToXChart",
                        XToYChart: "XToYChart",
                    };
                    this.Urls = {
                        LoadSettings: "Analysis/LoadCharts",
                    };
                    this.initialize();
                }
                initialize() {
                    let self = this;
                    let YToXCanvas = document.getElementById(self.ElementIDs.YToXChart);
                    let XToYCanvas = document.getElementById(self.ElementIDs.XToYChart);
                    let YToXContext = YToXCanvas.getContext("2d");
                    let XToYContext = XToYCanvas.getContext("2d");
                    $.ajax({
                        url: self.Urls.LoadSettings,
                        async: false,
                        method: "GET",
                        success: (response) => {
                            let YToXChart = self.initializeChart(YToXContext, response.AnalysisData, response.YtoX, response.XLabel, response.YLabel);
                            let XToYChart = self.initializeChart(XToYContext, response.AnalysisData, response.XtoY, response.YLabel, response.XLabel);
                        }
                    });
                }
                initializeChart(context, points, resultChart, axesXLable, axesYLabel) {
                    let datasets = [];
                    datasets.push(new DatasetModel(points, true, false));
                    datasets.push(new DatasetModel(resultChart, false, true));
                    let minX = points[0].x, minY = points[0].y, maxX = points[0].x, maxY = points[0].y;
                    for (let i = 1; i < points.length; i++) {
                        if (points[i].x < minX) {
                            minX = points[i].x;
                        }
                        if (points[i].x > maxX) {
                            maxX = points[i].x;
                        }
                        if (points[i].y < minY) {
                            minY = points[i].y;
                        }
                        if (points[i].y > maxY) {
                            maxY = points[i].y;
                        }
                    }
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
                                        ticks: {
                                            min: minX - 1,
                                            max: maxX + 1
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: axesXLable,
                                            fontSize: 16,
                                            fontStyle: 'bold'
                                        }
                                    }],
                                yAxes: [{
                                        ticks: {
                                            min: minY - 1,
                                            max: maxY + 1
                                        },
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
            Results.regressionResults = new RegressionService();
        })(Results = Analysis.Results || (Analysis.Results = {}));
    })(Analysis = EasyDataAnalyzer.Analysis || (EasyDataAnalyzer.Analysis = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvblJlc3VsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9TY3JpcHRzL3JlZ3Jlc3Npb25SZXN1bHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFN0MsSUFBVSxnQkFBZ0IsQ0FvSXpCO0FBcElELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxRQUFRLENBb0lsQztJQXBJMEIsV0FBQSxRQUFRO1FBQUMsSUFBQSxPQUFPLENBb0kxQztRQXBJbUMsV0FBQSxPQUFPO1lBRXZDLE1BQWEsWUFBWTtnQkFDckIsWUFBWSxJQUFrQixFQUFFLFFBQWlCLEVBQUUsU0FBa0I7b0JBQ2pFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO29CQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztvQkFDbkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7YUFVSjtZQXBCWSxvQkFBWSxlQW9CeEIsQ0FBQTtZQUVELE1BQU0saUJBQWlCO2dCQVduQjtvQkFUUSxlQUFVLEdBQUc7d0JBQ2pCLFNBQVMsRUFBRSxXQUFXO3dCQUN0QixTQUFTLEVBQUUsV0FBVztxQkFDekIsQ0FBQztvQkFFTSxTQUFJLEdBQUc7d0JBQ1gsWUFBWSxFQUFFLHFCQUFxQjtxQkFDdEMsQ0FBQztv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QztJQUFELENBQUMsRUFwSTBCLFFBQVEsR0FBUix5QkFBUSxLQUFSLHlCQUFRLFFBb0lsQztBQUFELENBQUMsRUFwSVMsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQW9JekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFydFBvaW50LCBDaGFydCB9IGZyb20gXCJjaGFydC5qc1wiO1xyXG5cclxubmFtZXNwYWNlIEVhc3lEYXRhQW5hbHl6ZXIuQW5hbHlzaXMuUmVzdWx0cyB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIERhdGFzZXRNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoZGF0YTogQ2hhcnRQb2ludFtdLCBzaG93TGluZTogYm9vbGVhbiwgc2hvd1BvaW50OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0xpbmUgPSBzaG93TGluZTtcclxuICAgICAgICAgICAgdGhpcy5maWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudGVuc2lvbiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gWydyZ2JhKDI1NSwgOTksIDEzMiwgMC4yKSddO1xyXG4gICAgICAgICAgICB0aGlzLmJvcmRlckNvbG9yID0gWydyZ2JhKDI1NSw5OSwxMzIsMSknXTtcclxuICAgICAgICAgICAgdGhpcy5ib3JkZXJXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRSYWRpdXMgPSBzaG93UG9pbnQgPyA1IDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93TGluZTogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgZmlsbDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgdGVuc2lvbjogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBkYXRhOiBDaGFydFBvaW50W107XHJcbiAgICAgICAgcHVibGljIGJhY2tncm91bmRDb2xvcjogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIGJvcmRlckNvbG9yOiBzdHJpbmdbXTtcclxuICAgICAgICBwdWJsaWMgYm9yZGVyV2lkdGg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgcG9pbnRSYWRpdXM6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBSZWdyZXNzaW9uU2VydmljZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgRWxlbWVudElEcyA9IHtcclxuICAgICAgICAgICAgWVRvWENoYXJ0OiBcIllUb1hDaGFydFwiLFxyXG4gICAgICAgICAgICBYVG9ZQ2hhcnQ6IFwiWFRvWUNoYXJ0XCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcmxzID0ge1xyXG4gICAgICAgICAgICBMb2FkU2V0dGluZ3M6IFwiQW5hbHlzaXMvTG9hZENoYXJ0c1wiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgbGV0IFlUb1hDYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5FbGVtZW50SURzLllUb1hDaGFydCk7XHJcbiAgICAgICAgICAgIGxldCBYVG9ZQ2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuRWxlbWVudElEcy5YVG9ZQ2hhcnQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IFlUb1hDb250ZXh0ID0gWVRvWENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIGxldCBYVG9ZQ29udGV4dCA9IFhUb1lDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogc2VsZi5VcmxzLkxvYWRTZXR0aW5ncyxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBZVG9YQ2hhcnQgPSBzZWxmLmluaXRpYWxpemVDaGFydChZVG9YQ29udGV4dCwgcmVzcG9uc2UuQW5hbHlzaXNEYXRhLCByZXNwb25zZS5ZdG9YLCByZXNwb25zZS5YTGFiZWwsIHJlc3BvbnNlLllMYWJlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFhUb1lDaGFydCA9IHNlbGYuaW5pdGlhbGl6ZUNoYXJ0KFhUb1lDb250ZXh0LCByZXNwb25zZS5BbmFseXNpc0RhdGEsIHJlc3BvbnNlLlh0b1ksIHJlc3BvbnNlLllMYWJlbCwgcmVzcG9uc2UuWExhYmVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRpYWxpemVDaGFydChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHBvaW50czogQ2hhcnRQb2ludFtdLCByZXN1bHRDaGFydDogQ2hhcnRQb2ludFtdLCBheGVzWExhYmxlOiBzdHJpbmcsIGF4ZXNZTGFiZWw6IHN0cmluZyk6IENoYXJ0IHtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXRzID0gW107XHJcbiAgICAgICAgICAgIGRhdGFzZXRzLnB1c2gobmV3IERhdGFzZXRNb2RlbChwb2ludHMsIHRydWUsIGZhbHNlKSk7XHJcbiAgICAgICAgICAgIGRhdGFzZXRzLnB1c2gobmV3IERhdGFzZXRNb2RlbChyZXN1bHRDaGFydCwgZmFsc2UsIHRydWUpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtaW5YID0gPG51bWJlcj5wb2ludHNbMF0ueCxcclxuICAgICAgICAgICAgICAgIG1pblkgPSA8bnVtYmVyPnBvaW50c1swXS55LFxyXG4gICAgICAgICAgICAgICAgbWF4WCA9IDxudW1iZXI+cG9pbnRzWzBdLngsXHJcbiAgICAgICAgICAgICAgICBtYXhZID0gPG51bWJlcj5wb2ludHNbMF0ueTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnggPCBtaW5YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluWCA9IDxudW1iZXI+cG9pbnRzW2ldLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnggPiBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IDxudW1iZXI+cG9pbnRzW2ldLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnkgPCBtaW5ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluWSA9IDxudW1iZXI+cG9pbnRzW2ldLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnkgPiBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IDxudW1iZXI+cG9pbnRzW2ldLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBjaGFydCA9IG5ldyBDaGFydChjb250ZXh0LCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2NhdHRlcicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM6IGRhdGFzZXRzLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lYXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogbWluWCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBtYXhYICsgMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiBheGVzWExhYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdib2xkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogbWluWSAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBtYXhZICsgMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nOiBheGVzWUxhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdib2xkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhcnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IHJlZ3Jlc3Npb25SZXN1bHRzID0gbmV3IFJlZ3Jlc3Npb25TZXJ2aWNlKCk7XHJcbn0iXX0=