using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Enums
{
    public enum ImportDataTypes
    {
        [Display(Name = "Числові дані")]
        Numeric = 1,
        [Display(Name = "Текстові дані")]
        Symbols = 2,
        [Display(Name = "Дата")]
        Date = 3
    }
}
