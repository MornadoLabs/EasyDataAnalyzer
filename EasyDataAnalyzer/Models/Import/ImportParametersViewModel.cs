using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class ImportParametersViewModel
    {
        public Dictionary<ImportParameters, string> Parameters { get; set; }
        public List<ImportHeaderParameters> HeaderParameters { get; set; }
    }
}
