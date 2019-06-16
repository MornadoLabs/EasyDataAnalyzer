using EasyDataAnalyzer.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public interface IImportRepository
    {
        UserImport SaveImport(UserImport import);
        void SaveImportParameters(List<ImportParameter> parameters);
        void SaveImportHeaders(List<ImportHeader> headers);
        void SaveImportData(List<ImportData> data);
        DataType LoadDataTypeById(int typeId);
        DataPriorityLevel LoadPriorityLevelByPriority(int priority);
        List<UserImport> LoadUserImports(string userId);
        List<ImportHeader> LoadImportHeadersByImportId(long importId);
        List<ImportHeader> LoadImportHeadersById(List<int> headerIds);
        List<ImportData> LoadDataByImportId(List<long> importIds);
    }
}
