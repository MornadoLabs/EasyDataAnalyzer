﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class DataType
    {        
        public int Id { get; set; }

        [Required]
        [MaxLength(450)]
        public string Description { get; set; }

        public virtual ICollection<ImportHeader> ImportHeaders { get; set; }
    }
}
