/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/hu", [], function () { return { errorLoading: function () { return "Az eredmények betöltése nem sikerült."; }, inputTooLong: function (e) { var t = e.input.length - e.maximum; return "Túl hosszú. " + t + " karakterrel több, mint kellene."; }, inputTooShort: function (e) { var t = e.minimum - e.input.length; return "Túl rövid. Még " + t + " karakter hiányzik."; }, loadingMore: function () { return "Töltés…"; }, maximumSelected: function (e) { return "Csak " + e.maximum + " elemet lehet kiválasztani."; }, noResults: function () { return "Nincs találat."; }, searching: function () { return "Keresés…"; }, removeAllItems: function () { return "Távolítson el minden elemet"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL2h1LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLE9BQU0sRUFBQyxZQUFZLEVBQUMsY0FBVyxPQUFNLHVDQUF1QyxDQUFBLENBQUEsQ0FBQyxFQUFDLFlBQVksRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEsT0FBTSxjQUFjLEdBQUMsQ0FBQyxHQUFDLGtDQUFrQyxDQUFBLENBQUEsQ0FBQyxFQUFDLGFBQWEsRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsT0FBTyxHQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUEsT0FBTSxpQkFBaUIsR0FBQyxDQUFDLEdBQUMscUJBQXFCLENBQUEsQ0FBQSxDQUFDLEVBQUMsV0FBVyxFQUFDLGNBQVcsT0FBTSxTQUFTLENBQUEsQ0FBQSxDQUFDLEVBQUMsZUFBZSxFQUFDLFVBQVMsQ0FBQyxJQUFFLE9BQU0sT0FBTyxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsNkJBQTZCLENBQUEsQ0FBQSxDQUFDLEVBQUMsU0FBUyxFQUFDLGNBQVcsT0FBTSxnQkFBZ0IsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLFVBQVUsQ0FBQSxDQUFBLENBQUMsRUFBQyxjQUFjLEVBQUMsY0FBVyxPQUFNLDZCQUE2QixDQUFBLENBQUEsQ0FBQyxFQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFNlbGVjdDIgNC4wLjcgfCBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQgKi9cblxuKGZ1bmN0aW9uKCl7aWYoalF1ZXJ5JiZqUXVlcnkuZm4mJmpRdWVyeS5mbi5zZWxlY3QyJiZqUXVlcnkuZm4uc2VsZWN0Mi5hbWQpdmFyIGU9alF1ZXJ5LmZuLnNlbGVjdDIuYW1kO3JldHVybiBlLmRlZmluZShcInNlbGVjdDIvaTE4bi9odVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJue2Vycm9yTG9hZGluZzpmdW5jdGlvbigpe3JldHVyblwiQXogZXJlZG3DqW55ZWsgYmV0w7ZsdMOpc2UgbmVtIHNpa2Vyw7xsdC5cIn0saW5wdXRUb29Mb25nOmZ1bmN0aW9uKGUpe3ZhciB0PWUuaW5wdXQubGVuZ3RoLWUubWF4aW11bTtyZXR1cm5cIlTDumwgaG9zc3rDui4gXCIrdCtcIiBrYXJha3RlcnJlbCB0w7ZiYiwgbWludCBrZWxsZW5lLlwifSxpbnB1dFRvb1Nob3J0OmZ1bmN0aW9uKGUpe3ZhciB0PWUubWluaW11bS1lLmlucHV0Lmxlbmd0aDtyZXR1cm5cIlTDumwgcsO2dmlkLiBNw6lnIFwiK3QrXCIga2FyYWt0ZXIgaGnDoW55emlrLlwifSxsb2FkaW5nTW9yZTpmdW5jdGlvbigpe3JldHVyblwiVMO2bHTDqXPigKZcIn0sbWF4aW11bVNlbGVjdGVkOmZ1bmN0aW9uKGUpe3JldHVyblwiQ3NhayBcIitlLm1heGltdW0rXCIgZWxlbWV0IGxlaGV0IGtpdsOhbGFzenRhbmkuXCJ9LG5vUmVzdWx0czpmdW5jdGlvbigpe3JldHVyblwiTmluY3MgdGFsw6FsYXQuXCJ9LHNlYXJjaGluZzpmdW5jdGlvbigpe3JldHVyblwiS2VyZXPDqXPigKZcIn0scmVtb3ZlQWxsSXRlbXM6ZnVuY3Rpb24oKXtyZXR1cm5cIlTDoXZvbMOtdHNvbiBlbCBtaW5kZW4gZWxlbWV0XCJ9fX0pLHtkZWZpbmU6ZS5kZWZpbmUscmVxdWlyZTplLnJlcXVpcmV9fSkoKTsiXX0=