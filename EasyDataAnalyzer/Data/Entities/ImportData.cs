using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class ImportData
    {
        public long Id { get; set; }

        [Required]
        public ImportHeader Header { get; set; }

        [Required]
        public string Value { get; set; }
    }
}
