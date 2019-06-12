using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Constants;
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
        public ImportModel ImportData(FileStream dataStream, ImportParametersViewModel parameters)
        {
            var result = new ImportModel();
            var xssfwb = new XSSFWorkbook(dataStream);
            var sheet = xssfwb.GetSheetAt(0);
            var headers = sheet.GetRow(0);

            var errorWb = new XSSFWorkbook();
            var errorSheet = errorWb.CreateSheet(ImportConstants.ErrorSheetName);
            var errorHeadersRow = errorSheet.CreateRow(0);

            for (int i = 0; i < headers.LastCellNum; i++)
            {
                errorHeadersRow.CreateCell(i).SetCellValue(headers.GetCell(i).ToString());
            }
            errorHeadersRow.CreateCell(headers.LastCellNum).SetCellValue(ImportConstants.ErrorHeader);            
            
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
                    for (int j = 0; j < errorHeadersRow.LastCellNum; j++)
                    {
                        var errorHeader = errorHeadersRow.GetCell(j).ToString();
                        var errorCellValue = parsedRow.RowData[errorHeader];
                        errorRow.CreateCell(j).SetCellValue(errorCellValue);
                    }
                }
            }

            if (errorSheet.LastRowNum > -1)
            {
                var fileExtension = Path.GetExtension(dataStream.Name);
                var fileName = dataStream.Name.Insert(dataStream.Name.IndexOf(fileExtension), ImportConstants.ErrorFile);
                var errorFilePath = Path.Combine(CommonConstants.TempFolder, ImportConstants.ErrorFolder, fileName);
                result.ErrorFilePath = errorFilePath;
                result.ErrorsCount = errorSheet.LastRowNum;
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
            for (short j = 0; j < headers.LastCellNum; j++)
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
                parseResult.RowData.Add(ImportConstants.ErrorHeader, parseResult.ErrorMessage);
            }

            return parseResult;
        }

        private ParseCellResult ParseCellValue(
            string value,
            ImportParametersModel importParameters,
            ImportHeaderParameters headerParameters)
        {
            if ((importParameters.EmptyValueIsNull && string.IsNullOrWhiteSpace(value)) 
                || "null".Equals(value, StringComparison.CurrentCultureIgnoreCase))
            {
                return new ParseCellResult { Success = true, ResultValue = null };
            }            

            switch (headerParameters.DataType)
            {
                case ImportDataTypes.Date:
                    {
                        if (!string.IsNullOrWhiteSpace(importParameters.DateFormat))
                        {
                            DateTime resultValue;
                            if (DateTime.TryParseExact(
                                value,
                                importParameters.DateFormat,
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
                        if (!string.IsNullOrWhiteSpace(importParameters.NumericSeparator))
                        {
                            double resultValue;
                            if (TryParseNumber(value, importParameters.NumericSeparator, out resultValue))
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
