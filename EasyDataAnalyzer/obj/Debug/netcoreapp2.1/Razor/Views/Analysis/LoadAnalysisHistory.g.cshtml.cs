#pragma checksum "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "100c5b81a63af5932235b29327740c6f16aa4e19"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Analysis_LoadAnalysisHistory), @"mvc.1.0.view", @"/Views/Analysis/LoadAnalysisHistory.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Analysis/LoadAnalysisHistory.cshtml", typeof(AspNetCore.Views_Analysis_LoadAnalysisHistory))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"100c5b81a63af5932235b29327740c6f16aa4e19", @"/Views/Analysis/LoadAnalysisHistory.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"7eb192f17ac70567e5c6fbee126afd50387d8c53", @"/Views/_ViewImports.cshtml")]
    public class Views_Analysis_LoadAnalysisHistory : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<EasyDataAnalyzer.Models.Analysis.AnalysisHistoryViewModel>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", "~/js/analysisHistory.js", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
#line 2 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
  
    ViewData["Title"] = "LoadAnalysisHistory";

#line default
#line hidden
            BeginContext(57, 2, true);
            WriteLiteral("\r\n");
            EndContext();
            BeginContext(125, 84, true);
            WriteLiteral("<h2>Історія аналізу</h2>\r\n\r\n<div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n        ");
            EndContext();
            BeginContext(210, 46, false);
#line 11 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
   Write(Html.HiddenFor(m => m.AnalysisHistories.Count));

#line default
#line hidden
            EndContext();
            BeginContext(256, 326, true);
            WriteLiteral(@"
        <table id=""analysisHistoryDataTable"">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Дата аналізу</th>
                    <th>Дані аналізу</th>
                    <th>Результати аналізу</th>
                </tr>
            </thead>
            <tbody>
");
            EndContext();
#line 22 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
                 for (int i = 0; i < Model.AnalysisHistories.Count; i++)
                {

#line default
#line hidden
            BeginContext(675, 56, true);
            WriteLiteral("                    <tr>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 731, "", 752, 1);
#line 25 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
WriteAttributeValue("", 735, $"analysis{i}", 735, 17, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(752, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(754, 29, false);
#line 25 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
                                               Write(Model.AnalysisHistories[i].Id);

#line default
#line hidden
            EndContext();
            BeginContext(783, 41, true);
            WriteLiteral("</p></td>\r\n                        <td><p");
            EndContext();
            BeginWriteAttribute("id", " id=", 824, "", 849, 1);
#line 26 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
WriteAttributeValue("", 828, $"analysisDate{i}", 828, 21, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(849, 1, true);
            WriteLiteral(">");
            EndContext();
            BeginContext(851, 39, false);
#line 26 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
                                                   Write(Model.AnalysisHistories[i].AnalysisDate);

#line default
#line hidden
            EndContext();
            BeginContext(890, 46, true);
            WriteLiteral("</p></td>\r\n                        <td><button");
            EndContext();
            BeginWriteAttribute("id", " id=", 936, "", 957, 1);
#line 27 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
WriteAttributeValue("", 940, $"loadData{i}", 940, 17, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(957, 77, true);
            WriteLiteral(" class=\"btn btn-info\">Дані</button></td>\r\n                        <td><button");
            EndContext();
            BeginWriteAttribute("id", " id=", 1034, "", 1058, 1);
#line 28 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
WriteAttributeValue("", 1038, $"loadResults{i}", 1038, 20, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(1058, 75, true);
            WriteLiteral(" class=\"btn btn-info\">Результати</button></td>\r\n                    </tr>\r\n");
            EndContext();
#line 30 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
                }

#line default
#line hidden
            BeginContext(1152, 62, true);
            WriteLiteral("            </tbody>\r\n        </table>\r\n    </div>\r\n</div>\r\n\r\n");
            EndContext();
            BeginContext(1214, 130, false);
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("environment", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "c9cb9c899d1a4ac09f9d324c5e8618e5", async() => {
                BeginContext(1249, 6, true);
                WriteLiteral("\r\n    ");
                EndContext();
                BeginContext(1255, 73, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "1ee512b071f2480bb1351c3826558ca3", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.Src = (string)__tagHelperAttribute_0.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
#line 37 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Analysis\LoadAnalysisHistory.cshtml"
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
                BeginContext(1328, 2, true);
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
            BeginContext(1344, 4, true);
            WriteLiteral("\r\n\r\n");
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<EasyDataAnalyzer.Models.Analysis.AnalysisHistoryViewModel> Html { get; private set; }
    }
}
#pragma warning restore 1591
