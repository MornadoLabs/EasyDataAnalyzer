using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Models.Analysis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Analysis
{
    public interface IAnalysisService
    {
        List<UserImport> LoadUserImports(string userId);
        List<ImportHeader> LoadImportHeaders(List<long> importIds);
        IAnalysisResult AnalyzeData(AnalysisParametersModel parameters);
    }
}
