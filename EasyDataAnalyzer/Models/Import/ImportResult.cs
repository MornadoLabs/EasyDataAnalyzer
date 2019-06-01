using EasyDataAnalyzer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class ImportResult
    {
        public OperationResult Result { get; set; }
        public string Message { get; set; }
        public string ErrorFilePath { get; set; }
    }
}
