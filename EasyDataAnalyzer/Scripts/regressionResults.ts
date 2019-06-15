import { ChartPoint, Chart } from "chart.js";

namespace EasyDataAnalyzer.Analysis.Results {

    export class DatasetModel {
        constructor(data: ChartPoint[], showLine: boolean, showPoint: boolean) {
            this.showLine = showLine;
            this.fill = false;
            this.tension = 0;
            this.data = data;
            this.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
            this.borderColor = ['rgba(255,99,132,1)'];
            this.borderWidth = 2;
            this.pointRadius = showPoint ? 5 : 0;
        }

        public showLine: boolean;
        public fill: boolean;
        public tension: number;
        public data: ChartPoint[];
        public backgroundColor: string[];
        public borderColor: string[];
        public borderWidth: number;
        public pointRadius: number;
    }

    class RegressionService {

        private ElementIDs = {
            YToXChart: "YToXChart",
            XToYChart: "XToYChart",
        };

        private Urls = {
            LoadSettings: "Analysis/LoadCharts",
        };

        constructor() {
            this.initialize();
        }

        private initialize() {
            let self = this;

            let YToXCanvas = <HTMLCanvasElement>document.getElementById(self.ElementIDs.YToXChart);
            let XToYCanvas = <HTMLCanvasElement>document.getElementById(self.ElementIDs.XToYChart);

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

        private initializeChart(context: CanvasRenderingContext2D, points: ChartPoint[], resultChart: ChartPoint[], axesXLable: string, axesYLabel: string): Chart {
            let datasets = [];
            datasets.push(new DatasetModel(points, true, false));
            datasets.push(new DatasetModel(resultChart, false, true));

            let minX = <number>points[0].x,
                minY = <number>points[0].y,
                maxX = <number>points[0].x,
                maxY = <number>points[0].y;

            for (let i = 1; i < points.length; i++) {
                if (points[i].x < minX) {
                    minX = <number>points[i].x;
                }
                if (points[i].x > maxX) {
                    maxX = <number>points[i].x;
                }
                if (points[i].y < minY) {
                    minY = <number>points[i].y;
                }
                if (points[i].y > maxY) {
                    maxY = <number>points[i].y;
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

    export let regressionResults = new RegressionService();
}