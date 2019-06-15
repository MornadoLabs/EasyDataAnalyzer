/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/ms", [], function () { return { errorLoading: function () { return "Keputusan tidak berjaya dimuatkan."; }, inputTooLong: function (e) { var t = e.input.length - e.maximum; return "Sila hapuskan " + t + " aksara"; }, inputTooShort: function (e) { var t = e.minimum - e.input.length; return "Sila masukkan " + t + " atau lebih aksara"; }, loadingMore: function () { return "Sedang memuatkan keputusan…"; }, maximumSelected: function (e) { return "Anda hanya boleh memilih " + e.maximum + " pilihan"; }, noResults: function () { return "Tiada padanan yang ditemui"; }, searching: function () { return "Mencari…"; }, removeAllItems: function () { return "Keluarkan semua item"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL21zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLE9BQU0sRUFBQyxZQUFZLEVBQUMsY0FBVyxPQUFNLG9DQUFvQyxDQUFBLENBQUEsQ0FBQyxFQUFDLFlBQVksRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEsT0FBTSxnQkFBZ0IsR0FBQyxDQUFDLEdBQUMsU0FBUyxDQUFBLENBQUEsQ0FBQyxFQUFDLGFBQWEsRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsT0FBTyxHQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUEsT0FBTSxnQkFBZ0IsR0FBQyxDQUFDLEdBQUMsb0JBQW9CLENBQUEsQ0FBQSxDQUFDLEVBQUMsV0FBVyxFQUFDLGNBQVcsT0FBTSw2QkFBNkIsQ0FBQSxDQUFBLENBQUMsRUFBQyxlQUFlLEVBQUMsVUFBUyxDQUFDLElBQUUsT0FBTSwyQkFBMkIsR0FBQyxDQUFDLENBQUMsT0FBTyxHQUFDLFVBQVUsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLDRCQUE0QixDQUFBLENBQUEsQ0FBQyxFQUFDLFNBQVMsRUFBQyxjQUFXLE9BQU0sVUFBVSxDQUFBLENBQUEsQ0FBQyxFQUFDLGNBQWMsRUFBQyxjQUFXLE9BQU0sc0JBQXNCLENBQUEsQ0FBQSxDQUFDLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgU2VsZWN0MiA0LjAuNyB8IGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZCAqL1xuXG4oZnVuY3Rpb24oKXtpZihqUXVlcnkmJmpRdWVyeS5mbiYmalF1ZXJ5LmZuLnNlbGVjdDImJmpRdWVyeS5mbi5zZWxlY3QyLmFtZCl2YXIgZT1qUXVlcnkuZm4uc2VsZWN0Mi5hbWQ7cmV0dXJuIGUuZGVmaW5lKFwic2VsZWN0Mi9pMThuL21zXCIsW10sZnVuY3Rpb24oKXtyZXR1cm57ZXJyb3JMb2FkaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJLZXB1dHVzYW4gdGlkYWsgYmVyamF5YSBkaW11YXRrYW4uXCJ9LGlucHV0VG9vTG9uZzpmdW5jdGlvbihlKXt2YXIgdD1lLmlucHV0Lmxlbmd0aC1lLm1heGltdW07cmV0dXJuXCJTaWxhIGhhcHVza2FuIFwiK3QrXCIgYWtzYXJhXCJ9LGlucHV0VG9vU2hvcnQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5taW5pbXVtLWUuaW5wdXQubGVuZ3RoO3JldHVyblwiU2lsYSBtYXN1a2thbiBcIit0K1wiIGF0YXUgbGViaWggYWtzYXJhXCJ9LGxvYWRpbmdNb3JlOmZ1bmN0aW9uKCl7cmV0dXJuXCJTZWRhbmcgbWVtdWF0a2FuIGtlcHV0dXNhbuKAplwifSxtYXhpbXVtU2VsZWN0ZWQ6ZnVuY3Rpb24oZSl7cmV0dXJuXCJBbmRhIGhhbnlhIGJvbGVoIG1lbWlsaWggXCIrZS5tYXhpbXVtK1wiIHBpbGloYW5cIn0sbm9SZXN1bHRzOmZ1bmN0aW9uKCl7cmV0dXJuXCJUaWFkYSBwYWRhbmFuIHlhbmcgZGl0ZW11aVwifSxzZWFyY2hpbmc6ZnVuY3Rpb24oKXtyZXR1cm5cIk1lbmNhcmnigKZcIn0scmVtb3ZlQWxsSXRlbXM6ZnVuY3Rpb24oKXtyZXR1cm5cIktlbHVhcmthbiBzZW11YSBpdGVtXCJ9fX0pLHtkZWZpbmU6ZS5kZWZpbmUscmVxdWlyZTplLnJlcXVpcmV9fSkoKTsiXX0=