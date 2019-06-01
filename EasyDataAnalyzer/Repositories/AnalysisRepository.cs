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
    }
}
