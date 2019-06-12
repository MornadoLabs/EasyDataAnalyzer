using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class ImportParametersModel
    {
        public string DateFormat { get; set; }
        public string NumericSeparator { get; set; }
        public bool EmptyValueIsNull { get; set; }
    }
}
