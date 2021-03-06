﻿using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Models.Import;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Import
{
    public interface IImportService
    {
        List<string> GetImportHeaders(FileStream dataStream);
        ImportResult ProcessImport(FileStream dataStream, ImportParametersViewModel parameters, string userId);
        List<ImportData> LoadDataByImportId(List<long> importIds);
        List<ImportData> LoadDataByImportId(long importId);
        List<ImportHeader> LoadImportHeadersById(List<int> headerIds);
        List<ImportHeader> LoadImportHeadersByImportId(long importId);
        List<UserImport> LoadUserImports(string userId);
        List<ImportParameter> LoadParametersByImportId(long importId);
    }
}
