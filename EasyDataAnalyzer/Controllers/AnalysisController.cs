using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Enums;
using EasyDataAnalyzer.Models.Analysis;
using EasyDataAnalyzer.Services.Analysis;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyDataAnalyzer.Controllers
{
    public class AnalysisController : Controller
    {
        private IAnalysisService AnalysisService { get; set; }

        public AnalysisController(IAnalysisService analysisService)
        {
            AnalysisService = analysisService;
        }

        [Authorize]
        public IActionResult AnalyzeData(AnalysisParametersModel parameters)
        {
            var analysisResult = AnalysisService.AnalyzeData(parameters);

            switch (analysisResult.AnalysisMethod)
            {
                case AnalysisMethods.Regression:
                    return View(analysisResult);
                case AnalysisMethods.AssociationRulesSearch:
                    return View(analysisResult);
                case AnalysisMethods.Clustering:
                    return View(analysisResult);
                default:
                    throw new Exception("Невідомий метод аналізу.");
            }
        }
    }
}