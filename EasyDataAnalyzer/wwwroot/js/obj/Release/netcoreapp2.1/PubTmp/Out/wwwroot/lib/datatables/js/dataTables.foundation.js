/*! DataTables Foundation integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */
/**
 * DataTables integration for Foundation. This requires Foundation 5 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Foundation. See http://datatables.net/manual/styling/foundation
 * for further information.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }
            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $).$;
            }
            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;
    // Detect Foundation 5 / 6 as they have different element and class requirements
    var meta = $('<meta class="foundation-mq"/>').appendTo('head');
    DataTable.ext.foundationVersion = meta.css('font-family').match(/small|medium|large/) ? 6 : 5;
    meta.remove();
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper dt-foundation",
        sProcessing: "dataTables_processing panel callout"
    });
    /* Set the defaults for DataTables initialisation */
    $.extend(true, DataTable.defaults, {
        dom: "<'row grid-x'<'small-6 columns cell'l><'small-6 columns cell'f>r>" +
            "t" +
            "<'row grid-x'<'small-6 columns cell'i><'small-6 columns cell'p>>",
        renderer: 'foundation'
    });
    /* Page button renderer */
    DataTable.ext.renderer.pageButton.foundation = function (settings, host, idx, buttons, page, pages) {
        var api = new DataTable.Api(settings);
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay, btnClass;
        var tag;
        var v5 = DataTable.ext.foundationVersion === 5;
        var attach = function (container, buttons) {
            var i, ien, node, button;
            var clickHandler = function (e) {
                e.preventDefault();
                if (!$(e.currentTarget).hasClass('unavailable') && api.page() != e.data.action) {
                    api.page(e.data.action).draw('page');
                }
            };
            for (i = 0, ien = buttons.length; i < ien; i++) {
                button = buttons[i];
                if ($.isArray(button)) {
                    attach(container, button);
                }
                else {
                    btnDisplay = '';
                    btnClass = '';
                    tag = null;
                    switch (button) {
                        case 'ellipsis':
                            btnDisplay = '&#x2026;';
                            btnClass = 'unavailable disabled';
                            tag = null;
                            break;
                        case 'first':
                            btnDisplay = lang.sFirst;
                            btnClass = button + (page > 0 ?
                                '' : ' unavailable disabled');
                            tag = page > 0 ? 'a' : null;
                            break;
                        case 'previous':
                            btnDisplay = lang.sPrevious;
                            btnClass = button + (page > 0 ?
                                '' : ' unavailable disabled');
                            tag = page > 0 ? 'a' : null;
                            break;
                        case 'next':
                            btnDisplay = lang.sNext;
                            btnClass = button + (page < pages - 1 ?
                                '' : ' unavailable disabled');
                            tag = page < pages - 1 ? 'a' : null;
                            break;
                        case 'last':
                            btnDisplay = lang.sLast;
                            btnClass = button + (page < pages - 1 ?
                                '' : ' unavailable disabled');
                            tag = page < pages - 1 ? 'a' : null;
                            break;
                        default:
                            btnDisplay = button + 1;
                            btnClass = page === button ?
                                'current' : '';
                            tag = page === button ?
                                null : 'a';
                            break;
                    }
                    if (v5) {
                        tag = 'a';
                    }
                    if (btnDisplay) {
                        node = $('<li>', {
                            'class': classes.sPageButton + ' ' + btnClass,
                            'aria-controls': settings.sTableId,
                            'aria-label': aria[button],
                            'tabindex': settings.iTabIndex,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId + '_' + button :
                                null
                        })
                            .append(tag ?
                            $('<' + tag + '/>', { 'href': '#' }).html(btnDisplay) :
                            btnDisplay)
                            .appendTo(container);
                        settings.oApi._fnBindAction(node, { action: button }, clickHandler);
                    }
                }
            }
        };
        attach($(host).empty().html('<ul class="pagination"/>').children('ul'), buttons);
    };
    return DataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5mb3VuZGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2RhdGF0YWJsZXMvanMvZGF0YVRhYmxlcy5mb3VuZGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUg7Ozs7Ozs7R0FPRztBQUNILENBQUMsVUFBVSxPQUFPO0lBQ2pCLElBQUssT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUc7UUFDakQsTUFBTTtRQUNOLE1BQU0sQ0FBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLFVBQVcsQ0FBQztZQUNqRCxPQUFPLE9BQU8sQ0FBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ3ZDLENBQUMsQ0FBRSxDQUFDO0tBQ0o7U0FDSSxJQUFLLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRztRQUN2QyxXQUFXO1FBQ1gsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxDQUFDO1lBQ2pDLElBQUssQ0FBRSxJQUFJLEVBQUc7Z0JBQ2IsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNkO1lBRUQsSUFBSyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFHO2dCQUM5QixDQUFDLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6QztZQUVELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQzFDLENBQUMsQ0FBQztLQUNGO1NBQ0k7UUFDSixVQUFVO1FBQ1YsT0FBTyxDQUFFLE1BQU0sRUFBRSxNQUFNLEVB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eUJBQ0wsQ0FBRTs2QkFDRixNQUFNLENBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ2IsQ0FBQyxDQUFDLEdBQUcsR0FBQyxHQUFHLEdBQUMsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFFLENBQUMsSUFBSSxDQUFFLFVBQVUsQ0FBRSxDQUFDLENBQUM7NEJBQ3BELFVBQVUsQ0FDVjs2QkFDQSxRQUFRLENBQUUsU0FBUyxDQUFFLENBQUM7d0JBRXhCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUMxQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLEVBQUUsWUFBWSxDQUNwQyxDQUFDO3FCQUNGO2lCQUNEO2FBQ0Q7UUFDRixDQUFDLENBQUM7UUFFRixNQUFNLENBQ0wsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDL0QsT0FBTyxDQUNQLENBQUM7SUFDSCxDQUFDLENBQUM7SUFHRixPQUFPLFNBQVMsQ0FBQztBQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohIERhdGFUYWJsZXMgRm91bmRhdGlvbiBpbnRlZ3JhdGlvblxuICogwqkyMDExLTIwMTUgU3ByeU1lZGlhIEx0ZCAtIGRhdGF0YWJsZXMubmV0L2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIERhdGFUYWJsZXMgaW50ZWdyYXRpb24gZm9yIEZvdW5kYXRpb24uIFRoaXMgcmVxdWlyZXMgRm91bmRhdGlvbiA1IGFuZFxuICogRGF0YVRhYmxlcyAxLjEwIG9yIG5ld2VyLlxuICpcbiAqIFRoaXMgZmlsZSBzZXRzIHRoZSBkZWZhdWx0cyBhbmQgYWRkcyBvcHRpb25zIHRvIERhdGFUYWJsZXMgdG8gc3R5bGUgaXRzXG4gKiBjb250cm9scyB1c2luZyBGb3VuZGF0aW9uLiBTZWUgaHR0cDovL2RhdGF0YWJsZXMubmV0L21hbnVhbC9zdHlsaW5nL2ZvdW5kYXRpb25cbiAqIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICovXG4oZnVuY3Rpb24oIGZhY3RvcnkgKXtcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKCBbJ2pxdWVyeScsICdkYXRhdGFibGVzLm5ldCddLCBmdW5jdGlvbiAoICQgKSB7XG5cdFx0XHRyZXR1cm4gZmFjdG9yeSggJCwgd2luZG93LCBkb2N1bWVudCApO1xuXHRcdH0gKTtcblx0fVxuXHRlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgJCkge1xuXHRcdFx0aWYgKCAhIHJvb3QgKSB7XG5cdFx0XHRcdHJvb3QgPSB3aW5kb3c7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkIHx8ICEgJC5mbi5kYXRhVGFibGUgKSB7XG5cdFx0XHRcdCQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWN0b3J5KCAkLCByb290LCByb290LmRvY3VtZW50ICk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBCcm93c2VyXG5cdFx0ZmFjdG9yeSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG5cdH1cbn0oZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcbid1c2Ugc3RyaWN0JztcbnZhciBEYXRhVGFibGUgPSAkLmZuLmRhdGFUYWJsZTtcblxuLy8gRGV0ZWN0IEZvdW5kYXRpb24gNSAvIDYgYXMgdGhleSBoYXZlIGRpZmZlcmVudCBlbGVtZW50IGFuZCBjbGFzcyByZXF1aXJlbWVudHNcbnZhciBtZXRhID0gJCgnPG1ldGEgY2xhc3M9XCJmb3VuZGF0aW9uLW1xXCIvPicpLmFwcGVuZFRvKCdoZWFkJyk7XG5EYXRhVGFibGUuZXh0LmZvdW5kYXRpb25WZXJzaW9uID0gbWV0YS5jc3MoJ2ZvbnQtZmFtaWx5JykubWF0Y2goL3NtYWxsfG1lZGl1bXxsYXJnZS8pID8gNiA6IDU7XG5tZXRhLnJlbW92ZSgpO1xuXG5cbiQuZXh0ZW5kKCBEYXRhVGFibGUuZXh0LmNsYXNzZXMsIHtcblx0c1dyYXBwZXI6ICAgIFwiZGF0YVRhYmxlc193cmFwcGVyIGR0LWZvdW5kYXRpb25cIixcblx0c1Byb2Nlc3Npbmc6IFwiZGF0YVRhYmxlc19wcm9jZXNzaW5nIHBhbmVsIGNhbGxvdXRcIlxufSApO1xuXG5cbi8qIFNldCB0aGUgZGVmYXVsdHMgZm9yIERhdGFUYWJsZXMgaW5pdGlhbGlzYXRpb24gKi9cbiQuZXh0ZW5kKCB0cnVlLCBEYXRhVGFibGUuZGVmYXVsdHMsIHtcblx0ZG9tOlxuXHRcdFwiPCdyb3cgZ3JpZC14Jzwnc21hbGwtNiBjb2x1bW5zIGNlbGwnbD48J3NtYWxsLTYgY29sdW1ucyBjZWxsJ2Y+cj5cIitcblx0XHRcInRcIitcblx0XHRcIjwncm93IGdyaWQteCc8J3NtYWxsLTYgY29sdW1ucyBjZWxsJ2k+PCdzbWFsbC02IGNvbHVtbnMgY2VsbCdwPj5cIixcblx0cmVuZGVyZXI6ICdmb3VuZGF0aW9uJ1xufSApO1xuXG5cbi8qIFBhZ2UgYnV0dG9uIHJlbmRlcmVyICovXG5EYXRhVGFibGUuZXh0LnJlbmRlcmVyLnBhZ2VCdXR0b24uZm91bmRhdGlvbiA9IGZ1bmN0aW9uICggc2V0dGluZ3MsIGhvc3QsIGlkeCwgYnV0dG9ucywgcGFnZSwgcGFnZXMgKSB7XG5cdHZhciBhcGkgPSBuZXcgRGF0YVRhYmxlLkFwaSggc2V0dGluZ3MgKTtcblx0dmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3Nlcztcblx0dmFyIGxhbmcgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub1BhZ2luYXRlO1xuXHR2YXIgYXJpYSA9IHNldHRpbmdzLm9MYW5ndWFnZS5vQXJpYS5wYWdpbmF0ZSB8fCB7fTtcblx0dmFyIGJ0bkRpc3BsYXksIGJ0bkNsYXNzO1xuXHR2YXIgdGFnO1xuXHR2YXIgdjUgPSBEYXRhVGFibGUuZXh0LmZvdW5kYXRpb25WZXJzaW9uID09PSA1O1xuXG5cdHZhciBhdHRhY2ggPSBmdW5jdGlvbiggY29udGFpbmVyLCBidXR0b25zICkge1xuXHRcdHZhciBpLCBpZW4sIG5vZGUsIGJ1dHRvbjtcblx0XHR2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAhJChlLmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCd1bmF2YWlsYWJsZScpICYmIGFwaS5wYWdlKCkgIT0gZS5kYXRhLmFjdGlvbiApIHtcblx0XHRcdFx0YXBpLnBhZ2UoIGUuZGF0YS5hY3Rpb24gKS5kcmF3KCAncGFnZScgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Zm9yICggaT0wLCBpZW49YnV0dG9ucy5sZW5ndGggOyBpPGllbiA7IGkrKyApIHtcblx0XHRcdGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG5cblx0XHRcdGlmICggJC5pc0FycmF5KCBidXR0b24gKSApIHtcblx0XHRcdFx0YXR0YWNoKCBjb250YWluZXIsIGJ1dHRvbiApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGJ0bkRpc3BsYXkgPSAnJztcblx0XHRcdFx0YnRuQ2xhc3MgPSAnJztcblx0XHRcdFx0dGFnID0gbnVsbDtcblxuXHRcdFx0XHRzd2l0Y2ggKCBidXR0b24gKSB7XG5cdFx0XHRcdFx0Y2FzZSAnZWxsaXBzaXMnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9ICcmI3gyMDI2Oyc7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9ICd1bmF2YWlsYWJsZSBkaXNhYmxlZCc7XG5cdFx0XHRcdFx0XHR0YWcgPSBudWxsO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdmaXJzdCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zRmlyc3Q7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyB1bmF2YWlsYWJsZSBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0dGFnID0gcGFnZSA+IDAgPyAnYScgOiBudWxsO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdwcmV2aW91cyc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zUHJldmlvdXM7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyB1bmF2YWlsYWJsZSBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0dGFnID0gcGFnZSA+IDAgPyAnYScgOiBudWxsO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICduZXh0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNOZXh0O1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzLTEgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICcgdW5hdmFpbGFibGUgZGlzYWJsZWQnKTtcblx0XHRcdFx0XHRcdHRhZyA9IHBhZ2UgPCBwYWdlcy0xID8gJ2EnIDogbnVsbDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnbGFzdCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zTGFzdDtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPCBwYWdlcy0xID9cblx0XHRcdFx0XHRcdFx0JycgOiAnIHVuYXZhaWxhYmxlIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHR0YWcgPSBwYWdlIDwgcGFnZXMtMSA/ICdhJyA6IG51bGw7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gYnV0dG9uICsgMTtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gcGFnZSA9PT0gYnV0dG9uID9cblx0XHRcdFx0XHRcdFx0J2N1cnJlbnQnIDogJyc7XG5cdFx0XHRcdFx0XHR0YWcgPSBwYWdlID09PSBidXR0b24gP1xuXHRcdFx0XHRcdFx0XHRudWxsIDogJ2EnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHY1ICkge1xuXHRcdFx0XHRcdHRhZyA9ICdhJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggYnRuRGlzcGxheSApIHtcblx0XHRcdFx0XHRub2RlID0gJCgnPGxpPicsIHtcblx0XHRcdFx0XHRcdFx0J2NsYXNzJzogY2xhc3Nlcy5zUGFnZUJ1dHRvbisnICcrYnRuQ2xhc3MsXG5cdFx0XHRcdFx0XHRcdCdhcmlhLWNvbnRyb2xzJzogc2V0dGluZ3Muc1RhYmxlSWQsXG5cdFx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogYXJpYVsgYnV0dG9uIF0sXG5cdFx0XHRcdFx0XHRcdCd0YWJpbmRleCc6IHNldHRpbmdzLmlUYWJJbmRleCxcblx0XHRcdFx0XHRcdFx0J2lkJzogaWR4ID09PSAwICYmIHR5cGVvZiBidXR0b24gPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRcdFx0XHRzZXR0aW5ncy5zVGFibGVJZCArJ18nKyBidXR0b24gOlxuXHRcdFx0XHRcdFx0XHRcdG51bGxcblx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0LmFwcGVuZCggdGFnID9cblx0XHRcdFx0XHRcdFx0JCgnPCcrdGFnKycvPicsIHsnaHJlZic6ICcjJ30gKS5odG1sKCBidG5EaXNwbGF5ICkgOlxuXHRcdFx0XHRcdFx0XHRidG5EaXNwbGF5XG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQuYXBwZW5kVG8oIGNvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0c2V0dGluZ3Mub0FwaS5fZm5CaW5kQWN0aW9uKFxuXHRcdFx0XHRcdFx0bm9kZSwge2FjdGlvbjogYnV0dG9ufSwgY2xpY2tIYW5kbGVyXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRhdHRhY2goXG5cdFx0JChob3N0KS5lbXB0eSgpLmh0bWwoJzx1bCBjbGFzcz1cInBhZ2luYXRpb25cIi8+JykuY2hpbGRyZW4oJ3VsJyksXG5cdFx0YnV0dG9uc1xuXHQpO1xufTtcblxuXG5yZXR1cm4gRGF0YVRhYmxlO1xufSkpO1xuIl19