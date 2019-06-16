using EasyDataAnalyzer.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public interface IAnalysisRepository
    {
        List<AnalysisHistory> LoadAnalysisHistories(string userId);
        List<UserImport> LoadUserImports(string userId);
        List<ImportHeader> LoadImportHeaders(List<long> importIds);
        void SaveAnalysis(AnalysisHistory analysis, List<AnalysisData> data);
    }
}
