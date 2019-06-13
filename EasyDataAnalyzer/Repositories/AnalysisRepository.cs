using EasyDataAnalyzer.Data;
using EasyDataAnalyzer.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public class AnalysisRepository : BaseRepository, IAnalysisRepository
    {
        public AnalysisRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public void SaveAnalysis(AnalysisHistory analysis, List<AnalysisData> data)
        {
            DbContext.AnalysisHistory.Add(analysis);
            DbContext.AnalysisData.AddRange(data);
            DbContext.SaveChanges();
        }

        public List<UserImport> LoadUserImports(string userId)
        {
            return DbContext.UserImports.Where(ui => userId.Equals(ui.User.Id)).ToList();
        }

        public List<ImportHeader> LoadImportHeaders(List<long> importIds)
        {
            return DbContext.ImportHeaders.Where(ih => importIds.Contains(ih.Import.Id)).ToList();
        }
    }
}
