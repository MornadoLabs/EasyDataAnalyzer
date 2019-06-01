using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class ImportHeaderParameters
    {
        public string HeaderName { get; set; }
        public ImportDataTypes DataType { get; set; }
        public ImportDataPriorityLevels PriorityLevel { get; set; }
    }
}
