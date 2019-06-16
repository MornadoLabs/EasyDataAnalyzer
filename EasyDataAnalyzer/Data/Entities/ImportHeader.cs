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
        public virtual UserImport Import { get; set; }

        [Required]
        public string HeaderName { get; set; }

        [Required]
        public virtual DataType DataType { get; set; }

        [Required]
        public virtual DataPriorityLevel PriorityLevel { get; set; }

        public virtual ICollection<ImportData> ImportDatas { get; set; }
    }
}
