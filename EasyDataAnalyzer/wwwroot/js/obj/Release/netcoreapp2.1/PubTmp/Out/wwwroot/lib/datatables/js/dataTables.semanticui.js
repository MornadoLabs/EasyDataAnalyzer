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
        dom: "<'ui stackable grid'" +
            "<'row'" +
            "<'eight wide column'l>" +
            "<'right aligned eight wide column'f>" +
            ">" +
            "<'row dt-table'" +
            "<'sixteen wide column'tr>" +
            ">" +
            "<'row'" +
            "<'seven wide column'i>" +
            "<'right aligned nine wide column'p>" +
            ">" +
            ">",
        renderer: 'semanticUI'
    });
    /* Default class modification */
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper dt-semanticUI",
        sFilter: "dataTables_filter ui input",
        sProcessing: "dataTables_processing ui segment",
        sPageButton: "paginate_button item"
    });
    /* Bootstrap paging button renderer */
    DataTable.ext.renderer.pageButton.semanticUI = function (settings, host, idx, buttons, page, pages) {
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
                            btnClass = page === button ?
                                'active' : '';
                            break;
                    }
                    var tag = btnClass.indexOf('disabled') === -1 ?
                        'a' :
                        'div';
                    if (btnDisplay) {
                        node = $('<' + tag + '>', {
                            'class': classes.sPageButton + ' ' + btnClass,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId + '_' + button :
                                null,
                            'href': '#',
                            'aria-controls': settings.sTableId,
                            'aria-label': aria[button],
                            'data-dt-idx': counter,
                            'tabindex': settings.iTabIndex
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
        attach($(host).empty().html('<div class="ui stackable pagination menu"/>').children(), buttons);
        if (activeEl !== undefined) {
            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }
    };
    // Javascript enhancements on table initialisation
    $(document).on('init.dt', function (e, ctx) {
        if (e.namespace !== 'dt') {
            return;
        }
        var api = new $.fn.dataTable.Api(ctx);
        // Length menu drop down
        if ($.fn.dropdown) {
            $('div.dataTables_length select', api.table().container()).dropdown();
        }
        // Filtering input
        $('div.dataTables_filter.ui.input', api.table().container()).removeClass('input').addClass('form');
        $('div.dataTables_filter input', api.table().container()).wrap('<span class="ui input" />');
    });
    return DataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5zZW1hbnRpY3VpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2RhdGF0YWJsZXMvanMvZGF0YVRhYmxlcy5zZW1hbnRpY3VpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUg7Ozs7Ozs7R0FPRztBQUNILENBQUMsVUFBVSxPQUFPO0lBQ2pCLElBQUssT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUc7UUFDakQsTUFBTTtRQUNOLE1BQU0sQ0FBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLFVBQVcsQ0FBQztZQUNqRCxPQUFPLE9BQU8sQ0FBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ3ZDLENBQUMsQ0FBRSxDQUFDO0tBQ0o7U0FDSSxJQUFLLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRztRQUN2QyxXQUFXO1FBQ1gsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxDQUFDO1lBQ2pDLElBQUssQ0FBRSxJQUFJLEVBQUc7Z0JBQ2IsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNkO1lBRUQsSUFBSyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFHO2dCQUM5QiwwREFBMEQ7Z0JBQzFELDhEQUE4RDtnQkFDOUQsNkJBQTZCO2dCQUM3QixDQUFDLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6QztZQUVELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQzFDLENBQUMsQ0FBQztLQUNGO1NBQ0k7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QUFDO0FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgRGF0YVRhYmxlcyBCb290c3RyYXAgMyBpbnRlZ3JhdGlvblxuICogwqkyMDExLTIwMTUgU3ByeU1lZGlhIEx0ZCAtIGRhdGF0YWJsZXMubmV0L2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIERhdGFUYWJsZXMgaW50ZWdyYXRpb24gZm9yIEJvb3RzdHJhcCAzLiBUaGlzIHJlcXVpcmVzIEJvb3RzdHJhcCAzIGFuZFxuICogRGF0YVRhYmxlcyAxLjEwIG9yIG5ld2VyLlxuICpcbiAqIFRoaXMgZmlsZSBzZXRzIHRoZSBkZWZhdWx0cyBhbmQgYWRkcyBvcHRpb25zIHRvIERhdGFUYWJsZXMgdG8gc3R5bGUgaXRzXG4gKiBjb250cm9scyB1c2luZyBCb290c3RyYXAuIFNlZSBodHRwOi8vZGF0YXRhYmxlcy5uZXQvbWFudWFsL3N0eWxpbmcvYm9vdHN0cmFwXG4gKiBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cbiAqL1xuKGZ1bmN0aW9uKCBmYWN0b3J5ICl7XG5cdGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZSggWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCAkICkge1xuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0XHR9ICk7XG5cdH1cblx0ZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcblx0XHRcdGlmICggISByb290ICkge1xuXHRcdFx0XHRyb290ID0gd2luZG93O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgJCB8fCAhICQuZm4uZGF0YVRhYmxlICkge1xuXHRcdFx0XHQvLyBSZXF1aXJlIERhdGFUYWJsZXMsIHdoaWNoIGF0dGFjaGVzIHRvIGpRdWVyeSwgaW5jbHVkaW5nXG5cdFx0XHRcdC8vIGpRdWVyeSBpZiBuZWVkZWQgYW5kIGhhdmUgYSAkIHByb3BlcnR5IHNvIHdlIGNhbiBhY2Nlc3MgdGhlXG5cdFx0XHRcdC8vIGpRdWVyeSBvYmplY3QgdGhhdCBpcyB1c2VkXG5cdFx0XHRcdCQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWN0b3J5KCAkLCByb290LCByb290LmRvY3VtZW50ICk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBCcm93c2VyXG5cdFx0ZmFjdG9yeSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG5cdH1cbn0oZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcbid1c2Ugc3RyaWN0JztcbnZhciBEYXRhVGFibGUgPSAkLmZuLmRhdGFUYWJsZTtcblxuXG4vKiBTZXQgdGhlIGRlZmF1bHRzIGZvciBEYXRhVGFibGVzIGluaXRpYWxpc2F0aW9uICovXG4kLmV4dGVuZCggdHJ1ZSwgRGF0YVRhYmxlLmRlZmF1bHRzLCB7XG5cdGRvbTpcblx0XHRcIjwndWkgc3RhY2thYmxlIGdyaWQnXCIrXG5cdFx0XHRcIjwncm93J1wiK1xuXHRcdFx0XHRcIjwnZWlnaHQgd2lkZSBjb2x1bW4nbD5cIitcblx0XHRcdFx0XCI8J3JpZ2h0IGFsaWduZWQgZWlnaHQgd2lkZSBjb2x1bW4nZj5cIitcblx0XHRcdFwiPlwiK1xuXHRcdFx0XCI8J3JvdyBkdC10YWJsZSdcIitcblx0XHRcdFx0XCI8J3NpeHRlZW4gd2lkZSBjb2x1bW4ndHI+XCIrXG5cdFx0XHRcIj5cIitcblx0XHRcdFwiPCdyb3cnXCIrXG5cdFx0XHRcdFwiPCdzZXZlbiB3aWRlIGNvbHVtbidpPlwiK1xuXHRcdFx0XHRcIjwncmlnaHQgYWxpZ25lZCBuaW5lIHdpZGUgY29sdW1uJ3A+XCIrXG5cdFx0XHRcIj5cIitcblx0XHRcIj5cIixcblx0cmVuZGVyZXI6ICdzZW1hbnRpY1VJJ1xufSApO1xuXG5cbi8qIERlZmF1bHQgY2xhc3MgbW9kaWZpY2F0aW9uICovXG4kLmV4dGVuZCggRGF0YVRhYmxlLmV4dC5jbGFzc2VzLCB7XG5cdHNXcmFwcGVyOiAgICAgIFwiZGF0YVRhYmxlc193cmFwcGVyIGR0LXNlbWFudGljVUlcIixcblx0c0ZpbHRlcjogICAgICAgXCJkYXRhVGFibGVzX2ZpbHRlciB1aSBpbnB1dFwiLFxuXHRzUHJvY2Vzc2luZzogICBcImRhdGFUYWJsZXNfcHJvY2Vzc2luZyB1aSBzZWdtZW50XCIsXG5cdHNQYWdlQnV0dG9uOiAgIFwicGFnaW5hdGVfYnV0dG9uIGl0ZW1cIlxufSApO1xuXG5cbi8qIEJvb3RzdHJhcCBwYWdpbmcgYnV0dG9uIHJlbmRlcmVyICovXG5EYXRhVGFibGUuZXh0LnJlbmRlcmVyLnBhZ2VCdXR0b24uc2VtYW50aWNVSSA9IGZ1bmN0aW9uICggc2V0dGluZ3MsIGhvc3QsIGlkeCwgYnV0dG9ucywgcGFnZSwgcGFnZXMgKSB7XG5cdHZhciBhcGkgICAgID0gbmV3IERhdGFUYWJsZS5BcGkoIHNldHRpbmdzICk7XG5cdHZhciBjbGFzc2VzID0gc2V0dGluZ3Mub0NsYXNzZXM7XG5cdHZhciBsYW5nICAgID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9QYWdpbmF0ZTtcblx0dmFyIGFyaWEgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub0FyaWEucGFnaW5hdGUgfHwge307XG5cdHZhciBidG5EaXNwbGF5LCBidG5DbGFzcywgY291bnRlcj0wO1xuXG5cdHZhciBhdHRhY2ggPSBmdW5jdGlvbiggY29udGFpbmVyLCBidXR0b25zICkge1xuXHRcdHZhciBpLCBpZW4sIG5vZGUsIGJ1dHRvbjtcblx0XHR2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAhJChlLmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdkaXNhYmxlZCcpICYmIGFwaS5wYWdlKCkgIT0gZS5kYXRhLmFjdGlvbiApIHtcblx0XHRcdFx0YXBpLnBhZ2UoIGUuZGF0YS5hY3Rpb24gKS5kcmF3KCAncGFnZScgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Zm9yICggaT0wLCBpZW49YnV0dG9ucy5sZW5ndGggOyBpPGllbiA7IGkrKyApIHtcblx0XHRcdGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG5cblx0XHRcdGlmICggJC5pc0FycmF5KCBidXR0b24gKSApIHtcblx0XHRcdFx0YXR0YWNoKCBjb250YWluZXIsIGJ1dHRvbiApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGJ0bkRpc3BsYXkgPSAnJztcblx0XHRcdFx0YnRuQ2xhc3MgPSAnJztcblxuXHRcdFx0XHRzd2l0Y2ggKCBidXR0b24gKSB7XG5cdFx0XHRcdFx0Y2FzZSAnZWxsaXBzaXMnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9ICcmI3gyMDI2Oyc7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9ICdkaXNhYmxlZCc7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ2ZpcnN0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNGaXJzdDtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPiAwID9cblx0XHRcdFx0XHRcdFx0JycgOiAnIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ3ByZXZpb3VzJzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNQcmV2aW91cztcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPiAwID9cblx0XHRcdFx0XHRcdFx0JycgOiAnIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ25leHQnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGxhbmcuc05leHQ7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlIDwgcGFnZXMtMSA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdsYXN0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNMYXN0O1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzLTEgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICcgZGlzYWJsZWQnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBidXR0b24gKyAxO1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBwYWdlID09PSBidXR0b24gP1xuXHRcdFx0XHRcdFx0XHQnYWN0aXZlJyA6ICcnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGFnID0gYnRuQ2xhc3MuaW5kZXhPZiggJ2Rpc2FibGVkJyApID09PSAtMSA/XG5cdFx0XHRcdFx0J2EnIDpcblx0XHRcdFx0XHQnZGl2JztcblxuXHRcdFx0XHRpZiAoIGJ0bkRpc3BsYXkgKSB7XG5cdFx0XHRcdFx0bm9kZSA9ICQoJzwnK3RhZysnPicsIHtcblx0XHRcdFx0XHRcdFx0J2NsYXNzJzogY2xhc3Nlcy5zUGFnZUJ1dHRvbisnICcrYnRuQ2xhc3MsXG5cdFx0XHRcdFx0XHRcdCdpZCc6IGlkeCA9PT0gMCAmJiB0eXBlb2YgYnV0dG9uID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdFx0XHRcdFx0c2V0dGluZ3Muc1RhYmxlSWQgKydfJysgYnV0dG9uIDpcblx0XHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHQnaHJlZic6ICcjJyxcblx0XHRcdFx0XHRcdFx0J2FyaWEtY29udHJvbHMnOiBzZXR0aW5ncy5zVGFibGVJZCxcblx0XHRcdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBhcmlhWyBidXR0b24gXSxcblx0XHRcdFx0XHRcdFx0J2RhdGEtZHQtaWR4JzogY291bnRlcixcblx0XHRcdFx0XHRcdFx0J3RhYmluZGV4Jzogc2V0dGluZ3MuaVRhYkluZGV4XG5cdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdC5odG1sKCBidG5EaXNwbGF5IClcblx0XHRcdFx0XHRcdC5hcHBlbmRUbyggY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRzZXR0aW5ncy5vQXBpLl9mbkJpbmRBY3Rpb24oXG5cdFx0XHRcdFx0XHRub2RlLCB7YWN0aW9uOiBidXR0b259LCBjbGlja0hhbmRsZXJcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Y291bnRlcisrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElFOSB0aHJvd3MgYW4gJ3Vua25vd24gZXJyb3InIGlmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgdXNlZFxuXHQvLyBpbnNpZGUgYW4gaWZyYW1lIG9yIGZyYW1lLiBcblx0dmFyIGFjdGl2ZUVsO1xuXG5cdHRyeSB7XG5cdFx0Ly8gQmVjYXVzZSB0aGlzIGFwcHJvYWNoIGlzIGRlc3Ryb3lpbmcgYW5kIHJlY3JlYXRpbmcgdGhlIHBhZ2luZ1xuXHRcdC8vIGVsZW1lbnRzLCBmb2N1cyBpcyBsb3N0IG9uIHRoZSBzZWxlY3QgYnV0dG9uIHdoaWNoIGlzIGJhZCBmb3Jcblx0XHQvLyBhY2Nlc3NpYmlsaXR5LiBTbyB3ZSB3YW50IHRvIHJlc3RvcmUgZm9jdXMgb25jZSB0aGUgZHJhdyBoYXNcblx0XHQvLyBjb21wbGV0ZWRcblx0XHRhY3RpdmVFbCA9ICQoaG9zdCkuZmluZChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5kYXRhKCdkdC1pZHgnKTtcblx0fVxuXHRjYXRjaCAoZSkge31cblxuXHRhdHRhY2goXG5cdFx0JChob3N0KS5lbXB0eSgpLmh0bWwoJzxkaXYgY2xhc3M9XCJ1aSBzdGFja2FibGUgcGFnaW5hdGlvbiBtZW51XCIvPicpLmNoaWxkcmVuKCksXG5cdFx0YnV0dG9uc1xuXHQpO1xuXG5cdGlmICggYWN0aXZlRWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHQkKGhvc3QpLmZpbmQoICdbZGF0YS1kdC1pZHg9JythY3RpdmVFbCsnXScgKS5mb2N1cygpO1xuXHR9XG59O1xuXG5cbi8vIEphdmFzY3JpcHQgZW5oYW5jZW1lbnRzIG9uIHRhYmxlIGluaXRpYWxpc2F0aW9uXG4kKGRvY3VtZW50KS5vbiggJ2luaXQuZHQnLCBmdW5jdGlvbiAoZSwgY3R4KSB7XG5cdGlmICggZS5uYW1lc3BhY2UgIT09ICdkdCcgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGFwaSA9IG5ldyAkLmZuLmRhdGFUYWJsZS5BcGkoIGN0eCApO1xuXG5cdC8vIExlbmd0aCBtZW51IGRyb3AgZG93blxuXHRpZiAoICQuZm4uZHJvcGRvd24gKSB7XG5cdFx0JCggJ2Rpdi5kYXRhVGFibGVzX2xlbmd0aCBzZWxlY3QnLCBhcGkudGFibGUoKS5jb250YWluZXIoKSApLmRyb3Bkb3duKCk7XG5cdH1cblxuXHQvLyBGaWx0ZXJpbmcgaW5wdXRcblx0JCggJ2Rpdi5kYXRhVGFibGVzX2ZpbHRlci51aS5pbnB1dCcsIGFwaS50YWJsZSgpLmNvbnRhaW5lcigpICkucmVtb3ZlQ2xhc3MoJ2lucHV0JykuYWRkQ2xhc3MoJ2Zvcm0nKTtcblx0JCggJ2Rpdi5kYXRhVGFibGVzX2ZpbHRlciBpbnB1dCcsIGFwaS50YWJsZSgpLmNvbnRhaW5lcigpICkud3JhcCggJzxzcGFuIGNsYXNzPVwidWkgaW5wdXRcIiAvPicgKTtcbn0gKTtcblxuXG5yZXR1cm4gRGF0YVRhYmxlO1xufSkpO1xuIl19