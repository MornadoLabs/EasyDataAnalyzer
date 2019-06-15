/*! DataTables jQuery UI integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */
/**
 * DataTables integration for jQuery UI. This requires jQuery UI and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using jQuery UI. See http://datatables.net/manual/styling/jqueryui
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
    var sort_prefix = 'css_right ui-icon ui-icon-';
    var toolbar_prefix = 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-';
    /* Set the defaults for DataTables initialisation */
    $.extend(true, DataTable.defaults, {
        dom: '<"' + toolbar_prefix + 'tl ui-corner-tr"lfr>' +
            't' +
            '<"' + toolbar_prefix + 'bl ui-corner-br"ip>',
        renderer: 'jqueryui'
    });
    $.extend(DataTable.ext.classes, {
        "sWrapper": "dataTables_wrapper dt-jqueryui",
        /* Full numbers paging buttons */
        "sPageButton": "fg-button ui-button ui-state-default",
        "sPageButtonActive": "ui-state-disabled",
        "sPageButtonDisabled": "ui-state-disabled",
        /* Features */
        "sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi " +
            "ui-buttonset-multi paging_",
        /* Sorting */
        "sSortAsc": "ui-state-default sorting_asc",
        "sSortDesc": "ui-state-default sorting_desc",
        "sSortable": "ui-state-default sorting",
        "sSortableAsc": "ui-state-default sorting_asc_disabled",
        "sSortableDesc": "ui-state-default sorting_desc_disabled",
        "sSortableNone": "ui-state-default sorting_disabled",
        "sSortIcon": "DataTables_sort_icon",
        /* Scrolling */
        "sScrollHead": "dataTables_scrollHead " + "ui-state-default",
        "sScrollFoot": "dataTables_scrollFoot " + "ui-state-default",
        /* Misc */
        "sHeaderTH": "ui-state-default",
        "sFooterTH": "ui-state-default"
    });
    DataTable.ext.renderer.header.jqueryui = function (settings, cell, column, classes) {
        // Calculate what the unsorted class should be
        var noSortAppliedClass = sort_prefix + 'caret-2-n-s';
        var asc = $.inArray('asc', column.asSorting) !== -1;
        var desc = $.inArray('desc', column.asSorting) !== -1;
        if (!column.bSortable || (!asc && !desc)) {
            noSortAppliedClass = '';
        }
        else if (asc && !desc) {
            noSortAppliedClass = sort_prefix + 'caret-1-n';
        }
        else if (!asc && desc) {
            noSortAppliedClass = sort_prefix + 'caret-1-s';
        }
        // Setup the DOM structure
        $('<div/>')
            .addClass('DataTables_sort_wrapper')
            .append(cell.contents())
            .append($('<span/>')
            .addClass(classes.sSortIcon + ' ' + noSortAppliedClass))
            .appendTo(cell);
        // Attach a sort listener to update on sort
        $(settings.nTable).on('order.dt', function (e, ctx, sorting, columns) {
            if (settings !== ctx) {
                return;
            }
            var colIdx = column.idx;
            cell
                .removeClass(classes.sSortAsc + " " + classes.sSortDesc)
                .addClass(columns[colIdx] == 'asc' ?
                classes.sSortAsc : columns[colIdx] == 'desc' ?
                classes.sSortDesc :
                column.sSortingClass);
            cell
                .find('span.' + classes.sSortIcon)
                .removeClass(sort_prefix + 'triangle-1-n' + " " +
                sort_prefix + 'triangle-1-s' + " " +
                sort_prefix + 'caret-2-n-s' + " " +
                sort_prefix + 'caret-1-n' + " " +
                sort_prefix + 'caret-1-s')
                .addClass(columns[colIdx] == 'asc' ?
                sort_prefix + 'triangle-1-n' : columns[colIdx] == 'desc' ?
                sort_prefix + 'triangle-1-s' :
                noSortAppliedClass);
        });
    };
    /*
     * TableTools jQuery UI compatibility
     * Required TableTools 2.1+
     */
    if (DataTable.TableTools) {
        $.extend(true, DataTable.TableTools.classes, {
            "container": "DTTT_container ui-buttonset ui-buttonset-multi",
            "buttons": {
                "normal": "DTTT_button ui-button ui-state-default"
            },
            "collection": {
                "container": "DTTT_collection ui-buttonset ui-buttonset-multi"
            }
        });
    }
    return DataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5qcXVlcnl1aS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL29iai9SZWxlYXNlL25ldGNvcmVhcHAyLjEvUHViVG1wL091dC93d3dyb290L2xpYi9kYXRhdGFibGVzL2pzL2RhdGFUYWJsZXMuanF1ZXJ5dWkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSDs7Ozs7OztHQU9HO0FBQ0gsQ0FBQyxVQUFVLE9BQU87SUFDakIsSUFBSyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRztRQUNqRCxNQUFNO1FBQ04sTUFBTSxDQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsVUFBVyxDQUFDO1lBQ2pELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFFLENBQUM7S0FDSjtTQUNJLElBQUssT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFHO1FBQ3ZDLFdBQVc7UUFDWCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7WUFDakMsSUFBSyxDQUFFLElBQUksRUFBRztnQkFDYixJQUFJLEdBQUcsTUFBTSxDQUFDO2FBQ2Q7WUFFRCxJQUFLLENBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUc7Z0JBQzlCLENBQUMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsT0FBTyxPQUFPLENBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDO0tBQ0Y7U0FDSTtRQUNKLFVBQVU7UUFDVixPQUFPLENBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxR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O09BR0c7SUFDSCxJQUFLLFNBQVMsQ0FBQyxVQUFVLEVBQUc7UUFDM0IsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDN0MsV0FBVyxFQUFFLGdEQUFnRDtZQUM3RCxTQUFTLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLHdDQUF3QzthQUNsRDtZQUNELFlBQVksRUFBRTtnQkFDYixXQUFXLEVBQUUsaURBQWlEO2FBQzlEO1NBQ0QsQ0FBRSxDQUFDO0tBQ0o7SUFHRCxPQUFPLFNBQVMsQ0FBQztBQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohIERhdGFUYWJsZXMgalF1ZXJ5IFVJIGludGVncmF0aW9uXG4gKiDCqTIwMTEtMjAxNCBTcHJ5TWVkaWEgTHRkIC0gZGF0YXRhYmxlcy5uZXQvbGljZW5zZVxuICovXG5cbi8qKlxuICogRGF0YVRhYmxlcyBpbnRlZ3JhdGlvbiBmb3IgalF1ZXJ5IFVJLiBUaGlzIHJlcXVpcmVzIGpRdWVyeSBVSSBhbmRcbiAqIERhdGFUYWJsZXMgMS4xMCBvciBuZXdlci5cbiAqXG4gKiBUaGlzIGZpbGUgc2V0cyB0aGUgZGVmYXVsdHMgYW5kIGFkZHMgb3B0aW9ucyB0byBEYXRhVGFibGVzIHRvIHN0eWxlIGl0c1xuICogY29udHJvbHMgdXNpbmcgalF1ZXJ5IFVJLiBTZWUgaHR0cDovL2RhdGF0YWJsZXMubmV0L21hbnVhbC9zdHlsaW5nL2pxdWVyeXVpXG4gKiBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cbiAqL1xuKGZ1bmN0aW9uKCBmYWN0b3J5ICl7XG5cdGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZSggWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCAkICkge1xuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0XHR9ICk7XG5cdH1cblx0ZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcblx0XHRcdGlmICggISByb290ICkge1xuXHRcdFx0XHRyb290ID0gd2luZG93O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgJCB8fCAhICQuZm4uZGF0YVRhYmxlICkge1xuXHRcdFx0XHQkID0gcmVxdWlyZSgnZGF0YXRhYmxlcy5uZXQnKShyb290LCAkKS4kO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFjdG9yeSggJCwgcm9vdCwgcm9vdC5kb2N1bWVudCApO1xuXHRcdH07XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gQnJvd3NlclxuXHRcdGZhY3RvcnkoIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCApO1xuXHR9XG59KGZ1bmN0aW9uKCAkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XG4ndXNlIHN0cmljdCc7XG52YXIgRGF0YVRhYmxlID0gJC5mbi5kYXRhVGFibGU7XG5cblxudmFyIHNvcnRfcHJlZml4ID0gJ2Nzc19yaWdodCB1aS1pY29uIHVpLWljb24tJztcbnZhciB0b29sYmFyX3ByZWZpeCA9ICdmZy10b29sYmFyIHVpLXRvb2xiYXIgdWktd2lkZ2V0LWhlYWRlciB1aS1oZWxwZXItY2xlYXJmaXggdWktY29ybmVyLSc7XG5cbi8qIFNldCB0aGUgZGVmYXVsdHMgZm9yIERhdGFUYWJsZXMgaW5pdGlhbGlzYXRpb24gKi9cbiQuZXh0ZW5kKCB0cnVlLCBEYXRhVGFibGUuZGVmYXVsdHMsIHtcblx0ZG9tOlxuXHRcdCc8XCInK3Rvb2xiYXJfcHJlZml4Kyd0bCB1aS1jb3JuZXItdHJcImxmcj4nK1xuXHRcdCd0Jytcblx0XHQnPFwiJyt0b29sYmFyX3ByZWZpeCsnYmwgdWktY29ybmVyLWJyXCJpcD4nLFxuXHRyZW5kZXJlcjogJ2pxdWVyeXVpJ1xufSApO1xuXG5cbiQuZXh0ZW5kKCBEYXRhVGFibGUuZXh0LmNsYXNzZXMsIHtcblx0XCJzV3JhcHBlclwiOiAgICAgICAgICAgIFwiZGF0YVRhYmxlc193cmFwcGVyIGR0LWpxdWVyeXVpXCIsXG5cblx0LyogRnVsbCBudW1iZXJzIHBhZ2luZyBidXR0b25zICovXG5cdFwic1BhZ2VCdXR0b25cIjogICAgICAgICBcImZnLWJ1dHRvbiB1aS1idXR0b24gdWktc3RhdGUtZGVmYXVsdFwiLFxuXHRcInNQYWdlQnV0dG9uQWN0aXZlXCI6ICAgXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiLFxuXHRcInNQYWdlQnV0dG9uRGlzYWJsZWRcIjogXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiLFxuXG5cdC8qIEZlYXR1cmVzICovXG5cdFwic1BhZ2luZ1wiOiBcImRhdGFUYWJsZXNfcGFnaW5hdGUgZmctYnV0dG9uc2V0IHVpLWJ1dHRvbnNldCBmZy1idXR0b25zZXQtbXVsdGkgXCIrXG5cdFx0XCJ1aS1idXR0b25zZXQtbXVsdGkgcGFnaW5nX1wiLCAvKiBOb3RlIHRoYXQgdGhlIHR5cGUgaXMgcG9zdGZpeGVkICovXG5cblx0LyogU29ydGluZyAqL1xuXHRcInNTb3J0QXNjXCI6ICAgICAgICAgICAgXCJ1aS1zdGF0ZS1kZWZhdWx0IHNvcnRpbmdfYXNjXCIsXG5cdFwic1NvcnREZXNjXCI6ICAgICAgICAgICBcInVpLXN0YXRlLWRlZmF1bHQgc29ydGluZ19kZXNjXCIsXG5cdFwic1NvcnRhYmxlXCI6ICAgICAgICAgICBcInVpLXN0YXRlLWRlZmF1bHQgc29ydGluZ1wiLFxuXHRcInNTb3J0YWJsZUFzY1wiOiAgICAgICAgXCJ1aS1zdGF0ZS1kZWZhdWx0IHNvcnRpbmdfYXNjX2Rpc2FibGVkXCIsXG5cdFwic1NvcnRhYmxlRGVzY1wiOiAgICAgICBcInVpLXN0YXRlLWRlZmF1bHQgc29ydGluZ19kZXNjX2Rpc2FibGVkXCIsXG5cdFwic1NvcnRhYmxlTm9uZVwiOiAgICAgICBcInVpLXN0YXRlLWRlZmF1bHQgc29ydGluZ19kaXNhYmxlZFwiLFxuXHRcInNTb3J0SWNvblwiOiAgICAgICAgICAgXCJEYXRhVGFibGVzX3NvcnRfaWNvblwiLFxuXG5cdC8qIFNjcm9sbGluZyAqL1xuXHRcInNTY3JvbGxIZWFkXCI6IFwiZGF0YVRhYmxlc19zY3JvbGxIZWFkIFwiK1widWktc3RhdGUtZGVmYXVsdFwiLFxuXHRcInNTY3JvbGxGb290XCI6IFwiZGF0YVRhYmxlc19zY3JvbGxGb290IFwiK1widWktc3RhdGUtZGVmYXVsdFwiLFxuXG5cdC8qIE1pc2MgKi9cblx0XCJzSGVhZGVyVEhcIjogIFwidWktc3RhdGUtZGVmYXVsdFwiLFxuXHRcInNGb290ZXJUSFwiOiAgXCJ1aS1zdGF0ZS1kZWZhdWx0XCJcbn0gKTtcblxuXG5EYXRhVGFibGUuZXh0LnJlbmRlcmVyLmhlYWRlci5qcXVlcnl1aSA9IGZ1bmN0aW9uICggc2V0dGluZ3MsIGNlbGwsIGNvbHVtbiwgY2xhc3NlcyApIHtcblx0Ly8gQ2FsY3VsYXRlIHdoYXQgdGhlIHVuc29ydGVkIGNsYXNzIHNob3VsZCBiZVxuXHR2YXIgbm9Tb3J0QXBwbGllZENsYXNzID0gc29ydF9wcmVmaXgrJ2NhcmV0LTItbi1zJztcblx0dmFyIGFzYyA9ICQuaW5BcnJheSgnYXNjJywgY29sdW1uLmFzU29ydGluZykgIT09IC0xO1xuXHR2YXIgZGVzYyA9ICQuaW5BcnJheSgnZGVzYycsIGNvbHVtbi5hc1NvcnRpbmcpICE9PSAtMTtcblxuXHRpZiAoICFjb2x1bW4uYlNvcnRhYmxlIHx8ICghYXNjICYmICFkZXNjKSApIHtcblx0XHRub1NvcnRBcHBsaWVkQ2xhc3MgPSAnJztcblx0fVxuXHRlbHNlIGlmICggYXNjICYmICFkZXNjICkge1xuXHRcdG5vU29ydEFwcGxpZWRDbGFzcyA9IHNvcnRfcHJlZml4KydjYXJldC0xLW4nO1xuXHR9XG5cdGVsc2UgaWYgKCAhYXNjICYmIGRlc2MgKSB7XG5cdFx0bm9Tb3J0QXBwbGllZENsYXNzID0gc29ydF9wcmVmaXgrJ2NhcmV0LTEtcyc7XG5cdH1cblxuXHQvLyBTZXR1cCB0aGUgRE9NIHN0cnVjdHVyZVxuXHQkKCc8ZGl2Lz4nKVxuXHRcdC5hZGRDbGFzcyggJ0RhdGFUYWJsZXNfc29ydF93cmFwcGVyJyApXG5cdFx0LmFwcGVuZCggY2VsbC5jb250ZW50cygpIClcblx0XHQuYXBwZW5kKCAkKCc8c3Bhbi8+Jylcblx0XHRcdC5hZGRDbGFzcyggY2xhc3Nlcy5zU29ydEljb24rJyAnK25vU29ydEFwcGxpZWRDbGFzcyApXG5cdFx0KVxuXHRcdC5hcHBlbmRUbyggY2VsbCApO1xuXG5cdC8vIEF0dGFjaCBhIHNvcnQgbGlzdGVuZXIgdG8gdXBkYXRlIG9uIHNvcnRcblx0JChzZXR0aW5ncy5uVGFibGUpLm9uKCAnb3JkZXIuZHQnLCBmdW5jdGlvbiAoIGUsIGN0eCwgc29ydGluZywgY29sdW1ucyApIHtcblx0XHRpZiAoIHNldHRpbmdzICE9PSBjdHggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNvbElkeCA9IGNvbHVtbi5pZHg7XG5cblx0XHRjZWxsXG5cdFx0XHQucmVtb3ZlQ2xhc3MoIGNsYXNzZXMuc1NvcnRBc2MgK1wiIFwiK2NsYXNzZXMuc1NvcnREZXNjIClcblx0XHRcdC5hZGRDbGFzcyggY29sdW1uc1sgY29sSWR4IF0gPT0gJ2FzYycgP1xuXHRcdFx0XHRjbGFzc2VzLnNTb3J0QXNjIDogY29sdW1uc1sgY29sSWR4IF0gPT0gJ2Rlc2MnID9cblx0XHRcdFx0XHRjbGFzc2VzLnNTb3J0RGVzYyA6XG5cdFx0XHRcdFx0Y29sdW1uLnNTb3J0aW5nQ2xhc3Ncblx0XHRcdCk7XG5cblx0XHRjZWxsXG5cdFx0XHQuZmluZCggJ3NwYW4uJytjbGFzc2VzLnNTb3J0SWNvbiApXG5cdFx0XHQucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdHNvcnRfcHJlZml4Kyd0cmlhbmdsZS0xLW4nICtcIiBcIitcblx0XHRcdFx0c29ydF9wcmVmaXgrJ3RyaWFuZ2xlLTEtcycgK1wiIFwiK1xuXHRcdFx0XHRzb3J0X3ByZWZpeCsnY2FyZXQtMi1uLXMnICtcIiBcIitcblx0XHRcdFx0c29ydF9wcmVmaXgrJ2NhcmV0LTEtbicgK1wiIFwiK1xuXHRcdFx0XHRzb3J0X3ByZWZpeCsnY2FyZXQtMS1zJ1xuXHRcdFx0KVxuXHRcdFx0LmFkZENsYXNzKCBjb2x1bW5zWyBjb2xJZHggXSA9PSAnYXNjJyA/XG5cdFx0XHRcdHNvcnRfcHJlZml4Kyd0cmlhbmdsZS0xLW4nIDogY29sdW1uc1sgY29sSWR4IF0gPT0gJ2Rlc2MnID9cblx0XHRcdFx0XHRzb3J0X3ByZWZpeCsndHJpYW5nbGUtMS1zJyA6XG5cdFx0XHRcdFx0bm9Tb3J0QXBwbGllZENsYXNzXG5cdFx0XHQpO1xuXHR9ICk7XG59O1xuXG5cbi8qXG4gKiBUYWJsZVRvb2xzIGpRdWVyeSBVSSBjb21wYXRpYmlsaXR5XG4gKiBSZXF1aXJlZCBUYWJsZVRvb2xzIDIuMStcbiAqL1xuaWYgKCBEYXRhVGFibGUuVGFibGVUb29scyApIHtcblx0JC5leHRlbmQoIHRydWUsIERhdGFUYWJsZS5UYWJsZVRvb2xzLmNsYXNzZXMsIHtcblx0XHRcImNvbnRhaW5lclwiOiBcIkRUVFRfY29udGFpbmVyIHVpLWJ1dHRvbnNldCB1aS1idXR0b25zZXQtbXVsdGlcIixcblx0XHRcImJ1dHRvbnNcIjoge1xuXHRcdFx0XCJub3JtYWxcIjogXCJEVFRUX2J1dHRvbiB1aS1idXR0b24gdWktc3RhdGUtZGVmYXVsdFwiXG5cdFx0fSxcblx0XHRcImNvbGxlY3Rpb25cIjoge1xuXHRcdFx0XCJjb250YWluZXJcIjogXCJEVFRUX2NvbGxlY3Rpb24gdWktYnV0dG9uc2V0IHVpLWJ1dHRvbnNldC1tdWx0aVwiXG5cdFx0fVxuXHR9ICk7XG59XG5cblxucmV0dXJuIERhdGFUYWJsZTtcbn0pKTtcbiJdfQ==