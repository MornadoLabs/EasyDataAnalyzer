using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Models.Analysis;
using EasyDataAnalyzer.Repositories;
using EasyDataAnalyzer.Services.Analysis.AnalysisStrategies;
using EasyDataAnalyzer.Services.Import;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Analysis
{
    public class AnalysisService : IAnalysisService
    {
        private IAnalysisStrategy AnalysisStrategy { get; set; }
        private IAnalysisRepository AnalysisRepository { get; set; }
        private IImportService ImportService { get; set; }

        public AnalysisService(IAnalysisRepository analysisRepository, IImportService importService)
        {
            AnalysisRepository = analysisRepository;
            ImportService = importService;
            AnalysisStrategy = new ClusteringStrategy();
        }

        public List<UserImport> LoadUserImports(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return new List<UserImport>();
            }

            return AnalysisRepository.LoadUserImports(userId);
        }

        public List<ImportHeader> LoadImportHeaders(List<long> importIds)
        {
            return AnalysisRepository.LoadImportHeaders(importIds);
        }

        public IAnalysisResult AnalyzeData(AnalysisParametersModel parameters)
        {
            SetAnalysisStrategy(parameters.AnalysisMethod);
            var data = ImportService.LoadDataByImportId(parameters.ImportIds);
            var headers = ImportService.LoadImportHeadersById(parameters.MainHeadersId);
            return AnalysisStrategy.AnalyzeData(headers, data, parameters.Args);
        }

        private void SetAnalysisStrategy(AnalysisMethods analysisMethod)
        {
            switch (analysisMethod)
            {
                case AnalysisMethods.Regression:
                    AnalysisStrategy = new RegressionStrategy();
                    break;
                case AnalysisMethods.AssociationRulesSearch:
                    AnalysisStrategy = new AssociationRulesSearchStrategy();
                    break;
                case AnalysisMethods.Clustering:
                    AnalysisStrategy = new ClusteringStrategy();
                    break;
                default:
                    throw new Exception("Невідомий метод аналізу.");
            }
        }
    }
}
