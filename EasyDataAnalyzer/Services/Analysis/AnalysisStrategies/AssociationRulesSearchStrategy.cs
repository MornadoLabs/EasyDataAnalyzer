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

        private Dictionary<string, Dictionary<string, bool>> NormalizeData(ImportHeader idHeader, List<ImportHeader> headers, List<ImportData> data)
        {
            var normalizedData = new Dictionary<string, Dictionary<string, bool>>();
            var transactionIds = data.Where(d => d.Header.Id == idHeader.Id).Distinct().ToList();
            var elementsHeaders = headers.Where(h => h.Id != idHeader.Id).Distinct().ToList();

            foreach (var transaction in transactionIds)
            {
                var dataRow = new Dictionary<string, bool>();
                foreach (var header in elementsHeaders)
                {
                    var valueExists = data.FirstOrDefault(d => d.Header.Id == header.Id && d.RowNumber == transaction.RowNumber);
                    dataRow.Add(header.HeaderName, valueExists != null);
                }
                normalizedData.Add(transaction.Value, dataRow);
            }

            return normalizedData;
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
