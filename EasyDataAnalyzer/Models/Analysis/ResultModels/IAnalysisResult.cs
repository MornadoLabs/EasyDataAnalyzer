using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public interface IAnalysisResult
    {
        OperationResult Result { get; set; }
        AnalysisMethods AnalysisMethod { get; set; }
    }
}
