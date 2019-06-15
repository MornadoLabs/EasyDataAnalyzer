/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/ca", [], function () { return { errorLoading: function () { return "La càrrega ha fallat"; }, inputTooLong: function (e) { var t = e.input.length - e.maximum, n = "Si us plau, elimina " + t + " car"; return t == 1 ? n += "àcter" : n += "àcters", n; }, inputTooShort: function (e) { var t = e.minimum - e.input.length, n = "Si us plau, introdueix " + t + " car"; return t == 1 ? n += "àcter" : n += "àcters", n; }, loadingMore: function () { return "Carregant més resultats…"; }, maximumSelected: function (e) { var t = "Només es pot seleccionar " + e.maximum + " element"; return e.maximum != 1 && (t += "s"), t; }, noResults: function () { return "No s'han trobat resultats"; }, searching: function () { return "Cercant…"; }, removeAllItems: function () { return "Treu tots els elements"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2EuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL2NhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLE9BQU0sRUFBQyxZQUFZLEVBQUMsY0FBVyxPQUFNLHNCQUFzQixDQUFBLENBQUEsQ0FBQyxFQUFDLFlBQVksRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsR0FBQyxzQkFBc0IsR0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLENBQUEsT0FBTyxDQUFDLElBQUUsQ0FBQyxDQUFBLENBQUMsQ0FBQSxDQUFDLElBQUUsT0FBTyxDQUFBLENBQUMsQ0FBQSxDQUFDLElBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxhQUFhLEVBQUMsVUFBUyxDQUFDLElBQUUsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEdBQUMseUJBQXlCLEdBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFFLENBQUMsQ0FBQSxDQUFDLENBQUEsQ0FBQyxJQUFFLE9BQU8sQ0FBQSxDQUFDLENBQUEsQ0FBQyxJQUFFLFFBQVEsRUFBQyxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUMsV0FBVyxFQUFDLGNBQVcsT0FBTSwwQkFBMEIsQ0FBQSxDQUFBLENBQUMsRUFBQyxlQUFlLEVBQUMsVUFBUyxDQUFDLElBQUUsSUFBSSxDQUFDLEdBQUMsMkJBQTJCLEdBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxVQUFVLENBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUUsQ0FBQyxJQUFFLENBQUMsQ0FBQyxJQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLDJCQUEyQixDQUFBLENBQUEsQ0FBQyxFQUFDLFNBQVMsRUFBQyxjQUFXLE9BQU0sVUFBVSxDQUFBLENBQUEsQ0FBQyxFQUFDLGNBQWMsRUFBQyxjQUFXLE9BQU0sd0JBQXdCLENBQUEsQ0FBQSxDQUFDLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgU2VsZWN0MiA0LjAuNyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZCAqL1xuXG4oZnVuY3Rpb24oKXtpZihqUXVlcnkmJmpRdWVyeS5mbiYmalF1ZXJ5LmZuLnNlbGVjdDImJmpRdWVyeS5mbi5zZWxlY3QyLmFtZCl2YXIgZT1qUXVlcnkuZm4uc2VsZWN0Mi5hbWQ7cmV0dXJuIGUuZGVmaW5lKFwic2VsZWN0Mi9pMThuL2NhXCIsW10sZnVuY3Rpb24oKXtyZXR1cm57ZXJyb3JMb2FkaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJMYSBjw6BycmVnYSBoYSBmYWxsYXRcIn0saW5wdXRUb29Mb25nOmZ1bmN0aW9uKGUpe3ZhciB0PWUuaW5wdXQubGVuZ3RoLWUubWF4aW11bSxuPVwiU2kgdXMgcGxhdSwgZWxpbWluYSBcIit0K1wiIGNhclwiO3JldHVybiB0PT0xP24rPVwiw6BjdGVyXCI6bis9XCLDoGN0ZXJzXCIsbn0saW5wdXRUb29TaG9ydDpmdW5jdGlvbihlKXt2YXIgdD1lLm1pbmltdW0tZS5pbnB1dC5sZW5ndGgsbj1cIlNpIHVzIHBsYXUsIGludHJvZHVlaXggXCIrdCtcIiBjYXJcIjtyZXR1cm4gdD09MT9uKz1cIsOgY3RlclwiOm4rPVwiw6BjdGVyc1wiLG59LGxvYWRpbmdNb3JlOmZ1bmN0aW9uKCl7cmV0dXJuXCJDYXJyZWdhbnQgbcOpcyByZXN1bHRhdHPigKZcIn0sbWF4aW11bVNlbGVjdGVkOmZ1bmN0aW9uKGUpe3ZhciB0PVwiTm9tw6lzIGVzIHBvdCBzZWxlY2Npb25hciBcIitlLm1heGltdW0rXCIgZWxlbWVudFwiO3JldHVybiBlLm1heGltdW0hPTEmJih0Kz1cInNcIiksdH0sbm9SZXN1bHRzOmZ1bmN0aW9uKCl7cmV0dXJuXCJObyBzJ2hhbiB0cm9iYXQgcmVzdWx0YXRzXCJ9LHNlYXJjaGluZzpmdW5jdGlvbigpe3JldHVyblwiQ2VyY2FudOKAplwifSxyZW1vdmVBbGxJdGVtczpmdW5jdGlvbigpe3JldHVyblwiVHJldSB0b3RzIGVscyBlbGVtZW50c1wifX19KSx7ZGVmaW5lOmUuZGVmaW5lLHJlcXVpcmU6ZS5yZXF1aXJlfX0pKCk7Il19