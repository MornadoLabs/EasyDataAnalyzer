using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class ImportModel
    {
        public List<Dictionary<string, string>> Data { get; set; } = new List<Dictionary<string, string>>();
        public string ErrorFilePath { get; set; }
        public long ErrorsCount { get; set; }
    }
}
