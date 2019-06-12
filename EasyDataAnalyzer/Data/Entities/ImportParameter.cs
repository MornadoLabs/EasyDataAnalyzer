using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Data.Entities
{
    public class ImportParameter
    {
        public int Id { get; set; }

        [Required]
        public UserImport Import { get; set; }

        [Required]
        public string ParameterName { get; set; }

        public string ParameterValue { get; set; }
    }
}
