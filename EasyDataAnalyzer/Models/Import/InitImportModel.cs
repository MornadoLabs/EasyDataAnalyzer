using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class InitImportModel
    {
        public IFormFile File { get; set; }
        public string DataFormat { get; set; }
        public string NumericSeparator { get; set; }
        public bool EmptyValueIsNull { get; set; }
    }
}
