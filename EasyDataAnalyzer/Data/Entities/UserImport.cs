using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class UserImport
    {
        public long Id { get; set; }

        [Required]
        public virtual IdentityUser User { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public long RecordsCount { get; set; }

        public long ErrorsCount { get; set; }

        public DateTime ImportDate { get; set; }

        public virtual ICollection<ImportHeader> ImportHeaders { get; set; }
        public virtual ICollection<ImportParameter> ImportParameters { get; set; }
        public virtual ICollection<AnalysisData> AnalysisDatas { get; set; }
    }
}
