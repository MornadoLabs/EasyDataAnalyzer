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
        }

        public IAnalysisResult AnalyzeData(AnalysisParametersModel parameters)
        {

        }
    }
}
