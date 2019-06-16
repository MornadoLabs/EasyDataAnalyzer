using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Enums
{
    public enum AnalysisMethods
    {
        [Display(Name = "Кластеризація")]
        Clustering = 1,
        [Display(Name = "Пошук асоціативних правил")]
        AssociationRulesSearch = 2,
        [Display(Name = "Регресія")]
        Regression = 3
    }
}
