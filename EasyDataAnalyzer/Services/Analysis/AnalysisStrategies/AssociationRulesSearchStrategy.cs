using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Accord.MachineLearning.Rules;
using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Models.Analysis;

namespace EasyDataAnalyzer.Services.Analysis.AnalysisStrategies
{
    public class AssociationRulesSearchStrategy : IAnalysisStrategy
    {
        public IAnalysisResult AnalyzeData(List<ImportHeader> headers, List<ImportData> data, List<object> args)
        {
            if (args.Count < 1)
            {
                throw new Exception("Мінімальне значення затребуваності не задано.");
            }

            var idHeader = headers.FirstOrDefault(h => h.HeaderName.Contains("ID", StringComparison.CurrentCultureIgnoreCase));
            if (idHeader == null)
            {
                throw new Exception("Не знайдено колонки ID.");
            }

            var confidence = (double)args[0];
            var apriori = new Apriori<string>(2, confidence);
            var dataSet = GetDataSet(data);
            var classifier = apriori.Learn(dataSet);

            return new AssociationRulesSearchResult
            {
                Result = Enums.OperationResult.Success,
                AnalysisMethod = Enums.AnalysisMethods.AssociationRulesSearch,
                Rules = classifier.Rules
            };
        }

        public IChartResults LoadChartsData(List<ImportHeader> headers, List<ImportData> data, IAnalysisResult analysisResult)
        {
            return null;
        }

        private SortedSet<string>[] GetDataSet(List<ImportData> data)
        {
            var rowNumbers = data.Select(d => d.RowNumber).Distinct().ToList();
            var result = new SortedSet<string>[rowNumbers.Count];
            for (int i = 0; i < rowNumbers.Count; i++)
            {
                var rowData = data.Where(d => d.RowNumber == rowNumbers[i]);
                foreach (var rowCell in rowData)
                {
                    result[i].Add(rowCell.Value);
                }
            }

            return result;
        }
    }
}
