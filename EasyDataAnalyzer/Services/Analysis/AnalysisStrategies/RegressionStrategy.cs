using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Models;
using EasyDataAnalyzer.Models.Analysis;

namespace EasyDataAnalyzer.Services.Analysis.AnalysisStrategies
{
    public class RegressionStrategy : IAnalysisStrategy
    {
        public IAnalysisResult AnalyzeData(List<ImportHeader> headers, List<ImportData> data, List<object> args)
        {
            if (headers.Any(h => h.DataType.Id != (int)ImportDataTypes.Numeric))
            {
                throw new Exception("Невідповідні типи даних змінних.");
            }

            var points = new List<Point>();
            var sequenceX = data.Where(id => id.Header.Id == headers[0].Id);
            foreach (var x in sequenceX)
            {
                var y = data.FirstOrDefault(id => id.Header.Import.Id == x.Header.Import.Id && id.RowNumber == x.RowNumber);
                points.Add(new Point(double.Parse(x.Value), double.Parse(y.Value)));
            }

            var xSample = points.Select(p => p.X).ToList();
            var ySample = points.Select(p => p.Y).ToList();
            var delta = GetDelta(xSample);
            var notDelta = GetNotDelta(ySample);
            var deltaBeta = GetDeltaBeta(xSample, ySample);

            var alpha = GetDeltaAlpha(xSample, ySample) / delta;
            var beta = deltaBeta / delta;
            var notAlpha = GetNotDeltaAlpha(xSample, ySample) / notDelta;
            var notBeta = deltaBeta / notDelta;

            return new RegressionResult
            {
                Result = OperationResult.Success,
                AnalysisMethod = AnalysisMethods.Regression,
                Points = points,
                Alpha = alpha,
                Beta = beta,
                NotAlpha = notAlpha,
                NotBeta = notBeta
            };
        }

        public IChartResults LoadChartsData(List<ImportHeader> headers, List<ImportData> data, IAnalysisResult analysisResult)
        {
            var results = analysisResult as RegressionResult;

            var minX = results.Points.Min(p => p.X);
            var maxX = results.Points.Max(p => p.X);
            var yToX = new List<Point>
            {
                new Point(minX, results.Alpha + results.Beta * minX),
                new Point(maxX, results.Alpha + results.Beta * maxX)
            };

            var minY = results.Points.Min(p => p.Y);
            var maxY = results.Points.Max(p => p.Y);
            var xToY = new List<Point>
            {
                new Point(results.NotAlpha + results.NotBeta * minY, minY),
                new Point(results.NotAlpha + results.NotBeta * maxY, maxY)
            };

            return new RegressionChartModel
            {
                AnalysisData = results.Points,
                XLabel = headers[0].HeaderName,
                YLabel = headers[1].HeaderName,
                YtoX = yToX,
                XtoY = xToY
            };
        }

        private double GetDelta(List<double> xSample)
        {
            return xSample.Count * xSample.Sum(x => x * x) - Math.Pow(xSample.Sum(), 2);
        }

        private double GetDeltaAlpha(List<double> xSample, List<double> ySample)
        {
            double pairSum = 0;
            for (int i = 0; i < xSample.Count; i++)
            {
                pairSum += xSample[i] * ySample[i];
            }
            return xSample.Sum(x => x * x) * ySample.Sum() - xSample.Sum() * pairSum;
        }

        private double GetDeltaBeta(List<double> xSample, List<double> ySample)
        {
            double pairSum = 0;
            for (int i = 0; i < xSample.Count; i++)
            {
                pairSum += xSample[i] * ySample[i];
            }
            return xSample.Count * pairSum - ySample.Sum() * xSample.Sum();
        }

        private double GetNotDelta(List<double> ySample)
        {
            return ySample.Count * ySample.Sum(y => y * y) - Math.Pow(ySample.Sum(), 2);
        }

        private double GetNotDeltaAlpha(List<double> xSample, List<double> ySample)
        {
            double pairSum = 0;
            for (int i = 0; i < xSample.Count; i++)
            {
                pairSum += xSample[i] * ySample[i];
            }
            return ySample.Sum(y => y * y) * xSample.Sum() - ySample.Sum() * pairSum;
        }
    }
}
