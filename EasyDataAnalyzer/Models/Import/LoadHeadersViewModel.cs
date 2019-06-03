using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class LoadHeadersViewModel
    {
        public string TempFilePath { get; set; }
        public List<string> Headers { get; set; }
        public ImportParametersModel Parameters { get; set; }
        public List<ImportDataTypes> DataTypes { get; set; }
        public List<ImportDataPriorityLevels> PriorityLevels { get; set; }
    }
}
