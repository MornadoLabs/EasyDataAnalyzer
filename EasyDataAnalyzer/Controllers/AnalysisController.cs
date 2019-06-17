using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Extensions;
using EasyDataAnalyzer.Models.Analysis;
using EasyDataAnalyzer.Services.Analysis;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EasyDataAnalyzer.Controllers
{
    public class AnalysisController : Controller
    {
        private static class AnalysisParameters
        {
            public static AnalysisParametersModel Parameters { get; set; } = new AnalysisParametersModel();
            public static IAnalysisResult AnalysisResult { get; set; }
            public static void SetAdditionalArgs(AnalysisSettingsModel analysisSettings)
            {
                if (analysisSettings.AnalysisMethod == AnalysisMethods.AssociationRulesSearch)
                {
                    Parameters.Args = new List<object> { analysisSettings.AssociationRulesConfidence };
                }

                if (analysisSettings.AnalysisMethod == AnalysisMethods.Clustering)
                {
                    Parameters.Args = new List<object> { analysisSettings.ClustersCount };
                }
            }
        }

        private IAnalysisService AnalysisService { get; set; }

        public AnalysisController(IAnalysisService analysisService)
        {
            AnalysisService = analysisService;
        }

        [Authorize]
        public IActionResult Index()
        {
            return View(new AnalysisSettingsViewModel {
                AnalysisMethods = Enum.GetValues(typeof(AnalysisMethods)).Cast<AnalysisMethods>().ToList(),
                Imports = AnalysisService.LoadUserImports(User.GetUserID())
            });
        }

        [Authorize]
        public IActionResult LoadAnalyzeSettings(string settings)
        {
            var parameters = JsonConvert.DeserializeObject<AnalysisSettingsModel>(settings);

            AnalysisParameters.Parameters.AnalysisMethod = parameters.AnalysisMethod;
            AnalysisParameters.Parameters.ImportIds = parameters.ImportIds;
            AnalysisParameters.SetAdditionalArgs(parameters);

            ViewBag.Headers = AnalysisService.LoadImportHeaders(parameters.ImportIds);

            return View();
        }

        [Authorize]
        public IActionResult AnalyzeData(int xField, int yField)
        {
            AnalysisParameters.Parameters.MainHeadersId = new List<int> { xField, yField };
            AnalysisParameters.AnalysisResult = AnalysisService.AnalyzeData(AnalysisParameters.Parameters);

            switch (AnalysisParameters.AnalysisResult.AnalysisMethod)
            {
                case AnalysisMethods.Regression:
                    return View("RegressionResultView", AnalysisParameters.AnalysisResult);
                case AnalysisMethods.AssociationRulesSearch:
                    return View("AssociationRulesSearchResultView", AnalysisParameters.AnalysisResult);
                case AnalysisMethods.Clustering:
                    return View("ClusteringResultView", AnalysisParameters.AnalysisResult);
                default:
                    throw new Exception("Невідомий метод аналізу.");
            }
        }

        [Authorize]
        public JsonResult LoadCharts()
        {
            var result = AnalysisService.LoadChartsData(AnalysisParameters.Parameters, AnalysisParameters.AnalysisResult);
            return Json(result);
        }

        [HttpGet]
        public ActionResult LoadAnalysisHistory()
        {
            return View(new AnalysisHistoryViewModel
            {
                AnalysisHistories = AnalysisService.LoadAnalysisHistories(User.GetUserID())
            });
        }
    }
}