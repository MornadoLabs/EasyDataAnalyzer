﻿using EasyDataAnalyzer.Data;
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

        public List<ImportHeader> LoadImportHeadersByImportId(long importId)
        {
            return DbContext.ImportHeaders.Where(ih => ih.Import.Id == importId).ToList();
        }
    }
}
