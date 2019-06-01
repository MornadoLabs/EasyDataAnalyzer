using EasyDataAnalyzer.Models.Import;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Import.ImportStrategies
{
    public interface IImportStrategy
    {
        ImportModel ImportData(FileStream dataStream, ImportParametersViewModel parameters);
    }
}
