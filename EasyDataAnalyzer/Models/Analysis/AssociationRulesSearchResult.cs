using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Accord.MachineLearning.Rules;
using EasyDataAnalyzer.Enums;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class AssociationRulesSearchResult : IAnalysisResult
    {
        public OperationResult Result { get; set; }
        public AnalysisMethods AnalysisMethod { get; set; }
        public AssociationRule<string>[] Rules { get; set; }
    }
}