using EasyDataAnalyzer.Models.Analysis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Analysis
{
    public interface IAnalysisService
    {
        IAnalysisResult AnalyzeData(AnalysisParametersModel parameters);
    }
}
