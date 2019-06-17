using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public class ClusteringChartModel : IChartResults
    {
        public List<Point> AnalysisData { get; set; }
        public List<Point>[] Clusters { get; set; }
        public string YLabel { get; set; }
        public string XLabel { get; set; }
    }
}
