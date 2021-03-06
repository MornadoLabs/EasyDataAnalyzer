﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class AnalysisHistory
    {
        public long Id { get; set; }        
        public DateTime AnalysisDate { get; set; }

        public virtual ICollection<AnalysisData> AnalysisDatas { get; set; }
    }
}
