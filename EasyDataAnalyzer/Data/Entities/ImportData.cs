﻿using System;
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
        public virtual ImportHeader Header { get; set; }

        [Required]
        public long RowNumber { get; set; }

        public string Value { get; set; }
    }
}
