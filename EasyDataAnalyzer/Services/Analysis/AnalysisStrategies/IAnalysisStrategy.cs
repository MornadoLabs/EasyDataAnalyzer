using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Models.Analysis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Analysis.AnalysisStrategies
{
    public interface IAnalysisStrategy
    {
        IAnalysisResult AnalyzeData(List<ImportHeader> headers, List<ImportData> data, List<object> args);
    }
}
