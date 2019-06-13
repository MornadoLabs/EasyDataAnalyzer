using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class AnalysisSettingsModel
    {
        public AnalysisMethods AnalysisMethod { get; set; }
        public double AssociationRulesConfidence { get; set; }
        public int ClustersCount { get; set; }
        public List<long> ImportIds { get; set; }
    }
}
