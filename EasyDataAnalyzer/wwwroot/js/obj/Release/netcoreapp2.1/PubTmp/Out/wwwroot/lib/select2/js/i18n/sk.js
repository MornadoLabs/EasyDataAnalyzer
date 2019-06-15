/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/sk", [], function () { var e = { 2: function (e) { return e ? "dva" : "dve"; }, 3: function () { return "tri"; }, 4: function () { return "štyri"; } }; return { errorLoading: function () { return "Výsledky sa nepodarilo načítať."; }, inputTooLong: function (t) { var n = t.input.length - t.maximum; return n == 1 ? "Prosím, zadajte o jeden znak menej" : n >= 2 && n <= 4 ? "Prosím, zadajte o " + e[n](!0) + " znaky menej" : "Prosím, zadajte o " + n + " znakov menej"; }, inputTooShort: function (t) { var n = t.minimum - t.input.length; return n == 1 ? "Prosím, zadajte ešte jeden znak" : n <= 4 ? "Prosím, zadajte ešte ďalšie " + e[n](!0) + " znaky" : "Prosím, zadajte ešte ďalších " + n + " znakov"; }, loadingMore: function () { return "Načítanie ďalších výsledkov…"; }, maximumSelected: function (t) { return t.maximum == 1 ? "Môžete zvoliť len jednu položku" : t.maximum >= 2 && t.maximum <= 4 ? "Môžete zvoliť najviac " + e[t.maximum](!1) + " položky" : "Môžete zvoliť najviac " + t.maximum + " položiek"; }, noResults: function () { return "Nenašli sa žiadne položky"; }, searching: function () { return "Vyhľadávanie…"; }, removeAllItems: function () { return "Odstráňte všetky položky"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL3NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLElBQUksQ0FBQyxHQUFDLEVBQUMsQ0FBQyxFQUFDLFVBQVMsQ0FBQyxJQUFFLE9BQU8sQ0FBQyxDQUFBLENBQUMsQ0FBQSxLQUFLLENBQUEsQ0FBQyxDQUFBLEtBQUssQ0FBQSxDQUFBLENBQUMsRUFBQyxDQUFDLEVBQUMsY0FBVyxPQUFNLEtBQUssQ0FBQSxDQUFBLENBQUMsRUFBQyxDQUFDLEVBQUMsY0FBVyxPQUFNLE9BQU8sQ0FBQSxDQUFBLENBQUMsRUFBQyxDQUFDLENBQUEsT0FBTSxFQUFDLFlBQVksRUFBQyxjQUFXLE9BQU0saUNBQWlDLENBQUEsQ0FBQSxDQUFDLEVBQUMsWUFBWSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQSxPQUFPLENBQUMsSUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFBLG9DQUFvQyxDQUFBLENBQUMsQ0FBQSxDQUFDLElBQUUsQ0FBQyxJQUFFLENBQUMsSUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFBLG9CQUFvQixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLGNBQWMsQ0FBQSxDQUFDLENBQUEsb0JBQW9CLEdBQUMsQ0FBQyxHQUFDLGVBQWUsQ0FBQSxDQUFBLENBQUMsRUFBQyxhQUFhLEVBQUMsVUFBUyxDQUFDLElBQUUsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFFLENBQUMsQ0FBQSxDQUFDLENBQUEsaUNBQWlDLENBQUEsQ0FBQyxDQUFBLENBQUMsSUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFBLDhCQUE4QixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUEsK0JBQStCLEdBQUMsQ0FBQyxHQUFDLFNBQVMsQ0FBQSxDQUFBLENBQUMsRUFBQyxXQUFXLEVBQUMsY0FBVyxPQUFNLDhCQUE4QixDQUFBLENBQUEsQ0FBQyxFQUFDLGVBQWUsRUFBQyxVQUFTLENBQUMsSUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUUsQ0FBQyxDQUFBLENBQUMsQ0FBQSxpQ0FBaUMsQ0FBQSxDQUFDLENBQUEsQ0FBQyxDQUFDLE9BQU8sSUFBRSxDQUFDLElBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFBLHdCQUF3QixHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFBLHdCQUF3QixHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsV0FBVyxDQUFBLENBQUEsQ0FBQyxFQUFDLFNBQVMsRUFBQyxjQUFXLE9BQU0sMkJBQTJCLENBQUEsQ0FBQSxDQUFDLEVBQUMsU0FBUyxFQUFDLGNBQVcsT0FBTSxlQUFlLENBQUEsQ0FBQSxDQUFDLEVBQUMsY0FBYyxFQUFDLGNBQVcsT0FBTSwwQkFBMEIsQ0FBQSxDQUFBLENBQUMsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBTZWxlY3QyIDQuMC43IHwgaHR0cHM6Ly9naXRodWIuY29tL3NlbGVjdDIvc2VsZWN0Mi9ibG9iL21hc3Rlci9MSUNFTlNFLm1kICovXG5cbihmdW5jdGlvbigpe2lmKGpRdWVyeSYmalF1ZXJ5LmZuJiZqUXVlcnkuZm4uc2VsZWN0MiYmalF1ZXJ5LmZuLnNlbGVjdDIuYW1kKXZhciBlPWpRdWVyeS5mbi5zZWxlY3QyLmFtZDtyZXR1cm4gZS5kZWZpbmUoXCJzZWxlY3QyL2kxOG4vc2tcIixbXSxmdW5jdGlvbigpe3ZhciBlPXsyOmZ1bmN0aW9uKGUpe3JldHVybiBlP1wiZHZhXCI6XCJkdmVcIn0sMzpmdW5jdGlvbigpe3JldHVyblwidHJpXCJ9LDQ6ZnVuY3Rpb24oKXtyZXR1cm5cIsWhdHlyaVwifX07cmV0dXJue2Vycm9yTG9hZGluZzpmdW5jdGlvbigpe3JldHVyblwiVsO9c2xlZGt5IHNhIG5lcG9kYXJpbG8gbmHEjcOtdGHFpS5cIn0saW5wdXRUb29Mb25nOmZ1bmN0aW9uKHQpe3ZhciBuPXQuaW5wdXQubGVuZ3RoLXQubWF4aW11bTtyZXR1cm4gbj09MT9cIlByb3PDrW0sIHphZGFqdGUgbyBqZWRlbiB6bmFrIG1lbmVqXCI6bj49MiYmbjw9ND9cIlByb3PDrW0sIHphZGFqdGUgbyBcIitlW25dKCEwKStcIiB6bmFreSBtZW5lalwiOlwiUHJvc8OtbSwgemFkYWp0ZSBvIFwiK24rXCIgem5ha292IG1lbmVqXCJ9LGlucHV0VG9vU2hvcnQ6ZnVuY3Rpb24odCl7dmFyIG49dC5taW5pbXVtLXQuaW5wdXQubGVuZ3RoO3JldHVybiBuPT0xP1wiUHJvc8OtbSwgemFkYWp0ZSBlxaF0ZSBqZWRlbiB6bmFrXCI6bjw9ND9cIlByb3PDrW0sIHphZGFqdGUgZcWhdGUgxI9hbMWhaWUgXCIrZVtuXSghMCkrXCIgem5ha3lcIjpcIlByb3PDrW0sIHphZGFqdGUgZcWhdGUgxI9hbMWhw61jaCBcIituK1wiIHpuYWtvdlwifSxsb2FkaW5nTW9yZTpmdW5jdGlvbigpe3JldHVyblwiTmHEjcOtdGFuaWUgxI9hbMWhw61jaCB2w71zbGVka2924oCmXCJ9LG1heGltdW1TZWxlY3RlZDpmdW5jdGlvbih0KXtyZXR1cm4gdC5tYXhpbXVtPT0xP1wiTcO0xb5ldGUgenZvbGnFpSBsZW4gamVkbnUgcG9sb8W+a3VcIjp0Lm1heGltdW0+PTImJnQubWF4aW11bTw9ND9cIk3DtMW+ZXRlIHp2b2xpxaUgbmFqdmlhYyBcIitlW3QubWF4aW11bV0oITEpK1wiIHBvbG/Fvmt5XCI6XCJNw7TFvmV0ZSB6dm9sacWlIG5hanZpYWMgXCIrdC5tYXhpbXVtK1wiIHBvbG/Fvmlla1wifSxub1Jlc3VsdHM6ZnVuY3Rpb24oKXtyZXR1cm5cIk5lbmHFoWxpIHNhIMW+aWFkbmUgcG9sb8W+a3lcIn0sc2VhcmNoaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJWeWjEvmFkw6F2YW5pZeKAplwifSxyZW1vdmVBbGxJdGVtczpmdW5jdGlvbigpe3JldHVyblwiT2RzdHLDocWIdGUgdsWhZXRreSBwb2xvxb5reVwifX19KSx7ZGVmaW5lOmUuZGVmaW5lLHJlcXVpcmU6ZS5yZXF1aXJlfX0pKCk7Il19