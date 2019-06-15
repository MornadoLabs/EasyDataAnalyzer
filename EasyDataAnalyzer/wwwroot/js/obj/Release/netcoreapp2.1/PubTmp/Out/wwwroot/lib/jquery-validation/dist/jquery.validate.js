/*!
 * jQuery Validation Plugin v1.17.0
 *
 * https://jqueryvalidation.org/
 *
 * Copyright (c) 2017 Jörn Zaefferer
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    }
    else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    }
    else {
        factory(jQuery);
    }
}(function ($) {
    $.extend($.fn, {
        // https://jqueryvalidation.org/validate/
        validate: function (options) {
            // If nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }
            // Check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator) {
                return validator;
            }
            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");
            validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);
            if (validator.settings.onsubmit) {
                this.on("click.validate", ":submit", function (event) {
                    // Track the used submit button to properly handle scripted
                    // submits later.
                    validator.submitButton = event.currentTarget;
                    // Allow suppressing validation by adding a cancel class to the submit button
                    if ($(this).hasClass("cancel")) {
                        validator.cancelSubmit = true;
                    }
                    // Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ($(this).attr("formnovalidate") !== undefined) {
                        validator.cancelSubmit = true;
                    }
                });
                // Validate the form on submit
                this.on("submit.validate", function (event) {
                    if (validator.settings.debug) {
                        // Prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden, result;
                        // Insert a hidden input as a replacement for the missing submit button
                        // The hidden input is inserted in two cases:
                        //   - A user defined a `submitHandler`
                        //   - There was a pending request due to `remote` method and `stopRequest()`
                        //     was called to submit the form in case it's valid
                        if (validator.submitButton && (validator.settings.submitHandler || validator.formSubmitted)) {
                            hidden = $("<input type='hidden'/>")
                                .attr("name", validator.submitButton.name)
                                .val($(validator.submitButton).val())
                                .appendTo(validator.currentForm);
                        }
                        if (validator.settings.submitHandler) {
                            result = validator.settings.submitHandler.call(validator, validator.currentForm, event);
                            if (hidden) {
                                // And clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            if (result !== undefined) {
                                return result;
                            }
                            return false;
                        }
                        return true;
                    }
                    // Prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    }
                    else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }
            return validator;
        },
        // https://jqueryvalidation.org/valid/
        valid: function () {
            var valid, validator, errorList;
            if ($(this[0]).is("form")) {
                valid = this.validate().form();
            }
            else {
                errorList = [];
                valid = true;
                validator = $(this[0].form).validate();
                this.each(function () {
                    valid = validator.element(this) && valid;
                    if (!valid) {
                        errorList = errorList.concat(validator.errorList);
                    }
                });
                validator.errorList = errorList;
            }
            return valid;
        },
        // https://jqueryvalidation.org/rules/
        rules: function (command, argument) {
            var element = this[0], settings, staticRules, existingRules, data, param, filtered;
            // If nothing is selected, return empty object; can't chain anyway
            if (element == null) {
                return;
            }
            if (!element.form && element.hasAttribute("contenteditable")) {
                element.form = this.closest("form")[0];
                element.name = this.attr("name");
            }
            if (element.form == null) {
                return;
            }
            if (command) {
                settings = $.data(element.form, "validator").settings;
                staticRules = settings.rules;
                existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        // Remove messages from rules, but allow them to be set separately
                        delete existingRules.messages;
                        staticRules[element.name] = existingRules;
                        if (argument.messages) {
                            settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        }
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        filtered = {};
                        $.each(argument.split(/\s/), function (index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }
            data = $.validator.normalizeRules($.extend({}, $.validator.classRules(element), $.validator.attributeRules(element), $.validator.dataRules(element), $.validator.staticRules(element)), element);
            // Make sure required is at front
            if (data.required) {
                param = data.required;
                delete data.required;
                data = $.extend({ required: param }, data);
            }
            // Make sure remote is at back
            if (data.remote) {
                param = data.remote;
                delete data.remote;
                data = $.extend(data, { remote: param });
            }
            return data;
        }
    });
    // Custom selectors
    $.extend($.expr.pseudos || $.expr[":"], {
        // https://jqueryvalidation.org/blank-selector/
        blank: function (a) {
            return !$.trim("" + $(a).val());
        },
        // https://jqueryvalidation.org/filled-selector/
        filled: function (a) {
            var val = $(a).val();
            return val !== null && !!$.trim("" + val);
        },
        // https://jqueryvalidation.org/unchecked-selector/
        unchecked: function (a) {
            return !$(a).prop("checked");
        }
    });
    // Constructor for validator
    $.validator = function (options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };
    // https://jqueryvalidation.org/jQuery.validator.format/
    $.validator.format = function (source, params) {
        if (arguments.length === 1) {
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (params === undefined) {
            return source;
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return n;
            });
        });
        return source;
    };
    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: false,
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function (element) {
                this.lastActive = element;
                // Hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.hideThese(this.errorsFor(element));
                }
            },
            onfocusout: function (element) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function (element, event) {
                // Avoid revalidate the field when pressing one of the following keys
                // Shift       => 16
                // Ctrl        => 17
                // Alt         => 18
                // Caps lock   => 20
                // End         => 35
                // Home        => 36
                // Left arrow  => 37
                // Up arrow    => 38
                // Right arrow => 39
                // Down arrow  => 40
                // Insert      => 45
                // Num lock    => 144
                // AltGr key   => 225
                var excludedKeys = [
                    16, 17, 18, 20, 35, 36, 37,
                    38, 39, 40, 45, 144, 225
                ];
                if (event.which === 9 && this.elementValue(element) === "" || $.inArray(event.keyCode, excludedKeys) !== -1) {
                    return;
                }
                else if (element.name in this.submitted || element.name in this.invalid) {
                    this.element(element);
                }
            },
            onclick: function (element) {
                // Click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);
                    // Or option elements, check parent select in that case
                }
                else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            },
            highlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                }
                else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                }
                else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },
        // https://jqueryvalidation.org/jQuery.validator.setDefaults/
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}."),
            step: $.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: false,
        prototype: {
            init: function () {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();
                var groups = (this.groups = {}), rules;
                $.each(this.settings.groups, function (key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function (index, name) {
                        groups[name] = key;
                    });
                });
                rules = this.settings.rules;
                $.each(rules, function (key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });
                function delegate(event) {
                    // Set form expando on contenteditable
                    if (!this.form && this.hasAttribute("contenteditable")) {
                        this.form = $(this).closest("form")[0];
                        this.name = $(this).attr("name");
                    }
                    var validator = $.data(this.form, "validator"), eventType = "on" + event.type.replace(/^validate/, ""), settings = validator.settings;
                    if (settings[eventType] && !$(this).is(settings.ignore)) {
                        settings[eventType].call(validator, this, event);
                    }
                }
                $(this.currentForm)
                    .on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox'], [contenteditable], [type='button']", delegate)
                    // Support: Chrome, oldIE
                    // "select" is provided as event.target when clicking a option
                    .on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);
                if (this.settings.invalidHandler) {
                    $(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
                }
            },
            // https://jqueryvalidation.org/Validator.form/
            form: function () {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },
            checkForm: function () {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },
            // https://jqueryvalidation.org/Validator.element/
            element: function (element) {
                var cleanElement = this.clean(element), checkElement = this.validationTargetFor(cleanElement), v = this, result = true, rs, group;
                if (checkElement === undefined) {
                    delete this.invalid[cleanElement.name];
                }
                else {
                    this.prepareElement(checkElement);
                    this.currentElements = $(checkElement);
                    // If this element is grouped, then validate all group elements already
                    // containing a value
                    group = this.groups[checkElement.name];
                    if (group) {
                        $.each(this.groups, function (name, testgroup) {
                            if (testgroup === group && name !== checkElement.name) {
                                cleanElement = v.validationTargetFor(v.clean(v.findByName(name)));
                                if (cleanElement && cleanElement.name in v.invalid) {
                                    v.currentElements.push(cleanElement);
                                    result = v.check(cleanElement) && result;
                                }
                            }
                        });
                    }
                    rs = this.check(checkElement) !== false;
                    result = result && rs;
                    if (rs) {
                        this.invalid[checkElement.name] = false;
                    }
                    else {
                        this.invalid[checkElement.name] = true;
                    }
                    if (!this.numberOfInvalids()) {
                        // Hide error containers on last error
                        this.toHide = this.toHide.add(this.containers);
                    }
                    this.showErrors();
                    // Add aria-invalid status for screen readers
                    $(element).attr("aria-invalid", !rs);
                }
                return result;
            },
            // https://jqueryvalidation.org/Validator.showErrors/
            showErrors: function (errors) {
                if (errors) {
                    var validator = this;
                    // Add items to error list and map
                    $.extend(this.errorMap, errors);
                    this.errorList = $.map(this.errorMap, function (message, name) {
                        return {
                            message: message,
                            element: validator.findByName(name)[0]
                        };
                    });
                    // Remove items from success list
                    this.successList = $.grep(this.successList, function (element) {
                        return !(element.name in errors);
                    });
                }
                if (this.settings.showErrors) {
                    this.settings.showErrors.call(this, this.errorMap, this.errorList);
                }
                else {
                    this.defaultShowErrors();
                }
            },
            // https://jqueryvalidation.org/Validator.resetForm/
            resetForm: function () {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.invalid = {};
                this.submitted = {};
                this.prepareForm();
                this.hideErrors();
                var elements = this.elements()
                    .removeData("previousValue")
                    .removeAttr("aria-invalid");
                this.resetElements(elements);
            },
            resetElements: function (elements) {
                var i;
                if (this.settings.unhighlight) {
                    for (i = 0; elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, "");
                        this.findByName(elements[i].name).removeClass(this.settings.validClass);
                    }
                }
                else {
                    elements
                        .removeClass(this.settings.errorClass)
                        .removeClass(this.settings.validClass);
                }
            },
            numberOfInvalids: function () {
                return this.objectLength(this.invalid);
            },
            objectLength: function (obj) {
                /* jshint unused: false */
                var count = 0, i;
                for (i in obj) {
                    // This check allows counting elements with empty error
                    // message as invalid elements
                    if (obj[i] !== undefined && obj[i] !== null && obj[i] !== false) {
                        count++;
                    }
                }
                return count;
            },
            hideErrors: function () {
                this.hideThese(this.toHide);
            },
            hideThese: function (errors) {
                errors.not(this.containers).text("");
                this.addWrapper(errors).hide();
            },
            valid: function () {
                return this.size() === 0;
            },
            size: function () {
                return this.errorList.length;
            },
            focusInvalid: function () {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                            .filter(":visible")
                            .focus()
                            // Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                            .trigger("focusin");
                    }
                    catch (e) {
                        // Ignore IE throwing errors when focusing hidden elements
                    }
                }
            },
            findLastActive: function () {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function (n) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },
            elements: function () {
                var validator = this, rulesCache = {};
                // Select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                    .find("input, select, textarea, [contenteditable]")
                    .not(":submit, :reset, :image, :disabled")
                    .not(this.settings.ignore)
                    .filter(function () {
                    var name = this.name || $(this).attr("name"); // For contenteditable
                    if (!name && validator.settings.debug && window.console) {
                        console.error("%o has no name assigned", this);
                    }
                    // Set form expando on contenteditable
                    if (this.hasAttribute("contenteditable")) {
                        this.form = $(this).closest("form")[0];
                        this.name = name;
                    }
                    // Select only the first element for each name, and only those with rules specified
                    if (name in rulesCache || !validator.objectLength($(this).rules())) {
                        return false;
                    }
                    rulesCache[name] = true;
                    return true;
                });
            },
            clean: function (selector) {
                return $(selector)[0];
            },
            errors: function () {
                var errorClass = this.settings.errorClass.split(" ").join(".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },
            resetInternals: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
            },
            reset: function () {
                this.resetInternals();
                this.currentElements = $([]);
            },
            prepareForm: function () {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function (element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },
            elementValue: function (element) {
                var $element = $(element), type = element.type, val, idx;
                if (type === "radio" || type === "checkbox") {
                    return this.findByName(element.name).filter(":checked").val();
                }
                else if (type === "number" && typeof element.validity !== "undefined") {
                    return element.validity.badInput ? "NaN" : $element.val();
                }
                if (element.hasAttribute("contenteditable")) {
                    val = $element.text();
                }
                else {
                    val = $element.val();
                }
                if (type === "file") {
                    // Modern browser (chrome & safari)
                    if (val.substr(0, 12) === "C:\\fakepath\\") {
                        return val.substr(12);
                    }
                    // Legacy browsers
                    // Unix-based path
                    idx = val.lastIndexOf("/");
                    if (idx >= 0) {
                        return val.substr(idx + 1);
                    }
                    // Windows-based path
                    idx = val.lastIndexOf("\\");
                    if (idx >= 0) {
                        return val.substr(idx + 1);
                    }
                    // Just the file name
                    return val;
                }
                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },
            check: function (element) {
                element = this.validationTargetFor(this.clean(element));
                var rules = $(element).rules(), rulesCount = $.map(rules, function (n, i) {
                    return i;
                }).length, dependencyMismatch = false, val = this.elementValue(element), result, method, rule, normalizer;
                // Prioritize the local normalizer defined for this element over the global one
                // if the former exists, otherwise user the global one in case it exists.
                if (typeof rules.normalizer === "function") {
                    normalizer = rules.normalizer;
                }
                else if (typeof this.settings.normalizer === "function") {
                    normalizer = this.settings.normalizer;
                }
                // If normalizer is defined, then call it to retreive the changed value instead
                // of using the real one.
                // Note that `this` in the normalizer is `element`.
                if (normalizer) {
                    val = normalizer.call(element, val);
                    if (typeof val !== "string") {
                        throw new TypeError("The normalizer should return a string value.");
                    }
                    // Delete the normalizer from rules to avoid treating it as a pre-defined method.
                    delete rules.normalizer;
                }
                for (method in rules) {
                    rule = { method: method, parameters: rules[method] };
                    try {
                        result = $.validator.methods[method].call(this, val, element, rule.parameters);
                        // If a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result === "dependency-mismatch" && rulesCount === 1) {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;
                        if (result === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }
                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    }
                    catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        if (e instanceof TypeError) {
                            e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
                        }
                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },
            // Return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            // return the generic message if present and no method specific message is present
            customDataMessage: function (element, method) {
                return $(element).data("msg" + method.charAt(0).toUpperCase() +
                    method.substring(1).toLowerCase()) || $(element).data("msg");
            },
            // Return the custom message for the given element name and validation method
            customMessage: function (name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor === String ? m : m[method]);
            },
            // Return the first defined argument, allowing empty strings
            findDefined: function () {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        return arguments[i];
                    }
                }
                return undefined;
            },
            // The second parameter 'rule' used to be a string, and extended to an object literal
            // of the following form:
            // rule = {
            //     method: "method name",
            //     parameters: "the given method parameters"
            // }
            //
            // The old behavior still supported, kept to maintain backward compatibility with
            // old code, and will be removed in the next major release.
            defaultMessage: function (element, rule) {
                if (typeof rule === "string") {
                    rule = { method: rule };
                }
                var message = this.findDefined(this.customMessage(element.name, rule.method), this.customDataMessage(element, rule.method), 
                // 'title' is never undefined, so handle empty string as undefined
                !this.settings.ignoreTitle && element.title || undefined, $.validator.messages[rule.method], "<strong>Warning: No message defined for " + element.name + "</strong>"), theregex = /\$?\{(\d+)\}/g;
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                }
                else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                return message;
            },
            formatAndAdd: function (element, rule) {
                var message = this.defaultMessage(element, rule);
                this.errorList.push({
                    message: message,
                    element: element,
                    method: rule.method
                });
                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },
            addWrapper: function (toToggle) {
                if (this.settings.wrapper) {
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                }
                return toToggle;
            },
            defaultShowErrors: function () {
                var i, elements, error;
                for (i = 0; this.errorList[i]; i++) {
                    error = this.errorList[i];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },
            validElements: function () {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element;
                });
            },
            showLabel: function (element, message) {
                var place, group, errorID, v, error = this.errorsFor(element), elementID = this.idOrName(element), describedBy = $(element).attr("aria-describedby");
                if (error.length) {
                    // Refresh error/success class
                    error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    // Replace message on existing label
                    error.html(message);
                }
                else {
                    // Create error element
                    error = $("<" + this.settings.errorElement + ">")
                        .attr("id", elementID + "-error")
                        .addClass(this.settings.errorClass)
                        .html(message || "");
                    // Maintain reference to the element to be placed into the DOM
                    place = error;
                    if (this.settings.wrapper) {
                        // Make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (this.labelContainer.length) {
                        this.labelContainer.append(place);
                    }
                    else if (this.settings.errorPlacement) {
                        this.settings.errorPlacement.call(this, place, $(element));
                    }
                    else {
                        place.insertAfter(element);
                    }
                    // Link error back to the element
                    if (error.is("label")) {
                        // If the error is a label, then associate using 'for'
                        error.attr("for", elementID);
                        // If the element is not a child of an associated label, then it's necessary
                        // to explicitly apply aria-describedby
                    }
                    else if (error.parents("label[for='" + this.escapeCssMeta(elementID) + "']").length === 0) {
                        errorID = error.attr("id");
                        // Respect existing non-error aria-describedby
                        if (!describedBy) {
                            describedBy = errorID;
                        }
                        else if (!describedBy.match(new RegExp("\\b" + this.escapeCssMeta(errorID) + "\\b"))) {
                            // Add to end of list if not already present
                            describedBy += " " + errorID;
                        }
                        $(element).attr("aria-describedby", describedBy);
                        // If this element is grouped, then assign to all elements in the same group
                        group = this.groups[element.name];
                        if (group) {
                            v = this;
                            $.each(v.groups, function (name, testgroup) {
                                if (testgroup === group) {
                                    $("[name='" + v.escapeCssMeta(name) + "']", v.currentForm)
                                        .attr("aria-describedby", error.attr("id"));
                                }
                            });
                        }
                    }
                }
                if (!message && this.settings.success) {
                    error.text("");
                    if (typeof this.settings.success === "string") {
                        error.addClass(this.settings.success);
                    }
                    else {
                        this.settings.success(error, element);
                    }
                }
                this.toShow = this.toShow.add(error);
            },
            errorsFor: function (element) {
                var name = this.escapeCssMeta(this.idOrName(element)), describer = $(element).attr("aria-describedby"), selector = "label[for='" + name + "'], label[for='" + name + "'] *";
                // 'aria-describedby' should directly reference the error element
                if (describer) {
                    selector = selector + ", #" + this.escapeCssMeta(describer)
                        .replace(/\s+/g, ", #");
                }
                return this
                    .errors()
                    .filter(selector);
            },
            // See https://api.jquery.com/category/selectors/, for CSS
            // meta-characters that should be escaped in order to be used with JQuery
            // as a literal part of a name/id or any selector.
            escapeCssMeta: function (string) {
                return string.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1");
            },
            idOrName: function (element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },
            validationTargetFor: function (element) {
                // If radio/checkbox, validate first element in group instead
                if (this.checkable(element)) {
                    element = this.findByName(element.name);
                }
                // Always apply ignore filter
                return $(element).not(this.settings.ignore)[0];
            },
            checkable: function (element) {
                return (/radio|checkbox/i).test(element.type);
            },
            findByName: function (name) {
                return $(this.currentForm).find("[name='" + this.escapeCssMeta(name) + "']");
            },
            getLength: function (value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },
            depend: function (param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },
            dependTypes: {
                "boolean": function (param) {
                    return param;
                },
                "string": function (param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function (param, element) {
                    return param(element);
                }
            },
            optional: function (element) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },
            startRequest: function (element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    $(element).addClass(this.settings.pendingClass);
                    this.pending[element.name] = true;
                }
            },
            stopRequest: function (element, valid) {
                this.pendingRequest--;
                // Sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0) {
                    this.pendingRequest = 0;
                }
                delete this.pending[element.name];
                $(element).removeClass(this.settings.pendingClass);
                if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    // Remove the hidden input that was used as a replacement for the
                    // missing submit button. The hidden input is added by `handle()`
                    // to ensure that the value of the used submit button is passed on
                    // for scripted submits triggered by this method
                    if (this.submitButton) {
                        $("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove();
                    }
                    this.formSubmitted = false;
                }
                else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },
            previousValue: function (element, method) {
                method = typeof method === "string" && method || "remote";
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, { method: method })
                });
            },
            // Cleans up all forms and elements, removes validator-specific events
            destroy: function () {
                this.resetForm();
                $(this.currentForm)
                    .off(".validate")
                    .removeData("validator")
                    .find(".validate-equalTo-blur")
                    .off(".validate-equalTo")
                    .removeClass("validate-equalTo-blur");
            }
        },
        classRuleSettings: {
            required: { required: true },
            email: { email: true },
            url: { url: true },
            date: { date: true },
            dateISO: { dateISO: true },
            number: { number: true },
            digits: { digits: true },
            creditcard: { creditcard: true }
        },
        addClassRules: function (className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[className] = rules;
            }
            else {
                $.extend(this.classRuleSettings, className);
            }
        },
        classRules: function (element) {
            var rules = {}, classes = $(element).attr("class");
            if (classes) {
                $.each(classes.split(" "), function () {
                    if (this in $.validator.classRuleSettings) {
                        $.extend(rules, $.validator.classRuleSettings[this]);
                    }
                });
            }
            return rules;
        },
        normalizeAttributeRule: function (rules, type, method, value) {
            // Convert the value to a number for number inputs, and for text for backwards compability
            // allows type="date" and others to be compared as strings
            if (/min|max|step/.test(method) && (type === null || /number|range|text/.test(type))) {
                value = Number(value);
                // Support Opera Mini, which returns NaN for undefined minlength
                if (isNaN(value)) {
                    value = undefined;
                }
            }
            if (value || value === 0) {
                rules[method] = value;
            }
            else if (type === method && type !== "range") {
                // Exception: the jquery validate 'range' method
                // does not test for the html5 'range' type
                rules[method] = true;
            }
        },
        attributeRules: function (element) {
            var rules = {}, $element = $(element), type = element.getAttribute("type"), method, value;
            for (method in $.validator.methods) {
                // Support for <input required> in both html5 and older browsers
                if (method === "required") {
                    value = element.getAttribute(method);
                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if (value === "") {
                        value = true;
                    }
                    // Force non-HTML5 browsers to return bool
                    value = !!value;
                }
                else {
                    value = $element.attr(method);
                }
                this.normalizeAttributeRule(rules, type, method, value);
            }
            // 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }
            return rules;
        },
        dataRules: function (element) {
            var rules = {}, $element = $(element), type = element.getAttribute("type"), method, value;
            for (method in $.validator.methods) {
                value = $element.data("rule" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase());
                this.normalizeAttributeRule(rules, type, method, value);
            }
            return rules;
        },
        staticRules: function (element) {
            var rules = {}, validator = $.data(element.form, "validator");
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },
        normalizeRules: function (rules, element) {
            // Handle dependency check
            $.each(rules, function (prop, val) {
                // Ignore rule when param is explicitly false, eg. required:false
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    }
                    else {
                        $.data(element.form, "validator").resetElements($(element));
                        delete rules[prop];
                    }
                }
            });
            // Evaluate parameters
            $.each(rules, function (rule, parameter) {
                rules[rule] = $.isFunction(parameter) && rule !== "normalizer" ? parameter(element) : parameter;
            });
            // Clean number parameters
            $.each(["minlength", "maxlength"], function () {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(["rangelength", "range"], function () {
                var parts;
                if (rules[this]) {
                    if ($.isArray(rules[this])) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    }
                    else if (typeof rules[this] === "string") {
                        parts = rules[this].replace(/[\[\]]/g, "").split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });
            if ($.validator.autoCreateRanges) {
                // Auto-create ranges
                if (rules.min != null && rules.max != null) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength != null && rules.maxlength != null) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }
            return rules;
        },
        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function (data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function () {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        // https://jqueryvalidation.org/jQuery.validator.addMethod/
        addMethod: function (name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },
        // https://jqueryvalidation.org/jQuery.validator.methods/
        methods: {
            // https://jqueryvalidation.org/required-method/
            required: function (value, element, param) {
                // Check if dependency is met
                if (!this.depend(param, element)) {
                    return "dependency-mismatch";
                }
                if (element.nodeName.toLowerCase() === "select") {
                    // Could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return value.length > 0;
            },
            // https://jqueryvalidation.org/email-method/
            email: function (value, element) {
                // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
                // Retrieved 2014-01-14
                // If you have a problem with this implementation, report a bug against the above spec
                // Or use custom methods to implement your own email validation
                return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
            // https://jqueryvalidation.org/url-method/
            url: function (value, element) {
                // Copyright (c) 2010-2013 Diego Perini, MIT licensed
                // https://gist.github.com/dperini/729294
                // see also https://mathiasbynens.be/demo/url-regex
                // modified to allow protocol-relative URLs
                return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
            },
            // https://jqueryvalidation.org/date-method/
            date: function (value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },
            // https://jqueryvalidation.org/dateISO-method/
            dateISO: function (value, element) {
                return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
            },
            // https://jqueryvalidation.org/number-method/
            number: function (value, element) {
                return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },
            // https://jqueryvalidation.org/digits-method/
            digits: function (value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            // https://jqueryvalidation.org/minlength-method/
            minlength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || length >= param;
            },
            // https://jqueryvalidation.org/maxlength-method/
            maxlength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || length <= param;
            },
            // https://jqueryvalidation.org/rangelength-method/
            rangelength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },
            // https://jqueryvalidation.org/min-method/
            min: function (value, element, param) {
                return this.optional(element) || value >= param;
            },
            // https://jqueryvalidation.org/max-method/
            max: function (value, element, param) {
                return this.optional(element) || value <= param;
            },
            // https://jqueryvalidation.org/range-method/
            range: function (value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },
            // https://jqueryvalidation.org/step-method/
            step: function (value, element, param) {
                var type = $(element).attr("type"), errorMessage = "Step attribute on input type " + type + " is not supported.", supportedTypes = ["text", "number", "range"], re = new RegExp("\\b" + type + "\\b"), notSupported = type && !re.test(supportedTypes.join()), decimalPlaces = function (num) {
                    var match = ("" + num).match(/(?:\.(\d+))?$/);
                    if (!match) {
                        return 0;
                    }
                    // Number of digits right of decimal point.
                    return match[1] ? match[1].length : 0;
                }, toInt = function (num) {
                    return Math.round(num * Math.pow(10, decimals));
                }, valid = true, decimals;
                // Works only for text, number and range input types
                // TODO find a way to support input types date, datetime, datetime-local, month, time and week
                if (notSupported) {
                    throw new Error(errorMessage);
                }
                decimals = decimalPlaces(param);
                // Value can't have too many decimals
                if (decimalPlaces(value) > decimals || toInt(value) % toInt(param) !== 0) {
                    valid = false;
                }
                return this.optional(element) || valid;
            },
            // https://jqueryvalidation.org/equalTo-method/
            equalTo: function (value, element, param) {
                // Bind to the blur event of the target in order to revalidate whenever the target field is updated
                var target = $(param);
                if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
                    target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },
            // https://jqueryvalidation.org/remote-method/
            remote: function (value, element, param, method) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }
                method = typeof method === "string" && method || "remote";
                var previous = this.previousValue(element, method), validator, data, optionDataString;
                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = previous.originalMessage || this.settings.messages[element.name][method];
                this.settings.messages[element.name][method] = previous.message;
                param = typeof param === "string" && { url: param } || param;
                optionDataString = $.param($.extend({ data: value }, param.data));
                if (previous.old === optionDataString) {
                    return previous.valid;
                }
                previous.old = optionDataString;
                validator = this;
                this.startRequest(element);
                data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    context: validator.currentForm,
                    success: function (response) {
                        var valid = response === true || response === "true", errors, message, submitted;
                        validator.settings.messages[element.name][method] = previous.originalMessage;
                        if (valid) {
                            submitted = validator.formSubmitted;
                            validator.resetInternals();
                            validator.toHide = validator.errorsFor(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            validator.invalid[element.name] = false;
                            validator.showErrors();
                        }
                        else {
                            errors = {};
                            message = response || validator.defaultMessage(element, { method: method, parameters: value });
                            errors[element.name] = previous.message = message;
                            validator.invalid[element.name] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            }
        }
    });
    // Ajax mode: abort
    // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
    // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
    var pendingRequests = {}, ajax;
    // Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function (settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    }
    else {
        // Proxy ajax
        ajax = $.ajax;
        $.ajax = function (settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode, port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = ajax.apply(this, arguments);
                return pendingRequests[port];
            }
            return ajax.apply(this, arguments);
        };
    }
    return $;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianF1ZXJ5LnZhbGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2pxdWVyeS12YWxpZGF0aW9uL2Rpc3QvanF1ZXJ5LnZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFDSCxDQUFDLFVBQVUsT0FBTztJQUNqQixJQUFLLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFHO1FBQ2pELE1BQU0sQ0FBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sQ0FBRSxDQUFDO0tBQzlCO1NBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUN4RCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBRSxPQUFPLENBQUUsUUFBUSxDQUFFLENBQUUsQ0FBQztLQUNoRDtTQUFNO1FBQ04sT0FBTyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0tBQ2xCO0FBQ0YsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUViLENBQUMsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUVmLHlDQUF5QztRQUN6QyxRQUFRLEVBQUUsVUFBVSxPQUFPO1lBRTFCLDZEQUE2RDtZQUM3RCxJQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRztnQkFDbkIsSUFBSyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFHO29CQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFFLHNEQUFzRCxDQUFFLENBQUM7aUJBQ3ZFO2dCQUNELE9BQU87YUFDUDtZQUVELHlEQUF5RDtZQUN6RCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBRSxX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dWdpbiB2MS4xNy4wXHJcbiAqXHJcbiAqIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNyBKw7ZybiBaYWVmZmVyZXJcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG4oZnVuY3Rpb24oIGZhY3RvcnkgKSB7XHJcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcclxuXHRcdGRlZmluZSggW1wianF1ZXJ5XCJdLCBmYWN0b3J5ICk7XHJcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoIHJlcXVpcmUoIFwianF1ZXJ5XCIgKSApO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRmYWN0b3J5KCBqUXVlcnkgKTtcclxuXHR9XHJcbn0oZnVuY3Rpb24oICQgKSB7XHJcblxyXG4kLmV4dGVuZCggJC5mbiwge1xyXG5cclxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3ZhbGlkYXRlL1xyXG5cdHZhbGlkYXRlOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcclxuXHJcblx0XHQvLyBJZiBub3RoaW5nIGlzIHNlbGVjdGVkLCByZXR1cm4gbm90aGluZzsgY2FuJ3QgY2hhaW4gYW55d2F5XHJcblx0XHRpZiAoICF0aGlzLmxlbmd0aCApIHtcclxuXHRcdFx0aWYgKCBvcHRpb25zICYmIG9wdGlvbnMuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgKSB7XHJcblx0XHRcdFx0Y29uc29sZS53YXJuKCBcIk5vdGhpbmcgc2VsZWN0ZWQsIGNhbid0IHZhbGlkYXRlLCByZXR1cm5pbmcgbm90aGluZy5cIiApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayBpZiBhIHZhbGlkYXRvciBmb3IgdGhpcyBmb3JtIHdhcyBhbHJlYWR5IGNyZWF0ZWRcclxuXHRcdHZhciB2YWxpZGF0b3IgPSAkLmRhdGEoIHRoaXNbIDAgXSwgXCJ2YWxpZGF0b3JcIiApO1xyXG5cdFx0aWYgKCB2YWxpZGF0b3IgKSB7XHJcblx0XHRcdHJldHVybiB2YWxpZGF0b3I7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQWRkIG5vdmFsaWRhdGUgdGFnIGlmIEhUTUw1LlxyXG5cdFx0dGhpcy5hdHRyKCBcIm5vdmFsaWRhdGVcIiwgXCJub3ZhbGlkYXRlXCIgKTtcclxuXHJcblx0XHR2YWxpZGF0b3IgPSBuZXcgJC52YWxpZGF0b3IoIG9wdGlvbnMsIHRoaXNbIDAgXSApO1xyXG5cdFx0JC5kYXRhKCB0aGlzWyAwIF0sIFwidmFsaWRhdG9yXCIsIHZhbGlkYXRvciApO1xyXG5cclxuXHRcdGlmICggdmFsaWRhdG9yLnNldHRpbmdzLm9uc3VibWl0ICkge1xyXG5cclxuXHRcdFx0dGhpcy5vbiggXCJjbGljay52YWxpZGF0ZVwiLCBcIjpzdWJtaXRcIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cclxuXHRcdFx0XHQvLyBUcmFjayB0aGUgdXNlZCBzdWJtaXQgYnV0dG9uIHRvIHByb3Blcmx5IGhhbmRsZSBzY3JpcHRlZFxyXG5cdFx0XHRcdC8vIHN1Ym1pdHMgbGF0ZXIuXHJcblx0XHRcdFx0dmFsaWRhdG9yLnN1Ym1pdEJ1dHRvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcblxyXG5cdFx0XHRcdC8vIEFsbG93IHN1cHByZXNzaW5nIHZhbGlkYXRpb24gYnkgYWRkaW5nIGEgY2FuY2VsIGNsYXNzIHRvIHRoZSBzdWJtaXQgYnV0dG9uXHJcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoIFwiY2FuY2VsXCIgKSApIHtcclxuXHRcdFx0XHRcdHZhbGlkYXRvci5jYW5jZWxTdWJtaXQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gQWxsb3cgc3VwcHJlc3NpbmcgdmFsaWRhdGlvbiBieSBhZGRpbmcgdGhlIGh0bWw1IGZvcm1ub3ZhbGlkYXRlIGF0dHJpYnV0ZSB0byB0aGUgc3VibWl0IGJ1dHRvblxyXG5cdFx0XHRcdGlmICggJCggdGhpcyApLmF0dHIoIFwiZm9ybW5vdmFsaWRhdGVcIiApICE9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHR2YWxpZGF0b3IuY2FuY2VsU3VibWl0ID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdC8vIFZhbGlkYXRlIHRoZSBmb3JtIG9uIHN1Ym1pdFxyXG5cdFx0XHR0aGlzLm9uKCBcInN1Ym1pdC52YWxpZGF0ZVwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0XHRcdFx0aWYgKCB2YWxpZGF0b3Iuc2V0dGluZ3MuZGVidWcgKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gUHJldmVudCBmb3JtIHN1Ym1pdCB0byBiZSBhYmxlIHRvIHNlZSBjb25zb2xlIG91dHB1dFxyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gaGFuZGxlKCkge1xyXG5cdFx0XHRcdFx0dmFyIGhpZGRlbiwgcmVzdWx0O1xyXG5cclxuXHRcdFx0XHRcdC8vIEluc2VydCBhIGhpZGRlbiBpbnB1dCBhcyBhIHJlcGxhY2VtZW50IGZvciB0aGUgbWlzc2luZyBzdWJtaXQgYnV0dG9uXHJcblx0XHRcdFx0XHQvLyBUaGUgaGlkZGVuIGlucHV0IGlzIGluc2VydGVkIGluIHR3byBjYXNlczpcclxuXHRcdFx0XHRcdC8vICAgLSBBIHVzZXIgZGVmaW5lZCBhIGBzdWJtaXRIYW5kbGVyYFxyXG5cdFx0XHRcdFx0Ly8gICAtIFRoZXJlIHdhcyBhIHBlbmRpbmcgcmVxdWVzdCBkdWUgdG8gYHJlbW90ZWAgbWV0aG9kIGFuZCBgc3RvcFJlcXVlc3QoKWBcclxuXHRcdFx0XHRcdC8vICAgICB3YXMgY2FsbGVkIHRvIHN1Ym1pdCB0aGUgZm9ybSBpbiBjYXNlIGl0J3MgdmFsaWRcclxuXHRcdFx0XHRcdGlmICggdmFsaWRhdG9yLnN1Ym1pdEJ1dHRvbiAmJiAoIHZhbGlkYXRvci5zZXR0aW5ncy5zdWJtaXRIYW5kbGVyIHx8IHZhbGlkYXRvci5mb3JtU3VibWl0dGVkICkgKSB7XHJcblx0XHRcdFx0XHRcdGhpZGRlbiA9ICQoIFwiPGlucHV0IHR5cGU9J2hpZGRlbicvPlwiIClcclxuXHRcdFx0XHRcdFx0XHQuYXR0ciggXCJuYW1lXCIsIHZhbGlkYXRvci5zdWJtaXRCdXR0b24ubmFtZSApXHJcblx0XHRcdFx0XHRcdFx0LnZhbCggJCggdmFsaWRhdG9yLnN1Ym1pdEJ1dHRvbiApLnZhbCgpIClcclxuXHRcdFx0XHRcdFx0XHQuYXBwZW5kVG8oIHZhbGlkYXRvci5jdXJyZW50Rm9ybSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggdmFsaWRhdG9yLnNldHRpbmdzLnN1Ym1pdEhhbmRsZXIgKSB7XHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHZhbGlkYXRvci5zZXR0aW5ncy5zdWJtaXRIYW5kbGVyLmNhbGwoIHZhbGlkYXRvciwgdmFsaWRhdG9yLmN1cnJlbnRGb3JtLCBldmVudCApO1xyXG5cdFx0XHRcdFx0XHRpZiAoIGhpZGRlbiApIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gQW5kIGNsZWFuIHVwIGFmdGVyd2FyZHM7IHRoYW5rcyB0byBuby1ibG9jay1zY29wZSwgaGlkZGVuIGNhbiBiZSByZWZlcmVuY2VkXHJcblx0XHRcdFx0XHRcdFx0aGlkZGVuLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmICggcmVzdWx0ICE9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFByZXZlbnQgc3VibWl0IGZvciBpbnZhbGlkIGZvcm1zIG9yIGN1c3RvbSBzdWJtaXQgaGFuZGxlcnNcclxuXHRcdFx0XHRpZiAoIHZhbGlkYXRvci5jYW5jZWxTdWJtaXQgKSB7XHJcblx0XHRcdFx0XHR2YWxpZGF0b3IuY2FuY2VsU3VibWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRyZXR1cm4gaGFuZGxlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICggdmFsaWRhdG9yLmZvcm0oKSApIHtcclxuXHRcdFx0XHRcdGlmICggdmFsaWRhdG9yLnBlbmRpbmdSZXF1ZXN0ICkge1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBoYW5kbGUoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFsaWRhdG9yLmZvY3VzSW52YWxpZCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB2YWxpZGF0b3I7XHJcblx0fSxcclxuXHJcblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy92YWxpZC9cclxuXHR2YWxpZDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdmFsaWQsIHZhbGlkYXRvciwgZXJyb3JMaXN0O1xyXG5cclxuXHRcdGlmICggJCggdGhpc1sgMCBdICkuaXMoIFwiZm9ybVwiICkgKSB7XHJcblx0XHRcdHZhbGlkID0gdGhpcy52YWxpZGF0ZSgpLmZvcm0oKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVycm9yTGlzdCA9IFtdO1xyXG5cdFx0XHR2YWxpZCA9IHRydWU7XHJcblx0XHRcdHZhbGlkYXRvciA9ICQoIHRoaXNbIDAgXS5mb3JtICkudmFsaWRhdGUoKTtcclxuXHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YWxpZCA9IHZhbGlkYXRvci5lbGVtZW50KCB0aGlzICkgJiYgdmFsaWQ7XHJcblx0XHRcdFx0aWYgKCAhdmFsaWQgKSB7XHJcblx0XHRcdFx0XHRlcnJvckxpc3QgPSBlcnJvckxpc3QuY29uY2F0KCB2YWxpZGF0b3IuZXJyb3JMaXN0ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ICk7XHJcblx0XHRcdHZhbGlkYXRvci5lcnJvckxpc3QgPSBlcnJvckxpc3Q7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmFsaWQ7XHJcblx0fSxcclxuXHJcblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9ydWxlcy9cclxuXHRydWxlczogZnVuY3Rpb24oIGNvbW1hbmQsIGFyZ3VtZW50ICkge1xyXG5cdFx0dmFyIGVsZW1lbnQgPSB0aGlzWyAwIF0sXHJcblx0XHRcdHNldHRpbmdzLCBzdGF0aWNSdWxlcywgZXhpc3RpbmdSdWxlcywgZGF0YSwgcGFyYW0sIGZpbHRlcmVkO1xyXG5cclxuXHRcdC8vIElmIG5vdGhpbmcgaXMgc2VsZWN0ZWQsIHJldHVybiBlbXB0eSBvYmplY3Q7IGNhbid0IGNoYWluIGFueXdheVxyXG5cdFx0aWYgKCBlbGVtZW50ID09IG51bGwgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFlbGVtZW50LmZvcm0gJiYgZWxlbWVudC5oYXNBdHRyaWJ1dGUoIFwiY29udGVudGVkaXRhYmxlXCIgKSApIHtcclxuXHRcdFx0ZWxlbWVudC5mb3JtID0gdGhpcy5jbG9zZXN0KCBcImZvcm1cIiApWyAwIF07XHJcblx0XHRcdGVsZW1lbnQubmFtZSA9IHRoaXMuYXR0ciggXCJuYW1lXCIgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIGVsZW1lbnQuZm9ybSA9PSBudWxsICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBjb21tYW5kICkge1xyXG5cdFx0XHRzZXR0aW5ncyA9ICQuZGF0YSggZWxlbWVudC5mb3JtLCBcInZhbGlkYXRvclwiICkuc2V0dGluZ3M7XHJcblx0XHRcdHN0YXRpY1J1bGVzID0gc2V0dGluZ3MucnVsZXM7XHJcblx0XHRcdGV4aXN0aW5nUnVsZXMgPSAkLnZhbGlkYXRvci5zdGF0aWNSdWxlcyggZWxlbWVudCApO1xyXG5cdFx0XHRzd2l0Y2ggKCBjb21tYW5kICkge1xyXG5cdFx0XHRjYXNlIFwiYWRkXCI6XHJcblx0XHRcdFx0JC5leHRlbmQoIGV4aXN0aW5nUnVsZXMsICQudmFsaWRhdG9yLm5vcm1hbGl6ZVJ1bGUoIGFyZ3VtZW50ICkgKTtcclxuXHJcblx0XHRcdFx0Ly8gUmVtb3ZlIG1lc3NhZ2VzIGZyb20gcnVsZXMsIGJ1dCBhbGxvdyB0aGVtIHRvIGJlIHNldCBzZXBhcmF0ZWx5XHJcblx0XHRcdFx0ZGVsZXRlIGV4aXN0aW5nUnVsZXMubWVzc2FnZXM7XHJcblx0XHRcdFx0c3RhdGljUnVsZXNbIGVsZW1lbnQubmFtZSBdID0gZXhpc3RpbmdSdWxlcztcclxuXHRcdFx0XHRpZiAoIGFyZ3VtZW50Lm1lc3NhZ2VzICkge1xyXG5cdFx0XHRcdFx0c2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdID0gJC5leHRlbmQoIHNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXSwgYXJndW1lbnQubWVzc2FnZXMgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgXCJyZW1vdmVcIjpcclxuXHRcdFx0XHRpZiAoICFhcmd1bWVudCApIHtcclxuXHRcdFx0XHRcdGRlbGV0ZSBzdGF0aWNSdWxlc1sgZWxlbWVudC5uYW1lIF07XHJcblx0XHRcdFx0XHRyZXR1cm4gZXhpc3RpbmdSdWxlcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZmlsdGVyZWQgPSB7fTtcclxuXHRcdFx0XHQkLmVhY2goIGFyZ3VtZW50LnNwbGl0KCAvXFxzLyApLCBmdW5jdGlvbiggaW5kZXgsIG1ldGhvZCApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkWyBtZXRob2QgXSA9IGV4aXN0aW5nUnVsZXNbIG1ldGhvZCBdO1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGV4aXN0aW5nUnVsZXNbIG1ldGhvZCBdO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0XHRyZXR1cm4gZmlsdGVyZWQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRkYXRhID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZXMoXHJcblx0XHQkLmV4dGVuZChcclxuXHRcdFx0e30sXHJcblx0XHRcdCQudmFsaWRhdG9yLmNsYXNzUnVsZXMoIGVsZW1lbnQgKSxcclxuXHRcdFx0JC52YWxpZGF0b3IuYXR0cmlidXRlUnVsZXMoIGVsZW1lbnQgKSxcclxuXHRcdFx0JC52YWxpZGF0b3IuZGF0YVJ1bGVzKCBlbGVtZW50ICksXHJcblx0XHRcdCQudmFsaWRhdG9yLnN0YXRpY1J1bGVzKCBlbGVtZW50IClcclxuXHRcdCksIGVsZW1lbnQgKTtcclxuXHJcblx0XHQvLyBNYWtlIHN1cmUgcmVxdWlyZWQgaXMgYXQgZnJvbnRcclxuXHRcdGlmICggZGF0YS5yZXF1aXJlZCApIHtcclxuXHRcdFx0cGFyYW0gPSBkYXRhLnJlcXVpcmVkO1xyXG5cdFx0XHRkZWxldGUgZGF0YS5yZXF1aXJlZDtcclxuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKCB7IHJlcXVpcmVkOiBwYXJhbSB9LCBkYXRhICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gTWFrZSBzdXJlIHJlbW90ZSBpcyBhdCBiYWNrXHJcblx0XHRpZiAoIGRhdGEucmVtb3RlICkge1xyXG5cdFx0XHRwYXJhbSA9IGRhdGEucmVtb3RlO1xyXG5cdFx0XHRkZWxldGUgZGF0YS5yZW1vdGU7XHJcblx0XHRcdGRhdGEgPSAkLmV4dGVuZCggZGF0YSwgeyByZW1vdGU6IHBhcmFtIH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9XHJcbn0gKTtcclxuXHJcbi8vIEN1c3RvbSBzZWxlY3RvcnNcclxuJC5leHRlbmQoICQuZXhwci5wc2V1ZG9zIHx8ICQuZXhwclsgXCI6XCIgXSwge1x0XHQvLyAnfHwgJC5leHByWyBcIjpcIiBdJyBoZXJlIGVuYWJsZXMgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgdG8galF1ZXJ5IDEuNy4gQ2FuIGJlIHJlbW92ZWQgd2hlbiBkcm9wcGluZyBqUSAxLjcueCBzdXBwb3J0XHJcblxyXG5cdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvYmxhbmstc2VsZWN0b3IvXHJcblx0Ymxhbms6IGZ1bmN0aW9uKCBhICkge1xyXG5cdFx0cmV0dXJuICEkLnRyaW0oIFwiXCIgKyAkKCBhICkudmFsKCkgKTtcclxuXHR9LFxyXG5cclxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2ZpbGxlZC1zZWxlY3Rvci9cclxuXHRmaWxsZWQ6IGZ1bmN0aW9uKCBhICkge1xyXG5cdFx0dmFyIHZhbCA9ICQoIGEgKS52YWwoKTtcclxuXHRcdHJldHVybiB2YWwgIT09IG51bGwgJiYgISEkLnRyaW0oIFwiXCIgKyB2YWwgKTtcclxuXHR9LFxyXG5cclxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3VuY2hlY2tlZC1zZWxlY3Rvci9cclxuXHR1bmNoZWNrZWQ6IGZ1bmN0aW9uKCBhICkge1xyXG5cdFx0cmV0dXJuICEkKCBhICkucHJvcCggXCJjaGVja2VkXCIgKTtcclxuXHR9XHJcbn0gKTtcclxuXHJcbi8vIENvbnN0cnVjdG9yIGZvciB2YWxpZGF0b3JcclxuJC52YWxpZGF0b3IgPSBmdW5jdGlvbiggb3B0aW9ucywgZm9ybSApIHtcclxuXHR0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoIHRydWUsIHt9LCAkLnZhbGlkYXRvci5kZWZhdWx0cywgb3B0aW9ucyApO1xyXG5cdHRoaXMuY3VycmVudEZvcm0gPSBmb3JtO1xyXG5cdHRoaXMuaW5pdCgpO1xyXG59O1xyXG5cclxuLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9qUXVlcnkudmFsaWRhdG9yLmZvcm1hdC9cclxuJC52YWxpZGF0b3IuZm9ybWF0ID0gZnVuY3Rpb24oIHNvdXJjZSwgcGFyYW1zICkge1xyXG5cdGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGFyZ3MgPSAkLm1ha2VBcnJheSggYXJndW1lbnRzICk7XHJcblx0XHRcdGFyZ3MudW5zaGlmdCggc291cmNlICk7XHJcblx0XHRcdHJldHVybiAkLnZhbGlkYXRvci5mb3JtYXQuYXBwbHkoIHRoaXMsIGFyZ3MgKTtcclxuXHRcdH07XHJcblx0fVxyXG5cdGlmICggcGFyYW1zID09PSB1bmRlZmluZWQgKSB7XHJcblx0XHRyZXR1cm4gc291cmNlO1xyXG5cdH1cclxuXHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIHBhcmFtcy5jb25zdHJ1Y3RvciAhPT0gQXJyYXkgICkge1xyXG5cdFx0cGFyYW1zID0gJC5tYWtlQXJyYXkoIGFyZ3VtZW50cyApLnNsaWNlKCAxICk7XHJcblx0fVxyXG5cdGlmICggcGFyYW1zLmNvbnN0cnVjdG9yICE9PSBBcnJheSApIHtcclxuXHRcdHBhcmFtcyA9IFsgcGFyYW1zIF07XHJcblx0fVxyXG5cdCQuZWFjaCggcGFyYW1zLCBmdW5jdGlvbiggaSwgbiApIHtcclxuXHRcdHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKCBuZXcgUmVnRXhwKCBcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIiApLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9ICk7XHJcblx0fSApO1xyXG5cdHJldHVybiBzb3VyY2U7XHJcbn07XHJcblxyXG4kLmV4dGVuZCggJC52YWxpZGF0b3IsIHtcclxuXHJcblx0ZGVmYXVsdHM6IHtcclxuXHRcdG1lc3NhZ2VzOiB7fSxcclxuXHRcdGdyb3Vwczoge30sXHJcblx0XHRydWxlczoge30sXHJcblx0XHRlcnJvckNsYXNzOiBcImVycm9yXCIsXHJcblx0XHRwZW5kaW5nQ2xhc3M6IFwicGVuZGluZ1wiLFxyXG5cdFx0dmFsaWRDbGFzczogXCJ2YWxpZFwiLFxyXG5cdFx0ZXJyb3JFbGVtZW50OiBcImxhYmVsXCIsXHJcblx0XHRmb2N1c0NsZWFudXA6IGZhbHNlLFxyXG5cdFx0Zm9jdXNJbnZhbGlkOiB0cnVlLFxyXG5cdFx0ZXJyb3JDb250YWluZXI6ICQoIFtdICksXHJcblx0XHRlcnJvckxhYmVsQ29udGFpbmVyOiAkKCBbXSApLFxyXG5cdFx0b25zdWJtaXQ6IHRydWUsXHJcblx0XHRpZ25vcmU6IFwiOmhpZGRlblwiLFxyXG5cdFx0aWdub3JlVGl0bGU6IGZhbHNlLFxyXG5cdFx0b25mb2N1c2luOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0dGhpcy5sYXN0QWN0aXZlID0gZWxlbWVudDtcclxuXHJcblx0XHRcdC8vIEhpZGUgZXJyb3IgbGFiZWwgYW5kIHJlbW92ZSBlcnJvciBjbGFzcyBvbiBmb2N1cyBpZiBlbmFibGVkXHJcblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5mb2N1c0NsZWFudXAgKSB7XHJcblx0XHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0ICkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy51bmhpZ2hsaWdodC5jYWxsKCB0aGlzLCBlbGVtZW50LCB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3MsIHRoaXMuc2V0dGluZ3MudmFsaWRDbGFzcyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmhpZGVUaGVzZSggdGhpcy5lcnJvcnNGb3IoIGVsZW1lbnQgKSApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0b25mb2N1c291dDogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHRcdGlmICggIXRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgJiYgKCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgfHwgIXRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApICkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudCggZWxlbWVudCApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0b25rZXl1cDogZnVuY3Rpb24oIGVsZW1lbnQsIGV2ZW50ICkge1xyXG5cclxuXHRcdFx0Ly8gQXZvaWQgcmV2YWxpZGF0ZSB0aGUgZmllbGQgd2hlbiBwcmVzc2luZyBvbmUgb2YgdGhlIGZvbGxvd2luZyBrZXlzXHJcblx0XHRcdC8vIFNoaWZ0ICAgICAgID0+IDE2XHJcblx0XHRcdC8vIEN0cmwgICAgICAgID0+IDE3XHJcblx0XHRcdC8vIEFsdCAgICAgICAgID0+IDE4XHJcblx0XHRcdC8vIENhcHMgbG9jayAgID0+IDIwXHJcblx0XHRcdC8vIEVuZCAgICAgICAgID0+IDM1XHJcblx0XHRcdC8vIEhvbWUgICAgICAgID0+IDM2XHJcblx0XHRcdC8vIExlZnQgYXJyb3cgID0+IDM3XHJcblx0XHRcdC8vIFVwIGFycm93ICAgID0+IDM4XHJcblx0XHRcdC8vIFJpZ2h0IGFycm93ID0+IDM5XHJcblx0XHRcdC8vIERvd24gYXJyb3cgID0+IDQwXHJcblx0XHRcdC8vIEluc2VydCAgICAgID0+IDQ1XHJcblx0XHRcdC8vIE51bSBsb2NrICAgID0+IDE0NFxyXG5cdFx0XHQvLyBBbHRHciBrZXkgICA9PiAyMjVcclxuXHRcdFx0dmFyIGV4Y2x1ZGVkS2V5cyA9IFtcclxuXHRcdFx0XHQxNiwgMTcsIDE4LCAyMCwgMzUsIDM2LCAzNyxcclxuXHRcdFx0XHQzOCwgMzksIDQwLCA0NSwgMTQ0LCAyMjVcclxuXHRcdFx0XTtcclxuXHJcblx0XHRcdGlmICggZXZlbnQud2hpY2ggPT09IDkgJiYgdGhpcy5lbGVtZW50VmFsdWUoIGVsZW1lbnQgKSA9PT0gXCJcIiB8fCAkLmluQXJyYXkoIGV2ZW50LmtleUNvZGUsIGV4Y2x1ZGVkS2V5cyApICE9PSAtMSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSBpZiAoIGVsZW1lbnQubmFtZSBpbiB0aGlzLnN1Ym1pdHRlZCB8fCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5pbnZhbGlkICkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudCggZWxlbWVudCApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0b25jbGljazogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblxyXG5cdFx0XHQvLyBDbGljayBvbiBzZWxlY3RzLCByYWRpb2J1dHRvbnMgYW5kIGNoZWNrYm94ZXNcclxuXHRcdFx0aWYgKCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50KCBlbGVtZW50ICk7XHJcblxyXG5cdFx0XHQvLyBPciBvcHRpb24gZWxlbWVudHMsIGNoZWNrIHBhcmVudCBzZWxlY3QgaW4gdGhhdCBjYXNlXHJcblx0XHRcdH0gZWxzZSBpZiAoIGVsZW1lbnQucGFyZW50Tm9kZS5uYW1lIGluIHRoaXMuc3VibWl0dGVkICkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudCggZWxlbWVudC5wYXJlbnROb2RlICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRoaWdobGlnaHQ6IGZ1bmN0aW9uKCBlbGVtZW50LCBlcnJvckNsYXNzLCB2YWxpZENsYXNzICkge1xyXG5cdFx0XHRpZiAoIGVsZW1lbnQudHlwZSA9PT0gXCJyYWRpb1wiICkge1xyXG5cdFx0XHRcdHRoaXMuZmluZEJ5TmFtZSggZWxlbWVudC5uYW1lICkuYWRkQ2xhc3MoIGVycm9yQ2xhc3MgKS5yZW1vdmVDbGFzcyggdmFsaWRDbGFzcyApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoIGVsZW1lbnQgKS5hZGRDbGFzcyggZXJyb3JDbGFzcyApLnJlbW92ZUNsYXNzKCB2YWxpZENsYXNzICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR1bmhpZ2hsaWdodDogZnVuY3Rpb24oIGVsZW1lbnQsIGVycm9yQ2xhc3MsIHZhbGlkQ2xhc3MgKSB7XHJcblx0XHRcdGlmICggZWxlbWVudC50eXBlID09PSBcInJhZGlvXCIgKSB7XHJcblx0XHRcdFx0dGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5yZW1vdmVDbGFzcyggZXJyb3JDbGFzcyApLmFkZENsYXNzKCB2YWxpZENsYXNzICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCggZWxlbWVudCApLnJlbW92ZUNsYXNzKCBlcnJvckNsYXNzICkuYWRkQ2xhc3MoIHZhbGlkQ2xhc3MgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvalF1ZXJ5LnZhbGlkYXRvci5zZXREZWZhdWx0cy9cclxuXHRzZXREZWZhdWx0czogZnVuY3Rpb24oIHNldHRpbmdzICkge1xyXG5cdFx0JC5leHRlbmQoICQudmFsaWRhdG9yLmRlZmF1bHRzLCBzZXR0aW5ncyApO1xyXG5cdH0sXHJcblxyXG5cdG1lc3NhZ2VzOiB7XHJcblx0XHRyZXF1aXJlZDogXCJUaGlzIGZpZWxkIGlzIHJlcXVpcmVkLlwiLFxyXG5cdFx0cmVtb3RlOiBcIlBsZWFzZSBmaXggdGhpcyBmaWVsZC5cIixcclxuXHRcdGVtYWlsOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIsXHJcblx0XHR1cmw6IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgVVJMLlwiLFxyXG5cdFx0ZGF0ZTogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlLlwiLFxyXG5cdFx0ZGF0ZUlTTzogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLlwiLFxyXG5cdFx0bnVtYmVyOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIG51bWJlci5cIixcclxuXHRcdGRpZ2l0czogXCJQbGVhc2UgZW50ZXIgb25seSBkaWdpdHMuXCIsXHJcblx0XHRlcXVhbFRvOiBcIlBsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi5cIixcclxuXHRcdG1heGxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBubyBtb3JlIHRoYW4gezB9IGNoYXJhY3RlcnMuXCIgKSxcclxuXHRcdG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhdCBsZWFzdCB7MH0gY2hhcmFjdGVycy5cIiApLFxyXG5cdFx0cmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuIHswfSBhbmQgezF9IGNoYXJhY3RlcnMgbG9uZy5cIiApLFxyXG5cdFx0cmFuZ2U6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuIHswfSBhbmQgezF9LlwiICksXHJcblx0XHRtYXg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYSB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gezB9LlwiICksXHJcblx0XHRtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gezB9LlwiICksXHJcblx0XHRzdGVwOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGEgbXVsdGlwbGUgb2YgezB9LlwiIClcclxuXHR9LFxyXG5cclxuXHRhdXRvQ3JlYXRlUmFuZ2VzOiBmYWxzZSxcclxuXHJcblx0cHJvdG90eXBlOiB7XHJcblxyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMubGFiZWxDb250YWluZXIgPSAkKCB0aGlzLnNldHRpbmdzLmVycm9yTGFiZWxDb250YWluZXIgKTtcclxuXHRcdFx0dGhpcy5lcnJvckNvbnRleHQgPSB0aGlzLmxhYmVsQ29udGFpbmVyLmxlbmd0aCAmJiB0aGlzLmxhYmVsQ29udGFpbmVyIHx8ICQoIHRoaXMuY3VycmVudEZvcm0gKTtcclxuXHRcdFx0dGhpcy5jb250YWluZXJzID0gJCggdGhpcy5zZXR0aW5ncy5lcnJvckNvbnRhaW5lciApLmFkZCggdGhpcy5zZXR0aW5ncy5lcnJvckxhYmVsQ29udGFpbmVyICk7XHJcblx0XHRcdHRoaXMuc3VibWl0dGVkID0ge307XHJcblx0XHRcdHRoaXMudmFsdWVDYWNoZSA9IHt9O1xyXG5cdFx0XHR0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gMDtcclxuXHRcdFx0dGhpcy5wZW5kaW5nID0ge307XHJcblx0XHRcdHRoaXMuaW52YWxpZCA9IHt9O1xyXG5cdFx0XHR0aGlzLnJlc2V0KCk7XHJcblxyXG5cdFx0XHR2YXIgZ3JvdXBzID0gKCB0aGlzLmdyb3VwcyA9IHt9ICksXHJcblx0XHRcdFx0cnVsZXM7XHJcblx0XHRcdCQuZWFjaCggdGhpcy5zZXR0aW5ncy5ncm91cHMsIGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xyXG5cdFx0XHRcdGlmICggdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5zcGxpdCggL1xccy8gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5lYWNoKCB2YWx1ZSwgZnVuY3Rpb24oIGluZGV4LCBuYW1lICkge1xyXG5cdFx0XHRcdFx0Z3JvdXBzWyBuYW1lIF0gPSBrZXk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdHJ1bGVzID0gdGhpcy5zZXR0aW5ncy5ydWxlcztcclxuXHRcdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XHJcblx0XHRcdFx0cnVsZXNbIGtleSBdID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZSggdmFsdWUgKTtcclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZGVsZWdhdGUoIGV2ZW50ICkge1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgZm9ybSBleHBhbmRvIG9uIGNvbnRlbnRlZGl0YWJsZVxyXG5cdFx0XHRcdGlmICggIXRoaXMuZm9ybSAmJiB0aGlzLmhhc0F0dHJpYnV0ZSggXCJjb250ZW50ZWRpdGFibGVcIiApICkge1xyXG5cdFx0XHRcdFx0dGhpcy5mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoIFwiZm9ybVwiIClbIDAgXTtcclxuXHRcdFx0XHRcdHRoaXMubmFtZSA9ICQoIHRoaXMgKS5hdHRyKCBcIm5hbWVcIiApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHZhbGlkYXRvciA9ICQuZGF0YSggdGhpcy5mb3JtLCBcInZhbGlkYXRvclwiICksXHJcblx0XHRcdFx0XHRldmVudFR5cGUgPSBcIm9uXCIgKyBldmVudC50eXBlLnJlcGxhY2UoIC9edmFsaWRhdGUvLCBcIlwiICksXHJcblx0XHRcdFx0XHRzZXR0aW5ncyA9IHZhbGlkYXRvci5zZXR0aW5ncztcclxuXHRcdFx0XHRpZiAoIHNldHRpbmdzWyBldmVudFR5cGUgXSAmJiAhJCggdGhpcyApLmlzKCBzZXR0aW5ncy5pZ25vcmUgKSApIHtcclxuXHRcdFx0XHRcdHNldHRpbmdzWyBldmVudFR5cGUgXS5jYWxsKCB2YWxpZGF0b3IsIHRoaXMsIGV2ZW50ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtIClcclxuXHRcdFx0XHQub24oIFwiZm9jdXNpbi52YWxpZGF0ZSBmb2N1c291dC52YWxpZGF0ZSBrZXl1cC52YWxpZGF0ZVwiLFxyXG5cdFx0XHRcdFx0XCI6dGV4dCwgW3R5cGU9J3Bhc3N3b3JkJ10sIFt0eXBlPSdmaWxlJ10sIHNlbGVjdCwgdGV4dGFyZWEsIFt0eXBlPSdudW1iZXInXSwgW3R5cGU9J3NlYXJjaCddLCBcIiArXHJcblx0XHRcdFx0XHRcIlt0eXBlPSd0ZWwnXSwgW3R5cGU9J3VybCddLCBbdHlwZT0nZW1haWwnXSwgW3R5cGU9J2RhdGV0aW1lJ10sIFt0eXBlPSdkYXRlJ10sIFt0eXBlPSdtb250aCddLCBcIiArXHJcblx0XHRcdFx0XHRcIlt0eXBlPSd3ZWVrJ10sIFt0eXBlPSd0aW1lJ10sIFt0eXBlPSdkYXRldGltZS1sb2NhbCddLCBbdHlwZT0ncmFuZ2UnXSwgW3R5cGU9J2NvbG9yJ10sIFwiICtcclxuXHRcdFx0XHRcdFwiW3R5cGU9J3JhZGlvJ10sIFt0eXBlPSdjaGVja2JveCddLCBbY29udGVudGVkaXRhYmxlXSwgW3R5cGU9J2J1dHRvbiddXCIsIGRlbGVnYXRlIClcclxuXHJcblx0XHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lLCBvbGRJRVxyXG5cdFx0XHRcdC8vIFwic2VsZWN0XCIgaXMgcHJvdmlkZWQgYXMgZXZlbnQudGFyZ2V0IHdoZW4gY2xpY2tpbmcgYSBvcHRpb25cclxuXHRcdFx0XHQub24oIFwiY2xpY2sudmFsaWRhdGVcIiwgXCJzZWxlY3QsIG9wdGlvbiwgW3R5cGU9J3JhZGlvJ10sIFt0eXBlPSdjaGVja2JveCddXCIsIGRlbGVnYXRlICk7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MuaW52YWxpZEhhbmRsZXIgKSB7XHJcblx0XHRcdFx0JCggdGhpcy5jdXJyZW50Rm9ybSApLm9uKCBcImludmFsaWQtZm9ybS52YWxpZGF0ZVwiLCB0aGlzLnNldHRpbmdzLmludmFsaWRIYW5kbGVyICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9WYWxpZGF0b3IuZm9ybS9cclxuXHRcdGZvcm06IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmNoZWNrRm9ybSgpO1xyXG5cdFx0XHQkLmV4dGVuZCggdGhpcy5zdWJtaXR0ZWQsIHRoaXMuZXJyb3JNYXAgKTtcclxuXHRcdFx0dGhpcy5pbnZhbGlkID0gJC5leHRlbmQoIHt9LCB0aGlzLmVycm9yTWFwICk7XHJcblx0XHRcdGlmICggIXRoaXMudmFsaWQoKSApIHtcclxuXHRcdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtICkudHJpZ2dlckhhbmRsZXIoIFwiaW52YWxpZC1mb3JtXCIsIFsgdGhpcyBdICk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5zaG93RXJyb3JzKCk7XHJcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNoZWNrRm9ybTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMucHJlcGFyZUZvcm0oKTtcclxuXHRcdFx0Zm9yICggdmFyIGkgPSAwLCBlbGVtZW50cyA9ICggdGhpcy5jdXJyZW50RWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzKCkgKTsgZWxlbWVudHNbIGkgXTsgaSsrICkge1xyXG5cdFx0XHRcdHRoaXMuY2hlY2soIGVsZW1lbnRzWyBpIF0gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcy52YWxpZCgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL1ZhbGlkYXRvci5lbGVtZW50L1xyXG5cdFx0ZWxlbWVudDogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHRcdHZhciBjbGVhbkVsZW1lbnQgPSB0aGlzLmNsZWFuKCBlbGVtZW50ICksXHJcblx0XHRcdFx0Y2hlY2tFbGVtZW50ID0gdGhpcy52YWxpZGF0aW9uVGFyZ2V0Rm9yKCBjbGVhbkVsZW1lbnQgKSxcclxuXHRcdFx0XHR2ID0gdGhpcyxcclxuXHRcdFx0XHRyZXN1bHQgPSB0cnVlLFxyXG5cdFx0XHRcdHJzLCBncm91cDtcclxuXHJcblx0XHRcdGlmICggY2hlY2tFbGVtZW50ID09PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuaW52YWxpZFsgY2xlYW5FbGVtZW50Lm5hbWUgXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnByZXBhcmVFbGVtZW50KCBjaGVja0VsZW1lbnQgKTtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRFbGVtZW50cyA9ICQoIGNoZWNrRWxlbWVudCApO1xyXG5cclxuXHRcdFx0XHQvLyBJZiB0aGlzIGVsZW1lbnQgaXMgZ3JvdXBlZCwgdGhlbiB2YWxpZGF0ZSBhbGwgZ3JvdXAgZWxlbWVudHMgYWxyZWFkeVxyXG5cdFx0XHRcdC8vIGNvbnRhaW5pbmcgYSB2YWx1ZVxyXG5cdFx0XHRcdGdyb3VwID0gdGhpcy5ncm91cHNbIGNoZWNrRWxlbWVudC5uYW1lIF07XHJcblx0XHRcdFx0aWYgKCBncm91cCApIHtcclxuXHRcdFx0XHRcdCQuZWFjaCggdGhpcy5ncm91cHMsIGZ1bmN0aW9uKCBuYW1lLCB0ZXN0Z3JvdXAgKSB7XHJcblx0XHRcdFx0XHRcdGlmICggdGVzdGdyb3VwID09PSBncm91cCAmJiBuYW1lICE9PSBjaGVja0VsZW1lbnQubmFtZSApIHtcclxuXHRcdFx0XHRcdFx0XHRjbGVhbkVsZW1lbnQgPSB2LnZhbGlkYXRpb25UYXJnZXRGb3IoIHYuY2xlYW4oIHYuZmluZEJ5TmFtZSggbmFtZSApICkgKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIGNsZWFuRWxlbWVudCAmJiBjbGVhbkVsZW1lbnQubmFtZSBpbiB2LmludmFsaWQgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2LmN1cnJlbnRFbGVtZW50cy5wdXNoKCBjbGVhbkVsZW1lbnQgKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCA9IHYuY2hlY2soIGNsZWFuRWxlbWVudCApICYmIHJlc3VsdDtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJzID0gdGhpcy5jaGVjayggY2hlY2tFbGVtZW50ICkgIT09IGZhbHNlO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3VsdCAmJiBycztcclxuXHRcdFx0XHRpZiAoIHJzICkge1xyXG5cdFx0XHRcdFx0dGhpcy5pbnZhbGlkWyBjaGVja0VsZW1lbnQubmFtZSBdID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuaW52YWxpZFsgY2hlY2tFbGVtZW50Lm5hbWUgXSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoICF0aGlzLm51bWJlck9mSW52YWxpZHMoKSApIHtcclxuXHJcblx0XHRcdFx0XHQvLyBIaWRlIGVycm9yIGNvbnRhaW5lcnMgb24gbGFzdCBlcnJvclxyXG5cdFx0XHRcdFx0dGhpcy50b0hpZGUgPSB0aGlzLnRvSGlkZS5hZGQoIHRoaXMuY29udGFpbmVycyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnNob3dFcnJvcnMoKTtcclxuXHJcblx0XHRcdFx0Ly8gQWRkIGFyaWEtaW52YWxpZCBzdGF0dXMgZm9yIHNjcmVlbiByZWFkZXJzXHJcblx0XHRcdFx0JCggZWxlbWVudCApLmF0dHIoIFwiYXJpYS1pbnZhbGlkXCIsICFycyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL1ZhbGlkYXRvci5zaG93RXJyb3JzL1xyXG5cdFx0c2hvd0Vycm9yczogZnVuY3Rpb24oIGVycm9ycyApIHtcclxuXHRcdFx0aWYgKCBlcnJvcnMgKSB7XHJcblx0XHRcdFx0dmFyIHZhbGlkYXRvciA9IHRoaXM7XHJcblxyXG5cdFx0XHRcdC8vIEFkZCBpdGVtcyB0byBlcnJvciBsaXN0IGFuZCBtYXBcclxuXHRcdFx0XHQkLmV4dGVuZCggdGhpcy5lcnJvck1hcCwgZXJyb3JzICk7XHJcblx0XHRcdFx0dGhpcy5lcnJvckxpc3QgPSAkLm1hcCggdGhpcy5lcnJvck1hcCwgZnVuY3Rpb24oIG1lc3NhZ2UsIG5hbWUgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBtZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50OiB2YWxpZGF0b3IuZmluZEJ5TmFtZSggbmFtZSApWyAwIF1cclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fSApO1xyXG5cclxuXHRcdFx0XHQvLyBSZW1vdmUgaXRlbXMgZnJvbSBzdWNjZXNzIGxpc3RcclxuXHRcdFx0XHR0aGlzLnN1Y2Nlc3NMaXN0ID0gJC5ncmVwKCB0aGlzLnN1Y2Nlc3NMaXN0LCBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0XHRcdHJldHVybiAhKCBlbGVtZW50Lm5hbWUgaW4gZXJyb3JzICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5zaG93RXJyb3JzICkge1xyXG5cdFx0XHRcdHRoaXMuc2V0dGluZ3Muc2hvd0Vycm9ycy5jYWxsKCB0aGlzLCB0aGlzLmVycm9yTWFwLCB0aGlzLmVycm9yTGlzdCApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZGVmYXVsdFNob3dFcnJvcnMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL1ZhbGlkYXRvci5yZXNldEZvcm0vXHJcblx0XHRyZXNldEZvcm06IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoICQuZm4ucmVzZXRGb3JtICkge1xyXG5cdFx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKS5yZXNldEZvcm0oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmludmFsaWQgPSB7fTtcclxuXHRcdFx0dGhpcy5zdWJtaXR0ZWQgPSB7fTtcclxuXHRcdFx0dGhpcy5wcmVwYXJlRm9ybSgpO1xyXG5cdFx0XHR0aGlzLmhpZGVFcnJvcnMoKTtcclxuXHRcdFx0dmFyIGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cygpXHJcblx0XHRcdFx0LnJlbW92ZURhdGEoIFwicHJldmlvdXNWYWx1ZVwiIClcclxuXHRcdFx0XHQucmVtb3ZlQXR0ciggXCJhcmlhLWludmFsaWRcIiApO1xyXG5cclxuXHRcdFx0dGhpcy5yZXNldEVsZW1lbnRzKCBlbGVtZW50cyApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZXNldEVsZW1lbnRzOiBmdW5jdGlvbiggZWxlbWVudHMgKSB7XHJcblx0XHRcdHZhciBpO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0ICkge1xyXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVsZW1lbnRzWyBpIF0sXHJcblx0XHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgXCJcIiApO1xyXG5cdFx0XHRcdFx0dGhpcy5maW5kQnlOYW1lKCBlbGVtZW50c1sgaSBdLm5hbWUgKS5yZW1vdmVDbGFzcyggdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1lbnRzXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcyApXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoIHRoaXMuc2V0dGluZ3MudmFsaWRDbGFzcyApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdG51bWJlck9mSW52YWxpZHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vYmplY3RMZW5ndGgoIHRoaXMuaW52YWxpZCApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvYmplY3RMZW5ndGg6IGZ1bmN0aW9uKCBvYmogKSB7XHJcblx0XHRcdC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXHJcblx0XHRcdHZhciBjb3VudCA9IDAsXHJcblx0XHRcdFx0aTtcclxuXHRcdFx0Zm9yICggaSBpbiBvYmogKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRoaXMgY2hlY2sgYWxsb3dzIGNvdW50aW5nIGVsZW1lbnRzIHdpdGggZW1wdHkgZXJyb3JcclxuXHRcdFx0XHQvLyBtZXNzYWdlIGFzIGludmFsaWQgZWxlbWVudHNcclxuXHRcdFx0XHRpZiAoIG9ialsgaSBdICE9PSB1bmRlZmluZWQgJiYgb2JqWyBpIF0gIT09IG51bGwgJiYgb2JqWyBpIF0gIT09IGZhbHNlICkge1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNvdW50O1xyXG5cdFx0fSxcclxuXHJcblx0XHRoaWRlRXJyb3JzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5oaWRlVGhlc2UoIHRoaXMudG9IaWRlICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGhpZGVUaGVzZTogZnVuY3Rpb24oIGVycm9ycyApIHtcclxuXHRcdFx0ZXJyb3JzLm5vdCggdGhpcy5jb250YWluZXJzICkudGV4dCggXCJcIiApO1xyXG5cdFx0XHR0aGlzLmFkZFdyYXBwZXIoIGVycm9ycyApLmhpZGUoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dmFsaWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zaXplKCkgPT09IDA7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNpemU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lcnJvckxpc3QubGVuZ3RoO1xyXG5cdFx0fSxcclxuXHJcblx0XHRmb2N1c0ludmFsaWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MuZm9jdXNJbnZhbGlkICkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQkKCB0aGlzLmZpbmRMYXN0QWN0aXZlKCkgfHwgdGhpcy5lcnJvckxpc3QubGVuZ3RoICYmIHRoaXMuZXJyb3JMaXN0WyAwIF0uZWxlbWVudCB8fCBbXSApXHJcblx0XHRcdFx0XHQuZmlsdGVyKCBcIjp2aXNpYmxlXCIgKVxyXG5cdFx0XHRcdFx0LmZvY3VzKClcclxuXHJcblx0XHRcdFx0XHQvLyBNYW51YWxseSB0cmlnZ2VyIGZvY3VzaW4gZXZlbnQ7IHdpdGhvdXQgaXQsIGZvY3VzaW4gaGFuZGxlciBpc24ndCBjYWxsZWQsIGZpbmRMYXN0QWN0aXZlIHdvbid0IGhhdmUgYW55dGhpbmcgdG8gZmluZFxyXG5cdFx0XHRcdFx0LnRyaWdnZXIoIFwiZm9jdXNpblwiICk7XHJcblx0XHRcdFx0fSBjYXRjaCAoIGUgKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWdub3JlIElFIHRocm93aW5nIGVycm9ycyB3aGVuIGZvY3VzaW5nIGhpZGRlbiBlbGVtZW50c1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRmaW5kTGFzdEFjdGl2ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBsYXN0QWN0aXZlID0gdGhpcy5sYXN0QWN0aXZlO1xyXG5cdFx0XHRyZXR1cm4gbGFzdEFjdGl2ZSAmJiAkLmdyZXAoIHRoaXMuZXJyb3JMaXN0LCBmdW5jdGlvbiggbiApIHtcclxuXHRcdFx0XHRyZXR1cm4gbi5lbGVtZW50Lm5hbWUgPT09IGxhc3RBY3RpdmUubmFtZTtcclxuXHRcdFx0fSApLmxlbmd0aCA9PT0gMSAmJiBsYXN0QWN0aXZlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRlbGVtZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB2YWxpZGF0b3IgPSB0aGlzLFxyXG5cdFx0XHRcdHJ1bGVzQ2FjaGUgPSB7fTtcclxuXHJcblx0XHRcdC8vIFNlbGVjdCBhbGwgdmFsaWQgaW5wdXRzIGluc2lkZSB0aGUgZm9ybSAobm8gc3VibWl0IG9yIHJlc2V0IGJ1dHRvbnMpXHJcblx0XHRcdHJldHVybiAkKCB0aGlzLmN1cnJlbnRGb3JtIClcclxuXHRcdFx0LmZpbmQoIFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIFtjb250ZW50ZWRpdGFibGVdXCIgKVxyXG5cdFx0XHQubm90KCBcIjpzdWJtaXQsIDpyZXNldCwgOmltYWdlLCA6ZGlzYWJsZWRcIiApXHJcblx0XHRcdC5ub3QoIHRoaXMuc2V0dGluZ3MuaWdub3JlIClcclxuXHRcdFx0LmZpbHRlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSB0aGlzLm5hbWUgfHwgJCggdGhpcyApLmF0dHIoIFwibmFtZVwiICk7IC8vIEZvciBjb250ZW50ZWRpdGFibGVcclxuXHRcdFx0XHRpZiAoICFuYW1lICYmIHZhbGlkYXRvci5zZXR0aW5ncy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSApIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiJW8gaGFzIG5vIG5hbWUgYXNzaWduZWRcIiwgdGhpcyApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gU2V0IGZvcm0gZXhwYW5kbyBvbiBjb250ZW50ZWRpdGFibGVcclxuXHRcdFx0XHRpZiAoIHRoaXMuaGFzQXR0cmlidXRlKCBcImNvbnRlbnRlZGl0YWJsZVwiICkgKSB7XHJcblx0XHRcdFx0XHR0aGlzLmZvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggXCJmb3JtXCIgKVsgMCBdO1xyXG5cdFx0XHRcdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFNlbGVjdCBvbmx5IHRoZSBmaXJzdCBlbGVtZW50IGZvciBlYWNoIG5hbWUsIGFuZCBvbmx5IHRob3NlIHdpdGggcnVsZXMgc3BlY2lmaWVkXHJcblx0XHRcdFx0aWYgKCBuYW1lIGluIHJ1bGVzQ2FjaGUgfHwgIXZhbGlkYXRvci5vYmplY3RMZW5ndGgoICQoIHRoaXMgKS5ydWxlcygpICkgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRydWxlc0NhY2hlWyBuYW1lIF0gPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNsZWFuOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XHJcblx0XHRcdHJldHVybiAkKCBzZWxlY3RvciApWyAwIF07XHJcblx0XHR9LFxyXG5cclxuXHRcdGVycm9yczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBlcnJvckNsYXNzID0gdGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzLnNwbGl0KCBcIiBcIiApLmpvaW4oIFwiLlwiICk7XHJcblx0XHRcdHJldHVybiAkKCB0aGlzLnNldHRpbmdzLmVycm9yRWxlbWVudCArIFwiLlwiICsgZXJyb3JDbGFzcywgdGhpcy5lcnJvckNvbnRleHQgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0cmVzZXRJbnRlcm5hbHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLnN1Y2Nlc3NMaXN0ID0gW107XHJcblx0XHRcdHRoaXMuZXJyb3JMaXN0ID0gW107XHJcblx0XHRcdHRoaXMuZXJyb3JNYXAgPSB7fTtcclxuXHRcdFx0dGhpcy50b1Nob3cgPSAkKCBbXSApO1xyXG5cdFx0XHR0aGlzLnRvSGlkZSA9ICQoIFtdICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlc2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5yZXNldEludGVybmFscygpO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRFbGVtZW50cyA9ICQoIFtdICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHByZXBhcmVGb3JtOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5yZXNldCgpO1xyXG5cdFx0XHR0aGlzLnRvSGlkZSA9IHRoaXMuZXJyb3JzKCkuYWRkKCB0aGlzLmNvbnRhaW5lcnMgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0cHJlcGFyZUVsZW1lbnQ6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHR0aGlzLnJlc2V0KCk7XHJcblx0XHRcdHRoaXMudG9IaWRlID0gdGhpcy5lcnJvcnNGb3IoIGVsZW1lbnQgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZWxlbWVudFZhbHVlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0dmFyICRlbGVtZW50ID0gJCggZWxlbWVudCApLFxyXG5cdFx0XHRcdHR5cGUgPSBlbGVtZW50LnR5cGUsXHJcblx0XHRcdFx0dmFsLCBpZHg7XHJcblxyXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwicmFkaW9cIiB8fCB0eXBlID09PSBcImNoZWNrYm94XCIgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZmluZEJ5TmFtZSggZWxlbWVudC5uYW1lICkuZmlsdGVyKCBcIjpjaGVja2VkXCIgKS52YWwoKTtcclxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgZWxlbWVudC52YWxpZGl0eSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC52YWxpZGl0eS5iYWRJbnB1dCA/IFwiTmFOXCIgOiAkZWxlbWVudC52YWwoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBlbGVtZW50Lmhhc0F0dHJpYnV0ZSggXCJjb250ZW50ZWRpdGFibGVcIiApICkge1xyXG5cdFx0XHRcdHZhbCA9ICRlbGVtZW50LnRleHQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YWwgPSAkZWxlbWVudC52YWwoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB0eXBlID09PSBcImZpbGVcIiApIHtcclxuXHJcblx0XHRcdFx0Ly8gTW9kZXJuIGJyb3dzZXIgKGNocm9tZSAmIHNhZmFyaSlcclxuXHRcdFx0XHRpZiAoIHZhbC5zdWJzdHIoIDAsIDEyICkgPT09IFwiQzpcXFxcZmFrZXBhdGhcXFxcXCIgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsLnN1YnN0ciggMTIgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIExlZ2FjeSBicm93c2Vyc1xyXG5cdFx0XHRcdC8vIFVuaXgtYmFzZWQgcGF0aFxyXG5cdFx0XHRcdGlkeCA9IHZhbC5sYXN0SW5kZXhPZiggXCIvXCIgKTtcclxuXHRcdFx0XHRpZiAoIGlkeCA+PSAwICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbC5zdWJzdHIoIGlkeCArIDEgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFdpbmRvd3MtYmFzZWQgcGF0aFxyXG5cdFx0XHRcdGlkeCA9IHZhbC5sYXN0SW5kZXhPZiggXCJcXFxcXCIgKTtcclxuXHRcdFx0XHRpZiAoIGlkeCA+PSAwICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbC5zdWJzdHIoIGlkeCArIDEgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEp1c3QgdGhlIGZpbGUgbmFtZVxyXG5cdFx0XHRcdHJldHVybiB2YWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIiApIHtcclxuXHRcdFx0XHRyZXR1cm4gdmFsLnJlcGxhY2UoIC9cXHIvZywgXCJcIiApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWw7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNoZWNrOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0ZWxlbWVudCA9IHRoaXMudmFsaWRhdGlvblRhcmdldEZvciggdGhpcy5jbGVhbiggZWxlbWVudCApICk7XHJcblxyXG5cdFx0XHR2YXIgcnVsZXMgPSAkKCBlbGVtZW50ICkucnVsZXMoKSxcclxuXHRcdFx0XHRydWxlc0NvdW50ID0gJC5tYXAoIHJ1bGVzLCBmdW5jdGlvbiggbiwgaSApIHtcclxuXHRcdFx0XHRcdHJldHVybiBpO1xyXG5cdFx0XHRcdH0gKS5sZW5ndGgsXHJcblx0XHRcdFx0ZGVwZW5kZW5jeU1pc21hdGNoID0gZmFsc2UsXHJcblx0XHRcdFx0dmFsID0gdGhpcy5lbGVtZW50VmFsdWUoIGVsZW1lbnQgKSxcclxuXHRcdFx0XHRyZXN1bHQsIG1ldGhvZCwgcnVsZSwgbm9ybWFsaXplcjtcclxuXHJcblx0XHRcdC8vIFByaW9yaXRpemUgdGhlIGxvY2FsIG5vcm1hbGl6ZXIgZGVmaW5lZCBmb3IgdGhpcyBlbGVtZW50IG92ZXIgdGhlIGdsb2JhbCBvbmVcclxuXHRcdFx0Ly8gaWYgdGhlIGZvcm1lciBleGlzdHMsIG90aGVyd2lzZSB1c2VyIHRoZSBnbG9iYWwgb25lIGluIGNhc2UgaXQgZXhpc3RzLlxyXG5cdFx0XHRpZiAoIHR5cGVvZiBydWxlcy5ub3JtYWxpemVyID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblx0XHRcdFx0bm9ybWFsaXplciA9IHJ1bGVzLm5vcm1hbGl6ZXI7XHJcblx0XHRcdH0gZWxzZSBpZiAoXHR0eXBlb2YgdGhpcy5zZXR0aW5ncy5ub3JtYWxpemVyID09PSBcImZ1bmN0aW9uXCIgKSB7XHJcblx0XHRcdFx0bm9ybWFsaXplciA9IHRoaXMuc2V0dGluZ3Mubm9ybWFsaXplcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSWYgbm9ybWFsaXplciBpcyBkZWZpbmVkLCB0aGVuIGNhbGwgaXQgdG8gcmV0cmVpdmUgdGhlIGNoYW5nZWQgdmFsdWUgaW5zdGVhZFxyXG5cdFx0XHQvLyBvZiB1c2luZyB0aGUgcmVhbCBvbmUuXHJcblx0XHRcdC8vIE5vdGUgdGhhdCBgdGhpc2AgaW4gdGhlIG5vcm1hbGl6ZXIgaXMgYGVsZW1lbnRgLlxyXG5cdFx0XHRpZiAoIG5vcm1hbGl6ZXIgKSB7XHJcblx0XHRcdFx0dmFsID0gbm9ybWFsaXplci5jYWxsKCBlbGVtZW50LCB2YWwgKTtcclxuXHJcblx0XHRcdFx0aWYgKCB0eXBlb2YgdmFsICE9PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvciggXCJUaGUgbm9ybWFsaXplciBzaG91bGQgcmV0dXJuIGEgc3RyaW5nIHZhbHVlLlwiICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBEZWxldGUgdGhlIG5vcm1hbGl6ZXIgZnJvbSBydWxlcyB0byBhdm9pZCB0cmVhdGluZyBpdCBhcyBhIHByZS1kZWZpbmVkIG1ldGhvZC5cclxuXHRcdFx0XHRkZWxldGUgcnVsZXMubm9ybWFsaXplcjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yICggbWV0aG9kIGluIHJ1bGVzICkge1xyXG5cdFx0XHRcdHJ1bGUgPSB7IG1ldGhvZDogbWV0aG9kLCBwYXJhbWV0ZXJzOiBydWxlc1sgbWV0aG9kIF0gfTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gJC52YWxpZGF0b3IubWV0aG9kc1sgbWV0aG9kIF0uY2FsbCggdGhpcywgdmFsLCBlbGVtZW50LCBydWxlLnBhcmFtZXRlcnMgKTtcclxuXHJcblx0XHRcdFx0XHQvLyBJZiBhIG1ldGhvZCBpbmRpY2F0ZXMgdGhhdCB0aGUgZmllbGQgaXMgb3B0aW9uYWwgYW5kIHRoZXJlZm9yZSB2YWxpZCxcclxuXHRcdFx0XHRcdC8vIGRvbid0IG1hcmsgaXQgYXMgdmFsaWQgd2hlbiB0aGVyZSBhcmUgbm8gb3RoZXIgcnVsZXNcclxuXHRcdFx0XHRcdGlmICggcmVzdWx0ID09PSBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIiAmJiBydWxlc0NvdW50ID09PSAxICkge1xyXG5cdFx0XHRcdFx0XHRkZXBlbmRlbmN5TWlzbWF0Y2ggPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRlcGVuZGVuY3lNaXNtYXRjaCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdGlmICggcmVzdWx0ID09PSBcInBlbmRpbmdcIiApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy50b0hpZGUgPSB0aGlzLnRvSGlkZS5ub3QoIHRoaXMuZXJyb3JzRm9yKCBlbGVtZW50ICkgKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggIXJlc3VsdCApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5mb3JtYXRBbmRBZGQoIGVsZW1lbnQsIHJ1bGUgKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyggXCJFeGNlcHRpb24gb2NjdXJyZWQgd2hlbiBjaGVja2luZyBlbGVtZW50IFwiICsgZWxlbWVudC5pZCArIFwiLCBjaGVjayB0aGUgJ1wiICsgcnVsZS5tZXRob2QgKyBcIicgbWV0aG9kLlwiLCBlICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IgKSB7XHJcblx0XHRcdFx0XHRcdGUubWVzc2FnZSArPSBcIi4gIEV4Y2VwdGlvbiBvY2N1cnJlZCB3aGVuIGNoZWNraW5nIGVsZW1lbnQgXCIgKyBlbGVtZW50LmlkICsgXCIsIGNoZWNrIHRoZSAnXCIgKyBydWxlLm1ldGhvZCArIFwiJyBtZXRob2QuXCI7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhyb3cgZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBkZXBlbmRlbmN5TWlzbWF0Y2ggKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggdGhpcy5vYmplY3RMZW5ndGgoIHJ1bGVzICkgKSB7XHJcblx0XHRcdFx0dGhpcy5zdWNjZXNzTGlzdC5wdXNoKCBlbGVtZW50ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFJldHVybiB0aGUgY3VzdG9tIG1lc3NhZ2UgZm9yIHRoZSBnaXZlbiBlbGVtZW50IGFuZCB2YWxpZGF0aW9uIG1ldGhvZFxyXG5cdFx0Ly8gc3BlY2lmaWVkIGluIHRoZSBlbGVtZW50J3MgSFRNTDUgZGF0YSBhdHRyaWJ1dGVcclxuXHRcdC8vIHJldHVybiB0aGUgZ2VuZXJpYyBtZXNzYWdlIGlmIHByZXNlbnQgYW5kIG5vIG1ldGhvZCBzcGVjaWZpYyBtZXNzYWdlIGlzIHByZXNlbnRcclxuXHRcdGN1c3RvbURhdGFNZXNzYWdlOiBmdW5jdGlvbiggZWxlbWVudCwgbWV0aG9kICkge1xyXG5cdFx0XHRyZXR1cm4gJCggZWxlbWVudCApLmRhdGEoIFwibXNnXCIgKyBtZXRob2QuY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArXHJcblx0XHRcdFx0bWV0aG9kLnN1YnN0cmluZyggMSApLnRvTG93ZXJDYXNlKCkgKSB8fCAkKCBlbGVtZW50ICkuZGF0YSggXCJtc2dcIiApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBSZXR1cm4gdGhlIGN1c3RvbSBtZXNzYWdlIGZvciB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGFuZCB2YWxpZGF0aW9uIG1ldGhvZFxyXG5cdFx0Y3VzdG9tTWVzc2FnZTogZnVuY3Rpb24oIG5hbWUsIG1ldGhvZCApIHtcclxuXHRcdFx0dmFyIG0gPSB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBuYW1lIF07XHJcblx0XHRcdHJldHVybiBtICYmICggbS5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nID8gbSA6IG1bIG1ldGhvZCBdICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFJldHVybiB0aGUgZmlyc3QgZGVmaW5lZCBhcmd1bWVudCwgYWxsb3dpbmcgZW1wdHkgc3RyaW5nc1xyXG5cdFx0ZmluZERlZmluZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdFx0aWYgKCBhcmd1bWVudHNbIGkgXSAhPT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGFyZ3VtZW50c1sgaSBdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBUaGUgc2Vjb25kIHBhcmFtZXRlciAncnVsZScgdXNlZCB0byBiZSBhIHN0cmluZywgYW5kIGV4dGVuZGVkIHRvIGFuIG9iamVjdCBsaXRlcmFsXHJcblx0XHQvLyBvZiB0aGUgZm9sbG93aW5nIGZvcm06XHJcblx0XHQvLyBydWxlID0ge1xyXG5cdFx0Ly8gICAgIG1ldGhvZDogXCJtZXRob2QgbmFtZVwiLFxyXG5cdFx0Ly8gICAgIHBhcmFtZXRlcnM6IFwidGhlIGdpdmVuIG1ldGhvZCBwYXJhbWV0ZXJzXCJcclxuXHRcdC8vIH1cclxuXHRcdC8vXHJcblx0XHQvLyBUaGUgb2xkIGJlaGF2aW9yIHN0aWxsIHN1cHBvcnRlZCwga2VwdCB0byBtYWludGFpbiBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGhcclxuXHRcdC8vIG9sZCBjb2RlLCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXHJcblx0XHRkZWZhdWx0TWVzc2FnZTogZnVuY3Rpb24oIGVsZW1lbnQsIHJ1bGUgKSB7XHJcblx0XHRcdGlmICggdHlwZW9mIHJ1bGUgPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0cnVsZSA9IHsgbWV0aG9kOiBydWxlIH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtZXNzYWdlID0gdGhpcy5maW5kRGVmaW5lZChcclxuXHRcdFx0XHRcdHRoaXMuY3VzdG9tTWVzc2FnZSggZWxlbWVudC5uYW1lLCBydWxlLm1ldGhvZCApLFxyXG5cdFx0XHRcdFx0dGhpcy5jdXN0b21EYXRhTWVzc2FnZSggZWxlbWVudCwgcnVsZS5tZXRob2QgKSxcclxuXHJcblx0XHRcdFx0XHQvLyAndGl0bGUnIGlzIG5ldmVyIHVuZGVmaW5lZCwgc28gaGFuZGxlIGVtcHR5IHN0cmluZyBhcyB1bmRlZmluZWRcclxuXHRcdFx0XHRcdCF0aGlzLnNldHRpbmdzLmlnbm9yZVRpdGxlICYmIGVsZW1lbnQudGl0bGUgfHwgdW5kZWZpbmVkLFxyXG5cdFx0XHRcdFx0JC52YWxpZGF0b3IubWVzc2FnZXNbIHJ1bGUubWV0aG9kIF0sXHJcblx0XHRcdFx0XHRcIjxzdHJvbmc+V2FybmluZzogTm8gbWVzc2FnZSBkZWZpbmVkIGZvciBcIiArIGVsZW1lbnQubmFtZSArIFwiPC9zdHJvbmc+XCJcclxuXHRcdFx0XHQpLFxyXG5cdFx0XHRcdHRoZXJlZ2V4ID0gL1xcJD9cXHsoXFxkKylcXH0vZztcclxuXHRcdFx0aWYgKCB0eXBlb2YgbWVzc2FnZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG5cdFx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlLmNhbGwoIHRoaXMsIHJ1bGUucGFyYW1ldGVycywgZWxlbWVudCApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCB0aGVyZWdleC50ZXN0KCBtZXNzYWdlICkgKSB7XHJcblx0XHRcdFx0bWVzc2FnZSA9ICQudmFsaWRhdG9yLmZvcm1hdCggbWVzc2FnZS5yZXBsYWNlKCB0aGVyZWdleCwgXCJ7JDF9XCIgKSwgcnVsZS5wYXJhbWV0ZXJzICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBtZXNzYWdlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRmb3JtYXRBbmRBZGQ6IGZ1bmN0aW9uKCBlbGVtZW50LCBydWxlICkge1xyXG5cdFx0XHR2YXIgbWVzc2FnZSA9IHRoaXMuZGVmYXVsdE1lc3NhZ2UoIGVsZW1lbnQsIHJ1bGUgKTtcclxuXHJcblx0XHRcdHRoaXMuZXJyb3JMaXN0LnB1c2goIHtcclxuXHRcdFx0XHRtZXNzYWdlOiBtZXNzYWdlLFxyXG5cdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQsXHJcblx0XHRcdFx0bWV0aG9kOiBydWxlLm1ldGhvZFxyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHR0aGlzLmVycm9yTWFwWyBlbGVtZW50Lm5hbWUgXSA9IG1lc3NhZ2U7XHJcblx0XHRcdHRoaXMuc3VibWl0dGVkWyBlbGVtZW50Lm5hbWUgXSA9IG1lc3NhZ2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFkZFdyYXBwZXI6IGZ1bmN0aW9uKCB0b1RvZ2dsZSApIHtcclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLndyYXBwZXIgKSB7XHJcblx0XHRcdFx0dG9Ub2dnbGUgPSB0b1RvZ2dsZS5hZGQoIHRvVG9nZ2xlLnBhcmVudCggdGhpcy5zZXR0aW5ncy53cmFwcGVyICkgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdG9Ub2dnbGU7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlZmF1bHRTaG93RXJyb3JzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGksIGVsZW1lbnRzLCBlcnJvcjtcclxuXHRcdFx0Zm9yICggaSA9IDA7IHRoaXMuZXJyb3JMaXN0WyBpIF07IGkrKyApIHtcclxuXHRcdFx0XHRlcnJvciA9IHRoaXMuZXJyb3JMaXN0WyBpIF07XHJcblx0XHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmhpZ2hsaWdodCApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVycm9yLmVsZW1lbnQsIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc2hvd0xhYmVsKCBlcnJvci5lbGVtZW50LCBlcnJvci5tZXNzYWdlICk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCB0aGlzLmVycm9yTGlzdC5sZW5ndGggKSB7XHJcblx0XHRcdFx0dGhpcy50b1Nob3cgPSB0aGlzLnRvU2hvdy5hZGQoIHRoaXMuY29udGFpbmVycyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5zdWNjZXNzICkge1xyXG5cdFx0XHRcdGZvciAoIGkgPSAwOyB0aGlzLnN1Y2Nlc3NMaXN0WyBpIF07IGkrKyApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2hvd0xhYmVsKCB0aGlzLnN1Y2Nlc3NMaXN0WyBpIF0gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0ICkge1xyXG5cdFx0XHRcdGZvciAoIGkgPSAwLCBlbGVtZW50cyA9IHRoaXMudmFsaWRFbGVtZW50cygpOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnVuaGlnaGxpZ2h0LmNhbGwoIHRoaXMsIGVsZW1lbnRzWyBpIF0sIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcywgdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudG9IaWRlID0gdGhpcy50b0hpZGUubm90KCB0aGlzLnRvU2hvdyApO1xyXG5cdFx0XHR0aGlzLmhpZGVFcnJvcnMoKTtcclxuXHRcdFx0dGhpcy5hZGRXcmFwcGVyKCB0aGlzLnRvU2hvdyApLnNob3coKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dmFsaWRFbGVtZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmN1cnJlbnRFbGVtZW50cy5ub3QoIHRoaXMuaW52YWxpZEVsZW1lbnRzKCkgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aW52YWxpZEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICQoIHRoaXMuZXJyb3JMaXN0ICkubWFwKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbGVtZW50O1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNob3dMYWJlbDogZnVuY3Rpb24oIGVsZW1lbnQsIG1lc3NhZ2UgKSB7XHJcblx0XHRcdHZhciBwbGFjZSwgZ3JvdXAsIGVycm9ySUQsIHYsXHJcblx0XHRcdFx0ZXJyb3IgPSB0aGlzLmVycm9yc0ZvciggZWxlbWVudCApLFxyXG5cdFx0XHRcdGVsZW1lbnRJRCA9IHRoaXMuaWRPck5hbWUoIGVsZW1lbnQgKSxcclxuXHRcdFx0XHRkZXNjcmliZWRCeSA9ICQoIGVsZW1lbnQgKS5hdHRyKCBcImFyaWEtZGVzY3JpYmVkYnlcIiApO1xyXG5cclxuXHRcdFx0aWYgKCBlcnJvci5sZW5ndGggKSB7XHJcblxyXG5cdFx0XHRcdC8vIFJlZnJlc2ggZXJyb3Ivc3VjY2VzcyBjbGFzc1xyXG5cdFx0XHRcdGVycm9yLnJlbW92ZUNsYXNzKCB0aGlzLnNldHRpbmdzLnZhbGlkQ2xhc3MgKS5hZGRDbGFzcyggdGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzICk7XHJcblxyXG5cdFx0XHRcdC8vIFJlcGxhY2UgbWVzc2FnZSBvbiBleGlzdGluZyBsYWJlbFxyXG5cdFx0XHRcdGVycm9yLmh0bWwoIG1lc3NhZ2UgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0Ly8gQ3JlYXRlIGVycm9yIGVsZW1lbnRcclxuXHRcdFx0XHRlcnJvciA9ICQoIFwiPFwiICsgdGhpcy5zZXR0aW5ncy5lcnJvckVsZW1lbnQgKyBcIj5cIiApXHJcblx0XHRcdFx0XHQuYXR0ciggXCJpZFwiLCBlbGVtZW50SUQgKyBcIi1lcnJvclwiIClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggdGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzIClcclxuXHRcdFx0XHRcdC5odG1sKCBtZXNzYWdlIHx8IFwiXCIgKTtcclxuXHJcblx0XHRcdFx0Ly8gTWFpbnRhaW4gcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRvIGJlIHBsYWNlZCBpbnRvIHRoZSBET01cclxuXHRcdFx0XHRwbGFjZSA9IGVycm9yO1xyXG5cdFx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy53cmFwcGVyICkge1xyXG5cclxuXHRcdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCBldmVuIGluIElFXHJcblx0XHRcdFx0XHQvLyBhY3R1YWxseSBzaG93aW5nIHRoZSB3cmFwcGVkIGVsZW1lbnQgaXMgaGFuZGxlZCBlbHNld2hlcmVcclxuXHRcdFx0XHRcdHBsYWNlID0gZXJyb3IuaGlkZSgpLnNob3coKS53cmFwKCBcIjxcIiArIHRoaXMuc2V0dGluZ3Mud3JhcHBlciArIFwiLz5cIiApLnBhcmVudCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIHRoaXMubGFiZWxDb250YWluZXIubGVuZ3RoICkge1xyXG5cdFx0XHRcdFx0dGhpcy5sYWJlbENvbnRhaW5lci5hcHBlbmQoIHBsYWNlICk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICggdGhpcy5zZXR0aW5ncy5lcnJvclBsYWNlbWVudCApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuZXJyb3JQbGFjZW1lbnQuY2FsbCggdGhpcywgcGxhY2UsICQoIGVsZW1lbnQgKSApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRwbGFjZS5pbnNlcnRBZnRlciggZWxlbWVudCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gTGluayBlcnJvciBiYWNrIHRvIHRoZSBlbGVtZW50XHJcblx0XHRcdFx0aWYgKCBlcnJvci5pcyggXCJsYWJlbFwiICkgKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGVycm9yIGlzIGEgbGFiZWwsIHRoZW4gYXNzb2NpYXRlIHVzaW5nICdmb3InXHJcblx0XHRcdFx0XHRlcnJvci5hdHRyKCBcImZvclwiLCBlbGVtZW50SUQgKTtcclxuXHJcblx0XHRcdFx0XHQvLyBJZiB0aGUgZWxlbWVudCBpcyBub3QgYSBjaGlsZCBvZiBhbiBhc3NvY2lhdGVkIGxhYmVsLCB0aGVuIGl0J3MgbmVjZXNzYXJ5XHJcblx0XHRcdFx0XHQvLyB0byBleHBsaWNpdGx5IGFwcGx5IGFyaWEtZGVzY3JpYmVkYnlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBlcnJvci5wYXJlbnRzKCBcImxhYmVsW2Zvcj0nXCIgKyB0aGlzLmVzY2FwZUNzc01ldGEoIGVsZW1lbnRJRCApICsgXCInXVwiICkubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdFx0ZXJyb3JJRCA9IGVycm9yLmF0dHIoIFwiaWRcIiApO1xyXG5cclxuXHRcdFx0XHRcdC8vIFJlc3BlY3QgZXhpc3Rpbmcgbm9uLWVycm9yIGFyaWEtZGVzY3JpYmVkYnlcclxuXHRcdFx0XHRcdGlmICggIWRlc2NyaWJlZEJ5ICkge1xyXG5cdFx0XHRcdFx0XHRkZXNjcmliZWRCeSA9IGVycm9ySUQ7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhZGVzY3JpYmVkQnkubWF0Y2goIG5ldyBSZWdFeHAoIFwiXFxcXGJcIiArIHRoaXMuZXNjYXBlQ3NzTWV0YSggZXJyb3JJRCApICsgXCJcXFxcYlwiICkgKSApIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIEFkZCB0byBlbmQgb2YgbGlzdCBpZiBub3QgYWxyZWFkeSBwcmVzZW50XHJcblx0XHRcdFx0XHRcdGRlc2NyaWJlZEJ5ICs9IFwiIFwiICsgZXJyb3JJRDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCQoIGVsZW1lbnQgKS5hdHRyKCBcImFyaWEtZGVzY3JpYmVkYnlcIiwgZGVzY3JpYmVkQnkgKTtcclxuXHJcblx0XHRcdFx0XHQvLyBJZiB0aGlzIGVsZW1lbnQgaXMgZ3JvdXBlZCwgdGhlbiBhc3NpZ24gdG8gYWxsIGVsZW1lbnRzIGluIHRoZSBzYW1lIGdyb3VwXHJcblx0XHRcdFx0XHRncm91cCA9IHRoaXMuZ3JvdXBzWyBlbGVtZW50Lm5hbWUgXTtcclxuXHRcdFx0XHRcdGlmICggZ3JvdXAgKSB7XHJcblx0XHRcdFx0XHRcdHYgPSB0aGlzO1xyXG5cdFx0XHRcdFx0XHQkLmVhY2goIHYuZ3JvdXBzLCBmdW5jdGlvbiggbmFtZSwgdGVzdGdyb3VwICkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICggdGVzdGdyb3VwID09PSBncm91cCApIHtcclxuXHRcdFx0XHRcdFx0XHRcdCQoIFwiW25hbWU9J1wiICsgdi5lc2NhcGVDc3NNZXRhKCBuYW1lICkgKyBcIiddXCIsIHYuY3VycmVudEZvcm0gKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQuYXR0ciggXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9yLmF0dHIoIFwiaWRcIiApICk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggIW1lc3NhZ2UgJiYgdGhpcy5zZXR0aW5ncy5zdWNjZXNzICkge1xyXG5cdFx0XHRcdGVycm9yLnRleHQoIFwiXCIgKTtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiB0aGlzLnNldHRpbmdzLnN1Y2Nlc3MgPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0XHRlcnJvci5hZGRDbGFzcyggdGhpcy5zZXR0aW5ncy5zdWNjZXNzICk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3Muc3VjY2VzcyggZXJyb3IsIGVsZW1lbnQgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy50b1Nob3cgPSB0aGlzLnRvU2hvdy5hZGQoIGVycm9yICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGVycm9yc0ZvcjogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHRcdHZhciBuYW1lID0gdGhpcy5lc2NhcGVDc3NNZXRhKCB0aGlzLmlkT3JOYW1lKCBlbGVtZW50ICkgKSxcclxuXHRcdFx0XHRkZXNjcmliZXIgPSAkKCBlbGVtZW50ICkuYXR0ciggXCJhcmlhLWRlc2NyaWJlZGJ5XCIgKSxcclxuXHRcdFx0XHRzZWxlY3RvciA9IFwibGFiZWxbZm9yPSdcIiArIG5hbWUgKyBcIiddLCBsYWJlbFtmb3I9J1wiICsgbmFtZSArIFwiJ10gKlwiO1xyXG5cclxuXHRcdFx0Ly8gJ2FyaWEtZGVzY3JpYmVkYnknIHNob3VsZCBkaXJlY3RseSByZWZlcmVuY2UgdGhlIGVycm9yIGVsZW1lbnRcclxuXHRcdFx0aWYgKCBkZXNjcmliZXIgKSB7XHJcblx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3RvciArIFwiLCAjXCIgKyB0aGlzLmVzY2FwZUNzc01ldGEoIGRlc2NyaWJlciApXHJcblx0XHRcdFx0XHQucmVwbGFjZSggL1xccysvZywgXCIsICNcIiApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdC5lcnJvcnMoKVxyXG5cdFx0XHRcdC5maWx0ZXIoIHNlbGVjdG9yICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFNlZSBodHRwczovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L3NlbGVjdG9ycy8sIGZvciBDU1NcclxuXHRcdC8vIG1ldGEtY2hhcmFjdGVycyB0aGF0IHNob3VsZCBiZSBlc2NhcGVkIGluIG9yZGVyIHRvIGJlIHVzZWQgd2l0aCBKUXVlcnlcclxuXHRcdC8vIGFzIGEgbGl0ZXJhbCBwYXJ0IG9mIGEgbmFtZS9pZCBvciBhbnkgc2VsZWN0b3IuXHJcblx0XHRlc2NhcGVDc3NNZXRhOiBmdW5jdGlvbiggc3RyaW5nICkge1xyXG5cdFx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoIC8oW1xcXFwhXCIjJCUmJygpKissLi86Ozw9Pj9AXFxbXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIiApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRpZE9yTmFtZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmdyb3Vwc1sgZWxlbWVudC5uYW1lIF0gfHwgKCB0aGlzLmNoZWNrYWJsZSggZWxlbWVudCApID8gZWxlbWVudC5uYW1lIDogZWxlbWVudC5pZCB8fCBlbGVtZW50Lm5hbWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dmFsaWRhdGlvblRhcmdldEZvcjogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblxyXG5cdFx0XHQvLyBJZiByYWRpby9jaGVja2JveCwgdmFsaWRhdGUgZmlyc3QgZWxlbWVudCBpbiBncm91cCBpbnN0ZWFkXHJcblx0XHRcdGlmICggdGhpcy5jaGVja2FibGUoIGVsZW1lbnQgKSApIHtcclxuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQWx3YXlzIGFwcGx5IGlnbm9yZSBmaWx0ZXJcclxuXHRcdFx0cmV0dXJuICQoIGVsZW1lbnQgKS5ub3QoIHRoaXMuc2V0dGluZ3MuaWdub3JlIClbIDAgXTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hlY2thYmxlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuICggL3JhZGlvfGNoZWNrYm94L2kgKS50ZXN0KCBlbGVtZW50LnR5cGUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZmluZEJ5TmFtZTogZnVuY3Rpb24oIG5hbWUgKSB7XHJcblx0XHRcdHJldHVybiAkKCB0aGlzLmN1cnJlbnRGb3JtICkuZmluZCggXCJbbmFtZT0nXCIgKyB0aGlzLmVzY2FwZUNzc01ldGEoIG5hbWUgKSArIFwiJ11cIiApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRMZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRcdFx0c3dpdGNoICggZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICkge1xyXG5cdFx0XHRjYXNlIFwic2VsZWN0XCI6XHJcblx0XHRcdFx0cmV0dXJuICQoIFwib3B0aW9uOnNlbGVjdGVkXCIsIGVsZW1lbnQgKS5sZW5ndGg7XHJcblx0XHRcdGNhc2UgXCJpbnB1dFwiOlxyXG5cdFx0XHRcdGlmICggdGhpcy5jaGVja2FibGUoIGVsZW1lbnQgKSApIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbmRCeU5hbWUoIGVsZW1lbnQubmFtZSApLmZpbHRlciggXCI6Y2hlY2tlZFwiICkubGVuZ3RoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoO1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZXBlbmQ6IGZ1bmN0aW9uKCBwYXJhbSwgZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZGVwZW5kVHlwZXNbIHR5cGVvZiBwYXJhbSBdID8gdGhpcy5kZXBlbmRUeXBlc1sgdHlwZW9mIHBhcmFtIF0oIHBhcmFtLCBlbGVtZW50ICkgOiB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZXBlbmRUeXBlczoge1xyXG5cdFx0XHRcImJvb2xlYW5cIjogZnVuY3Rpb24oIHBhcmFtICkge1xyXG5cdFx0XHRcdHJldHVybiBwYXJhbTtcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJzdHJpbmdcIjogZnVuY3Rpb24oIHBhcmFtLCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdHJldHVybiAhISQoIHBhcmFtLCBlbGVtZW50LmZvcm0gKS5sZW5ndGg7XHJcblx0XHRcdH0sXHJcblx0XHRcdFwiZnVuY3Rpb25cIjogZnVuY3Rpb24oIHBhcmFtLCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdHJldHVybiBwYXJhbSggZWxlbWVudCApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wdGlvbmFsOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0dmFyIHZhbCA9IHRoaXMuZWxlbWVudFZhbHVlKCBlbGVtZW50ICk7XHJcblx0XHRcdHJldHVybiAhJC52YWxpZGF0b3IubWV0aG9kcy5yZXF1aXJlZC5jYWxsKCB0aGlzLCB2YWwsIGVsZW1lbnQgKSAmJiBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIjtcclxuXHRcdH0sXHJcblxyXG5cdFx0c3RhcnRSZXF1ZXN0OiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdFx0aWYgKCAhdGhpcy5wZW5kaW5nWyBlbGVtZW50Lm5hbWUgXSApIHtcclxuXHRcdFx0XHR0aGlzLnBlbmRpbmdSZXF1ZXN0Kys7XHJcblx0XHRcdFx0JCggZWxlbWVudCApLmFkZENsYXNzKCB0aGlzLnNldHRpbmdzLnBlbmRpbmdDbGFzcyApO1xyXG5cdFx0XHRcdHRoaXMucGVuZGluZ1sgZWxlbWVudC5uYW1lIF0gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHN0b3BSZXF1ZXN0OiBmdW5jdGlvbiggZWxlbWVudCwgdmFsaWQgKSB7XHJcblx0XHRcdHRoaXMucGVuZGluZ1JlcXVlc3QtLTtcclxuXHJcblx0XHRcdC8vIFNvbWV0aW1lcyBzeW5jaHJvbml6YXRpb24gZmFpbHMsIG1ha2Ugc3VyZSBwZW5kaW5nUmVxdWVzdCBpcyBuZXZlciA8IDBcclxuXHRcdFx0aWYgKCB0aGlzLnBlbmRpbmdSZXF1ZXN0IDwgMCApIHtcclxuXHRcdFx0XHR0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkZWxldGUgdGhpcy5wZW5kaW5nWyBlbGVtZW50Lm5hbWUgXTtcclxuXHRcdFx0JCggZWxlbWVudCApLnJlbW92ZUNsYXNzKCB0aGlzLnNldHRpbmdzLnBlbmRpbmdDbGFzcyApO1xyXG5cdFx0XHRpZiAoIHZhbGlkICYmIHRoaXMucGVuZGluZ1JlcXVlc3QgPT09IDAgJiYgdGhpcy5mb3JtU3VibWl0dGVkICYmIHRoaXMuZm9ybSgpICkge1xyXG5cdFx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKS5zdWJtaXQoKTtcclxuXHJcblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBoaWRkZW4gaW5wdXQgdGhhdCB3YXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50IGZvciB0aGVcclxuXHRcdFx0XHQvLyBtaXNzaW5nIHN1Ym1pdCBidXR0b24uIFRoZSBoaWRkZW4gaW5wdXQgaXMgYWRkZWQgYnkgYGhhbmRsZSgpYFxyXG5cdFx0XHRcdC8vIHRvIGVuc3VyZSB0aGF0IHRoZSB2YWx1ZSBvZiB0aGUgdXNlZCBzdWJtaXQgYnV0dG9uIGlzIHBhc3NlZCBvblxyXG5cdFx0XHRcdC8vIGZvciBzY3JpcHRlZCBzdWJtaXRzIHRyaWdnZXJlZCBieSB0aGlzIG1ldGhvZFxyXG5cdFx0XHRcdGlmICggdGhpcy5zdWJtaXRCdXR0b24gKSB7XHJcblx0XHRcdFx0XHQkKCBcImlucHV0OmhpZGRlbltuYW1lPSdcIiArIHRoaXMuc3VibWl0QnV0dG9uLm5hbWUgKyBcIiddXCIsIHRoaXMuY3VycmVudEZvcm0gKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuZm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCAhdmFsaWQgJiYgdGhpcy5wZW5kaW5nUmVxdWVzdCA9PT0gMCAmJiB0aGlzLmZvcm1TdWJtaXR0ZWQgKSB7XHJcblx0XHRcdFx0JCggdGhpcy5jdXJyZW50Rm9ybSApLnRyaWdnZXJIYW5kbGVyKCBcImludmFsaWQtZm9ybVwiLCBbIHRoaXMgXSApO1xyXG5cdFx0XHRcdHRoaXMuZm9ybVN1Ym1pdHRlZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHByZXZpb3VzVmFsdWU6IGZ1bmN0aW9uKCBlbGVtZW50LCBtZXRob2QgKSB7XHJcblx0XHRcdG1ldGhvZCA9IHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIgJiYgbWV0aG9kIHx8IFwicmVtb3RlXCI7XHJcblxyXG5cdFx0XHRyZXR1cm4gJC5kYXRhKCBlbGVtZW50LCBcInByZXZpb3VzVmFsdWVcIiApIHx8ICQuZGF0YSggZWxlbWVudCwgXCJwcmV2aW91c1ZhbHVlXCIsIHtcclxuXHRcdFx0XHRvbGQ6IG51bGwsXHJcblx0XHRcdFx0dmFsaWQ6IHRydWUsXHJcblx0XHRcdFx0bWVzc2FnZTogdGhpcy5kZWZhdWx0TWVzc2FnZSggZWxlbWVudCwgeyBtZXRob2Q6IG1ldGhvZCB9IClcclxuXHRcdFx0fSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBDbGVhbnMgdXAgYWxsIGZvcm1zIGFuZCBlbGVtZW50cywgcmVtb3ZlcyB2YWxpZGF0b3Itc3BlY2lmaWMgZXZlbnRzXHJcblx0XHRkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5yZXNldEZvcm0oKTtcclxuXHJcblx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKVxyXG5cdFx0XHRcdC5vZmYoIFwiLnZhbGlkYXRlXCIgKVxyXG5cdFx0XHRcdC5yZW1vdmVEYXRhKCBcInZhbGlkYXRvclwiIClcclxuXHRcdFx0XHQuZmluZCggXCIudmFsaWRhdGUtZXF1YWxUby1ibHVyXCIgKVxyXG5cdFx0XHRcdFx0Lm9mZiggXCIudmFsaWRhdGUtZXF1YWxUb1wiIClcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggXCJ2YWxpZGF0ZS1lcXVhbFRvLWJsdXJcIiApO1xyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHRjbGFzc1J1bGVTZXR0aW5nczoge1xyXG5cdFx0cmVxdWlyZWQ6IHsgcmVxdWlyZWQ6IHRydWUgfSxcclxuXHRcdGVtYWlsOiB7IGVtYWlsOiB0cnVlIH0sXHJcblx0XHR1cmw6IHsgdXJsOiB0cnVlIH0sXHJcblx0XHRkYXRlOiB7IGRhdGU6IHRydWUgfSxcclxuXHRcdGRhdGVJU086IHsgZGF0ZUlTTzogdHJ1ZSB9LFxyXG5cdFx0bnVtYmVyOiB7IG51bWJlcjogdHJ1ZSB9LFxyXG5cdFx0ZGlnaXRzOiB7IGRpZ2l0czogdHJ1ZSB9LFxyXG5cdFx0Y3JlZGl0Y2FyZDogeyBjcmVkaXRjYXJkOiB0cnVlIH1cclxuXHR9LFxyXG5cclxuXHRhZGRDbGFzc1J1bGVzOiBmdW5jdGlvbiggY2xhc3NOYW1lLCBydWxlcyApIHtcclxuXHRcdGlmICggY2xhc3NOYW1lLmNvbnN0cnVjdG9yID09PSBTdHJpbmcgKSB7XHJcblx0XHRcdHRoaXMuY2xhc3NSdWxlU2V0dGluZ3NbIGNsYXNzTmFtZSBdID0gcnVsZXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmV4dGVuZCggdGhpcy5jbGFzc1J1bGVTZXR0aW5ncywgY2xhc3NOYW1lICk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Y2xhc3NSdWxlczogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XHJcblx0XHR2YXIgcnVsZXMgPSB7fSxcclxuXHRcdFx0Y2xhc3NlcyA9ICQoIGVsZW1lbnQgKS5hdHRyKCBcImNsYXNzXCIgKTtcclxuXHJcblx0XHRpZiAoIGNsYXNzZXMgKSB7XHJcblx0XHRcdCQuZWFjaCggY2xhc3Nlcy5zcGxpdCggXCIgXCIgKSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCB0aGlzIGluICQudmFsaWRhdG9yLmNsYXNzUnVsZVNldHRpbmdzICkge1xyXG5cdFx0XHRcdFx0JC5leHRlbmQoIHJ1bGVzLCAkLnZhbGlkYXRvci5jbGFzc1J1bGVTZXR0aW5nc1sgdGhpcyBdICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcnVsZXM7XHJcblx0fSxcclxuXHJcblx0bm9ybWFsaXplQXR0cmlidXRlUnVsZTogZnVuY3Rpb24oIHJ1bGVzLCB0eXBlLCBtZXRob2QsIHZhbHVlICkge1xyXG5cclxuXHRcdC8vIENvbnZlcnQgdGhlIHZhbHVlIHRvIGEgbnVtYmVyIGZvciBudW1iZXIgaW5wdXRzLCBhbmQgZm9yIHRleHQgZm9yIGJhY2t3YXJkcyBjb21wYWJpbGl0eVxyXG5cdFx0Ly8gYWxsb3dzIHR5cGU9XCJkYXRlXCIgYW5kIG90aGVycyB0byBiZSBjb21wYXJlZCBhcyBzdHJpbmdzXHJcblx0XHRpZiAoIC9taW58bWF4fHN0ZXAvLnRlc3QoIG1ldGhvZCApICYmICggdHlwZSA9PT0gbnVsbCB8fCAvbnVtYmVyfHJhbmdlfHRleHQvLnRlc3QoIHR5cGUgKSApICkge1xyXG5cdFx0XHR2YWx1ZSA9IE51bWJlciggdmFsdWUgKTtcclxuXHJcblx0XHRcdC8vIFN1cHBvcnQgT3BlcmEgTWluaSwgd2hpY2ggcmV0dXJucyBOYU4gZm9yIHVuZGVmaW5lZCBtaW5sZW5ndGhcclxuXHRcdFx0aWYgKCBpc05hTiggdmFsdWUgKSApIHtcclxuXHRcdFx0XHR2YWx1ZSA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdmFsdWUgfHwgdmFsdWUgPT09IDAgKSB7XHJcblx0XHRcdHJ1bGVzWyBtZXRob2QgXSA9IHZhbHVlO1xyXG5cdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gbWV0aG9kICYmIHR5cGUgIT09IFwicmFuZ2VcIiApIHtcclxuXHJcblx0XHRcdC8vIEV4Y2VwdGlvbjogdGhlIGpxdWVyeSB2YWxpZGF0ZSAncmFuZ2UnIG1ldGhvZFxyXG5cdFx0XHQvLyBkb2VzIG5vdCB0ZXN0IGZvciB0aGUgaHRtbDUgJ3JhbmdlJyB0eXBlXHJcblx0XHRcdHJ1bGVzWyBtZXRob2QgXSA9IHRydWU7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0YXR0cmlidXRlUnVsZXM6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0dmFyIHJ1bGVzID0ge30sXHJcblx0XHRcdCRlbGVtZW50ID0gJCggZWxlbWVudCApLFxyXG5cdFx0XHR0eXBlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICksXHJcblx0XHRcdG1ldGhvZCwgdmFsdWU7XHJcblxyXG5cdFx0Zm9yICggbWV0aG9kIGluICQudmFsaWRhdG9yLm1ldGhvZHMgKSB7XHJcblxyXG5cdFx0XHQvLyBTdXBwb3J0IGZvciA8aW5wdXQgcmVxdWlyZWQ+IGluIGJvdGggaHRtbDUgYW5kIG9sZGVyIGJyb3dzZXJzXHJcblx0XHRcdGlmICggbWV0aG9kID09PSBcInJlcXVpcmVkXCIgKSB7XHJcblx0XHRcdFx0dmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSggbWV0aG9kICk7XHJcblxyXG5cdFx0XHRcdC8vIFNvbWUgYnJvd3NlcnMgcmV0dXJuIGFuIGVtcHR5IHN0cmluZyBmb3IgdGhlIHJlcXVpcmVkIGF0dHJpYnV0ZVxyXG5cdFx0XHRcdC8vIGFuZCBub24tSFRNTDUgYnJvd3NlcnMgbWlnaHQgaGF2ZSByZXF1aXJlZD1cIlwiIG1hcmt1cFxyXG5cdFx0XHRcdGlmICggdmFsdWUgPT09IFwiXCIgKSB7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBGb3JjZSBub24tSFRNTDUgYnJvd3NlcnMgdG8gcmV0dXJuIGJvb2xcclxuXHRcdFx0XHR2YWx1ZSA9ICEhdmFsdWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFsdWUgPSAkZWxlbWVudC5hdHRyKCBtZXRob2QgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5ub3JtYWxpemVBdHRyaWJ1dGVSdWxlKCBydWxlcywgdHlwZSwgbWV0aG9kLCB2YWx1ZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vICdtYXhsZW5ndGgnIG1heSBiZSByZXR1cm5lZCBhcyAtMSwgMjE0NzQ4MzY0NyAoIElFICkgYW5kIDUyNDI4OCAoIHNhZmFyaSApIGZvciB0ZXh0IGlucHV0c1xyXG5cdFx0aWYgKCBydWxlcy5tYXhsZW5ndGggJiYgLy0xfDIxNDc0ODM2NDd8NTI0Mjg4Ly50ZXN0KCBydWxlcy5tYXhsZW5ndGggKSApIHtcclxuXHRcdFx0ZGVsZXRlIHJ1bGVzLm1heGxlbmd0aDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcnVsZXM7XHJcblx0fSxcclxuXHJcblx0ZGF0YVJ1bGVzOiBmdW5jdGlvbiggZWxlbWVudCApIHtcclxuXHRcdHZhciBydWxlcyA9IHt9LFxyXG5cdFx0XHQkZWxlbWVudCA9ICQoIGVsZW1lbnQgKSxcclxuXHRcdFx0dHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApLFxyXG5cdFx0XHRtZXRob2QsIHZhbHVlO1xyXG5cclxuXHRcdGZvciAoIG1ldGhvZCBpbiAkLnZhbGlkYXRvci5tZXRob2RzICkge1xyXG5cdFx0XHR2YWx1ZSA9ICRlbGVtZW50LmRhdGEoIFwicnVsZVwiICsgbWV0aG9kLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBtZXRob2Quc3Vic3RyaW5nKCAxICkudG9Mb3dlckNhc2UoKSApO1xyXG5cdFx0XHR0aGlzLm5vcm1hbGl6ZUF0dHJpYnV0ZVJ1bGUoIHJ1bGVzLCB0eXBlLCBtZXRob2QsIHZhbHVlICk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcnVsZXM7XHJcblx0fSxcclxuXHJcblx0c3RhdGljUnVsZXM6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0dmFyIHJ1bGVzID0ge30sXHJcblx0XHRcdHZhbGlkYXRvciA9ICQuZGF0YSggZWxlbWVudC5mb3JtLCBcInZhbGlkYXRvclwiICk7XHJcblxyXG5cdFx0aWYgKCB2YWxpZGF0b3Iuc2V0dGluZ3MucnVsZXMgKSB7XHJcblx0XHRcdHJ1bGVzID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZSggdmFsaWRhdG9yLnNldHRpbmdzLnJ1bGVzWyBlbGVtZW50Lm5hbWUgXSApIHx8IHt9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJ1bGVzO1xyXG5cdH0sXHJcblxyXG5cdG5vcm1hbGl6ZVJ1bGVzOiBmdW5jdGlvbiggcnVsZXMsIGVsZW1lbnQgKSB7XHJcblxyXG5cdFx0Ly8gSGFuZGxlIGRlcGVuZGVuY3kgY2hlY2tcclxuXHRcdCQuZWFjaCggcnVsZXMsIGZ1bmN0aW9uKCBwcm9wLCB2YWwgKSB7XHJcblxyXG5cdFx0XHQvLyBJZ25vcmUgcnVsZSB3aGVuIHBhcmFtIGlzIGV4cGxpY2l0bHkgZmFsc2UsIGVnLiByZXF1aXJlZDpmYWxzZVxyXG5cdFx0XHRpZiAoIHZhbCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0ZGVsZXRlIHJ1bGVzWyBwcm9wIF07XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggdmFsLnBhcmFtIHx8IHZhbC5kZXBlbmRzICkge1xyXG5cdFx0XHRcdHZhciBrZWVwUnVsZSA9IHRydWU7XHJcblx0XHRcdFx0c3dpdGNoICggdHlwZW9mIHZhbC5kZXBlbmRzICkge1xyXG5cdFx0XHRcdGNhc2UgXCJzdHJpbmdcIjpcclxuXHRcdFx0XHRcdGtlZXBSdWxlID0gISEkKCB2YWwuZGVwZW5kcywgZWxlbWVudC5mb3JtICkubGVuZ3RoO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcImZ1bmN0aW9uXCI6XHJcblx0XHRcdFx0XHRrZWVwUnVsZSA9IHZhbC5kZXBlbmRzLmNhbGwoIGVsZW1lbnQsIGVsZW1lbnQgKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIGtlZXBSdWxlICkge1xyXG5cdFx0XHRcdFx0cnVsZXNbIHByb3AgXSA9IHZhbC5wYXJhbSAhPT0gdW5kZWZpbmVkID8gdmFsLnBhcmFtIDogdHJ1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JC5kYXRhKCBlbGVtZW50LmZvcm0sIFwidmFsaWRhdG9yXCIgKS5yZXNldEVsZW1lbnRzKCAkKCBlbGVtZW50ICkgKTtcclxuXHRcdFx0XHRcdGRlbGV0ZSBydWxlc1sgcHJvcCBdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cclxuXHRcdC8vIEV2YWx1YXRlIHBhcmFtZXRlcnNcclxuXHRcdCQuZWFjaCggcnVsZXMsIGZ1bmN0aW9uKCBydWxlLCBwYXJhbWV0ZXIgKSB7XHJcblx0XHRcdHJ1bGVzWyBydWxlIF0gPSAkLmlzRnVuY3Rpb24oIHBhcmFtZXRlciApICYmIHJ1bGUgIT09IFwibm9ybWFsaXplclwiID8gcGFyYW1ldGVyKCBlbGVtZW50ICkgOiBwYXJhbWV0ZXI7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gQ2xlYW4gbnVtYmVyIHBhcmFtZXRlcnNcclxuXHRcdCQuZWFjaCggWyBcIm1pbmxlbmd0aFwiLCBcIm1heGxlbmd0aFwiIF0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIHJ1bGVzWyB0aGlzIF0gKSB7XHJcblx0XHRcdFx0cnVsZXNbIHRoaXMgXSA9IE51bWJlciggcnVsZXNbIHRoaXMgXSApO1xyXG5cdFx0XHR9XHJcblx0XHR9ICk7XHJcblx0XHQkLmVhY2goIFsgXCJyYW5nZWxlbmd0aFwiLCBcInJhbmdlXCIgXSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBwYXJ0cztcclxuXHRcdFx0aWYgKCBydWxlc1sgdGhpcyBdICkge1xyXG5cdFx0XHRcdGlmICggJC5pc0FycmF5KCBydWxlc1sgdGhpcyBdICkgKSB7XHJcblx0XHRcdFx0XHRydWxlc1sgdGhpcyBdID0gWyBOdW1iZXIoIHJ1bGVzWyB0aGlzIF1bIDAgXSApLCBOdW1iZXIoIHJ1bGVzWyB0aGlzIF1bIDEgXSApIF07XHJcblx0XHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHJ1bGVzWyB0aGlzIF0gPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0XHRwYXJ0cyA9IHJ1bGVzWyB0aGlzIF0ucmVwbGFjZSggL1tcXFtcXF1dL2csIFwiXCIgKS5zcGxpdCggL1tcXHMsXSsvICk7XHJcblx0XHRcdFx0XHRydWxlc1sgdGhpcyBdID0gWyBOdW1iZXIoIHBhcnRzWyAwIF0gKSwgTnVtYmVyKCBwYXJ0c1sgMSBdICkgXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gKTtcclxuXHJcblx0XHRpZiAoICQudmFsaWRhdG9yLmF1dG9DcmVhdGVSYW5nZXMgKSB7XHJcblxyXG5cdFx0XHQvLyBBdXRvLWNyZWF0ZSByYW5nZXNcclxuXHRcdFx0aWYgKCBydWxlcy5taW4gIT0gbnVsbCAmJiBydWxlcy5tYXggIT0gbnVsbCApIHtcclxuXHRcdFx0XHRydWxlcy5yYW5nZSA9IFsgcnVsZXMubWluLCBydWxlcy5tYXggXTtcclxuXHRcdFx0XHRkZWxldGUgcnVsZXMubWluO1xyXG5cdFx0XHRcdGRlbGV0ZSBydWxlcy5tYXg7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBydWxlcy5taW5sZW5ndGggIT0gbnVsbCAmJiBydWxlcy5tYXhsZW5ndGggIT0gbnVsbCApIHtcclxuXHRcdFx0XHRydWxlcy5yYW5nZWxlbmd0aCA9IFsgcnVsZXMubWlubGVuZ3RoLCBydWxlcy5tYXhsZW5ndGggXTtcclxuXHRcdFx0XHRkZWxldGUgcnVsZXMubWlubGVuZ3RoO1xyXG5cdFx0XHRcdGRlbGV0ZSBydWxlcy5tYXhsZW5ndGg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcnVsZXM7XHJcblx0fSxcclxuXHJcblx0Ly8gQ29udmVydHMgYSBzaW1wbGUgc3RyaW5nIHRvIGEge3N0cmluZzogdHJ1ZX0gcnVsZSwgZS5nLiwgXCJyZXF1aXJlZFwiIHRvIHtyZXF1aXJlZDp0cnVlfVxyXG5cdG5vcm1hbGl6ZVJ1bGU6IGZ1bmN0aW9uKCBkYXRhICkge1xyXG5cdFx0aWYgKCB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIiApIHtcclxuXHRcdFx0dmFyIHRyYW5zZm9ybWVkID0ge307XHJcblx0XHRcdCQuZWFjaCggZGF0YS5zcGxpdCggL1xccy8gKSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dHJhbnNmb3JtZWRbIHRoaXMgXSA9IHRydWU7XHJcblx0XHRcdH0gKTtcclxuXHRcdFx0ZGF0YSA9IHRyYW5zZm9ybWVkO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHJcblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9qUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZC9cclxuXHRhZGRNZXRob2Q6IGZ1bmN0aW9uKCBuYW1lLCBtZXRob2QsIG1lc3NhZ2UgKSB7XHJcblx0XHQkLnZhbGlkYXRvci5tZXRob2RzWyBuYW1lIF0gPSBtZXRob2Q7XHJcblx0XHQkLnZhbGlkYXRvci5tZXNzYWdlc1sgbmFtZSBdID0gbWVzc2FnZSAhPT0gdW5kZWZpbmVkID8gbWVzc2FnZSA6ICQudmFsaWRhdG9yLm1lc3NhZ2VzWyBuYW1lIF07XHJcblx0XHRpZiAoIG1ldGhvZC5sZW5ndGggPCAzICkge1xyXG5cdFx0XHQkLnZhbGlkYXRvci5hZGRDbGFzc1J1bGVzKCBuYW1lLCAkLnZhbGlkYXRvci5ub3JtYWxpemVSdWxlKCBuYW1lICkgKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2pRdWVyeS52YWxpZGF0b3IubWV0aG9kcy9cclxuXHRtZXRob2RzOiB7XHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZXF1aXJlZC1tZXRob2QvXHJcblx0XHRyZXF1aXJlZDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIGRlcGVuZGVuY3kgaXMgbWV0XHJcblx0XHRcdGlmICggIXRoaXMuZGVwZW5kKCBwYXJhbSwgZWxlbWVudCApICkge1xyXG5cdFx0XHRcdHJldHVybiBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiApIHtcclxuXHJcblx0XHRcdFx0Ly8gQ291bGQgYmUgYW4gYXJyYXkgZm9yIHNlbGVjdC1tdWx0aXBsZSBvciBhIHN0cmluZywgYm90aCBhcmUgZmluZSB0aGlzIHdheVxyXG5cdFx0XHRcdHZhciB2YWwgPSAkKCBlbGVtZW50ICkudmFsKCk7XHJcblx0XHRcdFx0cmV0dXJuIHZhbCAmJiB2YWwubGVuZ3RoID4gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0TGVuZ3RoKCB2YWx1ZSwgZWxlbWVudCApID4gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID4gMDtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lbWFpbC1tZXRob2QvXHJcblx0XHRlbWFpbDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cclxuXHRcdFx0Ly8gRnJvbSBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXHJcblx0XHRcdC8vIFJldHJpZXZlZCAyMDE0LTAxLTE0XHJcblx0XHRcdC8vIElmIHlvdSBoYXZlIGEgcHJvYmxlbSB3aXRoIHRoaXMgaW1wbGVtZW50YXRpb24sIHJlcG9ydCBhIGJ1ZyBhZ2FpbnN0IHRoZSBhYm92ZSBzcGVjXHJcblx0XHRcdC8vIE9yIHVzZSBjdXN0b20gbWV0aG9kcyB0byBpbXBsZW1lbnQgeW91ciBvd24gZW1haWwgdmFsaWRhdGlvblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvLnRlc3QoIHZhbHVlICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvdXJsLW1ldGhvZC9cclxuXHRcdHVybDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cclxuXHRcdFx0Ly8gQ29weXJpZ2h0IChjKSAyMDEwLTIwMTMgRGllZ28gUGVyaW5pLCBNSVQgbGljZW5zZWRcclxuXHRcdFx0Ly8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZHBlcmluaS83MjkyOTRcclxuXHRcdFx0Ly8gc2VlIGFsc28gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XHJcblx0XHRcdC8vIG1vZGlmaWVkIHRvIGFsbG93IHByb3RvY29sLXJlbGF0aXZlIFVSTHNcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2kudGVzdCggdmFsdWUgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kYXRlLW1ldGhvZC9cclxuXHRcdGRhdGU6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAhL0ludmFsaWR8TmFOLy50ZXN0KCBuZXcgRGF0ZSggdmFsdWUgKS50b1N0cmluZygpICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZGF0ZUlTTy1tZXRob2QvXHJcblx0XHRkYXRlSVNPOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGR7NH1bXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwvXFwtXSgwP1sxLTldfFsxMl1bMC05XXwzWzAxXSkkLy50ZXN0KCB2YWx1ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL251bWJlci1tZXRob2QvXHJcblx0XHRudW1iZXI6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLy50ZXN0KCB2YWx1ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2RpZ2l0cy1tZXRob2QvXHJcblx0XHRkaWdpdHM6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlxcZCskLy50ZXN0KCB2YWx1ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21pbmxlbmd0aC1tZXRob2QvXHJcblx0XHRtaW5sZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XHJcblx0XHRcdHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBsZW5ndGggPj0gcGFyYW07XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWF4bGVuZ3RoLW1ldGhvZC9cclxuXHRcdG1heGxlbmd0aDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHRcdFx0dmFyIGxlbmd0aCA9ICQuaXNBcnJheSggdmFsdWUgKSA/IHZhbHVlLmxlbmd0aCA6IHRoaXMuZ2V0TGVuZ3RoKCB2YWx1ZSwgZWxlbWVudCApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IGxlbmd0aCA8PSBwYXJhbTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yYW5nZWxlbmd0aC1tZXRob2QvXHJcblx0XHRyYW5nZWxlbmd0aDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHRcdFx0dmFyIGxlbmd0aCA9ICQuaXNBcnJheSggdmFsdWUgKSA/IHZhbHVlLmxlbmd0aCA6IHRoaXMuZ2V0TGVuZ3RoKCB2YWx1ZSwgZWxlbWVudCApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICggbGVuZ3RoID49IHBhcmFtWyAwIF0gJiYgbGVuZ3RoIDw9IHBhcmFtWyAxIF0gKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9taW4tbWV0aG9kL1xyXG5cdFx0bWluOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlID49IHBhcmFtO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21heC1tZXRob2QvXHJcblx0XHRtYXg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUgPD0gcGFyYW07XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xyXG5cdFx0cmFuZ2U6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgKCB2YWx1ZSA+PSBwYXJhbVsgMCBdICYmIHZhbHVlIDw9IHBhcmFtWyAxIF0gKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9zdGVwLW1ldGhvZC9cclxuXHRcdHN0ZXA6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XHJcblx0XHRcdHZhciB0eXBlID0gJCggZWxlbWVudCApLmF0dHIoIFwidHlwZVwiICksXHJcblx0XHRcdFx0ZXJyb3JNZXNzYWdlID0gXCJTdGVwIGF0dHJpYnV0ZSBvbiBpbnB1dCB0eXBlIFwiICsgdHlwZSArIFwiIGlzIG5vdCBzdXBwb3J0ZWQuXCIsXHJcblx0XHRcdFx0c3VwcG9ydGVkVHlwZXMgPSBbIFwidGV4dFwiLCBcIm51bWJlclwiLCBcInJhbmdlXCIgXSxcclxuXHRcdFx0XHRyZSA9IG5ldyBSZWdFeHAoIFwiXFxcXGJcIiArIHR5cGUgKyBcIlxcXFxiXCIgKSxcclxuXHRcdFx0XHRub3RTdXBwb3J0ZWQgPSB0eXBlICYmICFyZS50ZXN0KCBzdXBwb3J0ZWRUeXBlcy5qb2luKCkgKSxcclxuXHRcdFx0XHRkZWNpbWFsUGxhY2VzID0gZnVuY3Rpb24oIG51bSApIHtcclxuXHRcdFx0XHRcdHZhciBtYXRjaCA9ICggXCJcIiArIG51bSApLm1hdGNoKCAvKD86XFwuKFxcZCspKT8kLyApO1xyXG5cdFx0XHRcdFx0aWYgKCAhbWF0Y2ggKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIE51bWJlciBvZiBkaWdpdHMgcmlnaHQgb2YgZGVjaW1hbCBwb2ludC5cclxuXHRcdFx0XHRcdHJldHVybiBtYXRjaFsgMSBdID8gbWF0Y2hbIDEgXS5sZW5ndGggOiAwO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dG9JbnQgPSBmdW5jdGlvbiggbnVtICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIE1hdGgucm91bmQoIG51bSAqIE1hdGgucG93KCAxMCwgZGVjaW1hbHMgKSApO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dmFsaWQgPSB0cnVlLFxyXG5cdFx0XHRcdGRlY2ltYWxzO1xyXG5cclxuXHRcdFx0Ly8gV29ya3Mgb25seSBmb3IgdGV4dCwgbnVtYmVyIGFuZCByYW5nZSBpbnB1dCB0eXBlc1xyXG5cdFx0XHQvLyBUT0RPIGZpbmQgYSB3YXkgdG8gc3VwcG9ydCBpbnB1dCB0eXBlcyBkYXRlLCBkYXRldGltZSwgZGF0ZXRpbWUtbG9jYWwsIG1vbnRoLCB0aW1lIGFuZCB3ZWVrXHJcblx0XHRcdGlmICggbm90U3VwcG9ydGVkICkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggZXJyb3JNZXNzYWdlICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRlY2ltYWxzID0gZGVjaW1hbFBsYWNlcyggcGFyYW0gKTtcclxuXHJcblx0XHRcdC8vIFZhbHVlIGNhbid0IGhhdmUgdG9vIG1hbnkgZGVjaW1hbHNcclxuXHRcdFx0aWYgKCBkZWNpbWFsUGxhY2VzKCB2YWx1ZSApID4gZGVjaW1hbHMgfHwgdG9JbnQoIHZhbHVlICkgJSB0b0ludCggcGFyYW0gKSAhPT0gMCApIHtcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbGlkO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2VxdWFsVG8tbWV0aG9kL1xyXG5cdFx0ZXF1YWxUbzogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHJcblx0XHRcdC8vIEJpbmQgdG8gdGhlIGJsdXIgZXZlbnQgb2YgdGhlIHRhcmdldCBpbiBvcmRlciB0byByZXZhbGlkYXRlIHdoZW5ldmVyIHRoZSB0YXJnZXQgZmllbGQgaXMgdXBkYXRlZFxyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCggcGFyYW0gKTtcclxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLm9uZm9jdXNvdXQgJiYgdGFyZ2V0Lm5vdCggXCIudmFsaWRhdGUtZXF1YWxUby1ibHVyXCIgKS5sZW5ndGggKSB7XHJcblx0XHRcdFx0dGFyZ2V0LmFkZENsYXNzKCBcInZhbGlkYXRlLWVxdWFsVG8tYmx1clwiICkub24oIFwiYmx1ci52YWxpZGF0ZS1lcXVhbFRvXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCggZWxlbWVudCApLnZhbGlkKCk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWx1ZSA9PT0gdGFyZ2V0LnZhbCgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JlbW90ZS1tZXRob2QvXHJcblx0XHRyZW1vdGU6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0sIG1ldGhvZCApIHtcclxuXHRcdFx0aWYgKCB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtZXRob2QgPSB0eXBlb2YgbWV0aG9kID09PSBcInN0cmluZ1wiICYmIG1ldGhvZCB8fCBcInJlbW90ZVwiO1xyXG5cclxuXHRcdFx0dmFyIHByZXZpb3VzID0gdGhpcy5wcmV2aW91c1ZhbHVlKCBlbGVtZW50LCBtZXRob2QgKSxcclxuXHRcdFx0XHR2YWxpZGF0b3IsIGRhdGEsIG9wdGlvbkRhdGFTdHJpbmc7XHJcblxyXG5cdFx0XHRpZiAoICF0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXSApIHtcclxuXHRcdFx0XHR0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXSA9IHt9O1xyXG5cdFx0XHR9XHJcblx0XHRcdHByZXZpb3VzLm9yaWdpbmFsTWVzc2FnZSA9IHByZXZpb3VzLm9yaWdpbmFsTWVzc2FnZSB8fCB0aGlzLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXVsgbWV0aG9kIF07XHJcblx0XHRcdHRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdWyBtZXRob2QgXSA9IHByZXZpb3VzLm1lc3NhZ2U7XHJcblxyXG5cdFx0XHRwYXJhbSA9IHR5cGVvZiBwYXJhbSA9PT0gXCJzdHJpbmdcIiAmJiB7IHVybDogcGFyYW0gfSB8fCBwYXJhbTtcclxuXHRcdFx0b3B0aW9uRGF0YVN0cmluZyA9ICQucGFyYW0oICQuZXh0ZW5kKCB7IGRhdGE6IHZhbHVlIH0sIHBhcmFtLmRhdGEgKSApO1xyXG5cdFx0XHRpZiAoIHByZXZpb3VzLm9sZCA9PT0gb3B0aW9uRGF0YVN0cmluZyApIHtcclxuXHRcdFx0XHRyZXR1cm4gcHJldmlvdXMudmFsaWQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXZpb3VzLm9sZCA9IG9wdGlvbkRhdGFTdHJpbmc7XHJcblx0XHRcdHZhbGlkYXRvciA9IHRoaXM7XHJcblx0XHRcdHRoaXMuc3RhcnRSZXF1ZXN0KCBlbGVtZW50ICk7XHJcblx0XHRcdGRhdGEgPSB7fTtcclxuXHRcdFx0ZGF0YVsgZWxlbWVudC5uYW1lIF0gPSB2YWx1ZTtcclxuXHRcdFx0JC5hamF4KCAkLmV4dGVuZCggdHJ1ZSwge1xyXG5cdFx0XHRcdG1vZGU6IFwiYWJvcnRcIixcclxuXHRcdFx0XHRwb3J0OiBcInZhbGlkYXRlXCIgKyBlbGVtZW50Lm5hbWUsXHJcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHRcdFx0Y29udGV4dDogdmFsaWRhdG9yLmN1cnJlbnRGb3JtLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcclxuXHRcdFx0XHRcdHZhciB2YWxpZCA9IHJlc3BvbnNlID09PSB0cnVlIHx8IHJlc3BvbnNlID09PSBcInRydWVcIixcclxuXHRcdFx0XHRcdFx0ZXJyb3JzLCBtZXNzYWdlLCBzdWJtaXR0ZWQ7XHJcblxyXG5cdFx0XHRcdFx0dmFsaWRhdG9yLnNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXVsgbWV0aG9kIF0gPSBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAoIHZhbGlkICkge1xyXG5cdFx0XHRcdFx0XHRzdWJtaXR0ZWQgPSB2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZDtcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnJlc2V0SW50ZXJuYWxzKCk7XHJcblx0XHRcdFx0XHRcdHZhbGlkYXRvci50b0hpZGUgPSB2YWxpZGF0b3IuZXJyb3JzRm9yKCBlbGVtZW50ICk7XHJcblx0XHRcdFx0XHRcdHZhbGlkYXRvci5mb3JtU3VibWl0dGVkID0gc3VibWl0dGVkO1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3Iuc3VjY2Vzc0xpc3QucHVzaCggZWxlbWVudCApO1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3IuaW52YWxpZFsgZWxlbWVudC5uYW1lIF0gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnNob3dFcnJvcnMoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGVycm9ycyA9IHt9O1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlID0gcmVzcG9uc2UgfHwgdmFsaWRhdG9yLmRlZmF1bHRNZXNzYWdlKCBlbGVtZW50LCB7IG1ldGhvZDogbWV0aG9kLCBwYXJhbWV0ZXJzOiB2YWx1ZSB9ICk7XHJcblx0XHRcdFx0XHRcdGVycm9yc1sgZWxlbWVudC5uYW1lIF0gPSBwcmV2aW91cy5tZXNzYWdlID0gbWVzc2FnZTtcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLmludmFsaWRbIGVsZW1lbnQubmFtZSBdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnNob3dFcnJvcnMoIGVycm9ycyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cHJldmlvdXMudmFsaWQgPSB2YWxpZDtcclxuXHRcdFx0XHRcdHZhbGlkYXRvci5zdG9wUmVxdWVzdCggZWxlbWVudCwgdmFsaWQgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHBhcmFtICkgKTtcclxuXHRcdFx0cmV0dXJuIFwicGVuZGluZ1wiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0gKTtcclxuXHJcbi8vIEFqYXggbW9kZTogYWJvcnRcclxuLy8gdXNhZ2U6ICQuYWpheCh7IG1vZGU6IFwiYWJvcnRcIlssIHBvcnQ6IFwidW5pcXVlcG9ydFwiXX0pO1xyXG4vLyBpZiBtb2RlOlwiYWJvcnRcIiBpcyB1c2VkLCB0aGUgcHJldmlvdXMgcmVxdWVzdCBvbiB0aGF0IHBvcnQgKHBvcnQgY2FuIGJlIHVuZGVmaW5lZCkgaXMgYWJvcnRlZCB2aWEgWE1MSHR0cFJlcXVlc3QuYWJvcnQoKVxyXG5cclxudmFyIHBlbmRpbmdSZXF1ZXN0cyA9IHt9LFxyXG5cdGFqYXg7XHJcblxyXG4vLyBVc2UgYSBwcmVmaWx0ZXIgaWYgYXZhaWxhYmxlICgxLjUrKVxyXG5pZiAoICQuYWpheFByZWZpbHRlciApIHtcclxuXHQkLmFqYXhQcmVmaWx0ZXIoIGZ1bmN0aW9uKCBzZXR0aW5ncywgXywgeGhyICkge1xyXG5cdFx0dmFyIHBvcnQgPSBzZXR0aW5ncy5wb3J0O1xyXG5cdFx0aWYgKCBzZXR0aW5ncy5tb2RlID09PSBcImFib3J0XCIgKSB7XHJcblx0XHRcdGlmICggcGVuZGluZ1JlcXVlc3RzWyBwb3J0IF0gKSB7XHJcblx0XHRcdFx0cGVuZGluZ1JlcXVlc3RzWyBwb3J0IF0uYWJvcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHNbIHBvcnQgXSA9IHhocjtcclxuXHRcdH1cclxuXHR9ICk7XHJcbn0gZWxzZSB7XHJcblxyXG5cdC8vIFByb3h5IGFqYXhcclxuXHRhamF4ID0gJC5hamF4O1xyXG5cdCQuYWpheCA9IGZ1bmN0aW9uKCBzZXR0aW5ncyApIHtcclxuXHRcdHZhciBtb2RlID0gKCBcIm1vZGVcIiBpbiBzZXR0aW5ncyA/IHNldHRpbmdzIDogJC5hamF4U2V0dGluZ3MgKS5tb2RlLFxyXG5cdFx0XHRwb3J0ID0gKCBcInBvcnRcIiBpbiBzZXR0aW5ncyA/IHNldHRpbmdzIDogJC5hamF4U2V0dGluZ3MgKS5wb3J0O1xyXG5cdFx0aWYgKCBtb2RlID09PSBcImFib3J0XCIgKSB7XHJcblx0XHRcdGlmICggcGVuZGluZ1JlcXVlc3RzWyBwb3J0IF0gKSB7XHJcblx0XHRcdFx0cGVuZGluZ1JlcXVlc3RzWyBwb3J0IF0uYWJvcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHNbIHBvcnQgXSA9IGFqYXguYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG5cdFx0XHRyZXR1cm4gcGVuZGluZ1JlcXVlc3RzWyBwb3J0IF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYWpheC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcblx0fTtcclxufVxyXG5yZXR1cm4gJDtcclxufSkpOyJdfQ==