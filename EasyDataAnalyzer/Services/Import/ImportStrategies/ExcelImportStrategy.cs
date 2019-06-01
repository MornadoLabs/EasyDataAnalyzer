using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Data.Entities;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Models.Import;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace EasyDataAnalyzer.Services.Import.ImportStrategies
{
    public class ExcelImportStrategy : IImportStrategy
    {
        private const string ErrorHeader = "Опис помилки";
        private const string ErrorFolder = "App_Data";
        private const string ErrorSheetName = "Помилки";

        public ImportModel ImportData(FileStream dataStream, ImportParametersViewModel parameters)
        {
            var result = new ImportModel();
            var hssfwb = new HSSFWorkbook(dataStream);
            var sheet = hssfwb.GetSheetAt(0);
            var headers = sheet.GetRow(0);

            var errorWb = new XSSFWorkbook();
            var errorSheet = errorWb.CreateSheet(ErrorSheetName);
            var errorHeadersRow = errorSheet.CreateRow(0);

            for (int i = 0; i <= headers.LastCellNum; i++)
            {
                errorHeadersRow.CreateCell(i).SetCellValue(headers.GetCell(i).ToString());
            }
            errorHeadersRow.CreateCell(headers.LastCellNum + 1).SetCellValue(ErrorHeader);            
            
            for (int i = 1; i <= sheet.LastRowNum; i++)
            {
                var currentRow = sheet.GetRow(i);
                var parsedRow = ParseRow(currentRow, headers, parameters);

                if (!parsedRow.ThereIsError)
                {
                    result.Data.Add(parsedRow.RowData);
                }
                else
                {
                    var errorRow = errorSheet.CreateRow(errorSheet.LastRowNum + 1);
                    for (int j = 0; j <= errorHeadersRow.LastCellNum; j++)
                    {
                        var errorHeader = errorHeadersRow.GetCell(j).ToString();
                        var errorCellValue = parsedRow.RowData[errorHeader];
                        errorRow.CreateCell(j).SetCellValue(errorCellValue);
                    }
                }
            }

            if (errorSheet.LastRowNum > 0)
            {
                var errorFilePath = Path.Combine(Directory.GetCurrentDirectory(), ErrorFolder, dataStream.Name, Guid.NewGuid().ToString());
                result.ErrorFilePath = errorFilePath;
                result.ErrorsCount = errorSheet.LastRowNum + 1;
                using (var errorFile = new FileStream(errorFilePath, FileMode.Create, FileAccess.Write))
                {
                    errorWb.Write(errorFile);
                }
            }

            return result;
        }

        private ParseRowResult ParseRow(IRow row, IRow headers, ImportParametersViewModel parameters)
        {
            var parseResult = new ParseRowResult();
            for (short j = 0; j <= headers.LastCellNum; j++)
            {
                var header = headers.GetCell(j).ToString();
                var currentValue = row.GetCell(j).ToString();

                if (parseResult.ThereIsError)
                {
                    parseResult.RowData.Add(header, currentValue);
                    continue;
                }

                var headerParams = parameters.HeaderParameters.FirstOrDefault(h => header.Equals(h.HeaderName));
                var parsedCell = ParseCellValue(currentValue, parameters.Parameters, headerParams);

                if (parsedCell.Success)
                {
                    parseResult.RowData.Add(header, parsedCell.ResultValue);
                }
                else
                {
                    parseResult.RowData.Add(header, currentValue);
                    parseResult.ThereIsError = true;
                    parseResult.ErrorMessage = parsedCell.ErrorMessage;
                }
            }

            if (parseResult.ThereIsError)
            {
                parseResult.RowData.Add(ErrorHeader, parseResult.ErrorMessage);
            }

            return parseResult;
        }

        private ParseCellResult ParseCellValue(
            string value, 
            Dictionary<ImportParameters, string> importParameters,
            ImportHeaderParameters headerParameters)
        {
            if (importParameters.ContainsKey(ImportParameters.SetEmptyValueAsNull))
            {
                if ("true".Equals(importParameters[ImportParameters.SetEmptyValueAsNull].ToLower(CultureInfo.InvariantCulture))
                    && string.IsNullOrWhiteSpace(value))
                {
                    return new ParseCellResult { Success = true, ResultValue = null }; 
                }
            }

            switch (headerParameters.DataType)
            {
                case ImportDataTypes.Date:
                    {
                        if (importParameters.ContainsKey(ImportParameters.DataTimeFormat))
                        {
                            DateTime resultValue;
                            if (DateTime.TryParseExact(
                                value,
                                importParameters[ImportParameters.DataTimeFormat],
                                CultureInfo.InvariantCulture,
                                DateTimeStyles.None,
                                out resultValue))
                            {
                                return new ParseCellResult { Success = true, ResultValue = resultValue.ToString() };
                            }
                            else
                            {
                                return new ParseCellResult { Success = false, ErrorMessage = $"Невдалось розпізнати значення {headerParameters.HeaderName}." };
                            }
                        }
                        else
                        {
                            DateTime resultValue;
                            if (DateTime.TryParse(value, out resultValue))
                            {
                                return new ParseCellResult { Success = true, ResultValue = resultValue.ToString() };
                            }
                            else
                            {
                                return new ParseCellResult { Success = false, ErrorMessage = $"Невдалось розпізнати значення {headerParameters.HeaderName}." };
                            }
                        }
                    }
                case ImportDataTypes.Numeric:
                    {
                        if (importParameters.ContainsKey(ImportParameters.MoneySeparator))
                        {
                            double resultValue;
                            if (TryParseNumber(value, importParameters[ImportParameters.MoneySeparator], out resultValue))
                            {
                                return new ParseCellResult { Success = true, ResultValue = resultValue.ToString() };
                            }
                            else
                            {
                                return new ParseCellResult { Success = false, ErrorMessage = $"Невдалось розпізнати значення {headerParameters.HeaderName}." };
                            }
                        }
                        else
                        {
                            double resultValue;
                            if (Double.TryParse(value, out resultValue))
                            {
                                return new ParseCellResult { Success = true, ResultValue = resultValue.ToString() };
                            }
                            else
                            {
                                return new ParseCellResult { Success = false, ErrorMessage = $"Невдалось розпізнати значення {headerParameters.HeaderName}." };
                            }
                        }
                    }
                default: return new ParseCellResult { Success = true, ResultValue = value };
            }
        }

        private bool TryParseNumber(string value, string separator, out double result)
        {
            int count = value.Split(separator).Length - 1;
            if (count > 0)
            {
                if (count == 1)
                {
                    double tmpResult;
                    if (Double.TryParse(value.Replace(separator, CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator), out tmpResult))
                    {
                        result = tmpResult;
                        return true;
                    }
                    else
                    {
                        result = 0;
                        return false;
                    }
                }
                else
                {
                    result = 0;
                    return false;
                }
            }
            else
            {
                int tmpResult;
                if (int.TryParse(value, out tmpResult))
                {
                    result = tmpResult;
                    return true;
                }
                else
                {
                    result = 0;
                    return false;
                }
            }
        }

        private class ParseRowResult
        {
            public Dictionary<string, string> RowData { get; set; } = new Dictionary<string, string>();
            public bool ThereIsError { get; set; } = false;
            public string ErrorMessage { get; set; }
        }

        private class ParseCellResult
        {
            public bool Success { get; set; }
            public string ResultValue { get; set; }
            public string ErrorMessage { get; set; }
        }
    }
}
