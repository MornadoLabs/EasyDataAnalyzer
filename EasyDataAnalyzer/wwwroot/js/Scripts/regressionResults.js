import { Chart } from "chart.js";
var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Analysis;
    (function (Analysis) {
        var Results;
        (function (Results) {
            class DatasetModel {
                constructor(data, showLine, showPoint) {
                    let bgColor = [];
                    let brdColor = [];
                    data.forEach((i) => {
                        bgColor.push('rgba(255, 99, 132, 0.2)');
                        brdColor.push('rgba(255, 99, 132, 1)');
                    });
                    this.showLine = showLine;
                    this.fill = false;
                    this.tension = 0;
                    this.data = data;
                    //this.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
                    //this.borderColor = ['rgba(255, 99, 132, 1)'];
                    this.backgroundColor = bgColor;
                    this.borderColor = brdColor;
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
                        LoadSettings: "LoadCharts",
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
                            let data = response.analysisData;
                            let chartData = response.ytoX;
                            let YToXChart = self.initializeChart(YToXContext, data, response.ytoX, response.xLabel, response.yLabel);
                            let reversedData = [];
                            let reversedChart = [];
                            data.forEach((e, i) => {
                                reversedData.push({ x: e.y, y: e.x, r: e.r, t: e.t });
                            });
                            chartData.forEach((e, i) => {
                                reversedChart.push({ x: e.y, y: e.x, r: e.r, t: e.t });
                            });
                            let XToYChart = self.initializeChart(XToYContext, reversedData, reversedChart, response.yLabel, response.xLabel);
                        }
                    });
                }
                initializeChart(context, points, resultChart, axesXLable, axesYLabel) {
                    let datasets = [];
                    datasets.push(new DatasetModel(resultChart, true, false));
                    datasets.push(new DatasetModel(points, false, true));
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
                                            min: minX - 10,
                                            max: maxX + 10
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
                                            min: minY - 10,
                                            max: maxY + 10
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvblJlc3VsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9TY3JpcHRzL3JlZ3Jlc3Npb25SZXN1bHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFN0MsSUFBVSxnQkFBZ0IsQ0F5SnpCO0FBekpELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxRQUFRLENBeUpsQztJQXpKMEIsV0FBQSxRQUFRO1FBQUMsSUFBQSxPQUFPLENBeUoxQztRQXpKbUMsV0FBQSxPQUFPO1lBRXZDLE1BQWEsWUFBWTtnQkFDckIsWUFBWSxJQUFrQixFQUFFLFFBQWlCLEVBQUUsU0FBa0I7b0JBQ2pFLElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztvQkFDM0IsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO29CQUU1QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO3dCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7b0JBQzNDLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO29CQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNqQixxREFBcUQ7b0JBQ3JELCtDQUErQztvQkFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7b0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO29CQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsQ0FBQyxD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QUFoQixnQkFBZ0IsUUF5SnpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhcnRQb2ludCwgQ2hhcnQgfSBmcm9tIFwiY2hhcnQuanNcIjtcclxuXHJcbm5hbWVzcGFjZSBFYXN5RGF0YUFuYWx5emVyLkFuYWx5c2lzLlJlc3VsdHMge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEYXRhc2V0TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGE6IENoYXJ0UG9pbnRbXSwgc2hvd0xpbmU6IGJvb2xlYW4sIHNob3dQb2ludDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBsZXQgYmdDb2xvcjogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGJyZENvbG9yOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBiZ0NvbG9yLnB1c2goJ3JnYmEoMjU1LCA5OSwgMTMyLCAwLjIpJyk7XHJcbiAgICAgICAgICAgICAgICBicmRDb2xvci5wdXNoKCdyZ2JhKDI1NSwgOTksIDEzMiwgMSknKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNob3dMaW5lID0gc2hvd0xpbmU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnRlbnNpb24gPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICAvL3RoaXMuYmFja2dyb3VuZENvbG9yID0gWydyZ2JhKDI1NSwgOTksIDEzMiwgMC4yKSddO1xyXG4gICAgICAgICAgICAvL3RoaXMuYm9yZGVyQ29sb3IgPSBbJ3JnYmEoMjU1LCA5OSwgMTMyLCAxKSddO1xyXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3I7XHJcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyQ29sb3IgPSBicmRDb2xvcjtcclxuICAgICAgICAgICAgdGhpcy5ib3JkZXJXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRSYWRpdXMgPSBzaG93UG9pbnQgPyA1IDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzaG93TGluZTogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgZmlsbDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgdGVuc2lvbjogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBkYXRhOiBDaGFydFBvaW50W107XHJcbiAgICAgICAgcHVibGljIGJhY2tncm91bmRDb2xvcjogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIGJvcmRlckNvbG9yOiBzdHJpbmdbXTtcclxuICAgICAgICBwdWJsaWMgYm9yZGVyV2lkdGg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgcG9pbnRSYWRpdXM6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBSZWdyZXNzaW9uU2VydmljZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgRWxlbWVudElEcyA9IHtcclxuICAgICAgICAgICAgWVRvWENoYXJ0OiBcIllUb1hDaGFydFwiLFxyXG4gICAgICAgICAgICBYVG9ZQ2hhcnQ6IFwiWFRvWUNoYXJ0XCIsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcmxzID0ge1xyXG4gICAgICAgICAgICBMb2FkU2V0dGluZ3M6IFwiTG9hZENoYXJ0c1wiLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgbGV0IFlUb1hDYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5FbGVtZW50SURzLllUb1hDaGFydCk7XHJcbiAgICAgICAgICAgIGxldCBYVG9ZQ2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuRWxlbWVudElEcy5YVG9ZQ2hhcnQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IFlUb1hDb250ZXh0ID0gWVRvWENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIGxldCBYVG9ZQ29udGV4dCA9IFhUb1lDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogc2VsZi5VcmxzLkxvYWRTZXR0aW5ncyxcclxuICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhOiBDaGFydFBvaW50W10gPSByZXNwb25zZS5hbmFseXNpc0RhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXJ0RGF0YTogQ2hhcnRQb2ludFtdID0gcmVzcG9uc2UueXRvWDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgWVRvWENoYXJ0ID0gc2VsZi5pbml0aWFsaXplQ2hhcnQoWVRvWENvbnRleHQsIGRhdGEsIHJlc3BvbnNlLnl0b1gsIHJlc3BvbnNlLnhMYWJlbCwgcmVzcG9uc2UueUxhYmVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJldmVyc2VkRGF0YTogQ2hhcnRQb2ludFtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJldmVyc2VkQ2hhcnQ6IENoYXJ0UG9pbnRbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlZERhdGEucHVzaCh7IHg6IGUueSwgeTogZS54LCByOiBlLnIsIHQ6IGUudCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFydERhdGEuZm9yRWFjaCgoZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlZENoYXJ0LnB1c2goeyB4OiBlLnksIHk6IGUueCwgcjogZS5yLCB0OiBlLnQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFhUb1lDaGFydCA9IHNlbGYuaW5pdGlhbGl6ZUNoYXJ0KFhUb1lDb250ZXh0LCByZXZlcnNlZERhdGEsIHJldmVyc2VkQ2hhcnQsIHJlc3BvbnNlLnlMYWJlbCwgcmVzcG9uc2UueExhYmVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRpYWxpemVDaGFydChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHBvaW50czogQ2hhcnRQb2ludFtdLCByZXN1bHRDaGFydDogQ2hhcnRQb2ludFtdLCBheGVzWExhYmxlOiBzdHJpbmcsIGF4ZXNZTGFiZWw6IHN0cmluZyk6IENoYXJ0IHtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXRzID0gW107XHJcbiAgICAgICAgICAgIGRhdGFzZXRzLnB1c2gobmV3IERhdGFzZXRNb2RlbChyZXN1bHRDaGFydCwgdHJ1ZSwgZmFsc2UpKTtcclxuICAgICAgICAgICAgZGF0YXNldHMucHVzaChuZXcgRGF0YXNldE1vZGVsKHBvaW50cywgZmFsc2UsIHRydWUpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtaW5YID0gPG51bWJlcj5wb2ludHNbMF0ueCxcclxuICAgICAgICAgICAgICAgIG1pblkgPSA8bnVtYmVyPnBvaW50c1swXS55LFxyXG4gICAgICAgICAgICAgICAgbWF4WCA9IDxudW1iZXI+cG9pbnRzWzBdLngsXHJcbiAgICAgICAgICAgICAgICBtYXhZID0gPG51bWJlcj5wb2ludHNbMF0ueTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnggPCBtaW5YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluWCA9IDxudW1iZXI+cG9pbnRzW2ldLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnggPiBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IDxudW1iZXI+cG9pbnRzW2ldLng7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnkgPCBtaW5ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluWSA9IDxudW1iZXI+cG9pbnRzW2ldLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldLnkgPiBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IDxudW1iZXI+cG9pbnRzW2ldLnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBjaGFydCA9IG5ldyBDaGFydChjb250ZXh0LCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2NhdHRlcicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM6IGRhdGFzZXRzLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lYXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogbWluWCAtIDEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heDogbWF4WCArIDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmc6IGF4ZXNYTGFibGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2JvbGQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5QXhlczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluOiBtaW5ZIC0gMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBtYXhZICsgMTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZUxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFN0cmluZzogYXhlc1lMYWJlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFN0eWxlOiAnYm9sZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNoYXJ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCByZWdyZXNzaW9uUmVzdWx0cyA9IG5ldyBSZWdyZXNzaW9uU2VydmljZSgpO1xyXG59Il19