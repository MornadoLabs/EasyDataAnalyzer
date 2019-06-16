using EasyDataAnalyzer.Data;
using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Models.Import;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public class ImportRepository : BaseRepository, IImportRepository
    {
        public ImportRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public UserImport SaveImport(UserImport import)
        {
            var result = DbContext.UserImports.Add(import);
            DbContext.SaveChanges();
            return result.Entity;
        }

        public void SaveImportParameters(List<ImportParameter> parameters)
        {
            DbContext.ImportParameters.AddRange(parameters);
            DbContext.SaveChanges();
        }

        public void SaveImportHeaders(List<ImportHeader> headers)
        {
            DbContext.ImportHeaders.AddRange(headers);
            DbContext.SaveChanges();
        }

        public void SaveImportData(List<ImportData> data)
        {
            DbContext.ImportData.AddRange(data);
            DbContext.SaveChanges();
        }

        public DataType LoadDataTypeById(int typeId)
        {
            return DbContext.DataTypes.FirstOrDefault(dt => dt.Id == typeId);
        }

        public DataPriorityLevel LoadPriorityLevelByPriority(int priority)
        {
            return DbContext.DataPriorityLevels.FirstOrDefault(pl => pl.Priority == priority);
        }
        
        public List<UserImport> LoadUserImports(string userId)
        {
            return DbContext.UserImports.Where(ui => userId.Equals(ui.User.Id)).ToList();
        }

        public List<ImportHeader> LoadImportHeadersByImportId(long importId)
        {
            return DbContext.ImportHeaders.Where(ih => ih.Import.Id == importId).ToList();
        }

        public List<ImportHeader> LoadImportHeadersById(List<int> headerIds)
        {
            return DbContext.ImportHeaders.Where(ih => headerIds.Contains(ih.Id)).ToList();
        }

        public List<ImportData> LoadDataByImportId(List<long> importIds)
        {
            var headerIds = DbContext.ImportHeaders.Where(ih => importIds.Contains(ih.Import.Id)).Select(ih => ih.Id);
            return DbContext.ImportData.Where(id => headerIds.Contains(id.Header.Id)).ToList();
        }
    }
}
