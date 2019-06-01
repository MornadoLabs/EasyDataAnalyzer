using EasyDataAnalyzer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public class BaseRepository
    {
        protected ApplicationDbContext DbContext { get; set; }

        public BaseRepository(ApplicationDbContext dbContext)
        {
            this.DbContext = dbContext;
        }
    }
}
