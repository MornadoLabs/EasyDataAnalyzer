using EasyDataAnalyzer.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public interface IAnalysisRepository
    {
        void SaveAnalysis(AnalysisHistory analysis, List<AnalysisData> data);
    }
}
