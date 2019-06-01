using System;
using System.Collections.Generic;
using System.Text;
using EasyDataAnalyzer.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EasyDataAnalyzer.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        #region DbSets

        public DbSet<DataType> DataTypes { get; set; }
        public DbSet<DataPriorityLevel> DataPriorityLevels { get; set; }
        public DbSet<UserImport> UserImports { get; set; }
        public DbSet<ImportParameter> ImportParameters { get; set; }
        public DbSet<ImportHeader> ImportHeaders { get; set; }
        public DbSet<ImportData> ImportData { get; set; }
        public DbSet<AnalysisHistory> AnalysisHistory { get; set; }
        public DbSet<AnalysisData> AnalysisData { get; set; }

        #endregion
    }
}
