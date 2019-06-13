using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class AnalysisParametersModel
    {
        public AnalysisMethods AnalysisMethod { get; set; }
        public List<long> ImportIds { get; set; }
        public List<int> MainHeadersId { get; set; }
        public List<object> Args { get; set; }
    }
}
