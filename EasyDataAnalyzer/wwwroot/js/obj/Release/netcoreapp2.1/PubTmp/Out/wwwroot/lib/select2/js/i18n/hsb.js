/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/hsb", [], function () { var e = ["znamješko", "znamješce", "znamješka", "znamješkow"], t = ["zapisk", "zapiskaj", "zapiski", "zapiskow"], n = function (t, n) { if (t === 1)
    return n[0]; if (t === 2)
    return n[1]; if (t > 2 && t <= 4)
    return n[2]; if (t >= 5)
    return n[3]; }; return { errorLoading: function () { return "Wuslědki njedachu so začitać."; }, inputTooLong: function (t) { var r = t.input.length - t.maximum; return "Prošu zhašej " + r + " " + n(r, e); }, inputTooShort: function (t) { var r = t.minimum - t.input.length; return "Prošu zapodaj znajmjeńša " + r + " " + n(r, e); }, loadingMore: function () { return "Dalše wuslědki so začitaja…"; }, maximumSelected: function (e) { return "Móžeš jenož " + e.maximum + " " + n(e.maximum, t) + "wubrać"; }, noResults: function () { return "Žane wuslědki namakane"; }, searching: function () { return "Pyta so…"; }, removeAllItems: function () { return "Remove all items"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHNiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL3NlbGVjdDIvanMvaTE4bi9oc2IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0ZBQWdGO0FBRWhGLENBQUMsY0FBVyxJQUFHLE1BQU0sSUFBRSxNQUFNLENBQUMsRUFBRSxJQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUc7SUFBQyxJQUFJLENBQUMsR0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUMsRUFBRSxFQUFDLGNBQVcsSUFBSSxDQUFDLEdBQUMsQ0FBQyxXQUFXLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxZQUFZLENBQUMsRUFBQyxDQUFDLEdBQUMsQ0FBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxVQUFVLENBQUMsRUFBQyxDQUFDLEdBQUMsVUFBUyxDQUFDLEVBQUMsQ0FBQyxJQUFFLElBQUcsQ0FBQyxLQUFHLENBQUM7SUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLElBQUcsQ0FBQyxLQUFHLENBQUM7SUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLElBQUcsQ0FBQyxHQUFDLENBQUMsSUFBRSxDQUFDLElBQUUsQ0FBQztJQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsSUFBRyxDQUFDLElBQUUsQ0FBQztJQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUEsT0FBTSxFQUFDLFlBQVksRUFBQyxjQUFXLE9BQU0sK0JBQStCLENBQUEsQ0FBQSxDQUFDLEVBQUMsWUFBWSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQSxPQUFNLGVBQWUsR0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUMsYUFBYSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQSxPQUFNLDJCQUEyQixHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxXQUFXLEVBQUMsY0FBVyxPQUFNLDZCQUE2QixDQUFBLENBQUEsQ0FBQyxFQUFDLGVBQWUsRUFBQyxVQUFTLENBQUMsSUFBRSxPQUFNLGNBQWMsR0FBQyxDQUFDLENBQUMsT0FBTyxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsR0FBQyxRQUFRLENBQUEsQ0FBQSxDQUFDLEVBQUMsU0FBUyxFQUFDLGNBQVcsT0FBTSx3QkFBd0IsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLFVBQVUsQ0FBQSxDQUFBLENBQUMsRUFBQyxjQUFjLEVBQUMsY0FBVyxPQUFNLGtCQUFrQixDQUFBLENBQUEsQ0FBQyxFQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFNlbGVjdDIgNC4wLjcgfCBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQgKi9cblxuKGZ1bmN0aW9uKCl7aWYoalF1ZXJ5JiZqUXVlcnkuZm4mJmpRdWVyeS5mbi5zZWxlY3QyJiZqUXVlcnkuZm4uc2VsZWN0Mi5hbWQpdmFyIGU9alF1ZXJ5LmZuLnNlbGVjdDIuYW1kO3JldHVybiBlLmRlZmluZShcInNlbGVjdDIvaTE4bi9oc2JcIixbXSxmdW5jdGlvbigpe3ZhciBlPVtcInpuYW1qZcWha29cIixcInpuYW1qZcWhY2VcIixcInpuYW1qZcWha2FcIixcInpuYW1qZcWha293XCJdLHQ9W1wiemFwaXNrXCIsXCJ6YXBpc2thalwiLFwiemFwaXNraVwiLFwiemFwaXNrb3dcIl0sbj1mdW5jdGlvbih0LG4pe2lmKHQ9PT0xKXJldHVybiBuWzBdO2lmKHQ9PT0yKXJldHVybiBuWzFdO2lmKHQ+MiYmdDw9NClyZXR1cm4gblsyXTtpZih0Pj01KXJldHVybiBuWzNdfTtyZXR1cm57ZXJyb3JMb2FkaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJXdXNsxJtka2kgbmplZGFjaHUgc28gemHEjWl0YcSHLlwifSxpbnB1dFRvb0xvbmc6ZnVuY3Rpb24odCl7dmFyIHI9dC5pbnB1dC5sZW5ndGgtdC5tYXhpbXVtO3JldHVyblwiUHJvxaF1IHpoYcWhZWogXCIrcitcIiBcIituKHIsZSl9LGlucHV0VG9vU2hvcnQ6ZnVuY3Rpb24odCl7dmFyIHI9dC5taW5pbXVtLXQuaW5wdXQubGVuZ3RoO3JldHVyblwiUHJvxaF1IHphcG9kYWogem5ham1qZcWExaFhIFwiK3IrXCIgXCIrbihyLGUpfSxsb2FkaW5nTW9yZTpmdW5jdGlvbigpe3JldHVyblwiRGFsxaFlIHd1c2zEm2RraSBzbyB6YcSNaXRhamHigKZcIn0sbWF4aW11bVNlbGVjdGVkOmZ1bmN0aW9uKGUpe3JldHVyblwiTcOzxb5lxaEgamVub8W+IFwiK2UubWF4aW11bStcIiBcIituKGUubWF4aW11bSx0KStcInd1YnJhxIdcIn0sbm9SZXN1bHRzOmZ1bmN0aW9uKCl7cmV0dXJuXCLFvWFuZSB3dXNsxJtka2kgbmFtYWthbmVcIn0sc2VhcmNoaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJQeXRhIHNv4oCmXCJ9LHJlbW92ZUFsbEl0ZW1zOmZ1bmN0aW9uKCl7cmV0dXJuXCJSZW1vdmUgYWxsIGl0ZW1zXCJ9fX0pLHtkZWZpbmU6ZS5kZWZpbmUscmVxdWlyZTplLnJlcXVpcmV9fSkoKTsiXX0=