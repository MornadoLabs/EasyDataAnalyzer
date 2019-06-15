/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/de", [], function () { return { errorLoading: function () { return "Die Ergebnisse konnten nicht geladen werden."; }, inputTooLong: function (e) { var t = e.input.length - e.maximum; return "Bitte " + t + " Zeichen weniger eingeben"; }, inputTooShort: function (e) { var t = e.minimum - e.input.length; return "Bitte " + t + " Zeichen mehr eingeben"; }, loadingMore: function () { return "Lade mehr Ergebnisse…"; }, maximumSelected: function (e) { var t = "Sie können nur " + e.maximum + " Eintr"; return e.maximum === 1 ? t += "ag" : t += "äge", t += " auswählen", t; }, noResults: function () { return "Keine Übereinstimmungen gefunden"; }, searching: function () { return "Suche…"; }, removeAllItems: function () { return "Entferne alle Gegenstände"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLE9BQU0sRUFBQyxZQUFZLEVBQUMsY0FBVyxPQUFNLDhDQUE4QyxDQUFBLENBQUEsQ0FBQyxFQUFDLFlBQVksRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEsT0FBTSxRQUFRLEdBQUMsQ0FBQyxHQUFDLDJCQUEyQixDQUFBLENBQUEsQ0FBQyxFQUFDLGFBQWEsRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsT0FBTyxHQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUEsT0FBTSxRQUFRLEdBQUMsQ0FBQyxHQUFDLHdCQUF3QixDQUFBLENBQUEsQ0FBQyxFQUFDLFdBQVcsRUFBQyxjQUFXLE9BQU0sdUJBQXVCLENBQUEsQ0FBQSxDQUFDLEVBQUMsZUFBZSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLGlCQUFpQixHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsUUFBUSxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsT0FBTyxLQUFHLENBQUMsQ0FBQSxDQUFDLENBQUEsQ0FBQyxJQUFFLElBQUksQ0FBQSxDQUFDLENBQUEsQ0FBQyxJQUFFLEtBQUssRUFBQyxDQUFDLElBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLGtDQUFrQyxDQUFBLENBQUEsQ0FBQyxFQUFDLFNBQVMsRUFBQyxjQUFXLE9BQU0sUUFBUSxDQUFBLENBQUEsQ0FBQyxFQUFDLGNBQWMsRUFBQyxjQUFXLE9BQU0sMkJBQTJCLENBQUEsQ0FBQSxDQUFDLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgU2VsZWN0MiA0LjAuNyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZCAqL1xuXG4oZnVuY3Rpb24oKXtpZihqUXVlcnkmJmpRdWVyeS5mbiYmalF1ZXJ5LmZuLnNlbGVjdDImJmpRdWVyeS5mbi5zZWxlY3QyLmFtZCl2YXIgZT1qUXVlcnkuZm4uc2VsZWN0Mi5hbWQ7cmV0dXJuIGUuZGVmaW5lKFwic2VsZWN0Mi9pMThuL2RlXCIsW10sZnVuY3Rpb24oKXtyZXR1cm57ZXJyb3JMb2FkaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJEaWUgRXJnZWJuaXNzZSBrb25udGVuIG5pY2h0IGdlbGFkZW4gd2VyZGVuLlwifSxpbnB1dFRvb0xvbmc6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5pbnB1dC5sZW5ndGgtZS5tYXhpbXVtO3JldHVyblwiQml0dGUgXCIrdCtcIiBaZWljaGVuIHdlbmlnZXIgZWluZ2ViZW5cIn0saW5wdXRUb29TaG9ydDpmdW5jdGlvbihlKXt2YXIgdD1lLm1pbmltdW0tZS5pbnB1dC5sZW5ndGg7cmV0dXJuXCJCaXR0ZSBcIit0K1wiIFplaWNoZW4gbWVociBlaW5nZWJlblwifSxsb2FkaW5nTW9yZTpmdW5jdGlvbigpe3JldHVyblwiTGFkZSBtZWhyIEVyZ2Vibmlzc2XigKZcIn0sbWF4aW11bVNlbGVjdGVkOmZ1bmN0aW9uKGUpe3ZhciB0PVwiU2llIGvDtm5uZW4gbnVyIFwiK2UubWF4aW11bStcIiBFaW50clwiO3JldHVybiBlLm1heGltdW09PT0xP3QrPVwiYWdcIjp0Kz1cIsOkZ2VcIix0Kz1cIiBhdXN3w6RobGVuXCIsdH0sbm9SZXN1bHRzOmZ1bmN0aW9uKCl7cmV0dXJuXCJLZWluZSDDnGJlcmVpbnN0aW1tdW5nZW4gZ2VmdW5kZW5cIn0sc2VhcmNoaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJTdWNoZeKAplwifSxyZW1vdmVBbGxJdGVtczpmdW5jdGlvbigpe3JldHVyblwiRW50ZmVybmUgYWxsZSBHZWdlbnN0w6RuZGVcIn19fSkse2RlZmluZTplLmRlZmluZSxyZXF1aXJlOmUucmVxdWlyZX19KSgpOyJdfQ==