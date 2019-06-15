/*! DataTables styling integration
 * ©2018 SpryMedia Ltd - datatables.net/license
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
    return $.fn.dataTable;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YVRhYmxlcy5kYXRhVGFibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2RhdGF0YWJsZXMvanMvZGF0YVRhYmxlcy5kYXRhVGFibGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsQ0FBQyxVQUFVLE9BQU87SUFDakIsSUFBSyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRztRQUNqRCxNQUFNO1FBQ04sTUFBTSxDQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsVUFBVyxDQUFDO1lBQ2pELE9BQU8sT0FBTyxDQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFFLENBQUM7S0FDSjtTQUNJLElBQUssT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFHO1FBQ3ZDLFdBQVc7UUFDWCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7WUFDakMsSUFBSyxDQUFFLElBQUksRUFBRztnQkFDYixJQUFJLEdBQUcsTUFBTSxDQUFDO2FBQ2Q7WUFFRCxJQUFLLENBQUUsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUc7Z0JBQzlCLDBEQUEwRDtnQkFDMUQsOERBQThEO2dCQUM5RCw2QkFBNkI7Z0JBQzdCLENBQUMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsT0FBTyxPQUFPLENBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDO0tBQ0Y7U0FDSTtRQUNKLFVBQVU7UUFDVixPQUFPLENBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUUsQ0FBQztLQUNwQztBQUNGLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVM7SUFFMUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztBQUV0QixDQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohIERhdGFUYWJsZXMgc3R5bGluZyBpbnRlZ3JhdGlvblxuICogwqkyMDE4IFNwcnlNZWRpYSBMdGQgLSBkYXRhdGFibGVzLm5ldC9saWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCBmYWN0b3J5ICl7XG5cdGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZSggWydqcXVlcnknLCAnZGF0YXRhYmxlcy5uZXQnXSwgZnVuY3Rpb24gKCAkICkge1xuXHRcdFx0cmV0dXJuIGZhY3RvcnkoICQsIHdpbmRvdywgZG9jdW1lbnQgKTtcblx0XHR9ICk7XG5cdH1cblx0ZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvb3QsICQpIHtcblx0XHRcdGlmICggISByb290ICkge1xuXHRcdFx0XHRyb290ID0gd2luZG93O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgJCB8fCAhICQuZm4uZGF0YVRhYmxlICkge1xuXHRcdFx0XHQvLyBSZXF1aXJlIERhdGFUYWJsZXMsIHdoaWNoIGF0dGFjaGVzIHRvIGpRdWVyeSwgaW5jbHVkaW5nXG5cdFx0XHRcdC8vIGpRdWVyeSBpZiBuZWVkZWQgYW5kIGhhdmUgYSAkIHByb3BlcnR5IHNvIHdlIGNhbiBhY2Nlc3MgdGhlXG5cdFx0XHRcdC8vIGpRdWVyeSBvYmplY3QgdGhhdCBpcyB1c2VkXG5cdFx0XHRcdCQgPSByZXF1aXJlKCdkYXRhdGFibGVzLm5ldCcpKHJvb3QsICQpLiQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWN0b3J5KCAkLCByb290LCByb290LmRvY3VtZW50ICk7XG5cdFx0fTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBCcm93c2VyXG5cdFx0ZmFjdG9yeSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG5cdH1cbn0oZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcblxucmV0dXJuICQuZm4uZGF0YVRhYmxlO1xuXG59KSk7XG4iXX0=