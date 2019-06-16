using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Enums
{
    public enum ImportDataPriorityLevels
    {
        [Display(Name = "Високий")]
        High = 3,
        [Display(Name = "Середній")]
        Medium = 2,
        [Display(Name = "Низький")]
        Low = 1
    }
}
