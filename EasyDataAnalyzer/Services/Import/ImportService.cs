using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Models.Import;
using EasyDataAnalyzer.Repositories;
using EasyDataAnalyzer.Services.Import.ImportStrategies;
using NPOI.HSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services.Import
{
    public class ImportService : IImportService
    {
        private IImportStrategy ImportStrategy { get; set; }
        private IImportRepository ImportRepository { get; set; }
        private IUserRepository UserRepository { get; set; }

        public ImportService(IImportRepository repository, IUserRepository userRepository)
        {
            ImportRepository = repository;
            UserRepository = userRepository;
            ImportStrategy = new ExcelImportStrategy();
        }

        public List<string> GetImportHeaders(FileStream dataStream)
        {
            var result = new List<string>();
            var hssfwb = new HSSFWorkbook(dataStream);
            var sheet = hssfwb.GetSheetAt(0);
            var headers = sheet.GetRow(0);
            return headers.Cells.Select(c => c.ToString()).ToList();
        }

        public ImportResult ProcessImport(FileStream dataStream, ImportParametersViewModel parameters, string userId)
        {
            var user = UserRepository.GetUserById(userId);
            if (user == null)
            {
                throw new Exception("Не вдалось завантажити дані користувача.");
            }

            var parsedImport = ImportStrategy.ImportData(dataStream, parameters);
            var currentImport = ImportRepository.SaveImport(new UserImport
            {
                User = user,
                RecordsCount = parsedImport.Data.Count + parsedImport.ErrorsCount,
                ImportDate = DateTime.Now
            });

            ImportRepository.SaveImportParameters(parameters.Parameters.Select(p => new ImportParameter
            {
                Import = currentImport,
                ParameterName = p.Key.ToString(),
                ParameterValue = p.Value
            }).ToList());
                        
            ImportRepository.SaveImportHeaders(parameters.HeaderParameters.Select(hp => new ImportHeader
            {
                Import = currentImport,
                HeaderName = hp.HeaderName,
                DataType = ImportRepository.LoadDataTypeById((int)hp.DataType),
                PriorityLevel = ImportRepository.LoadPriorityLevelByPriority((int)hp.PriorityLevel)
            }).ToList());

            var importHeaders = ImportRepository.LoadImportHeadersByImportId(currentImport.Id);
            var importData = new List<ImportData>();
            foreach (var dataRow in parsedImport.Data)
            {
                var rowCells = new List<ImportData>();
                foreach (var header in importHeaders)
                {
                    if (dataRow.ContainsKey(header.HeaderName))
                    {
                        rowCells.Add(new ImportData
                        {
                            Header = header,
                            Value = dataRow[header.HeaderName]
                        });
                    }
                }
                importData.AddRange(rowCells);
            }

            ImportRepository.SaveImportData(importData);

            return new ImportResult
            {
                Result = Enums.OperationResult.Success,
                ErrorFilePath = parsedImport.ErrorFilePath,
                Message = $"Імпорт пройшов успішно. Опрацьовано записів: {currentImport.RecordsCount}. З них не розпізнано: {parsedImport.ErrorsCount}"
            };
        }
    }
}
