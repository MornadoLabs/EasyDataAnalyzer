using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Analysis
{
    public interface IChartResults
    {
        List<Point> AnalysisData { get; set; }
    }
}
