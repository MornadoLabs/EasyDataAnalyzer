#pragma checksum "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "8993964c0ff04a4ae5f0dde6949c8088c3cafeb4"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Analysis_Index), @"mvc.1.0.view", @"/Views/Analysis/Index.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Analysis/Index.cshtml", typeof(AspNetCore.Views_Analysis_Index))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\_ViewImports.cshtml"
using EasyDataAnalyzer;

#line default
#line hidden
#line 2 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\_ViewImports.cshtml"
using EasyDataAnalyzer.Models;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"8993964c0ff04a4ae5f0dde6949c8088c3cafeb4", @"/Views/Analysis/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"7eb192f17ac70567e5c6fbee126afd50387d8c53", @"/Views/_ViewImports.cshtml")]
    public class Views_Analysis_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<EasyDataAnalyzer.Models.Analysis.AnalysisSettingsViewModel>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", "~/js/analysis.js", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("include", "Development", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper;
        private global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 2, true);
            WriteLiteral("\r\n");
            EndContext();
#line 2 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
  
    ViewData["Title"] = "Index";

#line default
#line hidden
            BeginContext(110, 308, true);
            WriteLiteral(@"<h2>Аналіз даних</h2>

<h3>Метод аналізу</h3>
<div class=""row"">
    <div class=""col-md-12"">
        <div class=""row"">
            <div class=""col-md-4"">
                <label for=""analysisMethods"">Оберіть метод аналізу</label>
            </div>
            <div class=""col-md-4"">
                ");
            EndContext();
            BeginContext(419, 182, false);
#line 16 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
           Write(Html.DropDownList($"analysisMethod", Model.AnalysisMethods.Select(am => new SelectListItem { Text = am.ToString(), Value = ((int)am).ToString() }), new { @class = "selectDropDown" }));

#line default
#line hidden
            EndContext();
            BeginContext(601, 307, true);
            WriteLiteral(@"
            </div>
        </div>

        <div id=""associationRulesParams"" class=""row display-none"">
            <div class=""col-md-4"">
                <label for=""associationRulesConfidence"">Вкажіть рівень значущості</label>
            </div>
            <div class=""col-md-4"">
                ");
            EndContext();
            BeginContext(909, 79, false);
#line 25 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
           Write(Html.TextBoxFor(m => m.AssociationRulesConfidence, new { @class = "width-50" }));

#line default
#line hidden
            EndContext();
            BeginContext(988, 290, true);
            WriteLiteral(@"
            </div>
        </div>

        <div id=""clusteringParams"" class=""row display-none"">
            <div class=""col-md-4"">
                <label for=""clustersCount"">Вкажіть кількість кластерів</label>
            </div>
            <div class=""col-md-4"">
                ");
            EndContext();
            BeginContext(1279, 66, false);
#line 34 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
           Write(Html.TextBoxFor(m => m.ClustersCount, new { @class = "width-50" }));

#line default
#line hidden
            EndContext();
            BeginContext(1345, 143, true);
            WriteLiteral("\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<h3>Дані для аналізу</h3>\r\n<div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n        ");
            EndContext();
            BeginContext(1489, 36, false);
#line 43 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
   Write(Html.HiddenFor(m => m.Imports.Count));

#line default
#line hidden
            EndContext();
            BeginContext(1525, 358, true);
            WriteLiteral(@"
        <table id=""analysisDataTable"">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Файл</th>
                    <th>Кількість записів</th>
                    <th>Кількість помилок</th>
                    <th>Дата імпорту</th>
                </tr>
            </thead>
            <tbody>
");
            EndContext();
#line 55 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                 for (int i = 0; i < Model.Imports.Count; i++)
                {

#line default
#line hidden
            BeginContext(1966, 56, true);
            WriteLiteral("                    <tr>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 2022, "", 2041, 1);
#line 58 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
WriteAttributeValue("", 2026, $"import{i}", 2026, 15, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(2041, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(2043, 19, false);
#line 58 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                                             Write(Model.Imports[i].Id);

#line default
#line hidden
            EndContext();
            BeginContext(2062, 41, true);
            WriteLiteral("</p></td>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 2103, "", 2124, 1);
#line 59 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
WriteAttributeValue("", 2107, $"fileName{i}", 2107, 17, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(2124, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(2126, 25, false);
#line 59 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                                               Write(Model.Imports[i].FileName);

#line default
#line hidden
            EndContext();
            BeginContext(2151, 41, true);
            WriteLiteral("</p></td>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 2192, "", 2217, 1);
#line 60 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
WriteAttributeValue("", 2196, $"recordsCount{i}", 2196, 21, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(2217, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(2219, 29, false);
#line 60 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                                                   Write(Model.Imports[i].RecordsCount);

#line default
#line hidden
            EndContext();
            BeginContext(2248, 41, true);
            WriteLiteral("</p></td>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 2289, "", 2313, 1);
#line 61 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
WriteAttributeValue("", 2293, $"errorsCount{i}", 2293, 20, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(2313, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(2315, 28, false);
#line 61 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                                                  Write(Model.Imports[i].ErrorsCount);

#line default
#line hidden
            EndContext();
            BeginContext(2343, 41, true);
            WriteLiteral("</p></td>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 2384, "", 2407, 1);
#line 62 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
WriteAttributeValue("", 2388, $"importDate{i}", 2388, 19, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(2407, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(2409, 27, false);
#line 62 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                                                 Write(Model.Imports[i].ImportDate);

#line default
#line hidden
            EndContext();
            BeginContext(2436, 38, true);
            WriteLiteral("</p></td>\r\n                    </tr>\r\n");
            EndContext();
#line 64 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
                }

#line default
#line hidden
            BeginContext(2493, 220, true);
            WriteLiteral("            </tbody>\r\n        </table>\r\n    </div>\r\n</div>\r\n<div class=\"row\">\r\n    <div class=\"col-md-4\">\r\n        <input type=\"submit\" id=\"okButton\" class=\"btn btn-default\" value=\"Аналізувати\" />\r\n    </div>\r\n</div>\r\n\r\n");
            EndContext();
            BeginContext(2713, 123, false);
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("environment", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "482da78db21a47d68b88eaded33e628b", async() => {
                BeginContext(2748, 6, true);
                WriteLiteral("\r\n    ");
                EndContext();
                BeginContext(2754, 66, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "1d7a349dd0f2411483cf8f89e17ef7ae", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.Src = (string)__tagHelperAttribute_0.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
#line 76 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\Index.cshtml"
__Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.AppendVersion = true;

#line default
#line hidden
                __tagHelperExecutionContext.AddTagHelperAttribute("asp-append-version", __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.AppendVersion, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(2820, 2, true);
                WriteLiteral("\r\n");
                EndContext();
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper.Include = (string)__tagHelperAttribute_1.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_1);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            EndContext();
            BeginContext(2836, 2, true);
            WriteLiteral("\r\n");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<EasyDataAnalyzer.Models.Analysis.AnalysisSettingsViewModel> Html { get; private set; }
    }
}
#pragma warning restore 1591
