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

            var middleX = points.Sum(p => p.X) / points.Count;
            var middleY = points.Sum(p => p.Y) / points.Count;
            var alpha = (points.Sum(p => p.X * p.Y) + points.Count * middleX * middleY) 
                / (points.Sum(p => p.X * p.X) - points.Count * middleX * middleX);
            var beta = middleY - alpha * middleX;

            return new RegressionResult
            {
                Result = OperationResult.Success,
                AnalysisMethod = AnalysisMethods.Regression,
                Points = points,
                Alpha = alpha,
                Beta = beta
            };
        }
    }
}
