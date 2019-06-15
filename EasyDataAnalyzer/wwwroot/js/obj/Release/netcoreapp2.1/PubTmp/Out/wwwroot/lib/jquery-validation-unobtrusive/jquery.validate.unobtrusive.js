// Unobtrusive validation support library for jQuery and jQuery Validate
// Copyright (C) Microsoft Corporation. All rights reserved.
// @version v3.2.9
/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */
/*global document: false, jQuery: false */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define("jquery.validate.unobtrusive", ['jquery.validation'], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports     
        module.exports = factory(require('jquery-validation'));
    }
    else {
        // Browser global
        jQuery.validator.unobtrusive = factory(jQuery);
    }
}(function ($) {
    var $jQval = $.validator, adapters, data_validation = "unobtrusiveValidation";
    function setValidationValues(options, ruleName, value) {
        options.rules[ruleName] = value;
        if (options.message) {
            options.messages[ruleName] = options.message;
        }
    }
    function splitAndTrim(value) {
        return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
    }
    function escapeAttributeValue(value) {
        // As mentioned on http://api.jquery.com/category/selectors/
        return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
    }
    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }
    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }
    function onError(error, inputElement) {
        var container = $(this).find("[data-valmsg-for='" + escapeAttributeValue(inputElement[0].name) + "']"), replaceAttrValue = container.attr("data-valmsg-replace"), replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) !== false : null;
        container.removeClass("field-validation-valid").addClass("field-validation-error");
        error.data("unobtrusiveContainer", container);
        if (replace) {
            container.empty();
            error.removeClass("input-validation-error").appendTo(container);
        }
        else {
            error.hide();
        }
    }
    function onErrors(event, validator) {
        var container = $(this).find("[data-valmsg-summary=true]"), list = container.find("ul");
        if (list && list.length && validator.errorList.length) {
            list.empty();
            container.addClass("validation-summary-errors").removeClass("validation-summary-valid");
            $.each(validator.errorList, function () {
                $("<li />").html(this.message).appendTo(list);
            });
        }
    }
    function onSuccess(error) {
        var container = error.data("unobtrusiveContainer");
        if (container) {
            var replaceAttrValue = container.attr("data-valmsg-replace"), replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) : null;
            container.addClass("field-validation-valid").removeClass("field-validation-error");
            error.removeData("unobtrusiveContainer");
            if (replace) {
                container.empty();
            }
        }
    }
    function onReset(event) {
        var $form = $(this), key = '__jquery_unobtrusive_validation_form_reset';
        if ($form.data(key)) {
            return;
        }
        // Set a flag that indicates we're currently resetting the form.
        $form.data(key, true);
        try {
            $form.data("validator").resetForm();
        }
        finally {
            $form.removeData(key);
        }
        $form.find(".validation-summary-errors")
            .addClass("validation-summary-valid")
            .removeClass("validation-summary-errors");
        $form.find(".field-validation-error")
            .addClass("field-validation-valid")
            .removeClass("field-validation-error")
            .removeData("unobtrusiveContainer")
            .find(">*") // If we were using valmsg-replace, get the underlying error
            .removeData("unobtrusiveContainer");
    }
    function validationInfo(form) {
        var $form = $(form), result = $form.data(data_validation), onResetProxy = $.proxy(onReset, form), defaultOptions = $jQval.unobtrusive.options || {}, execInContext = function (name, args) {
            var func = defaultOptions[name];
            func && $.isFunction(func) && func.apply(form, args);
        };
        if (!result) {
            result = {
                options: {
                    errorClass: defaultOptions.errorClass || "input-validation-error",
                    errorElement: defaultOptions.errorElement || "span",
                    errorPlacement: function () {
                        onError.apply(form, arguments);
                        execInContext("errorPlacement", arguments);
                    },
                    invalidHandler: function () {
                        onErrors.apply(form, arguments);
                        execInContext("invalidHandler", arguments);
                    },
                    messages: {},
                    rules: {},
                    success: function () {
                        onSuccess.apply(form, arguments);
                        execInContext("success", arguments);
                    }
                },
                attachValidation: function () {
                    $form
                        .off("reset." + data_validation, onResetProxy)
                        .on("reset." + data_validation, onResetProxy)
                        .validate(this.options);
                },
                validate: function () {
                    $form.validate();
                    return $form.valid();
                }
            };
            $form.data(data_validation, result);
        }
        return result;
    }
    $jQval.unobtrusive = {
        adapters: [],
        parseElement: function (element, skipAttach) {
            /// <summary>
            /// Parses a single HTML element for unobtrusive validation attributes.
            /// </summary>
            /// <param name="element" domElement="true">The HTML element to be parsed.</param>
            /// <param name="skipAttach" type="Boolean">[Optional] true to skip attaching the
            /// validation to the form. If parsing just this single element, you should specify true.
            /// If parsing several elements, you should specify false, and manually attach the validation
            /// to the form when you are finished. The default is false.</param>
            var $element = $(element), form = $element.parents("form")[0], valInfo, rules, messages;
            if (!form) { // Cannot do client-side validation without a form
                return;
            }
            valInfo = validationInfo(form);
            valInfo.options.rules[element.name] = rules = {};
            valInfo.options.messages[element.name] = messages = {};
            $.each(this.adapters, function () {
                var prefix = "data-val-" + this.name, message = $element.attr(prefix), paramValues = {};
                if (message !== undefined) { // Compare against undefined, because an empty message is legal (and falsy)
                    prefix += "-";
                    $.each(this.params, function () {
                        paramValues[this] = $element.attr(prefix + this);
                    });
                    this.adapt({
                        element: element,
                        form: form,
                        message: message,
                        params: paramValues,
                        rules: rules,
                        messages: messages
                    });
                }
            });
            $.extend(rules, { "__dummy__": true });
            if (!skipAttach) {
                valInfo.attachValidation();
            }
        },
        parse: function (selector) {
            /// <summary>
            /// Parses all the HTML elements in the specified selector. It looks for input elements decorated
            /// with the [data-val=true] attribute value and enables validation according to the data-val-*
            /// attribute values.
            /// </summary>
            /// <param name="selector" type="String">Any valid jQuery selector.</param>
            // $forms includes all forms in selector's DOM hierarchy (parent, children and self) that have at least one
            // element with data-val=true
            var $selector = $(selector), $forms = $selector.parents()
                .addBack()
                .filter("form")
                .add($selector.find("form"))
                .has("[data-val=true]");
            $selector.find("[data-val=true]").each(function () {
                $jQval.unobtrusive.parseElement(this, true);
            });
            $forms.each(function () {
                var info = validationInfo(this);
                if (info) {
                    info.attachValidation();
                }
            });
        }
    };
    adapters = $jQval.unobtrusive.adapters;
    adapters.add = function (adapterName, params, fn) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="params" type="Array" optional="true">[Optional] An array of parameter names (strings) that will
        /// be extracted from the data-val-nnnn-mmmm HTML attributes (where nnnn is the adapter name, and
        /// mmmm is the parameter name).</param>
        /// <param name="fn" type="Function">The function to call, which adapts the values from the HTML
        /// attributes into jQuery Validate rules and/or messages.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        if (!fn) { // Called with no params, just a function
            fn = params;
            params = [];
        }
        this.push({ name: adapterName, params: params, adapt: fn });
        return this;
    };
    adapters.addBool = function (adapterName, ruleName) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation rule has no parameter values.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
        /// of adapterName will be used instead.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, function (options) {
            setValidationValues(options, ruleName || adapterName, true);
        });
    };
    adapters.addMinMax = function (adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation has three potential rules (one for min-only, one for max-only, and
        /// one for min-and-max). The HTML parameters are expected to be named -min and -max.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="minRuleName" type="String">The name of the jQuery Validate rule to be used when you only
        /// have a minimum value.</param>
        /// <param name="maxRuleName" type="String">The name of the jQuery Validate rule to be used when you only
        /// have a maximum value.</param>
        /// <param name="minMaxRuleName" type="String">The name of the jQuery Validate rule to be used when you
        /// have both a minimum and maximum value.</param>
        /// <param name="minAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
        /// contains the minimum value. The default is "min".</param>
        /// <param name="maxAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
        /// contains the maximum value. The default is "max".</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function (options) {
            var min = options.params.min, max = options.params.max;
            if (min && max) {
                setValidationValues(options, minMaxRuleName, [min, max]);
            }
            else if (min) {
                setValidationValues(options, minRuleName, min);
            }
            else if (max) {
                setValidationValues(options, maxRuleName, max);
            }
        });
    };
    adapters.addSingleVal = function (adapterName, attribute, ruleName) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation rule has a single value.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute(where nnnn is the adapter name).</param>
        /// <param name="attribute" type="String">[Optional] The name of the HTML attribute that contains the value.
        /// The default is "val".</param>
        /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
        /// of adapterName will be used instead.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, [attribute || "val"], function (options) {
            setValidationValues(options, ruleName || adapterName, options.params[attribute]);
        });
    };
    $jQval.addMethod("__dummy__", function (value, element, params) {
        return true;
    });
    $jQval.addMethod("regex", function (value, element, params) {
        var match;
        if (this.optional(element)) {
            return true;
        }
        match = new RegExp(params).exec(value);
        return (match && (match.index === 0) && (match[0].length === value.length));
    });
    $jQval.addMethod("nonalphamin", function (value, element, nonalphamin) {
        var match;
        if (nonalphamin) {
            match = value.match(/\W/g);
            match = match && match.length >= nonalphamin;
        }
        return match;
    });
    if ($jQval.methods.extension) {
        adapters.addSingleVal("accept", "mimtype");
        adapters.addSingleVal("extension", "extension");
    }
    else {
        // for backward compatibility, when the 'extension' validation method does not exist, such as with versions
        // of JQuery Validation plugin prior to 1.10, we should use the 'accept' method for
        // validating the extension, and ignore mime-type validations as they are not supported.
        adapters.addSingleVal("extension", "extension", "accept");
    }
    adapters.addSingleVal("regex", "pattern");
    adapters.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url");
    adapters.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range");
    adapters.addMinMax("minlength", "minlength").addMinMax("maxlength", "minlength", "maxlength");
    adapters.add("equalto", ["other"], function (options) {
        var prefix = getModelPrefix(options.element.name), other = options.params.other, fullOtherName = appendModelPrefix(other, prefix), element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];
        setValidationValues(options, "equalTo", element);
    });
    adapters.add("required", function (options) {
        // jQuery Validate equates "required" with "mandatory" for checkbox elements
        if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
            setValidationValues(options, "required", true);
        }
    });
    adapters.add("remote", ["url", "type", "additionalfields"], function (options) {
        var value = {
            url: options.params.url,
            type: options.params.type || "GET",
            data: {}
        }, prefix = getModelPrefix(options.element.name);
        $.each(splitAndTrim(options.params.additionalfields || options.element.name), function (i, fieldName) {
            var paramName = appendModelPrefix(fieldName, prefix);
            value.data[paramName] = function () {
                var field = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(paramName) + "']");
                // For checkboxes and radio buttons, only pick up values from checked fields.
                if (field.is(":checkbox")) {
                    return field.filter(":checked").val() || field.filter(":hidden").val() || '';
                }
                else if (field.is(":radio")) {
                    return field.filter(":checked").val() || '';
                }
                return field.val();
            };
        });
        setValidationValues(options, "remote", value);
    });
    adapters.add("password", ["min", "nonalphamin", "regex"], function (options) {
        if (options.params.min) {
            setValidationValues(options, "minlength", options.params.min);
        }
        if (options.params.nonalphamin) {
            setValidationValues(options, "nonalphamin", options.params.nonalphamin);
        }
        if (options.params.regex) {
            setValidationValues(options, "regex", options.params.regex);
        }
    });
    adapters.add("fileextensions", ["extensions"], function (options) {
        setValidationValues(options, "extension", options.params.extensions);
    });
    $(function () {
        $jQval.unobtrusive.parse(document);
    });
    return $jQval.unobtrusive;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianF1ZXJ5LnZhbGlkYXRlLnVub2J0cnVzaXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2pxdWVyeS12YWxpZGF0aW9uLXVub2J0cnVzaXZlL2pxdWVyeS52YWxpZGF0ZS51bm9idHJ1c2l2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3RUFBd0U7QUFDeEUsNERBQTREO0FBQzVELGtCQUFrQjtBQUVsQixtTEFBbUw7QUFDbkwsMENBQTBDO0FBRTFDLENBQUMsVUFBVSxPQUFPO0lBQ2QsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUM1Qyx3Q0FBd0M7UUFDeEMsTUFBTSxDQUFDLDZCQUE2QixFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN6RTtTQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7UUFDckQsOERBQThEO1FBQzlELE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7S0FDMUQ7U0FBTTtRQUNILGlCQUFpQjtRQUNqQixNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbEQ7QUFDTCxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ1QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFDcEIsUUFBUSxFQUNSLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQztJQUU5QyxTQUFTLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSztRQUNqRCxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNoQyxJ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LEtBQUssQ0FBQyxDQUFDO1NBQy9EO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsVUFBVSxPQUFPO1FBQzVELG1CQUFtQixDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztJQUVILENBQUMsQ0FBQztRQUNFLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQzlCLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVbm9idHJ1c2l2ZSB2YWxpZGF0aW9uIHN1cHBvcnQgbGlicmFyeSBmb3IgalF1ZXJ5IGFuZCBqUXVlcnkgVmFsaWRhdGVcclxuLy8gQ29weXJpZ2h0IChDKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbi8vIEB2ZXJzaW9uIHYzLjIuOVxyXG5cclxuLypqc2xpbnQgd2hpdGU6IHRydWUsIGJyb3dzZXI6IHRydWUsIG9uZXZhcjogdHJ1ZSwgdW5kZWY6IHRydWUsIG5vbWVuOiB0cnVlLCBlcWVxZXE6IHRydWUsIHBsdXNwbHVzOiB0cnVlLCBiaXR3aXNlOiB0cnVlLCByZWdleHA6IHRydWUsIG5ld2NhcDogdHJ1ZSwgaW1tZWQ6IHRydWUsIHN0cmljdDogZmFsc2UgKi9cclxuLypnbG9iYWwgZG9jdW1lbnQ6IGZhbHNlLCBqUXVlcnk6IGZhbHNlICovXHJcblxyXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXHJcbiAgICAgICAgZGVmaW5lKFwianF1ZXJ5LnZhbGlkYXRlLnVub2J0cnVzaXZlXCIsIFsnanF1ZXJ5LnZhbGlkYXRpb24nXSwgZmFjdG9yeSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAgICAgLy8gQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzICAgICBcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5LXZhbGlkYXRpb24nKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsXHJcbiAgICAgICAgalF1ZXJ5LnZhbGlkYXRvci51bm9idHJ1c2l2ZSA9IGZhY3RvcnkoalF1ZXJ5KTtcclxuICAgIH1cclxufShmdW5jdGlvbiAoJCkge1xyXG4gICAgdmFyICRqUXZhbCA9ICQudmFsaWRhdG9yLFxyXG4gICAgICAgIGFkYXB0ZXJzLFxyXG4gICAgICAgIGRhdGFfdmFsaWRhdGlvbiA9IFwidW5vYnRydXNpdmVWYWxpZGF0aW9uXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBydWxlTmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBvcHRpb25zLnJ1bGVzW3J1bGVOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5tZXNzYWdlc1tydWxlTmFtZV0gPSBvcHRpb25zLm1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNwbGl0QW5kVHJpbSh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKS5zcGxpdCgvXFxzKixcXHMqL2cpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVzY2FwZUF0dHJpYnV0ZVZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgLy8gQXMgbWVudGlvbmVkIG9uIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9jYXRlZ29yeS9zZWxlY3RvcnMvXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbIVwiIyQlJicoKSorLC4vOjs8PT4/QFxcW1xcXFxcXF1eYHt8fX5dKS9nLCBcIlxcXFwkMVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRNb2RlbFByZWZpeChmaWVsZE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gZmllbGROYW1lLnN1YnN0cigwLCBmaWVsZE5hbWUubGFzdEluZGV4T2YoXCIuXCIpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kTW9kZWxQcmVmaXgodmFsdWUsIHByZWZpeCkge1xyXG4gICAgICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKFwiKi5cIiwgcHJlZml4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IsIGlucHV0RWxlbWVudCkgeyAgLy8gJ3RoaXMnIGlzIHRoZSBmb3JtIGVsZW1lbnRcclxuICAgICAgICB2YXIgY29udGFpbmVyID0gJCh0aGlzKS5maW5kKFwiW2RhdGEtdmFsbXNnLWZvcj0nXCIgKyBlc2NhcGVBdHRyaWJ1dGVWYWx1ZShpbnB1dEVsZW1lbnRbMF0ubmFtZSkgKyBcIiddXCIpLFxyXG4gICAgICAgICAgICByZXBsYWNlQXR0clZhbHVlID0gY29udGFpbmVyLmF0dHIoXCJkYXRhLXZhbG1zZy1yZXBsYWNlXCIpLFxyXG4gICAgICAgICAgICByZXBsYWNlID0gcmVwbGFjZUF0dHJWYWx1ZSA/ICQucGFyc2VKU09OKHJlcGxhY2VBdHRyVmFsdWUpICE9PSBmYWxzZSA6IG51bGw7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhcImZpZWxkLXZhbGlkYXRpb24tdmFsaWRcIikuYWRkQ2xhc3MoXCJmaWVsZC12YWxpZGF0aW9uLWVycm9yXCIpO1xyXG4gICAgICAgIGVycm9yLmRhdGEoXCJ1bm9idHJ1c2l2ZUNvbnRhaW5lclwiLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICBpZiAocmVwbGFjZSkge1xyXG4gICAgICAgICAgICBjb250YWluZXIuZW1wdHkoKTtcclxuICAgICAgICAgICAgZXJyb3IucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpLmFwcGVuZFRvKGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uRXJyb3JzKGV2ZW50LCB2YWxpZGF0b3IpIHsgIC8vICd0aGlzJyBpcyB0aGUgZm9ybSBlbGVtZW50XHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQodGhpcykuZmluZChcIltkYXRhLXZhbG1zZy1zdW1tYXJ5PXRydWVdXCIpLFxyXG4gICAgICAgICAgICBsaXN0ID0gY29udGFpbmVyLmZpbmQoXCJ1bFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGxpc3QgJiYgbGlzdC5sZW5ndGggJiYgdmFsaWRhdG9yLmVycm9yTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktZXJyb3JzXCIpLnJlbW92ZUNsYXNzKFwidmFsaWRhdGlvbi1zdW1tYXJ5LXZhbGlkXCIpO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKHZhbGlkYXRvci5lcnJvckxpc3QsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoXCI8bGkgLz5cIikuaHRtbCh0aGlzLm1lc3NhZ2UpLmFwcGVuZFRvKGxpc3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TdWNjZXNzKGVycm9yKSB7ICAvLyAndGhpcycgaXMgdGhlIGZvcm0gZWxlbWVudFxyXG4gICAgICAgIHZhciBjb250YWluZXIgPSBlcnJvci5kYXRhKFwidW5vYnRydXNpdmVDb250YWluZXJcIik7XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJlcGxhY2VBdHRyVmFsdWUgPSBjb250YWluZXIuYXR0cihcImRhdGEtdmFsbXNnLXJlcGxhY2VcIiksXHJcbiAgICAgICAgICAgICAgICByZXBsYWNlID0gcmVwbGFjZUF0dHJWYWx1ZSA/ICQucGFyc2VKU09OKHJlcGxhY2VBdHRyVmFsdWUpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhcImZpZWxkLXZhbGlkYXRpb24tdmFsaWRcIikucmVtb3ZlQ2xhc3MoXCJmaWVsZC12YWxpZGF0aW9uLWVycm9yXCIpO1xyXG4gICAgICAgICAgICBlcnJvci5yZW1vdmVEYXRhKFwidW5vYnRydXNpdmVDb250YWluZXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVwbGFjZSkge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25SZXNldChldmVudCkgeyAgLy8gJ3RoaXMnIGlzIHRoZSBmb3JtIGVsZW1lbnRcclxuICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBrZXkgPSAnX19qcXVlcnlfdW5vYnRydXNpdmVfdmFsaWRhdGlvbl9mb3JtX3Jlc2V0JztcclxuICAgICAgICBpZiAoJGZvcm0uZGF0YShrZXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2V0IGEgZmxhZyB0aGF0IGluZGljYXRlcyB3ZSdyZSBjdXJyZW50bHkgcmVzZXR0aW5nIHRoZSBmb3JtLlxyXG4gICAgICAgICRmb3JtLmRhdGEoa2V5LCB0cnVlKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAkZm9ybS5kYXRhKFwidmFsaWRhdG9yXCIpLnJlc2V0Rm9ybSgpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgICRmb3JtLnJlbW92ZURhdGEoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRmb3JtLmZpbmQoXCIudmFsaWRhdGlvbi1zdW1tYXJ5LWVycm9yc1wiKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktdmFsaWRcIilcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwidmFsaWRhdGlvbi1zdW1tYXJ5LWVycm9yc1wiKTtcclxuICAgICAgICAkZm9ybS5maW5kKFwiLmZpZWxkLXZhbGlkYXRpb24tZXJyb3JcIilcclxuICAgICAgICAgICAgLmFkZENsYXNzKFwiZmllbGQtdmFsaWRhdGlvbi12YWxpZFwiKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmaWVsZC12YWxpZGF0aW9uLWVycm9yXCIpXHJcbiAgICAgICAgICAgIC5yZW1vdmVEYXRhKFwidW5vYnRydXNpdmVDb250YWluZXJcIilcclxuICAgICAgICAgICAgLmZpbmQoXCI+KlwiKSAgLy8gSWYgd2Ugd2VyZSB1c2luZyB2YWxtc2ctcmVwbGFjZSwgZ2V0IHRoZSB1bmRlcmx5aW5nIGVycm9yXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlRGF0YShcInVub2J0cnVzaXZlQ29udGFpbmVyXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZhbGlkYXRpb25JbmZvKGZvcm0pIHtcclxuICAgICAgICB2YXIgJGZvcm0gPSAkKGZvcm0pLFxyXG4gICAgICAgICAgICByZXN1bHQgPSAkZm9ybS5kYXRhKGRhdGFfdmFsaWRhdGlvbiksXHJcbiAgICAgICAgICAgIG9uUmVzZXRQcm94eSA9ICQucHJveHkob25SZXNldCwgZm9ybSksXHJcbiAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zID0gJGpRdmFsLnVub2J0cnVzaXZlLm9wdGlvbnMgfHwge30sXHJcbiAgICAgICAgICAgIGV4ZWNJbkNvbnRleHQgPSBmdW5jdGlvbiAobmFtZSwgYXJncykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZ1bmMgPSBkZWZhdWx0T3B0aW9uc1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIGZ1bmMgJiYgJC5pc0Z1bmN0aW9uKGZ1bmMpICYmIGZ1bmMuYXBwbHkoZm9ybSwgYXJncyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHsgIC8vIG9wdGlvbnMgc3RydWN0dXJlIHBhc3NlZCB0byBqUXVlcnkgVmFsaWRhdGUncyB2YWxpZGF0ZSgpIG1ldGhvZFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2xhc3M6IGRlZmF1bHRPcHRpb25zLmVycm9yQ2xhc3MgfHwgXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JFbGVtZW50OiBkZWZhdWx0T3B0aW9ucy5lcnJvckVsZW1lbnQgfHwgXCJzcGFuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvci5hcHBseShmb3JtLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjSW5Db250ZXh0KFwiZXJyb3JQbGFjZW1lbnRcIiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3JzLmFwcGx5KGZvcm0sIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWNJbkNvbnRleHQoXCJpbnZhbGlkSGFuZGxlclwiLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2Vzcy5hcHBseShmb3JtLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjSW5Db250ZXh0KFwic3VjY2Vzc1wiLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhdHRhY2hWYWxpZGF0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9mZihcInJlc2V0LlwiICsgZGF0YV92YWxpZGF0aW9uLCBvblJlc2V0UHJveHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcInJlc2V0LlwiICsgZGF0YV92YWxpZGF0aW9uLCBvblJlc2V0UHJveHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC52YWxpZGF0ZSh0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7ICAvLyBhIHZhbGlkYXRpb24gZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdW5vYnRydXNpdmUgQWpheFxyXG4gICAgICAgICAgICAgICAgICAgICRmb3JtLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmb3JtLnZhbGlkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRmb3JtLmRhdGEoZGF0YV92YWxpZGF0aW9uLCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAkalF2YWwudW5vYnRydXNpdmUgPSB7XHJcbiAgICAgICAgYWRhcHRlcnM6IFtdLFxyXG5cclxuICAgICAgICBwYXJzZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBza2lwQXR0YWNoKSB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFBhcnNlcyBhIHNpbmdsZSBIVE1MIGVsZW1lbnQgZm9yIHVub2J0cnVzaXZlIHZhbGlkYXRpb24gYXR0cmlidXRlcy5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIGRvbUVsZW1lbnQ9XCJ0cnVlXCI+VGhlIEhUTUwgZWxlbWVudCB0byBiZSBwYXJzZWQuPC9wYXJhbT5cclxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwic2tpcEF0dGFjaFwiIHR5cGU9XCJCb29sZWFuXCI+W09wdGlvbmFsXSB0cnVlIHRvIHNraXAgYXR0YWNoaW5nIHRoZVxyXG4gICAgICAgICAgICAvLy8gdmFsaWRhdGlvbiB0byB0aGUgZm9ybS4gSWYgcGFyc2luZyBqdXN0IHRoaXMgc2luZ2xlIGVsZW1lbnQsIHlvdSBzaG91bGQgc3BlY2lmeSB0cnVlLlxyXG4gICAgICAgICAgICAvLy8gSWYgcGFyc2luZyBzZXZlcmFsIGVsZW1lbnRzLCB5b3Ugc2hvdWxkIHNwZWNpZnkgZmFsc2UsIGFuZCBtYW51YWxseSBhdHRhY2ggdGhlIHZhbGlkYXRpb25cclxuICAgICAgICAgICAgLy8vIHRvIHRoZSBmb3JtIHdoZW4geW91IGFyZSBmaW5pc2hlZC4gVGhlIGRlZmF1bHQgaXMgZmFsc2UuPC9wYXJhbT5cclxuICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KSxcclxuICAgICAgICAgICAgICAgIGZvcm0gPSAkZWxlbWVudC5wYXJlbnRzKFwiZm9ybVwiKVswXSxcclxuICAgICAgICAgICAgICAgIHZhbEluZm8sIHJ1bGVzLCBtZXNzYWdlcztcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9ybSkgeyAgLy8gQ2Fubm90IGRvIGNsaWVudC1zaWRlIHZhbGlkYXRpb24gd2l0aG91dCBhIGZvcm1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFsSW5mbyA9IHZhbGlkYXRpb25JbmZvKGZvcm0pO1xyXG4gICAgICAgICAgICB2YWxJbmZvLm9wdGlvbnMucnVsZXNbZWxlbWVudC5uYW1lXSA9IHJ1bGVzID0ge307XHJcbiAgICAgICAgICAgIHZhbEluZm8ub3B0aW9ucy5tZXNzYWdlc1tlbGVtZW50Lm5hbWVdID0gbWVzc2FnZXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmFkYXB0ZXJzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJlZml4ID0gXCJkYXRhLXZhbC1cIiArIHRoaXMubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gJGVsZW1lbnQuYXR0cihwcmVmaXgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtVmFsdWVzID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgIT09IHVuZGVmaW5lZCkgeyAgLy8gQ29tcGFyZSBhZ2FpbnN0IHVuZGVmaW5lZCwgYmVjYXVzZSBhbiBlbXB0eSBtZXNzYWdlIGlzIGxlZ2FsIChhbmQgZmFsc3kpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ICs9IFwiLVwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2godGhpcy5wYXJhbXMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1WYWx1ZXNbdGhpc10gPSAkZWxlbWVudC5hdHRyKHByZWZpeCArIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkYXB0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybTogZm9ybSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbVZhbHVlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IHJ1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczogbWVzc2FnZXNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZChydWxlcywgeyBcIl9fZHVtbXlfX1wiOiB0cnVlIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFza2lwQXR0YWNoKSB7XHJcbiAgICAgICAgICAgICAgICB2YWxJbmZvLmF0dGFjaFZhbGlkYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gUGFyc2VzIGFsbCB0aGUgSFRNTCBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIHNlbGVjdG9yLiBJdCBsb29rcyBmb3IgaW5wdXQgZWxlbWVudHMgZGVjb3JhdGVkXHJcbiAgICAgICAgICAgIC8vLyB3aXRoIHRoZSBbZGF0YS12YWw9dHJ1ZV0gYXR0cmlidXRlIHZhbHVlIGFuZCBlbmFibGVzIHZhbGlkYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBkYXRhLXZhbC0qXHJcbiAgICAgICAgICAgIC8vLyBhdHRyaWJ1dGUgdmFsdWVzLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJzZWxlY3RvclwiIHR5cGU9XCJTdHJpbmdcIj5BbnkgdmFsaWQgalF1ZXJ5IHNlbGVjdG9yLjwvcGFyYW0+XHJcblxyXG4gICAgICAgICAgICAvLyAkZm9ybXMgaW5jbHVkZXMgYWxsIGZvcm1zIGluIHNlbGVjdG9yJ3MgRE9NIGhpZXJhcmNoeSAocGFyZW50LCBjaGlsZHJlbiBhbmQgc2VsZikgdGhhdCBoYXZlIGF0IGxlYXN0IG9uZVxyXG4gICAgICAgICAgICAvLyBlbGVtZW50IHdpdGggZGF0YS12YWw9dHJ1ZVxyXG4gICAgICAgICAgICB2YXIgJHNlbGVjdG9yID0gJChzZWxlY3RvciksXHJcbiAgICAgICAgICAgICAgICAkZm9ybXMgPSAkc2VsZWN0b3IucGFyZW50cygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQmFjaygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKFwiZm9ybVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCgkc2VsZWN0b3IuZmluZChcImZvcm1cIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGFzKFwiW2RhdGEtdmFsPXRydWVdXCIpO1xyXG5cclxuICAgICAgICAgICAgJHNlbGVjdG9yLmZpbmQoXCJbZGF0YS12YWw9dHJ1ZV1cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkalF2YWwudW5vYnRydXNpdmUucGFyc2VFbGVtZW50KHRoaXMsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRmb3Jtcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmZvID0gdmFsaWRhdGlvbkluZm8odGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm8uYXR0YWNoVmFsaWRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGFkYXB0ZXJzID0gJGpRdmFsLnVub2J0cnVzaXZlLmFkYXB0ZXJzO1xyXG5cclxuICAgIGFkYXB0ZXJzLmFkZCA9IGZ1bmN0aW9uIChhZGFwdGVyTmFtZSwgcGFyYW1zLCBmbikge1xyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5BZGRzIGEgbmV3IGFkYXB0ZXIgdG8gY29udmVydCB1bm9idHJ1c2l2ZSBIVE1MIGludG8gYSBqUXVlcnkgVmFsaWRhdGUgdmFsaWRhdGlvbi48L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYWRhcHRlck5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGFkYXB0ZXIgdG8gYmUgYWRkZWQuIFRoaXMgbWF0Y2hlcyB0aGUgbmFtZSB1c2VkXHJcbiAgICAgICAgLy8vIGluIHRoZSBkYXRhLXZhbC1ubm5uIEhUTUwgYXR0cmlidXRlICh3aGVyZSBubm5uIGlzIHRoZSBhZGFwdGVyIG5hbWUpLjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwicGFyYW1zXCIgdHlwZT1cIkFycmF5XCIgb3B0aW9uYWw9XCJ0cnVlXCI+W09wdGlvbmFsXSBBbiBhcnJheSBvZiBwYXJhbWV0ZXIgbmFtZXMgKHN0cmluZ3MpIHRoYXQgd2lsbFxyXG4gICAgICAgIC8vLyBiZSBleHRyYWN0ZWQgZnJvbSB0aGUgZGF0YS12YWwtbm5ubi1tbW1tIEhUTUwgYXR0cmlidXRlcyAod2hlcmUgbm5ubiBpcyB0aGUgYWRhcHRlciBuYW1lLCBhbmRcclxuICAgICAgICAvLy8gbW1tbSBpcyB0aGUgcGFyYW1ldGVyIG5hbWUpLjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZm5cIiB0eXBlPVwiRnVuY3Rpb25cIj5UaGUgZnVuY3Rpb24gdG8gY2FsbCwgd2hpY2ggYWRhcHRzIHRoZSB2YWx1ZXMgZnJvbSB0aGUgSFRNTFxyXG4gICAgICAgIC8vLyBhdHRyaWJ1dGVzIGludG8galF1ZXJ5IFZhbGlkYXRlIHJ1bGVzIGFuZC9vciBtZXNzYWdlcy48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cmV0dXJucyB0eXBlPVwialF1ZXJ5LnZhbGlkYXRvci51bm9idHJ1c2l2ZS5hZGFwdGVyc1wiIC8+XHJcbiAgICAgICAgaWYgKCFmbikgeyAgLy8gQ2FsbGVkIHdpdGggbm8gcGFyYW1zLCBqdXN0IGEgZnVuY3Rpb25cclxuICAgICAgICAgICAgZm4gPSBwYXJhbXM7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnB1c2goeyBuYW1lOiBhZGFwdGVyTmFtZSwgcGFyYW1zOiBwYXJhbXMsIGFkYXB0OiBmbiB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgYWRhcHRlcnMuYWRkQm9vbCA9IGZ1bmN0aW9uIChhZGFwdGVyTmFtZSwgcnVsZU5hbWUpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIG5ldyBhZGFwdGVyIHRvIGNvbnZlcnQgdW5vYnRydXNpdmUgSFRNTCBpbnRvIGEgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24sIHdoZXJlXHJcbiAgICAgICAgLy8vIHRoZSBqUXVlcnkgVmFsaWRhdGUgdmFsaWRhdGlvbiBydWxlIGhhcyBubyBwYXJhbWV0ZXIgdmFsdWVzLjwvc3VtbWFyeT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJhZGFwdGVyTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5UaGUgbmFtZSBvZiB0aGUgYWRhcHRlciB0byBiZSBhZGRlZC4gVGhpcyBtYXRjaGVzIHRoZSBuYW1lIHVzZWRcclxuICAgICAgICAvLy8gaW4gdGhlIGRhdGEtdmFsLW5ubm4gSFRNTCBhdHRyaWJ1dGUgKHdoZXJlIG5ubm4gaXMgdGhlIGFkYXB0ZXIgbmFtZSkuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJydWxlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBqUXVlcnkgVmFsaWRhdGUgcnVsZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgdmFsdWVcclxuICAgICAgICAvLy8gb2YgYWRhcHRlck5hbWUgd2lsbCBiZSB1c2VkIGluc3RlYWQuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cImpRdWVyeS52YWxpZGF0b3IudW5vYnRydXNpdmUuYWRhcHRlcnNcIiAvPlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhZGFwdGVyTmFtZSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBydWxlTmFtZSB8fCBhZGFwdGVyTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGFkYXB0ZXJzLmFkZE1pbk1heCA9IGZ1bmN0aW9uIChhZGFwdGVyTmFtZSwgbWluUnVsZU5hbWUsIG1heFJ1bGVOYW1lLCBtaW5NYXhSdWxlTmFtZSwgbWluQXR0cmlidXRlLCBtYXhBdHRyaWJ1dGUpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIG5ldyBhZGFwdGVyIHRvIGNvbnZlcnQgdW5vYnRydXNpdmUgSFRNTCBpbnRvIGEgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24sIHdoZXJlXHJcbiAgICAgICAgLy8vIHRoZSBqUXVlcnkgVmFsaWRhdGUgdmFsaWRhdGlvbiBoYXMgdGhyZWUgcG90ZW50aWFsIHJ1bGVzIChvbmUgZm9yIG1pbi1vbmx5LCBvbmUgZm9yIG1heC1vbmx5LCBhbmRcclxuICAgICAgICAvLy8gb25lIGZvciBtaW4tYW5kLW1heCkuIFRoZSBIVE1MIHBhcmFtZXRlcnMgYXJlIGV4cGVjdGVkIHRvIGJlIG5hbWVkIC1taW4gYW5kIC1tYXguPC9zdW1tYXJ5PlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImFkYXB0ZXJOYW1lXCIgdHlwZT1cIlN0cmluZ1wiPlRoZSBuYW1lIG9mIHRoZSBhZGFwdGVyIHRvIGJlIGFkZGVkLiBUaGlzIG1hdGNoZXMgdGhlIG5hbWUgdXNlZFxyXG4gICAgICAgIC8vLyBpbiB0aGUgZGF0YS12YWwtbm5ubiBIVE1MIGF0dHJpYnV0ZSAod2hlcmUgbm5ubiBpcyB0aGUgYWRhcHRlciBuYW1lKS48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cIm1pblJ1bGVOYW1lXCIgdHlwZT1cIlN0cmluZ1wiPlRoZSBuYW1lIG9mIHRoZSBqUXVlcnkgVmFsaWRhdGUgcnVsZSB0byBiZSB1c2VkIHdoZW4geW91IG9ubHlcclxuICAgICAgICAvLy8gaGF2ZSBhIG1pbmltdW0gdmFsdWUuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJtYXhSdWxlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5UaGUgbmFtZSBvZiB0aGUgalF1ZXJ5IFZhbGlkYXRlIHJ1bGUgdG8gYmUgdXNlZCB3aGVuIHlvdSBvbmx5XHJcbiAgICAgICAgLy8vIGhhdmUgYSBtYXhpbXVtIHZhbHVlLjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwibWluTWF4UnVsZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGpRdWVyeSBWYWxpZGF0ZSBydWxlIHRvIGJlIHVzZWQgd2hlbiB5b3VcclxuICAgICAgICAvLy8gaGF2ZSBib3RoIGEgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZS48L3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cIm1pbkF0dHJpYnV0ZVwiIHR5cGU9XCJTdHJpbmdcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGF0dHJpYnV0ZSB0aGF0XHJcbiAgICAgICAgLy8vIGNvbnRhaW5zIHRoZSBtaW5pbXVtIHZhbHVlLiBUaGUgZGVmYXVsdCBpcyBcIm1pblwiLjwvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwibWF4QXR0cmlidXRlXCIgdHlwZT1cIlN0cmluZ1wiIG9wdGlvbmFsPVwidHJ1ZVwiPltPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIEhUTUwgYXR0cmlidXRlIHRoYXRcclxuICAgICAgICAvLy8gY29udGFpbnMgdGhlIG1heGltdW0gdmFsdWUuIFRoZSBkZWZhdWx0IGlzIFwibWF4XCIuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cImpRdWVyeS52YWxpZGF0b3IudW5vYnRydXNpdmUuYWRhcHRlcnNcIiAvPlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhZGFwdGVyTmFtZSwgW21pbkF0dHJpYnV0ZSB8fCBcIm1pblwiLCBtYXhBdHRyaWJ1dGUgfHwgXCJtYXhcIl0sIGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW4gPSBvcHRpb25zLnBhcmFtcy5taW4sXHJcbiAgICAgICAgICAgICAgICBtYXggPSBvcHRpb25zLnBhcmFtcy5tYXg7XHJcblxyXG4gICAgICAgICAgICBpZiAobWluICYmIG1heCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBtaW5NYXhSdWxlTmFtZSwgW21pbiwgbWF4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobWluKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIG1pblJ1bGVOYW1lLCBtaW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG1heCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBtYXhSdWxlTmFtZSwgbWF4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBhZGFwdGVycy5hZGRTaW5nbGVWYWwgPSBmdW5jdGlvbiAoYWRhcHRlck5hbWUsIGF0dHJpYnV0ZSwgcnVsZU5hbWUpIHtcclxuICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIG5ldyBhZGFwdGVyIHRvIGNvbnZlcnQgdW5vYnRydXNpdmUgSFRNTCBpbnRvIGEgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24sIHdoZXJlXHJcbiAgICAgICAgLy8vIHRoZSBqUXVlcnkgVmFsaWRhdGUgdmFsaWRhdGlvbiBydWxlIGhhcyBhIHNpbmdsZSB2YWx1ZS48L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYWRhcHRlck5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGFkYXB0ZXIgdG8gYmUgYWRkZWQuIFRoaXMgbWF0Y2hlcyB0aGUgbmFtZSB1c2VkXHJcbiAgICAgICAgLy8vIGluIHRoZSBkYXRhLXZhbC1ubm5uIEhUTUwgYXR0cmlidXRlKHdoZXJlIG5ubm4gaXMgdGhlIGFkYXB0ZXIgbmFtZSkuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJhdHRyaWJ1dGVcIiB0eXBlPVwiU3RyaW5nXCI+W09wdGlvbmFsXSBUaGUgbmFtZSBvZiB0aGUgSFRNTCBhdHRyaWJ1dGUgdGhhdCBjb250YWlucyB0aGUgdmFsdWUuXHJcbiAgICAgICAgLy8vIFRoZSBkZWZhdWx0IGlzIFwidmFsXCIuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJydWxlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBqUXVlcnkgVmFsaWRhdGUgcnVsZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgdmFsdWVcclxuICAgICAgICAvLy8gb2YgYWRhcHRlck5hbWUgd2lsbCBiZSB1c2VkIGluc3RlYWQuPC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cImpRdWVyeS52YWxpZGF0b3IudW5vYnRydXNpdmUuYWRhcHRlcnNcIiAvPlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhZGFwdGVyTmFtZSwgW2F0dHJpYnV0ZSB8fCBcInZhbFwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBydWxlTmFtZSB8fCBhZGFwdGVyTmFtZSwgb3B0aW9ucy5wYXJhbXNbYXR0cmlidXRlXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRqUXZhbC5hZGRNZXRob2QoXCJfX2R1bW15X19cIiwgZnVuY3Rpb24gKHZhbHVlLCBlbGVtZW50LCBwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgICRqUXZhbC5hZGRNZXRob2QoXCJyZWdleFwiLCBmdW5jdGlvbiAodmFsdWUsIGVsZW1lbnQsIHBhcmFtcykge1xyXG4gICAgICAgIHZhciBtYXRjaDtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25hbChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGNoID0gbmV3IFJlZ0V4cChwYXJhbXMpLmV4ZWModmFsdWUpO1xyXG4gICAgICAgIHJldHVybiAobWF0Y2ggJiYgKG1hdGNoLmluZGV4ID09PSAwKSAmJiAobWF0Y2hbMF0ubGVuZ3RoID09PSB2YWx1ZS5sZW5ndGgpKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRqUXZhbC5hZGRNZXRob2QoXCJub25hbHBoYW1pblwiLCBmdW5jdGlvbiAodmFsdWUsIGVsZW1lbnQsIG5vbmFscGhhbWluKSB7XHJcbiAgICAgICAgdmFyIG1hdGNoO1xyXG4gICAgICAgIGlmIChub25hbHBoYW1pbikge1xyXG4gICAgICAgICAgICBtYXRjaCA9IHZhbHVlLm1hdGNoKC9cXFcvZyk7XHJcbiAgICAgICAgICAgIG1hdGNoID0gbWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID49IG5vbmFscGhhbWluO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoJGpRdmFsLm1ldGhvZHMuZXh0ZW5zaW9uKSB7XHJcbiAgICAgICAgYWRhcHRlcnMuYWRkU2luZ2xlVmFsKFwiYWNjZXB0XCIsIFwibWltdHlwZVwiKTtcclxuICAgICAgICBhZGFwdGVycy5hZGRTaW5nbGVWYWwoXCJleHRlbnNpb25cIiwgXCJleHRlbnNpb25cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCB3aGVuIHRoZSAnZXh0ZW5zaW9uJyB2YWxpZGF0aW9uIG1ldGhvZCBkb2VzIG5vdCBleGlzdCwgc3VjaCBhcyB3aXRoIHZlcnNpb25zXHJcbiAgICAgICAgLy8gb2YgSlF1ZXJ5IFZhbGlkYXRpb24gcGx1Z2luIHByaW9yIHRvIDEuMTAsIHdlIHNob3VsZCB1c2UgdGhlICdhY2NlcHQnIG1ldGhvZCBmb3JcclxuICAgICAgICAvLyB2YWxpZGF0aW5nIHRoZSBleHRlbnNpb24sIGFuZCBpZ25vcmUgbWltZS10eXBlIHZhbGlkYXRpb25zIGFzIHRoZXkgYXJlIG5vdCBzdXBwb3J0ZWQuXHJcbiAgICAgICAgYWRhcHRlcnMuYWRkU2luZ2xlVmFsKFwiZXh0ZW5zaW9uXCIsIFwiZXh0ZW5zaW9uXCIsIFwiYWNjZXB0XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkYXB0ZXJzLmFkZFNpbmdsZVZhbChcInJlZ2V4XCIsIFwicGF0dGVyblwiKTtcclxuICAgIGFkYXB0ZXJzLmFkZEJvb2woXCJjcmVkaXRjYXJkXCIpLmFkZEJvb2woXCJkYXRlXCIpLmFkZEJvb2woXCJkaWdpdHNcIikuYWRkQm9vbChcImVtYWlsXCIpLmFkZEJvb2woXCJudW1iZXJcIikuYWRkQm9vbChcInVybFwiKTtcclxuICAgIGFkYXB0ZXJzLmFkZE1pbk1heChcImxlbmd0aFwiLCBcIm1pbmxlbmd0aFwiLCBcIm1heGxlbmd0aFwiLCBcInJhbmdlbGVuZ3RoXCIpLmFkZE1pbk1heChcInJhbmdlXCIsIFwibWluXCIsIFwibWF4XCIsIFwicmFuZ2VcIik7XHJcbiAgICBhZGFwdGVycy5hZGRNaW5NYXgoXCJtaW5sZW5ndGhcIiwgXCJtaW5sZW5ndGhcIikuYWRkTWluTWF4KFwibWF4bGVuZ3RoXCIsIFwibWlubGVuZ3RoXCIsIFwibWF4bGVuZ3RoXCIpO1xyXG4gICAgYWRhcHRlcnMuYWRkKFwiZXF1YWx0b1wiLCBbXCJvdGhlclwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgcHJlZml4ID0gZ2V0TW9kZWxQcmVmaXgob3B0aW9ucy5lbGVtZW50Lm5hbWUpLFxyXG4gICAgICAgICAgICBvdGhlciA9IG9wdGlvbnMucGFyYW1zLm90aGVyLFxyXG4gICAgICAgICAgICBmdWxsT3RoZXJOYW1lID0gYXBwZW5kTW9kZWxQcmVmaXgob3RoZXIsIHByZWZpeCksXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSAkKG9wdGlvbnMuZm9ybSkuZmluZChcIjppbnB1dFwiKS5maWx0ZXIoXCJbbmFtZT0nXCIgKyBlc2NhcGVBdHRyaWJ1dGVWYWx1ZShmdWxsT3RoZXJOYW1lKSArIFwiJ11cIilbMF07XHJcblxyXG4gICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgXCJlcXVhbFRvXCIsIGVsZW1lbnQpO1xyXG4gICAgfSk7XHJcbiAgICBhZGFwdGVycy5hZGQoXCJyZXF1aXJlZFwiLCBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIC8vIGpRdWVyeSBWYWxpZGF0ZSBlcXVhdGVzIFwicmVxdWlyZWRcIiB3aXRoIFwibWFuZGF0b3J5XCIgZm9yIGNoZWNrYm94IGVsZW1lbnRzXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgIT09IFwiSU5QVVRcIiB8fCBvcHRpb25zLmVsZW1lbnQudHlwZS50b1VwcGVyQ2FzZSgpICE9PSBcIkNIRUNLQk9YXCIpIHtcclxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcInJlcXVpcmVkXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgYWRhcHRlcnMuYWRkKFwicmVtb3RlXCIsIFtcInVybFwiLCBcInR5cGVcIiwgXCJhZGRpdGlvbmFsZmllbGRzXCJdLCBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHtcclxuICAgICAgICAgICAgdXJsOiBvcHRpb25zLnBhcmFtcy51cmwsXHJcbiAgICAgICAgICAgIHR5cGU6IG9wdGlvbnMucGFyYW1zLnR5cGUgfHwgXCJHRVRcIixcclxuICAgICAgICAgICAgZGF0YToge31cclxuICAgICAgICB9LFxyXG4gICAgICAgICAgICBwcmVmaXggPSBnZXRNb2RlbFByZWZpeChvcHRpb25zLmVsZW1lbnQubmFtZSk7XHJcblxyXG4gICAgICAgICQuZWFjaChzcGxpdEFuZFRyaW0ob3B0aW9ucy5wYXJhbXMuYWRkaXRpb25hbGZpZWxkcyB8fCBvcHRpb25zLmVsZW1lbnQubmFtZSksIGZ1bmN0aW9uIChpLCBmaWVsZE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtTmFtZSA9IGFwcGVuZE1vZGVsUHJlZml4KGZpZWxkTmFtZSwgcHJlZml4KTtcclxuICAgICAgICAgICAgdmFsdWUuZGF0YVtwYXJhbU5hbWVdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gJChvcHRpb25zLmZvcm0pLmZpbmQoXCI6aW5wdXRcIikuZmlsdGVyKFwiW25hbWU9J1wiICsgZXNjYXBlQXR0cmlidXRlVmFsdWUocGFyYW1OYW1lKSArIFwiJ11cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBGb3IgY2hlY2tib3hlcyBhbmQgcmFkaW8gYnV0dG9ucywgb25seSBwaWNrIHVwIHZhbHVlcyBmcm9tIGNoZWNrZWQgZmllbGRzLlxyXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzKFwiOmNoZWNrYm94XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmZpbHRlcihcIjpjaGVja2VkXCIpLnZhbCgpIHx8IGZpZWxkLmZpbHRlcihcIjpoaWRkZW5cIikudmFsKCkgfHwgJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChmaWVsZC5pcyhcIjpyYWRpb1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZC5maWx0ZXIoXCI6Y2hlY2tlZFwiKS52YWwoKSB8fCAnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZC52YWwoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcInJlbW90ZVwiLCB2YWx1ZSk7XHJcbiAgICB9KTtcclxuICAgIGFkYXB0ZXJzLmFkZChcInBhc3N3b3JkXCIsIFtcIm1pblwiLCBcIm5vbmFscGhhbWluXCIsIFwicmVnZXhcIl0sIGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLm1pbikge1xyXG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwibWlubGVuZ3RoXCIsIG9wdGlvbnMucGFyYW1zLm1pbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5ub25hbHBoYW1pbikge1xyXG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwibm9uYWxwaGFtaW5cIiwgb3B0aW9ucy5wYXJhbXMubm9uYWxwaGFtaW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5wYXJhbXMucmVnZXgpIHtcclxuICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcInJlZ2V4XCIsIG9wdGlvbnMucGFyYW1zLnJlZ2V4KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFkYXB0ZXJzLmFkZChcImZpbGVleHRlbnNpb25zXCIsIFtcImV4dGVuc2lvbnNcIl0sIGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcImV4dGVuc2lvblwiLCBvcHRpb25zLnBhcmFtcy5leHRlbnNpb25zKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRqUXZhbC51bm9idHJ1c2l2ZS5wYXJzZShkb2N1bWVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gJGpRdmFsLnVub2J0cnVzaXZlO1xyXG59KSk7Il19