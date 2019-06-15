/*! DataTables UIkit 3 integration
 */
/**
 * This is a tech preview of UIKit integration with DataTables.
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
                // Require DataTables, which attaches to jQuery, including
                // jQuery if needed and have a $ property so we can access the
                // jQuery object that is used
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
    /* Set the defaults for DataTables initialisation */
    $.extend(true, DataTable.defaults, {
        dom: "<'row uk-grid'<'uk-width-1-2'l><'uk-width-1-2'f>>" +
            "<'row uk-grid dt-merge-grid'<'uk-width-1-1'tr>>" +
            "<'row uk-grid dt-merge-grid'<'uk-width-2-5'i><'uk-width-3-5'p>>",
        renderer: 'uikit'
    });
    /* Default class modification */
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper uk-form dt-uikit",
        sFilterInput: "uk-form-small",
        sLengthSelect: "uk-form-small",
        sProcessing: "dataTables_processing uk-panel"
    });
    /* UIkit paging button renderer */
    DataTable.ext.renderer.pageButton.uikit = function (settings, host, idx, buttons, page, pages) {
        var api = new DataTable.Api(settings);
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay, btnClass, counter = 0;
        var attach = function (container, buttons) {
            var i, ien, node, button;
            var clickHandler = function (e) {
                e.preventDefault();
                if (!$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action) {
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
                    switch (button) {
                        case 'ellipsis':
                            btnDisplay = '<i class="uk-icon-ellipsis-h"></i>';
                            btnClass = 'uk-disabled disabled';
                            break;
                        case 'first':
                            btnDisplay = '<i class="uk-icon-angle-double-left"></i> ' + lang.sFirst;
                            btnClass = (page > 0 ?
                                '' : ' uk-disabled disabled');
                            break;
                        case 'previous':
                            btnDisplay = '<i class="uk-icon-angle-left"></i> ' + lang.sPrevious;
                            btnClass = (page > 0 ?
                                '' : 'uk-disabled disabled');
                            break;
                        case 'next':
                            btnDisplay = lang.sNext + ' <i class="uk-icon-angle-right"></i>';
                            btnClass = (page < pages - 1 ?
                                '' : 'uk-disabled disabled');
                            break;
                        case 'last':
                            btnDisplay = lang.sLast + ' <i class="uk-icon-angle-double-right"></i>';
                            btnClass = (page < pages - 1 ?
                                '' : ' uk-disabled disabled');
                            break;
                        default:
                            btnDisplay = button + 1;
                            btnClass = page === button ?
                                'uk-active' : '';
                            break;
                    }
                    if (btnDisplay) {
                        node = $('<li>', {
                            'class': classes.sPageButton + ' ' + btnClass,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId + '_' + button :
                                null
                        })
                            .append($((-1 != btnClass.indexOf('disabled') || -1 != btnClass.indexOf('active')) ? '<span>' : '<a>', {
                            'href': '#',
                            'aria-controls': settings.sTableId,
                            'aria-label': aria[button],
                            'data-dt-idx': counter,
                            'tabindex': settings.iTabIndex
                        })
                            .html(btnDisplay))
                            .appendTo(container);
                        settings.oApi._fnBindAction(node, { action: button }, clickHandler);
                        counter++;
                    }
                }
            }
        };
        // IE9 throws an 'unknown error' if document.activeElement is used
        // inside an iframe or frame. 
        var activeEl;
        try {
            // Because this approach is destroying and recreating the paging
            // elements, focus is lost on the select button which is bad for
            // accessibility. So we want to restore focus once the draw has
            // completed
            activeEl = $(host).find(document.activeElement).data('dt-idx');
        }
        catch (e) { }
        attach($(host).empty().html('<ul class="uk-pagination uk-pagination-right uk-flex-right"/>').children('ul'), buttons);
        if (activeEl) {
            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }
    };
    return DataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy51aWtpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL29iai9SZWxlYXNlL25ldGNvcmVhcHAyLjEvUHViVG1wL091dC93d3dyb290L2xpYi9kYXRhdGFibGVzL2pzL2RhdGFUYWJsZXMudWlraXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7R0FDRztBQUVIOztHQUVHO0FBQ0gsQ0FBQyxVQUFVLE9BQU87SUFDakIsSUFBSyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRztRQUNqRCxNQUFNO1FBQ04sTUFBTSxDQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsVUFBVyxDQUFDO1lBQ2pELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFFLENBQUM7S0FDSjtTQUNJLElBQUssT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFHO1FBQ3ZDLFdBQVc7UUFDWCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7WUFDakMsSUFBSyxDQUFFLElBQUksRUFBRztnQkFDYixJQUFJLEdBQUcsTUFBTSxDQUFDO2FBQ2Q7WUFFRCxJQUFLLENBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUc7Z0JBQzlCLDBEQUEwRDtnQkFDMUQsOERBQThEO2dCQUM5RCw2QkFBNkI7Z0JBQzdCLENBQUMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsT0FBTyxPQUFPLENBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDO0tBQ0Y7U0FDSTtRQUNKLFVBQVU7UUFDVixP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RSxDQUFDLElBQUksQ0FBQywrREFBK0QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFDcEcsT0FBTyxDQUNQLENBQUM7UUFFRixJQUFLLFFBQVEsRUFBRztZQUNmLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUUsZUFBZSxHQUFDLFFBQVEsR0FBQyxHQUFHLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNyRDtJQUNGLENBQUMsQ0FBQztJQUdGLE9BQU8sU0FBUyxDQUFDO0FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgRGF0YVRhYmxlcyBVSWtpdCAzIGludGVncmF0aW9uXG4gKi9cblxuLyoqXG4gKiBUaGlzIGlzIGEgdGVjaCBwcmV2aWV3IG9mIFVJS2l0IGludGVncmF0aW9uIHdpdGggRGF0YVRhYmxlcy5cbiAqL1xuKGZ1bmN0aW9uKCBmYWN0b3J5ICl7XG5cdGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZSggWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCAkICkge1xuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0XHR9ICk7XG5cdH1cblx0ZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcblx0XHRcdGlmICggISByb290ICkge1xuXHRcdFx0XHRyb290ID0gd2luZG93O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgJCB8fCAhICQuZm4uZGF0YVRhYmxlICkge1xuXHRcdFx0XHQvLyBSZXF1aXJlIERhdGFUYWJsZXMsIHdoaWNoIGF0dGFjaGVzIHRvIGpRdWVyeSwgaW5jbHVkaW5nXG5cdFx0XHRcdC8vIGpRdWVyeSBpZiBuZWVkZWQgYW5kIGhhdmUgYSAkIHByb3BlcnR5IHNvIHdlIGNhbiBhY2Nlc3MgdGhlXG5cdFx0XHRcdC8vIGpRdWVyeSBvYmplY3QgdGhhdCBpcyB1c2VkXG5cdFx0XHRcdCQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWN0b3J5KCAkLCByb290LCByb290LmRvY3VtZW50ICk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBCcm93c2VyXG5cdFx0ZmFjdG9yeSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG5cdH1cbn0oZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcbid1c2Ugc3RyaWN0JztcbnZhciBEYXRhVGFibGUgPSAkLmZuLmRhdGFUYWJsZTtcblxuXG4vKiBTZXQgdGhlIGRlZmF1bHRzIGZvciBEYXRhVGFibGVzIGluaXRpYWxpc2F0aW9uICovXG4kLmV4dGVuZCggdHJ1ZSwgRGF0YVRhYmxlLmRlZmF1bHRzLCB7XG5cdGRvbTpcblx0XHRcIjwncm93IHVrLWdyaWQnPCd1ay13aWR0aC0xLTInbD48J3VrLXdpZHRoLTEtMidmPj5cIiArXG5cdFx0XCI8J3JvdyB1ay1ncmlkIGR0LW1lcmdlLWdyaWQnPCd1ay13aWR0aC0xLTEndHI+PlwiICtcblx0XHRcIjwncm93IHVrLWdyaWQgZHQtbWVyZ2UtZ3JpZCc8J3VrLXdpZHRoLTItNSdpPjwndWstd2lkdGgtMy01J3A+PlwiLFxuXHRyZW5kZXJlcjogJ3Vpa2l0J1xufSApO1xuXG5cbi8qIERlZmF1bHQgY2xhc3MgbW9kaWZpY2F0aW9uICovXG4kLmV4dGVuZCggRGF0YVRhYmxlLmV4dC5jbGFzc2VzLCB7XG5cdHNXcmFwcGVyOiAgICAgIFwiZGF0YVRhYmxlc193cmFwcGVyIHVrLWZvcm0gZHQtdWlraXRcIixcblx0c0ZpbHRlcklucHV0OiAgXCJ1ay1mb3JtLXNtYWxsXCIsXG5cdHNMZW5ndGhTZWxlY3Q6IFwidWstZm9ybS1zbWFsbFwiLFxuXHRzUHJvY2Vzc2luZzogICBcImRhdGFUYWJsZXNfcHJvY2Vzc2luZyB1ay1wYW5lbFwiXG59ICk7XG5cblxuLyogVUlraXQgcGFnaW5nIGJ1dHRvbiByZW5kZXJlciAqL1xuRGF0YVRhYmxlLmV4dC5yZW5kZXJlci5wYWdlQnV0dG9uLnVpa2l0ID0gZnVuY3Rpb24gKCBzZXR0aW5ncywgaG9zdCwgaWR4LCBidXR0b25zLCBwYWdlLCBwYWdlcyApIHtcblx0dmFyIGFwaSAgICAgPSBuZXcgRGF0YVRhYmxlLkFwaSggc2V0dGluZ3MgKTtcblx0dmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3Nlcztcblx0dmFyIGxhbmcgICAgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub1BhZ2luYXRlO1xuXHR2YXIgYXJpYSA9IHNldHRpbmdzLm9MYW5ndWFnZS5vQXJpYS5wYWdpbmF0ZSB8fCB7fTtcblx0dmFyIGJ0bkRpc3BsYXksIGJ0bkNsYXNzLCBjb3VudGVyPTA7XG5cblx0dmFyIGF0dGFjaCA9IGZ1bmN0aW9uKCBjb250YWluZXIsIGJ1dHRvbnMgKSB7XG5cdFx0dmFyIGksIGllbiwgbm9kZSwgYnV0dG9uO1xuXHRcdHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRpZiAoICEkKGUuY3VycmVudFRhcmdldCkuaGFzQ2xhc3MoJ2Rpc2FibGVkJykgJiYgYXBpLnBhZ2UoKSAhPSBlLmRhdGEuYWN0aW9uICkge1xuXHRcdFx0XHRhcGkucGFnZSggZS5kYXRhLmFjdGlvbiApLmRyYXcoICdwYWdlJyApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmb3IgKCBpPTAsIGllbj1idXR0b25zLmxlbmd0aCA7IGk8aWVuIDsgaSsrICkge1xuXHRcdFx0YnV0dG9uID0gYnV0dG9uc1tpXTtcblxuXHRcdFx0aWYgKCAkLmlzQXJyYXkoIGJ1dHRvbiApICkge1xuXHRcdFx0XHRhdHRhY2goIGNvbnRhaW5lciwgYnV0dG9uICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YnRuRGlzcGxheSA9ICcnO1xuXHRcdFx0XHRidG5DbGFzcyA9ICcnO1xuXG5cdFx0XHRcdHN3aXRjaCAoIGJ1dHRvbiApIHtcblx0XHRcdFx0XHRjYXNlICdlbGxpcHNpcyc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gJzxpIGNsYXNzPVwidWstaWNvbi1lbGxpcHNpcy1oXCI+PC9pPic7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9ICd1ay1kaXNhYmxlZCBkaXNhYmxlZCc7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ2ZpcnN0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSAnPGkgY2xhc3M9XCJ1ay1pY29uLWFuZ2xlLWRvdWJsZS1sZWZ0XCI+PC9pPiAnICsgbGFuZy5zRmlyc3Q7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyB1ay1kaXNhYmxlZCBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdwcmV2aW91cyc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gJzxpIGNsYXNzPVwidWstaWNvbi1hbmdsZS1sZWZ0XCI+PC9pPiAnICsgbGFuZy5zUHJldmlvdXM7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJ3VrLWRpc2FibGVkIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ25leHQnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGxhbmcuc05leHQgKyAnIDxpIGNsYXNzPVwidWstaWNvbi1hbmdsZS1yaWdodFwiPjwvaT4nO1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSAocGFnZSA8IHBhZ2VzLTEgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICd1ay1kaXNhYmxlZCBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdsYXN0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNMYXN0ICsgJyA8aSBjbGFzcz1cInVrLWljb24tYW5nbGUtZG91YmxlLXJpZ2h0XCI+PC9pPic7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IChwYWdlIDwgcGFnZXMtMSA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyB1ay1kaXNhYmxlZCBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGJ1dHRvbiArIDE7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IHBhZ2UgPT09IGJ1dHRvbiA/XG5cdFx0XHRcdFx0XHRcdCd1ay1hY3RpdmUnIDogJyc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggYnRuRGlzcGxheSApIHtcblx0XHRcdFx0XHRub2RlID0gJCgnPGxpPicsIHtcblx0XHRcdFx0XHRcdFx0J2NsYXNzJzogY2xhc3Nlcy5zUGFnZUJ1dHRvbisnICcrYnRuQ2xhc3MsXG5cdFx0XHRcdFx0XHRcdCdpZCc6IGlkeCA9PT0gMCAmJiB0eXBlb2YgYnV0dG9uID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdFx0XHRcdFx0c2V0dGluZ3Muc1RhYmxlSWQgKydfJysgYnV0dG9uIDpcblx0XHRcdFx0XHRcdFx0XHRudWxsXG5cdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdC5hcHBlbmQoICQoKCAtMSAhPSBidG5DbGFzcy5pbmRleE9mKCdkaXNhYmxlZCcpIHx8IC0xICE9IGJ0bkNsYXNzLmluZGV4T2YoJ2FjdGl2ZScpICkgPyAnPHNwYW4+JyA6ICc8YT4nLCB7XG5cdFx0XHRcdFx0XHRcdFx0J2hyZWYnOiAnIycsXG5cdFx0XHRcdFx0XHRcdFx0J2FyaWEtY29udHJvbHMnOiBzZXR0aW5ncy5zVGFibGVJZCxcblx0XHRcdFx0XHRcdFx0XHQnYXJpYS1sYWJlbCc6IGFyaWFbIGJ1dHRvbiBdLFxuXHRcdFx0XHRcdFx0XHRcdCdkYXRhLWR0LWlkeCc6IGNvdW50ZXIsXG5cdFx0XHRcdFx0XHRcdFx0J3RhYmluZGV4Jzogc2V0dGluZ3MuaVRhYkluZGV4XG5cdFx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0XHQuaHRtbCggYnRuRGlzcGxheSApXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQuYXBwZW5kVG8oIGNvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0c2V0dGluZ3Mub0FwaS5fZm5CaW5kQWN0aW9uKFxuXHRcdFx0XHRcdFx0bm9kZSwge2FjdGlvbjogYnV0dG9ufSwgY2xpY2tIYW5kbGVyXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGNvdW50ZXIrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBJRTkgdGhyb3dzIGFuICd1bmtub3duIGVycm9yJyBpZiBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGlzIHVzZWRcblx0Ly8gaW5zaWRlIGFuIGlmcmFtZSBvciBmcmFtZS4gXG5cdHZhciBhY3RpdmVFbDtcblxuXHR0cnkge1xuXHRcdC8vIEJlY2F1c2UgdGhpcyBhcHByb2FjaCBpcyBkZXN0cm95aW5nIGFuZCByZWNyZWF0aW5nIHRoZSBwYWdpbmdcblx0XHQvLyBlbGVtZW50cywgZm9jdXMgaXMgbG9zdCBvbiB0aGUgc2VsZWN0IGJ1dHRvbiB3aGljaCBpcyBiYWQgZm9yXG5cdFx0Ly8gYWNjZXNzaWJpbGl0eS4gU28gd2Ugd2FudCB0byByZXN0b3JlIGZvY3VzIG9uY2UgdGhlIGRyYXcgaGFzXG5cdFx0Ly8gY29tcGxldGVkXG5cdFx0YWN0aXZlRWwgPSAkKGhvc3QpLmZpbmQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuZGF0YSgnZHQtaWR4Jyk7XG5cdH1cblx0Y2F0Y2ggKGUpIHt9XG5cblx0YXR0YWNoKFxuXHRcdCQoaG9zdCkuZW1wdHkoKS5odG1sKCc8dWwgY2xhc3M9XCJ1ay1wYWdpbmF0aW9uIHVrLXBhZ2luYXRpb24tcmlnaHQgdWstZmxleC1yaWdodFwiLz4nKS5jaGlsZHJlbigndWwnKSxcblx0XHRidXR0b25zXG5cdCk7XG5cblx0aWYgKCBhY3RpdmVFbCApIHtcblx0XHQkKGhvc3QpLmZpbmQoICdbZGF0YS1kdC1pZHg9JythY3RpdmVFbCsnXScgKS5mb2N1cygpO1xuXHR9XG59O1xuXG5cbnJldHVybiBEYXRhVGFibGU7XG59KSk7Il19