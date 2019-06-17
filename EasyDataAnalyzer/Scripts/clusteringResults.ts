import { ChartPoint, Chart } from "chart.js";

namespace EasyDataAnalyzer.Analysis.Results {

    class DatasetModel {
        constructor(data: ChartPoint[], pointsColor: string, showLine: boolean, showPoint: boolean) {
            let bgColor: string[] = [];
            let brdColor: string[] = [];

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

        public showLine: boolean;
        public fill: boolean;
        public tension: number;
        public data: ChartPoint[];
        public backgroundColor: string[];
        public borderColor: string[];
        public borderWidth: number;
        public pointRadius: number;
    }

    class ClusteringService {

        private ElementIDs = {
            ResultChart: "resultChart",
        };

        private Urls = {
            LoadCharts: "LoadCharts",
        };

        private chartColors: string[] = [
            '255, 99, 132',
            '200, 80, 255',
            '50, 100, 255',
            '45, 250, 255',
            '0, 255, 20',
            '230, 255, 60',
            '255, 80, 10',
        ];

        constructor() {
            this.initialize();
        }

        private initialize() {
            let self = this;

            let ResultCanvas = <HTMLCanvasElement>document.getElementById(self.ElementIDs.ResultChart);

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

        private initializeChart(context: CanvasRenderingContext2D, data: ChartPoint[][], axesXLable: string, axesYLabel: string): Chart {
            let self = this;
            let datasets: DatasetModel[] = [];

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

    export let clusteringResults = new ClusteringService();
}