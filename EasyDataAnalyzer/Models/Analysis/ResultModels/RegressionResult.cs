using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Enums;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class RegressionResult : IAnalysisResult
    {
        public OperationResult Result { get; set; }
        public AnalysisMethods AnalysisMethod { get; set; }
        public List<Point> Points { get; set; }
        public double Alpha { get; set; }
        public double Beta { get; set; }
        public double NotAlpha { get; set; }
        public double NotBeta { get; set; }
    }
}
