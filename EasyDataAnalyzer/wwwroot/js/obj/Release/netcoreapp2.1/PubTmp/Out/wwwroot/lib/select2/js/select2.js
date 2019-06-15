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
        S2.define('jquery-mousewheel', [
            'jquery'
        ], function ($) {
            // Used to shim jQuery.mousewheel for non-full builds.
            return $;
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0Mi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL29iai9SZWxlYXNlL25ldGNvcmVhcHAyLjEvUHViVG1wL091dC93d3dyb290L2xpYi9zZWxlY3QyL2pzL3NlbGVjdDIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsQ0FBQztBQUFBLENBQUMsVUFBVSxPQUFPO0lBQ2pCLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDOUMsd0NBQXdDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzdCO1NBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUN2RCxnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxNQUFNO1lBQ3JDLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsOERBQThEO2dCQUM5RCwyREFBMkQ7Z0JBQzNELDhEQUE4RDtnQkFDOUQscUNBQXFDO2dCQUNyQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtvQkFDakMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDNUI7cUJBQ0k7b0JBQ0gsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbEM7YUFDRjtZQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7S0FDSDtTQUFNO1FBQ0wsa0JBQWtCO1FBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUMsQ0FBRSxVQUFVLE1BQU07SUFDakIseUVBQXlFO0lBQ3pFLDZFQUE2RTtJ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Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEs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Y3QyIDQuMC43XG4gKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb290LCBqUXVlcnkpIHtcbiAgICAgIGlmIChqUXVlcnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyByZXF1aXJlKCdqUXVlcnknKSByZXR1cm5zIGEgZmFjdG9yeSB0aGF0IHJlcXVpcmVzIHdpbmRvdyB0b1xuICAgICAgICAvLyBidWlsZCBhIGpRdWVyeSBpbnN0YW5jZSwgd2Ugbm9ybWFsaXplIGhvdyB3ZSB1c2UgbW9kdWxlc1xuICAgICAgICAvLyB0aGF0IHJlcXVpcmUgdGhpcyBwYXR0ZXJuIGJ1dCB0aGUgd2luZG93IHByb3ZpZGVkIGlzIGEgbm9vcFxuICAgICAgICAvLyBpZiBpdCdzIGRlZmluZWQgKGhvdyBqcXVlcnkgd29ya3MpXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpKHJvb3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgICByZXR1cm4galF1ZXJ5O1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgZmFjdG9yeShqUXVlcnkpO1xuICB9XG59IChmdW5jdGlvbiAoalF1ZXJ5KSB7XG4gIC8vIFRoaXMgaXMgbmVlZGVkIHNvIHdlIGNhbiBjYXRjaCB0aGUgQU1EIGxvYWRlciBjb25maWd1cmF0aW9uIGFuZCB1c2UgaXRcbiAgLy8gVGhlIGlubmVyIGZpbGUgc2hvdWxkIGJlIHdyYXBwZWQgKGJ5IGBiYW5uZXIuc3RhcnQuanNgKSBpbiBhIGZ1bmN0aW9uIHRoYXRcbiAgLy8gcmV0dXJucyB0aGUgQU1EIGxvYWRlciByZWZlcmVuY2VzLlxuICB2YXIgUzIgPShmdW5jdGlvbiAoKSB7XG4gIC8vIFJlc3RvcmUgdGhlIFNlbGVjdDIgQU1EIGxvYWRlciBzbyBpdCBjYW4gYmUgdXNlZFxuICAvLyBOZWVkZWQgbW9zdGx5IGluIHRoZSBsYW5ndWFnZSBmaWxlcywgd2hlcmUgdGhlIGxvYWRlciBpcyBub3QgaW5zZXJ0ZWRcbiAgaWYgKGpRdWVyeSAmJiBqUXVlcnkuZm4gJiYgalF1ZXJ5LmZuLnNlbGVjdDIgJiYgalF1ZXJ5LmZuLnNlbGVjdDIuYW1kKSB7XG4gICAgdmFyIFMyID0galF1ZXJ5LmZuLnNlbGVjdDIuYW1kO1xuICB9XG52YXIgUzI7KGZ1bmN0aW9uICgpIHsgaWYgKCFTMiB8fCAhUzIucmVxdWlyZWpzKSB7XG5pZiAoIVMyKSB7IFMyID0ge307IH0gZWxzZSB7IHJlcXVpcmUgPSBTMjsgfVxuLyoqXG4gKiBAbGljZW5zZSBhbG1vbmQgMC4zLjMgQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMuXG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSwgaHR0cDovL2dpdGh1Yi5jb20vcmVxdWlyZWpzL2FsbW9uZC9MSUNFTlNFXG4gKi9cbi8vR29pbmcgc2xvcHB5IHRvIGF2b2lkICd1c2Ugc3RyaWN0JyBzdHJpbmcgY29zdCwgYnV0IHN0cmljdCBwcmFjdGljZXMgc2hvdWxkXG4vL2JlIGZvbGxvd2VkLlxuLypnbG9iYWwgc2V0VGltZW91dDogZmFsc2UgKi9cblxudmFyIHJlcXVpcmVqcywgcmVxdWlyZSwgZGVmaW5lO1xuKGZ1bmN0aW9uICh1bmRlZikge1xuICAgIHZhciBtYWluLCByZXEsIG1ha2VNYXAsIGhhbmRsZXJzLFxuICAgICAgICBkZWZpbmVkID0ge30sXG4gICAgICAgIHdhaXRpbmcgPSB7fSxcbiAgICAgICAgY29uZmlnID0ge30sXG4gICAgICAgIGRlZmluaW5nID0ge30sXG4gICAgICAgIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgIGFwcyA9IFtdLnNsaWNlLFxuICAgICAgICBqc1N1ZmZpeFJlZ0V4cCA9IC9cXC5qcyQvO1xuXG4gICAgZnVuY3Rpb24gaGFzUHJvcChvYmosIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIGhhc093bi5jYWxsKG9iaiwgcHJvcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSByZWxhdGl2ZSBtb2R1bGUgbmFtZSwgbGlrZSAuL3NvbWV0aGluZywgbm9ybWFsaXplIGl0IHRvXG4gICAgICogYSByZWFsIG5hbWUgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIGEgcGF0aC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgcmVsYXRpdmUgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlTmFtZSBhIHJlYWwgbmFtZSB0aGF0IHRoZSBuYW1lIGFyZyBpcyByZWxhdGl2ZVxuICAgICAqIHRvLlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IG5vcm1hbGl6ZWQgbmFtZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZShuYW1lLCBiYXNlTmFtZSkge1xuICAgICAgICB2YXIgbmFtZVBhcnRzLCBuYW1lU2VnbWVudCwgbWFwVmFsdWUsIGZvdW5kTWFwLCBsYXN0SW5kZXgsXG4gICAgICAgICAgICBmb3VuZEksIGZvdW5kU3Rhck1hcCwgc3RhckksIGksIGosIHBhcnQsIG5vcm1hbGl6ZWRCYXNlUGFydHMsXG4gICAgICAgICAgICBiYXNlUGFydHMgPSBiYXNlTmFtZSAmJiBiYXNlTmFtZS5zcGxpdChcIi9cIiksXG4gICAgICAgICAgICBtYXAgPSBjb25maWcubWFwLFxuICAgICAgICAgICAgc3Rhck1hcCA9IChtYXAgJiYgbWFwWycqJ10pIHx8IHt9O1xuXG4gICAgICAgIC8vQWRqdXN0IGFueSByZWxhdGl2ZSBwYXRocy5cbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICBsYXN0SW5kZXggPSBuYW1lLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIC8vIElmIHdhbnRpbmcgbm9kZSBJRCBjb21wYXRpYmlsaXR5LCBzdHJpcCAuanMgZnJvbSBlbmRcbiAgICAgICAgICAgIC8vIG9mIElEcy4gSGF2ZSB0byBkbyB0aGlzIGhlcmUsIGFuZCBub3QgaW4gbmFtZVRvVXJsXG4gICAgICAgICAgICAvLyBiZWNhdXNlIG5vZGUgYWxsb3dzIGVpdGhlciAuanMgb3Igbm9uIC5qcyB0byBtYXBcbiAgICAgICAgICAgIC8vIHRvIHNhbWUgZmlsZS5cbiAgICAgICAgICAgIGlmIChjb25maWcubm9kZUlkQ29tcGF0ICYmIGpzU3VmZml4UmVnRXhwLnRlc3QobmFtZVtsYXN0SW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIG5hbWVbbGFzdEluZGV4XSA9IG5hbWVbbGFzdEluZGV4XS5yZXBsYWNlKGpzU3VmZml4UmVnRXhwLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0YXJ0cyB3aXRoIGEgJy4nIHNvIG5lZWQgdGhlIGJhc2VOYW1lXG4gICAgICAgICAgICBpZiAobmFtZVswXS5jaGFyQXQoMCkgPT09ICcuJyAmJiBiYXNlUGFydHMpIHtcbiAgICAgICAgICAgICAgICAvL0NvbnZlcnQgYmFzZU5hbWUgdG8gYXJyYXksIGFuZCBsb3Agb2ZmIHRoZSBsYXN0IHBhcnQsXG4gICAgICAgICAgICAgICAgLy9zbyB0aGF0IC4gbWF0Y2hlcyB0aGF0ICdkaXJlY3RvcnknIGFuZCBub3QgbmFtZSBvZiB0aGUgYmFzZU5hbWUnc1xuICAgICAgICAgICAgICAgIC8vbW9kdWxlLiBGb3IgaW5zdGFuY2UsIGJhc2VOYW1lIG9mICdvbmUvdHdvL3RocmVlJywgbWFwcyB0b1xuICAgICAgICAgICAgICAgIC8vJ29uZS90d28vdGhyZWUuanMnLCBidXQgd2Ugd2FudCB0aGUgZGlyZWN0b3J5LCAnb25lL3R3bycgZm9yXG4gICAgICAgICAgICAgICAgLy90aGlzIG5vcm1hbGl6YXRpb24uXG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZEJhc2VQYXJ0cyA9IGJhc2VQYXJ0cy5zbGljZSgwLCBiYXNlUGFydHMubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZWRCYXNlUGFydHMuY29uY2F0KG5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3N0YXJ0IHRyaW1Eb3RzXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBhcnQgPSBuYW1lW2ldO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0ID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgYXQgdGhlIHN0YXJ0LCBvciBwcmV2aW91cyB2YWx1ZSBpcyBzdGlsbCAuLixcbiAgICAgICAgICAgICAgICAgICAgLy8ga2VlcCB0aGVtIHNvIHRoYXQgd2hlbiBjb252ZXJ0ZWQgdG8gYSBwYXRoIGl0IG1heVxuICAgICAgICAgICAgICAgICAgICAvLyBzdGlsbCB3b3JrIHdoZW4gY29udmVydGVkIHRvIGEgcGF0aCwgZXZlbiB0aG91Z2hcbiAgICAgICAgICAgICAgICAgICAgLy8gYXMgYW4gSUQgaXQgaXMgbGVzcyB0aGFuIGlkZWFsLiBJbiBsYXJnZXIgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVsZWFzZXMsIG1heSBiZSBiZXR0ZXIgdG8ganVzdCBraWNrIG91dCBhbiBlcnJvci5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgfHwgKGkgPT09IDEgJiYgbmFtZVsyXSA9PT0gJy4uJykgfHwgbmFtZVtpIC0gMV0gPT09ICcuLicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnNwbGljZShpIC0gMSwgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpIC09IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2VuZCB0cmltRG90c1xuXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5qb2luKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0FwcGx5IG1hcCBjb25maWcgaWYgYXZhaWxhYmxlLlxuICAgICAgICBpZiAoKGJhc2VQYXJ0cyB8fCBzdGFyTWFwKSAmJiBtYXApIHtcbiAgICAgICAgICAgIG5hbWVQYXJ0cyA9IG5hbWUuc3BsaXQoJy8nKTtcblxuICAgICAgICAgICAgZm9yIChpID0gbmFtZVBhcnRzLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgIG5hbWVTZWdtZW50ID0gbmFtZVBhcnRzLnNsaWNlKDAsIGkpLmpvaW4oXCIvXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAvL0ZpbmQgdGhlIGxvbmdlc3QgYmFzZU5hbWUgc2VnbWVudCBtYXRjaCBpbiB0aGUgY29uZmlnLlxuICAgICAgICAgICAgICAgICAgICAvL1NvLCBkbyBqb2lucyBvbiB0aGUgYmlnZ2VzdCB0byBzbWFsbGVzdCBsZW5ndGhzIG9mIGJhc2VQYXJ0cy5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmFzZVBhcnRzLmxlbmd0aDsgaiA+IDA7IGogLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwVmFsdWUgPSBtYXBbYmFzZVBhcnRzLnNsaWNlKDAsIGopLmpvaW4oJy8nKV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYmFzZU5hbWUgc2VnbWVudCBoYXMgIGNvbmZpZywgZmluZCBpZiBpdCBoYXMgb25lIGZvclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIG5hbWUuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IG1hcFZhbHVlW25hbWVTZWdtZW50XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9NYXRjaCwgdXBkYXRlIG5hbWUgdG8gdGhlIG5ldyB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRNYXAgPSBtYXBWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQ2hlY2sgZm9yIGEgc3RhciBtYXAgbWF0Y2gsIGJ1dCBqdXN0IGhvbGQgb24gdG8gaXQsXG4gICAgICAgICAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHNob3J0ZXIgc2VnbWVudCBtYXRjaCBsYXRlciBpbiBhIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgLy9jb25maWcsIHRoZW4gZmF2b3Igb3ZlciB0aGlzIHN0YXIgbWFwLlxuICAgICAgICAgICAgICAgIGlmICghZm91bmRTdGFyTWFwICYmIHN0YXJNYXAgJiYgc3Rhck1hcFtuYW1lU2VnbWVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmRTdGFyTWFwID0gc3Rhck1hcFtuYW1lU2VnbWVudF07XG4gICAgICAgICAgICAgICAgICAgIHN0YXJJID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZm91bmRNYXAgJiYgZm91bmRTdGFyTWFwKSB7XG4gICAgICAgICAgICAgICAgZm91bmRNYXAgPSBmb3VuZFN0YXJNYXA7XG4gICAgICAgICAgICAgICAgZm91bmRJID0gc3Rhckk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3VuZE1hcCkge1xuICAgICAgICAgICAgICAgIG5hbWVQYXJ0cy5zcGxpY2UoMCwgZm91bmRJLCBmb3VuZE1hcCk7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWVQYXJ0cy5qb2luKCcvJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlUmVxdWlyZShyZWxOYW1lLCBmb3JjZVN5bmMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vQSB2ZXJzaW9uIG9mIGEgcmVxdWlyZSBmdW5jdGlvbiB0aGF0IHBhc3NlcyBhIG1vZHVsZU5hbWVcbiAgICAgICAgICAgIC8vdmFsdWUgZm9yIGl0ZW1zIHRoYXQgbWF5IG5lZWQgdG9cbiAgICAgICAgICAgIC8vbG9vayB1cCBwYXRocyByZWxhdGl2ZSB0byB0aGUgbW9kdWxlTmFtZVxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAvL0lmIGZpcnN0IGFyZyBpcyBub3QgcmVxdWlyZSgnc3RyaW5nJyksIGFuZCB0aGVyZSBpcyBvbmx5XG4gICAgICAgICAgICAvL29uZSBhcmcsIGl0IGlzIHRoZSBhcnJheSBmb3JtIHdpdGhvdXQgYSBjYWxsYmFjay4gSW5zZXJ0XG4gICAgICAgICAgICAvL2EgbnVsbCBzbyB0aGF0IHRoZSBmb2xsb3dpbmcgY29uY2F0IGlzIGNvcnJlY3QuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnICYmIGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcS5hcHBseSh1bmRlZiwgYXJncy5jb25jYXQoW3JlbE5hbWUsIGZvcmNlU3luY10pKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTm9ybWFsaXplKHJlbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9ybWFsaXplKG5hbWUsIHJlbE5hbWUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMb2FkKGRlcE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lZFtkZXBOYW1lXSA9IHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGxEZXAobmFtZSkge1xuICAgICAgICBpZiAoaGFzUHJvcCh3YWl0aW5nLCBuYW1lKSkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSB3YWl0aW5nW25hbWVdO1xuICAgICAgICAgICAgZGVsZXRlIHdhaXRpbmdbbmFtZV07XG4gICAgICAgICAgICBkZWZpbmluZ1tuYW1lXSA9IHRydWU7XG4gICAgICAgICAgICBtYWluLmFwcGx5KHVuZGVmLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBuYW1lKSAmJiAhaGFzUHJvcChkZWZpbmluZywgbmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZpbmVkW25hbWVdO1xuICAgIH1cblxuICAgIC8vVHVybnMgYSBwbHVnaW4hcmVzb3VyY2UgdG8gW3BsdWdpbiwgcmVzb3VyY2VdXG4gICAgLy93aXRoIHRoZSBwbHVnaW4gYmVpbmcgdW5kZWZpbmVkIGlmIHRoZSBuYW1lXG4gICAgLy9kaWQgbm90IGhhdmUgYSBwbHVnaW4gcHJlZml4LlxuICAgIGZ1bmN0aW9uIHNwbGl0UHJlZml4KG5hbWUpIHtcbiAgICAgICAgdmFyIHByZWZpeCxcbiAgICAgICAgICAgIGluZGV4ID0gbmFtZSA/IG5hbWUuaW5kZXhPZignIScpIDogLTE7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoaW5kZXggKyAxLCBuYW1lLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwcmVmaXgsIG5hbWVdO1xuICAgIH1cblxuICAgIC8vQ3JlYXRlcyBhIHBhcnRzIGFycmF5IGZvciBhIHJlbE5hbWUgd2hlcmUgZmlyc3QgcGFydCBpcyBwbHVnaW4gSUQsXG4gICAgLy9zZWNvbmQgcGFydCBpcyByZXNvdXJjZSBJRC4gQXNzdW1lcyByZWxOYW1lIGhhcyBhbHJlYWR5IGJlZW4gbm9ybWFsaXplZC5cbiAgICBmdW5jdGlvbiBtYWtlUmVsUGFydHMocmVsTmFtZSkge1xuICAgICAgICByZXR1cm4gcmVsTmFtZSA/IHNwbGl0UHJlZml4KHJlbE5hbWUpIDogW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBuYW1lIG1hcCwgbm9ybWFsaXppbmcgdGhlIG5hbWUsIGFuZCB1c2luZyBhIHBsdWdpblxuICAgICAqIGZvciBub3JtYWxpemF0aW9uIGlmIG5lY2Vzc2FyeS4gR3JhYnMgYSByZWYgdG8gcGx1Z2luXG4gICAgICogdG9vLCBhcyBhbiBvcHRpbWl6YXRpb24uXG4gICAgICovXG4gICAgbWFrZU1hcCA9IGZ1bmN0aW9uIChuYW1lLCByZWxQYXJ0cykge1xuICAgICAgICB2YXIgcGx1Z2luLFxuICAgICAgICAgICAgcGFydHMgPSBzcGxpdFByZWZpeChuYW1lKSxcbiAgICAgICAgICAgIHByZWZpeCA9IHBhcnRzWzBdLFxuICAgICAgICAgICAgcmVsUmVzb3VyY2VOYW1lID0gcmVsUGFydHNbMV07XG5cbiAgICAgICAgbmFtZSA9IHBhcnRzWzFdO1xuXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHByZWZpeCA9IG5vcm1hbGl6ZShwcmVmaXgsIHJlbFJlc291cmNlTmFtZSk7XG4gICAgICAgICAgICBwbHVnaW4gPSBjYWxsRGVwKHByZWZpeCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL05vcm1hbGl6ZSBhY2NvcmRpbmdcbiAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgICAgaWYgKHBsdWdpbiAmJiBwbHVnaW4ubm9ybWFsaXplKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHBsdWdpbi5ub3JtYWxpemUobmFtZSwgbWFrZU5vcm1hbGl6ZShyZWxSZXNvdXJjZU5hbWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZShuYW1lLCByZWxSZXNvdXJjZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZShuYW1lLCByZWxSZXNvdXJjZU5hbWUpO1xuICAgICAgICAgICAgcGFydHMgPSBzcGxpdFByZWZpeChuYW1lKTtcbiAgICAgICAgICAgIHByZWZpeCA9IHBhcnRzWzBdO1xuICAgICAgICAgICAgbmFtZSA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgICAgICAgIHBsdWdpbiA9IGNhbGxEZXAocHJlZml4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vVXNpbmcgcmlkaWN1bG91cyBwcm9wZXJ0eSBuYW1lcyBmb3Igc3BhY2UgcmVhc29uc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZjogcHJlZml4ID8gcHJlZml4ICsgJyEnICsgbmFtZSA6IG5hbWUsIC8vZnVsbE5hbWVcbiAgICAgICAgICAgIG46IG5hbWUsXG4gICAgICAgICAgICBwcjogcHJlZml4LFxuICAgICAgICAgICAgcDogcGx1Z2luXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG1ha2VDb25maWcobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChjb25maWcgJiYgY29uZmlnLmNvbmZpZyAmJiBjb25maWcuY29uZmlnW25hbWVdKSB8fCB7fTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBoYW5kbGVycyA9IHtcbiAgICAgICAgcmVxdWlyZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBtYWtlUmVxdWlyZShuYW1lKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXhwb3J0czogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBlID0gZGVmaW5lZFtuYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkZWZpbmVkW25hbWVdID0ge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb2R1bGU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiBuYW1lLFxuICAgICAgICAgICAgICAgIHVyaTogJycsXG4gICAgICAgICAgICAgICAgZXhwb3J0czogZGVmaW5lZFtuYW1lXSxcbiAgICAgICAgICAgICAgICBjb25maWc6IG1ha2VDb25maWcobmFtZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbWFpbiA9IGZ1bmN0aW9uIChuYW1lLCBkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSkge1xuICAgICAgICB2YXIgY2pzTW9kdWxlLCBkZXBOYW1lLCByZXQsIG1hcCwgaSwgcmVsUGFydHMsXG4gICAgICAgICAgICBhcmdzID0gW10sXG4gICAgICAgICAgICBjYWxsYmFja1R5cGUgPSB0eXBlb2YgY2FsbGJhY2ssXG4gICAgICAgICAgICB1c2luZ0V4cG9ydHM7XG5cbiAgICAgICAgLy9Vc2UgbmFtZSBpZiBubyByZWxOYW1lXG4gICAgICAgIHJlbE5hbWUgPSByZWxOYW1lIHx8IG5hbWU7XG4gICAgICAgIHJlbFBhcnRzID0gbWFrZVJlbFBhcnRzKHJlbE5hbWUpO1xuXG4gICAgICAgIC8vQ2FsbCB0aGUgY2FsbGJhY2sgdG8gZGVmaW5lIHRoZSBtb2R1bGUsIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgaWYgKGNhbGxiYWNrVHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgY2FsbGJhY2tUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvL1B1bGwgb3V0IHRoZSBkZWZpbmVkIGRlcGVuZGVuY2llcyBhbmQgcGFzcyB0aGUgb3JkZXJlZFxuICAgICAgICAgICAgLy92YWx1ZXMgdG8gdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgLy9EZWZhdWx0IHRvIFtyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGVdIGlmIG5vIGRlcHNcbiAgICAgICAgICAgIGRlcHMgPSAhZGVwcy5sZW5ndGggJiYgY2FsbGJhY2subGVuZ3RoID8gWydyZXF1aXJlJywgJ2V4cG9ydHMnLCAnbW9kdWxlJ10gOiBkZXBzO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtYXAgPSBtYWtlTWFwKGRlcHNbaV0sIHJlbFBhcnRzKTtcbiAgICAgICAgICAgICAgICBkZXBOYW1lID0gbWFwLmY7XG5cbiAgICAgICAgICAgICAgICAvL0Zhc3QgcGF0aCBDb21tb25KUyBzdGFuZGFyZCBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICAgICAgaWYgKGRlcE5hbWUgPT09IFwicmVxdWlyZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBoYW5kbGVycy5yZXF1aXJlKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZSA9PT0gXCJleHBvcnRzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Db21tb25KUyBtb2R1bGUgc3BlYyAxLjFcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGhhbmRsZXJzLmV4cG9ydHMobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHVzaW5nRXhwb3J0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBOYW1lID09PSBcIm1vZHVsZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ29tbW9uSlMgbW9kdWxlIHNwZWMgMS4xXG4gICAgICAgICAgICAgICAgICAgIGNqc01vZHVsZSA9IGFyZ3NbaV0gPSBoYW5kbGVycy5tb2R1bGUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNQcm9wKGRlZmluZWQsIGRlcE5hbWUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNQcm9wKHdhaXRpbmcsIGRlcE5hbWUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNQcm9wKGRlZmluaW5nLCBkZXBOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gY2FsbERlcChkZXBOYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hcC5wKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcC5wLmxvYWQobWFwLm4sIG1ha2VSZXF1aXJlKHJlbE5hbWUsIHRydWUpLCBtYWtlTG9hZChkZXBOYW1lKSwge30pO1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gZGVmaW5lZFtkZXBOYW1lXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgbWlzc2luZyAnICsgZGVwTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXQgPSBjYWxsYmFjayA/IGNhbGxiYWNrLmFwcGx5KGRlZmluZWRbbmFtZV0sIGFyZ3MpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgICAgIC8vSWYgc2V0dGluZyBleHBvcnRzIHZpYSBcIm1vZHVsZVwiIGlzIGluIHBsYXksXG4gICAgICAgICAgICAgICAgLy9mYXZvciB0aGF0IG92ZXIgcmV0dXJuIHZhbHVlIGFuZCBleHBvcnRzLiBBZnRlciB0aGF0LFxuICAgICAgICAgICAgICAgIC8vZmF2b3IgYSBub24tdW5kZWZpbmVkIHJldHVybiB2YWx1ZSBvdmVyIGV4cG9ydHMgdXNlLlxuICAgICAgICAgICAgICAgIGlmIChjanNNb2R1bGUgJiYgY2pzTW9kdWxlLmV4cG9ydHMgIT09IHVuZGVmICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjanNNb2R1bGUuZXhwb3J0cyAhPT0gZGVmaW5lZFtuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVkW25hbWVdID0gY2pzTW9kdWxlLmV4cG9ydHM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXQgIT09IHVuZGVmIHx8ICF1c2luZ0V4cG9ydHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Vc2UgdGhlIHJldHVybiB2YWx1ZSBmcm9tIHRoZSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IHJldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSkge1xuICAgICAgICAgICAgLy9NYXkganVzdCBiZSBhbiBvYmplY3QgZGVmaW5pdGlvbiBmb3IgdGhlIG1vZHVsZS4gT25seVxuICAgICAgICAgICAgLy93b3JyeSBhYm91dCBkZWZpbmluZyBpZiBoYXZlIGEgbW9kdWxlIG5hbWUuXG4gICAgICAgICAgICBkZWZpbmVkW25hbWVdID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVxdWlyZWpzID0gcmVxdWlyZSA9IHJlcSA9IGZ1bmN0aW9uIChkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSwgZm9yY2VTeW5jLCBhbHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkZXBzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlcnNbZGVwc10pIHtcbiAgICAgICAgICAgICAgICAvL2NhbGxiYWNrIGluIHRoaXMgY2FzZSBpcyByZWFsbHkgcmVsTmFtZVxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVyc1tkZXBzXShjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL0p1c3QgcmV0dXJuIHRoZSBtb2R1bGUgd2FudGVkLiBJbiB0aGlzIHNjZW5hcmlvLCB0aGVcbiAgICAgICAgICAgIC8vZGVwcyBhcmcgaXMgdGhlIG1vZHVsZSBuYW1lLCBhbmQgc2Vjb25kIGFyZyAoaWYgcGFzc2VkKVxuICAgICAgICAgICAgLy9pcyBqdXN0IHRoZSByZWxOYW1lLlxuICAgICAgICAgICAgLy9Ob3JtYWxpemUgbW9kdWxlIG5hbWUsIGlmIGl0IGNvbnRhaW5zIC4gb3IgLi5cbiAgICAgICAgICAgIHJldHVybiBjYWxsRGVwKG1ha2VNYXAoZGVwcywgbWFrZVJlbFBhcnRzKGNhbGxiYWNrKSkuZik7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRlcHMuc3BsaWNlKSB7XG4gICAgICAgICAgICAvL2RlcHMgaXMgYSBjb25maWcgb2JqZWN0LCBub3QgYW4gYXJyYXkuXG4gICAgICAgICAgICBjb25maWcgPSBkZXBzO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5kZXBzKSB7XG4gICAgICAgICAgICAgICAgcmVxKGNvbmZpZy5kZXBzLCBjb25maWcuY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLnNwbGljZSkge1xuICAgICAgICAgICAgICAgIC8vY2FsbGJhY2sgaXMgYW4gYXJyYXksIHdoaWNoIG1lYW5zIGl0IGlzIGEgZGVwZW5kZW5jeSBsaXN0LlxuICAgICAgICAgICAgICAgIC8vQWRqdXN0IGFyZ3MgaWYgdGhlcmUgYXJlIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgIGRlcHMgPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IHJlbE5hbWU7XG4gICAgICAgICAgICAgICAgcmVsTmFtZSA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcHMgPSB1bmRlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU3VwcG9ydCByZXF1aXJlKFsnYSddKVxuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIC8vSWYgcmVsTmFtZSBpcyBhIGZ1bmN0aW9uLCBpdCBpcyBhbiBlcnJiYWNrIGhhbmRsZXIsXG4gICAgICAgIC8vc28gcmVtb3ZlIGl0LlxuICAgICAgICBpZiAodHlwZW9mIHJlbE5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJlbE5hbWUgPSBmb3JjZVN5bmM7XG4gICAgICAgICAgICBmb3JjZVN5bmMgPSBhbHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL1NpbXVsYXRlIGFzeW5jIGNhbGxiYWNrO1xuICAgICAgICBpZiAoZm9yY2VTeW5jKSB7XG4gICAgICAgICAgICBtYWluKHVuZGVmLCBkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL1VzaW5nIGEgbm9uLXplcm8gdmFsdWUgYmVjYXVzZSBvZiBjb25jZXJuIGZvciB3aGF0IG9sZCBicm93c2Vyc1xuICAgICAgICAgICAgLy9kbywgYW5kIGxhdGVzdCBicm93c2VycyBcInVwZ3JhZGVcIiB0byA0IGlmIGxvd2VyIHZhbHVlIGlzIHVzZWQ6XG4gICAgICAgICAgICAvL2h0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3RpbWVycy5odG1sI2RvbS13aW5kb3d0aW1lcnMtc2V0dGltZW91dDpcbiAgICAgICAgICAgIC8vSWYgd2FudCBhIHZhbHVlIGltbWVkaWF0ZWx5LCB1c2UgcmVxdWlyZSgnaWQnKSBpbnN0ZWFkIC0tIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy90aGF0IHdvcmtzIGluIGFsbW9uZCBvbiB0aGUgZ2xvYmFsIGxldmVsLCBidXQgbm90IGd1YXJhbnRlZWQgYW5kXG4gICAgICAgICAgICAvL3VubGlrZWx5IHRvIHdvcmsgaW4gb3RoZXIgQU1EIGltcGxlbWVudGF0aW9ucy5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1haW4odW5kZWYsIGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lKTtcbiAgICAgICAgICAgIH0sIDQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSnVzdCBkcm9wcyB0aGUgY29uZmlnIG9uIHRoZSBmbG9vciwgYnV0IHJldHVybnMgcmVxIGluIGNhc2VcbiAgICAgKiB0aGUgY29uZmlnIHJldHVybiB2YWx1ZSBpcyB1c2VkLlxuICAgICAqL1xuICAgIHJlcS5jb25maWcgPSBmdW5jdGlvbiAoY2ZnKSB7XG4gICAgICAgIHJldHVybiByZXEoY2ZnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIG1vZHVsZSByZWdpc3RyeSBmb3IgZGVidWdnaW5nIGFuZCB0b29saW5nXG4gICAgICovXG4gICAgcmVxdWlyZWpzLl9kZWZpbmVkID0gZGVmaW5lZDtcblxuICAgIGRlZmluZSA9IGZ1bmN0aW9uIChuYW1lLCBkZXBzLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlZSBhbG1vbmQgUkVBRE1FOiBpbmNvcnJlY3QgbW9kdWxlIGJ1aWxkLCBubyBtb2R1bGUgbmFtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIG1vZHVsZSBtYXkgbm90IGhhdmUgZGVwZW5kZW5jaWVzXG4gICAgICAgIGlmICghZGVwcy5zcGxpY2UpIHtcbiAgICAgICAgICAgIC8vZGVwcyBpcyBub3QgYW4gYXJyYXksIHNvIHByb2JhYmx5IG1lYW5zXG4gICAgICAgICAgICAvL2FuIG9iamVjdCBsaXRlcmFsIG9yIGZhY3RvcnkgZnVuY3Rpb24gZm9yXG4gICAgICAgICAgICAvL3RoZSB2YWx1ZS4gQWRqdXN0IGFyZ3MuXG4gICAgICAgICAgICBjYWxsYmFjayA9IGRlcHM7XG4gICAgICAgICAgICBkZXBzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgbmFtZSkgJiYgIWhhc1Byb3Aod2FpdGluZywgbmFtZSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdbbmFtZV0gPSBbbmFtZSwgZGVwcywgY2FsbGJhY2tdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRlZmluZS5hbWQgPSB7XG4gICAgICAgIGpRdWVyeTogdHJ1ZVxuICAgIH07XG59KCkpO1xuXG5TMi5yZXF1aXJlanMgPSByZXF1aXJlanM7UzIucmVxdWlyZSA9IHJlcXVpcmU7UzIuZGVmaW5lID0gZGVmaW5lO1xufVxufSgpKTtcblMyLmRlZmluZShcImFsbW9uZFwiLCBmdW5jdGlvbigpe30pO1xuXG4vKiBnbG9iYWwgalF1ZXJ5OmZhbHNlLCAkOmZhbHNlICovXG5TMi5kZWZpbmUoJ2pxdWVyeScsW10sZnVuY3Rpb24gKCkge1xuICB2YXIgXyQgPSBqUXVlcnkgfHwgJDtcblxuICBpZiAoXyQgPT0gbnVsbCAmJiBjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFxuICAgICAgJ1NlbGVjdDI6IEFuIGluc3RhbmNlIG9mIGpRdWVyeSBvciBhIGpRdWVyeS1jb21wYXRpYmxlIGxpYnJhcnkgd2FzIG5vdCAnICtcbiAgICAgICdmb3VuZC4gTWFrZSBzdXJlIHRoYXQgeW91IGFyZSBpbmNsdWRpbmcgalF1ZXJ5IGJlZm9yZSBTZWxlY3QyIG9uIHlvdXIgJyArXG4gICAgICAnd2ViIHBhZ2UuJ1xuICAgICk7XG4gIH1cblxuICByZXR1cm4gXyQ7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3V0aWxzJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICB2YXIgVXRpbHMgPSB7fTtcblxuICBVdGlscy5FeHRlbmQgPSBmdW5jdGlvbiAoQ2hpbGRDbGFzcywgU3VwZXJDbGFzcykge1xuICAgIHZhciBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICAgIGZ1bmN0aW9uIEJhc2VDb25zdHJ1Y3RvciAoKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gQ2hpbGRDbGFzcztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gU3VwZXJDbGFzcykge1xuICAgICAgaWYgKF9faGFzUHJvcC5jYWxsKFN1cGVyQ2xhc3MsIGtleSkpIHtcbiAgICAgICAgQ2hpbGRDbGFzc1trZXldID0gU3VwZXJDbGFzc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIEJhc2VDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBTdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBCYXNlQ29uc3RydWN0b3IoKTtcbiAgICBDaGlsZENsYXNzLl9fc3VwZXJfXyA9IFN1cGVyQ2xhc3MucHJvdG90eXBlO1xuXG4gICAgcmV0dXJuIENoaWxkQ2xhc3M7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0TWV0aG9kcyAodGhlQ2xhc3MpIHtcbiAgICB2YXIgcHJvdG8gPSB0aGVDbGFzcy5wcm90b3R5cGU7XG5cbiAgICB2YXIgbWV0aG9kcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiBwcm90bykge1xuICAgICAgdmFyIG0gPSBwcm90b1ttZXRob2ROYW1lXTtcblxuICAgICAgaWYgKHR5cGVvZiBtICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobWV0aG9kTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbWV0aG9kcy5wdXNoKG1ldGhvZE5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRob2RzO1xuICB9XG5cbiAgVXRpbHMuRGVjb3JhdGUgPSBmdW5jdGlvbiAoU3VwZXJDbGFzcywgRGVjb3JhdG9yQ2xhc3MpIHtcbiAgICB2YXIgZGVjb3JhdGVkTWV0aG9kcyA9IGdldE1ldGhvZHMoRGVjb3JhdG9yQ2xhc3MpO1xuICAgIHZhciBzdXBlck1ldGhvZHMgPSBnZXRNZXRob2RzKFN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gRGVjb3JhdGVkQ2xhc3MgKCkge1xuICAgICAgdmFyIHVuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcblxuICAgICAgdmFyIGFyZ0NvdW50ID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yLmxlbmd0aDtcblxuICAgICAgdmFyIGNhbGxlZENvbnN0cnVjdG9yID0gU3VwZXJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3I7XG5cbiAgICAgIGlmIChhcmdDb3VudCA+IDApIHtcbiAgICAgICAgdW5zaGlmdC5jYWxsKGFyZ3VtZW50cywgU3VwZXJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IpO1xuXG4gICAgICAgIGNhbGxlZENvbnN0cnVjdG9yID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICAgICAgfVxuXG4gICAgICBjYWxsZWRDb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIERlY29yYXRvckNsYXNzLmRpc3BsYXlOYW1lID0gU3VwZXJDbGFzcy5kaXNwbGF5TmFtZTtcblxuICAgIGZ1bmN0aW9uIGN0ciAoKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gRGVjb3JhdGVkQ2xhc3M7XG4gICAgfVxuXG4gICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlID0gbmV3IGN0cigpO1xuXG4gICAgZm9yICh2YXIgbSA9IDA7IG0gPCBzdXBlck1ldGhvZHMubGVuZ3RoOyBtKyspIHtcbiAgICAgIHZhciBzdXBlck1ldGhvZCA9IHN1cGVyTWV0aG9kc1ttXTtcblxuICAgICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW3N1cGVyTWV0aG9kXSA9XG4gICAgICAgIFN1cGVyQ2xhc3MucHJvdG90eXBlW3N1cGVyTWV0aG9kXTtcbiAgICB9XG5cbiAgICB2YXIgY2FsbGVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICAgIC8vIFN0dWIgb3V0IHRoZSBvcmlnaW5hbCBtZXRob2QgaWYgaXQncyBub3QgZGVjb3JhdGluZyBhbiBhY3R1YWwgbWV0aG9kXG4gICAgICB2YXIgb3JpZ2luYWxNZXRob2QgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgaWYgKG1ldGhvZE5hbWUgaW4gRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlKSB7XG4gICAgICAgIG9yaWdpbmFsTWV0aG9kID0gRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVjb3JhdGVkTWV0aG9kID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xuXG4gICAgICAgIHVuc2hpZnQuY2FsbChhcmd1bWVudHMsIG9yaWdpbmFsTWV0aG9kKTtcblxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRlY29yYXRlZE1ldGhvZHMubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBkZWNvcmF0ZWRNZXRob2QgPSBkZWNvcmF0ZWRNZXRob2RzW2RdO1xuXG4gICAgICBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGVbZGVjb3JhdGVkTWV0aG9kXSA9IGNhbGxlZE1ldGhvZChkZWNvcmF0ZWRNZXRob2QpO1xuICAgIH1cblxuICAgIHJldHVybiBEZWNvcmF0ZWRDbGFzcztcbiAgfTtcblxuICB2YXIgT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9O1xuXG4gIE9ic2VydmFibGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMubGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMgfHwge307XG5cbiAgICBpZiAoZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdID0gW2NhbGxiYWNrXTtcbiAgICB9XG4gIH07XG5cbiAgT2JzZXJ2YWJsZS5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbiAgICB2YXIgcGFyYW1zID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdGhpcy5saXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyB8fCB7fTtcblxuICAgIC8vIFBhcmFtcyBzaG91bGQgYWx3YXlzIGNvbWUgaW4gYXMgYW4gYXJyYXlcbiAgICBpZiAocGFyYW1zID09IG51bGwpIHtcbiAgICAgIHBhcmFtcyA9IFtdO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBhcmd1bWVudHMgdG8gdGhlIGV2ZW50LCB1c2UgYSB0ZW1wb3Jhcnkgb2JqZWN0XG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKHt9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGBfdHlwZWAgb2YgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgZXZlbnRcbiAgICBwYXJhbXNbMF0uX3R5cGUgPSBldmVudDtcblxuICAgIGlmIChldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgdGhpcy5pbnZva2UodGhpcy5saXN0ZW5lcnNbZXZlbnRdLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIH1cblxuICAgIGlmICgnKicgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuaW52b2tlKHRoaXMubGlzdGVuZXJzWycqJ10sIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuXG4gIE9ic2VydmFibGUucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcnMsIHBhcmFtcykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBwYXJhbXMpO1xuICAgIH1cbiAgfTtcblxuICBVdGlscy5PYnNlcnZhYmxlID0gT2JzZXJ2YWJsZTtcblxuICBVdGlscy5nZW5lcmF0ZUNoYXJzID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHZhciBjaGFycyA9ICcnO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJhbmRvbUNoYXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzNik7XG4gICAgICBjaGFycyArPSByYW5kb21DaGFyLnRvU3RyaW5nKDM2KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhcnM7XG4gIH07XG5cbiAgVXRpbHMuYmluZCA9IGZ1bmN0aW9uIChmdW5jLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIFV0aWxzLl9jb252ZXJ0RGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZm9yICh2YXIgb3JpZ2luYWxLZXkgaW4gZGF0YSkge1xuICAgICAgdmFyIGtleXMgPSBvcmlnaW5hbEtleS5zcGxpdCgnLScpO1xuXG4gICAgICB2YXIgZGF0YUxldmVsID0gZGF0YTtcblxuICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNba107XG5cbiAgICAgICAgLy8gTG93ZXJjYXNlIHRoZSBmaXJzdCBsZXR0ZXJcbiAgICAgICAgLy8gQnkgZGVmYXVsdCwgZGFzaC1zZXBhcmF0ZWQgYmVjb21lcyBjYW1lbENhc2VcbiAgICAgICAga2V5ID0ga2V5LnN1YnN0cmluZygwLCAxKS50b0xvd2VyQ2FzZSgpICsga2V5LnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIShrZXkgaW4gZGF0YUxldmVsKSkge1xuICAgICAgICAgIGRhdGFMZXZlbFtrZXldID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoayA9PSBrZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkYXRhTGV2ZWxba2V5XSA9IGRhdGFbb3JpZ2luYWxLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YUxldmVsID0gZGF0YUxldmVsW2tleV07XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBkYXRhW29yaWdpbmFsS2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBVdGlscy5oYXNTY3JvbGwgPSBmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XG4gICAgLy8gQWRhcHRlZCBmcm9tIHRoZSBmdW5jdGlvbiBjcmVhdGVkIGJ5IEBTaGFkb3dTY3JpcHRlclxuICAgIC8vIGFuZCBhZGFwdGVkIGJ5IEBCaWxsQmFycnkgb24gdGhlIFN0YWNrIEV4Y2hhbmdlIENvZGUgUmV2aWV3IHdlYnNpdGUuXG4gICAgLy8gVGhlIG9yaWdpbmFsIGNvZGUgY2FuIGJlIGZvdW5kIGF0XG4gICAgLy8gaHR0cDovL2NvZGVyZXZpZXcuc3RhY2tleGNoYW5nZS5jb20vcS8xMzMzOFxuICAgIC8vIGFuZCB3YXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIHRoZSBTaXp6bGUgc2VsZWN0b3IgZW5naW5lLlxuXG4gICAgdmFyICRlbCA9ICQoZWwpO1xuICAgIHZhciBvdmVyZmxvd1ggPSBlbC5zdHlsZS5vdmVyZmxvd1g7XG4gICAgdmFyIG92ZXJmbG93WSA9IGVsLnN0eWxlLm92ZXJmbG93WTtcblxuICAgIC8vQ2hlY2sgYm90aCB4IGFuZCB5IGRlY2xhcmF0aW9uc1xuICAgIGlmIChvdmVyZmxvd1ggPT09IG92ZXJmbG93WSAmJlxuICAgICAgICAob3ZlcmZsb3dZID09PSAnaGlkZGVuJyB8fCBvdmVyZmxvd1kgPT09ICd2aXNpYmxlJykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3dYID09PSAnc2Nyb2xsJyB8fCBvdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCRlbC5pbm5lckhlaWdodCgpIDwgZWwuc2Nyb2xsSGVpZ2h0IHx8XG4gICAgICAkZWwuaW5uZXJXaWR0aCgpIDwgZWwuc2Nyb2xsV2lkdGgpO1xuICB9O1xuXG4gIFV0aWxzLmVzY2FwZU1hcmt1cCA9IGZ1bmN0aW9uIChtYXJrdXApIHtcbiAgICB2YXIgcmVwbGFjZU1hcCA9IHtcbiAgICAgICdcXFxcJzogJyYjOTI7JyxcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgICdcXCcnOiAnJiMzOTsnLFxuICAgICAgJy8nOiAnJiM0NzsnXG4gICAgfTtcblxuICAgIC8vIERvIG5vdCB0cnkgdG8gZXNjYXBlIHRoZSBtYXJrdXAgaWYgaXQncyBub3QgYSBzdHJpbmdcbiAgICBpZiAodHlwZW9mIG1hcmt1cCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBtYXJrdXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyhtYXJrdXApLnJlcGxhY2UoL1smPD5cIidcXC9cXFxcXS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiByZXBsYWNlTWFwW21hdGNoXTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBcHBlbmQgYW4gYXJyYXkgb2YgalF1ZXJ5IG5vZGVzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cbiAgVXRpbHMuYXBwZW5kTWFueSA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJG5vZGVzKSB7XG4gICAgLy8galF1ZXJ5IDEuNy54IGRvZXMgbm90IHN1cHBvcnQgJC5mbi5hcHBlbmQoKSB3aXRoIGFuIGFycmF5XG4gICAgLy8gRmFsbCBiYWNrIHRvIGEgalF1ZXJ5IG9iamVjdCBjb2xsZWN0aW9uIHVzaW5nICQuZm4uYWRkKClcbiAgICBpZiAoJC5mbi5qcXVlcnkuc3Vic3RyKDAsIDMpID09PSAnMS43Jykge1xuICAgICAgdmFyICRqcU5vZGVzID0gJCgpO1xuXG4gICAgICAkLm1hcCgkbm9kZXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICRqcU5vZGVzID0gJGpxTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgfSk7XG5cbiAgICAgICRub2RlcyA9ICRqcU5vZGVzO1xuICAgIH1cblxuICAgICRlbGVtZW50LmFwcGVuZCgkbm9kZXMpO1xuICB9O1xuXG4gIC8vIENhY2hlIG9iamVjdHMgaW4gVXRpbHMuX19jYWNoZSBpbnN0ZWFkIG9mICQuZGF0YSAoc2VlICM0MzQ2KVxuICBVdGlscy5fX2NhY2hlID0ge307XG5cbiAgdmFyIGlkID0gMDtcbiAgVXRpbHMuR2V0VW5pcXVlRWxlbWVudElkID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBHZXQgYSB1bmlxdWUgZWxlbWVudCBJZC4gSWYgZWxlbWVudCBoYXMgbm8gaWQsXG4gICAgLy8gY3JlYXRlcyBhIG5ldyB1bmlxdWUgbnVtYmVyLCBzdG9yZXMgaXQgaW4gdGhlIGlkXG4gICAgLy8gYXR0cmlidXRlIGFuZCByZXR1cm5zIHRoZSBuZXcgaWQuXG4gICAgLy8gSWYgYW4gaWQgYWxyZWFkeSBleGlzdHMsIGl0IHNpbXBseSByZXR1cm5zIGl0LlxuXG4gICAgdmFyIHNlbGVjdDJJZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNlbGVjdDItaWQnKTtcbiAgICBpZiAoc2VsZWN0MklkID09IG51bGwpIHtcbiAgICAgIC8vIElmIGVsZW1lbnQgaGFzIGlkLCB1c2UgaXQuXG4gICAgICBpZiAoZWxlbWVudC5pZCkge1xuICAgICAgICBzZWxlY3QySWQgPSBlbGVtZW50LmlkO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3QyLWlkJywgc2VsZWN0MklkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXNlbGVjdDItaWQnLCArK2lkKTtcbiAgICAgICAgc2VsZWN0MklkID0gaWQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdDJJZDtcbiAgfTtcblxuICBVdGlscy5TdG9yZURhdGEgPSBmdW5jdGlvbiAoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgICAvLyBTdG9yZXMgYW4gaXRlbSBpbiB0aGUgY2FjaGUgZm9yIGEgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgLy8gbmFtZSBpcyB0aGUgY2FjaGUga2V5LlxuICAgIHZhciBpZCA9IFV0aWxzLkdldFVuaXF1ZUVsZW1lbnRJZChlbGVtZW50KTtcbiAgICBpZiAoIVV0aWxzLl9fY2FjaGVbaWRdKSB7XG4gICAgICBVdGlscy5fX2NhY2hlW2lkXSA9IHt9O1xuICAgIH1cblxuICAgIFV0aWxzLl9fY2FjaGVbaWRdW25hbWVdID0gdmFsdWU7XG4gIH07XG5cbiAgVXRpbHMuR2V0RGF0YSA9IGZ1bmN0aW9uIChlbGVtZW50LCBuYW1lKSB7XG4gICAgLy8gUmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgY2FjaGUgYnkgaXRzIGtleSAobmFtZSlcbiAgICAvLyBuYW1lIGlzIG9wdGlvbmFsLiBJZiBubyBuYW1lIHNwZWNpZmllZCwgcmV0dXJuXG4gICAgLy8gYWxsIGNhY2hlIGl0ZW1zIGZvciB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgLy8gYW5kIGZvciBhIHNwZWNpZmllZCBlbGVtZW50LlxuICAgIHZhciBpZCA9IFV0aWxzLkdldFVuaXF1ZUVsZW1lbnRJZChlbGVtZW50KTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgaWYgKFV0aWxzLl9fY2FjaGVbaWRdKSB7XG4gICAgICAgIGlmIChVdGlscy5fX2NhY2hlW2lkXVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIFV0aWxzLl9fY2FjaGVbaWRdW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkKGVsZW1lbnQpLmRhdGEobmFtZSk7IC8vIEZhbGxiYWNrIHRvIEhUTUw1IGRhdGEgYXR0cmlicy5cbiAgICAgIH1cbiAgICAgIHJldHVybiAkKGVsZW1lbnQpLmRhdGEobmFtZSk7IC8vIEZhbGxiYWNrIHRvIEhUTUw1IGRhdGEgYXR0cmlicy5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFV0aWxzLl9fY2FjaGVbaWRdO1xuICAgIH1cbiAgfTtcblxuICBVdGlscy5SZW1vdmVEYXRhID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBSZW1vdmVzIGFsbCBjYWNoZWQgaXRlbXMgZm9yIGEgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgdmFyIGlkID0gVXRpbHMuR2V0VW5pcXVlRWxlbWVudElkKGVsZW1lbnQpO1xuICAgIGlmIChVdGlscy5fX2NhY2hlW2lkXSAhPSBudWxsKSB7XG4gICAgICBkZWxldGUgVXRpbHMuX19jYWNoZVtpZF07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBVdGlscztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvcmVzdWx0cycsW1xuICAnanF1ZXJ5JyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcbiAgZnVuY3Rpb24gUmVzdWx0cyAoJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMuZGF0YSA9IGRhdGFBZGFwdGVyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBSZXN1bHRzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKFJlc3VsdHMsIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHJlc3VsdHMgPSAkKFxuICAgICAgJzx1bCBjbGFzcz1cInNlbGVjdDItcmVzdWx0c19fb3B0aW9uc1wiIHJvbGU9XCJ0cmVlXCI+PC91bD4nXG4gICAgKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdtdWx0aXBsZScpKSB7XG4gICAgICAkcmVzdWx0cy5hdHRyKCdhcmlhLW11bHRpc2VsZWN0YWJsZScsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgdGhpcy4kcmVzdWx0cyA9ICRyZXN1bHRzO1xuXG4gICAgcmV0dXJuICRyZXN1bHRzO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMuZW1wdHkoKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5kaXNwbGF5TWVzc2FnZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XG5cbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xuXG4gICAgdmFyICRtZXNzYWdlID0gJChcbiAgICAgICc8bGkgcm9sZT1cInRyZWVpdGVtXCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCInICtcbiAgICAgICcgY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNfX29wdGlvblwiPjwvbGk+J1xuICAgICk7XG5cbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldChwYXJhbXMubWVzc2FnZSk7XG5cbiAgICAkbWVzc2FnZS5hcHBlbmQoXG4gICAgICBlc2NhcGVNYXJrdXAoXG4gICAgICAgIG1lc3NhZ2UocGFyYW1zLmFyZ3MpXG4gICAgICApXG4gICAgKTtcblxuICAgICRtZXNzYWdlWzBdLmNsYXNzTmFtZSArPSAnIHNlbGVjdDItcmVzdWx0c19fbWVzc2FnZSc7XG5cbiAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCgkbWVzc2FnZSk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlkZU1lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fbWVzc2FnZScpLnJlbW92ZSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xuXG4gICAgdmFyICRvcHRpb25zID0gW107XG5cbiAgICBpZiAoZGF0YS5yZXN1bHRzID09IG51bGwgfHwgZGF0YS5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuJHJlc3VsdHMuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgICAgbWVzc2FnZTogJ25vUmVzdWx0cydcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLnJlc3VsdHMgPSB0aGlzLnNvcnQoZGF0YS5yZXN1bHRzKTtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5yZXN1bHRzLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGRhdGEucmVzdWx0c1tkXTtcblxuICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcblxuICAgICAgJG9wdGlvbnMucHVzaCgkb3B0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCgkb3B0aW9ucyk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoJHJlc3VsdHMsICRkcm9wZG93bikge1xuICAgIHZhciAkcmVzdWx0c0NvbnRhaW5lciA9ICRkcm9wZG93bi5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzJyk7XG4gICAgJHJlc3VsdHNDb250YWluZXIuYXBwZW5kKCRyZXN1bHRzKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgc29ydGVyID0gdGhpcy5vcHRpb25zLmdldCgnc29ydGVyJyk7XG5cbiAgICByZXR1cm4gc29ydGVyKGRhdGEpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZ2hsaWdodEZpcnN0SXRlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRyZXN1bHRzXG4gICAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICB2YXIgJHNlbGVjdGVkID0gJG9wdGlvbnMuZmlsdGVyKCdbYXJpYS1zZWxlY3RlZD10cnVlXScpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBzZWxlY3RlZCBvcHRpb25zXG4gICAgaWYgKCRzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgc2VsZWN0ZWQgb3B0aW9ucywgaGlnaGxpZ2h0IHRoZSBmaXJzdFxuICAgICAgJHNlbGVjdGVkLmZpcnN0KCkudHJpZ2dlcignbW91c2VlbnRlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gc2VsZWN0ZWQgb3B0aW9ucywgaGlnaGxpZ2h0IHRoZSBmaXJzdCBvcHRpb25cbiAgICAgIC8vIGluIHRoZSBkcm9wZG93blxuICAgICAgJG9wdGlvbnMuZmlyc3QoKS50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbnN1cmVIaWdobGlnaHRWaXNpYmxlKCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuc2V0Q2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmRhdGEuY3VycmVudChmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgIHZhciBzZWxlY3RlZElkcyA9ICQubWFwKHNlbGVjdGVkLCBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gcy5pZC50b1N0cmluZygpO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHNcbiAgICAgICAgLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuXG4gICAgICAgIHZhciBpdGVtID0gVXRpbHMuR2V0RGF0YSh0aGlzLCAnZGF0YScpO1xuXG4gICAgICAgIC8vIGlkIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIHN0cmluZyB3aGVuIGNvbXBhcmluZ1xuICAgICAgICB2YXIgaWQgPSAnJyArIGl0ZW0uaWQ7XG5cbiAgICAgICAgaWYgKChpdGVtLmVsZW1lbnQgIT0gbnVsbCAmJiBpdGVtLmVsZW1lbnQuc2VsZWN0ZWQpIHx8XG4gICAgICAgICAgICAoaXRlbS5lbGVtZW50ID09IG51bGwgJiYgJC5pbkFycmF5KGlkLCBzZWxlY3RlZElkcykgPiAtMSkpIHtcbiAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRvcHRpb24uYXR0cignYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnNob3dMb2FkaW5nID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHRoaXMuaGlkZUxvYWRpbmcoKTtcblxuICAgIHZhciBsb2FkaW5nTW9yZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldCgnc2VhcmNoaW5nJyk7XG5cbiAgICB2YXIgbG9hZGluZyA9IHtcbiAgICAgIGRpc2FibGVkOiB0cnVlLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIHRleHQ6IGxvYWRpbmdNb3JlKHBhcmFtcylcbiAgICB9O1xuICAgIHZhciAkbG9hZGluZyA9IHRoaXMub3B0aW9uKGxvYWRpbmcpO1xuICAgICRsb2FkaW5nLmNsYXNzTmFtZSArPSAnIGxvYWRpbmctcmVzdWx0cyc7XG5cbiAgICB0aGlzLiRyZXN1bHRzLnByZXBlbmQoJGxvYWRpbmcpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZGVMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMuZmluZCgnLmxvYWRpbmctcmVzdWx0cycpLnJlbW92ZSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgb3B0aW9uLmNsYXNzTmFtZSA9ICdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbic7XG5cbiAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAncm9sZSc6ICd0cmVlaXRlbScsXG4gICAgICAnYXJpYS1zZWxlY3RlZCc6ICdmYWxzZSdcbiAgICB9O1xuXG4gICAgaWYgKGRhdGEuZGlzYWJsZWQpIHtcbiAgICAgIGRlbGV0ZSBhdHRyc1snYXJpYS1zZWxlY3RlZCddO1xuICAgICAgYXR0cnNbJ2FyaWEtZGlzYWJsZWQnXSA9ICd0cnVlJztcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5pZCA9PSBudWxsKSB7XG4gICAgICBkZWxldGUgYXR0cnNbJ2FyaWEtc2VsZWN0ZWQnXTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5fcmVzdWx0SWQgIT0gbnVsbCkge1xuICAgICAgb3B0aW9uLmlkID0gZGF0YS5fcmVzdWx0SWQ7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEudGl0bGUpIHtcbiAgICAgIG9wdGlvbi50aXRsZSA9IGRhdGEudGl0bGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcbiAgICAgIGF0dHJzLnJvbGUgPSAnZ3JvdXAnO1xuICAgICAgYXR0cnNbJ2FyaWEtbGFiZWwnXSA9IGRhdGEudGV4dDtcbiAgICAgIGRlbGV0ZSBhdHRyc1snYXJpYS1zZWxlY3RlZCddO1xuICAgIH1cblxuICAgIGZvciAodmFyIGF0dHIgaW4gYXR0cnMpIHtcbiAgICAgIHZhciB2YWwgPSBhdHRyc1thdHRyXTtcblxuICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICB2YXIgJG9wdGlvbiA9ICQob3B0aW9uKTtcblxuICAgICAgdmFyIGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3Ryb25nJyk7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSAnc2VsZWN0Mi1yZXN1bHRzX19ncm91cCc7XG5cbiAgICAgIHZhciAkbGFiZWwgPSAkKGxhYmVsKTtcbiAgICAgIHRoaXMudGVtcGxhdGUoZGF0YSwgbGFiZWwpO1xuXG4gICAgICB2YXIgJGNoaWxkcmVuID0gW107XG5cbiAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGMrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSBkYXRhLmNoaWxkcmVuW2NdO1xuXG4gICAgICAgIHZhciAkY2hpbGQgPSB0aGlzLm9wdGlvbihjaGlsZCk7XG5cbiAgICAgICAgJGNoaWxkcmVuLnB1c2goJGNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgdmFyICRjaGlsZHJlbkNvbnRhaW5lciA9ICQoJzx1bD48L3VsPicsIHtcbiAgICAgICAgJ2NsYXNzJzogJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9ucyBzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnMtLW5lc3RlZCdcbiAgICAgIH0pO1xuXG4gICAgICAkY2hpbGRyZW5Db250YWluZXIuYXBwZW5kKCRjaGlsZHJlbik7XG5cbiAgICAgICRvcHRpb24uYXBwZW5kKGxhYmVsKTtcbiAgICAgICRvcHRpb24uYXBwZW5kKCRjaGlsZHJlbkNvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGVtcGxhdGUoZGF0YSwgb3B0aW9uKTtcbiAgICB9XG5cbiAgICBVdGlscy5TdG9yZURhdGEob3B0aW9uLCAnZGF0YScsIGRhdGEpO1xuXG4gICAgcmV0dXJuIG9wdGlvbjtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0cyc7XG5cbiAgICB0aGlzLiRyZXN1bHRzLmF0dHIoJ2lkJywgaWQpO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFsbCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuY2xlYXIoKTtcbiAgICAgIHNlbGYuYXBwZW5kKHBhcmFtcy5kYXRhKTtcblxuICAgICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphcHBlbmQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmFwcGVuZChwYXJhbXMuZGF0YSk7XG5cbiAgICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5oaWRlTWVzc2FnZXMoKTtcbiAgICAgIHNlbGYuc2hvd0xvYWRpbmcocGFyYW1zKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnNldENsYXNzZXMoKTtcblxuICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ3Njcm9sbEFmdGVyU2VsZWN0JykpIHtcbiAgICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigndW5zZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuXG4gICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnc2Nyb2xsQWZ0ZXJTZWxlY3QnKSkge1xuICAgICAgICBzZWxmLmhpZ2hsaWdodEZpcnN0SXRlbSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbiwgYXJpYS1leHBlbmRlZD1cInRydWVcIlxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICBzZWxmLmVuc3VyZUhpZ2hsaWdodFZpc2libGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBjbG9zZWQsIGFyaWEtZXhwZW5kZWQ9XCJmYWxzZVwiXG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgc2VsZi4kcmVzdWx0cy5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czp0b2dnbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkaGlnaGxpZ2h0ZWQudHJpZ2dlcignbW91c2V1cCcpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0gVXRpbHMuR2V0RGF0YSgkaGlnaGxpZ2h0ZWRbMF0sICdkYXRhJyk7XG5cbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQuYXR0cignYXJpYS1zZWxlY3RlZCcpID09ICd0cnVlJykge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ2Nsb3NlJywge30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpwcmV2aW91cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJ1thcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcblxuICAgICAgLy8gSWYgd2UgYXJlIGFscmVhZHkgYXQgdGhlIHRvcCwgZG9uJ3QgbW92ZSBmdXJ0aGVyXG4gICAgICAvLyBJZiBubyBvcHRpb25zLCBjdXJyZW50SW5kZXggd2lsbCBiZSAtMVxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG5cbiAgICAgIC8vIElmIG5vbmUgYXJlIGhpZ2hsaWdodGVkLCBoaWdobGlnaHQgdGhlIGZpcnN0XG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBuZXh0SW5kZXggPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgJG5leHQgPSAkb3B0aW9ucy5lcShuZXh0SW5kZXgpO1xuXG4gICAgICAkbmV4dC50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG5cbiAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgbmV4dFRvcCA9ICRuZXh0Lm9mZnNldCgpLnRvcDtcbiAgICAgIHZhciBuZXh0T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCk7XG5cbiAgICAgIGlmIChuZXh0SW5kZXggPT09IDApIHtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XG4gICAgICB9IGVsc2UgaWYgKG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0IDwgMCkge1xuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpuZXh0JywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRoaWdobGlnaHRlZCA9IHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xuXG4gICAgICB2YXIgbmV4dEluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcblxuICAgICAgLy8gSWYgd2UgYXJlIGF0IHRoZSBsYXN0IG9wdGlvbiwgc3RheSB0aGVyZVxuICAgICAgaWYgKG5leHRJbmRleCA+PSAkb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgJG5leHQgPSAkb3B0aW9ucy5lcShuZXh0SW5kZXgpO1xuXG4gICAgICAkbmV4dC50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG5cbiAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5vZmZzZXQoKS50b3AgK1xuICAgICAgICBzZWxmLiRyZXN1bHRzLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgIHZhciBuZXh0Qm90dG9tID0gJG5leHQub2Zmc2V0KCkudG9wICsgJG5leHQub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgdmFyIG5leHRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpICsgbmV4dEJvdHRvbSAtIGN1cnJlbnRPZmZzZXQ7XG5cbiAgICAgIGlmIChuZXh0SW5kZXggPT09IDApIHtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XG4gICAgICB9IGVsc2UgaWYgKG5leHRCb3R0b20gPiBjdXJyZW50T2Zmc2V0KSB7XG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKG5leHRPZmZzZXQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmZvY3VzJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgcGFyYW1zLmVsZW1lbnQuYWRkQ2xhc3MoJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1oaWdobGlnaHRlZCcpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOm1lc3NhZ2UnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmRpc3BsYXlNZXNzYWdlKHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBpZiAoJC5mbi5tb3VzZXdoZWVsKSB7XG4gICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXdoZWVsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHRvcCA9IHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgdmFyIGJvdHRvbSA9IHNlbGYuJHJlc3VsdHMuZ2V0KDApLnNjcm9sbEhlaWdodCAtIHRvcCArIGUuZGVsdGFZO1xuXG4gICAgICAgIHZhciBpc0F0VG9wID0gZS5kZWx0YVkgPiAwICYmIHRvcCAtIGUuZGVsdGFZIDw9IDA7XG4gICAgICAgIHZhciBpc0F0Qm90dG9tID0gZS5kZWx0YVkgPCAwICYmIGJvdHRvbSA8PSBzZWxmLiRyZXN1bHRzLmhlaWdodCgpO1xuXG4gICAgICAgIGlmIChpc0F0VG9wKSB7XG4gICAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XG5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0F0Qm90dG9tKSB7XG4gICAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoXG4gICAgICAgICAgICBzZWxmLiRyZXN1bHRzLmdldCgwKS5zY3JvbGxIZWlnaHQgLSBzZWxmLiRyZXN1bHRzLmhlaWdodCgpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXVwJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgZGF0YSA9IFV0aWxzLkdldERhdGEodGhpcywgJ2RhdGEnKTtcblxuICAgICAgaWYgKCR0aGlzLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuZ2V0KCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCd1bnNlbGVjdCcsIHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2Nsb3NlJywge30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdCcsIHtcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNlZW50ZXInLCAnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyxcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciBkYXRhID0gVXRpbHMuR2V0RGF0YSh0aGlzLCAnZGF0YScpO1xuXG4gICAgICBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcblxuICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmZvY3VzJywge1xuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBlbGVtZW50OiAkKHRoaXMpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5nZXRIaWdobGlnaHRlZFJlc3VsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRoaWdobGlnaHRlZCA9IHRoaXMuJHJlc3VsdHNcbiAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1oaWdobGlnaHRlZCcpO1xuXG4gICAgcmV0dXJuICRoaWdobGlnaHRlZDtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMucmVtb3ZlKCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZW5zdXJlSGlnaGxpZ2h0VmlzaWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGhpZ2hsaWdodGVkID0gdGhpcy5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kcmVzdWx0cy5maW5kKCdbYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xuXG4gICAgdmFyIGN1cnJlbnRPZmZzZXQgPSB0aGlzLiRyZXN1bHRzLm9mZnNldCgpLnRvcDtcbiAgICB2YXIgbmV4dFRvcCA9ICRoaWdobGlnaHRlZC5vZmZzZXQoKS50b3A7XG4gICAgdmFyIG5leHRPZmZzZXQgPSB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcCgpICsgKG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0KTtcblxuICAgIHZhciBvZmZzZXREZWx0YSA9IG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0O1xuICAgIG5leHRPZmZzZXQgLT0gJGhpZ2hsaWdodGVkLm91dGVySGVpZ2h0KGZhbHNlKSAqIDI7XG5cbiAgICBpZiAoY3VycmVudEluZGV4IDw9IDIpIHtcbiAgICAgIHRoaXMuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuICAgIH0gZWxzZSBpZiAob2Zmc2V0RGVsdGEgPiB0aGlzLiRyZXN1bHRzLm91dGVySGVpZ2h0KCkgfHwgb2Zmc2V0RGVsdGEgPCAwKSB7XG4gICAgICB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcbiAgICB9XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUudGVtcGxhdGUgPSBmdW5jdGlvbiAocmVzdWx0LCBjb250YWluZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVJlc3VsdCcpO1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHZhciBjb250ZW50ID0gdGVtcGxhdGUocmVzdWx0LCBjb250YWluZXIpO1xuXG4gICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBlc2NhcGVNYXJrdXAoY29udGVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoY29udGFpbmVyKS5hcHBlbmQoY29udGVudCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBSZXN1bHRzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9rZXlzJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIEtFWVMgPSB7XG4gICAgQkFDS1NQQUNFOiA4LFxuICAgIFRBQjogOSxcbiAgICBFTlRFUjogMTMsXG4gICAgU0hJRlQ6IDE2LFxuICAgIENUUkw6IDE3LFxuICAgIEFMVDogMTgsXG4gICAgRVNDOiAyNyxcbiAgICBTUEFDRTogMzIsXG4gICAgUEFHRV9VUDogMzMsXG4gICAgUEFHRV9ET1dOOiAzNCxcbiAgICBFTkQ6IDM1LFxuICAgIEhPTUU6IDM2LFxuICAgIExFRlQ6IDM3LFxuICAgIFVQOiAzOCxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDAsXG4gICAgREVMRVRFOiA0NlxuICB9O1xuXG4gIHJldHVybiBLRVlTO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vYmFzZScsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJyxcbiAgJy4uL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMsIEtFWVMpIHtcbiAgZnVuY3Rpb24gQmFzZVNlbGVjdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIEJhc2VTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoQmFzZVNlbGVjdGlvbiwgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkc2VsZWN0aW9uID0gJChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uXCIgcm9sZT1cImNvbWJvYm94XCIgJyArXG4gICAgICAnIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuXG4gICAgdGhpcy5fdGFiaW5kZXggPSAwO1xuXG4gICAgaWYgKFV0aWxzLkdldERhdGEodGhpcy4kZWxlbWVudFswXSwgJ29sZC10YWJpbmRleCcpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RhYmluZGV4ID0gVXRpbHMuR2V0RGF0YSh0aGlzLiRlbGVtZW50WzBdLCAnb2xkLXRhYmluZGV4Jyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGFiaW5kZXggPSB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4Jyk7XG4gICAgfVxuXG4gICAgJHNlbGVjdGlvbi5hdHRyKCd0aXRsZScsIHRoaXMuJGVsZW1lbnQuYXR0cigndGl0bGUnKSk7XG4gICAgJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsIHRoaXMuX3RhYmluZGV4KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbiA9ICRzZWxlY3Rpb247XG5cbiAgICByZXR1cm4gJHNlbGVjdGlvbjtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctY29udGFpbmVyJztcbiAgICB2YXIgcmVzdWx0c0lkID0gY29udGFpbmVyLmlkICsgJy1yZXN1bHRzJztcblxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignZm9jdXMnLCBldnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdibHVyJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5faGFuZGxlQmx1cihldnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XG5cbiAgICAgIGlmIChldnQud2hpY2ggPT09IEtFWVMuU1BBQ0UpIHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgcGFyYW1zLmRhdGEuX3Jlc3VsdElkKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0aW9uOnVwZGF0ZScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYudXBkYXRlKHBhcmFtcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW4sIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLW93bnMnLCByZXN1bHRzSWQpO1xuXG4gICAgICBzZWxmLl9hdHRhY2hDbG9zZUhhbmRsZXIoY29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBjbG9zZWQsIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLnJlbW92ZUF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpO1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLnJlbW92ZUF0dHIoJ2FyaWEtb3ducycpO1xuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuJHNlbGVjdGlvbi5mb2N1cygpO1xuICAgICAgfSwgMCk7XG4gICAgXG4gICAgICBzZWxmLl9kZXRhY2hDbG9zZUhhbmRsZXIoY29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4Jywgc2VsZi5fdGFiaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuX2hhbmRsZUJsdXIgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGFzIHRoZSBhY3RpdmUgZWxlbWVudCBpcyB0aGUgYm9keSB3aGVuIHRoZSB0YWJcbiAgICAvLyBrZXkgaXMgcHJlc3NlZCwgcG9zc2libHkgYWxvbmcgd2l0aCBvdGhlcnMuXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gRG9uJ3QgdHJpZ2dlciBgYmx1cmAgaWYgdGhlIGZvY3VzIGlzIHN0aWxsIGluIHRoZSBzZWxlY3Rpb25cbiAgICAgIGlmIChcbiAgICAgICAgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gc2VsZi4kc2VsZWN0aW9uWzBdKSB8fFxuICAgICAgICAoJC5jb250YWlucyhzZWxmLiRzZWxlY3Rpb25bMF0sIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKCdibHVyJywgZXZ0KTtcbiAgICB9LCAxKTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5fYXR0YWNoQ2xvc2VIYW5kbGVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ21vdXNlZG93bi5zZWxlY3QyLicgKyBjb250YWluZXIuaWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuXG4gICAgICB2YXIgJHNlbGVjdCA9ICR0YXJnZXQuY2xvc2VzdCgnLnNlbGVjdDInKTtcblxuICAgICAgdmFyICRhbGwgPSAkKCcuc2VsZWN0Mi5zZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xuXG4gICAgICAkYWxsLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIGlmICh0aGlzID09ICRzZWxlY3RbMF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJGVsZW1lbnQgPSBVdGlscy5HZXREYXRhKHRoaXMsICdlbGVtZW50Jyk7XG5cbiAgICAgICAgJGVsZW1lbnQuc2VsZWN0MignY2xvc2UnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLl9kZXRhY2hDbG9zZUhhbmRsZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vZmYoJ21vdXNlZG93bi5zZWxlY3QyLicgKyBjb250YWluZXIuaWQpO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRzZWxlY3Rpb24sICRjb250YWluZXIpIHtcbiAgICB2YXIgJHNlbGVjdGlvbkNvbnRhaW5lciA9ICRjb250YWluZXIuZmluZCgnLnNlbGVjdGlvbicpO1xuICAgICRzZWxlY3Rpb25Db250YWluZXIuYXBwZW5kKCRzZWxlY3Rpb24pO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fZGV0YWNoQ2xvc2VIYW5kbGVyKHRoaXMuY29udGFpbmVyKTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGB1cGRhdGVgIG1ldGhvZCBtdXN0IGJlIGRlZmluZWQgaW4gY2hpbGQgY2xhc3Nlcy4nKTtcbiAgfTtcblxuICByZXR1cm4gQmFzZVNlbGVjdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL3NpbmdsZScsW1xuICAnanF1ZXJ5JyxcbiAgJy4vYmFzZScsXG4gICcuLi91dGlscycsXG4gICcuLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIEJhc2VTZWxlY3Rpb24sIFV0aWxzLCBLRVlTKSB7XG4gIGZ1bmN0aW9uIFNpbmdsZVNlbGVjdGlvbiAoKSB7XG4gICAgU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKFNpbmdsZVNlbGVjdGlvbiwgQmFzZVNlbGVjdGlvbik7XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRzZWxlY3Rpb24gPSBTaW5nbGVTZWxlY3Rpb24uX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xuXG4gICAgJHNlbGVjdGlvbi5hZGRDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScpO1xuXG4gICAgJHNlbGVjdGlvbi5odG1sKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkXCI+PC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Fycm93XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xuICAgICAgICAnPGIgcm9sZT1cInByZXNlbnRhdGlvblwiPjwvYj4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICByZXR1cm4gJHNlbGVjdGlvbjtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLWNvbnRhaW5lcic7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpXG4gICAgICAuYXR0cignaWQnLCBpZClcbiAgICAgIC5hdHRyKCdyb2xlJywgJ3RleHRib3gnKVxuICAgICAgLmF0dHIoJ2FyaWEtcmVhZG9ubHknLCAndHJ1ZScpO1xuICAgIHRoaXMuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWxhYmVsbGVkYnknLCBpZCk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIC8vIE9ubHkgcmVzcG9uZCB0byBsZWZ0IGNsaWNrc1xuICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudHJpZ2dlcigndG9nZ2xlJywge1xuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIC8vIFVzZXIgZm9jdXNlcyBvbiB0aGUgY29udGFpbmVyXG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2JsdXInLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAvLyBVc2VyIGV4aXRzIHRoZSBjb250YWluZXJcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICBzZWxmLiRzZWxlY3Rpb24uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xuICAgICRyZW5kZXJlZC5lbXB0eSgpO1xuICAgICRyZW5kZXJlZC5yZW1vdmVBdHRyKCd0aXRsZScpOyAvLyBjbGVhciB0b29sdGlwIG9uIGVtcHR5XG4gIH07XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24gKGRhdGEsIGNvbnRhaW5lcikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RlbXBsYXRlU2VsZWN0aW9uJyk7XG4gICAgdmFyIGVzY2FwZU1hcmt1cCA9IHRoaXMub3B0aW9ucy5nZXQoJ2VzY2FwZU1hcmt1cCcpO1xuXG4gICAgcmV0dXJuIGVzY2FwZU1hcmt1cCh0ZW1wbGF0ZShkYXRhLCBjb250YWluZXIpKTtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdGlvbkNvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJCgnPHNwYW4+PC9zcGFuPicpO1xuICB9O1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uID0gZGF0YVswXTtcblxuICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xuICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uLCAkcmVuZGVyZWQpO1xuXG4gICAgJHJlbmRlcmVkLmVtcHR5KCkuYXBwZW5kKGZvcm1hdHRlZCk7XG4gICAgJHJlbmRlcmVkLmF0dHIoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcbiAgfTtcblxuICByZXR1cm4gU2luZ2xlU2VsZWN0aW9uO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vbXVsdGlwbGUnLFtcbiAgJ2pxdWVyeScsXG4gICcuL2Jhc2UnLFxuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgQmFzZVNlbGVjdGlvbiwgVXRpbHMpIHtcbiAgZnVuY3Rpb24gTXVsdGlwbGVTZWxlY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgTXVsdGlwbGVTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoTXVsdGlwbGVTZWxlY3Rpb24sIEJhc2VTZWxlY3Rpb24pO1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRzZWxlY3Rpb24gPSBNdWx0aXBsZVNlbGVjdGlvbi5fX3N1cGVyX18ucmVuZGVyLmNhbGwodGhpcyk7XG5cbiAgICAkc2VsZWN0aW9uLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbi0tbXVsdGlwbGUnKTtcblxuICAgICRzZWxlY3Rpb24uaHRtbChcbiAgICAgICc8dWwgY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWRcIj48L3VsPidcbiAgICApO1xuXG4gICAgcmV0dXJuICRzZWxlY3Rpb247XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgTXVsdGlwbGVTZWxlY3Rpb24uX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ3RvZ2dsZScsIHtcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcbiAgICAgICdjbGljaycsXG4gICAgICAnLnNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2VfX3JlbW92ZScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgaXQgaXMgZGlzYWJsZWRcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJHJlbW92ZSA9ICQodGhpcyk7XG4gICAgICAgIHZhciAkc2VsZWN0aW9uID0gJHJlbW92ZS5wYXJlbnQoKTtcblxuICAgICAgICB2YXIgZGF0YSA9IFV0aWxzLkdldERhdGEoJHNlbGVjdGlvblswXSwgJ2RhdGEnKTtcblxuICAgICAgICBzZWxmLnRyaWdnZXIoJ3Vuc2VsZWN0Jywge1xuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xuICAgICRyZW5kZXJlZC5lbXB0eSgpO1xuICAgICRyZW5kZXJlZC5yZW1vdmVBdHRyKCd0aXRsZScpO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24gKGRhdGEsIGNvbnRhaW5lcikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RlbXBsYXRlU2VsZWN0aW9uJyk7XG4gICAgdmFyIGVzY2FwZU1hcmt1cCA9IHRoaXMub3B0aW9ucy5nZXQoJ2VzY2FwZU1hcmt1cCcpO1xuXG4gICAgcmV0dXJuIGVzY2FwZU1hcmt1cCh0ZW1wbGF0ZShkYXRhLCBjb250YWluZXIpKTtcbiAgfTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0aW9uQ29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkY29udGFpbmVyID0gJChcbiAgICAgICc8bGkgY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2VfX3JlbW92ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj4nICtcbiAgICAgICAgICAnJnRpbWVzOycgK1xuICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgJzwvbGk+J1xuICAgICk7XG5cbiAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgfTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgJHNlbGVjdGlvbnMgPSBbXTtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbZF07XG5cbiAgICAgIHZhciAkc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25Db250YWluZXIoKTtcbiAgICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uLCAkc2VsZWN0aW9uKTtcblxuICAgICAgJHNlbGVjdGlvbi5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAgICRzZWxlY3Rpb24uYXR0cigndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xuXG4gICAgICBVdGlscy5TdG9yZURhdGEoJHNlbGVjdGlvblswXSwgJ2RhdGEnLCBzZWxlY3Rpb24pO1xuXG4gICAgICAkc2VsZWN0aW9ucy5wdXNoKCRzZWxlY3Rpb24pO1xuICAgIH1cblxuICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xuXG4gICAgVXRpbHMuYXBwZW5kTWFueSgkcmVuZGVyZWQsICRzZWxlY3Rpb25zKTtcbiAgfTtcblxuICByZXR1cm4gTXVsdGlwbGVTZWxlY3Rpb247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9wbGFjZWhvbGRlcicsW1xuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoVXRpbHMpIHtcbiAgZnVuY3Rpb24gUGxhY2Vob2xkZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnBsYWNlaG9sZGVyID0gdGhpcy5ub3JtYWxpemVQbGFjZWhvbGRlcihvcHRpb25zLmdldCgncGxhY2Vob2xkZXInKSk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUubm9ybWFsaXplUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgcGxhY2Vob2xkZXIpIHtcbiAgICBpZiAodHlwZW9mIHBsYWNlaG9sZGVyID09PSAnc3RyaW5nJykge1xuICAgICAgcGxhY2Vob2xkZXIgPSB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgdGV4dDogcGxhY2Vob2xkZXJcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBsYWNlaG9sZGVyO1xuICB9O1xuXG4gIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5jcmVhdGVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBsYWNlaG9sZGVyKSB7XG4gICAgdmFyICRwbGFjZWhvbGRlciA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG5cbiAgICAkcGxhY2Vob2xkZXIuaHRtbCh0aGlzLmRpc3BsYXkocGxhY2Vob2xkZXIpKTtcbiAgICAkcGxhY2Vob2xkZXIuYWRkQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uX19wbGFjZWhvbGRlcicpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlJyk7XG5cbiAgICByZXR1cm4gJHBsYWNlaG9sZGVyO1xuICB9O1xuXG4gIFBsYWNlaG9sZGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgdmFyIHNpbmdsZVBsYWNlaG9sZGVyID0gKFxuICAgICAgZGF0YS5sZW5ndGggPT0gMSAmJiBkYXRhWzBdLmlkICE9IHRoaXMucGxhY2Vob2xkZXIuaWRcbiAgICApO1xuICAgIHZhciBtdWx0aXBsZVNlbGVjdGlvbnMgPSBkYXRhLmxlbmd0aCA+IDE7XG5cbiAgICBpZiAobXVsdGlwbGVTZWxlY3Rpb25zIHx8IHNpbmdsZVBsYWNlaG9sZGVyKSB7XG4gICAgICByZXR1cm4gZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdmFyICRwbGFjZWhvbGRlciA9IHRoaXMuY3JlYXRlUGxhY2Vob2xkZXIodGhpcy5wbGFjZWhvbGRlcik7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLmFwcGVuZCgkcGxhY2Vob2xkZXIpO1xuICB9O1xuXG4gIHJldHVybiBQbGFjZWhvbGRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL2FsbG93Q2xlYXInLFtcbiAgJ2pxdWVyeScsXG4gICcuLi9rZXlzJyxcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIEtFWVMsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIEFsbG93Q2xlYXIgKCkgeyB9XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ1NlbGVjdDI6IFRoZSBgYWxsb3dDbGVhcmAgb3B0aW9uIHNob3VsZCBiZSB1c2VkIGluIGNvbWJpbmF0aW9uICcgK1xuICAgICAgICAgICd3aXRoIHRoZSBgcGxhY2Vob2xkZXJgIG9wdGlvbi4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdtb3VzZWRvd24nLCAnLnNlbGVjdDItc2VsZWN0aW9uX19jbGVhcicsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHNlbGYuX2hhbmRsZUNsZWFyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5faGFuZGxlS2V5Ym9hcmRDbGVhcihldnQsIGNvbnRhaW5lcik7XG4gICAgfSk7XG4gIH07XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuX2hhbmRsZUNsZWFyID0gZnVuY3Rpb24gKF8sIGV2dCkge1xuICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgaXQgaXMgZGlzYWJsZWRcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciAkY2xlYXIgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19jbGVhcicpO1xuXG4gICAgLy8gSWdub3JlIHRoZSBldmVudCBpZiBub3RoaW5nIGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgaWYgKCRjbGVhci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB2YXIgZGF0YSA9IFV0aWxzLkdldERhdGEoJGNsZWFyWzBdLCAnZGF0YScpO1xuXG4gICAgdmFyIHByZXZpb3VzVmFsID0gdGhpcy4kZWxlbWVudC52YWwoKTtcbiAgICB0aGlzLiRlbGVtZW50LnZhbCh0aGlzLnBsYWNlaG9sZGVyLmlkKTtcblxuICAgIHZhciB1bnNlbGVjdERhdGEgPSB7XG4gICAgICBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLnRyaWdnZXIoJ2NsZWFyJywgdW5zZWxlY3REYXRhKTtcbiAgICBpZiAodW5zZWxlY3REYXRhLnByZXZlbnRlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC52YWwocHJldmlvdXNWYWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgdW5zZWxlY3REYXRhID0ge1xuICAgICAgICBkYXRhOiBkYXRhW2RdXG4gICAgICB9O1xuXG4gICAgICAvLyBUcmlnZ2VyIHRoZSBgdW5zZWxlY3RgIGV2ZW50LCBzbyBwZW9wbGUgY2FuIHByZXZlbnQgaXQgZnJvbSBiZWluZ1xuICAgICAgLy8gY2xlYXJlZC5cbiAgICAgIHRoaXMudHJpZ2dlcigndW5zZWxlY3QnLCB1bnNlbGVjdERhdGEpO1xuXG4gICAgICAvLyBJZiB0aGUgZXZlbnQgd2FzIHByZXZlbnRlZCwgZG9uJ3QgY2xlYXIgaXQgb3V0LlxuICAgICAgaWYgKHVuc2VsZWN0RGF0YS5wcmV2ZW50ZWQpIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC52YWwocHJldmlvdXNWYWwpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgIHRoaXMudHJpZ2dlcigndG9nZ2xlJywge30pO1xuICB9O1xuXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLl9oYW5kbGVLZXlib2FyZENsZWFyID0gZnVuY3Rpb24gKF8sIGV2dCwgY29udGFpbmVyKSB7XG4gICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldnQud2hpY2ggPT0gS0VZUy5ERUxFVEUgfHwgZXZ0LndoaWNoID09IEtFWVMuQkFDS1NQQUNFKSB7XG4gICAgICB0aGlzLl9oYW5kbGVDbGVhcihldnQpO1xuICAgIH1cbiAgfTtcblxuICBBbGxvd0NsZWFyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICBpZiAodGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcGxhY2Vob2xkZXInKS5sZW5ndGggPiAwIHx8XG4gICAgICAgIGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHJlbW92ZUFsbCA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldCgncmVtb3ZlQWxsSXRlbXMnKTsgICBcblxuICAgIHZhciAkcmVtb3ZlID0gJChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19jbGVhclwiIHRpdGxlPVwiJyArIHJlbW92ZUFsbCgpICsnXCI+JyArXG4gICAgICAgICcmdGltZXM7JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuICAgIFV0aWxzLlN0b3JlRGF0YSgkcmVtb3ZlWzBdLCAnZGF0YScsIGRhdGEpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5wcmVwZW5kKCRyZW1vdmUpO1xuICB9O1xuXG4gIHJldHVybiBBbGxvd0NsZWFyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vc2VhcmNoJyxbXG4gICdqcXVlcnknLFxuICAnLi4vdXRpbHMnLFxuICAnLi4va2V5cydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscywgS0VZUykge1xuICBmdW5jdGlvbiBTZWFyY2ggKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBTZWFyY2gucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB2YXIgJHNlYXJjaCA9ICQoXG4gICAgICAnPGxpIGNsYXNzPVwic2VsZWN0Mi1zZWFyY2ggc2VsZWN0Mi1zZWFyY2gtLWlubGluZVwiPicgK1xuICAgICAgICAnPGlucHV0IGNsYXNzPVwic2VsZWN0Mi1zZWFyY2hfX2ZpZWxkXCIgdHlwZT1cInNlYXJjaFwiIHRhYmluZGV4PVwiLTFcIicgK1xuICAgICAgICAnIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGF1dG9jb3JyZWN0PVwib2ZmXCIgYXV0b2NhcGl0YWxpemU9XCJub25lXCInICtcbiAgICAgICAgJyBzcGVsbGNoZWNrPVwiZmFsc2VcIiByb2xlPVwidGV4dGJveFwiIGFyaWEtYXV0b2NvbXBsZXRlPVwibGlzdFwiIC8+JyArXG4gICAgICAnPC9saT4nXG4gICAgKTtcblxuICAgIHRoaXMuJHNlYXJjaENvbnRhaW5lciA9ICRzZWFyY2g7XG4gICAgdGhpcy4kc2VhcmNoID0gJHNlYXJjaC5maW5kKCdpbnB1dCcpO1xuXG4gICAgdmFyICRyZW5kZXJlZCA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5fdHJhbnNmZXJUYWJJbmRleCgpO1xuXG4gICAgcmV0dXJuICRyZW5kZXJlZDtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnZhbCgnJyk7XG4gICAgICBzZWxmLiRzZWFyY2gucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgICBzZWxmLiRzZWFyY2gudHJpZ2dlcignZm9jdXMnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICBzZWxmLl90cmFuc2ZlclRhYkluZGV4KCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Rpc2FibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWFyY2gucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLiRzZWFyY2gudHJpZ2dlcignZm9jdXMnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBwYXJhbXMuaWQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1c2luJywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2ZvY3Vzb3V0JywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5faGFuZGxlQmx1cihldnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdrZXlkb3duJywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBzZWxmLnRyaWdnZXIoJ2tleXByZXNzJywgZXZ0KTtcblxuICAgICAgc2VsZi5fa2V5VXBQcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XG5cbiAgICAgIHZhciBrZXkgPSBldnQud2hpY2g7XG5cbiAgICAgIGlmIChrZXkgPT09IEtFWVMuQkFDS1NQQUNFICYmIHNlbGYuJHNlYXJjaC52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgdmFyICRwcmV2aW91c0Nob2ljZSA9IHNlbGYuJHNlYXJjaENvbnRhaW5lclxuICAgICAgICAgIC5wcmV2KCcuc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZScpO1xuXG4gICAgICAgIGlmICgkcHJldmlvdXNDaG9pY2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBpdGVtID0gVXRpbHMuR2V0RGF0YSgkcHJldmlvdXNDaG9pY2VbMF0sICdkYXRhJyk7XG5cbiAgICAgICAgICBzZWxmLnNlYXJjaFJlbW92ZUNob2ljZShpdGVtKTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUcnkgdG8gZGV0ZWN0IHRoZSBJRSB2ZXJzaW9uIHNob3VsZCB0aGUgYGRvY3VtZW50TW9kZWAgcHJvcGVydHkgdGhhdFxuICAgIC8vIGlzIHN0b3JlZCBvbiB0aGUgZG9jdW1lbnQuIFRoaXMgaXMgb25seSBpbXBsZW1lbnRlZCBpbiBJRSBhbmQgaXNcbiAgICAvLyBzbGlnaHRseSBjbGVhbmVyIHRoYW4gZG9pbmcgYSB1c2VyIGFnZW50IGNoZWNrLlxuICAgIC8vIFRoaXMgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZSBpbiBFZGdlLCBidXQgRWRnZSBhbHNvIGRvZXNuJ3QgaGF2ZVxuICAgIC8vIHRoaXMgYnVnLlxuICAgIHZhciBtc2llID0gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICAgIHZhciBkaXNhYmxlSW5wdXRFdmVudHMgPSBtc2llICYmIG1zaWUgPD0gMTE7XG5cbiAgICAvLyBXb3JrYXJvdW5kIGZvciBicm93c2VycyB3aGljaCBkbyBub3Qgc3VwcG9ydCB0aGUgYGlucHV0YCBldmVudFxuICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IGRvdWJsZS10cmlnZ2VyaW5nIG9mIGV2ZW50cyBmb3IgYnJvd3NlcnMgd2hpY2ggc3VwcG9ydFxuICAgIC8vIGJvdGggdGhlIGBrZXl1cGAgYW5kIGBpbnB1dGAgZXZlbnRzLlxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcbiAgICAgICdpbnB1dC5zZWFyY2hjaGVjaycsXG4gICAgICAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAvLyBJRSB3aWxsIHRyaWdnZXIgdGhlIGBpbnB1dGAgZXZlbnQgd2hlbiBhIHBsYWNlaG9sZGVyIGlzIHVzZWQgb24gYVxuICAgICAgICAvLyBzZWFyY2ggYm94LiBUbyBnZXQgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIGFyZSBmb3JjZWQgdG8gaWdub3JlIGFsbFxuICAgICAgICAvLyBgaW5wdXRgIGV2ZW50cyBpbiBJRSBhbmQga2VlcCB1c2luZyBga2V5dXBgLlxuICAgICAgICBpZiAoZGlzYWJsZUlucHV0RXZlbnRzKSB7XG4gICAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZignaW5wdXQuc2VhcmNoIGlucHV0LnNlYXJjaGNoZWNrJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVW5iaW5kIHRoZSBkdXBsaWNhdGVkIGBrZXl1cGAgZXZlbnRcbiAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZigna2V5dXAuc2VhcmNoJyk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcbiAgICAgICdrZXl1cC5zZWFyY2ggaW5wdXQuc2VhcmNoJyxcbiAgICAgICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIC8vIElFIHdpbGwgdHJpZ2dlciB0aGUgYGlucHV0YCBldmVudCB3aGVuIGEgcGxhY2Vob2xkZXIgaXMgdXNlZCBvbiBhXG4gICAgICAgIC8vIHNlYXJjaCBib3guIFRvIGdldCBhcm91bmQgdGhpcyBpc3N1ZSwgd2UgYXJlIGZvcmNlZCB0byBpZ25vcmUgYWxsXG4gICAgICAgIC8vIGBpbnB1dGAgZXZlbnRzIGluIElFIGFuZCBrZWVwIHVzaW5nIGBrZXl1cGAuXG4gICAgICAgIGlmIChkaXNhYmxlSW5wdXRFdmVudHMgJiYgZXZ0LnR5cGUgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgICBzZWxmLiRzZWxlY3Rpb24ub2ZmKCdpbnB1dC5zZWFyY2ggaW5wdXQuc2VhcmNoY2hlY2snKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xuXG4gICAgICAgIC8vIFdlIGNhbiBmcmVlbHkgaWdub3JlIGV2ZW50cyBmcm9tIG1vZGlmaWVyIGtleXNcbiAgICAgICAgaWYgKGtleSA9PSBLRVlTLlNISUZUIHx8IGtleSA9PSBLRVlTLkNUUkwgfHwga2V5ID09IEtFWVMuQUxUKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGFiYmluZyB3aWxsIGJlIGhhbmRsZWQgZHVyaW5nIHRoZSBga2V5ZG93bmAgcGhhc2VcbiAgICAgICAgaWYgKGtleSA9PSBLRVlTLlRBQikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaGFuZGxlU2VhcmNoKGV2dCk7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgd2lsbCB0cmFuc2ZlciB0aGUgdGFiaW5kZXggYXR0cmlidXRlIGZyb20gdGhlIHJlbmRlcmVkXG4gICAqIHNlbGVjdGlvbiB0byB0aGUgc2VhcmNoIGJveC4gVGhpcyBhbGxvd3MgZm9yIHRoZSBzZWFyY2ggYm94IHRvIGJlIHVzZWQgYXNcbiAgICogdGhlIHByaW1hcnkgZm9jdXMgaW5zdGVhZCBvZiB0aGUgc2VsZWN0aW9uIGNvbnRhaW5lci5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIFNlYXJjaC5wcm90b3R5cGUuX3RyYW5zZmVyVGFiSW5kZXggPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3RhYmluZGV4JywgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JykpO1xuICAgIHRoaXMuJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuY3JlYXRlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwbGFjZWhvbGRlcikge1xuICAgIHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyLnRleHQpO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIHZhciBzZWFyY2hIYWRGb2N1cyA9IHRoaXMuJHNlYXJjaFswXSA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpXG4gICAgICAgICAgICAgICAgICAgLmFwcGVuZCh0aGlzLiRzZWFyY2hDb250YWluZXIpO1xuXG4gICAgdGhpcy5yZXNpemVTZWFyY2goKTtcbiAgICBpZiAoc2VhcmNoSGFkRm9jdXMpIHtcbiAgICAgIHZhciBpc1RhZ0lucHV0ID0gdGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS1zZWxlY3QyLXRhZ10nKS5sZW5ndGg7XG4gICAgICBpZiAoaXNUYWdJbnB1dCkge1xuICAgICAgICAvLyBmaXggSUUxMSBidWcgd2hlcmUgdGFnIGlucHV0IGxvc3QgZm9jdXNcbiAgICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kc2VhcmNoLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuaGFuZGxlU2VhcmNoID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVzaXplU2VhcmNoKCk7XG5cbiAgICBpZiAoIXRoaXMuX2tleVVwUHJldmVudGVkKSB7XG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLiRzZWFyY2gudmFsKCk7XG5cbiAgICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7XG4gICAgICAgIHRlcm06IGlucHV0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9rZXlVcFByZXZlbnRlZCA9IGZhbHNlO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuc2VhcmNoUmVtb3ZlQ2hvaWNlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgaXRlbSkge1xuICAgIHRoaXMudHJpZ2dlcigndW5zZWxlY3QnLCB7XG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWFyY2gudmFsKGl0ZW0udGV4dCk7XG4gICAgdGhpcy5oYW5kbGVTZWFyY2goKTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLnJlc2l6ZVNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRzZWFyY2guY3NzKCd3aWR0aCcsICcyNXB4Jyk7XG5cbiAgICB2YXIgd2lkdGggPSAnJztcblxuICAgIGlmICh0aGlzLiRzZWFyY2guYXR0cigncGxhY2Vob2xkZXInKSAhPT0gJycpIHtcbiAgICAgIHdpZHRoID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5pbm5lcldpZHRoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtV2lkdGggPSB0aGlzLiRzZWFyY2gudmFsKCkubGVuZ3RoICsgMTtcblxuICAgICAgd2lkdGggPSAobWluaW11bVdpZHRoICogMC43NSkgKyAnZW0nO1xuICAgIH1cblxuICAgIHRoaXMuJHNlYXJjaC5jc3MoJ3dpZHRoJywgd2lkdGgpO1xuICB9O1xuXG4gIHJldHVybiBTZWFyY2g7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9ldmVudFJlbGF5JyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBFdmVudFJlbGF5ICgpIHsgfVxuXG4gIEV2ZW50UmVsYXkucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlbGF5RXZlbnRzID0gW1xuICAgICAgJ29wZW4nLCAnb3BlbmluZycsXG4gICAgICAnY2xvc2UnLCAnY2xvc2luZycsXG4gICAgICAnc2VsZWN0JywgJ3NlbGVjdGluZycsXG4gICAgICAndW5zZWxlY3QnLCAndW5zZWxlY3RpbmcnLFxuICAgICAgJ2NsZWFyJywgJ2NsZWFyaW5nJ1xuICAgIF07XG5cbiAgICB2YXIgcHJldmVudGFibGVFdmVudHMgPSBbXG4gICAgICAnb3BlbmluZycsICdjbG9zaW5nJywgJ3NlbGVjdGluZycsICd1bnNlbGVjdGluZycsICdjbGVhcmluZydcbiAgICBdO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIC8vIElnbm9yZSBldmVudHMgdGhhdCBzaG91bGQgbm90IGJlIHJlbGF5ZWRcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgcmVsYXlFdmVudHMpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBwYXJhbWV0ZXJzIHNob3VsZCBhbHdheXMgYmUgYW4gb2JqZWN0XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRoZSBqUXVlcnkgZXZlbnQgZm9yIHRoZSBTZWxlY3QyIGV2ZW50XG4gICAgICB2YXIgZXZ0ID0gJC5FdmVudCgnc2VsZWN0MjonICsgbmFtZSwge1xuICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcihldnQpO1xuXG4gICAgICAvLyBPbmx5IGhhbmRsZSBwcmV2ZW50YWJsZSBldmVudHMgaWYgaXQgd2FzIG9uZVxuICAgICAgaWYgKCQuaW5BcnJheShuYW1lLCBwcmV2ZW50YWJsZUV2ZW50cykgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcGFyYW1zLnByZXZlbnRlZCA9IGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gRXZlbnRSZWxheTtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvdHJhbnNsYXRpb24nLFtcbiAgJ2pxdWVyeScsXG4gICdyZXF1aXJlJ1xuXSwgZnVuY3Rpb24gKCQsIHJlcXVpcmUpIHtcbiAgZnVuY3Rpb24gVHJhbnNsYXRpb24gKGRpY3QpIHtcbiAgICB0aGlzLmRpY3QgPSBkaWN0IHx8IHt9O1xuICB9XG5cbiAgVHJhbnNsYXRpb24ucHJvdG90eXBlLmFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWN0O1xuICB9O1xuXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZGljdFtrZXldO1xuICB9O1xuXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbiAodHJhbnNsYXRpb24pIHtcbiAgICB0aGlzLmRpY3QgPSAkLmV4dGVuZCh7fSwgdHJhbnNsYXRpb24uYWxsKCksIHRoaXMuZGljdCk7XG4gIH07XG5cbiAgLy8gU3RhdGljIGZ1bmN0aW9uc1xuXG4gIFRyYW5zbGF0aW9uLl9jYWNoZSA9IHt9O1xuXG4gIFRyYW5zbGF0aW9uLmxvYWRQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICBpZiAoIShwYXRoIGluIFRyYW5zbGF0aW9uLl9jYWNoZSkpIHtcbiAgICAgIHZhciB0cmFuc2xhdGlvbnMgPSByZXF1aXJlKHBhdGgpO1xuXG4gICAgICBUcmFuc2xhdGlvbi5fY2FjaGVbcGF0aF0gPSB0cmFuc2xhdGlvbnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUcmFuc2xhdGlvbihUcmFuc2xhdGlvbi5fY2FjaGVbcGF0aF0pO1xuICB9O1xuXG4gIHJldHVybiBUcmFuc2xhdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGlhY3JpdGljcycsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBkaWFjcml0aWNzID0ge1xuICAgICdcXHUyNEI2JzogJ0EnLFxuICAgICdcXHVGRjIxJzogJ0EnLFxuICAgICdcXHUwMEMwJzogJ0EnLFxuICAgICdcXHUwMEMxJzogJ0EnLFxuICAgICdcXHUwMEMyJzogJ0EnLFxuICAgICdcXHUxRUE2JzogJ0EnLFxuICAgICdcXHUxRUE0JzogJ0EnLFxuICAgICdcXHUxRUFBJzogJ0EnLFxuICAgICdcXHUxRUE4JzogJ0EnLFxuICAgICdcXHUwMEMzJzogJ0EnLFxuICAgICdcXHUwMTAwJzogJ0EnLFxuICAgICdcXHUwMTAyJzogJ0EnLFxuICAgICdcXHUxRUIwJzogJ0EnLFxuICAgICdcXHUxRUFFJzogJ0EnLFxuICAgICdcXHUxRUI0JzogJ0EnLFxuICAgICdcXHUxRUIyJzogJ0EnLFxuICAgICdcXHUwMjI2JzogJ0EnLFxuICAgICdcXHUwMUUwJzogJ0EnLFxuICAgICdcXHUwMEM0JzogJ0EnLFxuICAgICdcXHUwMURFJzogJ0EnLFxuICAgICdcXHUxRUEyJzogJ0EnLFxuICAgICdcXHUwMEM1JzogJ0EnLFxuICAgICdcXHUwMUZBJzogJ0EnLFxuICAgICdcXHUwMUNEJzogJ0EnLFxuICAgICdcXHUwMjAwJzogJ0EnLFxuICAgICdcXHUwMjAyJzogJ0EnLFxuICAgICdcXHUxRUEwJzogJ0EnLFxuICAgICdcXHUxRUFDJzogJ0EnLFxuICAgICdcXHUxRUI2JzogJ0EnLFxuICAgICdcXHUxRTAwJzogJ0EnLFxuICAgICdcXHUwMTA0JzogJ0EnLFxuICAgICdcXHUwMjNBJzogJ0EnLFxuICAgICdcXHUyQzZGJzogJ0EnLFxuICAgICdcXHVBNzMyJzogJ0FBJyxcbiAgICAnXFx1MDBDNic6ICdBRScsXG4gICAgJ1xcdTAxRkMnOiAnQUUnLFxuICAgICdcXHUwMUUyJzogJ0FFJyxcbiAgICAnXFx1QTczNCc6ICdBTycsXG4gICAgJ1xcdUE3MzYnOiAnQVUnLFxuICAgICdcXHVBNzM4JzogJ0FWJyxcbiAgICAnXFx1QTczQSc6ICdBVicsXG4gICAgJ1xcdUE3M0MnOiAnQVknLFxuICAgICdcXHUyNEI3JzogJ0InLFxuICAgICdcXHVGRjIyJzogJ0InLFxuICAgICdcXHUxRTAyJzogJ0InLFxuICAgICdcXHUxRTA0JzogJ0InLFxuICAgICdcXHUxRTA2JzogJ0InLFxuICAgICdcXHUwMjQzJzogJ0InLFxuICAgICdcXHUwMTgyJzogJ0InLFxuICAgICdcXHUwMTgxJzogJ0InLFxuICAgICdcXHUyNEI4JzogJ0MnLFxuICAgICdcXHVGRjIzJzogJ0MnLFxuICAgICdcXHUwMTA2JzogJ0MnLFxuICAgICdcXHUwMTA4JzogJ0MnLFxuICAgICdcXHUwMTBBJzogJ0MnLFxuICAgICdcXHUwMTBDJzogJ0MnLFxuICAgICdcXHUwMEM3JzogJ0MnLFxuICAgICdcXHUxRTA4JzogJ0MnLFxuICAgICdcXHUwMTg3JzogJ0MnLFxuICAgICdcXHUwMjNCJzogJ0MnLFxuICAgICdcXHVBNzNFJzogJ0MnLFxuICAgICdcXHUyNEI5JzogJ0QnLFxuICAgICdcXHVGRjI0JzogJ0QnLFxuICAgICdcXHUxRTBBJzogJ0QnLFxuICAgICdcXHUwMTBFJzogJ0QnLFxuICAgICdcXHUxRTBDJzogJ0QnLFxuICAgICdcXHUxRTEwJzogJ0QnLFxuICAgICdcXHUxRTEyJzogJ0QnLFxuICAgICdcXHUxRTBFJzogJ0QnLFxuICAgICdcXHUwMTEwJzogJ0QnLFxuICAgICdcXHUwMThCJzogJ0QnLFxuICAgICdcXHUwMThBJzogJ0QnLFxuICAgICdcXHUwMTg5JzogJ0QnLFxuICAgICdcXHVBNzc5JzogJ0QnLFxuICAgICdcXHUwMUYxJzogJ0RaJyxcbiAgICAnXFx1MDFDNCc6ICdEWicsXG4gICAgJ1xcdTAxRjInOiAnRHonLFxuICAgICdcXHUwMUM1JzogJ0R6JyxcbiAgICAnXFx1MjRCQSc6ICdFJyxcbiAgICAnXFx1RkYyNSc6ICdFJyxcbiAgICAnXFx1MDBDOCc6ICdFJyxcbiAgICAnXFx1MDBDOSc6ICdFJyxcbiAgICAnXFx1MDBDQSc6ICdFJyxcbiAgICAnXFx1MUVDMCc6ICdFJyxcbiAgICAnXFx1MUVCRSc6ICdFJyxcbiAgICAnXFx1MUVDNCc6ICdFJyxcbiAgICAnXFx1MUVDMic6ICdFJyxcbiAgICAnXFx1MUVCQyc6ICdFJyxcbiAgICAnXFx1MDExMic6ICdFJyxcbiAgICAnXFx1MUUxNCc6ICdFJyxcbiAgICAnXFx1MUUxNic6ICdFJyxcbiAgICAnXFx1MDExNCc6ICdFJyxcbiAgICAnXFx1MDExNic6ICdFJyxcbiAgICAnXFx1MDBDQic6ICdFJyxcbiAgICAnXFx1MUVCQSc6ICdFJyxcbiAgICAnXFx1MDExQSc6ICdFJyxcbiAgICAnXFx1MDIwNCc6ICdFJyxcbiAgICAnXFx1MDIwNic6ICdFJyxcbiAgICAnXFx1MUVCOCc6ICdFJyxcbiAgICAnXFx1MUVDNic6ICdFJyxcbiAgICAnXFx1MDIyOCc6ICdFJyxcbiAgICAnXFx1MUUxQyc6ICdFJyxcbiAgICAnXFx1MDExOCc6ICdFJyxcbiAgICAnXFx1MUUxOCc6ICdFJyxcbiAgICAnXFx1MUUxQSc6ICdFJyxcbiAgICAnXFx1MDE5MCc6ICdFJyxcbiAgICAnXFx1MDE4RSc6ICdFJyxcbiAgICAnXFx1MjRCQic6ICdGJyxcbiAgICAnXFx1RkYyNic6ICdGJyxcbiAgICAnXFx1MUUxRSc6ICdGJyxcbiAgICAnXFx1MDE5MSc6ICdGJyxcbiAgICAnXFx1QTc3Qic6ICdGJyxcbiAgICAnXFx1MjRCQyc6ICdHJyxcbiAgICAnXFx1RkYyNyc6ICdHJyxcbiAgICAnXFx1MDFGNCc6ICdHJyxcbiAgICAnXFx1MDExQyc6ICdHJyxcbiAgICAnXFx1MUUyMCc6ICdHJyxcbiAgICAnXFx1MDExRSc6ICdHJyxcbiAgICAnXFx1MDEyMCc6ICdHJyxcbiAgICAnXFx1MDFFNic6ICdHJyxcbiAgICAnXFx1MDEyMic6ICdHJyxcbiAgICAnXFx1MDFFNCc6ICdHJyxcbiAgICAnXFx1MDE5Myc6ICdHJyxcbiAgICAnXFx1QTdBMCc6ICdHJyxcbiAgICAnXFx1QTc3RCc6ICdHJyxcbiAgICAnXFx1QTc3RSc6ICdHJyxcbiAgICAnXFx1MjRCRCc6ICdIJyxcbiAgICAnXFx1RkYyOCc6ICdIJyxcbiAgICAnXFx1MDEyNCc6ICdIJyxcbiAgICAnXFx1MUUyMic6ICdIJyxcbiAgICAnXFx1MUUyNic6ICdIJyxcbiAgICAnXFx1MDIxRSc6ICdIJyxcbiAgICAnXFx1MUUyNCc6ICdIJyxcbiAgICAnXFx1MUUyOCc6ICdIJyxcbiAgICAnXFx1MUUyQSc6ICdIJyxcbiAgICAnXFx1MDEyNic6ICdIJyxcbiAgICAnXFx1MkM2Nyc6ICdIJyxcbiAgICAnXFx1MkM3NSc6ICdIJyxcbiAgICAnXFx1QTc4RCc6ICdIJyxcbiAgICAnXFx1MjRCRSc6ICdJJyxcbiAgICAnXFx1RkYyOSc6ICdJJyxcbiAgICAnXFx1MDBDQyc6ICdJJyxcbiAgICAnXFx1MDBDRCc6ICdJJyxcbiAgICAnXFx1MDBDRSc6ICdJJyxcbiAgICAnXFx1MDEyOCc6ICdJJyxcbiAgICAnXFx1MDEyQSc6ICdJJyxcbiAgICAnXFx1MDEyQyc6ICdJJyxcbiAgICAnXFx1MDEzMCc6ICdJJyxcbiAgICAnXFx1MDBDRic6ICdJJyxcbiAgICAnXFx1MUUyRSc6ICdJJyxcbiAgICAnXFx1MUVDOCc6ICdJJyxcbiAgICAnXFx1MDFDRic6ICdJJyxcbiAgICAnXFx1MDIwOCc6ICdJJyxcbiAgICAnXFx1MDIwQSc6ICdJJyxcbiAgICAnXFx1MUVDQSc6ICdJJyxcbiAgICAnXFx1MDEyRSc6ICdJJyxcbiAgICAnXFx1MUUyQyc6ICdJJyxcbiAgICAnXFx1MDE5Nyc6ICdJJyxcbiAgICAnXFx1MjRCRic6ICdKJyxcbiAgICAnXFx1RkYyQSc6ICdKJyxcbiAgICAnXFx1MDEzNCc6ICdKJyxcbiAgICAnXFx1MDI0OCc6ICdKJyxcbiAgICAnXFx1MjRDMCc6ICdLJyxcbiAgICAnXFx1RkYyQic6ICdLJyxcbiAgICAnXFx1MUUzMCc6ICdLJyxcbiAgICAnXFx1MDFFOCc6ICdLJyxcbiAgICAnXFx1MUUzMic6ICdLJyxcbiAgICAnXFx1MDEzNic6ICdLJyxcbiAgICAnXFx1MUUzNCc6ICdLJyxcbiAgICAnXFx1MDE5OCc6ICdLJyxcbiAgICAnXFx1MkM2OSc6ICdLJyxcbiAgICAnXFx1QTc0MCc6ICdLJyxcbiAgICAnXFx1QTc0Mic6ICdLJyxcbiAgICAnXFx1QTc0NCc6ICdLJyxcbiAgICAnXFx1QTdBMic6ICdLJyxcbiAgICAnXFx1MjRDMSc6ICdMJyxcbiAgICAnXFx1RkYyQyc6ICdMJyxcbiAgICAnXFx1MDEzRic6ICdMJyxcbiAgICAnXFx1MDEzOSc6ICdMJyxcbiAgICAnXFx1MDEzRCc6ICdMJyxcbiAgICAnXFx1MUUzNic6ICdMJyxcbiAgICAnXFx1MUUzOCc6ICdMJyxcbiAgICAnXFx1MDEzQic6ICdMJyxcbiAgICAnXFx1MUUzQyc6ICdMJyxcbiAgICAnXFx1MUUzQSc6ICdMJyxcbiAgICAnXFx1MDE0MSc6ICdMJyxcbiAgICAnXFx1MDIzRCc6ICdMJyxcbiAgICAnXFx1MkM2Mic6ICdMJyxcbiAgICAnXFx1MkM2MCc6ICdMJyxcbiAgICAnXFx1QTc0OCc6ICdMJyxcbiAgICAnXFx1QTc0Nic6ICdMJyxcbiAgICAnXFx1QTc4MCc6ICdMJyxcbiAgICAnXFx1MDFDNyc6ICdMSicsXG4gICAgJ1xcdTAxQzgnOiAnTGonLFxuICAgICdcXHUyNEMyJzogJ00nLFxuICAgICdcXHVGRjJEJzogJ00nLFxuICAgICdcXHUxRTNFJzogJ00nLFxuICAgICdcXHUxRTQwJzogJ00nLFxuICAgICdcXHUxRTQyJzogJ00nLFxuICAgICdcXHUyQzZFJzogJ00nLFxuICAgICdcXHUwMTlDJzogJ00nLFxuICAgICdcXHUyNEMzJzogJ04nLFxuICAgICdcXHVGRjJFJzogJ04nLFxuICAgICdcXHUwMUY4JzogJ04nLFxuICAgICdcXHUwMTQzJzogJ04nLFxuICAgICdcXHUwMEQxJzogJ04nLFxuICAgICdcXHUxRTQ0JzogJ04nLFxuICAgICdcXHUwMTQ3JzogJ04nLFxuICAgICdcXHUxRTQ2JzogJ04nLFxuICAgICdcXHUwMTQ1JzogJ04nLFxuICAgICdcXHUxRTRBJzogJ04nLFxuICAgICdcXHUxRTQ4JzogJ04nLFxuICAgICdcXHUwMjIwJzogJ04nLFxuICAgICdcXHUwMTlEJzogJ04nLFxuICAgICdcXHVBNzkwJzogJ04nLFxuICAgICdcXHVBN0E0JzogJ04nLFxuICAgICdcXHUwMUNBJzogJ05KJyxcbiAgICAnXFx1MDFDQic6ICdOaicsXG4gICAgJ1xcdTI0QzQnOiAnTycsXG4gICAgJ1xcdUZGMkYnOiAnTycsXG4gICAgJ1xcdTAwRDInOiAnTycsXG4gICAgJ1xcdTAwRDMnOiAnTycsXG4gICAgJ1xcdTAwRDQnOiAnTycsXG4gICAgJ1xcdTFFRDInOiAnTycsXG4gICAgJ1xcdTFFRDAnOiAnTycsXG4gICAgJ1xcdTFFRDYnOiAnTycsXG4gICAgJ1xcdTFFRDQnOiAnTycsXG4gICAgJ1xcdTAwRDUnOiAnTycsXG4gICAgJ1xcdTFFNEMnOiAnTycsXG4gICAgJ1xcdTAyMkMnOiAnTycsXG4gICAgJ1xcdTFFNEUnOiAnTycsXG4gICAgJ1xcdTAxNEMnOiAnTycsXG4gICAgJ1xcdTFFNTAnOiAnTycsXG4gICAgJ1xcdTFFNTInOiAnTycsXG4gICAgJ1xcdTAxNEUnOiAnTycsXG4gICAgJ1xcdTAyMkUnOiAnTycsXG4gICAgJ1xcdTAyMzAnOiAnTycsXG4gICAgJ1xcdTAwRDYnOiAnTycsXG4gICAgJ1xcdTAyMkEnOiAnTycsXG4gICAgJ1xcdTFFQ0UnOiAnTycsXG4gICAgJ1xcdTAxNTAnOiAnTycsXG4gICAgJ1xcdTAxRDEnOiAnTycsXG4gICAgJ1xcdTAyMEMnOiAnTycsXG4gICAgJ1xcdTAyMEUnOiAnTycsXG4gICAgJ1xcdTAxQTAnOiAnTycsXG4gICAgJ1xcdTFFREMnOiAnTycsXG4gICAgJ1xcdTFFREEnOiAnTycsXG4gICAgJ1xcdTFFRTAnOiAnTycsXG4gICAgJ1xcdTFFREUnOiAnTycsXG4gICAgJ1xcdTFFRTInOiAnTycsXG4gICAgJ1xcdTFFQ0MnOiAnTycsXG4gICAgJ1xcdTFFRDgnOiAnTycsXG4gICAgJ1xcdTAxRUEnOiAnTycsXG4gICAgJ1xcdTAxRUMnOiAnTycsXG4gICAgJ1xcdTAwRDgnOiAnTycsXG4gICAgJ1xcdTAxRkUnOiAnTycsXG4gICAgJ1xcdTAxODYnOiAnTycsXG4gICAgJ1xcdTAxOUYnOiAnTycsXG4gICAgJ1xcdUE3NEEnOiAnTycsXG4gICAgJ1xcdUE3NEMnOiAnTycsXG4gICAgJ1xcdTAxNTInOiAnT0UnLFxuICAgICdcXHUwMUEyJzogJ09JJyxcbiAgICAnXFx1QTc0RSc6ICdPTycsXG4gICAgJ1xcdTAyMjInOiAnT1UnLFxuICAgICdcXHUyNEM1JzogJ1AnLFxuICAgICdcXHVGRjMwJzogJ1AnLFxuICAgICdcXHUxRTU0JzogJ1AnLFxuICAgICdcXHUxRTU2JzogJ1AnLFxuICAgICdcXHUwMUE0JzogJ1AnLFxuICAgICdcXHUyQzYzJzogJ1AnLFxuICAgICdcXHVBNzUwJzogJ1AnLFxuICAgICdcXHVBNzUyJzogJ1AnLFxuICAgICdcXHVBNzU0JzogJ1AnLFxuICAgICdcXHUyNEM2JzogJ1EnLFxuICAgICdcXHVGRjMxJzogJ1EnLFxuICAgICdcXHVBNzU2JzogJ1EnLFxuICAgICdcXHVBNzU4JzogJ1EnLFxuICAgICdcXHUwMjRBJzogJ1EnLFxuICAgICdcXHUyNEM3JzogJ1InLFxuICAgICdcXHVGRjMyJzogJ1InLFxuICAgICdcXHUwMTU0JzogJ1InLFxuICAgICdcXHUxRTU4JzogJ1InLFxuICAgICdcXHUwMTU4JzogJ1InLFxuICAgICdcXHUwMjEwJzogJ1InLFxuICAgICdcXHUwMjEyJzogJ1InLFxuICAgICdcXHUxRTVBJzogJ1InLFxuICAgICdcXHUxRTVDJzogJ1InLFxuICAgICdcXHUwMTU2JzogJ1InLFxuICAgICdcXHUxRTVFJzogJ1InLFxuICAgICdcXHUwMjRDJzogJ1InLFxuICAgICdcXHUyQzY0JzogJ1InLFxuICAgICdcXHVBNzVBJzogJ1InLFxuICAgICdcXHVBN0E2JzogJ1InLFxuICAgICdcXHVBNzgyJzogJ1InLFxuICAgICdcXHUyNEM4JzogJ1MnLFxuICAgICdcXHVGRjMzJzogJ1MnLFxuICAgICdcXHUxRTlFJzogJ1MnLFxuICAgICdcXHUwMTVBJzogJ1MnLFxuICAgICdcXHUxRTY0JzogJ1MnLFxuICAgICdcXHUwMTVDJzogJ1MnLFxuICAgICdcXHUxRTYwJzogJ1MnLFxuICAgICdcXHUwMTYwJzogJ1MnLFxuICAgICdcXHUxRTY2JzogJ1MnLFxuICAgICdcXHUxRTYyJzogJ1MnLFxuICAgICdcXHUxRTY4JzogJ1MnLFxuICAgICdcXHUwMjE4JzogJ1MnLFxuICAgICdcXHUwMTVFJzogJ1MnLFxuICAgICdcXHUyQzdFJzogJ1MnLFxuICAgICdcXHVBN0E4JzogJ1MnLFxuICAgICdcXHVBNzg0JzogJ1MnLFxuICAgICdcXHUyNEM5JzogJ1QnLFxuICAgICdcXHVGRjM0JzogJ1QnLFxuICAgICdcXHUxRTZBJzogJ1QnLFxuICAgICdcXHUwMTY0JzogJ1QnLFxuICAgICdcXHUxRTZDJzogJ1QnLFxuICAgICdcXHUwMjFBJzogJ1QnLFxuICAgICdcXHUwMTYyJzogJ1QnLFxuICAgICdcXHUxRTcwJzogJ1QnLFxuICAgICdcXHUxRTZFJzogJ1QnLFxuICAgICdcXHUwMTY2JzogJ1QnLFxuICAgICdcXHUwMUFDJzogJ1QnLFxuICAgICdcXHUwMUFFJzogJ1QnLFxuICAgICdcXHUwMjNFJzogJ1QnLFxuICAgICdcXHVBNzg2JzogJ1QnLFxuICAgICdcXHVBNzI4JzogJ1RaJyxcbiAgICAnXFx1MjRDQSc6ICdVJyxcbiAgICAnXFx1RkYzNSc6ICdVJyxcbiAgICAnXFx1MDBEOSc6ICdVJyxcbiAgICAnXFx1MDBEQSc6ICdVJyxcbiAgICAnXFx1MDBEQic6ICdVJyxcbiAgICAnXFx1MDE2OCc6ICdVJyxcbiAgICAnXFx1MUU3OCc6ICdVJyxcbiAgICAnXFx1MDE2QSc6ICdVJyxcbiAgICAnXFx1MUU3QSc6ICdVJyxcbiAgICAnXFx1MDE2Qyc6ICdVJyxcbiAgICAnXFx1MDBEQyc6ICdVJyxcbiAgICAnXFx1MDFEQic6ICdVJyxcbiAgICAnXFx1MDFENyc6ICdVJyxcbiAgICAnXFx1MDFENSc6ICdVJyxcbiAgICAnXFx1MDFEOSc6ICdVJyxcbiAgICAnXFx1MUVFNic6ICdVJyxcbiAgICAnXFx1MDE2RSc6ICdVJyxcbiAgICAnXFx1MDE3MCc6ICdVJyxcbiAgICAnXFx1MDFEMyc6ICdVJyxcbiAgICAnXFx1MDIxNCc6ICdVJyxcbiAgICAnXFx1MDIxNic6ICdVJyxcbiAgICAnXFx1MDFBRic6ICdVJyxcbiAgICAnXFx1MUVFQSc6ICdVJyxcbiAgICAnXFx1MUVFOCc6ICdVJyxcbiAgICAnXFx1MUVFRSc6ICdVJyxcbiAgICAnXFx1MUVFQyc6ICdVJyxcbiAgICAnXFx1MUVGMCc6ICdVJyxcbiAgICAnXFx1MUVFNCc6ICdVJyxcbiAgICAnXFx1MUU3Mic6ICdVJyxcbiAgICAnXFx1MDE3Mic6ICdVJyxcbiAgICAnXFx1MUU3Nic6ICdVJyxcbiAgICAnXFx1MUU3NCc6ICdVJyxcbiAgICAnXFx1MDI0NCc6ICdVJyxcbiAgICAnXFx1MjRDQic6ICdWJyxcbiAgICAnXFx1RkYzNic6ICdWJyxcbiAgICAnXFx1MUU3Qyc6ICdWJyxcbiAgICAnXFx1MUU3RSc6ICdWJyxcbiAgICAnXFx1MDFCMic6ICdWJyxcbiAgICAnXFx1QTc1RSc6ICdWJyxcbiAgICAnXFx1MDI0NSc6ICdWJyxcbiAgICAnXFx1QTc2MCc6ICdWWScsXG4gICAgJ1xcdTI0Q0MnOiAnVycsXG4gICAgJ1xcdUZGMzcnOiAnVycsXG4gICAgJ1xcdTFFODAnOiAnVycsXG4gICAgJ1xcdTFFODInOiAnVycsXG4gICAgJ1xcdTAxNzQnOiAnVycsXG4gICAgJ1xcdTFFODYnOiAnVycsXG4gICAgJ1xcdTFFODQnOiAnVycsXG4gICAgJ1xcdTFFODgnOiAnVycsXG4gICAgJ1xcdTJDNzInOiAnVycsXG4gICAgJ1xcdTI0Q0QnOiAnWCcsXG4gICAgJ1xcdUZGMzgnOiAnWCcsXG4gICAgJ1xcdTFFOEEnOiAnWCcsXG4gICAgJ1xcdTFFOEMnOiAnWCcsXG4gICAgJ1xcdTI0Q0UnOiAnWScsXG4gICAgJ1xcdUZGMzknOiAnWScsXG4gICAgJ1xcdTFFRjInOiAnWScsXG4gICAgJ1xcdTAwREQnOiAnWScsXG4gICAgJ1xcdTAxNzYnOiAnWScsXG4gICAgJ1xcdTFFRjgnOiAnWScsXG4gICAgJ1xcdTAyMzInOiAnWScsXG4gICAgJ1xcdTFFOEUnOiAnWScsXG4gICAgJ1xcdTAxNzgnOiAnWScsXG4gICAgJ1xcdTFFRjYnOiAnWScsXG4gICAgJ1xcdTFFRjQnOiAnWScsXG4gICAgJ1xcdTAxQjMnOiAnWScsXG4gICAgJ1xcdTAyNEUnOiAnWScsXG4gICAgJ1xcdTFFRkUnOiAnWScsXG4gICAgJ1xcdTI0Q0YnOiAnWicsXG4gICAgJ1xcdUZGM0EnOiAnWicsXG4gICAgJ1xcdTAxNzknOiAnWicsXG4gICAgJ1xcdTFFOTAnOiAnWicsXG4gICAgJ1xcdTAxN0InOiAnWicsXG4gICAgJ1xcdTAxN0QnOiAnWicsXG4gICAgJ1xcdTFFOTInOiAnWicsXG4gICAgJ1xcdTFFOTQnOiAnWicsXG4gICAgJ1xcdTAxQjUnOiAnWicsXG4gICAgJ1xcdTAyMjQnOiAnWicsXG4gICAgJ1xcdTJDN0YnOiAnWicsXG4gICAgJ1xcdTJDNkInOiAnWicsXG4gICAgJ1xcdUE3NjInOiAnWicsXG4gICAgJ1xcdTI0RDAnOiAnYScsXG4gICAgJ1xcdUZGNDEnOiAnYScsXG4gICAgJ1xcdTFFOUEnOiAnYScsXG4gICAgJ1xcdTAwRTAnOiAnYScsXG4gICAgJ1xcdTAwRTEnOiAnYScsXG4gICAgJ1xcdTAwRTInOiAnYScsXG4gICAgJ1xcdTFFQTcnOiAnYScsXG4gICAgJ1xcdTFFQTUnOiAnYScsXG4gICAgJ1xcdTFFQUInOiAnYScsXG4gICAgJ1xcdTFFQTknOiAnYScsXG4gICAgJ1xcdTAwRTMnOiAnYScsXG4gICAgJ1xcdTAxMDEnOiAnYScsXG4gICAgJ1xcdTAxMDMnOiAnYScsXG4gICAgJ1xcdTFFQjEnOiAnYScsXG4gICAgJ1xcdTFFQUYnOiAnYScsXG4gICAgJ1xcdTFFQjUnOiAnYScsXG4gICAgJ1xcdTFFQjMnOiAnYScsXG4gICAgJ1xcdTAyMjcnOiAnYScsXG4gICAgJ1xcdTAxRTEnOiAnYScsXG4gICAgJ1xcdTAwRTQnOiAnYScsXG4gICAgJ1xcdTAxREYnOiAnYScsXG4gICAgJ1xcdTFFQTMnOiAnYScsXG4gICAgJ1xcdTAwRTUnOiAnYScsXG4gICAgJ1xcdTAxRkInOiAnYScsXG4gICAgJ1xcdTAxQ0UnOiAnYScsXG4gICAgJ1xcdTAyMDEnOiAnYScsXG4gICAgJ1xcdTAyMDMnOiAnYScsXG4gICAgJ1xcdTFFQTEnOiAnYScsXG4gICAgJ1xcdTFFQUQnOiAnYScsXG4gICAgJ1xcdTFFQjcnOiAnYScsXG4gICAgJ1xcdTFFMDEnOiAnYScsXG4gICAgJ1xcdTAxMDUnOiAnYScsXG4gICAgJ1xcdTJDNjUnOiAnYScsXG4gICAgJ1xcdTAyNTAnOiAnYScsXG4gICAgJ1xcdUE3MzMnOiAnYWEnLFxuICAgICdcXHUwMEU2JzogJ2FlJyxcbiAgICAnXFx1MDFGRCc6ICdhZScsXG4gICAgJ1xcdTAxRTMnOiAnYWUnLFxuICAgICdcXHVBNzM1JzogJ2FvJyxcbiAgICAnXFx1QTczNyc6ICdhdScsXG4gICAgJ1xcdUE3MzknOiAnYXYnLFxuICAgICdcXHVBNzNCJzogJ2F2JyxcbiAgICAnXFx1QTczRCc6ICdheScsXG4gICAgJ1xcdTI0RDEnOiAnYicsXG4gICAgJ1xcdUZGNDInOiAnYicsXG4gICAgJ1xcdTFFMDMnOiAnYicsXG4gICAgJ1xcdTFFMDUnOiAnYicsXG4gICAgJ1xcdTFFMDcnOiAnYicsXG4gICAgJ1xcdTAxODAnOiAnYicsXG4gICAgJ1xcdTAxODMnOiAnYicsXG4gICAgJ1xcdTAyNTMnOiAnYicsXG4gICAgJ1xcdTI0RDInOiAnYycsXG4gICAgJ1xcdUZGNDMnOiAnYycsXG4gICAgJ1xcdTAxMDcnOiAnYycsXG4gICAgJ1xcdTAxMDknOiAnYycsXG4gICAgJ1xcdTAxMEInOiAnYycsXG4gICAgJ1xcdTAxMEQnOiAnYycsXG4gICAgJ1xcdTAwRTcnOiAnYycsXG4gICAgJ1xcdTFFMDknOiAnYycsXG4gICAgJ1xcdTAxODgnOiAnYycsXG4gICAgJ1xcdTAyM0MnOiAnYycsXG4gICAgJ1xcdUE3M0YnOiAnYycsXG4gICAgJ1xcdTIxODQnOiAnYycsXG4gICAgJ1xcdTI0RDMnOiAnZCcsXG4gICAgJ1xcdUZGNDQnOiAnZCcsXG4gICAgJ1xcdTFFMEInOiAnZCcsXG4gICAgJ1xcdTAxMEYnOiAnZCcsXG4gICAgJ1xcdTFFMEQnOiAnZCcsXG4gICAgJ1xcdTFFMTEnOiAnZCcsXG4gICAgJ1xcdTFFMTMnOiAnZCcsXG4gICAgJ1xcdTFFMEYnOiAnZCcsXG4gICAgJ1xcdTAxMTEnOiAnZCcsXG4gICAgJ1xcdTAxOEMnOiAnZCcsXG4gICAgJ1xcdTAyNTYnOiAnZCcsXG4gICAgJ1xcdTAyNTcnOiAnZCcsXG4gICAgJ1xcdUE3N0EnOiAnZCcsXG4gICAgJ1xcdTAxRjMnOiAnZHonLFxuICAgICdcXHUwMUM2JzogJ2R6JyxcbiAgICAnXFx1MjRENCc6ICdlJyxcbiAgICAnXFx1RkY0NSc6ICdlJyxcbiAgICAnXFx1MDBFOCc6ICdlJyxcbiAgICAnXFx1MDBFOSc6ICdlJyxcbiAgICAnXFx1MDBFQSc6ICdlJyxcbiAgICAnXFx1MUVDMSc6ICdlJyxcbiAgICAnXFx1MUVCRic6ICdlJyxcbiAgICAnXFx1MUVDNSc6ICdlJyxcbiAgICAnXFx1MUVDMyc6ICdlJyxcbiAgICAnXFx1MUVCRCc6ICdlJyxcbiAgICAnXFx1MDExMyc6ICdlJyxcbiAgICAnXFx1MUUxNSc6ICdlJyxcbiAgICAnXFx1MUUxNyc6ICdlJyxcbiAgICAnXFx1MDExNSc6ICdlJyxcbiAgICAnXFx1MDExNyc6ICdlJyxcbiAgICAnXFx1MDBFQic6ICdlJyxcbiAgICAnXFx1MUVCQic6ICdlJyxcbiAgICAnXFx1MDExQic6ICdlJyxcbiAgICAnXFx1MDIwNSc6ICdlJyxcbiAgICAnXFx1MDIwNyc6ICdlJyxcbiAgICAnXFx1MUVCOSc6ICdlJyxcbiAgICAnXFx1MUVDNyc6ICdlJyxcbiAgICAnXFx1MDIyOSc6ICdlJyxcbiAgICAnXFx1MUUxRCc6ICdlJyxcbiAgICAnXFx1MDExOSc6ICdlJyxcbiAgICAnXFx1MUUxOSc6ICdlJyxcbiAgICAnXFx1MUUxQic6ICdlJyxcbiAgICAnXFx1MDI0Nyc6ICdlJyxcbiAgICAnXFx1MDI1Qic6ICdlJyxcbiAgICAnXFx1MDFERCc6ICdlJyxcbiAgICAnXFx1MjRENSc6ICdmJyxcbiAgICAnXFx1RkY0Nic6ICdmJyxcbiAgICAnXFx1MUUxRic6ICdmJyxcbiAgICAnXFx1MDE5Mic6ICdmJyxcbiAgICAnXFx1QTc3Qyc6ICdmJyxcbiAgICAnXFx1MjRENic6ICdnJyxcbiAgICAnXFx1RkY0Nyc6ICdnJyxcbiAgICAnXFx1MDFGNSc6ICdnJyxcbiAgICAnXFx1MDExRCc6ICdnJyxcbiAgICAnXFx1MUUyMSc6ICdnJyxcbiAgICAnXFx1MDExRic6ICdnJyxcbiAgICAnXFx1MDEyMSc6ICdnJyxcbiAgICAnXFx1MDFFNyc6ICdnJyxcbiAgICAnXFx1MDEyMyc6ICdnJyxcbiAgICAnXFx1MDFFNSc6ICdnJyxcbiAgICAnXFx1MDI2MCc6ICdnJyxcbiAgICAnXFx1QTdBMSc6ICdnJyxcbiAgICAnXFx1MUQ3OSc6ICdnJyxcbiAgICAnXFx1QTc3Ric6ICdnJyxcbiAgICAnXFx1MjRENyc6ICdoJyxcbiAgICAnXFx1RkY0OCc6ICdoJyxcbiAgICAnXFx1MDEyNSc6ICdoJyxcbiAgICAnXFx1MUUyMyc6ICdoJyxcbiAgICAnXFx1MUUyNyc6ICdoJyxcbiAgICAnXFx1MDIxRic6ICdoJyxcbiAgICAnXFx1MUUyNSc6ICdoJyxcbiAgICAnXFx1MUUyOSc6ICdoJyxcbiAgICAnXFx1MUUyQic6ICdoJyxcbiAgICAnXFx1MUU5Nic6ICdoJyxcbiAgICAnXFx1MDEyNyc6ICdoJyxcbiAgICAnXFx1MkM2OCc6ICdoJyxcbiAgICAnXFx1MkM3Nic6ICdoJyxcbiAgICAnXFx1MDI2NSc6ICdoJyxcbiAgICAnXFx1MDE5NSc6ICdodicsXG4gICAgJ1xcdTI0RDgnOiAnaScsXG4gICAgJ1xcdUZGNDknOiAnaScsXG4gICAgJ1xcdTAwRUMnOiAnaScsXG4gICAgJ1xcdTAwRUQnOiAnaScsXG4gICAgJ1xcdTAwRUUnOiAnaScsXG4gICAgJ1xcdTAxMjknOiAnaScsXG4gICAgJ1xcdTAxMkInOiAnaScsXG4gICAgJ1xcdTAxMkQnOiAnaScsXG4gICAgJ1xcdTAwRUYnOiAnaScsXG4gICAgJ1xcdTFFMkYnOiAnaScsXG4gICAgJ1xcdTFFQzknOiAnaScsXG4gICAgJ1xcdTAxRDAnOiAnaScsXG4gICAgJ1xcdTAyMDknOiAnaScsXG4gICAgJ1xcdTAyMEInOiAnaScsXG4gICAgJ1xcdTFFQ0InOiAnaScsXG4gICAgJ1xcdTAxMkYnOiAnaScsXG4gICAgJ1xcdTFFMkQnOiAnaScsXG4gICAgJ1xcdTAyNjgnOiAnaScsXG4gICAgJ1xcdTAxMzEnOiAnaScsXG4gICAgJ1xcdTI0RDknOiAnaicsXG4gICAgJ1xcdUZGNEEnOiAnaicsXG4gICAgJ1xcdTAxMzUnOiAnaicsXG4gICAgJ1xcdTAxRjAnOiAnaicsXG4gICAgJ1xcdTAyNDknOiAnaicsXG4gICAgJ1xcdTI0REEnOiAnaycsXG4gICAgJ1xcdUZGNEInOiAnaycsXG4gICAgJ1xcdTFFMzEnOiAnaycsXG4gICAgJ1xcdTAxRTknOiAnaycsXG4gICAgJ1xcdTFFMzMnOiAnaycsXG4gICAgJ1xcdTAxMzcnOiAnaycsXG4gICAgJ1xcdTFFMzUnOiAnaycsXG4gICAgJ1xcdTAxOTknOiAnaycsXG4gICAgJ1xcdTJDNkEnOiAnaycsXG4gICAgJ1xcdUE3NDEnOiAnaycsXG4gICAgJ1xcdUE3NDMnOiAnaycsXG4gICAgJ1xcdUE3NDUnOiAnaycsXG4gICAgJ1xcdUE3QTMnOiAnaycsXG4gICAgJ1xcdTI0REInOiAnbCcsXG4gICAgJ1xcdUZGNEMnOiAnbCcsXG4gICAgJ1xcdTAxNDAnOiAnbCcsXG4gICAgJ1xcdTAxM0EnOiAnbCcsXG4gICAgJ1xcdTAxM0UnOiAnbCcsXG4gICAgJ1xcdTFFMzcnOiAnbCcsXG4gICAgJ1xcdTFFMzknOiAnbCcsXG4gICAgJ1xcdTAxM0MnOiAnbCcsXG4gICAgJ1xcdTFFM0QnOiAnbCcsXG4gICAgJ1xcdTFFM0InOiAnbCcsXG4gICAgJ1xcdTAxN0YnOiAnbCcsXG4gICAgJ1xcdTAxNDInOiAnbCcsXG4gICAgJ1xcdTAxOUEnOiAnbCcsXG4gICAgJ1xcdTAyNkInOiAnbCcsXG4gICAgJ1xcdTJDNjEnOiAnbCcsXG4gICAgJ1xcdUE3NDknOiAnbCcsXG4gICAgJ1xcdUE3ODEnOiAnbCcsXG4gICAgJ1xcdUE3NDcnOiAnbCcsXG4gICAgJ1xcdTAxQzknOiAnbGonLFxuICAgICdcXHUyNERDJzogJ20nLFxuICAgICdcXHVGRjREJzogJ20nLFxuICAgICdcXHUxRTNGJzogJ20nLFxuICAgICdcXHUxRTQxJzogJ20nLFxuICAgICdcXHUxRTQzJzogJ20nLFxuICAgICdcXHUwMjcxJzogJ20nLFxuICAgICdcXHUwMjZGJzogJ20nLFxuICAgICdcXHUyNEREJzogJ24nLFxuICAgICdcXHVGRjRFJzogJ24nLFxuICAgICdcXHUwMUY5JzogJ24nLFxuICAgICdcXHUwMTQ0JzogJ24nLFxuICAgICdcXHUwMEYxJzogJ24nLFxuICAgICdcXHUxRTQ1JzogJ24nLFxuICAgICdcXHUwMTQ4JzogJ24nLFxuICAgICdcXHUxRTQ3JzogJ24nLFxuICAgICdcXHUwMTQ2JzogJ24nLFxuICAgICdcXHUxRTRCJzogJ24nLFxuICAgICdcXHUxRTQ5JzogJ24nLFxuICAgICdcXHUwMTlFJzogJ24nLFxuICAgICdcXHUwMjcyJzogJ24nLFxuICAgICdcXHUwMTQ5JzogJ24nLFxuICAgICdcXHVBNzkxJzogJ24nLFxuICAgICdcXHVBN0E1JzogJ24nLFxuICAgICdcXHUwMUNDJzogJ25qJyxcbiAgICAnXFx1MjRERSc6ICdvJyxcbiAgICAnXFx1RkY0Ric6ICdvJyxcbiAgICAnXFx1MDBGMic6ICdvJyxcbiAgICAnXFx1MDBGMyc6ICdvJyxcbiAgICAnXFx1MDBGNCc6ICdvJyxcbiAgICAnXFx1MUVEMyc6ICdvJyxcbiAgICAnXFx1MUVEMSc6ICdvJyxcbiAgICAnXFx1MUVENyc6ICdvJyxcbiAgICAnXFx1MUVENSc6ICdvJyxcbiAgICAnXFx1MDBGNSc6ICdvJyxcbiAgICAnXFx1MUU0RCc6ICdvJyxcbiAgICAnXFx1MDIyRCc6ICdvJyxcbiAgICAnXFx1MUU0Ric6ICdvJyxcbiAgICAnXFx1MDE0RCc6ICdvJyxcbiAgICAnXFx1MUU1MSc6ICdvJyxcbiAgICAnXFx1MUU1Myc6ICdvJyxcbiAgICAnXFx1MDE0Ric6ICdvJyxcbiAgICAnXFx1MDIyRic6ICdvJyxcbiAgICAnXFx1MDIzMSc6ICdvJyxcbiAgICAnXFx1MDBGNic6ICdvJyxcbiAgICAnXFx1MDIyQic6ICdvJyxcbiAgICAnXFx1MUVDRic6ICdvJyxcbiAgICAnXFx1MDE1MSc6ICdvJyxcbiAgICAnXFx1MDFEMic6ICdvJyxcbiAgICAnXFx1MDIwRCc6ICdvJyxcbiAgICAnXFx1MDIwRic6ICdvJyxcbiAgICAnXFx1MDFBMSc6ICdvJyxcbiAgICAnXFx1MUVERCc6ICdvJyxcbiAgICAnXFx1MUVEQic6ICdvJyxcbiAgICAnXFx1MUVFMSc6ICdvJyxcbiAgICAnXFx1MUVERic6ICdvJyxcbiAgICAnXFx1MUVFMyc6ICdvJyxcbiAgICAnXFx1MUVDRCc6ICdvJyxcbiAgICAnXFx1MUVEOSc6ICdvJyxcbiAgICAnXFx1MDFFQic6ICdvJyxcbiAgICAnXFx1MDFFRCc6ICdvJyxcbiAgICAnXFx1MDBGOCc6ICdvJyxcbiAgICAnXFx1MDFGRic6ICdvJyxcbiAgICAnXFx1MDI1NCc6ICdvJyxcbiAgICAnXFx1QTc0Qic6ICdvJyxcbiAgICAnXFx1QTc0RCc6ICdvJyxcbiAgICAnXFx1MDI3NSc6ICdvJyxcbiAgICAnXFx1MDE1Myc6ICdvZScsXG4gICAgJ1xcdTAxQTMnOiAnb2knLFxuICAgICdcXHUwMjIzJzogJ291JyxcbiAgICAnXFx1QTc0Ric6ICdvbycsXG4gICAgJ1xcdTI0REYnOiAncCcsXG4gICAgJ1xcdUZGNTAnOiAncCcsXG4gICAgJ1xcdTFFNTUnOiAncCcsXG4gICAgJ1xcdTFFNTcnOiAncCcsXG4gICAgJ1xcdTAxQTUnOiAncCcsXG4gICAgJ1xcdTFEN0QnOiAncCcsXG4gICAgJ1xcdUE3NTEnOiAncCcsXG4gICAgJ1xcdUE3NTMnOiAncCcsXG4gICAgJ1xcdUE3NTUnOiAncCcsXG4gICAgJ1xcdTI0RTAnOiAncScsXG4gICAgJ1xcdUZGNTEnOiAncScsXG4gICAgJ1xcdTAyNEInOiAncScsXG4gICAgJ1xcdUE3NTcnOiAncScsXG4gICAgJ1xcdUE3NTknOiAncScsXG4gICAgJ1xcdTI0RTEnOiAncicsXG4gICAgJ1xcdUZGNTInOiAncicsXG4gICAgJ1xcdTAxNTUnOiAncicsXG4gICAgJ1xcdTFFNTknOiAncicsXG4gICAgJ1xcdTAxNTknOiAncicsXG4gICAgJ1xcdTAyMTEnOiAncicsXG4gICAgJ1xcdTAyMTMnOiAncicsXG4gICAgJ1xcdTFFNUInOiAncicsXG4gICAgJ1xcdTFFNUQnOiAncicsXG4gICAgJ1xcdTAxNTcnOiAncicsXG4gICAgJ1xcdTFFNUYnOiAncicsXG4gICAgJ1xcdTAyNEQnOiAncicsXG4gICAgJ1xcdTAyN0QnOiAncicsXG4gICAgJ1xcdUE3NUInOiAncicsXG4gICAgJ1xcdUE3QTcnOiAncicsXG4gICAgJ1xcdUE3ODMnOiAncicsXG4gICAgJ1xcdTI0RTInOiAncycsXG4gICAgJ1xcdUZGNTMnOiAncycsXG4gICAgJ1xcdTAwREYnOiAncycsXG4gICAgJ1xcdTAxNUInOiAncycsXG4gICAgJ1xcdTFFNjUnOiAncycsXG4gICAgJ1xcdTAxNUQnOiAncycsXG4gICAgJ1xcdTFFNjEnOiAncycsXG4gICAgJ1xcdTAxNjEnOiAncycsXG4gICAgJ1xcdTFFNjcnOiAncycsXG4gICAgJ1xcdTFFNjMnOiAncycsXG4gICAgJ1xcdTFFNjknOiAncycsXG4gICAgJ1xcdTAyMTknOiAncycsXG4gICAgJ1xcdTAxNUYnOiAncycsXG4gICAgJ1xcdTAyM0YnOiAncycsXG4gICAgJ1xcdUE3QTknOiAncycsXG4gICAgJ1xcdUE3ODUnOiAncycsXG4gICAgJ1xcdTFFOUInOiAncycsXG4gICAgJ1xcdTI0RTMnOiAndCcsXG4gICAgJ1xcdUZGNTQnOiAndCcsXG4gICAgJ1xcdTFFNkInOiAndCcsXG4gICAgJ1xcdTFFOTcnOiAndCcsXG4gICAgJ1xcdTAxNjUnOiAndCcsXG4gICAgJ1xcdTFFNkQnOiAndCcsXG4gICAgJ1xcdTAyMUInOiAndCcsXG4gICAgJ1xcdTAxNjMnOiAndCcsXG4gICAgJ1xcdTFFNzEnOiAndCcsXG4gICAgJ1xcdTFFNkYnOiAndCcsXG4gICAgJ1xcdTAxNjcnOiAndCcsXG4gICAgJ1xcdTAxQUQnOiAndCcsXG4gICAgJ1xcdTAyODgnOiAndCcsXG4gICAgJ1xcdTJDNjYnOiAndCcsXG4gICAgJ1xcdUE3ODcnOiAndCcsXG4gICAgJ1xcdUE3MjknOiAndHonLFxuICAgICdcXHUyNEU0JzogJ3UnLFxuICAgICdcXHVGRjU1JzogJ3UnLFxuICAgICdcXHUwMEY5JzogJ3UnLFxuICAgICdcXHUwMEZBJzogJ3UnLFxuICAgICdcXHUwMEZCJzogJ3UnLFxuICAgICdcXHUwMTY5JzogJ3UnLFxuICAgICdcXHUxRTc5JzogJ3UnLFxuICAgICdcXHUwMTZCJzogJ3UnLFxuICAgICdcXHUxRTdCJzogJ3UnLFxuICAgICdcXHUwMTZEJzogJ3UnLFxuICAgICdcXHUwMEZDJzogJ3UnLFxuICAgICdcXHUwMURDJzogJ3UnLFxuICAgICdcXHUwMUQ4JzogJ3UnLFxuICAgICdcXHUwMUQ2JzogJ3UnLFxuICAgICdcXHUwMURBJzogJ3UnLFxuICAgICdcXHUxRUU3JzogJ3UnLFxuICAgICdcXHUwMTZGJzogJ3UnLFxuICAgICdcXHUwMTcxJzogJ3UnLFxuICAgICdcXHUwMUQ0JzogJ3UnLFxuICAgICdcXHUwMjE1JzogJ3UnLFxuICAgICdcXHUwMjE3JzogJ3UnLFxuICAgICdcXHUwMUIwJzogJ3UnLFxuICAgICdcXHUxRUVCJzogJ3UnLFxuICAgICdcXHUxRUU5JzogJ3UnLFxuICAgICdcXHUxRUVGJzogJ3UnLFxuICAgICdcXHUxRUVEJzogJ3UnLFxuICAgICdcXHUxRUYxJzogJ3UnLFxuICAgICdcXHUxRUU1JzogJ3UnLFxuICAgICdcXHUxRTczJzogJ3UnLFxuICAgICdcXHUwMTczJzogJ3UnLFxuICAgICdcXHUxRTc3JzogJ3UnLFxuICAgICdcXHUxRTc1JzogJ3UnLFxuICAgICdcXHUwMjg5JzogJ3UnLFxuICAgICdcXHUyNEU1JzogJ3YnLFxuICAgICdcXHVGRjU2JzogJ3YnLFxuICAgICdcXHUxRTdEJzogJ3YnLFxuICAgICdcXHUxRTdGJzogJ3YnLFxuICAgICdcXHUwMjhCJzogJ3YnLFxuICAgICdcXHVBNzVGJzogJ3YnLFxuICAgICdcXHUwMjhDJzogJ3YnLFxuICAgICdcXHVBNzYxJzogJ3Z5JyxcbiAgICAnXFx1MjRFNic6ICd3JyxcbiAgICAnXFx1RkY1Nyc6ICd3JyxcbiAgICAnXFx1MUU4MSc6ICd3JyxcbiAgICAnXFx1MUU4Myc6ICd3JyxcbiAgICAnXFx1MDE3NSc6ICd3JyxcbiAgICAnXFx1MUU4Nyc6ICd3JyxcbiAgICAnXFx1MUU4NSc6ICd3JyxcbiAgICAnXFx1MUU5OCc6ICd3JyxcbiAgICAnXFx1MUU4OSc6ICd3JyxcbiAgICAnXFx1MkM3Myc6ICd3JyxcbiAgICAnXFx1MjRFNyc6ICd4JyxcbiAgICAnXFx1RkY1OCc6ICd4JyxcbiAgICAnXFx1MUU4Qic6ICd4JyxcbiAgICAnXFx1MUU4RCc6ICd4JyxcbiAgICAnXFx1MjRFOCc6ICd5JyxcbiAgICAnXFx1RkY1OSc6ICd5JyxcbiAgICAnXFx1MUVGMyc6ICd5JyxcbiAgICAnXFx1MDBGRCc6ICd5JyxcbiAgICAnXFx1MDE3Nyc6ICd5JyxcbiAgICAnXFx1MUVGOSc6ICd5JyxcbiAgICAnXFx1MDIzMyc6ICd5JyxcbiAgICAnXFx1MUU4Ric6ICd5JyxcbiAgICAnXFx1MDBGRic6ICd5JyxcbiAgICAnXFx1MUVGNyc6ICd5JyxcbiAgICAnXFx1MUU5OSc6ICd5JyxcbiAgICAnXFx1MUVGNSc6ICd5JyxcbiAgICAnXFx1MDFCNCc6ICd5JyxcbiAgICAnXFx1MDI0Ric6ICd5JyxcbiAgICAnXFx1MUVGRic6ICd5JyxcbiAgICAnXFx1MjRFOSc6ICd6JyxcbiAgICAnXFx1RkY1QSc6ICd6JyxcbiAgICAnXFx1MDE3QSc6ICd6JyxcbiAgICAnXFx1MUU5MSc6ICd6JyxcbiAgICAnXFx1MDE3Qyc6ICd6JyxcbiAgICAnXFx1MDE3RSc6ICd6JyxcbiAgICAnXFx1MUU5Myc6ICd6JyxcbiAgICAnXFx1MUU5NSc6ICd6JyxcbiAgICAnXFx1MDFCNic6ICd6JyxcbiAgICAnXFx1MDIyNSc6ICd6JyxcbiAgICAnXFx1MDI0MCc6ICd6JyxcbiAgICAnXFx1MkM2Qyc6ICd6JyxcbiAgICAnXFx1QTc2Myc6ICd6JyxcbiAgICAnXFx1MDM4Nic6ICdcXHUwMzkxJyxcbiAgICAnXFx1MDM4OCc6ICdcXHUwMzk1JyxcbiAgICAnXFx1MDM4OSc6ICdcXHUwMzk3JyxcbiAgICAnXFx1MDM4QSc6ICdcXHUwMzk5JyxcbiAgICAnXFx1MDNBQSc6ICdcXHUwMzk5JyxcbiAgICAnXFx1MDM4Qyc6ICdcXHUwMzlGJyxcbiAgICAnXFx1MDM4RSc6ICdcXHUwM0E1JyxcbiAgICAnXFx1MDNBQic6ICdcXHUwM0E1JyxcbiAgICAnXFx1MDM4Ric6ICdcXHUwM0E5JyxcbiAgICAnXFx1MDNBQyc6ICdcXHUwM0IxJyxcbiAgICAnXFx1MDNBRCc6ICdcXHUwM0I1JyxcbiAgICAnXFx1MDNBRSc6ICdcXHUwM0I3JyxcbiAgICAnXFx1MDNBRic6ICdcXHUwM0I5JyxcbiAgICAnXFx1MDNDQSc6ICdcXHUwM0I5JyxcbiAgICAnXFx1MDM5MCc6ICdcXHUwM0I5JyxcbiAgICAnXFx1MDNDQyc6ICdcXHUwM0JGJyxcbiAgICAnXFx1MDNDRCc6ICdcXHUwM0M1JyxcbiAgICAnXFx1MDNDQic6ICdcXHUwM0M1JyxcbiAgICAnXFx1MDNCMCc6ICdcXHUwM0M1JyxcbiAgICAnXFx1MDNDRSc6ICdcXHUwM0M5JyxcbiAgICAnXFx1MDNDMic6ICdcXHUwM0MzJyxcbiAgICAnXFx1MjAxOSc6ICdcXCcnXG4gIH07XG5cbiAgcmV0dXJuIGRpYWNyaXRpY3M7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYmFzZScsW1xuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoVXRpbHMpIHtcbiAgZnVuY3Rpb24gQmFzZUFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgQmFzZUFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoQmFzZUFkYXB0ZXIsIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGN1cnJlbnRgIG1ldGhvZCBtdXN0IGJlIGRlZmluZWQgaW4gY2hpbGQgY2xhc3Nlcy4nKTtcbiAgfTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBxdWVyeWAgbWV0aG9kIG11c3QgYmUgZGVmaW5lZCBpbiBjaGlsZCBjbGFzc2VzLicpO1xuICB9O1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIC8vIENhbiBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXG4gIH07XG5cbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ2FuIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcbiAgfTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuZ2VuZXJhdGVSZXN1bHRJZCA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRhdGEpIHtcbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdC0nO1xuXG4gICAgaWQgKz0gVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcblxuICAgIGlmIChkYXRhLmlkICE9IG51bGwpIHtcbiAgICAgIGlkICs9ICctJyArIGRhdGEuaWQudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJy0nICsgVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIHJldHVybiBCYXNlQWRhcHRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9zZWxlY3QnLFtcbiAgJy4vYmFzZScsXG4gICcuLi91dGlscycsXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoQmFzZUFkYXB0ZXIsIFV0aWxzLCAkKSB7XG4gIGZ1bmN0aW9uIFNlbGVjdEFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBTZWxlY3RBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKFNlbGVjdEFkYXB0ZXIsIEJhc2VBZGFwdGVyKTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpzZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuXG4gICAgICBkYXRhLnB1c2gob3B0aW9uKTtcbiAgICB9KTtcblxuICAgIGNhbGxiYWNrKGRhdGEpO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAvLyBJZiBkYXRhLmVsZW1lbnQgaXMgYSBET00gbm9kZSwgdXNlIGl0IGluc3RlYWRcbiAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRpb24nKSkge1xuICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50LnByb3AoJ211bHRpcGxlJykpIHtcbiAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgdmFyIHZhbCA9IFtdO1xuXG4gICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgIGRhdGEucHVzaC5hcHBseShkYXRhLCBjdXJyZW50RGF0YSk7XG5cbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgdmFyIGlkID0gZGF0YVtkXS5pZDtcblxuICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsKTtcbiAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmFsID0gZGF0YS5pZDtcblxuICAgICAgdGhpcy4kZWxlbWVudC52YWwodmFsKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQucHJvcCgnbXVsdGlwbGUnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGlvbicpKSB7XG4gICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgIHZhciB2YWwgPSBbXTtcblxuICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBjdXJyZW50RGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICB2YXIgaWQgPSBjdXJyZW50RGF0YVtkXS5pZDtcblxuICAgICAgICBpZiAoaWQgIT09IGRhdGEuaWQgJiYgJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuXG4gICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigndW5zZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLnVuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFJlbW92ZSBhbnl0aGluZyBhZGRlZCB0byBjaGlsZCBlbGVtZW50c1xuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnKicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgLy8gUmVtb3ZlIGFueSBjdXN0b20gZGF0YSBzZXQgYnkgU2VsZWN0MlxuICAgICAgVXRpbHMuUmVtb3ZlRGF0YSh0aGlzKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCk7XG5cbiAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcblxuICAgICAgaWYgKCEkb3B0aW9uLmlzKCdvcHRpb24nKSAmJiAhJG9wdGlvbi5pcygnb3B0Z3JvdXAnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG5cbiAgICAgIHZhciBtYXRjaGVzID0gc2VsZi5tYXRjaGVzKHBhcmFtcywgb3B0aW9uKTtcblxuICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgZGF0YS5wdXNoKG1hdGNoZXMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2FsbGJhY2soe1xuICAgICAgcmVzdWx0czogZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmFkZE9wdGlvbnMgPSBmdW5jdGlvbiAoJG9wdGlvbnMpIHtcbiAgICBVdGlscy5hcHBlbmRNYW55KHRoaXMuJGVsZW1lbnQsICRvcHRpb25zKTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBvcHRpb247XG5cbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKTtcbiAgICAgIG9wdGlvbi5sYWJlbCA9IGRhdGEudGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cbiAgICAgIGlmIChvcHRpb24udGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBkYXRhLnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb24uaW5uZXJUZXh0ID0gZGF0YS50ZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbi52YWx1ZSA9IGRhdGEuaWQ7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuZGlzYWJsZWQpIHtcbiAgICAgIG9wdGlvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuc2VsZWN0ZWQpIHtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEudGl0bGUpIHtcbiAgICAgIG9wdGlvbi50aXRsZSA9IGRhdGEudGl0bGU7XG4gICAgfVxuXG4gICAgdmFyICRvcHRpb24gPSAkKG9wdGlvbik7XG5cbiAgICB2YXIgbm9ybWFsaXplZERhdGEgPSB0aGlzLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xuICAgIG5vcm1hbGl6ZWREYXRhLmVsZW1lbnQgPSBvcHRpb247XG5cbiAgICAvLyBPdmVycmlkZSB0aGUgb3B0aW9uJ3MgZGF0YSB3aXRoIHRoZSBjb21iaW5lZCBkYXRhXG4gICAgVXRpbHMuU3RvcmVEYXRhKG9wdGlvbiwgJ2RhdGEnLCBub3JtYWxpemVkRGF0YSk7XG5cbiAgICByZXR1cm4gJG9wdGlvbjtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5pdGVtID0gZnVuY3Rpb24gKCRvcHRpb24pIHtcbiAgICB2YXIgZGF0YSA9IHt9O1xuXG4gICAgZGF0YSA9IFV0aWxzLkdldERhdGEoJG9wdGlvblswXSwgJ2RhdGEnKTtcblxuICAgIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGlmICgkb3B0aW9uLmlzKCdvcHRpb24nKSkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgaWQ6ICRvcHRpb24udmFsKCksXG4gICAgICAgIHRleHQ6ICRvcHRpb24udGV4dCgpLFxuICAgICAgICBkaXNhYmxlZDogJG9wdGlvbi5wcm9wKCdkaXNhYmxlZCcpLFxuICAgICAgICBzZWxlY3RlZDogJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcpLFxuICAgICAgICB0aXRsZTogJG9wdGlvbi5wcm9wKCd0aXRsZScpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoJG9wdGlvbi5pcygnb3B0Z3JvdXAnKSkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgdGV4dDogJG9wdGlvbi5wcm9wKCdsYWJlbCcpLFxuICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgIHRpdGxlOiAkb3B0aW9uLnByb3AoJ3RpdGxlJylcbiAgICAgIH07XG5cbiAgICAgIHZhciAkY2hpbGRyZW4gPSAkb3B0aW9uLmNoaWxkcmVuKCdvcHRpb24nKTtcbiAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8ICRjaGlsZHJlbi5sZW5ndGg7IGMrKykge1xuICAgICAgICB2YXIgJGNoaWxkID0gJCgkY2hpbGRyZW5bY10pO1xuXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuaXRlbSgkY2hpbGQpO1xuXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBkYXRhLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgfVxuXG4gICAgZGF0YSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0oZGF0YSk7XG4gICAgZGF0YS5lbGVtZW50ID0gJG9wdGlvblswXTtcblxuICAgIFV0aWxzLlN0b3JlRGF0YSgkb3B0aW9uWzBdLCAnZGF0YScsIGRhdGEpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuX25vcm1hbGl6ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmIChpdGVtICE9PSBPYmplY3QoaXRlbSkpIHtcbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIGlkOiBpdGVtLFxuICAgICAgICB0ZXh0OiBpdGVtXG4gICAgICB9O1xuICAgIH1cblxuICAgIGl0ZW0gPSAkLmV4dGVuZCh7fSwge1xuICAgICAgdGV4dDogJydcbiAgICB9LCBpdGVtKTtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgIH07XG5cbiAgICBpZiAoaXRlbS5pZCAhPSBudWxsKSB7XG4gICAgICBpdGVtLmlkID0gaXRlbS5pZC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmIChpdGVtLnRleHQgIT0gbnVsbCkge1xuICAgICAgaXRlbS50ZXh0ID0gaXRlbS50ZXh0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0uX3Jlc3VsdElkID09IG51bGwgJiYgaXRlbS5pZCAmJiB0aGlzLmNvbnRhaW5lciAhPSBudWxsKSB7XG4gICAgICBpdGVtLl9yZXN1bHRJZCA9IHRoaXMuZ2VuZXJhdGVSZXN1bHRJZCh0aGlzLmNvbnRhaW5lciwgaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgaXRlbSk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChwYXJhbXMsIGRhdGEpIHtcbiAgICB2YXIgbWF0Y2hlciA9IHRoaXMub3B0aW9ucy5nZXQoJ21hdGNoZXInKTtcblxuICAgIHJldHVybiBtYXRjaGVyKHBhcmFtcywgZGF0YSk7XG4gIH07XG5cbiAgcmV0dXJuIFNlbGVjdEFkYXB0ZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYXJyYXknLFtcbiAgJy4vc2VsZWN0JyxcbiAgJy4uL3V0aWxzJyxcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscywgJCkge1xuICBmdW5jdGlvbiBBcnJheUFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIGRhdGEgPSBvcHRpb25zLmdldCgnZGF0YScpIHx8IFtdO1xuXG4gICAgQXJyYXlBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcblxuICAgIHRoaXMuYWRkT3B0aW9ucyh0aGlzLmNvbnZlcnRUb09wdGlvbnMoZGF0YSkpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKEFycmF5QWRhcHRlciwgU2VsZWN0QWRhcHRlcik7XG5cbiAgQXJyYXlBZGFwdGVyLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciAkb3B0aW9uID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRpb24nKS5maWx0ZXIoZnVuY3Rpb24gKGksIGVsbSkge1xuICAgICAgcmV0dXJuIGVsbS52YWx1ZSA9PSBkYXRhLmlkLnRvU3RyaW5nKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoJG9wdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICRvcHRpb24gPSB0aGlzLm9wdGlvbihkYXRhKTtcblxuICAgICAgdGhpcy5hZGRPcHRpb25zKCRvcHRpb24pO1xuICAgIH1cblxuICAgIEFycmF5QWRhcHRlci5fX3N1cGVyX18uc2VsZWN0LmNhbGwodGhpcywgZGF0YSk7XG4gIH07XG5cbiAgQXJyYXlBZGFwdGVyLnByb3RvdHlwZS5jb252ZXJ0VG9PcHRpb25zID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJGV4aXN0aW5nID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRpb24nKTtcbiAgICB2YXIgZXhpc3RpbmdJZHMgPSAkZXhpc3RpbmcubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzZWxmLml0ZW0oJCh0aGlzKSkuaWQ7XG4gICAgfSkuZ2V0KCk7XG5cbiAgICB2YXIgJG9wdGlvbnMgPSBbXTtcblxuICAgIC8vIEZpbHRlciBvdXQgYWxsIGl0ZW1zIGV4Y2VwdCBmb3IgdGhlIG9uZSBwYXNzZWQgaW4gdGhlIGFyZ3VtZW50XG4gICAgZnVuY3Rpb24gb25seUl0ZW0gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09IGl0ZW0uaWQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9ub3JtYWxpemVJdGVtKGRhdGFbZF0pO1xuXG4gICAgICAvLyBTa2lwIGl0ZW1zIHdoaWNoIHdlcmUgcHJlLWxvYWRlZCwgb25seSBtZXJnZSB0aGUgZGF0YVxuICAgICAgaWYgKCQuaW5BcnJheShpdGVtLmlkLCBleGlzdGluZ0lkcykgPj0gMCkge1xuICAgICAgICB2YXIgJGV4aXN0aW5nT3B0aW9uID0gJGV4aXN0aW5nLmZpbHRlcihvbmx5SXRlbShpdGVtKSk7XG5cbiAgICAgICAgdmFyIGV4aXN0aW5nRGF0YSA9IHRoaXMuaXRlbSgkZXhpc3RpbmdPcHRpb24pO1xuICAgICAgICB2YXIgbmV3RGF0YSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBpdGVtLCBleGlzdGluZ0RhdGEpO1xuXG4gICAgICAgIHZhciAkbmV3T3B0aW9uID0gdGhpcy5vcHRpb24obmV3RGF0YSk7XG5cbiAgICAgICAgJGV4aXN0aW5nT3B0aW9uLnJlcGxhY2VXaXRoKCRuZXdPcHRpb24pO1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgJG9wdGlvbiA9IHRoaXMub3B0aW9uKGl0ZW0pO1xuXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICB2YXIgJGNoaWxkcmVuID0gdGhpcy5jb252ZXJ0VG9PcHRpb25zKGl0ZW0uY2hpbGRyZW4pO1xuXG4gICAgICAgIFV0aWxzLmFwcGVuZE1hbnkoJG9wdGlvbiwgJGNoaWxkcmVuKTtcbiAgICAgIH1cblxuICAgICAgJG9wdGlvbnMucHVzaCgkb3B0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJG9wdGlvbnM7XG4gIH07XG5cbiAgcmV0dXJuIEFycmF5QWRhcHRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9hamF4JyxbXG4gICcuL2FycmF5JyxcbiAgJy4uL3V0aWxzJyxcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uIChBcnJheUFkYXB0ZXIsIFV0aWxzLCAkKSB7XG4gIGZ1bmN0aW9uIEFqYXhBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuYWpheE9wdGlvbnMgPSB0aGlzLl9hcHBseURlZmF1bHRzKG9wdGlvbnMuZ2V0KCdhamF4JykpO1xuXG4gICAgaWYgKHRoaXMuYWpheE9wdGlvbnMucHJvY2Vzc1Jlc3VsdHMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5wcm9jZXNzUmVzdWx0cyA9IHRoaXMuYWpheE9wdGlvbnMucHJvY2Vzc1Jlc3VsdHM7XG4gICAgfVxuXG4gICAgQWpheEFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKEFqYXhBZGFwdGVyLCBBcnJheUFkYXB0ZXIpO1xuXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5fYXBwbHlEZWZhdWx0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZGF0YTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIHBhcmFtcywge1xuICAgICAgICAgIHE6IHBhcmFtcy50ZXJtXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHRyYW5zcG9ydDogZnVuY3Rpb24gKHBhcmFtcywgc3VjY2VzcywgZmFpbHVyZSkge1xuICAgICAgICB2YXIgJHJlcXVlc3QgPSAkLmFqYXgocGFyYW1zKTtcblxuICAgICAgICAkcmVxdWVzdC50aGVuKHN1Y2Nlc3MpO1xuICAgICAgICAkcmVxdWVzdC5mYWlsKGZhaWx1cmUpO1xuXG4gICAgICAgIHJldHVybiAkcmVxdWVzdDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIH07XG5cbiAgQWpheEFkYXB0ZXIucHJvdG90eXBlLnByb2Nlc3NSZXN1bHRzID0gZnVuY3Rpb24gKHJlc3VsdHMpIHtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBBamF4QWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX3JlcXVlc3QgIT0gbnVsbCkge1xuICAgICAgLy8gSlNPTlAgcmVxdWVzdHMgY2Fubm90IGFsd2F5cyBiZSBhYm9ydGVkXG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKHRoaXMuX3JlcXVlc3QuYWJvcnQpKSB7XG4gICAgICAgIHRoaXMuX3JlcXVlc3QuYWJvcnQoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7XG4gICAgICB0eXBlOiAnR0VUJ1xuICAgIH0sIHRoaXMuYWpheE9wdGlvbnMpO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnVybCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybC5jYWxsKHRoaXMuJGVsZW1lbnQsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdGlvbnMuZGF0YSA9IG9wdGlvbnMuZGF0YS5jYWxsKHRoaXMuJGVsZW1lbnQsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVxdWVzdCAoKSB7XG4gICAgICB2YXIgJHJlcXVlc3QgPSBvcHRpb25zLnRyYW5zcG9ydChvcHRpb25zLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IHNlbGYucHJvY2Vzc1Jlc3VsdHMoZGF0YSwgcGFyYW1zKTtcblxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHJlc3BvbnNlIGluY2x1ZGVkIGEgYHJlc3VsdHNgIGtleS5cbiAgICAgICAgICBpZiAoIXJlc3VsdHMgfHwgIXJlc3VsdHMucmVzdWx0cyB8fCAhJC5pc0FycmF5KHJlc3VsdHMucmVzdWx0cykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICdTZWxlY3QyOiBUaGUgQUpBWCByZXN1bHRzIGRpZCBub3QgcmV0dXJuIGFuIGFycmF5IGluIHRoZSAnICtcbiAgICAgICAgICAgICAgJ2ByZXN1bHRzYCBrZXkgb2YgdGhlIHJlc3BvbnNlLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2socmVzdWx0cyk7XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEF0dGVtcHQgdG8gZGV0ZWN0IGlmIGEgcmVxdWVzdCB3YXMgYWJvcnRlZFxuICAgICAgICAvLyBPbmx5IHdvcmtzIGlmIHRoZSB0cmFuc3BvcnQgZXhwb3NlcyBhIHN0YXR1cyBwcm9wZXJ0eVxuICAgICAgICBpZiAoJ3N0YXR1cycgaW4gJHJlcXVlc3QgJiZcbiAgICAgICAgICAgICgkcmVxdWVzdC5zdGF0dXMgPT09IDAgfHwgJHJlcXVlc3Quc3RhdHVzID09PSAnMCcpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgICAgbWVzc2FnZTogJ2Vycm9yTG9hZGluZydcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5fcmVxdWVzdCA9ICRyZXF1ZXN0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFqYXhPcHRpb25zLmRlbGF5ICYmIHBhcmFtcy50ZXJtICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLl9xdWVyeVRpbWVvdXQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLl9xdWVyeVRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9xdWVyeVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChyZXF1ZXN0LCB0aGlzLmFqYXhPcHRpb25zLmRlbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVxdWVzdCgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gQWpheEFkYXB0ZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvdGFncycsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gVGFncyAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciB0YWdzID0gb3B0aW9ucy5nZXQoJ3RhZ3MnKTtcblxuICAgIHZhciBjcmVhdGVUYWcgPSBvcHRpb25zLmdldCgnY3JlYXRlVGFnJyk7XG5cbiAgICBpZiAoY3JlYXRlVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY3JlYXRlVGFnID0gY3JlYXRlVGFnO1xuICAgIH1cblxuICAgIHZhciBpbnNlcnRUYWcgPSBvcHRpb25zLmdldCgnaW5zZXJ0VGFnJyk7XG5cbiAgICBpZiAoaW5zZXJ0VGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5pbnNlcnRUYWcgPSBpbnNlcnRUYWc7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuXG4gICAgaWYgKCQuaXNBcnJheSh0YWdzKSkge1xuICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0YWdzLmxlbmd0aDsgdCsrKSB7XG4gICAgICAgIHZhciB0YWcgPSB0YWdzW3RdO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0odGFnKTtcblxuICAgICAgICB2YXIgJG9wdGlvbiA9IHRoaXMub3B0aW9uKGl0ZW0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKCRvcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIFRhZ3MucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuX3JlbW92ZU9sZFRhZ3MoKTtcblxuICAgIGlmIChwYXJhbXMudGVybSA9PSBudWxsIHx8IHBhcmFtcy5wYWdlICE9IG51bGwpIHtcbiAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyYXBwZXIgKG9iaiwgY2hpbGQpIHtcbiAgICAgIHZhciBkYXRhID0gb2JqLnJlc3VsdHM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgb3B0aW9uID0gZGF0YVtpXTtcblxuICAgICAgICB2YXIgY2hlY2tDaGlsZHJlbiA9IChcbiAgICAgICAgICBvcHRpb24uY2hpbGRyZW4gIT0gbnVsbCAmJlxuICAgICAgICAgICF3cmFwcGVyKHtcbiAgICAgICAgICAgIHJlc3VsdHM6IG9wdGlvbi5jaGlsZHJlblxuICAgICAgICAgIH0sIHRydWUpXG4gICAgICAgICk7XG5cbiAgICAgICAgdmFyIG9wdGlvblRleHQgPSAob3B0aW9uLnRleHQgfHwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHZhciBwYXJhbXNUZXJtID0gKHBhcmFtcy50ZXJtIHx8ICcnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIHZhciBjaGVja1RleHQgPSBvcHRpb25UZXh0ID09PSBwYXJhbXNUZXJtO1xuXG4gICAgICAgIGlmIChjaGVja1RleHQgfHwgY2hlY2tDaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9iai5kYXRhID0gZGF0YTtcbiAgICAgICAgICBjYWxsYmFjayhvYmopO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhZyA9IHNlbGYuY3JlYXRlVGFnKHBhcmFtcyk7XG5cbiAgICAgIGlmICh0YWcgIT0gbnVsbCkge1xuICAgICAgICB2YXIgJG9wdGlvbiA9IHNlbGYub3B0aW9uKHRhZyk7XG4gICAgICAgICRvcHRpb24uYXR0cignZGF0YS1zZWxlY3QyLXRhZycsIHRydWUpO1xuXG4gICAgICAgIHNlbGYuYWRkT3B0aW9ucyhbJG9wdGlvbl0pO1xuXG4gICAgICAgIHNlbGYuaW5zZXJ0VGFnKGRhdGEsIHRhZyk7XG4gICAgICB9XG5cbiAgICAgIG9iai5yZXN1bHRzID0gZGF0YTtcblxuICAgICAgY2FsbGJhY2sob2JqKTtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIHdyYXBwZXIpO1xuICB9O1xuXG4gIFRhZ3MucHJvdG90eXBlLmNyZWF0ZVRhZyA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcykge1xuICAgIHZhciB0ZXJtID0gJC50cmltKHBhcmFtcy50ZXJtKTtcblxuICAgIGlmICh0ZXJtID09PSAnJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0ZXJtLFxuICAgICAgdGV4dDogdGVybVxuICAgIH07XG4gIH07XG5cbiAgVGFncy5wcm90b3R5cGUuaW5zZXJ0VGFnID0gZnVuY3Rpb24gKF8sIGRhdGEsIHRhZykge1xuICAgIGRhdGEudW5zaGlmdCh0YWcpO1xuICB9O1xuXG4gIFRhZ3MucHJvdG90eXBlLl9yZW1vdmVPbGRUYWdzID0gZnVuY3Rpb24gKF8pIHtcbiAgICB2YXIgdGFnID0gdGhpcy5fbGFzdFRhZztcblxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uW2RhdGEtc2VsZWN0Mi10YWddJyk7XG5cbiAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVGFncztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS90b2tlbml6ZXInLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIGZ1bmN0aW9uIFRva2VuaXplciAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciB0b2tlbml6ZXIgPSBvcHRpb25zLmdldCgndG9rZW5pemVyJyk7XG5cbiAgICBpZiAodG9rZW5pemVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudG9rZW5pemVyID0gdG9rZW5pemVyO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIFRva2VuaXplci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLiRzZWFyY2ggPSAgY29udGFpbmVyLmRyb3Bkb3duLiRzZWFyY2ggfHwgY29udGFpbmVyLnNlbGVjdGlvbi4kc2VhcmNoIHx8XG4gICAgICAkY29udGFpbmVyLmZpbmQoJy5zZWxlY3QyLXNlYXJjaF9fZmllbGQnKTtcbiAgfTtcblxuICBUb2tlbml6ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFuZFNlbGVjdCAoZGF0YSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRoZSBkYXRhIG9iamVjdCBzbyB3ZSBjYW4gdXNlIGl0IGZvciBjaGVja3NcbiAgICAgIHZhciBpdGVtID0gc2VsZi5fbm9ybWFsaXplSXRlbShkYXRhKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGRhdGEgb2JqZWN0IGFscmVhZHkgZXhpc3RzIGFzIGEgdGFnXG4gICAgICAvLyBTZWxlY3QgaXQgaWYgaXQgZG9lc24ndFxuICAgICAgdmFyICRleGlzdGluZ09wdGlvbnMgPSBzZWxmLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09PSBpdGVtLmlkO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIElmIGFuIGV4aXN0aW5nIG9wdGlvbiB3YXNuJ3QgZm91bmQgZm9yIGl0LCBjcmVhdGUgdGhlIG9wdGlvblxuICAgICAgaWYgKCEkZXhpc3RpbmdPcHRpb25zLmxlbmd0aCkge1xuICAgICAgICB2YXIgJG9wdGlvbiA9IHNlbGYub3B0aW9uKGl0ZW0pO1xuICAgICAgICAkb3B0aW9uLmF0dHIoJ2RhdGEtc2VsZWN0Mi10YWcnLCB0cnVlKTtcblxuICAgICAgICBzZWxmLl9yZW1vdmVPbGRUYWdzKCk7XG4gICAgICAgIHNlbGYuYWRkT3B0aW9ucyhbJG9wdGlvbl0pO1xuICAgICAgfVxuXG4gICAgICAvLyBTZWxlY3QgdGhlIGl0ZW0sIG5vdyB0aGF0IHdlIGtub3cgdGhlcmUgaXMgYW4gb3B0aW9uIGZvciBpdFxuICAgICAgc2VsZWN0KGl0ZW0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlbGVjdCAoZGF0YSkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcmFtcy50ZXJtID0gcGFyYW1zLnRlcm0gfHwgJyc7XG5cbiAgICB2YXIgdG9rZW5EYXRhID0gdGhpcy50b2tlbml6ZXIocGFyYW1zLCB0aGlzLm9wdGlvbnMsIGNyZWF0ZUFuZFNlbGVjdCk7XG5cbiAgICBpZiAodG9rZW5EYXRhLnRlcm0gIT09IHBhcmFtcy50ZXJtKSB7XG4gICAgICAvLyBSZXBsYWNlIHRoZSBzZWFyY2ggdGVybSBpZiB3ZSBoYXZlIHRoZSBzZWFyY2ggYm94XG4gICAgICBpZiAodGhpcy4kc2VhcmNoLmxlbmd0aCkge1xuICAgICAgICB0aGlzLiRzZWFyY2gudmFsKHRva2VuRGF0YS50ZXJtKTtcbiAgICAgICAgdGhpcy4kc2VhcmNoLmZvY3VzKCk7XG4gICAgICB9XG5cbiAgICAgIHBhcmFtcy50ZXJtID0gdG9rZW5EYXRhLnRlcm07XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgVG9rZW5pemVyLnByb3RvdHlwZS50b2tlbml6ZXIgPSBmdW5jdGlvbiAoXywgcGFyYW1zLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBzZXBhcmF0b3JzID0gb3B0aW9ucy5nZXQoJ3Rva2VuU2VwYXJhdG9ycycpIHx8IFtdO1xuICAgIHZhciB0ZXJtID0gcGFyYW1zLnRlcm07XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgdmFyIGNyZWF0ZVRhZyA9IHRoaXMuY3JlYXRlVGFnIHx8IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBwYXJhbXMudGVybSxcbiAgICAgICAgdGV4dDogcGFyYW1zLnRlcm1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIHdoaWxlIChpIDwgdGVybS5sZW5ndGgpIHtcbiAgICAgIHZhciB0ZXJtQ2hhciA9IHRlcm1baV07XG5cbiAgICAgIGlmICgkLmluQXJyYXkodGVybUNoYXIsIHNlcGFyYXRvcnMpID09PSAtMSkge1xuICAgICAgICBpKys7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJ0ID0gdGVybS5zdWJzdHIoMCwgaSk7XG4gICAgICB2YXIgcGFydFBhcmFtcyA9ICQuZXh0ZW5kKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgdGVybTogcGFydFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBkYXRhID0gY3JlYXRlVGFnKHBhcnRQYXJhbXMpO1xuXG4gICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgIGkrKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKGRhdGEpO1xuXG4gICAgICAvLyBSZXNldCB0aGUgdGVybSB0byBub3QgaW5jbHVkZSB0aGUgdG9rZW5pemVkIHBvcnRpb25cbiAgICAgIHRlcm0gPSB0ZXJtLnN1YnN0cihpICsgMSkgfHwgJyc7XG4gICAgICBpID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGVybTogdGVybVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIFRva2VuaXplcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9taW5pbXVtSW5wdXRMZW5ndGgnLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNaW5pbXVtSW5wdXRMZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtaW5pbXVtSW5wdXRMZW5ndGgnKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIE1pbmltdW1JbnB1dExlbmd0aC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcblxuICAgIGlmIChwYXJhbXMudGVybS5sZW5ndGggPCB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdpbnB1dFRvb1Nob3J0JyxcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgIG1pbmltdW06IHRoaXMubWluaW11bUlucHV0TGVuZ3RoLFxuICAgICAgICAgIGlucHV0OiBwYXJhbXMudGVybSxcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJldHVybiBNaW5pbXVtSW5wdXRMZW5ndGg7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvbWF4aW11bUlucHV0TGVuZ3RoJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWF4aW11bUlucHV0TGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5tYXhpbXVtSW5wdXRMZW5ndGggPSBvcHRpb25zLmdldCgnbWF4aW11bUlucHV0TGVuZ3RoJyk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZSwgb3B0aW9ucyk7XG4gIH1cblxuICBNYXhpbXVtSW5wdXRMZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHBhcmFtcy50ZXJtID0gcGFyYW1zLnRlcm0gfHwgJyc7XG5cbiAgICBpZiAodGhpcy5tYXhpbXVtSW5wdXRMZW5ndGggPiAwICYmXG4gICAgICAgIHBhcmFtcy50ZXJtLmxlbmd0aCA+IHRoaXMubWF4aW11bUlucHV0TGVuZ3RoKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgbWVzc2FnZTogJ2lucHV0VG9vTG9uZycsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICBtYXhpbXVtOiB0aGlzLm1heGltdW1JbnB1dExlbmd0aCxcbiAgICAgICAgICBpbnB1dDogcGFyYW1zLnRlcm0sXG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgfTtcblxuICByZXR1cm4gTWF4aW11bUlucHV0TGVuZ3RoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL21heGltdW1TZWxlY3Rpb25MZW5ndGgnLFtcblxuXSwgZnVuY3Rpb24gKCl7XG4gIGZ1bmN0aW9uIE1heGltdW1TZWxlY3Rpb25MZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPSBvcHRpb25zLmdldCgnbWF4aW11bVNlbGVjdGlvbkxlbmd0aCcpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgTWF4aW11bVNlbGVjdGlvbkxlbmd0aC5wcm90b3R5cGUucXVlcnkgPVxuICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICB2YXIgY291bnQgPSBjdXJyZW50RGF0YSAhPSBudWxsID8gY3VycmVudERhdGEubGVuZ3RoIDogMDtcbiAgICAgICAgaWYgKHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBjb3VudCA+PSBzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdtYXhpbXVtU2VsZWN0ZWQnLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICBtYXhpbXVtOiBzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVjb3JhdGVkLmNhbGwoc2VsZiwgcGFyYW1zLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gTWF4aW11bVNlbGVjdGlvbkxlbmd0aDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24nLFtcbiAgJ2pxdWVyeScsXG4gICcuL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIERyb3Bkb3duICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgRHJvcGRvd24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoRHJvcGRvd24sIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRkcm9wZG93biA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLWRyb3Bkb3duXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItcmVzdWx0c1wiPjwvc3Bhbj4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICAkZHJvcGRvd24uYXR0cignZGlyJywgdGhpcy5vcHRpb25zLmdldCgnZGlyJykpO1xuXG4gICAgdGhpcy4kZHJvcGRvd24gPSAkZHJvcGRvd247XG5cbiAgICByZXR1cm4gJGRyb3Bkb3duO1xuICB9O1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXG4gIH07XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRkcm9wZG93biwgJGNvbnRhaW5lcikge1xuICAgIC8vIFNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXG4gIH07XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBkcm9wZG93biBmcm9tIHRoZSBET01cbiAgICB0aGlzLiRkcm9wZG93bi5yZW1vdmUoKTtcbiAgfTtcblxuICByZXR1cm4gRHJvcGRvd247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL3NlYXJjaCcsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIFNlYXJjaCAoKSB7IH1cblxuICBTZWFyY2gucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB2YXIgJHJlbmRlcmVkID0gZGVjb3JhdGVkLmNhbGwodGhpcyk7XG5cbiAgICB2YXIgJHNlYXJjaCA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlYXJjaCBzZWxlY3QyLXNlYXJjaC0tZHJvcGRvd25cIj4nICtcbiAgICAgICAgJzxpbnB1dCBjbGFzcz1cInNlbGVjdDItc2VhcmNoX19maWVsZFwiIHR5cGU9XCJzZWFyY2hcIiB0YWJpbmRleD1cIi0xXCInICtcbiAgICAgICAgJyBhdXRvY29tcGxldGU9XCJvZmZcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwibm9uZVwiJyArXG4gICAgICAgICcgc3BlbGxjaGVjaz1cImZhbHNlXCIgcm9sZT1cInRleHRib3hcIiAvPicgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcblxuICAgIHRoaXMuJHNlYXJjaENvbnRhaW5lciA9ICRzZWFyY2g7XG4gICAgdGhpcy4kc2VhcmNoID0gJHNlYXJjaC5maW5kKCdpbnB1dCcpO1xuXG4gICAgJHJlbmRlcmVkLnByZXBlbmQoJHNlYXJjaCk7XG5cbiAgICByZXR1cm4gJHJlbmRlcmVkO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLiRzZWFyY2gub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2tleXByZXNzJywgZXZ0KTtcblxuICAgICAgc2VsZi5fa2V5VXBQcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XG4gICAgfSk7XG5cbiAgICAvLyBXb3JrYXJvdW5kIGZvciBicm93c2VycyB3aGljaCBkbyBub3Qgc3VwcG9ydCB0aGUgYGlucHV0YCBldmVudFxuICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IGRvdWJsZS10cmlnZ2VyaW5nIG9mIGV2ZW50cyBmb3IgYnJvd3NlcnMgd2hpY2ggc3VwcG9ydFxuICAgIC8vIGJvdGggdGhlIGBrZXl1cGAgYW5kIGBpbnB1dGAgZXZlbnRzLlxuICAgIHRoaXMuJHNlYXJjaC5vbignaW5wdXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAvLyBVbmJpbmQgdGhlIGR1cGxpY2F0ZWQgYGtleXVwYCBldmVudFxuICAgICAgJCh0aGlzKS5vZmYoJ2tleXVwJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWFyY2gub24oJ2tleXVwIGlucHV0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5oYW5kbGVTZWFyY2goZXZ0KTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIDApO1xuXG4gICAgICBzZWxmLiRzZWFyY2guZm9jdXMoKTtcblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLiRzZWFyY2guZm9jdXMoKTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIC0xKTtcblxuICAgICAgc2VsZi4kc2VhcmNoLnZhbCgnJyk7XG4gICAgICBzZWxmLiRzZWFyY2guYmx1cigpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYuJHNlYXJjaC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFsbCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIGlmIChwYXJhbXMucXVlcnkudGVybSA9PSBudWxsIHx8IHBhcmFtcy5xdWVyeS50ZXJtID09PSAnJykge1xuICAgICAgICB2YXIgc2hvd1NlYXJjaCA9IHNlbGYuc2hvd1NlYXJjaChwYXJhbXMpO1xuXG4gICAgICAgIGlmIChzaG93U2VhcmNoKSB7XG4gICAgICAgICAgc2VsZi4kc2VhcmNoQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXNlYXJjaC0taGlkZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuJHNlYXJjaENvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1zZWFyY2gtLWhpZGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuaGFuZGxlU2VhcmNoID0gZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICghdGhpcy5fa2V5VXBQcmV2ZW50ZWQpIHtcbiAgICAgIHZhciBpbnB1dCA9IHRoaXMuJHNlYXJjaC52YWwoKTtcblxuICAgICAgdGhpcy50cmlnZ2VyKCdxdWVyeScsIHtcbiAgICAgICAgdGVybTogaW5wdXRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2tleVVwUHJldmVudGVkID0gZmFsc2U7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5zaG93U2VhcmNoID0gZnVuY3Rpb24gKF8sIHBhcmFtcykge1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIHJldHVybiBTZWFyY2g7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2hpZGVQbGFjZWhvbGRlcicsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEhpZGVQbGFjZWhvbGRlciAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcbiAgICB0aGlzLnBsYWNlaG9sZGVyID0gdGhpcy5ub3JtYWxpemVQbGFjZWhvbGRlcihvcHRpb25zLmdldCgncGxhY2Vob2xkZXInKSk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xuICB9XG5cbiAgSGlkZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgZGF0YS5yZXN1bHRzID0gdGhpcy5yZW1vdmVQbGFjZWhvbGRlcihkYXRhLnJlc3VsdHMpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG4gIH07XG5cbiAgSGlkZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5ub3JtYWxpemVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChfLCBwbGFjZWhvbGRlcikge1xuICAgIGlmICh0eXBlb2YgcGxhY2Vob2xkZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICB0ZXh0OiBwbGFjZWhvbGRlclxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGxhY2Vob2xkZXI7XG4gIH07XG5cbiAgSGlkZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5yZW1vdmVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChfLCBkYXRhKSB7XG4gICAgdmFyIG1vZGlmaWVkRGF0YSA9IGRhdGEuc2xpY2UoMCk7XG5cbiAgICBmb3IgKHZhciBkID0gZGF0YS5sZW5ndGggLSAxOyBkID49IDA7IGQtLSkge1xuICAgICAgdmFyIGl0ZW0gPSBkYXRhW2RdO1xuXG4gICAgICBpZiAodGhpcy5wbGFjZWhvbGRlci5pZCA9PT0gaXRlbS5pZCkge1xuICAgICAgICBtb2RpZmllZERhdGEuc3BsaWNlKGQsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RpZmllZERhdGE7XG4gIH07XG5cbiAgcmV0dXJuIEhpZGVQbGFjZWhvbGRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vaW5maW5pdGVTY3JvbGwnLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIGZ1bmN0aW9uIEluZmluaXRlU2Nyb2xsIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xuICAgIHRoaXMubGFzdFBhcmFtcyA9IHt9O1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKTtcblxuICAgIHRoaXMuJGxvYWRpbmdNb3JlID0gdGhpcy5jcmVhdGVMb2FkaW5nTW9yZSgpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICB0aGlzLiRsb2FkaW5nTW9yZS5yZW1vdmUoKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgaWYgKHRoaXMuc2hvd0xvYWRpbmdNb3JlKGRhdGEpKSB7XG4gICAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCh0aGlzLiRsb2FkaW5nTW9yZSk7XG4gICAgfVxuICB9O1xuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbigncXVlcnknLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmxhc3RQYXJhbXMgPSBwYXJhbXM7XG4gICAgICBzZWxmLmxvYWRpbmcgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdxdWVyeTphcHBlbmQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmxhc3RQYXJhbXMgPSBwYXJhbXM7XG4gICAgICBzZWxmLmxvYWRpbmcgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGlzTG9hZE1vcmVWaXNpYmxlID0gJC5jb250YWlucyhcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBzZWxmLiRsb2FkaW5nTW9yZVswXVxuICAgICAgKTtcblxuICAgICAgaWYgKHNlbGYubG9hZGluZyB8fCAhaXNMb2FkTW9yZVZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHNlbGYuJHJlc3VsdHMub2Zmc2V0KCkudG9wICtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICB2YXIgbG9hZGluZ01vcmVPZmZzZXQgPSBzZWxmLiRsb2FkaW5nTW9yZS5vZmZzZXQoKS50b3AgK1xuICAgICAgICBzZWxmLiRsb2FkaW5nTW9yZS5vdXRlckhlaWdodChmYWxzZSk7XG5cbiAgICAgIGlmIChjdXJyZW50T2Zmc2V0ICsgNTAgPj0gbG9hZGluZ01vcmVPZmZzZXQpIHtcbiAgICAgICAgc2VsZi5sb2FkTW9yZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5sb2FkTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgdmFyIHBhcmFtcyA9ICQuZXh0ZW5kKHt9LCB7cGFnZTogMX0sIHRoaXMubGFzdFBhcmFtcyk7XG5cbiAgICBwYXJhbXMucGFnZSsrO1xuXG4gICAgdGhpcy50cmlnZ2VyKCdxdWVyeTphcHBlbmQnLCBwYXJhbXMpO1xuICB9O1xuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5zaG93TG9hZGluZ01vcmUgPSBmdW5jdGlvbiAoXywgZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnBhZ2luYXRpb24gJiYgZGF0YS5wYWdpbmF0aW9uLm1vcmU7XG4gIH07XG5cbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmNyZWF0ZUxvYWRpbmdNb3JlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkb3B0aW9uID0gJChcbiAgICAgICc8bGkgJyArXG4gICAgICAnY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNfX29wdGlvbiBzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0tbG9hZC1tb3JlXCInICtcbiAgICAgICdyb2xlPVwidHJlZWl0ZW1cIiBhcmlhLWRpc2FibGVkPVwidHJ1ZVwiPjwvbGk+J1xuICAgICk7XG5cbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldCgnbG9hZGluZ01vcmUnKTtcblxuICAgICRvcHRpb24uaHRtbChtZXNzYWdlKHRoaXMubGFzdFBhcmFtcykpO1xuXG4gICAgcmV0dXJuICRvcHRpb247XG4gIH07XG5cbiAgcmV0dXJuIEluZmluaXRlU2Nyb2xsO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9hdHRhY2hCb2R5JyxbXG4gICdqcXVlcnknLFxuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcbiAgZnVuY3Rpb24gQXR0YWNoQm9keSAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGRyb3Bkb3duUGFyZW50ID0gb3B0aW9ucy5nZXQoJ2Ryb3Bkb3duUGFyZW50JykgfHwgJChkb2N1bWVudC5ib2R5KTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgc2V0dXBSZXN1bHRzRXZlbnRzID0gZmFsc2U7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fc2hvd0Ryb3Bkb3duKCk7XG4gICAgICBzZWxmLl9hdHRhY2hQb3NpdGlvbmluZ0hhbmRsZXIoY29udGFpbmVyKTtcblxuICAgICAgaWYgKCFzZXR1cFJlc3VsdHNFdmVudHMpIHtcbiAgICAgICAgc2V0dXBSZXN1bHRzRXZlbnRzID0gdHJ1ZTtcblxuICAgICAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YWxsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX3Bvc2l0aW9uRHJvcGRvd24oKTtcbiAgICAgICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YXBwZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuX3Bvc2l0aW9uRHJvcGRvd24oKTtcbiAgICAgICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9oaWRlRHJvcGRvd24oKTtcbiAgICAgIHNlbGYuX2RldGFjaFBvc2l0aW9uaW5nSGFuZGxlcihjb250YWluZXIpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIucmVtb3ZlKCk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCAkZHJvcGRvd24sICRjb250YWluZXIpIHtcbiAgICAvLyBDbG9uZSBhbGwgb2YgdGhlIGNvbnRhaW5lciBjbGFzc2VzXG4gICAgJGRyb3Bkb3duLmF0dHIoJ2NsYXNzJywgJGNvbnRhaW5lci5hdHRyKCdjbGFzcycpKTtcblxuICAgICRkcm9wZG93bi5yZW1vdmVDbGFzcygnc2VsZWN0MicpO1xuICAgICRkcm9wZG93bi5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcblxuICAgICRkcm9wZG93bi5jc3Moe1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6IC05OTk5OTlcbiAgICB9KTtcblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHZhciAkY29udGFpbmVyID0gJCgnPHNwYW4+PC9zcGFuPicpO1xuXG4gICAgdmFyICRkcm9wZG93biA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xuICAgICRjb250YWluZXIuYXBwZW5kKCRkcm9wZG93bik7XG5cbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lciA9ICRjb250YWluZXI7XG5cbiAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5faGlkZURyb3Bkb3duID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLmRldGFjaCgpO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9hdHRhY2hQb3NpdGlvbmluZ0hhbmRsZXIgPVxuICAgICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHNjcm9sbEV2ZW50ID0gJ3Njcm9sbC5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG4gICAgdmFyIHJlc2l6ZUV2ZW50ID0gJ3Jlc2l6ZS5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG4gICAgdmFyIG9yaWVudGF0aW9uRXZlbnQgPSAnb3JpZW50YXRpb25jaGFuZ2Uuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuXG4gICAgdmFyICR3YXRjaGVycyA9IHRoaXMuJGNvbnRhaW5lci5wYXJlbnRzKCkuZmlsdGVyKFV0aWxzLmhhc1Njcm9sbCk7XG4gICAgJHdhdGNoZXJzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgVXRpbHMuU3RvcmVEYXRhKHRoaXMsICdzZWxlY3QyLXNjcm9sbC1wb3NpdGlvbicsIHtcbiAgICAgICAgeDogJCh0aGlzKS5zY3JvbGxMZWZ0KCksXG4gICAgICAgIHk6ICQodGhpcykuc2Nyb2xsVG9wKClcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHdhdGNoZXJzLm9uKHNjcm9sbEV2ZW50LCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IFV0aWxzLkdldERhdGEodGhpcywgJ3NlbGVjdDItc2Nyb2xsLXBvc2l0aW9uJyk7XG4gICAgICAkKHRoaXMpLnNjcm9sbFRvcChwb3NpdGlvbi55KTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbihzY3JvbGxFdmVudCArICcgJyArIHJlc2l6ZUV2ZW50ICsgJyAnICsgb3JpZW50YXRpb25FdmVudCxcbiAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XG4gICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xuICAgIH0pO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9kZXRhY2hQb3NpdGlvbmluZ0hhbmRsZXIgPVxuICAgICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyKSB7XG4gICAgdmFyIHNjcm9sbEV2ZW50ID0gJ3Njcm9sbC5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG4gICAgdmFyIHJlc2l6ZUV2ZW50ID0gJ3Jlc2l6ZS5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG4gICAgdmFyIG9yaWVudGF0aW9uRXZlbnQgPSAnb3JpZW50YXRpb25jaGFuZ2Uuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuXG4gICAgdmFyICR3YXRjaGVycyA9IHRoaXMuJGNvbnRhaW5lci5wYXJlbnRzKCkuZmlsdGVyKFV0aWxzLmhhc1Njcm9sbCk7XG4gICAgJHdhdGNoZXJzLm9mZihzY3JvbGxFdmVudCk7XG5cbiAgICAkKHdpbmRvdykub2ZmKHNjcm9sbEV2ZW50ICsgJyAnICsgcmVzaXplRXZlbnQgKyAnICcgKyBvcmllbnRhdGlvbkV2ZW50KTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fcG9zaXRpb25Ecm9wZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIHZhciBpc0N1cnJlbnRseUFib3ZlID0gdGhpcy4kZHJvcGRvd24uaGFzQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWFib3ZlJyk7XG4gICAgdmFyIGlzQ3VycmVudGx5QmVsb3cgPSB0aGlzLiRkcm9wZG93bi5oYXNDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tYmVsb3cnKTtcblxuICAgIHZhciBuZXdEaXJlY3Rpb24gPSBudWxsO1xuXG4gICAgdmFyIG9mZnNldCA9IHRoaXMuJGNvbnRhaW5lci5vZmZzZXQoKTtcblxuICAgIG9mZnNldC5ib3R0b20gPSBvZmZzZXQudG9wICsgdGhpcy4kY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKTtcblxuICAgIHZhciBjb250YWluZXIgPSB7XG4gICAgICBoZWlnaHQ6IHRoaXMuJGNvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSlcbiAgICB9O1xuXG4gICAgY29udGFpbmVyLnRvcCA9IG9mZnNldC50b3A7XG4gICAgY29udGFpbmVyLmJvdHRvbSA9IG9mZnNldC50b3AgKyBjb250YWluZXIuaGVpZ2h0O1xuXG4gICAgdmFyIGRyb3Bkb3duID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLiRkcm9wZG93bi5vdXRlckhlaWdodChmYWxzZSlcbiAgICB9O1xuXG4gICAgdmFyIHZpZXdwb3J0ID0ge1xuICAgICAgdG9wOiAkd2luZG93LnNjcm9sbFRvcCgpLFxuICAgICAgYm90dG9tOiAkd2luZG93LnNjcm9sbFRvcCgpICsgJHdpbmRvdy5oZWlnaHQoKVxuICAgIH07XG5cbiAgICB2YXIgZW5vdWdoUm9vbUFib3ZlID0gdmlld3BvcnQudG9wIDwgKG9mZnNldC50b3AgLSBkcm9wZG93bi5oZWlnaHQpO1xuICAgIHZhciBlbm91Z2hSb29tQmVsb3cgPSB2aWV3cG9ydC5ib3R0b20gPiAob2Zmc2V0LmJvdHRvbSArIGRyb3Bkb3duLmhlaWdodCk7XG5cbiAgICB2YXIgY3NzID0ge1xuICAgICAgbGVmdDogb2Zmc2V0LmxlZnQsXG4gICAgICB0b3A6IGNvbnRhaW5lci5ib3R0b21cbiAgICB9O1xuXG4gICAgLy8gRGV0ZXJtaW5lIHdoYXQgdGhlIHBhcmVudCBlbGVtZW50IGlzIHRvIHVzZSBmb3IgY2FsY3VsYXRpbmcgdGhlIG9mZnNldFxuICAgIHZhciAkb2Zmc2V0UGFyZW50ID0gdGhpcy4kZHJvcGRvd25QYXJlbnQ7XG5cbiAgICAvLyBGb3Igc3RhdGljYWxseSBwb3NpdGlvbmVkIGVsZW1lbnRzLCB3ZSBuZWVkIHRvIGdldCB0aGUgZWxlbWVudFxuICAgIC8vIHRoYXQgaXMgZGV0ZXJtaW5pbmcgdGhlIG9mZnNldFxuICAgIGlmICgkb2Zmc2V0UGFyZW50LmNzcygncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICRvZmZzZXRQYXJlbnQgPSAkb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudCgpO1xuICAgIH1cblxuICAgIHZhciBwYXJlbnRPZmZzZXQgPSAkb2Zmc2V0UGFyZW50Lm9mZnNldCgpO1xuXG4gICAgY3NzLnRvcCAtPSBwYXJlbnRPZmZzZXQudG9wO1xuICAgIGNzcy5sZWZ0IC09IHBhcmVudE9mZnNldC5sZWZ0O1xuXG4gICAgaWYgKCFpc0N1cnJlbnRseUFib3ZlICYmICFpc0N1cnJlbnRseUJlbG93KSB7XG4gICAgICBuZXdEaXJlY3Rpb24gPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmICghZW5vdWdoUm9vbUJlbG93ICYmIGVub3VnaFJvb21BYm92ZSAmJiAhaXNDdXJyZW50bHlBYm92ZSkge1xuICAgICAgbmV3RGlyZWN0aW9uID0gJ2Fib3ZlJztcbiAgICB9IGVsc2UgaWYgKCFlbm91Z2hSb29tQWJvdmUgJiYgZW5vdWdoUm9vbUJlbG93ICYmIGlzQ3VycmVudGx5QWJvdmUpIHtcbiAgICAgIG5ld0RpcmVjdGlvbiA9ICdiZWxvdyc7XG4gICAgfVxuXG4gICAgaWYgKG5ld0RpcmVjdGlvbiA9PSAnYWJvdmUnIHx8XG4gICAgICAoaXNDdXJyZW50bHlBYm92ZSAmJiBuZXdEaXJlY3Rpb24gIT09ICdiZWxvdycpKSB7XG4gICAgICBjc3MudG9wID0gY29udGFpbmVyLnRvcCAtIHBhcmVudE9mZnNldC50b3AgLSBkcm9wZG93bi5oZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKG5ld0RpcmVjdGlvbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLiRkcm9wZG93blxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWJlbG93IHNlbGVjdDItZHJvcGRvd24tLWFib3ZlJylcbiAgICAgICAgLmFkZENsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS0nICsgbmV3RGlyZWN0aW9uKTtcbiAgICAgIHRoaXMuJGNvbnRhaW5lclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1iZWxvdyBzZWxlY3QyLWNvbnRhaW5lci0tYWJvdmUnKVxuICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS0nICsgbmV3RGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5jc3MoY3NzKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fcmVzaXplRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNzcyA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLiRjb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSkgKyAncHgnXG4gICAgfTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkcm9wZG93bkF1dG9XaWR0aCcpKSB7XG4gICAgICBjc3MubWluV2lkdGggPSBjc3Mud2lkdGg7XG4gICAgICBjc3MucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgY3NzLndpZHRoID0gJ2F1dG8nO1xuICAgIH1cblxuICAgIHRoaXMuJGRyb3Bkb3duLmNzcyhjc3MpO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9zaG93RHJvcGRvd24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIuYXBwZW5kVG8odGhpcy4kZHJvcGRvd25QYXJlbnQpO1xuXG4gICAgdGhpcy5fcG9zaXRpb25Ecm9wZG93bigpO1xuICAgIHRoaXMuX3Jlc2l6ZURyb3Bkb3duKCk7XG4gIH07XG5cbiAgcmV0dXJuIEF0dGFjaEJvZHk7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gY291bnRSZXN1bHRzIChkYXRhKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGl0ZW0gPSBkYXRhW2RdO1xuXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICBjb3VudCArPSBjb3VudFJlc3VsdHMoaXRlbS5jaGlsZHJlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xuICAgIHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBvcHRpb25zLmdldCgnbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnKTtcblxuICAgIGlmICh0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIDwgMCkge1xuICAgICAgdGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5O1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XG4gIH1cblxuICBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaC5wcm90b3R5cGUuc2hvd1NlYXJjaCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcykge1xuICAgIGlmIChjb3VudFJlc3VsdHMocGFyYW1zLmRhdGEucmVzdWx0cykgPCB0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcyk7XG4gIH07XG5cbiAgcmV0dXJuIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9zZWxlY3RPbkNsb3NlJyxbXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uIChVdGlscykge1xuICBmdW5jdGlvbiBTZWxlY3RPbkNsb3NlICgpIHsgfVxuXG4gIFNlbGVjdE9uQ2xvc2UucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuX2hhbmRsZVNlbGVjdE9uQ2xvc2UocGFyYW1zKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RPbkNsb3NlLnByb3RvdHlwZS5faGFuZGxlU2VsZWN0T25DbG9zZSA9IGZ1bmN0aW9uIChfLCBwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5vcmlnaW5hbFNlbGVjdDJFdmVudCAhPSBudWxsKSB7XG4gICAgICB2YXIgZXZlbnQgPSBwYXJhbXMub3JpZ2luYWxTZWxlY3QyRXZlbnQ7XG5cbiAgICAgIC8vIERvbid0IHNlbGVjdCBhbiBpdGVtIGlmIHRoZSBjbG9zZSBldmVudCB3YXMgdHJpZ2dlcmVkIGZyb20gYSBzZWxlY3Qgb3JcbiAgICAgIC8vIHVuc2VsZWN0IGV2ZW50XG4gICAgICBpZiAoZXZlbnQuX3R5cGUgPT09ICdzZWxlY3QnIHx8IGV2ZW50Ll90eXBlID09PSAndW5zZWxlY3QnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgJGhpZ2hsaWdodGVkUmVzdWx0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICAvLyBPbmx5IHNlbGVjdCBoaWdobGlnaHRlZCByZXN1bHRzXG4gICAgaWYgKCRoaWdobGlnaHRlZFJlc3VsdHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gVXRpbHMuR2V0RGF0YSgkaGlnaGxpZ2h0ZWRSZXN1bHRzWzBdLCAnZGF0YScpO1xuXG4gICAgLy8gRG9uJ3QgcmUtc2VsZWN0IGFscmVhZHkgc2VsZWN0ZWQgcmVzdWx0ZVxuICAgIGlmIChcbiAgICAgIChkYXRhLmVsZW1lbnQgIT0gbnVsbCAmJiBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQpIHx8XG4gICAgICAoZGF0YS5lbGVtZW50ID09IG51bGwgJiYgZGF0YS5zZWxlY3RlZClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdCcsIHtcbiAgICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTZWxlY3RPbkNsb3NlO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9jbG9zZU9uU2VsZWN0JyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ2xvc2VPblNlbGVjdCAoKSB7IH1cblxuICBDbG9zZU9uU2VsZWN0LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5fc2VsZWN0VHJpZ2dlcmVkKGV2dCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5fc2VsZWN0VHJpZ2dlcmVkKGV2dCk7XG4gICAgfSk7XG4gIH07XG5cbiAgQ2xvc2VPblNlbGVjdC5wcm90b3R5cGUuX3NlbGVjdFRyaWdnZXJlZCA9IGZ1bmN0aW9uIChfLCBldnQpIHtcbiAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGV2dC5vcmlnaW5hbEV2ZW50O1xuXG4gICAgLy8gRG9uJ3QgY2xvc2UgaWYgdGhlIGNvbnRyb2wga2V5IGlzIGJlaW5nIGhlbGRcbiAgICBpZiAob3JpZ2luYWxFdmVudCAmJiAob3JpZ2luYWxFdmVudC5jdHJsS2V5IHx8IG9yaWdpbmFsRXZlbnQubWV0YUtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ2Nsb3NlJywge1xuICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgIG9yaWdpbmFsU2VsZWN0MkV2ZW50OiBldnRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gQ2xvc2VPblNlbGVjdDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvaTE4bi9lbicsW10sZnVuY3Rpb24gKCkge1xuICAvLyBFbmdsaXNoXG4gIHJldHVybiB7XG4gICAgZXJyb3JMb2FkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ1RoZSByZXN1bHRzIGNvdWxkIG5vdCBiZSBsb2FkZWQuJztcbiAgICB9LFxuICAgIGlucHV0VG9vTG9uZzogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHZhciBvdmVyQ2hhcnMgPSBhcmdzLmlucHV0Lmxlbmd0aCAtIGFyZ3MubWF4aW11bTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSAnUGxlYXNlIGRlbGV0ZSAnICsgb3ZlckNoYXJzICsgJyBjaGFyYWN0ZXInO1xuXG4gICAgICBpZiAob3ZlckNoYXJzICE9IDEpIHtcbiAgICAgICAgbWVzc2FnZSArPSAncyc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH0sXG4gICAgaW5wdXRUb29TaG9ydDogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHZhciByZW1haW5pbmdDaGFycyA9IGFyZ3MubWluaW11bSAtIGFyZ3MuaW5wdXQubGVuZ3RoO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgJyArIHJlbWFpbmluZ0NoYXJzICsgJyBvciBtb3JlIGNoYXJhY3RlcnMnO1xuXG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9LFxuICAgIGxvYWRpbmdNb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ0xvYWRpbmcgbW9yZSByZXN1bHRz4oCmJztcbiAgICB9LFxuICAgIG1heGltdW1TZWxlY3RlZDogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1lvdSBjYW4gb25seSBzZWxlY3QgJyArIGFyZ3MubWF4aW11bSArICcgaXRlbSc7XG5cbiAgICAgIGlmIChhcmdzLm1heGltdW0gIT0gMSkge1xuICAgICAgICBtZXNzYWdlICs9ICdzJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSxcbiAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnTm8gcmVzdWx0cyBmb3VuZCc7XG4gICAgfSxcbiAgICBzZWFyY2hpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnU2VhcmNoaW5n4oCmJztcbiAgICB9LFxuICAgIHJlbW92ZUFsbEl0ZW1zOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ1JlbW92ZSBhbGwgaXRlbXMnO1xuICAgIH1cbiAgfTtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGVmYXVsdHMnLFtcbiAgJ2pxdWVyeScsXG4gICdyZXF1aXJlJyxcblxuICAnLi9yZXN1bHRzJyxcblxuICAnLi9zZWxlY3Rpb24vc2luZ2xlJyxcbiAgJy4vc2VsZWN0aW9uL211bHRpcGxlJyxcbiAgJy4vc2VsZWN0aW9uL3BsYWNlaG9sZGVyJyxcbiAgJy4vc2VsZWN0aW9uL2FsbG93Q2xlYXInLFxuICAnLi9zZWxlY3Rpb24vc2VhcmNoJyxcbiAgJy4vc2VsZWN0aW9uL2V2ZW50UmVsYXknLFxuXG4gICcuL3V0aWxzJyxcbiAgJy4vdHJhbnNsYXRpb24nLFxuICAnLi9kaWFjcml0aWNzJyxcblxuICAnLi9kYXRhL3NlbGVjdCcsXG4gICcuL2RhdGEvYXJyYXknLFxuICAnLi9kYXRhL2FqYXgnLFxuICAnLi9kYXRhL3RhZ3MnLFxuICAnLi9kYXRhL3Rva2VuaXplcicsXG4gICcuL2RhdGEvbWluaW11bUlucHV0TGVuZ3RoJyxcbiAgJy4vZGF0YS9tYXhpbXVtSW5wdXRMZW5ndGgnLFxuICAnLi9kYXRhL21heGltdW1TZWxlY3Rpb25MZW5ndGgnLFxuXG4gICcuL2Ryb3Bkb3duJyxcbiAgJy4vZHJvcGRvd24vc2VhcmNoJyxcbiAgJy4vZHJvcGRvd24vaGlkZVBsYWNlaG9sZGVyJyxcbiAgJy4vZHJvcGRvd24vaW5maW5pdGVTY3JvbGwnLFxuICAnLi9kcm9wZG93bi9hdHRhY2hCb2R5JyxcbiAgJy4vZHJvcGRvd24vbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnLFxuICAnLi9kcm9wZG93bi9zZWxlY3RPbkNsb3NlJyxcbiAgJy4vZHJvcGRvd24vY2xvc2VPblNlbGVjdCcsXG5cbiAgJy4vaTE4bi9lbidcbl0sIGZ1bmN0aW9uICgkLCByZXF1aXJlLFxuXG4gICAgICAgICAgICAgUmVzdWx0c0xpc3QsXG5cbiAgICAgICAgICAgICBTaW5nbGVTZWxlY3Rpb24sIE11bHRpcGxlU2VsZWN0aW9uLCBQbGFjZWhvbGRlciwgQWxsb3dDbGVhcixcbiAgICAgICAgICAgICBTZWxlY3Rpb25TZWFyY2gsIEV2ZW50UmVsYXksXG5cbiAgICAgICAgICAgICBVdGlscywgVHJhbnNsYXRpb24sIERJQUNSSVRJQ1MsXG5cbiAgICAgICAgICAgICBTZWxlY3REYXRhLCBBcnJheURhdGEsIEFqYXhEYXRhLCBUYWdzLCBUb2tlbml6ZXIsXG4gICAgICAgICAgICAgTWluaW11bUlucHV0TGVuZ3RoLCBNYXhpbXVtSW5wdXRMZW5ndGgsIE1heGltdW1TZWxlY3Rpb25MZW5ndGgsXG5cbiAgICAgICAgICAgICBEcm9wZG93biwgRHJvcGRvd25TZWFyY2gsIEhpZGVQbGFjZWhvbGRlciwgSW5maW5pdGVTY3JvbGwsXG4gICAgICAgICAgICAgQXR0YWNoQm9keSwgTWluaW11bVJlc3VsdHNGb3JTZWFyY2gsIFNlbGVjdE9uQ2xvc2UsIENsb3NlT25TZWxlY3QsXG5cbiAgICAgICAgICAgICBFbmdsaXNoVHJhbnNsYXRpb24pIHtcbiAgZnVuY3Rpb24gRGVmYXVsdHMgKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIERlZmF1bHRzLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLmRhdGFBZGFwdGVyID09IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLmFqYXggIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gQWpheERhdGE7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAhPSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBBcnJheURhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gU2VsZWN0RGF0YTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubWluaW11bUlucHV0TGVuZ3RoID4gMCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBNaW5pbXVtSW5wdXRMZW5ndGhcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubWF4aW11bUlucHV0TGVuZ3RoID4gMCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBNYXhpbXVtSW5wdXRMZW5ndGhcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubWF4aW11bVNlbGVjdGlvbkxlbmd0aCA+IDApIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgTWF4aW11bVNlbGVjdGlvbkxlbmd0aFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy50YWdzKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShvcHRpb25zLmRhdGFBZGFwdGVyLCBUYWdzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMudG9rZW5TZXBhcmF0b3JzICE9IG51bGwgfHwgb3B0aW9ucy50b2tlbml6ZXIgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBUb2tlbml6ZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMucXVlcnkgIT0gbnVsbCkge1xuICAgICAgICB2YXIgUXVlcnkgPSByZXF1aXJlKG9wdGlvbnMuYW1kQmFzZSArICdjb21wYXQvcXVlcnknKTtcblxuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBRdWVyeVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5pbml0U2VsZWN0aW9uICE9IG51bGwpIHtcbiAgICAgICAgdmFyIEluaXRTZWxlY3Rpb24gPSByZXF1aXJlKG9wdGlvbnMuYW1kQmFzZSArICdjb21wYXQvaW5pdFNlbGVjdGlvbicpO1xuXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIEluaXRTZWxlY3Rpb25cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gUmVzdWx0c0xpc3Q7XG5cbiAgICAgIGlmIChvcHRpb25zLmFqYXggIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlcixcbiAgICAgICAgICBJbmZpbml0ZVNjcm9sbFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5wbGFjZWhvbGRlciAhPSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyLFxuICAgICAgICAgIEhpZGVQbGFjZWhvbGRlclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RPbkNsb3NlKSB7XG4gICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyLFxuICAgICAgICAgIFNlbGVjdE9uQ2xvc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMubXVsdGlwbGUpIHtcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBEcm9wZG93bjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBTZWFyY2hhYmxlRHJvcGRvd24gPSBVdGlscy5EZWNvcmF0ZShEcm9wZG93biwgRHJvcGRvd25TZWFyY2gpO1xuXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gU2VhcmNoYWJsZURyb3Bkb3duO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCAhPT0gMCkge1xuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyLFxuICAgICAgICAgIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgICBDbG9zZU9uU2VsZWN0XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkNzc0NsYXNzICE9IG51bGwgfHxcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkNzcyAhPSBudWxsIHx8XG4gICAgICAgIG9wdGlvbnMuYWRhcHREcm9wZG93bkNzc0NsYXNzICE9IG51bGxcbiAgICAgICkge1xuICAgICAgICB2YXIgRHJvcGRvd25DU1MgPSByZXF1aXJlKG9wdGlvbnMuYW1kQmFzZSArICdjb21wYXQvZHJvcGRvd25Dc3MnKTtcblxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyLFxuICAgICAgICAgIERyb3Bkb3duQ1NTXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyLFxuICAgICAgICBBdHRhY2hCb2R5XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMubXVsdGlwbGUpIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gTXVsdGlwbGVTZWxlY3Rpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBTaW5nbGVTZWxlY3Rpb247XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGUgcGxhY2Vob2xkZXIgbWl4aW4gaWYgYSBwbGFjZWhvbGRlciB3YXMgc3BlY2lmaWVkXG4gICAgICBpZiAob3B0aW9ucy5wbGFjZWhvbGRlciAhPSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgICBQbGFjZWhvbGRlclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5hbGxvd0NsZWFyKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgICBBbGxvd0NsZWFyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgICBTZWxlY3Rpb25TZWFyY2hcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBvcHRpb25zLmNvbnRhaW5lckNzc0NsYXNzICE9IG51bGwgfHxcbiAgICAgICAgb3B0aW9ucy5jb250YWluZXJDc3MgIT0gbnVsbCB8fFxuICAgICAgICBvcHRpb25zLmFkYXB0Q29udGFpbmVyQ3NzQ2xhc3MgIT0gbnVsbFxuICAgICAgKSB7XG4gICAgICAgIHZhciBDb250YWluZXJDU1MgPSByZXF1aXJlKG9wdGlvbnMuYW1kQmFzZSArICdjb21wYXQvY29udGFpbmVyQ3NzJyk7XG5cbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxuICAgICAgICAgIENvbnRhaW5lckNTU1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxuICAgICAgICBFdmVudFJlbGF5XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5sYW5ndWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBsYW5ndWFnZSBpcyBzcGVjaWZpZWQgd2l0aCBhIHJlZ2lvblxuICAgICAgaWYgKG9wdGlvbnMubGFuZ3VhZ2UuaW5kZXhPZignLScpID4gMCkge1xuICAgICAgICAvLyBFeHRyYWN0IHRoZSByZWdpb24gaW5mb3JtYXRpb24gaWYgaXQgaXMgaW5jbHVkZWRcbiAgICAgICAgdmFyIGxhbmd1YWdlUGFydHMgPSBvcHRpb25zLmxhbmd1YWdlLnNwbGl0KCctJyk7XG4gICAgICAgIHZhciBiYXNlTGFuZ3VhZ2UgPSBsYW5ndWFnZVBhcnRzWzBdO1xuXG4gICAgICAgIG9wdGlvbnMubGFuZ3VhZ2UgPSBbb3B0aW9ucy5sYW5ndWFnZSwgYmFzZUxhbmd1YWdlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMubGFuZ3VhZ2UgPSBbb3B0aW9ucy5sYW5ndWFnZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCQuaXNBcnJheShvcHRpb25zLmxhbmd1YWdlKSkge1xuICAgICAgdmFyIGxhbmd1YWdlcyA9IG5ldyBUcmFuc2xhdGlvbigpO1xuICAgICAgb3B0aW9ucy5sYW5ndWFnZS5wdXNoKCdlbicpO1xuXG4gICAgICB2YXIgbGFuZ3VhZ2VOYW1lcyA9IG9wdGlvbnMubGFuZ3VhZ2U7XG5cbiAgICAgIGZvciAodmFyIGwgPSAwOyBsIDwgbGFuZ3VhZ2VOYW1lcy5sZW5ndGg7IGwrKykge1xuICAgICAgICB2YXIgbmFtZSA9IGxhbmd1YWdlTmFtZXNbbF07XG4gICAgICAgIHZhciBsYW5ndWFnZSA9IHt9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVHJ5IHRvIGxvYWQgaXQgd2l0aCB0aGUgb3JpZ2luYWwgbmFtZVxuICAgICAgICAgIGxhbmd1YWdlID0gVHJhbnNsYXRpb24ubG9hZFBhdGgobmFtZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgbG9hZCBpdCwgY2hlY2sgaWYgaXQgd2Fzbid0IHRoZSBmdWxsIHBhdGhcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLmRlZmF1bHRzLmFtZExhbmd1YWdlQmFzZSArIG5hbWU7XG4gICAgICAgICAgICBsYW5ndWFnZSA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKG5hbWUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAvLyBUaGUgdHJhbnNsYXRpb24gY291bGQgbm90IGJlIGxvYWRlZCBhdCBhbGwuIFNvbWV0aW1lcyB0aGlzIGlzXG4gICAgICAgICAgICAvLyBiZWNhdXNlIG9mIGEgY29uZmlndXJhdGlvbiBwcm9ibGVtLCBvdGhlciB0aW1lcyB0aGlzIGNhbiBiZVxuICAgICAgICAgICAgLy8gYmVjYXVzZSBvZiBob3cgU2VsZWN0MiBoZWxwcyBsb2FkIGFsbCBwb3NzaWJsZSB0cmFuc2xhdGlvbiBmaWxlcy5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgJ1NlbGVjdDI6IFRoZSBsYW5ndWFnZSBmaWxlIGZvciBcIicgKyBuYW1lICsgJ1wiIGNvdWxkIG5vdCBiZSAnICtcbiAgICAgICAgICAgICAgICAnYXV0b21hdGljYWxseSBsb2FkZWQuIEEgZmFsbGJhY2sgd2lsbCBiZSB1c2VkIGluc3RlYWQuJ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsYW5ndWFnZXMuZXh0ZW5kKGxhbmd1YWdlKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy50cmFuc2xhdGlvbnMgPSBsYW5ndWFnZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBiYXNlVHJhbnNsYXRpb24gPSBUcmFuc2xhdGlvbi5sb2FkUGF0aChcbiAgICAgICAgdGhpcy5kZWZhdWx0cy5hbWRMYW5ndWFnZUJhc2UgKyAnZW4nXG4gICAgICApO1xuICAgICAgdmFyIGN1c3RvbVRyYW5zbGF0aW9uID0gbmV3IFRyYW5zbGF0aW9uKG9wdGlvbnMubGFuZ3VhZ2UpO1xuXG4gICAgICBjdXN0b21UcmFuc2xhdGlvbi5leHRlbmQoYmFzZVRyYW5zbGF0aW9uKTtcblxuICAgICAgb3B0aW9ucy50cmFuc2xhdGlvbnMgPSBjdXN0b21UcmFuc2xhdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfTtcblxuICBEZWZhdWx0cy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gc3RyaXBEaWFjcml0aWNzICh0ZXh0KSB7XG4gICAgICAvLyBVc2VkICd1bmkgcmFuZ2UgKyBuYW1lZCBmdW5jdGlvbicgZnJvbSBodHRwOi8vanNwZXJmLmNvbS9kaWFjcml0aWNzLzE4XG4gICAgICBmdW5jdGlvbiBtYXRjaChhKSB7XG4gICAgICAgIHJldHVybiBESUFDUklUSUNTW2FdIHx8IGE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1teXFx1MDAwMC1cXHUwMDdFXS9nLCBtYXRjaCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF0Y2hlciAocGFyYW1zLCBkYXRhKSB7XG4gICAgICAvLyBBbHdheXMgcmV0dXJuIHRoZSBvYmplY3QgaWYgdGhlcmUgaXMgbm90aGluZyB0byBjb21wYXJlXG4gICAgICBpZiAoJC50cmltKHBhcmFtcy50ZXJtKSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIERvIGEgcmVjdXJzaXZlIGNoZWNrIGZvciBvcHRpb25zIHdpdGggY2hpbGRyZW5cbiAgICAgIGlmIChkYXRhLmNoaWxkcmVuICYmIGRhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBDbG9uZSB0aGUgZGF0YSBvYmplY3QgaWYgdGhlcmUgYXJlIGNoaWxkcmVuXG4gICAgICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgd2UgbW9kaWZ5IHRoZSBvYmplY3QgdG8gcmVtb3ZlIGFueSBub24tbWF0Y2hlc1xuICAgICAgICB2YXIgbWF0Y2ggPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGF0YSk7XG5cbiAgICAgICAgLy8gQ2hlY2sgZWFjaCBjaGlsZCBvZiB0aGUgb3B0aW9uXG4gICAgICAgIGZvciAodmFyIGMgPSBkYXRhLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGMgPj0gMDsgYy0tKSB7XG4gICAgICAgICAgdmFyIGNoaWxkID0gZGF0YS5jaGlsZHJlbltjXTtcblxuICAgICAgICAgIHZhciBtYXRjaGVzID0gbWF0Y2hlcihwYXJhbXMsIGNoaWxkKTtcblxuICAgICAgICAgIC8vIElmIHRoZXJlIHdhc24ndCBhIG1hdGNoLCByZW1vdmUgdGhlIG9iamVjdCBpbiB0aGUgYXJyYXlcbiAgICAgICAgICBpZiAobWF0Y2hlcyA9PSBudWxsKSB7XG4gICAgICAgICAgICBtYXRjaC5jaGlsZHJlbi5zcGxpY2UoYywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgYW55IGNoaWxkcmVuIG1hdGNoZWQsIHJldHVybiB0aGUgbmV3IG9iamVjdFxuICAgICAgICBpZiAobWF0Y2guY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlIHdlcmUgbm8gbWF0Y2hpbmcgY2hpbGRyZW4sIGNoZWNrIGp1c3QgdGhlIHBsYWluIG9iamVjdFxuICAgICAgICByZXR1cm4gbWF0Y2hlcihwYXJhbXMsIG1hdGNoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9yaWdpbmFsID0gc3RyaXBEaWFjcml0aWNzKGRhdGEudGV4dCkudG9VcHBlckNhc2UoKTtcbiAgICAgIHZhciB0ZXJtID0gc3RyaXBEaWFjcml0aWNzKHBhcmFtcy50ZXJtKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgdGV4dCBjb250YWlucyB0aGUgdGVybVxuICAgICAgaWYgKG9yaWdpbmFsLmluZGV4T2YodGVybSkgPiAtMSkge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQgZG9lc24ndCBjb250YWluIHRoZSB0ZXJtLCBkb24ndCByZXR1cm4gYW55dGhpbmdcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBhbWRCYXNlOiAnLi8nLFxuICAgICAgYW1kTGFuZ3VhZ2VCYXNlOiAnLi9pMThuLycsXG4gICAgICBjbG9zZU9uU2VsZWN0OiB0cnVlLFxuICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgZHJvcGRvd25BdXRvV2lkdGg6IGZhbHNlLFxuICAgICAgZXNjYXBlTWFya3VwOiBVdGlscy5lc2NhcGVNYXJrdXAsXG4gICAgICBsYW5ndWFnZTogRW5nbGlzaFRyYW5zbGF0aW9uLFxuICAgICAgbWF0Y2hlcjogbWF0Y2hlcixcbiAgICAgIG1pbmltdW1JbnB1dExlbmd0aDogMCxcbiAgICAgIG1heGltdW1JbnB1dExlbmd0aDogMCxcbiAgICAgIG1heGltdW1TZWxlY3Rpb25MZW5ndGg6IDAsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogMCxcbiAgICAgIHNlbGVjdE9uQ2xvc2U6IGZhbHNlLFxuICAgICAgc2Nyb2xsQWZ0ZXJTZWxlY3Q6IGZhbHNlLFxuICAgICAgc29ydGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZVJlc3VsdDogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnRleHQ7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVTZWxlY3Rpb246IGZ1bmN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi50ZXh0O1xuICAgICAgfSxcbiAgICAgIHRoZW1lOiAnZGVmYXVsdCcsXG4gICAgICB3aWR0aDogJ3Jlc29sdmUnXG4gICAgfTtcbiAgfTtcblxuICBEZWZhdWx0cy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgY2FtZWxLZXkgPSAkLmNhbWVsQ2FzZShrZXkpO1xuXG4gICAgdmFyIGRhdGEgPSB7fTtcbiAgICBkYXRhW2NhbWVsS2V5XSA9IHZhbHVlO1xuXG4gICAgdmFyIGNvbnZlcnRlZERhdGEgPSBVdGlscy5fY29udmVydERhdGEoZGF0YSk7XG5cbiAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLmRlZmF1bHRzLCBjb252ZXJ0ZWREYXRhKTtcbiAgfTtcblxuICB2YXIgZGVmYXVsdHMgPSBuZXcgRGVmYXVsdHMoKTtcblxuICByZXR1cm4gZGVmYXVsdHM7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL29wdGlvbnMnLFtcbiAgJ3JlcXVpcmUnLFxuICAnanF1ZXJ5JyxcbiAgJy4vZGVmYXVsdHMnLFxuICAnLi91dGlscydcbl0sIGZ1bmN0aW9uIChyZXF1aXJlLCAkLCBEZWZhdWx0cywgVXRpbHMpIHtcbiAgZnVuY3Rpb24gT3B0aW9ucyAob3B0aW9ucywgJGVsZW1lbnQpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgaWYgKCRlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZnJvbUVsZW1lbnQoJGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucyA9IERlZmF1bHRzLmFwcGx5KHRoaXMub3B0aW9ucyk7XG5cbiAgICBpZiAoJGVsZW1lbnQgJiYgJGVsZW1lbnQuaXMoJ2lucHV0JykpIHtcbiAgICAgIHZhciBJbnB1dENvbXBhdCA9IHJlcXVpcmUodGhpcy5nZXQoJ2FtZEJhc2UnKSArICdjb21wYXQvaW5wdXREYXRhJyk7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgIElucHV0Q29tcGF0XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIE9wdGlvbnMucHJvdG90eXBlLmZyb21FbGVtZW50ID0gZnVuY3Rpb24gKCRlKSB7XG4gICAgdmFyIGV4Y2x1ZGVkRGF0YSA9IFsnc2VsZWN0MiddO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tdWx0aXBsZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLm9wdGlvbnMubXVsdGlwbGUgPSAkZS5wcm9wKCdtdWx0aXBsZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5vcHRpb25zLmRpc2FibGVkID0gJGUucHJvcCgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmxhbmd1YWdlID09IG51bGwpIHtcbiAgICAgIGlmICgkZS5wcm9wKCdsYW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID0gJGUucHJvcCgnbGFuZycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9IGVsc2UgaWYgKCRlLmNsb3Nlc3QoJ1tsYW5nXScpLnByb3AoJ2xhbmcnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPSAkZS5jbG9zZXN0KCdbbGFuZ10nKS5wcm9wKCdsYW5nJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXIgPT0gbnVsbCkge1xuICAgICAgaWYgKCRlLnByb3AoJ2RpcicpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXIgPSAkZS5wcm9wKCdkaXInKTtcbiAgICAgIH0gZWxzZSBpZiAoJGUuY2xvc2VzdCgnW2Rpcl0nKS5wcm9wKCdkaXInKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGlyID0gJGUuY2xvc2VzdCgnW2Rpcl0nKS5wcm9wKCdkaXInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXIgPSAnbHRyJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZS5wcm9wKCdkaXNhYmxlZCcsIHRoaXMub3B0aW9ucy5kaXNhYmxlZCk7XG4gICAgJGUucHJvcCgnbXVsdGlwbGUnLCB0aGlzLm9wdGlvbnMubXVsdGlwbGUpO1xuXG4gICAgaWYgKFV0aWxzLkdldERhdGEoJGVbMF0sICdzZWxlY3QyVGFncycpKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ1NlbGVjdDI6IFRoZSBgZGF0YS1zZWxlY3QyLXRhZ3NgIGF0dHJpYnV0ZSBoYXMgYmVlbiBjaGFuZ2VkIHRvICcgK1xuICAgICAgICAgICd1c2UgdGhlIGBkYXRhLWRhdGFgIGFuZCBgZGF0YS10YWdzPVwidHJ1ZVwiYCBhdHRyaWJ1dGVzIGFuZCB3aWxsIGJlICcgK1xuICAgICAgICAgICdyZW1vdmVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBTZWxlY3QyLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgVXRpbHMuU3RvcmVEYXRhKCRlWzBdLCAnZGF0YScsIFV0aWxzLkdldERhdGEoJGVbMF0sICdzZWxlY3QyVGFncycpKTtcbiAgICAgIFV0aWxzLlN0b3JlRGF0YSgkZVswXSwgJ3RhZ3MnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoVXRpbHMuR2V0RGF0YSgkZVswXSwgJ2FqYXhVcmwnKSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGRhdGEtYWpheC11cmxgIGF0dHJpYnV0ZSBoYXMgYmVlbiBjaGFuZ2VkIHRvICcgK1xuICAgICAgICAgICdgZGF0YS1hamF4LS11cmxgIGFuZCBzdXBwb3J0IGZvciB0aGUgb2xkIGF0dHJpYnV0ZSB3aWxsIGJlIHJlbW92ZWQnICtcbiAgICAgICAgICAnIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBTZWxlY3QyLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgJGUuYXR0cignYWpheC0tdXJsJywgVXRpbHMuR2V0RGF0YSgkZVswXSwgJ2FqYXhVcmwnKSk7XG4gICAgICBVdGlscy5TdG9yZURhdGEoJGVbMF0sICdhamF4LVVybCcsIFV0aWxzLkdldERhdGEoJGVbMF0sICdhamF4VXJsJykpO1xuICAgIH1cblxuICAgIHZhciBkYXRhc2V0ID0ge307XG5cbiAgICBmdW5jdGlvbiB1cHBlckNhc2VMZXR0ZXIoXywgbGV0dGVyKSB7XG4gICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgLy8gUHJlLWxvYWQgYWxsIG9mIHRoZSBhdHRyaWJ1dGVzIHdoaWNoIGFyZSBwcmVmaXhlZCB3aXRoIGBkYXRhLWBcbiAgICBmb3IgKHZhciBhdHRyID0gMDsgYXR0ciA8ICRlWzBdLmF0dHJpYnV0ZXMubGVuZ3RoOyBhdHRyKyspIHtcbiAgICAgIHZhciBhdHRyaWJ1dGVOYW1lID0gJGVbMF0uYXR0cmlidXRlc1thdHRyXS5uYW1lO1xuICAgICAgdmFyIHByZWZpeCA9ICdkYXRhLSc7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lLnN1YnN0cigwLCBwcmVmaXgubGVuZ3RoKSA9PSBwcmVmaXgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBjb250ZW50cyBvZiB0aGUgYXR0cmlidXRlIGFmdGVyIGBkYXRhLWBcbiAgICAgICAgdmFyIGRhdGFOYW1lID0gYXR0cmlidXRlTmFtZS5zdWJzdHJpbmcocHJlZml4Lmxlbmd0aCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkYXRhIGNvbnRlbnRzIGZyb20gdGhlIGNvbnNpc3RlbnQgc291cmNlXG4gICAgICAgIC8vIFRoaXMgaXMgbW9yZSB0aGFuIGxpa2VseSB0aGUgalF1ZXJ5IGRhdGEgaGVscGVyXG4gICAgICAgIHZhciBkYXRhVmFsdWUgPSBVdGlscy5HZXREYXRhKCRlWzBdLCBkYXRhTmFtZSk7XG5cbiAgICAgICAgLy8gY2FtZWxDYXNlIHRoZSBhdHRyaWJ1dGUgbmFtZSB0byBtYXRjaCB0aGUgc3BlY1xuICAgICAgICB2YXIgY2FtZWxEYXRhTmFtZSA9IGRhdGFOYW1lLnJlcGxhY2UoLy0oW2Etel0pL2csIHVwcGVyQ2FzZUxldHRlcik7XG5cbiAgICAgICAgLy8gU3RvcmUgdGhlIGRhdGEgYXR0cmlidXRlIGNvbnRlbnRzIGludG8gdGhlIGRhdGFzZXQgc2luY2VcbiAgICAgICAgZGF0YXNldFtjYW1lbERhdGFOYW1lXSA9IGRhdGFWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQcmVmZXIgdGhlIGVsZW1lbnQncyBgZGF0YXNldGAgYXR0cmlidXRlIGlmIGl0IGV4aXN0c1xuICAgIC8vIGpRdWVyeSAxLnggZG9lcyBub3QgY29ycmVjdGx5IGhhbmRsZSBkYXRhIGF0dHJpYnV0ZXMgd2l0aCBtdWx0aXBsZSBkYXNoZXNcbiAgICBpZiAoJC5mbi5qcXVlcnkgJiYgJC5mbi5qcXVlcnkuc3Vic3RyKDAsIDIpID09ICcxLicgJiYgJGVbMF0uZGF0YXNldCkge1xuICAgICAgZGF0YXNldCA9ICQuZXh0ZW5kKHRydWUsIHt9LCAkZVswXS5kYXRhc2V0LCBkYXRhc2V0KTtcbiAgICB9XG5cbiAgICAvLyBQcmVmZXIgb3VyIGludGVybmFsIGRhdGEgY2FjaGUgaWYgaXQgZXhpc3RzXG4gICAgdmFyIGRhdGEgPSAkLmV4dGVuZCh0cnVlLCB7fSwgVXRpbHMuR2V0RGF0YSgkZVswXSksIGRhdGFzZXQpO1xuXG4gICAgZGF0YSA9IFV0aWxzLl9jb252ZXJ0RGF0YShkYXRhKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KGtleSwgZXhjbHVkZWREYXRhKSA+IC0xKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHRoaXMub3B0aW9uc1trZXldKSkge1xuICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnNba2V5XSwgZGF0YVtrZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIE9wdGlvbnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zW2tleV07XG4gIH07XG5cbiAgT3B0aW9ucy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgdGhpcy5vcHRpb25zW2tleV0gPSB2YWw7XG4gIH07XG5cbiAgcmV0dXJuIE9wdGlvbnM7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2NvcmUnLFtcbiAgJ2pxdWVyeScsXG4gICcuL29wdGlvbnMnLFxuICAnLi91dGlscycsXG4gICcuL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgT3B0aW9ucywgVXRpbHMsIEtFWVMpIHtcbiAgdmFyIFNlbGVjdDIgPSBmdW5jdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAoVXRpbHMuR2V0RGF0YSgkZWxlbWVudFswXSwgJ3NlbGVjdDInKSAhPSBudWxsKSB7XG4gICAgICBVdGlscy5HZXREYXRhKCRlbGVtZW50WzBdLCAnc2VsZWN0MicpLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG5cbiAgICB0aGlzLmlkID0gdGhpcy5fZ2VuZXJhdGVJZCgkZWxlbWVudCk7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG5ldyBPcHRpb25zKG9wdGlvbnMsICRlbGVtZW50KTtcblxuICAgIFNlbGVjdDIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG5cbiAgICAvLyBTZXQgdXAgdGhlIHRhYmluZGV4XG5cbiAgICB2YXIgdGFiaW5kZXggPSAkZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpIHx8IDA7XG4gICAgVXRpbHMuU3RvcmVEYXRhKCRlbGVtZW50WzBdLCAnb2xkLXRhYmluZGV4JywgdGFiaW5kZXgpO1xuICAgICRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgICAvLyBTZXQgdXAgY29udGFpbmVycyBhbmQgYWRhcHRlcnNcblxuICAgIHZhciBEYXRhQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ2RhdGFBZGFwdGVyJyk7XG4gICAgdGhpcy5kYXRhQWRhcHRlciA9IG5ldyBEYXRhQWRhcHRlcigkZWxlbWVudCwgdGhpcy5vcHRpb25zKTtcblxuICAgIHZhciAkY29udGFpbmVyID0gdGhpcy5yZW5kZXIoKTtcblxuICAgIHRoaXMuX3BsYWNlQ29udGFpbmVyKCRjb250YWluZXIpO1xuXG4gICAgdmFyIFNlbGVjdGlvbkFkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdzZWxlY3Rpb25BZGFwdGVyJyk7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uQWRhcHRlcigkZWxlbWVudCwgdGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLiRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZW5kZXIoKTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLnBvc2l0aW9uKHRoaXMuJHNlbGVjdGlvbiwgJGNvbnRhaW5lcik7XG5cbiAgICB2YXIgRHJvcGRvd25BZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgnZHJvcGRvd25BZGFwdGVyJyk7XG4gICAgdGhpcy5kcm9wZG93biA9IG5ldyBEcm9wZG93bkFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy4kZHJvcGRvd24gPSB0aGlzLmRyb3Bkb3duLnJlbmRlcigpO1xuXG4gICAgdGhpcy5kcm9wZG93bi5wb3NpdGlvbih0aGlzLiRkcm9wZG93biwgJGNvbnRhaW5lcik7XG5cbiAgICB2YXIgUmVzdWx0c0FkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdyZXN1bHRzQWRhcHRlcicpO1xuICAgIHRoaXMucmVzdWx0cyA9IG5ldyBSZXN1bHRzQWRhcHRlcigkZWxlbWVudCwgdGhpcy5vcHRpb25zLCB0aGlzLmRhdGFBZGFwdGVyKTtcbiAgICB0aGlzLiRyZXN1bHRzID0gdGhpcy5yZXN1bHRzLnJlbmRlcigpO1xuXG4gICAgdGhpcy5yZXN1bHRzLnBvc2l0aW9uKHRoaXMuJHJlc3VsdHMsIHRoaXMuJGRyb3Bkb3duKTtcblxuICAgIC8vIEJpbmQgZXZlbnRzXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBCaW5kIHRoZSBjb250YWluZXIgdG8gYWxsIG9mIHRoZSBhZGFwdGVyc1xuICAgIHRoaXMuX2JpbmRBZGFwdGVycygpO1xuXG4gICAgLy8gUmVnaXN0ZXIgYW55IERPTSBldmVudCBoYW5kbGVyc1xuICAgIHRoaXMuX3JlZ2lzdGVyRG9tRXZlbnRzKCk7XG5cbiAgICAvLyBSZWdpc3RlciBhbnkgaW50ZXJuYWwgZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLl9yZWdpc3RlckRhdGFFdmVudHMoKTtcbiAgICB0aGlzLl9yZWdpc3RlclNlbGVjdGlvbkV2ZW50cygpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRHJvcGRvd25FdmVudHMoKTtcbiAgICB0aGlzLl9yZWdpc3RlclJlc3VsdHNFdmVudHMoKTtcbiAgICB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHN0YXRlXG4gICAgdGhpcy5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChpbml0aWFsRGF0YSkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xuICAgICAgICBkYXRhOiBpbml0aWFsRGF0YVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIHRoZSBvcmlnaW5hbCBzZWxlY3RcbiAgICAkZWxlbWVudC5hZGRDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpO1xuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIC8vIFN5bmNocm9uaXplIGFueSBtb25pdG9yZWQgYXR0cmlidXRlc1xuICAgIHRoaXMuX3N5bmNBdHRyaWJ1dGVzKCk7XG5cbiAgICBVdGlscy5TdG9yZURhdGEoJGVsZW1lbnRbMF0sICdzZWxlY3QyJywgdGhpcyk7XG5cbiAgICAvLyBFbnN1cmUgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCAkZWxlbWVudC5kYXRhKCdzZWxlY3QyJykuXG4gICAgJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicsIHRoaXMpO1xuICB9O1xuXG4gIFV0aWxzLkV4dGVuZChTZWxlY3QyLCBVdGlscy5PYnNlcnZhYmxlKTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fZ2VuZXJhdGVJZCA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgIHZhciBpZCA9ICcnO1xuXG4gICAgaWYgKCRlbGVtZW50LmF0dHIoJ2lkJykgIT0gbnVsbCkge1xuICAgICAgaWQgPSAkZWxlbWVudC5hdHRyKCdpZCcpO1xuICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpICE9IG51bGwpIHtcbiAgICAgIGlkID0gJGVsZW1lbnQuYXR0cignbmFtZScpICsgJy0nICsgVXRpbHMuZ2VuZXJhdGVDaGFycygyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSBVdGlscy5nZW5lcmF0ZUNoYXJzKDQpO1xuICAgIH1cblxuICAgIGlkID0gaWQucmVwbGFjZSgvKDp8XFwufFxcW3xcXF18LCkvZywgJycpO1xuICAgIGlkID0gJ3NlbGVjdDItJyArIGlkO1xuXG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9wbGFjZUNvbnRhaW5lciA9IGZ1bmN0aW9uICgkY29udGFpbmVyKSB7XG4gICAgJGNvbnRhaW5lci5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KTtcblxuICAgIHZhciB3aWR0aCA9IHRoaXMuX3Jlc29sdmVXaWR0aCh0aGlzLiRlbGVtZW50LCB0aGlzLm9wdGlvbnMuZ2V0KCd3aWR0aCcpKTtcblxuICAgIGlmICh3aWR0aCAhPSBudWxsKSB7XG4gICAgICAkY29udGFpbmVyLmNzcygnd2lkdGgnLCB3aWR0aCk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZXNvbHZlV2lkdGggPSBmdW5jdGlvbiAoJGVsZW1lbnQsIG1ldGhvZCkge1xuICAgIHZhciBXSURUSCA9IC9ed2lkdGg6KChbLStdPyhbMC05XSpcXC4pP1swLTldKykocHh8ZW18ZXh8JXxpbnxjbXxtbXxwdHxwYykpL2k7XG5cbiAgICBpZiAobWV0aG9kID09ICdyZXNvbHZlJykge1xuICAgICAgdmFyIHN0eWxlV2lkdGggPSB0aGlzLl9yZXNvbHZlV2lkdGgoJGVsZW1lbnQsICdzdHlsZScpO1xuXG4gICAgICBpZiAoc3R5bGVXaWR0aCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdHlsZVdpZHRoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVdpZHRoKCRlbGVtZW50LCAnZWxlbWVudCcpO1xuICAgIH1cblxuICAgIGlmIChtZXRob2QgPT0gJ2VsZW1lbnQnKSB7XG4gICAgICB2YXIgZWxlbWVudFdpZHRoID0gJGVsZW1lbnQub3V0ZXJXaWR0aChmYWxzZSk7XG5cbiAgICAgIGlmIChlbGVtZW50V2lkdGggPD0gMCkge1xuICAgICAgICByZXR1cm4gJ2F1dG8nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWxlbWVudFdpZHRoICsgJ3B4JztcbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09ICdzdHlsZScpIHtcbiAgICAgIHZhciBzdHlsZSA9ICRlbGVtZW50LmF0dHIoJ3N0eWxlJyk7XG5cbiAgICAgIGlmICh0eXBlb2Yoc3R5bGUpICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHJzID0gc3R5bGUuc3BsaXQoJzsnKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpID0gaSArIDEpIHtcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXS5yZXBsYWNlKC9cXHMvZywgJycpO1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IGF0dHIubWF0Y2goV0lEVEgpO1xuXG4gICAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsICYmIG1hdGNoZXMubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9iaW5kQWRhcHRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kYXRhQWRhcHRlci5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gICAgdGhpcy5zZWxlY3Rpb24uYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xuXG4gICAgdGhpcy5kcm9wZG93bi5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gICAgdGhpcy5yZXN1bHRzLmJpbmQodGhpcywgdGhpcy4kY29udGFpbmVyKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJEb21FdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2hhbmdlLnNlbGVjdDInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2ZvY3VzLnNlbGVjdDInLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3N5bmNBID0gVXRpbHMuYmluZCh0aGlzLl9zeW5jQXR0cmlidXRlcywgdGhpcyk7XG4gICAgdGhpcy5fc3luY1MgPSBVdGlscy5iaW5kKHRoaXMuX3N5bmNTdWJ0cmVlLCB0aGlzKTtcblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLmF0dGFjaEV2ZW50KSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmF0dGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgdGhpcy5fc3luY0EpO1xuICAgIH1cblxuICAgIHZhciBvYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8XG4gICAgICB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlciB8fFxuICAgICAgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXJcbiAgICA7XG5cbiAgICBpZiAob2JzZXJ2ZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgb2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAkLmVhY2gobXV0YXRpb25zLCBzZWxmLl9zeW5jQSk7XG4gICAgICAgICQuZWFjaChtdXRhdGlvbnMsIHNlbGYuX3N5bmNTKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLiRlbGVtZW50WzBdLCB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdET01BdHRyTW9kaWZpZWQnLFxuICAgICAgICBzZWxmLl9zeW5jQSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdET01Ob2RlSW5zZXJ0ZWQnLFxuICAgICAgICBzZWxmLl9zeW5jUyxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdET01Ob2RlUmVtb3ZlZCcsXG4gICAgICAgIHNlbGYuX3N5bmNTLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRGF0YUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyU2VsZWN0aW9uRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbm9uUmVsYXlFdmVudHMgPSBbJ3RvZ2dsZScsICdmb2N1cyddO1xuXG4gICAgdGhpcy5zZWxlY3Rpb24ub24oJ3RvZ2dsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYudG9nZ2xlRHJvcGRvd24oKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuZm9jdXMocGFyYW1zKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuICAgICAgaWYgKCQuaW5BcnJheShuYW1lLCBub25SZWxheUV2ZW50cykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRHJvcGRvd25FdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5kcm9wZG93bi5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlclJlc3VsdHNFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5yZXN1bHRzLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWRpc2FibGVkJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZGlzYWJsZWQnKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1mb2N1cycpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigncXVlcnknLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBpZiAoIXNlbGYuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdvcGVuJywge30pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRhdGFBZGFwdGVyLnF1ZXJ5KHBhcmFtcywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmFsbCcsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHF1ZXJ5OiBwYXJhbXNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3F1ZXJ5OmFwcGVuZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIucXVlcnkocGFyYW1zLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6YXBwZW5kJywge1xuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgcXVlcnk6IHBhcmFtc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xuXG4gICAgICBpZiAoc2VsZi5pc09wZW4oKSkge1xuICAgICAgICBpZiAoa2V5ID09PSBLRVlTLkVTQyB8fCBrZXkgPT09IEtFWVMuVEFCIHx8XG4gICAgICAgICAgICAoa2V5ID09PSBLRVlTLlVQICYmIGV2dC5hbHRLZXkpKSB7XG4gICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBLRVlTLkVOVEVSKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOnNlbGVjdCcsIHt9KTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKChrZXkgPT09IEtFWVMuU1BBQ0UgJiYgZXZ0LmN0cmxLZXkpKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOnRvZ2dsZScsIHt9KTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5VUCkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpwcmV2aW91cycsIHt9KTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5ET1dOKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm5leHQnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGtleSA9PT0gS0VZUy5FTlRFUiB8fCBrZXkgPT09IEtFWVMuU1BBQ0UgfHxcbiAgICAgICAgICAgIChrZXkgPT09IEtFWVMuRE9XTiAmJiBldnQuYWx0S2V5KSkge1xuICAgICAgICAgIHNlbGYub3BlbigpO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fc3luY0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5vcHRpb25zLnNldCgnZGlzYWJsZWQnLCB0aGlzLiRlbGVtZW50LnByb3AoJ2Rpc2FibGVkJykpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyKCdkaXNhYmxlJywge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2VuYWJsZScsIHt9KTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3N5bmNTdWJ0cmVlID0gZnVuY3Rpb24gKGV2dCwgbXV0YXRpb25zKSB7XG4gICAgdmFyIGNoYW5nZWQgPSBmYWxzZTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBJZ25vcmUgYW55IG11dGF0aW9uIGV2ZW50cyByYWlzZWQgZm9yIGVsZW1lbnRzIHRoYXQgYXJlbid0IG9wdGlvbnMgb3JcbiAgICAvLyBvcHRncm91cHMuIFRoaXMgaGFuZGxlcyB0aGUgY2FzZSB3aGVuIHRoZSBzZWxlY3QgZWxlbWVudCBpcyBkZXN0cm95ZWRcbiAgICBpZiAoXG4gICAgICBldnQgJiYgZXZ0LnRhcmdldCAmJiAoXG4gICAgICAgIGV2dC50YXJnZXQubm9kZU5hbWUgIT09ICdPUFRJT04nICYmIGV2dC50YXJnZXQubm9kZU5hbWUgIT09ICdPUFRHUk9VUCdcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW11dGF0aW9ucykge1xuICAgICAgLy8gSWYgbXV0YXRpb24gZXZlbnRzIGFyZW4ndCBzdXBwb3J0ZWQsIHRoZW4gd2UgY2FuIG9ubHkgYXNzdW1lIHRoYXQgdGhlXG4gICAgICAvLyBjaGFuZ2UgYWZmZWN0ZWQgdGhlIHNlbGVjdGlvbnNcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAobXV0YXRpb25zLmFkZGVkTm9kZXMgJiYgbXV0YXRpb25zLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBtdXRhdGlvbnMuYWRkZWROb2Rlcy5sZW5ndGg7IG4rKykge1xuICAgICAgICB2YXIgbm9kZSA9IG11dGF0aW9ucy5hZGRlZE5vZGVzW25dO1xuXG4gICAgICAgIGlmIChub2RlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG11dGF0aW9ucy5yZW1vdmVkTm9kZXMgJiYgbXV0YXRpb25zLnJlbW92ZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHJlLXB1bGwgdGhlIGRhdGEgaWYgd2UgdGhpbmsgdGhlcmUgaXMgYSBjaGFuZ2VcbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgdGhpcy5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdGlvbjp1cGRhdGUnLCB7XG4gICAgICAgICAgZGF0YTogY3VycmVudERhdGFcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHRoZSB0cmlnZ2VyIG1ldGhvZCB0byBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgcHJlLWV2ZW50cyB3aGVuXG4gICAqIHRoZXJlIGFyZSBldmVudHMgdGhhdCBjYW4gYmUgcHJldmVudGVkLlxuICAgKi9cbiAgU2VsZWN0Mi5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgdmFyIGFjdHVhbFRyaWdnZXIgPSBTZWxlY3QyLl9fc3VwZXJfXy50cmlnZ2VyO1xuICAgIHZhciBwcmVUcmlnZ2VyTWFwID0ge1xuICAgICAgJ29wZW4nOiAnb3BlbmluZycsXG4gICAgICAnY2xvc2UnOiAnY2xvc2luZycsXG4gICAgICAnc2VsZWN0JzogJ3NlbGVjdGluZycsXG4gICAgICAndW5zZWxlY3QnOiAndW5zZWxlY3RpbmcnLFxuICAgICAgJ2NsZWFyJzogJ2NsZWFyaW5nJ1xuICAgIH07XG5cbiAgICBpZiAoYXJncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzID0ge307XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgaW4gcHJlVHJpZ2dlck1hcCkge1xuICAgICAgdmFyIHByZVRyaWdnZXJOYW1lID0gcHJlVHJpZ2dlck1hcFtuYW1lXTtcbiAgICAgIHZhciBwcmVUcmlnZ2VyQXJncyA9IHtcbiAgICAgICAgcHJldmVudGVkOiBmYWxzZSxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgYXJnczogYXJnc1xuICAgICAgfTtcblxuICAgICAgYWN0dWFsVHJpZ2dlci5jYWxsKHRoaXMsIHByZVRyaWdnZXJOYW1lLCBwcmVUcmlnZ2VyQXJncyk7XG5cbiAgICAgIGlmIChwcmVUcmlnZ2VyQXJncy5wcmV2ZW50ZWQpIHtcbiAgICAgICAgYXJncy5wcmV2ZW50ZWQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhY3R1YWxUcmlnZ2VyLmNhbGwodGhpcywgbmFtZSwgYXJncyk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUudG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7fSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdjbG9zZScsIHt9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5pc09wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5oYXNDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5oYXNGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy8gTm8gbmVlZCB0byByZS10cmlnZ2VyIGZvY3VzIGV2ZW50cyBpZiB3ZSBhcmUgYWxyZWFkeSBmb2N1c2VkXG4gICAgaWYgKHRoaXMuaGFzRm9jdXMoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuJGNvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWZvY3VzJyk7XG4gICAgdGhpcy50cmlnZ2VyKCdmb2N1cycsIHt9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnU2VsZWN0MjogVGhlIGBzZWxlY3QyKFwiZW5hYmxlXCIpYCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCcgK1xuICAgICAgICAnIGJlIHJlbW92ZWQgaW4gbGF0ZXIgU2VsZWN0MiB2ZXJzaW9ucy4gVXNlICRlbGVtZW50LnByb3AoXCJkaXNhYmxlZFwiKScgK1xuICAgICAgICAnIGluc3RlYWQuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoYXJncyA9PSBudWxsIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBhcmdzID0gW3RydWVdO1xuICAgIH1cblxuICAgIHZhciBkaXNhYmxlZCA9ICFhcmdzWzBdO1xuXG4gICAgdGhpcy4kZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmXG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnU2VsZWN0MjogRGF0YSBjYW4gbm8gbG9uZ2VyIGJlIHNldCB1c2luZyBgc2VsZWN0MihcImRhdGFcIilgLiBZb3UgJyArXG4gICAgICAgICdzaG91bGQgY29uc2lkZXIgc2V0dGluZyB0aGUgdmFsdWUgaW5zdGVhZCB1c2luZyBgJGVsZW1lbnQudmFsKClgLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSBbXTtcblxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgIGRhdGEgPSBjdXJyZW50RGF0YTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLnZhbCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdTZWxlY3QyOiBUaGUgYHNlbGVjdDIoXCJ2YWxcIilgIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlJyArXG4gICAgICAgICcgcmVtb3ZlZCBpbiBsYXRlciBTZWxlY3QyIHZlcnNpb25zLiBVc2UgJGVsZW1lbnQudmFsKCkgaW5zdGVhZC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChhcmdzID09IG51bGwgfHwgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50LnZhbCgpO1xuICAgIH1cblxuICAgIHZhciBuZXdWYWwgPSBhcmdzWzBdO1xuXG4gICAgaWYgKCQuaXNBcnJheShuZXdWYWwpKSB7XG4gICAgICBuZXdWYWwgPSAkLm1hcChuZXdWYWwsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC52YWwobmV3VmFsKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmUoKTtcblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLmRldGFjaEV2ZW50KSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmRldGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgdGhpcy5fc3luY0EpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vYnNlcnZlciAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICB0aGlzLl9vYnNlcnZlciA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50WzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF1cbiAgICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUF0dHJNb2RpZmllZCcsIHRoaXMuX3N5bmNBLCBmYWxzZSk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdXG4gICAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLCB0aGlzLl9zeW5jUywgZmFsc2UpO1xuICAgICAgdGhpcy4kZWxlbWVudFswXVxuICAgICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTm9kZVJlbW92ZWQnLCB0aGlzLl9zeW5jUywgZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMuX3N5bmNBID0gbnVsbDtcbiAgICB0aGlzLl9zeW5jUyA9IG51bGw7XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9mZignLnNlbGVjdDInKTtcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JyxcbiAgICBVdGlscy5HZXREYXRhKHRoaXMuJGVsZW1lbnRbMF0sICdvbGQtdGFiaW5kZXgnKSk7XG5cbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgIFV0aWxzLlJlbW92ZURhdGEodGhpcy4kZWxlbWVudFswXSk7XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVEYXRhKCdzZWxlY3QyJyk7XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLnNlbGVjdGlvbi5kZXN0cm95KCk7XG4gICAgdGhpcy5kcm9wZG93bi5kZXN0cm95KCk7XG4gICAgdGhpcy5yZXN1bHRzLmRlc3Ryb3koKTtcblxuICAgIHRoaXMuZGF0YUFkYXB0ZXIgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmRyb3Bkb3duID0gbnVsbDtcbiAgICB0aGlzLnJlc3VsdHMgPSBudWxsO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyIHNlbGVjdDItY29udGFpbmVyXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdGlvblwiPjwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiZHJvcGRvd24td3JhcHBlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICAkY29udGFpbmVyLmF0dHIoJ2RpcicsIHRoaXMub3B0aW9ucy5nZXQoJ2RpcicpKTtcblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG5cbiAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS0nICsgdGhpcy5vcHRpb25zLmdldCgndGhlbWUnKSk7XG5cbiAgICBVdGlscy5TdG9yZURhdGEoJGNvbnRhaW5lclswXSwgJ2VsZW1lbnQnLCB0aGlzLiRlbGVtZW50KTtcblxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiBTZWxlY3QyO1xufSk7XG5cblMyLmRlZmluZSgnanF1ZXJ5LW1vdXNld2hlZWwnLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIC8vIFVzZWQgdG8gc2hpbSBqUXVlcnkubW91c2V3aGVlbCBmb3Igbm9uLWZ1bGwgYnVpbGRzLlxuICByZXR1cm4gJDtcbn0pO1xuXG5TMi5kZWZpbmUoJ2pxdWVyeS5zZWxlY3QyJyxbXG4gICdqcXVlcnknLFxuICAnanF1ZXJ5LW1vdXNld2hlZWwnLFxuXG4gICcuL3NlbGVjdDIvY29yZScsXG4gICcuL3NlbGVjdDIvZGVmYXVsdHMnLFxuICAnLi9zZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIF8sIFNlbGVjdDIsIERlZmF1bHRzLCBVdGlscykge1xuICBpZiAoJC5mbi5zZWxlY3QyID09IG51bGwpIHtcbiAgICAvLyBBbGwgbWV0aG9kcyB0aGF0IHNob3VsZCByZXR1cm4gdGhlIGVsZW1lbnRcbiAgICB2YXIgdGhpc01ldGhvZHMgPSBbJ29wZW4nLCAnY2xvc2UnLCAnZGVzdHJveSddO1xuXG4gICAgJC5mbi5zZWxlY3QyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGluc3RhbmNlT3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcblxuICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBTZWxlY3QyKCQodGhpcyksIGluc3RhbmNlT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGluc3RhbmNlID0gVXRpbHMuR2V0RGF0YSh0aGlzLCAnc2VsZWN0MicpO1xuXG4gICAgICAgICAgaWYgKGluc3RhbmNlID09IG51bGwgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgJ1RoZSBzZWxlY3QyKFxcJycgKyBvcHRpb25zICsgJ1xcJykgbWV0aG9kIHdhcyBjYWxsZWQgb24gYW4gJyArXG4gICAgICAgICAgICAgICdlbGVtZW50IHRoYXQgaXMgbm90IHVzaW5nIFNlbGVjdDIuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXQgPSBpbnN0YW5jZVtvcHRpb25zXS5hcHBseShpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHdlIHNob3VsZCBiZSByZXR1cm5pbmcgYHRoaXNgXG4gICAgICAgIGlmICgkLmluQXJyYXkob3B0aW9ucywgdGhpc01ldGhvZHMpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzIGZvciBTZWxlY3QyOiAnICsgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmICgkLmZuLnNlbGVjdDIuZGVmYXVsdHMgPT0gbnVsbCkge1xuICAgICQuZm4uc2VsZWN0Mi5kZWZhdWx0cyA9IERlZmF1bHRzO1xuICB9XG5cbiAgcmV0dXJuIFNlbGVjdDI7XG59KTtcblxuICAvLyBSZXR1cm4gdGhlIEFNRCBsb2FkZXIgY29uZmlndXJhdGlvbiBzbyBpdCBjYW4gYmUgdXNlZCBvdXRzaWRlIG9mIHRoaXMgZmlsZVxuICByZXR1cm4ge1xuICAgIGRlZmluZTogUzIuZGVmaW5lLFxuICAgIHJlcXVpcmU6IFMyLnJlcXVpcmVcbiAgfTtcbn0oKSk7XG5cbiAgLy8gQXV0b2xvYWQgdGhlIGpRdWVyeSBiaW5kaW5nc1xuICAvLyBXZSBrbm93IHRoYXQgYWxsIG9mIHRoZSBtb2R1bGVzIGV4aXN0IGFib3ZlIHRoaXMsIHNvIHdlJ3JlIHNhZmVcbiAgdmFyIHNlbGVjdDIgPSBTMi5yZXF1aXJlKCdqcXVlcnkuc2VsZWN0MicpO1xuXG4gIC8vIEhvbGQgdGhlIEFNRCBtb2R1bGUgcmVmZXJlbmNlcyBvbiB0aGUgalF1ZXJ5IGZ1bmN0aW9uIHRoYXQgd2FzIGp1c3QgbG9hZGVkXG4gIC8vIFRoaXMgYWxsb3dzIFNlbGVjdDIgdG8gdXNlIHRoZSBpbnRlcm5hbCBsb2FkZXIgb3V0c2lkZSBvZiB0aGlzIGZpbGUsIHN1Y2hcbiAgLy8gYXMgaW4gdGhlIGxhbmd1YWdlIGZpbGVzLlxuICBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQgPSBTMjtcblxuICAvLyBSZXR1cm4gdGhlIFNlbGVjdDIgaW5zdGFuY2UgZm9yIGFueW9uZSB3aG8gaXMgaW1wb3J0aW5nIGl0LlxuICByZXR1cm4gc2VsZWN0Mjtcbn0pKTtcbiJdfQ==