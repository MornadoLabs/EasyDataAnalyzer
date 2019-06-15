/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */
/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
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
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        renderer: 'bootstrap'
    });
    /* Default class modification */
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper dt-bootstrap4",
        sFilterInput: "form-control form-control-sm",
        sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
        sProcessing: "dataTables_processing card",
        sPageButton: "paginate_button page-item"
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
                            'tabindex': settings.iTabIndex,
                            'class': 'page-link'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5ib290c3RyYXA0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2RhdGF0YWJsZXMvanMvZGF0YVRhYmxlcy5ib290c3RyYXA0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUg7Ozs7Ozs7R0FPRztBQUNILENBQUMsVUFBVSxPQUFPO0lBQ2pCLElBQUssT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUc7UUFDakQsTUFBTTtRQUNOLE1BQU0sQ0FBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLFVBQVcsQ0FBQztZQUNqRCxPQUFPLE9BQU8sQ0FBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ3ZDLENBQUMsQ0FBRSxDQUFDO0tBQ0o7U0FDSSxJQUFLLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRztRQUN2QyxXQUFXO1FBQ1gsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxDQUFDO1lBQ2pDLElBQUssQ0FBRSxJQUFJLEVBQUc7Z0JBQ2IsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNkO1lBRUQsSUFBSyxDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFHO2dCQUM5QiwwREFBMEQ7Z0JBQzFELDhEQUE4RDtnQkFDOUQsNkJBQTZCO2dCQUM3QixDQUFDLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6QztZQUVELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQzFDLENBQUMsQ0FBQztLQUNGO1NBQ0k7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QUFTLEVBQUc7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBRSxlQUFlLEdBQUMsUUFBUSxHQUFDLEdBQUcsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3JEO0lBQ0YsQ0FBQyxDQUFDO0lBR0YsT0FBTyxTQUFTLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qISBEYXRhVGFibGVzIEJvb3RzdHJhcCA0IGludGVncmF0aW9uXG4gKiDCqTIwMTEtMjAxNyBTcHJ5TWVkaWEgTHRkIC0gZGF0YXRhYmxlcy5uZXQvbGljZW5zZVxuICovXG5cbi8qKlxuICogRGF0YVRhYmxlcyBpbnRlZ3JhdGlvbiBmb3IgQm9vdHN0cmFwIDQuIFRoaXMgcmVxdWlyZXMgQm9vdHN0cmFwIDQgYW5kXG4gKiBEYXRhVGFibGVzIDEuMTAgb3IgbmV3ZXIuXG4gKlxuICogVGhpcyBmaWxlIHNldHMgdGhlIGRlZmF1bHRzIGFuZCBhZGRzIG9wdGlvbnMgdG8gRGF0YVRhYmxlcyB0byBzdHlsZSBpdHNcbiAqIGNvbnRyb2xzIHVzaW5nIEJvb3RzdHJhcC4gU2VlIGh0dHA6Ly9kYXRhdGFibGVzLm5ldC9tYW51YWwvc3R5bGluZy9ib290c3RyYXBcbiAqIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICovXG4oZnVuY3Rpb24oIGZhY3RvcnkgKXtcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKCBbJ2pxdWVyeScsICdkYXRhdGFibGVzLm5ldCddLCBmdW5jdGlvbiAoICQgKSB7XG5cdFx0XHRyZXR1cm4gZmFjdG9yeSggJCwgd2luZG93LCBkb2N1bWVudCApO1xuXHRcdH0gKTtcblx0fVxuXHRlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgJCkge1xuXHRcdFx0aWYgKCAhIHJvb3QgKSB7XG5cdFx0XHRcdHJvb3QgPSB3aW5kb3c7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkIHx8ICEgJC5mbi5kYXRhVGFibGUgKSB7XG5cdFx0XHRcdC8vIFJlcXVpcmUgRGF0YVRhYmxlcywgd2hpY2ggYXR0YWNoZXMgdG8galF1ZXJ5LCBpbmNsdWRpbmdcblx0XHRcdFx0Ly8galF1ZXJ5IGlmIG5lZWRlZCBhbmQgaGF2ZSBhICQgcHJvcGVydHkgc28gd2UgY2FuIGFjY2VzcyB0aGVcblx0XHRcdFx0Ly8galF1ZXJ5IG9iamVjdCB0aGF0IGlzIHVzZWRcblx0XHRcdFx0JCA9IHJlcXVpcmUoJ2RhdGF0YWJsZXMubmV0Jykocm9vdCwgJCkuJDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHJvb3QsIHJvb3QuZG9jdW1lbnQgKTtcblx0XHR9O1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEJyb3dzZXJcblx0XHRmYWN0b3J5KCBqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0fVxufShmdW5jdGlvbiggJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIERhdGFUYWJsZSA9ICQuZm4uZGF0YVRhYmxlO1xuXG5cbi8qIFNldCB0aGUgZGVmYXVsdHMgZm9yIERhdGFUYWJsZXMgaW5pdGlhbGlzYXRpb24gKi9cbiQuZXh0ZW5kKCB0cnVlLCBEYXRhVGFibGUuZGVmYXVsdHMsIHtcblx0ZG9tOlxuXHRcdFwiPCdyb3cnPCdjb2wtc20tMTIgY29sLW1kLTYnbD48J2NvbC1zbS0xMiBjb2wtbWQtNidmPj5cIiArXG5cdFx0XCI8J3Jvdyc8J2NvbC1zbS0xMid0cj4+XCIgK1xuXHRcdFwiPCdyb3cnPCdjb2wtc20tMTIgY29sLW1kLTUnaT48J2NvbC1zbS0xMiBjb2wtbWQtNydwPj5cIixcblx0cmVuZGVyZXI6ICdib290c3RyYXAnXG59ICk7XG5cblxuLyogRGVmYXVsdCBjbGFzcyBtb2RpZmljYXRpb24gKi9cbiQuZXh0ZW5kKCBEYXRhVGFibGUuZXh0LmNsYXNzZXMsIHtcblx0c1dyYXBwZXI6ICAgICAgXCJkYXRhVGFibGVzX3dyYXBwZXIgZHQtYm9vdHN0cmFwNFwiLFxuXHRzRmlsdGVySW5wdXQ6ICBcImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtc21cIixcblx0c0xlbmd0aFNlbGVjdDogXCJjdXN0b20tc2VsZWN0IGN1c3RvbS1zZWxlY3Qtc20gZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1zbVwiLFxuXHRzUHJvY2Vzc2luZzogICBcImRhdGFUYWJsZXNfcHJvY2Vzc2luZyBjYXJkXCIsXG5cdHNQYWdlQnV0dG9uOiAgIFwicGFnaW5hdGVfYnV0dG9uIHBhZ2UtaXRlbVwiXG59ICk7XG5cblxuLyogQm9vdHN0cmFwIHBhZ2luZyBidXR0b24gcmVuZGVyZXIgKi9cbkRhdGFUYWJsZS5leHQucmVuZGVyZXIucGFnZUJ1dHRvbi5ib290c3RyYXAgPSBmdW5jdGlvbiAoIHNldHRpbmdzLCBob3N0LCBpZHgsIGJ1dHRvbnMsIHBhZ2UsIHBhZ2VzICkge1xuXHR2YXIgYXBpICAgICA9IG5ldyBEYXRhVGFibGUuQXBpKCBzZXR0aW5ncyApO1xuXHR2YXIgY2xhc3NlcyA9IHNldHRpbmdzLm9DbGFzc2VzO1xuXHR2YXIgbGFuZyAgICA9IHNldHRpbmdzLm9MYW5ndWFnZS5vUGFnaW5hdGU7XG5cdHZhciBhcmlhID0gc2V0dGluZ3Mub0xhbmd1YWdlLm9BcmlhLnBhZ2luYXRlIHx8IHt9O1xuXHR2YXIgYnRuRGlzcGxheSwgYnRuQ2xhc3MsIGNvdW50ZXI9MDtcblxuXHR2YXIgYXR0YWNoID0gZnVuY3Rpb24oIGNvbnRhaW5lciwgYnV0dG9ucyApIHtcblx0XHR2YXIgaSwgaWVuLCBub2RlLCBidXR0b247XG5cdFx0dmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uICggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGlmICggISQoZS5jdXJyZW50VGFyZ2V0KS5oYXNDbGFzcygnZGlzYWJsZWQnKSAmJiBhcGkucGFnZSgpICE9IGUuZGF0YS5hY3Rpb24gKSB7XG5cdFx0XHRcdGFwaS5wYWdlKCBlLmRhdGEuYWN0aW9uICkuZHJhdyggJ3BhZ2UnICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGZvciAoIGk9MCwgaWVuPWJ1dHRvbnMubGVuZ3RoIDsgaTxpZW4gOyBpKysgKSB7XG5cdFx0XHRidXR0b24gPSBidXR0b25zW2ldO1xuXG5cdFx0XHRpZiAoICQuaXNBcnJheSggYnV0dG9uICkgKSB7XG5cdFx0XHRcdGF0dGFjaCggY29udGFpbmVyLCBidXR0b24gKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRidG5EaXNwbGF5ID0gJyc7XG5cdFx0XHRcdGJ0bkNsYXNzID0gJyc7XG5cblx0XHRcdFx0c3dpdGNoICggYnV0dG9uICkge1xuXHRcdFx0XHRcdGNhc2UgJ2VsbGlwc2lzJzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSAnJiN4MjAyNjsnO1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSAnZGlzYWJsZWQnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdmaXJzdCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zRmlyc3Q7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdwcmV2aW91cyc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zUHJldmlvdXM7XG5cdFx0XHRcdFx0XHRidG5DbGFzcyA9IGJ1dHRvbiArIChwYWdlID4gMCA/XG5cdFx0XHRcdFx0XHRcdCcnIDogJyBkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICduZXh0Jzpcblx0XHRcdFx0XHRcdGJ0bkRpc3BsYXkgPSBsYW5nLnNOZXh0O1xuXHRcdFx0XHRcdFx0YnRuQ2xhc3MgPSBidXR0b24gKyAocGFnZSA8IHBhZ2VzLTEgP1xuXHRcdFx0XHRcdFx0XHQnJyA6ICcgZGlzYWJsZWQnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnbGFzdCc6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gbGFuZy5zTGFzdDtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gYnV0dG9uICsgKHBhZ2UgPCBwYWdlcy0xID9cblx0XHRcdFx0XHRcdFx0JycgOiAnIGRpc2FibGVkJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRidG5EaXNwbGF5ID0gYnV0dG9uICsgMTtcblx0XHRcdFx0XHRcdGJ0bkNsYXNzID0gcGFnZSA9PT0gYnV0dG9uID9cblx0XHRcdFx0XHRcdFx0J2FjdGl2ZScgOiAnJztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBidG5EaXNwbGF5ICkge1xuXHRcdFx0XHRcdG5vZGUgPSAkKCc8bGk+Jywge1xuXHRcdFx0XHRcdFx0XHQnY2xhc3MnOiBjbGFzc2VzLnNQYWdlQnV0dG9uKycgJytidG5DbGFzcyxcblx0XHRcdFx0XHRcdFx0J2lkJzogaWR4ID09PSAwICYmIHR5cGVvZiBidXR0b24gPT09ICdzdHJpbmcnID9cblx0XHRcdFx0XHRcdFx0XHRzZXR0aW5ncy5zVGFibGVJZCArJ18nKyBidXR0b24gOlxuXHRcdFx0XHRcdFx0XHRcdG51bGxcblx0XHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdFx0LmFwcGVuZCggJCgnPGE+Jywge1xuXHRcdFx0XHRcdFx0XHRcdCdocmVmJzogJyMnLFxuXHRcdFx0XHRcdFx0XHRcdCdhcmlhLWNvbnRyb2xzJzogc2V0dGluZ3Muc1RhYmxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0J2FyaWEtbGFiZWwnOiBhcmlhWyBidXR0b24gXSxcblx0XHRcdFx0XHRcdFx0XHQnZGF0YS1kdC1pZHgnOiBjb3VudGVyLFxuXHRcdFx0XHRcdFx0XHRcdCd0YWJpbmRleCc6IHNldHRpbmdzLmlUYWJJbmRleCxcblx0XHRcdFx0XHRcdFx0XHQnY2xhc3MnOiAncGFnZS1saW5rJ1xuXHRcdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdFx0Lmh0bWwoIGJ0bkRpc3BsYXkgKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0LmFwcGVuZFRvKCBjb250YWluZXIgKTtcblxuXHRcdFx0XHRcdHNldHRpbmdzLm9BcGkuX2ZuQmluZEFjdGlvbihcblx0XHRcdFx0XHRcdG5vZGUsIHthY3Rpb246IGJ1dHRvbn0sIGNsaWNrSGFuZGxlclxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRjb3VudGVyKys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSUU5IHRocm93cyBhbiAndW5rbm93biBlcnJvcicgaWYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBpcyB1c2VkXG5cdC8vIGluc2lkZSBhbiBpZnJhbWUgb3IgZnJhbWUuIFxuXHR2YXIgYWN0aXZlRWw7XG5cblx0dHJ5IHtcblx0XHQvLyBCZWNhdXNlIHRoaXMgYXBwcm9hY2ggaXMgZGVzdHJveWluZyBhbmQgcmVjcmVhdGluZyB0aGUgcGFnaW5nXG5cdFx0Ly8gZWxlbWVudHMsIGZvY3VzIGlzIGxvc3Qgb24gdGhlIHNlbGVjdCBidXR0b24gd2hpY2ggaXMgYmFkIGZvclxuXHRcdC8vIGFjY2Vzc2liaWxpdHkuIFNvIHdlIHdhbnQgdG8gcmVzdG9yZSBmb2N1cyBvbmNlIHRoZSBkcmF3IGhhc1xuXHRcdC8vIGNvbXBsZXRlZFxuXHRcdGFjdGl2ZUVsID0gJChob3N0KS5maW5kKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmRhdGEoJ2R0LWlkeCcpO1xuXHR9XG5cdGNhdGNoIChlKSB7fVxuXG5cdGF0dGFjaChcblx0XHQkKGhvc3QpLmVtcHR5KCkuaHRtbCgnPHVsIGNsYXNzPVwicGFnaW5hdGlvblwiLz4nKS5jaGlsZHJlbigndWwnKSxcblx0XHRidXR0b25zXG5cdCk7XG5cblx0aWYgKCBhY3RpdmVFbCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdCQoaG9zdCkuZmluZCggJ1tkYXRhLWR0LWlkeD0nK2FjdGl2ZUVsKyddJyApLmZvY3VzKCk7XG5cdH1cbn07XG5cblxucmV0dXJuIERhdGFUYWJsZTtcbn0pKTtcbiJdfQ==