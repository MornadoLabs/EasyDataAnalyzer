using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class RegressionChartModel : IChartResults
    {
        public List<Point> AnalysisData { get; set; }
        public List<Point> YtoX { get; set; }
        public List<Point> XtoY { get; set; }
        public string YLabel { get; set; }
        public string XLabel { get; set; }
    }
}
