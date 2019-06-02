using System;
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

namespace EasyDataAnalyzer.Controllers
{
    public class ImportController : Controller
    {
        private IImportService ImportService { get; set; }

        public ImportController(IImportService importService)
        {
            ImportService = importService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult LoadHeaders(Dictionary<ImportParameters, string> importParameters)
        {
            IFormFile file = Request.Form.Files[0];
            if (file.Length < 1)
            {
                throw new Exception("Не завантажено файл.");
            }
            string fullPath = Path.Combine(CommonConstants.TempFolder, file.FileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
                var headers = ImportService.GetImportHeaders(stream);
                return View(new LoadHeadersViewModel
                {
                    TempFilePath = fullPath,
                    Headers = headers,
                    Parameters = importParameters,
                    DataTypes = Enum.GetValues(typeof(ImportDataTypes)).Cast<ImportDataTypes>().ToList(),
                    PriorityLevels = Enum.GetValues(typeof(ImportDataPriorityLevels)).Cast<ImportDataPriorityLevels>().ToList()
                });
            }
        }

        [Authorize]
        public JsonResult ProcessImport(ImportParametersViewModel parameters)
        {
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
    }
}