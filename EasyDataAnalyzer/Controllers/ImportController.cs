﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Constants;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Extensions;
using EasyDataAnalyzer.Models.Import;
using EasyDataAnalyzer.Services.Import;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EasyDataAnalyzer.Controllers
{
    [Authorize]
    public class ImportController : Controller
    {
        private IImportService ImportService { get; set; }

        public ImportController(IImportService importService)
        {
            ImportService = importService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("UploadFiles")]
        public async Task<IActionResult> LoadHeaders(InitImportModel parameters)
        {
            if (parameters.File == null)
            {
                throw new Exception("Не завантажено файл.");
            }
            string fullPath = Path.Combine(CommonConstants.TempFolder, parameters.File.FileName);
            using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.ReadWrite))
            {
                await parameters.File.CopyToAsync(stream);
                stream.Position = 0;
                var headers = ImportService.GetImportHeaders(stream);
                return View(new LoadHeadersViewModel
                {
                    TempFilePath = fullPath,                    
                    Headers = headers,
                    Parameters = new ImportParametersModel
                    {
                        DateFormat = parameters.DataFormat,
                        NumericSeparator = parameters.NumericSeparator,
                        EmptyValueIsNull = parameters.EmptyValueIsNull
                    },
                    DataTypes = Enum.GetValues(typeof(ImportDataTypes)).Cast<ImportDataTypes>().ToList(),
                    PriorityLevels = Enum.GetValues(typeof(ImportDataPriorityLevels)).Cast<ImportDataPriorityLevels>().ToList()
                });
            }
        }

        [HttpPost]
        public JsonResult ProcessImport(string param)
        {
            var parameters = JsonConvert.DeserializeObject<ImportParametersViewModel>(param);

            try
            {
                if (!System.IO.File.Exists(parameters.TempFilePath))
                {
                    throw new Exception("Файл імпорту не знайдено.");
                }
                using (var stream = new FileStream(parameters.TempFilePath, FileMode.Open, FileAccess.Read))
                {
                    var importResult = ImportService.ProcessImport(stream, parameters, User.GetUserID());
                    return Json(importResult);
                }
            }
            catch (Exception ex)
            {
                return Json(new ImportResult { Result = OperationResult.Error, Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> LoadErrorFile(string path)
        {
            var fileInfo = new FileInfo(path);
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileInfo.Name);
        }

        [HttpGet]
        public ActionResult LoadImportHistory()
        {
            return View(new ImportHistoryViewModel
            {
                Imports = ImportService.LoadUserImports(User.GetUserID())
            });
        }

        [HttpGet]
        public IActionResult LoadImportParams(long importId)
        {
            return PartialView("_ImportParametersInfoView", ImportService.LoadParametersByImportId(importId));
        }

        [HttpGet]
        public IActionResult LoadImportData(long importId)
        {
            return PartialView("_ImportDataInfoView", new ImportHistoryDataViewModel
            {
                ImportHeaders = ImportService.LoadImportHeadersByImportId(importId),
                ImportData = ImportService.LoadDataByImportId(importId)
            });
        }

    }
}