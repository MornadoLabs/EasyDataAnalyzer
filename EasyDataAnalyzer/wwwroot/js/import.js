var EasyDataAnalyzer;
(function (EasyDataAnalyzer) {
    var Import;
    (function (Import) {
        var ImportParameters;
        (function (ImportParameters) {
            ImportParameters[ImportParameters["DataTimeFormat"] = 1] = "DataTimeFormat";
            ImportParameters[ImportParameters["SetEmptyValueAsNull"] = 2] = "SetEmptyValueAsNull";
            ImportParameters[ImportParameters["MoneySeparator"] = 3] = "MoneySeparator";
        })(ImportParameters = Import.ImportParameters || (Import.ImportParameters = {}));
        var ImportService = /** @class */ (function () {
            function ImportService() {
                this.initButtons();
            }
            ImportService.prototype.initButtons = function () {
                $('#btnUpload').on('click', function () {
                    var fileExtension = ['xls', 'xlsx'];
                    var filename = $('#fUpload').val();
                    if (!filename) {
                        alert("Please select a file.");
                        return false;
                    }
                    else {
                        var extension = filename.replace(/^.*\./, '');
                        if ($.inArray(extension, fileExtension) == -1) {
                            alert("Please select only excel files.");
                            return false;
                        }
                    }
                    var fdata = new FormData();
                    var fileUpload = $("#fUpload").get(0);
                    var files = fileUpload.files;
                    fdata.append(files[0].name, files[0]);
                    /*
                    let importParameters = { "1": fdata.get("dataFormat"), "2": fdata.get("emptyValueIsNull"), "3": fdata.get("moneySeparator") };
                    fdata.append("importParameters", <any>importParameters);*/
                    //$.post("/Import/LoadHeaders", fdata);
                    $.ajax({
                        type: "POST",
                        url: "/Import/LoadHeaders?handler=Import",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        },
                        data: fdata,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.length == 0)
                                alert('Some error occured while uploading');
                            else {
                                $('#dvData').html(response);
                            }
                        },
                        error: function (e) {
                            $('#dvData').html(e.responseText);
                        }
                    });
                });
            };
            return ImportService;
        }());
        Import.importService = new ImportService();
    })(Import = EasyDataAnalyzer.Import || (EasyDataAnalyzer.Import = {}));
})(EasyDataAnalyzer || (EasyDataAnalyzer = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vU2NyaXB0cy9pbXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBVSxnQkFBZ0IsQ0FpRXpCO0FBakVELFdBQVUsZ0JBQWdCO0lBQUMsSUFBQSxNQUFNLENBaUVoQztJQWpFMEIsV0FBQSxNQUFNO1FBRTdCLElBQVksZ0JBSVg7UUFKRCxXQUFZLGdCQUFnQjtZQUN4QiwyRUFBa0IsQ0FBQTtZQUNsQixxRkFBdUIsQ0FBQTtZQUN2QiwyRUFBa0IsQ0FBQTtRQUN0QixDQUFDLEVBSlcsZ0JBQWdCLEdBQWhCLHVCQUFnQixLQUFoQix1QkFBZ0IsUUFJM0I7UUFFRDtZQUVJO2dCQUNJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixDQUFDO1lBRU8sbUNBQVcsR0FBbkI7Z0JBQ0ksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7b0JBQ3hCLElBQUksYUFBYSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNwQyxJQUFJLFFBQVEsR0FBUSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQ1gsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7d0JBQy9CLE9BQU8sS0FBSyxDQUFDO3FCQUNoQjt5QkFDSTt3QkFDRCxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDOUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTs0QkFDM0MsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7NEJBQ3pDLE9BQU8sS0FBSyxDQUFDO3lCQUNoQjtxQkFDSjtvQkFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO29CQUMzQixJQUFJLFVBQVUsR0FBUSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO29CQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDOzs4RUFFMEQ7b0JBRTFELHVDQUF1QztvQkFFdkMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDSCxJQUFJLEVBQUUsTUFBTTt3QkFDWixHQUFHLEVBQUUsb0NBQW9DO3dCQUN6QyxVQUFVLEVBQUUsVUFBVSxHQUFHOzRCQUNyQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUNyQixDQUFDLENBQUMsaURBQWlELENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUM1RSxDQUFDO3dCQUNELElBQUksRUFBRSxLQUFLO3dCQUNYLFdBQVcsRUFBRSxLQUFLO3dCQUNsQixXQUFXLEVBQUUsS0FBSzt3QkFDbEIsT0FBTyxFQUFFLFVBQVUsUUFBUTs0QkFDdkIsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7Z0NBQ3BCLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2lDQUMzQztnQ0FDRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZCQUMvQjt3QkFDTCxDQUFDO3dCQUNELEtBQUssRUFBRSxVQUFVLENBQUM7NEJBQ2QsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3RDLENBQUM7cUJBQ0osQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQztZQUNMLG9CQUFDO1FBQUQsQ0FBQyxBQXRERCxJQXNEQztRQUVVLG9CQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztJQUNuRCxDQUFDLEVBakUwQixNQUFNLEdBQU4sdUJBQU0sS0FBTix1QkFBTSxRQWlFaEM7QUFBRCxDQUFDLEVBakVTLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFpRXpCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbm5hbWVzcGFjZSBFYXN5RGF0YUFuYWx5emVyLkltcG9ydCB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gSW1wb3J0UGFyYW1ldGVycyB7XHJcbiAgICAgICAgRGF0YVRpbWVGb3JtYXQgPSAxLFxyXG4gICAgICAgIFNldEVtcHR5VmFsdWVBc051bGwgPSAyLFxyXG4gICAgICAgIE1vbmV5U2VwYXJhdG9yID0gM1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIEltcG9ydFNlcnZpY2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0QnV0dG9ucygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0QnV0dG9ucygpOiB2b2lkIHtcclxuICAgICAgICAgICAgJCgnI2J0blVwbG9hZCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWxlRXh0ZW5zaW9uID0gWyd4bHMnLCAneGxzeCddO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVuYW1lID0gPGFueT4kKCcjZlVwbG9hZCcpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHNlbGVjdCBhIGZpbGUuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSBmaWxlbmFtZS5yZXBsYWNlKC9eLipcXC4vLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShleHRlbnNpb24sIGZpbGVFeHRlbnNpb24pID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHNlbGVjdCBvbmx5IGV4Y2VsIGZpbGVzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBmZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVVcGxvYWQgPSA8YW55PiQoXCIjZlVwbG9hZFwiKS5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZXMgPSBmaWxlVXBsb2FkLmZpbGVzO1xyXG4gICAgICAgICAgICAgICAgZmRhdGEuYXBwZW5kKGZpbGVzWzBdLm5hbWUsIGZpbGVzWzBdKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBsZXQgaW1wb3J0UGFyYW1ldGVycyA9IHsgXCIxXCI6IGZkYXRhLmdldChcImRhdGFGb3JtYXRcIiksIFwiMlwiOiBmZGF0YS5nZXQoXCJlbXB0eVZhbHVlSXNOdWxsXCIpLCBcIjNcIjogZmRhdGEuZ2V0KFwibW9uZXlTZXBhcmF0b3JcIikgfTtcclxuICAgICAgICAgICAgICAgIGZkYXRhLmFwcGVuZChcImltcG9ydFBhcmFtZXRlcnNcIiwgPGFueT5pbXBvcnRQYXJhbWV0ZXJzKTsqL1xyXG5cclxuICAgICAgICAgICAgICAgIC8vJC5wb3N0KFwiL0ltcG9ydC9Mb2FkSGVhZGVyc1wiLCBmZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL0ltcG9ydC9Mb2FkSGVhZGVycz9oYW5kbGVyPUltcG9ydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYU1JGLVRPS0VOXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3RyaW5nPiQoJ2lucHV0OmhpZGRlbltuYW1lPVwiX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW5cIl0nKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBmZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnU29tZSBlcnJvciBvY2N1cmVkIHdoaWxlIHVwbG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNkdkRhdGEnKS5odG1sKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNkdkRhdGEnKS5odG1sKGUucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbXBvcnRTZXJ2aWNlID0gbmV3IEltcG9ydFNlcnZpY2UoKTtcclxufSJdfQ==