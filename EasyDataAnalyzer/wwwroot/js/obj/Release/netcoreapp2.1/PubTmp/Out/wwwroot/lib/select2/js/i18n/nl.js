/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/nl", [], function () { return { errorLoading: function () { return "De resultaten konden niet worden geladen."; }, inputTooLong: function (e) { var t = e.input.length - e.maximum, n = "Gelieve " + t + " karakters te verwijderen"; return n; }, inputTooShort: function (e) { var t = e.minimum - e.input.length, n = "Gelieve " + t + " of meer karakters in te voeren"; return n; }, loadingMore: function () { return "Meer resultaten laden…"; }, maximumSelected: function (e) { var t = e.maximum == 1 ? "kan" : "kunnen", n = "Er " + t + " maar " + e.maximum + " item"; return e.maximum != 1 && (n += "s"), n += " worden geselecteerd", n; }, noResults: function () { return "Geen resultaten gevonden…"; }, searching: function () { return "Zoeken…"; }, removeAllItems: function () { return "Verwijder alle items"; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL25sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLE9BQU0sRUFBQyxZQUFZLEVBQUMsY0FBVyxPQUFNLDJDQUEyQyxDQUFBLENBQUEsQ0FBQyxFQUFDLFlBQVksRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsR0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFDLDJCQUEyQixDQUFDLENBQUEsT0FBTyxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUMsYUFBYSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxHQUFDLFVBQVUsR0FBQyxDQUFDLEdBQUMsaUNBQWlDLENBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBQyxXQUFXLEVBQUMsY0FBVyxPQUFNLHdCQUF3QixDQUFBLENBQUEsQ0FBQyxFQUFDLGVBQWUsRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsT0FBTyxJQUFFLENBQUMsQ0FBQSxDQUFDLENBQUEsS0FBSyxDQUFBLENBQUMsQ0FBQSxRQUFRLEVBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsT0FBTyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFFLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxHQUFHLENBQUMsRUFBQyxDQUFDLElBQUUsc0JBQXNCLEVBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQyxFQUFDLFNBQVMsRUFBQyxjQUFXLE9BQU0sMkJBQTJCLENBQUEsQ0FBQSxDQUFDLEVBQUMsU0FBUyxFQUFDLGNBQVcsT0FBTSxTQUFTLENBQUEsQ0FBQSxDQUFDLEVBQUMsY0FBYyxFQUFDLGNBQVcsT0FBTSxzQkFBc0IsQ0FBQSxDQUFBLENBQUMsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBTZWxlY3QyIDQuMC43IHwgaHR0cHM6Ly9naXRodWIuY29tL3NlbGVjdDIvc2VsZWN0Mi9ibG9iL21hc3Rlci9MSUNFTlNFLm1kICovXG5cbihmdW5jdGlvbigpe2lmKGpRdWVyeSYmalF1ZXJ5LmZuJiZqUXVlcnkuZm4uc2VsZWN0MiYmalF1ZXJ5LmZuLnNlbGVjdDIuYW1kKXZhciBlPWpRdWVyeS5mbi5zZWxlY3QyLmFtZDtyZXR1cm4gZS5kZWZpbmUoXCJzZWxlY3QyL2kxOG4vbmxcIixbXSxmdW5jdGlvbigpe3JldHVybntlcnJvckxvYWRpbmc6ZnVuY3Rpb24oKXtyZXR1cm5cIkRlIHJlc3VsdGF0ZW4ga29uZGVuIG5pZXQgd29yZGVuIGdlbGFkZW4uXCJ9LGlucHV0VG9vTG9uZzpmdW5jdGlvbihlKXt2YXIgdD1lLmlucHV0Lmxlbmd0aC1lLm1heGltdW0sbj1cIkdlbGlldmUgXCIrdCtcIiBrYXJha3RlcnMgdGUgdmVyd2lqZGVyZW5cIjtyZXR1cm4gbn0saW5wdXRUb29TaG9ydDpmdW5jdGlvbihlKXt2YXIgdD1lLm1pbmltdW0tZS5pbnB1dC5sZW5ndGgsbj1cIkdlbGlldmUgXCIrdCtcIiBvZiBtZWVyIGthcmFrdGVycyBpbiB0ZSB2b2VyZW5cIjtyZXR1cm4gbn0sbG9hZGluZ01vcmU6ZnVuY3Rpb24oKXtyZXR1cm5cIk1lZXIgcmVzdWx0YXRlbiBsYWRlbuKAplwifSxtYXhpbXVtU2VsZWN0ZWQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5tYXhpbXVtPT0xP1wia2FuXCI6XCJrdW5uZW5cIixuPVwiRXIgXCIrdCtcIiBtYWFyIFwiK2UubWF4aW11bStcIiBpdGVtXCI7cmV0dXJuIGUubWF4aW11bSE9MSYmKG4rPVwic1wiKSxuKz1cIiB3b3JkZW4gZ2VzZWxlY3RlZXJkXCIsbn0sbm9SZXN1bHRzOmZ1bmN0aW9uKCl7cmV0dXJuXCJHZWVuIHJlc3VsdGF0ZW4gZ2V2b25kZW7igKZcIn0sc2VhcmNoaW5nOmZ1bmN0aW9uKCl7cmV0dXJuXCJab2VrZW7igKZcIn0scmVtb3ZlQWxsSXRlbXM6ZnVuY3Rpb24oKXtyZXR1cm5cIlZlcndpamRlciBhbGxlIGl0ZW1zXCJ9fX0pLHtkZWZpbmU6ZS5kZWZpbmUscmVxdWlyZTplLnJlcXVpcmV9fSkoKTsiXX0=