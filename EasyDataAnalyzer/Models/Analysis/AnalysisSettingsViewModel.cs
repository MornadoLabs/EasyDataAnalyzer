using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class AnalysisSettingsViewModel
    {
        public List<AnalysisMethods> AnalysisMethods { get; set; }
        public double AssociationRulesConfidence { get; set; }
        public int ClustersCount { get; set; }
        public List<UserImport> Imports { get; set; }
    }
}
