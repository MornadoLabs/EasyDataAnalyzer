﻿using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Models.Import;
using EasyDataAnalyzer.Repositories;
using EasyDataAnalyzer.Services.Import.ImportStrategies;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;
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
        private IUserService UserService { get; set; }

        public ImportService(IImportRepository repository, IUserService userService)
        {
            ImportRepository = repository;
            UserService = userService;
            ImportStrategy = new ExcelImportStrategy();
        }

        public List<ImportData> LoadDataByImportId(List<long> importIds)
        {
            return ImportRepository.LoadDataByImportId(importIds);
        }

        public List<ImportData> LoadDataByImportId(long importId)
        {
            return ImportRepository.LoadDataByImportId(importId);
        }

        public List<ImportParameter> LoadParametersByImportId(long importId)
        {
            return ImportRepository.LoadParametersByImportId(importId);
        }

        public List<ImportHeader> LoadImportHeadersById(List<int> headerIds)
        {
            return ImportRepository.LoadImportHeadersById(headerIds);
        }

        public List<ImportHeader> LoadImportHeadersByImportId(long importId)
        {
            return ImportRepository.LoadImportHeadersByImportId(importId);
        }

        public List<string> GetImportHeaders(FileStream dataStream)
        {
            var result = new List<string>();
            var xssfwb = new XSSFWorkbook(dataStream);
            var sheet = xssfwb.GetSheetAt(0);
            var headers = sheet.GetRow(0);
            return headers.Cells.Select(c => c.ToString()).ToList();
        }

        public ImportResult ProcessImport(FileStream dataStream, ImportParametersViewModel parameters, string userId)
        {
            var user = UserService.GetUserById(userId);
            if (user == null)
            {
                throw new Exception("Не вдалось завантажити дані користувача.");
            }

            SetImportStrategy(parameters.ImportMethod);

            var parsedImport = ImportStrategy.ImportData(dataStream, parameters);
            var currentImport = ImportRepository.SaveImport(new UserImport
            {
                User = user,
                FileName = new FileInfo(dataStream.Name).Name,
                RecordsCount = parsedImport.Data.Count + parsedImport.ErrorsCount,
                ErrorsCount = parsedImport.ErrorsCount,
                ImportDate = DateTime.Now
            });

            ImportRepository.SaveImportParameters(ParseImportParameters(currentImport, parameters.Parameters));
                        
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
                            RowNumber = parsedImport.Data.IndexOf(dataRow) + 1,
                            Value = dataRow[header.HeaderName]
                        });
                    }
                }
                importData.AddRange(rowCells);
            }

            ImportRepository.SaveImportData(importData);

            return new ImportResult
            {
                Result = OperationResult.Success,
                ErrorFilePath = parsedImport.ErrorFilePath,
                Message = $"Опрацьовано записів: {currentImport.RecordsCount}. З них не розпізнано: {parsedImport.ErrorsCount}"
            };
        }

        public List<UserImport> LoadUserImports(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return new List<UserImport>();
            }

            return ImportRepository.LoadUserImports(userId);
        }

        private void SetImportStrategy(ImportMethods method)
        {
            switch (method)
            {
                case ImportMethods.ExcelImport:
                default:
                    ImportStrategy = new ExcelImportStrategy(); break;
            }
        }

        private List<ImportParameter> ParseImportParameters(UserImport import, ImportParametersModel parameters)
        {
            var result = new List<ImportParameter>();

            if (!string.IsNullOrWhiteSpace(parameters.DateFormat))
            {
                result.Add(new ImportParameter
                {
                    Import = import,
                    ParameterName = ImportParameters.DataTimeFormat.ToString(),
                    ParameterValue = parameters.DateFormat
                });
            }

            if (!string.IsNullOrWhiteSpace(parameters.NumericSeparator))
            {
                result.Add(new ImportParameter
                {
                    Import = import,
                    ParameterName = ImportParameters.NumericSeparator.ToString(),
                    ParameterValue = parameters.NumericSeparator
                });
            }

            result.Add(new ImportParameter
            {
                Import = import,
                ParameterName = ImportParameters.SetEmptyValueAsNull.ToString(),
                ParameterValue = parameters.EmptyValueIsNull.ToString()
            });

            return result;
        }
    }
}
