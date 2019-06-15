/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */
/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
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
        dom: "<'mdl-grid'" +
            "<'mdl-cell mdl-cell--6-col'l>" +
            "<'mdl-cell mdl-cell--6-col'f>" +
            ">" +
            "<'mdl-grid dt-table'" +
            "<'mdl-cell mdl-cell--12-col'tr>" +
            ">" +
            "<'mdl-grid'" +
            "<'mdl-cell mdl-cell--4-col'i>" +
            "<'mdl-cell mdl-cell--8-col'p>" +
            ">",
        renderer: 'material'
    });
    /* Default class modification */
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper form-inline dt-material",
        sFilterInput: "form-control input-sm",
        sLengthSelect: "form-control input-sm",
        sProcessing: "dataTables_processing panel panel-default"
    });
    /* Bootstrap paging button renderer */
    DataTable.ext.renderer.pageButton.material = function (settings, host, idx, buttons, page, pages) {
        var api = new DataTable.Api(settings);
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay, btnClass, counter = 0;
        var attach = function (container, buttons) {
            var i, ien, node, button, disabled, active;
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
                    active = false;
                    switch (button) {
                        case 'ellipsis':
                            btnDisplay = '&#x2026;';
                            btnClass = 'disabled';
                            break;
                        case 'first':
                            btnDisplay = lang.sFirst;
                            btnClass = button + (page > 0 ?
                                '' : ' disabled');
                            break;
                        case 'previous':
                            btnDisplay = lang.sPrevious;
                            btnClass = button + (page > 0 ?
                                '' : ' disabled');
                            break;
                        case 'next':
                            btnDisplay = lang.sNext;
                            btnClass = button + (page < pages - 1 ?
                                '' : ' disabled');
                            break;
                        case 'last':
                            btnDisplay = lang.sLast;
                            btnClass = button + (page < pages - 1 ?
                                '' : ' disabled');
                            break;
                        default:
                            btnDisplay = button + 1;
                            btnClass = '';
                            active = page === button;
                            break;
                    }
                    if (active) {
                        btnClass += ' mdl-button--raised mdl-button--colored';
                    }
                    if (btnDisplay) {
                        node = $('<button>', {
                            'class': 'mdl-button ' + btnClass,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId + '_' + button :
                                null,
                            'aria-controls': settings.sTableId,
                            'aria-label': aria[button],
                            'data-dt-idx': counter,
                            'tabindex': settings.iTabIndex,
                            'disabled': btnClass.indexOf('disabled') !== -1
                        })
                            .html(btnDisplay)
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
        attach($(host).empty().html('<div class="pagination"/>').children(), buttons);
        if (activeEl !== undefined) {
            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }
    };
    return DataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5tYXRlcmlhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL29iai9SZWxlYXNlL25ldGNvcmVhcHAyLjEvUHViVG1wL091dC93d3dyb290L2xpYi9kYXRhdGFibGVzL2pzL2RhdGFUYWJsZXMubWF0ZXJpYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSDs7Ozs7OztHQU9HO0FBQ0gsQ0FBQyxVQUFVLE9BQU87SUFDakIsSUFBSyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRztRQUNqRCxNQUFNO1FBQ04sTUFBTSxDQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsVUFBVyxDQUFDO1lBQ2pELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFFLENBQUM7S0FDSjtTQUNJLElBQUssT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFHO1FBQ3ZDLFdBQVc7UUFDWCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7WUFDakMsSUFBSyxDQUFFLElBQUksRUFBRztnQkFDYixJQUFJLEdBQUcsTUFBTSxDQUFDO2FBQ2Q7WUFFRCxJQUFLLENBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUc7Z0JBQzlCLDBEQUEwRDtnQkFDMUQsOERBQThEO2dCQUM5RCw2QkFBNkI7Z0JBQzdCLENBQUMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsT0FBTyxPQUFPLENBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDO0tBQ0Y7U0FDSTtRQUNK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QUMsQ0FBQyxRQUFRLEVBQUUsRUFDNUQsT0FBTyxDQUNQLENBQUM7UUFFRixJQUFLLFFBQVEsS0FBSyxTQUFTLEVBQUc7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEdBQUMsUUFBUSxHQUFDLEdBQUcsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3JEO0lBQ0YsQ0FBQyxDQUFDO0lBR0YsT0FBTyxTQUFTLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBEYXRhVGFibGVzIEJvb3RzdHJhcCAzIGludGVncmF0aW9uXG4gKiDCqTIwMTEtMjAxNSBTcHJ5TWVkaWEgTHRkIC0gZGF0YXRhYmxlcy5uZXQvbGljZW5zZVxuICovXG5cbi8qKlxuICogRGF0YVRhYmxlcyBpbnRlZ3JhdGlvbiBmb3IgQm9vdHN0cmFwIDMuIFRoaXMgcmVxdWlyZXMgQm9vdHN0cmFwIDMgYW5kXG4gKiBEYXRhVGFibGVzIDEuMTAgb3IgbmV3ZXIuXG4gKlxuICogVGhpcyBmaWxlIHNldHMgdGhlIGRlZmF1bHRzIGFuZCBhZGRzIG9wdGlvbnMgdG8gRGF0YVRhYmxlcyB0byBzdHlsZSBpdHNcbiAqIGNvbnRyb2xzIHVzaW5nIEJvb3RzdHJhcC4gU2VlIGh0dHA6Ly9kYXRhdGFibGVzLm5ldC9tYW51YWwvc3R5bGluZy9ib290c3RyYXBcbiAqIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICovXG4oZnVuY3Rpb24oIGZhY3RvcnkgKXtcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKCBbJ2pxdWVyeScsICdkYXRhdGFibGVzLm5ldCddLCBmdW5jdGlvbiAoICQgKSB7XG5cdFx0XHRyZXR1cm4gZmFjdG9yeSggJCwgd2luZG93LCBkb2N1bWVudCApO1xuXHRcdH0gKTtcblx0fVxuXHRlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgJCkge1xuXHRcdFx0aWYgKCAhIHJvb3QgKSB7XG5cdFx0XHRcdHJvb3QgPSB3aW5kb3c7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkIHx8ICEgJC5mbi5kYXRhVGFibGUgKSB7XG5cdFx0XHRcdC8vIFJlcXVpcmUgRGF0YVRhYmxlcywgd2hpY2ggYXR0YWNoZXMgdG8galF1ZXJ5LCBpbmNsdWRpbmdcblx0XHRcdFx0Ly8galF1ZXJ5IGlmIG5lZWRlZCBhbmQgaGF2ZSBhICQgcHJvcGVydHkgc28gd2UgY2FuIGFjY2VzcyB0aGVcblx0XHRcdFx0Ly8galF1ZXJ5IG9iamVjdCB0aGF0IGlzIHVzZWRcblx0XHRcdFx0JCA9IHJlcXVpcmUoJ2RhdGF0YWJsZXMubmV0Jykocm9vdCwgJCkuJDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHJvb3QsIHJvb3QuZG9jdW1lbnQgKTtcblx0XHR9O1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEJyb3dzZXJcblx0XHRmYWN0b3J5KCBqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0fVxufShmdW5jdGlvbiggJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIERhdGFUYWJsZSA9ICQuZm4uZGF0YVRhYmxlO1xuXG5cbi8qIFNldCB0aGUgZGVmYXVsdHMgZm9yIERhdGFUYWJsZXMgaW5pdGlhbGlzYXRpb24gKi9cbiQuZXh0ZW5kKCB0cnVlLCBEYXRhVGFibGUuZGVmYXVsdHMsIHtcblx0ZG9tOlxuXHRcdFwiPCdtZGwtZ3JpZCdcIitcblx0XHRcdFwiPCdtZGwtY2VsbCBtZGwtY2VsbC0tNi1jb2wnbD5cIitcblx0XHRcdFwiPCdtZGwtY2VsbCBtZGwtY2VsbC0tNi1jb2wnZj5cIitcblx0XHRcIj5cIitcblx0XHRcIjwnbWRsLWdyaWQgZHQtdGFibGUnXCIrXG5cdFx0XHRcIjwnbWRsLWNlbGwgbWRsLWNlbGwtLTEyLWNvbCd0cj5cIitcblx0XHRcIj5cIitcblx0XHRcIjwnbWRsLWdyaWQnXCIrXG5cdFx0XHRcIjwnbWRsLWNlbGwgbWRsLWNlbGwtLTQtY29sJ2k+XCIrXG5cdFx0XHRcIjwnbWRsLWNlbGwgbWRsLWNlbGwtLTgtY29sJ3A+XCIrXG5cdFx0XCI+XCIsXG5cdHJlbmRlcmVyOiAnbWF0ZXJpYWwnXG59ICk7XG5cblxuLyogRGVmYXVsdCBjbGFzcyBtb2RpZmljYXRpb24gKi9cbiQuZXh0ZW5kKCBEYXRhVGFibGUuZXh0LmNsYXNzZXMsIHtcblx0c1dyYXBwZXI6ICAgICAgXCJkYXRhVGFibGVzX3dyYXBwZXIgZm9ybS1pbmxpbmUgZHQtbWF0ZXJpYWxcIixcblx0c0ZpbHRlcklucHV0OiAgXCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIixcblx0c0xlbmd0aFNlbGVjdDogXCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIixcblx0c1Byb2Nlc3Npbmc6ICAgXCJkYXRhVGFibGVzX3Byb2Nlc3NpbmcgcGFuZWwgcGFuZWwtZGVmYXVsdFwiXG59ICk7XG5cblxuLyogQm9vdHN0cmFwIHBhZ2luZyBidXR0b24gcmVuZGVyZXIgKi9cbkRhdGFUYWJsZS5leHQucmVuZGVyZXIucGFnZUJ1dHRvbi5tYXRlcmlhbCA9IGZ1bmN0aW9uICggc2V0dGluZ3MsIGhvc3QsIGlkeCwgYnV0dG9ucywgcGFnZSwgcGFnZXMgKSB7XG5cdHZhciBhcGkgICAgID0gbmV3IERhdGFUYWJsZS5BcGkoIHNldHRpbmdzICk7XG5cdHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG5cdHZhciBsYW5nICAgID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9QYWdpbmF0ZTtcblx0dmFyIGFyaWEgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub0FyaWEucGFnaW5hdGUgfHwge307XG5cdHZhciBidG5EaXNwbGF5LCBidG5DbGFzcywgY291bnRlcj0wO1xuXG5cdHZhciBhdHRhY2ggPSBmdW5jdGlvbiggY29udGFpbmVyLCBidXR0b25zICkge1xuXHRcdHZhciBpLCBpZW4sIG5vZGUsIGJ1dHRvbiwgZGlzYWJsZWQsIGFjdGl2ZTtcblx0XHR2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAhJChlLmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdkaXNhYmxlZCcpICYmIGFwaS5wYWdlKCkgIT0gZS5kYXRhLmFjdGlvbiApIHtcblx0XHRcdFx0YXBpLnBhZ2UoIGUuZGF0YS5hY3Rpb24gKS5kcmF3KCAncGFnZScgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Zm9yICggaT0wLCBpZW49YnV0dG9ucy5sZW5ndGggOyBpPGllbiA7IGkrKyApIHtcblx0XHRcdGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG5cblx0XHRcdGlmICggJC5pc0FycmF5KCBidXR0b24gKSApIHtcblx0XHRcdFx0YXR0YWNoKCBjb250YWluZXIsIGJ1dHRvbiApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGJ0bkRpc3BsYXkgPSAnJztcblx0XHRcdFx0YWN0aXZlID0gZmFsc2U7XG5cblx0XHRcdFx0c3dpdGNoICggYnV0dG9uICkge1xuXHRcdFx0XHRcdGNhc2UgJ2VsbGlwc2lzJzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSAnJiN4MjAyNjsnO1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSAnZGlzYWJsZWQnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdmaXJzdCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zRmlyc3Q7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdwcmV2aW91cyc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zUHJldmlvdXM7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICduZXh0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNOZXh0O1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzLTEgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICcgZGlzYWJsZWQnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnbGFzdCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zTGFzdDtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPCBwYWdlcy0xID9cblx0XHRcdFx0XHRcdFx0JycgOiAnIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gYnV0dG9uICsgMTtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gJyc7XG5cdFx0XHRcdFx0XHRhY3RpdmUgPSBwYWdlID09PSBidXR0b247XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggYWN0aXZlICkge1xuXHRcdFx0XHRcdGJ0bkNsYXNzICs9ICcgbWRsLWJ1dHRvbi0tcmFpc2VkIG1kbC1idXR0b24tLWNvbG9yZWQnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBidG5EaXNwbGF5ICkge1xuXHRcdFx0XHRcdG5vZGUgPSAkKCc8YnV0dG9uPicsIHtcblx0XHRcdFx0XHRcdFx0J2NsYXNzJzogJ21kbC1idXR0b24gJytidG5DbGFzcyxcblx0XHRcdFx0XHRcdFx0J2lkJzogaWR4ID09PSAwICYmIHR5cGVvZiBidXR0b24gPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRcdFx0XHRzZXR0aW5ncy5zVGFibGVJZCArJ18nKyBidXR0b24gOlxuXHRcdFx0XHRcdFx0XHRcdG51bGwsXG5cdFx0XHRcdFx0XHRcdCdhcmlhLWNvbnRyb2xzJzogc2V0dGluZ3Muc1RhYmxlSWQsXG5cdFx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogYXJpYVsgYnV0dG9uIF0sXG5cdFx0XHRcdFx0XHRcdCdkYXRhLWR0LWlkeCc6IGNvdW50ZXIsXG5cdFx0XHRcdFx0XHRcdCd0YWJpbmRleCc6IHNldHRpbmdzLmlUYWJJbmRleCxcblx0XHRcdFx0XHRcdFx0J2Rpc2FibGVkJzogYnRuQ2xhc3MuaW5kZXhPZignZGlzYWJsZWQnKSAhPT0gLTFcblx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0Lmh0bWwoIGJ0bkRpc3BsYXkgKVxuXHRcdFx0XHRcdFx0LmFwcGVuZFRvKCBjb250YWluZXIgKTtcblxuXHRcdFx0XHRcdHNldHRpbmdzLm9BcGkuX2ZuQmluZEFjdGlvbihcblx0XHRcdFx0XHRcdG5vZGUsIHthY3Rpb246IGJ1dHRvbn0sIGNsaWNrSGFuZGxlclxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRjb3VudGVyKys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSUU5IHRocm93cyBhbiAndW5rbm93biBlcnJvcicgaWYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyB1c2VkXG5cdC8vIGluc2lkZSBhbiBpZnJhbWUgb3IgZnJhbWUuIFxuXHR2YXIgYWN0aXZlRWw7XG5cblx0dHJ5IHtcblx0XHQvLyBCZWNhdXNlIHRoaXMgYXBwcm9hY2ggaXMgZGVzdHJveWluZyBhbmQgcmVjcmVhdGluZyB0aGUgcGFnaW5nXG5cdFx0Ly8gZWxlbWVudHMsIGZvY3VzIGlzIGxvc3Qgb24gdGhlIHNlbGVjdCBidXR0b24gd2hpY2ggaXMgYmFkIGZvclxuXHRcdC8vIGFjY2Vzc2liaWxpdHkuIFNvIHdlIHdhbnQgdG8gcmVzdG9yZSBmb2N1cyBvbmNlIHRoZSBkcmF3IGhhc1xuXHRcdC8vIGNvbXBsZXRlZFxuXHRcdGFjdGl2ZUVsID0gJChob3N0KS5maW5kKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmRhdGEoJ2R0LWlkeCcpO1xuXHR9XG5cdGNhdGNoIChlKSB7fVxuXG5cdGF0dGFjaChcblx0XHQkKGhvc3QpLmVtcHR5KCkuaHRtbCgnPGRpdiBjbGFzcz1cInBhZ2luYXRpb25cIi8+JykuY2hpbGRyZW4oKSxcblx0XHRidXR0b25zXG5cdCk7XG5cblx0aWYgKCBhY3RpdmVFbCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdCQoaG9zdCkuZmluZCggJ1tkYXRhLWR0LWlkeD0nK2FjdGl2ZUVsKyddJyApLmZvY3VzKCk7XG5cdH1cbn07XG5cblxucmV0dXJuIERhdGFUYWJsZTtcbn0pKTsiXX0=