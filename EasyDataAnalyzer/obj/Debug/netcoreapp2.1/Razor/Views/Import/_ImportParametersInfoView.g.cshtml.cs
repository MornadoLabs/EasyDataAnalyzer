#pragma checksum "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportParametersInfoView.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "988a462b3e4f8315d4ee9d5ccb334f0a2cd4ba7d"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Import__ImportParametersInfoView), @"mvc.1.0.view", @"/Views/Import/_ImportParametersInfoView.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Import/_ImportParametersInfoView.cshtml", typeof(AspNetCore.Views_Import__ImportParametersInfoView))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"988a462b3e4f8315d4ee9d5ccb334f0a2cd4ba7d", @"/Views/Import/_ImportParametersInfoView.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"7eb192f17ac70567e5c6fbee126afd50387d8c53", @"/Views/_ViewImports.cshtml")]
    public class Views_Import__ImportParametersInfoView : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<List<EasyDataAnalyzer.Data.Entities.ImportParameter>>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 2, true);
            WriteLiteral("\r\n");
            EndContext();
            BeginContext(63, 356, true);
            WriteLiteral(@"
    <div class=""row"">
        <div class=""col-md-12"">
            <table id=""parametersInfoTable"">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Параметр</th>
                        <th>Значення</th>
                    </tr>
                </thead>
                <tbody>
");
            EndContext();
#line 15 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportParametersInfoView.cshtml"
                     foreach (var param in Model)
                    {

#line default
#line hidden
            BeginContext(493, 62, true);
            WriteLiteral("                        <tr>\r\n                            <td>");
            EndContext();
            BeginContext(557, 24, false);
#line 18 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportParametersInfoView.cshtml"
                            Write(Model.IndexOf(param) + 1);

#line default
#line hidden
            EndContext();
            BeginContext(582, 39, true);
            WriteLiteral("</td>\r\n                            <td>");
            EndContext();
            BeginContext(622, 19, false);
#line 19 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportParametersInfoView.cshtml"
                           Write(param.ParameterName);

#line default
#line hidden
            EndContext();
            BeginContext(641, 39, true);
            WriteLiteral("</td>\r\n                            <td>");
            EndContext();
            BeginContext(681, 20, false);
#line 20 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportParametersInfoView.cshtml"
                           Write(param.ParameterValue);

#line default
#line hidden
            EndContext();
            BeginContext(701, 38, true);
            WriteLiteral("</td>\r\n                        </tr>\r\n");
            EndContext();
#line 22 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportParametersInfoView.cshtml"
                    }

#line default
#line hidden
            BeginContext(762, 74, true);
            WriteLiteral("                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>");
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<List<EasyDataAnalyzer.Data.Entities.ImportParameter>> Html { get; private set; }
    }
}
#pragma warning restore 1591
