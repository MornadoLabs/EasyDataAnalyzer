/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/sr", [], function () { function e(e, t, n, r) { return e % 10 == 1 && e % 100 != 11 ? t : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 12 || e % 100 > 14) ? n : r; } return { errorLoading: function () { return "Preuzimanje nije uspelo."; }, inputTooLong: function (t) { var n = t.input.length - t.maximum, r = "Obrišite " + n + " simbol"; return r += e(n, "", "a", "a"), r; }, inputTooShort: function (t) { var n = t.minimum - t.input.length, r = "Ukucajte bar još " + n + " simbol"; return r += e(n, "", "a", "a"), r; }, loadingMore: function () { return "Preuzimanje još rezultata…"; }, maximumSelected: function (t) { var n = "Možete izabrati samo " + t.maximum + " stavk"; return n += e(t.maximum, "u", "e", "i"), n; }, noResults: function () { return "Ništa nije pronađeno"; }, searching: function () { return "Pretraga…"; }, removeAllItems: function () { return "Уклоните све ставке"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL3NyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsSUFBRSxPQUFPLENBQUMsR0FBQyxFQUFFLElBQUUsQ0FBQyxJQUFFLENBQUMsR0FBQyxHQUFHLElBQUUsRUFBRSxDQUFBLENBQUMsQ0FBQSxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsR0FBQyxFQUFFLElBQUUsQ0FBQyxJQUFFLENBQUMsR0FBQyxFQUFFLElBQUUsQ0FBQyxJQUFFLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxFQUFFLElBQUUsQ0FBQyxHQUFDLEdBQUcsR0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDLENBQUEsQ0FBQyxDQUFBLENBQUMsQ0FBQSxDQUFDLENBQUEsQ0FBQSxDQUFDLENBQUEsT0FBTSxFQUFDLFlBQVksRUFBQyxjQUFXLE9BQU0sMEJBQTBCLENBQUEsQ0FBQSxDQUFDLEVBQUMsWUFBWSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxHQUFDLFdBQVcsR0FBQyxDQUFDLEdBQUMsU0FBUyxDQUFDLENBQUEsT0FBTyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxhQUFhLEVBQUMsVUFBUyxDQUFDLElBQUUsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEdBQUMsbUJBQW1CLEdBQUMsQ0FBQyxHQUFDLFNBQVMsQ0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUMsV0FBVyxFQUFDLGNBQVcsT0FBTSw0QkFBNEIsQ0FBQSxDQUFBLENBQUMsRUFBQyxlQUFlLEVBQUMsVUFBUyxDQUFDLElBQUUsSUFBSSxDQUFDLEdBQUMsdUJBQXVCLEdBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxRQUFRLENBQUMsQ0FBQSxPQUFPLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLHNCQUFzQixDQUFBLENBQUEsQ0FBQyxFQUFDLFNBQVMsRUFBQyxjQUFXLE9BQU0sV0FBVyxDQUFBLENBQUEsQ0FBQyxFQUFDLGNBQWMsRUFBQyxjQUFXLE9BQU0scUJBQXFCLENBQUEsQ0FBQSxDQUFDLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgU2VsZWN0MiA0LjAuNyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZCAqL1xuXG4oZnVuY3Rpb24oKXtpZihqUXVlcnkmJmpRdWVyeS5mbiYmalF1ZXJ5LmZuLnNlbGVjdDImJmpRdWVyeS5mbi5zZWxlY3QyLmFtZCl2YXIgZT1qUXVlcnkuZm4uc2VsZWN0Mi5hbWQ7cmV0dXJuIGUuZGVmaW5lKFwic2VsZWN0Mi9pMThuL3NyXCIsW10sZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCxuLHIpe3JldHVybiBlJTEwPT0xJiZlJTEwMCE9MTE/dDplJTEwPj0yJiZlJTEwPD00JiYoZSUxMDA8MTJ8fGUlMTAwPjE0KT9uOnJ9cmV0dXJue2Vycm9yTG9hZGluZzpmdW5jdGlvbigpe3JldHVyblwiUHJldXppbWFuamUgbmlqZSB1c3BlbG8uXCJ9LGlucHV0VG9vTG9uZzpmdW5jdGlvbih0KXt2YXIgbj10LmlucHV0Lmxlbmd0aC10Lm1heGltdW0scj1cIk9icmnFoWl0ZSBcIituK1wiIHNpbWJvbFwiO3JldHVybiByKz1lKG4sXCJcIixcImFcIixcImFcIikscn0saW5wdXRUb29TaG9ydDpmdW5jdGlvbih0KXt2YXIgbj10Lm1pbmltdW0tdC5pbnB1dC5sZW5ndGgscj1cIlVrdWNhanRlIGJhciBqb8WhIFwiK24rXCIgc2ltYm9sXCI7cmV0dXJuIHIrPWUobixcIlwiLFwiYVwiLFwiYVwiKSxyfSxsb2FkaW5nTW9yZTpmdW5jdGlvbigpe3JldHVyblwiUHJldXppbWFuamUgam/FoSByZXp1bHRhdGHigKZcIn0sbWF4aW11bVNlbGVjdGVkOmZ1bmN0aW9uKHQpe3ZhciBuPVwiTW/FvmV0ZSBpemFicmF0aSBzYW1vIFwiK3QubWF4aW11bStcIiBzdGF2a1wiO3JldHVybiBuKz1lKHQubWF4aW11bSxcInVcIixcImVcIixcImlcIiksbn0sbm9SZXN1bHRzOmZ1bmN0aW9uKCl7cmV0dXJuXCJOacWhdGEgbmlqZSBwcm9uYcSRZW5vXCJ9LHNlYXJjaGluZzpmdW5jdGlvbigpe3JldHVyblwiUHJldHJhZ2HigKZcIn0scmVtb3ZlQWxsSXRlbXM6ZnVuY3Rpb24oKXtyZXR1cm5cItCj0LrQu9C+0L3QuNGC0LUg0YHQstC1INGB0YLQsNCy0LrQtVwifX19KSx7ZGVmaW5lOmUuZGVmaW5lLHJlcXVpcmU6ZS5yZXF1aXJlfX0pKCk7Il19