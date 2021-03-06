﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class AnalysisData
    {
        public long Id { get; set; }

        [Required]
        public virtual AnalysisHistory AnalysisHistory { get; set; }

        [Required]
        public virtual UserImport Import { get; set; }
    }
}
