using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class ImportHeader
    {
        public int Id { get; set; }

        [Required]
        public UserImport Import { get; set; }

        [Required]
        public string HeaderName { get; set; }

        [Required]
        public DataType DataType { get; set; }

        [Required]
        public DataPriorityLevel PriorityLevel { get; set; }
    }
}
