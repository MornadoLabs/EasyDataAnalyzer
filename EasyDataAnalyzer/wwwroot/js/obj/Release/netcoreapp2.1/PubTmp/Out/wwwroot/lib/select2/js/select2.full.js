/*!
 * Select2 4.0.7
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
;
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    }
    else {
        // Browser globals
        factory(jQuery);
    }
}(function (jQuery) {
    // This is needed so we can catch the AMD loader configuration and use it
    // The inner file should be wrapped (by `banner.start.js`) in a function that
    // returns the AMD loader references.
    var S2 = (function () {
        // Restore the Select2 AMD loader so it can be used
        // Needed mostly in the language files, where the loader is not inserted
        if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
            var S2 = jQuery.fn.select2.amd;
        }
        var S2;
        (function () {
            if (!S2 || !S2.requirejs) {
                if (!S2) {
                    S2 = {};
                }
                else {
                    require = S2;
                }
                /**
                 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
                 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
                 */
                //Going sloppy to avoid 'use strict' string cost, but strict practices should
                //be followed.
                /*global setTimeout: false */
                var requirejs, require, define;
                (function (undef) {
                    var main, req, makeMap, handlers, defined = {}, waiting = {}, config = {}, defining = {}, hasOwn = Object.prototype.hasOwnProperty, aps = [].slice, jsSuffixRegExp = /\.js$/;
                    function hasProp(obj, prop) {
                        return hasOwn.call(obj, prop);
                    }
                    /**
                     * Given a relative module name, like ./something, normalize it to
                     * a real name that can be mapped to a path.
                     * @param {String} name the relative name
                     * @param {String} baseName a real name that the name arg is relative
                     * to.
                     * @returns {String} normalized name
                     */
                    function normalize(name, baseName) {
                        var nameParts, nameSegment, mapValue, foundMap, lastIndex, foundI, foundStarMap, starI, i, j, part, normalizedBaseParts, baseParts = baseName && baseName.split("/"), map = config.map, starMap = (map && map['*']) || {};
                        //Adjust any relative paths.
                        if (name) {
                            name = name.split('/');
                            lastIndex = name.length - 1;
                            // If wanting node ID compatibility, strip .js from end
                            // of IDs. Have to do this here, and not in nameToUrl
                            // because node allows either .js or non .js to map
                            // to same file.
                            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                            }
                            // Starts with a '.' so need the baseName
                            if (name[0].charAt(0) === '.' && baseParts) {
                                //Convert baseName to array, and lop off the last part,
                                //so that . matches that 'directory' and not name of the baseName's
                                //module. For instance, baseName of 'one/two/three', maps to
                                //'one/two/three.js', but we want the directory, 'one/two' for
                                //this normalization.
                                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                                name = normalizedBaseParts.concat(name);
                            }
                            //start trimDots
                            for (i = 0; i < name.length; i++) {
                                part = name[i];
                                if (part === '.') {
                                    name.splice(i, 1);
                                    i -= 1;
                                }
                                else if (part === '..') {
                                    // If at the start, or previous value is still ..,
                                    // keep them so that when converted to a path it may
                                    // still work when converted to a path, even though
                                    // as an ID it is less than ideal. In larger point
                                    // releases, may be better to just kick out an error.
                                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                                        continue;
                                    }
                                    else if (i > 0) {
                                        name.splice(i - 1, 2);
                                        i -= 2;
                                    }
                                }
                            }
                            //end trimDots
                            name = name.join('/');
                        }
                        //Apply map config if available.
                        if ((baseParts || starMap) && map) {
                            nameParts = name.split('/');
                            for (i = nameParts.length; i > 0; i -= 1) {
                                nameSegment = nameParts.slice(0, i).join("/");
                                if (baseParts) {
                                    //Find the longest baseName segment match in the config.
                                    //So, do joins on the biggest to smallest lengths of baseParts.
                                    for (j = baseParts.length; j > 0; j -= 1) {
                                        mapValue = map[baseParts.slice(0, j).join('/')];
                                        //baseName segment has  config, find if it has one for
                                        //this name.
                                        if (mapValue) {
                                            mapValue = mapValue[nameSegment];
                                            if (mapValue) {
                                                //Match, update name to the new value.
                                                foundMap = mapValue;
                                                foundI = i;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (foundMap) {
                                    break;
                                }
                                //Check for a star map match, but just hold on to it,
                                //if there is a shorter segment match later in a matching
                                //config, then favor over this star map.
                                if (!foundStarMap && starMap && starMap[nameSegment]) {
                                    foundStarMap = starMap[nameSegment];
                                    starI = i;
                                }
                            }
                            if (!foundMap && foundStarMap) {
                                foundMap = foundStarMap;
                                foundI = starI;
                            }
                            if (foundMap) {
                                nameParts.splice(0, foundI, foundMap);
                                name = nameParts.join('/');
                            }
                        }
                        return name;
                    }
                    function makeRequire(relName, forceSync) {
                        return function () {
                            //A version of a require function that passes a moduleName
                            //value for items that may need to
                            //look up paths relative to the moduleName
                            var args = aps.call(arguments, 0);
                            //If first arg is not require('string'), and there is only
                            //one arg, it is the array form without a callback. Insert
                            //a null so that the following concat is correct.
                            if (typeof args[0] !== 'string' && args.length === 1) {
                                args.push(null);
                            }
                            return req.apply(undef, args.concat([relName, forceSync]));
                        };
                    }
                    function makeNormalize(relName) {
                        return function (name) {
                            return normalize(name, relName);
                        };
                    }
                    function makeLoad(depName) {
                        return function (value) {
                            defined[depName] = value;
                        };
                    }
                    function callDep(name) {
                        if (hasProp(waiting, name)) {
                            var args = waiting[name];
                            delete waiting[name];
                            defining[name] = true;
                            main.apply(undef, args);
                        }
                        if (!hasProp(defined, name) && !hasProp(defining, name)) {
                            throw new Error('No ' + name);
                        }
                        return defined[name];
                    }
                    //Turns a plugin!resource to [plugin, resource]
                    //with the plugin being undefined if the name
                    //did not have a plugin prefix.
                    function splitPrefix(name) {
                        var prefix, index = name ? name.indexOf('!') : -1;
                        if (index > -1) {
                            prefix = name.substring(0, index);
                            name = name.substring(index + 1, name.length);
                        }
                        return [prefix, name];
                    }
                    //Creates a parts array for a relName where first part is plugin ID,
                    //second part is resource ID. Assumes relName has already been normalized.
                    function makeRelParts(relName) {
                        return relName ? splitPrefix(relName) : [];
                    }
                    /**
                     * Makes a name map, normalizing the name, and using a plugin
                     * for normalization if necessary. Grabs a ref to plugin
                     * too, as an optimization.
                     */
                    makeMap = function (name, relParts) {
                        var plugin, parts = splitPrefix(name), prefix = parts[0], relResourceName = relParts[1];
                        name = parts[1];
                        if (prefix) {
                            prefix = normalize(prefix, relResourceName);
                            plugin = callDep(prefix);
                        }
                        //Normalize according
                        if (prefix) {
                            if (plugin && plugin.normalize) {
                                name = plugin.normalize(name, makeNormalize(relResourceName));
                            }
                            else {
                                name = normalize(name, relResourceName);
                            }
                        }
                        else {
                            name = normalize(name, relResourceName);
                            parts = splitPrefix(name);
                            prefix = parts[0];
                            name = parts[1];
                            if (prefix) {
                                plugin = callDep(prefix);
                            }
                        }
                        //Using ridiculous property names for space reasons
                        return {
                            f: prefix ? prefix + '!' + name : name,
                            n: name,
                            pr: prefix,
                            p: plugin
                        };
                    };
                    function makeConfig(name) {
                        return function () {
                            return (config && config.config && config.config[name]) || {};
                        };
                    }
                    handlers = {
                        require: function (name) {
                            return makeRequire(name);
                        },
                        exports: function (name) {
                            var e = defined[name];
                            if (typeof e !== 'undefined') {
                                return e;
                            }
                            else {
                                return (defined[name] = {});
                            }
                        },
                        module: function (name) {
                            return {
                                id: name,
                                uri: '',
                                exports: defined[name],
                                config: makeConfig(name)
                            };
                        }
                    };
                    main = function (name, deps, callback, relName) {
                        var cjsModule, depName, ret, map, i, relParts, args = [], callbackType = typeof callback, usingExports;
                        //Use name if no relName
                        relName = relName || name;
                        relParts = makeRelParts(relName);
                        //Call the callback to define the module, if necessary.
                        if (callbackType === 'undefined' || callbackType === 'function') {
                            //Pull out the defined dependencies and pass the ordered
                            //values to the callback.
                            //Default to [require, exports, module] if no deps
                            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
                            for (i = 0; i < deps.length; i += 1) {
                                map = makeMap(deps[i], relParts);
                                depName = map.f;
                                //Fast path CommonJS standard dependencies.
                                if (depName === "require") {
                                    args[i] = handlers.require(name);
                                }
                                else if (depName === "exports") {
                                    //CommonJS module spec 1.1
                                    args[i] = handlers.exports(name);
                                    usingExports = true;
                                }
                                else if (depName === "module") {
                                    //CommonJS module spec 1.1
                                    cjsModule = args[i] = handlers.module(name);
                                }
                                else if (hasProp(defined, depName) ||
                                    hasProp(waiting, depName) ||
                                    hasProp(defining, depName)) {
                                    args[i] = callDep(depName);
                                }
                                else if (map.p) {
                                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                                    args[i] = defined[depName];
                                }
                                else {
                                    throw new Error(name + ' missing ' + depName);
                                }
                            }
                            ret = callback ? callback.apply(defined[name], args) : undefined;
                            if (name) {
                                //If setting exports via "module" is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                if (cjsModule && cjsModule.exports !== undef &&
                                    cjsModule.exports !== defined[name]) {
                                    defined[name] = cjsModule.exports;
                                }
                                else if (ret !== undef || !usingExports) {
                                    //Use the return value from the function.
                                    defined[name] = ret;
                                }
                            }
                        }
                        else if (name) {
                            //May just be an object definition for the module. Only
                            //worry about defining if have a module name.
                            defined[name] = callback;
                        }
                    };
                    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
                        if (typeof deps === "string") {
                            if (handlers[deps]) {
                                //callback in this case is really relName
                                return handlers[deps](callback);
                            }
                            //Just return the module wanted. In this scenario, the
                            //deps arg is the module name, and second arg (if passed)
                            //is just the relName.
                            //Normalize module name, if it contains . or ..
                            return callDep(makeMap(deps, makeRelParts(callback)).f);
                        }
                        else if (!deps.splice) {
                            //deps is a config object, not an array.
                            config = deps;
                            if (config.deps) {
                                req(config.deps, config.callback);
                            }
                            if (!callback) {
                                return;
                            }
                            if (callback.splice) {
                                //callback is an array, which means it is a dependency list.
                                //Adjust args if there are dependencies
                                deps = callback;
                                callback = relName;
                                relName = null;
                            }
                            else {
                                deps = undef;
                            }
                        }
                        //Support require(['a'])
                        callback = callback || function () { };
                        //If relName is a function, it is an errback handler,
                        //so remove it.
                        if (typeof relName === 'function') {
                            relName = forceSync;
                            forceSync = alt;
                        }
                        //Simulate async callback;
                        if (forceSync) {
                            main(undef, deps, callback, relName);
                        }
                        else {
                            //Using a non-zero value because of concern for what old browsers
                            //do, and latest browsers "upgrade" to 4 if lower value is used:
                            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
                            //If want a value immediately, use require('id') instead -- something
                            //that works in almond on the global level, but not guaranteed and
                            //unlikely to work in other AMD implementations.
                            setTimeout(function () {
                                main(undef, deps, callback, relName);
                            }, 4);
                        }
                        return req;
                    };
                    /**
                     * Just drops the config on the floor, but returns req in case
                     * the config return value is used.
                     */
                    req.config = function (cfg) {
                        return req(cfg);
                    };
                    /**
                     * Expose module registry for debugging and tooling
                     */
                    requirejs._defined = defined;
                    define = function (name, deps, callback) {
                        if (typeof name !== 'string') {
                            throw new Error('See almond README: incorrect module build, no module name');
                        }
                        //This module may not have dependencies
                        if (!deps.splice) {
                            //deps is not an array, so probably means
                            //an object literal or factory function for
                            //the value. Adjust args.
                            callback = deps;
                            deps = [];
                        }
                        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
                            waiting[name] = [name, deps, callback];
                        }
                    };
                    define.amd = {
                        jQuery: true
                    };
                }());
                S2.requirejs = requirejs;
                S2.require = require;
                S2.define = define;
            }
        }());
        S2.define("almond", function () { });
        /* global jQuery:false, $:false */
        S2.define('jquery', [], function () {
            var _$ = jQuery || $;
            if (_$ == null && console && console.error) {
                console.error('Select2: An instance of jQuery or a jQuery-compatible library was not ' +
                    'found. Make sure that you are including jQuery before Select2 on your ' +
                    'web page.');
            }
            return _$;
        });
        S2.define('select2/utils', [
            'jquery'
        ], function ($) {
            var Utils = {};
            Utils.Extend = function (ChildClass, SuperClass) {
                var __hasProp = {}.hasOwnProperty;
                function BaseConstructor() {
                    this.constructor = ChildClass;
                }
                for (var key in SuperClass) {
                    if (__hasProp.call(SuperClass, key)) {
                        ChildClass[key] = SuperClass[key];
                    }
                }
                BaseConstructor.prototype = SuperClass.prototype;
                ChildClass.prototype = new BaseConstructor();
                ChildClass.__super__ = SuperClass.prototype;
                return ChildClass;
            };
            function getMethods(theClass) {
                var proto = theClass.prototype;
                var methods = [];
                for (var methodName in proto) {
                    var m = proto[methodName];
                    if (typeof m !== 'function') {
                        continue;
                    }
                    if (methodName === 'constructor') {
                        continue;
                    }
                    methods.push(methodName);
                }
                return methods;
            }
            Utils.Decorate = function (SuperClass, DecoratorClass) {
                var decoratedMethods = getMethods(DecoratorClass);
                var superMethods = getMethods(SuperClass);
                function DecoratedClass() {
                    var unshift = Array.prototype.unshift;
                    var argCount = DecoratorClass.prototype.constructor.length;
                    var calledConstructor = SuperClass.prototype.constructor;
                    if (argCount > 0) {
                        unshift.call(arguments, SuperClass.prototype.constructor);
                        calledConstructor = DecoratorClass.prototype.constructor;
                    }
                    calledConstructor.apply(this, arguments);
                }
                DecoratorClass.displayName = SuperClass.displayName;
                function ctr() {
                    this.constructor = DecoratedClass;
                }
                DecoratedClass.prototype = new ctr();
                for (var m = 0; m < superMethods.length; m++) {
                    var superMethod = superMethods[m];
                    DecoratedClass.prototype[superMethod] =
                        SuperClass.prototype[superMethod];
                }
                var calledMethod = function (methodName) {
                    // Stub out the original method if it's not decorating an actual method
                    var originalMethod = function () { };
                    if (methodName in DecoratedClass.prototype) {
                        originalMethod = DecoratedClass.prototype[methodName];
                    }
                    var decoratedMethod = DecoratorClass.prototype[methodName];
                    return function () {
                        var unshift = Array.prototype.unshift;
                        unshift.call(arguments, originalMethod);
                        return decoratedMethod.apply(this, arguments);
                    };
                };
                for (var d = 0; d < decoratedMethods.length; d++) {
                    var decoratedMethod = decoratedMethods[d];
                    DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
                }
                return DecoratedClass;
            };
            var Observable = function () {
                this.listeners = {};
            };
            Observable.prototype.on = function (event, callback) {
                this.listeners = this.listeners || {};
                if (event in this.listeners) {
                    this.listeners[event].push(callback);
                }
                else {
                    this.listeners[event] = [callback];
                }
            };
            Observable.prototype.trigger = function (event) {
                var slice = Array.prototype.slice;
                var params = slice.call(arguments, 1);
                this.listeners = this.listeners || {};
                // Params should always come in as an array
                if (params == null) {
                    params = [];
                }
                // If there are no arguments to the event, use a temporary object
                if (params.length === 0) {
                    params.push({});
                }
                // Set the `_type` of the first object to the event
                params[0]._type = event;
                if (event in this.listeners) {
                    this.invoke(this.listeners[event], slice.call(arguments, 1));
                }
                if ('*' in this.listeners) {
                    this.invoke(this.listeners['*'], arguments);
                }
            };
            Observable.prototype.invoke = function (listeners, params) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].apply(this, params);
                }
            };
            Utils.Observable = Observable;
            Utils.generateChars = function (length) {
                var chars = '';
                for (var i = 0; i < length; i++) {
                    var randomChar = Math.floor(Math.random() * 36);
                    chars += randomChar.toString(36);
                }
                return chars;
            };
            Utils.bind = function (func, context) {
                return function () {
                    func.apply(context, arguments);
                };
            };
            Utils._convertData = function (data) {
                for (var originalKey in data) {
                    var keys = originalKey.split('-');
                    var dataLevel = data;
                    if (keys.length === 1) {
                        continue;
                    }
                    for (var k = 0; k < keys.length; k++) {
                        var key = keys[k];
                        // Lowercase the first letter
                        // By default, dash-separated becomes camelCase
                        key = key.substring(0, 1).toLowerCase() + key.substring(1);
                        if (!(key in dataLevel)) {
                            dataLevel[key] = {};
                        }
                        if (k == keys.length - 1) {
                            dataLevel[key] = data[originalKey];
                        }
                        dataLevel = dataLevel[key];
                    }
                    delete data[originalKey];
                }
                return data;
            };
            Utils.hasScroll = function (index, el) {
                // Adapted from the function created by @ShadowScripter
                // and adapted by @BillBarry on the Stack Exchange Code Review website.
                // The original code can be found at
                // http://codereview.stackexchange.com/q/13338
                // and was designed to be used with the Sizzle selector engine.
                var $el = $(el);
                var overflowX = el.style.overflowX;
                var overflowY = el.style.overflowY;
                //Check both x and y declarations
                if (overflowX === overflowY &&
                    (overflowY === 'hidden' || overflowY === 'visible')) {
                    return false;
                }
                if (overflowX === 'scroll' || overflowY === 'scroll') {
                    return true;
                }
                return ($el.innerHeight() < el.scrollHeight ||
                    $el.innerWidth() < el.scrollWidth);
            };
            Utils.escapeMarkup = function (markup) {
                var replaceMap = {
                    '\\': '&#92;',
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    '\'': '&#39;',
                    '/': '&#47;'
                };
                // Do not try to escape the markup if it's not a string
                if (typeof markup !== 'string') {
                    return markup;
                }
                return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
                    return replaceMap[match];
                });
            };
            // Append an array of jQuery nodes to a given element.
            Utils.appendMany = function ($element, $nodes) {
                // jQuery 1.7.x does not support $.fn.append() with an array
                // Fall back to a jQuery object collection using $.fn.add()
                if ($.fn.jquery.substr(0, 3) === '1.7') {
                    var $jqNodes = $();
                    $.map($nodes, function (node) {
                        $jqNodes = $jqNodes.add(node);
                    });
                    $nodes = $jqNodes;
                }
                $element.append($nodes);
            };
            // Cache objects in Utils.__cache instead of $.data (see #4346)
            Utils.__cache = {};
            var id = 0;
            Utils.GetUniqueElementId = function (element) {
                // Get a unique element Id. If element has no id,
                // creates a new unique number, stores it in the id
                // attribute and returns the new id.
                // If an id already exists, it simply returns it.
                var select2Id = element.getAttribute('data-select2-id');
                if (select2Id == null) {
                    // If element has id, use it.
                    if (element.id) {
                        select2Id = element.id;
                        element.setAttribute('data-select2-id', select2Id);
                    }
                    else {
                        element.setAttribute('data-select2-id', ++id);
                        select2Id = id.toString();
                    }
                }
                return select2Id;
            };
            Utils.StoreData = function (element, name, value) {
                // Stores an item in the cache for a specified element.
                // name is the cache key.
                var id = Utils.GetUniqueElementId(element);
                if (!Utils.__cache[id]) {
                    Utils.__cache[id] = {};
                }
                Utils.__cache[id][name] = value;
            };
            Utils.GetData = function (element, name) {
                // Retrieves a value from the cache by its key (name)
                // name is optional. If no name specified, return
                // all cache items for the specified element.
                // and for a specified element.
                var id = Utils.GetUniqueElementId(element);
                if (name) {
                    if (Utils.__cache[id]) {
                        if (Utils.__cache[id][name] != null) {
                            return Utils.__cache[id][name];
                        }
                        return $(element).data(name); // Fallback to HTML5 data attribs.
                    }
                    return $(element).data(name); // Fallback to HTML5 data attribs.
                }
                else {
                    return Utils.__cache[id];
                }
            };
            Utils.RemoveData = function (element) {
                // Removes all cached items for a specified element.
                var id = Utils.GetUniqueElementId(element);
                if (Utils.__cache[id] != null) {
                    delete Utils.__cache[id];
                }
            };
            return Utils;
        });
        S2.define('select2/results', [
            'jquery',
            './utils'
        ], function ($, Utils) {
            function Results($element, options, dataAdapter) {
                this.$element = $element;
                this.data = dataAdapter;
                this.options = options;
                Results.__super__.constructor.call(this);
            }
            Utils.Extend(Results, Utils.Observable);
            Results.prototype.render = function () {
                var $results = $('<ul class="select2-results__options" role="tree"></ul>');
                if (this.options.get('multiple')) {
                    $results.attr('aria-multiselectable', 'true');
                }
                this.$results = $results;
                return $results;
            };
            Results.prototype.clear = function () {
                this.$results.empty();
            };
            Results.prototype.displayMessage = function (params) {
                var escapeMarkup = this.options.get('escapeMarkup');
                this.clear();
                this.hideLoading();
                var $message = $('<li role="treeitem" aria-live="assertive"' +
                    ' class="select2-results__option"></li>');
                var message = this.options.get('translations').get(params.message);
                $message.append(escapeMarkup(message(params.args)));
                $message[0].className += ' select2-results__message';
                this.$results.append($message);
            };
            Results.prototype.hideMessages = function () {
                this.$results.find('.select2-results__message').remove();
            };
            Results.prototype.append = function (data) {
                this.hideLoading();
                var $options = [];
                if (data.results == null || data.results.length === 0) {
                    if (this.$results.children().length === 0) {
                        this.trigger('results:message', {
                            message: 'noResults'
                        });
                    }
                    return;
                }
                data.results = this.sort(data.results);
                for (var d = 0; d < data.results.length; d++) {
                    var item = data.results[d];
                    var $option = this.option(item);
                    $options.push($option);
                }
                this.$results.append($options);
            };
            Results.prototype.position = function ($results, $dropdown) {
                var $resultsContainer = $dropdown.find('.select2-results');
                $resultsContainer.append($results);
            };
            Results.prototype.sort = function (data) {
                var sorter = this.options.get('sorter');
                return sorter(data);
            };
            Results.prototype.highlightFirstItem = function () {
                var $options = this.$results
                    .find('.select2-results__option[aria-selected]');
                var $selected = $options.filter('[aria-selected=true]');
                // Check if there are any selected options
                if ($selected.length > 0) {
                    // If there are selected options, highlight the first
                    $selected.first().trigger('mouseenter');
                }
                else {
                    // If there are no selected options, highlight the first option
                    // in the dropdown
                    $options.first().trigger('mouseenter');
                }
                this.ensureHighlightVisible();
            };
            Results.prototype.setClasses = function () {
                var self = this;
                this.data.current(function (selected) {
                    var selectedIds = $.map(selected, function (s) {
                        return s.id.toString();
                    });
                    var $options = self.$results
                        .find('.select2-results__option[aria-selected]');
                    $options.each(function () {
                        var $option = $(this);
                        var item = Utils.GetData(this, 'data');
                        // id needs to be converted to a string when comparing
                        var id = '' + item.id;
                        if ((item.element != null && item.element.selected) ||
                            (item.element == null && $.inArray(id, selectedIds) > -1)) {
                            $option.attr('aria-selected', 'true');
                        }
                        else {
                            $option.attr('aria-selected', 'false');
                        }
                    });
                });
            };
            Results.prototype.showLoading = function (params) {
                this.hideLoading();
                var loadingMore = this.options.get('translations').get('searching');
                var loading = {
                    disabled: true,
                    loading: true,
                    text: loadingMore(params)
                };
                var $loading = this.option(loading);
                $loading.className += ' loading-results';
                this.$results.prepend($loading);
            };
            Results.prototype.hideLoading = function () {
                this.$results.find('.loading-results').remove();
            };
            Results.prototype.option = function (data) {
                var option = document.createElement('li');
                option.className = 'select2-results__option';
                var attrs = {
                    'role': 'treeitem',
                    'aria-selected': 'false'
                };
                if (data.disabled) {
                    delete attrs['aria-selected'];
                    attrs['aria-disabled'] = 'true';
                }
                if (data.id == null) {
                    delete attrs['aria-selected'];
                }
                if (data._resultId != null) {
                    option.id = data._resultId;
                }
                if (data.title) {
                    option.title = data.title;
                }
                if (data.children) {
                    attrs.role = 'group';
                    attrs['aria-label'] = data.text;
                    delete attrs['aria-selected'];
                }
                for (var attr in attrs) {
                    var val = attrs[attr];
                    option.setAttribute(attr, val);
                }
                if (data.children) {
                    var $option = $(option);
                    var label = document.createElement('strong');
                    label.className = 'select2-results__group';
                    var $label = $(label);
                    this.template(data, label);
                    var $children = [];
                    for (var c = 0; c < data.children.length; c++) {
                        var child = data.children[c];
                        var $child = this.option(child);
                        $children.push($child);
                    }
                    var $childrenContainer = $('<ul></ul>', {
                        'class': 'select2-results__options select2-results__options--nested'
                    });
                    $childrenContainer.append($children);
                    $option.append(label);
                    $option.append($childrenContainer);
                }
                else {
                    this.template(data, option);
                }
                Utils.StoreData(option, 'data', data);
                return option;
            };
            Results.prototype.bind = function (container, $container) {
                var self = this;
                var id = container.id + '-results';
                this.$results.attr('id', id);
                container.on('results:all', function (params) {
                    self.clear();
                    self.append(params.data);
                    if (container.isOpen()) {
                        self.setClasses();
                        self.highlightFirstItem();
                    }
                });
                container.on('results:append', function (params) {
                    self.append(params.data);
                    if (container.isOpen()) {
                        self.setClasses();
                    }
                });
                container.on('query', function (params) {
                    self.hideMessages();
                    self.showLoading(params);
                });
                container.on('select', function () {
                    if (!container.isOpen()) {
                        return;
                    }
                    self.setClasses();
                    if (self.options.get('scrollAfterSelect')) {
                        self.highlightFirstItem();
                    }
                });
                container.on('unselect', function () {
                    if (!container.isOpen()) {
                        return;
                    }
                    self.setClasses();
                    if (self.options.get('scrollAfterSelect')) {
                        self.highlightFirstItem();
                    }
                });
                container.on('open', function () {
                    // When the dropdown is open, aria-expended="true"
                    self.$results.attr('aria-expanded', 'true');
                    self.$results.attr('aria-hidden', 'false');
                    self.setClasses();
                    self.ensureHighlightVisible();
                });
                container.on('close', function () {
                    // When the dropdown is closed, aria-expended="false"
                    self.$results.attr('aria-expanded', 'false');
                    self.$results.attr('aria-hidden', 'true');
                    self.$results.removeAttr('aria-activedescendant');
                });
                container.on('results:toggle', function () {
                    var $highlighted = self.getHighlightedResults();
                    if ($highlighted.length === 0) {
                        return;
                    }
                    $highlighted.trigger('mouseup');
                });
                container.on('results:select', function () {
                    var $highlighted = self.getHighlightedResults();
                    if ($highlighted.length === 0) {
                        return;
                    }
                    var data = Utils.GetData($highlighted[0], 'data');
                    if ($highlighted.attr('aria-selected') == 'true') {
                        self.trigger('close', {});
                    }
                    else {
                        self.trigger('select', {
                            data: data
                        });
                    }
                });
                container.on('results:previous', function () {
                    var $highlighted = self.getHighlightedResults();
                    var $options = self.$results.find('[aria-selected]');
                    var currentIndex = $options.index($highlighted);
                    // If we are already at the top, don't move further
                    // If no options, currentIndex will be -1
                    if (currentIndex <= 0) {
                        return;
                    }
                    var nextIndex = currentIndex - 1;
                    // If none are highlighted, highlight the first
                    if ($highlighted.length === 0) {
                        nextIndex = 0;
                    }
                    var $next = $options.eq(nextIndex);
                    $next.trigger('mouseenter');
                    var currentOffset = self.$results.offset().top;
                    var nextTop = $next.offset().top;
                    var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);
                    if (nextIndex === 0) {
                        self.$results.scrollTop(0);
                    }
                    else if (nextTop - currentOffset < 0) {
                        self.$results.scrollTop(nextOffset);
                    }
                });
                container.on('results:next', function () {
                    var $highlighted = self.getHighlightedResults();
                    var $options = self.$results.find('[aria-selected]');
                    var currentIndex = $options.index($highlighted);
                    var nextIndex = currentIndex + 1;
                    // If we are at the last option, stay there
                    if (nextIndex >= $options.length) {
                        return;
                    }
                    var $next = $options.eq(nextIndex);
                    $next.trigger('mouseenter');
                    var currentOffset = self.$results.offset().top +
                        self.$results.outerHeight(false);
                    var nextBottom = $next.offset().top + $next.outerHeight(false);
                    var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;
                    if (nextIndex === 0) {
                        self.$results.scrollTop(0);
                    }
                    else if (nextBottom > currentOffset) {
                        self.$results.scrollTop(nextOffset);
                    }
                });
                container.on('results:focus', function (params) {
                    params.element.addClass('select2-results__option--highlighted');
                });
                container.on('results:message', function (params) {
                    self.displayMessage(params);
                });
                if ($.fn.mousewheel) {
                    this.$results.on('mousewheel', function (e) {
                        var top = self.$results.scrollTop();
                        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;
                        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
                        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();
                        if (isAtTop) {
                            self.$results.scrollTop(0);
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        else if (isAtBottom) {
                            self.$results.scrollTop(self.$results.get(0).scrollHeight - self.$results.height());
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }
                this.$results.on('mouseup', '.select2-results__option[aria-selected]', function (evt) {
                    var $this = $(this);
                    var data = Utils.GetData(this, 'data');
                    if ($this.attr('aria-selected') === 'true') {
                        if (self.options.get('multiple')) {
                            self.trigger('unselect', {
                                originalEvent: evt,
                                data: data
                            });
                        }
                        else {
                            self.trigger('close', {});
                        }
                        return;
                    }
                    self.trigger('select', {
                        originalEvent: evt,
                        data: data
                    });
                });
                this.$results.on('mouseenter', '.select2-results__option[aria-selected]', function (evt) {
                    var data = Utils.GetData(this, 'data');
                    self.getHighlightedResults()
                        .removeClass('select2-results__option--highlighted');
                    self.trigger('results:focus', {
                        data: data,
                        element: $(this)
                    });
                });
            };
            Results.prototype.getHighlightedResults = function () {
                var $highlighted = this.$results
                    .find('.select2-results__option--highlighted');
                return $highlighted;
            };
            Results.prototype.destroy = function () {
                this.$results.remove();
            };
            Results.prototype.ensureHighlightVisible = function () {
                var $highlighted = this.getHighlightedResults();
                if ($highlighted.length === 0) {
                    return;
                }
                var $options = this.$results.find('[aria-selected]');
                var currentIndex = $options.index($highlighted);
                var currentOffset = this.$results.offset().top;
                var nextTop = $highlighted.offset().top;
                var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);
                var offsetDelta = nextTop - currentOffset;
                nextOffset -= $highlighted.outerHeight(false) * 2;
                if (currentIndex <= 2) {
                    this.$results.scrollTop(0);
                }
                else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
                    this.$results.scrollTop(nextOffset);
                }
            };
            Results.prototype.template = function (result, container) {
                var template = this.options.get('templateResult');
                var escapeMarkup = this.options.get('escapeMarkup');
                var content = template(result, container);
                if (content == null) {
                    container.style.display = 'none';
                }
                else if (typeof content === 'string') {
                    container.innerHTML = escapeMarkup(content);
                }
                else {
                    $(container).append(content);
                }
            };
            return Results;
        });
        S2.define('select2/keys', [], function () {
            var KEYS = {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                ESC: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                DELETE: 46
            };
            return KEYS;
        });
        S2.define('select2/selection/base', [
            'jquery',
            '../utils',
            '../keys'
        ], function ($, Utils, KEYS) {
            function BaseSelection($element, options) {
                this.$element = $element;
                this.options = options;
                BaseSelection.__super__.constructor.call(this);
            }
            Utils.Extend(BaseSelection, Utils.Observable);
            BaseSelection.prototype.render = function () {
                var $selection = $('<span class="select2-selection" role="combobox" ' +
                    ' aria-haspopup="true" aria-expanded="false">' +
                    '</span>');
                this._tabindex = 0;
                if (Utils.GetData(this.$element[0], 'old-tabindex') != null) {
                    this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
                }
                else if (this.$element.attr('tabindex') != null) {
                    this._tabindex = this.$element.attr('tabindex');
                }
                $selection.attr('title', this.$element.attr('title'));
                $selection.attr('tabindex', this._tabindex);
                this.$selection = $selection;
                return $selection;
            };
            BaseSelection.prototype.bind = function (container, $container) {
                var self = this;
                var id = container.id + '-container';
                var resultsId = container.id + '-results';
                this.container = container;
                this.$selection.on('focus', function (evt) {
                    self.trigger('focus', evt);
                });
                this.$selection.on('blur', function (evt) {
                    self._handleBlur(evt);
                });
                this.$selection.on('keydown', function (evt) {
                    self.trigger('keypress', evt);
                    if (evt.which === KEYS.SPACE) {
                        evt.preventDefault();
                    }
                });
                container.on('results:focus', function (params) {
                    self.$selection.attr('aria-activedescendant', params.data._resultId);
                });
                container.on('selection:update', function (params) {
                    self.update(params.data);
                });
                container.on('open', function () {
                    // When the dropdown is open, aria-expanded="true"
                    self.$selection.attr('aria-expanded', 'true');
                    self.$selection.attr('aria-owns', resultsId);
                    self._attachCloseHandler(container);
                });
                container.on('close', function () {
                    // When the dropdown is closed, aria-expanded="false"
                    self.$selection.attr('aria-expanded', 'false');
                    self.$selection.removeAttr('aria-activedescendant');
                    self.$selection.removeAttr('aria-owns');
                    window.setTimeout(function () {
                        self.$selection.focus();
                    }, 0);
                    self._detachCloseHandler(container);
                });
                container.on('enable', function () {
                    self.$selection.attr('tabindex', self._tabindex);
                });
                container.on('disable', function () {
                    self.$selection.attr('tabindex', '-1');
                });
            };
            BaseSelection.prototype._handleBlur = function (evt) {
                var self = this;
                // This needs to be delayed as the active element is the body when the tab
                // key is pressed, possibly along with others.
                window.setTimeout(function () {
                    // Don't trigger `blur` if the focus is still in the selection
                    if ((document.activeElement == self.$selection[0]) ||
                        ($.contains(self.$selection[0], document.activeElement))) {
                        return;
                    }
                    self.trigger('blur', evt);
                }, 1);
            };
            BaseSelection.prototype._attachCloseHandler = function (container) {
                var self = this;
                $(document.body).on('mousedown.select2.' + container.id, function (e) {
                    var $target = $(e.target);
                    var $select = $target.closest('.select2');
                    var $all = $('.select2.select2-container--open');
                    $all.each(function () {
                        var $this = $(this);
                        if (this == $select[0]) {
                            return;
                        }
                        var $element = Utils.GetData(this, 'element');
                        $element.select2('close');
                    });
                });
            };
            BaseSelection.prototype._detachCloseHandler = function (container) {
                $(document.body).off('mousedown.select2.' + container.id);
            };
            BaseSelection.prototype.position = function ($selection, $container) {
                var $selectionContainer = $container.find('.selection');
                $selectionContainer.append($selection);
            };
            BaseSelection.prototype.destroy = function () {
                this._detachCloseHandler(this.container);
            };
            BaseSelection.prototype.update = function (data) {
                throw new Error('The `update` method must be defined in child classes.');
            };
            return BaseSelection;
        });
        S2.define('select2/selection/single', [
            'jquery',
            './base',
            '../utils',
            '../keys'
        ], function ($, BaseSelection, Utils, KEYS) {
            function SingleSelection() {
                SingleSelection.__super__.constructor.apply(this, arguments);
            }
            Utils.Extend(SingleSelection, BaseSelection);
            SingleSelection.prototype.render = function () {
                var $selection = SingleSelection.__super__.render.call(this);
                $selection.addClass('select2-selection--single');
                $selection.html('<span class="select2-selection__rendered"></span>' +
                    '<span class="select2-selection__arrow" role="presentation">' +
                    '<b role="presentation"></b>' +
                    '</span>');
                return $selection;
            };
            SingleSelection.prototype.bind = function (container, $container) {
                var self = this;
                SingleSelection.__super__.bind.apply(this, arguments);
                var id = container.id + '-container';
                this.$selection.find('.select2-selection__rendered')
                    .attr('id', id)
                    .attr('role', 'textbox')
                    .attr('aria-readonly', 'true');
                this.$selection.attr('aria-labelledby', id);
                this.$selection.on('mousedown', function (evt) {
                    // Only respond to left clicks
                    if (evt.which !== 1) {
                        return;
                    }
                    self.trigger('toggle', {
                        originalEvent: evt
                    });
                });
                this.$selection.on('focus', function (evt) {
                    // User focuses on the container
                });
                this.$selection.on('blur', function (evt) {
                    // User exits the container
                });
                container.on('focus', function (evt) {
                    if (!container.isOpen()) {
                        self.$selection.focus();
                    }
                });
            };
            SingleSelection.prototype.clear = function () {
                var $rendered = this.$selection.find('.select2-selection__rendered');
                $rendered.empty();
                $rendered.removeAttr('title'); // clear tooltip on empty
            };
            SingleSelection.prototype.display = function (data, container) {
                var template = this.options.get('templateSelection');
                var escapeMarkup = this.options.get('escapeMarkup');
                return escapeMarkup(template(data, container));
            };
            SingleSelection.prototype.selectionContainer = function () {
                return $('<span></span>');
            };
            SingleSelection.prototype.update = function (data) {
                if (data.length === 0) {
                    this.clear();
                    return;
                }
                var selection = data[0];
                var $rendered = this.$selection.find('.select2-selection__rendered');
                var formatted = this.display(selection, $rendered);
                $rendered.empty().append(formatted);
                $rendered.attr('title', selection.title || selection.text);
            };
            return SingleSelection;
        });
        S2.define('select2/selection/multiple', [
            'jquery',
            './base',
            '../utils'
        ], function ($, BaseSelection, Utils) {
            function MultipleSelection($element, options) {
                MultipleSelection.__super__.constructor.apply(this, arguments);
            }
            Utils.Extend(MultipleSelection, BaseSelection);
            MultipleSelection.prototype.render = function () {
                var $selection = MultipleSelection.__super__.render.call(this);
                $selection.addClass('select2-selection--multiple');
                $selection.html('<ul class="select2-selection__rendered"></ul>');
                return $selection;
            };
            MultipleSelection.prototype.bind = function (container, $container) {
                var self = this;
                MultipleSelection.__super__.bind.apply(this, arguments);
                this.$selection.on('click', function (evt) {
                    self.trigger('toggle', {
                        originalEvent: evt
                    });
                });
                this.$selection.on('click', '.select2-selection__choice__remove', function (evt) {
                    // Ignore the event if it is disabled
                    if (self.options.get('disabled')) {
                        return;
                    }
                    var $remove = $(this);
                    var $selection = $remove.parent();
                    var data = Utils.GetData($selection[0], 'data');
                    self.trigger('unselect', {
                        originalEvent: evt,
                        data: data
                    });
                });
            };
            MultipleSelection.prototype.clear = function () {
                var $rendered = this.$selection.find('.select2-selection__rendered');
                $rendered.empty();
                $rendered.removeAttr('title');
            };
            MultipleSelection.prototype.display = function (data, container) {
                var template = this.options.get('templateSelection');
                var escapeMarkup = this.options.get('escapeMarkup');
                return escapeMarkup(template(data, container));
            };
            MultipleSelection.prototype.selectionContainer = function () {
                var $container = $('<li class="select2-selection__choice">' +
                    '<span class="select2-selection__choice__remove" role="presentation">' +
                    '&times;' +
                    '</span>' +
                    '</li>');
                return $container;
            };
            MultipleSelection.prototype.update = function (data) {
                this.clear();
                if (data.length === 0) {
                    return;
                }
                var $selections = [];
                for (var d = 0; d < data.length; d++) {
                    var selection = data[d];
                    var $selection = this.selectionContainer();
                    var formatted = this.display(selection, $selection);
                    $selection.append(formatted);
                    $selection.attr('title', selection.title || selection.text);
                    Utils.StoreData($selection[0], 'data', selection);
                    $selections.push($selection);
                }
                var $rendered = this.$selection.find('.select2-selection__rendered');
                Utils.appendMany($rendered, $selections);
            };
            return MultipleSelection;
        });
        S2.define('select2/selection/placeholder', [
            '../utils'
        ], function (Utils) {
            function Placeholder(decorated, $element, options) {
                this.placeholder = this.normalizePlaceholder(options.get('placeholder'));
                decorated.call(this, $element, options);
            }
            Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
                if (typeof placeholder === 'string') {
                    placeholder = {
                        id: '',
                        text: placeholder
                    };
                }
                return placeholder;
            };
            Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
                var $placeholder = this.selectionContainer();
                $placeholder.html(this.display(placeholder));
                $placeholder.addClass('select2-selection__placeholder')
                    .removeClass('select2-selection__choice');
                return $placeholder;
            };
            Placeholder.prototype.update = function (decorated, data) {
                var singlePlaceholder = (data.length == 1 && data[0].id != this.placeholder.id);
                var multipleSelections = data.length > 1;
                if (multipleSelections || singlePlaceholder) {
                    return decorated.call(this, data);
                }
                this.clear();
                var $placeholder = this.createPlaceholder(this.placeholder);
                this.$selection.find('.select2-selection__rendered').append($placeholder);
            };
            return Placeholder;
        });
        S2.define('select2/selection/allowClear', [
            'jquery',
            '../keys',
            '../utils'
        ], function ($, KEYS, Utils) {
            function AllowClear() { }
            AllowClear.prototype.bind = function (decorated, container, $container) {
                var self = this;
                decorated.call(this, container, $container);
                if (this.placeholder == null) {
                    if (this.options.get('debug') && window.console && console.error) {
                        console.error('Select2: The `allowClear` option should be used in combination ' +
                            'with the `placeholder` option.');
                    }
                }
                this.$selection.on('mousedown', '.select2-selection__clear', function (evt) {
                    self._handleClear(evt);
                });
                container.on('keypress', function (evt) {
                    self._handleKeyboardClear(evt, container);
                });
            };
            AllowClear.prototype._handleClear = function (_, evt) {
                // Ignore the event if it is disabled
                if (this.options.get('disabled')) {
                    return;
                }
                var $clear = this.$selection.find('.select2-selection__clear');
                // Ignore the event if nothing has been selected
                if ($clear.length === 0) {
                    return;
                }
                evt.stopPropagation();
                var data = Utils.GetData($clear[0], 'data');
                var previousVal = this.$element.val();
                this.$element.val(this.placeholder.id);
                var unselectData = {
                    data: data
                };
                this.trigger('clear', unselectData);
                if (unselectData.prevented) {
                    this.$element.val(previousVal);
                    return;
                }
                for (var d = 0; d < data.length; d++) {
                    unselectData = {
                        data: data[d]
                    };
                    // Trigger the `unselect` event, so people can prevent it from being
                    // cleared.
                    this.trigger('unselect', unselectData);
                    // If the event was prevented, don't clear it out.
                    if (unselectData.prevented) {
                        this.$element.val(previousVal);
                        return;
                    }
                }
                this.$element.trigger('change');
                this.trigger('toggle', {});
            };
            AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
                if (container.isOpen()) {
                    return;
                }
                if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
                    this._handleClear(evt);
                }
            };
            AllowClear.prototype.update = function (decorated, data) {
                decorated.call(this, data);
                if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
                    data.length === 0) {
                    return;
                }
                var removeAll = this.options.get('translations').get('removeAllItems');
                var $remove = $('<span class="select2-selection__clear" title="' + removeAll() + '">' +
                    '&times;' +
                    '</span>');
                Utils.StoreData($remove[0], 'data', data);
                this.$selection.find('.select2-selection__rendered').prepend($remove);
            };
            return AllowClear;
        });
        S2.define('select2/selection/search', [
            'jquery',
            '../utils',
            '../keys'
        ], function ($, Utils, KEYS) {
            function Search(decorated, $element, options) {
                decorated.call(this, $element, options);
            }
            Search.prototype.render = function (decorated) {
                var $search = $('<li class="select2-search select2-search--inline">' +
                    '<input class="select2-search__field" type="search" tabindex="-1"' +
                    ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
                    ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
                    '</li>');
                this.$searchContainer = $search;
                this.$search = $search.find('input');
                var $rendered = decorated.call(this);
                this._transferTabIndex();
                return $rendered;
            };
            Search.prototype.bind = function (decorated, container, $container) {
                var self = this;
                decorated.call(this, container, $container);
                container.on('open', function () {
                    self.$search.trigger('focus');
                });
                container.on('close', function () {
                    self.$search.val('');
                    self.$search.removeAttr('aria-activedescendant');
                    self.$search.trigger('focus');
                });
                container.on('enable', function () {
                    self.$search.prop('disabled', false);
                    self._transferTabIndex();
                });
                container.on('disable', function () {
                    self.$search.prop('disabled', true);
                });
                container.on('focus', function (evt) {
                    self.$search.trigger('focus');
                });
                container.on('results:focus', function (params) {
                    self.$search.attr('aria-activedescendant', params.id);
                });
                this.$selection.on('focusin', '.select2-search--inline', function (evt) {
                    self.trigger('focus', evt);
                });
                this.$selection.on('focusout', '.select2-search--inline', function (evt) {
                    self._handleBlur(evt);
                });
                this.$selection.on('keydown', '.select2-search--inline', function (evt) {
                    evt.stopPropagation();
                    self.trigger('keypress', evt);
                    self._keyUpPrevented = evt.isDefaultPrevented();
                    var key = evt.which;
                    if (key === KEYS.BACKSPACE && self.$search.val() === '') {
                        var $previousChoice = self.$searchContainer
                            .prev('.select2-selection__choice');
                        if ($previousChoice.length > 0) {
                            var item = Utils.GetData($previousChoice[0], 'data');
                            self.searchRemoveChoice(item);
                            evt.preventDefault();
                        }
                    }
                });
                // Try to detect the IE version should the `documentMode` property that
                // is stored on the document. This is only implemented in IE and is
                // slightly cleaner than doing a user agent check.
                // This property is not available in Edge, but Edge also doesn't have
                // this bug.
                var msie = document.documentMode;
                var disableInputEvents = msie && msie <= 11;
                // Workaround for browsers which do not support the `input` event
                // This will prevent double-triggering of events for browsers which support
                // both the `keyup` and `input` events.
                this.$selection.on('input.searchcheck', '.select2-search--inline', function (evt) {
                    // IE will trigger the `input` event when a placeholder is used on a
                    // search box. To get around this issue, we are forced to ignore all
                    // `input` events in IE and keep using `keyup`.
                    if (disableInputEvents) {
                        self.$selection.off('input.search input.searchcheck');
                        return;
                    }
                    // Unbind the duplicated `keyup` event
                    self.$selection.off('keyup.search');
                });
                this.$selection.on('keyup.search input.search', '.select2-search--inline', function (evt) {
                    // IE will trigger the `input` event when a placeholder is used on a
                    // search box. To get around this issue, we are forced to ignore all
                    // `input` events in IE and keep using `keyup`.
                    if (disableInputEvents && evt.type === 'input') {
                        self.$selection.off('input.search input.searchcheck');
                        return;
                    }
                    var key = evt.which;
                    // We can freely ignore events from modifier keys
                    if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
                        return;
                    }
                    // Tabbing will be handled during the `keydown` phase
                    if (key == KEYS.TAB) {
                        return;
                    }
                    self.handleSearch(evt);
                });
            };
            /**
             * This method will transfer the tabindex attribute from the rendered
             * selection to the search box. This allows for the search box to be used as
             * the primary focus instead of the selection container.
             *
             * @private
             */
            Search.prototype._transferTabIndex = function (decorated) {
                this.$search.attr('tabindex', this.$selection.attr('tabindex'));
                this.$selection.attr('tabindex', '-1');
            };
            Search.prototype.createPlaceholder = function (decorated, placeholder) {
                this.$search.attr('placeholder', placeholder.text);
            };
            Search.prototype.update = function (decorated, data) {
                var searchHadFocus = this.$search[0] == document.activeElement;
                this.$search.attr('placeholder', '');
                decorated.call(this, data);
                this.$selection.find('.select2-selection__rendered')
                    .append(this.$searchContainer);
                this.resizeSearch();
                if (searchHadFocus) {
                    var isTagInput = this.$element.find('[data-select2-tag]').length;
                    if (isTagInput) {
                        // fix IE11 bug where tag input lost focus
                        this.$element.focus();
                    }
                    else {
                        this.$search.focus();
                    }
                }
            };
            Search.prototype.handleSearch = function () {
                this.resizeSearch();
                if (!this._keyUpPrevented) {
                    var input = this.$search.val();
                    this.trigger('query', {
                        term: input
                    });
                }
                this._keyUpPrevented = false;
            };
            Search.prototype.searchRemoveChoice = function (decorated, item) {
                this.trigger('unselect', {
                    data: item
                });
                this.$search.val(item.text);
                this.handleSearch();
            };
            Search.prototype.resizeSearch = function () {
                this.$search.css('width', '25px');
                var width = '';
                if (this.$search.attr('placeholder') !== '') {
                    width = this.$selection.find('.select2-selection__rendered').innerWidth();
                }
                else {
                    var minimumWidth = this.$search.val().length + 1;
                    width = (minimumWidth * 0.75) + 'em';
                }
                this.$search.css('width', width);
            };
            return Search;
        });
        S2.define('select2/selection/eventRelay', [
            'jquery'
        ], function ($) {
            function EventRelay() { }
            EventRelay.prototype.bind = function (decorated, container, $container) {
                var self = this;
                var relayEvents = [
                    'open', 'opening',
                    'close', 'closing',
                    'select', 'selecting',
                    'unselect', 'unselecting',
                    'clear', 'clearing'
                ];
                var preventableEvents = [
                    'opening', 'closing', 'selecting', 'unselecting', 'clearing'
                ];
                decorated.call(this, container, $container);
                container.on('*', function (name, params) {
                    // Ignore events that should not be relayed
                    if ($.inArray(name, relayEvents) === -1) {
                        return;
                    }
                    // The parameters should always be an object
                    params = params || {};
                    // Generate the jQuery event for the Select2 event
                    var evt = $.Event('select2:' + name, {
                        params: params
                    });
                    self.$element.trigger(evt);
                    // Only handle preventable events if it was one
                    if ($.inArray(name, preventableEvents) === -1) {
                        return;
                    }
                    params.prevented = evt.isDefaultPrevented();
                });
            };
            return EventRelay;
        });
        S2.define('select2/translation', [
            'jquery',
            'require'
        ], function ($, require) {
            function Translation(dict) {
                this.dict = dict || {};
            }
            Translation.prototype.all = function () {
                return this.dict;
            };
            Translation.prototype.get = function (key) {
                return this.dict[key];
            };
            Translation.prototype.extend = function (translation) {
                this.dict = $.extend({}, translation.all(), this.dict);
            };
            // Static functions
            Translation._cache = {};
            Translation.loadPath = function (path) {
                if (!(path in Translation._cache)) {
                    var translations = require(path);
                    Translation._cache[path] = translations;
                }
                return new Translation(Translation._cache[path]);
            };
            return Translation;
        });
        S2.define('select2/diacritics', [], function () {
            var diacritics = {
                '\u24B6': 'A',
                '\uFF21': 'A',
                '\u00C0': 'A',
                '\u00C1': 'A',
                '\u00C2': 'A',
                '\u1EA6': 'A',
                '\u1EA4': 'A',
                '\u1EAA': 'A',
                '\u1EA8': 'A',
                '\u00C3': 'A',
                '\u0100': 'A',
                '\u0102': 'A',
                '\u1EB0': 'A',
                '\u1EAE': 'A',
                '\u1EB4': 'A',
                '\u1EB2': 'A',
                '\u0226': 'A',
                '\u01E0': 'A',
                '\u00C4': 'A',
                '\u01DE': 'A',
                '\u1EA2': 'A',
                '\u00C5': 'A',
                '\u01FA': 'A',
                '\u01CD': 'A',
                '\u0200': 'A',
                '\u0202': 'A',
                '\u1EA0': 'A',
                '\u1EAC': 'A',
                '\u1EB6': 'A',
                '\u1E00': 'A',
                '\u0104': 'A',
                '\u023A': 'A',
                '\u2C6F': 'A',
                '\uA732': 'AA',
                '\u00C6': 'AE',
                '\u01FC': 'AE',
                '\u01E2': 'AE',
                '\uA734': 'AO',
                '\uA736': 'AU',
                '\uA738': 'AV',
                '\uA73A': 'AV',
                '\uA73C': 'AY',
                '\u24B7': 'B',
                '\uFF22': 'B',
                '\u1E02': 'B',
                '\u1E04': 'B',
                '\u1E06': 'B',
                '\u0243': 'B',
                '\u0182': 'B',
                '\u0181': 'B',
                '\u24B8': 'C',
                '\uFF23': 'C',
                '\u0106': 'C',
                '\u0108': 'C',
                '\u010A': 'C',
                '\u010C': 'C',
                '\u00C7': 'C',
                '\u1E08': 'C',
                '\u0187': 'C',
                '\u023B': 'C',
                '\uA73E': 'C',
                '\u24B9': 'D',
                '\uFF24': 'D',
                '\u1E0A': 'D',
                '\u010E': 'D',
                '\u1E0C': 'D',
                '\u1E10': 'D',
                '\u1E12': 'D',
                '\u1E0E': 'D',
                '\u0110': 'D',
                '\u018B': 'D',
                '\u018A': 'D',
                '\u0189': 'D',
                '\uA779': 'D',
                '\u01F1': 'DZ',
                '\u01C4': 'DZ',
                '\u01F2': 'Dz',
                '\u01C5': 'Dz',
                '\u24BA': 'E',
                '\uFF25': 'E',
                '\u00C8': 'E',
                '\u00C9': 'E',
                '\u00CA': 'E',
                '\u1EC0': 'E',
                '\u1EBE': 'E',
                '\u1EC4': 'E',
                '\u1EC2': 'E',
                '\u1EBC': 'E',
                '\u0112': 'E',
                '\u1E14': 'E',
                '\u1E16': 'E',
                '\u0114': 'E',
                '\u0116': 'E',
                '\u00CB': 'E',
                '\u1EBA': 'E',
                '\u011A': 'E',
                '\u0204': 'E',
                '\u0206': 'E',
                '\u1EB8': 'E',
                '\u1EC6': 'E',
                '\u0228': 'E',
                '\u1E1C': 'E',
                '\u0118': 'E',
                '\u1E18': 'E',
                '\u1E1A': 'E',
                '\u0190': 'E',
                '\u018E': 'E',
                '\u24BB': 'F',
                '\uFF26': 'F',
                '\u1E1E': 'F',
                '\u0191': 'F',
                '\uA77B': 'F',
                '\u24BC': 'G',
                '\uFF27': 'G',
                '\u01F4': 'G',
                '\u011C': 'G',
                '\u1E20': 'G',
                '\u011E': 'G',
                '\u0120': 'G',
                '\u01E6': 'G',
                '\u0122': 'G',
                '\u01E4': 'G',
                '\u0193': 'G',
                '\uA7A0': 'G',
                '\uA77D': 'G',
                '\uA77E': 'G',
                '\u24BD': 'H',
                '\uFF28': 'H',
                '\u0124': 'H',
                '\u1E22': 'H',
                '\u1E26': 'H',
                '\u021E': 'H',
                '\u1E24': 'H',
                '\u1E28': 'H',
                '\u1E2A': 'H',
                '\u0126': 'H',
                '\u2C67': 'H',
                '\u2C75': 'H',
                '\uA78D': 'H',
                '\u24BE': 'I',
                '\uFF29': 'I',
                '\u00CC': 'I',
                '\u00CD': 'I',
                '\u00CE': 'I',
                '\u0128': 'I',
                '\u012A': 'I',
                '\u012C': 'I',
                '\u0130': 'I',
                '\u00CF': 'I',
                '\u1E2E': 'I',
                '\u1EC8': 'I',
                '\u01CF': 'I',
                '\u0208': 'I',
                '\u020A': 'I',
                '\u1ECA': 'I',
                '\u012E': 'I',
                '\u1E2C': 'I',
                '\u0197': 'I',
                '\u24BF': 'J',
                '\uFF2A': 'J',
                '\u0134': 'J',
                '\u0248': 'J',
                '\u24C0': 'K',
                '\uFF2B': 'K',
                '\u1E30': 'K',
                '\u01E8': 'K',
                '\u1E32': 'K',
                '\u0136': 'K',
                '\u1E34': 'K',
                '\u0198': 'K',
                '\u2C69': 'K',
                '\uA740': 'K',
                '\uA742': 'K',
                '\uA744': 'K',
                '\uA7A2': 'K',
                '\u24C1': 'L',
                '\uFF2C': 'L',
                '\u013F': 'L',
                '\u0139': 'L',
                '\u013D': 'L',
                '\u1E36': 'L',
                '\u1E38': 'L',
                '\u013B': 'L',
                '\u1E3C': 'L',
                '\u1E3A': 'L',
                '\u0141': 'L',
                '\u023D': 'L',
                '\u2C62': 'L',
                '\u2C60': 'L',
                '\uA748': 'L',
                '\uA746': 'L',
                '\uA780': 'L',
                '\u01C7': 'LJ',
                '\u01C8': 'Lj',
                '\u24C2': 'M',
                '\uFF2D': 'M',
                '\u1E3E': 'M',
                '\u1E40': 'M',
                '\u1E42': 'M',
                '\u2C6E': 'M',
                '\u019C': 'M',
                '\u24C3': 'N',
                '\uFF2E': 'N',
                '\u01F8': 'N',
                '\u0143': 'N',
                '\u00D1': 'N',
                '\u1E44': 'N',
                '\u0147': 'N',
                '\u1E46': 'N',
                '\u0145': 'N',
                '\u1E4A': 'N',
                '\u1E48': 'N',
                '\u0220': 'N',
                '\u019D': 'N',
                '\uA790': 'N',
                '\uA7A4': 'N',
                '\u01CA': 'NJ',
                '\u01CB': 'Nj',
                '\u24C4': 'O',
                '\uFF2F': 'O',
                '\u00D2': 'O',
                '\u00D3': 'O',
                '\u00D4': 'O',
                '\u1ED2': 'O',
                '\u1ED0': 'O',
                '\u1ED6': 'O',
                '\u1ED4': 'O',
                '\u00D5': 'O',
                '\u1E4C': 'O',
                '\u022C': 'O',
                '\u1E4E': 'O',
                '\u014C': 'O',
                '\u1E50': 'O',
                '\u1E52': 'O',
                '\u014E': 'O',
                '\u022E': 'O',
                '\u0230': 'O',
                '\u00D6': 'O',
                '\u022A': 'O',
                '\u1ECE': 'O',
                '\u0150': 'O',
                '\u01D1': 'O',
                '\u020C': 'O',
                '\u020E': 'O',
                '\u01A0': 'O',
                '\u1EDC': 'O',
                '\u1EDA': 'O',
                '\u1EE0': 'O',
                '\u1EDE': 'O',
                '\u1EE2': 'O',
                '\u1ECC': 'O',
                '\u1ED8': 'O',
                '\u01EA': 'O',
                '\u01EC': 'O',
                '\u00D8': 'O',
                '\u01FE': 'O',
                '\u0186': 'O',
                '\u019F': 'O',
                '\uA74A': 'O',
                '\uA74C': 'O',
                '\u0152': 'OE',
                '\u01A2': 'OI',
                '\uA74E': 'OO',
                '\u0222': 'OU',
                '\u24C5': 'P',
                '\uFF30': 'P',
                '\u1E54': 'P',
                '\u1E56': 'P',
                '\u01A4': 'P',
                '\u2C63': 'P',
                '\uA750': 'P',
                '\uA752': 'P',
                '\uA754': 'P',
                '\u24C6': 'Q',
                '\uFF31': 'Q',
                '\uA756': 'Q',
                '\uA758': 'Q',
                '\u024A': 'Q',
                '\u24C7': 'R',
                '\uFF32': 'R',
                '\u0154': 'R',
                '\u1E58': 'R',
                '\u0158': 'R',
                '\u0210': 'R',
                '\u0212': 'R',
                '\u1E5A': 'R',
                '\u1E5C': 'R',
                '\u0156': 'R',
                '\u1E5E': 'R',
                '\u024C': 'R',
                '\u2C64': 'R',
                '\uA75A': 'R',
                '\uA7A6': 'R',
                '\uA782': 'R',
                '\u24C8': 'S',
                '\uFF33': 'S',
                '\u1E9E': 'S',
                '\u015A': 'S',
                '\u1E64': 'S',
                '\u015C': 'S',
                '\u1E60': 'S',
                '\u0160': 'S',
                '\u1E66': 'S',
                '\u1E62': 'S',
                '\u1E68': 'S',
                '\u0218': 'S',
                '\u015E': 'S',
                '\u2C7E': 'S',
                '\uA7A8': 'S',
                '\uA784': 'S',
                '\u24C9': 'T',
                '\uFF34': 'T',
                '\u1E6A': 'T',
                '\u0164': 'T',
                '\u1E6C': 'T',
                '\u021A': 'T',
                '\u0162': 'T',
                '\u1E70': 'T',
                '\u1E6E': 'T',
                '\u0166': 'T',
                '\u01AC': 'T',
                '\u01AE': 'T',
                '\u023E': 'T',
                '\uA786': 'T',
                '\uA728': 'TZ',
                '\u24CA': 'U',
                '\uFF35': 'U',
                '\u00D9': 'U',
                '\u00DA': 'U',
                '\u00DB': 'U',
                '\u0168': 'U',
                '\u1E78': 'U',
                '\u016A': 'U',
                '\u1E7A': 'U',
                '\u016C': 'U',
                '\u00DC': 'U',
                '\u01DB': 'U',
                '\u01D7': 'U',
                '\u01D5': 'U',
                '\u01D9': 'U',
                '\u1EE6': 'U',
                '\u016E': 'U',
                '\u0170': 'U',
                '\u01D3': 'U',
                '\u0214': 'U',
                '\u0216': 'U',
                '\u01AF': 'U',
                '\u1EEA': 'U',
                '\u1EE8': 'U',
                '\u1EEE': 'U',
                '\u1EEC': 'U',
                '\u1EF0': 'U',
                '\u1EE4': 'U',
                '\u1E72': 'U',
                '\u0172': 'U',
                '\u1E76': 'U',
                '\u1E74': 'U',
                '\u0244': 'U',
                '\u24CB': 'V',
                '\uFF36': 'V',
                '\u1E7C': 'V',
                '\u1E7E': 'V',
                '\u01B2': 'V',
                '\uA75E': 'V',
                '\u0245': 'V',
                '\uA760': 'VY',
                '\u24CC': 'W',
                '\uFF37': 'W',
                '\u1E80': 'W',
                '\u1E82': 'W',
                '\u0174': 'W',
                '\u1E86': 'W',
                '\u1E84': 'W',
                '\u1E88': 'W',
                '\u2C72': 'W',
                '\u24CD': 'X',
                '\uFF38': 'X',
                '\u1E8A': 'X',
                '\u1E8C': 'X',
                '\u24CE': 'Y',
                '\uFF39': 'Y',
                '\u1EF2': 'Y',
                '\u00DD': 'Y',
                '\u0176': 'Y',
                '\u1EF8': 'Y',
                '\u0232': 'Y',
                '\u1E8E': 'Y',
                '\u0178': 'Y',
                '\u1EF6': 'Y',
                '\u1EF4': 'Y',
                '\u01B3': 'Y',
                '\u024E': 'Y',
                '\u1EFE': 'Y',
                '\u24CF': 'Z',
                '\uFF3A': 'Z',
                '\u0179': 'Z',
                '\u1E90': 'Z',
                '\u017B': 'Z',
                '\u017D': 'Z',
                '\u1E92': 'Z',
                '\u1E94': 'Z',
                '\u01B5': 'Z',
                '\u0224': 'Z',
                '\u2C7F': 'Z',
                '\u2C6B': 'Z',
                '\uA762': 'Z',
                '\u24D0': 'a',
                '\uFF41': 'a',
                '\u1E9A': 'a',
                '\u00E0': 'a',
                '\u00E1': 'a',
                '\u00E2': 'a',
                '\u1EA7': 'a',
                '\u1EA5': 'a',
                '\u1EAB': 'a',
                '\u1EA9': 'a',
                '\u00E3': 'a',
                '\u0101': 'a',
                '\u0103': 'a',
                '\u1EB1': 'a',
                '\u1EAF': 'a',
                '\u1EB5': 'a',
                '\u1EB3': 'a',
                '\u0227': 'a',
                '\u01E1': 'a',
                '\u00E4': 'a',
                '\u01DF': 'a',
                '\u1EA3': 'a',
                '\u00E5': 'a',
                '\u01FB': 'a',
                '\u01CE': 'a',
                '\u0201': 'a',
                '\u0203': 'a',
                '\u1EA1': 'a',
                '\u1EAD': 'a',
                '\u1EB7': 'a',
                '\u1E01': 'a',
                '\u0105': 'a',
                '\u2C65': 'a',
                '\u0250': 'a',
                '\uA733': 'aa',
                '\u00E6': 'ae',
                '\u01FD': 'ae',
                '\u01E3': 'ae',
                '\uA735': 'ao',
                '\uA737': 'au',
                '\uA739': 'av',
                '\uA73B': 'av',
                '\uA73D': 'ay',
                '\u24D1': 'b',
                '\uFF42': 'b',
                '\u1E03': 'b',
                '\u1E05': 'b',
                '\u1E07': 'b',
                '\u0180': 'b',
                '\u0183': 'b',
                '\u0253': 'b',
                '\u24D2': 'c',
                '\uFF43': 'c',
                '\u0107': 'c',
                '\u0109': 'c',
                '\u010B': 'c',
                '\u010D': 'c',
                '\u00E7': 'c',
                '\u1E09': 'c',
                '\u0188': 'c',
                '\u023C': 'c',
                '\uA73F': 'c',
                '\u2184': 'c',
                '\u24D3': 'd',
                '\uFF44': 'd',
                '\u1E0B': 'd',
                '\u010F': 'd',
                '\u1E0D': 'd',
                '\u1E11': 'd',
                '\u1E13': 'd',
                '\u1E0F': 'd',
                '\u0111': 'd',
                '\u018C': 'd',
                '\u0256': 'd',
                '\u0257': 'd',
                '\uA77A': 'd',
                '\u01F3': 'dz',
                '\u01C6': 'dz',
                '\u24D4': 'e',
                '\uFF45': 'e',
                '\u00E8': 'e',
                '\u00E9': 'e',
                '\u00EA': 'e',
                '\u1EC1': 'e',
                '\u1EBF': 'e',
                '\u1EC5': 'e',
                '\u1EC3': 'e',
                '\u1EBD': 'e',
                '\u0113': 'e',
                '\u1E15': 'e',
                '\u1E17': 'e',
                '\u0115': 'e',
                '\u0117': 'e',
                '\u00EB': 'e',
                '\u1EBB': 'e',
                '\u011B': 'e',
                '\u0205': 'e',
                '\u0207': 'e',
                '\u1EB9': 'e',
                '\u1EC7': 'e',
                '\u0229': 'e',
                '\u1E1D': 'e',
                '\u0119': 'e',
                '\u1E19': 'e',
                '\u1E1B': 'e',
                '\u0247': 'e',
                '\u025B': 'e',
                '\u01DD': 'e',
                '\u24D5': 'f',
                '\uFF46': 'f',
                '\u1E1F': 'f',
                '\u0192': 'f',
                '\uA77C': 'f',
                '\u24D6': 'g',
                '\uFF47': 'g',
                '\u01F5': 'g',
                '\u011D': 'g',
                '\u1E21': 'g',
                '\u011F': 'g',
                '\u0121': 'g',
                '\u01E7': 'g',
                '\u0123': 'g',
                '\u01E5': 'g',
                '\u0260': 'g',
                '\uA7A1': 'g',
                '\u1D79': 'g',
                '\uA77F': 'g',
                '\u24D7': 'h',
                '\uFF48': 'h',
                '\u0125': 'h',
                '\u1E23': 'h',
                '\u1E27': 'h',
                '\u021F': 'h',
                '\u1E25': 'h',
                '\u1E29': 'h',
                '\u1E2B': 'h',
                '\u1E96': 'h',
                '\u0127': 'h',
                '\u2C68': 'h',
                '\u2C76': 'h',
                '\u0265': 'h',
                '\u0195': 'hv',
                '\u24D8': 'i',
                '\uFF49': 'i',
                '\u00EC': 'i',
                '\u00ED': 'i',
                '\u00EE': 'i',
                '\u0129': 'i',
                '\u012B': 'i',
                '\u012D': 'i',
                '\u00EF': 'i',
                '\u1E2F': 'i',
                '\u1EC9': 'i',
                '\u01D0': 'i',
                '\u0209': 'i',
                '\u020B': 'i',
                '\u1ECB': 'i',
                '\u012F': 'i',
                '\u1E2D': 'i',
                '\u0268': 'i',
                '\u0131': 'i',
                '\u24D9': 'j',
                '\uFF4A': 'j',
                '\u0135': 'j',
                '\u01F0': 'j',
                '\u0249': 'j',
                '\u24DA': 'k',
                '\uFF4B': 'k',
                '\u1E31': 'k',
                '\u01E9': 'k',
                '\u1E33': 'k',
                '\u0137': 'k',
                '\u1E35': 'k',
                '\u0199': 'k',
                '\u2C6A': 'k',
                '\uA741': 'k',
                '\uA743': 'k',
                '\uA745': 'k',
                '\uA7A3': 'k',
                '\u24DB': 'l',
                '\uFF4C': 'l',
                '\u0140': 'l',
                '\u013A': 'l',
                '\u013E': 'l',
                '\u1E37': 'l',
                '\u1E39': 'l',
                '\u013C': 'l',
                '\u1E3D': 'l',
                '\u1E3B': 'l',
                '\u017F': 'l',
                '\u0142': 'l',
                '\u019A': 'l',
                '\u026B': 'l',
                '\u2C61': 'l',
                '\uA749': 'l',
                '\uA781': 'l',
                '\uA747': 'l',
                '\u01C9': 'lj',
                '\u24DC': 'm',
                '\uFF4D': 'm',
                '\u1E3F': 'm',
                '\u1E41': 'm',
                '\u1E43': 'm',
                '\u0271': 'm',
                '\u026F': 'm',
                '\u24DD': 'n',
                '\uFF4E': 'n',
                '\u01F9': 'n',
                '\u0144': 'n',
                '\u00F1': 'n',
                '\u1E45': 'n',
                '\u0148': 'n',
                '\u1E47': 'n',
                '\u0146': 'n',
                '\u1E4B': 'n',
                '\u1E49': 'n',
                '\u019E': 'n',
                '\u0272': 'n',
                '\u0149': 'n',
                '\uA791': 'n',
                '\uA7A5': 'n',
                '\u01CC': 'nj',
                '\u24DE': 'o',
                '\uFF4F': 'o',
                '\u00F2': 'o',
                '\u00F3': 'o',
                '\u00F4': 'o',
                '\u1ED3': 'o',
                '\u1ED1': 'o',
                '\u1ED7': 'o',
                '\u1ED5': 'o',
                '\u00F5': 'o',
                '\u1E4D': 'o',
                '\u022D': 'o',
                '\u1E4F': 'o',
                '\u014D': 'o',
                '\u1E51': 'o',
                '\u1E53': 'o',
                '\u014F': 'o',
                '\u022F': 'o',
                '\u0231': 'o',
                '\u00F6': 'o',
                '\u022B': 'o',
                '\u1ECF': 'o',
                '\u0151': 'o',
                '\u01D2': 'o',
                '\u020D': 'o',
                '\u020F': 'o',
                '\u01A1': 'o',
                '\u1EDD': 'o',
                '\u1EDB': 'o',
                '\u1EE1': 'o',
                '\u1EDF': 'o',
                '\u1EE3': 'o',
                '\u1ECD': 'o',
                '\u1ED9': 'o',
                '\u01EB': 'o',
                '\u01ED': 'o',
                '\u00F8': 'o',
                '\u01FF': 'o',
                '\u0254': 'o',
                '\uA74B': 'o',
                '\uA74D': 'o',
                '\u0275': 'o',
                '\u0153': 'oe',
                '\u01A3': 'oi',
                '\u0223': 'ou',
                '\uA74F': 'oo',
                '\u24DF': 'p',
                '\uFF50': 'p',
                '\u1E55': 'p',
                '\u1E57': 'p',
                '\u01A5': 'p',
                '\u1D7D': 'p',
                '\uA751': 'p',
                '\uA753': 'p',
                '\uA755': 'p',
                '\u24E0': 'q',
                '\uFF51': 'q',
                '\u024B': 'q',
                '\uA757': 'q',
                '\uA759': 'q',
                '\u24E1': 'r',
                '\uFF52': 'r',
                '\u0155': 'r',
                '\u1E59': 'r',
                '\u0159': 'r',
                '\u0211': 'r',
                '\u0213': 'r',
                '\u1E5B': 'r',
                '\u1E5D': 'r',
                '\u0157': 'r',
                '\u1E5F': 'r',
                '\u024D': 'r',
                '\u027D': 'r',
                '\uA75B': 'r',
                '\uA7A7': 'r',
                '\uA783': 'r',
                '\u24E2': 's',
                '\uFF53': 's',
                '\u00DF': 's',
                '\u015B': 's',
                '\u1E65': 's',
                '\u015D': 's',
                '\u1E61': 's',
                '\u0161': 's',
                '\u1E67': 's',
                '\u1E63': 's',
                '\u1E69': 's',
                '\u0219': 's',
                '\u015F': 's',
                '\u023F': 's',
                '\uA7A9': 's',
                '\uA785': 's',
                '\u1E9B': 's',
                '\u24E3': 't',
                '\uFF54': 't',
                '\u1E6B': 't',
                '\u1E97': 't',
                '\u0165': 't',
                '\u1E6D': 't',
                '\u021B': 't',
                '\u0163': 't',
                '\u1E71': 't',
                '\u1E6F': 't',
                '\u0167': 't',
                '\u01AD': 't',
                '\u0288': 't',
                '\u2C66': 't',
                '\uA787': 't',
                '\uA729': 'tz',
                '\u24E4': 'u',
                '\uFF55': 'u',
                '\u00F9': 'u',
                '\u00FA': 'u',
                '\u00FB': 'u',
                '\u0169': 'u',
                '\u1E79': 'u',
                '\u016B': 'u',
                '\u1E7B': 'u',
                '\u016D': 'u',
                '\u00FC': 'u',
                '\u01DC': 'u',
                '\u01D8': 'u',
                '\u01D6': 'u',
                '\u01DA': 'u',
                '\u1EE7': 'u',
                '\u016F': 'u',
                '\u0171': 'u',
                '\u01D4': 'u',
                '\u0215': 'u',
                '\u0217': 'u',
                '\u01B0': 'u',
                '\u1EEB': 'u',
                '\u1EE9': 'u',
                '\u1EEF': 'u',
                '\u1EED': 'u',
                '\u1EF1': 'u',
                '\u1EE5': 'u',
                '\u1E73': 'u',
                '\u0173': 'u',
                '\u1E77': 'u',
                '\u1E75': 'u',
                '\u0289': 'u',
                '\u24E5': 'v',
                '\uFF56': 'v',
                '\u1E7D': 'v',
                '\u1E7F': 'v',
                '\u028B': 'v',
                '\uA75F': 'v',
                '\u028C': 'v',
                '\uA761': 'vy',
                '\u24E6': 'w',
                '\uFF57': 'w',
                '\u1E81': 'w',
                '\u1E83': 'w',
                '\u0175': 'w',
                '\u1E87': 'w',
                '\u1E85': 'w',
                '\u1E98': 'w',
                '\u1E89': 'w',
                '\u2C73': 'w',
                '\u24E7': 'x',
                '\uFF58': 'x',
                '\u1E8B': 'x',
                '\u1E8D': 'x',
                '\u24E8': 'y',
                '\uFF59': 'y',
                '\u1EF3': 'y',
                '\u00FD': 'y',
                '\u0177': 'y',
                '\u1EF9': 'y',
                '\u0233': 'y',
                '\u1E8F': 'y',
                '\u00FF': 'y',
                '\u1EF7': 'y',
                '\u1E99': 'y',
                '\u1EF5': 'y',
                '\u01B4': 'y',
                '\u024F': 'y',
                '\u1EFF': 'y',
                '\u24E9': 'z',
                '\uFF5A': 'z',
                '\u017A': 'z',
                '\u1E91': 'z',
                '\u017C': 'z',
                '\u017E': 'z',
                '\u1E93': 'z',
                '\u1E95': 'z',
                '\u01B6': 'z',
                '\u0225': 'z',
                '\u0240': 'z',
                '\u2C6C': 'z',
                '\uA763': 'z',
                '\u0386': '\u0391',
                '\u0388': '\u0395',
                '\u0389': '\u0397',
                '\u038A': '\u0399',
                '\u03AA': '\u0399',
                '\u038C': '\u039F',
                '\u038E': '\u03A5',
                '\u03AB': '\u03A5',
                '\u038F': '\u03A9',
                '\u03AC': '\u03B1',
                '\u03AD': '\u03B5',
                '\u03AE': '\u03B7',
                '\u03AF': '\u03B9',
                '\u03CA': '\u03B9',
                '\u0390': '\u03B9',
                '\u03CC': '\u03BF',
                '\u03CD': '\u03C5',
                '\u03CB': '\u03C5',
                '\u03B0': '\u03C5',
                '\u03CE': '\u03C9',
                '\u03C2': '\u03C3',
                '\u2019': '\''
            };
            return diacritics;
        });
        S2.define('select2/data/base', [
            '../utils'
        ], function (Utils) {
            function BaseAdapter($element, options) {
                BaseAdapter.__super__.constructor.call(this);
            }
            Utils.Extend(BaseAdapter, Utils.Observable);
            BaseAdapter.prototype.current = function (callback) {
                throw new Error('The `current` method must be defined in child classes.');
            };
            BaseAdapter.prototype.query = function (params, callback) {
                throw new Error('The `query` method must be defined in child classes.');
            };
            BaseAdapter.prototype.bind = function (container, $container) {
                // Can be implemented in subclasses
            };
            BaseAdapter.prototype.destroy = function () {
                // Can be implemented in subclasses
            };
            BaseAdapter.prototype.generateResultId = function (container, data) {
                var id = container.id + '-result-';
                id += Utils.generateChars(4);
                if (data.id != null) {
                    id += '-' + data.id.toString();
                }
                else {
                    id += '-' + Utils.generateChars(4);
                }
                return id;
            };
            return BaseAdapter;
        });
        S2.define('select2/data/select', [
            './base',
            '../utils',
            'jquery'
        ], function (BaseAdapter, Utils, $) {
            function SelectAdapter($element, options) {
                this.$element = $element;
                this.options = options;
                SelectAdapter.__super__.constructor.call(this);
            }
            Utils.Extend(SelectAdapter, BaseAdapter);
            SelectAdapter.prototype.current = function (callback) {
                var data = [];
                var self = this;
                this.$element.find(':selected').each(function () {
                    var $option = $(this);
                    var option = self.item($option);
                    data.push(option);
                });
                callback(data);
            };
            SelectAdapter.prototype.select = function (data) {
                var self = this;
                data.selected = true;
                // If data.element is a DOM node, use it instead
                if ($(data.element).is('option')) {
                    data.element.selected = true;
                    this.$element.trigger('change');
                    return;
                }
                if (this.$element.prop('multiple')) {
                    this.current(function (currentData) {
                        var val = [];
                        data = [data];
                        data.push.apply(data, currentData);
                        for (var d = 0; d < data.length; d++) {
                            var id = data[d].id;
                            if ($.inArray(id, val) === -1) {
                                val.push(id);
                            }
                        }
                        self.$element.val(val);
                        self.$element.trigger('change');
                    });
                }
                else {
                    var val = data.id;
                    this.$element.val(val);
                    this.$element.trigger('change');
                }
            };
            SelectAdapter.prototype.unselect = function (data) {
                var self = this;
                if (!this.$element.prop('multiple')) {
                    return;
                }
                data.selected = false;
                if ($(data.element).is('option')) {
                    data.element.selected = false;
                    this.$element.trigger('change');
                    return;
                }
                this.current(function (currentData) {
                    var val = [];
                    for (var d = 0; d < currentData.length; d++) {
                        var id = currentData[d].id;
                        if (id !== data.id && $.inArray(id, val) === -1) {
                            val.push(id);
                        }
                    }
                    self.$element.val(val);
                    self.$element.trigger('change');
                });
            };
            SelectAdapter.prototype.bind = function (container, $container) {
                var self = this;
                this.container = container;
                container.on('select', function (params) {
                    self.select(params.data);
                });
                container.on('unselect', function (params) {
                    self.unselect(params.data);
                });
            };
            SelectAdapter.prototype.destroy = function () {
                // Remove anything added to child elements
                this.$element.find('*').each(function () {
                    // Remove any custom data set by Select2
                    Utils.RemoveData(this);
                });
            };
            SelectAdapter.prototype.query = function (params, callback) {
                var data = [];
                var self = this;
                var $options = this.$element.children();
                $options.each(function () {
                    var $option = $(this);
                    if (!$option.is('option') && !$option.is('optgroup')) {
                        return;
                    }
                    var option = self.item($option);
                    var matches = self.matches(params, option);
                    if (matches !== null) {
                        data.push(matches);
                    }
                });
                callback({
                    results: data
                });
            };
            SelectAdapter.prototype.addOptions = function ($options) {
                Utils.appendMany(this.$element, $options);
            };
            SelectAdapter.prototype.option = function (data) {
                var option;
                if (data.children) {
                    option = document.createElement('optgroup');
                    option.label = data.text;
                }
                else {
                    option = document.createElement('option');
                    if (option.textContent !== undefined) {
                        option.textContent = data.text;
                    }
                    else {
                        option.innerText = data.text;
                    }
                }
                if (data.id !== undefined) {
                    option.value = data.id;
                }
                if (data.disabled) {
                    option.disabled = true;
                }
                if (data.selected) {
                    option.selected = true;
                }
                if (data.title) {
                    option.title = data.title;
                }
                var $option = $(option);
                var normalizedData = this._normalizeItem(data);
                normalizedData.element = option;
                // Override the option's data with the combined data
                Utils.StoreData(option, 'data', normalizedData);
                return $option;
            };
            SelectAdapter.prototype.item = function ($option) {
                var data = {};
                data = Utils.GetData($option[0], 'data');
                if (data != null) {
                    return data;
                }
                if ($option.is('option')) {
                    data = {
                        id: $option.val(),
                        text: $option.text(),
                        disabled: $option.prop('disabled'),
                        selected: $option.prop('selected'),
                        title: $option.prop('title')
                    };
                }
                else if ($option.is('optgroup')) {
                    data = {
                        text: $option.prop('label'),
                        children: [],
                        title: $option.prop('title')
                    };
                    var $children = $option.children('option');
                    var children = [];
                    for (var c = 0; c < $children.length; c++) {
                        var $child = $($children[c]);
                        var child = this.item($child);
                        children.push(child);
                    }
                    data.children = children;
                }
                data = this._normalizeItem(data);
                data.element = $option[0];
                Utils.StoreData($option[0], 'data', data);
                return data;
            };
            SelectAdapter.prototype._normalizeItem = function (item) {
                if (item !== Object(item)) {
                    item = {
                        id: item,
                        text: item
                    };
                }
                item = $.extend({}, {
                    text: ''
                }, item);
                var defaults = {
                    selected: false,
                    disabled: false
                };
                if (item.id != null) {
                    item.id = item.id.toString();
                }
                if (item.text != null) {
                    item.text = item.text.toString();
                }
                if (item._resultId == null && item.id && this.container != null) {
                    item._resultId = this.generateResultId(this.container, item);
                }
                return $.extend({}, defaults, item);
            };
            SelectAdapter.prototype.matches = function (params, data) {
                var matcher = this.options.get('matcher');
                return matcher(params, data);
            };
            return SelectAdapter;
        });
        S2.define('select2/data/array', [
            './select',
            '../utils',
            'jquery'
        ], function (SelectAdapter, Utils, $) {
            function ArrayAdapter($element, options) {
                var data = options.get('data') || [];
                ArrayAdapter.__super__.constructor.call(this, $element, options);
                this.addOptions(this.convertToOptions(data));
            }
            Utils.Extend(ArrayAdapter, SelectAdapter);
            ArrayAdapter.prototype.select = function (data) {
                var $option = this.$element.find('option').filter(function (i, elm) {
                    return elm.value == data.id.toString();
                });
                if ($option.length === 0) {
                    $option = this.option(data);
                    this.addOptions($option);
                }
                ArrayAdapter.__super__.select.call(this, data);
            };
            ArrayAdapter.prototype.convertToOptions = function (data) {
                var self = this;
                var $existing = this.$element.find('option');
                var existingIds = $existing.map(function () {
                    return self.item($(this)).id;
                }).get();
                var $options = [];
                // Filter out all items except for the one passed in the argument
                function onlyItem(item) {
                    return function () {
                        return $(this).val() == item.id;
                    };
                }
                for (var d = 0; d < data.length; d++) {
                    var item = this._normalizeItem(data[d]);
                    // Skip items which were pre-loaded, only merge the data
                    if ($.inArray(item.id, existingIds) >= 0) {
                        var $existingOption = $existing.filter(onlyItem(item));
                        var existingData = this.item($existingOption);
                        var newData = $.extend(true, {}, item, existingData);
                        var $newOption = this.option(newData);
                        $existingOption.replaceWith($newOption);
                        continue;
                    }
                    var $option = this.option(item);
                    if (item.children) {
                        var $children = this.convertToOptions(item.children);
                        Utils.appendMany($option, $children);
                    }
                    $options.push($option);
                }
                return $options;
            };
            return ArrayAdapter;
        });
        S2.define('select2/data/ajax', [
            './array',
            '../utils',
            'jquery'
        ], function (ArrayAdapter, Utils, $) {
            function AjaxAdapter($element, options) {
                this.ajaxOptions = this._applyDefaults(options.get('ajax'));
                if (this.ajaxOptions.processResults != null) {
                    this.processResults = this.ajaxOptions.processResults;
                }
                AjaxAdapter.__super__.constructor.call(this, $element, options);
            }
            Utils.Extend(AjaxAdapter, ArrayAdapter);
            AjaxAdapter.prototype._applyDefaults = function (options) {
                var defaults = {
                    data: function (params) {
                        return $.extend({}, params, {
                            q: params.term
                        });
                    },
                    transport: function (params, success, failure) {
                        var $request = $.ajax(params);
                        $request.then(success);
                        $request.fail(failure);
                        return $request;
                    }
                };
                return $.extend({}, defaults, options, true);
            };
            AjaxAdapter.prototype.processResults = function (results) {
                return results;
            };
            AjaxAdapter.prototype.query = function (params, callback) {
                var matches = [];
                var self = this;
                if (this._request != null) {
                    // JSONP requests cannot always be aborted
                    if ($.isFunction(this._request.abort)) {
                        this._request.abort();
                    }
                    this._request = null;
                }
                var options = $.extend({
                    type: 'GET'
                }, this.ajaxOptions);
                if (typeof options.url === 'function') {
                    options.url = options.url.call(this.$element, params);
                }
                if (typeof options.data === 'function') {
                    options.data = options.data.call(this.$element, params);
                }
                function request() {
                    var $request = options.transport(options, function (data) {
                        var results = self.processResults(data, params);
                        if (self.options.get('debug') && window.console && console.error) {
                            // Check to make sure that the response included a `results` key.
                            if (!results || !results.results || !$.isArray(results.results)) {
                                console.error('Select2: The AJAX results did not return an array in the ' +
                                    '`results` key of the response.');
                            }
                        }
                        callback(results);
                    }, function () {
                        // Attempt to detect if a request was aborted
                        // Only works if the transport exposes a status property
                        if ('status' in $request &&
                            ($request.status === 0 || $request.status === '0')) {
                            return;
                        }
                        self.trigger('results:message', {
                            message: 'errorLoading'
                        });
                    });
                    self._request = $request;
                }
                if (this.ajaxOptions.delay && params.term != null) {
                    if (this._queryTimeout) {
                        window.clearTimeout(this._queryTimeout);
                    }
                    this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
                }
                else {
                    request();
                }
            };
            return AjaxAdapter;
        });
        S2.define('select2/data/tags', [
            'jquery'
        ], function ($) {
            function Tags(decorated, $element, options) {
                var tags = options.get('tags');
                var createTag = options.get('createTag');
                if (createTag !== undefined) {
                    this.createTag = createTag;
                }
                var insertTag = options.get('insertTag');
                if (insertTag !== undefined) {
                    this.insertTag = insertTag;
                }
                decorated.call(this, $element, options);
                if ($.isArray(tags)) {
                    for (var t = 0; t < tags.length; t++) {
                        var tag = tags[t];
                        var item = this._normalizeItem(tag);
                        var $option = this.option(item);
                        this.$element.append($option);
                    }
                }
            }
            Tags.prototype.query = function (decorated, params, callback) {
                var self = this;
                this._removeOldTags();
                if (params.term == null || params.page != null) {
                    decorated.call(this, params, callback);
                    return;
                }
                function wrapper(obj, child) {
                    var data = obj.results;
                    for (var i = 0; i < data.length; i++) {
                        var option = data[i];
                        var checkChildren = (option.children != null &&
                            !wrapper({
                                results: option.children
                            }, true));
                        var optionText = (option.text || '').toUpperCase();
                        var paramsTerm = (params.term || '').toUpperCase();
                        var checkText = optionText === paramsTerm;
                        if (checkText || checkChildren) {
                            if (child) {
                                return false;
                            }
                            obj.data = data;
                            callback(obj);
                            return;
                        }
                    }
                    if (child) {
                        return true;
                    }
                    var tag = self.createTag(params);
                    if (tag != null) {
                        var $option = self.option(tag);
                        $option.attr('data-select2-tag', true);
                        self.addOptions([$option]);
                        self.insertTag(data, tag);
                    }
                    obj.results = data;
                    callback(obj);
                }
                decorated.call(this, params, wrapper);
            };
            Tags.prototype.createTag = function (decorated, params) {
                var term = $.trim(params.term);
                if (term === '') {
                    return null;
                }
                return {
                    id: term,
                    text: term
                };
            };
            Tags.prototype.insertTag = function (_, data, tag) {
                data.unshift(tag);
            };
            Tags.prototype._removeOldTags = function (_) {
                var tag = this._lastTag;
                var $options = this.$element.find('option[data-select2-tag]');
                $options.each(function () {
                    if (this.selected) {
                        return;
                    }
                    $(this).remove();
                });
            };
            return Tags;
        });
        S2.define('select2/data/tokenizer', [
            'jquery'
        ], function ($) {
            function Tokenizer(decorated, $element, options) {
                var tokenizer = options.get('tokenizer');
                if (tokenizer !== undefined) {
                    this.tokenizer = tokenizer;
                }
                decorated.call(this, $element, options);
            }
            Tokenizer.prototype.bind = function (decorated, container, $container) {
                decorated.call(this, container, $container);
                this.$search = container.dropdown.$search || container.selection.$search ||
                    $container.find('.select2-search__field');
            };
            Tokenizer.prototype.query = function (decorated, params, callback) {
                var self = this;
                function createAndSelect(data) {
                    // Normalize the data object so we can use it for checks
                    var item = self._normalizeItem(data);
                    // Check if the data object already exists as a tag
                    // Select it if it doesn't
                    var $existingOptions = self.$element.find('option').filter(function () {
                        return $(this).val() === item.id;
                    });
                    // If an existing option wasn't found for it, create the option
                    if (!$existingOptions.length) {
                        var $option = self.option(item);
                        $option.attr('data-select2-tag', true);
                        self._removeOldTags();
                        self.addOptions([$option]);
                    }
                    // Select the item, now that we know there is an option for it
                    select(item);
                }
                function select(data) {
                    self.trigger('select', {
                        data: data
                    });
                }
                params.term = params.term || '';
                var tokenData = this.tokenizer(params, this.options, createAndSelect);
                if (tokenData.term !== params.term) {
                    // Replace the search term if we have the search box
                    if (this.$search.length) {
                        this.$search.val(tokenData.term);
                        this.$search.focus();
                    }
                    params.term = tokenData.term;
                }
                decorated.call(this, params, callback);
            };
            Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
                var separators = options.get('tokenSeparators') || [];
                var term = params.term;
                var i = 0;
                var createTag = this.createTag || function (params) {
                    return {
                        id: params.term,
                        text: params.term
                    };
                };
                while (i < term.length) {
                    var termChar = term[i];
                    if ($.inArray(termChar, separators) === -1) {
                        i++;
                        continue;
                    }
                    var part = term.substr(0, i);
                    var partParams = $.extend({}, params, {
                        term: part
                    });
                    var data = createTag(partParams);
                    if (data == null) {
                        i++;
                        continue;
                    }
                    callback(data);
                    // Reset the term to not include the tokenized portion
                    term = term.substr(i + 1) || '';
                    i = 0;
                }
                return {
                    term: term
                };
            };
            return Tokenizer;
        });
        S2.define('select2/data/minimumInputLength', [], function () {
            function MinimumInputLength(decorated, $e, options) {
                this.minimumInputLength = options.get('minimumInputLength');
                decorated.call(this, $e, options);
            }
            MinimumInputLength.prototype.query = function (decorated, params, callback) {
                params.term = params.term || '';
                if (params.term.length < this.minimumInputLength) {
                    this.trigger('results:message', {
                        message: 'inputTooShort',
                        args: {
                            minimum: this.minimumInputLength,
                            input: params.term,
                            params: params
                        }
                    });
                    return;
                }
                decorated.call(this, params, callback);
            };
            return MinimumInputLength;
        });
        S2.define('select2/data/maximumInputLength', [], function () {
            function MaximumInputLength(decorated, $e, options) {
                this.maximumInputLength = options.get('maximumInputLength');
                decorated.call(this, $e, options);
            }
            MaximumInputLength.prototype.query = function (decorated, params, callback) {
                params.term = params.term || '';
                if (this.maximumInputLength > 0 &&
                    params.term.length > this.maximumInputLength) {
                    this.trigger('results:message', {
                        message: 'inputTooLong',
                        args: {
                            maximum: this.maximumInputLength,
                            input: params.term,
                            params: params
                        }
                    });
                    return;
                }
                decorated.call(this, params, callback);
            };
            return MaximumInputLength;
        });
        S2.define('select2/data/maximumSelectionLength', [], function () {
            function MaximumSelectionLength(decorated, $e, options) {
                this.maximumSelectionLength = options.get('maximumSelectionLength');
                decorated.call(this, $e, options);
            }
            MaximumSelectionLength.prototype.query =
                function (decorated, params, callback) {
                    var self = this;
                    this.current(function (currentData) {
                        var count = currentData != null ? currentData.length : 0;
                        if (self.maximumSelectionLength > 0 &&
                            count >= self.maximumSelectionLength) {
                            self.trigger('results:message', {
                                message: 'maximumSelected',
                                args: {
                                    maximum: self.maximumSelectionLength
                                }
                            });
                            return;
                        }
                        decorated.call(self, params, callback);
                    });
                };
            return MaximumSelectionLength;
        });
        S2.define('select2/dropdown', [
            'jquery',
            './utils'
        ], function ($, Utils) {
            function Dropdown($element, options) {
                this.$element = $element;
                this.options = options;
                Dropdown.__super__.constructor.call(this);
            }
            Utils.Extend(Dropdown, Utils.Observable);
            Dropdown.prototype.render = function () {
                var $dropdown = $('<span class="select2-dropdown">' +
                    '<span class="select2-results"></span>' +
                    '</span>');
                $dropdown.attr('dir', this.options.get('dir'));
                this.$dropdown = $dropdown;
                return $dropdown;
            };
            Dropdown.prototype.bind = function () {
                // Should be implemented in subclasses
            };
            Dropdown.prototype.position = function ($dropdown, $container) {
                // Should be implemented in subclasses
            };
            Dropdown.prototype.destroy = function () {
                // Remove the dropdown from the DOM
                this.$dropdown.remove();
            };
            return Dropdown;
        });
        S2.define('select2/dropdown/search', [
            'jquery',
            '../utils'
        ], function ($, Utils) {
            function Search() { }
            Search.prototype.render = function (decorated) {
                var $rendered = decorated.call(this);
                var $search = $('<span class="select2-search select2-search--dropdown">' +
                    '<input class="select2-search__field" type="search" tabindex="-1"' +
                    ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
                    ' spellcheck="false" role="textbox" />' +
                    '</span>');
                this.$searchContainer = $search;
                this.$search = $search.find('input');
                $rendered.prepend($search);
                return $rendered;
            };
            Search.prototype.bind = function (decorated, container, $container) {
                var self = this;
                decorated.call(this, container, $container);
                this.$search.on('keydown', function (evt) {
                    self.trigger('keypress', evt);
                    self._keyUpPrevented = evt.isDefaultPrevented();
                });
                // Workaround for browsers which do not support the `input` event
                // This will prevent double-triggering of events for browsers which support
                // both the `keyup` and `input` events.
                this.$search.on('input', function (evt) {
                    // Unbind the duplicated `keyup` event
                    $(this).off('keyup');
                });
                this.$search.on('keyup input', function (evt) {
                    self.handleSearch(evt);
                });
                container.on('open', function () {
                    self.$search.attr('tabindex', 0);
                    self.$search.focus();
                    window.setTimeout(function () {
                        self.$search.focus();
                    }, 0);
                });
                container.on('close', function () {
                    self.$search.attr('tabindex', -1);
                    self.$search.val('');
                    self.$search.blur();
                });
                container.on('focus', function () {
                    if (!container.isOpen()) {
                        self.$search.focus();
                    }
                });
                container.on('results:all', function (params) {
                    if (params.query.term == null || params.query.term === '') {
                        var showSearch = self.showSearch(params);
                        if (showSearch) {
                            self.$searchContainer.removeClass('select2-search--hide');
                        }
                        else {
                            self.$searchContainer.addClass('select2-search--hide');
                        }
                    }
                });
            };
            Search.prototype.handleSearch = function (evt) {
                if (!this._keyUpPrevented) {
                    var input = this.$search.val();
                    this.trigger('query', {
                        term: input
                    });
                }
                this._keyUpPrevented = false;
            };
            Search.prototype.showSearch = function (_, params) {
                return true;
            };
            return Search;
        });
        S2.define('select2/dropdown/hidePlaceholder', [], function () {
            function HidePlaceholder(decorated, $element, options, dataAdapter) {
                this.placeholder = this.normalizePlaceholder(options.get('placeholder'));
                decorated.call(this, $element, options, dataAdapter);
            }
            HidePlaceholder.prototype.append = function (decorated, data) {
                data.results = this.removePlaceholder(data.results);
                decorated.call(this, data);
            };
            HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
                if (typeof placeholder === 'string') {
                    placeholder = {
                        id: '',
                        text: placeholder
                    };
                }
                return placeholder;
            };
            HidePlaceholder.prototype.removePlaceholder = function (_, data) {
                var modifiedData = data.slice(0);
                for (var d = data.length - 1; d >= 0; d--) {
                    var item = data[d];
                    if (this.placeholder.id === item.id) {
                        modifiedData.splice(d, 1);
                    }
                }
                return modifiedData;
            };
            return HidePlaceholder;
        });
        S2.define('select2/dropdown/infiniteScroll', [
            'jquery'
        ], function ($) {
            function InfiniteScroll(decorated, $element, options, dataAdapter) {
                this.lastParams = {};
                decorated.call(this, $element, options, dataAdapter);
                this.$loadingMore = this.createLoadingMore();
                this.loading = false;
            }
            InfiniteScroll.prototype.append = function (decorated, data) {
                this.$loadingMore.remove();
                this.loading = false;
                decorated.call(this, data);
                if (this.showLoadingMore(data)) {
                    this.$results.append(this.$loadingMore);
                }
            };
            InfiniteScroll.prototype.bind = function (decorated, container, $container) {
                var self = this;
                decorated.call(this, container, $container);
                container.on('query', function (params) {
                    self.lastParams = params;
                    self.loading = true;
                });
                container.on('query:append', function (params) {
                    self.lastParams = params;
                    self.loading = true;
                });
                this.$results.on('scroll', function () {
                    var isLoadMoreVisible = $.contains(document.documentElement, self.$loadingMore[0]);
                    if (self.loading || !isLoadMoreVisible) {
                        return;
                    }
                    var currentOffset = self.$results.offset().top +
                        self.$results.outerHeight(false);
                    var loadingMoreOffset = self.$loadingMore.offset().top +
                        self.$loadingMore.outerHeight(false);
                    if (currentOffset + 50 >= loadingMoreOffset) {
                        self.loadMore();
                    }
                });
            };
            InfiniteScroll.prototype.loadMore = function () {
                this.loading = true;
                var params = $.extend({}, { page: 1 }, this.lastParams);
                params.page++;
                this.trigger('query:append', params);
            };
            InfiniteScroll.prototype.showLoadingMore = function (_, data) {
                return data.pagination && data.pagination.more;
            };
            InfiniteScroll.prototype.createLoadingMore = function () {
                var $option = $('<li ' +
                    'class="select2-results__option select2-results__option--load-more"' +
                    'role="treeitem" aria-disabled="true"></li>');
                var message = this.options.get('translations').get('loadingMore');
                $option.html(message(this.lastParams));
                return $option;
            };
            return InfiniteScroll;
        });
        S2.define('select2/dropdown/attachBody', [
            'jquery',
            '../utils'
        ], function ($, Utils) {
            function AttachBody(decorated, $element, options) {
                this.$dropdownParent = options.get('dropdownParent') || $(document.body);
                decorated.call(this, $element, options);
            }
            AttachBody.prototype.bind = function (decorated, container, $container) {
                var self = this;
                var setupResultsEvents = false;
                decorated.call(this, container, $container);
                container.on('open', function () {
                    self._showDropdown();
                    self._attachPositioningHandler(container);
                    if (!setupResultsEvents) {
                        setupResultsEvents = true;
                        container.on('results:all', function () {
                            self._positionDropdown();
                            self._resizeDropdown();
                        });
                        container.on('results:append', function () {
                            self._positionDropdown();
                            self._resizeDropdown();
                        });
                    }
                });
                container.on('close', function () {
                    self._hideDropdown();
                    self._detachPositioningHandler(container);
                });
                this.$dropdownContainer.on('mousedown', function (evt) {
                    evt.stopPropagation();
                });
            };
            AttachBody.prototype.destroy = function (decorated) {
                decorated.call(this);
                this.$dropdownContainer.remove();
            };
            AttachBody.prototype.position = function (decorated, $dropdown, $container) {
                // Clone all of the container classes
                $dropdown.attr('class', $container.attr('class'));
                $dropdown.removeClass('select2');
                $dropdown.addClass('select2-container--open');
                $dropdown.css({
                    position: 'absolute',
                    top: -999999
                });
                this.$container = $container;
            };
            AttachBody.prototype.render = function (decorated) {
                var $container = $('<span></span>');
                var $dropdown = decorated.call(this);
                $container.append($dropdown);
                this.$dropdownContainer = $container;
                return $container;
            };
            AttachBody.prototype._hideDropdown = function (decorated) {
                this.$dropdownContainer.detach();
            };
            AttachBody.prototype._attachPositioningHandler =
                function (decorated, container) {
                    var self = this;
                    var scrollEvent = 'scroll.select2.' + container.id;
                    var resizeEvent = 'resize.select2.' + container.id;
                    var orientationEvent = 'orientationchange.select2.' + container.id;
                    var $watchers = this.$container.parents().filter(Utils.hasScroll);
                    $watchers.each(function () {
                        Utils.StoreData(this, 'select2-scroll-position', {
                            x: $(this).scrollLeft(),
                            y: $(this).scrollTop()
                        });
                    });
                    $watchers.on(scrollEvent, function (ev) {
                        var position = Utils.GetData(this, 'select2-scroll-position');
                        $(this).scrollTop(position.y);
                    });
                    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent, function (e) {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });
                };
            AttachBody.prototype._detachPositioningHandler =
                function (decorated, container) {
                    var scrollEvent = 'scroll.select2.' + container.id;
                    var resizeEvent = 'resize.select2.' + container.id;
                    var orientationEvent = 'orientationchange.select2.' + container.id;
                    var $watchers = this.$container.parents().filter(Utils.hasScroll);
                    $watchers.off(scrollEvent);
                    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
                };
            AttachBody.prototype._positionDropdown = function () {
                var $window = $(window);
                var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
                var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');
                var newDirection = null;
                var offset = this.$container.offset();
                offset.bottom = offset.top + this.$container.outerHeight(false);
                var container = {
                    height: this.$container.outerHeight(false)
                };
                container.top = offset.top;
                container.bottom = offset.top + container.height;
                var dropdown = {
                    height: this.$dropdown.outerHeight(false)
                };
                var viewport = {
                    top: $window.scrollTop(),
                    bottom: $window.scrollTop() + $window.height()
                };
                var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
                var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);
                var css = {
                    left: offset.left,
                    top: container.bottom
                };
                // Determine what the parent element is to use for calculating the offset
                var $offsetParent = this.$dropdownParent;
                // For statically positioned elements, we need to get the element
                // that is determining the offset
                if ($offsetParent.css('position') === 'static') {
                    $offsetParent = $offsetParent.offsetParent();
                }
                var parentOffset = $offsetParent.offset();
                css.top -= parentOffset.top;
                css.left -= parentOffset.left;
                if (!isCurrentlyAbove && !isCurrentlyBelow) {
                    newDirection = 'below';
                }
                if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
                    newDirection = 'above';
                }
                else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
                    newDirection = 'below';
                }
                if (newDirection == 'above' ||
                    (isCurrentlyAbove && newDirection !== 'below')) {
                    css.top = container.top - parentOffset.top - dropdown.height;
                }
                if (newDirection != null) {
                    this.$dropdown
                        .removeClass('select2-dropdown--below select2-dropdown--above')
                        .addClass('select2-dropdown--' + newDirection);
                    this.$container
                        .removeClass('select2-container--below select2-container--above')
                        .addClass('select2-container--' + newDirection);
                }
                this.$dropdownContainer.css(css);
            };
            AttachBody.prototype._resizeDropdown = function () {
                var css = {
                    width: this.$container.outerWidth(false) + 'px'
                };
                if (this.options.get('dropdownAutoWidth')) {
                    css.minWidth = css.width;
                    css.position = 'relative';
                    css.width = 'auto';
                }
                this.$dropdown.css(css);
            };
            AttachBody.prototype._showDropdown = function (decorated) {
                this.$dropdownContainer.appendTo(this.$dropdownParent);
                this._positionDropdown();
                this._resizeDropdown();
            };
            return AttachBody;
        });
        S2.define('select2/dropdown/minimumResultsForSearch', [], function () {
            function countResults(data) {
                var count = 0;
                for (var d = 0; d < data.length; d++) {
                    var item = data[d];
                    if (item.children) {
                        count += countResults(item.children);
                    }
                    else {
                        count++;
                    }
                }
                return count;
            }
            function MinimumResultsForSearch(decorated, $element, options, dataAdapter) {
                this.minimumResultsForSearch = options.get('minimumResultsForSearch');
                if (this.minimumResultsForSearch < 0) {
                    this.minimumResultsForSearch = Infinity;
                }
                decorated.call(this, $element, options, dataAdapter);
            }
            MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
                if (countResults(params.data.results) < this.minimumResultsForSearch) {
                    return false;
                }
                return decorated.call(this, params);
            };
            return MinimumResultsForSearch;
        });
        S2.define('select2/dropdown/selectOnClose', [
            '../utils'
        ], function (Utils) {
            function SelectOnClose() { }
            SelectOnClose.prototype.bind = function (decorated, container, $container) {
                var self = this;
                decorated.call(this, container, $container);
                container.on('close', function (params) {
                    self._handleSelectOnClose(params);
                });
            };
            SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
                if (params && params.originalSelect2Event != null) {
                    var event = params.originalSelect2Event;
                    // Don't select an item if the close event was triggered from a select or
                    // unselect event
                    if (event._type === 'select' || event._type === 'unselect') {
                        return;
                    }
                }
                var $highlightedResults = this.getHighlightedResults();
                // Only select highlighted results
                if ($highlightedResults.length < 1) {
                    return;
                }
                var data = Utils.GetData($highlightedResults[0], 'data');
                // Don't re-select already selected resulte
                if ((data.element != null && data.element.selected) ||
                    (data.element == null && data.selected)) {
                    return;
                }
                this.trigger('select', {
                    data: data
                });
            };
            return SelectOnClose;
        });
        S2.define('select2/dropdown/closeOnSelect', [], function () {
            function CloseOnSelect() { }
            CloseOnSelect.prototype.bind = function (decorated, container, $container) {
                var self = this;
                decorated.call(this, container, $container);
                container.on('select', function (evt) {
                    self._selectTriggered(evt);
                });
                container.on('unselect', function (evt) {
                    self._selectTriggered(evt);
                });
            };
            CloseOnSelect.prototype._selectTriggered = function (_, evt) {
                var originalEvent = evt.originalEvent;
                // Don't close if the control key is being held
                if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) {
                    return;
                }
                this.trigger('close', {
                    originalEvent: originalEvent,
                    originalSelect2Event: evt
                });
            };
            return CloseOnSelect;
        });
        S2.define('select2/i18n/en', [], function () {
            // English
            return {
                errorLoading: function () {
                    return 'The results could not be loaded.';
                },
                inputTooLong: function (args) {
                    var overChars = args.input.length - args.maximum;
                    var message = 'Please delete ' + overChars + ' character';
                    if (overChars != 1) {
                        message += 's';
                    }
                    return message;
                },
                inputTooShort: function (args) {
                    var remainingChars = args.minimum - args.input.length;
                    var message = 'Please enter ' + remainingChars + ' or more characters';
                    return message;
                },
                loadingMore: function () {
                    return 'Loading more results…';
                },
                maximumSelected: function (args) {
                    var message = 'You can only select ' + args.maximum + ' item';
                    if (args.maximum != 1) {
                        message += 's';
                    }
                    return message;
                },
                noResults: function () {
                    return 'No results found';
                },
                searching: function () {
                    return 'Searching…';
                },
                removeAllItems: function () {
                    return 'Remove all items';
                }
            };
        });
        S2.define('select2/defaults', [
            'jquery',
            'require',
            './results',
            './selection/single',
            './selection/multiple',
            './selection/placeholder',
            './selection/allowClear',
            './selection/search',
            './selection/eventRelay',
            './utils',
            './translation',
            './diacritics',
            './data/select',
            './data/array',
            './data/ajax',
            './data/tags',
            './data/tokenizer',
            './data/minimumInputLength',
            './data/maximumInputLength',
            './data/maximumSelectionLength',
            './dropdown',
            './dropdown/search',
            './dropdown/hidePlaceholder',
            './dropdown/infiniteScroll',
            './dropdown/attachBody',
            './dropdown/minimumResultsForSearch',
            './dropdown/selectOnClose',
            './dropdown/closeOnSelect',
            './i18n/en'
        ], function ($, require, ResultsList, SingleSelection, MultipleSelection, Placeholder, AllowClear, SelectionSearch, EventRelay, Utils, Translation, DIACRITICS, SelectData, ArrayData, AjaxData, Tags, Tokenizer, MinimumInputLength, MaximumInputLength, MaximumSelectionLength, Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll, AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect, EnglishTranslation) {
            function Defaults() {
                this.reset();
            }
            Defaults.prototype.apply = function (options) {
                options = $.extend(true, {}, this.defaults, options);
                if (options.dataAdapter == null) {
                    if (options.ajax != null) {
                        options.dataAdapter = AjaxData;
                    }
                    else if (options.data != null) {
                        options.dataAdapter = ArrayData;
                    }
                    else {
                        options.dataAdapter = SelectData;
                    }
                    if (options.minimumInputLength > 0) {
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, MinimumInputLength);
                    }
                    if (options.maximumInputLength > 0) {
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, MaximumInputLength);
                    }
                    if (options.maximumSelectionLength > 0) {
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, MaximumSelectionLength);
                    }
                    if (options.tags) {
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
                    }
                    if (options.tokenSeparators != null || options.tokenizer != null) {
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tokenizer);
                    }
                    if (options.query != null) {
                        var Query = require(options.amdBase + 'compat/query');
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, Query);
                    }
                    if (options.initSelection != null) {
                        var InitSelection = require(options.amdBase + 'compat/initSelection');
                        options.dataAdapter = Utils.Decorate(options.dataAdapter, InitSelection);
                    }
                }
                if (options.resultsAdapter == null) {
                    options.resultsAdapter = ResultsList;
                    if (options.ajax != null) {
                        options.resultsAdapter = Utils.Decorate(options.resultsAdapter, InfiniteScroll);
                    }
                    if (options.placeholder != null) {
                        options.resultsAdapter = Utils.Decorate(options.resultsAdapter, HidePlaceholder);
                    }
                    if (options.selectOnClose) {
                        options.resultsAdapter = Utils.Decorate(options.resultsAdapter, SelectOnClose);
                    }
                }
                if (options.dropdownAdapter == null) {
                    if (options.multiple) {
                        options.dropdownAdapter = Dropdown;
                    }
                    else {
                        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);
                        options.dropdownAdapter = SearchableDropdown;
                    }
                    if (options.minimumResultsForSearch !== 0) {
                        options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, MinimumResultsForSearch);
                    }
                    if (options.closeOnSelect) {
                        options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, CloseOnSelect);
                    }
                    if (options.dropdownCssClass != null ||
                        options.dropdownCss != null ||
                        options.adaptDropdownCssClass != null) {
                        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');
                        options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, DropdownCSS);
                    }
                    options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, AttachBody);
                }
                if (options.selectionAdapter == null) {
                    if (options.multiple) {
                        options.selectionAdapter = MultipleSelection;
                    }
                    else {
                        options.selectionAdapter = SingleSelection;
                    }
                    // Add the placeholder mixin if a placeholder was specified
                    if (options.placeholder != null) {
                        options.selectionAdapter = Utils.Decorate(options.selectionAdapter, Placeholder);
                    }
                    if (options.allowClear) {
                        options.selectionAdapter = Utils.Decorate(options.selectionAdapter, AllowClear);
                    }
                    if (options.multiple) {
                        options.selectionAdapter = Utils.Decorate(options.selectionAdapter, SelectionSearch);
                    }
                    if (options.containerCssClass != null ||
                        options.containerCss != null ||
                        options.adaptContainerCssClass != null) {
                        var ContainerCSS = require(options.amdBase + 'compat/containerCss');
                        options.selectionAdapter = Utils.Decorate(options.selectionAdapter, ContainerCSS);
                    }
                    options.selectionAdapter = Utils.Decorate(options.selectionAdapter, EventRelay);
                }
                if (typeof options.language === 'string') {
                    // Check if the language is specified with a region
                    if (options.language.indexOf('-') > 0) {
                        // Extract the region information if it is included
                        var languageParts = options.language.split('-');
                        var baseLanguage = languageParts[0];
                        options.language = [options.language, baseLanguage];
                    }
                    else {
                        options.language = [options.language];
                    }
                }
                if ($.isArray(options.language)) {
                    var languages = new Translation();
                    options.language.push('en');
                    var languageNames = options.language;
                    for (var l = 0; l < languageNames.length; l++) {
                        var name = languageNames[l];
                        var language = {};
                        try {
                            // Try to load it with the original name
                            language = Translation.loadPath(name);
                        }
                        catch (e) {
                            try {
                                // If we couldn't load it, check if it wasn't the full path
                                name = this.defaults.amdLanguageBase + name;
                                language = Translation.loadPath(name);
                            }
                            catch (ex) {
                                // The translation could not be loaded at all. Sometimes this is
                                // because of a configuration problem, other times this can be
                                // because of how Select2 helps load all possible translation files.
                                if (options.debug && window.console && console.warn) {
                                    console.warn('Select2: The language file for "' + name + '" could not be ' +
                                        'automatically loaded. A fallback will be used instead.');
                                }
                                continue;
                            }
                        }
                        languages.extend(language);
                    }
                    options.translations = languages;
                }
                else {
                    var baseTranslation = Translation.loadPath(this.defaults.amdLanguageBase + 'en');
                    var customTranslation = new Translation(options.language);
                    customTranslation.extend(baseTranslation);
                    options.translations = customTranslation;
                }
                return options;
            };
            Defaults.prototype.reset = function () {
                function stripDiacritics(text) {
                    // Used 'uni range + named function' from http://jsperf.com/diacritics/18
                    function match(a) {
                        return DIACRITICS[a] || a;
                    }
                    return text.replace(/[^\u0000-\u007E]/g, match);
                }
                function matcher(params, data) {
                    // Always return the object if there is nothing to compare
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    // Do a recursive check for options with children
                    if (data.children && data.children.length > 0) {
                        // Clone the data object if there are children
                        // This is required as we modify the object to remove any non-matches
                        var match = $.extend(true, {}, data);
                        // Check each child of the option
                        for (var c = data.children.length - 1; c >= 0; c--) {
                            var child = data.children[c];
                            var matches = matcher(params, child);
                            // If there wasn't a match, remove the object in the array
                            if (matches == null) {
                                match.children.splice(c, 1);
                            }
                        }
                        // If any children matched, return the new object
                        if (match.children.length > 0) {
                            return match;
                        }
                        // If there were no matching children, check just the plain object
                        return matcher(params, match);
                    }
                    var original = stripDiacritics(data.text).toUpperCase();
                    var term = stripDiacritics(params.term).toUpperCase();
                    // Check if the text contains the term
                    if (original.indexOf(term) > -1) {
                        return data;
                    }
                    // If it doesn't contain the term, don't return anything
                    return null;
                }
                this.defaults = {
                    amdBase: './',
                    amdLanguageBase: './i18n/',
                    closeOnSelect: true,
                    debug: false,
                    dropdownAutoWidth: false,
                    escapeMarkup: Utils.escapeMarkup,
                    language: EnglishTranslation,
                    matcher: matcher,
                    minimumInputLength: 0,
                    maximumInputLength: 0,
                    maximumSelectionLength: 0,
                    minimumResultsForSearch: 0,
                    selectOnClose: false,
                    scrollAfterSelect: false,
                    sorter: function (data) {
                        return data;
                    },
                    templateResult: function (result) {
                        return result.text;
                    },
                    templateSelection: function (selection) {
                        return selection.text;
                    },
                    theme: 'default',
                    width: 'resolve'
                };
            };
            Defaults.prototype.set = function (key, value) {
                var camelKey = $.camelCase(key);
                var data = {};
                data[camelKey] = value;
                var convertedData = Utils._convertData(data);
                $.extend(true, this.defaults, convertedData);
            };
            var defaults = new Defaults();
            return defaults;
        });
        S2.define('select2/options', [
            'require',
            'jquery',
            './defaults',
            './utils'
        ], function (require, $, Defaults, Utils) {
            function Options(options, $element) {
                this.options = options;
                if ($element != null) {
                    this.fromElement($element);
                }
                this.options = Defaults.apply(this.options);
                if ($element && $element.is('input')) {
                    var InputCompat = require(this.get('amdBase') + 'compat/inputData');
                    this.options.dataAdapter = Utils.Decorate(this.options.dataAdapter, InputCompat);
                }
            }
            Options.prototype.fromElement = function ($e) {
                var excludedData = ['select2'];
                if (this.options.multiple == null) {
                    this.options.multiple = $e.prop('multiple');
                }
                if (this.options.disabled == null) {
                    this.options.disabled = $e.prop('disabled');
                }
                if (this.options.language == null) {
                    if ($e.prop('lang')) {
                        this.options.language = $e.prop('lang').toLowerCase();
                    }
                    else if ($e.closest('[lang]').prop('lang')) {
                        this.options.language = $e.closest('[lang]').prop('lang');
                    }
                }
                if (this.options.dir == null) {
                    if ($e.prop('dir')) {
                        this.options.dir = $e.prop('dir');
                    }
                    else if ($e.closest('[dir]').prop('dir')) {
                        this.options.dir = $e.closest('[dir]').prop('dir');
                    }
                    else {
                        this.options.dir = 'ltr';
                    }
                }
                $e.prop('disabled', this.options.disabled);
                $e.prop('multiple', this.options.multiple);
                if (Utils.GetData($e[0], 'select2Tags')) {
                    if (this.options.debug && window.console && console.warn) {
                        console.warn('Select2: The `data-select2-tags` attribute has been changed to ' +
                            'use the `data-data` and `data-tags="true"` attributes and will be ' +
                            'removed in future versions of Select2.');
                    }
                    Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
                    Utils.StoreData($e[0], 'tags', true);
                }
                if (Utils.GetData($e[0], 'ajaxUrl')) {
                    if (this.options.debug && window.console && console.warn) {
                        console.warn('Select2: The `data-ajax-url` attribute has been changed to ' +
                            '`data-ajax--url` and support for the old attribute will be removed' +
                            ' in future versions of Select2.');
                    }
                    $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
                    Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));
                }
                var dataset = {};
                function upperCaseLetter(_, letter) {
                    return letter.toUpperCase();
                }
                // Pre-load all of the attributes which are prefixed with `data-`
                for (var attr = 0; attr < $e[0].attributes.length; attr++) {
                    var attributeName = $e[0].attributes[attr].name;
                    var prefix = 'data-';
                    if (attributeName.substr(0, prefix.length) == prefix) {
                        // Get the contents of the attribute after `data-`
                        var dataName = attributeName.substring(prefix.length);
                        // Get the data contents from the consistent source
                        // This is more than likely the jQuery data helper
                        var dataValue = Utils.GetData($e[0], dataName);
                        // camelCase the attribute name to match the spec
                        var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);
                        // Store the data attribute contents into the dataset since
                        dataset[camelDataName] = dataValue;
                    }
                }
                // Prefer the element's `dataset` attribute if it exists
                // jQuery 1.x does not correctly handle data attributes with multiple dashes
                if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
                    dataset = $.extend(true, {}, $e[0].dataset, dataset);
                }
                // Prefer our internal data cache if it exists
                var data = $.extend(true, {}, Utils.GetData($e[0]), dataset);
                data = Utils._convertData(data);
                for (var key in data) {
                    if ($.inArray(key, excludedData) > -1) {
                        continue;
                    }
                    if ($.isPlainObject(this.options[key])) {
                        $.extend(this.options[key], data[key]);
                    }
                    else {
                        this.options[key] = data[key];
                    }
                }
                return this;
            };
            Options.prototype.get = function (key) {
                return this.options[key];
            };
            Options.prototype.set = function (key, val) {
                this.options[key] = val;
            };
            return Options;
        });
        S2.define('select2/core', [
            'jquery',
            './options',
            './utils',
            './keys'
        ], function ($, Options, Utils, KEYS) {
            var Select2 = function ($element, options) {
                if (Utils.GetData($element[0], 'select2') != null) {
                    Utils.GetData($element[0], 'select2').destroy();
                }
                this.$element = $element;
                this.id = this._generateId($element);
                options = options || {};
                this.options = new Options(options, $element);
                Select2.__super__.constructor.call(this);
                // Set up the tabindex
                var tabindex = $element.attr('tabindex') || 0;
                Utils.StoreData($element[0], 'old-tabindex', tabindex);
                $element.attr('tabindex', '-1');
                // Set up containers and adapters
                var DataAdapter = this.options.get('dataAdapter');
                this.dataAdapter = new DataAdapter($element, this.options);
                var $container = this.render();
                this._placeContainer($container);
                var SelectionAdapter = this.options.get('selectionAdapter');
                this.selection = new SelectionAdapter($element, this.options);
                this.$selection = this.selection.render();
                this.selection.position(this.$selection, $container);
                var DropdownAdapter = this.options.get('dropdownAdapter');
                this.dropdown = new DropdownAdapter($element, this.options);
                this.$dropdown = this.dropdown.render();
                this.dropdown.position(this.$dropdown, $container);
                var ResultsAdapter = this.options.get('resultsAdapter');
                this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
                this.$results = this.results.render();
                this.results.position(this.$results, this.$dropdown);
                // Bind events
                var self = this;
                // Bind the container to all of the adapters
                this._bindAdapters();
                // Register any DOM event handlers
                this._registerDomEvents();
                // Register any internal event handlers
                this._registerDataEvents();
                this._registerSelectionEvents();
                this._registerDropdownEvents();
                this._registerResultsEvents();
                this._registerEvents();
                // Set the initial state
                this.dataAdapter.current(function (initialData) {
                    self.trigger('selection:update', {
                        data: initialData
                    });
                });
                // Hide the original select
                $element.addClass('select2-hidden-accessible');
                $element.attr('aria-hidden', 'true');
                // Synchronize any monitored attributes
                this._syncAttributes();
                Utils.StoreData($element[0], 'select2', this);
                // Ensure backwards compatibility with $element.data('select2').
                $element.data('select2', this);
            };
            Utils.Extend(Select2, Utils.Observable);
            Select2.prototype._generateId = function ($element) {
                var id = '';
                if ($element.attr('id') != null) {
                    id = $element.attr('id');
                }
                else if ($element.attr('name') != null) {
                    id = $element.attr('name') + '-' + Utils.generateChars(2);
                }
                else {
                    id = Utils.generateChars(4);
                }
                id = id.replace(/(:|\.|\[|\]|,)/g, '');
                id = 'select2-' + id;
                return id;
            };
            Select2.prototype._placeContainer = function ($container) {
                $container.insertAfter(this.$element);
                var width = this._resolveWidth(this.$element, this.options.get('width'));
                if (width != null) {
                    $container.css('width', width);
                }
            };
            Select2.prototype._resolveWidth = function ($element, method) {
                var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                if (method == 'resolve') {
                    var styleWidth = this._resolveWidth($element, 'style');
                    if (styleWidth != null) {
                        return styleWidth;
                    }
                    return this._resolveWidth($element, 'element');
                }
                if (method == 'element') {
                    var elementWidth = $element.outerWidth(false);
                    if (elementWidth <= 0) {
                        return 'auto';
                    }
                    return elementWidth + 'px';
                }
                if (method == 'style') {
                    var style = $element.attr('style');
                    if (typeof (style) !== 'string') {
                        return null;
                    }
                    var attrs = style.split(';');
                    for (var i = 0, l = attrs.length; i < l; i = i + 1) {
                        var attr = attrs[i].replace(/\s/g, '');
                        var matches = attr.match(WIDTH);
                        if (matches !== null && matches.length >= 1) {
                            return matches[1];
                        }
                    }
                    return null;
                }
                return method;
            };
            Select2.prototype._bindAdapters = function () {
                this.dataAdapter.bind(this, this.$container);
                this.selection.bind(this, this.$container);
                this.dropdown.bind(this, this.$container);
                this.results.bind(this, this.$container);
            };
            Select2.prototype._registerDomEvents = function () {
                var self = this;
                this.$element.on('change.select2', function () {
                    self.dataAdapter.current(function (data) {
                        self.trigger('selection:update', {
                            data: data
                        });
                    });
                });
                this.$element.on('focus.select2', function (evt) {
                    self.trigger('focus', evt);
                });
                this._syncA = Utils.bind(this._syncAttributes, this);
                this._syncS = Utils.bind(this._syncSubtree, this);
                if (this.$element[0].attachEvent) {
                    this.$element[0].attachEvent('onpropertychange', this._syncA);
                }
                var observer = window.MutationObserver ||
                    window.WebKitMutationObserver ||
                    window.MozMutationObserver;
                if (observer != null) {
                    this._observer = new observer(function (mutations) {
                        $.each(mutations, self._syncA);
                        $.each(mutations, self._syncS);
                    });
                    this._observer.observe(this.$element[0], {
                        attributes: true,
                        childList: true,
                        subtree: false
                    });
                }
                else if (this.$element[0].addEventListener) {
                    this.$element[0].addEventListener('DOMAttrModified', self._syncA, false);
                    this.$element[0].addEventListener('DOMNodeInserted', self._syncS, false);
                    this.$element[0].addEventListener('DOMNodeRemoved', self._syncS, false);
                }
            };
            Select2.prototype._registerDataEvents = function () {
                var self = this;
                this.dataAdapter.on('*', function (name, params) {
                    self.trigger(name, params);
                });
            };
            Select2.prototype._registerSelectionEvents = function () {
                var self = this;
                var nonRelayEvents = ['toggle', 'focus'];
                this.selection.on('toggle', function () {
                    self.toggleDropdown();
                });
                this.selection.on('focus', function (params) {
                    self.focus(params);
                });
                this.selection.on('*', function (name, params) {
                    if ($.inArray(name, nonRelayEvents) !== -1) {
                        return;
                    }
                    self.trigger(name, params);
                });
            };
            Select2.prototype._registerDropdownEvents = function () {
                var self = this;
                this.dropdown.on('*', function (name, params) {
                    self.trigger(name, params);
                });
            };
            Select2.prototype._registerResultsEvents = function () {
                var self = this;
                this.results.on('*', function (name, params) {
                    self.trigger(name, params);
                });
            };
            Select2.prototype._registerEvents = function () {
                var self = this;
                this.on('open', function () {
                    self.$container.addClass('select2-container--open');
                });
                this.on('close', function () {
                    self.$container.removeClass('select2-container--open');
                });
                this.on('enable', function () {
                    self.$container.removeClass('select2-container--disabled');
                });
                this.on('disable', function () {
                    self.$container.addClass('select2-container--disabled');
                });
                this.on('blur', function () {
                    self.$container.removeClass('select2-container--focus');
                });
                this.on('query', function (params) {
                    if (!self.isOpen()) {
                        self.trigger('open', {});
                    }
                    this.dataAdapter.query(params, function (data) {
                        self.trigger('results:all', {
                            data: data,
                            query: params
                        });
                    });
                });
                this.on('query:append', function (params) {
                    this.dataAdapter.query(params, function (data) {
                        self.trigger('results:append', {
                            data: data,
                            query: params
                        });
                    });
                });
                this.on('keypress', function (evt) {
                    var key = evt.which;
                    if (self.isOpen()) {
                        if (key === KEYS.ESC || key === KEYS.TAB ||
                            (key === KEYS.UP && evt.altKey)) {
                            self.close();
                            evt.preventDefault();
                        }
                        else if (key === KEYS.ENTER) {
                            self.trigger('results:select', {});
                            evt.preventDefault();
                        }
                        else if ((key === KEYS.SPACE && evt.ctrlKey)) {
                            self.trigger('results:toggle', {});
                            evt.preventDefault();
                        }
                        else if (key === KEYS.UP) {
                            self.trigger('results:previous', {});
                            evt.preventDefault();
                        }
                        else if (key === KEYS.DOWN) {
                            self.trigger('results:next', {});
                            evt.preventDefault();
                        }
                    }
                    else {
                        if (key === KEYS.ENTER || key === KEYS.SPACE ||
                            (key === KEYS.DOWN && evt.altKey)) {
                            self.open();
                            evt.preventDefault();
                        }
                    }
                });
            };
            Select2.prototype._syncAttributes = function () {
                this.options.set('disabled', this.$element.prop('disabled'));
                if (this.options.get('disabled')) {
                    if (this.isOpen()) {
                        this.close();
                    }
                    this.trigger('disable', {});
                }
                else {
                    this.trigger('enable', {});
                }
            };
            Select2.prototype._syncSubtree = function (evt, mutations) {
                var changed = false;
                var self = this;
                // Ignore any mutation events raised for elements that aren't options or
                // optgroups. This handles the case when the select element is destroyed
                if (evt && evt.target && (evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP')) {
                    return;
                }
                if (!mutations) {
                    // If mutation events aren't supported, then we can only assume that the
                    // change affected the selections
                    changed = true;
                }
                else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
                    for (var n = 0; n < mutations.addedNodes.length; n++) {
                        var node = mutations.addedNodes[n];
                        if (node.selected) {
                            changed = true;
                        }
                    }
                }
                else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
                    changed = true;
                }
                // Only re-pull the data if we think there is a change
                if (changed) {
                    this.dataAdapter.current(function (currentData) {
                        self.trigger('selection:update', {
                            data: currentData
                        });
                    });
                }
            };
            /**
             * Override the trigger method to automatically trigger pre-events when
             * there are events that can be prevented.
             */
            Select2.prototype.trigger = function (name, args) {
                var actualTrigger = Select2.__super__.trigger;
                var preTriggerMap = {
                    'open': 'opening',
                    'close': 'closing',
                    'select': 'selecting',
                    'unselect': 'unselecting',
                    'clear': 'clearing'
                };
                if (args === undefined) {
                    args = {};
                }
                if (name in preTriggerMap) {
                    var preTriggerName = preTriggerMap[name];
                    var preTriggerArgs = {
                        prevented: false,
                        name: name,
                        args: args
                    };
                    actualTrigger.call(this, preTriggerName, preTriggerArgs);
                    if (preTriggerArgs.prevented) {
                        args.prevented = true;
                        return;
                    }
                }
                actualTrigger.call(this, name, args);
            };
            Select2.prototype.toggleDropdown = function () {
                if (this.options.get('disabled')) {
                    return;
                }
                if (this.isOpen()) {
                    this.close();
                }
                else {
                    this.open();
                }
            };
            Select2.prototype.open = function () {
                if (this.isOpen()) {
                    return;
                }
                this.trigger('query', {});
            };
            Select2.prototype.close = function () {
                if (!this.isOpen()) {
                    return;
                }
                this.trigger('close', {});
            };
            Select2.prototype.isOpen = function () {
                return this.$container.hasClass('select2-container--open');
            };
            Select2.prototype.hasFocus = function () {
                return this.$container.hasClass('select2-container--focus');
            };
            Select2.prototype.focus = function (data) {
                // No need to re-trigger focus events if we are already focused
                if (this.hasFocus()) {
                    return;
                }
                this.$container.addClass('select2-container--focus');
                this.trigger('focus', {});
            };
            Select2.prototype.enable = function (args) {
                if (this.options.get('debug') && window.console && console.warn) {
                    console.warn('Select2: The `select2("enable")` method has been deprecated and will' +
                        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
                        ' instead.');
                }
                if (args == null || args.length === 0) {
                    args = [true];
                }
                var disabled = !args[0];
                this.$element.prop('disabled', disabled);
            };
            Select2.prototype.data = function () {
                if (this.options.get('debug') &&
                    arguments.length > 0 && window.console && console.warn) {
                    console.warn('Select2: Data can no longer be set using `select2("data")`. You ' +
                        'should consider setting the value instead using `$element.val()`.');
                }
                var data = [];
                this.dataAdapter.current(function (currentData) {
                    data = currentData;
                });
                return data;
            };
            Select2.prototype.val = function (args) {
                if (this.options.get('debug') && window.console && console.warn) {
                    console.warn('Select2: The `select2("val")` method has been deprecated and will be' +
                        ' removed in later Select2 versions. Use $element.val() instead.');
                }
                if (args == null || args.length === 0) {
                    return this.$element.val();
                }
                var newVal = args[0];
                if ($.isArray(newVal)) {
                    newVal = $.map(newVal, function (obj) {
                        return obj.toString();
                    });
                }
                this.$element.val(newVal).trigger('change');
            };
            Select2.prototype.destroy = function () {
                this.$container.remove();
                if (this.$element[0].detachEvent) {
                    this.$element[0].detachEvent('onpropertychange', this._syncA);
                }
                if (this._observer != null) {
                    this._observer.disconnect();
                    this._observer = null;
                }
                else if (this.$element[0].removeEventListener) {
                    this.$element[0]
                        .removeEventListener('DOMAttrModified', this._syncA, false);
                    this.$element[0]
                        .removeEventListener('DOMNodeInserted', this._syncS, false);
                    this.$element[0]
                        .removeEventListener('DOMNodeRemoved', this._syncS, false);
                }
                this._syncA = null;
                this._syncS = null;
                this.$element.off('.select2');
                this.$element.attr('tabindex', Utils.GetData(this.$element[0], 'old-tabindex'));
                this.$element.removeClass('select2-hidden-accessible');
                this.$element.attr('aria-hidden', 'false');
                Utils.RemoveData(this.$element[0]);
                this.$element.removeData('select2');
                this.dataAdapter.destroy();
                this.selection.destroy();
                this.dropdown.destroy();
                this.results.destroy();
                this.dataAdapter = null;
                this.selection = null;
                this.dropdown = null;
                this.results = null;
            };
            Select2.prototype.render = function () {
                var $container = $('<span class="select2 select2-container">' +
                    '<span class="selection"></span>' +
                    '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
                    '</span>');
                $container.attr('dir', this.options.get('dir'));
                this.$container = $container;
                this.$container.addClass('select2-container--' + this.options.get('theme'));
                Utils.StoreData($container[0], 'element', this.$element);
                return $container;
            };
            return Select2;
        });
        S2.define('select2/compat/utils', [
            'jquery'
        ], function ($) {
            function syncCssClasses($dest, $src, adapter) {
                var classes, replacements = [], adapted;
                classes = $.trim($dest.attr('class'));
                if (classes) {
                    classes = '' + classes; // for IE which returns object
                    $(classes.split(/\s+/)).each(function () {
                        // Save all Select2 classes
                        if (this.indexOf('select2-') === 0) {
                            replacements.push(this);
                        }
                    });
                }
                classes = $.trim($src.attr('class'));
                if (classes) {
                    classes = '' + classes; // for IE which returns object
                    $(classes.split(/\s+/)).each(function () {
                        // Only adapt non-Select2 classes
                        if (this.indexOf('select2-') !== 0) {
                            adapted = adapter(this);
                            if (adapted != null) {
                                replacements.push(adapted);
                            }
                        }
                    });
                }
                $dest.attr('class', replacements.join(' '));
            }
            return {
                syncCssClasses: syncCssClasses
            };
        });
        S2.define('select2/compat/containerCss', [
            'jquery',
            './utils'
        ], function ($, CompatUtils) {
            // No-op CSS adapter that discards all classes by default
            function _containerAdapter(clazz) {
                return null;
            }
            function ContainerCSS() { }
            ContainerCSS.prototype.render = function (decorated) {
                var $container = decorated.call(this);
                var containerCssClass = this.options.get('containerCssClass') || '';
                if ($.isFunction(containerCssClass)) {
                    containerCssClass = containerCssClass(this.$element);
                }
                var containerCssAdapter = this.options.get('adaptContainerCssClass');
                containerCssAdapter = containerCssAdapter || _containerAdapter;
                if (containerCssClass.indexOf(':all:') !== -1) {
                    containerCssClass = containerCssClass.replace(':all:', '');
                    var _cssAdapter = containerCssAdapter;
                    containerCssAdapter = function (clazz) {
                        var adapted = _cssAdapter(clazz);
                        if (adapted != null) {
                            // Append the old one along with the adapted one
                            return adapted + ' ' + clazz;
                        }
                        return clazz;
                    };
                }
                var containerCss = this.options.get('containerCss') || {};
                if ($.isFunction(containerCss)) {
                    containerCss = containerCss(this.$element);
                }
                CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);
                $container.css(containerCss);
                $container.addClass(containerCssClass);
                return $container;
            };
            return ContainerCSS;
        });
        S2.define('select2/compat/dropdownCss', [
            'jquery',
            './utils'
        ], function ($, CompatUtils) {
            // No-op CSS adapter that discards all classes by default
            function _dropdownAdapter(clazz) {
                return null;
            }
            function DropdownCSS() { }
            DropdownCSS.prototype.render = function (decorated) {
                var $dropdown = decorated.call(this);
                var dropdownCssClass = this.options.get('dropdownCssClass') || '';
                if ($.isFunction(dropdownCssClass)) {
                    dropdownCssClass = dropdownCssClass(this.$element);
                }
                var dropdownCssAdapter = this.options.get('adaptDropdownCssClass');
                dropdownCssAdapter = dropdownCssAdapter || _dropdownAdapter;
                if (dropdownCssClass.indexOf(':all:') !== -1) {
                    dropdownCssClass = dropdownCssClass.replace(':all:', '');
                    var _cssAdapter = dropdownCssAdapter;
                    dropdownCssAdapter = function (clazz) {
                        var adapted = _cssAdapter(clazz);
                        if (adapted != null) {
                            // Append the old one along with the adapted one
                            return adapted + ' ' + clazz;
                        }
                        return clazz;
                    };
                }
                var dropdownCss = this.options.get('dropdownCss') || {};
                if ($.isFunction(dropdownCss)) {
                    dropdownCss = dropdownCss(this.$element);
                }
                CompatUtils.syncCssClasses($dropdown, this.$element, dropdownCssAdapter);
                $dropdown.css(dropdownCss);
                $dropdown.addClass(dropdownCssClass);
                return $dropdown;
            };
            return DropdownCSS;
        });
        S2.define('select2/compat/initSelection', [
            'jquery'
        ], function ($) {
            function InitSelection(decorated, $element, options) {
                if (options.get('debug') && window.console && console.warn) {
                    console.warn('Select2: The `initSelection` option has been deprecated in favor' +
                        ' of a custom data adapter that overrides the `current` method. ' +
                        'This method is now called multiple times instead of a single ' +
                        'time when the instance is initialized. Support will be removed ' +
                        'for the `initSelection` option in future versions of Select2');
                }
                this.initSelection = options.get('initSelection');
                this._isInitialized = false;
                decorated.call(this, $element, options);
            }
            InitSelection.prototype.current = function (decorated, callback) {
                var self = this;
                if (this._isInitialized) {
                    decorated.call(this, callback);
                    return;
                }
                this.initSelection.call(null, this.$element, function (data) {
                    self._isInitialized = true;
                    if (!$.isArray(data)) {
                        data = [data];
                    }
                    callback(data);
                });
            };
            return InitSelection;
        });
        S2.define('select2/compat/inputData', [
            'jquery',
            '../utils'
        ], function ($, Utils) {
            function InputData(decorated, $element, options) {
                this._currentData = [];
                this._valueSeparator = options.get('valueSeparator') || ',';
                if ($element.prop('type') === 'hidden') {
                    if (options.get('debug') && console && console.warn) {
                        console.warn('Select2: Using a hidden input with Select2 is no longer ' +
                            'supported and may stop working in the future. It is recommended ' +
                            'to use a `<select>` element instead.');
                    }
                }
                decorated.call(this, $element, options);
            }
            InputData.prototype.current = function (_, callback) {
                function getSelected(data, selectedIds) {
                    var selected = [];
                    if (data.selected || $.inArray(data.id, selectedIds) !== -1) {
                        data.selected = true;
                        selected.push(data);
                    }
                    else {
                        data.selected = false;
                    }
                    if (data.children) {
                        selected.push.apply(selected, getSelected(data.children, selectedIds));
                    }
                    return selected;
                }
                var selected = [];
                for (var d = 0; d < this._currentData.length; d++) {
                    var data = this._currentData[d];
                    selected.push.apply(selected, getSelected(data, this.$element.val().split(this._valueSeparator)));
                }
                callback(selected);
            };
            InputData.prototype.select = function (_, data) {
                if (!this.options.get('multiple')) {
                    this.current(function (allData) {
                        $.map(allData, function (data) {
                            data.selected = false;
                        });
                    });
                    this.$element.val(data.id);
                    this.$element.trigger('change');
                }
                else {
                    var value = this.$element.val();
                    value += this._valueSeparator + data.id;
                    this.$element.val(value);
                    this.$element.trigger('change');
                }
            };
            InputData.prototype.unselect = function (_, data) {
                var self = this;
                data.selected = false;
                this.current(function (allData) {
                    var values = [];
                    for (var d = 0; d < allData.length; d++) {
                        var item = allData[d];
                        if (data.id == item.id) {
                            continue;
                        }
                        values.push(item.id);
                    }
                    self.$element.val(values.join(self._valueSeparator));
                    self.$element.trigger('change');
                });
            };
            InputData.prototype.query = function (_, params, callback) {
                var results = [];
                for (var d = 0; d < this._currentData.length; d++) {
                    var data = this._currentData[d];
                    var matches = this.matches(params, data);
                    if (matches !== null) {
                        results.push(matches);
                    }
                }
                callback({
                    results: results
                });
            };
            InputData.prototype.addOptions = function (_, $options) {
                var options = $.map($options, function ($option) {
                    return Utils.GetData($option[0], 'data');
                });
                this._currentData.push.apply(this._currentData, options);
            };
            return InputData;
        });
        S2.define('select2/compat/matcher', [
            'jquery'
        ], function ($) {
            function oldMatcher(matcher) {
                function wrappedMatcher(params, data) {
                    var match = $.extend(true, {}, data);
                    if (params.term == null || $.trim(params.term) === '') {
                        return match;
                    }
                    if (data.children) {
                        for (var c = data.children.length - 1; c >= 0; c--) {
                            var child = data.children[c];
                            // Check if the child object matches
                            // The old matcher returned a boolean true or false
                            var doesMatch = matcher(params.term, child.text, child);
                            // If the child didn't match, pop it off
                            if (!doesMatch) {
                                match.children.splice(c, 1);
                            }
                        }
                        if (match.children.length > 0) {
                            return match;
                        }
                    }
                    if (matcher(params.term, data.text, data)) {
                        return match;
                    }
                    return null;
                }
                return wrappedMatcher;
            }
            return oldMatcher;
        });
        S2.define('select2/compat/query', [], function () {
            function Query(decorated, $element, options) {
                if (options.get('debug') && window.console && console.warn) {
                    console.warn('Select2: The `query` option has been deprecated in favor of a ' +
                        'custom data adapter that overrides the `query` method. Support ' +
                        'will be removed for the `query` option in future versions of ' +
                        'Select2.');
                }
                decorated.call(this, $element, options);
            }
            Query.prototype.query = function (_, params, callback) {
                params.callback = callback;
                var query = this.options.get('query');
                query.call(null, params);
            };
            return Query;
        });
        S2.define('select2/dropdown/attachContainer', [], function () {
            function AttachContainer(decorated, $element, options) {
                decorated.call(this, $element, options);
            }
            AttachContainer.prototype.position =
                function (decorated, $dropdown, $container) {
                    var $dropdownContainer = $container.find('.dropdown-wrapper');
                    $dropdownContainer.append($dropdown);
                    $dropdown.addClass('select2-dropdown--below');
                    $container.addClass('select2-container--below');
                };
            return AttachContainer;
        });
        S2.define('select2/dropdown/stopPropagation', [], function () {
            function StopPropagation() { }
            StopPropagation.prototype.bind = function (decorated, container, $container) {
                decorated.call(this, container, $container);
                var stoppedEvents = [
                    'blur',
                    'change',
                    'click',
                    'dblclick',
                    'focus',
                    'focusin',
                    'focusout',
                    'input',
                    'keydown',
                    'keyup',
                    'keypress',
                    'mousedown',
                    'mouseenter',
                    'mouseleave',
                    'mousemove',
                    'mouseover',
                    'mouseup',
                    'search',
                    'touchend',
                    'touchstart'
                ];
                this.$dropdown.on(stoppedEvents.join(' '), function (evt) {
                    evt.stopPropagation();
                });
            };
            return StopPropagation;
        });
        S2.define('select2/selection/stopPropagation', [], function () {
            function StopPropagation() { }
            StopPropagation.prototype.bind = function (decorated, container, $container) {
                decorated.call(this, container, $container);
                var stoppedEvents = [
                    'blur',
                    'change',
                    'click',
                    'dblclick',
                    'focus',
                    'focusin',
                    'focusout',
                    'input',
                    'keydown',
                    'keyup',
                    'keypress',
                    'mousedown',
                    'mouseenter',
                    'mouseleave',
                    'mousemove',
                    'mouseover',
                    'mouseup',
                    'search',
                    'touchend',
                    'touchstart'
                ];
                this.$selection.on(stoppedEvents.join(' '), function (evt) {
                    evt.stopPropagation();
                });
            };
            return StopPropagation;
        });
        /*!
         * jQuery Mousewheel 3.1.13
         *
         * Copyright jQuery Foundation and other contributors
         * Released under the MIT license
         * http://jquery.org/license
         */
        (function (factory) {
            if (typeof S2.define === 'function' && S2.define.amd) {
                // AMD. Register as an anonymous module.
                S2.define('jquery-mousewheel', ['jquery'], factory);
            }
            else if (typeof exports === 'object') {
                // Node/CommonJS style for Browserify
                module.exports = factory;
            }
            else {
                // Browser globals
                factory(jQuery);
            }
        }(function ($) {
            var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'], toBind = ('onwheel' in document || document.documentMode >= 9) ?
                ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'], slice = Array.prototype.slice, nullLowestDeltaTimeout, lowestDelta;
            if ($.event.fixHooks) {
                for (var i = toFix.length; i;) {
                    $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
                }
            }
            var special = $.event.special.mousewheel = {
                version: '3.1.12',
                setup: function () {
                    if (this.addEventListener) {
                        for (var i = toBind.length; i;) {
                            this.addEventListener(toBind[--i], handler, false);
                        }
                    }
                    else {
                        this.onmousewheel = handler;
                    }
                    // Store the line height and page height for this particular element
                    $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
                    $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
                },
                teardown: function () {
                    if (this.removeEventListener) {
                        for (var i = toBind.length; i;) {
                            this.removeEventListener(toBind[--i], handler, false);
                        }
                    }
                    else {
                        this.onmousewheel = null;
                    }
                    // Clean up the data we added to the element
                    $.removeData(this, 'mousewheel-line-height');
                    $.removeData(this, 'mousewheel-page-height');
                },
                getLineHeight: function (elem) {
                    var $elem = $(elem), $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
                    if (!$parent.length) {
                        $parent = $('body');
                    }
                    return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
                },
                getPageHeight: function (elem) {
                    return $(elem).height();
                },
                settings: {
                    adjustOldDeltas: true,
                    normalizeOffset: true // calls getBoundingClientRect for each event
                }
            };
            $.fn.extend({
                mousewheel: function (fn) {
                    return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
                },
                unmousewheel: function (fn) {
                    return this.unbind('mousewheel', fn);
                }
            });
            function handler(event) {
                var orgEvent = event || window.event, args = slice.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, offsetX = 0, offsetY = 0;
                event = $.event.fix(orgEvent);
                event.type = 'mousewheel';
                // Old school scrollwheel delta
                if ('detail' in orgEvent) {
                    deltaY = orgEvent.detail * -1;
                }
                if ('wheelDelta' in orgEvent) {
                    deltaY = orgEvent.wheelDelta;
                }
                if ('wheelDeltaY' in orgEvent) {
                    deltaY = orgEvent.wheelDeltaY;
                }
                if ('wheelDeltaX' in orgEvent) {
                    deltaX = orgEvent.wheelDeltaX * -1;
                }
                // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
                if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
                    deltaX = deltaY * -1;
                    deltaY = 0;
                }
                // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
                delta = deltaY === 0 ? deltaX : deltaY;
                // New school wheel delta (wheel event)
                if ('deltaY' in orgEvent) {
                    deltaY = orgEvent.deltaY * -1;
                    delta = deltaY;
                }
                if ('deltaX' in orgEvent) {
                    deltaX = orgEvent.deltaX;
                    if (deltaY === 0) {
                        delta = deltaX * -1;
                    }
                }
                // No change actually happened, no reason to go any further
                if (deltaY === 0 && deltaX === 0) {
                    return;
                }
                // Need to convert lines and pages to pixels if we aren't already in pixels
                // There are three delta modes:
                //   * deltaMode 0 is by pixels, nothing to do
                //   * deltaMode 1 is by lines
                //   * deltaMode 2 is by pages
                if (orgEvent.deltaMode === 1) {
                    var lineHeight = $.data(this, 'mousewheel-line-height');
                    delta *= lineHeight;
                    deltaY *= lineHeight;
                    deltaX *= lineHeight;
                }
                else if (orgEvent.deltaMode === 2) {
                    var pageHeight = $.data(this, 'mousewheel-page-height');
                    delta *= pageHeight;
                    deltaY *= pageHeight;
                    deltaX *= pageHeight;
                }
                // Store lowest absolute delta to normalize the delta values
                absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
                if (!lowestDelta || absDelta < lowestDelta) {
                    lowestDelta = absDelta;
                    // Adjust older deltas if necessary
                    if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                        lowestDelta /= 40;
                    }
                }
                // Adjust older deltas if necessary
                if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                    // Divide all the things by 40!
                    delta /= 40;
                    deltaX /= 40;
                    deltaY /= 40;
                }
                // Get a whole, normalized value for the deltas
                delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
                deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
                deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
                // Normalise offsetX and offsetY properties
                if (special.settings.normalizeOffset && this.getBoundingClientRect) {
                    var boundingRect = this.getBoundingClientRect();
                    offsetX = event.clientX - boundingRect.left;
                    offsetY = event.clientY - boundingRect.top;
                }
                // Add information to the event object
                event.deltaX = deltaX;
                event.deltaY = deltaY;
                event.deltaFactor = lowestDelta;
                event.offsetX = offsetX;
                event.offsetY = offsetY;
                // Go ahead and set deltaMode to 0 since we converted to pixels
                // Although this is a little odd since we overwrite the deltaX/Y
                // properties with normalized deltas.
                event.deltaMode = 0;
                // Add event and delta to the front of the arguments
                args.unshift(event, delta, deltaX, deltaY);
                // Clearout lowestDelta after sometime to better
                // handle multiple device types that give different
                // a different lowestDelta
                // Ex: trackpad = 3 and mouse wheel = 120
                if (nullLowestDeltaTimeout) {
                    clearTimeout(nullLowestDeltaTimeout);
                }
                nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
                return ($.event.dispatch || $.event.handle).apply(this, args);
            }
            function nullLowestDelta() {
                lowestDelta = null;
            }
            function shouldAdjustOldDeltas(orgEvent, absDelta) {
                // If this is an older event and the delta is divisable by 120,
                // then we are assuming that the browser is treating this as an
                // older mouse wheel event and that we should divide the deltas
                // by 40 to try and get a more usable deltaFactor.
                // Side note, this actually impacts the reported scroll distance
                // in older browsers and can cause scrolling to be slower than native.
                // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
                return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
            }
        }));
        S2.define('jquery.select2', [
            'jquery',
            'jquery-mousewheel',
            './select2/core',
            './select2/defaults',
            './select2/utils'
        ], function ($, _, Select2, Defaults, Utils) {
            if ($.fn.select2 == null) {
                // All methods that should return the element
                var thisMethods = ['open', 'close', 'destroy'];
                $.fn.select2 = function (options) {
                    options = options || {};
                    if (typeof options === 'object') {
                        this.each(function () {
                            var instanceOptions = $.extend(true, {}, options);
                            var instance = new Select2($(this), instanceOptions);
                        });
                        return this;
                    }
                    else if (typeof options === 'string') {
                        var ret;
                        var args = Array.prototype.slice.call(arguments, 1);
                        this.each(function () {
                            var instance = Utils.GetData(this, 'select2');
                            if (instance == null && window.console && console.error) {
                                console.error('The select2(\'' + options + '\') method was called on an ' +
                                    'element that is not using Select2.');
                            }
                            ret = instance[options].apply(instance, args);
                        });
                        // Check if we should be returning `this`
                        if ($.inArray(options, thisMethods) > -1) {
                            return this;
                        }
                        return ret;
                    }
                    else {
                        throw new Error('Invalid arguments for Select2: ' + options);
                    }
                };
            }
            if ($.fn.select2.defaults == null) {
                $.fn.select2.defaults = Defaults;
            }
            return Select2;
        });
        // Return the AMD loader configuration so it can be used outside of this file
        return {
            define: S2.define,
            require: S2.require
        };
    }());
    // Autoload the jQuery bindings
    // We know that all of the modules exist above this, so we're safe
    var select2 = S2.require('jquery.select2');
    // Hold the AMD module references on the jQuery function that was just loaded
    // This allows Select2 to use the internal loader outside of this file, such
    // as in the language files.
    jQuery.fn.select2.amd = S2;
    // Return the Select2 instance for anyone who is importing it.
    return select2;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0Mi5mdWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL3NlbGVjdDIvanMvc2VsZWN0Mi5mdWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILENBQUM7QUFBQSxDQUFDLFVBQVUsT0FBTztJQUNqQixJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQzlDLHdDQUF3QztRQUN4QyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM3QjtTQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDdkQsZ0JBQWdCO1FBQ2hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsTUFBTTtZQUNyQyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLDhEQUE4RDtnQkFDOUQsMkRBQTJEO2dCQUMzRCw4REFBOEQ7Z0JBQzlELHFDQUFxQztnQkFDckMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7b0JBQ2pDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzVCO3FCQUNJO29CQUNILE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2xDO2FBQ0Y7WUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEIsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDO0tBQ0g7U0FBTTtRQUNMLGtCQUFrQjtRQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakI7QUFDSCxDQUFDLENBQUUsVUFBVSxNQUFNO0lBQ2pCLHlFQUF5RTtJQUN6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RUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dC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LENBQUM7SUFDSixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRUgsK0JBQStCO0lBQy9CLGtFQUFrRTtJQUNsRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFM0MsNkVBQTZFO0lBQzdFLDRFQUE0RTtJQUM1RSw0QkFBNEI7SUFDNUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUUzQiw4REFBOEQ7SUFDOUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogU2VsZWN0MiA0LjAuN1xuICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xuICpcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3NlbGVjdDIvc2VsZWN0Mi9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBOb2RlL0NvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm9vdCwgalF1ZXJ5KSB7XG4gICAgICBpZiAoalF1ZXJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gcmVxdWlyZSgnalF1ZXJ5JykgcmV0dXJucyBhIGZhY3RvcnkgdGhhdCByZXF1aXJlcyB3aW5kb3cgdG9cbiAgICAgICAgLy8gYnVpbGQgYSBqUXVlcnkgaW5zdGFuY2UsIHdlIG5vcm1hbGl6ZSBob3cgd2UgdXNlIG1vZHVsZXNcbiAgICAgICAgLy8gdGhhdCByZXF1aXJlIHRoaXMgcGF0dGVybiBidXQgdGhlIHdpbmRvdyBwcm92aWRlZCBpcyBhIG5vb3BcbiAgICAgICAgLy8gaWYgaXQncyBkZWZpbmVkIChob3cganF1ZXJ5IHdvcmtzKVxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKShyb290KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZmFjdG9yeShqUXVlcnkpO1xuICAgICAgcmV0dXJuIGpRdWVyeTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgfVxufSAoZnVuY3Rpb24gKGpRdWVyeSkge1xuICAvLyBUaGlzIGlzIG5lZWRlZCBzbyB3ZSBjYW4gY2F0Y2ggdGhlIEFNRCBsb2FkZXIgY29uZmlndXJhdGlvbiBhbmQgdXNlIGl0XG4gIC8vIFRoZSBpbm5lciBmaWxlIHNob3VsZCBiZSB3cmFwcGVkIChieSBgYmFubmVyLnN0YXJ0LmpzYCkgaW4gYSBmdW5jdGlvbiB0aGF0XG4gIC8vIHJldHVybnMgdGhlIEFNRCBsb2FkZXIgcmVmZXJlbmNlcy5cbiAgdmFyIFMyID0oZnVuY3Rpb24gKCkge1xuICAvLyBSZXN0b3JlIHRoZSBTZWxlY3QyIEFNRCBsb2FkZXIgc28gaXQgY2FuIGJlIHVzZWRcbiAgLy8gTmVlZGVkIG1vc3RseSBpbiB0aGUgbGFuZ3VhZ2UgZmlsZXMsIHdoZXJlIHRoZSBsb2FkZXIgaXMgbm90IGluc2VydGVkXG4gIGlmIChqUXVlcnkgJiYgalF1ZXJ5LmZuICYmIGpRdWVyeS5mbi5zZWxlY3QyICYmIGpRdWVyeS5mbi5zZWxlY3QyLmFtZCkge1xuICAgIHZhciBTMiA9IGpRdWVyeS5mbi5zZWxlY3QyLmFtZDtcbiAgfVxudmFyIFMyOyhmdW5jdGlvbiAoKSB7IGlmICghUzIgfHwgIVMyLnJlcXVpcmVqcykge1xuaWYgKCFTMikgeyBTMiA9IHt9OyB9IGVsc2UgeyByZXF1aXJlID0gUzI7IH1cbi8qKlxuICogQGxpY2Vuc2UgYWxtb25kIDAuMy4zIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzLlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UsIGh0dHA6Ly9naXRodWIuY29tL3JlcXVpcmVqcy9hbG1vbmQvTElDRU5TRVxuICovXG4vL0dvaW5nIHNsb3BweSB0byBhdm9pZCAndXNlIHN0cmljdCcgc3RyaW5nIGNvc3QsIGJ1dCBzdHJpY3QgcHJhY3RpY2VzIHNob3VsZFxuLy9iZSBmb2xsb3dlZC5cbi8qZ2xvYmFsIHNldFRpbWVvdXQ6IGZhbHNlICovXG5cbnZhciByZXF1aXJlanMsIHJlcXVpcmUsIGRlZmluZTtcbihmdW5jdGlvbiAodW5kZWYpIHtcbiAgICB2YXIgbWFpbiwgcmVxLCBtYWtlTWFwLCBoYW5kbGVycyxcbiAgICAgICAgZGVmaW5lZCA9IHt9LFxuICAgICAgICB3YWl0aW5nID0ge30sXG4gICAgICAgIGNvbmZpZyA9IHt9LFxuICAgICAgICBkZWZpbmluZyA9IHt9LFxuICAgICAgICBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICBhcHMgPSBbXS5zbGljZSxcbiAgICAgICAganNTdWZmaXhSZWdFeHAgPSAvXFwuanMkLztcblxuICAgIGZ1bmN0aW9uIGhhc1Byb3Aob2JqLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBoYXNPd24uY2FsbChvYmosIHByb3ApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgcmVsYXRpdmUgbW9kdWxlIG5hbWUsIGxpa2UgLi9zb21ldGhpbmcsIG5vcm1hbGl6ZSBpdCB0b1xuICAgICAqIGEgcmVhbCBuYW1lIHRoYXQgY2FuIGJlIG1hcHBlZCB0byBhIHBhdGguXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIHJlbGF0aXZlIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZU5hbWUgYSByZWFsIG5hbWUgdGhhdCB0aGUgbmFtZSBhcmcgaXMgcmVsYXRpdmVcbiAgICAgKiB0by5cbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBub3JtYWxpemVkIG5hbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub3JtYWxpemUobmFtZSwgYmFzZU5hbWUpIHtcbiAgICAgICAgdmFyIG5hbWVQYXJ0cywgbmFtZVNlZ21lbnQsIG1hcFZhbHVlLCBmb3VuZE1hcCwgbGFzdEluZGV4LFxuICAgICAgICAgICAgZm91bmRJLCBmb3VuZFN0YXJNYXAsIHN0YXJJLCBpLCBqLCBwYXJ0LCBub3JtYWxpemVkQmFzZVBhcnRzLFxuICAgICAgICAgICAgYmFzZVBhcnRzID0gYmFzZU5hbWUgJiYgYmFzZU5hbWUuc3BsaXQoXCIvXCIpLFxuICAgICAgICAgICAgbWFwID0gY29uZmlnLm1hcCxcbiAgICAgICAgICAgIHN0YXJNYXAgPSAobWFwICYmIG1hcFsnKiddKSB8fCB7fTtcblxuICAgICAgICAvL0FkanVzdCBhbnkgcmVsYXRpdmUgcGF0aHMuXG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgbGFzdEluZGV4ID0gbmFtZS5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgICAvLyBJZiB3YW50aW5nIG5vZGUgSUQgY29tcGF0aWJpbGl0eSwgc3RyaXAgLmpzIGZyb20gZW5kXG4gICAgICAgICAgICAvLyBvZiBJRHMuIEhhdmUgdG8gZG8gdGhpcyBoZXJlLCBhbmQgbm90IGluIG5hbWVUb1VybFxuICAgICAgICAgICAgLy8gYmVjYXVzZSBub2RlIGFsbG93cyBlaXRoZXIgLmpzIG9yIG5vbiAuanMgdG8gbWFwXG4gICAgICAgICAgICAvLyB0byBzYW1lIGZpbGUuXG4gICAgICAgICAgICBpZiAoY29uZmlnLm5vZGVJZENvbXBhdCAmJiBqc1N1ZmZpeFJlZ0V4cC50ZXN0KG5hbWVbbGFzdEluZGV4XSkpIHtcbiAgICAgICAgICAgICAgICBuYW1lW2xhc3RJbmRleF0gPSBuYW1lW2xhc3RJbmRleF0ucmVwbGFjZShqc1N1ZmZpeFJlZ0V4cCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdGFydHMgd2l0aCBhICcuJyBzbyBuZWVkIHRoZSBiYXNlTmFtZVxuICAgICAgICAgICAgaWYgKG5hbWVbMF0uY2hhckF0KDApID09PSAnLicgJiYgYmFzZVBhcnRzKSB7XG4gICAgICAgICAgICAgICAgLy9Db252ZXJ0IGJhc2VOYW1lIHRvIGFycmF5LCBhbmQgbG9wIG9mZiB0aGUgbGFzdCBwYXJ0LFxuICAgICAgICAgICAgICAgIC8vc28gdGhhdCAuIG1hdGNoZXMgdGhhdCAnZGlyZWN0b3J5JyBhbmQgbm90IG5hbWUgb2YgdGhlIGJhc2VOYW1lJ3NcbiAgICAgICAgICAgICAgICAvL21vZHVsZS4gRm9yIGluc3RhbmNlLCBiYXNlTmFtZSBvZiAnb25lL3R3by90aHJlZScsIG1hcHMgdG9cbiAgICAgICAgICAgICAgICAvLydvbmUvdHdvL3RocmVlLmpzJywgYnV0IHdlIHdhbnQgdGhlIGRpcmVjdG9yeSwgJ29uZS90d28nIGZvclxuICAgICAgICAgICAgICAgIC8vdGhpcyBub3JtYWxpemF0aW9uLlxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRCYXNlUGFydHMgPSBiYXNlUGFydHMuc2xpY2UoMCwgYmFzZVBhcnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIG5hbWUgPSBub3JtYWxpemVkQmFzZVBhcnRzLmNvbmNhdChuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zdGFydCB0cmltRG90c1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwYXJ0ID0gbmFtZVtpXTtcbiAgICAgICAgICAgICAgICBpZiAocGFydCA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBpIC09IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGF0IHRoZSBzdGFydCwgb3IgcHJldmlvdXMgdmFsdWUgaXMgc3RpbGwgLi4sXG4gICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgdGhlbSBzbyB0aGF0IHdoZW4gY29udmVydGVkIHRvIGEgcGF0aCBpdCBtYXlcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RpbGwgd29yayB3aGVuIGNvbnZlcnRlZCB0byBhIHBhdGgsIGV2ZW4gdGhvdWdoXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGFuIElEIGl0IGlzIGxlc3MgdGhhbiBpZGVhbC4gSW4gbGFyZ2VyIHBvaW50XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbGVhc2VzLCBtYXkgYmUgYmV0dGVyIHRvIGp1c3Qga2ljayBvdXQgYW4gZXJyb3IuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IChpID09PSAxICYmIG5hbWVbMl0gPT09ICcuLicpIHx8IG5hbWVbaSAtIDFdID09PSAnLi4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5zcGxpY2UoaSAtIDEsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSAtPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9lbmQgdHJpbURvdHNcblxuICAgICAgICAgICAgbmFtZSA9IG5hbWUuam9pbignLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9BcHBseSBtYXAgY29uZmlnIGlmIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKChiYXNlUGFydHMgfHwgc3Rhck1hcCkgJiYgbWFwKSB7XG4gICAgICAgICAgICBuYW1lUGFydHMgPSBuYW1lLnNwbGl0KCcvJyk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IG5hbWVQYXJ0cy5sZW5ndGg7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgICAgICAgICAgICBuYW1lU2VnbWVudCA9IG5hbWVQYXJ0cy5zbGljZSgwLCBpKS5qb2luKFwiL1wiKTtcblxuICAgICAgICAgICAgICAgIGlmIChiYXNlUGFydHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9GaW5kIHRoZSBsb25nZXN0IGJhc2VOYW1lIHNlZ21lbnQgbWF0Y2ggaW4gdGhlIGNvbmZpZy5cbiAgICAgICAgICAgICAgICAgICAgLy9TbywgZG8gam9pbnMgb24gdGhlIGJpZ2dlc3QgdG8gc21hbGxlc3QgbGVuZ3RocyBvZiBiYXNlUGFydHMuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGJhc2VQYXJ0cy5sZW5ndGg7IGogPiAwOyBqIC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcFZhbHVlID0gbWFwW2Jhc2VQYXJ0cy5zbGljZSgwLCBqKS5qb2luKCcvJyldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2Jhc2VOYW1lIHNlZ21lbnQgaGFzICBjb25maWcsIGZpbmQgaWYgaXQgaGFzIG9uZSBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBuYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwVmFsdWUgPSBtYXBWYWx1ZVtuYW1lU2VnbWVudF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTWF0Y2gsIHVwZGF0ZSBuYW1lIHRvIHRoZSBuZXcgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kTWFwID0gbWFwVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSSA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChmb3VuZE1hcCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0NoZWNrIGZvciBhIHN0YXIgbWFwIG1hdGNoLCBidXQganVzdCBob2xkIG9uIHRvIGl0LFxuICAgICAgICAgICAgICAgIC8vaWYgdGhlcmUgaXMgYSBzaG9ydGVyIHNlZ21lbnQgbWF0Y2ggbGF0ZXIgaW4gYSBtYXRjaGluZ1xuICAgICAgICAgICAgICAgIC8vY29uZmlnLCB0aGVuIGZhdm9yIG92ZXIgdGhpcyBzdGFyIG1hcC5cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kU3Rhck1hcCAmJiBzdGFyTWFwICYmIHN0YXJNYXBbbmFtZVNlZ21lbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kU3Rhck1hcCA9IHN0YXJNYXBbbmFtZVNlZ21lbnRdO1xuICAgICAgICAgICAgICAgICAgICBzdGFySSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWZvdW5kTWFwICYmIGZvdW5kU3Rhck1hcCkge1xuICAgICAgICAgICAgICAgIGZvdW5kTWFwID0gZm91bmRTdGFyTWFwO1xuICAgICAgICAgICAgICAgIGZvdW5kSSA9IHN0YXJJO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm91bmRNYXApIHtcbiAgICAgICAgICAgICAgICBuYW1lUGFydHMuc3BsaWNlKDAsIGZvdW5kSSwgZm91bmRNYXApO1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lUGFydHMuam9pbignLycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZVJlcXVpcmUocmVsTmFtZSwgZm9yY2VTeW5jKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL0EgdmVyc2lvbiBvZiBhIHJlcXVpcmUgZnVuY3Rpb24gdGhhdCBwYXNzZXMgYSBtb2R1bGVOYW1lXG4gICAgICAgICAgICAvL3ZhbHVlIGZvciBpdGVtcyB0aGF0IG1heSBuZWVkIHRvXG4gICAgICAgICAgICAvL2xvb2sgdXAgcGF0aHMgcmVsYXRpdmUgdG8gdGhlIG1vZHVsZU5hbWVcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICAgICAgLy9JZiBmaXJzdCBhcmcgaXMgbm90IHJlcXVpcmUoJ3N0cmluZycpLCBhbmQgdGhlcmUgaXMgb25seVxuICAgICAgICAgICAgLy9vbmUgYXJnLCBpdCBpcyB0aGUgYXJyYXkgZm9ybSB3aXRob3V0IGEgY2FsbGJhY2suIEluc2VydFxuICAgICAgICAgICAgLy9hIG51bGwgc28gdGhhdCB0aGUgZm9sbG93aW5nIGNvbmNhdCBpcyBjb3JyZWN0LlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdICE9PSAnc3RyaW5nJyAmJiBhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXEuYXBwbHkodW5kZWYsIGFyZ3MuY29uY2F0KFtyZWxOYW1lLCBmb3JjZVN5bmNdKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZU5vcm1hbGl6ZShyZWxOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZShuYW1lLCByZWxOYW1lKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTG9hZChkZXBOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGRlZmluZWRbZGVwTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxsRGVwKG5hbWUpIHtcbiAgICAgICAgaWYgKGhhc1Byb3Aod2FpdGluZywgbmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gd2FpdGluZ1tuYW1lXTtcbiAgICAgICAgICAgIGRlbGV0ZSB3YWl0aW5nW25hbWVdO1xuICAgICAgICAgICAgZGVmaW5pbmdbbmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFpbi5hcHBseSh1bmRlZiwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgbmFtZSkgJiYgIWhhc1Byb3AoZGVmaW5pbmcsIG5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vICcgKyBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmaW5lZFtuYW1lXTtcbiAgICB9XG5cbiAgICAvL1R1cm5zIGEgcGx1Z2luIXJlc291cmNlIHRvIFtwbHVnaW4sIHJlc291cmNlXVxuICAgIC8vd2l0aCB0aGUgcGx1Z2luIGJlaW5nIHVuZGVmaW5lZCBpZiB0aGUgbmFtZVxuICAgIC8vZGlkIG5vdCBoYXZlIGEgcGx1Z2luIHByZWZpeC5cbiAgICBmdW5jdGlvbiBzcGxpdFByZWZpeChuYW1lKSB7XG4gICAgICAgIHZhciBwcmVmaXgsXG4gICAgICAgICAgICBpbmRleCA9IG5hbWUgPyBuYW1lLmluZGV4T2YoJyEnKSA6IC0xO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgcHJlZml4ID0gbmFtZS5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKGluZGV4ICsgMSwgbmFtZS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcHJlZml4LCBuYW1lXTtcbiAgICB9XG5cbiAgICAvL0NyZWF0ZXMgYSBwYXJ0cyBhcnJheSBmb3IgYSByZWxOYW1lIHdoZXJlIGZpcnN0IHBhcnQgaXMgcGx1Z2luIElELFxuICAgIC8vc2Vjb25kIHBhcnQgaXMgcmVzb3VyY2UgSUQuIEFzc3VtZXMgcmVsTmFtZSBoYXMgYWxyZWFkeSBiZWVuIG5vcm1hbGl6ZWQuXG4gICAgZnVuY3Rpb24gbWFrZVJlbFBhcnRzKHJlbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHJlbE5hbWUgPyBzcGxpdFByZWZpeChyZWxOYW1lKSA6IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgbmFtZSBtYXAsIG5vcm1hbGl6aW5nIHRoZSBuYW1lLCBhbmQgdXNpbmcgYSBwbHVnaW5cbiAgICAgKiBmb3Igbm9ybWFsaXphdGlvbiBpZiBuZWNlc3NhcnkuIEdyYWJzIGEgcmVmIHRvIHBsdWdpblxuICAgICAqIHRvbywgYXMgYW4gb3B0aW1pemF0aW9uLlxuICAgICAqL1xuICAgIG1ha2VNYXAgPSBmdW5jdGlvbiAobmFtZSwgcmVsUGFydHMpIHtcbiAgICAgICAgdmFyIHBsdWdpbixcbiAgICAgICAgICAgIHBhcnRzID0gc3BsaXRQcmVmaXgobmFtZSksXG4gICAgICAgICAgICBwcmVmaXggPSBwYXJ0c1swXSxcbiAgICAgICAgICAgIHJlbFJlc291cmNlTmFtZSA9IHJlbFBhcnRzWzFdO1xuXG4gICAgICAgIG5hbWUgPSBwYXJ0c1sxXTtcblxuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICBwcmVmaXggPSBub3JtYWxpemUocHJlZml4LCByZWxSZXNvdXJjZU5hbWUpO1xuICAgICAgICAgICAgcGx1Z2luID0gY2FsbERlcChwcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Ob3JtYWxpemUgYWNjb3JkaW5nXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIGlmIChwbHVnaW4gJiYgcGx1Z2luLm5vcm1hbGl6ZSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBwbHVnaW4ubm9ybWFsaXplKG5hbWUsIG1ha2VOb3JtYWxpemUocmVsUmVzb3VyY2VOYW1lKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBub3JtYWxpemUobmFtZSwgcmVsUmVzb3VyY2VOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBub3JtYWxpemUobmFtZSwgcmVsUmVzb3VyY2VOYW1lKTtcbiAgICAgICAgICAgIHBhcnRzID0gc3BsaXRQcmVmaXgobmFtZSk7XG4gICAgICAgICAgICBwcmVmaXggPSBwYXJ0c1swXTtcbiAgICAgICAgICAgIG5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW4gPSBjYWxsRGVwKHByZWZpeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1VzaW5nIHJpZGljdWxvdXMgcHJvcGVydHkgbmFtZXMgZm9yIHNwYWNlIHJlYXNvbnNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGY6IHByZWZpeCA/IHByZWZpeCArICchJyArIG5hbWUgOiBuYW1lLCAvL2Z1bGxOYW1lXG4gICAgICAgICAgICBuOiBuYW1lLFxuICAgICAgICAgICAgcHI6IHByZWZpeCxcbiAgICAgICAgICAgIHA6IHBsdWdpblxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYWtlQ29uZmlnKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoY29uZmlnICYmIGNvbmZpZy5jb25maWcgJiYgY29uZmlnLmNvbmZpZ1tuYW1lXSkgfHwge307XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaGFuZGxlcnMgPSB7XG4gICAgICAgIHJlcXVpcmU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFrZVJlcXVpcmUobmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGV4cG9ydHM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGRlZmluZWRbbmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGVmaW5lZFtuYW1lXSA9IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW9kdWxlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZDogbmFtZSxcbiAgICAgICAgICAgICAgICB1cmk6ICcnLFxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IGRlZmluZWRbbmFtZV0sXG4gICAgICAgICAgICAgICAgY29uZmlnOiBtYWtlQ29uZmlnKG5hbWUpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1haW4gPSBmdW5jdGlvbiAobmFtZSwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpIHtcbiAgICAgICAgdmFyIGNqc01vZHVsZSwgZGVwTmFtZSwgcmV0LCBtYXAsIGksIHJlbFBhcnRzLFxuICAgICAgICAgICAgYXJncyA9IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tUeXBlID0gdHlwZW9mIGNhbGxiYWNrLFxuICAgICAgICAgICAgdXNpbmdFeHBvcnRzO1xuXG4gICAgICAgIC8vVXNlIG5hbWUgaWYgbm8gcmVsTmFtZVxuICAgICAgICByZWxOYW1lID0gcmVsTmFtZSB8fCBuYW1lO1xuICAgICAgICByZWxQYXJ0cyA9IG1ha2VSZWxQYXJ0cyhyZWxOYW1lKTtcblxuICAgICAgICAvL0NhbGwgdGhlIGNhbGxiYWNrIHRvIGRlZmluZSB0aGUgbW9kdWxlLCBpZiBuZWNlc3NhcnkuXG4gICAgICAgIGlmIChjYWxsYmFja1R5cGUgPT09ICd1bmRlZmluZWQnIHx8IGNhbGxiYWNrVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy9QdWxsIG91dCB0aGUgZGVmaW5lZCBkZXBlbmRlbmNpZXMgYW5kIHBhc3MgdGhlIG9yZGVyZWRcbiAgICAgICAgICAgIC8vdmFsdWVzIHRvIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIC8vRGVmYXVsdCB0byBbcmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlXSBpZiBubyBkZXBzXG4gICAgICAgICAgICBkZXBzID0gIWRlcHMubGVuZ3RoICYmIGNhbGxiYWNrLmxlbmd0aCA/IFsncmVxdWlyZScsICdleHBvcnRzJywgJ21vZHVsZSddIDogZGVwcztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBkZXBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgbWFwID0gbWFrZU1hcChkZXBzW2ldLCByZWxQYXJ0cyk7XG4gICAgICAgICAgICAgICAgZGVwTmFtZSA9IG1hcC5mO1xuXG4gICAgICAgICAgICAgICAgLy9GYXN0IHBhdGggQ29tbW9uSlMgc3RhbmRhcmQgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgIGlmIChkZXBOYW1lID09PSBcInJlcXVpcmVcIikge1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gaGFuZGxlcnMucmVxdWlyZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUgPT09IFwiZXhwb3J0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ29tbW9uSlMgbW9kdWxlIHNwZWMgMS4xXG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBoYW5kbGVycy5leHBvcnRzKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB1c2luZ0V4cG9ydHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZSA9PT0gXCJtb2R1bGVcIikge1xuICAgICAgICAgICAgICAgICAgICAvL0NvbW1vbkpTIG1vZHVsZSBzcGVjIDEuMVxuICAgICAgICAgICAgICAgICAgICBjanNNb2R1bGUgPSBhcmdzW2ldID0gaGFuZGxlcnMubW9kdWxlKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzUHJvcChkZWZpbmVkLCBkZXBOYW1lKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUHJvcCh3YWl0aW5nLCBkZXBOYW1lKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUHJvcChkZWZpbmluZywgZGVwTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGNhbGxEZXAoZGVwTmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXAucCkge1xuICAgICAgICAgICAgICAgICAgICBtYXAucC5sb2FkKG1hcC5uLCBtYWtlUmVxdWlyZShyZWxOYW1lLCB0cnVlKSwgbWFrZUxvYWQoZGVwTmFtZSksIHt9KTtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGRlZmluZWRbZGVwTmFtZV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5hbWUgKyAnIG1pc3NpbmcgJyArIGRlcE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0ID0gY2FsbGJhY2sgPyBjYWxsYmFjay5hcHBseShkZWZpbmVkW25hbWVdLCBhcmdzKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAvL0lmIHNldHRpbmcgZXhwb3J0cyB2aWEgXCJtb2R1bGVcIiBpcyBpbiBwbGF5LFxuICAgICAgICAgICAgICAgIC8vZmF2b3IgdGhhdCBvdmVyIHJldHVybiB2YWx1ZSBhbmQgZXhwb3J0cy4gQWZ0ZXIgdGhhdCxcbiAgICAgICAgICAgICAgICAvL2Zhdm9yIGEgbm9uLXVuZGVmaW5lZCByZXR1cm4gdmFsdWUgb3ZlciBleHBvcnRzIHVzZS5cbiAgICAgICAgICAgICAgICBpZiAoY2pzTW9kdWxlICYmIGNqc01vZHVsZS5leHBvcnRzICE9PSB1bmRlZiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2pzTW9kdWxlLmV4cG9ydHMgIT09IGRlZmluZWRbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IGNqc01vZHVsZS5leHBvcnRzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmV0ICE9PSB1bmRlZiB8fCAhdXNpbmdFeHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVXNlIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIGRlZmluZWRbbmFtZV0gPSByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vTWF5IGp1c3QgYmUgYW4gb2JqZWN0IGRlZmluaXRpb24gZm9yIHRoZSBtb2R1bGUuIE9ubHlcbiAgICAgICAgICAgIC8vd29ycnkgYWJvdXQgZGVmaW5pbmcgaWYgaGF2ZSBhIG1vZHVsZSBuYW1lLlxuICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJlcXVpcmVqcyA9IHJlcXVpcmUgPSByZXEgPSBmdW5jdGlvbiAoZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUsIGZvcmNlU3luYywgYWx0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGVwcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaWYgKGhhbmRsZXJzW2RlcHNdKSB7XG4gICAgICAgICAgICAgICAgLy9jYWxsYmFjayBpbiB0aGlzIGNhc2UgaXMgcmVhbGx5IHJlbE5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnNbZGVwc10oY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9KdXN0IHJldHVybiB0aGUgbW9kdWxlIHdhbnRlZC4gSW4gdGhpcyBzY2VuYXJpbywgdGhlXG4gICAgICAgICAgICAvL2RlcHMgYXJnIGlzIHRoZSBtb2R1bGUgbmFtZSwgYW5kIHNlY29uZCBhcmcgKGlmIHBhc3NlZClcbiAgICAgICAgICAgIC8vaXMganVzdCB0aGUgcmVsTmFtZS5cbiAgICAgICAgICAgIC8vTm9ybWFsaXplIG1vZHVsZSBuYW1lLCBpZiBpdCBjb250YWlucyAuIG9yIC4uXG4gICAgICAgICAgICByZXR1cm4gY2FsbERlcChtYWtlTWFwKGRlcHMsIG1ha2VSZWxQYXJ0cyhjYWxsYmFjaykpLmYpO1xuICAgICAgICB9IGVsc2UgaWYgKCFkZXBzLnNwbGljZSkge1xuICAgICAgICAgICAgLy9kZXBzIGlzIGEgY29uZmlnIG9iamVjdCwgbm90IGFuIGFycmF5LlxuICAgICAgICAgICAgY29uZmlnID0gZGVwcztcbiAgICAgICAgICAgIGlmIChjb25maWcuZGVwcykge1xuICAgICAgICAgICAgICAgIHJlcShjb25maWcuZGVwcywgY29uZmlnLmNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5zcGxpY2UpIHtcbiAgICAgICAgICAgICAgICAvL2NhbGxiYWNrIGlzIGFuIGFycmF5LCB3aGljaCBtZWFucyBpdCBpcyBhIGRlcGVuZGVuY3kgbGlzdC5cbiAgICAgICAgICAgICAgICAvL0FkanVzdCBhcmdzIGlmIHRoZXJlIGFyZSBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICBkZXBzID0gY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSByZWxOYW1lO1xuICAgICAgICAgICAgICAgIHJlbE5hbWUgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBzID0gdW5kZWY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1N1cHBvcnQgcmVxdWlyZShbJ2EnXSlcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgICAvL0lmIHJlbE5hbWUgaXMgYSBmdW5jdGlvbiwgaXQgaXMgYW4gZXJyYmFjayBoYW5kbGVyLFxuICAgICAgICAvL3NvIHJlbW92ZSBpdC5cbiAgICAgICAgaWYgKHR5cGVvZiByZWxOYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZWxOYW1lID0gZm9yY2VTeW5jO1xuICAgICAgICAgICAgZm9yY2VTeW5jID0gYWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TaW11bGF0ZSBhc3luYyBjYWxsYmFjaztcbiAgICAgICAgaWYgKGZvcmNlU3luYykge1xuICAgICAgICAgICAgbWFpbih1bmRlZiwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9Vc2luZyBhIG5vbi16ZXJvIHZhbHVlIGJlY2F1c2Ugb2YgY29uY2VybiBmb3Igd2hhdCBvbGQgYnJvd3NlcnNcbiAgICAgICAgICAgIC8vZG8sIGFuZCBsYXRlc3QgYnJvd3NlcnMgXCJ1cGdyYWRlXCIgdG8gNCBpZiBsb3dlciB2YWx1ZSBpcyB1c2VkOlxuICAgICAgICAgICAgLy9odHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS90aW1lcnMuaHRtbCNkb20td2luZG93dGltZXJzLXNldHRpbWVvdXQ6XG4gICAgICAgICAgICAvL0lmIHdhbnQgYSB2YWx1ZSBpbW1lZGlhdGVseSwgdXNlIHJlcXVpcmUoJ2lkJykgaW5zdGVhZCAtLSBzb21ldGhpbmdcbiAgICAgICAgICAgIC8vdGhhdCB3b3JrcyBpbiBhbG1vbmQgb24gdGhlIGdsb2JhbCBsZXZlbCwgYnV0IG5vdCBndWFyYW50ZWVkIGFuZFxuICAgICAgICAgICAgLy91bmxpa2VseSB0byB3b3JrIGluIG90aGVyIEFNRCBpbXBsZW1lbnRhdGlvbnMuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtYWluKHVuZGVmLCBkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSk7XG4gICAgICAgICAgICB9LCA0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEp1c3QgZHJvcHMgdGhlIGNvbmZpZyBvbiB0aGUgZmxvb3IsIGJ1dCByZXR1cm5zIHJlcSBpbiBjYXNlXG4gICAgICogdGhlIGNvbmZpZyByZXR1cm4gdmFsdWUgaXMgdXNlZC5cbiAgICAgKi9cbiAgICByZXEuY29uZmlnID0gZnVuY3Rpb24gKGNmZykge1xuICAgICAgICByZXR1cm4gcmVxKGNmZyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBtb2R1bGUgcmVnaXN0cnkgZm9yIGRlYnVnZ2luZyBhbmQgdG9vbGluZ1xuICAgICAqL1xuICAgIHJlcXVpcmVqcy5fZGVmaW5lZCA9IGRlZmluZWQ7XG5cbiAgICBkZWZpbmUgPSBmdW5jdGlvbiAobmFtZSwgZGVwcywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWUgYWxtb25kIFJFQURNRTogaW5jb3JyZWN0IG1vZHVsZSBidWlsZCwgbm8gbW9kdWxlIG5hbWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVGhpcyBtb2R1bGUgbWF5IG5vdCBoYXZlIGRlcGVuZGVuY2llc1xuICAgICAgICBpZiAoIWRlcHMuc3BsaWNlKSB7XG4gICAgICAgICAgICAvL2RlcHMgaXMgbm90IGFuIGFycmF5LCBzbyBwcm9iYWJseSBtZWFuc1xuICAgICAgICAgICAgLy9hbiBvYmplY3QgbGl0ZXJhbCBvciBmYWN0b3J5IGZ1bmN0aW9uIGZvclxuICAgICAgICAgICAgLy90aGUgdmFsdWUuIEFkanVzdCBhcmdzLlxuICAgICAgICAgICAgY2FsbGJhY2sgPSBkZXBzO1xuICAgICAgICAgICAgZGVwcyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYXNQcm9wKGRlZmluZWQsIG5hbWUpICYmICFoYXNQcm9wKHdhaXRpbmcsIG5hbWUpKSB7XG4gICAgICAgICAgICB3YWl0aW5nW25hbWVdID0gW25hbWUsIGRlcHMsIGNhbGxiYWNrXTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBkZWZpbmUuYW1kID0ge1xuICAgICAgICBqUXVlcnk6IHRydWVcbiAgICB9O1xufSgpKTtcblxuUzIucmVxdWlyZWpzID0gcmVxdWlyZWpzO1MyLnJlcXVpcmUgPSByZXF1aXJlO1MyLmRlZmluZSA9IGRlZmluZTtcbn1cbn0oKSk7XG5TMi5kZWZpbmUoXCJhbG1vbmRcIiwgZnVuY3Rpb24oKXt9KTtcblxuLyogZ2xvYmFsIGpRdWVyeTpmYWxzZSwgJDpmYWxzZSAqL1xuUzIuZGVmaW5lKCdqcXVlcnknLFtdLGZ1bmN0aW9uICgpIHtcbiAgdmFyIF8kID0galF1ZXJ5IHx8ICQ7XG5cbiAgaWYgKF8kID09IG51bGwgJiYgY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcbiAgICAgICdTZWxlY3QyOiBBbiBpbnN0YW5jZSBvZiBqUXVlcnkgb3IgYSBqUXVlcnktY29tcGF0aWJsZSBsaWJyYXJ5IHdhcyBub3QgJyArXG4gICAgICAnZm91bmQuIE1ha2Ugc3VyZSB0aGF0IHlvdSBhcmUgaW5jbHVkaW5nIGpRdWVyeSBiZWZvcmUgU2VsZWN0MiBvbiB5b3VyICcgK1xuICAgICAgJ3dlYiBwYWdlLidcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIF8kO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi91dGlscycsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgdmFyIFV0aWxzID0ge307XG5cbiAgVXRpbHMuRXh0ZW5kID0gZnVuY3Rpb24gKENoaWxkQ2xhc3MsIFN1cGVyQ2xhc3MpIHtcbiAgICB2YXIgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgICBmdW5jdGlvbiBCYXNlQ29uc3RydWN0b3IgKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IENoaWxkQ2xhc3M7XG4gICAgfVxuXG4gICAgZm9yICh2YXIga2V5IGluIFN1cGVyQ2xhc3MpIHtcbiAgICAgIGlmIChfX2hhc1Byb3AuY2FsbChTdXBlckNsYXNzLCBrZXkpKSB7XG4gICAgICAgIENoaWxkQ2xhc3Nba2V5XSA9IFN1cGVyQ2xhc3Nba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBCYXNlQ29uc3RydWN0b3IucHJvdG90eXBlID0gU3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUgPSBuZXcgQmFzZUNvbnN0cnVjdG9yKCk7XG4gICAgQ2hpbGRDbGFzcy5fX3N1cGVyX18gPSBTdXBlckNsYXNzLnByb3RvdHlwZTtcblxuICAgIHJldHVybiBDaGlsZENsYXNzO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldE1ldGhvZHMgKHRoZUNsYXNzKSB7XG4gICAgdmFyIHByb3RvID0gdGhlQ2xhc3MucHJvdG90eXBlO1xuXG4gICAgdmFyIG1ldGhvZHMgPSBbXTtcblxuICAgIGZvciAodmFyIG1ldGhvZE5hbWUgaW4gcHJvdG8pIHtcbiAgICAgIHZhciBtID0gcHJvdG9bbWV0aG9kTmFtZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1ldGhvZE5hbWUgPT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG1ldGhvZHMucHVzaChtZXRob2ROYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWV0aG9kcztcbiAgfVxuXG4gIFV0aWxzLkRlY29yYXRlID0gZnVuY3Rpb24gKFN1cGVyQ2xhc3MsIERlY29yYXRvckNsYXNzKSB7XG4gICAgdmFyIGRlY29yYXRlZE1ldGhvZHMgPSBnZXRNZXRob2RzKERlY29yYXRvckNsYXNzKTtcbiAgICB2YXIgc3VwZXJNZXRob2RzID0gZ2V0TWV0aG9kcyhTdXBlckNsYXNzKTtcblxuICAgIGZ1bmN0aW9uIERlY29yYXRlZENsYXNzICgpIHtcbiAgICAgIHZhciB1bnNoaWZ0ID0gQXJyYXkucHJvdG90eXBlLnVuc2hpZnQ7XG5cbiAgICAgIHZhciBhcmdDb3VudCA9IERlY29yYXRvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5sZW5ndGg7XG5cbiAgICAgIHZhciBjYWxsZWRDb25zdHJ1Y3RvciA9IFN1cGVyQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuXG4gICAgICBpZiAoYXJnQ291bnQgPiAwKSB7XG4gICAgICAgIHVuc2hpZnQuY2FsbChhcmd1bWVudHMsIFN1cGVyQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKTtcblxuICAgICAgICBjYWxsZWRDb25zdHJ1Y3RvciA9IERlY29yYXRvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcbiAgICAgIH1cblxuICAgICAgY2FsbGVkQ29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBEZWNvcmF0b3JDbGFzcy5kaXNwbGF5TmFtZSA9IFN1cGVyQ2xhc3MuZGlzcGxheU5hbWU7XG5cbiAgICBmdW5jdGlvbiBjdHIgKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IERlY29yYXRlZENsYXNzO1xuICAgIH1cblxuICAgIERlY29yYXRlZENsYXNzLnByb3RvdHlwZSA9IG5ldyBjdHIoKTtcblxuICAgIGZvciAodmFyIG0gPSAwOyBtIDwgc3VwZXJNZXRob2RzLmxlbmd0aDsgbSsrKSB7XG4gICAgICB2YXIgc3VwZXJNZXRob2QgPSBzdXBlck1ldGhvZHNbbV07XG5cbiAgICAgIERlY29yYXRlZENsYXNzLnByb3RvdHlwZVtzdXBlck1ldGhvZF0gPVxuICAgICAgICBTdXBlckNsYXNzLnByb3RvdHlwZVtzdXBlck1ldGhvZF07XG4gICAgfVxuXG4gICAgdmFyIGNhbGxlZE1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAgICAvLyBTdHViIG91dCB0aGUgb3JpZ2luYWwgbWV0aG9kIGlmIGl0J3Mgbm90IGRlY29yYXRpbmcgYW4gYWN0dWFsIG1ldGhvZFxuICAgICAgdmFyIG9yaWdpbmFsTWV0aG9kID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAgIGlmIChtZXRob2ROYW1lIGluIERlY29yYXRlZENsYXNzLnByb3RvdHlwZSkge1xuICAgICAgICBvcmlnaW5hbE1ldGhvZCA9IERlY29yYXRlZENsYXNzLnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlY29yYXRlZE1ldGhvZCA9IERlY29yYXRvckNsYXNzLnByb3RvdHlwZVttZXRob2ROYW1lXTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcblxuICAgICAgICB1bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBvcmlnaW5hbE1ldGhvZCk7XG5cbiAgICAgICAgcmV0dXJuIGRlY29yYXRlZE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkZWNvcmF0ZWRNZXRob2RzLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgZGVjb3JhdGVkTWV0aG9kID0gZGVjb3JhdGVkTWV0aG9kc1tkXTtcblxuICAgICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW2RlY29yYXRlZE1ldGhvZF0gPSBjYWxsZWRNZXRob2QoZGVjb3JhdGVkTWV0aG9kKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRGVjb3JhdGVkQ2xhc3M7XG4gIH07XG5cbiAgdmFyIE9ic2VydmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgfTtcblxuICBPYnNlcnZhYmxlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzIHx8IHt9O1xuXG4gICAgaWYgKGV2ZW50IGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1tldmVudF0ucHVzaChjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IFtjYWxsYmFja107XG4gICAgfVxuICB9O1xuXG4gIE9ic2VydmFibGUucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4gICAgdmFyIHBhcmFtcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHRoaXMubGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMgfHwge307XG5cbiAgICAvLyBQYXJhbXMgc2hvdWxkIGFsd2F5cyBjb21lIGluIGFzIGFuIGFycmF5XG4gICAgaWYgKHBhcmFtcyA9PSBudWxsKSB7XG4gICAgICBwYXJhbXMgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gYXJndW1lbnRzIHRvIHRoZSBldmVudCwgdXNlIGEgdGVtcG9yYXJ5IG9iamVjdFxuICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBwYXJhbXMucHVzaCh7fSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBgX3R5cGVgIG9mIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIGV2ZW50XG4gICAgcGFyYW1zWzBdLl90eXBlID0gZXZlbnQ7XG5cbiAgICBpZiAoZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuaW52b2tlKHRoaXMubGlzdGVuZXJzW2V2ZW50XSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB9XG5cbiAgICBpZiAoJyonIGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLmludm9rZSh0aGlzLmxpc3RlbmVyc1snKiddLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcblxuICBPYnNlcnZhYmxlLnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbiAobGlzdGVuZXJzLCBwYXJhbXMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgcGFyYW1zKTtcbiAgICB9XG4gIH07XG5cbiAgVXRpbHMuT2JzZXJ2YWJsZSA9IE9ic2VydmFibGU7XG5cbiAgVXRpbHMuZ2VuZXJhdGVDaGFycyA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICB2YXIgY2hhcnMgPSAnJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByYW5kb21DaGFyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMzYpO1xuICAgICAgY2hhcnMgKz0gcmFuZG9tQ2hhci50b1N0cmluZygzNik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJzO1xuICB9O1xuXG4gIFV0aWxzLmJpbmQgPSBmdW5jdGlvbiAoZnVuYywgY29udGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICBVdGlscy5fY29udmVydERhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGZvciAodmFyIG9yaWdpbmFsS2V5IGluIGRhdGEpIHtcbiAgICAgIHZhciBrZXlzID0gb3JpZ2luYWxLZXkuc3BsaXQoJy0nKTtcblxuICAgICAgdmFyIGRhdGFMZXZlbCA9IGRhdGE7XG5cbiAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2tdO1xuXG4gICAgICAgIC8vIExvd2VyY2FzZSB0aGUgZmlyc3QgbGV0dGVyXG4gICAgICAgIC8vIEJ5IGRlZmF1bHQsIGRhc2gtc2VwYXJhdGVkIGJlY29tZXMgY2FtZWxDYXNlXG4gICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgMSkudG9Mb3dlckNhc2UoKSArIGtleS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgaWYgKCEoa2V5IGluIGRhdGFMZXZlbCkpIHtcbiAgICAgICAgICBkYXRhTGV2ZWxba2V5XSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGsgPT0ga2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgZGF0YUxldmVsW2tleV0gPSBkYXRhW29yaWdpbmFsS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFMZXZlbCA9IGRhdGFMZXZlbFtrZXldO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgZGF0YVtvcmlnaW5hbEtleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgVXRpbHMuaGFzU2Nyb2xsID0gZnVuY3Rpb24gKGluZGV4LCBlbCkge1xuICAgIC8vIEFkYXB0ZWQgZnJvbSB0aGUgZnVuY3Rpb24gY3JlYXRlZCBieSBAU2hhZG93U2NyaXB0ZXJcbiAgICAvLyBhbmQgYWRhcHRlZCBieSBAQmlsbEJhcnJ5IG9uIHRoZSBTdGFjayBFeGNoYW5nZSBDb2RlIFJldmlldyB3ZWJzaXRlLlxuICAgIC8vIFRoZSBvcmlnaW5hbCBjb2RlIGNhbiBiZSBmb3VuZCBhdFxuICAgIC8vIGh0dHA6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3EvMTMzMzhcbiAgICAvLyBhbmQgd2FzIGRlc2lnbmVkIHRvIGJlIHVzZWQgd2l0aCB0aGUgU2l6emxlIHNlbGVjdG9yIGVuZ2luZS5cblxuICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICB2YXIgb3ZlcmZsb3dYID0gZWwuc3R5bGUub3ZlcmZsb3dYO1xuICAgIHZhciBvdmVyZmxvd1kgPSBlbC5zdHlsZS5vdmVyZmxvd1k7XG5cbiAgICAvL0NoZWNrIGJvdGggeCBhbmQgeSBkZWNsYXJhdGlvbnNcbiAgICBpZiAob3ZlcmZsb3dYID09PSBvdmVyZmxvd1kgJiZcbiAgICAgICAgKG92ZXJmbG93WSA9PT0gJ2hpZGRlbicgfHwgb3ZlcmZsb3dZID09PSAndmlzaWJsZScpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgfHwgb3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuICgkZWwuaW5uZXJIZWlnaHQoKSA8IGVsLnNjcm9sbEhlaWdodCB8fFxuICAgICAgJGVsLmlubmVyV2lkdGgoKSA8IGVsLnNjcm9sbFdpZHRoKTtcbiAgfTtcblxuICBVdGlscy5lc2NhcGVNYXJrdXAgPSBmdW5jdGlvbiAobWFya3VwKSB7XG4gICAgdmFyIHJlcGxhY2VNYXAgPSB7XG4gICAgICAnXFxcXCc6ICcmIzkyOycsXG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAnXFwnJzogJyYjMzk7JyxcbiAgICAgICcvJzogJyYjNDc7J1xuICAgIH07XG5cbiAgICAvLyBEbyBub3QgdHJ5IHRvIGVzY2FwZSB0aGUgbWFya3VwIGlmIGl0J3Mgbm90IGEgc3RyaW5nXG4gICAgaWYgKHR5cGVvZiBtYXJrdXAgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbWFya3VwO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJpbmcobWFya3VwKS5yZXBsYWNlKC9bJjw+XCInXFwvXFxcXF0vZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICByZXR1cm4gcmVwbGFjZU1hcFttYXRjaF07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQXBwZW5kIGFuIGFycmF5IG9mIGpRdWVyeSBub2RlcyB0byBhIGdpdmVuIGVsZW1lbnQuXG4gIFV0aWxzLmFwcGVuZE1hbnkgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICRub2Rlcykge1xuICAgIC8vIGpRdWVyeSAxLjcueCBkb2VzIG5vdCBzdXBwb3J0ICQuZm4uYXBwZW5kKCkgd2l0aCBhbiBhcnJheVxuICAgIC8vIEZhbGwgYmFjayB0byBhIGpRdWVyeSBvYmplY3QgY29sbGVjdGlvbiB1c2luZyAkLmZuLmFkZCgpXG4gICAgaWYgKCQuZm4uanF1ZXJ5LnN1YnN0cigwLCAzKSA9PT0gJzEuNycpIHtcbiAgICAgIHZhciAkanFOb2RlcyA9ICQoKTtcblxuICAgICAgJC5tYXAoJG5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAkanFOb2RlcyA9ICRqcU5vZGVzLmFkZChub2RlKTtcbiAgICAgIH0pO1xuXG4gICAgICAkbm9kZXMgPSAkanFOb2RlcztcbiAgICB9XG5cbiAgICAkZWxlbWVudC5hcHBlbmQoJG5vZGVzKTtcbiAgfTtcblxuICAvLyBDYWNoZSBvYmplY3RzIGluIFV0aWxzLl9fY2FjaGUgaW5zdGVhZCBvZiAkLmRhdGEgKHNlZSAjNDM0NilcbiAgVXRpbHMuX19jYWNoZSA9IHt9O1xuXG4gIHZhciBpZCA9IDA7XG4gIFV0aWxzLkdldFVuaXF1ZUVsZW1lbnRJZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgLy8gR2V0IGEgdW5pcXVlIGVsZW1lbnQgSWQuIElmIGVsZW1lbnQgaGFzIG5vIGlkLFxuICAgIC8vIGNyZWF0ZXMgYSBuZXcgdW5pcXVlIG51bWJlciwgc3RvcmVzIGl0IGluIHRoZSBpZFxuICAgIC8vIGF0dHJpYnV0ZSBhbmQgcmV0dXJucyB0aGUgbmV3IGlkLlxuICAgIC8vIElmIGFuIGlkIGFscmVhZHkgZXhpc3RzLCBpdCBzaW1wbHkgcmV0dXJucyBpdC5cblxuICAgIHZhciBzZWxlY3QySWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3QyLWlkJyk7XG4gICAgaWYgKHNlbGVjdDJJZCA9PSBudWxsKSB7XG4gICAgICAvLyBJZiBlbGVtZW50IGhhcyBpZCwgdXNlIGl0LlxuICAgICAgaWYgKGVsZW1lbnQuaWQpIHtcbiAgICAgICAgc2VsZWN0MklkID0gZWxlbWVudC5pZDtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0Mi1pZCcsIHNlbGVjdDJJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3QyLWlkJywgKytpZCk7XG4gICAgICAgIHNlbGVjdDJJZCA9IGlkLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3QySWQ7XG4gIH07XG5cbiAgVXRpbHMuU3RvcmVEYXRhID0gZnVuY3Rpb24gKGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XG4gICAgLy8gU3RvcmVzIGFuIGl0ZW0gaW4gdGhlIGNhY2hlIGZvciBhIHNwZWNpZmllZCBlbGVtZW50LlxuICAgIC8vIG5hbWUgaXMgdGhlIGNhY2hlIGtleS5cbiAgICB2YXIgaWQgPSBVdGlscy5HZXRVbmlxdWVFbGVtZW50SWQoZWxlbWVudCk7XG4gICAgaWYgKCFVdGlscy5fX2NhY2hlW2lkXSkge1xuICAgICAgVXRpbHMuX19jYWNoZVtpZF0gPSB7fTtcbiAgICB9XG5cbiAgICBVdGlscy5fX2NhY2hlW2lkXVtuYW1lXSA9IHZhbHVlO1xuICB9O1xuXG4gIFV0aWxzLkdldERhdGEgPSBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZSkge1xuICAgIC8vIFJldHJpZXZlcyBhIHZhbHVlIGZyb20gdGhlIGNhY2hlIGJ5IGl0cyBrZXkgKG5hbWUpXG4gICAgLy8gbmFtZSBpcyBvcHRpb25hbC4gSWYgbm8gbmFtZSBzcGVjaWZpZWQsIHJldHVyblxuICAgIC8vIGFsbCBjYWNoZSBpdGVtcyBmb3IgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgIC8vIGFuZCBmb3IgYSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICB2YXIgaWQgPSBVdGlscy5HZXRVbmlxdWVFbGVtZW50SWQoZWxlbWVudCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGlmIChVdGlscy5fX2NhY2hlW2lkXSkge1xuICAgICAgICBpZiAoVXRpbHMuX19jYWNoZVtpZF1bbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBVdGlscy5fX2NhY2hlW2lkXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJChlbGVtZW50KS5kYXRhKG5hbWUpOyAvLyBGYWxsYmFjayB0byBIVE1MNSBkYXRhIGF0dHJpYnMuXG4gICAgICB9XG4gICAgICByZXR1cm4gJChlbGVtZW50KS5kYXRhKG5hbWUpOyAvLyBGYWxsYmFjayB0byBIVE1MNSBkYXRhIGF0dHJpYnMuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBVdGlscy5fX2NhY2hlW2lkXTtcbiAgICB9XG4gIH07XG5cbiAgVXRpbHMuUmVtb3ZlRGF0YSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgLy8gUmVtb3ZlcyBhbGwgY2FjaGVkIGl0ZW1zIGZvciBhIHNwZWNpZmllZCBlbGVtZW50LlxuICAgIHZhciBpZCA9IFV0aWxzLkdldFVuaXF1ZUVsZW1lbnRJZChlbGVtZW50KTtcbiAgICBpZiAoVXRpbHMuX19jYWNoZVtpZF0gIT0gbnVsbCkge1xuICAgICAgZGVsZXRlIFV0aWxzLl9fY2FjaGVbaWRdO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gVXRpbHM7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3Jlc3VsdHMnLFtcbiAgJ2pxdWVyeScsXG4gICcuL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIFJlc3VsdHMgKCRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcbiAgICB0aGlzLmRhdGEgPSBkYXRhQWRhcHRlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgUmVzdWx0cy5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChSZXN1bHRzLCBVdGlscy5PYnNlcnZhYmxlKTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRyZXN1bHRzID0gJChcbiAgICAgICc8dWwgY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnNcIiByb2xlPVwidHJlZVwiPjwvdWw+J1xuICAgICk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnbXVsdGlwbGUnKSkge1xuICAgICAgJHJlc3VsdHMuYXR0cignYXJpYS1tdWx0aXNlbGVjdGFibGUnLCAndHJ1ZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJlc3VsdHMgPSAkcmVzdWx0cztcblxuICAgIHJldHVybiAkcmVzdWx0cztcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRyZXN1bHRzLmVtcHR5KCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZGlzcGxheU1lc3NhZ2UgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGVzY2FwZU1hcmt1cCA9IHRoaXMub3B0aW9ucy5nZXQoJ2VzY2FwZU1hcmt1cCcpO1xuXG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuaGlkZUxvYWRpbmcoKTtcblxuICAgIHZhciAkbWVzc2FnZSA9ICQoXG4gICAgICAnPGxpIHJvbGU9XCJ0cmVlaXRlbVwiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiJyArXG4gICAgICAnIGNsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb25cIj48L2xpPidcbiAgICApO1xuXG4gICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQocGFyYW1zLm1lc3NhZ2UpO1xuXG4gICAgJG1lc3NhZ2UuYXBwZW5kKFxuICAgICAgZXNjYXBlTWFya3VwKFxuICAgICAgICBtZXNzYWdlKHBhcmFtcy5hcmdzKVxuICAgICAgKVxuICAgICk7XG5cbiAgICAkbWVzc2FnZVswXS5jbGFzc05hbWUgKz0gJyBzZWxlY3QyLXJlc3VsdHNfX21lc3NhZ2UnO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQoJG1lc3NhZ2UpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZGVNZXNzYWdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRyZXN1bHRzLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX21lc3NhZ2UnKS5yZW1vdmUoKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuaGlkZUxvYWRpbmcoKTtcblxuICAgIHZhciAkb3B0aW9ucyA9IFtdO1xuXG4gICAgaWYgKGRhdGEucmVzdWx0cyA9PSBudWxsIHx8IGRhdGEucmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLiRyZXN1bHRzLmNoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xuICAgICAgICAgIG1lc3NhZ2U6ICdub1Jlc3VsdHMnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGF0YS5yZXN1bHRzID0gdGhpcy5zb3J0KGRhdGEucmVzdWx0cyk7XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEucmVzdWx0cy5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGl0ZW0gPSBkYXRhLnJlc3VsdHNbZF07XG5cbiAgICAgIHZhciAkb3B0aW9uID0gdGhpcy5vcHRpb24oaXRlbSk7XG5cbiAgICAgICRvcHRpb25zLnB1c2goJG9wdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQoJG9wdGlvbnMpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRyZXN1bHRzLCAkZHJvcGRvd24pIHtcbiAgICB2YXIgJHJlc3VsdHNDb250YWluZXIgPSAkZHJvcGRvd24uZmluZCgnLnNlbGVjdDItcmVzdWx0cycpO1xuICAgICRyZXN1bHRzQ29udGFpbmVyLmFwcGVuZCgkcmVzdWx0cyk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHNvcnRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ3NvcnRlcicpO1xuXG4gICAgcmV0dXJuIHNvcnRlcihkYXRhKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5oaWdobGlnaHRGaXJzdEl0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kcmVzdWx0c1xuICAgICAgLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgdmFyICRzZWxlY3RlZCA9ICRvcHRpb25zLmZpbHRlcignW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0nKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgc2VsZWN0ZWQgb3B0aW9uc1xuICAgIGlmICgkc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgLy8gSWYgdGhlcmUgYXJlIHNlbGVjdGVkIG9wdGlvbnMsIGhpZ2hsaWdodCB0aGUgZmlyc3RcbiAgICAgICRzZWxlY3RlZC5maXJzdCgpLnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHNlbGVjdGVkIG9wdGlvbnMsIGhpZ2hsaWdodCB0aGUgZmlyc3Qgb3B0aW9uXG4gICAgICAvLyBpbiB0aGUgZHJvcGRvd25cbiAgICAgICRvcHRpb25zLmZpcnN0KCkudHJpZ2dlcignbW91c2VlbnRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuZW5zdXJlSGlnaGxpZ2h0VmlzaWJsZSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnNldENsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5kYXRhLmN1cnJlbnQoZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRJZHMgPSAkLm1hcChzZWxlY3RlZCwgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuaWQudG9TdHJpbmcoKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzXG4gICAgICAgIC5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcblxuICAgICAgICB2YXIgaXRlbSA9IFV0aWxzLkdldERhdGEodGhpcywgJ2RhdGEnKTtcblxuICAgICAgICAvLyBpZCBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgd2hlbiBjb21wYXJpbmdcbiAgICAgICAgdmFyIGlkID0gJycgKyBpdGVtLmlkO1xuXG4gICAgICAgIGlmICgoaXRlbS5lbGVtZW50ICE9IG51bGwgJiYgaXRlbS5lbGVtZW50LnNlbGVjdGVkKSB8fFxuICAgICAgICAgICAgKGl0ZW0uZWxlbWVudCA9PSBudWxsICYmICQuaW5BcnJheShpZCwgc2VsZWN0ZWRJZHMpID4gLTEpKSB7XG4gICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5zaG93TG9hZGluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICB2YXIgbG9hZGluZ01vcmUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQoJ3NlYXJjaGluZycpO1xuXG4gICAgdmFyIGxvYWRpbmcgPSB7XG4gICAgICBkaXNhYmxlZDogdHJ1ZSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICB0ZXh0OiBsb2FkaW5nTW9yZShwYXJhbXMpXG4gICAgfTtcbiAgICB2YXIgJGxvYWRpbmcgPSB0aGlzLm9wdGlvbihsb2FkaW5nKTtcbiAgICAkbG9hZGluZy5jbGFzc05hbWUgKz0gJyBsb2FkaW5nLXJlc3VsdHMnO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5wcmVwZW5kKCRsb2FkaW5nKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5oaWRlTG9hZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRyZXN1bHRzLmZpbmQoJy5sb2FkaW5nLXJlc3VsdHMnKS5yZW1vdmUoKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIG9wdGlvbi5jbGFzc05hbWUgPSAnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24nO1xuXG4gICAgdmFyIGF0dHJzID0ge1xuICAgICAgJ3JvbGUnOiAndHJlZWl0ZW0nLFxuICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnXG4gICAgfTtcblxuICAgIGlmIChkYXRhLmRpc2FibGVkKSB7XG4gICAgICBkZWxldGUgYXR0cnNbJ2FyaWEtc2VsZWN0ZWQnXTtcbiAgICAgIGF0dHJzWydhcmlhLWRpc2FibGVkJ10gPSAndHJ1ZSc7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuaWQgPT0gbnVsbCkge1xuICAgICAgZGVsZXRlIGF0dHJzWydhcmlhLXNlbGVjdGVkJ107XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuX3Jlc3VsdElkICE9IG51bGwpIHtcbiAgICAgIG9wdGlvbi5pZCA9IGRhdGEuX3Jlc3VsdElkO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnRpdGxlKSB7XG4gICAgICBvcHRpb24udGl0bGUgPSBkYXRhLnRpdGxlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICBhdHRycy5yb2xlID0gJ2dyb3VwJztcbiAgICAgIGF0dHJzWydhcmlhLWxhYmVsJ10gPSBkYXRhLnRleHQ7XG4gICAgICBkZWxldGUgYXR0cnNbJ2FyaWEtc2VsZWN0ZWQnXTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBhdHRyIGluIGF0dHJzKSB7XG4gICAgICB2YXIgdmFsID0gYXR0cnNbYXR0cl07XG5cbiAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgdmFyICRvcHRpb24gPSAkKG9wdGlvbik7XG5cbiAgICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0cm9uZycpO1xuICAgICAgbGFiZWwuY2xhc3NOYW1lID0gJ3NlbGVjdDItcmVzdWx0c19fZ3JvdXAnO1xuXG4gICAgICB2YXIgJGxhYmVsID0gJChsYWJlbCk7XG4gICAgICB0aGlzLnRlbXBsYXRlKGRhdGEsIGxhYmVsKTtcblxuICAgICAgdmFyICRjaGlsZHJlbiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gZGF0YS5jaGlsZHJlbltjXTtcblxuICAgICAgICB2YXIgJGNoaWxkID0gdGhpcy5vcHRpb24oY2hpbGQpO1xuXG4gICAgICAgICRjaGlsZHJlbi5wdXNoKCRjaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciAkY2hpbGRyZW5Db250YWluZXIgPSAkKCc8dWw+PC91bD4nLCB7XG4gICAgICAgICdjbGFzcyc6ICdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnMgc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25zLS1uZXN0ZWQnXG4gICAgICB9KTtcblxuICAgICAgJGNoaWxkcmVuQ29udGFpbmVyLmFwcGVuZCgkY2hpbGRyZW4pO1xuXG4gICAgICAkb3B0aW9uLmFwcGVuZChsYWJlbCk7XG4gICAgICAkb3B0aW9uLmFwcGVuZCgkY2hpbGRyZW5Db250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlbXBsYXRlKGRhdGEsIG9wdGlvbik7XG4gICAgfVxuXG4gICAgVXRpbHMuU3RvcmVEYXRhKG9wdGlvbiwgJ2RhdGEnLCBkYXRhKTtcblxuICAgIHJldHVybiBvcHRpb247XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdHMnO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5hdHRyKCdpZCcsIGlkKTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmNsZWFyKCk7XG4gICAgICBzZWxmLmFwcGVuZChwYXJhbXMuZGF0YSk7XG5cbiAgICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICAgIHNlbGYuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YXBwZW5kJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5hcHBlbmQocGFyYW1zLmRhdGEpO1xuXG4gICAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdxdWVyeScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuaGlkZU1lc3NhZ2VzKCk7XG4gICAgICBzZWxmLnNob3dMb2FkaW5nKHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMuZ2V0KCdzY3JvbGxBZnRlclNlbGVjdCcpKSB7XG4gICAgICAgIHNlbGYuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnNldENsYXNzZXMoKTtcblxuICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ3Njcm9sbEFmdGVyU2VsZWN0JykpIHtcbiAgICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW4sIGFyaWEtZXhwZW5kZWQ9XCJ0cnVlXCJcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgc2VsZi5lbnN1cmVIaWdobGlnaHRWaXNpYmxlKCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCBhcmlhLWV4cGVuZGVkPVwiZmFsc2VcIlxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIHNlbGYuJHJlc3VsdHMucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6dG9nZ2xlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRoaWdobGlnaHRlZCA9IHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGhpZ2hsaWdodGVkLnRyaWdnZXIoJ21vdXNldXAnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IFV0aWxzLkdldERhdGEoJGhpZ2hsaWdodGVkWzBdLCAnZGF0YScpO1xuXG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PSAndHJ1ZScpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdjbG9zZScsIHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0Jywge1xuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6cHJldmlvdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0cy5maW5kKCdbYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgICAgdmFyIGN1cnJlbnRJbmRleCA9ICRvcHRpb25zLmluZGV4KCRoaWdobGlnaHRlZCk7XG5cbiAgICAgIC8vIElmIHdlIGFyZSBhbHJlYWR5IGF0IHRoZSB0b3AsIGRvbid0IG1vdmUgZnVydGhlclxuICAgICAgLy8gSWYgbm8gb3B0aW9ucywgY3VycmVudEluZGV4IHdpbGwgYmUgLTFcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuXG4gICAgICAvLyBJZiBub25lIGFyZSBoaWdobGlnaHRlZCwgaGlnaGxpZ2h0IHRoZSBmaXJzdFxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbmV4dEluZGV4ID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyICRuZXh0ID0gJG9wdGlvbnMuZXEobmV4dEluZGV4KTtcblxuICAgICAgJG5leHQudHJpZ2dlcignbW91c2VlbnRlcicpO1xuXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHNlbGYuJHJlc3VsdHMub2Zmc2V0KCkudG9wO1xuICAgICAgdmFyIG5leHRUb3AgPSAkbmV4dC5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgbmV4dE9mZnNldCA9IHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKCkgKyAobmV4dFRvcCAtIGN1cnJlbnRPZmZzZXQpO1xuXG4gICAgICBpZiAobmV4dEluZGV4ID09PSAwKSB7XG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuICAgICAgfSBlbHNlIGlmIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCA8IDApIHtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AobmV4dE9mZnNldCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6bmV4dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJ1thcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcblxuICAgICAgdmFyIG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG5cbiAgICAgIC8vIElmIHdlIGFyZSBhdCB0aGUgbGFzdCBvcHRpb24sIHN0YXkgdGhlcmVcbiAgICAgIGlmIChuZXh0SW5kZXggPj0gJG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyICRuZXh0ID0gJG9wdGlvbnMuZXEobmV4dEluZGV4KTtcblxuICAgICAgJG5leHQudHJpZ2dlcignbW91c2VlbnRlcicpO1xuXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHNlbGYuJHJlc3VsdHMub2Zmc2V0KCkudG9wICtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICB2YXIgbmV4dEJvdHRvbSA9ICRuZXh0Lm9mZnNldCgpLnRvcCArICRuZXh0Lm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgIHZhciBuZXh0T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIG5leHRCb3R0b20gLSBjdXJyZW50T2Zmc2V0O1xuXG4gICAgICBpZiAobmV4dEluZGV4ID09PSAwKSB7XG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuICAgICAgfSBlbHNlIGlmIChuZXh0Qm90dG9tID4gY3VycmVudE9mZnNldCkge1xuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHBhcmFtcy5lbGVtZW50LmFkZENsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czptZXNzYWdlJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5kaXNwbGF5TWVzc2FnZShwYXJhbXMpO1xuICAgIH0pO1xuXG4gICAgaWYgKCQuZm4ubW91c2V3aGVlbCkge1xuICAgICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V3aGVlbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0b3AgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIHZhciBib3R0b20gPSBzZWxmLiRyZXN1bHRzLmdldCgwKS5zY3JvbGxIZWlnaHQgLSB0b3AgKyBlLmRlbHRhWTtcblxuICAgICAgICB2YXIgaXNBdFRvcCA9IGUuZGVsdGFZID4gMCAmJiB0b3AgLSBlLmRlbHRhWSA8PSAwO1xuICAgICAgICB2YXIgaXNBdEJvdHRvbSA9IGUuZGVsdGFZIDwgMCAmJiBib3R0b20gPD0gc2VsZi4kcmVzdWx0cy5oZWlnaHQoKTtcblxuICAgICAgICBpZiAoaXNBdFRvcCkge1xuICAgICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBdEJvdHRvbSkge1xuICAgICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKFxuICAgICAgICAgICAgc2VsZi4kcmVzdWx0cy5nZXQoMCkuc2Nyb2xsSGVpZ2h0IC0gc2VsZi4kcmVzdWx0cy5oZWlnaHQoKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V1cCcsICcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgdmFyIGRhdGEgPSBVdGlscy5HZXREYXRhKHRoaXMsICdkYXRhJyk7XG5cbiAgICAgIGlmICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigndW5zZWxlY3QnLCB7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdjbG9zZScsIHt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZWVudGVyJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgZGF0YSA9IFV0aWxzLkdldERhdGEodGhpcywgJ2RhdGEnKTtcblxuICAgICAgc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XG5cbiAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpmb2N1cycsIHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgZWxlbWVudDogJCh0aGlzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSB0aGlzLiRyZXN1bHRzXG4gICAgLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcblxuICAgIHJldHVybiAkaGlnaGxpZ2h0ZWQ7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRyZXN1bHRzLnJlbW92ZSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmVuc3VyZUhpZ2hsaWdodFZpc2libGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRoaWdobGlnaHRlZCA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcblxuICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gdGhpcy4kcmVzdWx0cy5vZmZzZXQoKS50b3A7XG4gICAgdmFyIG5leHRUb3AgPSAkaGlnaGxpZ2h0ZWQub2Zmc2V0KCkudG9wO1xuICAgIHZhciBuZXh0T2Zmc2V0ID0gdGhpcy4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCk7XG5cbiAgICB2YXIgb2Zmc2V0RGVsdGEgPSBuZXh0VG9wIC0gY3VycmVudE9mZnNldDtcbiAgICBuZXh0T2Zmc2V0IC09ICRoaWdobGlnaHRlZC5vdXRlckhlaWdodChmYWxzZSkgKiAyO1xuXG4gICAgaWYgKGN1cnJlbnRJbmRleCA8PSAyKSB7XG4gICAgICB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcbiAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhID4gdGhpcy4kcmVzdWx0cy5vdXRlckhlaWdodCgpIHx8IG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgdGhpcy4kcmVzdWx0cy5zY3JvbGxUb3AobmV4dE9mZnNldCk7XG4gICAgfVxuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnRlbXBsYXRlID0gZnVuY3Rpb24gKHJlc3VsdCwgY29udGFpbmVyKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmdldCgndGVtcGxhdGVSZXN1bHQnKTtcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XG5cbiAgICB2YXIgY29udGVudCA9IHRlbXBsYXRlKHJlc3VsdCwgY29udGFpbmVyKTtcblxuICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gZXNjYXBlTWFya3VwKGNvbnRlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKGNvbnRhaW5lcikuYXBwZW5kKGNvbnRlbnQpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUmVzdWx0cztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIva2V5cycsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBLRVlTID0ge1xuICAgIEJBQ0tTUEFDRTogOCxcbiAgICBUQUI6IDksXG4gICAgRU5URVI6IDEzLFxuICAgIFNISUZUOiAxNixcbiAgICBDVFJMOiAxNyxcbiAgICBBTFQ6IDE4LFxuICAgIEVTQzogMjcsXG4gICAgU1BBQ0U6IDMyLFxuICAgIFBBR0VfVVA6IDMzLFxuICAgIFBBR0VfRE9XTjogMzQsXG4gICAgRU5EOiAzNSxcbiAgICBIT01FOiAzNixcbiAgICBMRUZUOiAzNyxcbiAgICBVUDogMzgsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwLFxuICAgIERFTEVURTogNDZcbiAgfTtcblxuICByZXR1cm4gS0VZUztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL2Jhc2UnLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscycsXG4gICcuLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzLCBLRVlTKSB7XG4gIGZ1bmN0aW9uIEJhc2VTZWxlY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBCYXNlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKEJhc2VTZWxlY3Rpb24sIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHNlbGVjdGlvbiA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvblwiIHJvbGU9XCJjb21ib2JveFwiICcgK1xuICAgICAgJyBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPicgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcblxuICAgIHRoaXMuX3RhYmluZGV4ID0gMDtcblxuICAgIGlmIChVdGlscy5HZXREYXRhKHRoaXMuJGVsZW1lbnRbMF0sICdvbGQtdGFiaW5kZXgnKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90YWJpbmRleCA9IFV0aWxzLkdldERhdGEodGhpcy4kZWxlbWVudFswXSwgJ29sZC10YWJpbmRleCcpO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RhYmluZGV4ID0gdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpO1xuICAgIH1cblxuICAgICRzZWxlY3Rpb24uYXR0cigndGl0bGUnLCB0aGlzLiRlbGVtZW50LmF0dHIoJ3RpdGxlJykpO1xuICAgICRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCB0aGlzLl90YWJpbmRleCk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24gPSAkc2VsZWN0aW9uO1xuXG4gICAgcmV0dXJuICRzZWxlY3Rpb247XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLWNvbnRhaW5lcic7XG4gICAgdmFyIHJlc3VsdHNJZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0cyc7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignYmx1cicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUJsdXIoZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcigna2V5cHJlc3MnLCBldnQpO1xuXG4gICAgICBpZiAoZXZ0LndoaWNoID09PSBLRVlTLlNQQUNFKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmZvY3VzJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIHBhcmFtcy5kYXRhLl9yZXN1bHRJZCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdGlvbjp1cGRhdGUnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLnVwZGF0ZShwYXJhbXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBvcGVuLCBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1vd25zJywgcmVzdWx0c0lkKTtcblxuICAgICAgc2VsZi5fYXR0YWNoQ2xvc2VIYW5kbGVyKGNvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIlxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5yZW1vdmVBdHRyKCdhcmlhLW93bnMnKTtcblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLiRzZWxlY3Rpb24uZm9jdXMoKTtcbiAgICAgIH0sIDApO1xuICAgIFxuICAgICAgc2VsZi5fZGV0YWNoQ2xvc2VIYW5kbGVyKGNvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsIHNlbGYuX3RhYmluZGV4KTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZGlzYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuICAgIH0pO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLl9oYW5kbGVCbHVyID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhcyB0aGUgYWN0aXZlIGVsZW1lbnQgaXMgdGhlIGJvZHkgd2hlbiB0aGUgdGFiXG4gICAgLy8ga2V5IGlzIHByZXNzZWQsIHBvc3NpYmx5IGFsb25nIHdpdGggb3RoZXJzLlxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIERvbid0IHRyaWdnZXIgYGJsdXJgIGlmIHRoZSBmb2N1cyBpcyBzdGlsbCBpbiB0aGUgc2VsZWN0aW9uXG4gICAgICBpZiAoXG4gICAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09IHNlbGYuJHNlbGVjdGlvblswXSkgfHxcbiAgICAgICAgKCQuY29udGFpbnMoc2VsZi4kc2VsZWN0aW9uWzBdLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudHJpZ2dlcignYmx1cicsIGV2dCk7XG4gICAgfSwgMSk7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuX2F0dGFjaENsb3NlSGFuZGxlciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdtb3VzZWRvd24uc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcblxuICAgICAgdmFyICRzZWxlY3QgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zZWxlY3QyJyk7XG5cbiAgICAgIHZhciAkYWxsID0gJCgnLnNlbGVjdDIuc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcblxuICAgICAgJGFsbC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICBpZiAodGhpcyA9PSAkc2VsZWN0WzBdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRlbGVtZW50ID0gVXRpbHMuR2V0RGF0YSh0aGlzLCAnZWxlbWVudCcpO1xuXG4gICAgICAgICRlbGVtZW50LnNlbGVjdDIoJ2Nsb3NlJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5fZGV0YWNoQ2xvc2VIYW5kbGVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgICQoZG9jdW1lbnQuYm9keSkub2ZmKCdtb3VzZWRvd24uc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkKTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uICgkc2VsZWN0aW9uLCAkY29udGFpbmVyKSB7XG4gICAgdmFyICRzZWxlY3Rpb25Db250YWluZXIgPSAkY29udGFpbmVyLmZpbmQoJy5zZWxlY3Rpb24nKTtcbiAgICAkc2VsZWN0aW9uQ29udGFpbmVyLmFwcGVuZCgkc2VsZWN0aW9uKTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2RldGFjaENsb3NlSGFuZGxlcih0aGlzLmNvbnRhaW5lcik7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgdXBkYXRlYCBtZXRob2QgbXVzdCBiZSBkZWZpbmVkIGluIGNoaWxkIGNsYXNzZXMuJyk7XG4gIH07XG5cbiAgcmV0dXJuIEJhc2VTZWxlY3Rpb247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9zaW5nbGUnLFtcbiAgJ2pxdWVyeScsXG4gICcuL2Jhc2UnLFxuICAnLi4vdXRpbHMnLFxuICAnLi4va2V5cydcbl0sIGZ1bmN0aW9uICgkLCBCYXNlU2VsZWN0aW9uLCBVdGlscywgS0VZUykge1xuICBmdW5jdGlvbiBTaW5nbGVTZWxlY3Rpb24gKCkge1xuICAgIFNpbmdsZVNlbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChTaW5nbGVTZWxlY3Rpb24sIEJhc2VTZWxlY3Rpb24pO1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkc2VsZWN0aW9uID0gU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5yZW5kZXIuY2FsbCh0aGlzKTtcblxuICAgICRzZWxlY3Rpb24uYWRkQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnKTtcblxuICAgICRzZWxlY3Rpb24uaHRtbChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZFwiPjwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19hcnJvd1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj4nICtcbiAgICAgICAgJzxiIHJvbGU9XCJwcmVzZW50YXRpb25cIj48L2I+JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuXG4gICAgcmV0dXJuICRzZWxlY3Rpb247XG4gIH07XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIFNpbmdsZVNlbGVjdGlvbi5fX3N1cGVyX18uYmluZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIGlkID0gY29udGFpbmVyLmlkICsgJy1jb250YWluZXInO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKVxuICAgICAgLmF0dHIoJ2lkJywgaWQpXG4gICAgICAuYXR0cigncm9sZScsICd0ZXh0Ym94JylcbiAgICAgIC5hdHRyKCdhcmlhLXJlYWRvbmx5JywgJ3RydWUnKTtcbiAgICB0aGlzLiRzZWxlY3Rpb24uYXR0cignYXJpYS1sYWJlbGxlZGJ5JywgaWQpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAvLyBPbmx5IHJlc3BvbmQgdG8gbGVmdCBjbGlja3NcbiAgICAgIGlmIChldnQud2hpY2ggIT09IDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnRyaWdnZXIoJ3RvZ2dsZScsIHtcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAvLyBVc2VyIGZvY3VzZXMgb24gdGhlIGNvbnRhaW5lclxuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdibHVyJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgLy8gVXNlciBleGl0cyB0aGUgY29udGFpbmVyXG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi4kc2VsZWN0aW9uLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcbiAgICAkcmVuZGVyZWQuZW1wdHkoKTtcbiAgICAkcmVuZGVyZWQucmVtb3ZlQXR0cigndGl0bGUnKTsgLy8gY2xlYXIgdG9vbHRpcCBvbiBlbXB0eVxuICB9O1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uIChkYXRhLCBjb250YWluZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVNlbGVjdGlvbicpO1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHJldHVybiBlc2NhcGVNYXJrdXAodGVtcGxhdGUoZGF0YSwgY29udGFpbmVyKSk7XG4gIH07XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3Rpb25Db250YWluZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoJzxzcGFuPjwvc3Bhbj4nKTtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbMF07XG5cbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcbiAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbiwgJHJlbmRlcmVkKTtcblxuICAgICRyZW5kZXJlZC5lbXB0eSgpLmFwcGVuZChmb3JtYXR0ZWQpO1xuICAgICRyZW5kZXJlZC5hdHRyKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG4gIH07XG5cbiAgcmV0dXJuIFNpbmdsZVNlbGVjdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxbXG4gICdqcXVlcnknLFxuICAnLi9iYXNlJyxcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIEJhc2VTZWxlY3Rpb24sIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIE11bHRpcGxlU2VsZWN0aW9uICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKE11bHRpcGxlU2VsZWN0aW9uLCBCYXNlU2VsZWN0aW9uKTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkc2VsZWN0aW9uID0gTXVsdGlwbGVTZWxlY3Rpb24uX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xuXG4gICAgJHNlbGVjdGlvbi5hZGRDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb24tLW11bHRpcGxlJyk7XG5cbiAgICAkc2VsZWN0aW9uLmh0bWwoXG4gICAgICAnPHVsIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkXCI+PC91bD4nXG4gICAgKTtcblxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCd0b2dnbGUnLCB7XG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oXG4gICAgICAnY2xpY2snLFxuICAgICAgJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlX19yZW1vdmUnLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGV2ZW50IGlmIGl0IGlzIGRpc2FibGVkXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRyZW1vdmUgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgJHNlbGVjdGlvbiA9ICRyZW1vdmUucGFyZW50KCk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSBVdGlscy5HZXREYXRhKCRzZWxlY3Rpb25bMF0sICdkYXRhJyk7XG5cbiAgICAgICAgc2VsZi50cmlnZ2VyKCd1bnNlbGVjdCcsIHtcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcbiAgICAkcmVuZGVyZWQuZW1wdHkoKTtcbiAgICAkcmVuZGVyZWQucmVtb3ZlQXR0cigndGl0bGUnKTtcbiAgfTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uIChkYXRhLCBjb250YWluZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVNlbGVjdGlvbicpO1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHJldHVybiBlc2NhcGVNYXJrdXAodGVtcGxhdGUoZGF0YSwgY29udGFpbmVyKSk7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdGlvbkNvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXG4gICAgICAnPGxpIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZVwiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlX19yZW1vdmVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+JyArXG4gICAgICAgICAgJyZ0aW1lczsnICtcbiAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICc8L2xpPidcbiAgICApO1xuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyICRzZWxlY3Rpb25zID0gW107XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuXG4gICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG4gICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbiwgJHNlbGVjdGlvbik7XG5cbiAgICAgICRzZWxlY3Rpb24uYXBwZW5kKGZvcm1hdHRlZCk7XG4gICAgICAkc2VsZWN0aW9uLmF0dHIoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcblxuICAgICAgVXRpbHMuU3RvcmVEYXRhKCRzZWxlY3Rpb25bMF0sICdkYXRhJywgc2VsZWN0aW9uKTtcblxuICAgICAgJHNlbGVjdGlvbnMucHVzaCgkc2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcblxuICAgIFV0aWxzLmFwcGVuZE1hbnkoJHJlbmRlcmVkLCAkc2VsZWN0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIE11bHRpcGxlU2VsZWN0aW9uO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vcGxhY2Vob2xkZXInLFtcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFV0aWxzKSB7XG4gIGZ1bmN0aW9uIFBsYWNlaG9sZGVyIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMubm9ybWFsaXplUGxhY2Vob2xkZXIob3B0aW9ucy5nZXQoJ3BsYWNlaG9sZGVyJykpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgUGxhY2Vob2xkZXIucHJvdG90eXBlLm5vcm1hbGl6ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKF8sIHBsYWNlaG9sZGVyKSB7XG4gICAgaWYgKHR5cGVvZiBwbGFjZWhvbGRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsYWNlaG9sZGVyID0ge1xuICAgICAgICBpZDogJycsXG4gICAgICAgIHRleHQ6IHBsYWNlaG9sZGVyXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBwbGFjZWhvbGRlcjtcbiAgfTtcblxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUuY3JlYXRlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwbGFjZWhvbGRlcikge1xuICAgIHZhciAkcGxhY2Vob2xkZXIgPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xuXG4gICAgJHBsYWNlaG9sZGVyLmh0bWwodGhpcy5kaXNwbGF5KHBsYWNlaG9sZGVyKSk7XG4gICAgJHBsYWNlaG9sZGVyLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbl9fcGxhY2Vob2xkZXInKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZScpO1xuXG4gICAgcmV0dXJuICRwbGFjZWhvbGRlcjtcbiAgfTtcblxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIHZhciBzaW5nbGVQbGFjZWhvbGRlciA9IChcbiAgICAgIGRhdGEubGVuZ3RoID09IDEgJiYgZGF0YVswXS5pZCAhPSB0aGlzLnBsYWNlaG9sZGVyLmlkXG4gICAgKTtcbiAgICB2YXIgbXVsdGlwbGVTZWxlY3Rpb25zID0gZGF0YS5sZW5ndGggPiAxO1xuXG4gICAgaWYgKG11bHRpcGxlU2VsZWN0aW9ucyB8fCBzaW5nbGVQbGFjZWhvbGRlcikge1xuICAgICAgcmV0dXJuIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIHZhciAkcGxhY2Vob2xkZXIgPSB0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyKHRoaXMucGxhY2Vob2xkZXIpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5hcHBlbmQoJHBsYWNlaG9sZGVyKTtcbiAgfTtcblxuICByZXR1cm4gUGxhY2Vob2xkZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9hbGxvd0NsZWFyJyxbXG4gICdqcXVlcnknLFxuICAnLi4va2V5cycsXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBLRVlTLCBVdGlscykge1xuICBmdW5jdGlvbiBBbGxvd0NsZWFyICgpIHsgfVxuXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGFsbG93Q2xlYXJgIG9wdGlvbiBzaG91bGQgYmUgdXNlZCBpbiBjb21iaW5hdGlvbiAnICtcbiAgICAgICAgICAnd2l0aCB0aGUgYHBsYWNlaG9sZGVyYCBvcHRpb24uJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignbW91c2Vkb3duJywgJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXInLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBzZWxmLl9oYW5kbGVDbGVhcihldnQpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUtleWJvYXJkQ2xlYXIoZXZ0LCBjb250YWluZXIpO1xuICAgIH0pO1xuICB9O1xuXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLl9oYW5kbGVDbGVhciA9IGZ1bmN0aW9uIChfLCBldnQpIHtcbiAgICAvLyBJZ25vcmUgdGhlIGV2ZW50IGlmIGl0IGlzIGRpc2FibGVkXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgJGNsZWFyID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXInKTtcblxuICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgbm90aGluZyBoYXMgYmVlbiBzZWxlY3RlZFxuICAgIGlmICgkY2xlYXIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdmFyIGRhdGEgPSBVdGlscy5HZXREYXRhKCRjbGVhclswXSwgJ2RhdGEnKTtcblxuICAgIHZhciBwcmV2aW91c1ZhbCA9IHRoaXMuJGVsZW1lbnQudmFsKCk7XG4gICAgdGhpcy4kZWxlbWVudC52YWwodGhpcy5wbGFjZWhvbGRlci5pZCk7XG5cbiAgICB2YXIgdW5zZWxlY3REYXRhID0ge1xuICAgICAgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy50cmlnZ2VyKCdjbGVhcicsIHVuc2VsZWN0RGF0YSk7XG4gICAgaWYgKHVuc2VsZWN0RGF0YS5wcmV2ZW50ZWQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudmFsKHByZXZpb3VzVmFsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHVuc2VsZWN0RGF0YSA9IHtcbiAgICAgICAgZGF0YTogZGF0YVtkXVxuICAgICAgfTtcblxuICAgICAgLy8gVHJpZ2dlciB0aGUgYHVuc2VsZWN0YCBldmVudCwgc28gcGVvcGxlIGNhbiBwcmV2ZW50IGl0IGZyb20gYmVpbmdcbiAgICAgIC8vIGNsZWFyZWQuXG4gICAgICB0aGlzLnRyaWdnZXIoJ3Vuc2VsZWN0JywgdW5zZWxlY3REYXRhKTtcblxuICAgICAgLy8gSWYgdGhlIGV2ZW50IHdhcyBwcmV2ZW50ZWQsIGRvbid0IGNsZWFyIGl0IG91dC5cbiAgICAgIGlmICh1bnNlbGVjdERhdGEucHJldmVudGVkKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudmFsKHByZXZpb3VzVmFsKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3RvZ2dsZScsIHt9KTtcbiAgfTtcblxuICBBbGxvd0NsZWFyLnByb3RvdHlwZS5faGFuZGxlS2V5Ym9hcmRDbGVhciA9IGZ1bmN0aW9uIChfLCBldnQsIGNvbnRhaW5lcikge1xuICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZ0LndoaWNoID09IEtFWVMuREVMRVRFIHx8IGV2dC53aGljaCA9PSBLRVlTLkJBQ0tTUEFDRSkge1xuICAgICAgdGhpcy5faGFuZGxlQ2xlYXIoZXZ0KTtcbiAgICB9XG4gIH07XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgaWYgKHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3BsYWNlaG9sZGVyJykubGVuZ3RoID4gMCB8fFxuICAgICAgICBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciByZW1vdmVBbGwgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQoJ3JlbW92ZUFsbEl0ZW1zJyk7ICAgXG5cbiAgICB2YXIgJHJlbW92ZSA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXJcIiB0aXRsZT1cIicgKyByZW1vdmVBbGwoKSArJ1wiPicgK1xuICAgICAgICAnJnRpbWVzOycgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcbiAgICBVdGlscy5TdG9yZURhdGEoJHJlbW92ZVswXSwgJ2RhdGEnLCBkYXRhKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykucHJlcGVuZCgkcmVtb3ZlKTtcbiAgfTtcblxuICByZXR1cm4gQWxsb3dDbGVhcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL3NlYXJjaCcsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJyxcbiAgJy4uL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMsIEtFWVMpIHtcbiAgZnVuY3Rpb24gU2VhcmNoIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdmFyICRzZWFyY2ggPSAkKFxuICAgICAgJzxsaSBjbGFzcz1cInNlbGVjdDItc2VhcmNoIHNlbGVjdDItc2VhcmNoLS1pbmxpbmVcIj4nICtcbiAgICAgICAgJzxpbnB1dCBjbGFzcz1cInNlbGVjdDItc2VhcmNoX19maWVsZFwiIHR5cGU9XCJzZWFyY2hcIiB0YWJpbmRleD1cIi0xXCInICtcbiAgICAgICAgJyBhdXRvY29tcGxldGU9XCJvZmZcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwibm9uZVwiJyArXG4gICAgICAgICcgc3BlbGxjaGVjaz1cImZhbHNlXCIgcm9sZT1cInRleHRib3hcIiBhcmlhLWF1dG9jb21wbGV0ZT1cImxpc3RcIiAvPicgK1xuICAgICAgJzwvbGk+J1xuICAgICk7XG5cbiAgICB0aGlzLiRzZWFyY2hDb250YWluZXIgPSAkc2VhcmNoO1xuICAgIHRoaXMuJHNlYXJjaCA9ICRzZWFyY2guZmluZCgnaW5wdXQnKTtcblxuICAgIHZhciAkcmVuZGVyZWQgPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX3RyYW5zZmVyVGFiSW5kZXgoKTtcblxuICAgIHJldHVybiAkcmVuZGVyZWQ7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC50cmlnZ2VyKCdmb2N1cycpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC52YWwoJycpO1xuICAgICAgc2VsZi4kc2VhcmNoLnJlbW92ZUF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpO1xuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgc2VsZi5fdHJhbnNmZXJUYWJJbmRleCgpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLiRzZWFyY2guYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgcGFyYW1zLmlkKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXNpbicsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignZm9jdXMnLCBldnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1c291dCcsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUJsdXIoZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbigna2V5ZG93bicsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XG5cbiAgICAgIHNlbGYuX2tleVVwUHJldmVudGVkID0gZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpO1xuXG4gICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xuXG4gICAgICBpZiAoa2V5ID09PSBLRVlTLkJBQ0tTUEFDRSAmJiBzZWxmLiRzZWFyY2gudmFsKCkgPT09ICcnKSB7XG4gICAgICAgIHZhciAkcHJldmlvdXNDaG9pY2UgPSBzZWxmLiRzZWFyY2hDb250YWluZXJcbiAgICAgICAgICAucHJldignLnNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2UnKTtcblxuICAgICAgICBpZiAoJHByZXZpb3VzQ2hvaWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IFV0aWxzLkdldERhdGEoJHByZXZpb3VzQ2hvaWNlWzBdLCAnZGF0YScpO1xuXG4gICAgICAgICAgc2VsZi5zZWFyY2hSZW1vdmVDaG9pY2UoaXRlbSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVHJ5IHRvIGRldGVjdCB0aGUgSUUgdmVyc2lvbiBzaG91bGQgdGhlIGBkb2N1bWVudE1vZGVgIHByb3BlcnR5IHRoYXRcbiAgICAvLyBpcyBzdG9yZWQgb24gdGhlIGRvY3VtZW50LiBUaGlzIGlzIG9ubHkgaW1wbGVtZW50ZWQgaW4gSUUgYW5kIGlzXG4gICAgLy8gc2xpZ2h0bHkgY2xlYW5lciB0aGFuIGRvaW5nIGEgdXNlciBhZ2VudCBjaGVjay5cbiAgICAvLyBUaGlzIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUgaW4gRWRnZSwgYnV0IEVkZ2UgYWxzbyBkb2Vzbid0IGhhdmVcbiAgICAvLyB0aGlzIGJ1Zy5cbiAgICB2YXIgbXNpZSA9IGRvY3VtZW50LmRvY3VtZW50TW9kZTtcbiAgICB2YXIgZGlzYWJsZUlucHV0RXZlbnRzID0gbXNpZSAmJiBtc2llIDw9IDExO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgYnJvd3NlcnMgd2hpY2ggZG8gbm90IHN1cHBvcnQgdGhlIGBpbnB1dGAgZXZlbnRcbiAgICAvLyBUaGlzIHdpbGwgcHJldmVudCBkb3VibGUtdHJpZ2dlcmluZyBvZiBldmVudHMgZm9yIGJyb3dzZXJzIHdoaWNoIHN1cHBvcnRcbiAgICAvLyBib3RoIHRoZSBga2V5dXBgIGFuZCBgaW5wdXRgIGV2ZW50cy5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oXG4gICAgICAnaW5wdXQuc2VhcmNoY2hlY2snLFxuICAgICAgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJyxcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgLy8gSUUgd2lsbCB0cmlnZ2VyIHRoZSBgaW5wdXRgIGV2ZW50IHdoZW4gYSBwbGFjZWhvbGRlciBpcyB1c2VkIG9uIGFcbiAgICAgICAgLy8gc2VhcmNoIGJveC4gVG8gZ2V0IGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBhcmUgZm9yY2VkIHRvIGlnbm9yZSBhbGxcbiAgICAgICAgLy8gYGlucHV0YCBldmVudHMgaW4gSUUgYW5kIGtlZXAgdXNpbmcgYGtleXVwYC5cbiAgICAgICAgaWYgKGRpc2FibGVJbnB1dEV2ZW50cykge1xuICAgICAgICAgIHNlbGYuJHNlbGVjdGlvbi5vZmYoJ2lucHV0LnNlYXJjaCBpbnB1dC5zZWFyY2hjaGVjaycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVuYmluZCB0aGUgZHVwbGljYXRlZCBga2V5dXBgIGV2ZW50XG4gICAgICAgIHNlbGYuJHNlbGVjdGlvbi5vZmYoJ2tleXVwLnNlYXJjaCcpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oXG4gICAgICAna2V5dXAuc2VhcmNoIGlucHV0LnNlYXJjaCcsXG4gICAgICAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAvLyBJRSB3aWxsIHRyaWdnZXIgdGhlIGBpbnB1dGAgZXZlbnQgd2hlbiBhIHBsYWNlaG9sZGVyIGlzIHVzZWQgb24gYVxuICAgICAgICAvLyBzZWFyY2ggYm94LiBUbyBnZXQgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIGFyZSBmb3JjZWQgdG8gaWdub3JlIGFsbFxuICAgICAgICAvLyBgaW5wdXRgIGV2ZW50cyBpbiBJRSBhbmQga2VlcCB1c2luZyBga2V5dXBgLlxuICAgICAgICBpZiAoZGlzYWJsZUlucHV0RXZlbnRzICYmIGV2dC50eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZignaW5wdXQuc2VhcmNoIGlucHV0LnNlYXJjaGNoZWNrJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleSA9IGV2dC53aGljaDtcblxuICAgICAgICAvLyBXZSBjYW4gZnJlZWx5IGlnbm9yZSBldmVudHMgZnJvbSBtb2RpZmllciBrZXlzXG4gICAgICAgIGlmIChrZXkgPT0gS0VZUy5TSElGVCB8fCBrZXkgPT0gS0VZUy5DVFJMIHx8IGtleSA9PSBLRVlTLkFMVCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRhYmJpbmcgd2lsbCBiZSBoYW5kbGVkIGR1cmluZyB0aGUgYGtleWRvd25gIHBoYXNlXG4gICAgICAgIGlmIChrZXkgPT0gS0VZUy5UQUIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmhhbmRsZVNlYXJjaChldnQpO1xuICAgICAgfVxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgdHJhbnNmZXIgdGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBmcm9tIHRoZSByZW5kZXJlZFxuICAgKiBzZWxlY3Rpb24gdG8gdGhlIHNlYXJjaCBib3guIFRoaXMgYWxsb3dzIGZvciB0aGUgc2VhcmNoIGJveCB0byBiZSB1c2VkIGFzXG4gICAqIHRoZSBwcmltYXJ5IGZvY3VzIGluc3RlYWQgb2YgdGhlIHNlbGVjdGlvbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBTZWFyY2gucHJvdG90eXBlLl90cmFuc2ZlclRhYkluZGV4ID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHRoaXMuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIHRoaXMuJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcpKTtcbiAgICB0aGlzLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmNyZWF0ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGxhY2Vob2xkZXIpIHtcbiAgICB0aGlzLiRzZWFyY2guYXR0cigncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlci50ZXh0KTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICB2YXIgc2VhcmNoSGFkRm9jdXMgPSB0aGlzLiRzZWFyY2hbMF0gPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAgIHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKVxuICAgICAgICAgICAgICAgICAgIC5hcHBlbmQodGhpcy4kc2VhcmNoQ29udGFpbmVyKTtcblxuICAgIHRoaXMucmVzaXplU2VhcmNoKCk7XG4gICAgaWYgKHNlYXJjaEhhZEZvY3VzKSB7XG4gICAgICB2YXIgaXNUYWdJbnB1dCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnW2RhdGEtc2VsZWN0Mi10YWddJykubGVuZ3RoO1xuICAgICAgaWYgKGlzVGFnSW5wdXQpIHtcbiAgICAgICAgLy8gZml4IElFMTEgYnVnIHdoZXJlIHRhZyBpbnB1dCBsb3N0IGZvY3VzXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHNlYXJjaC5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmhhbmRsZVNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlc2l6ZVNlYXJjaCgpO1xuXG4gICAgaWYgKCF0aGlzLl9rZXlVcFByZXZlbnRlZCkge1xuICAgICAgdmFyIGlucHV0ID0gdGhpcy4kc2VhcmNoLnZhbCgpO1xuXG4gICAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge1xuICAgICAgICB0ZXJtOiBpbnB1dFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fa2V5VXBQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLnNlYXJjaFJlbW92ZUNob2ljZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGl0ZW0pIHtcbiAgICB0aGlzLnRyaWdnZXIoJ3Vuc2VsZWN0Jywge1xuICAgICAgZGF0YTogaXRlbVxuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VhcmNoLnZhbChpdGVtLnRleHQpO1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoKCk7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5yZXNpemVTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kc2VhcmNoLmNzcygnd2lkdGgnLCAnMjVweCcpO1xuXG4gICAgdmFyIHdpZHRoID0gJyc7XG5cbiAgICBpZiAodGhpcy4kc2VhcmNoLmF0dHIoJ3BsYWNlaG9sZGVyJykgIT09ICcnKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuaW5uZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbWluaW11bVdpZHRoID0gdGhpcy4kc2VhcmNoLnZhbCgpLmxlbmd0aCArIDE7XG5cbiAgICAgIHdpZHRoID0gKG1pbmltdW1XaWR0aCAqIDAuNzUpICsgJ2VtJztcbiAgICB9XG5cbiAgICB0aGlzLiRzZWFyY2guY3NzKCd3aWR0aCcsIHdpZHRoKTtcbiAgfTtcblxuICByZXR1cm4gU2VhcmNoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vZXZlbnRSZWxheScsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gRXZlbnRSZWxheSAoKSB7IH1cblxuICBFdmVudFJlbGF5LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZWxheUV2ZW50cyA9IFtcbiAgICAgICdvcGVuJywgJ29wZW5pbmcnLFxuICAgICAgJ2Nsb3NlJywgJ2Nsb3NpbmcnLFxuICAgICAgJ3NlbGVjdCcsICdzZWxlY3RpbmcnLFxuICAgICAgJ3Vuc2VsZWN0JywgJ3Vuc2VsZWN0aW5nJyxcbiAgICAgICdjbGVhcicsICdjbGVhcmluZydcbiAgICBdO1xuXG4gICAgdmFyIHByZXZlbnRhYmxlRXZlbnRzID0gW1xuICAgICAgJ29wZW5pbmcnLCAnY2xvc2luZycsICdzZWxlY3RpbmcnLCAndW5zZWxlY3RpbmcnLCAnY2xlYXJpbmcnXG4gICAgXTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XG4gICAgICAvLyBJZ25vcmUgZXZlbnRzIHRoYXQgc2hvdWxkIG5vdCBiZSByZWxheWVkXG4gICAgICBpZiAoJC5pbkFycmF5KG5hbWUsIHJlbGF5RXZlbnRzKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcGFyYW1ldGVycyBzaG91bGQgYWx3YXlzIGJlIGFuIG9iamVjdFxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgICAvLyBHZW5lcmF0ZSB0aGUgalF1ZXJ5IGV2ZW50IGZvciB0aGUgU2VsZWN0MiBldmVudFxuICAgICAgdmFyIGV2dCA9ICQuRXZlbnQoJ3NlbGVjdDI6JyArIG5hbWUsIHtcbiAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoZXZ0KTtcblxuICAgICAgLy8gT25seSBoYW5kbGUgcHJldmVudGFibGUgZXZlbnRzIGlmIGl0IHdhcyBvbmVcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgcHJldmVudGFibGVFdmVudHMpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHBhcmFtcy5wcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50UmVsYXk7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3RyYW5zbGF0aW9uJyxbXG4gICdqcXVlcnknLFxuICAncmVxdWlyZSdcbl0sIGZ1bmN0aW9uICgkLCByZXF1aXJlKSB7XG4gIGZ1bmN0aW9uIFRyYW5zbGF0aW9uIChkaWN0KSB7XG4gICAgdGhpcy5kaWN0ID0gZGljdCB8fCB7fTtcbiAgfVxuXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGljdDtcbiAgfTtcblxuICBUcmFuc2xhdGlvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLmRpY3Rba2V5XTtcbiAgfTtcblxuICBUcmFuc2xhdGlvbi5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKHRyYW5zbGF0aW9uKSB7XG4gICAgdGhpcy5kaWN0ID0gJC5leHRlbmQoe30sIHRyYW5zbGF0aW9uLmFsbCgpLCB0aGlzLmRpY3QpO1xuICB9O1xuXG4gIC8vIFN0YXRpYyBmdW5jdGlvbnNcblxuICBUcmFuc2xhdGlvbi5fY2FjaGUgPSB7fTtcblxuICBUcmFuc2xhdGlvbi5sb2FkUGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgaWYgKCEocGF0aCBpbiBUcmFuc2xhdGlvbi5fY2FjaGUpKSB7XG4gICAgICB2YXIgdHJhbnNsYXRpb25zID0gcmVxdWlyZShwYXRoKTtcblxuICAgICAgVHJhbnNsYXRpb24uX2NhY2hlW3BhdGhdID0gdHJhbnNsYXRpb25zO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVHJhbnNsYXRpb24oVHJhbnNsYXRpb24uX2NhY2hlW3BhdGhdKTtcbiAgfTtcblxuICByZXR1cm4gVHJhbnNsYXRpb247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RpYWNyaXRpY3MnLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICB2YXIgZGlhY3JpdGljcyA9IHtcbiAgICAnXFx1MjRCNic6ICdBJyxcbiAgICAnXFx1RkYyMSc6ICdBJyxcbiAgICAnXFx1MDBDMCc6ICdBJyxcbiAgICAnXFx1MDBDMSc6ICdBJyxcbiAgICAnXFx1MDBDMic6ICdBJyxcbiAgICAnXFx1MUVBNic6ICdBJyxcbiAgICAnXFx1MUVBNCc6ICdBJyxcbiAgICAnXFx1MUVBQSc6ICdBJyxcbiAgICAnXFx1MUVBOCc6ICdBJyxcbiAgICAnXFx1MDBDMyc6ICdBJyxcbiAgICAnXFx1MDEwMCc6ICdBJyxcbiAgICAnXFx1MDEwMic6ICdBJyxcbiAgICAnXFx1MUVCMCc6ICdBJyxcbiAgICAnXFx1MUVBRSc6ICdBJyxcbiAgICAnXFx1MUVCNCc6ICdBJyxcbiAgICAnXFx1MUVCMic6ICdBJyxcbiAgICAnXFx1MDIyNic6ICdBJyxcbiAgICAnXFx1MDFFMCc6ICdBJyxcbiAgICAnXFx1MDBDNCc6ICdBJyxcbiAgICAnXFx1MDFERSc6ICdBJyxcbiAgICAnXFx1MUVBMic6ICdBJyxcbiAgICAnXFx1MDBDNSc6ICdBJyxcbiAgICAnXFx1MDFGQSc6ICdBJyxcbiAgICAnXFx1MDFDRCc6ICdBJyxcbiAgICAnXFx1MDIwMCc6ICdBJyxcbiAgICAnXFx1MDIwMic6ICdBJyxcbiAgICAnXFx1MUVBMCc6ICdBJyxcbiAgICAnXFx1MUVBQyc6ICdBJyxcbiAgICAnXFx1MUVCNic6ICdBJyxcbiAgICAnXFx1MUUwMCc6ICdBJyxcbiAgICAnXFx1MDEwNCc6ICdBJyxcbiAgICAnXFx1MDIzQSc6ICdBJyxcbiAgICAnXFx1MkM2Ric6ICdBJyxcbiAgICAnXFx1QTczMic6ICdBQScsXG4gICAgJ1xcdTAwQzYnOiAnQUUnLFxuICAgICdcXHUwMUZDJzogJ0FFJyxcbiAgICAnXFx1MDFFMic6ICdBRScsXG4gICAgJ1xcdUE3MzQnOiAnQU8nLFxuICAgICdcXHVBNzM2JzogJ0FVJyxcbiAgICAnXFx1QTczOCc6ICdBVicsXG4gICAgJ1xcdUE3M0EnOiAnQVYnLFxuICAgICdcXHVBNzNDJzogJ0FZJyxcbiAgICAnXFx1MjRCNyc6ICdCJyxcbiAgICAnXFx1RkYyMic6ICdCJyxcbiAgICAnXFx1MUUwMic6ICdCJyxcbiAgICAnXFx1MUUwNCc6ICdCJyxcbiAgICAnXFx1MUUwNic6ICdCJyxcbiAgICAnXFx1MDI0Myc6ICdCJyxcbiAgICAnXFx1MDE4Mic6ICdCJyxcbiAgICAnXFx1MDE4MSc6ICdCJyxcbiAgICAnXFx1MjRCOCc6ICdDJyxcbiAgICAnXFx1RkYyMyc6ICdDJyxcbiAgICAnXFx1MDEwNic6ICdDJyxcbiAgICAnXFx1MDEwOCc6ICdDJyxcbiAgICAnXFx1MDEwQSc6ICdDJyxcbiAgICAnXFx1MDEwQyc6ICdDJyxcbiAgICAnXFx1MDBDNyc6ICdDJyxcbiAgICAnXFx1MUUwOCc6ICdDJyxcbiAgICAnXFx1MDE4Nyc6ICdDJyxcbiAgICAnXFx1MDIzQic6ICdDJyxcbiAgICAnXFx1QTczRSc6ICdDJyxcbiAgICAnXFx1MjRCOSc6ICdEJyxcbiAgICAnXFx1RkYyNCc6ICdEJyxcbiAgICAnXFx1MUUwQSc6ICdEJyxcbiAgICAnXFx1MDEwRSc6ICdEJyxcbiAgICAnXFx1MUUwQyc6ICdEJyxcbiAgICAnXFx1MUUxMCc6ICdEJyxcbiAgICAnXFx1MUUxMic6ICdEJyxcbiAgICAnXFx1MUUwRSc6ICdEJyxcbiAgICAnXFx1MDExMCc6ICdEJyxcbiAgICAnXFx1MDE4Qic6ICdEJyxcbiAgICAnXFx1MDE4QSc6ICdEJyxcbiAgICAnXFx1MDE4OSc6ICdEJyxcbiAgICAnXFx1QTc3OSc6ICdEJyxcbiAgICAnXFx1MDFGMSc6ICdEWicsXG4gICAgJ1xcdTAxQzQnOiAnRFonLFxuICAgICdcXHUwMUYyJzogJ0R6JyxcbiAgICAnXFx1MDFDNSc6ICdEeicsXG4gICAgJ1xcdTI0QkEnOiAnRScsXG4gICAgJ1xcdUZGMjUnOiAnRScsXG4gICAgJ1xcdTAwQzgnOiAnRScsXG4gICAgJ1xcdTAwQzknOiAnRScsXG4gICAgJ1xcdTAwQ0EnOiAnRScsXG4gICAgJ1xcdTFFQzAnOiAnRScsXG4gICAgJ1xcdTFFQkUnOiAnRScsXG4gICAgJ1xcdTFFQzQnOiAnRScsXG4gICAgJ1xcdTFFQzInOiAnRScsXG4gICAgJ1xcdTFFQkMnOiAnRScsXG4gICAgJ1xcdTAxMTInOiAnRScsXG4gICAgJ1xcdTFFMTQnOiAnRScsXG4gICAgJ1xcdTFFMTYnOiAnRScsXG4gICAgJ1xcdTAxMTQnOiAnRScsXG4gICAgJ1xcdTAxMTYnOiAnRScsXG4gICAgJ1xcdTAwQ0InOiAnRScsXG4gICAgJ1xcdTFFQkEnOiAnRScsXG4gICAgJ1xcdTAxMUEnOiAnRScsXG4gICAgJ1xcdTAyMDQnOiAnRScsXG4gICAgJ1xcdTAyMDYnOiAnRScsXG4gICAgJ1xcdTFFQjgnOiAnRScsXG4gICAgJ1xcdTFFQzYnOiAnRScsXG4gICAgJ1xcdTAyMjgnOiAnRScsXG4gICAgJ1xcdTFFMUMnOiAnRScsXG4gICAgJ1xcdTAxMTgnOiAnRScsXG4gICAgJ1xcdTFFMTgnOiAnRScsXG4gICAgJ1xcdTFFMUEnOiAnRScsXG4gICAgJ1xcdTAxOTAnOiAnRScsXG4gICAgJ1xcdTAxOEUnOiAnRScsXG4gICAgJ1xcdTI0QkInOiAnRicsXG4gICAgJ1xcdUZGMjYnOiAnRicsXG4gICAgJ1xcdTFFMUUnOiAnRicsXG4gICAgJ1xcdTAxOTEnOiAnRicsXG4gICAgJ1xcdUE3N0InOiAnRicsXG4gICAgJ1xcdTI0QkMnOiAnRycsXG4gICAgJ1xcdUZGMjcnOiAnRycsXG4gICAgJ1xcdTAxRjQnOiAnRycsXG4gICAgJ1xcdTAxMUMnOiAnRycsXG4gICAgJ1xcdTFFMjAnOiAnRycsXG4gICAgJ1xcdTAxMUUnOiAnRycsXG4gICAgJ1xcdTAxMjAnOiAnRycsXG4gICAgJ1xcdTAxRTYnOiAnRycsXG4gICAgJ1xcdTAxMjInOiAnRycsXG4gICAgJ1xcdTAxRTQnOiAnRycsXG4gICAgJ1xcdTAxOTMnOiAnRycsXG4gICAgJ1xcdUE3QTAnOiAnRycsXG4gICAgJ1xcdUE3N0QnOiAnRycsXG4gICAgJ1xcdUE3N0UnOiAnRycsXG4gICAgJ1xcdTI0QkQnOiAnSCcsXG4gICAgJ1xcdUZGMjgnOiAnSCcsXG4gICAgJ1xcdTAxMjQnOiAnSCcsXG4gICAgJ1xcdTFFMjInOiAnSCcsXG4gICAgJ1xcdTFFMjYnOiAnSCcsXG4gICAgJ1xcdTAyMUUnOiAnSCcsXG4gICAgJ1xcdTFFMjQnOiAnSCcsXG4gICAgJ1xcdTFFMjgnOiAnSCcsXG4gICAgJ1xcdTFFMkEnOiAnSCcsXG4gICAgJ1xcdTAxMjYnOiAnSCcsXG4gICAgJ1xcdTJDNjcnOiAnSCcsXG4gICAgJ1xcdTJDNzUnOiAnSCcsXG4gICAgJ1xcdUE3OEQnOiAnSCcsXG4gICAgJ1xcdTI0QkUnOiAnSScsXG4gICAgJ1xcdUZGMjknOiAnSScsXG4gICAgJ1xcdTAwQ0MnOiAnSScsXG4gICAgJ1xcdTAwQ0QnOiAnSScsXG4gICAgJ1xcdTAwQ0UnOiAnSScsXG4gICAgJ1xcdTAxMjgnOiAnSScsXG4gICAgJ1xcdTAxMkEnOiAnSScsXG4gICAgJ1xcdTAxMkMnOiAnSScsXG4gICAgJ1xcdTAxMzAnOiAnSScsXG4gICAgJ1xcdTAwQ0YnOiAnSScsXG4gICAgJ1xcdTFFMkUnOiAnSScsXG4gICAgJ1xcdTFFQzgnOiAnSScsXG4gICAgJ1xcdTAxQ0YnOiAnSScsXG4gICAgJ1xcdTAyMDgnOiAnSScsXG4gICAgJ1xcdTAyMEEnOiAnSScsXG4gICAgJ1xcdTFFQ0EnOiAnSScsXG4gICAgJ1xcdTAxMkUnOiAnSScsXG4gICAgJ1xcdTFFMkMnOiAnSScsXG4gICAgJ1xcdTAxOTcnOiAnSScsXG4gICAgJ1xcdTI0QkYnOiAnSicsXG4gICAgJ1xcdUZGMkEnOiAnSicsXG4gICAgJ1xcdTAxMzQnOiAnSicsXG4gICAgJ1xcdTAyNDgnOiAnSicsXG4gICAgJ1xcdTI0QzAnOiAnSycsXG4gICAgJ1xcdUZGMkInOiAnSycsXG4gICAgJ1xcdTFFMzAnOiAnSycsXG4gICAgJ1xcdTAxRTgnOiAnSycsXG4gICAgJ1xcdTFFMzInOiAnSycsXG4gICAgJ1xcdTAxMzYnOiAnSycsXG4gICAgJ1xcdTFFMzQnOiAnSycsXG4gICAgJ1xcdTAxOTgnOiAnSycsXG4gICAgJ1xcdTJDNjknOiAnSycsXG4gICAgJ1xcdUE3NDAnOiAnSycsXG4gICAgJ1xcdUE3NDInOiAnSycsXG4gICAgJ1xcdUE3NDQnOiAnSycsXG4gICAgJ1xcdUE3QTInOiAnSycsXG4gICAgJ1xcdTI0QzEnOiAnTCcsXG4gICAgJ1xcdUZGMkMnOiAnTCcsXG4gICAgJ1xcdTAxM0YnOiAnTCcsXG4gICAgJ1xcdTAxMzknOiAnTCcsXG4gICAgJ1xcdTAxM0QnOiAnTCcsXG4gICAgJ1xcdTFFMzYnOiAnTCcsXG4gICAgJ1xcdTFFMzgnOiAnTCcsXG4gICAgJ1xcdTAxM0InOiAnTCcsXG4gICAgJ1xcdTFFM0MnOiAnTCcsXG4gICAgJ1xcdTFFM0EnOiAnTCcsXG4gICAgJ1xcdTAxNDEnOiAnTCcsXG4gICAgJ1xcdTAyM0QnOiAnTCcsXG4gICAgJ1xcdTJDNjInOiAnTCcsXG4gICAgJ1xcdTJDNjAnOiAnTCcsXG4gICAgJ1xcdUE3NDgnOiAnTCcsXG4gICAgJ1xcdUE3NDYnOiAnTCcsXG4gICAgJ1xcdUE3ODAnOiAnTCcsXG4gICAgJ1xcdTAxQzcnOiAnTEonLFxuICAgICdcXHUwMUM4JzogJ0xqJyxcbiAgICAnXFx1MjRDMic6ICdNJyxcbiAgICAnXFx1RkYyRCc6ICdNJyxcbiAgICAnXFx1MUUzRSc6ICdNJyxcbiAgICAnXFx1MUU0MCc6ICdNJyxcbiAgICAnXFx1MUU0Mic6ICdNJyxcbiAgICAnXFx1MkM2RSc6ICdNJyxcbiAgICAnXFx1MDE5Qyc6ICdNJyxcbiAgICAnXFx1MjRDMyc6ICdOJyxcbiAgICAnXFx1RkYyRSc6ICdOJyxcbiAgICAnXFx1MDFGOCc6ICdOJyxcbiAgICAnXFx1MDE0Myc6ICdOJyxcbiAgICAnXFx1MDBEMSc6ICdOJyxcbiAgICAnXFx1MUU0NCc6ICdOJyxcbiAgICAnXFx1MDE0Nyc6ICdOJyxcbiAgICAnXFx1MUU0Nic6ICdOJyxcbiAgICAnXFx1MDE0NSc6ICdOJyxcbiAgICAnXFx1MUU0QSc6ICdOJyxcbiAgICAnXFx1MUU0OCc6ICdOJyxcbiAgICAnXFx1MDIyMCc6ICdOJyxcbiAgICAnXFx1MDE5RCc6ICdOJyxcbiAgICAnXFx1QTc5MCc6ICdOJyxcbiAgICAnXFx1QTdBNCc6ICdOJyxcbiAgICAnXFx1MDFDQSc6ICdOSicsXG4gICAgJ1xcdTAxQ0InOiAnTmonLFxuICAgICdcXHUyNEM0JzogJ08nLFxuICAgICdcXHVGRjJGJzogJ08nLFxuICAgICdcXHUwMEQyJzogJ08nLFxuICAgICdcXHUwMEQzJzogJ08nLFxuICAgICdcXHUwMEQ0JzogJ08nLFxuICAgICdcXHUxRUQyJzogJ08nLFxuICAgICdcXHUxRUQwJzogJ08nLFxuICAgICdcXHUxRUQ2JzogJ08nLFxuICAgICdcXHUxRUQ0JzogJ08nLFxuICAgICdcXHUwMEQ1JzogJ08nLFxuICAgICdcXHUxRTRDJzogJ08nLFxuICAgICdcXHUwMjJDJzogJ08nLFxuICAgICdcXHUxRTRFJzogJ08nLFxuICAgICdcXHUwMTRDJzogJ08nLFxuICAgICdcXHUxRTUwJzogJ08nLFxuICAgICdcXHUxRTUyJzogJ08nLFxuICAgICdcXHUwMTRFJzogJ08nLFxuICAgICdcXHUwMjJFJzogJ08nLFxuICAgICdcXHUwMjMwJzogJ08nLFxuICAgICdcXHUwMEQ2JzogJ08nLFxuICAgICdcXHUwMjJBJzogJ08nLFxuICAgICdcXHUxRUNFJzogJ08nLFxuICAgICdcXHUwMTUwJzogJ08nLFxuICAgICdcXHUwMUQxJzogJ08nLFxuICAgICdcXHUwMjBDJzogJ08nLFxuICAgICdcXHUwMjBFJzogJ08nLFxuICAgICdcXHUwMUEwJzogJ08nLFxuICAgICdcXHUxRURDJzogJ08nLFxuICAgICdcXHUxRURBJzogJ08nLFxuICAgICdcXHUxRUUwJzogJ08nLFxuICAgICdcXHUxRURFJzogJ08nLFxuICAgICdcXHUxRUUyJzogJ08nLFxuICAgICdcXHUxRUNDJzogJ08nLFxuICAgICdcXHUxRUQ4JzogJ08nLFxuICAgICdcXHUwMUVBJzogJ08nLFxuICAgICdcXHUwMUVDJzogJ08nLFxuICAgICdcXHUwMEQ4JzogJ08nLFxuICAgICdcXHUwMUZFJzogJ08nLFxuICAgICdcXHUwMTg2JzogJ08nLFxuICAgICdcXHUwMTlGJzogJ08nLFxuICAgICdcXHVBNzRBJzogJ08nLFxuICAgICdcXHVBNzRDJzogJ08nLFxuICAgICdcXHUwMTUyJzogJ09FJyxcbiAgICAnXFx1MDFBMic6ICdPSScsXG4gICAgJ1xcdUE3NEUnOiAnT08nLFxuICAgICdcXHUwMjIyJzogJ09VJyxcbiAgICAnXFx1MjRDNSc6ICdQJyxcbiAgICAnXFx1RkYzMCc6ICdQJyxcbiAgICAnXFx1MUU1NCc6ICdQJyxcbiAgICAnXFx1MUU1Nic6ICdQJyxcbiAgICAnXFx1MDFBNCc6ICdQJyxcbiAgICAnXFx1MkM2Myc6ICdQJyxcbiAgICAnXFx1QTc1MCc6ICdQJyxcbiAgICAnXFx1QTc1Mic6ICdQJyxcbiAgICAnXFx1QTc1NCc6ICdQJyxcbiAgICAnXFx1MjRDNic6ICdRJyxcbiAgICAnXFx1RkYzMSc6ICdRJyxcbiAgICAnXFx1QTc1Nic6ICdRJyxcbiAgICAnXFx1QTc1OCc6ICdRJyxcbiAgICAnXFx1MDI0QSc6ICdRJyxcbiAgICAnXFx1MjRDNyc6ICdSJyxcbiAgICAnXFx1RkYzMic6ICdSJyxcbiAgICAnXFx1MDE1NCc6ICdSJyxcbiAgICAnXFx1MUU1OCc6ICdSJyxcbiAgICAnXFx1MDE1OCc6ICdSJyxcbiAgICAnXFx1MDIxMCc6ICdSJyxcbiAgICAnXFx1MDIxMic6ICdSJyxcbiAgICAnXFx1MUU1QSc6ICdSJyxcbiAgICAnXFx1MUU1Qyc6ICdSJyxcbiAgICAnXFx1MDE1Nic6ICdSJyxcbiAgICAnXFx1MUU1RSc6ICdSJyxcbiAgICAnXFx1MDI0Qyc6ICdSJyxcbiAgICAnXFx1MkM2NCc6ICdSJyxcbiAgICAnXFx1QTc1QSc6ICdSJyxcbiAgICAnXFx1QTdBNic6ICdSJyxcbiAgICAnXFx1QTc4Mic6ICdSJyxcbiAgICAnXFx1MjRDOCc6ICdTJyxcbiAgICAnXFx1RkYzMyc6ICdTJyxcbiAgICAnXFx1MUU5RSc6ICdTJyxcbiAgICAnXFx1MDE1QSc6ICdTJyxcbiAgICAnXFx1MUU2NCc6ICdTJyxcbiAgICAnXFx1MDE1Qyc6ICdTJyxcbiAgICAnXFx1MUU2MCc6ICdTJyxcbiAgICAnXFx1MDE2MCc6ICdTJyxcbiAgICAnXFx1MUU2Nic6ICdTJyxcbiAgICAnXFx1MUU2Mic6ICdTJyxcbiAgICAnXFx1MUU2OCc6ICdTJyxcbiAgICAnXFx1MDIxOCc6ICdTJyxcbiAgICAnXFx1MDE1RSc6ICdTJyxcbiAgICAnXFx1MkM3RSc6ICdTJyxcbiAgICAnXFx1QTdBOCc6ICdTJyxcbiAgICAnXFx1QTc4NCc6ICdTJyxcbiAgICAnXFx1MjRDOSc6ICdUJyxcbiAgICAnXFx1RkYzNCc6ICdUJyxcbiAgICAnXFx1MUU2QSc6ICdUJyxcbiAgICAnXFx1MDE2NCc6ICdUJyxcbiAgICAnXFx1MUU2Qyc6ICdUJyxcbiAgICAnXFx1MDIxQSc6ICdUJyxcbiAgICAnXFx1MDE2Mic6ICdUJyxcbiAgICAnXFx1MUU3MCc6ICdUJyxcbiAgICAnXFx1MUU2RSc6ICdUJyxcbiAgICAnXFx1MDE2Nic6ICdUJyxcbiAgICAnXFx1MDFBQyc6ICdUJyxcbiAgICAnXFx1MDFBRSc6ICdUJyxcbiAgICAnXFx1MDIzRSc6ICdUJyxcbiAgICAnXFx1QTc4Nic6ICdUJyxcbiAgICAnXFx1QTcyOCc6ICdUWicsXG4gICAgJ1xcdTI0Q0EnOiAnVScsXG4gICAgJ1xcdUZGMzUnOiAnVScsXG4gICAgJ1xcdTAwRDknOiAnVScsXG4gICAgJ1xcdTAwREEnOiAnVScsXG4gICAgJ1xcdTAwREInOiAnVScsXG4gICAgJ1xcdTAxNjgnOiAnVScsXG4gICAgJ1xcdTFFNzgnOiAnVScsXG4gICAgJ1xcdTAxNkEnOiAnVScsXG4gICAgJ1xcdTFFN0EnOiAnVScsXG4gICAgJ1xcdTAxNkMnOiAnVScsXG4gICAgJ1xcdTAwREMnOiAnVScsXG4gICAgJ1xcdTAxREInOiAnVScsXG4gICAgJ1xcdTAxRDcnOiAnVScsXG4gICAgJ1xcdTAxRDUnOiAnVScsXG4gICAgJ1xcdTAxRDknOiAnVScsXG4gICAgJ1xcdTFFRTYnOiAnVScsXG4gICAgJ1xcdTAxNkUnOiAnVScsXG4gICAgJ1xcdTAxNzAnOiAnVScsXG4gICAgJ1xcdTAxRDMnOiAnVScsXG4gICAgJ1xcdTAyMTQnOiAnVScsXG4gICAgJ1xcdTAyMTYnOiAnVScsXG4gICAgJ1xcdTAxQUYnOiAnVScsXG4gICAgJ1xcdTFFRUEnOiAnVScsXG4gICAgJ1xcdTFFRTgnOiAnVScsXG4gICAgJ1xcdTFFRUUnOiAnVScsXG4gICAgJ1xcdTFFRUMnOiAnVScsXG4gICAgJ1xcdTFFRjAnOiAnVScsXG4gICAgJ1xcdTFFRTQnOiAnVScsXG4gICAgJ1xcdTFFNzInOiAnVScsXG4gICAgJ1xcdTAxNzInOiAnVScsXG4gICAgJ1xcdTFFNzYnOiAnVScsXG4gICAgJ1xcdTFFNzQnOiAnVScsXG4gICAgJ1xcdTAyNDQnOiAnVScsXG4gICAgJ1xcdTI0Q0InOiAnVicsXG4gICAgJ1xcdUZGMzYnOiAnVicsXG4gICAgJ1xcdTFFN0MnOiAnVicsXG4gICAgJ1xcdTFFN0UnOiAnVicsXG4gICAgJ1xcdTAxQjInOiAnVicsXG4gICAgJ1xcdUE3NUUnOiAnVicsXG4gICAgJ1xcdTAyNDUnOiAnVicsXG4gICAgJ1xcdUE3NjAnOiAnVlknLFxuICAgICdcXHUyNENDJzogJ1cnLFxuICAgICdcXHVGRjM3JzogJ1cnLFxuICAgICdcXHUxRTgwJzogJ1cnLFxuICAgICdcXHUxRTgyJzogJ1cnLFxuICAgICdcXHUwMTc0JzogJ1cnLFxuICAgICdcXHUxRTg2JzogJ1cnLFxuICAgICdcXHUxRTg0JzogJ1cnLFxuICAgICdcXHUxRTg4JzogJ1cnLFxuICAgICdcXHUyQzcyJzogJ1cnLFxuICAgICdcXHUyNENEJzogJ1gnLFxuICAgICdcXHVGRjM4JzogJ1gnLFxuICAgICdcXHUxRThBJzogJ1gnLFxuICAgICdcXHUxRThDJzogJ1gnLFxuICAgICdcXHUyNENFJzogJ1knLFxuICAgICdcXHVGRjM5JzogJ1knLFxuICAgICdcXHUxRUYyJzogJ1knLFxuICAgICdcXHUwMEREJzogJ1knLFxuICAgICdcXHUwMTc2JzogJ1knLFxuICAgICdcXHUxRUY4JzogJ1knLFxuICAgICdcXHUwMjMyJzogJ1knLFxuICAgICdcXHUxRThFJzogJ1knLFxuICAgICdcXHUwMTc4JzogJ1knLFxuICAgICdcXHUxRUY2JzogJ1knLFxuICAgICdcXHUxRUY0JzogJ1knLFxuICAgICdcXHUwMUIzJzogJ1knLFxuICAgICdcXHUwMjRFJzogJ1knLFxuICAgICdcXHUxRUZFJzogJ1knLFxuICAgICdcXHUyNENGJzogJ1onLFxuICAgICdcXHVGRjNBJzogJ1onLFxuICAgICdcXHUwMTc5JzogJ1onLFxuICAgICdcXHUxRTkwJzogJ1onLFxuICAgICdcXHUwMTdCJzogJ1onLFxuICAgICdcXHUwMTdEJzogJ1onLFxuICAgICdcXHUxRTkyJzogJ1onLFxuICAgICdcXHUxRTk0JzogJ1onLFxuICAgICdcXHUwMUI1JzogJ1onLFxuICAgICdcXHUwMjI0JzogJ1onLFxuICAgICdcXHUyQzdGJzogJ1onLFxuICAgICdcXHUyQzZCJzogJ1onLFxuICAgICdcXHVBNzYyJzogJ1onLFxuICAgICdcXHUyNEQwJzogJ2EnLFxuICAgICdcXHVGRjQxJzogJ2EnLFxuICAgICdcXHUxRTlBJzogJ2EnLFxuICAgICdcXHUwMEUwJzogJ2EnLFxuICAgICdcXHUwMEUxJzogJ2EnLFxuICAgICdcXHUwMEUyJzogJ2EnLFxuICAgICdcXHUxRUE3JzogJ2EnLFxuICAgICdcXHUxRUE1JzogJ2EnLFxuICAgICdcXHUxRUFCJzogJ2EnLFxuICAgICdcXHUxRUE5JzogJ2EnLFxuICAgICdcXHUwMEUzJzogJ2EnLFxuICAgICdcXHUwMTAxJzogJ2EnLFxuICAgICdcXHUwMTAzJzogJ2EnLFxuICAgICdcXHUxRUIxJzogJ2EnLFxuICAgICdcXHUxRUFGJzogJ2EnLFxuICAgICdcXHUxRUI1JzogJ2EnLFxuICAgICdcXHUxRUIzJzogJ2EnLFxuICAgICdcXHUwMjI3JzogJ2EnLFxuICAgICdcXHUwMUUxJzogJ2EnLFxuICAgICdcXHUwMEU0JzogJ2EnLFxuICAgICdcXHUwMURGJzogJ2EnLFxuICAgICdcXHUxRUEzJzogJ2EnLFxuICAgICdcXHUwMEU1JzogJ2EnLFxuICAgICdcXHUwMUZCJzogJ2EnLFxuICAgICdcXHUwMUNFJzogJ2EnLFxuICAgICdcXHUwMjAxJzogJ2EnLFxuICAgICdcXHUwMjAzJzogJ2EnLFxuICAgICdcXHUxRUExJzogJ2EnLFxuICAgICdcXHUxRUFEJzogJ2EnLFxuICAgICdcXHUxRUI3JzogJ2EnLFxuICAgICdcXHUxRTAxJzogJ2EnLFxuICAgICdcXHUwMTA1JzogJ2EnLFxuICAgICdcXHUyQzY1JzogJ2EnLFxuICAgICdcXHUwMjUwJzogJ2EnLFxuICAgICdcXHVBNzMzJzogJ2FhJyxcbiAgICAnXFx1MDBFNic6ICdhZScsXG4gICAgJ1xcdTAxRkQnOiAnYWUnLFxuICAgICdcXHUwMUUzJzogJ2FlJyxcbiAgICAnXFx1QTczNSc6ICdhbycsXG4gICAgJ1xcdUE3MzcnOiAnYXUnLFxuICAgICdcXHVBNzM5JzogJ2F2JyxcbiAgICAnXFx1QTczQic6ICdhdicsXG4gICAgJ1xcdUE3M0QnOiAnYXknLFxuICAgICdcXHUyNEQxJzogJ2InLFxuICAgICdcXHVGRjQyJzogJ2InLFxuICAgICdcXHUxRTAzJzogJ2InLFxuICAgICdcXHUxRTA1JzogJ2InLFxuICAgICdcXHUxRTA3JzogJ2InLFxuICAgICdcXHUwMTgwJzogJ2InLFxuICAgICdcXHUwMTgzJzogJ2InLFxuICAgICdcXHUwMjUzJzogJ2InLFxuICAgICdcXHUyNEQyJzogJ2MnLFxuICAgICdcXHVGRjQzJzogJ2MnLFxuICAgICdcXHUwMTA3JzogJ2MnLFxuICAgICdcXHUwMTA5JzogJ2MnLFxuICAgICdcXHUwMTBCJzogJ2MnLFxuICAgICdcXHUwMTBEJzogJ2MnLFxuICAgICdcXHUwMEU3JzogJ2MnLFxuICAgICdcXHUxRTA5JzogJ2MnLFxuICAgICdcXHUwMTg4JzogJ2MnLFxuICAgICdcXHUwMjNDJzogJ2MnLFxuICAgICdcXHVBNzNGJzogJ2MnLFxuICAgICdcXHUyMTg0JzogJ2MnLFxuICAgICdcXHUyNEQzJzogJ2QnLFxuICAgICdcXHVGRjQ0JzogJ2QnLFxuICAgICdcXHUxRTBCJzogJ2QnLFxuICAgICdcXHUwMTBGJzogJ2QnLFxuICAgICdcXHUxRTBEJzogJ2QnLFxuICAgICdcXHUxRTExJzogJ2QnLFxuICAgICdcXHUxRTEzJzogJ2QnLFxuICAgICdcXHUxRTBGJzogJ2QnLFxuICAgICdcXHUwMTExJzogJ2QnLFxuICAgICdcXHUwMThDJzogJ2QnLFxuICAgICdcXHUwMjU2JzogJ2QnLFxuICAgICdcXHUwMjU3JzogJ2QnLFxuICAgICdcXHVBNzdBJzogJ2QnLFxuICAgICdcXHUwMUYzJzogJ2R6JyxcbiAgICAnXFx1MDFDNic6ICdkeicsXG4gICAgJ1xcdTI0RDQnOiAnZScsXG4gICAgJ1xcdUZGNDUnOiAnZScsXG4gICAgJ1xcdTAwRTgnOiAnZScsXG4gICAgJ1xcdTAwRTknOiAnZScsXG4gICAgJ1xcdTAwRUEnOiAnZScsXG4gICAgJ1xcdTFFQzEnOiAnZScsXG4gICAgJ1xcdTFFQkYnOiAnZScsXG4gICAgJ1xcdTFFQzUnOiAnZScsXG4gICAgJ1xcdTFFQzMnOiAnZScsXG4gICAgJ1xcdTFFQkQnOiAnZScsXG4gICAgJ1xcdTAxMTMnOiAnZScsXG4gICAgJ1xcdTFFMTUnOiAnZScsXG4gICAgJ1xcdTFFMTcnOiAnZScsXG4gICAgJ1xcdTAxMTUnOiAnZScsXG4gICAgJ1xcdTAxMTcnOiAnZScsXG4gICAgJ1xcdTAwRUInOiAnZScsXG4gICAgJ1xcdTFFQkInOiAnZScsXG4gICAgJ1xcdTAxMUInOiAnZScsXG4gICAgJ1xcdTAyMDUnOiAnZScsXG4gICAgJ1xcdTAyMDcnOiAnZScsXG4gICAgJ1xcdTFFQjknOiAnZScsXG4gICAgJ1xcdTFFQzcnOiAnZScsXG4gICAgJ1xcdTAyMjknOiAnZScsXG4gICAgJ1xcdTFFMUQnOiAnZScsXG4gICAgJ1xcdTAxMTknOiAnZScsXG4gICAgJ1xcdTFFMTknOiAnZScsXG4gICAgJ1xcdTFFMUInOiAnZScsXG4gICAgJ1xcdTAyNDcnOiAnZScsXG4gICAgJ1xcdTAyNUInOiAnZScsXG4gICAgJ1xcdTAxREQnOiAnZScsXG4gICAgJ1xcdTI0RDUnOiAnZicsXG4gICAgJ1xcdUZGNDYnOiAnZicsXG4gICAgJ1xcdTFFMUYnOiAnZicsXG4gICAgJ1xcdTAxOTInOiAnZicsXG4gICAgJ1xcdUE3N0MnOiAnZicsXG4gICAgJ1xcdTI0RDYnOiAnZycsXG4gICAgJ1xcdUZGNDcnOiAnZycsXG4gICAgJ1xcdTAxRjUnOiAnZycsXG4gICAgJ1xcdTAxMUQnOiAnZycsXG4gICAgJ1xcdTFFMjEnOiAnZycsXG4gICAgJ1xcdTAxMUYnOiAnZycsXG4gICAgJ1xcdTAxMjEnOiAnZycsXG4gICAgJ1xcdTAxRTcnOiAnZycsXG4gICAgJ1xcdTAxMjMnOiAnZycsXG4gICAgJ1xcdTAxRTUnOiAnZycsXG4gICAgJ1xcdTAyNjAnOiAnZycsXG4gICAgJ1xcdUE3QTEnOiAnZycsXG4gICAgJ1xcdTFENzknOiAnZycsXG4gICAgJ1xcdUE3N0YnOiAnZycsXG4gICAgJ1xcdTI0RDcnOiAnaCcsXG4gICAgJ1xcdUZGNDgnOiAnaCcsXG4gICAgJ1xcdTAxMjUnOiAnaCcsXG4gICAgJ1xcdTFFMjMnOiAnaCcsXG4gICAgJ1xcdTFFMjcnOiAnaCcsXG4gICAgJ1xcdTAyMUYnOiAnaCcsXG4gICAgJ1xcdTFFMjUnOiAnaCcsXG4gICAgJ1xcdTFFMjknOiAnaCcsXG4gICAgJ1xcdTFFMkInOiAnaCcsXG4gICAgJ1xcdTFFOTYnOiAnaCcsXG4gICAgJ1xcdTAxMjcnOiAnaCcsXG4gICAgJ1xcdTJDNjgnOiAnaCcsXG4gICAgJ1xcdTJDNzYnOiAnaCcsXG4gICAgJ1xcdTAyNjUnOiAnaCcsXG4gICAgJ1xcdTAxOTUnOiAnaHYnLFxuICAgICdcXHUyNEQ4JzogJ2knLFxuICAgICdcXHVGRjQ5JzogJ2knLFxuICAgICdcXHUwMEVDJzogJ2knLFxuICAgICdcXHUwMEVEJzogJ2knLFxuICAgICdcXHUwMEVFJzogJ2knLFxuICAgICdcXHUwMTI5JzogJ2knLFxuICAgICdcXHUwMTJCJzogJ2knLFxuICAgICdcXHUwMTJEJzogJ2knLFxuICAgICdcXHUwMEVGJzogJ2knLFxuICAgICdcXHUxRTJGJzogJ2knLFxuICAgICdcXHUxRUM5JzogJ2knLFxuICAgICdcXHUwMUQwJzogJ2knLFxuICAgICdcXHUwMjA5JzogJ2knLFxuICAgICdcXHUwMjBCJzogJ2knLFxuICAgICdcXHUxRUNCJzogJ2knLFxuICAgICdcXHUwMTJGJzogJ2knLFxuICAgICdcXHUxRTJEJzogJ2knLFxuICAgICdcXHUwMjY4JzogJ2knLFxuICAgICdcXHUwMTMxJzogJ2knLFxuICAgICdcXHUyNEQ5JzogJ2onLFxuICAgICdcXHVGRjRBJzogJ2onLFxuICAgICdcXHUwMTM1JzogJ2onLFxuICAgICdcXHUwMUYwJzogJ2onLFxuICAgICdcXHUwMjQ5JzogJ2onLFxuICAgICdcXHUyNERBJzogJ2snLFxuICAgICdcXHVGRjRCJzogJ2snLFxuICAgICdcXHUxRTMxJzogJ2snLFxuICAgICdcXHUwMUU5JzogJ2snLFxuICAgICdcXHUxRTMzJzogJ2snLFxuICAgICdcXHUwMTM3JzogJ2snLFxuICAgICdcXHUxRTM1JzogJ2snLFxuICAgICdcXHUwMTk5JzogJ2snLFxuICAgICdcXHUyQzZBJzogJ2snLFxuICAgICdcXHVBNzQxJzogJ2snLFxuICAgICdcXHVBNzQzJzogJ2snLFxuICAgICdcXHVBNzQ1JzogJ2snLFxuICAgICdcXHVBN0EzJzogJ2snLFxuICAgICdcXHUyNERCJzogJ2wnLFxuICAgICdcXHVGRjRDJzogJ2wnLFxuICAgICdcXHUwMTQwJzogJ2wnLFxuICAgICdcXHUwMTNBJzogJ2wnLFxuICAgICdcXHUwMTNFJzogJ2wnLFxuICAgICdcXHUxRTM3JzogJ2wnLFxuICAgICdcXHUxRTM5JzogJ2wnLFxuICAgICdcXHUwMTNDJzogJ2wnLFxuICAgICdcXHUxRTNEJzogJ2wnLFxuICAgICdcXHUxRTNCJzogJ2wnLFxuICAgICdcXHUwMTdGJzogJ2wnLFxuICAgICdcXHUwMTQyJzogJ2wnLFxuICAgICdcXHUwMTlBJzogJ2wnLFxuICAgICdcXHUwMjZCJzogJ2wnLFxuICAgICdcXHUyQzYxJzogJ2wnLFxuICAgICdcXHVBNzQ5JzogJ2wnLFxuICAgICdcXHVBNzgxJzogJ2wnLFxuICAgICdcXHVBNzQ3JzogJ2wnLFxuICAgICdcXHUwMUM5JzogJ2xqJyxcbiAgICAnXFx1MjREQyc6ICdtJyxcbiAgICAnXFx1RkY0RCc6ICdtJyxcbiAgICAnXFx1MUUzRic6ICdtJyxcbiAgICAnXFx1MUU0MSc6ICdtJyxcbiAgICAnXFx1MUU0Myc6ICdtJyxcbiAgICAnXFx1MDI3MSc6ICdtJyxcbiAgICAnXFx1MDI2Ric6ICdtJyxcbiAgICAnXFx1MjRERCc6ICduJyxcbiAgICAnXFx1RkY0RSc6ICduJyxcbiAgICAnXFx1MDFGOSc6ICduJyxcbiAgICAnXFx1MDE0NCc6ICduJyxcbiAgICAnXFx1MDBGMSc6ICduJyxcbiAgICAnXFx1MUU0NSc6ICduJyxcbiAgICAnXFx1MDE0OCc6ICduJyxcbiAgICAnXFx1MUU0Nyc6ICduJyxcbiAgICAnXFx1MDE0Nic6ICduJyxcbiAgICAnXFx1MUU0Qic6ICduJyxcbiAgICAnXFx1MUU0OSc6ICduJyxcbiAgICAnXFx1MDE5RSc6ICduJyxcbiAgICAnXFx1MDI3Mic6ICduJyxcbiAgICAnXFx1MDE0OSc6ICduJyxcbiAgICAnXFx1QTc5MSc6ICduJyxcbiAgICAnXFx1QTdBNSc6ICduJyxcbiAgICAnXFx1MDFDQyc6ICduaicsXG4gICAgJ1xcdTI0REUnOiAnbycsXG4gICAgJ1xcdUZGNEYnOiAnbycsXG4gICAgJ1xcdTAwRjInOiAnbycsXG4gICAgJ1xcdTAwRjMnOiAnbycsXG4gICAgJ1xcdTAwRjQnOiAnbycsXG4gICAgJ1xcdTFFRDMnOiAnbycsXG4gICAgJ1xcdTFFRDEnOiAnbycsXG4gICAgJ1xcdTFFRDcnOiAnbycsXG4gICAgJ1xcdTFFRDUnOiAnbycsXG4gICAgJ1xcdTAwRjUnOiAnbycsXG4gICAgJ1xcdTFFNEQnOiAnbycsXG4gICAgJ1xcdTAyMkQnOiAnbycsXG4gICAgJ1xcdTFFNEYnOiAnbycsXG4gICAgJ1xcdTAxNEQnOiAnbycsXG4gICAgJ1xcdTFFNTEnOiAnbycsXG4gICAgJ1xcdTFFNTMnOiAnbycsXG4gICAgJ1xcdTAxNEYnOiAnbycsXG4gICAgJ1xcdTAyMkYnOiAnbycsXG4gICAgJ1xcdTAyMzEnOiAnbycsXG4gICAgJ1xcdTAwRjYnOiAnbycsXG4gICAgJ1xcdTAyMkInOiAnbycsXG4gICAgJ1xcdTFFQ0YnOiAnbycsXG4gICAgJ1xcdTAxNTEnOiAnbycsXG4gICAgJ1xcdTAxRDInOiAnbycsXG4gICAgJ1xcdTAyMEQnOiAnbycsXG4gICAgJ1xcdTAyMEYnOiAnbycsXG4gICAgJ1xcdTAxQTEnOiAnbycsXG4gICAgJ1xcdTFFREQnOiAnbycsXG4gICAgJ1xcdTFFREInOiAnbycsXG4gICAgJ1xcdTFFRTEnOiAnbycsXG4gICAgJ1xcdTFFREYnOiAnbycsXG4gICAgJ1xcdTFFRTMnOiAnbycsXG4gICAgJ1xcdTFFQ0QnOiAnbycsXG4gICAgJ1xcdTFFRDknOiAnbycsXG4gICAgJ1xcdTAxRUInOiAnbycsXG4gICAgJ1xcdTAxRUQnOiAnbycsXG4gICAgJ1xcdTAwRjgnOiAnbycsXG4gICAgJ1xcdTAxRkYnOiAnbycsXG4gICAgJ1xcdTAyNTQnOiAnbycsXG4gICAgJ1xcdUE3NEInOiAnbycsXG4gICAgJ1xcdUE3NEQnOiAnbycsXG4gICAgJ1xcdTAyNzUnOiAnbycsXG4gICAgJ1xcdTAxNTMnOiAnb2UnLFxuICAgICdcXHUwMUEzJzogJ29pJyxcbiAgICAnXFx1MDIyMyc6ICdvdScsXG4gICAgJ1xcdUE3NEYnOiAnb28nLFxuICAgICdcXHUyNERGJzogJ3AnLFxuICAgICdcXHVGRjUwJzogJ3AnLFxuICAgICdcXHUxRTU1JzogJ3AnLFxuICAgICdcXHUxRTU3JzogJ3AnLFxuICAgICdcXHUwMUE1JzogJ3AnLFxuICAgICdcXHUxRDdEJzogJ3AnLFxuICAgICdcXHVBNzUxJzogJ3AnLFxuICAgICdcXHVBNzUzJzogJ3AnLFxuICAgICdcXHVBNzU1JzogJ3AnLFxuICAgICdcXHUyNEUwJzogJ3EnLFxuICAgICdcXHVGRjUxJzogJ3EnLFxuICAgICdcXHUwMjRCJzogJ3EnLFxuICAgICdcXHVBNzU3JzogJ3EnLFxuICAgICdcXHVBNzU5JzogJ3EnLFxuICAgICdcXHUyNEUxJzogJ3InLFxuICAgICdcXHVGRjUyJzogJ3InLFxuICAgICdcXHUwMTU1JzogJ3InLFxuICAgICdcXHUxRTU5JzogJ3InLFxuICAgICdcXHUwMTU5JzogJ3InLFxuICAgICdcXHUwMjExJzogJ3InLFxuICAgICdcXHUwMjEzJzogJ3InLFxuICAgICdcXHUxRTVCJzogJ3InLFxuICAgICdcXHUxRTVEJzogJ3InLFxuICAgICdcXHUwMTU3JzogJ3InLFxuICAgICdcXHUxRTVGJzogJ3InLFxuICAgICdcXHUwMjREJzogJ3InLFxuICAgICdcXHUwMjdEJzogJ3InLFxuICAgICdcXHVBNzVCJzogJ3InLFxuICAgICdcXHVBN0E3JzogJ3InLFxuICAgICdcXHVBNzgzJzogJ3InLFxuICAgICdcXHUyNEUyJzogJ3MnLFxuICAgICdcXHVGRjUzJzogJ3MnLFxuICAgICdcXHUwMERGJzogJ3MnLFxuICAgICdcXHUwMTVCJzogJ3MnLFxuICAgICdcXHUxRTY1JzogJ3MnLFxuICAgICdcXHUwMTVEJzogJ3MnLFxuICAgICdcXHUxRTYxJzogJ3MnLFxuICAgICdcXHUwMTYxJzogJ3MnLFxuICAgICdcXHUxRTY3JzogJ3MnLFxuICAgICdcXHUxRTYzJzogJ3MnLFxuICAgICdcXHUxRTY5JzogJ3MnLFxuICAgICdcXHUwMjE5JzogJ3MnLFxuICAgICdcXHUwMTVGJzogJ3MnLFxuICAgICdcXHUwMjNGJzogJ3MnLFxuICAgICdcXHVBN0E5JzogJ3MnLFxuICAgICdcXHVBNzg1JzogJ3MnLFxuICAgICdcXHUxRTlCJzogJ3MnLFxuICAgICdcXHUyNEUzJzogJ3QnLFxuICAgICdcXHVGRjU0JzogJ3QnLFxuICAgICdcXHUxRTZCJzogJ3QnLFxuICAgICdcXHUxRTk3JzogJ3QnLFxuICAgICdcXHUwMTY1JzogJ3QnLFxuICAgICdcXHUxRTZEJzogJ3QnLFxuICAgICdcXHUwMjFCJzogJ3QnLFxuICAgICdcXHUwMTYzJzogJ3QnLFxuICAgICdcXHUxRTcxJzogJ3QnLFxuICAgICdcXHUxRTZGJzogJ3QnLFxuICAgICdcXHUwMTY3JzogJ3QnLFxuICAgICdcXHUwMUFEJzogJ3QnLFxuICAgICdcXHUwMjg4JzogJ3QnLFxuICAgICdcXHUyQzY2JzogJ3QnLFxuICAgICdcXHVBNzg3JzogJ3QnLFxuICAgICdcXHVBNzI5JzogJ3R6JyxcbiAgICAnXFx1MjRFNCc6ICd1JyxcbiAgICAnXFx1RkY1NSc6ICd1JyxcbiAgICAnXFx1MDBGOSc6ICd1JyxcbiAgICAnXFx1MDBGQSc6ICd1JyxcbiAgICAnXFx1MDBGQic6ICd1JyxcbiAgICAnXFx1MDE2OSc6ICd1JyxcbiAgICAnXFx1MUU3OSc6ICd1JyxcbiAgICAnXFx1MDE2Qic6ICd1JyxcbiAgICAnXFx1MUU3Qic6ICd1JyxcbiAgICAnXFx1MDE2RCc6ICd1JyxcbiAgICAnXFx1MDBGQyc6ICd1JyxcbiAgICAnXFx1MDFEQyc6ICd1JyxcbiAgICAnXFx1MDFEOCc6ICd1JyxcbiAgICAnXFx1MDFENic6ICd1JyxcbiAgICAnXFx1MDFEQSc6ICd1JyxcbiAgICAnXFx1MUVFNyc6ICd1JyxcbiAgICAnXFx1MDE2Ric6ICd1JyxcbiAgICAnXFx1MDE3MSc6ICd1JyxcbiAgICAnXFx1MDFENCc6ICd1JyxcbiAgICAnXFx1MDIxNSc6ICd1JyxcbiAgICAnXFx1MDIxNyc6ICd1JyxcbiAgICAnXFx1MDFCMCc6ICd1JyxcbiAgICAnXFx1MUVFQic6ICd1JyxcbiAgICAnXFx1MUVFOSc6ICd1JyxcbiAgICAnXFx1MUVFRic6ICd1JyxcbiAgICAnXFx1MUVFRCc6ICd1JyxcbiAgICAnXFx1MUVGMSc6ICd1JyxcbiAgICAnXFx1MUVFNSc6ICd1JyxcbiAgICAnXFx1MUU3Myc6ICd1JyxcbiAgICAnXFx1MDE3Myc6ICd1JyxcbiAgICAnXFx1MUU3Nyc6ICd1JyxcbiAgICAnXFx1MUU3NSc6ICd1JyxcbiAgICAnXFx1MDI4OSc6ICd1JyxcbiAgICAnXFx1MjRFNSc6ICd2JyxcbiAgICAnXFx1RkY1Nic6ICd2JyxcbiAgICAnXFx1MUU3RCc6ICd2JyxcbiAgICAnXFx1MUU3Ric6ICd2JyxcbiAgICAnXFx1MDI4Qic6ICd2JyxcbiAgICAnXFx1QTc1Ric6ICd2JyxcbiAgICAnXFx1MDI4Qyc6ICd2JyxcbiAgICAnXFx1QTc2MSc6ICd2eScsXG4gICAgJ1xcdTI0RTYnOiAndycsXG4gICAgJ1xcdUZGNTcnOiAndycsXG4gICAgJ1xcdTFFODEnOiAndycsXG4gICAgJ1xcdTFFODMnOiAndycsXG4gICAgJ1xcdTAxNzUnOiAndycsXG4gICAgJ1xcdTFFODcnOiAndycsXG4gICAgJ1xcdTFFODUnOiAndycsXG4gICAgJ1xcdTFFOTgnOiAndycsXG4gICAgJ1xcdTFFODknOiAndycsXG4gICAgJ1xcdTJDNzMnOiAndycsXG4gICAgJ1xcdTI0RTcnOiAneCcsXG4gICAgJ1xcdUZGNTgnOiAneCcsXG4gICAgJ1xcdTFFOEInOiAneCcsXG4gICAgJ1xcdTFFOEQnOiAneCcsXG4gICAgJ1xcdTI0RTgnOiAneScsXG4gICAgJ1xcdUZGNTknOiAneScsXG4gICAgJ1xcdTFFRjMnOiAneScsXG4gICAgJ1xcdTAwRkQnOiAneScsXG4gICAgJ1xcdTAxNzcnOiAneScsXG4gICAgJ1xcdTFFRjknOiAneScsXG4gICAgJ1xcdTAyMzMnOiAneScsXG4gICAgJ1xcdTFFOEYnOiAneScsXG4gICAgJ1xcdTAwRkYnOiAneScsXG4gICAgJ1xcdTFFRjcnOiAneScsXG4gICAgJ1xcdTFFOTknOiAneScsXG4gICAgJ1xcdTFFRjUnOiAneScsXG4gICAgJ1xcdTAxQjQnOiAneScsXG4gICAgJ1xcdTAyNEYnOiAneScsXG4gICAgJ1xcdTFFRkYnOiAneScsXG4gICAgJ1xcdTI0RTknOiAneicsXG4gICAgJ1xcdUZGNUEnOiAneicsXG4gICAgJ1xcdTAxN0EnOiAneicsXG4gICAgJ1xcdTFFOTEnOiAneicsXG4gICAgJ1xcdTAxN0MnOiAneicsXG4gICAgJ1xcdTAxN0UnOiAneicsXG4gICAgJ1xcdTFFOTMnOiAneicsXG4gICAgJ1xcdTFFOTUnOiAneicsXG4gICAgJ1xcdTAxQjYnOiAneicsXG4gICAgJ1xcdTAyMjUnOiAneicsXG4gICAgJ1xcdTAyNDAnOiAneicsXG4gICAgJ1xcdTJDNkMnOiAneicsXG4gICAgJ1xcdUE3NjMnOiAneicsXG4gICAgJ1xcdTAzODYnOiAnXFx1MDM5MScsXG4gICAgJ1xcdTAzODgnOiAnXFx1MDM5NScsXG4gICAgJ1xcdTAzODknOiAnXFx1MDM5NycsXG4gICAgJ1xcdTAzOEEnOiAnXFx1MDM5OScsXG4gICAgJ1xcdTAzQUEnOiAnXFx1MDM5OScsXG4gICAgJ1xcdTAzOEMnOiAnXFx1MDM5RicsXG4gICAgJ1xcdTAzOEUnOiAnXFx1MDNBNScsXG4gICAgJ1xcdTAzQUInOiAnXFx1MDNBNScsXG4gICAgJ1xcdTAzOEYnOiAnXFx1MDNBOScsXG4gICAgJ1xcdTAzQUMnOiAnXFx1MDNCMScsXG4gICAgJ1xcdTAzQUQnOiAnXFx1MDNCNScsXG4gICAgJ1xcdTAzQUUnOiAnXFx1MDNCNycsXG4gICAgJ1xcdTAzQUYnOiAnXFx1MDNCOScsXG4gICAgJ1xcdTAzQ0EnOiAnXFx1MDNCOScsXG4gICAgJ1xcdTAzOTAnOiAnXFx1MDNCOScsXG4gICAgJ1xcdTAzQ0MnOiAnXFx1MDNCRicsXG4gICAgJ1xcdTAzQ0QnOiAnXFx1MDNDNScsXG4gICAgJ1xcdTAzQ0InOiAnXFx1MDNDNScsXG4gICAgJ1xcdTAzQjAnOiAnXFx1MDNDNScsXG4gICAgJ1xcdTAzQ0UnOiAnXFx1MDNDOScsXG4gICAgJ1xcdTAzQzInOiAnXFx1MDNDMycsXG4gICAgJ1xcdTIwMTknOiAnXFwnJ1xuICB9O1xuXG4gIHJldHVybiBkaWFjcml0aWNzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2Jhc2UnLFtcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFV0aWxzKSB7XG4gIGZ1bmN0aW9uIEJhc2VBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIEJhc2VBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKEJhc2VBZGFwdGVyLCBVdGlscy5PYnNlcnZhYmxlKTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBjdXJyZW50YCBtZXRob2QgbXVzdCBiZSBkZWZpbmVkIGluIGNoaWxkIGNsYXNzZXMuJyk7XG4gIH07XG5cbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgcXVlcnlgIG1ldGhvZCBtdXN0IGJlIGRlZmluZWQgaW4gY2hpbGQgY2xhc3Nlcy4nKTtcbiAgfTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAvLyBDYW4gYmUgaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICB9O1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIENhbiBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXG4gIH07XG5cbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmdlbmVyYXRlUmVzdWx0SWQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkYXRhKSB7XG4gICAgdmFyIGlkID0gY29udGFpbmVyLmlkICsgJy1yZXN1bHQtJztcblxuICAgIGlkICs9IFV0aWxzLmdlbmVyYXRlQ2hhcnMoNCk7XG5cbiAgICBpZiAoZGF0YS5pZCAhPSBudWxsKSB7XG4gICAgICBpZCArPSAnLScgKyBkYXRhLmlkLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkICs9ICctJyArIFV0aWxzLmdlbmVyYXRlQ2hhcnMoNCk7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICByZXR1cm4gQmFzZUFkYXB0ZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvc2VsZWN0JyxbXG4gICcuL2Jhc2UnLFxuICAnLi4vdXRpbHMnLFxuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKEJhc2VBZGFwdGVyLCBVdGlscywgJCkge1xuICBmdW5jdGlvbiBTZWxlY3RBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgU2VsZWN0QWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChTZWxlY3RBZGFwdGVyLCBCYXNlQWRhcHRlcik7XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciBkYXRhID0gW107XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCc6c2VsZWN0ZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcblxuICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcblxuICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgfSk7XG5cbiAgICBjYWxsYmFjayhkYXRhKTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgLy8gSWYgZGF0YS5lbGVtZW50IGlzIGEgRE9NIG5vZGUsIHVzZSBpdCBpbnN0ZWFkXG4gICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcbiAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudC5wcm9wKCdtdWx0aXBsZScpKSB7XG4gICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgIHZhciB2YWwgPSBbXTtcblxuICAgICAgICBkYXRhID0gW2RhdGFdO1xuICAgICAgICBkYXRhLnB1c2guYXBwbHkoZGF0YSwgY3VycmVudERhdGEpO1xuXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICAgIHZhciBpZCA9IGRhdGFbZF0uaWQ7XG5cbiAgICAgICAgICBpZiAoJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgdmFsLnB1c2goaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG4gICAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZhbCA9IGRhdGEuaWQ7XG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudmFsKHZhbCk7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS51bnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LnByb3AoJ211bHRpcGxlJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRpb24nKSkge1xuICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICB2YXIgdmFsID0gW107XG5cbiAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgY3VycmVudERhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgdmFyIGlkID0gY3VycmVudERhdGFbZF0uaWQ7XG5cbiAgICAgICAgaWYgKGlkICE9PSBkYXRhLmlkICYmICQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsKTtcblxuICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLnNlbGVjdChwYXJhbXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi51bnNlbGVjdChwYXJhbXMuZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBSZW1vdmUgYW55dGhpbmcgYWRkZWQgdG8gY2hpbGQgZWxlbWVudHNcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQoJyonKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFJlbW92ZSBhbnkgY3VzdG9tIGRhdGEgc2V0IGJ5IFNlbGVjdDJcbiAgICAgIFV0aWxzLlJlbW92ZURhdGEodGhpcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBkYXRhID0gW107XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbigpO1xuXG4gICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgIGlmICghJG9wdGlvbi5pcygnb3B0aW9uJykgJiYgISRvcHRpb24uaXMoJ29wdGdyb3VwJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuXG4gICAgICB2YXIgbWF0Y2hlcyA9IHNlbGYubWF0Y2hlcyhwYXJhbXMsIG9wdGlvbik7XG5cbiAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsKSB7XG4gICAgICAgIGRhdGEucHVzaChtYXRjaGVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNhbGxiYWNrKHtcbiAgICAgIHJlc3VsdHM6IGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5hZGRPcHRpb25zID0gZnVuY3Rpb24gKCRvcHRpb25zKSB7XG4gICAgVXRpbHMuYXBwZW5kTWFueSh0aGlzLiRlbGVtZW50LCAkb3B0aW9ucyk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgb3B0aW9uO1xuXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcbiAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJyk7XG4gICAgICBvcHRpb24ubGFiZWwgPSBkYXRhLnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4gICAgICBpZiAob3B0aW9uLnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gZGF0YS50ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9uLmlubmVyVGV4dCA9IGRhdGEudGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5pZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb24udmFsdWUgPSBkYXRhLmlkO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmRpc2FibGVkKSB7XG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlbGVjdGVkKSB7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnRpdGxlKSB7XG4gICAgICBvcHRpb24udGl0bGUgPSBkYXRhLnRpdGxlO1xuICAgIH1cblxuICAgIHZhciAkb3B0aW9uID0gJChvcHRpb24pO1xuXG4gICAgdmFyIG5vcm1hbGl6ZWREYXRhID0gdGhpcy5fbm9ybWFsaXplSXRlbShkYXRhKTtcbiAgICBub3JtYWxpemVkRGF0YS5lbGVtZW50ID0gb3B0aW9uO1xuXG4gICAgLy8gT3ZlcnJpZGUgdGhlIG9wdGlvbidzIGRhdGEgd2l0aCB0aGUgY29tYmluZWQgZGF0YVxuICAgIFV0aWxzLlN0b3JlRGF0YShvcHRpb24sICdkYXRhJywgbm9ybWFsaXplZERhdGEpO1xuXG4gICAgcmV0dXJuICRvcHRpb247XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuaXRlbSA9IGZ1bmN0aW9uICgkb3B0aW9uKSB7XG4gICAgdmFyIGRhdGEgPSB7fTtcblxuICAgIGRhdGEgPSBVdGlscy5HZXREYXRhKCRvcHRpb25bMF0sICdkYXRhJyk7XG5cbiAgICBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBpZiAoJG9wdGlvbi5pcygnb3B0aW9uJykpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIGlkOiAkb3B0aW9uLnZhbCgpLFxuICAgICAgICB0ZXh0OiAkb3B0aW9uLnRleHQoKSxcbiAgICAgICAgZGlzYWJsZWQ6ICRvcHRpb24ucHJvcCgnZGlzYWJsZWQnKSxcbiAgICAgICAgc2VsZWN0ZWQ6ICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnKSxcbiAgICAgICAgdGl0bGU6ICRvcHRpb24ucHJvcCgndGl0bGUnKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKCRvcHRpb24uaXMoJ29wdGdyb3VwJykpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIHRleHQ6ICRvcHRpb24ucHJvcCgnbGFiZWwnKSxcbiAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICB0aXRsZTogJG9wdGlvbi5wcm9wKCd0aXRsZScpXG4gICAgICB9O1xuXG4gICAgICB2YXIgJGNoaWxkcmVuID0gJG9wdGlvbi5jaGlsZHJlbignb3B0aW9uJyk7XG4gICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcblxuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCAkY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyICRjaGlsZCA9ICQoJGNoaWxkcmVuW2NdKTtcblxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLml0ZW0oJGNoaWxkKTtcblxuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgZGF0YS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cblxuICAgIGRhdGEgPSB0aGlzLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xuICAgIGRhdGEuZWxlbWVudCA9ICRvcHRpb25bMF07XG5cbiAgICBVdGlscy5TdG9yZURhdGEoJG9wdGlvblswXSwgJ2RhdGEnLCBkYXRhKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLl9ub3JtYWxpemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAoaXRlbSAhPT0gT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBpdGVtID0ge1xuICAgICAgICBpZDogaXRlbSxcbiAgICAgICAgdGV4dDogaXRlbVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpdGVtID0gJC5leHRlbmQoe30sIHtcbiAgICAgIHRleHQ6ICcnXG4gICAgfSwgaXRlbSk7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICBkaXNhYmxlZDogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKGl0ZW0uaWQgIT0gbnVsbCkge1xuICAgICAgaXRlbS5pZCA9IGl0ZW0uaWQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbS50ZXh0ICE9IG51bGwpIHtcbiAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmIChpdGVtLl9yZXN1bHRJZCA9PSBudWxsICYmIGl0ZW0uaWQgJiYgdGhpcy5jb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgaXRlbS5fcmVzdWx0SWQgPSB0aGlzLmdlbmVyYXRlUmVzdWx0SWQodGhpcy5jb250YWluZXIsIGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGl0ZW0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAocGFyYW1zLCBkYXRhKSB7XG4gICAgdmFyIG1hdGNoZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdtYXRjaGVyJyk7XG5cbiAgICByZXR1cm4gbWF0Y2hlcihwYXJhbXMsIGRhdGEpO1xuICB9O1xuXG4gIHJldHVybiBTZWxlY3RBZGFwdGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2FycmF5JyxbXG4gICcuL3NlbGVjdCcsXG4gICcuLi91dGlscycsXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoU2VsZWN0QWRhcHRlciwgVXRpbHMsICQpIHtcbiAgZnVuY3Rpb24gQXJyYXlBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciBkYXRhID0gb3B0aW9ucy5nZXQoJ2RhdGEnKSB8fCBbXTtcblxuICAgIEFycmF5QWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFkZE9wdGlvbnModGhpcy5jb252ZXJ0VG9PcHRpb25zKGRhdGEpKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChBcnJheUFkYXB0ZXIsIFNlbGVjdEFkYXB0ZXIpO1xuXG4gIEFycmF5QWRhcHRlci5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgJG9wdGlvbiA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uJykuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbG0pIHtcbiAgICAgIHJldHVybiBlbG0udmFsdWUgPT0gZGF0YS5pZC50b1N0cmluZygpO1xuICAgIH0pO1xuXG4gICAgaWYgKCRvcHRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAkb3B0aW9uID0gdGhpcy5vcHRpb24oZGF0YSk7XG5cbiAgICAgIHRoaXMuYWRkT3B0aW9ucygkb3B0aW9uKTtcbiAgICB9XG5cbiAgICBBcnJheUFkYXB0ZXIuX19zdXBlcl9fLnNlbGVjdC5jYWxsKHRoaXMsIGRhdGEpO1xuICB9O1xuXG4gIEFycmF5QWRhcHRlci5wcm90b3R5cGUuY29udmVydFRvT3B0aW9ucyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyICRleGlzdGluZyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uJyk7XG4gICAgdmFyIGV4aXN0aW5nSWRzID0gJGV4aXN0aW5nLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc2VsZi5pdGVtKCQodGhpcykpLmlkO1xuICAgIH0pLmdldCgpO1xuXG4gICAgdmFyICRvcHRpb25zID0gW107XG5cbiAgICAvLyBGaWx0ZXIgb3V0IGFsbCBpdGVtcyBleGNlcHQgZm9yIHRoZSBvbmUgcGFzc2VkIGluIHRoZSBhcmd1bWVudFxuICAgIGZ1bmN0aW9uIG9ubHlJdGVtIChpdGVtKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PSBpdGVtLmlkO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBpdGVtID0gdGhpcy5fbm9ybWFsaXplSXRlbShkYXRhW2RdKTtcblxuICAgICAgLy8gU2tpcCBpdGVtcyB3aGljaCB3ZXJlIHByZS1sb2FkZWQsIG9ubHkgbWVyZ2UgdGhlIGRhdGFcbiAgICAgIGlmICgkLmluQXJyYXkoaXRlbS5pZCwgZXhpc3RpbmdJZHMpID49IDApIHtcbiAgICAgICAgdmFyICRleGlzdGluZ09wdGlvbiA9ICRleGlzdGluZy5maWx0ZXIob25seUl0ZW0oaXRlbSkpO1xuXG4gICAgICAgIHZhciBleGlzdGluZ0RhdGEgPSB0aGlzLml0ZW0oJGV4aXN0aW5nT3B0aW9uKTtcbiAgICAgICAgdmFyIG5ld0RhdGEgPSAkLmV4dGVuZCh0cnVlLCB7fSwgaXRlbSwgZXhpc3RpbmdEYXRhKTtcblxuICAgICAgICB2YXIgJG5ld09wdGlvbiA9IHRoaXMub3B0aW9uKG5ld0RhdGEpO1xuXG4gICAgICAgICRleGlzdGluZ09wdGlvbi5yZXBsYWNlV2l0aCgkbmV3T3B0aW9uKTtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcblxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgdmFyICRjaGlsZHJlbiA9IHRoaXMuY29udmVydFRvT3B0aW9ucyhpdGVtLmNoaWxkcmVuKTtcblxuICAgICAgICBVdGlscy5hcHBlbmRNYW55KCRvcHRpb24sICRjaGlsZHJlbik7XG4gICAgICB9XG5cbiAgICAgICRvcHRpb25zLnB1c2goJG9wdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRvcHRpb25zO1xuICB9O1xuXG4gIHJldHVybiBBcnJheUFkYXB0ZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYWpheCcsW1xuICAnLi9hcnJheScsXG4gICcuLi91dGlscycsXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoQXJyYXlBZGFwdGVyLCBVdGlscywgJCkge1xuICBmdW5jdGlvbiBBamF4QWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmFqYXhPcHRpb25zID0gdGhpcy5fYXBwbHlEZWZhdWx0cyhvcHRpb25zLmdldCgnYWpheCcpKTtcblxuICAgIGlmICh0aGlzLmFqYXhPcHRpb25zLnByb2Nlc3NSZXN1bHRzICE9IG51bGwpIHtcbiAgICAgIHRoaXMucHJvY2Vzc1Jlc3VsdHMgPSB0aGlzLmFqYXhPcHRpb25zLnByb2Nlc3NSZXN1bHRzO1xuICAgIH1cblxuICAgIEFqYXhBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChBamF4QWRhcHRlciwgQXJyYXlBZGFwdGVyKTtcblxuICBBamF4QWRhcHRlci5wcm90b3R5cGUuX2FwcGx5RGVmYXVsdHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGRhdGE6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgICBxOiBwYXJhbXMudGVybVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB0cmFuc3BvcnQ6IGZ1bmN0aW9uIChwYXJhbXMsIHN1Y2Nlc3MsIGZhaWx1cmUpIHtcbiAgICAgICAgdmFyICRyZXF1ZXN0ID0gJC5hamF4KHBhcmFtcyk7XG5cbiAgICAgICAgJHJlcXVlc3QudGhlbihzdWNjZXNzKTtcbiAgICAgICAgJHJlcXVlc3QuZmFpbChmYWlsdXJlKTtcblxuICAgICAgICByZXR1cm4gJHJlcXVlc3Q7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWUpO1xuICB9O1xuXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5wcm9jZXNzUmVzdWx0cyA9IGZ1bmN0aW9uIChyZXN1bHRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgQWpheEFkYXB0ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9yZXF1ZXN0ICE9IG51bGwpIHtcbiAgICAgIC8vIEpTT05QIHJlcXVlc3RzIGNhbm5vdCBhbHdheXMgYmUgYWJvcnRlZFxuICAgICAgaWYgKCQuaXNGdW5jdGlvbih0aGlzLl9yZXF1ZXN0LmFib3J0KSkge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0LmFib3J0KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe1xuICAgICAgdHlwZTogJ0dFVCdcbiAgICB9LCB0aGlzLmFqYXhPcHRpb25zKTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy51cmwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdGlvbnMudXJsID0gb3B0aW9ucy51cmwuY2FsbCh0aGlzLiRlbGVtZW50LCBwYXJhbXMpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGEuY2FsbCh0aGlzLiRlbGVtZW50LCBwYXJhbXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcXVlc3QgKCkge1xuICAgICAgdmFyICRyZXF1ZXN0ID0gb3B0aW9ucy50cmFuc3BvcnQob3B0aW9ucywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBzZWxmLnByb2Nlc3NSZXN1bHRzKGRhdGEsIHBhcmFtcyk7XG5cbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSByZXNwb25zZSBpbmNsdWRlZCBhIGByZXN1bHRzYCBrZXkuXG4gICAgICAgICAgaWYgKCFyZXN1bHRzIHx8ICFyZXN1bHRzLnJlc3VsdHMgfHwgISQuaXNBcnJheShyZXN1bHRzLnJlc3VsdHMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAnU2VsZWN0MjogVGhlIEFKQVggcmVzdWx0cyBkaWQgbm90IHJldHVybiBhbiBhcnJheSBpbiB0aGUgJyArXG4gICAgICAgICAgICAgICdgcmVzdWx0c2Aga2V5IG9mIHRoZSByZXNwb25zZS4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBdHRlbXB0IHRvIGRldGVjdCBpZiBhIHJlcXVlc3Qgd2FzIGFib3J0ZWRcbiAgICAgICAgLy8gT25seSB3b3JrcyBpZiB0aGUgdHJhbnNwb3J0IGV4cG9zZXMgYSBzdGF0dXMgcHJvcGVydHlcbiAgICAgICAgaWYgKCdzdGF0dXMnIGluICRyZXF1ZXN0ICYmXG4gICAgICAgICAgICAoJHJlcXVlc3Quc3RhdHVzID09PSAwIHx8ICRyZXF1ZXN0LnN0YXR1cyA9PT0gJzAnKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xuICAgICAgICAgIG1lc3NhZ2U6ICdlcnJvckxvYWRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuX3JlcXVlc3QgPSAkcmVxdWVzdDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hamF4T3B0aW9ucy5kZWxheSAmJiBwYXJhbXMudGVybSAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5fcXVlcnlUaW1lb3V0KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fcXVlcnlUaW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcXVlcnlUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQocmVxdWVzdCwgdGhpcy5hamF4T3B0aW9ucy5kZWxheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVlc3QoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEFqYXhBZGFwdGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL3RhZ3MnLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIGZ1bmN0aW9uIFRhZ3MgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgdGFncyA9IG9wdGlvbnMuZ2V0KCd0YWdzJyk7XG5cbiAgICB2YXIgY3JlYXRlVGFnID0gb3B0aW9ucy5nZXQoJ2NyZWF0ZVRhZycpO1xuXG4gICAgaWYgKGNyZWF0ZVRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNyZWF0ZVRhZyA9IGNyZWF0ZVRhZztcbiAgICB9XG5cbiAgICB2YXIgaW5zZXJ0VGFnID0gb3B0aW9ucy5nZXQoJ2luc2VydFRhZycpO1xuXG4gICAgaWYgKGluc2VydFRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0VGFnID0gaW5zZXJ0VGFnO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcblxuICAgIGlmICgkLmlzQXJyYXkodGFncykpIHtcbiAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdGFncy5sZW5ndGg7IHQrKykge1xuICAgICAgICB2YXIgdGFnID0gdGFnc1t0XTtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9ub3JtYWxpemVJdGVtKHRhZyk7XG5cbiAgICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcblxuICAgICAgICB0aGlzLiRlbGVtZW50LmFwcGVuZCgkb3B0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBUYWdzLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLl9yZW1vdmVPbGRUYWdzKCk7XG5cbiAgICBpZiAocGFyYW1zLnRlcm0gPT0gbnVsbCB8fCBwYXJhbXMucGFnZSAhPSBudWxsKSB7XG4gICAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3cmFwcGVyIChvYmosIGNoaWxkKSB7XG4gICAgICB2YXIgZGF0YSA9IG9iai5yZXN1bHRzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IGRhdGFbaV07XG5cbiAgICAgICAgdmFyIGNoZWNrQ2hpbGRyZW4gPSAoXG4gICAgICAgICAgb3B0aW9uLmNoaWxkcmVuICE9IG51bGwgJiZcbiAgICAgICAgICAhd3JhcHBlcih7XG4gICAgICAgICAgICByZXN1bHRzOiBvcHRpb24uY2hpbGRyZW5cbiAgICAgICAgICB9LCB0cnVlKVxuICAgICAgICApO1xuXG4gICAgICAgIHZhciBvcHRpb25UZXh0ID0gKG9wdGlvbi50ZXh0IHx8ICcnKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgcGFyYW1zVGVybSA9IChwYXJhbXMudGVybSB8fCAnJykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICB2YXIgY2hlY2tUZXh0ID0gb3B0aW9uVGV4dCA9PT0gcGFyYW1zVGVybTtcblxuICAgICAgICBpZiAoY2hlY2tUZXh0IHx8IGNoZWNrQ2hpbGRyZW4pIHtcbiAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYmouZGF0YSA9IGRhdGE7XG4gICAgICAgICAgY2FsbGJhY2sob2JqKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciB0YWcgPSBzZWxmLmNyZWF0ZVRhZyhwYXJhbXMpO1xuXG4gICAgICBpZiAodGFnICE9IG51bGwpIHtcbiAgICAgICAgdmFyICRvcHRpb24gPSBzZWxmLm9wdGlvbih0YWcpO1xuICAgICAgICAkb3B0aW9uLmF0dHIoJ2RhdGEtc2VsZWN0Mi10YWcnLCB0cnVlKTtcblxuICAgICAgICBzZWxmLmFkZE9wdGlvbnMoWyRvcHRpb25dKTtcblxuICAgICAgICBzZWxmLmluc2VydFRhZyhkYXRhLCB0YWcpO1xuICAgICAgfVxuXG4gICAgICBvYmoucmVzdWx0cyA9IGRhdGE7XG5cbiAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCB3cmFwcGVyKTtcbiAgfTtcblxuICBUYWdzLnByb3RvdHlwZS5jcmVhdGVUYWcgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMpIHtcbiAgICB2YXIgdGVybSA9ICQudHJpbShwYXJhbXMudGVybSk7XG5cbiAgICBpZiAodGVybSA9PT0gJycpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpZDogdGVybSxcbiAgICAgIHRleHQ6IHRlcm1cbiAgICB9O1xuICB9O1xuXG4gIFRhZ3MucHJvdG90eXBlLmluc2VydFRhZyA9IGZ1bmN0aW9uIChfLCBkYXRhLCB0YWcpIHtcbiAgICBkYXRhLnVuc2hpZnQodGFnKTtcbiAgfTtcblxuICBUYWdzLnByb3RvdHlwZS5fcmVtb3ZlT2xkVGFncyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgdmFyIHRhZyA9IHRoaXMuX2xhc3RUYWc7XG5cbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbltkYXRhLXNlbGVjdDItdGFnXScpO1xuXG4gICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFRhZ3M7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvdG9rZW5pemVyJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBUb2tlbml6ZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgdG9rZW5pemVyID0gb3B0aW9ucy5nZXQoJ3Rva2VuaXplcicpO1xuXG4gICAgaWYgKHRva2VuaXplciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRva2VuaXplciA9IHRva2VuaXplcjtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBUb2tlbml6ZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgdGhpcy4kc2VhcmNoID0gIGNvbnRhaW5lci5kcm9wZG93bi4kc2VhcmNoIHx8IGNvbnRhaW5lci5zZWxlY3Rpb24uJHNlYXJjaCB8fFxuICAgICAgJGNvbnRhaW5lci5maW5kKCcuc2VsZWN0Mi1zZWFyY2hfX2ZpZWxkJyk7XG4gIH07XG5cbiAgVG9rZW5pemVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVBbmRTZWxlY3QgKGRhdGEpIHtcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgZGF0YSBvYmplY3Qgc28gd2UgY2FuIHVzZSBpdCBmb3IgY2hlY2tzXG4gICAgICB2YXIgaXRlbSA9IHNlbGYuX25vcm1hbGl6ZUl0ZW0oZGF0YSk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBkYXRhIG9iamVjdCBhbHJlYWR5IGV4aXN0cyBhcyBhIHRhZ1xuICAgICAgLy8gU2VsZWN0IGl0IGlmIGl0IGRvZXNuJ3RcbiAgICAgIHZhciAkZXhpc3RpbmdPcHRpb25zID0gc2VsZi4kZWxlbWVudC5maW5kKCdvcHRpb24nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PT0gaXRlbS5pZDtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiBhbiBleGlzdGluZyBvcHRpb24gd2Fzbid0IGZvdW5kIGZvciBpdCwgY3JlYXRlIHRoZSBvcHRpb25cbiAgICAgIGlmICghJGV4aXN0aW5nT3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgdmFyICRvcHRpb24gPSBzZWxmLm9wdGlvbihpdGVtKTtcbiAgICAgICAgJG9wdGlvbi5hdHRyKCdkYXRhLXNlbGVjdDItdGFnJywgdHJ1ZSk7XG5cbiAgICAgICAgc2VsZi5fcmVtb3ZlT2xkVGFncygpO1xuICAgICAgICBzZWxmLmFkZE9wdGlvbnMoWyRvcHRpb25dKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2VsZWN0IHRoZSBpdGVtLCBub3cgdGhhdCB3ZSBrbm93IHRoZXJlIGlzIGFuIG9wdGlvbiBmb3IgaXRcbiAgICAgIHNlbGVjdChpdGVtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZWxlY3QgKGRhdGEpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0Jywge1xuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJhbXMudGVybSA9IHBhcmFtcy50ZXJtIHx8ICcnO1xuXG4gICAgdmFyIHRva2VuRGF0YSA9IHRoaXMudG9rZW5pemVyKHBhcmFtcywgdGhpcy5vcHRpb25zLCBjcmVhdGVBbmRTZWxlY3QpO1xuXG4gICAgaWYgKHRva2VuRGF0YS50ZXJtICE9PSBwYXJhbXMudGVybSkge1xuICAgICAgLy8gUmVwbGFjZSB0aGUgc2VhcmNoIHRlcm0gaWYgd2UgaGF2ZSB0aGUgc2VhcmNoIGJveFxuICAgICAgaWYgKHRoaXMuJHNlYXJjaC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy4kc2VhcmNoLnZhbCh0b2tlbkRhdGEudGVybSk7XG4gICAgICAgIHRoaXMuJHNlYXJjaC5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICBwYXJhbXMudGVybSA9IHRva2VuRGF0YS50ZXJtO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xuICB9O1xuXG4gIFRva2VuaXplci5wcm90b3R5cGUudG9rZW5pemVyID0gZnVuY3Rpb24gKF8sIHBhcmFtcywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VwYXJhdG9ycyA9IG9wdGlvbnMuZ2V0KCd0b2tlblNlcGFyYXRvcnMnKSB8fCBbXTtcbiAgICB2YXIgdGVybSA9IHBhcmFtcy50ZXJtO1xuICAgIHZhciBpID0gMDtcblxuICAgIHZhciBjcmVhdGVUYWcgPSB0aGlzLmNyZWF0ZVRhZyB8fCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogcGFyYW1zLnRlcm0sXG4gICAgICAgIHRleHQ6IHBhcmFtcy50ZXJtXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB3aGlsZSAoaSA8IHRlcm0ubGVuZ3RoKSB7XG4gICAgICB2YXIgdGVybUNoYXIgPSB0ZXJtW2ldO1xuXG4gICAgICBpZiAoJC5pbkFycmF5KHRlcm1DaGFyLCBzZXBhcmF0b3JzKSA9PT0gLTEpIHtcbiAgICAgICAgaSsrO1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFydCA9IHRlcm0uc3Vic3RyKDAsIGkpO1xuICAgICAgdmFyIHBhcnRQYXJhbXMgPSAkLmV4dGVuZCh7fSwgcGFyYW1zLCB7XG4gICAgICAgIHRlcm06IHBhcnRcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgZGF0YSA9IGNyZWF0ZVRhZyhwYXJ0UGFyYW1zKTtcblxuICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICBpKys7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhkYXRhKTtcblxuICAgICAgLy8gUmVzZXQgdGhlIHRlcm0gdG8gbm90IGluY2x1ZGUgdGhlIHRva2VuaXplZCBwb3J0aW9uXG4gICAgICB0ZXJtID0gdGVybS5zdWJzdHIoaSArIDEpIHx8ICcnO1xuICAgICAgaSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRlcm06IHRlcm1cbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBUb2tlbml6ZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvbWluaW11bUlucHV0TGVuZ3RoJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWluaW11bUlucHV0TGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5taW5pbXVtSW5wdXRMZW5ndGggPSBvcHRpb25zLmdldCgnbWluaW11bUlucHV0TGVuZ3RoJyk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZSwgb3B0aW9ucyk7XG4gIH1cblxuICBNaW5pbXVtSW5wdXRMZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHBhcmFtcy50ZXJtID0gcGFyYW1zLnRlcm0gfHwgJyc7XG5cbiAgICBpZiAocGFyYW1zLnRlcm0ubGVuZ3RoIDwgdGhpcy5taW5pbXVtSW5wdXRMZW5ndGgpIHtcbiAgICAgIHRoaXMudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xuICAgICAgICBtZXNzYWdlOiAnaW5wdXRUb29TaG9ydCcsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICBtaW5pbXVtOiB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCxcbiAgICAgICAgICBpbnB1dDogcGFyYW1zLnRlcm0sXG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgfTtcblxuICByZXR1cm4gTWluaW11bUlucHV0TGVuZ3RoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL21heGltdW1JbnB1dExlbmd0aCcsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1heGltdW1JbnB1dExlbmd0aCAoZGVjb3JhdGVkLCAkZSwgb3B0aW9ucykge1xuICAgIHRoaXMubWF4aW11bUlucHV0TGVuZ3RoID0gb3B0aW9ucy5nZXQoJ21heGltdW1JbnB1dExlbmd0aCcpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgTWF4aW11bUlucHV0TGVuZ3RoLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICBwYXJhbXMudGVybSA9IHBhcmFtcy50ZXJtIHx8ICcnO1xuXG4gICAgaWYgKHRoaXMubWF4aW11bUlucHV0TGVuZ3RoID4gMCAmJlxuICAgICAgICBwYXJhbXMudGVybS5sZW5ndGggPiB0aGlzLm1heGltdW1JbnB1dExlbmd0aCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdpbnB1dFRvb0xvbmcnLFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgbWF4aW11bTogdGhpcy5tYXhpbXVtSW5wdXRMZW5ndGgsXG4gICAgICAgICAgaW5wdXQ6IHBhcmFtcy50ZXJtLFxuICAgICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgcmV0dXJuIE1heGltdW1JbnB1dExlbmd0aDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoJyxbXG5cbl0sIGZ1bmN0aW9uICgpe1xuICBmdW5jdGlvbiBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoID0gb3B0aW9ucy5nZXQoJ21heGltdW1TZWxlY3Rpb25MZW5ndGgnKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIE1heGltdW1TZWxlY3Rpb25MZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID1cbiAgICBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gY3VycmVudERhdGEgIT0gbnVsbCA/IGN1cnJlbnREYXRhLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmIChzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPiAwICYmXG4gICAgICAgICAgY291bnQgPj0gc2VsZi5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgICAgICBtZXNzYWdlOiAnbWF4aW11bVNlbGVjdGVkJyxcbiAgICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAgbWF4aW11bTogc2VsZi5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHNlbGYsIHBhcmFtcywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIE1heGltdW1TZWxlY3Rpb25MZW5ndGg7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duJyxbXG4gICdqcXVlcnknLFxuICAnLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xuICBmdW5jdGlvbiBEcm9wZG93biAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIERyb3Bkb3duLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKERyb3Bkb3duLCBVdGlscy5PYnNlcnZhYmxlKTtcblxuICBEcm9wZG93bi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZHJvcGRvd24gPSAkKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1kcm9wZG93blwiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNcIj48L3NwYW4+JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuXG4gICAgJGRyb3Bkb3duLmF0dHIoJ2RpcicsIHRoaXMub3B0aW9ucy5nZXQoJ2RpcicpKTtcblxuICAgIHRoaXMuJGRyb3Bkb3duID0gJGRyb3Bkb3duO1xuXG4gICAgcmV0dXJuICRkcm9wZG93bjtcbiAgfTtcblxuICBEcm9wZG93bi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTaG91bGQgYmUgaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICB9O1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uICgkZHJvcGRvd24sICRjb250YWluZXIpIHtcbiAgICAvLyBTaG91bGQgYmUgaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICB9O1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFJlbW92ZSB0aGUgZHJvcGRvd24gZnJvbSB0aGUgRE9NXG4gICAgdGhpcy4kZHJvcGRvd24ucmVtb3ZlKCk7XG4gIH07XG5cbiAgcmV0dXJuIERyb3Bkb3duO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9zZWFyY2gnLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xuICBmdW5jdGlvbiBTZWFyY2ggKCkgeyB9XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdmFyICRyZW5kZXJlZCA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xuXG4gICAgdmFyICRzZWFyY2ggPSAkKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWFyY2ggc2VsZWN0Mi1zZWFyY2gtLWRyb3Bkb3duXCI+JyArXG4gICAgICAgICc8aW5wdXQgY2xhc3M9XCJzZWxlY3QyLXNlYXJjaF9fZmllbGRcIiB0eXBlPVwic2VhcmNoXCIgdGFiaW5kZXg9XCItMVwiJyArXG4gICAgICAgICcgYXV0b2NvbXBsZXRlPVwib2ZmXCIgYXV0b2NvcnJlY3Q9XCJvZmZcIiBhdXRvY2FwaXRhbGl6ZT1cIm5vbmVcIicgK1xuICAgICAgICAnIHNwZWxsY2hlY2s9XCJmYWxzZVwiIHJvbGU9XCJ0ZXh0Ym94XCIgLz4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICB0aGlzLiRzZWFyY2hDb250YWluZXIgPSAkc2VhcmNoO1xuICAgIHRoaXMuJHNlYXJjaCA9ICRzZWFyY2guZmluZCgnaW5wdXQnKTtcblxuICAgICRyZW5kZXJlZC5wcmVwZW5kKCRzZWFyY2gpO1xuXG4gICAgcmV0dXJuICRyZW5kZXJlZDtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgdGhpcy4kc2VhcmNoLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XG5cbiAgICAgIHNlbGYuX2tleVVwUHJldmVudGVkID0gZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgYnJvd3NlcnMgd2hpY2ggZG8gbm90IHN1cHBvcnQgdGhlIGBpbnB1dGAgZXZlbnRcbiAgICAvLyBUaGlzIHdpbGwgcHJldmVudCBkb3VibGUtdHJpZ2dlcmluZyBvZiBldmVudHMgZm9yIGJyb3dzZXJzIHdoaWNoIHN1cHBvcnRcbiAgICAvLyBib3RoIHRoZSBga2V5dXBgIGFuZCBgaW5wdXRgIGV2ZW50cy5cbiAgICB0aGlzLiRzZWFyY2gub24oJ2lucHV0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgLy8gVW5iaW5kIHRoZSBkdXBsaWNhdGVkIGBrZXl1cGAgZXZlbnRcbiAgICAgICQodGhpcykub2ZmKCdrZXl1cCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VhcmNoLm9uKCdrZXl1cCBpbnB1dCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuaGFuZGxlU2VhcmNoKGV2dCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCAwKTtcblxuICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XG5cbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCAtMSk7XG5cbiAgICAgIHNlbGYuJHNlYXJjaC52YWwoJycpO1xuICAgICAgc2VsZi4kc2VhcmNoLmJsdXIoKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICBzZWxmLiRzZWFyY2guZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBpZiAocGFyYW1zLnF1ZXJ5LnRlcm0gPT0gbnVsbCB8fCBwYXJhbXMucXVlcnkudGVybSA9PT0gJycpIHtcbiAgICAgICAgdmFyIHNob3dTZWFyY2ggPSBzZWxmLnNob3dTZWFyY2gocGFyYW1zKTtcblxuICAgICAgICBpZiAoc2hvd1NlYXJjaCkge1xuICAgICAgICAgIHNlbGYuJHNlYXJjaENvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1zZWFyY2gtLWhpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLiRzZWFyY2hDb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItc2VhcmNoLS1oaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmhhbmRsZVNlYXJjaCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoIXRoaXMuX2tleVVwUHJldmVudGVkKSB7XG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLiRzZWFyY2gudmFsKCk7XG5cbiAgICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7XG4gICAgICAgIHRlcm06IGlucHV0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9rZXlVcFByZXZlbnRlZCA9IGZhbHNlO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuc2hvd1NlYXJjaCA9IGZ1bmN0aW9uIChfLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICByZXR1cm4gU2VhcmNoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9oaWRlUGxhY2Vob2xkZXInLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBIaWRlUGxhY2Vob2xkZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMubm9ybWFsaXplUGxhY2Vob2xkZXIob3B0aW9ucy5nZXQoJ3BsYWNlaG9sZGVyJykpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKTtcbiAgfVxuXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIGRhdGEucmVzdWx0cyA9IHRoaXMucmVtb3ZlUGxhY2Vob2xkZXIoZGF0YS5yZXN1bHRzKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuICB9O1xuXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUubm9ybWFsaXplUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgcGxhY2Vob2xkZXIpIHtcbiAgICBpZiAodHlwZW9mIHBsYWNlaG9sZGVyID09PSAnc3RyaW5nJykge1xuICAgICAgcGxhY2Vob2xkZXIgPSB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgdGV4dDogcGxhY2Vob2xkZXJcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBsYWNlaG9sZGVyO1xuICB9O1xuXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUucmVtb3ZlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgZGF0YSkge1xuICAgIHZhciBtb2RpZmllZERhdGEgPSBkYXRhLnNsaWNlKDApO1xuXG4gICAgZm9yICh2YXIgZCA9IGRhdGEubGVuZ3RoIC0gMTsgZCA+PSAwOyBkLS0pIHtcbiAgICAgIHZhciBpdGVtID0gZGF0YVtkXTtcblxuICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIuaWQgPT09IGl0ZW0uaWQpIHtcbiAgICAgICAgbW9kaWZpZWREYXRhLnNwbGljZShkLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kaWZpZWREYXRhO1xuICB9O1xuXG4gIHJldHVybiBIaWRlUGxhY2Vob2xkZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2luZmluaXRlU2Nyb2xsJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBJbmZpbml0ZVNjcm9sbCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcbiAgICB0aGlzLmxhc3RQYXJhbXMgPSB7fTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XG5cbiAgICB0aGlzLiRsb2FkaW5nTW9yZSA9IHRoaXMuY3JlYXRlTG9hZGluZ01vcmUoKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgdGhpcy4kbG9hZGluZ01vcmUucmVtb3ZlKCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcblxuICAgIGlmICh0aGlzLnNob3dMb2FkaW5nTW9yZShkYXRhKSkge1xuICAgICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQodGhpcy4kbG9hZGluZ01vcmUpO1xuICAgIH1cbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5sYXN0UGFyYW1zID0gcGFyYW1zO1xuICAgICAgc2VsZi5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncXVlcnk6YXBwZW5kJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5sYXN0UGFyYW1zID0gcGFyYW1zO1xuICAgICAgc2VsZi5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHJlc3VsdHMub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpc0xvYWRNb3JlVmlzaWJsZSA9ICQuY29udGFpbnMoXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgc2VsZi4kbG9hZGluZ01vcmVbMF1cbiAgICAgICk7XG5cbiAgICAgIGlmIChzZWxmLmxvYWRpbmcgfHwgIWlzTG9hZE1vcmVWaXNpYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcCArXG4gICAgICAgIHNlbGYuJHJlc3VsdHMub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgdmFyIGxvYWRpbmdNb3JlT2Zmc2V0ID0gc2VsZi4kbG9hZGluZ01vcmUub2Zmc2V0KCkudG9wICtcbiAgICAgICAgc2VsZi4kbG9hZGluZ01vcmUub3V0ZXJIZWlnaHQoZmFsc2UpO1xuXG4gICAgICBpZiAoY3VycmVudE9mZnNldCArIDUwID49IGxvYWRpbmdNb3JlT2Zmc2V0KSB7XG4gICAgICAgIHNlbGYubG9hZE1vcmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUubG9hZE1vcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIHZhciBwYXJhbXMgPSAkLmV4dGVuZCh7fSwge3BhZ2U6IDF9LCB0aGlzLmxhc3RQYXJhbXMpO1xuXG4gICAgcGFyYW1zLnBhZ2UrKztcblxuICAgIHRoaXMudHJpZ2dlcigncXVlcnk6YXBwZW5kJywgcGFyYW1zKTtcbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuc2hvd0xvYWRpbmdNb3JlID0gZnVuY3Rpb24gKF8sIGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5wYWdpbmF0aW9uICYmIGRhdGEucGFnaW5hdGlvbi5tb3JlO1xuICB9O1xuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5jcmVhdGVMb2FkaW5nTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJG9wdGlvbiA9ICQoXG4gICAgICAnPGxpICcgK1xuICAgICAgJ2NsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb24gc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWxvYWQtbW9yZVwiJyArXG4gICAgICAncm9sZT1cInRyZWVpdGVtXCIgYXJpYS1kaXNhYmxlZD1cInRydWVcIj48L2xpPidcbiAgICApO1xuXG4gICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQoJ2xvYWRpbmdNb3JlJyk7XG5cbiAgICAkb3B0aW9uLmh0bWwobWVzc2FnZSh0aGlzLmxhc3RQYXJhbXMpKTtcblxuICAgIHJldHVybiAkb3B0aW9uO1xuICB9O1xuXG4gIHJldHVybiBJbmZpbml0ZVNjcm9sbDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vYXR0YWNoQm9keScsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIEF0dGFjaEJvZHkgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRkcm9wZG93blBhcmVudCA9IG9wdGlvbnMuZ2V0KCdkcm9wZG93blBhcmVudCcpIHx8ICQoZG9jdW1lbnQuYm9keSk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHNldHVwUmVzdWx0c0V2ZW50cyA9IGZhbHNlO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3Nob3dEcm9wZG93bigpO1xuICAgICAgc2VsZi5fYXR0YWNoUG9zaXRpb25pbmdIYW5kbGVyKGNvbnRhaW5lcik7XG5cbiAgICAgIGlmICghc2V0dXBSZXN1bHRzRXZlbnRzKSB7XG4gICAgICAgIHNldHVwUmVzdWx0c0V2ZW50cyA9IHRydWU7XG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFsbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XG4gICAgICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFwcGVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XG4gICAgICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5faGlkZURyb3Bkb3duKCk7XG4gICAgICBzZWxmLl9kZXRhY2hQb3NpdGlvbmluZ0hhbmRsZXIoY29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLnJlbW92ZSgpO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgJGRyb3Bkb3duLCAkY29udGFpbmVyKSB7XG4gICAgLy8gQ2xvbmUgYWxsIG9mIHRoZSBjb250YWluZXIgY2xhc3Nlc1xuICAgICRkcm9wZG93bi5hdHRyKCdjbGFzcycsICRjb250YWluZXIuYXR0cignY2xhc3MnKSk7XG5cbiAgICAkZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ3NlbGVjdDInKTtcbiAgICAkZHJvcGRvd24uYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG5cbiAgICAkZHJvcGRvd24uY3NzKHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAtOTk5OTk5XG4gICAgfSk7XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcblxuICAgIHZhciAkZHJvcGRvd24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZCgkZHJvcGRvd24pO1xuXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIgPSAkY29udGFpbmVyO1xuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX2hpZGVEcm9wZG93biA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5kZXRhY2goKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fYXR0YWNoUG9zaXRpb25pbmdIYW5kbGVyID1cbiAgICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBzY3JvbGxFdmVudCA9ICdzY3JvbGwuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciByZXNpemVFdmVudCA9ICdyZXNpemUuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciBvcmllbnRhdGlvbkV2ZW50ID0gJ29yaWVudGF0aW9uY2hhbmdlLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcblxuICAgIHZhciAkd2F0Y2hlcnMgPSB0aGlzLiRjb250YWluZXIucGFyZW50cygpLmZpbHRlcihVdGlscy5oYXNTY3JvbGwpO1xuICAgICR3YXRjaGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIFV0aWxzLlN0b3JlRGF0YSh0aGlzLCAnc2VsZWN0Mi1zY3JvbGwtcG9zaXRpb24nLCB7XG4gICAgICAgIHg6ICQodGhpcykuc2Nyb2xsTGVmdCgpLFxuICAgICAgICB5OiAkKHRoaXMpLnNjcm9sbFRvcCgpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgICR3YXRjaGVycy5vbihzY3JvbGxFdmVudCwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSBVdGlscy5HZXREYXRhKHRoaXMsICdzZWxlY3QyLXNjcm9sbC1wb3NpdGlvbicpO1xuICAgICAgJCh0aGlzKS5zY3JvbGxUb3AocG9zaXRpb24ueSk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oc2Nyb2xsRXZlbnQgKyAnICcgKyByZXNpemVFdmVudCArICcgJyArIG9yaWVudGF0aW9uRXZlbnQsXG4gICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5fcG9zaXRpb25Ecm9wZG93bigpO1xuICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcbiAgICB9KTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fZGV0YWNoUG9zaXRpb25pbmdIYW5kbGVyID1cbiAgICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lcikge1xuICAgIHZhciBzY3JvbGxFdmVudCA9ICdzY3JvbGwuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciByZXNpemVFdmVudCA9ICdyZXNpemUuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciBvcmllbnRhdGlvbkV2ZW50ID0gJ29yaWVudGF0aW9uY2hhbmdlLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcblxuICAgIHZhciAkd2F0Y2hlcnMgPSB0aGlzLiRjb250YWluZXIucGFyZW50cygpLmZpbHRlcihVdGlscy5oYXNTY3JvbGwpO1xuICAgICR3YXRjaGVycy5vZmYoc2Nyb2xsRXZlbnQpO1xuXG4gICAgJCh3aW5kb3cpLm9mZihzY3JvbGxFdmVudCArICcgJyArIHJlc2l6ZUV2ZW50ICsgJyAnICsgb3JpZW50YXRpb25FdmVudCk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX3Bvc2l0aW9uRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgaXNDdXJyZW50bHlBYm92ZSA9IHRoaXMuJGRyb3Bkb3duLmhhc0NsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS1hYm92ZScpO1xuICAgIHZhciBpc0N1cnJlbnRseUJlbG93ID0gdGhpcy4kZHJvcGRvd24uaGFzQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWJlbG93Jyk7XG5cbiAgICB2YXIgbmV3RGlyZWN0aW9uID0gbnVsbDtcblxuICAgIHZhciBvZmZzZXQgPSB0aGlzLiRjb250YWluZXIub2Zmc2V0KCk7XG5cbiAgICBvZmZzZXQuYm90dG9tID0gb2Zmc2V0LnRvcCArIHRoaXMuJGNvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSk7XG5cbiAgICB2YXIgY29udGFpbmVyID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLiRjb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpXG4gICAgfTtcblxuICAgIGNvbnRhaW5lci50b3AgPSBvZmZzZXQudG9wO1xuICAgIGNvbnRhaW5lci5ib3R0b20gPSBvZmZzZXQudG9wICsgY29udGFpbmVyLmhlaWdodDtcblxuICAgIHZhciBkcm9wZG93biA9IHtcbiAgICAgIGhlaWdodDogdGhpcy4kZHJvcGRvd24ub3V0ZXJIZWlnaHQoZmFsc2UpXG4gICAgfTtcblxuICAgIHZhciB2aWV3cG9ydCA9IHtcbiAgICAgIHRvcDogJHdpbmRvdy5zY3JvbGxUb3AoKSxcbiAgICAgIGJvdHRvbTogJHdpbmRvdy5zY3JvbGxUb3AoKSArICR3aW5kb3cuaGVpZ2h0KClcbiAgICB9O1xuXG4gICAgdmFyIGVub3VnaFJvb21BYm92ZSA9IHZpZXdwb3J0LnRvcCA8IChvZmZzZXQudG9wIC0gZHJvcGRvd24uaGVpZ2h0KTtcbiAgICB2YXIgZW5vdWdoUm9vbUJlbG93ID0gdmlld3BvcnQuYm90dG9tID4gKG9mZnNldC5ib3R0b20gKyBkcm9wZG93bi5oZWlnaHQpO1xuXG4gICAgdmFyIGNzcyA9IHtcbiAgICAgIGxlZnQ6IG9mZnNldC5sZWZ0LFxuICAgICAgdG9wOiBjb250YWluZXIuYm90dG9tXG4gICAgfTtcblxuICAgIC8vIERldGVybWluZSB3aGF0IHRoZSBwYXJlbnQgZWxlbWVudCBpcyB0byB1c2UgZm9yIGNhbGN1bGF0aW5nIHRoZSBvZmZzZXRcbiAgICB2YXIgJG9mZnNldFBhcmVudCA9IHRoaXMuJGRyb3Bkb3duUGFyZW50O1xuXG4gICAgLy8gRm9yIHN0YXRpY2FsbHkgcG9zaXRpb25lZCBlbGVtZW50cywgd2UgbmVlZCB0byBnZXQgdGhlIGVsZW1lbnRcbiAgICAvLyB0aGF0IGlzIGRldGVybWluaW5nIHRoZSBvZmZzZXRcbiAgICBpZiAoJG9mZnNldFBhcmVudC5jc3MoJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnKSB7XG4gICAgICAkb2Zmc2V0UGFyZW50ID0gJG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQoKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50T2Zmc2V0ID0gJG9mZnNldFBhcmVudC5vZmZzZXQoKTtcblxuICAgIGNzcy50b3AgLT0gcGFyZW50T2Zmc2V0LnRvcDtcbiAgICBjc3MubGVmdCAtPSBwYXJlbnRPZmZzZXQubGVmdDtcblxuICAgIGlmICghaXNDdXJyZW50bHlBYm92ZSAmJiAhaXNDdXJyZW50bHlCZWxvdykge1xuICAgICAgbmV3RGlyZWN0aW9uID0gJ2JlbG93JztcbiAgICB9XG5cbiAgICBpZiAoIWVub3VnaFJvb21CZWxvdyAmJiBlbm91Z2hSb29tQWJvdmUgJiYgIWlzQ3VycmVudGx5QWJvdmUpIHtcbiAgICAgIG5ld0RpcmVjdGlvbiA9ICdhYm92ZSc7XG4gICAgfSBlbHNlIGlmICghZW5vdWdoUm9vbUFib3ZlICYmIGVub3VnaFJvb21CZWxvdyAmJiBpc0N1cnJlbnRseUFib3ZlKSB7XG4gICAgICBuZXdEaXJlY3Rpb24gPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmIChuZXdEaXJlY3Rpb24gPT0gJ2Fib3ZlJyB8fFxuICAgICAgKGlzQ3VycmVudGx5QWJvdmUgJiYgbmV3RGlyZWN0aW9uICE9PSAnYmVsb3cnKSkge1xuICAgICAgY3NzLnRvcCA9IGNvbnRhaW5lci50b3AgLSBwYXJlbnRPZmZzZXQudG9wIC0gZHJvcGRvd24uaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChuZXdEaXJlY3Rpb24gIT0gbnVsbCkge1xuICAgICAgdGhpcy4kZHJvcGRvd25cbiAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS1iZWxvdyBzZWxlY3QyLWRyb3Bkb3duLS1hYm92ZScpXG4gICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tJyArIG5ld0RpcmVjdGlvbik7XG4gICAgICB0aGlzLiRjb250YWluZXJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tYmVsb3cgc2VsZWN0Mi1jb250YWluZXItLWFib3ZlJylcbiAgICAgICAgLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tJyArIG5ld0RpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIuY3NzKGNzcyk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX3Jlc2l6ZURyb3Bkb3duID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjc3MgPSB7XG4gICAgICB3aWR0aDogdGhpcy4kY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpICsgJ3B4J1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZHJvcGRvd25BdXRvV2lkdGgnKSkge1xuICAgICAgY3NzLm1pbldpZHRoID0gY3NzLndpZHRoO1xuICAgICAgY3NzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgIGNzcy53aWR0aCA9ICdhdXRvJztcbiAgICB9XG5cbiAgICB0aGlzLiRkcm9wZG93bi5jc3MoY3NzKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fc2hvd0Ryb3Bkb3duID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLmFwcGVuZFRvKHRoaXMuJGRyb3Bkb3duUGFyZW50KTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uRHJvcGRvd24oKTtcbiAgICB0aGlzLl9yZXNpemVEcm9wZG93bigpO1xuICB9O1xuXG4gIHJldHVybiBBdHRhY2hCb2R5O1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCcsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGNvdW50UmVzdWx0cyAoZGF0YSkge1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBpdGVtID0gZGF0YVtkXTtcblxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgY291bnQgKz0gY291bnRSZXN1bHRzKGl0ZW0uY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBmdW5jdGlvbiBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcbiAgICB0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gb3B0aW9ucy5nZXQoJ21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyk7XG5cbiAgICBpZiAodGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA8IDApIHtcbiAgICAgIHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xuICB9XG5cbiAgTWluaW11bVJlc3VsdHNGb3JTZWFyY2gucHJvdG90eXBlLnNob3dTZWFyY2ggPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMpIHtcbiAgICBpZiAoY291bnRSZXN1bHRzKHBhcmFtcy5kYXRhLnJlc3VsdHMpIDwgdGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMpO1xuICB9O1xuXG4gIHJldHVybiBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vc2VsZWN0T25DbG9zZScsW1xuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoVXRpbHMpIHtcbiAgZnVuY3Rpb24gU2VsZWN0T25DbG9zZSAoKSB7IH1cblxuICBTZWxlY3RPbkNsb3NlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLl9oYW5kbGVTZWxlY3RPbkNsb3NlKHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0T25DbG9zZS5wcm90b3R5cGUuX2hhbmRsZVNlbGVjdE9uQ2xvc2UgPSBmdW5jdGlvbiAoXywgcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMub3JpZ2luYWxTZWxlY3QyRXZlbnQgIT0gbnVsbCkge1xuICAgICAgdmFyIGV2ZW50ID0gcGFyYW1zLm9yaWdpbmFsU2VsZWN0MkV2ZW50O1xuXG4gICAgICAvLyBEb24ndCBzZWxlY3QgYW4gaXRlbSBpZiB0aGUgY2xvc2UgZXZlbnQgd2FzIHRyaWdnZXJlZCBmcm9tIGEgc2VsZWN0IG9yXG4gICAgICAvLyB1bnNlbGVjdCBldmVudFxuICAgICAgaWYgKGV2ZW50Ll90eXBlID09PSAnc2VsZWN0JyB8fCBldmVudC5fdHlwZSA9PT0gJ3Vuc2VsZWN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICRoaWdobGlnaHRlZFJlc3VsdHMgPSB0aGlzLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgLy8gT25seSBzZWxlY3QgaGlnaGxpZ2h0ZWQgcmVzdWx0c1xuICAgIGlmICgkaGlnaGxpZ2h0ZWRSZXN1bHRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IFV0aWxzLkdldERhdGEoJGhpZ2hsaWdodGVkUmVzdWx0c1swXSwgJ2RhdGEnKTtcblxuICAgIC8vIERvbid0IHJlLXNlbGVjdCBhbHJlYWR5IHNlbGVjdGVkIHJlc3VsdGVcbiAgICBpZiAoXG4gICAgICAoZGF0YS5lbGVtZW50ICE9IG51bGwgJiYgZGF0YS5lbGVtZW50LnNlbGVjdGVkKSB8fFxuICAgICAgKGRhdGEuZWxlbWVudCA9PSBudWxsICYmIGRhdGEuc2VsZWN0ZWQpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU2VsZWN0T25DbG9zZTtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vY2xvc2VPblNlbGVjdCcsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENsb3NlT25TZWxlY3QgKCkgeyB9XG5cbiAgQ2xvc2VPblNlbGVjdC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX3NlbGVjdFRyaWdnZXJlZChldnQpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCd1bnNlbGVjdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX3NlbGVjdFRyaWdnZXJlZChldnQpO1xuICAgIH0pO1xuICB9O1xuXG4gIENsb3NlT25TZWxlY3QucHJvdG90eXBlLl9zZWxlY3RUcmlnZ2VyZWQgPSBmdW5jdGlvbiAoXywgZXZ0KSB7XG4gICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBldnQub3JpZ2luYWxFdmVudDtcblxuICAgIC8vIERvbid0IGNsb3NlIGlmIHRoZSBjb250cm9sIGtleSBpcyBiZWluZyBoZWxkXG4gICAgaWYgKG9yaWdpbmFsRXZlbnQgJiYgKG9yaWdpbmFsRXZlbnQuY3RybEtleSB8fCBvcmlnaW5hbEV2ZW50Lm1ldGFLZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdjbG9zZScsIHtcbiAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXG4gICAgICBvcmlnaW5hbFNlbGVjdDJFdmVudDogZXZ0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIENsb3NlT25TZWxlY3Q7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2kxOG4vZW4nLFtdLGZ1bmN0aW9uICgpIHtcbiAgLy8gRW5nbGlzaFxuICByZXR1cm4ge1xuICAgIGVycm9yTG9hZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdUaGUgcmVzdWx0cyBjb3VsZCBub3QgYmUgbG9hZGVkLic7XG4gICAgfSxcbiAgICBpbnB1dFRvb0xvbmc6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgb3ZlckNoYXJzID0gYXJncy5pbnB1dC5sZW5ndGggLSBhcmdzLm1heGltdW07XG5cbiAgICAgIHZhciBtZXNzYWdlID0gJ1BsZWFzZSBkZWxldGUgJyArIG92ZXJDaGFycyArICcgY2hhcmFjdGVyJztcblxuICAgICAgaWYgKG92ZXJDaGFycyAhPSAxKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gJ3MnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9LFxuICAgIGlucHV0VG9vU2hvcnQ6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgcmVtYWluaW5nQ2hhcnMgPSBhcmdzLm1pbmltdW0gLSBhcmdzLmlucHV0Lmxlbmd0aDtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSAnUGxlYXNlIGVudGVyICcgKyByZW1haW5pbmdDaGFycyArICcgb3IgbW9yZSBjaGFyYWN0ZXJzJztcblxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSxcbiAgICBsb2FkaW5nTW9yZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdMb2FkaW5nIG1vcmUgcmVzdWx0c+KApic7XG4gICAgfSxcbiAgICBtYXhpbXVtU2VsZWN0ZWQ6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdZb3UgY2FuIG9ubHkgc2VsZWN0ICcgKyBhcmdzLm1heGltdW0gKyAnIGl0ZW0nO1xuXG4gICAgICBpZiAoYXJncy5tYXhpbXVtICE9IDEpIHtcbiAgICAgICAgbWVzc2FnZSArPSAncyc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH0sXG4gICAgbm9SZXN1bHRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ05vIHJlc3VsdHMgZm91bmQnO1xuICAgIH0sXG4gICAgc2VhcmNoaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ1NlYXJjaGluZ+KApic7XG4gICAgfSxcbiAgICByZW1vdmVBbGxJdGVtczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdSZW1vdmUgYWxsIGl0ZW1zJztcbiAgICB9XG4gIH07XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RlZmF1bHRzJyxbXG4gICdqcXVlcnknLFxuICAncmVxdWlyZScsXG5cbiAgJy4vcmVzdWx0cycsXG5cbiAgJy4vc2VsZWN0aW9uL3NpbmdsZScsXG4gICcuL3NlbGVjdGlvbi9tdWx0aXBsZScsXG4gICcuL3NlbGVjdGlvbi9wbGFjZWhvbGRlcicsXG4gICcuL3NlbGVjdGlvbi9hbGxvd0NsZWFyJyxcbiAgJy4vc2VsZWN0aW9uL3NlYXJjaCcsXG4gICcuL3NlbGVjdGlvbi9ldmVudFJlbGF5JyxcblxuICAnLi91dGlscycsXG4gICcuL3RyYW5zbGF0aW9uJyxcbiAgJy4vZGlhY3JpdGljcycsXG5cbiAgJy4vZGF0YS9zZWxlY3QnLFxuICAnLi9kYXRhL2FycmF5JyxcbiAgJy4vZGF0YS9hamF4JyxcbiAgJy4vZGF0YS90YWdzJyxcbiAgJy4vZGF0YS90b2tlbml6ZXInLFxuICAnLi9kYXRhL21pbmltdW1JbnB1dExlbmd0aCcsXG4gICcuL2RhdGEvbWF4aW11bUlucHV0TGVuZ3RoJyxcbiAgJy4vZGF0YS9tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoJyxcblxuICAnLi9kcm9wZG93bicsXG4gICcuL2Ryb3Bkb3duL3NlYXJjaCcsXG4gICcuL2Ryb3Bkb3duL2hpZGVQbGFjZWhvbGRlcicsXG4gICcuL2Ryb3Bkb3duL2luZmluaXRlU2Nyb2xsJyxcbiAgJy4vZHJvcGRvd24vYXR0YWNoQm9keScsXG4gICcuL2Ryb3Bkb3duL21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyxcbiAgJy4vZHJvcGRvd24vc2VsZWN0T25DbG9zZScsXG4gICcuL2Ryb3Bkb3duL2Nsb3NlT25TZWxlY3QnLFxuXG4gICcuL2kxOG4vZW4nXG5dLCBmdW5jdGlvbiAoJCwgcmVxdWlyZSxcblxuICAgICAgICAgICAgIFJlc3VsdHNMaXN0LFxuXG4gICAgICAgICAgICAgU2luZ2xlU2VsZWN0aW9uLCBNdWx0aXBsZVNlbGVjdGlvbiwgUGxhY2Vob2xkZXIsIEFsbG93Q2xlYXIsXG4gICAgICAgICAgICAgU2VsZWN0aW9uU2VhcmNoLCBFdmVudFJlbGF5LFxuXG4gICAgICAgICAgICAgVXRpbHMsIFRyYW5zbGF0aW9uLCBESUFDUklUSUNTLFxuXG4gICAgICAgICAgICAgU2VsZWN0RGF0YSwgQXJyYXlEYXRhLCBBamF4RGF0YSwgVGFncywgVG9rZW5pemVyLFxuICAgICAgICAgICAgIE1pbmltdW1JbnB1dExlbmd0aCwgTWF4aW11bUlucHV0TGVuZ3RoLCBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoLFxuXG4gICAgICAgICAgICAgRHJvcGRvd24sIERyb3Bkb3duU2VhcmNoLCBIaWRlUGxhY2Vob2xkZXIsIEluZmluaXRlU2Nyb2xsLFxuICAgICAgICAgICAgIEF0dGFjaEJvZHksIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLCBTZWxlY3RPbkNsb3NlLCBDbG9zZU9uU2VsZWN0LFxuXG4gICAgICAgICAgICAgRW5nbGlzaFRyYW5zbGF0aW9uKSB7XG4gIGZ1bmN0aW9uIERlZmF1bHRzICgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBEZWZhdWx0cy5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhQWRhcHRlciA9PSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5hamF4ICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IEFqYXhEYXRhO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmRhdGEgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gQXJyYXlEYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFNlbGVjdERhdGE7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1pbmltdW1JbnB1dExlbmd0aCA+IDApIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgTWluaW11bUlucHV0TGVuZ3RoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1heGltdW1JbnB1dExlbmd0aCA+IDApIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgTWF4aW11bUlucHV0TGVuZ3RoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPiAwKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIE1heGltdW1TZWxlY3Rpb25MZW5ndGhcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMudGFncykge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUob3B0aW9ucy5kYXRhQWRhcHRlciwgVGFncyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnRva2VuU2VwYXJhdG9ycyAhPSBudWxsIHx8IG9wdGlvbnMudG9rZW5pemVyICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgVG9rZW5pemVyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnF1ZXJ5ICE9IG51bGwpIHtcbiAgICAgICAgdmFyIFF1ZXJ5ID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L3F1ZXJ5Jyk7XG5cbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgUXVlcnlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuaW5pdFNlbGVjdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHZhciBJbml0U2VsZWN0aW9uID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2luaXRTZWxlY3Rpb24nKTtcblxuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBJbml0U2VsZWN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFJlc3VsdHNMaXN0O1xuXG4gICAgICBpZiAob3B0aW9ucy5hamF4ICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIsXG4gICAgICAgICAgSW5maW5pdGVTY3JvbGxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMucGxhY2Vob2xkZXIgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlcixcbiAgICAgICAgICBIaWRlUGxhY2Vob2xkZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0T25DbG9zZSkge1xuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlcixcbiAgICAgICAgICBTZWxlY3RPbkNsb3NlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID09IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gRHJvcGRvd247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgU2VhcmNoYWJsZURyb3Bkb3duID0gVXRpbHMuRGVjb3JhdGUoRHJvcGRvd24sIERyb3Bkb3duU2VhcmNoKTtcblxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFNlYXJjaGFibGVEcm9wZG93bjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggIT09IDApIHtcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgICBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXG4gICAgICAgICAgQ2xvc2VPblNlbGVjdFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25Dc3NDbGFzcyAhPSBudWxsIHx8XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25Dc3MgIT0gbnVsbCB8fFxuICAgICAgICBvcHRpb25zLmFkYXB0RHJvcGRvd25Dc3NDbGFzcyAhPSBudWxsXG4gICAgICApIHtcbiAgICAgICAgdmFyIERyb3Bkb3duQ1NTID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2Ryb3Bkb3duQ3NzJyk7XG5cbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgICBEcm9wZG93bkNTU1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgQXR0YWNoQm9keVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID09IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IE11bHRpcGxlU2VsZWN0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gU2luZ2xlU2VsZWN0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIHBsYWNlaG9sZGVyIG1peGluIGlmIGEgcGxhY2Vob2xkZXIgd2FzIHNwZWNpZmllZFxuICAgICAgaWYgKG9wdGlvbnMucGxhY2Vob2xkZXIgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgUGxhY2Vob2xkZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuYWxsb3dDbGVhcikge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgQWxsb3dDbGVhclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgU2VsZWN0aW9uU2VhcmNoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgb3B0aW9ucy5jb250YWluZXJDc3NDbGFzcyAhPSBudWxsIHx8XG4gICAgICAgIG9wdGlvbnMuY29udGFpbmVyQ3NzICE9IG51bGwgfHxcbiAgICAgICAgb3B0aW9ucy5hZGFwdENvbnRhaW5lckNzc0NsYXNzICE9IG51bGxcbiAgICAgICkge1xuICAgICAgICB2YXIgQ29udGFpbmVyQ1NTID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2NvbnRhaW5lckNzcycpO1xuXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgICBDb250YWluZXJDU1NcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgRXZlbnRSZWxheVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMubGFuZ3VhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgbGFuZ3VhZ2UgaXMgc3BlY2lmaWVkIHdpdGggYSByZWdpb25cbiAgICAgIGlmIChvcHRpb25zLmxhbmd1YWdlLmluZGV4T2YoJy0nKSA+IDApIHtcbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgcmVnaW9uIGluZm9ybWF0aW9uIGlmIGl0IGlzIGluY2x1ZGVkXG4gICAgICAgIHZhciBsYW5ndWFnZVBhcnRzID0gb3B0aW9ucy5sYW5ndWFnZS5zcGxpdCgnLScpO1xuICAgICAgICB2YXIgYmFzZUxhbmd1YWdlID0gbGFuZ3VhZ2VQYXJ0c1swXTtcblxuICAgICAgICBvcHRpb25zLmxhbmd1YWdlID0gW29wdGlvbnMubGFuZ3VhZ2UsIGJhc2VMYW5ndWFnZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmxhbmd1YWdlID0gW29wdGlvbnMubGFuZ3VhZ2VdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgkLmlzQXJyYXkob3B0aW9ucy5sYW5ndWFnZSkpIHtcbiAgICAgIHZhciBsYW5ndWFnZXMgPSBuZXcgVHJhbnNsYXRpb24oKTtcbiAgICAgIG9wdGlvbnMubGFuZ3VhZ2UucHVzaCgnZW4nKTtcblxuICAgICAgdmFyIGxhbmd1YWdlTmFtZXMgPSBvcHRpb25zLmxhbmd1YWdlO1xuXG4gICAgICBmb3IgKHZhciBsID0gMDsgbCA8IGxhbmd1YWdlTmFtZXMubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgdmFyIG5hbWUgPSBsYW5ndWFnZU5hbWVzW2xdO1xuICAgICAgICB2YXIgbGFuZ3VhZ2UgPSB7fTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRyeSB0byBsb2FkIGl0IHdpdGggdGhlIG9yaWdpbmFsIG5hbWVcbiAgICAgICAgICBsYW5ndWFnZSA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKG5hbWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGxvYWQgaXQsIGNoZWNrIGlmIGl0IHdhc24ndCB0aGUgZnVsbCBwYXRoXG4gICAgICAgICAgICBuYW1lID0gdGhpcy5kZWZhdWx0cy5hbWRMYW5ndWFnZUJhc2UgKyBuYW1lO1xuICAgICAgICAgICAgbGFuZ3VhZ2UgPSBUcmFuc2xhdGlvbi5sb2FkUGF0aChuYW1lKTtcbiAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgLy8gVGhlIHRyYW5zbGF0aW9uIGNvdWxkIG5vdCBiZSBsb2FkZWQgYXQgYWxsLiBTb21ldGltZXMgdGhpcyBpc1xuICAgICAgICAgICAgLy8gYmVjYXVzZSBvZiBhIGNvbmZpZ3VyYXRpb24gcHJvYmxlbSwgb3RoZXIgdGltZXMgdGhpcyBjYW4gYmVcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugb2YgaG93IFNlbGVjdDIgaGVscHMgbG9hZCBhbGwgcG9zc2libGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICdTZWxlY3QyOiBUaGUgbGFuZ3VhZ2UgZmlsZSBmb3IgXCInICsgbmFtZSArICdcIiBjb3VsZCBub3QgYmUgJyArXG4gICAgICAgICAgICAgICAgJ2F1dG9tYXRpY2FsbHkgbG9hZGVkLiBBIGZhbGxiYWNrIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLidcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGFuZ3VhZ2VzLmV4dGVuZChsYW5ndWFnZSk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMudHJhbnNsYXRpb25zID0gbGFuZ3VhZ2VzO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYmFzZVRyYW5zbGF0aW9uID0gVHJhbnNsYXRpb24ubG9hZFBhdGgoXG4gICAgICAgIHRoaXMuZGVmYXVsdHMuYW1kTGFuZ3VhZ2VCYXNlICsgJ2VuJ1xuICAgICAgKTtcbiAgICAgIHZhciBjdXN0b21UcmFuc2xhdGlvbiA9IG5ldyBUcmFuc2xhdGlvbihvcHRpb25zLmxhbmd1YWdlKTtcblxuICAgICAgY3VzdG9tVHJhbnNsYXRpb24uZXh0ZW5kKGJhc2VUcmFuc2xhdGlvbik7XG5cbiAgICAgIG9wdGlvbnMudHJhbnNsYXRpb25zID0gY3VzdG9tVHJhbnNsYXRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH07XG5cbiAgRGVmYXVsdHMucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIHN0cmlwRGlhY3JpdGljcyAodGV4dCkge1xuICAgICAgLy8gVXNlZCAndW5pIHJhbmdlICsgbmFtZWQgZnVuY3Rpb24nIGZyb20gaHR0cDovL2pzcGVyZi5jb20vZGlhY3JpdGljcy8xOFxuICAgICAgZnVuY3Rpb24gbWF0Y2goYSkge1xuICAgICAgICByZXR1cm4gRElBQ1JJVElDU1thXSB8fCBhO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bXlxcdTAwMDAtXFx1MDA3RV0vZywgbWF0Y2gpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hdGNoZXIgKHBhcmFtcywgZGF0YSkge1xuICAgICAgLy8gQWx3YXlzIHJldHVybiB0aGUgb2JqZWN0IGlmIHRoZXJlIGlzIG5vdGhpbmcgdG8gY29tcGFyZVxuICAgICAgaWYgKCQudHJpbShwYXJhbXMudGVybSkgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfVxuXG4gICAgICAvLyBEbyBhIHJlY3Vyc2l2ZSBjaGVjayBmb3Igb3B0aW9ucyB3aXRoIGNoaWxkcmVuXG4gICAgICBpZiAoZGF0YS5jaGlsZHJlbiAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gQ2xvbmUgdGhlIGRhdGEgb2JqZWN0IGlmIHRoZXJlIGFyZSBjaGlsZHJlblxuICAgICAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGFzIHdlIG1vZGlmeSB0aGUgb2JqZWN0IHRvIHJlbW92ZSBhbnkgbm9uLW1hdGNoZXNcbiAgICAgICAgdmFyIG1hdGNoID0gJC5leHRlbmQodHJ1ZSwge30sIGRhdGEpO1xuXG4gICAgICAgIC8vIENoZWNrIGVhY2ggY2hpbGQgb2YgdGhlIG9wdGlvblxuICAgICAgICBmb3IgKHZhciBjID0gZGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxOyBjID49IDA7IGMtLSkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IGRhdGEuY2hpbGRyZW5bY107XG5cbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IG1hdGNoZXIocGFyYW1zLCBjaGlsZCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGVyZSB3YXNuJ3QgYSBtYXRjaCwgcmVtb3ZlIHRoZSBvYmplY3QgaW4gdGhlIGFycmF5XG4gICAgICAgICAgaWYgKG1hdGNoZXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgbWF0Y2guY2hpbGRyZW4uc3BsaWNlKGMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGFueSBjaGlsZHJlbiBtYXRjaGVkLCByZXR1cm4gdGhlIG5ldyBvYmplY3RcbiAgICAgICAgaWYgKG1hdGNoLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIG1hdGNoaW5nIGNoaWxkcmVuLCBjaGVjayBqdXN0IHRoZSBwbGFpbiBvYmplY3RcbiAgICAgICAgcmV0dXJuIG1hdGNoZXIocGFyYW1zLCBtYXRjaCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcmlnaW5hbCA9IHN0cmlwRGlhY3JpdGljcyhkYXRhLnRleHQpLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgdGVybSA9IHN0cmlwRGlhY3JpdGljcyhwYXJhbXMudGVybSkudG9VcHBlckNhc2UoKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHRleHQgY29udGFpbnMgdGhlIHRlcm1cbiAgICAgIGlmIChvcmlnaW5hbC5pbmRleE9mKHRlcm0pID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0IGRvZXNuJ3QgY29udGFpbiB0aGUgdGVybSwgZG9uJ3QgcmV0dXJuIGFueXRoaW5nXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgYW1kQmFzZTogJy4vJyxcbiAgICAgIGFtZExhbmd1YWdlQmFzZTogJy4vaTE4bi8nLFxuICAgICAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgIGRyb3Bkb3duQXV0b1dpZHRoOiBmYWxzZSxcbiAgICAgIGVzY2FwZU1hcmt1cDogVXRpbHMuZXNjYXBlTWFya3VwLFxuICAgICAgbGFuZ3VhZ2U6IEVuZ2xpc2hUcmFuc2xhdGlvbixcbiAgICAgIG1hdGNoZXI6IG1hdGNoZXIsXG4gICAgICBtaW5pbXVtSW5wdXRMZW5ndGg6IDAsXG4gICAgICBtYXhpbXVtSW5wdXRMZW5ndGg6IDAsXG4gICAgICBtYXhpbXVtU2VsZWN0aW9uTGVuZ3RoOiAwLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IDAsXG4gICAgICBzZWxlY3RPbkNsb3NlOiBmYWxzZSxcbiAgICAgIHNjcm9sbEFmdGVyU2VsZWN0OiBmYWxzZSxcbiAgICAgIHNvcnRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVSZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC50ZXh0O1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlU2VsZWN0aW9uOiBmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rpb24udGV4dDtcbiAgICAgIH0sXG4gICAgICB0aGVtZTogJ2RlZmF1bHQnLFxuICAgICAgd2lkdGg6ICdyZXNvbHZlJ1xuICAgIH07XG4gIH07XG5cbiAgRGVmYXVsdHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdmFyIGNhbWVsS2V5ID0gJC5jYW1lbENhc2Uoa2V5KTtcblxuICAgIHZhciBkYXRhID0ge307XG4gICAgZGF0YVtjYW1lbEtleV0gPSB2YWx1ZTtcblxuICAgIHZhciBjb252ZXJ0ZWREYXRhID0gVXRpbHMuX2NvbnZlcnREYXRhKGRhdGEpO1xuXG4gICAgJC5leHRlbmQodHJ1ZSwgdGhpcy5kZWZhdWx0cywgY29udmVydGVkRGF0YSk7XG4gIH07XG5cbiAgdmFyIGRlZmF1bHRzID0gbmV3IERlZmF1bHRzKCk7XG5cbiAgcmV0dXJuIGRlZmF1bHRzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9vcHRpb25zJyxbXG4gICdyZXF1aXJlJyxcbiAgJ2pxdWVyeScsXG4gICcuL2RlZmF1bHRzJyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAocmVxdWlyZSwgJCwgRGVmYXVsdHMsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIE9wdGlvbnMgKG9wdGlvbnMsICRlbGVtZW50KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmICgkZWxlbWVudCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZyb21FbGVtZW50KCRlbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBEZWZhdWx0cy5hcHBseSh0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYgKCRlbGVtZW50ICYmICRlbGVtZW50LmlzKCdpbnB1dCcpKSB7XG4gICAgICB2YXIgSW5wdXRDb21wYXQgPSByZXF1aXJlKHRoaXMuZ2V0KCdhbWRCYXNlJykgKyAnY29tcGF0L2lucHV0RGF0YScpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgdGhpcy5vcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICBJbnB1dENvbXBhdFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBPcHRpb25zLnByb3RvdHlwZS5mcm9tRWxlbWVudCA9IGZ1bmN0aW9uICgkZSkge1xuICAgIHZhciBleGNsdWRlZERhdGEgPSBbJ3NlbGVjdDInXTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMubXVsdGlwbGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5vcHRpb25zLm11bHRpcGxlID0gJGUucHJvcCgnbXVsdGlwbGUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVkID09IG51bGwpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9ICRlLnByb3AoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBudWxsKSB7XG4gICAgICBpZiAoJGUucHJvcCgnbGFuZycpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9ICRlLnByb3AoJ2xhbmcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBlbHNlIGlmICgkZS5jbG9zZXN0KCdbbGFuZ10nKS5wcm9wKCdsYW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID0gJGUuY2xvc2VzdCgnW2xhbmddJykucHJvcCgnbGFuZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlyID09IG51bGwpIHtcbiAgICAgIGlmICgkZS5wcm9wKCdkaXInKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGlyID0gJGUucHJvcCgnZGlyJyk7XG4gICAgICB9IGVsc2UgaWYgKCRlLmNsb3Nlc3QoJ1tkaXJdJykucHJvcCgnZGlyJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRpciA9ICRlLmNsb3Nlc3QoJ1tkaXJdJykucHJvcCgnZGlyJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGlyID0gJ2x0cic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJGUucHJvcCgnZGlzYWJsZWQnLCB0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICRlLnByb3AoJ211bHRpcGxlJywgdGhpcy5vcHRpb25zLm11bHRpcGxlKTtcblxuICAgIGlmIChVdGlscy5HZXREYXRhKCRlWzBdLCAnc2VsZWN0MlRhZ3MnKSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGRhdGEtc2VsZWN0Mi10YWdzYCBhdHRyaWJ1dGUgaGFzIGJlZW4gY2hhbmdlZCB0byAnICtcbiAgICAgICAgICAndXNlIHRoZSBgZGF0YS1kYXRhYCBhbmQgYGRhdGEtdGFncz1cInRydWVcImAgYXR0cmlidXRlcyBhbmQgd2lsbCBiZSAnICtcbiAgICAgICAgICAncmVtb3ZlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgU2VsZWN0Mi4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIFV0aWxzLlN0b3JlRGF0YSgkZVswXSwgJ2RhdGEnLCBVdGlscy5HZXREYXRhKCRlWzBdLCAnc2VsZWN0MlRhZ3MnKSk7XG4gICAgICBVdGlscy5TdG9yZURhdGEoJGVbMF0sICd0YWdzJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKFV0aWxzLkdldERhdGEoJGVbMF0sICdhamF4VXJsJykpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnU2VsZWN0MjogVGhlIGBkYXRhLWFqYXgtdXJsYCBhdHRyaWJ1dGUgaGFzIGJlZW4gY2hhbmdlZCB0byAnICtcbiAgICAgICAgICAnYGRhdGEtYWpheC0tdXJsYCBhbmQgc3VwcG9ydCBmb3IgdGhlIG9sZCBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkJyArXG4gICAgICAgICAgJyBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgU2VsZWN0Mi4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgICRlLmF0dHIoJ2FqYXgtLXVybCcsIFV0aWxzLkdldERhdGEoJGVbMF0sICdhamF4VXJsJykpO1xuICAgICAgVXRpbHMuU3RvcmVEYXRhKCRlWzBdLCAnYWpheC1VcmwnLCBVdGlscy5HZXREYXRhKCRlWzBdLCAnYWpheFVybCcpKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YXNldCA9IHt9O1xuXG4gICAgZnVuY3Rpb24gdXBwZXJDYXNlTGV0dGVyKF8sIGxldHRlcikge1xuICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIFByZS1sb2FkIGFsbCBvZiB0aGUgYXR0cmlidXRlcyB3aGljaCBhcmUgcHJlZml4ZWQgd2l0aCBgZGF0YS1gXG4gICAgZm9yICh2YXIgYXR0ciA9IDA7IGF0dHIgPCAkZVswXS5hdHRyaWJ1dGVzLmxlbmd0aDsgYXR0cisrKSB7XG4gICAgICB2YXIgYXR0cmlidXRlTmFtZSA9ICRlWzBdLmF0dHJpYnV0ZXNbYXR0cl0ubmFtZTtcbiAgICAgIHZhciBwcmVmaXggPSAnZGF0YS0nO1xuXG4gICAgICBpZiAoYXR0cmlidXRlTmFtZS5zdWJzdHIoMCwgcHJlZml4Lmxlbmd0aCkgPT0gcHJlZml4KSB7XG4gICAgICAgIC8vIEdldCB0aGUgY29udGVudHMgb2YgdGhlIGF0dHJpYnV0ZSBhZnRlciBgZGF0YS1gXG4gICAgICAgIHZhciBkYXRhTmFtZSA9IGF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKHByZWZpeC5sZW5ndGgpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgZGF0YSBjb250ZW50cyBmcm9tIHRoZSBjb25zaXN0ZW50IHNvdXJjZVxuICAgICAgICAvLyBUaGlzIGlzIG1vcmUgdGhhbiBsaWtlbHkgdGhlIGpRdWVyeSBkYXRhIGhlbHBlclxuICAgICAgICB2YXIgZGF0YVZhbHVlID0gVXRpbHMuR2V0RGF0YSgkZVswXSwgZGF0YU5hbWUpO1xuXG4gICAgICAgIC8vIGNhbWVsQ2FzZSB0aGUgYXR0cmlidXRlIG5hbWUgdG8gbWF0Y2ggdGhlIHNwZWNcbiAgICAgICAgdmFyIGNhbWVsRGF0YU5hbWUgPSBkYXRhTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCB1cHBlckNhc2VMZXR0ZXIpO1xuXG4gICAgICAgIC8vIFN0b3JlIHRoZSBkYXRhIGF0dHJpYnV0ZSBjb250ZW50cyBpbnRvIHRoZSBkYXRhc2V0IHNpbmNlXG4gICAgICAgIGRhdGFzZXRbY2FtZWxEYXRhTmFtZV0gPSBkYXRhVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUHJlZmVyIHRoZSBlbGVtZW50J3MgYGRhdGFzZXRgIGF0dHJpYnV0ZSBpZiBpdCBleGlzdHNcbiAgICAvLyBqUXVlcnkgMS54IGRvZXMgbm90IGNvcnJlY3RseSBoYW5kbGUgZGF0YSBhdHRyaWJ1dGVzIHdpdGggbXVsdGlwbGUgZGFzaGVzXG4gICAgaWYgKCQuZm4uanF1ZXJ5ICYmICQuZm4uanF1ZXJ5LnN1YnN0cigwLCAyKSA9PSAnMS4nICYmICRlWzBdLmRhdGFzZXQpIHtcbiAgICAgIGRhdGFzZXQgPSAkLmV4dGVuZCh0cnVlLCB7fSwgJGVbMF0uZGF0YXNldCwgZGF0YXNldCk7XG4gICAgfVxuXG4gICAgLy8gUHJlZmVyIG91ciBpbnRlcm5hbCBkYXRhIGNhY2hlIGlmIGl0IGV4aXN0c1xuICAgIHZhciBkYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIFV0aWxzLkdldERhdGEoJGVbMF0pLCBkYXRhc2V0KTtcblxuICAgIGRhdGEgPSBVdGlscy5fY29udmVydERhdGEoZGF0YSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKCQuaW5BcnJheShrZXksIGV4Y2x1ZGVkRGF0YSkgPiAtMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzLm9wdGlvbnNba2V5XSkpIHtcbiAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zW2tleV0sIGRhdGFba2V5XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBPcHRpb25zLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9uc1trZXldO1xuICB9O1xuXG4gIE9wdGlvbnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHRoaXMub3B0aW9uc1trZXldID0gdmFsO1xuICB9O1xuXG4gIHJldHVybiBPcHRpb25zO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9jb3JlJyxbXG4gICdqcXVlcnknLFxuICAnLi9vcHRpb25zJyxcbiAgJy4vdXRpbHMnLFxuICAnLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIE9wdGlvbnMsIFV0aWxzLCBLRVlTKSB7XG4gIHZhciBTZWxlY3QyID0gZnVuY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgaWYgKFV0aWxzLkdldERhdGEoJGVsZW1lbnRbMF0sICdzZWxlY3QyJykgIT0gbnVsbCkge1xuICAgICAgVXRpbHMuR2V0RGF0YSgkZWxlbWVudFswXSwgJ3NlbGVjdDInKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuXG4gICAgdGhpcy5pZCA9IHRoaXMuX2dlbmVyYXRlSWQoJGVsZW1lbnQpO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zLCAkZWxlbWVudCk7XG5cbiAgICBTZWxlY3QyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXG4gICAgLy8gU2V0IHVwIHRoZSB0YWJpbmRleFxuXG4gICAgdmFyIHRhYmluZGV4ID0gJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSB8fCAwO1xuICAgIFV0aWxzLlN0b3JlRGF0YSgkZWxlbWVudFswXSwgJ29sZC10YWJpbmRleCcsIHRhYmluZGV4KTtcbiAgICAkZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuXG4gICAgLy8gU2V0IHVwIGNvbnRhaW5lcnMgYW5kIGFkYXB0ZXJzXG5cbiAgICB2YXIgRGF0YUFkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdkYXRhQWRhcHRlcicpO1xuICAgIHRoaXMuZGF0YUFkYXB0ZXIgPSBuZXcgRGF0YUFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG5cbiAgICB2YXIgJGNvbnRhaW5lciA9IHRoaXMucmVuZGVyKCk7XG5cbiAgICB0aGlzLl9wbGFjZUNvbnRhaW5lcigkY29udGFpbmVyKTtcblxuICAgIHZhciBTZWxlY3Rpb25BZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgnc2VsZWN0aW9uQWRhcHRlcicpO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbkFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy4kc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVuZGVyKCk7XG5cbiAgICB0aGlzLnNlbGVjdGlvbi5wb3NpdGlvbih0aGlzLiRzZWxlY3Rpb24sICRjb250YWluZXIpO1xuXG4gICAgdmFyIERyb3Bkb3duQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ2Ryb3Bkb3duQWRhcHRlcicpO1xuICAgIHRoaXMuZHJvcGRvd24gPSBuZXcgRHJvcGRvd25BZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuJGRyb3Bkb3duID0gdGhpcy5kcm9wZG93bi5yZW5kZXIoKTtcblxuICAgIHRoaXMuZHJvcGRvd24ucG9zaXRpb24odGhpcy4kZHJvcGRvd24sICRjb250YWluZXIpO1xuXG4gICAgdmFyIFJlc3VsdHNBZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgncmVzdWx0c0FkYXB0ZXInKTtcbiAgICB0aGlzLnJlc3VsdHMgPSBuZXcgUmVzdWx0c0FkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucywgdGhpcy5kYXRhQWRhcHRlcik7XG4gICAgdGhpcy4kcmVzdWx0cyA9IHRoaXMucmVzdWx0cy5yZW5kZXIoKTtcblxuICAgIHRoaXMucmVzdWx0cy5wb3NpdGlvbih0aGlzLiRyZXN1bHRzLCB0aGlzLiRkcm9wZG93bik7XG5cbiAgICAvLyBCaW5kIGV2ZW50c1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gQmluZCB0aGUgY29udGFpbmVyIHRvIGFsbCBvZiB0aGUgYWRhcHRlcnNcbiAgICB0aGlzLl9iaW5kQWRhcHRlcnMoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGFueSBET00gZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLl9yZWdpc3RlckRvbUV2ZW50cygpO1xuXG4gICAgLy8gUmVnaXN0ZXIgYW55IGludGVybmFsIGV2ZW50IGhhbmRsZXJzXG4gICAgdGhpcy5fcmVnaXN0ZXJEYXRhRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJTZWxlY3Rpb25FdmVudHMoKTtcbiAgICB0aGlzLl9yZWdpc3RlckRyb3Bkb3duRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJSZXN1bHRzRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMoKTtcblxuICAgIC8vIFNldCB0aGUgaW5pdGlhbCBzdGF0ZVxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoaW5pdGlhbERhdGEpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0aW9uOnVwZGF0ZScsIHtcbiAgICAgICAgZGF0YTogaW5pdGlhbERhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gSGlkZSB0aGUgb3JpZ2luYWwgc2VsZWN0XG4gICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKTtcbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBTeW5jaHJvbml6ZSBhbnkgbW9uaXRvcmVkIGF0dHJpYnV0ZXNcbiAgICB0aGlzLl9zeW5jQXR0cmlidXRlcygpO1xuXG4gICAgVXRpbHMuU3RvcmVEYXRhKCRlbGVtZW50WzBdLCAnc2VsZWN0MicsIHRoaXMpO1xuXG4gICAgLy8gRW5zdXJlIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicpLlxuICAgICRlbGVtZW50LmRhdGEoJ3NlbGVjdDInLCB0aGlzKTtcbiAgfTtcblxuICBVdGlscy5FeHRlbmQoU2VsZWN0MiwgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX2dlbmVyYXRlSWQgPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICB2YXIgaWQgPSAnJztcblxuICAgIGlmICgkZWxlbWVudC5hdHRyKCdpZCcpICE9IG51bGwpIHtcbiAgICAgIGlkID0gJGVsZW1lbnQuYXR0cignaWQnKTtcbiAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSAhPSBudWxsKSB7XG4gICAgICBpZCA9ICRlbGVtZW50LmF0dHIoJ25hbWUnKSArICctJyArIFV0aWxzLmdlbmVyYXRlQ2hhcnMoMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcbiAgICB9XG5cbiAgICBpZCA9IGlkLnJlcGxhY2UoLyg6fFxcLnxcXFt8XFxdfCwpL2csICcnKTtcbiAgICBpZCA9ICdzZWxlY3QyLScgKyBpZDtcblxuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcGxhY2VDb250YWluZXIgPSBmdW5jdGlvbiAoJGNvbnRhaW5lcikge1xuICAgICRjb250YWluZXIuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCk7XG5cbiAgICB2YXIgd2lkdGggPSB0aGlzLl9yZXNvbHZlV2lkdGgodGhpcy4kZWxlbWVudCwgdGhpcy5vcHRpb25zLmdldCgnd2lkdGgnKSk7XG5cbiAgICBpZiAod2lkdGggIT0gbnVsbCkge1xuICAgICAgJGNvbnRhaW5lci5jc3MoJ3dpZHRoJywgd2lkdGgpO1xuICAgIH1cbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVzb2x2ZVdpZHRoID0gZnVuY3Rpb24gKCRlbGVtZW50LCBtZXRob2QpIHtcbiAgICB2YXIgV0lEVEggPSAvXndpZHRoOigoWy0rXT8oWzAtOV0qXFwuKT9bMC05XSspKHB4fGVtfGV4fCV8aW58Y218bW18cHR8cGMpKS9pO1xuXG4gICAgaWYgKG1ldGhvZCA9PSAncmVzb2x2ZScpIHtcbiAgICAgIHZhciBzdHlsZVdpZHRoID0gdGhpcy5fcmVzb2x2ZVdpZHRoKCRlbGVtZW50LCAnc3R5bGUnKTtcblxuICAgICAgaWYgKHN0eWxlV2lkdGggIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3R5bGVXaWR0aDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVXaWR0aCgkZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09ICdlbGVtZW50Jykge1xuICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9ICRlbGVtZW50Lm91dGVyV2lkdGgoZmFsc2UpO1xuXG4gICAgICBpZiAoZWxlbWVudFdpZHRoIDw9IDApIHtcbiAgICAgICAgcmV0dXJuICdhdXRvJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVsZW1lbnRXaWR0aCArICdweCc7XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCA9PSAnc3R5bGUnKSB7XG4gICAgICB2YXIgc3R5bGUgPSAkZWxlbWVudC5hdHRyKCdzdHlsZScpO1xuXG4gICAgICBpZiAodHlwZW9mKHN0eWxlKSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBhdHRycyA9IHN0eWxlLnNwbGl0KCc7Jyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSA9IGkgKyAxKSB7XG4gICAgICAgIHZhciBhdHRyID0gYXR0cnNbaV0ucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBhdHRyLm1hdGNoKFdJRFRIKTtcblxuICAgICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCAmJiBtYXRjaGVzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoZXNbMV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fYmluZEFkYXB0ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGF0YUFkYXB0ZXIuYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xuICAgIHRoaXMuc2VsZWN0aW9uLmJpbmQodGhpcywgdGhpcy4kY29udGFpbmVyKTtcblxuICAgIHRoaXMuZHJvcGRvd24uYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xuICAgIHRoaXMucmVzdWx0cy5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRG9tRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NoYW5nZS5zZWxlY3QyJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0aW9uOnVwZGF0ZScsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdmb2N1cy5zZWxlY3QyJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zeW5jQSA9IFV0aWxzLmJpbmQodGhpcy5fc3luY0F0dHJpYnV0ZXMsIHRoaXMpO1xuICAgIHRoaXMuX3N5bmNTID0gVXRpbHMuYmluZCh0aGlzLl9zeW5jU3VidHJlZSwgdGhpcyk7XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXS5hdHRhY2hFdmVudCkge1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hdHRhY2hFdmVudCgnb25wcm9wZXJ0eWNoYW5nZScsIHRoaXMuX3N5bmNBKTtcbiAgICB9XG5cbiAgICB2YXIgb2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fFxuICAgICAgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHxcbiAgICAgIHdpbmRvdy5Nb3pNdXRhdGlvbk9ic2VydmVyXG4gICAgO1xuXG4gICAgaWYgKG9ic2VydmVyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IG9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgJC5lYWNoKG11dGF0aW9ucywgc2VsZi5fc3luY0EpO1xuICAgICAgICAkLmVhY2gobXV0YXRpb25zLCBzZWxmLl9zeW5jUyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy4kZWxlbWVudFswXSwge1xuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnRbMF0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnRE9NQXR0ck1vZGlmaWVkJyxcbiAgICAgICAgc2VsZi5fc3luY0EsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnRE9NTm9kZUluc2VydGVkJyxcbiAgICAgICAgc2VsZi5fc3luY1MsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnRE9NTm9kZVJlbW92ZWQnLFxuICAgICAgICBzZWxmLl9zeW5jUyxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRhdGFFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5kYXRhQWRhcHRlci5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlclNlbGVjdGlvbkV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5vblJlbGF5RXZlbnRzID0gWyd0b2dnbGUnLCAnZm9jdXMnXTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCd0b2dnbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnRvZ2dsZURyb3Bkb3duKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmZvY3VzKHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdGlvbi5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgbm9uUmVsYXlFdmVudHMpICE9PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRyb3Bkb3duRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuZHJvcGRvd24ub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XG4gICAgICBzZWxmLnRyaWdnZXIobmFtZSwgcGFyYW1zKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJSZXN1bHRzRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucmVzdWx0cy5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdlbmFibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1kaXNhYmxlZCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbignZGlzYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWRpc2FibGVkJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgaWYgKCFzZWxmLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignb3BlbicsIHt9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kYXRhQWRhcHRlci5xdWVyeShwYXJhbXMsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czphbGwnLCB7XG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICBxdWVyeTogcGFyYW1zXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdxdWVyeTphcHBlbmQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICB0aGlzLmRhdGFBZGFwdGVyLnF1ZXJ5KHBhcmFtcywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmFwcGVuZCcsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHF1ZXJ5OiBwYXJhbXNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIGtleSA9IGV2dC53aGljaDtcblxuICAgICAgaWYgKHNlbGYuaXNPcGVuKCkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gS0VZUy5FU0MgfHwga2V5ID09PSBLRVlTLlRBQiB8fFxuICAgICAgICAgICAgKGtleSA9PT0gS0VZUy5VUCAmJiBldnQuYWx0S2V5KSkge1xuICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5FTlRFUikge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpzZWxlY3QnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmICgoa2V5ID09PSBLRVlTLlNQQUNFICYmIGV2dC5jdHJsS2V5KSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czp0b2dnbGUnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtFWVMuVVApIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6cHJldmlvdXMnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtFWVMuRE9XTikge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpuZXh0Jywge30pO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChrZXkgPT09IEtFWVMuRU5URVIgfHwga2V5ID09PSBLRVlTLlNQQUNFIHx8XG4gICAgICAgICAgICAoa2V5ID09PSBLRVlTLkRPV04gJiYgZXZ0LmFsdEtleSkpIHtcbiAgICAgICAgICBzZWxmLm9wZW4oKTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3N5bmNBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub3B0aW9ucy5zZXQoJ2Rpc2FibGVkJywgdGhpcy4kZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcpKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlcignZGlzYWJsZScsIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmlnZ2VyKCdlbmFibGUnLCB7fSk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9zeW5jU3VidHJlZSA9IGZ1bmN0aW9uIChldnQsIG11dGF0aW9ucykge1xuICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gSWdub3JlIGFueSBtdXRhdGlvbiBldmVudHMgcmFpc2VkIGZvciBlbGVtZW50cyB0aGF0IGFyZW4ndCBvcHRpb25zIG9yXG4gICAgLy8gb3B0Z3JvdXBzLiBUaGlzIGhhbmRsZXMgdGhlIGNhc2Ugd2hlbiB0aGUgc2VsZWN0IGVsZW1lbnQgaXMgZGVzdHJveWVkXG4gICAgaWYgKFxuICAgICAgZXZ0ICYmIGV2dC50YXJnZXQgJiYgKFxuICAgICAgICBldnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnT1BUSU9OJyAmJiBldnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnT1BUR1JPVVAnXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtdXRhdGlvbnMpIHtcbiAgICAgIC8vIElmIG11dGF0aW9uIGV2ZW50cyBhcmVuJ3Qgc3VwcG9ydGVkLCB0aGVuIHdlIGNhbiBvbmx5IGFzc3VtZSB0aGF0IHRoZVxuICAgICAgLy8gY2hhbmdlIGFmZmVjdGVkIHRoZSBzZWxlY3Rpb25zXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG11dGF0aW9ucy5hZGRlZE5vZGVzICYmIG11dGF0aW9ucy5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbXV0YXRpb25zLmFkZGVkTm9kZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbnMuYWRkZWROb2Rlc1tuXTtcblxuICAgICAgICBpZiAobm9kZS5zZWxlY3RlZCkge1xuICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtdXRhdGlvbnMucmVtb3ZlZE5vZGVzICYmIG11dGF0aW9ucy5yZW1vdmVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gT25seSByZS1wdWxsIHRoZSBkYXRhIGlmIHdlIHRoaW5rIHRoZXJlIGlzIGEgY2hhbmdlXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xuICAgICAgICAgIGRhdGE6IGN1cnJlbnREYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBPdmVycmlkZSB0aGUgdHJpZ2dlciBtZXRob2QgdG8gYXV0b21hdGljYWxseSB0cmlnZ2VyIHByZS1ldmVudHMgd2hlblxuICAgKiB0aGVyZSBhcmUgZXZlbnRzIHRoYXQgY2FuIGJlIHByZXZlbnRlZC5cbiAgICovXG4gIFNlbGVjdDIucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSwgYXJncykge1xuICAgIHZhciBhY3R1YWxUcmlnZ2VyID0gU2VsZWN0Mi5fX3N1cGVyX18udHJpZ2dlcjtcbiAgICB2YXIgcHJlVHJpZ2dlck1hcCA9IHtcbiAgICAgICdvcGVuJzogJ29wZW5pbmcnLFxuICAgICAgJ2Nsb3NlJzogJ2Nsb3NpbmcnLFxuICAgICAgJ3NlbGVjdCc6ICdzZWxlY3RpbmcnLFxuICAgICAgJ3Vuc2VsZWN0JzogJ3Vuc2VsZWN0aW5nJyxcbiAgICAgICdjbGVhcic6ICdjbGVhcmluZydcbiAgICB9O1xuXG4gICAgaWYgKGFyZ3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYXJncyA9IHt9O1xuICAgIH1cblxuICAgIGlmIChuYW1lIGluIHByZVRyaWdnZXJNYXApIHtcbiAgICAgIHZhciBwcmVUcmlnZ2VyTmFtZSA9IHByZVRyaWdnZXJNYXBbbmFtZV07XG4gICAgICB2YXIgcHJlVHJpZ2dlckFyZ3MgPSB7XG4gICAgICAgIHByZXZlbnRlZDogZmFsc2UsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgIH07XG5cbiAgICAgIGFjdHVhbFRyaWdnZXIuY2FsbCh0aGlzLCBwcmVUcmlnZ2VyTmFtZSwgcHJlVHJpZ2dlckFyZ3MpO1xuXG4gICAgICBpZiAocHJlVHJpZ2dlckFyZ3MucHJldmVudGVkKSB7XG4gICAgICAgIGFyZ3MucHJldmVudGVkID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWN0dWFsVHJpZ2dlci5jYWxsKHRoaXMsIG5hbWUsIGFyZ3MpO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLnRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge30pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcignY2xvc2UnLCB7fSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuaXNPcGVuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRjb250YWluZXIuaGFzQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuaGFzRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5oYXNDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWZvY3VzJyk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIE5vIG5lZWQgdG8gcmUtdHJpZ2dlciBmb2N1cyBldmVudHMgaWYgd2UgYXJlIGFscmVhZHkgZm9jdXNlZFxuICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1mb2N1cycpO1xuICAgIHRoaXMudHJpZ2dlcignZm9jdXMnLCB7fSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1NlbGVjdDI6IFRoZSBgc2VsZWN0MihcImVuYWJsZVwiKWAgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwnICtcbiAgICAgICAgJyBiZSByZW1vdmVkIGluIGxhdGVyIFNlbGVjdDIgdmVyc2lvbnMuIFVzZSAkZWxlbWVudC5wcm9wKFwiZGlzYWJsZWRcIiknICtcbiAgICAgICAgJyBpbnN0ZWFkLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3MgPT0gbnVsbCB8fCBhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXJncyA9IFt0cnVlXTtcbiAgICB9XG5cbiAgICB2YXIgZGlzYWJsZWQgPSAhYXJnc1swXTtcblxuICAgIHRoaXMuJGVsZW1lbnQucHJvcCgnZGlzYWJsZWQnLCBkaXNhYmxlZCk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJlxuICAgICAgICBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1NlbGVjdDI6IERhdGEgY2FuIG5vIGxvbmdlciBiZSBzZXQgdXNpbmcgYHNlbGVjdDIoXCJkYXRhXCIpYC4gWW91ICcgK1xuICAgICAgICAnc2hvdWxkIGNvbnNpZGVyIHNldHRpbmcgdGhlIHZhbHVlIGluc3RlYWQgdXNpbmcgYCRlbGVtZW50LnZhbCgpYC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gW107XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICBkYXRhID0gY3VycmVudERhdGE7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS52YWwgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnU2VsZWN0MjogVGhlIGBzZWxlY3QyKFwidmFsXCIpYCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZScgK1xuICAgICAgICAnIHJlbW92ZWQgaW4gbGF0ZXIgU2VsZWN0MiB2ZXJzaW9ucy4gVXNlICRlbGVtZW50LnZhbCgpIGluc3RlYWQuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoYXJncyA9PSBudWxsIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy4kZWxlbWVudC52YWwoKTtcbiAgICB9XG5cbiAgICB2YXIgbmV3VmFsID0gYXJnc1swXTtcblxuICAgIGlmICgkLmlzQXJyYXkobmV3VmFsKSkge1xuICAgICAgbmV3VmFsID0gJC5tYXAobmV3VmFsLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmoudG9TdHJpbmcoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudmFsKG5ld1ZhbCkudHJpZ2dlcignY2hhbmdlJyk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRjb250YWluZXIucmVtb3ZlKCk7XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXS5kZXRhY2hFdmVudCkge1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5kZXRhY2hFdmVudCgnb25wcm9wZXJ0eWNoYW5nZScsIHRoaXMuX3N5bmNBKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb2JzZXJ2ZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5fb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kZWxlbWVudFswXS5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdXG4gICAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01BdHRyTW9kaWZpZWQnLCB0aGlzLl9zeW5jQSwgZmFsc2UpO1xuICAgICAgdGhpcy4kZWxlbWVudFswXVxuICAgICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTm9kZUluc2VydGVkJywgdGhpcy5fc3luY1MsIGZhbHNlKTtcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF1cbiAgICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVSZW1vdmVkJywgdGhpcy5fc3luY1MsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zeW5jQSA9IG51bGw7XG4gICAgdGhpcy5fc3luY1MgPSBudWxsO1xuXG4gICAgdGhpcy4kZWxlbWVudC5vZmYoJy5zZWxlY3QyJyk7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsXG4gICAgVXRpbHMuR2V0RGF0YSh0aGlzLiRlbGVtZW50WzBdLCAnb2xkLXRhYmluZGV4JykpO1xuXG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpO1xuICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICBVdGlscy5SZW1vdmVEYXRhKHRoaXMuJGVsZW1lbnRbMF0pO1xuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlRGF0YSgnc2VsZWN0MicpO1xuXG4gICAgdGhpcy5kYXRhQWRhcHRlci5kZXN0cm95KCk7XG4gICAgdGhpcy5zZWxlY3Rpb24uZGVzdHJveSgpO1xuICAgIHRoaXMuZHJvcGRvd24uZGVzdHJveSgpO1xuICAgIHRoaXMucmVzdWx0cy5kZXN0cm95KCk7XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyID0gbnVsbDtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5kcm9wZG93biA9IG51bGw7XG4gICAgdGhpcy5yZXN1bHRzID0gbnVsbDtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRjb250YWluZXIgPSAkKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0MiBzZWxlY3QyLWNvbnRhaW5lclwiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3Rpb25cIj48L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImRyb3Bkb3duLXdyYXBwZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuXG4gICAgJGNvbnRhaW5lci5hdHRyKCdkaXInLCB0aGlzLm9wdGlvbnMuZ2V0KCdkaXInKSk7XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuXG4gICAgdGhpcy4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tJyArIHRoaXMub3B0aW9ucy5nZXQoJ3RoZW1lJykpO1xuXG4gICAgVXRpbHMuU3RvcmVEYXRhKCRjb250YWluZXJbMF0sICdlbGVtZW50JywgdGhpcy4kZWxlbWVudCk7XG5cbiAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4gU2VsZWN0Mjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvY29tcGF0L3V0aWxzJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBzeW5jQ3NzQ2xhc3NlcyAoJGRlc3QsICRzcmMsIGFkYXB0ZXIpIHtcbiAgICB2YXIgY2xhc3NlcywgcmVwbGFjZW1lbnRzID0gW10sIGFkYXB0ZWQ7XG5cbiAgICBjbGFzc2VzID0gJC50cmltKCRkZXN0LmF0dHIoJ2NsYXNzJykpO1xuXG4gICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgIGNsYXNzZXMgPSAnJyArIGNsYXNzZXM7IC8vIGZvciBJRSB3aGljaCByZXR1cm5zIG9iamVjdFxuXG4gICAgICAkKGNsYXNzZXMuc3BsaXQoL1xccysvKSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFNhdmUgYWxsIFNlbGVjdDIgY2xhc3Nlc1xuICAgICAgICBpZiAodGhpcy5pbmRleE9mKCdzZWxlY3QyLScpID09PSAwKSB7XG4gICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNsYXNzZXMgPSAkLnRyaW0oJHNyYy5hdHRyKCdjbGFzcycpKTtcblxuICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICBjbGFzc2VzID0gJycgKyBjbGFzc2VzOyAvLyBmb3IgSUUgd2hpY2ggcmV0dXJucyBvYmplY3RcblxuICAgICAgJChjbGFzc2VzLnNwbGl0KC9cXHMrLykpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBPbmx5IGFkYXB0IG5vbi1TZWxlY3QyIGNsYXNzZXNcbiAgICAgICAgaWYgKHRoaXMuaW5kZXhPZignc2VsZWN0Mi0nKSAhPT0gMCkge1xuICAgICAgICAgIGFkYXB0ZWQgPSBhZGFwdGVyKHRoaXMpO1xuXG4gICAgICAgICAgaWYgKGFkYXB0ZWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLnB1c2goYWRhcHRlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkZGVzdC5hdHRyKCdjbGFzcycsIHJlcGxhY2VtZW50cy5qb2luKCcgJykpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzeW5jQ3NzQ2xhc3Nlczogc3luY0Nzc0NsYXNzZXNcbiAgfTtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvY29tcGF0L2NvbnRhaW5lckNzcycsW1xuICAnanF1ZXJ5JyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgQ29tcGF0VXRpbHMpIHtcbiAgLy8gTm8tb3AgQ1NTIGFkYXB0ZXIgdGhhdCBkaXNjYXJkcyBhbGwgY2xhc3NlcyBieSBkZWZhdWx0XG4gIGZ1bmN0aW9uIF9jb250YWluZXJBZGFwdGVyIChjbGF6eikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGFpbmVyQ1NTICgpIHsgfVxuXG4gIENvbnRhaW5lckNTUy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHZhciAkY29udGFpbmVyID0gZGVjb3JhdGVkLmNhbGwodGhpcyk7XG5cbiAgICB2YXIgY29udGFpbmVyQ3NzQ2xhc3MgPSB0aGlzLm9wdGlvbnMuZ2V0KCdjb250YWluZXJDc3NDbGFzcycpIHx8ICcnO1xuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihjb250YWluZXJDc3NDbGFzcykpIHtcbiAgICAgIGNvbnRhaW5lckNzc0NsYXNzID0gY29udGFpbmVyQ3NzQ2xhc3ModGhpcy4kZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRhaW5lckNzc0FkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdhZGFwdENvbnRhaW5lckNzc0NsYXNzJyk7XG4gICAgY29udGFpbmVyQ3NzQWRhcHRlciA9IGNvbnRhaW5lckNzc0FkYXB0ZXIgfHwgX2NvbnRhaW5lckFkYXB0ZXI7XG5cbiAgICBpZiAoY29udGFpbmVyQ3NzQ2xhc3MuaW5kZXhPZignOmFsbDonKSAhPT0gLTEpIHtcbiAgICAgIGNvbnRhaW5lckNzc0NsYXNzID0gY29udGFpbmVyQ3NzQ2xhc3MucmVwbGFjZSgnOmFsbDonLCAnJyk7XG5cbiAgICAgIHZhciBfY3NzQWRhcHRlciA9IGNvbnRhaW5lckNzc0FkYXB0ZXI7XG5cbiAgICAgIGNvbnRhaW5lckNzc0FkYXB0ZXIgPSBmdW5jdGlvbiAoY2xhenopIHtcbiAgICAgICAgdmFyIGFkYXB0ZWQgPSBfY3NzQWRhcHRlcihjbGF6eik7XG5cbiAgICAgICAgaWYgKGFkYXB0ZWQgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIEFwcGVuZCB0aGUgb2xkIG9uZSBhbG9uZyB3aXRoIHRoZSBhZGFwdGVkIG9uZVxuICAgICAgICAgIHJldHVybiBhZGFwdGVkICsgJyAnICsgY2xheno7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xheno7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBjb250YWluZXJDc3MgPSB0aGlzLm9wdGlvbnMuZ2V0KCdjb250YWluZXJDc3MnKSB8fCB7fTtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24oY29udGFpbmVyQ3NzKSkge1xuICAgICAgY29udGFpbmVyQ3NzID0gY29udGFpbmVyQ3NzKHRoaXMuJGVsZW1lbnQpO1xuICAgIH1cblxuICAgIENvbXBhdFV0aWxzLnN5bmNDc3NDbGFzc2VzKCRjb250YWluZXIsIHRoaXMuJGVsZW1lbnQsIGNvbnRhaW5lckNzc0FkYXB0ZXIpO1xuXG4gICAgJGNvbnRhaW5lci5jc3MoY29udGFpbmVyQ3NzKTtcbiAgICAkY29udGFpbmVyLmFkZENsYXNzKGNvbnRhaW5lckNzc0NsYXNzKTtcblxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiBDb250YWluZXJDU1M7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2NvbXBhdC9kcm9wZG93bkNzcycsW1xuICAnanF1ZXJ5JyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgQ29tcGF0VXRpbHMpIHtcbiAgLy8gTm8tb3AgQ1NTIGFkYXB0ZXIgdGhhdCBkaXNjYXJkcyBhbGwgY2xhc3NlcyBieSBkZWZhdWx0XG4gIGZ1bmN0aW9uIF9kcm9wZG93bkFkYXB0ZXIgKGNsYXp6KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBEcm9wZG93bkNTUyAoKSB7IH1cblxuICBEcm9wZG93bkNTUy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHZhciAkZHJvcGRvd24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcblxuICAgIHZhciBkcm9wZG93bkNzc0NsYXNzID0gdGhpcy5vcHRpb25zLmdldCgnZHJvcGRvd25Dc3NDbGFzcycpIHx8ICcnO1xuXG4gICAgaWYgKCQuaXNGdW5jdGlvbihkcm9wZG93bkNzc0NsYXNzKSkge1xuICAgICAgZHJvcGRvd25Dc3NDbGFzcyA9IGRyb3Bkb3duQ3NzQ2xhc3ModGhpcy4kZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdmFyIGRyb3Bkb3duQ3NzQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ2FkYXB0RHJvcGRvd25Dc3NDbGFzcycpO1xuICAgIGRyb3Bkb3duQ3NzQWRhcHRlciA9IGRyb3Bkb3duQ3NzQWRhcHRlciB8fCBfZHJvcGRvd25BZGFwdGVyO1xuXG4gICAgaWYgKGRyb3Bkb3duQ3NzQ2xhc3MuaW5kZXhPZignOmFsbDonKSAhPT0gLTEpIHtcbiAgICAgIGRyb3Bkb3duQ3NzQ2xhc3MgPSBkcm9wZG93bkNzc0NsYXNzLnJlcGxhY2UoJzphbGw6JywgJycpO1xuXG4gICAgICB2YXIgX2Nzc0FkYXB0ZXIgPSBkcm9wZG93bkNzc0FkYXB0ZXI7XG5cbiAgICAgIGRyb3Bkb3duQ3NzQWRhcHRlciA9IGZ1bmN0aW9uIChjbGF6eikge1xuICAgICAgICB2YXIgYWRhcHRlZCA9IF9jc3NBZGFwdGVyKGNsYXp6KTtcblxuICAgICAgICBpZiAoYWRhcHRlZCAhPSBudWxsKSB7XG4gICAgICAgICAgLy8gQXBwZW5kIHRoZSBvbGQgb25lIGFsb25nIHdpdGggdGhlIGFkYXB0ZWQgb25lXG4gICAgICAgICAgcmV0dXJuIGFkYXB0ZWQgKyAnICcgKyBjbGF6ejtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGF6ejtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGRyb3Bkb3duQ3NzID0gdGhpcy5vcHRpb25zLmdldCgnZHJvcGRvd25Dc3MnKSB8fCB7fTtcblxuICAgIGlmICgkLmlzRnVuY3Rpb24oZHJvcGRvd25Dc3MpKSB7XG4gICAgICBkcm9wZG93bkNzcyA9IGRyb3Bkb3duQ3NzKHRoaXMuJGVsZW1lbnQpO1xuICAgIH1cblxuICAgIENvbXBhdFV0aWxzLnN5bmNDc3NDbGFzc2VzKCRkcm9wZG93biwgdGhpcy4kZWxlbWVudCwgZHJvcGRvd25Dc3NBZGFwdGVyKTtcblxuICAgICRkcm9wZG93bi5jc3MoZHJvcGRvd25Dc3MpO1xuICAgICRkcm9wZG93bi5hZGRDbGFzcyhkcm9wZG93bkNzc0NsYXNzKTtcblxuICAgIHJldHVybiAkZHJvcGRvd247XG4gIH07XG5cbiAgcmV0dXJuIERyb3Bkb3duQ1NTO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9jb21wYXQvaW5pdFNlbGVjdGlvbicsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gSW5pdFNlbGVjdGlvbiAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1NlbGVjdDI6IFRoZSBgaW5pdFNlbGVjdGlvbmAgb3B0aW9uIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gZmF2b3InICtcbiAgICAgICAgJyBvZiBhIGN1c3RvbSBkYXRhIGFkYXB0ZXIgdGhhdCBvdmVycmlkZXMgdGhlIGBjdXJyZW50YCBtZXRob2QuICcgK1xuICAgICAgICAnVGhpcyBtZXRob2QgaXMgbm93IGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBpbnN0ZWFkIG9mIGEgc2luZ2xlICcgK1xuICAgICAgICAndGltZSB3aGVuIHRoZSBpbnN0YW5jZSBpcyBpbml0aWFsaXplZC4gU3VwcG9ydCB3aWxsIGJlIHJlbW92ZWQgJyArXG4gICAgICAgICdmb3IgdGhlIGBpbml0U2VsZWN0aW9uYCBvcHRpb24gaW4gZnV0dXJlIHZlcnNpb25zIG9mIFNlbGVjdDInXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdFNlbGVjdGlvbiA9IG9wdGlvbnMuZ2V0KCdpbml0U2VsZWN0aW9uJyk7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgSW5pdFNlbGVjdGlvbi5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX2lzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNhbGxiYWNrKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdFNlbGVjdGlvbi5jYWxsKG51bGwsIHRoaXMuJGVsZW1lbnQsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzZWxmLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgaWYgKCEkLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEluaXRTZWxlY3Rpb247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2NvbXBhdC9pbnB1dERhdGEnLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xuICBmdW5jdGlvbiBJbnB1dERhdGEgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9jdXJyZW50RGF0YSA9IFtdO1xuICAgIHRoaXMuX3ZhbHVlU2VwYXJhdG9yID0gb3B0aW9ucy5nZXQoJ3ZhbHVlU2VwYXJhdG9yJykgfHwgJywnO1xuXG4gICAgaWYgKCRlbGVtZW50LnByb3AoJ3R5cGUnKSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgIGlmIChvcHRpb25zLmdldCgnZGVidWcnKSAmJiBjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ1NlbGVjdDI6IFVzaW5nIGEgaGlkZGVuIGlucHV0IHdpdGggU2VsZWN0MiBpcyBubyBsb25nZXIgJyArXG4gICAgICAgICAgJ3N1cHBvcnRlZCBhbmQgbWF5IHN0b3Agd29ya2luZyBpbiB0aGUgZnV0dXJlLiBJdCBpcyByZWNvbW1lbmRlZCAnICtcbiAgICAgICAgICAndG8gdXNlIGEgYDxzZWxlY3Q+YCBlbGVtZW50IGluc3RlYWQuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIElucHV0RGF0YS5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChfLCBjYWxsYmFjaykge1xuICAgIGZ1bmN0aW9uIGdldFNlbGVjdGVkIChkYXRhLCBzZWxlY3RlZElkcykge1xuICAgICAgdmFyIHNlbGVjdGVkID0gW107XG5cbiAgICAgIGlmIChkYXRhLnNlbGVjdGVkIHx8ICQuaW5BcnJheShkYXRhLmlkLCBzZWxlY3RlZElkcykgIT09IC0xKSB7XG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBzZWxlY3RlZC5wdXNoKGRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgICBzZWxlY3RlZC5wdXNoLmFwcGx5KHNlbGVjdGVkLCBnZXRTZWxlY3RlZChkYXRhLmNoaWxkcmVuLCBzZWxlY3RlZElkcykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGVkID0gW107XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IHRoaXMuX2N1cnJlbnREYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgZGF0YSA9IHRoaXMuX2N1cnJlbnREYXRhW2RdO1xuXG4gICAgICBzZWxlY3RlZC5wdXNoLmFwcGx5KFxuICAgICAgICBzZWxlY3RlZCxcbiAgICAgICAgZ2V0U2VsZWN0ZWQoXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnZhbCgpLnNwbGl0KFxuICAgICAgICAgICAgdGhpcy5fdmFsdWVTZXBhcmF0b3JcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY2FsbGJhY2soc2VsZWN0ZWQpO1xuICB9O1xuXG4gIElucHV0RGF0YS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKF8sIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5nZXQoJ211bHRpcGxlJykpIHtcbiAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoYWxsRGF0YSkge1xuICAgICAgICAkLm1hcChhbGxEYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy4kZWxlbWVudC52YWwoZGF0YS5pZCk7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpO1xuICAgICAgdmFsdWUgKz0gdGhpcy5fdmFsdWVTZXBhcmF0b3IgKyBkYXRhLmlkO1xuXG4gICAgICB0aGlzLiRlbGVtZW50LnZhbCh2YWx1ZSk7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgfTtcblxuICBJbnB1dERhdGEucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKF8sIGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGFsbERhdGEpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBhbGxEYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gYWxsRGF0YVtkXTtcblxuICAgICAgICBpZiAoZGF0YS5pZCA9PSBpdGVtLmlkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZXMucHVzaChpdGVtLmlkKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsdWVzLmpvaW4oc2VsZi5fdmFsdWVTZXBhcmF0b3IpKTtcbiAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgSW5wdXREYXRhLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChfLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgdGhpcy5fY3VycmVudERhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5fY3VycmVudERhdGFbZF07XG5cbiAgICAgIHZhciBtYXRjaGVzID0gdGhpcy5tYXRjaGVzKHBhcmFtcywgZGF0YSk7XG5cbiAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChtYXRjaGVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxsYmFjayh7XG4gICAgICByZXN1bHRzOiByZXN1bHRzXG4gICAgfSk7XG4gIH07XG5cbiAgSW5wdXREYXRhLnByb3RvdHlwZS5hZGRPcHRpb25zID0gZnVuY3Rpb24gKF8sICRvcHRpb25zKSB7XG4gICAgdmFyIG9wdGlvbnMgPSAkLm1hcCgkb3B0aW9ucywgZnVuY3Rpb24gKCRvcHRpb24pIHtcbiAgICAgIHJldHVybiBVdGlscy5HZXREYXRhKCRvcHRpb25bMF0sICdkYXRhJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jdXJyZW50RGF0YS5wdXNoLmFwcGx5KHRoaXMuX2N1cnJlbnREYXRhLCBvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gSW5wdXREYXRhO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9jb21wYXQvbWF0Y2hlcicsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gb2xkTWF0Y2hlciAobWF0Y2hlcikge1xuICAgIGZ1bmN0aW9uIHdyYXBwZWRNYXRjaGVyIChwYXJhbXMsIGRhdGEpIHtcbiAgICAgIHZhciBtYXRjaCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkYXRhKTtcblxuICAgICAgaWYgKHBhcmFtcy50ZXJtID09IG51bGwgfHwgJC50cmltKHBhcmFtcy50ZXJtKSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgICBmb3IgKHZhciBjID0gZGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxOyBjID49IDA7IGMtLSkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IGRhdGEuY2hpbGRyZW5bY107XG5cbiAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgY2hpbGQgb2JqZWN0IG1hdGNoZXNcbiAgICAgICAgICAvLyBUaGUgb2xkIG1hdGNoZXIgcmV0dXJuZWQgYSBib29sZWFuIHRydWUgb3IgZmFsc2VcbiAgICAgICAgICB2YXIgZG9lc01hdGNoID0gbWF0Y2hlcihwYXJhbXMudGVybSwgY2hpbGQudGV4dCwgY2hpbGQpO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGNoaWxkIGRpZG4ndCBtYXRjaCwgcG9wIGl0IG9mZlxuICAgICAgICAgIGlmICghZG9lc01hdGNoKSB7XG4gICAgICAgICAgICBtYXRjaC5jaGlsZHJlbi5zcGxpY2UoYywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hdGNoLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1hdGNoZXIocGFyYW1zLnRlcm0sIGRhdGEudGV4dCwgZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gd3JhcHBlZE1hdGNoZXI7XG4gIH1cblxuICByZXR1cm4gb2xkTWF0Y2hlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvY29tcGF0L3F1ZXJ5JyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUXVlcnkgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdTZWxlY3QyOiBUaGUgYHF1ZXJ5YCBvcHRpb24gaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBhICcgK1xuICAgICAgICAnY3VzdG9tIGRhdGEgYWRhcHRlciB0aGF0IG92ZXJyaWRlcyB0aGUgYHF1ZXJ5YCBtZXRob2QuIFN1cHBvcnQgJyArXG4gICAgICAgICd3aWxsIGJlIHJlbW92ZWQgZm9yIHRoZSBgcXVlcnlgIG9wdGlvbiBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgJyArXG4gICAgICAgICdTZWxlY3QyLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgUXVlcnkucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKF8sIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICBwYXJhbXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHZhciBxdWVyeSA9IHRoaXMub3B0aW9ucy5nZXQoJ3F1ZXJ5Jyk7XG5cbiAgICBxdWVyeS5jYWxsKG51bGwsIHBhcmFtcyk7XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXJ5O1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9hdHRhY2hDb250YWluZXInLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBBdHRhY2hDb250YWluZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBBdHRhY2hDb250YWluZXIucHJvdG90eXBlLnBvc2l0aW9uID1cbiAgICBmdW5jdGlvbiAoZGVjb3JhdGVkLCAkZHJvcGRvd24sICRjb250YWluZXIpIHtcbiAgICB2YXIgJGRyb3Bkb3duQ29udGFpbmVyID0gJGNvbnRhaW5lci5maW5kKCcuZHJvcGRvd24td3JhcHBlcicpO1xuICAgICRkcm9wZG93bkNvbnRhaW5lci5hcHBlbmQoJGRyb3Bkb3duKTtcblxuICAgICRkcm9wZG93bi5hZGRDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tYmVsb3cnKTtcbiAgICAkY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tYmVsb3cnKTtcbiAgfTtcblxuICByZXR1cm4gQXR0YWNoQ29udGFpbmVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9zdG9wUHJvcGFnYXRpb24nLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdG9wUHJvcGFnYXRpb24gKCkgeyB9XG5cbiAgU3RvcFByb3BhZ2F0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIHZhciBzdG9wcGVkRXZlbnRzID0gW1xuICAgICdibHVyJyxcbiAgICAnY2hhbmdlJyxcbiAgICAnY2xpY2snLFxuICAgICdkYmxjbGljaycsXG4gICAgJ2ZvY3VzJyxcbiAgICAnZm9jdXNpbicsXG4gICAgJ2ZvY3Vzb3V0JyxcbiAgICAnaW5wdXQnLFxuICAgICdrZXlkb3duJyxcbiAgICAna2V5dXAnLFxuICAgICdrZXlwcmVzcycsXG4gICAgJ21vdXNlZG93bicsXG4gICAgJ21vdXNlZW50ZXInLFxuICAgICdtb3VzZWxlYXZlJyxcbiAgICAnbW91c2Vtb3ZlJyxcbiAgICAnbW91c2VvdmVyJyxcbiAgICAnbW91c2V1cCcsXG4gICAgJ3NlYXJjaCcsXG4gICAgJ3RvdWNoZW5kJyxcbiAgICAndG91Y2hzdGFydCdcbiAgICBdO1xuXG4gICAgdGhpcy4kZHJvcGRvd24ub24oc3RvcHBlZEV2ZW50cy5qb2luKCcgJyksIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU3RvcFByb3BhZ2F0aW9uO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vc3RvcFByb3BhZ2F0aW9uJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3RvcFByb3BhZ2F0aW9uICgpIHsgfVxuXG4gIFN0b3BQcm9wYWdhdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICB2YXIgc3RvcHBlZEV2ZW50cyA9IFtcbiAgICAgICdibHVyJyxcbiAgICAgICdjaGFuZ2UnLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgICdkYmxjbGljaycsXG4gICAgICAnZm9jdXMnLFxuICAgICAgJ2ZvY3VzaW4nLFxuICAgICAgJ2ZvY3Vzb3V0JyxcbiAgICAgICdpbnB1dCcsXG4gICAgICAna2V5ZG93bicsXG4gICAgICAna2V5dXAnLFxuICAgICAgJ2tleXByZXNzJyxcbiAgICAgICdtb3VzZWRvd24nLFxuICAgICAgJ21vdXNlZW50ZXInLFxuICAgICAgJ21vdXNlbGVhdmUnLFxuICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAnbW91c2VvdmVyJyxcbiAgICAgICdtb3VzZXVwJyxcbiAgICAgICdzZWFyY2gnLFxuICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICd0b3VjaHN0YXJ0J1xuICAgIF07XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oc3RvcHBlZEV2ZW50cy5qb2luKCcgJyksIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU3RvcFByb3BhZ2F0aW9uO1xufSk7XG5cbi8qIVxuICogalF1ZXJ5IE1vdXNld2hlZWwgMy4xLjEzXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICovXG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICggdHlwZW9mIFMyLmRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBTMi5kZWZpbmUuYW1kICkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIFMyLmRlZmluZSgnanF1ZXJ5LW1vdXNld2hlZWwnLFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIE5vZGUvQ29tbW9uSlMgc3R5bGUgZm9yIEJyb3dzZXJpZnlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgfVxufShmdW5jdGlvbiAoJCkge1xuXG4gICAgdmFyIHRvRml4ICA9IFsnd2hlZWwnLCAnbW91c2V3aGVlbCcsICdET01Nb3VzZVNjcm9sbCcsICdNb3pNb3VzZVBpeGVsU2Nyb2xsJ10sXG4gICAgICAgIHRvQmluZCA9ICggJ29ud2hlZWwnIGluIGRvY3VtZW50IHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA+PSA5ICkgP1xuICAgICAgICAgICAgICAgICAgICBbJ3doZWVsJ10gOiBbJ21vdXNld2hlZWwnLCAnRG9tTW91c2VTY3JvbGwnLCAnTW96TW91c2VQaXhlbFNjcm9sbCddLFxuICAgICAgICBzbGljZSAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgICAgIG51bGxMb3dlc3REZWx0YVRpbWVvdXQsIGxvd2VzdERlbHRhO1xuXG4gICAgaWYgKCAkLmV2ZW50LmZpeEhvb2tzICkge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IHRvRml4Lmxlbmd0aDsgaTsgKSB7XG4gICAgICAgICAgICAkLmV2ZW50LmZpeEhvb2tzWyB0b0ZpeFstLWldIF0gPSAkLmV2ZW50Lm1vdXNlSG9va3M7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3BlY2lhbCA9ICQuZXZlbnQuc3BlY2lhbC5tb3VzZXdoZWVsID0ge1xuICAgICAgICB2ZXJzaW9uOiAnMy4xLjEyJyxcblxuICAgICAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IHRvQmluZC5sZW5ndGg7IGk7ICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoIHRvQmluZFstLWldLCBoYW5kbGVyLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbm1vdXNld2hlZWwgPSBoYW5kbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGxpbmUgaGVpZ2h0IGFuZCBwYWdlIGhlaWdodCBmb3IgdGhpcyBwYXJ0aWN1bGFyIGVsZW1lbnRcbiAgICAgICAgICAgICQuZGF0YSh0aGlzLCAnbW91c2V3aGVlbC1saW5lLWhlaWdodCcsIHNwZWNpYWwuZ2V0TGluZUhlaWdodCh0aGlzKSk7XG4gICAgICAgICAgICAkLmRhdGEodGhpcywgJ21vdXNld2hlZWwtcGFnZS1oZWlnaHQnLCBzcGVjaWFsLmdldFBhZ2VIZWlnaHQodGhpcykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuICAgICAgICAgICAgICAgIGZvciAoIHZhciBpID0gdG9CaW5kLmxlbmd0aDsgaTsgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciggdG9CaW5kWy0taV0sIGhhbmRsZXIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9ubW91c2V3aGVlbCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCB0aGUgZGF0YSB3ZSBhZGRlZCB0byB0aGUgZWxlbWVudFxuICAgICAgICAgICAgJC5yZW1vdmVEYXRhKHRoaXMsICdtb3VzZXdoZWVsLWxpbmUtaGVpZ2h0Jyk7XG4gICAgICAgICAgICAkLnJlbW92ZURhdGEodGhpcywgJ21vdXNld2hlZWwtcGFnZS1oZWlnaHQnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMaW5lSGVpZ2h0OiBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICB2YXIgJGVsZW0gPSAkKGVsZW0pLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxlbVsnb2Zmc2V0UGFyZW50JyBpbiAkLmZuID8gJ29mZnNldFBhcmVudCcgOiAncGFyZW50J10oKTtcbiAgICAgICAgICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJCgnYm9keScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCRwYXJlbnQuY3NzKCdmb250U2l6ZScpLCAxMCkgfHwgcGFyc2VJbnQoJGVsZW0uY3NzKCdmb250U2l6ZScpLCAxMCkgfHwgMTY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGFnZUhlaWdodDogZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgcmV0dXJuICQoZWxlbSkuaGVpZ2h0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgIGFkanVzdE9sZERlbHRhczogdHJ1ZSwgLy8gc2VlIHNob3VsZEFkanVzdE9sZERlbHRhcygpIGJlbG93XG4gICAgICAgICAgICBub3JtYWxpemVPZmZzZXQ6IHRydWUgIC8vIGNhbGxzIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmb3IgZWFjaCBldmVudFxuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuZm4uZXh0ZW5kKHtcbiAgICAgICAgbW91c2V3aGVlbDogZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbiA/IHRoaXMuYmluZCgnbW91c2V3aGVlbCcsIGZuKSA6IHRoaXMudHJpZ2dlcignbW91c2V3aGVlbCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVubW91c2V3aGVlbDogZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVuYmluZCgnbW91c2V3aGVlbCcsIGZuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIHZhciBvcmdFdmVudCAgID0gZXZlbnQgfHwgd2luZG93LmV2ZW50LFxuICAgICAgICAgICAgYXJncyAgICAgICA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgICAgIGRlbHRhICAgICAgPSAwLFxuICAgICAgICAgICAgZGVsdGFYICAgICA9IDAsXG4gICAgICAgICAgICBkZWx0YVkgICAgID0gMCxcbiAgICAgICAgICAgIGFic0RlbHRhICAgPSAwLFxuICAgICAgICAgICAgb2Zmc2V0WCAgICA9IDAsXG4gICAgICAgICAgICBvZmZzZXRZICAgID0gMDtcbiAgICAgICAgZXZlbnQgPSAkLmV2ZW50LmZpeChvcmdFdmVudCk7XG4gICAgICAgIGV2ZW50LnR5cGUgPSAnbW91c2V3aGVlbCc7XG5cbiAgICAgICAgLy8gT2xkIHNjaG9vbCBzY3JvbGx3aGVlbCBkZWx0YVxuICAgICAgICBpZiAoICdkZXRhaWwnICAgICAgaW4gb3JnRXZlbnQgKSB7IGRlbHRhWSA9IG9yZ0V2ZW50LmRldGFpbCAqIC0xOyAgICAgIH1cbiAgICAgICAgaWYgKCAnd2hlZWxEZWx0YScgIGluIG9yZ0V2ZW50ICkgeyBkZWx0YVkgPSBvcmdFdmVudC53aGVlbERlbHRhOyAgICAgICB9XG4gICAgICAgIGlmICggJ3doZWVsRGVsdGFZJyBpbiBvcmdFdmVudCApIHsgZGVsdGFZID0gb3JnRXZlbnQud2hlZWxEZWx0YVk7ICAgICAgfVxuICAgICAgICBpZiAoICd3aGVlbERlbHRhWCcgaW4gb3JnRXZlbnQgKSB7IGRlbHRhWCA9IG9yZ0V2ZW50LndoZWVsRGVsdGFYICogLTE7IH1cblxuICAgICAgICAvLyBGaXJlZm94IDwgMTcgaG9yaXpvbnRhbCBzY3JvbGxpbmcgcmVsYXRlZCB0byBET01Nb3VzZVNjcm9sbCBldmVudFxuICAgICAgICBpZiAoICdheGlzJyBpbiBvcmdFdmVudCAmJiBvcmdFdmVudC5heGlzID09PSBvcmdFdmVudC5IT1JJWk9OVEFMX0FYSVMgKSB7XG4gICAgICAgICAgICBkZWx0YVggPSBkZWx0YVkgKiAtMTtcbiAgICAgICAgICAgIGRlbHRhWSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgZGVsdGEgdG8gYmUgZGVsdGFZIG9yIGRlbHRhWCBpZiBkZWx0YVkgaXMgMCBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdGl5XG4gICAgICAgIGRlbHRhID0gZGVsdGFZID09PSAwID8gZGVsdGFYIDogZGVsdGFZO1xuXG4gICAgICAgIC8vIE5ldyBzY2hvb2wgd2hlZWwgZGVsdGEgKHdoZWVsIGV2ZW50KVxuICAgICAgICBpZiAoICdkZWx0YVknIGluIG9yZ0V2ZW50ICkge1xuICAgICAgICAgICAgZGVsdGFZID0gb3JnRXZlbnQuZGVsdGFZICogLTE7XG4gICAgICAgICAgICBkZWx0YSAgPSBkZWx0YVk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAnZGVsdGFYJyBpbiBvcmdFdmVudCApIHtcbiAgICAgICAgICAgIGRlbHRhWCA9IG9yZ0V2ZW50LmRlbHRhWDtcbiAgICAgICAgICAgIGlmICggZGVsdGFZID09PSAwICkgeyBkZWx0YSAgPSBkZWx0YVggKiAtMTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gY2hhbmdlIGFjdHVhbGx5IGhhcHBlbmVkLCBubyByZWFzb24gdG8gZ28gYW55IGZ1cnRoZXJcbiAgICAgICAgaWYgKCBkZWx0YVkgPT09IDAgJiYgZGVsdGFYID09PSAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBOZWVkIHRvIGNvbnZlcnQgbGluZXMgYW5kIHBhZ2VzIHRvIHBpeGVscyBpZiB3ZSBhcmVuJ3QgYWxyZWFkeSBpbiBwaXhlbHNcbiAgICAgICAgLy8gVGhlcmUgYXJlIHRocmVlIGRlbHRhIG1vZGVzOlxuICAgICAgICAvLyAgICogZGVsdGFNb2RlIDAgaXMgYnkgcGl4ZWxzLCBub3RoaW5nIHRvIGRvXG4gICAgICAgIC8vICAgKiBkZWx0YU1vZGUgMSBpcyBieSBsaW5lc1xuICAgICAgICAvLyAgICogZGVsdGFNb2RlIDIgaXMgYnkgcGFnZXNcbiAgICAgICAgaWYgKCBvcmdFdmVudC5kZWx0YU1vZGUgPT09IDEgKSB7XG4gICAgICAgICAgICB2YXIgbGluZUhlaWdodCA9ICQuZGF0YSh0aGlzLCAnbW91c2V3aGVlbC1saW5lLWhlaWdodCcpO1xuICAgICAgICAgICAgZGVsdGEgICo9IGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICBkZWx0YVkgKj0gbGluZUhlaWdodDtcbiAgICAgICAgICAgIGRlbHRhWCAqPSBsaW5lSGVpZ2h0O1xuICAgICAgICB9IGVsc2UgaWYgKCBvcmdFdmVudC5kZWx0YU1vZGUgPT09IDIgKSB7XG4gICAgICAgICAgICB2YXIgcGFnZUhlaWdodCA9ICQuZGF0YSh0aGlzLCAnbW91c2V3aGVlbC1wYWdlLWhlaWdodCcpO1xuICAgICAgICAgICAgZGVsdGEgICo9IHBhZ2VIZWlnaHQ7XG4gICAgICAgICAgICBkZWx0YVkgKj0gcGFnZUhlaWdodDtcbiAgICAgICAgICAgIGRlbHRhWCAqPSBwYWdlSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RvcmUgbG93ZXN0IGFic29sdXRlIGRlbHRhIHRvIG5vcm1hbGl6ZSB0aGUgZGVsdGEgdmFsdWVzXG4gICAgICAgIGFic0RlbHRhID0gTWF0aC5tYXgoIE1hdGguYWJzKGRlbHRhWSksIE1hdGguYWJzKGRlbHRhWCkgKTtcblxuICAgICAgICBpZiAoICFsb3dlc3REZWx0YSB8fCBhYnNEZWx0YSA8IGxvd2VzdERlbHRhICkge1xuICAgICAgICAgICAgbG93ZXN0RGVsdGEgPSBhYnNEZWx0YTtcblxuICAgICAgICAgICAgLy8gQWRqdXN0IG9sZGVyIGRlbHRhcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgIGlmICggc2hvdWxkQWRqdXN0T2xkRGVsdGFzKG9yZ0V2ZW50LCBhYnNEZWx0YSkgKSB7XG4gICAgICAgICAgICAgICAgbG93ZXN0RGVsdGEgLz0gNDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGp1c3Qgb2xkZXIgZGVsdGFzIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAoIHNob3VsZEFkanVzdE9sZERlbHRhcyhvcmdFdmVudCwgYWJzRGVsdGEpICkge1xuICAgICAgICAgICAgLy8gRGl2aWRlIGFsbCB0aGUgdGhpbmdzIGJ5IDQwIVxuICAgICAgICAgICAgZGVsdGEgIC89IDQwO1xuICAgICAgICAgICAgZGVsdGFYIC89IDQwO1xuICAgICAgICAgICAgZGVsdGFZIC89IDQwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IGEgd2hvbGUsIG5vcm1hbGl6ZWQgdmFsdWUgZm9yIHRoZSBkZWx0YXNcbiAgICAgICAgZGVsdGEgID0gTWF0aFsgZGVsdGEgID49IDEgPyAnZmxvb3InIDogJ2NlaWwnIF0oZGVsdGEgIC8gbG93ZXN0RGVsdGEpO1xuICAgICAgICBkZWx0YVggPSBNYXRoWyBkZWx0YVggPj0gMSA/ICdmbG9vcicgOiAnY2VpbCcgXShkZWx0YVggLyBsb3dlc3REZWx0YSk7XG4gICAgICAgIGRlbHRhWSA9IE1hdGhbIGRlbHRhWSA+PSAxID8gJ2Zsb29yJyA6ICdjZWlsJyBdKGRlbHRhWSAvIGxvd2VzdERlbHRhKTtcblxuICAgICAgICAvLyBOb3JtYWxpc2Ugb2Zmc2V0WCBhbmQgb2Zmc2V0WSBwcm9wZXJ0aWVzXG4gICAgICAgIGlmICggc3BlY2lhbC5zZXR0aW5ncy5ub3JtYWxpemVPZmZzZXQgJiYgdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QgKSB7XG4gICAgICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIG9mZnNldFggPSBldmVudC5jbGllbnRYIC0gYm91bmRpbmdSZWN0LmxlZnQ7XG4gICAgICAgICAgICBvZmZzZXRZID0gZXZlbnQuY2xpZW50WSAtIGJvdW5kaW5nUmVjdC50b3A7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgaW5mb3JtYXRpb24gdG8gdGhlIGV2ZW50IG9iamVjdFxuICAgICAgICBldmVudC5kZWx0YVggPSBkZWx0YVg7XG4gICAgICAgIGV2ZW50LmRlbHRhWSA9IGRlbHRhWTtcbiAgICAgICAgZXZlbnQuZGVsdGFGYWN0b3IgPSBsb3dlc3REZWx0YTtcbiAgICAgICAgZXZlbnQub2Zmc2V0WCA9IG9mZnNldFg7XG4gICAgICAgIGV2ZW50Lm9mZnNldFkgPSBvZmZzZXRZO1xuICAgICAgICAvLyBHbyBhaGVhZCBhbmQgc2V0IGRlbHRhTW9kZSB0byAwIHNpbmNlIHdlIGNvbnZlcnRlZCB0byBwaXhlbHNcbiAgICAgICAgLy8gQWx0aG91Z2ggdGhpcyBpcyBhIGxpdHRsZSBvZGQgc2luY2Ugd2Ugb3ZlcndyaXRlIHRoZSBkZWx0YVgvWVxuICAgICAgICAvLyBwcm9wZXJ0aWVzIHdpdGggbm9ybWFsaXplZCBkZWx0YXMuXG4gICAgICAgIGV2ZW50LmRlbHRhTW9kZSA9IDA7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IGFuZCBkZWx0YSB0byB0aGUgZnJvbnQgb2YgdGhlIGFyZ3VtZW50c1xuICAgICAgICBhcmdzLnVuc2hpZnQoZXZlbnQsIGRlbHRhLCBkZWx0YVgsIGRlbHRhWSk7XG5cbiAgICAgICAgLy8gQ2xlYXJvdXQgbG93ZXN0RGVsdGEgYWZ0ZXIgc29tZXRpbWUgdG8gYmV0dGVyXG4gICAgICAgIC8vIGhhbmRsZSBtdWx0aXBsZSBkZXZpY2UgdHlwZXMgdGhhdCBnaXZlIGRpZmZlcmVudFxuICAgICAgICAvLyBhIGRpZmZlcmVudCBsb3dlc3REZWx0YVxuICAgICAgICAvLyBFeDogdHJhY2twYWQgPSAzIGFuZCBtb3VzZSB3aGVlbCA9IDEyMFxuICAgICAgICBpZiAobnVsbExvd2VzdERlbHRhVGltZW91dCkgeyBjbGVhclRpbWVvdXQobnVsbExvd2VzdERlbHRhVGltZW91dCk7IH1cbiAgICAgICAgbnVsbExvd2VzdERlbHRhVGltZW91dCA9IHNldFRpbWVvdXQobnVsbExvd2VzdERlbHRhLCAyMDApO1xuXG4gICAgICAgIHJldHVybiAoJC5ldmVudC5kaXNwYXRjaCB8fCAkLmV2ZW50LmhhbmRsZSkuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbnVsbExvd2VzdERlbHRhKCkge1xuICAgICAgICBsb3dlc3REZWx0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvdWxkQWRqdXN0T2xkRGVsdGFzKG9yZ0V2ZW50LCBhYnNEZWx0YSkge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIG9sZGVyIGV2ZW50IGFuZCB0aGUgZGVsdGEgaXMgZGl2aXNhYmxlIGJ5IDEyMCxcbiAgICAgICAgLy8gdGhlbiB3ZSBhcmUgYXNzdW1pbmcgdGhhdCB0aGUgYnJvd3NlciBpcyB0cmVhdGluZyB0aGlzIGFzIGFuXG4gICAgICAgIC8vIG9sZGVyIG1vdXNlIHdoZWVsIGV2ZW50IGFuZCB0aGF0IHdlIHNob3VsZCBkaXZpZGUgdGhlIGRlbHRhc1xuICAgICAgICAvLyBieSA0MCB0byB0cnkgYW5kIGdldCBhIG1vcmUgdXNhYmxlIGRlbHRhRmFjdG9yLlxuICAgICAgICAvLyBTaWRlIG5vdGUsIHRoaXMgYWN0dWFsbHkgaW1wYWN0cyB0aGUgcmVwb3J0ZWQgc2Nyb2xsIGRpc3RhbmNlXG4gICAgICAgIC8vIGluIG9sZGVyIGJyb3dzZXJzIGFuZCBjYW4gY2F1c2Ugc2Nyb2xsaW5nIHRvIGJlIHNsb3dlciB0aGFuIG5hdGl2ZS5cbiAgICAgICAgLy8gVHVybiB0aGlzIG9mZiBieSBzZXR0aW5nICQuZXZlbnQuc3BlY2lhbC5tb3VzZXdoZWVsLnNldHRpbmdzLmFkanVzdE9sZERlbHRhcyB0byBmYWxzZS5cbiAgICAgICAgcmV0dXJuIHNwZWNpYWwuc2V0dGluZ3MuYWRqdXN0T2xkRGVsdGFzICYmIG9yZ0V2ZW50LnR5cGUgPT09ICdtb3VzZXdoZWVsJyAmJiBhYnNEZWx0YSAlIDEyMCA9PT0gMDtcbiAgICB9XG5cbn0pKTtcblxuUzIuZGVmaW5lKCdqcXVlcnkuc2VsZWN0MicsW1xuICAnanF1ZXJ5JyxcbiAgJ2pxdWVyeS1tb3VzZXdoZWVsJyxcblxuICAnLi9zZWxlY3QyL2NvcmUnLFxuICAnLi9zZWxlY3QyL2RlZmF1bHRzJyxcbiAgJy4vc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBfLCBTZWxlY3QyLCBEZWZhdWx0cywgVXRpbHMpIHtcbiAgaWYgKCQuZm4uc2VsZWN0MiA9PSBudWxsKSB7XG4gICAgLy8gQWxsIG1ldGhvZHMgdGhhdCBzaG91bGQgcmV0dXJuIHRoZSBlbGVtZW50XG4gICAgdmFyIHRoaXNNZXRob2RzID0gWydvcGVuJywgJ2Nsb3NlJywgJ2Rlc3Ryb3knXTtcblxuICAgICQuZm4uc2VsZWN0MiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBpbnN0YW5jZU9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgU2VsZWN0MigkKHRoaXMpLCBpbnN0YW5jZU9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBpbnN0YW5jZSA9IFV0aWxzLkdldERhdGEodGhpcywgJ3NlbGVjdDInKTtcblxuICAgICAgICAgIGlmIChpbnN0YW5jZSA9PSBudWxsICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICdUaGUgc2VsZWN0MihcXCcnICsgb3B0aW9ucyArICdcXCcpIG1ldGhvZCB3YXMgY2FsbGVkIG9uIGFuICcgK1xuICAgICAgICAgICAgICAnZWxlbWVudCB0aGF0IGlzIG5vdCB1c2luZyBTZWxlY3QyLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0ID0gaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBzaG91bGQgYmUgcmV0dXJuaW5nIGB0aGlzYFxuICAgICAgICBpZiAoJC5pbkFycmF5KG9wdGlvbnMsIHRoaXNNZXRob2RzKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cyBmb3IgU2VsZWN0MjogJyArIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAoJC5mbi5zZWxlY3QyLmRlZmF1bHRzID09IG51bGwpIHtcbiAgICAkLmZuLnNlbGVjdDIuZGVmYXVsdHMgPSBEZWZhdWx0cztcbiAgfVxuXG4gIHJldHVybiBTZWxlY3QyO1xufSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBBTUQgbG9hZGVyIGNvbmZpZ3VyYXRpb24gc28gaXQgY2FuIGJlIHVzZWQgb3V0c2lkZSBvZiB0aGlzIGZpbGVcbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IFMyLmRlZmluZSxcbiAgICByZXF1aXJlOiBTMi5yZXF1aXJlXG4gIH07XG59KCkpO1xuXG4gIC8vIEF1dG9sb2FkIHRoZSBqUXVlcnkgYmluZGluZ3NcbiAgLy8gV2Uga25vdyB0aGF0IGFsbCBvZiB0aGUgbW9kdWxlcyBleGlzdCBhYm92ZSB0aGlzLCBzbyB3ZSdyZSBzYWZlXG4gIHZhciBzZWxlY3QyID0gUzIucmVxdWlyZSgnanF1ZXJ5LnNlbGVjdDInKTtcblxuICAvLyBIb2xkIHRoZSBBTUQgbW9kdWxlIHJlZmVyZW5jZXMgb24gdGhlIGpRdWVyeSBmdW5jdGlvbiB0aGF0IHdhcyBqdXN0IGxvYWRlZFxuICAvLyBUaGlzIGFsbG93cyBTZWxlY3QyIHRvIHVzZSB0aGUgaW50ZXJuYWwgbG9hZGVyIG91dHNpZGUgb2YgdGhpcyBmaWxlLCBzdWNoXG4gIC8vIGFzIGluIHRoZSBsYW5ndWFnZSBmaWxlcy5cbiAgalF1ZXJ5LmZuLnNlbGVjdDIuYW1kID0gUzI7XG5cbiAgLy8gUmV0dXJuIHRoZSBTZWxlY3QyIGluc3RhbmNlIGZvciBhbnlvbmUgd2hvIGlzIGltcG9ydGluZyBpdC5cbiAgcmV0dXJuIHNlbGVjdDI7XG59KSk7XG4iXX0=