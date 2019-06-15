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
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        renderer: 'bootstrap'
    });
    /* Default class modification */
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
        sFilterInput: "form-control input-sm",
        sLengthSelect: "form-control input-sm",
        sProcessing: "dataTables_processing panel panel-default"
    });
    /* Bootstrap paging button renderer */
    DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
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
                    if (btnDisplay) {
                        node = $('<li>', {
                            'class': classes.sPageButton + ' ' + btnClass,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId + '_' + button :
                                null
                        })
                            .append($('<a>', {
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
        attach($(host).empty().html('<ul class="pagination"/>').children('ul'), buttons);
        if (activeEl !== undefined) {
            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }
    };
    return DataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5ib290c3RyYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9vYmovUmVsZWFzZS9uZXRjb3JlYXBwMi4xL1B1YlRtcC9PdXQvd3d3cm9vdC9saWIvZGF0YXRhYmxlcy9qcy9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVIOzs7Ozs7O0dBT0c7QUFDSCxDQUFDLFVBQVUsT0FBTztJQUNqQixJQUFLLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFHO1FBQ2pELE1BQU07UUFDTixNQUFNLENBQUUsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxVQUFXLENBQUM7WUFDakQsT0FBTyxPQUFPLENBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUUsQ0FBQztRQUN2QyxDQUFDLENBQUUsQ0FBQztLQUNKO1NBQ0ksSUFBSyxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUc7UUFDdkMsV0FBVztRQUNYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztZQUNqQyxJQUFLLENBQUUsSUFBSSxFQUFHO2dCQUNiLElBQUksR0FBRyxNQUFNLENBQUM7YUFDZDtZQUVELElBQUssQ0FBRSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRztnQkFDOUIsMERBQTBEO2dCQUMxRCw4REFBOEQ7Z0JBQzlELDZCQUE2QjtnQkFDN0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekM7WUFFRCxPQUFPLE9BQU8sQ0FBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUMxQyxDQUFDLENBQUM7S0FDRjtTQUNJO1FB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QUUsZUFBZSxHQUFDLFFBQVEsR0FBQyxHQUFHLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNyRDtJQUNGLENBQUMsQ0FBQztJQUdGLE9BQU8sU0FBUyxDQUFDO0FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgRGF0YVRhYmxlcyBCb290c3RyYXAgMyBpbnRlZ3JhdGlvblxuICogwqkyMDExLTIwMTUgU3ByeU1lZGlhIEx0ZCAtIGRhdGF0YWJsZXMubmV0L2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIERhdGFUYWJsZXMgaW50ZWdyYXRpb24gZm9yIEJvb3RzdHJhcCAzLiBUaGlzIHJlcXVpcmVzIEJvb3RzdHJhcCAzIGFuZFxuICogRGF0YVRhYmxlcyAxLjEwIG9yIG5ld2VyLlxuICpcbiAqIFRoaXMgZmlsZSBzZXRzIHRoZSBkZWZhdWx0cyBhbmQgYWRkcyBvcHRpb25zIHRvIERhdGFUYWJsZXMgdG8gc3R5bGUgaXRzXG4gKiBjb250cm9scyB1c2luZyBCb290c3RyYXAuIFNlZSBodHRwOi8vZGF0YXRhYmxlcy5uZXQvbWFudWFsL3N0eWxpbmcvYm9vdHN0cmFwXG4gKiBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cbiAqL1xuKGZ1bmN0aW9uKCBmYWN0b3J5ICl7XG5cdGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZSggWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCAkICkge1xuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0XHR9ICk7XG5cdH1cblx0ZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcblx0XHRcdGlmICggISByb290ICkge1xuXHRcdFx0XHRyb290ID0gd2luZG93O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgJCB8fCAhICQuZm4uZGF0YVRhYmxlICkge1xuXHRcdFx0XHQvLyBSZXF1aXJlIERhdGFUYWJsZXMsIHdoaWNoIGF0dGFjaGVzIHRvIGpRdWVyeSwgaW5jbHVkaW5nXG5cdFx0XHRcdC8vIGpRdWVyeSBpZiBuZWVkZWQgYW5kIGhhdmUgYSAkIHByb3BlcnR5IHNvIHdlIGNhbiBhY2Nlc3MgdGhlXG5cdFx0XHRcdC8vIGpRdWVyeSBvYmplY3QgdGhhdCBpcyB1c2VkXG5cdFx0XHRcdCQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWN0b3J5KCAkLCByb290LCByb290LmRvY3VtZW50ICk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBCcm93c2VyXG5cdFx0ZmFjdG9yeSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG5cdH1cbn0oZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcbid1c2Ugc3RyaWN0JztcbnZhciBEYXRhVGFibGUgPSAkLmZuLmRhdGFUYWJsZTtcblxuXG4vKiBTZXQgdGhlIGRlZmF1bHRzIGZvciBEYXRhVGFibGVzIGluaXRpYWxpc2F0aW9uICovXG4kLmV4dGVuZCggdHJ1ZSwgRGF0YVRhYmxlLmRlZmF1bHRzLCB7XG5cdGRvbTpcblx0XHRcIjwncm93JzwnY29sLXNtLTYnbD48J2NvbC1zbS02J2Y+PlwiICtcblx0XHRcIjwncm93JzwnY29sLXNtLTEyJ3RyPj5cIiArXG5cdFx0XCI8J3Jvdyc8J2NvbC1zbS01J2k+PCdjb2wtc20tNydwPj5cIixcblx0cmVuZGVyZXI6ICdib290c3RyYXAnXG59ICk7XG5cblxuLyogRGVmYXVsdCBjbGFzcyBtb2RpZmljYXRpb24gKi9cbiQuZXh0ZW5kKCBEYXRhVGFibGUuZXh0LmNsYXNzZXMsIHtcblx0c1dyYXBwZXI6ICAgICAgXCJkYXRhVGFibGVzX3dyYXBwZXIgZm9ybS1pbmxpbmUgZHQtYm9vdHN0cmFwXCIsXG5cdHNGaWx0ZXJJbnB1dDogIFwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIsXG5cdHNMZW5ndGhTZWxlY3Q6IFwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIsXG5cdHNQcm9jZXNzaW5nOiAgIFwiZGF0YVRhYmxlc19wcm9jZXNzaW5nIHBhbmVsIHBhbmVsLWRlZmF1bHRcIlxufSApO1xuXG5cbi8qIEJvb3RzdHJhcCBwYWdpbmcgYnV0dG9uIHJlbmRlcmVyICovXG5EYXRhVGFibGUuZXh0LnJlbmRlcmVyLnBhZ2VCdXR0b24uYm9vdHN0cmFwID0gZnVuY3Rpb24gKCBzZXR0aW5ncywgaG9zdCwgaWR4LCBidXR0b25zLCBwYWdlLCBwYWdlcyApIHtcblx0dmFyIGFwaSAgICAgPSBuZXcgRGF0YVRhYmxlLkFwaSggc2V0dGluZ3MgKTtcblx0dmFyIGNsYXNzZXMgPSBzZXR0aW5ncy5vQ2xhc3Nlcztcblx0dmFyIGxhbmcgICAgPSBzZXR0aW5ncy5vTGFuZ3VhZ2Uub1BhZ2luYXRlO1xuXHR2YXIgYXJpYSA9IHNldHRpbmdzLm9MYW5ndWFnZS5vQXJpYS5wYWdpbmF0ZSB8fCB7fTtcblx0dmFyIGJ0bkRpc3BsYXksIGJ0bkNsYXNzLCBjb3VudGVyPTA7XG5cblx0dmFyIGF0dGFjaCA9IGZ1bmN0aW9uKCBjb250YWluZXIsIGJ1dHRvbnMgKSB7XG5cdFx0dmFyIGksIGllbiwgbm9kZSwgYnV0dG9uO1xuXHRcdHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRpZiAoICEkKGUuY3VycmVudFRhcmdldCkuaGFzQ2xhc3MoJ2Rpc2FibGVkJykgJiYgYXBpLnBhZ2UoKSAhPSBlLmRhdGEuYWN0aW9uICkge1xuXHRcdFx0XHRhcGkucGFnZSggZS5kYXRhLmFjdGlvbiApLmRyYXcoICdwYWdlJyApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmb3IgKCBpPTAsIGllbj1idXR0b25zLmxlbmd0aCA7IGk8aWVuIDsgaSsrICkge1xuXHRcdFx0YnV0dG9uID0gYnV0dG9uc1tpXTtcblxuXHRcdFx0aWYgKCAkLmlzQXJyYXkoIGJ1dHRvbiApICkge1xuXHRcdFx0XHRhdHRhY2goIGNvbnRhaW5lciwgYnV0dG9uICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YnRuRGlzcGxheSA9ICcnO1xuXHRcdFx0XHRidG5DbGFzcyA9ICcnO1xuXG5cdFx0XHRcdHN3aXRjaCAoIGJ1dHRvbiApIHtcblx0XHRcdFx0XHRjYXNlICdlbGxpcHNpcyc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gJyYjeDIwMjY7Jztcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gJ2Rpc2FibGVkJztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnZmlyc3QnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGxhbmcuc0ZpcnN0O1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA+IDAgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICcgZGlzYWJsZWQnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAncHJldmlvdXMnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGxhbmcuc1ByZXZpb3VzO1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA+IDAgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICcgZGlzYWJsZWQnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnbmV4dCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zTmV4dDtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPCBwYWdlcy0xID9cblx0XHRcdFx0XHRcdFx0JycgOiAnIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgJ2xhc3QnOlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGxhbmcuc0xhc3Q7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlIDwgcGFnZXMtMSA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnRuRGlzcGxheSA9IGJ1dHRvbiArIDE7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IHBhZ2UgPT09IGJ1dHRvbiA/XG5cdFx0XHRcdFx0XHRcdCdhY3RpdmUnIDogJyc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggYnRuRGlzcGxheSApIHtcblx0XHRcdFx0XHRub2RlID0gJCgnPGxpPicsIHtcblx0XHRcdFx0XHRcdFx0J2NsYXNzJzogY2xhc3Nlcy5zUGFnZUJ1dHRvbisnICcrYnRuQ2xhc3MsXG5cdFx0XHRcdFx0XHRcdCdpZCc6IGlkeCA9PT0gMCAmJiB0eXBlb2YgYnV0dG9uID09PSAnc3RyaW5nJyA/XG5cdFx0XHRcdFx0XHRcdFx0c2V0dGluZ3Muc1RhYmxlSWQgKydfJysgYnV0dG9uIDpcblx0XHRcdFx0XHRcdFx0XHRudWxsXG5cdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdC5hcHBlbmQoICQoJzxhPicsIHtcblx0XHRcdFx0XHRcdFx0XHQnaHJlZic6ICcjJyxcblx0XHRcdFx0XHRcdFx0XHQnYXJpYS1jb250cm9scyc6IHNldHRpbmdzLnNUYWJsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdCdhcmlhLWxhYmVsJzogYXJpYVsgYnV0dG9uIF0sXG5cdFx0XHRcdFx0XHRcdFx0J2RhdGEtZHQtaWR4JzogY291bnRlcixcblx0XHRcdFx0XHRcdFx0XHQndGFiaW5kZXgnOiBzZXR0aW5ncy5pVGFiSW5kZXhcblx0XHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0XHRcdC5odG1sKCBidG5EaXNwbGF5IClcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdC5hcHBlbmRUbyggY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRzZXR0aW5ncy5vQXBpLl9mbkJpbmRBY3Rpb24oXG5cdFx0XHRcdFx0XHRub2RlLCB7YWN0aW9uOiBidXR0b259LCBjbGlja0hhbmRsZXJcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Y291bnRlcisrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElFOSB0aHJvd3MgYW4gJ3Vua25vd24gZXJyb3InIGlmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgaXMgdXNlZFxuXHQvLyBpbnNpZGUgYW4gaWZyYW1lIG9yIGZyYW1lLiBcblx0dmFyIGFjdGl2ZUVsO1xuXG5cdHRyeSB7XG5cdFx0Ly8gQmVjYXVzZSB0aGlzIGFwcHJvYWNoIGlzIGRlc3Ryb3lpbmcgYW5kIHJlY3JlYXRpbmcgdGhlIHBhZ2luZ1xuXHRcdC8vIGVsZW1lbnRzLCBmb2N1cyBpcyBsb3N0IG9uIHRoZSBzZWxlY3QgYnV0dG9uIHdoaWNoIGlzIGJhZCBmb3Jcblx0XHQvLyBhY2Nlc3NpYmlsaXR5LiBTbyB3ZSB3YW50IHRvIHJlc3RvcmUgZm9jdXMgb25jZSB0aGUgZHJhdyBoYXNcblx0XHQvLyBjb21wbGV0ZWRcblx0XHRhY3RpdmVFbCA9ICQoaG9zdCkuZmluZChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5kYXRhKCdkdC1pZHgnKTtcblx0fVxuXHRjYXRjaCAoZSkge31cblxuXHRhdHRhY2goXG5cdFx0JChob3N0KS5lbXB0eSgpLmh0bWwoJzx1bCBjbGFzcz1cInBhZ2luYXRpb25cIi8+JykuY2hpbGRyZW4oJ3VsJyksXG5cdFx0YnV0dG9uc1xuXHQpO1xuXG5cdGlmICggYWN0aXZlRWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHQkKGhvc3QpLmZpbmQoICdbZGF0YS1kdC1pZHg9JythY3RpdmVFbCsnXScgKS5mb2N1cygpO1xuXHR9XG59O1xuXG5cbnJldHVybiBEYXRhVGFibGU7XG59KSk7XG4iXX0=