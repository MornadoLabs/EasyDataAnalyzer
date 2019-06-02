using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Constants
{
    public class CommonConstants
    {
        public const string TempFolderName = "App_Data";
        public static string TempFolder => Path.Combine(Directory.GetCurrentDirectory(), TempFolderName);
    }
}
