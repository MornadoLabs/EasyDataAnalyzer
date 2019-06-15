/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
(function () { if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd; return e.define("select2/i18n/bn", [], function () { return { errorLoading: function () { return "ফলাফলগুলি লোড করা যায়নি।"; }, inputTooLong: function (e) { var t = e.input.length - e.maximum, n = "অনুগ্রহ করে " + t + " টি অক্ষর মুছে দিন।"; return t != 1 && (n = "অনুগ্রহ করে " + t + " টি অক্ষর মুছে দিন।"), n; }, inputTooShort: function (e) { var t = e.minimum - e.input.length, n = t + " টি অক্ষর অথবা অধিক অক্ষর লিখুন।"; return n; }, loadingMore: function () { return "আরো ফলাফল লোড হচ্ছে ..."; }, maximumSelected: function (e) { var t = e.maximum + " টি আইটেম নির্বাচন করতে পারবেন।"; return e.maximum != 1 && (t = e.maximum + " টি আইটেম নির্বাচন করতে পারবেন।"), t; }, noResults: function () { return "কোন ফলাফল পাওয়া যায়নি।"; }, searching: function () { return "অনুসন্ধান করা হচ্ছে ..."; } }; }), { define: e.define, require: e.require }; })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvc2VsZWN0Mi9qcy9pMThuL2JuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUVoRixDQUFDLGNBQVcsSUFBRyxNQUFNLElBQUUsTUFBTSxDQUFDLEVBQUUsSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHO0lBQUMsSUFBSSxDQUFDLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFDLEVBQUUsRUFBQyxjQUFXLE9BQU0sRUFBQyxZQUFZLEVBQUMsY0FBVyxPQUFNLDJCQUEyQixDQUFBLENBQUEsQ0FBQyxFQUFDLFlBQVksRUFBQyxVQUFTLENBQUMsSUFBRSxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsR0FBQyxjQUFjLEdBQUMsQ0FBQyxHQUFDLHFCQUFxQixDQUFDLENBQUEsT0FBTyxDQUFDLElBQUUsQ0FBQyxJQUFFLENBQUMsQ0FBQyxHQUFDLGNBQWMsR0FBQyxDQUFDLEdBQUMscUJBQXFCLENBQUMsRUFBQyxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUMsYUFBYSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxrQ0FBa0MsQ0FBQyxDQUFBLE9BQU8sQ0FBQyxDQUFBLENBQUEsQ0FBQyxFQUFDLFdBQVcsRUFBQyxjQUFXLE9BQU0seUJBQXlCLENBQUEsQ0FBQSxDQUFDLEVBQUMsZUFBZSxFQUFDLFVBQVMsQ0FBQyxJQUFFLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsaUNBQWlDLENBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUUsQ0FBQyxJQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsaUNBQWlDLENBQUMsRUFBQyxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUMsU0FBUyxFQUFDLGNBQVcsT0FBTSwwQkFBMEIsQ0FBQSxDQUFBLENBQUMsRUFBQyxTQUFTLEVBQUMsY0FBVyxPQUFNLHlCQUF5QixDQUFBLENBQUEsQ0FBQyxFQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFNlbGVjdDIgNC4wLjcgfCBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWQgKi9cblxuKGZ1bmN0aW9uKCl7aWYoalF1ZXJ5JiZqUXVlcnkuZm4mJmpRdWVyeS5mbi5zZWxlY3QyJiZqUXVlcnkuZm4uc2VsZWN0Mi5hbWQpdmFyIGU9alF1ZXJ5LmZuLnNlbGVjdDIuYW1kO3JldHVybiBlLmRlZmluZShcInNlbGVjdDIvaTE4bi9iblwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJue2Vycm9yTG9hZGluZzpmdW5jdGlvbigpe3JldHVyblwi4Kar4Kay4Ka+4Kar4Kay4KaX4KeB4Kay4Ka/IOCmsuCni+CmoSDgppXgprDgpr4g4Kav4Ka+4Kav4Ka84Kao4Ka/4KWkXCJ9LGlucHV0VG9vTG9uZzpmdW5jdGlvbihlKXt2YXIgdD1lLmlucHV0Lmxlbmd0aC1lLm1heGltdW0sbj1cIuCmheCmqOCngeCml+CnjeCmsOCmuSDgppXgprDgp4cgXCIrdCtcIiDgpp/gpr8g4KaF4KaV4KeN4Ka34KawIOCmruCngeCmm+CnhyDgpqbgpr/gpqjgpaRcIjtyZXR1cm4gdCE9MSYmKG49XCLgpoXgpqjgp4Hgppfgp43gprDgprkg4KaV4Kaw4KeHIFwiK3QrXCIg4Kaf4Ka/IOCmheCmleCnjeCmt+CmsCDgpq7gp4Hgppvgp4cg4Kam4Ka/4Kao4KWkXCIpLG59LGlucHV0VG9vU2hvcnQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5taW5pbXVtLWUuaW5wdXQubGVuZ3RoLG49dCtcIiDgpp/gpr8g4KaF4KaV4KeN4Ka34KawIOCmheCmpeCmrOCmviDgpoXgpqfgpr/gppUg4KaF4KaV4KeN4Ka34KawIOCmsuCmv+CmluCngeCmqOClpFwiO3JldHVybiBufSxsb2FkaW5nTW9yZTpmdW5jdGlvbigpe3JldHVyblwi4KaG4Kaw4KeLIOCmq+CmsuCmvuCmq+CmsiDgprLgp4vgpqEg4Ka54Kaa4KeN4Kab4KeHIC4uLlwifSxtYXhpbXVtU2VsZWN0ZWQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5tYXhpbXVtK1wiIOCmn+CmvyDgpobgpofgpp/gp4fgpq4g4Kao4Ka/4Kaw4KeN4Kas4Ka+4Kaa4KaoIOCmleCmsOCmpOCnhyDgpqrgpr7gprDgpqzgp4fgpqjgpaRcIjtyZXR1cm4gZS5tYXhpbXVtIT0xJiYodD1lLm1heGltdW0rXCIg4Kaf4Ka/IOCmhuCmh+Cmn+Cnh+CmriDgpqjgpr/gprDgp43gpqzgpr7gpprgpqgg4KaV4Kaw4Kak4KeHIOCmquCmvuCmsOCmrOCnh+CmqOClpFwiKSx0fSxub1Jlc3VsdHM6ZnVuY3Rpb24oKXtyZXR1cm5cIuCmleCni+CmqCDgpqvgprLgpr7gpqvgprIg4Kaq4Ka+4KaT4Kav4Ka84Ka+IOCmr+CmvuCmr+CmvOCmqOCmv+ClpFwifSxzZWFyY2hpbmc6ZnVuY3Rpb24oKXtyZXR1cm5cIuCmheCmqOCngeCmuOCmqOCnjeCmp+CmvuCmqCDgppXgprDgpr4g4Ka54Kaa4KeN4Kab4KeHIC4uLlwifX19KSx7ZGVmaW5lOmUuZGVmaW5lLHJlcXVpcmU6ZS5yZXF1aXJlfX0pKCk7Il19