#pragma checksum "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "119d0fecd0f1790689d0745263c871e64bc751d3"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Import__ImportDataInfoView), @"mvc.1.0.view", @"/Views/Import/_ImportDataInfoView.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Import/_ImportDataInfoView.cshtml", typeof(AspNetCore.Views_Import__ImportDataInfoView))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"119d0fecd0f1790689d0745263c871e64bc751d3", @"/Views/Import/_ImportDataInfoView.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"7eb192f17ac70567e5c6fbee126afd50387d8c53", @"/Views/_ViewImports.cshtml")]
    public class Views_Import__ImportDataInfoView : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<EasyDataAnalyzer.Models.Import.ImportHistoryDataViewModel>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 4, true);
            WriteLiteral("\r\n\r\n");
            EndContext();
            BeginContext(70, 2, true);
            WriteLiteral("\r\n");
            EndContext();
#line 5 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
   
    var rows = Model.ImportData.GroupBy(id => id.RowNumber).ToDictionary(g => g.Key, g => g.ToList());

#line default
#line hidden
            BeginContext(184, 135, true);
            WriteLiteral("\r\n<div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n        <table id=\"parametersInfoTable\">\r\n            <thead>\r\n                <tr>\r\n");
            EndContext();
#line 14 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                     foreach (var header in Model.ImportHeaders)
                    {

#line default
#line hidden
            BeginContext(408, 28, true);
            WriteLiteral("                        <th>");
            EndContext();
            BeginContext(437, 17, false);
#line 16 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                       Write(header.HeaderName);

#line default
#line hidden
            EndContext();
            BeginContext(454, 7, true);
            WriteLiteral("</th>\r\n");
            EndContext();
#line 17 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                    }

#line default
#line hidden
            BeginContext(484, 66, true);
            WriteLiteral("                </tr>\r\n            </thead>\r\n            <tbody>\r\n");
            EndContext();
#line 21 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                 foreach (var row in rows)
                {

#line default
#line hidden
            BeginContext(613, 26, true);
            WriteLiteral("                    <tr>\r\n");
            EndContext();
#line 24 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                         foreach (var header in Model.ImportHeaders)
                        {

#line default
#line hidden
            BeginContext(736, 32, true);
            WriteLiteral("                            <td>");
            EndContext();
            BeginContext(770, 70, false);
#line 26 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                            Write(row.Value.Where(r => r.Header.Id == header.Id).FirstOrDefault()?.Value);

#line default
#line hidden
            EndContext();
            BeginContext(841, 10, true);
            WriteLiteral("</td>   \r\n");
            EndContext();
#line 27 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                        }

#line default
#line hidden
            BeginContext(878, 27, true);
            WriteLiteral("                    </tr>\r\n");
            EndContext();
#line 29 "D:\Learning\4_course\Diploma\EasyDataAnalyzer\EasyDataAnalyzer\Views\Import\_ImportDataInfoView.cshtml"
                }

#line default
#line hidden
            BeginContext(924, 60, true);
            WriteLiteral("            </tbody>\r\n        </table>\r\n    </div>\r\n</div>\r\n");
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<EasyDataAnalyzer.Models.Import.ImportHistoryDataViewModel> Html { get; private set; }
    }
}
#pragma warning restore 1591
