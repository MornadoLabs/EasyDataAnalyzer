!function(e){var t={};function n(i){if(t[i])return t[i].exports;var l=t[i]={i:i,l:!1,exports:{}};return e[i].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(i,l,function(t){return e[t]}.bind(null,l));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}({9:function(e,t){var n;!function(e){!function(e){e.analysisSettingService=new class{constructor(){this.ElementIDs={X_Field:"xField",Y_Field:"yField",OkButton:"okButton"},this.ElementClasses={Selects:"selectDropDown"},this.Urls={AnalyzeData:"Analysis/AnalyzeData"},this.initUIElements(),this.initButtons()}initUIElements(){$("."+this.ElementClasses.Selects).select2({minimumResultsForSearch:-1,width:"50%"})}initButtons(){let e=this;$("#"+e.ElementIDs.OkButton).off("click").click(function(){let t=$("#"+e.ElementIDs.X_Field).val(),n=$("#"+e.ElementIDs.Y_Field).val();window.location.href=e.Urls.AnalyzeData+"?xField="+t+"&yField="+n})}}}(e.Analysis||(e.Analysis={}))}(n||(n={}))}});
//# sourceMappingURL=analyzeSettings.js.map