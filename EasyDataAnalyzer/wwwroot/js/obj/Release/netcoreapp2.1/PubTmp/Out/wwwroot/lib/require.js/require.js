/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.3.6 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, https://github.com/requirejs/requirejs/blob/master/LICENSE
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */
var requirejs, require, define;
(function (global, setTimeout) {
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = '2.3.6', commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document), isWebWorker = !isBrowser && typeof importScripts !== 'undefined', 
    //PS3 indicates loaded and complete, but need to wait for complete
    //specifically. Sequence is 'loading', 'loaded', execution,
    // then 'complete'. The UA check is unfortunate, but not sure how
    //to feature test w/o causing perf issues.
    readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
        /^complete$/ : /^(complete|loaded)$/, defContextName = '_', 
    //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
    isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]', contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = false;
    //Could match something like ')//comment', do not lose the prefix to comment.
    function commentReplace(match, singlePrefix) {
        return singlePrefix || '';
    }
    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }
    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }
    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }
    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }
    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }
    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }
    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    }
                    else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }
    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }
    function scripts() {
        return document.getElementsByTagName('script');
    }
    function defaultOnError(err) {
        throw err;
    }
    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }
    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttps://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }
    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }
    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite an existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }
    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }
    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers, checkLoadedTimeoutId, config = {
            //Defaults. Do not set a default for map
            //config to speed up normalize(), which
            //will run faster if there is no default.
            waitSeconds: 7,
            baseUrl: './',
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, registry = {}, 
        //registry of just enabled modules, to speed
        //cycle breaking code when lots of modules
        //are registered, but not activated.
        enabledRegistry = {}, undefEvents = {}, defQueue = [], defined = {}, urlFetched = {}, bundlesMap = {}, requireCounter = 1, unnormalizedCounter = 1;
        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                }
                else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    }
                    else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }
        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex, foundMap, foundI, foundStarMap, starI, normalizedBaseParts, baseParts = (baseName && baseName.split('/')), map = config.map, starMap = map && map['*'];
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
                trimDots(name);
                name = name.join('/');
            }
            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');
                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');
                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));
                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }
                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
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
            // If the name points to a package's name, use
            // the package main instead.
            pkgMain = getOwn(config.pkgs, name);
            return pkgMain ? pkgMain : name;
        }
        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                        scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }
        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                //Custom require that does not do map translation, since
                //ID is "absolute", already mapped/resolved.
                context.makeRequire(null, {
                    skipMap: true
                })([id]);
                return true;
            }
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
        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts, prefix = null, parentName = parentModuleMap ? parentModuleMap.name : null, originalName = name, isDefine = true, normalizedName = '';
            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }
            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];
            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }
            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (isNormalized) {
                        normalizedName = name;
                    }
                    else if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    }
                    else {
                        // If nested plugin references, then do not try to
                        // normalize, as it will not normalize correctly. This
                        // places a restriction on resourceIds, and the longer
                        // term solution is not to normalize until plugins are
                        // loaded and all normalizations to allow for async
                        // loading of a loader plugin. But for now, fixes the
                        // common uses. Details in #1131
                        normalizedName = name.indexOf('!') === -1 ?
                            normalize(name, parentName, applyMap) :
                            name;
                    }
                }
                else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);
                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;
                    url = context.nameToUrl(normalizedName);
                }
            }
            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                '_unnormalized' + (unnormalizedCounter += 1) :
                '';
            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                    prefix + '!' + normalizedName :
                    normalizedName) + suffix
            };
        }
        function getModule(depMap) {
            var id = depMap.id, mod = getOwn(registry, id);
            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }
            return mod;
        }
        function on(depMap, name, fn) {
            var id = depMap.id, mod = getOwn(registry, id);
            if (hasProp(defined, id) &&
                (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            }
            else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                }
                else {
                    mod.on(name, fn);
                }
            }
        }
        function onError(err, errback) {
            var ids = err.requireModules, notified = false;
            if (errback) {
                errback(err);
            }
            else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });
                if (!notified) {
                    req.onError(err);
                }
            }
        }
        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                each(globalDefQueue, function (queueItem) {
                    var id = queueItem[0];
                    if (typeof id === 'string') {
                        context.defQueueMap[id] = true;
                    }
                    defQueue.push(queueItem);
                });
                globalDefQueue = [];
            }
        }
        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                }
                else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    }
                    else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                }
                else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };
        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }
        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;
            if (mod.error) {
                mod.emit('error', mod.error);
            }
            else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id, dep = getOwn(registry, depId);
                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        }
                        else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }
        function checkLoaded() {
            var err, usingPathFallback, waitInterval = config.waitSeconds * 1000, 
            //It is possible to disable the wait interval by using waitSeconds of 0.
            expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(), noLoads = [], reqCalls = [], stillLoading = false, needCycleCheck = true;
            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }
            inCheckLoaded = true;
            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map, modId = map.id;
                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }
                if (!map.isDefine) {
                    reqCalls.push(mod);
                }
                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        }
                        else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    }
                    else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });
            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }
            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }
            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }
            inCheckLoaded = false;
        }
        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;
            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };
        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};
                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }
                this.factory = factory;
                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                }
                else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }
                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);
                this.errback = errback;
                //Indicate this module has be initialized
                this.inited = true;
                this.ignore = options.ignore;
                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                }
                else {
                    this.check();
                }
            },
            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },
            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;
                context.startTime = (new Date()).getTime();
                var map = this.map;
                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                }
                else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },
            load: function () {
                var url = this.map.url;
                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },
            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }
                var err, cjsModule, id = this.map.id, depExports = this.depExports, exports = this.exports, factory = this.factory;
                if (!this.inited) {
                    // Only fetch if not already in the defQueue.
                    if (!hasProp(context.defQueueMap, id)) {
                        this.fetch();
                    }
                }
                else if (this.error) {
                    this.emit('error', this.error);
                }
                else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;
                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                }
                                catch (e) {
                                    err = e;
                                }
                            }
                            else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }
                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                }
                                else if (this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }
                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }
                        }
                        else {
                            //Just a literal value
                            exports = factory;
                        }
                        this.exports = exports;
                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;
                            if (req.onResourceLoad) {
                                var resLoadMaps = [];
                                each(this.depMaps, function (depMap) {
                                    resLoadMaps.push(depMap.normalizedMap || depMap);
                                });
                                req.onResourceLoad(context, this.map, resLoadMaps);
                            }
                        }
                        //Clean up
                        cleanRegistry(id);
                        this.defined = true;
                    }
                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;
                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }
                }
            },
            callPlugin: function () {
                var map = this.map, id = map.id, 
                //Map already normalized the prefix.
                pluginMap = makeModuleMap(map.prefix);
                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);
                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod, bundleId = getOwn(bundlesMap, this.map.id), name = this.map.name, parentName = this.map.parentMap ? this.map.parentMap.name : null, localRequire = context.makeRequire(map.parentMap, {
                        enableBuildCallback: true
                    });
                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }
                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name, this.map.parentMap, true);
                        on(normalizedMap, 'defined', bind(this, function (value) {
                            this.map.normalizedMap = normalizedMap;
                            this.init([], function () { return value; }, null, {
                                enabled: true,
                                ignore: true
                            });
                        }));
                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);
                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }
                        return;
                    }
                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }
                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });
                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];
                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });
                        onError(err);
                    });
                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name, moduleMap = makeModuleMap(moduleName), hasInteractive = useInteractive;
                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }
                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }
                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);
                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }
                        try {
                            req.exec(text);
                        }
                        catch (e) {
                            return onError(makeError('fromtexteval', 'fromText eval for ' + id +
                                ' failed: ' + e, e, [id]));
                        }
                        if (hasInteractive) {
                            useInteractive = true;
                        }
                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);
                        //Support anonymous modules.
                        context.completeLoad(moduleName);
                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });
                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));
                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },
            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;
                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;
                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;
                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap, (this.map.isDefine ? this.map : this.map.parentMap), false, !this.skipMap);
                        this.depMaps[i] = depMap;
                        handler = getOwn(handlers, depMap.id);
                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }
                        this.depCount += 1;
                        on(depMap, 'defined', bind(this, function (depExports) {
                            if (this.undefed) {
                                return;
                            }
                            this.defineDep(i, depExports);
                            this.check();
                        }));
                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                        else if (this.events.error) {
                            // No direct errback on this module, but something
                            // else is listening for errors, so be sure to
                            // propagate the error correctly.
                            on(depMap, 'error', bind(this, function (err) {
                                this.emit('error', err);
                            }));
                        }
                    }
                    id = depMap.id;
                    mod = registry[id];
                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));
                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));
                this.enabling = false;
                this.check();
            },
            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },
            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };
        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }
        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            }
            else {
                node.removeEventListener(name, func, false);
            }
        }
        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;
            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');
            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }
        function intakeDefines() {
            var args;
            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();
            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' +
                        args[args.length - 1]));
                }
                else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
            context.defQueueMap = {};
        }
        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            defQueueMap: {},
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,
            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }
                // Convert old style urlArgs string to a function.
                if (typeof cfg.urlArgs === 'string') {
                    var urlArgs = cfg.urlArgs;
                    cfg.urlArgs = function (id, url) {
                        return (url.indexOf('?') === -1 ? '?' : '&') + urlArgs;
                    };
                }
                //Save off the paths since they require special processing,
                //they are additive.
                var shim = config.shim, objs = {
                    paths: true,
                    bundles: true,
                    config: true,
                    map: true
                };
                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    }
                    else {
                        config[prop] = value;
                    }
                });
                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }
                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }
                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;
                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }
                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                            .replace(currDirRegExp, '')
                            .replace(jsSuffixRegExp, '');
                    });
                }
                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id, null, true);
                    }
                });
                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },
            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },
            makeRequire: function (relMap, options) {
                options = options || {};
                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;
                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }
                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }
                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }
                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }
                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;
                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                id +
                                '" has not been loaded yet for context: ' +
                                contextName +
                                (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }
                    //Grab defines waiting in the global queue.
                    intakeDefines();
                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();
                        requireMod = getModule(makeModuleMap(null, relMap));
                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;
                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });
                        checkLoaded();
                    });
                    return localRequire;
                }
                mixin(localRequire, {
                    isBrowser: isBrowser,
                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext, index = moduleNamePlusExt.lastIndexOf('.'), segment = moduleNamePlusExt.split('/')[0], isRelative = segment === '.' || segment === '..';
                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }
                        return context.nameToUrl(normalize(moduleNamePlusExt, relMap && relMap.id, true), ext, true);
                    },
                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },
                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });
                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();
                        var map = makeModuleMap(id, relMap, true), mod = getOwn(registry, id);
                        mod.undefed = true;
                        removeScript(id);
                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];
                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function (args, i) {
                            if (args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });
                        delete context.defQueueMap[id];
                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }
                            cleanRegistry(id);
                        }
                    };
                }
                return localRequire;
            },
            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },
            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod, shim = getOwn(config.shim, moduleName) || {}, shExports = shim.exports;
                takeGlobalQueue();
                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    }
                    else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }
                    callGetModule(args);
                }
                context.defQueueMap = {};
                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);
                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        }
                        else {
                            return onError(makeError('nodefine', 'No define call for ' + moduleName, null, [moduleName]));
                        }
                    }
                    else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }
                checkLoaded();
            },
            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url, parentPath, bundleId, pkgMain = getOwn(config.pkgs, moduleName);
                if (pkgMain) {
                    moduleName = pkgMain;
                }
                bundleId = getOwn(bundlesMap, moduleName);
                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }
                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                }
                else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }
                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|^blob\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }
                return config.urlArgs && !/^blob\:/.test(url) ?
                    url + config.urlArgs(moduleName, url) : url;
            },
            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },
            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },
            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                    (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;
                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },
            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    var parents = [];
                    eachProp(registry, function (value, key) {
                        if (key.indexOf('_@r') !== 0) {
                            each(value.depMaps, function (depMap) {
                                if (depMap.id === data.id) {
                                    parents.push(key);
                                    return true;
                                }
                            });
                        }
                    });
                    return onError(makeError('scripterror', 'Script error for "' + data.id +
                        (parents.length ?
                            '", needed by: ' + parents.join(', ') :
                            '"'), evt, [data.id]));
                }
            }
        };
        context.require = context.makeRequire();
        return context;
    }
    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {
        //Find the right context, use default
        var context, config, contextName = defContextName;
        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            }
            else {
                deps = [];
            }
        }
        if (config && config.context) {
            contextName = config.context;
        }
        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }
        if (config) {
            context.configure(config);
        }
        return context.require(deps, callback, errback);
    };
    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };
    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };
    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }
    req.version = version;
    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };
    //Create default context.
    req({});
    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });
    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }
    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;
    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
            document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
            document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };
    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {}, node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);
            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);
            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                //Check if node.attachEvent is artificially added by custom script or
                //natively supported by browser
                //read https://github.com/requirejs/requirejs/issues/187
                //if we can NOT find [native code] then it must NOT natively supported.
                //in IE8, node.attachEvent does not have toString()
                //Note the test for "[native code" with no closing brace, see:
                //https://github.com/requirejs/requirejs/issues/273
                !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;
                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            }
            else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;
            //Calling onNodeCreated after all properties on the node have been
            //set, but before it is placed in the DOM.
            if (config.onNodeCreated) {
                config.onNodeCreated(node, config, moduleName, url);
            }
            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            }
            else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;
            return node;
        }
        else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation is that a build has been done so
                //that only one script needs to be loaded anyway. This may need
                //to be reevaluated if other use cases become common.
                // Post a task to the event loop to work around a bug in WebKit
                // where the worker gets garbage-collected after calling
                // importScripts(): https://webkit.org/b/153317
                setTimeout(function () { }, 0);
                importScripts(url);
                //Account for anonymous modules
                context.completeLoad(moduleName);
            }
            catch (e) {
                context.onError(makeError('importscripts', 'importScripts failed for ' +
                    moduleName + ' at ' + url, e, [moduleName]));
            }
        }
    };
    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }
        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }
    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }
            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;
                //Set final baseUrl if there is not already an explicit one,
                //but only do so if the data-main value is not a loader plugin
                //module ID.
                if (!cfg.baseUrl && mainScript.indexOf('!') === -1) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/') + '/' : './';
                    cfg.baseUrl = subPath;
                }
                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');
                //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }
                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];
                return true;
            }
        });
    }
    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;
        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }
        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }
        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, commentReplace)
                    .replace(cjsRequireRegExp, function (match, dep) {
                    deps.push(dep);
                });
                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }
        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }
        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        if (context) {
            context.defQueue.push([name, deps, callback]);
            context.defQueueMap[name] = true;
        }
        else {
            globalDefQueue.push([name, deps, callback]);
        }
    };
    define.amd = {
        jQuery: true
    };
    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };
    //Set up with config info.
    req(cfg);
}(this, (typeof setTimeout === 'undefined' ? undefined : setTimeout)));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL29iai9SZWxlYXNlL25ldGNvcmVhcHAyLjEvUHViVG1wL091dC93d3dyb290L2xpYi9yZXF1aXJlLmpzL3JlcXVpcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBQ0gsdUVBQXVFO0FBQ3ZFLDJFQUEyRTtBQUMzRSxtREFBbUQ7QUFDbkQseUVBQXlFO0FBRXpFLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7QUFDL0IsQ0FBQyxVQUFVLE1BQU0sRUFBRSxVQUFVO0lBQ3pCLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQ3hDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQzdELE9BQU8sR0FBRyxPQUFPLEVBQ2pCLGFBQWEsR0FBRyx1Q0FBdUMsRUFDdkQsZ0JBQWdCLEdBQUcsZ0RBQWdELEVBQ25FLGNBQWMsR0FBRyxPQUFPLEVBQ3hCLGFBQWEsR0FBRyxPQUFPLEVBQ3ZCLEVBQUUsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUNyQixPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFDckIsTUFBTSxHQUFHLEVBQUUsQ0FBQyxjQUFjLEVBQzFCLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFDcEcsV0FBVyxHQUFHLENBQUMsU0FBUyxJQUFJLE9BQU8sYUFBYSxLQUFLLFdBQVc7SUFDaEUsa0VBQWtFO0lBQ2xFLDJEQUEyRDtJQUMzRCxpRUFBaUU7SUFDakUsMENBQTBDO0lBQzFDLFdBQVcsR0FBRyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxlQUFlLENBQUMsQ0FB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bEUsZ0VBQWdFO1FBQ2hFLGtFQUFrRTtRQUNsRSxtRUFBbUU7UUFDbkUsZ0NBQWdDO1FBQ2hDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDcEM7YUFBTTtZQUNILGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsR0FBRyxHQUFHO1FBQ1QsTUFBTSxFQUFFLElBQUk7S0FDZixDQUFDO0lBRUY7Ozs7O09BS0c7SUFDSCxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSTtRQUNyQixzQkFBc0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFDO0lBRUYsMEJBQTBCO0lBQzFCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNiLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLFVBQVUsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIHZpbTogZXQ6dHM9NDpzdz00OnN0cz00XG4gKiBAbGljZW5zZSBSZXF1aXJlSlMgMi4zLjYgQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMuXG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSwgaHR0cHM6Ly9naXRodWIuY29tL3JlcXVpcmVqcy9yZXF1aXJlanMvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG4vL05vdCB1c2luZyBzdHJpY3Q6IHVuZXZlbiBzdHJpY3Qgc3VwcG9ydCBpbiBicm93c2VycywgIzM5MiwgYW5kIGNhdXNlc1xuLy9wcm9ibGVtcyB3aXRoIHJlcXVpcmVqcy5leGVjKCkvdHJhbnNwaWxlciBwbHVnaW5zIHRoYXQgbWF5IG5vdCBiZSBzdHJpY3QuXG4vKmpzbGludCByZWdleHA6IHRydWUsIG5vbWVuOiB0cnVlLCBzbG9wcHk6IHRydWUgKi9cbi8qZ2xvYmFsIHdpbmRvdywgbmF2aWdhdG9yLCBkb2N1bWVudCwgaW1wb3J0U2NyaXB0cywgc2V0VGltZW91dCwgb3BlcmEgKi9cblxudmFyIHJlcXVpcmVqcywgcmVxdWlyZSwgZGVmaW5lO1xuKGZ1bmN0aW9uIChnbG9iYWwsIHNldFRpbWVvdXQpIHtcbiAgICB2YXIgcmVxLCBzLCBoZWFkLCBiYXNlRWxlbWVudCwgZGF0YU1haW4sIHNyYyxcbiAgICAgICAgaW50ZXJhY3RpdmVTY3JpcHQsIGN1cnJlbnRseUFkZGluZ1NjcmlwdCwgbWFpblNjcmlwdCwgc3ViUGF0aCxcbiAgICAgICAgdmVyc2lvbiA9ICcyLjMuNicsXG4gICAgICAgIGNvbW1lbnRSZWdFeHAgPSAvXFwvXFwqW1xcc1xcU10qP1xcKlxcL3woW146XCInPV18XilcXC9cXC8uKiQvbWcsXG4gICAgICAgIGNqc1JlcXVpcmVSZWdFeHAgPSAvW14uXVxccypyZXF1aXJlXFxzKlxcKFxccypbXCInXShbXidcIlxcc10rKVtcIiddXFxzKlxcKS9nLFxuICAgICAgICBqc1N1ZmZpeFJlZ0V4cCA9IC9cXC5qcyQvLFxuICAgICAgICBjdXJyRGlyUmVnRXhwID0gL15cXC5cXC8vLFxuICAgICAgICBvcCA9IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICAgIG9zdHJpbmcgPSBvcC50b1N0cmluZyxcbiAgICAgICAgaGFzT3duID0gb3AuaGFzT3duUHJvcGVydHksXG4gICAgICAgIGlzQnJvd3NlciA9ICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCksXG4gICAgICAgIGlzV2ViV29ya2VyID0gIWlzQnJvd3NlciAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgIC8vUFMzIGluZGljYXRlcyBsb2FkZWQgYW5kIGNvbXBsZXRlLCBidXQgbmVlZCB0byB3YWl0IGZvciBjb21wbGV0ZVxuICAgICAgICAvL3NwZWNpZmljYWxseS4gU2VxdWVuY2UgaXMgJ2xvYWRpbmcnLCAnbG9hZGVkJywgZXhlY3V0aW9uLFxuICAgICAgICAvLyB0aGVuICdjb21wbGV0ZScuIFRoZSBVQSBjaGVjayBpcyB1bmZvcnR1bmF0ZSwgYnV0IG5vdCBzdXJlIGhvd1xuICAgICAgICAvL3RvIGZlYXR1cmUgdGVzdCB3L28gY2F1c2luZyBwZXJmIGlzc3Vlcy5cbiAgICAgICAgcmVhZHlSZWdFeHAgPSBpc0Jyb3dzZXIgJiYgbmF2aWdhdG9yLnBsYXRmb3JtID09PSAnUExBWVNUQVRJT04gMycgP1xuICAgICAgICAgICAgICAgICAgICAgIC9eY29tcGxldGUkLyA6IC9eKGNvbXBsZXRlfGxvYWRlZCkkLyxcbiAgICAgICAgZGVmQ29udGV4dE5hbWUgPSAnXycsXG4gICAgICAgIC8vT2ggdGhlIHRyYWdlZHksIGRldGVjdGluZyBvcGVyYS4gU2VlIHRoZSB1c2FnZSBvZiBpc09wZXJhIGZvciByZWFzb24uXG4gICAgICAgIGlzT3BlcmEgPSB0eXBlb2Ygb3BlcmEgIT09ICd1bmRlZmluZWQnICYmIG9wZXJhLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9wZXJhXScsXG4gICAgICAgIGNvbnRleHRzID0ge30sXG4gICAgICAgIGNmZyA9IHt9LFxuICAgICAgICBnbG9iYWxEZWZRdWV1ZSA9IFtdLFxuICAgICAgICB1c2VJbnRlcmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgLy9Db3VsZCBtYXRjaCBzb21ldGhpbmcgbGlrZSAnKS8vY29tbWVudCcsIGRvIG5vdCBsb3NlIHRoZSBwcmVmaXggdG8gY29tbWVudC5cbiAgICBmdW5jdGlvbiBjb21tZW50UmVwbGFjZShtYXRjaCwgc2luZ2xlUHJlZml4KSB7XG4gICAgICAgIHJldHVybiBzaW5nbGVQcmVmaXggfHwgJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbihpdCkge1xuICAgICAgICByZXR1cm4gb3N0cmluZy5jYWxsKGl0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KGl0KSB7XG4gICAgICAgIHJldHVybiBvc3RyaW5nLmNhbGwoaXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgaXRlcmF0aW5nIG92ZXIgYW4gYXJyYXkuIElmIHRoZSBmdW5jIHJldHVybnNcbiAgICAgKiBhIHRydWUgdmFsdWUsIGl0IHdpbGwgYnJlYWsgb3V0IG9mIHRoZSBsb29wLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVhY2goYXJ5LCBmdW5jKSB7XG4gICAgICAgIGlmIChhcnkpIHtcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhcnlbaV0gJiYgZnVuYyhhcnlbaV0sIGksIGFyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIGZvciBpdGVyYXRpbmcgb3ZlciBhbiBhcnJheSBiYWNrd2FyZHMuIElmIHRoZSBmdW5jXG4gICAgICogcmV0dXJucyBhIHRydWUgdmFsdWUsIGl0IHdpbGwgYnJlYWsgb3V0IG9mIHRoZSBsb29wLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVhY2hSZXZlcnNlKGFyeSwgZnVuYykge1xuICAgICAgICBpZiAoYXJ5KSB7XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGZvciAoaSA9IGFyeS5sZW5ndGggLSAxOyBpID4gLTE7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhcnlbaV0gJiYgZnVuYyhhcnlbaV0sIGksIGFyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzUHJvcChvYmosIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIGhhc093bi5jYWxsKG9iaiwgcHJvcCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T3duKG9iaiwgcHJvcCkge1xuICAgICAgICByZXR1cm4gaGFzUHJvcChvYmosIHByb3ApICYmIG9ialtwcm9wXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDeWNsZXMgb3ZlciBwcm9wZXJ0aWVzIGluIGFuIG9iamVjdCBhbmQgY2FsbHMgYSBmdW5jdGlvbiBmb3IgZWFjaFxuICAgICAqIHByb3BlcnR5IHZhbHVlLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZSwgdGhlbiB0aGVcbiAgICAgKiBpdGVyYXRpb24gaXMgc3RvcHBlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlYWNoUHJvcChvYmosIGZ1bmMpIHtcbiAgICAgICAgdmFyIHByb3A7XG4gICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChoYXNQcm9wKG9iaiwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnVuYyhvYmpbcHJvcF0sIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBmdW5jdGlvbiB0byBtaXggaW4gcHJvcGVydGllcyBmcm9tIHNvdXJjZSBpbnRvIHRhcmdldCxcbiAgICAgKiBidXQgb25seSBpZiB0YXJnZXQgZG9lcyBub3QgYWxyZWFkeSBoYXZlIGEgcHJvcGVydHkgb2YgdGhlIHNhbWUgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSwgZm9yY2UsIGRlZXBTdHJpbmdNaXhpbikge1xuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICBlYWNoUHJvcChzb3VyY2UsIGZ1bmN0aW9uICh2YWx1ZSwgcHJvcCkge1xuICAgICAgICAgICAgICAgIGlmIChmb3JjZSB8fCAhaGFzUHJvcCh0YXJnZXQsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWVwU3RyaW5nTWl4aW4gJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIWlzQXJyYXkodmFsdWUpICYmICFpc0Z1bmN0aW9uKHZhbHVlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgISh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRbcHJvcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG1peGluKHRhcmdldFtwcm9wXSwgdmFsdWUsIGZvcmNlLCBkZWVwU3RyaW5nTWl4aW4pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIC8vU2ltaWxhciB0byBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCwgYnV0IHRoZSAndGhpcycgb2JqZWN0IGlzIHNwZWNpZmllZFxuICAgIC8vZmlyc3QsIHNpbmNlIGl0IGlzIGVhc2llciB0byByZWFkL2ZpZ3VyZSBvdXQgd2hhdCAndGhpcycgd2lsbCBiZS5cbiAgICBmdW5jdGlvbiBiaW5kKG9iaiwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NyaXB0cygpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0T25FcnJvcihlcnIpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIC8vQWxsb3cgZ2V0dGluZyBhIGdsb2JhbCB0aGF0IGlzIGV4cHJlc3NlZCBpblxuICAgIC8vZG90IG5vdGF0aW9uLCBsaWtlICdhLmIuYycuXG4gICAgZnVuY3Rpb24gZ2V0R2xvYmFsKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZyA9IGdsb2JhbDtcbiAgICAgICAgZWFjaCh2YWx1ZS5zcGxpdCgnLicpLCBmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgICAgZyA9IGdbcGFydF07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGFuIGVycm9yIHdpdGggYSBwb2ludGVyIHRvIGFuIFVSTCB3aXRoIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIHRoZSBlcnJvciBJRCB0aGF0IG1hcHMgdG8gYW4gSUQgb24gYSB3ZWIgcGFnZS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBodW1hbiByZWFkYWJsZSBlcnJvci5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBbZXJyXSB0aGUgb3JpZ2luYWwgZXJyb3IsIGlmIHRoZXJlIGlzIG9uZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtFcnJvcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYWtlRXJyb3IoaWQsIG1zZywgZXJyLCByZXF1aXJlTW9kdWxlcykge1xuICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihtc2cgKyAnXFxuaHR0cHM6Ly9yZXF1aXJlanMub3JnL2RvY3MvZXJyb3JzLmh0bWwjJyArIGlkKTtcbiAgICAgICAgZS5yZXF1aXJlVHlwZSA9IGlkO1xuICAgICAgICBlLnJlcXVpcmVNb2R1bGVzID0gcmVxdWlyZU1vZHVsZXM7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGUub3JpZ2luYWxFcnJvciA9IGVycjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9JZiBhIGRlZmluZSBpcyBhbHJlYWR5IGluIHBsYXkgdmlhIGFub3RoZXIgQU1EIGxvYWRlcixcbiAgICAgICAgLy9kbyBub3Qgb3ZlcndyaXRlLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZXF1aXJlanMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHJlcXVpcmVqcykpIHtcbiAgICAgICAgICAgIC8vRG8gbm90IG92ZXJ3cml0ZSBhbiBleGlzdGluZyByZXF1aXJlanMgaW5zdGFuY2UuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2ZnID0gcmVxdWlyZWpzO1xuICAgICAgICByZXF1aXJlanMgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy9BbGxvdyBmb3IgYSByZXF1aXJlIGNvbmZpZyBvYmplY3RcbiAgICBpZiAodHlwZW9mIHJlcXVpcmUgIT09ICd1bmRlZmluZWQnICYmICFpc0Z1bmN0aW9uKHJlcXVpcmUpKSB7XG4gICAgICAgIC8vYXNzdW1lIGl0IGlzIGEgY29uZmlnIG9iamVjdC5cbiAgICAgICAgY2ZnID0gcmVxdWlyZTtcbiAgICAgICAgcmVxdWlyZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXdDb250ZXh0KGNvbnRleHROYW1lKSB7XG4gICAgICAgIHZhciBpbkNoZWNrTG9hZGVkLCBNb2R1bGUsIGNvbnRleHQsIGhhbmRsZXJzLFxuICAgICAgICAgICAgY2hlY2tMb2FkZWRUaW1lb3V0SWQsXG4gICAgICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgICAgICAgLy9EZWZhdWx0cy4gRG8gbm90IHNldCBhIGRlZmF1bHQgZm9yIG1hcFxuICAgICAgICAgICAgICAgIC8vY29uZmlnIHRvIHNwZWVkIHVwIG5vcm1hbGl6ZSgpLCB3aGljaFxuICAgICAgICAgICAgICAgIC8vd2lsbCBydW4gZmFzdGVyIGlmIHRoZXJlIGlzIG5vIGRlZmF1bHQuXG4gICAgICAgICAgICAgICAgd2FpdFNlY29uZHM6IDcsXG4gICAgICAgICAgICAgICAgYmFzZVVybDogJy4vJyxcbiAgICAgICAgICAgICAgICBwYXRoczoge30sXG4gICAgICAgICAgICAgICAgYnVuZGxlczoge30sXG4gICAgICAgICAgICAgICAgcGtnczoge30sXG4gICAgICAgICAgICAgICAgc2hpbToge30sXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZ2lzdHJ5ID0ge30sXG4gICAgICAgICAgICAvL3JlZ2lzdHJ5IG9mIGp1c3QgZW5hYmxlZCBtb2R1bGVzLCB0byBzcGVlZFxuICAgICAgICAgICAgLy9jeWNsZSBicmVha2luZyBjb2RlIHdoZW4gbG90cyBvZiBtb2R1bGVzXG4gICAgICAgICAgICAvL2FyZSByZWdpc3RlcmVkLCBidXQgbm90IGFjdGl2YXRlZC5cbiAgICAgICAgICAgIGVuYWJsZWRSZWdpc3RyeSA9IHt9LFxuICAgICAgICAgICAgdW5kZWZFdmVudHMgPSB7fSxcbiAgICAgICAgICAgIGRlZlF1ZXVlID0gW10sXG4gICAgICAgICAgICBkZWZpbmVkID0ge30sXG4gICAgICAgICAgICB1cmxGZXRjaGVkID0ge30sXG4gICAgICAgICAgICBidW5kbGVzTWFwID0ge30sXG4gICAgICAgICAgICByZXF1aXJlQ291bnRlciA9IDEsXG4gICAgICAgICAgICB1bm5vcm1hbGl6ZWRDb3VudGVyID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVHJpbXMgdGhlIC4gYW5kIC4uIGZyb20gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cbiAgICAgICAgICogSXQgd2lsbCBrZWVwIGEgbGVhZGluZyBwYXRoIHNlZ21lbnQgaWYgYSAuLiB3aWxsIGJlY29tZVxuICAgICAgICAgKiB0aGUgZmlyc3QgcGF0aCBzZWdtZW50LCB0byBoZWxwIHdpdGggbW9kdWxlIG5hbWUgbG9va3VwcyxcbiAgICAgICAgICogd2hpY2ggYWN0IGxpa2UgcGF0aHMsIGJ1dCBjYW4gYmUgcmVtYXBwZWQuIEJ1dCB0aGUgZW5kIHJlc3VsdCxcbiAgICAgICAgICogYWxsIHBhdGhzIHRoYXQgdXNlIHRoaXMgZnVuY3Rpb24gc2hvdWxkIGxvb2sgbm9ybWFsaXplZC5cbiAgICAgICAgICogTk9URTogdGhpcyBtZXRob2QgTU9ESUZJRVMgdGhlIGlucHV0IGFycmF5LlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnkgdGhlIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0cmltRG90cyhhcnkpIHtcbiAgICAgICAgICAgIHZhciBpLCBwYXJ0O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBhcnQgPSBhcnlbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICBhcnkuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBpIC09IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGF0IHRoZSBzdGFydCwgb3IgcHJldmlvdXMgdmFsdWUgaXMgc3RpbGwgLi4sXG4gICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgdGhlbSBzbyB0aGF0IHdoZW4gY29udmVydGVkIHRvIGEgcGF0aCBpdCBtYXlcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RpbGwgd29yayB3aGVuIGNvbnZlcnRlZCB0byBhIHBhdGgsIGV2ZW4gdGhvdWdoXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGFuIElEIGl0IGlzIGxlc3MgdGhhbiBpZGVhbC4gSW4gbGFyZ2VyIHBvaW50XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbGVhc2VzLCBtYXkgYmUgYmV0dGVyIHRvIGp1c3Qga2ljayBvdXQgYW4gZXJyb3IuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IChpID09PSAxICYmIGFyeVsyXSA9PT0gJy4uJykgfHwgYXJ5W2kgLSAxXSA9PT0gJy4uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyeS5zcGxpY2UoaSAtIDEsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSAtPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGEgcmVsYXRpdmUgbW9kdWxlIG5hbWUsIGxpa2UgLi9zb21ldGhpbmcsIG5vcm1hbGl6ZSBpdCB0b1xuICAgICAgICAgKiBhIHJlYWwgbmFtZSB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gYSBwYXRoLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgcmVsYXRpdmUgbmFtZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZU5hbWUgYSByZWFsIG5hbWUgdGhhdCB0aGUgbmFtZSBhcmcgaXMgcmVsYXRpdmVcbiAgICAgICAgICogdG8uXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwbHlNYXAgYXBwbHkgdGhlIG1hcCBjb25maWcgdG8gdGhlIHZhbHVlLiBTaG91bGRcbiAgICAgICAgICogb25seSBiZSBkb25lIGlmIHRoaXMgbm9ybWFsaXphdGlvbiBpcyBmb3IgYSBkZXBlbmRlbmN5IElELlxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBub3JtYWxpemVkIG5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZShuYW1lLCBiYXNlTmFtZSwgYXBwbHlNYXApIHtcbiAgICAgICAgICAgIHZhciBwa2dNYWluLCBtYXBWYWx1ZSwgbmFtZVBhcnRzLCBpLCBqLCBuYW1lU2VnbWVudCwgbGFzdEluZGV4LFxuICAgICAgICAgICAgICAgIGZvdW5kTWFwLCBmb3VuZEksIGZvdW5kU3Rhck1hcCwgc3RhckksIG5vcm1hbGl6ZWRCYXNlUGFydHMsXG4gICAgICAgICAgICAgICAgYmFzZVBhcnRzID0gKGJhc2VOYW1lICYmIGJhc2VOYW1lLnNwbGl0KCcvJykpLFxuICAgICAgICAgICAgICAgIG1hcCA9IGNvbmZpZy5tYXAsXG4gICAgICAgICAgICAgICAgc3Rhck1hcCA9IG1hcCAmJiBtYXBbJyonXTtcblxuICAgICAgICAgICAgLy9BZGp1c3QgYW55IHJlbGF0aXZlIHBhdGhzLlxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgIGxhc3RJbmRleCA9IG5hbWUubGVuZ3RoIC0gMTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHdhbnRpbmcgbm9kZSBJRCBjb21wYXRpYmlsaXR5LCBzdHJpcCAuanMgZnJvbSBlbmRcbiAgICAgICAgICAgICAgICAvLyBvZiBJRHMuIEhhdmUgdG8gZG8gdGhpcyBoZXJlLCBhbmQgbm90IGluIG5hbWVUb1VybFxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2Ugbm9kZSBhbGxvd3MgZWl0aGVyIC5qcyBvciBub24gLmpzIHRvIG1hcFxuICAgICAgICAgICAgICAgIC8vIHRvIHNhbWUgZmlsZS5cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLm5vZGVJZENvbXBhdCAmJiBqc1N1ZmZpeFJlZ0V4cC50ZXN0KG5hbWVbbGFzdEluZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZVtsYXN0SW5kZXhdID0gbmFtZVtsYXN0SW5kZXhdLnJlcGxhY2UoanNTdWZmaXhSZWdFeHAsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTdGFydHMgd2l0aCBhICcuJyBzbyBuZWVkIHRoZSBiYXNlTmFtZVxuICAgICAgICAgICAgICAgIGlmIChuYW1lWzBdLmNoYXJBdCgwKSA9PT0gJy4nICYmIGJhc2VQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAvL0NvbnZlcnQgYmFzZU5hbWUgdG8gYXJyYXksIGFuZCBsb3Agb2ZmIHRoZSBsYXN0IHBhcnQsXG4gICAgICAgICAgICAgICAgICAgIC8vc28gdGhhdCAuIG1hdGNoZXMgdGhhdCAnZGlyZWN0b3J5JyBhbmQgbm90IG5hbWUgb2YgdGhlIGJhc2VOYW1lJ3NcbiAgICAgICAgICAgICAgICAgICAgLy9tb2R1bGUuIEZvciBpbnN0YW5jZSwgYmFzZU5hbWUgb2YgJ29uZS90d28vdGhyZWUnLCBtYXBzIHRvXG4gICAgICAgICAgICAgICAgICAgIC8vJ29uZS90d28vdGhyZWUuanMnLCBidXQgd2Ugd2FudCB0aGUgZGlyZWN0b3J5LCAnb25lL3R3bycgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcyBub3JtYWxpemF0aW9uLlxuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkQmFzZVBhcnRzID0gYmFzZVBhcnRzLnNsaWNlKDAsIGJhc2VQYXJ0cy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZWRCYXNlUGFydHMuY29uY2F0KG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRyaW1Eb3RzKG5hbWUpO1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLmpvaW4oJy8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BcHBseSBtYXAgY29uZmlnIGlmIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIGlmIChhcHBseU1hcCAmJiBtYXAgJiYgKGJhc2VQYXJ0cyB8fCBzdGFyTWFwKSkge1xuICAgICAgICAgICAgICAgIG5hbWVQYXJ0cyA9IG5hbWUuc3BsaXQoJy8nKTtcblxuICAgICAgICAgICAgICAgIG91dGVyTG9vcDogZm9yIChpID0gbmFtZVBhcnRzLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBuYW1lU2VnbWVudCA9IG5hbWVQYXJ0cy5zbGljZSgwLCBpKS5qb2luKCcvJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9GaW5kIHRoZSBsb25nZXN0IGJhc2VOYW1lIHNlZ21lbnQgbWF0Y2ggaW4gdGhlIGNvbmZpZy5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU28sIGRvIGpvaW5zIG9uIHRoZSBiaWdnZXN0IHRvIHNtYWxsZXN0IGxlbmd0aHMgb2YgYmFzZVBhcnRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmFzZVBhcnRzLmxlbmd0aDsgaiA+IDA7IGogLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFZhbHVlID0gZ2V0T3duKG1hcCwgYmFzZVBhcnRzLnNsaWNlKDAsIGopLmpvaW4oJy8nKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2Jhc2VOYW1lIHNlZ21lbnQgaGFzIGNvbmZpZywgZmluZCBpZiBpdCBoYXMgb25lIGZvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBuYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IGdldE93bihtYXBWYWx1ZSwgbmFtZVNlZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTWF0Y2gsIHVwZGF0ZSBuYW1lIHRvIHRoZSBuZXcgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IG1hcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyTG9vcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgZm9yIGEgc3RhciBtYXAgbWF0Y2gsIGJ1dCBqdXN0IGhvbGQgb24gdG8gaXQsXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgdGhlcmUgaXMgYSBzaG9ydGVyIHNlZ21lbnQgbWF0Y2ggbGF0ZXIgaW4gYSBtYXRjaGluZ1xuICAgICAgICAgICAgICAgICAgICAvL2NvbmZpZywgdGhlbiBmYXZvciBvdmVyIHRoaXMgc3RhciBtYXAuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmRTdGFyTWFwICYmIHN0YXJNYXAgJiYgZ2V0T3duKHN0YXJNYXAsIG5hbWVTZWdtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRTdGFyTWFwID0gZ2V0T3duKHN0YXJNYXAsIG5hbWVTZWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJJID0gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZm91bmRNYXAgJiYgZm91bmRTdGFyTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kTWFwID0gZm91bmRTdGFyTWFwO1xuICAgICAgICAgICAgICAgICAgICBmb3VuZEkgPSBzdGFySTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZm91bmRNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZVBhcnRzLnNwbGljZSgwLCBmb3VuZEksIGZvdW5kTWFwKTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5hbWVQYXJ0cy5qb2luKCcvJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgbmFtZSBwb2ludHMgdG8gYSBwYWNrYWdlJ3MgbmFtZSwgdXNlXG4gICAgICAgICAgICAvLyB0aGUgcGFja2FnZSBtYWluIGluc3RlYWQuXG4gICAgICAgICAgICBwa2dNYWluID0gZ2V0T3duKGNvbmZpZy5wa2dzLCBuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHBrZ01haW4gPyBwa2dNYWluIDogbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVNjcmlwdChuYW1lKSB7XG4gICAgICAgICAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgZWFjaChzY3JpcHRzKCksIGZ1bmN0aW9uIChzY3JpcHROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXF1aXJlbW9kdWxlJykgPT09IG5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXF1aXJlY29udGV4dCcpID09PSBjb250ZXh0LmNvbnRleHROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFzUGF0aEZhbGxiYWNrKGlkKSB7XG4gICAgICAgICAgICB2YXIgcGF0aENvbmZpZyA9IGdldE93bihjb25maWcucGF0aHMsIGlkKTtcbiAgICAgICAgICAgIGlmIChwYXRoQ29uZmlnICYmIGlzQXJyYXkocGF0aENvbmZpZykgJiYgcGF0aENvbmZpZy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgLy9Qb3Agb2ZmIHRoZSBmaXJzdCBhcnJheSB2YWx1ZSwgc2luY2UgaXQgZmFpbGVkLCBhbmRcbiAgICAgICAgICAgICAgICAvL3JldHJ5XG4gICAgICAgICAgICAgICAgcGF0aENvbmZpZy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVxdWlyZS51bmRlZihpZCk7XG5cbiAgICAgICAgICAgICAgICAvL0N1c3RvbSByZXF1aXJlIHRoYXQgZG9lcyBub3QgZG8gbWFwIHRyYW5zbGF0aW9uLCBzaW5jZVxuICAgICAgICAgICAgICAgIC8vSUQgaXMgXCJhYnNvbHV0ZVwiLCBhbHJlYWR5IG1hcHBlZC9yZXNvbHZlZC5cbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1ha2VSZXF1aXJlKG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgc2tpcE1hcDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pKFtpZF0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1R1cm5zIGEgcGx1Z2luIXJlc291cmNlIHRvIFtwbHVnaW4sIHJlc291cmNlXVxuICAgICAgICAvL3dpdGggdGhlIHBsdWdpbiBiZWluZyB1bmRlZmluZWQgaWYgdGhlIG5hbWVcbiAgICAgICAgLy9kaWQgbm90IGhhdmUgYSBwbHVnaW4gcHJlZml4LlxuICAgICAgICBmdW5jdGlvbiBzcGxpdFByZWZpeChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgcHJlZml4LFxuICAgICAgICAgICAgICAgIGluZGV4ID0gbmFtZSA/IG5hbWUuaW5kZXhPZignIScpIDogLTE7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoaW5kZXggKyAxLCBuYW1lLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW3ByZWZpeCwgbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG1vZHVsZSBtYXBwaW5nIHRoYXQgaW5jbHVkZXMgcGx1Z2luIHByZWZpeCwgbW9kdWxlXG4gICAgICAgICAqIG5hbWUsIGFuZCBwYXRoLiBJZiBwYXJlbnRNb2R1bGVNYXAgaXMgcHJvdmlkZWQgaXQgd2lsbFxuICAgICAgICAgKiBhbHNvIG5vcm1hbGl6ZSB0aGUgbmFtZSB2aWEgcmVxdWlyZS5ub3JtYWxpemUoKVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgbW9kdWxlIG5hbWVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtwYXJlbnRNb2R1bGVNYXBdIHBhcmVudCBtb2R1bGUgbWFwXG4gICAgICAgICAqIGZvciB0aGUgbW9kdWxlIG5hbWUsIHVzZWQgdG8gcmVzb2x2ZSByZWxhdGl2ZSBuYW1lcy5cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc05vcm1hbGl6ZWQ6IGlzIHRoZSBJRCBhbHJlYWR5IG5vcm1hbGl6ZWQuXG4gICAgICAgICAqIFRoaXMgaXMgdHJ1ZSBpZiB0aGlzIGNhbGwgaXMgZG9uZSBmb3IgYSBkZWZpbmUoKSBtb2R1bGUgSUQuXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwbHlNYXA6IGFwcGx5IHRoZSBtYXAgY29uZmlnIHRvIHRoZSBJRC5cbiAgICAgICAgICogU2hvdWxkIG9ubHkgYmUgdHJ1ZSBpZiB0aGlzIG1hcCBpcyBmb3IgYSBkZXBlbmRlbmN5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWFrZU1vZHVsZU1hcChuYW1lLCBwYXJlbnRNb2R1bGVNYXAsIGlzTm9ybWFsaXplZCwgYXBwbHlNYXApIHtcbiAgICAgICAgICAgIHZhciB1cmwsIHBsdWdpbk1vZHVsZSwgc3VmZml4LCBuYW1lUGFydHMsXG4gICAgICAgICAgICAgICAgcHJlZml4ID0gbnVsbCxcbiAgICAgICAgICAgICAgICBwYXJlbnROYW1lID0gcGFyZW50TW9kdWxlTWFwID8gcGFyZW50TW9kdWxlTWFwLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsTmFtZSA9IG5hbWUsXG4gICAgICAgICAgICAgICAgaXNEZWZpbmUgPSB0cnVlLFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gJyc7XG5cbiAgICAgICAgICAgIC8vSWYgbm8gbmFtZSwgdGhlbiBpdCBtZWFucyBpdCBpcyBhIHJlcXVpcmUgY2FsbCwgZ2VuZXJhdGUgYW5cbiAgICAgICAgICAgIC8vaW50ZXJuYWwgbmFtZS5cbiAgICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgICAgIGlzRGVmaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbmFtZSA9ICdfQHInICsgKHJlcXVpcmVDb3VudGVyICs9IDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYW1lUGFydHMgPSBzcGxpdFByZWZpeChuYW1lKTtcbiAgICAgICAgICAgIHByZWZpeCA9IG5hbWVQYXJ0c1swXTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lUGFydHNbMV07XG5cbiAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSBub3JtYWxpemUocHJlZml4LCBwYXJlbnROYW1lLCBhcHBseU1hcCk7XG4gICAgICAgICAgICAgICAgcGx1Z2luTW9kdWxlID0gZ2V0T3duKGRlZmluZWQsIHByZWZpeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQWNjb3VudCBmb3IgcmVsYXRpdmUgcGF0aHMgaWYgdGhlcmUgaXMgYSBiYXNlIG5hbWUuXG4gICAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTm9ybWFsaXplZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZE5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBsdWdpbk1vZHVsZSAmJiBwbHVnaW5Nb2R1bGUubm9ybWFsaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1BsdWdpbiBpcyBsb2FkZWQsIHVzZSBpdHMgbm9ybWFsaXplIG1ldGhvZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gcGx1Z2luTW9kdWxlLm5vcm1hbGl6ZShuYW1lLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmFtZSwgcGFyZW50TmFtZSwgYXBwbHlNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBuZXN0ZWQgcGx1Z2luIHJlZmVyZW5jZXMsIHRoZW4gZG8gbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm9ybWFsaXplLCBhcyBpdCB3aWxsIG5vdCBub3JtYWxpemUgY29ycmVjdGx5LiBUaGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZXMgYSByZXN0cmljdGlvbiBvbiByZXNvdXJjZUlkcywgYW5kIHRoZSBsb25nZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlcm0gc29sdXRpb24gaXMgbm90IHRvIG5vcm1hbGl6ZSB1bnRpbCBwbHVnaW5zIGFyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9hZGVkIGFuZCBhbGwgbm9ybWFsaXphdGlvbnMgdG8gYWxsb3cgZm9yIGFzeW5jXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb2FkaW5nIG9mIGEgbG9hZGVyIHBsdWdpbi4gQnV0IGZvciBub3csIGZpeGVzIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29tbW9uIHVzZXMuIERldGFpbHMgaW4gIzExMzFcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbmFtZS5pbmRleE9mKCchJykgPT09IC0xID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIGFwcGx5TWFwKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL0EgcmVndWxhciBtb2R1bGUuXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIGFwcGx5TWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAvL05vcm1hbGl6ZWQgbmFtZSBtYXkgYmUgYSBwbHVnaW4gSUQgZHVlIHRvIG1hcCBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgLy9hcHBsaWNhdGlvbiBpbiBub3JtYWxpemUuIFRoZSBtYXAgY29uZmlnIHZhbHVlcyBtdXN0XG4gICAgICAgICAgICAgICAgICAgIC8vYWxyZWFkeSBiZSBub3JtYWxpemVkLCBzbyBkbyBub3QgbmVlZCB0byByZWRvIHRoYXQgcGFydC5cbiAgICAgICAgICAgICAgICAgICAgbmFtZVBhcnRzID0gc3BsaXRQcmVmaXgobm9ybWFsaXplZE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSBuYW1lUGFydHNbMF07XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbmFtZVBhcnRzWzFdO1xuICAgICAgICAgICAgICAgICAgICBpc05vcm1hbGl6ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IGNvbnRleHQubmFtZVRvVXJsKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSWYgdGhlIGlkIGlzIGEgcGx1Z2luIGlkIHRoYXQgY2Fubm90IGJlIGRldGVybWluZWQgaWYgaXQgbmVlZHNcbiAgICAgICAgICAgIC8vbm9ybWFsaXphdGlvbiwgc3RhbXAgaXQgd2l0aCBhIHVuaXF1ZSBJRCBzbyB0d28gbWF0Y2hpbmcgcmVsYXRpdmVcbiAgICAgICAgICAgIC8vaWRzIHRoYXQgbWF5IGNvbmZsaWN0IGNhbiBiZSBzZXBhcmF0ZS5cbiAgICAgICAgICAgIHN1ZmZpeCA9IHByZWZpeCAmJiAhcGx1Z2luTW9kdWxlICYmICFpc05vcm1hbGl6ZWQgP1xuICAgICAgICAgICAgICAgICAgICAgJ191bm5vcm1hbGl6ZWQnICsgKHVubm9ybWFsaXplZENvdW50ZXIgKz0gMSkgOlxuICAgICAgICAgICAgICAgICAgICAgJyc7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgICAgICAgbmFtZTogbm9ybWFsaXplZE5hbWUsXG4gICAgICAgICAgICAgICAgcGFyZW50TWFwOiBwYXJlbnRNb2R1bGVNYXAsXG4gICAgICAgICAgICAgICAgdW5ub3JtYWxpemVkOiAhIXN1ZmZpeCxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbE5hbWU6IG9yaWdpbmFsTmFtZSxcbiAgICAgICAgICAgICAgICBpc0RlZmluZTogaXNEZWZpbmUsXG4gICAgICAgICAgICAgICAgaWQ6IChwcmVmaXggP1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ICsgJyEnICsgbm9ybWFsaXplZE5hbWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZE5hbWUpICsgc3VmZml4XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9kdWxlKGRlcE1hcCkge1xuICAgICAgICAgICAgdmFyIGlkID0gZGVwTWFwLmlkLFxuICAgICAgICAgICAgICAgIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuXG4gICAgICAgICAgICBpZiAoIW1vZCkge1xuICAgICAgICAgICAgICAgIG1vZCA9IHJlZ2lzdHJ5W2lkXSA9IG5ldyBjb250ZXh0Lk1vZHVsZShkZXBNYXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW9kO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb24oZGVwTWFwLCBuYW1lLCBmbikge1xuICAgICAgICAgICAgdmFyIGlkID0gZGVwTWFwLmlkLFxuICAgICAgICAgICAgICAgIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuXG4gICAgICAgICAgICBpZiAoaGFzUHJvcChkZWZpbmVkLCBpZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFtb2QgfHwgbW9kLmRlZmluZUVtaXRDb21wbGV0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2RlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKGRlZmluZWRbaWRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZCA9IGdldE1vZHVsZShkZXBNYXApO1xuICAgICAgICAgICAgICAgIGlmIChtb2QuZXJyb3IgJiYgbmFtZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICBmbihtb2QuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZC5vbihuYW1lLCBmbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25FcnJvcihlcnIsIGVycmJhY2spIHtcbiAgICAgICAgICAgIHZhciBpZHMgPSBlcnIucmVxdWlyZU1vZHVsZXMsXG4gICAgICAgICAgICAgICAgbm90aWZpZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGVycmJhY2spIHtcbiAgICAgICAgICAgICAgICBlcnJiYWNrKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVhY2goaWRzLCBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NldCBlcnJvciBvbiBtb2R1bGUsIHNvIGl0IHNraXBzIHRpbWVvdXQgY2hlY2tzLlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZC5ldmVudHMuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFub3RpZmllZCkge1xuICAgICAgICAgICAgICAgICAgICByZXEub25FcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gdHJhbnNmZXIgZ2xvYmFsUXVldWUgaXRlbXMgdG8gdGhpcyBjb250ZXh0J3NcbiAgICAgICAgICogZGVmUXVldWUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0YWtlR2xvYmFsUXVldWUoKSB7XG4gICAgICAgICAgICAvL1B1c2ggYWxsIHRoZSBnbG9iYWxEZWZRdWV1ZSBpdGVtcyBpbnRvIHRoZSBjb250ZXh0J3MgZGVmUXVldWVcbiAgICAgICAgICAgIGlmIChnbG9iYWxEZWZRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlYWNoKGdsb2JhbERlZlF1ZXVlLCBmdW5jdGlvbihxdWV1ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcXVldWVJdGVtWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kZWZRdWV1ZU1hcFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRlZlF1ZXVlLnB1c2gocXVldWVJdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBnbG9iYWxEZWZRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaGFuZGxlcnMgPSB7XG4gICAgICAgICAgICAncmVxdWlyZSc6IGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kLnJlcXVpcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZC5yZXF1aXJlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobW9kLnJlcXVpcmUgPSBjb250ZXh0Lm1ha2VSZXF1aXJlKG1vZC5tYXApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2V4cG9ydHMnOiBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgICAgICAgICAgbW9kLnVzaW5nRXhwb3J0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKG1vZC5tYXAuaXNEZWZpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZC5leHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGRlZmluZWRbbW9kLm1hcC5pZF0gPSBtb2QuZXhwb3J0cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG1vZC5leHBvcnRzID0gZGVmaW5lZFttb2QubWFwLmlkXSA9IHt9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnbW9kdWxlJzogZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICAgICAgICAgIGlmIChtb2QubW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb2QubW9kdWxlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobW9kLm1vZHVsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBtb2QubWFwLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJpOiBtb2QubWFwLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRPd24oY29uZmlnLmNvbmZpZywgbW9kLm1hcC5pZCkgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0czogbW9kLmV4cG9ydHMgfHwgKG1vZC5leHBvcnRzID0ge30pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBjbGVhblJlZ2lzdHJ5KGlkKSB7XG4gICAgICAgICAgICAvL0NsZWFuIHVwIG1hY2hpbmVyeSB1c2VkIGZvciB3YWl0aW5nIG1vZHVsZXMuXG4gICAgICAgICAgICBkZWxldGUgcmVnaXN0cnlbaWRdO1xuICAgICAgICAgICAgZGVsZXRlIGVuYWJsZWRSZWdpc3RyeVtpZF07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBicmVha0N5Y2xlKG1vZCwgdHJhY2VkLCBwcm9jZXNzZWQpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IG1vZC5tYXAuaWQ7XG5cbiAgICAgICAgICAgIGlmIChtb2QuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBtb2QuZW1pdCgnZXJyb3InLCBtb2QuZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFjZWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlYWNoKG1vZC5kZXBNYXBzLCBmdW5jdGlvbiAoZGVwTWFwLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXBJZCA9IGRlcE1hcC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcCA9IGdldE93bihyZWdpc3RyeSwgZGVwSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vT25seSBmb3JjZSB0aGluZ3MgdGhhdCBoYXZlIG5vdCBjb21wbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgLy9iZWluZyBkZWZpbmVkLCBzbyBzdGlsbCBpbiB0aGUgcmVnaXN0cnksXG4gICAgICAgICAgICAgICAgICAgIC8vYW5kIG9ubHkgaWYgaXQgaGFzIG5vdCBiZWVuIG1hdGNoZWQgdXBcbiAgICAgICAgICAgICAgICAgICAgLy9pbiB0aGUgbW9kdWxlIGFscmVhZHkuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXAgJiYgIW1vZC5kZXBNYXRjaGVkW2ldICYmICFwcm9jZXNzZWRbZGVwSWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2V0T3duKHRyYWNlZCwgZGVwSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmRlZmluZURlcChpLCBkZWZpbmVkW2RlcElkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kLmNoZWNrKCk7IC8vcGFzcyBmYWxzZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtDeWNsZShkZXAsIHRyYWNlZCwgcHJvY2Vzc2VkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2FkZWQoKSB7XG4gICAgICAgICAgICB2YXIgZXJyLCB1c2luZ1BhdGhGYWxsYmFjayxcbiAgICAgICAgICAgICAgICB3YWl0SW50ZXJ2YWwgPSBjb25maWcud2FpdFNlY29uZHMgKiAxMDAwLFxuICAgICAgICAgICAgICAgIC8vSXQgaXMgcG9zc2libGUgdG8gZGlzYWJsZSB0aGUgd2FpdCBpbnRlcnZhbCBieSB1c2luZyB3YWl0U2Vjb25kcyBvZiAwLlxuICAgICAgICAgICAgICAgIGV4cGlyZWQgPSB3YWl0SW50ZXJ2YWwgJiYgKGNvbnRleHQuc3RhcnRUaW1lICsgd2FpdEludGVydmFsKSA8IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgIG5vTG9hZHMgPSBbXSxcbiAgICAgICAgICAgICAgICByZXFDYWxscyA9IFtdLFxuICAgICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5lZWRDeWNsZUNoZWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9EbyBub3QgYm90aGVyIGlmIHRoaXMgY2FsbCB3YXMgYSByZXN1bHQgb2YgYSBjeWNsZSBicmVhay5cbiAgICAgICAgICAgIGlmIChpbkNoZWNrTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbkNoZWNrTG9hZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9GaWd1cmUgb3V0IHRoZSBzdGF0ZSBvZiBhbGwgdGhlIG1vZHVsZXMuXG4gICAgICAgICAgICBlYWNoUHJvcChlbmFibGVkUmVnaXN0cnksIGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbW9kLm1hcCxcbiAgICAgICAgICAgICAgICAgICAgbW9kSWQgPSBtYXAuaWQ7XG5cbiAgICAgICAgICAgICAgICAvL1NraXAgdGhpbmdzIHRoYXQgYXJlIG5vdCBlbmFibGVkIG9yIGluIGVycm9yIHN0YXRlLlxuICAgICAgICAgICAgICAgIGlmICghbW9kLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghbWFwLmlzRGVmaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcUNhbGxzLnB1c2gobW9kKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1vZC5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSBtb2R1bGUgc2hvdWxkIGJlIGV4ZWN1dGVkLCBhbmQgaXQgaGFzIG5vdFxuICAgICAgICAgICAgICAgICAgICAvL2JlZW4gaW5pdGVkIGFuZCB0aW1lIGlzIHVwLCByZW1lbWJlciBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2QuaW5pdGVkICYmIGV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNQYXRoRmFsbGJhY2sobW9kSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNpbmdQYXRoRmFsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vTG9hZHMucHVzaChtb2RJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlU2NyaXB0KG1vZElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghbW9kLmluaXRlZCAmJiBtb2QuZmV0Y2hlZCAmJiBtYXAuaXNEZWZpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1hcC5wcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL05vIHJlYXNvbiB0byBrZWVwIGxvb2tpbmcgZm9yIHVuZmluaXNoZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvYWRpbmcuIElmIHRoZSBvbmx5IHN0aWxsTG9hZGluZyBpcyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wbHVnaW4gcmVzb3VyY2UgdGhvdWdoLCBrZWVwIGdvaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYmVjYXVzZSBpdCBtYXkgYmUgdGhhdCBhIHBsdWdpbiByZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaXMgd2FpdGluZyBvbiBhIG5vbi1wbHVnaW4gY3ljbGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChuZWVkQ3ljbGVDaGVjayA9IGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZXhwaXJlZCAmJiBub0xvYWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vSWYgd2FpdCB0aW1lIGV4cGlyZWQsIHRocm93IGVycm9yIG9mIHVubG9hZGVkIG1vZHVsZXMuXG4gICAgICAgICAgICAgICAgZXJyID0gbWFrZUVycm9yKCd0aW1lb3V0JywgJ0xvYWQgdGltZW91dCBmb3IgbW9kdWxlczogJyArIG5vTG9hZHMsIG51bGwsIG5vTG9hZHMpO1xuICAgICAgICAgICAgICAgIGVyci5jb250ZXh0TmFtZSA9IGNvbnRleHQuY29udGV4dE5hbWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Ob3QgZXhwaXJlZCwgY2hlY2sgZm9yIGEgY3ljbGUuXG4gICAgICAgICAgICBpZiAobmVlZEN5Y2xlQ2hlY2spIHtcbiAgICAgICAgICAgICAgICBlYWNoKHJlcUNhbGxzLCBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrQ3ljbGUobW9kLCB7fSwge30pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0lmIHN0aWxsIHdhaXRpbmcgb24gbG9hZHMsIGFuZCB0aGUgd2FpdGluZyBsb2FkIGlzIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy9vdGhlciB0aGFuIGEgcGx1Z2luIHJlc291cmNlLCBvciB0aGVyZSBhcmUgc3RpbGwgb3V0c3RhbmRpbmdcbiAgICAgICAgICAgIC8vc2NyaXB0cywgdGhlbiBqdXN0IHRyeSBiYWNrIGxhdGVyLlxuICAgICAgICAgICAgaWYgKCghZXhwaXJlZCB8fCB1c2luZ1BhdGhGYWxsYmFjaykgJiYgc3RpbGxMb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgLy9Tb21ldGhpbmcgaXMgc3RpbGwgd2FpdGluZyB0byBsb2FkLiBXYWl0IGZvciBpdCwgYnV0IG9ubHlcbiAgICAgICAgICAgICAgICAvL2lmIGEgdGltZW91dCBpcyBub3QgYWxyZWFkeSBpbiBlZmZlY3QuXG4gICAgICAgICAgICAgICAgaWYgKChpc0Jyb3dzZXIgfHwgaXNXZWJXb3JrZXIpICYmICFjaGVja0xvYWRlZFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja0xvYWRlZFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tMb2FkZWRUaW1lb3V0SWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5DaGVja0xvYWRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgTW9kdWxlID0gZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBnZXRPd24odW5kZWZFdmVudHMsIG1hcC5pZCkgfHwge307XG4gICAgICAgICAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICAgICAgICAgIHRoaXMuc2hpbSA9IGdldE93bihjb25maWcuc2hpbSwgbWFwLmlkKTtcbiAgICAgICAgICAgIHRoaXMuZGVwRXhwb3J0cyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5kZXBNYXBzID0gW107XG4gICAgICAgICAgICB0aGlzLmRlcE1hdGNoZWQgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luTWFwcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kZXBDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIC8qIHRoaXMuZXhwb3J0cyB0aGlzLmZhY3RvcnlcbiAgICAgICAgICAgICAgIHRoaXMuZGVwTWFwcyA9IFtdLFxuICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkLCB0aGlzLmZldGNoZWRcbiAgICAgICAgICAgICovXG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kdWxlLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChkZXBNYXBzLCBmYWN0b3J5LCBlcnJiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgICAgICAgICAvL0RvIG5vdCBkbyBtb3JlIGluaXRzIGlmIGFscmVhZHkgZG9uZS4gQ2FuIGhhcHBlbiBpZiB0aGVyZVxuICAgICAgICAgICAgICAgIC8vYXJlIG11bHRpcGxlIGRlZmluZSBjYWxscyBmb3IgdGhlIHNhbWUgbW9kdWxlLiBUaGF0IGlzIG5vdFxuICAgICAgICAgICAgICAgIC8vYSBub3JtYWwsIGNvbW1vbiBjYXNlLCBidXQgaXQgaXMgYWxzbyBub3QgdW5leHBlY3RlZC5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZmFjdG9yeSA9IGZhY3Rvcnk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAvL1JlZ2lzdGVyIGZvciBlcnJvcnMgb24gdGhpcyBtb2R1bGUuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oJ2Vycm9yJywgZXJyYmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvL0lmIG5vIGVycmJhY2sgYWxyZWFkeSwgYnV0IHRoZXJlIGFyZSBlcnJvciBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICAgICAgLy9vbiB0aGlzIG1vZHVsZSwgc2V0IHVwIGFuIGVycmJhY2sgdG8gcGFzcyB0byB0aGUgZGVwcy5cbiAgICAgICAgICAgICAgICAgICAgZXJyYmFjayA9IGJpbmQodGhpcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vRG8gYSBjb3B5IG9mIHRoZSBkZXBlbmRlbmN5IGFycmF5LCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgLy9zb3VyY2UgaW5wdXRzIGFyZSBub3QgbW9kaWZpZWQuIEZvciBleGFtcGxlXG4gICAgICAgICAgICAgICAgLy9cInNoaW1cIiBkZXBzIGFyZSBwYXNzZWQgaW4gaGVyZSBkaXJlY3RseSwgYW5kXG4gICAgICAgICAgICAgICAgLy9kb2luZyBhIGRpcmVjdCBtb2RpZmljYXRpb24gb2YgdGhlIGRlcE1hcHMgYXJyYXlcbiAgICAgICAgICAgICAgICAvL3dvdWxkIGFmZmVjdCB0aGF0IGNvbmZpZy5cbiAgICAgICAgICAgICAgICB0aGlzLmRlcE1hcHMgPSBkZXBNYXBzICYmIGRlcE1hcHMuc2xpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVycmJhY2sgPSBlcnJiYWNrO1xuXG4gICAgICAgICAgICAgICAgLy9JbmRpY2F0ZSB0aGlzIG1vZHVsZSBoYXMgYmUgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlnbm9yZSA9IG9wdGlvbnMuaWdub3JlO1xuXG4gICAgICAgICAgICAgICAgLy9Db3VsZCBoYXZlIG9wdGlvbiB0byBpbml0IHRoaXMgbW9kdWxlIGluIGVuYWJsZWQgbW9kZSxcbiAgICAgICAgICAgICAgICAvL29yIGNvdWxkIGhhdmUgYmVlbiBwcmV2aW91c2x5IG1hcmtlZCBhcyBlbmFibGVkLiBIb3dldmVyLFxuICAgICAgICAgICAgICAgIC8vdGhlIGRlcGVuZGVuY2llcyBhcmUgbm90IGtub3duIHVudGlsIGluaXQgaXMgY2FsbGVkLiBTb1xuICAgICAgICAgICAgICAgIC8vaWYgZW5hYmxlZCBwcmV2aW91c2x5LCBub3cgdHJpZ2dlciBkZXBlbmRlbmNpZXMgYXMgZW5hYmxlZC5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVkIHx8IHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAvL0VuYWJsZSB0aGlzIG1vZHVsZSBhbmQgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICAvL1dpbGwgY2FsbCB0aGlzLmNoZWNrKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZGVmaW5lRGVwOiBmdW5jdGlvbiAoaSwgZGVwRXhwb3J0cykge1xuICAgICAgICAgICAgICAgIC8vQmVjYXVzZSBvZiBjeWNsZXMsIGRlZmluZWQgY2FsbGJhY2sgZm9yIGEgZ2l2ZW5cbiAgICAgICAgICAgICAgICAvL2V4cG9ydCBjYW4gYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kZXBNYXRjaGVkW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwTWF0Y2hlZFtpXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwQ291bnQgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBFeHBvcnRzW2ldID0gZGVwRXhwb3J0cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBmZXRjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZldGNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgY29udGV4dC5zdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG1hcCA9IHRoaXMubWFwO1xuXG4gICAgICAgICAgICAgICAgLy9JZiB0aGUgbWFuYWdlciBpcyBmb3IgYSBwbHVnaW4gbWFuYWdlZCByZXNvdXJjZSxcbiAgICAgICAgICAgICAgICAvL2FzayB0aGUgcGx1Z2luIHRvIGxvYWQgaXQgbm93LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNoaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tYWtlUmVxdWlyZSh0aGlzLm1hcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlQnVpbGRDYWxsYmFjazogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KSh0aGlzLnNoaW0uZGVwcyB8fCBbXSwgYmluZCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFwLnByZWZpeCA/IHRoaXMuY2FsbFBsdWdpbigpIDogdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL1JlZ3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hcC5wcmVmaXggPyB0aGlzLmNhbGxQbHVnaW4oKSA6IHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gdGhpcy5tYXAudXJsO1xuXG4gICAgICAgICAgICAgICAgLy9SZWd1bGFyIGRlcGVuZGVuY3kuXG4gICAgICAgICAgICAgICAgaWYgKCF1cmxGZXRjaGVkW3VybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsRmV0Y2hlZFt1cmxdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5sb2FkKHRoaXMubWFwLmlkLCB1cmwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBtb2R1bGUgaXMgcmVhZHkgdG8gZGVmaW5lIGl0c2VsZiwgYW5kIGlmIHNvLFxuICAgICAgICAgICAgICogZGVmaW5lIGl0LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjaGVjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkIHx8IHRoaXMuZW5hYmxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBlcnIsIGNqc01vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLm1hcC5pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVwRXhwb3J0cyA9IHRoaXMuZGVwRXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IHRoaXMuZXhwb3J0cyxcbiAgICAgICAgICAgICAgICAgICAgZmFjdG9yeSA9IHRoaXMuZmFjdG9yeTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBmZXRjaCBpZiBub3QgYWxyZWFkeSBpbiB0aGUgZGVmUXVldWUuXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzUHJvcChjb250ZXh0LmRlZlF1ZXVlTWFwLCBpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2goKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgdGhpcy5lcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5kZWZpbmluZykge1xuICAgICAgICAgICAgICAgICAgICAvL1RoZSBmYWN0b3J5IGNvdWxkIHRyaWdnZXIgYW5vdGhlciByZXF1aXJlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgLy90aGF0IHdvdWxkIHJlc3VsdCBpbiBjaGVja2luZyB0aGlzIG1vZHVsZSB0b1xuICAgICAgICAgICAgICAgICAgICAvL2RlZmluZSBpdHNlbGYgYWdhaW4uIElmIGFscmVhZHkgaW4gdGhlIHByb2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgLy9vZiBkb2luZyB0aGF0LCBza2lwIHRoaXMgd29yay5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwQ291bnQgPCAxICYmICF0aGlzLmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGZhY3RvcnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSBpcyBhbiBlcnJvciBsaXN0ZW5lciwgZmF2b3IgcGFzc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdG8gdGhhdCBpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGVycm9yLiBIb3dldmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb25seSBkbyBpdCBmb3IgZGVmaW5lKCknZCAgbW9kdWxlcy4gcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZXJyYmFja3Mgc2hvdWxkIG5vdCBiZSBjYWxsZWQgZm9yIGZhaWx1cmVzIGluXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVpciBjYWxsYmFja3MgKCM2OTkpLiBIb3dldmVyIGlmIGEgZ2xvYmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vbkVycm9yIGlzIHNldCwgdXNlIHRoYXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLmV2ZW50cy5lcnJvciAmJiB0aGlzLm1hcC5pc0RlZmluZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLm9uRXJyb3IgIT09IGRlZmF1bHRPbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRzID0gY29udGV4dC5leGVjQ2IoaWQsIGZhY3RvcnksIGRlcEV4cG9ydHMsIGV4cG9ydHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IGNvbnRleHQuZXhlY0NiKGlkLCBmYWN0b3J5LCBkZXBFeHBvcnRzLCBleHBvcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYXZvciByZXR1cm4gdmFsdWUgb3ZlciBleHBvcnRzLiBJZiBub2RlL2NqcyBpbiBwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gd2lsbCBub3QgaGF2ZSBhIHJldHVybiB2YWx1ZSBhbnl3YXkuIEZhdm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW9kdWxlLmV4cG9ydHMgYXNzaWdubWVudCBvdmVyIGV4cG9ydHMgb2JqZWN0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hcC5pc0RlZmluZSAmJiBleHBvcnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2pzTW9kdWxlID0gdGhpcy5tb2R1bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjanNNb2R1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBjanNNb2R1bGUuZXhwb3J0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnVzaW5nRXhwb3J0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9leHBvcnRzIGFscmVhZHkgc2V0IHRoZSBkZWZpbmVkIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0cyA9IHRoaXMuZXhwb3J0cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNYXAgPSB0aGlzLm1hcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNb2R1bGVzID0gdGhpcy5tYXAuaXNEZWZpbmUgPyBbdGhpcy5tYXAuaWRdIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVUeXBlID0gdGhpcy5tYXAuaXNEZWZpbmUgPyAnZGVmaW5lJyA6ICdyZXF1aXJlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IoKHRoaXMuZXJyb3IgPSBlcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9KdXN0IGEgbGl0ZXJhbCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBmYWN0b3J5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cG9ydHMgPSBleHBvcnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXAuaXNEZWZpbmUgJiYgIXRoaXMuaWdub3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtpZF0gPSBleHBvcnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5vblJlc291cmNlTG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzTG9hZE1hcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaCh0aGlzLmRlcE1hcHMsIGZ1bmN0aW9uIChkZXBNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc0xvYWRNYXBzLnB1c2goZGVwTWFwLm5vcm1hbGl6ZWRNYXAgfHwgZGVwTWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5vblJlc291cmNlTG9hZChjb250ZXh0LCB0aGlzLm1hcCwgcmVzTG9hZE1hcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9DbGVhbiB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5SZWdpc3RyeShpZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL0ZpbmlzaGVkIHRoZSBkZWZpbmUgc3RhZ2UuIEFsbG93IGNhbGxpbmcgY2hlY2sgYWdhaW5cbiAgICAgICAgICAgICAgICAgICAgLy90byBhbGxvdyBkZWZpbmUgbm90aWZpY2F0aW9ucyBiZWxvdyBpbiB0aGUgY2FzZSBvZiBhXG4gICAgICAgICAgICAgICAgICAgIC8vY3ljbGUuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5pbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWZpbmVkICYmICF0aGlzLmRlZmluZUVtaXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lRW1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2RlZmluZWQnLCB0aGlzLmV4cG9ydHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVFbWl0Q29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjYWxsUGx1Z2luOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hcCA9IHRoaXMubWFwLFxuICAgICAgICAgICAgICAgICAgICBpZCA9IG1hcC5pZCxcbiAgICAgICAgICAgICAgICAgICAgLy9NYXAgYWxyZWFkeSBub3JtYWxpemVkIHRoZSBwcmVmaXguXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbk1hcCA9IG1ha2VNb2R1bGVNYXAobWFwLnByZWZpeCk7XG5cbiAgICAgICAgICAgICAgICAvL01hcmsgdGhpcyBhcyBhIGRlcGVuZGVuY3kgZm9yIHRoaXMgcGx1Z2luLCBzbyBpdFxuICAgICAgICAgICAgICAgIC8vY2FuIGJlIHRyYWNlZCBmb3IgY3ljbGVzLlxuICAgICAgICAgICAgICAgIHRoaXMuZGVwTWFwcy5wdXNoKHBsdWdpbk1hcCk7XG5cbiAgICAgICAgICAgICAgICBvbihwbHVnaW5NYXAsICdkZWZpbmVkJywgYmluZCh0aGlzLCBmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2FkLCBub3JtYWxpemVkTWFwLCBub3JtYWxpemVkTW9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnVuZGxlSWQgPSBnZXRPd24oYnVuZGxlc01hcCwgdGhpcy5tYXAuaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHRoaXMubWFwLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROYW1lID0gdGhpcy5tYXAucGFyZW50TWFwID8gdGhpcy5tYXAucGFyZW50TWFwLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxSZXF1aXJlID0gY29udGV4dC5tYWtlUmVxdWlyZShtYXAucGFyZW50TWFwLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlQnVpbGRDYWxsYmFjazogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiBjdXJyZW50IG1hcCBpcyBub3Qgbm9ybWFsaXplZCwgd2FpdCBmb3IgdGhhdFxuICAgICAgICAgICAgICAgICAgICAvL25vcm1hbGl6ZWQgbmFtZSB0byBsb2FkIGluc3RlYWQgb2YgY29udGludWluZy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWFwLnVubm9ybWFsaXplZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9Ob3JtYWxpemUgdGhlIElEIGlmIHRoZSBwbHVnaW4gYWxsb3dzIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5ub3JtYWxpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gcGx1Z2luLm5vcm1hbGl6ZShuYW1lLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3ByZWZpeCBhbmQgbmFtZSBzaG91bGQgYWxyZWFkeSBiZSBub3JtYWxpemVkLCBubyBuZWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ZvciBhcHBseWluZyBtYXAgY29uZmlnIGFnYWluIGVpdGhlci5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRNYXAgPSBtYWtlTW9kdWxlTWFwKG1hcC5wcmVmaXggKyAnIScgKyBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAucGFyZW50TWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbihub3JtYWxpemVkTWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkZWZpbmVkJywgYmluZCh0aGlzLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAubm9ybWFsaXplZE1hcCA9IG5vcm1hbGl6ZWRNYXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdChbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0sIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBub3JtYWxpemVkTWFwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkTW9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9NYXJrIHRoaXMgYXMgYSBkZXBlbmRlbmN5IGZvciB0aGlzIHBsdWdpbiwgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NhbiBiZSB0cmFjZWQgZm9yIGN5Y2xlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcE1hcHMucHVzaChub3JtYWxpemVkTWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTW9kLm9uKCdlcnJvcicsIGJpbmQodGhpcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZE1vZC5lbmFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiBhIHBhdGhzIGNvbmZpZywgdGhlbiBqdXN0IGxvYWQgdGhhdCBmaWxlIGluc3RlYWQgdG9cbiAgICAgICAgICAgICAgICAgICAgLy9yZXNvbHZlIHRoZSBwbHVnaW4sIGFzIGl0IGlzIGJ1aWx0IGludG8gdGhhdCBwYXRocyBsYXllci5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bmRsZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcC51cmwgPSBjb250ZXh0Lm5hbWVUb1VybChidW5kbGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxvYWQgPSBiaW5kKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWx1ZTsgfSwgbnVsbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBsb2FkLmVycm9yID0gYmluZCh0aGlzLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNb2R1bGVzID0gW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9SZW1vdmUgdGVtcCB1bm5vcm1hbGl6ZWQgbW9kdWxlcyBmb3IgdGhpcyBtb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NpbmNlIHRoZXkgd2lsbCBuZXZlciBiZSByZXNvbHZlZCBvdGhlcndpc2Ugbm93LlxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaFByb3AocmVnaXN0cnksIGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kLm1hcC5pZC5pbmRleE9mKGlkICsgJ191bm5vcm1hbGl6ZWQnKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhblJlZ2lzdHJ5KG1vZC5tYXAuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vQWxsb3cgcGx1Z2lucyB0byBsb2FkIG90aGVyIGNvZGUgd2l0aG91dCBoYXZpbmcgdG8ga25vdyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy9jb250ZXh0IG9yIGhvdyB0byAnY29tcGxldGUnIHRoZSBsb2FkLlxuICAgICAgICAgICAgICAgICAgICBsb2FkLmZyb21UZXh0ID0gYmluZCh0aGlzLCBmdW5jdGlvbiAodGV4dCwgdGV4dEFsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBtYXAubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVNYXAgPSBtYWtlTW9kdWxlTWFwKG1vZHVsZU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ludGVyYWN0aXZlID0gdXNlSW50ZXJhY3RpdmU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQXMgb2YgMi4xLjAsIHN1cHBvcnQganVzdCBwYXNzaW5nIHRoZSB0ZXh0LCB0byByZWluZm9yY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZnJvbVRleHQgb25seSBiZWluZyBjYWxsZWQgb25jZSBwZXIgcmVzb3VyY2UuIFN0aWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3N1cHBvcnQgb2xkIHN0eWxlIG9mIHBhc3NpbmcgbW9kdWxlTmFtZSBidXQgZGlzY2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGF0IG1vZHVsZU5hbWUgaW4gZmF2b3Igb2YgdGhlIGludGVybmFsIHJlZi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0QWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHRBbHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVHVybiBvZmYgaW50ZXJhY3RpdmUgc2NyaXB0IG1hdGNoaW5nIGZvciBJRSBmb3IgYW55IGRlZmluZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYWxscyBpbiB0aGUgdGV4dCwgdGhlbiB0dXJuIGl0IGJhY2sgb24gYXQgdGhlIGVuZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNJbnRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vUHJpbWUgdGhlIHN5c3RlbSBieSBjcmVhdGluZyBhIG1vZHVsZSBpbnN0YW5jZSBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNb2R1bGUobW9kdWxlTWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9UcmFuc2ZlciBhbnkgY29uZmlnIHRvIHRoaXMgb3RoZXIgbW9kdWxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1Byb3AoY29uZmlnLmNvbmZpZywgaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmNvbmZpZ1ttb2R1bGVOYW1lXSA9IGNvbmZpZy5jb25maWdbaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5leGVjKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkVycm9yKG1ha2VFcnJvcignZnJvbXRleHRldmFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmcm9tVGV4dCBldmFsIGZvciAnICsgaWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIGZhaWxlZDogJyArIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2lkXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzSW50ZXJhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vTWFyayB0aGlzIGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhlIHBsdWdpblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBNYXBzLnB1c2gobW9kdWxlTWFwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9TdXBwb3J0IGFub255bW91cyBtb2R1bGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jb21wbGV0ZUxvYWQobW9kdWxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQmluZCB0aGUgdmFsdWUgb2YgdGhhdCBtb2R1bGUgdG8gdGhlIHZhbHVlIGZvciB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc291cmNlIElELlxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxSZXF1aXJlKFttb2R1bGVOYW1lXSwgbG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vVXNlIHBhcmVudE5hbWUgaGVyZSBzaW5jZSB0aGUgcGx1Z2luJ3MgbmFtZSBpcyBub3QgcmVsaWFibGUsXG4gICAgICAgICAgICAgICAgICAgIC8vY291bGQgYmUgc29tZSB3ZWlyZCBzdHJpbmcgd2l0aCBubyBwYXRoIHRoYXQgYWN0dWFsbHkgd2FudHMgdG9cbiAgICAgICAgICAgICAgICAgICAgLy9yZWZlcmVuY2UgdGhlIHBhcmVudE5hbWUncyBwYXRoLlxuICAgICAgICAgICAgICAgICAgICBwbHVnaW4ubG9hZChtYXAubmFtZSwgbG9jYWxSZXF1aXJlLCBsb2FkLCBjb25maWcpO1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW5hYmxlKHBsdWdpbk1hcCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW5NYXBzW3BsdWdpbk1hcC5pZF0gPSBwbHVnaW5NYXA7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkUmVnaXN0cnlbdGhpcy5tYXAuaWRdID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy9TZXQgZmxhZyBtZW50aW9uaW5nIHRoYXQgdGhlIG1vZHVsZSBpcyBlbmFibGluZyxcbiAgICAgICAgICAgICAgICAvL3NvIHRoYXQgaW1tZWRpYXRlIGNhbGxzIHRvIHRoZSBkZWZpbmVkIGNhbGxiYWNrc1xuICAgICAgICAgICAgICAgIC8vZm9yIGRlcGVuZGVuY2llcyBkbyBub3QgdHJpZ2dlciBpbmFkdmVydGVudCBsb2FkXG4gICAgICAgICAgICAgICAgLy93aXRoIHRoZSBkZXBDb3VudCBzdGlsbCBiZWluZyB6ZXJvLlxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy9FbmFibGUgZWFjaCBkZXBlbmRlbmN5XG4gICAgICAgICAgICAgICAgZWFjaCh0aGlzLmRlcE1hcHMsIGJpbmQodGhpcywgZnVuY3Rpb24gKGRlcE1hcCwgaSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQsIG1vZCwgaGFuZGxlcjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRlcE1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVwZW5kZW5jeSBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBkZXBNYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYW5kIHdpcmVkIHVwIHRvIHRoaXMgbW9kdWxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwTWFwID0gbWFrZU1vZHVsZU1hcChkZXBNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLm1hcC5pc0RlZmluZSA/IHRoaXMubWFwIDogdGhpcy5tYXAucGFyZW50TWFwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLnNraXBNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBNYXBzW2ldID0gZGVwTWFwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyID0gZ2V0T3duKGhhbmRsZXJzLCBkZXBNYXAuaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwRXhwb3J0c1tpXSA9IGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcENvdW50ICs9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uKGRlcE1hcCwgJ2RlZmluZWQnLCBiaW5kKHRoaXMsIGZ1bmN0aW9uIChkZXBFeHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudW5kZWZlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lRGVwKGksIGRlcEV4cG9ydHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uKGRlcE1hcCwgJ2Vycm9yJywgYmluZCh0aGlzLCB0aGlzLmVycmJhY2spKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5ldmVudHMuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBObyBkaXJlY3QgZXJyYmFjayBvbiB0aGlzIG1vZHVsZSwgYnV0IHNvbWV0aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgaXMgbGlzdGVuaW5nIGZvciBlcnJvcnMsIHNvIGJlIHN1cmUgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9wYWdhdGUgdGhlIGVycm9yIGNvcnJlY3RseS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbihkZXBNYXAsICdlcnJvcicsIGJpbmQodGhpcywgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlkID0gZGVwTWFwLmlkO1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSByZWdpc3RyeVtpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgLy9Ta2lwIHNwZWNpYWwgbW9kdWxlcyBsaWtlICdyZXF1aXJlJywgJ2V4cG9ydHMnLCAnbW9kdWxlJ1xuICAgICAgICAgICAgICAgICAgICAvL0Fsc28sIGRvbid0IGNhbGwgZW5hYmxlIGlmIGl0IGlzIGFscmVhZHkgZW5hYmxlZCxcbiAgICAgICAgICAgICAgICAgICAgLy9pbXBvcnRhbnQgaW4gY2lyY3VsYXIgZGVwZW5kZW5jeSBjYXNlcy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNQcm9wKGhhbmRsZXJzLCBpZCkgJiYgbW9kICYmICFtb2QuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5lbmFibGUoZGVwTWFwLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIC8vRW5hYmxlIGVhY2ggcGx1Z2luIHRoYXQgaXMgdXNlZCBpblxuICAgICAgICAgICAgICAgIC8vYSBkZXBlbmRlbmN5XG4gICAgICAgICAgICAgICAgZWFjaFByb3AodGhpcy5wbHVnaW5NYXBzLCBiaW5kKHRoaXMsIGZ1bmN0aW9uIChwbHVnaW5NYXApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgcGx1Z2luTWFwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZCAmJiAhbW9kLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW5hYmxlKHBsdWdpbk1hcCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvbjogZnVuY3Rpb24gKG5hbWUsIGNiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNicyA9IHRoaXMuZXZlbnRzW25hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghY2JzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNicyA9IHRoaXMuZXZlbnRzW25hbWVdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNicy5wdXNoKGNiKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVtaXQ6IGZ1bmN0aW9uIChuYW1lLCBldnQpIHtcbiAgICAgICAgICAgICAgICBlYWNoKHRoaXMuZXZlbnRzW25hbWVdLCBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoZXZ0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICAvL05vdyB0aGF0IHRoZSBlcnJvciBoYW5kbGVyIHdhcyB0cmlnZ2VyZWQsIHJlbW92ZVxuICAgICAgICAgICAgICAgICAgICAvL3RoZSBsaXN0ZW5lcnMsIHNpbmNlIHRoaXMgYnJva2VuIE1vZHVsZSBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICAvL2NhbiBzdGF5IGFyb3VuZCBmb3IgYSB3aGlsZSBpbiB0aGUgcmVnaXN0cnkuXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tuYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsbEdldE1vZHVsZShhcmdzKSB7XG4gICAgICAgICAgICAvL1NraXAgbW9kdWxlcyBhbHJlYWR5IGRlZmluZWQuXG4gICAgICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgYXJnc1swXSkpIHtcbiAgICAgICAgICAgICAgICBnZXRNb2R1bGUobWFrZU1vZHVsZU1hcChhcmdzWzBdLCBudWxsLCB0cnVlKSkuaW5pdChhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKG5vZGUsIGZ1bmMsIG5hbWUsIGllTmFtZSkge1xuICAgICAgICAgICAgLy9GYXZvciBkZXRhY2hFdmVudCBiZWNhdXNlIG9mIElFOVxuICAgICAgICAgICAgLy9pc3N1ZSwgc2VlIGF0dGFjaEV2ZW50L2FkZEV2ZW50TGlzdGVuZXIgY29tbWVudCBlbHNld2hlcmVcbiAgICAgICAgICAgIC8vaW4gdGhpcyBmaWxlLlxuICAgICAgICAgICAgaWYgKG5vZGUuZGV0YWNoRXZlbnQgJiYgIWlzT3BlcmEpIHtcbiAgICAgICAgICAgICAgICAvL1Byb2JhYmx5IElFLiBJZiBub3QgaXQgd2lsbCB0aHJvdyBhbiBlcnJvciwgd2hpY2ggd2lsbCBiZVxuICAgICAgICAgICAgICAgIC8vdXNlZnVsIHRvIGtub3cuXG4gICAgICAgICAgICAgICAgaWYgKGllTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRldGFjaEV2ZW50KGllTmFtZSwgZnVuYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZnVuYywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGFuIGV2ZW50IGZyb20gYSBzY3JpcHQgbm9kZSwgZ2V0IHRoZSByZXF1aXJlanMgaW5mbyBmcm9tIGl0LFxuICAgICAgICAgKiBhbmQgdGhlbiByZW1vdmVzIHRoZSBldmVudCBsaXN0ZW5lcnMgb24gdGhlIG5vZGUuXG4gICAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2NyaXB0RGF0YShldnQpIHtcbiAgICAgICAgICAgIC8vVXNpbmcgY3VycmVudFRhcmdldCBpbnN0ZWFkIG9mIHRhcmdldCBmb3IgRmlyZWZveCAyLjAncyBzYWtlLiBOb3RcbiAgICAgICAgICAgIC8vYWxsIG9sZCBicm93c2VycyB3aWxsIGJlIHN1cHBvcnRlZCwgYnV0IHRoaXMgb25lIHdhcyBlYXN5IGVub3VnaFxuICAgICAgICAgICAgLy90byBzdXBwb3J0IGFuZCBzdGlsbCBtYWtlcyBzZW5zZS5cbiAgICAgICAgICAgIHZhciBub2RlID0gZXZ0LmN1cnJlbnRUYXJnZXQgfHwgZXZ0LnNyY0VsZW1lbnQ7XG5cbiAgICAgICAgICAgIC8vUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb25jZSBoZXJlLlxuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIobm9kZSwgY29udGV4dC5vblNjcmlwdExvYWQsICdsb2FkJywgJ29ucmVhZHlzdGF0ZWNoYW5nZScpO1xuICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIobm9kZSwgY29udGV4dC5vblNjcmlwdEVycm9yLCAnZXJyb3InKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgICAgICAgIGlkOiBub2RlICYmIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVtb2R1bGUnKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGludGFrZURlZmluZXMoKSB7XG4gICAgICAgICAgICB2YXIgYXJncztcblxuICAgICAgICAgICAgLy9BbnkgZGVmaW5lZCBtb2R1bGVzIGluIHRoZSBnbG9iYWwgcXVldWUsIGludGFrZSB0aGVtIG5vdy5cbiAgICAgICAgICAgIHRha2VHbG9iYWxRdWV1ZSgpO1xuXG4gICAgICAgICAgICAvL01ha2Ugc3VyZSBhbnkgcmVtYWluaW5nIGRlZlF1ZXVlIGl0ZW1zIGdldCBwcm9wZXJseSBwcm9jZXNzZWQuXG4gICAgICAgICAgICB3aGlsZSAoZGVmUXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IGRlZlF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IobWFrZUVycm9yKCdtaXNtYXRjaCcsICdNaXNtYXRjaGVkIGFub255bW91cyBkZWZpbmUoKSBtb2R1bGU6ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc1thcmdzLmxlbmd0aCAtIDFdKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hcmdzIGFyZSBpZCwgZGVwcywgZmFjdG9yeS4gU2hvdWxkIGJlIG5vcm1hbGl6ZWQgYnkgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vZGVmaW5lKCkgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIGNhbGxHZXRNb2R1bGUoYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGV4dC5kZWZRdWV1ZU1hcCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dCA9IHtcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgY29udGV4dE5hbWU6IGNvbnRleHROYW1lLFxuICAgICAgICAgICAgcmVnaXN0cnk6IHJlZ2lzdHJ5LFxuICAgICAgICAgICAgZGVmaW5lZDogZGVmaW5lZCxcbiAgICAgICAgICAgIHVybEZldGNoZWQ6IHVybEZldGNoZWQsXG4gICAgICAgICAgICBkZWZRdWV1ZTogZGVmUXVldWUsXG4gICAgICAgICAgICBkZWZRdWV1ZU1hcDoge30sXG4gICAgICAgICAgICBNb2R1bGU6IE1vZHVsZSxcbiAgICAgICAgICAgIG1ha2VNb2R1bGVNYXA6IG1ha2VNb2R1bGVNYXAsXG4gICAgICAgICAgICBuZXh0VGljazogcmVxLm5leHRUaWNrLFxuICAgICAgICAgICAgb25FcnJvcjogb25FcnJvcixcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgYSBjb25maWd1cmF0aW9uIGZvciB0aGUgY29udGV4dC5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZmcgY29uZmlnIG9iamVjdCB0byBpbnRlZ3JhdGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbmZpZ3VyZTogZnVuY3Rpb24gKGNmZykge1xuICAgICAgICAgICAgICAgIC8vTWFrZSBzdXJlIHRoZSBiYXNlVXJsIGVuZHMgaW4gYSBzbGFzaC5cbiAgICAgICAgICAgICAgICBpZiAoY2ZnLmJhc2VVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNmZy5iYXNlVXJsLmNoYXJBdChjZmcuYmFzZVVybC5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZmcuYmFzZVVybCArPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IG9sZCBzdHlsZSB1cmxBcmdzIHN0cmluZyB0byBhIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2ZnLnVybEFyZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmxBcmdzID0gY2ZnLnVybEFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNmZy51cmxBcmdzID0gZnVuY3Rpb24oaWQsIHVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyB1cmxBcmdzO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vU2F2ZSBvZmYgdGhlIHBhdGhzIHNpbmNlIHRoZXkgcmVxdWlyZSBzcGVjaWFsIHByb2Nlc3NpbmcsXG4gICAgICAgICAgICAgICAgLy90aGV5IGFyZSBhZGRpdGl2ZS5cbiAgICAgICAgICAgICAgICB2YXIgc2hpbSA9IGNvbmZpZy5zaGltLFxuICAgICAgICAgICAgICAgICAgICBvYmpzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBlYWNoUHJvcChjZmcsIGZ1bmN0aW9uICh2YWx1ZSwgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2Jqc1twcm9wXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25maWdbcHJvcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG1peGluKGNvbmZpZ1twcm9wXSwgdmFsdWUsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vUmV2ZXJzZSBtYXAgdGhlIGJ1bmRsZXNcbiAgICAgICAgICAgICAgICBpZiAoY2ZnLmJ1bmRsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZWFjaFByb3AoY2ZnLmJ1bmRsZXMsIGZ1bmN0aW9uICh2YWx1ZSwgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaCh2YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVzTWFwW3ZdID0gcHJvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9NZXJnZSBzaGltXG4gICAgICAgICAgICAgICAgaWYgKGNmZy5zaGltKSB7XG4gICAgICAgICAgICAgICAgICAgIGVhY2hQcm9wKGNmZy5zaGltLCBmdW5jdGlvbiAodmFsdWUsIGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL05vcm1hbGl6ZSB0aGUgc3RydWN0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwczogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh2YWx1ZS5leHBvcnRzIHx8IHZhbHVlLmluaXQpICYmICF2YWx1ZS5leHBvcnRzRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5leHBvcnRzRm4gPSBjb250ZXh0Lm1ha2VTaGltRXhwb3J0cyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGltW2lkXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnNoaW0gPSBzaGltO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQWRqdXN0IHBhY2thZ2VzIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgICAgICAgICBpZiAoY2ZnLnBhY2thZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGVhY2goY2ZnLnBhY2thZ2VzLCBmdW5jdGlvbiAocGtnT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24sIG5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBrZ09iaiA9IHR5cGVvZiBwa2dPYmogPT09ICdzdHJpbmcnID8ge25hbWU6IHBrZ09ian0gOiBwa2dPYmo7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSBwa2dPYmoubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gcGtnT2JqLmxvY2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnBhdGhzW25hbWVdID0gcGtnT2JqLmxvY2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NhdmUgcG9pbnRlciB0byBtYWluIG1vZHVsZSBJRCBmb3IgcGtnIG5hbWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1JlbW92ZSBsZWFkaW5nIGRvdCBpbiBtYWluLCBzbyBtYWluIHBhdGhzIGFyZSBub3JtYWxpemVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hbmQgcmVtb3ZlIGFueSB0cmFpbGluZyAuanMsIHNpbmNlIGRpZmZlcmVudCBwYWNrYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2VudnMgaGF2ZSBkaWZmZXJlbnQgY29udmVudGlvbnM6IHNvbWUgdXNlIGEgbW9kdWxlIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NvbWUgdXNlIGEgZmlsZSBuYW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnBrZ3NbbmFtZV0gPSBwa2dPYmoubmFtZSArICcvJyArIChwa2dPYmoubWFpbiB8fCAnbWFpbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoY3VyckRpclJlZ0V4cCwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoanNTdWZmaXhSZWdFeHAsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9JZiB0aGVyZSBhcmUgYW55IFwid2FpdGluZyB0byBleGVjdXRlXCIgbW9kdWxlcyBpbiB0aGUgcmVnaXN0cnksXG4gICAgICAgICAgICAgICAgLy91cGRhdGUgdGhlIG1hcHMgZm9yIHRoZW0sIHNpbmNlIHRoZWlyIGluZm8sIGxpa2UgVVJMcyB0byBsb2FkLFxuICAgICAgICAgICAgICAgIC8vbWF5IGhhdmUgY2hhbmdlZC5cbiAgICAgICAgICAgICAgICBlYWNoUHJvcChyZWdpc3RyeSwgZnVuY3Rpb24gKG1vZCwgaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9JZiBtb2R1bGUgYWxyZWFkeSBoYXMgaW5pdCBjYWxsZWQsIHNpbmNlIGl0IGlzIHRvb1xuICAgICAgICAgICAgICAgICAgICAvL2xhdGUgdG8gbW9kaWZ5IHRoZW0sIGFuZCBpZ25vcmUgdW5ub3JtYWxpemVkIG9uZXNcbiAgICAgICAgICAgICAgICAgICAgLy9zaW5jZSB0aGV5IGFyZSB0cmFuc2llbnQuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbW9kLmluaXRlZCAmJiAhbW9kLm1hcC51bm5vcm1hbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZC5tYXAgPSBtYWtlTW9kdWxlTWFwKGlkLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9JZiBhIGRlcHMgYXJyYXkgb3IgYSBjb25maWcgY2FsbGJhY2sgaXMgc3BlY2lmaWVkLCB0aGVuIGNhbGxcbiAgICAgICAgICAgICAgICAvL3JlcXVpcmUgd2l0aCB0aG9zZSBhcmdzLiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHJlcXVpcmUgaXMgZGVmaW5lZCBhcyBhXG4gICAgICAgICAgICAgICAgLy9jb25maWcgb2JqZWN0IGJlZm9yZSByZXF1aXJlLmpzIGlzIGxvYWRlZC5cbiAgICAgICAgICAgICAgICBpZiAoY2ZnLmRlcHMgfHwgY2ZnLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucmVxdWlyZShjZmcuZGVwcyB8fCBbXSwgY2ZnLmNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBtYWtlU2hpbUV4cG9ydHM6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaW5pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gdmFsdWUuaW5pdC5hcHBseShnbG9iYWwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldCB8fCAodmFsdWUuZXhwb3J0cyAmJiBnZXRHbG9iYWwodmFsdWUuZXhwb3J0cykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZm47XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBtYWtlUmVxdWlyZTogZnVuY3Rpb24gKHJlbE1hcCwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbG9jYWxSZXF1aXJlKGRlcHMsIGNhbGxiYWNrLCBlcnJiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCwgbWFwLCByZXF1aXJlTW9kO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmVuYWJsZUJ1aWxkQ2FsbGJhY2sgJiYgY2FsbGJhY2sgJiYgaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLl9fcmVxdWlyZUpzQnVpbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkZXBzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JbnZhbGlkIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ3JlcXVpcmVhcmdzJywgJ0ludmFsaWQgcmVxdWlyZSBjYWxsJyksIGVycmJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHJlcXVpcmV8ZXhwb3J0c3xtb2R1bGUgYXJlIHJlcXVlc3RlZCwgZ2V0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy92YWx1ZSBmb3IgdGhlbSBmcm9tIHRoZSBzcGVjaWFsIGhhbmRsZXJzLiBDYXZlYXQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMgb25seSB3b3JrcyB3aGlsZSBtb2R1bGUgaXMgYmVpbmcgZGVmaW5lZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWxNYXAgJiYgaGFzUHJvcChoYW5kbGVycywgZGVwcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnNbZGVwc10ocmVnaXN0cnlbcmVsTWFwLmlkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU3luY2hyb25vdXMgYWNjZXNzIHRvIG9uZSBtb2R1bGUuIElmIHJlcXVpcmUuZ2V0IGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2F2YWlsYWJsZSAoYXMgaW4gdGhlIE5vZGUgYWRhcHRlciksIHByZWZlciB0aGF0LlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5nZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVxLmdldChjb250ZXh0LCBkZXBzLCByZWxNYXAsIGxvY2FsUmVxdWlyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vTm9ybWFsaXplIG1vZHVsZSBuYW1lLCBpZiBpdCBjb250YWlucyAuIG9yIC4uXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAgPSBtYWtlTW9kdWxlTWFwKGRlcHMsIHJlbE1hcCwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSBtYXAuaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ25vdGxvYWRlZCcsICdNb2R1bGUgbmFtZSBcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCIgaGFzIG5vdCBiZWVuIGxvYWRlZCB5ZXQgZm9yIGNvbnRleHQ6ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHROYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVsTWFwID8gJycgOiAnLiBVc2UgcmVxdWlyZShbXSknKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZWRbaWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9HcmFiIGRlZmluZXMgd2FpdGluZyBpbiB0aGUgZ2xvYmFsIHF1ZXVlLlxuICAgICAgICAgICAgICAgICAgICBpbnRha2VEZWZpbmVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9NYXJrIGFsbCB0aGUgZGVwZW5kZW5jaWVzIGFzIG5lZWRpbmcgdG8gYmUgbG9hZGVkLlxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0Lm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU29tZSBkZWZpbmVzIGNvdWxkIGhhdmUgYmVlbiBhZGRlZCBzaW5jZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmVxdWlyZSBjYWxsLCBjb2xsZWN0IHRoZW0uXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRha2VEZWZpbmVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVNb2QgPSBnZXRNb2R1bGUobWFrZU1vZHVsZU1hcChudWxsLCByZWxNYXApKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9TdG9yZSBpZiBtYXAgY29uZmlnIHNob3VsZCBiZSBhcHBsaWVkIHRvIHRoaXMgcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYWxsIGZvciBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTW9kLnNraXBNYXAgPSBvcHRpb25zLnNraXBNYXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVNb2QuaW5pdChkZXBzLCBjYWxsYmFjaywgZXJyYmFjaywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0xvYWRlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxSZXF1aXJlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1peGluKGxvY2FsUmVxdWlyZSwge1xuICAgICAgICAgICAgICAgICAgICBpc0Jyb3dzZXI6IGlzQnJvd3NlcixcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ29udmVydHMgYSBtb2R1bGUgbmFtZSArIC5leHRlbnNpb24gaW50byBhbiBVUkwgcGF0aC5cbiAgICAgICAgICAgICAgICAgICAgICogKlJlcXVpcmVzKiB0aGUgdXNlIG9mIGEgbW9kdWxlIG5hbWUuIEl0IGRvZXMgbm90IHN1cHBvcnQgdXNpbmdcbiAgICAgICAgICAgICAgICAgICAgICogcGxhaW4gVVJMcyBsaWtlIG5hbWVUb1VybC5cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRvVXJsOiBmdW5jdGlvbiAobW9kdWxlTmFtZVBsdXNFeHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBtb2R1bGVOYW1lUGx1c0V4dC5sYXN0SW5kZXhPZignLicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnQgPSBtb2R1bGVOYW1lUGx1c0V4dC5zcGxpdCgnLycpWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVsYXRpdmUgPSBzZWdtZW50ID09PSAnLicgfHwgc2VnbWVudCA9PT0gJy4uJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9IYXZlIGEgZmlsZSBleHRlbnNpb24gYWxpYXMsIGFuZCBpdCBpcyBub3QgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2RvdHMgZnJvbSBhIHJlbGF0aXZlIHBhdGguXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xICYmICghaXNSZWxhdGl2ZSB8fCBpbmRleCA+IDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ID0gbW9kdWxlTmFtZVBsdXNFeHQuc3Vic3RyaW5nKGluZGV4LCBtb2R1bGVOYW1lUGx1c0V4dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWVQbHVzRXh0ID0gbW9kdWxlTmFtZVBsdXNFeHQuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQubmFtZVRvVXJsKG5vcm1hbGl6ZShtb2R1bGVOYW1lUGx1c0V4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbE1hcCAmJiByZWxNYXAuaWQsIHRydWUpLCBleHQsICB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICBkZWZpbmVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYXNQcm9wKGRlZmluZWQsIG1ha2VNb2R1bGVNYXAoaWQsIHJlbE1hcCwgZmFsc2UsIHRydWUpLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICBzcGVjaWZpZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSBtYWtlTW9kdWxlTWFwKGlkLCByZWxNYXAsIGZhbHNlLCB0cnVlKS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYXNQcm9wKGRlZmluZWQsIGlkKSB8fCBoYXNQcm9wKHJlZ2lzdHJ5LCBpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vT25seSBhbGxvdyB1bmRlZiBvbiB0b3AgbGV2ZWwgcmVxdWlyZSBjYWxsc1xuICAgICAgICAgICAgICAgIGlmICghcmVsTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsUmVxdWlyZS51bmRlZiA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9CaW5kIGFueSB3YWl0aW5nIGRlZmluZSgpIGNhbGxzIHRvIHRoaXMgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZml4IGZvciAjNDA4XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWtlR2xvYmFsUXVldWUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hcCA9IG1ha2VNb2R1bGVNYXAoaWQsIHJlbE1hcCwgdHJ1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBpZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZC51bmRlZmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZVNjcmlwdChpZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkZWZpbmVkW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB1cmxGZXRjaGVkW21hcC51cmxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHVuZGVmRXZlbnRzW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9DbGVhbiBxdWV1ZWQgZGVmaW5lcyB0b28uIEdvIGJhY2t3YXJkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pbiBhcnJheSBzbyB0aGF0IHRoZSBzcGxpY2VzIGRvIG5vdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9tZXNzIHVwIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoUmV2ZXJzZShkZWZRdWV1ZSwgZnVuY3Rpb24oYXJncywgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzWzBdID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZRdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dC5kZWZRdWV1ZU1hcFtpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0hvbGQgb24gdG8gbGlzdGVuZXJzIGluIGNhc2UgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9tb2R1bGUgd2lsbCBiZSBhdHRlbXB0ZWQgdG8gYmUgcmVsb2FkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3VzaW5nIGEgZGlmZmVyZW50IGNvbmZpZy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kLmV2ZW50cy5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmRXZlbnRzW2lkXSA9IG1vZC5ldmVudHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5SZWdpc3RyeShpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsUmVxdWlyZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ2FsbGVkIHRvIGVuYWJsZSBhIG1vZHVsZSBpZiBpdCBpcyBzdGlsbCBpbiB0aGUgcmVnaXN0cnlcbiAgICAgICAgICAgICAqIGF3YWl0aW5nIGVuYWJsZW1lbnQuIEEgc2Vjb25kIGFyZywgcGFyZW50LCB0aGUgcGFyZW50IG1vZHVsZSxcbiAgICAgICAgICAgICAqIGlzIHBhc3NlZCBpbiBmb3IgY29udGV4dCwgd2hlbiB0aGlzIG1ldGhvZCBpcyBvdmVycmlkZGVuIGJ5XG4gICAgICAgICAgICAgKiB0aGUgb3B0aW1pemVyLiBOb3Qgc2hvd24gaGVyZSB0byBrZWVwIGNvZGUgY29tcGFjdC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZW5hYmxlOiBmdW5jdGlvbiAoZGVwTWFwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgZGVwTWFwLmlkKTtcbiAgICAgICAgICAgICAgICBpZiAobW9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE1vZHVsZShkZXBNYXApLmVuYWJsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW50ZXJuYWwgbWV0aG9kIHVzZWQgYnkgZW52aXJvbm1lbnQgYWRhcHRlcnMgdG8gY29tcGxldGUgYSBsb2FkIGV2ZW50LlxuICAgICAgICAgICAgICogQSBsb2FkIGV2ZW50IGNvdWxkIGJlIGEgc2NyaXB0IGxvYWQgb3IganVzdCBhIGxvYWQgcGFzcyBmcm9tIGEgc3luY2hyb25vdXNcbiAgICAgICAgICAgICAqIGxvYWQgY2FsbC5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtb2R1bGVOYW1lIHRoZSBuYW1lIG9mIHRoZSBtb2R1bGUgdG8gcG90ZW50aWFsbHkgY29tcGxldGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbXBsZXRlTG9hZDogZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQsIGFyZ3MsIG1vZCxcbiAgICAgICAgICAgICAgICAgICAgc2hpbSA9IGdldE93bihjb25maWcuc2hpbSwgbW9kdWxlTmFtZSkgfHwge30sXG4gICAgICAgICAgICAgICAgICAgIHNoRXhwb3J0cyA9IHNoaW0uZXhwb3J0cztcblxuICAgICAgICAgICAgICAgIHRha2VHbG9iYWxRdWV1ZSgpO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGRlZlF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzID0gZGVmUXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NbMF0gPSBtb2R1bGVOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiBhbHJlYWR5IGZvdW5kIGFuIGFub255bW91cyBtb2R1bGUgYW5kIGJvdW5kIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RvIHRoaXMgbmFtZSwgdGhlbiB0aGlzIGlzIHNvbWUgb3RoZXIgYW5vbiBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vd2FpdGluZyBmb3IgaXRzIGNvbXBsZXRlTG9hZCB0byBmaXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gbW9kdWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9Gb3VuZCBtYXRjaGluZyBkZWZpbmUgY2FsbCBmb3IgdGhpcyBzY3JpcHQhXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYWxsR2V0TW9kdWxlKGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250ZXh0LmRlZlF1ZXVlTWFwID0ge307XG5cbiAgICAgICAgICAgICAgICAvL0RvIHRoaXMgYWZ0ZXIgdGhlIGN5Y2xlIG9mIGNhbGxHZXRNb2R1bGUgaW4gY2FzZSB0aGUgcmVzdWx0XG4gICAgICAgICAgICAgICAgLy9vZiB0aG9zZSBjYWxscy9pbml0IGNhbGxzIGNoYW5nZXMgdGhlIHJlZ2lzdHJ5LlxuICAgICAgICAgICAgICAgIG1vZCA9IGdldE93bihyZWdpc3RyeSwgbW9kdWxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kICYmICFoYXNQcm9wKGRlZmluZWQsIG1vZHVsZU5hbWUpICYmIG1vZCAmJiAhbW9kLmluaXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmVuZm9yY2VEZWZpbmUgJiYgKCFzaEV4cG9ydHMgfHwgIWdldEdsb2JhbChzaEV4cG9ydHMpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1BhdGhGYWxsYmFjayhtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uRXJyb3IobWFrZUVycm9yKCdub2RlZmluZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTm8gZGVmaW5lIGNhbGwgZm9yICcgKyBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVOYW1lXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9BIHNjcmlwdCB0aGF0IGRvZXMgbm90IGNhbGwgZGVmaW5lKCksIHNvIGp1c3Qgc2ltdWxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlIGNhbGwgZm9yIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEdldE1vZHVsZShbbW9kdWxlTmFtZSwgKHNoaW0uZGVwcyB8fCBbXSksIHNoaW0uZXhwb3J0c0ZuXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaGVja0xvYWRlZCgpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb252ZXJ0cyBhIG1vZHVsZSBuYW1lIHRvIGEgZmlsZSBwYXRoLiBTdXBwb3J0cyBjYXNlcyB3aGVyZVxuICAgICAgICAgICAgICogbW9kdWxlTmFtZSBtYXkgYWN0dWFsbHkgYmUganVzdCBhbiBVUkwuXG4gICAgICAgICAgICAgKiBOb3RlIHRoYXQgaXQgKipkb2VzIG5vdCoqIGNhbGwgbm9ybWFsaXplIG9uIHRoZSBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgICogaXQgaXMgYXNzdW1lZCB0byBoYXZlIGFscmVhZHkgYmVlbiBub3JtYWxpemVkLiBUaGlzIGlzIGFuXG4gICAgICAgICAgICAgKiBpbnRlcm5hbCBBUEksIG5vdCBhIHB1YmxpYyBvbmUuIFVzZSB0b1VybCBmb3IgdGhlIHB1YmxpYyBBUEkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG5hbWVUb1VybDogZnVuY3Rpb24gKG1vZHVsZU5hbWUsIGV4dCwgc2tpcEV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXRocywgc3ltcywgaSwgcGFyZW50TW9kdWxlLCB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFBhdGgsIGJ1bmRsZUlkLFxuICAgICAgICAgICAgICAgICAgICBwa2dNYWluID0gZ2V0T3duKGNvbmZpZy5wa2dzLCBtb2R1bGVOYW1lKTtcblxuICAgICAgICAgICAgICAgIGlmIChwa2dNYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgPSBwa2dNYWluO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJ1bmRsZUlkID0gZ2V0T3duKGJ1bmRsZXNNYXAsIG1vZHVsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJ1bmRsZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0Lm5hbWVUb1VybChidW5kbGVJZCwgZXh0LCBza2lwRXh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0lmIGEgY29sb24gaXMgaW4gdGhlIFVSTCwgaXQgaW5kaWNhdGVzIGEgcHJvdG9jb2wgaXMgdXNlZCBhbmQgaXQgaXMganVzdFxuICAgICAgICAgICAgICAgIC8vYW4gVVJMIHRvIGEgZmlsZSwgb3IgaWYgaXQgc3RhcnRzIHdpdGggYSBzbGFzaCwgY29udGFpbnMgYSBxdWVyeSBhcmcgKGkuZS4gPylcbiAgICAgICAgICAgICAgICAvL29yIGVuZHMgd2l0aCAuanMsIHRoZW4gYXNzdW1lIHRoZSB1c2VyIG1lYW50IHRvIHVzZSBhbiB1cmwgYW5kIG5vdCBhIG1vZHVsZSBpZC5cbiAgICAgICAgICAgICAgICAvL1RoZSBzbGFzaCBpcyBpbXBvcnRhbnQgZm9yIHByb3RvY29sLWxlc3MgVVJMcyBhcyB3ZWxsIGFzIGZ1bGwgcGF0aHMuXG4gICAgICAgICAgICAgICAgaWYgKHJlcS5qc0V4dFJlZ0V4cC50ZXN0KG1vZHVsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vSnVzdCBhIHBsYWluIHBhdGgsIG5vdCBtb2R1bGUgbmFtZSBsb29rdXAsIHNvIGp1c3QgcmV0dXJuIGl0LlxuICAgICAgICAgICAgICAgICAgICAvL0FkZCBleHRlbnNpb24gaWYgaXQgaXMgaW5jbHVkZWQuIFRoaXMgaXMgYSBiaXQgd29ua3ksIG9ubHkgbm9uLS5qcyB0aGluZ3MgcGFzc1xuICAgICAgICAgICAgICAgICAgICAvL2FuIGV4dGVuc2lvbiwgdGhpcyBtZXRob2QgcHJvYmFibHkgbmVlZHMgdG8gYmUgcmV3b3JrZWQuXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IG1vZHVsZU5hbWUgKyAoZXh0IHx8ICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL0EgbW9kdWxlIHRoYXQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgcGF0aC5cbiAgICAgICAgICAgICAgICAgICAgcGF0aHMgPSBjb25maWcucGF0aHM7XG5cbiAgICAgICAgICAgICAgICAgICAgc3ltcyA9IG1vZHVsZU5hbWUuc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgLy9Gb3IgZWFjaCBtb2R1bGUgbmFtZSBzZWdtZW50LCBzZWUgaWYgdGhlcmUgaXMgYSBwYXRoXG4gICAgICAgICAgICAgICAgICAgIC8vcmVnaXN0ZXJlZCBmb3IgaXQuIFN0YXJ0IHdpdGggbW9zdCBzcGVjaWZpYyBuYW1lXG4gICAgICAgICAgICAgICAgICAgIC8vYW5kIHdvcmsgdXAgZnJvbSBpdC5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gc3ltcy5sZW5ndGg7IGkgPiAwOyBpIC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE1vZHVsZSA9IHN5bXMuc2xpY2UoMCwgaSkuam9pbignLycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRQYXRoID0gZ2V0T3duKHBhdGhzLCBwYXJlbnRNb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIGFuIGFycmF5LCBpdCBtZWFucyB0aGVyZSBhcmUgYSBmZXcgY2hvaWNlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0Nob29zZSB0aGUgb25lIHRoYXQgaXMgZGVzaXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHBhcmVudFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFBhdGggPSBwYXJlbnRQYXRoWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeW1zLnNwbGljZSgwLCBpLCBwYXJlbnRQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vSm9pbiB0aGUgcGF0aCBwYXJ0cyB0b2dldGhlciwgdGhlbiBmaWd1cmUgb3V0IGlmIGJhc2VVcmwgaXMgbmVlZGVkLlxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBzeW1zLmpvaW4oJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9IChleHQgfHwgKC9eZGF0YVxcOnxeYmxvYlxcOnxcXD8vLnRlc3QodXJsKSB8fCBza2lwRXh0ID8gJycgOiAnLmpzJykpO1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSAodXJsLmNoYXJBdCgwKSA9PT0gJy8nIHx8IHVybC5tYXRjaCgvXltcXHdcXCtcXC5cXC1dKzovKSA/ICcnIDogY29uZmlnLmJhc2VVcmwpICsgdXJsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcudXJsQXJncyAmJiAhL15ibG9iXFw6Ly50ZXN0KHVybCkgP1xuICAgICAgICAgICAgICAgICAgICAgICB1cmwgKyBjb25maWcudXJsQXJncyhtb2R1bGVOYW1lLCB1cmwpIDogdXJsO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy9EZWxlZ2F0ZXMgdG8gcmVxLmxvYWQuIEJyb2tlbiBvdXQgYXMgYSBzZXBhcmF0ZSBmdW5jdGlvbiB0b1xuICAgICAgICAgICAgLy9hbGxvdyBvdmVycmlkaW5nIGluIHRoZSBvcHRpbWl6ZXIuXG4gICAgICAgICAgICBsb2FkOiBmdW5jdGlvbiAoaWQsIHVybCkge1xuICAgICAgICAgICAgICAgIHJlcS5sb2FkKGNvbnRleHQsIGlkLCB1cmwpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeGVjdXRlcyBhIG1vZHVsZSBjYWxsYmFjayBmdW5jdGlvbi4gQnJva2VuIG91dCBhcyBhIHNlcGFyYXRlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgKiBzb2xlbHkgdG8gYWxsb3cgdGhlIGJ1aWxkIHN5c3RlbSB0byBzZXF1ZW5jZSB0aGUgZmlsZXMgaW4gdGhlIGJ1aWx0XG4gICAgICAgICAgICAgKiBsYXllciBpbiB0aGUgcmlnaHQgc2VxdWVuY2UuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZXhlY0NiOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGFyZ3MsIGV4cG9ydHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoZXhwb3J0cywgYXJncyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNhbGxiYWNrIGZvciBzY3JpcHQgbG9hZHMsIHVzZWQgdG8gY2hlY2sgc3RhdHVzIG9mIGxvYWRpbmcuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtIHtFdmVudH0gZXZ0IHRoZSBldmVudCBmcm9tIHRoZSBicm93c2VyIGZvciB0aGUgc2NyaXB0XG4gICAgICAgICAgICAgKiB0aGF0IHdhcyBsb2FkZWQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9uU2NyaXB0TG9hZDogZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIC8vVXNpbmcgY3VycmVudFRhcmdldCBpbnN0ZWFkIG9mIHRhcmdldCBmb3IgRmlyZWZveCAyLjAncyBzYWtlLiBOb3RcbiAgICAgICAgICAgICAgICAvL2FsbCBvbGQgYnJvd3NlcnMgd2lsbCBiZSBzdXBwb3J0ZWQsIGJ1dCB0aGlzIG9uZSB3YXMgZWFzeSBlbm91Z2hcbiAgICAgICAgICAgICAgICAvL3RvIHN1cHBvcnQgYW5kIHN0aWxsIG1ha2VzIHNlbnNlLlxuICAgICAgICAgICAgICAgIGlmIChldnQudHlwZSA9PT0gJ2xvYWQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAocmVhZHlSZWdFeHAudGVzdCgoZXZ0LmN1cnJlbnRUYXJnZXQgfHwgZXZ0LnNyY0VsZW1lbnQpLnJlYWR5U3RhdGUpKSkge1xuICAgICAgICAgICAgICAgICAgICAvL1Jlc2V0IGludGVyYWN0aXZlIHNjcmlwdCBzbyBhIHNjcmlwdCBub2RlIGlzIG5vdCBoZWxkIG9udG8gZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vdG8gbG9uZy5cbiAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVTY3JpcHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUHVsbCBvdXQgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSBhbmQgdGhlIGNvbnRleHQuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZ2V0U2NyaXB0RGF0YShldnQpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmNvbXBsZXRlTG9hZChkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhbGxiYWNrIGZvciBzY3JpcHQgZXJyb3JzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvblNjcmlwdEVycm9yOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBnZXRTY3JpcHREYXRhKGV2dCk7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNQYXRoRmFsbGJhY2soZGF0YS5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZWFjaFByb3AocmVnaXN0cnksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZignX0ByJykgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoKHZhbHVlLmRlcE1hcHMsIGZ1bmN0aW9uKGRlcE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVwTWFwLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ3NjcmlwdGVycm9yJywgJ1NjcmlwdCBlcnJvciBmb3IgXCInICsgZGF0YS5pZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyZW50cy5sZW5ndGggP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiLCBuZWVkZWQgYnk6ICcgKyBwYXJlbnRzLmpvaW4oJywgJykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiJyksIGV2dCwgW2RhdGEuaWRdKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnRleHQucmVxdWlyZSA9IGNvbnRleHQubWFrZVJlcXVpcmUoKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFpbiBlbnRyeSBwb2ludC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBvbmx5IGFyZ3VtZW50IHRvIHJlcXVpcmUgaXMgYSBzdHJpbmcsIHRoZW4gdGhlIG1vZHVsZSB0aGF0XG4gICAgICogaXMgcmVwcmVzZW50ZWQgYnkgdGhhdCBzdHJpbmcgaXMgZmV0Y2hlZCBmb3IgdGhlIGFwcHJvcHJpYXRlIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgZmlyc3QgYXJndW1lbnQgaXMgYW4gYXJyYXksIHRoZW4gaXQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIGFycmF5XG4gICAgICogb2YgZGVwZW5kZW5jeSBzdHJpbmcgbmFtZXMgdG8gZmV0Y2guIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIGNhbGxiYWNrIGNhblxuICAgICAqIGJlIHNwZWNpZmllZCB0byBleGVjdXRlIHdoZW4gYWxsIG9mIHRob3NlIGRlcGVuZGVuY2llcyBhcmUgYXZhaWxhYmxlLlxuICAgICAqXG4gICAgICogTWFrZSBhIGxvY2FsIHJlcSB2YXJpYWJsZSB0byBoZWxwIENhamEgY29tcGxpYW5jZSAoaXQgYXNzdW1lcyB0aGluZ3NcbiAgICAgKiBvbiBhIHJlcXVpcmUgdGhhdCBhcmUgbm90IHN0YW5kYXJkaXplZCksIGFuZCB0byBnaXZlIGEgc2hvcnRcbiAgICAgKiBuYW1lIGZvciBtaW5pZmljYXRpb24vbG9jYWwgc2NvcGUgdXNlLlxuICAgICAqL1xuICAgIHJlcSA9IHJlcXVpcmVqcyA9IGZ1bmN0aW9uIChkZXBzLCBjYWxsYmFjaywgZXJyYmFjaywgb3B0aW9uYWwpIHtcblxuICAgICAgICAvL0ZpbmQgdGhlIHJpZ2h0IGNvbnRleHQsIHVzZSBkZWZhdWx0XG4gICAgICAgIHZhciBjb250ZXh0LCBjb25maWcsXG4gICAgICAgICAgICBjb250ZXh0TmFtZSA9IGRlZkNvbnRleHROYW1lO1xuXG4gICAgICAgIC8vIERldGVybWluZSBpZiBoYXZlIGNvbmZpZyBvYmplY3QgaW4gdGhlIGNhbGwuXG4gICAgICAgIGlmICghaXNBcnJheShkZXBzKSAmJiB0eXBlb2YgZGVwcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIGRlcHMgaXMgYSBjb25maWcgb2JqZWN0XG4gICAgICAgICAgICBjb25maWcgPSBkZXBzO1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gQWRqdXN0IGFyZ3MgaWYgdGhlcmUgYXJlIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgIGRlcHMgPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGVycmJhY2s7XG4gICAgICAgICAgICAgICAgZXJyYmFjayA9IG9wdGlvbmFsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5jb250ZXh0KSB7XG4gICAgICAgICAgICBjb250ZXh0TmFtZSA9IGNvbmZpZy5jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dCA9IGdldE93bihjb250ZXh0cywgY29udGV4dE5hbWUpO1xuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0c1tjb250ZXh0TmFtZV0gPSByZXEucy5uZXdDb250ZXh0KGNvbnRleHROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbnRleHQuY29uZmlndXJlKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udGV4dC5yZXF1aXJlKGRlcHMsIGNhbGxiYWNrLCBlcnJiYWNrKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3VwcG9ydCByZXF1aXJlLmNvbmZpZygpIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGNvb3BlcmF0ZSB3aXRoIG90aGVyXG4gICAgICogQU1EIGxvYWRlcnMgb24gZ2xvYmFsbHkgYWdyZWVkIG5hbWVzLlxuICAgICAqL1xuICAgIHJlcS5jb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIHJldHVybiByZXEoY29uZmlnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBzb21ldGhpbmcgYWZ0ZXIgdGhlIGN1cnJlbnQgdGlja1xuICAgICAqIG9mIHRoZSBldmVudCBsb29wLiBPdmVycmlkZSBmb3Igb3RoZXIgZW52c1xuICAgICAqIHRoYXQgaGF2ZSBhIGJldHRlciBzb2x1dGlvbiB0aGFuIHNldFRpbWVvdXQuXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgbGF0ZXIuXG4gICAgICovXG4gICAgcmVxLm5leHRUaWNrID0gdHlwZW9mIHNldFRpbWVvdXQgIT09ICd1bmRlZmluZWQnID8gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDQpO1xuICAgIH0gOiBmdW5jdGlvbiAoZm4pIHsgZm4oKTsgfTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9ydCByZXF1aXJlIGFzIGEgZ2xvYmFsLCBidXQgb25seSBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICAgICAqL1xuICAgIGlmICghcmVxdWlyZSkge1xuICAgICAgICByZXF1aXJlID0gcmVxO1xuICAgIH1cblxuICAgIHJlcS52ZXJzaW9uID0gdmVyc2lvbjtcblxuICAgIC8vVXNlZCB0byBmaWx0ZXIgb3V0IGRlcGVuZGVuY2llcyB0aGF0IGFyZSBhbHJlYWR5IHBhdGhzLlxuICAgIHJlcS5qc0V4dFJlZ0V4cCA9IC9eXFwvfDp8XFw/fFxcLmpzJC87XG4gICAgcmVxLmlzQnJvd3NlciA9IGlzQnJvd3NlcjtcbiAgICBzID0gcmVxLnMgPSB7XG4gICAgICAgIGNvbnRleHRzOiBjb250ZXh0cyxcbiAgICAgICAgbmV3Q29udGV4dDogbmV3Q29udGV4dFxuICAgIH07XG5cbiAgICAvL0NyZWF0ZSBkZWZhdWx0IGNvbnRleHQuXG4gICAgcmVxKHt9KTtcblxuICAgIC8vRXhwb3J0cyBzb21lIGNvbnRleHQtc2Vuc2l0aXZlIG1ldGhvZHMgb24gZ2xvYmFsIHJlcXVpcmUuXG4gICAgZWFjaChbXG4gICAgICAgICd0b1VybCcsXG4gICAgICAgICd1bmRlZicsXG4gICAgICAgICdkZWZpbmVkJyxcbiAgICAgICAgJ3NwZWNpZmllZCdcbiAgICBdLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAvL1JlZmVyZW5jZSBmcm9tIGNvbnRleHRzIGluc3RlYWQgb2YgZWFybHkgYmluZGluZyB0byBkZWZhdWx0IGNvbnRleHQsXG4gICAgICAgIC8vc28gdGhhdCBkdXJpbmcgYnVpbGRzLCB0aGUgbGF0ZXN0IGluc3RhbmNlIG9mIHRoZSBkZWZhdWx0IGNvbnRleHRcbiAgICAgICAgLy93aXRoIGl0cyBjb25maWcgZ2V0cyB1c2VkLlxuICAgICAgICByZXFbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3R4ID0gY29udGV4dHNbZGVmQ29udGV4dE5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGN0eC5yZXF1aXJlW3Byb3BdLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgICAgaGVhZCA9IHMuaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIC8vSWYgQkFTRSB0YWcgaXMgaW4gcGxheSwgdXNpbmcgYXBwZW5kQ2hpbGQgaXMgYSBwcm9ibGVtIGZvciBJRTYuXG4gICAgICAgIC8vV2hlbiB0aGF0IGJyb3dzZXIgZGllcywgdGhpcyBjYW4gYmUgcmVtb3ZlZC4gRGV0YWlscyBpbiB0aGlzIGpRdWVyeSBidWc6XG4gICAgICAgIC8vaHR0cDovL2Rldi5qcXVlcnkuY29tL3RpY2tldC8yNzA5XG4gICAgICAgIGJhc2VFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKVswXTtcbiAgICAgICAgaWYgKGJhc2VFbGVtZW50KSB7XG4gICAgICAgICAgICBoZWFkID0gcy5oZWFkID0gYmFzZUVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFueSBlcnJvcnMgdGhhdCByZXF1aXJlIGV4cGxpY2l0bHkgZ2VuZXJhdGVzIHdpbGwgYmUgcGFzc2VkIHRvIHRoaXNcbiAgICAgKiBmdW5jdGlvbi4gSW50ZXJjZXB0L292ZXJyaWRlIGl0IGlmIHlvdSB3YW50IGN1c3RvbSBlcnJvciBoYW5kbGluZy5cbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgdGhlIGVycm9yIG9iamVjdC5cbiAgICAgKi9cbiAgICByZXEub25FcnJvciA9IGRlZmF1bHRPbkVycm9yO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgbm9kZSBmb3IgdGhlIGxvYWQgY29tbWFuZC4gT25seSB1c2VkIGluIGJyb3dzZXIgZW52cy5cbiAgICAgKi9cbiAgICByZXEuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uIChjb25maWcsIG1vZHVsZU5hbWUsIHVybCkge1xuICAgICAgICB2YXIgbm9kZSA9IGNvbmZpZy54aHRtbCA/XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2h0bWw6c2NyaXB0JykgOlxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBub2RlLnR5cGUgPSBjb25maWcuc2NyaXB0VHlwZSB8fCAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgbm9kZS5jaGFyc2V0ID0gJ3V0Zi04JztcbiAgICAgICAgbm9kZS5hc3luYyA9IHRydWU7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIHRoZSByZXF1ZXN0IHRvIGxvYWQgYSBtb2R1bGUgZm9yIHRoZSBicm93c2VyIGNhc2UuXG4gICAgICogTWFrZSB0aGlzIGEgc2VwYXJhdGUgZnVuY3Rpb24gdG8gYWxsb3cgb3RoZXIgZW52aXJvbm1lbnRzXG4gICAgICogdG8gb3ZlcnJpZGUgaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCB0aGUgcmVxdWlyZSBjb250ZXh0IHRvIGZpbmQgc3RhdGUuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1vZHVsZU5hbWUgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdXJsIHRoZSBVUkwgdG8gdGhlIG1vZHVsZS5cbiAgICAgKi9cbiAgICByZXEubG9hZCA9IGZ1bmN0aW9uIChjb250ZXh0LCBtb2R1bGVOYW1lLCB1cmwpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IChjb250ZXh0ICYmIGNvbnRleHQuY29uZmlnKSB8fCB7fSxcbiAgICAgICAgICAgIG5vZGU7XG4gICAgICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIC8vSW4gdGhlIGJyb3dzZXIgc28gdXNlIGEgc2NyaXB0IHRhZ1xuICAgICAgICAgICAgbm9kZSA9IHJlcS5jcmVhdGVOb2RlKGNvbmZpZywgbW9kdWxlTmFtZSwgdXJsKTtcblxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZWNvbnRleHQnLCBjb250ZXh0LmNvbnRleHROYW1lKTtcbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVtb2R1bGUnLCBtb2R1bGVOYW1lKTtcblxuICAgICAgICAgICAgLy9TZXQgdXAgbG9hZCBsaXN0ZW5lci4gVGVzdCBhdHRhY2hFdmVudCBmaXJzdCBiZWNhdXNlIElFOSBoYXNcbiAgICAgICAgICAgIC8vYSBzdWJ0bGUgaXNzdWUgaW4gaXRzIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHNjcmlwdCBvbmxvYWQgZmlyaW5nc1xuICAgICAgICAgICAgLy90aGF0IGRvIG5vdCBtYXRjaCB0aGUgYmVoYXZpb3Igb2YgYWxsIG90aGVyIGJyb3dzZXJzIHdpdGhcbiAgICAgICAgICAgIC8vYWRkRXZlbnRMaXN0ZW5lciBzdXBwb3J0LCB3aGljaCBmaXJlIHRoZSBvbmxvYWQgZXZlbnQgZm9yIGFcbiAgICAgICAgICAgIC8vc2NyaXB0IHJpZ2h0IGFmdGVyIHRoZSBzY3JpcHQgZXhlY3V0aW9uLiBTZWU6XG4gICAgICAgICAgICAvL2h0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvNjQ4MDU3L3NjcmlwdC1vbmxvYWQtZXZlbnQtaXMtbm90LWZpcmVkLWltbWVkaWF0ZWx5LWFmdGVyLXNjcmlwdC1leGVjdXRpb25cbiAgICAgICAgICAgIC8vVU5GT1JUVU5BVEVMWSBPcGVyYSBpbXBsZW1lbnRzIGF0dGFjaEV2ZW50IGJ1dCBkb2VzIG5vdCBmb2xsb3cgdGhlIHNjcmlwdFxuICAgICAgICAgICAgLy9zY3JpcHQgZXhlY3V0aW9uIG1vZGUuXG4gICAgICAgICAgICBpZiAobm9kZS5hdHRhY2hFdmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIG5vZGUuYXR0YWNoRXZlbnQgaXMgYXJ0aWZpY2lhbGx5IGFkZGVkIGJ5IGN1c3RvbSBzY3JpcHQgb3JcbiAgICAgICAgICAgICAgICAgICAgLy9uYXRpdmVseSBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuICAgICAgICAgICAgICAgICAgICAvL3JlYWQgaHR0cHM6Ly9naXRodWIuY29tL3JlcXVpcmVqcy9yZXF1aXJlanMvaXNzdWVzLzE4N1xuICAgICAgICAgICAgICAgICAgICAvL2lmIHdlIGNhbiBOT1QgZmluZCBbbmF0aXZlIGNvZGVdIHRoZW4gaXQgbXVzdCBOT1QgbmF0aXZlbHkgc3VwcG9ydGVkLlxuICAgICAgICAgICAgICAgICAgICAvL2luIElFOCwgbm9kZS5hdHRhY2hFdmVudCBkb2VzIG5vdCBoYXZlIHRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgLy9Ob3RlIHRoZSB0ZXN0IGZvciBcIltuYXRpdmUgY29kZVwiIHdpdGggbm8gY2xvc2luZyBicmFjZSwgc2VlOlxuICAgICAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9yZXF1aXJlanMvcmVxdWlyZWpzL2lzc3Vlcy8yNzNcbiAgICAgICAgICAgICAgICAgICAgIShub2RlLmF0dGFjaEV2ZW50LnRvU3RyaW5nICYmIG5vZGUuYXR0YWNoRXZlbnQudG9TdHJpbmcoKS5pbmRleE9mKCdbbmF0aXZlIGNvZGUnKSA8IDApICYmXG4gICAgICAgICAgICAgICAgICAgICFpc09wZXJhKSB7XG4gICAgICAgICAgICAgICAgLy9Qcm9iYWJseSBJRS4gSUUgKGF0IGxlYXN0IDYtOCkgZG8gbm90IGZpcmVcbiAgICAgICAgICAgICAgICAvL3NjcmlwdCBvbmxvYWQgcmlnaHQgYWZ0ZXIgZXhlY3V0aW5nIHRoZSBzY3JpcHQsIHNvXG4gICAgICAgICAgICAgICAgLy93ZSBjYW5ub3QgdGllIHRoZSBhbm9ueW1vdXMgZGVmaW5lIGNhbGwgdG8gYSBuYW1lLlxuICAgICAgICAgICAgICAgIC8vSG93ZXZlciwgSUUgcmVwb3J0cyB0aGUgc2NyaXB0IGFzIGJlaW5nIGluICdpbnRlcmFjdGl2ZSdcbiAgICAgICAgICAgICAgICAvL3JlYWR5U3RhdGUgYXQgdGhlIHRpbWUgb2YgdGhlIGRlZmluZSBjYWxsLlxuICAgICAgICAgICAgICAgIHVzZUludGVyYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIG5vZGUuYXR0YWNoRXZlbnQoJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGNvbnRleHQub25TY3JpcHRMb2FkKTtcbiAgICAgICAgICAgICAgICAvL0l0IHdvdWxkIGJlIGdyZWF0IHRvIGFkZCBhbiBlcnJvciBoYW5kbGVyIGhlcmUgdG8gY2F0Y2hcbiAgICAgICAgICAgICAgICAvLzQwNHMgaW4gSUU5Ky4gSG93ZXZlciwgb25yZWFkeXN0YXRlY2hhbmdlIHdpbGwgZmlyZSBiZWZvcmVcbiAgICAgICAgICAgICAgICAvL3RoZSBlcnJvciBoYW5kbGVyLCBzbyB0aGF0IGRvZXMgbm90IGhlbHAuIElmIGFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgICAgICAgICAvL2lzIHVzZWQsIHRoZW4gSUUgd2lsbCBmaXJlIGVycm9yIGJlZm9yZSBsb2FkLCBidXQgd2UgY2Fubm90XG4gICAgICAgICAgICAgICAgLy91c2UgdGhhdCBwYXRod2F5IGdpdmVuIHRoZSBjb25uZWN0Lm1pY3Jvc29mdC5jb20gaXNzdWVcbiAgICAgICAgICAgICAgICAvL21lbnRpb25lZCBhYm92ZSBhYm91dCBub3QgZG9pbmcgdGhlICdzY3JpcHQgZXhlY3V0ZSxcbiAgICAgICAgICAgICAgICAvL3RoZW4gZmlyZSB0aGUgc2NyaXB0IGxvYWQgZXZlbnQgbGlzdGVuZXIgYmVmb3JlIGV4ZWN1dGVcbiAgICAgICAgICAgICAgICAvL25leHQgc2NyaXB0JyB0aGF0IG90aGVyIGJyb3dzZXJzIGRvLlxuICAgICAgICAgICAgICAgIC8vQmVzdCBob3BlOiBJRTEwIGZpeGVzIHRoZSBpc3N1ZXMsXG4gICAgICAgICAgICAgICAgLy9hbmQgdGhlbiBkZXN0cm95cyBhbGwgaW5zdGFsbHMgb2YgSUUgNi05LlxuICAgICAgICAgICAgICAgIC8vbm9kZS5hdHRhY2hFdmVudCgnb25lcnJvcicsIGNvbnRleHQub25TY3JpcHRFcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGNvbnRleHQub25TY3JpcHRMb2FkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGNvbnRleHQub25TY3JpcHRFcnJvciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5zcmMgPSB1cmw7XG5cbiAgICAgICAgICAgIC8vQ2FsbGluZyBvbk5vZGVDcmVhdGVkIGFmdGVyIGFsbCBwcm9wZXJ0aWVzIG9uIHRoZSBub2RlIGhhdmUgYmVlblxuICAgICAgICAgICAgLy9zZXQsIGJ1dCBiZWZvcmUgaXQgaXMgcGxhY2VkIGluIHRoZSBET00uXG4gICAgICAgICAgICBpZiAoY29uZmlnLm9uTm9kZUNyZWF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb25maWcub25Ob2RlQ3JlYXRlZChub2RlLCBjb25maWcsIG1vZHVsZU5hbWUsIHVybCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vRm9yIHNvbWUgY2FjaGUgY2FzZXMgaW4gSUUgNi04LCB0aGUgc2NyaXB0IGV4ZWN1dGVzIGJlZm9yZSB0aGUgZW5kXG4gICAgICAgICAgICAvL29mIHRoZSBhcHBlbmRDaGlsZCBleGVjdXRpb24sIHNvIHRvIHRpZSBhbiBhbm9ueW1vdXMgZGVmaW5lXG4gICAgICAgICAgICAvL2NhbGwgdG8gdGhlIG1vZHVsZSBuYW1lICh3aGljaCBpcyBzdG9yZWQgb24gdGhlIG5vZGUpLCBob2xkIG9uXG4gICAgICAgICAgICAvL3RvIGEgcmVmZXJlbmNlIHRvIHRoaXMgbm9kZSwgYnV0IGNsZWFyIGFmdGVyIHRoZSBET00gaW5zZXJ0aW9uLlxuICAgICAgICAgICAgY3VycmVudGx5QWRkaW5nU2NyaXB0ID0gbm9kZTtcbiAgICAgICAgICAgIGlmIChiYXNlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKG5vZGUsIGJhc2VFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnRseUFkZGluZ1NjcmlwdCA9IG51bGw7XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzV2ViV29ya2VyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vSW4gYSB3ZWIgd29ya2VyLCB1c2UgaW1wb3J0U2NyaXB0cy4gVGhpcyBpcyBub3QgYSB2ZXJ5XG4gICAgICAgICAgICAgICAgLy9lZmZpY2llbnQgdXNlIG9mIGltcG9ydFNjcmlwdHMsIGltcG9ydFNjcmlwdHMgd2lsbCBibG9jayB1bnRpbFxuICAgICAgICAgICAgICAgIC8vaXRzIHNjcmlwdCBpcyBkb3dubG9hZGVkIGFuZCBldmFsdWF0ZWQuIEhvd2V2ZXIsIGlmIHdlYiB3b3JrZXJzXG4gICAgICAgICAgICAgICAgLy9hcmUgaW4gcGxheSwgdGhlIGV4cGVjdGF0aW9uIGlzIHRoYXQgYSBidWlsZCBoYXMgYmVlbiBkb25lIHNvXG4gICAgICAgICAgICAgICAgLy90aGF0IG9ubHkgb25lIHNjcmlwdCBuZWVkcyB0byBiZSBsb2FkZWQgYW55d2F5LiBUaGlzIG1heSBuZWVkXG4gICAgICAgICAgICAgICAgLy90byBiZSByZWV2YWx1YXRlZCBpZiBvdGhlciB1c2UgY2FzZXMgYmVjb21lIGNvbW1vbi5cblxuICAgICAgICAgICAgICAgIC8vIFBvc3QgYSB0YXNrIHRvIHRoZSBldmVudCBsb29wIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIFdlYktpdFxuICAgICAgICAgICAgICAgIC8vIHdoZXJlIHRoZSB3b3JrZXIgZ2V0cyBnYXJiYWdlLWNvbGxlY3RlZCBhZnRlciBjYWxsaW5nXG4gICAgICAgICAgICAgICAgLy8gaW1wb3J0U2NyaXB0cygpOiBodHRwczovL3dlYmtpdC5vcmcvYi8xNTMzMTdcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge30sIDApO1xuICAgICAgICAgICAgICAgIGltcG9ydFNjcmlwdHModXJsKTtcblxuICAgICAgICAgICAgICAgIC8vQWNjb3VudCBmb3IgYW5vbnltb3VzIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNvbXBsZXRlTG9hZChtb2R1bGVOYW1lKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm9uRXJyb3IobWFrZUVycm9yKCdpbXBvcnRzY3JpcHRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ltcG9ydFNjcmlwdHMgZmFpbGVkIGZvciAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgKyAnIGF0ICcgKyB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVOYW1lXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEludGVyYWN0aXZlU2NyaXB0KCkge1xuICAgICAgICBpZiAoaW50ZXJhY3RpdmVTY3JpcHQgJiYgaW50ZXJhY3RpdmVTY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgICAgICAgcmV0dXJuIGludGVyYWN0aXZlU2NyaXB0O1xuICAgICAgICB9XG5cbiAgICAgICAgZWFjaFJldmVyc2Uoc2NyaXB0cygpLCBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgICAgICAgICBpZiAoc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdpbnRlcmFjdGl2ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGludGVyYWN0aXZlU2NyaXB0ID0gc2NyaXB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnRlcmFjdGl2ZVNjcmlwdDtcbiAgICB9XG5cbiAgICAvL0xvb2sgZm9yIGEgZGF0YS1tYWluIHNjcmlwdCBhdHRyaWJ1dGUsIHdoaWNoIGNvdWxkIGFsc28gYWRqdXN0IHRoZSBiYXNlVXJsLlxuICAgIGlmIChpc0Jyb3dzZXIgJiYgIWNmZy5za2lwRGF0YU1haW4pIHtcbiAgICAgICAgLy9GaWd1cmUgb3V0IGJhc2VVcmwuIEdldCBpdCBmcm9tIHRoZSBzY3JpcHQgdGFnIHdpdGggcmVxdWlyZS5qcyBpbiBpdC5cbiAgICAgICAgZWFjaFJldmVyc2Uoc2NyaXB0cygpLCBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgICAgICAgICAvL1NldCB0aGUgJ2hlYWQnIHdoZXJlIHdlIGNhbiBhcHBlbmQgY2hpbGRyZW4gYnlcbiAgICAgICAgICAgIC8vdXNpbmcgdGhlIHNjcmlwdCdzIHBhcmVudC5cbiAgICAgICAgICAgIGlmICghaGVhZCkge1xuICAgICAgICAgICAgICAgIGhlYWQgPSBzY3JpcHQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Mb29rIGZvciBhIGRhdGEtbWFpbiBhdHRyaWJ1dGUgdG8gc2V0IG1haW4gc2NyaXB0IGZvciB0aGUgcGFnZVxuICAgICAgICAgICAgLy90byBsb2FkLiBJZiBpdCBpcyB0aGVyZSwgdGhlIHBhdGggdG8gZGF0YSBtYWluIGJlY29tZXMgdGhlXG4gICAgICAgICAgICAvL2Jhc2VVcmwsIGlmIGl0IGlzIG5vdCBhbHJlYWR5IHNldC5cbiAgICAgICAgICAgIGRhdGFNYWluID0gc2NyaXB0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYWluJyk7XG4gICAgICAgICAgICBpZiAoZGF0YU1haW4pIHtcbiAgICAgICAgICAgICAgICAvL1ByZXNlcnZlIGRhdGFNYWluIGluIGNhc2UgaXQgaXMgYSBwYXRoIChpLmUuIGNvbnRhaW5zICc/JylcbiAgICAgICAgICAgICAgICBtYWluU2NyaXB0ID0gZGF0YU1haW47XG5cbiAgICAgICAgICAgICAgICAvL1NldCBmaW5hbCBiYXNlVXJsIGlmIHRoZXJlIGlzIG5vdCBhbHJlYWR5IGFuIGV4cGxpY2l0IG9uZSxcbiAgICAgICAgICAgICAgICAvL2J1dCBvbmx5IGRvIHNvIGlmIHRoZSBkYXRhLW1haW4gdmFsdWUgaXMgbm90IGEgbG9hZGVyIHBsdWdpblxuICAgICAgICAgICAgICAgIC8vbW9kdWxlIElELlxuICAgICAgICAgICAgICAgIGlmICghY2ZnLmJhc2VVcmwgJiYgbWFpblNjcmlwdC5pbmRleE9mKCchJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vUHVsbCBvZmYgdGhlIGRpcmVjdG9yeSBvZiBkYXRhLW1haW4gZm9yIHVzZSBhcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy9iYXNlVXJsLlxuICAgICAgICAgICAgICAgICAgICBzcmMgPSBtYWluU2NyaXB0LnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5TY3JpcHQgPSBzcmMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHN1YlBhdGggPSBzcmMubGVuZ3RoID8gc3JjLmpvaW4oJy8nKSAgKyAnLycgOiAnLi8nO1xuXG4gICAgICAgICAgICAgICAgICAgIGNmZy5iYXNlVXJsID0gc3ViUGF0aDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1N0cmlwIG9mZiBhbnkgdHJhaWxpbmcgLmpzIHNpbmNlIG1haW5TY3JpcHQgaXMgbm93XG4gICAgICAgICAgICAgICAgLy9saWtlIGEgbW9kdWxlIG5hbWUuXG4gICAgICAgICAgICAgICAgbWFpblNjcmlwdCA9IG1haW5TY3JpcHQucmVwbGFjZShqc1N1ZmZpeFJlZ0V4cCwgJycpO1xuXG4gICAgICAgICAgICAgICAgLy9JZiBtYWluU2NyaXB0IGlzIHN0aWxsIGEgcGF0aCwgZmFsbCBiYWNrIHRvIGRhdGFNYWluXG4gICAgICAgICAgICAgICAgaWYgKHJlcS5qc0V4dFJlZ0V4cC50ZXN0KG1haW5TY3JpcHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5TY3JpcHQgPSBkYXRhTWFpbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1B1dCB0aGUgZGF0YS1tYWluIHNjcmlwdCBpbiB0aGUgZmlsZXMgdG8gbG9hZC5cbiAgICAgICAgICAgICAgICBjZmcuZGVwcyA9IGNmZy5kZXBzID8gY2ZnLmRlcHMuY29uY2F0KG1haW5TY3JpcHQpIDogW21haW5TY3JpcHRdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBmdW5jdGlvbiB0aGF0IGhhbmRsZXMgZGVmaW5pdGlvbnMgb2YgbW9kdWxlcy4gRGlmZmVycyBmcm9tXG4gICAgICogcmVxdWlyZSgpIGluIHRoYXQgYSBzdHJpbmcgZm9yIHRoZSBtb2R1bGUgc2hvdWxkIGJlIHRoZSBmaXJzdCBhcmd1bWVudCxcbiAgICAgKiBhbmQgdGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgZGVwZW5kZW5jaWVzIGFyZSBsb2FkZWQgc2hvdWxkXG4gICAgICogcmV0dXJuIGEgdmFsdWUgdG8gZGVmaW5lIHRoZSBtb2R1bGUgY29ycmVzcG9uZGluZyB0byB0aGUgZmlyc3QgYXJndW1lbnQnc1xuICAgICAqIG5hbWUuXG4gICAgICovXG4gICAgZGVmaW5lID0gZnVuY3Rpb24gKG5hbWUsIGRlcHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBub2RlLCBjb250ZXh0O1xuXG4gICAgICAgIC8vQWxsb3cgZm9yIGFub255bW91cyBtb2R1bGVzXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vQWRqdXN0IGFyZ3MgYXBwcm9wcmlhdGVseVxuICAgICAgICAgICAgY2FsbGJhY2sgPSBkZXBzO1xuICAgICAgICAgICAgZGVwcyA9IG5hbWU7XG4gICAgICAgICAgICBuYW1lID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVGhpcyBtb2R1bGUgbWF5IG5vdCBoYXZlIGRlcGVuZGVuY2llc1xuICAgICAgICBpZiAoIWlzQXJyYXkoZGVwcykpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZGVwcztcbiAgICAgICAgICAgIGRlcHMgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9JZiBubyBuYW1lLCBhbmQgY2FsbGJhY2sgaXMgYSBmdW5jdGlvbiwgdGhlbiBmaWd1cmUgb3V0IGlmIGl0IGFcbiAgICAgICAgLy9Db21tb25KUyB0aGluZyB3aXRoIGRlcGVuZGVuY2llcy5cbiAgICAgICAgaWYgKCFkZXBzICYmIGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICBkZXBzID0gW107XG4gICAgICAgICAgICAvL1JlbW92ZSBjb21tZW50cyBmcm9tIHRoZSBjYWxsYmFjayBzdHJpbmcsXG4gICAgICAgICAgICAvL2xvb2sgZm9yIHJlcXVpcmUgY2FsbHMsIGFuZCBwdWxsIHRoZW0gaW50byB0aGUgZGVwZW5kZW5jaWVzLFxuICAgICAgICAgICAgLy9idXQgb25seSBpZiB0aGVyZSBhcmUgZnVuY3Rpb24gYXJncy5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShjb21tZW50UmVnRXhwLCBjb21tZW50UmVwbGFjZSlcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoY2pzUmVxdWlyZVJlZ0V4cCwgZnVuY3Rpb24gKG1hdGNoLCBkZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHMucHVzaChkZXApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vTWF5IGJlIGEgQ29tbW9uSlMgdGhpbmcgZXZlbiB3aXRob3V0IHJlcXVpcmUgY2FsbHMsIGJ1dCBzdGlsbFxuICAgICAgICAgICAgICAgIC8vY291bGQgdXNlIGV4cG9ydHMsIGFuZCBtb2R1bGUuIEF2b2lkIGRvaW5nIGV4cG9ydHMgYW5kIG1vZHVsZVxuICAgICAgICAgICAgICAgIC8vd29yayB0aG91Z2ggaWYgaXQganVzdCBuZWVkcyByZXF1aXJlLlxuICAgICAgICAgICAgICAgIC8vUkVRVUlSRVMgdGhlIGZ1bmN0aW9uIHRvIGV4cGVjdCB0aGUgQ29tbW9uSlMgdmFyaWFibGVzIGluIHRoZVxuICAgICAgICAgICAgICAgIC8vb3JkZXIgbGlzdGVkIGJlbG93LlxuICAgICAgICAgICAgICAgIGRlcHMgPSAoY2FsbGJhY2subGVuZ3RoID09PSAxID8gWydyZXF1aXJlJ10gOiBbJ3JlcXVpcmUnLCAnZXhwb3J0cycsICdtb2R1bGUnXSkuY29uY2F0KGRlcHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9JZiBpbiBJRSA2LTggYW5kIGhpdCBhbiBhbm9ueW1vdXMgZGVmaW5lKCkgY2FsbCwgZG8gdGhlIGludGVyYWN0aXZlXG4gICAgICAgIC8vd29yay5cbiAgICAgICAgaWYgKHVzZUludGVyYWN0aXZlKSB7XG4gICAgICAgICAgICBub2RlID0gY3VycmVudGx5QWRkaW5nU2NyaXB0IHx8IGdldEludGVyYWN0aXZlU2NyaXB0KCk7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBuYW1lID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZW1vZHVsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gY29udGV4dHNbbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZWNvbnRleHQnKV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0Fsd2F5cyBzYXZlIG9mZiBldmFsdWF0aW5nIHRoZSBkZWYgY2FsbCB1bnRpbCB0aGUgc2NyaXB0IG9ubG9hZCBoYW5kbGVyLlxuICAgICAgICAvL1RoaXMgYWxsb3dzIG11bHRpcGxlIG1vZHVsZXMgdG8gYmUgaW4gYSBmaWxlIHdpdGhvdXQgcHJlbWF0dXJlbHlcbiAgICAgICAgLy90cmFjaW5nIGRlcGVuZGVuY2llcywgYW5kIGFsbG93cyBmb3IgYW5vbnltb3VzIG1vZHVsZSBzdXBwb3J0LFxuICAgICAgICAvL3doZXJlIHRoZSBtb2R1bGUgbmFtZSBpcyBub3Qga25vd24gdW50aWwgdGhlIHNjcmlwdCBvbmxvYWQgZXZlbnRcbiAgICAgICAgLy9vY2N1cnMuIElmIG5vIGNvbnRleHQsIHVzZSB0aGUgZ2xvYmFsIHF1ZXVlLCBhbmQgZ2V0IGl0IHByb2Nlc3NlZFxuICAgICAgICAvL2luIHRoZSBvbnNjcmlwdCBsb2FkIGNhbGxiYWNrLlxuICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dC5kZWZRdWV1ZS5wdXNoKFtuYW1lLCBkZXBzLCBjYWxsYmFja10pO1xuICAgICAgICAgICAgY29udGV4dC5kZWZRdWV1ZU1hcFtuYW1lXSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWxEZWZRdWV1ZS5wdXNoKFtuYW1lLCBkZXBzLCBjYWxsYmFja10pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRlZmluZS5hbWQgPSB7XG4gICAgICAgIGpRdWVyeTogdHJ1ZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgdGV4dC4gTm9ybWFsbHkganVzdCB1c2VzIGV2YWwsIGJ1dCBjYW4gYmUgbW9kaWZpZWRcbiAgICAgKiB0byB1c2UgYSBiZXR0ZXIsIGVudmlyb25tZW50LXNwZWNpZmljIGNhbGwuIE9ubHkgdXNlZCBmb3IgdHJhbnNwaWxpbmdcbiAgICAgKiBsb2FkZXIgcGx1Z2lucywgbm90IGZvciBwbGFpbiBKUyBtb2R1bGVzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IHRoZSB0ZXh0IHRvIGV4ZWN1dGUvZXZhbHVhdGUuXG4gICAgICovXG4gICAgcmVxLmV4ZWMgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICAvKmpzbGludCBldmlsOiB0cnVlICovXG4gICAgICAgIHJldHVybiBldmFsKHRleHQpO1xuICAgIH07XG5cbiAgICAvL1NldCB1cCB3aXRoIGNvbmZpZyBpbmZvLlxuICAgIHJlcShjZmcpO1xufSh0aGlzLCAodHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogc2V0VGltZW91dCkpKTtcbiJdfQ==