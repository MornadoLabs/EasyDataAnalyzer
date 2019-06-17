using EasyDataAnalyzer.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Models.Import
{
    public class ImportHistoryDataViewModel
    {
        public List<ImportHeader> ImportHeaders { get; set; }
        public List<ImportData> ImportData { get; set; }
    }
}
