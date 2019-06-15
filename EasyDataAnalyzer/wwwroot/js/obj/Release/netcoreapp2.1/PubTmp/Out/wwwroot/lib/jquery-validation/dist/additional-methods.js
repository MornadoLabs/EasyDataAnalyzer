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
        define(["jquery", "./jquery.validate"], factory);
    }
    else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    }
    else {
        factory(jQuery);
    }
}(function ($) {
    (function () {
        function stripHtml(value) {
            // Remove html tags and space chars
            return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
                // Remove punctuation
                .replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
        }
        $.validator.addMethod("maxWords", function (value, element, params) {
            return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
        }, $.validator.format("Please enter {0} words or less."));
        $.validator.addMethod("minWords", function (value, element, params) {
            return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
        }, $.validator.format("Please enter at least {0} words."));
        $.validator.addMethod("rangeWords", function (value, element, params) {
            var valueStripped = stripHtml(value), regex = /\b\w+\b/g;
            return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
        }, $.validator.format("Please enter between {0} and {1} words."));
    }());
    // Accept a value from a file input based on a required mimetype
    $.validator.addMethod("accept", function (value, element, param) {
        // Split mime on commas in case we have multiple types we can accept
        var typeParam = typeof param === "string" ? param.replace(/\s/g, "") : "image/*", optionalValue = this.optional(element), i, file, regex;
        // Element is optional
        if (optionalValue) {
            return optionalValue;
        }
        if ($(element).attr("type") === "file") {
            // Escape string to be used in the regex
            // see: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
            // Escape also "/*" as "/.*" as a wildcard
            typeParam = typeParam
                .replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&")
                .replace(/,/g, "|")
                .replace(/\/\*/g, "/.*");
            // Check if the element has a FileList before checking each file
            if (element.files && element.files.length) {
                regex = new RegExp(".?(" + typeParam + ")$", "i");
                for (i = 0; i < element.files.length; i++) {
                    file = element.files[i];
                    // Grab the mimetype from the loaded file, verify it matches
                    if (!file.type.match(regex)) {
                        return false;
                    }
                }
            }
        }
        // Either return true because we've validated each file, or because the
        // browser does not support element.files and the FileList feature
        return true;
    }, $.validator.format("Please enter a value with a valid mimetype."));
    $.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "Letters, numbers, and underscores only please");
    /*
     * Dutch bank account numbers (not 'giro' numbers) have 9 digits
     * and pass the '11 check'.
     * We accept the notation with spaces, as that is common.
     * acceptable: 123456789 or 12 34 56 789
     */
    $.validator.addMethod("bankaccountNL", function (value, element) {
        if (this.optional(element)) {
            return true;
        }
        if (!(/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(value))) {
            return false;
        }
        // Now '11 check'
        var account = value.replace(/ /g, ""), // Remove spaces
        sum = 0, len = account.length, pos, factor, digit;
        for (pos = 0; pos < len; pos++) {
            factor = len - pos;
            digit = account.substring(pos, pos + 1);
            sum = sum + factor * digit;
        }
        return sum % 11 === 0;
    }, "Please specify a valid bank account number");
    $.validator.addMethod("bankorgiroaccountNL", function (value, element) {
        return this.optional(element) ||
            ($.validator.methods.bankaccountNL.call(this, value, element)) ||
            ($.validator.methods.giroaccountNL.call(this, value, element));
    }, "Please specify a valid bank or giro account number");
    /**
     * BIC is the business identifier code (ISO 9362). This BIC check is not a guarantee for authenticity.
     *
     * BIC pattern: BBBBCCLLbbb (8 or 11 characters long; bbb is optional)
     *
     * Validation is case-insensitive. Please make sure to normalize input yourself.
     *
     * BIC definition in detail:
     * - First 4 characters - bank code (only letters)
     * - Next 2 characters - ISO 3166-1 alpha-2 country code (only letters)
     * - Next 2 characters - location code (letters and digits)
     *   a. shall not start with '0' or '1'
     *   b. second character must be a letter ('O' is not allowed) or digit ('0' for test (therefore not allowed), '1' denoting passive participant, '2' typically reverse-billing)
     * - Last 3 characters - branch code, optional (shall not start with 'X' except in case of 'XXX' for primary office) (letters and digits)
     */
    $.validator.addMethod("bic", function (value, element) {
        return this.optional(element) || /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(value.toUpperCase());
    }, "Please specify a valid BIC code");
    /*
     * Código de identificación fiscal ( CIF ) is the tax identification code for Spanish legal entities
     * Further rules can be found in Spanish on http://es.wikipedia.org/wiki/C%C3%B3digo_de_identificaci%C3%B3n_fiscal
     *
     * Spanish CIF structure:
     *
     * [ T ][ P ][ P ][ N ][ N ][ N ][ N ][ N ][ C ]
     *
     * Where:
     *
     * T: 1 character. Kind of Organization Letter: [ABCDEFGHJKLMNPQRSUVW]
     * P: 2 characters. Province.
     * N: 5 characters. Secuencial Number within the province.
     * C: 1 character. Control Digit: [0-9A-J].
     *
     * [ T ]: Kind of Organizations. Possible values:
     *
     *   A. Corporations
     *   B. LLCs
     *   C. General partnerships
     *   D. Companies limited partnerships
     *   E. Communities of goods
     *   F. Cooperative Societies
     *   G. Associations
     *   H. Communities of homeowners in horizontal property regime
     *   J. Civil Societies
     *   K. Old format
     *   L. Old format
     *   M. Old format
     *   N. Nonresident entities
     *   P. Local authorities
     *   Q. Autonomous bodies, state or not, and the like, and congregations and religious institutions
     *   R. Congregations and religious institutions (since 2008 ORDER EHA/451/2008)
     *   S. Organs of State Administration and regions
     *   V. Agrarian Transformation
     *   W. Permanent establishments of non-resident in Spain
     *
     * [ C ]: Control Digit. It can be a number or a letter depending on T value:
     * [ T ]  -->  [ C ]
     * ------    ----------
     *   A         Number
     *   B         Number
     *   E         Number
     *   H         Number
     *   K         Letter
     *   P         Letter
     *   Q         Letter
     *   S         Letter
     *
     */
    $.validator.addMethod("cifES", function (value, element) {
        "use strict";
        if (this.optional(element)) {
            return true;
        }
        var cifRegEx = new RegExp(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/gi);
        var letter = value.substring(0, 1), // [ T ]
        number = value.substring(1, 8), // [ P ][ P ][ N ][ N ][ N ][ N ][ N ]
        control = value.substring(8, 9), // [ C ]
        all_sum = 0, even_sum = 0, odd_sum = 0, i, n, control_digit, control_letter;
        function isOdd(n) {
            return n % 2 === 0;
        }
        // Quick format test
        if (value.length !== 9 || !cifRegEx.test(value)) {
            return false;
        }
        for (i = 0; i < number.length; i++) {
            n = parseInt(number[i], 10);
            // Odd positions
            if (isOdd(i)) {
                // Odd positions are multiplied first.
                n *= 2;
                // If the multiplication is bigger than 10 we need to adjust
                odd_sum += n < 10 ? n : n - 9;
                // Even positions
                // Just sum them
            }
            else {
                even_sum += n;
            }
        }
        all_sum = even_sum + odd_sum;
        control_digit = (10 - (all_sum).toString().substr(-1)).toString();
        control_digit = parseInt(control_digit, 10) > 9 ? "0" : control_digit;
        control_letter = "JABCDEFGHI".substr(control_digit, 1).toString();
        // Control must be a digit
        if (letter.match(/[ABEH]/)) {
            return control === control_digit;
            // Control must be a letter
        }
        else if (letter.match(/[KPQS]/)) {
            return control === control_letter;
        }
        // Can be either
        return control === control_digit || control === control_letter;
    }, "Please specify a valid CIF number.");
    /*
     * Brazillian CPF number (Cadastrado de Pessoas Físicas) is the equivalent of a Brazilian tax registration number.
     * CPF numbers have 11 digits in total: 9 numbers followed by 2 check numbers that are being used for validation.
     */
    $.validator.addMethod("cpfBR", function (value) {
        // Removing special characters from value
        value = value.replace(/([~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/? ])+/g, "");
        // Checking value to have 11 digits only
        if (value.length !== 11) {
            return false;
        }
        var sum = 0, firstCN, secondCN, checkResult, i;
        firstCN = parseInt(value.substring(9, 10), 10);
        secondCN = parseInt(value.substring(10, 11), 10);
        checkResult = function (sum, cn) {
            var result = (sum * 10) % 11;
            if ((result === 10) || (result === 11)) {
                result = 0;
            }
            return (result === cn);
        };
        // Checking for dump data
        if (value === "" ||
            value === "00000000000" ||
            value === "11111111111" ||
            value === "22222222222" ||
            value === "33333333333" ||
            value === "44444444444" ||
            value === "55555555555" ||
            value === "66666666666" ||
            value === "77777777777" ||
            value === "88888888888" ||
            value === "99999999999") {
            return false;
        }
        // Step 1 - using first Check Number:
        for (i = 1; i <= 9; i++) {
            sum = sum + parseInt(value.substring(i - 1, i), 10) * (11 - i);
        }
        // If first Check Number (CN) is valid, move to Step 2 - using second Check Number:
        if (checkResult(sum, firstCN)) {
            sum = 0;
            for (i = 1; i <= 10; i++) {
                sum = sum + parseInt(value.substring(i - 1, i), 10) * (12 - i);
            }
            return checkResult(sum, secondCN);
        }
        return false;
    }, "Please specify a valid CPF number");
    // https://jqueryvalidation.org/creditcard-method/
    // based on https://en.wikipedia.org/wiki/Luhn_algorithm
    $.validator.addMethod("creditcard", function (value, element) {
        if (this.optional(element)) {
            return "dependency-mismatch";
        }
        // Accept only spaces, digits and dashes
        if (/[^0-9 \-]+/.test(value)) {
            return false;
        }
        var nCheck = 0, nDigit = 0, bEven = false, n, cDigit;
        value = value.replace(/\D/g, "");
        // Basing min and max length on
        // https://developer.ean.com/general_info/Valid_Credit_Card_Types
        if (value.length < 13 || value.length > 19) {
            return false;
        }
        for (n = value.length - 1; n >= 0; n--) {
            cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) {
                    nDigit -= 9;
                }
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return (nCheck % 10) === 0;
    }, "Please enter a valid credit card number.");
    /* NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
     * Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
     * Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
     */
    $.validator.addMethod("creditcardtypes", function (value, element, param) {
        if (/[^0-9\-]+/.test(value)) {
            return false;
        }
        value = value.replace(/\D/g, "");
        var validTypes = 0x0000;
        if (param.mastercard) {
            validTypes |= 0x0001;
        }
        if (param.visa) {
            validTypes |= 0x0002;
        }
        if (param.amex) {
            validTypes |= 0x0004;
        }
        if (param.dinersclub) {
            validTypes |= 0x0008;
        }
        if (param.enroute) {
            validTypes |= 0x0010;
        }
        if (param.discover) {
            validTypes |= 0x0020;
        }
        if (param.jcb) {
            validTypes |= 0x0040;
        }
        if (param.unknown) {
            validTypes |= 0x0080;
        }
        if (param.all) {
            validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;
        }
        if (validTypes & 0x0001 && /^(5[12345])/.test(value)) { // Mastercard
            return value.length === 16;
        }
        if (validTypes & 0x0002 && /^(4)/.test(value)) { // Visa
            return value.length === 16;
        }
        if (validTypes & 0x0004 && /^(3[47])/.test(value)) { // Amex
            return value.length === 15;
        }
        if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(value)) { // Dinersclub
            return value.length === 14;
        }
        if (validTypes & 0x0010 && /^(2(014|149))/.test(value)) { // Enroute
            return value.length === 15;
        }
        if (validTypes & 0x0020 && /^(6011)/.test(value)) { // Discover
            return value.length === 16;
        }
        if (validTypes & 0x0040 && /^(3)/.test(value)) { // Jcb
            return value.length === 16;
        }
        if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) { // Jcb
            return value.length === 15;
        }
        if (validTypes & 0x0080) { // Unknown
            return true;
        }
        return false;
    }, "Please enter a valid credit card number.");
    /**
     * Validates currencies with any given symbols by @jameslouiz
     * Symbols can be optional or required. Symbols required by default
     *
     * Usage examples:
     *  currency: ["£", false] - Use false for soft currency validation
     *  currency: ["$", false]
     *  currency: ["RM", false] - also works with text based symbols such as "RM" - Malaysia Ringgit etc
     *
     *  <input class="currencyInput" name="currencyInput">
     *
     * Soft symbol checking
     *  currencyInput: {
     *     currency: ["$", false]
     *  }
     *
     * Strict symbol checking (default)
     *  currencyInput: {
     *     currency: "$"
     *     //OR
     *     currency: ["$", true]
     *  }
     *
     * Multiple Symbols
     *  currencyInput: {
     *     currency: "$,£,¢"
     *  }
     */
    $.validator.addMethod("currency", function (value, element, param) {
        var isParamString = typeof param === "string", symbol = isParamString ? param : param[0], soft = isParamString ? true : param[1], regex;
        symbol = symbol.replace(/,/g, "");
        symbol = soft ? symbol + "]" : symbol + "]?";
        regex = "^[" + symbol + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$";
        regex = new RegExp(regex);
        return this.optional(element) || regex.test(value);
    }, "Please specify a valid currency");
    $.validator.addMethod("dateFA", function (value, element) {
        return this.optional(element) || /^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(value);
    }, $.validator.messages.date);
    /**
     * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
     *
     * @example $.validator.methods.date("01/01/1900")
     * @result true
     *
     * @example $.validator.methods.date("01/13/1990")
     * @result false
     *
     * @example $.validator.methods.date("01.01.1900")
     * @result false
     *
     * @example <input name="pippo" class="{dateITA:true}" />
     * @desc Declares an optional input element whose value must be a valid date.
     *
     * @name $.validator.methods.dateITA
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("dateITA", function (value, element) {
        var check = false, re = /^\d{1,2}\/\d{1,2}\/\d{4}$/, adata, gg, mm, aaaa, xdata;
        if (re.test(value)) {
            adata = value.split("/");
            gg = parseInt(adata[0], 10);
            mm = parseInt(adata[1], 10);
            aaaa = parseInt(adata[2], 10);
            xdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));
            if ((xdata.getUTCFullYear() === aaaa) && (xdata.getUTCMonth() === mm - 1) && (xdata.getUTCDate() === gg)) {
                check = true;
            }
            else {
                check = false;
            }
        }
        else {
            check = false;
        }
        return this.optional(element) || check;
    }, $.validator.messages.date);
    $.validator.addMethod("dateNL", function (value, element) {
        return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
    }, $.validator.messages.date);
    // Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
    $.validator.addMethod("extension", function (value, element, param) {
        param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp("\\.(" + param + ")$", "i"));
    }, $.validator.format("Please enter a value with a valid extension."));
    /**
     * Dutch giro account numbers (not bank numbers) have max 7 digits
     */
    $.validator.addMethod("giroaccountNL", function (value, element) {
        return this.optional(element) || /^[0-9]{1,7}$/.test(value);
    }, "Please specify a valid giro account number");
    /**
     * IBAN is the international bank account number.
     * It has a country - specific format, that is checked here too
     *
     * Validation is case-insensitive. Please make sure to normalize input yourself.
     */
    $.validator.addMethod("iban", function (value, element) {
        // Some quick simple tests to prevent needless work
        if (this.optional(element)) {
            return true;
        }
        // Remove spaces and to upper case
        var iban = value.replace(/ /g, "").toUpperCase(), ibancheckdigits = "", leadingZeroes = true, cRest = "", cOperator = "", countrycode, ibancheck, charAt, cChar, bbanpattern, bbancountrypatterns, ibanregexp, i, p;
        // Check for IBAN code length.
        // It contains:
        // country code ISO 3166-1 - two letters,
        // two check digits,
        // Basic Bank Account Number (BBAN) - up to 30 chars
        var minimalIBANlength = 5;
        if (iban.length < minimalIBANlength) {
            return false;
        }
        // Check the country code and find the country specific format
        countrycode = iban.substring(0, 2);
        bbancountrypatterns = {
            "AL": "\\d{8}[\\dA-Z]{16}",
            "AD": "\\d{8}[\\dA-Z]{12}",
            "AT": "\\d{16}",
            "AZ": "[\\dA-Z]{4}\\d{20}",
            "BE": "\\d{12}",
            "BH": "[A-Z]{4}[\\dA-Z]{14}",
            "BA": "\\d{16}",
            "BR": "\\d{23}[A-Z][\\dA-Z]",
            "BG": "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
            "CR": "\\d{17}",
            "HR": "\\d{17}",
            "CY": "\\d{8}[\\dA-Z]{16}",
            "CZ": "\\d{20}",
            "DK": "\\d{14}",
            "DO": "[A-Z]{4}\\d{20}",
            "EE": "\\d{16}",
            "FO": "\\d{14}",
            "FI": "\\d{14}",
            "FR": "\\d{10}[\\dA-Z]{11}\\d{2}",
            "GE": "[\\dA-Z]{2}\\d{16}",
            "DE": "\\d{18}",
            "GI": "[A-Z]{4}[\\dA-Z]{15}",
            "GR": "\\d{7}[\\dA-Z]{16}",
            "GL": "\\d{14}",
            "GT": "[\\dA-Z]{4}[\\dA-Z]{20}",
            "HU": "\\d{24}",
            "IS": "\\d{22}",
            "IE": "[\\dA-Z]{4}\\d{14}",
            "IL": "\\d{19}",
            "IT": "[A-Z]\\d{10}[\\dA-Z]{12}",
            "KZ": "\\d{3}[\\dA-Z]{13}",
            "KW": "[A-Z]{4}[\\dA-Z]{22}",
            "LV": "[A-Z]{4}[\\dA-Z]{13}",
            "LB": "\\d{4}[\\dA-Z]{20}",
            "LI": "\\d{5}[\\dA-Z]{12}",
            "LT": "\\d{16}",
            "LU": "\\d{3}[\\dA-Z]{13}",
            "MK": "\\d{3}[\\dA-Z]{10}\\d{2}",
            "MT": "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
            "MR": "\\d{23}",
            "MU": "[A-Z]{4}\\d{19}[A-Z]{3}",
            "MC": "\\d{10}[\\dA-Z]{11}\\d{2}",
            "MD": "[\\dA-Z]{2}\\d{18}",
            "ME": "\\d{18}",
            "NL": "[A-Z]{4}\\d{10}",
            "NO": "\\d{11}",
            "PK": "[\\dA-Z]{4}\\d{16}",
            "PS": "[\\dA-Z]{4}\\d{21}",
            "PL": "\\d{24}",
            "PT": "\\d{21}",
            "RO": "[A-Z]{4}[\\dA-Z]{16}",
            "SM": "[A-Z]\\d{10}[\\dA-Z]{12}",
            "SA": "\\d{2}[\\dA-Z]{18}",
            "RS": "\\d{18}",
            "SK": "\\d{20}",
            "SI": "\\d{15}",
            "ES": "\\d{20}",
            "SE": "\\d{20}",
            "CH": "\\d{5}[\\dA-Z]{12}",
            "TN": "\\d{20}",
            "TR": "\\d{5}[\\dA-Z]{17}",
            "AE": "\\d{3}\\d{16}",
            "GB": "[A-Z]{4}\\d{14}",
            "VG": "[\\dA-Z]{4}\\d{16}"
        };
        bbanpattern = bbancountrypatterns[countrycode];
        // As new countries will start using IBAN in the
        // future, we only check if the countrycode is known.
        // This prevents false negatives, while almost all
        // false positives introduced by this, will be caught
        // by the checksum validation below anyway.
        // Strict checking should return FALSE for unknown
        // countries.
        if (typeof bbanpattern !== "undefined") {
            ibanregexp = new RegExp("^[A-Z]{2}\\d{2}" + bbanpattern + "$", "");
            if (!(ibanregexp.test(iban))) {
                return false; // Invalid country specific format
            }
        }
        // Now check the checksum, first convert to digits
        ibancheck = iban.substring(4, iban.length) + iban.substring(0, 4);
        for (i = 0; i < ibancheck.length; i++) {
            charAt = ibancheck.charAt(i);
            if (charAt !== "0") {
                leadingZeroes = false;
            }
            if (!leadingZeroes) {
                ibancheckdigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charAt);
            }
        }
        // Calculate the result of: ibancheckdigits % 97
        for (p = 0; p < ibancheckdigits.length; p++) {
            cChar = ibancheckdigits.charAt(p);
            cOperator = "" + cRest + "" + cChar;
            cRest = cOperator % 97;
        }
        return cRest === 1;
    }, "Please specify a valid IBAN");
    $.validator.addMethod("integer", function (value, element) {
        return this.optional(element) || /^-?\d+$/.test(value);
    }, "A positive or negative non-decimal number please");
    $.validator.addMethod("ipv4", function (value, element) {
        return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
    }, "Please enter a valid IP v4 address.");
    $.validator.addMethod("ipv6", function (value, element) {
        return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
    }, "Please enter a valid IP v6 address.");
    $.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Letters only please");
    $.validator.addMethod("letterswithbasicpunc", function (value, element) {
        return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
    }, "Letters or punctuation only please");
    $.validator.addMethod("mobileNL", function (value, element) {
        return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
    }, "Please specify a valid mobile number");
    /* For UK phone functions, do the following server side processing:
     * Compare original input with this RegEx pattern:
     * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
     * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
     * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
     * A number of very detailed GB telephone number RegEx patterns can also be found at:
     * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
     */
    $.validator.addMethod("mobileUK", function (phone_number, element) {
        phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/);
    }, "Please specify a valid mobile number");
    $.validator.addMethod("netmask", function (value, element) {
        return this.optional(element) || /^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)/i.test(value);
    }, "Please enter a valid netmask.");
    /*
     * The NIE (Número de Identificación de Extranjero) is a Spanish tax identification number assigned by the Spanish
     * authorities to any foreigner.
     *
     * The NIE is the equivalent of a Spaniards Número de Identificación Fiscal (NIF) which serves as a fiscal
     * identification number. The CIF number (Certificado de Identificación Fiscal) is equivalent to the NIF, but applies to
     * companies rather than individuals. The NIE consists of an 'X' or 'Y' followed by 7 or 8 digits then another letter.
     */
    $.validator.addMethod("nieES", function (value, element) {
        "use strict";
        if (this.optional(element)) {
            return true;
        }
        var nieRegEx = new RegExp(/^[MXYZ]{1}[0-9]{7,8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/gi);
        var validChars = "TRWAGMYFPDXBNJZSQVHLCKET", letter = value.substr(value.length - 1).toUpperCase(), number;
        value = value.toString().toUpperCase();
        // Quick format test
        if (value.length > 10 || value.length < 9 || !nieRegEx.test(value)) {
            return false;
        }
        // X means same number
        // Y means number + 10000000
        // Z means number + 20000000
        value = value.replace(/^[X]/, "0")
            .replace(/^[Y]/, "1")
            .replace(/^[Z]/, "2");
        number = value.length === 9 ? value.substr(0, 8) : value.substr(0, 9);
        return validChars.charAt(parseInt(number, 10) % 23) === letter;
    }, "Please specify a valid NIE number.");
    /*
     * The Número de Identificación Fiscal ( NIF ) is the way tax identification used in Spain for individuals
     */
    $.validator.addMethod("nifES", function (value, element) {
        "use strict";
        if (this.optional(element)) {
            return true;
        }
        value = value.toUpperCase();
        // Basic format test
        if (!value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")) {
            return false;
        }
        // Test NIF
        if (/^[0-9]{8}[A-Z]{1}$/.test(value)) {
            return ("TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 0) % 23) === value.charAt(8));
        }
        // Test specials NIF (starts with K, L or M)
        if (/^[KLM]{1}/.test(value)) {
            return (value[8] === "TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 1) % 23));
        }
        return false;
    }, "Please specify a valid NIF number.");
    /*
     * Numer identyfikacji podatkowej ( NIP ) is the way tax identification used in Poland for companies
     */
    $.validator.addMethod("nipPL", function (value) {
        "use strict";
        value = value.replace(/[^0-9]/g, "");
        if (value.length !== 10) {
            return false;
        }
        var arrSteps = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        var intSum = 0;
        for (var i = 0; i < 9; i++) {
            intSum += arrSteps[i] * value[i];
        }
        var int2 = intSum % 11;
        var intControlNr = (int2 === 10) ? 0 : int2;
        return (intControlNr === parseInt(value[9], 10));
    }, "Please specify a valid NIP number.");
    $.validator.addMethod("notEqualTo", function (value, element, param) {
        return this.optional(element) || !$.validator.methods.equalTo.call(this, value, element, param);
    }, "Please enter a different value, values must not be the same.");
    $.validator.addMethod("nowhitespace", function (value, element) {
        return this.optional(element) || /^\S+$/i.test(value);
    }, "No white space please");
    /**
    * Return true if the field value matches the given format RegExp
    *
    * @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
    * @result true
    *
    * @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
    * @result false
    *
    * @name $.validator.methods.pattern
    * @type Boolean
    * @cat Plugins/Validate/Methods
    */
    $.validator.addMethod("pattern", function (value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        if (typeof param === "string") {
            param = new RegExp("^(?:" + param + ")$");
        }
        return param.test(value);
    }, "Invalid format.");
    /**
     * Dutch phone numbers have 10 digits (or 11 and start with +31).
     */
    $.validator.addMethod("phoneNL", function (value, element) {
        return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
    }, "Please specify a valid phone number.");
    /* For UK phone functions, do the following server side processing:
     * Compare original input with this RegEx pattern:
     * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
     * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
     * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
     * A number of very detailed GB telephone number RegEx patterns can also be found at:
     * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
     */
    // Matches UK landline + mobile, accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers
    $.validator.addMethod("phonesUK", function (phone_number, element) {
        phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/);
    }, "Please specify a valid uk phone number");
    /* For UK phone functions, do the following server side processing:
     * Compare original input with this RegEx pattern:
     * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
     * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
     * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
     * A number of very detailed GB telephone number RegEx patterns can also be found at:
     * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
     */
    $.validator.addMethod("phoneUK", function (phone_number, element) {
        phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/);
    }, "Please specify a valid phone number");
    /**
     * Matches US phone number format
     *
     * where the area code may not start with 1 and the prefix may not start with 1
     * allows '-' or ' ' as a separator and allows parens around area code
     * some people may want to put a '1' in front of their number
     *
     * 1(212)-999-2345 or
     * 212 999 2344 or
     * 212-999-0983
     *
     * but not
     * 111-123-5434
     * and not
     * 212 123 4567
     */
    $.validator.addMethod("phoneUS", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
    }, "Please specify a valid phone number");
    /*
    * Valida CEPs do brasileiros:
    *
    * Formatos aceitos:
    * 99999-999
    * 99.999-999
    * 99999999
    */
    $.validator.addMethod("postalcodeBR", function (cep_value, element) {
        return this.optional(element) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test(cep_value);
    }, "Informe um CEP válido.");
    /**
     * Matches a valid Canadian Postal Code
     *
     * @example jQuery.validator.methods.postalCodeCA( "H0H 0H0", element )
     * @result true
     *
     * @example jQuery.validator.methods.postalCodeCA( "H0H0H0", element )
     * @result false
     *
     * @name jQuery.validator.methods.postalCodeCA
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("postalCodeCA", function (value, element) {
        return this.optional(element) || /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] *\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(value);
    }, "Please specify a valid postal code");
    /* Matches Italian postcode (CAP) */
    $.validator.addMethod("postalcodeIT", function (value, element) {
        return this.optional(element) || /^\d{5}$/.test(value);
    }, "Please specify a valid postal code");
    $.validator.addMethod("postalcodeNL", function (value, element) {
        return this.optional(element) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(value);
    }, "Please specify a valid postal code");
    // Matches UK postcode. Does not match to UK Channel Islands that have their own postcodes (non standard UK)
    $.validator.addMethod("postcodeUK", function (value, element) {
        return this.optional(element) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(value);
    }, "Please specify a valid UK postcode");
    /*
     * Lets you say "at least X inputs that match selector Y must be filled."
     *
     * The end result is that neither of these inputs:
     *
     *	<input class="productinfo" name="partnumber">
     *	<input class="productinfo" name="description">
     *
     *	...will validate unless at least one of them is filled.
     *
     * partnumber:	{require_from_group: [1,".productinfo"]},
     * description: {require_from_group: [1,".productinfo"]}
     *
     * options[0]: number of fields that must be filled in the group
     * options[1]: CSS selector that defines the group of conditionally required fields
     */
    $.validator.addMethod("require_from_group", function (value, element, options) {
        var $fields = $(options[1], element.form), $fieldsFirst = $fields.eq(0), validator = $fieldsFirst.data("valid_req_grp") ? $fieldsFirst.data("valid_req_grp") : $.extend({}, this), isValid = $fields.filter(function () {
            return validator.elementValue(this);
        }).length >= options[0];
        // Store the cloned validator for future validation
        $fieldsFirst.data("valid_req_grp", validator);
        // If element isn't being validated, run each require_from_group field's validation rules
        if (!$(element).data("being_validated")) {
            $fields.data("being_validated", true);
            $fields.each(function () {
                validator.element(this);
            });
            $fields.data("being_validated", false);
        }
        return isValid;
    }, $.validator.format("Please fill at least {0} of these fields."));
    /*
     * Lets you say "either at least X inputs that match selector Y must be filled,
     * OR they must all be skipped (left blank)."
     *
     * The end result, is that none of these inputs:
     *
     *	<input class="productinfo" name="partnumber">
     *	<input class="productinfo" name="description">
     *	<input class="productinfo" name="color">
     *
     *	...will validate unless either at least two of them are filled,
     *	OR none of them are.
     *
     * partnumber:	{skip_or_fill_minimum: [2,".productinfo"]},
     * description: {skip_or_fill_minimum: [2,".productinfo"]},
     * color:		{skip_or_fill_minimum: [2,".productinfo"]}
     *
     * options[0]: number of fields that must be filled in the group
     * options[1]: CSS selector that defines the group of conditionally required fields
     *
     */
    $.validator.addMethod("skip_or_fill_minimum", function (value, element, options) {
        var $fields = $(options[1], element.form), $fieldsFirst = $fields.eq(0), validator = $fieldsFirst.data("valid_skip") ? $fieldsFirst.data("valid_skip") : $.extend({}, this), numberFilled = $fields.filter(function () {
            return validator.elementValue(this);
        }).length, isValid = numberFilled === 0 || numberFilled >= options[0];
        // Store the cloned validator for future validation
        $fieldsFirst.data("valid_skip", validator);
        // If element isn't being validated, run each skip_or_fill_minimum field's validation rules
        if (!$(element).data("being_validated")) {
            $fields.data("being_validated", true);
            $fields.each(function () {
                validator.element(this);
            });
            $fields.data("being_validated", false);
        }
        return isValid;
    }, $.validator.format("Please either skip these fields or fill at least {0} of them."));
    /* Validates US States and/or Territories by @jdforsythe
     * Can be case insensitive or require capitalization - default is case insensitive
     * Can include US Territories or not - default does not
     * Can include US Military postal abbreviations (AA, AE, AP) - default does not
     *
     * Note: "States" always includes DC (District of Colombia)
     *
     * Usage examples:
     *
     *  This is the default - case insensitive, no territories, no military zones
     *  stateInput: {
     *     caseSensitive: false,
     *     includeTerritories: false,
     *     includeMilitary: false
     *  }
     *
     *  Only allow capital letters, no territories, no military zones
     *  stateInput: {
     *     caseSensitive: false
     *  }
     *
     *  Case insensitive, include territories but not military zones
     *  stateInput: {
     *     includeTerritories: true
     *  }
     *
     *  Only allow capital letters, include territories and military zones
     *  stateInput: {
     *     caseSensitive: true,
     *     includeTerritories: true,
     *     includeMilitary: true
     *  }
     *
     */
    $.validator.addMethod("stateUS", function (value, element, options) {
        var isDefault = typeof options === "undefined", caseSensitive = (isDefault || typeof options.caseSensitive === "undefined") ? false : options.caseSensitive, includeTerritories = (isDefault || typeof options.includeTerritories === "undefined") ? false : options.includeTerritories, includeMilitary = (isDefault || typeof options.includeMilitary === "undefined") ? false : options.includeMilitary, regex;
        if (!includeTerritories && !includeMilitary) {
            regex = "^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$";
        }
        else if (includeTerritories && includeMilitary) {
            regex = "^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$";
        }
        else if (includeTerritories) {
            regex = "^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$";
        }
        else {
            regex = "^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$";
        }
        regex = caseSensitive ? new RegExp(regex) : new RegExp(regex, "i");
        return this.optional(element) || regex.test(value);
    }, "Please specify a valid state");
    // TODO check if value starts with <, otherwise don't try stripping anything
    $.validator.addMethod("strippedminlength", function (value, element, param) {
        return $(value).text().length >= param;
    }, $.validator.format("Please enter at least {0} characters"));
    $.validator.addMethod("time", function (value, element) {
        return this.optional(element) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(value);
    }, "Please enter a valid time, between 00:00 and 23:59");
    $.validator.addMethod("time12h", function (value, element) {
        return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(value);
    }, "Please enter a valid time in 12-hour am/pm format");
    // Same as url, but TLD is optional
    $.validator.addMethod("url2", function (value, element) {
        return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }, $.validator.messages.url);
    /**
     * Return true, if the value is a valid vehicle identification number (VIN).
     *
     * Works with all kind of text inputs.
     *
     * @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
     * @desc Declares a required input element whose value must be a valid vehicle identification number.
     *
     * @name $.validator.methods.vinUS
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("vinUS", function (v) {
        if (v.length !== 17) {
            return false;
        }
        var LL = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], VL = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9], FL = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], rs = 0, i, n, d, f, cd, cdv;
        for (i = 0; i < 17; i++) {
            f = FL[i];
            d = v.slice(i, i + 1);
            if (i === 8) {
                cdv = d;
            }
            if (!isNaN(d)) {
                d *= f;
            }
            else {
                for (n = 0; n < LL.length; n++) {
                    if (d.toUpperCase() === LL[n]) {
                        d = VL[n];
                        d *= f;
                        if (isNaN(cdv) && n === 8) {
                            cdv = LL[n];
                        }
                        break;
                    }
                }
            }
            rs += d;
        }
        cd = rs % 11;
        if (cd === 10) {
            cd = "X";
        }
        if (cd === cdv) {
            return true;
        }
        return false;
    }, "The specified vehicle identification number (VIN) is invalid.");
    $.validator.addMethod("zipcodeUS", function (value, element) {
        return this.optional(element) || /^\d{5}(-\d{4})?$/.test(value);
    }, "The specified US ZIP Code is invalid");
    $.validator.addMethod("ziprange", function (value, element) {
        return this.optional(element) || /^90[2-5]\d\{2\}-\d{4}$/.test(value);
    }, "Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx");
    return $;
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkaXRpb25hbC1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2pxdWVyeS12YWxpZGF0aW9uL2Rpc3QvYWRkaXRpb25hbC1tZXRob2RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFDSCxDQUFDLFVBQVUsT0FBTztJQUNqQixJQUFLLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFHO1FBQ2pELE1BQU0sQ0FBRSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxFQUFFLE9BQU8sQ0FBRSxDQUFDO0tBQ25EO1NBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUN4RCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBRSxPQUFPLENBQUUsUUFBUSxDQUFFLENBQUUsQ0FBQztLQUNoRDtTQUFNO1FBQ04sT0FBTyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0tBQ2xCO0FBQ0YsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUViLENBQUU7UUFFRCxTQUFTLFNBQVMsQ0FBRSxLQUFLO1lBRXhCLG1DQUFtQztZQUNuQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUUsYUFBYSxFQUFFLEdBQUcsQ0FBRSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxHQUFHLENBQUU7Z0JBRTVFLHFCQUFxQjtpQkFDcEIsT0FBTyxDQUFFLDhCQUE4QixFQUFFLEVBQUUsQ0FBRSxDQUFDO1FBQ2hELENBQUM7UUFFRCxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBRSxVQUFVLEVBQUUsVUFBVSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU07WUFDbEUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBRSxJ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Q2IsSUFBSyxFQUFFLEtBQUssRUFBRSxFQUFHO1lBQ2hCLEVBQUUsR0FBRyxHQUFHLENBQUM7U0FDVDtRQUNELElBQUssRUFBRSxLQUFLLEdBQUcsRUFBRztZQUNqQixPQUFPLElBQUksQ0FBQztTQUNaO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDLEVBQUUsK0RBQStELENBQUUsQ0FBQztJQUVyRSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBRSxXQUFXLEVBQUUsVUFBVSxLQUFLLEVBQUUsT0FBTztRQUMzRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUUsT0FBTyxDQUFFLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFFLEtBQUssQ0FBRSxDQUFDO0lBQ3JFLENBQUMsRUFBRSxzQ0FBc0MsQ0FBRSxDQUFDO0lBRTVDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFFLFVBQVUsRUFBRSxVQUFVLEtBQUssRUFBRSxPQUFPO1FBQzFELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBRSxPQUFPLENBQUUsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDM0UsQ0FBQyxFQUFFLDZEQUE2RCxDQUFFLENBQUM7SUFDbkUsT0FBTyxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIGpRdWVyeSBWYWxpZGF0aW9uIFBsdWdpbiB2MS4xNy4wXHJcbiAqXHJcbiAqIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNyBKw7ZybiBaYWVmZmVyZXJcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG4oZnVuY3Rpb24oIGZhY3RvcnkgKSB7XHJcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcclxuXHRcdGRlZmluZSggW1wianF1ZXJ5XCIsIFwiLi9qcXVlcnkudmFsaWRhdGVcIl0sIGZhY3RvcnkgKTtcclxuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSggcmVxdWlyZSggXCJqcXVlcnlcIiApICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGZhY3RvcnkoIGpRdWVyeSApO1xyXG5cdH1cclxufShmdW5jdGlvbiggJCApIHtcclxuXHJcbiggZnVuY3Rpb24oKSB7XHJcblxyXG5cdGZ1bmN0aW9uIHN0cmlwSHRtbCggdmFsdWUgKSB7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIGh0bWwgdGFncyBhbmQgc3BhY2UgY2hhcnNcclxuXHRcdHJldHVybiB2YWx1ZS5yZXBsYWNlKCAvPC5bXjw+XSo/Pi9nLCBcIiBcIiApLnJlcGxhY2UoIC8mbmJzcDt8JiMxNjA7L2dpLCBcIiBcIiApXHJcblxyXG5cdFx0Ly8gUmVtb3ZlIHB1bmN0dWF0aW9uXHJcblx0XHQucmVwbGFjZSggL1suKCksOzohPyUjJCdcXFwiXys9XFwvXFwt4oCc4oCd4oCZXSovZywgXCJcIiApO1xyXG5cdH1cclxuXHJcblx0JC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcIm1heFdvcmRzXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW1zICkge1xyXG5cdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBzdHJpcEh0bWwoIHZhbHVlICkubWF0Y2goIC9cXGJcXHcrXFxiL2cgKS5sZW5ndGggPD0gcGFyYW1zO1xyXG5cdH0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgezB9IHdvcmRzIG9yIGxlc3MuXCIgKSApO1xyXG5cclxuXHQkLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibWluV29yZHNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbXMgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHN0cmlwSHRtbCggdmFsdWUgKS5tYXRjaCggL1xcYlxcdytcXGIvZyApLmxlbmd0aCA+PSBwYXJhbXM7XHJcblx0fSwgJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhdCBsZWFzdCB7MH0gd29yZHMuXCIgKSApO1xyXG5cclxuXHQkLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicmFuZ2VXb3Jkc1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtcyApIHtcclxuXHRcdHZhciB2YWx1ZVN0cmlwcGVkID0gc3RyaXBIdG1sKCB2YWx1ZSApLFxyXG5cdFx0XHRyZWdleCA9IC9cXGJcXHcrXFxiL2c7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlU3RyaXBwZWQubWF0Y2goIHJlZ2V4ICkubGVuZ3RoID49IHBhcmFtc1sgMCBdICYmIHZhbHVlU3RyaXBwZWQubWF0Y2goIHJlZ2V4ICkubGVuZ3RoIDw9IHBhcmFtc1sgMSBdO1xyXG5cdH0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYmV0d2VlbiB7MH0gYW5kIHsxfSB3b3Jkcy5cIiApICk7XHJcblxyXG59KCkgKTtcclxuXHJcbi8vIEFjY2VwdCBhIHZhbHVlIGZyb20gYSBmaWxlIGlucHV0IGJhc2VkIG9uIGEgcmVxdWlyZWQgbWltZXR5cGVcclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImFjY2VwdFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cclxuXHQvLyBTcGxpdCBtaW1lIG9uIGNvbW1hcyBpbiBjYXNlIHdlIGhhdmUgbXVsdGlwbGUgdHlwZXMgd2UgY2FuIGFjY2VwdFxyXG5cdHZhciB0eXBlUGFyYW0gPSB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIgPyBwYXJhbS5yZXBsYWNlKCAvXFxzL2csIFwiXCIgKSA6IFwiaW1hZ2UvKlwiLFxyXG5cdFx0b3B0aW9uYWxWYWx1ZSA9IHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSxcclxuXHRcdGksIGZpbGUsIHJlZ2V4O1xyXG5cclxuXHQvLyBFbGVtZW50IGlzIG9wdGlvbmFsXHJcblx0aWYgKCBvcHRpb25hbFZhbHVlICkge1xyXG5cdFx0cmV0dXJuIG9wdGlvbmFsVmFsdWU7XHJcblx0fVxyXG5cclxuXHRpZiAoICQoIGVsZW1lbnQgKS5hdHRyKCBcInR5cGVcIiApID09PSBcImZpbGVcIiApIHtcclxuXHJcblx0XHQvLyBFc2NhcGUgc3RyaW5nIHRvIGJlIHVzZWQgaW4gdGhlIHJlZ2V4XHJcblx0XHQvLyBzZWU6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NDYxNzAvZXNjYXBlLXN0cmluZy1mb3ItdXNlLWluLWphdmFzY3JpcHQtcmVnZXhcclxuXHRcdC8vIEVzY2FwZSBhbHNvIFwiLypcIiBhcyBcIi8uKlwiIGFzIGEgd2lsZGNhcmRcclxuXHRcdHR5cGVQYXJhbSA9IHR5cGVQYXJhbVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvLC9nLCBcInxcIiApXHJcblx0XHRcdFx0LnJlcGxhY2UoIC9cXC9cXCovZywgXCIvLipcIiApO1xyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoZSBlbGVtZW50IGhhcyBhIEZpbGVMaXN0IGJlZm9yZSBjaGVja2luZyBlYWNoIGZpbGVcclxuXHRcdGlmICggZWxlbWVudC5maWxlcyAmJiBlbGVtZW50LmZpbGVzLmxlbmd0aCApIHtcclxuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKCBcIi4/KFwiICsgdHlwZVBhcmFtICsgXCIpJFwiLCBcImlcIiApO1xyXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IGVsZW1lbnQuZmlsZXMubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdFx0ZmlsZSA9IGVsZW1lbnQuZmlsZXNbIGkgXTtcclxuXHJcblx0XHRcdFx0Ly8gR3JhYiB0aGUgbWltZXR5cGUgZnJvbSB0aGUgbG9hZGVkIGZpbGUsIHZlcmlmeSBpdCBtYXRjaGVzXHJcblx0XHRcdFx0aWYgKCAhZmlsZS50eXBlLm1hdGNoKCByZWdleCApICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gRWl0aGVyIHJldHVybiB0cnVlIGJlY2F1c2Ugd2UndmUgdmFsaWRhdGVkIGVhY2ggZmlsZSwgb3IgYmVjYXVzZSB0aGVcclxuXHQvLyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgZWxlbWVudC5maWxlcyBhbmQgdGhlIEZpbGVMaXN0IGZlYXR1cmVcclxuXHRyZXR1cm4gdHJ1ZTtcclxufSwgJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIHdpdGggYSB2YWxpZCBtaW1ldHlwZS5cIiApICk7XHJcblxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiYWxwaGFudW1lcmljXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFx3KyQvaS50ZXN0KCB2YWx1ZSApO1xyXG59LCBcIkxldHRlcnMsIG51bWJlcnMsIGFuZCB1bmRlcnNjb3JlcyBvbmx5IHBsZWFzZVwiICk7XHJcblxyXG4vKlxyXG4gKiBEdXRjaCBiYW5rIGFjY291bnQgbnVtYmVycyAobm90ICdnaXJvJyBudW1iZXJzKSBoYXZlIDkgZGlnaXRzXHJcbiAqIGFuZCBwYXNzIHRoZSAnMTEgY2hlY2snLlxyXG4gKiBXZSBhY2NlcHQgdGhlIG5vdGF0aW9uIHdpdGggc3BhY2VzLCBhcyB0aGF0IGlzIGNvbW1vbi5cclxuICogYWNjZXB0YWJsZTogMTIzNDU2Nzg5IG9yIDEyIDM0IDU2IDc4OVxyXG4gKi9cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImJhbmthY2NvdW50TkxcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdGlmICggISggL15bMC05XXs5fXwoWzAtOV17Mn0gKXszfVswLTldezN9JC8udGVzdCggdmFsdWUgKSApICkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0Ly8gTm93ICcxMSBjaGVjaydcclxuXHR2YXIgYWNjb3VudCA9IHZhbHVlLnJlcGxhY2UoIC8gL2csIFwiXCIgKSwgLy8gUmVtb3ZlIHNwYWNlc1xyXG5cdFx0c3VtID0gMCxcclxuXHRcdGxlbiA9IGFjY291bnQubGVuZ3RoLFxyXG5cdFx0cG9zLCBmYWN0b3IsIGRpZ2l0O1xyXG5cdGZvciAoIHBvcyA9IDA7IHBvcyA8IGxlbjsgcG9zKysgKSB7XHJcblx0XHRmYWN0b3IgPSBsZW4gLSBwb3M7XHJcblx0XHRkaWdpdCA9IGFjY291bnQuc3Vic3RyaW5nKCBwb3MsIHBvcyArIDEgKTtcclxuXHRcdHN1bSA9IHN1bSArIGZhY3RvciAqIGRpZ2l0O1xyXG5cdH1cclxuXHRyZXR1cm4gc3VtICUgMTEgPT09IDA7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBiYW5rIGFjY291bnQgbnVtYmVyXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJiYW5rb3JnaXJvYWNjb3VudE5MXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8XHJcblx0XHRcdCggJC52YWxpZGF0b3IubWV0aG9kcy5iYW5rYWNjb3VudE5MLmNhbGwoIHRoaXMsIHZhbHVlLCBlbGVtZW50ICkgKSB8fFxyXG5cdFx0XHQoICQudmFsaWRhdG9yLm1ldGhvZHMuZ2lyb2FjY291bnROTC5jYWxsKCB0aGlzLCB2YWx1ZSwgZWxlbWVudCApICk7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBiYW5rIG9yIGdpcm8gYWNjb3VudCBudW1iZXJcIiApO1xyXG5cclxuLyoqXHJcbiAqIEJJQyBpcyB0aGUgYnVzaW5lc3MgaWRlbnRpZmllciBjb2RlIChJU08gOTM2MikuIFRoaXMgQklDIGNoZWNrIGlzIG5vdCBhIGd1YXJhbnRlZSBmb3IgYXV0aGVudGljaXR5LlxyXG4gKlxyXG4gKiBCSUMgcGF0dGVybjogQkJCQkNDTExiYmIgKDggb3IgMTEgY2hhcmFjdGVycyBsb25nOyBiYmIgaXMgb3B0aW9uYWwpXHJcbiAqXHJcbiAqIFZhbGlkYXRpb24gaXMgY2FzZS1pbnNlbnNpdGl2ZS4gUGxlYXNlIG1ha2Ugc3VyZSB0byBub3JtYWxpemUgaW5wdXQgeW91cnNlbGYuXHJcbiAqXHJcbiAqIEJJQyBkZWZpbml0aW9uIGluIGRldGFpbDpcclxuICogLSBGaXJzdCA0IGNoYXJhY3RlcnMgLSBiYW5rIGNvZGUgKG9ubHkgbGV0dGVycylcclxuICogLSBOZXh0IDIgY2hhcmFjdGVycyAtIElTTyAzMTY2LTEgYWxwaGEtMiBjb3VudHJ5IGNvZGUgKG9ubHkgbGV0dGVycylcclxuICogLSBOZXh0IDIgY2hhcmFjdGVycyAtIGxvY2F0aW9uIGNvZGUgKGxldHRlcnMgYW5kIGRpZ2l0cylcclxuICogICBhLiBzaGFsbCBub3Qgc3RhcnQgd2l0aCAnMCcgb3IgJzEnXHJcbiAqICAgYi4gc2Vjb25kIGNoYXJhY3RlciBtdXN0IGJlIGEgbGV0dGVyICgnTycgaXMgbm90IGFsbG93ZWQpIG9yIGRpZ2l0ICgnMCcgZm9yIHRlc3QgKHRoZXJlZm9yZSBub3QgYWxsb3dlZCksICcxJyBkZW5vdGluZyBwYXNzaXZlIHBhcnRpY2lwYW50LCAnMicgdHlwaWNhbGx5IHJldmVyc2UtYmlsbGluZylcclxuICogLSBMYXN0IDMgY2hhcmFjdGVycyAtIGJyYW5jaCBjb2RlLCBvcHRpb25hbCAoc2hhbGwgbm90IHN0YXJ0IHdpdGggJ1gnIGV4Y2VwdCBpbiBjYXNlIG9mICdYWFgnIGZvciBwcmltYXJ5IG9mZmljZSkgKGxldHRlcnMgYW5kIGRpZ2l0cylcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJiaWNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXihbQS1aXXs2fVtBLVoyLTldW0EtTlAtWjEtOV0pKFh7M318W0EtV1ktWjAtOV1bQS1aMC05XXsyfSk/JC8udGVzdCggdmFsdWUudG9VcHBlckNhc2UoKSApO1xyXG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgQklDIGNvZGVcIiApO1xyXG5cclxuLypcclxuICogQ8OzZGlnbyBkZSBpZGVudGlmaWNhY2nDs24gZmlzY2FsICggQ0lGICkgaXMgdGhlIHRheCBpZGVudGlmaWNhdGlvbiBjb2RlIGZvciBTcGFuaXNoIGxlZ2FsIGVudGl0aWVzXHJcbiAqIEZ1cnRoZXIgcnVsZXMgY2FuIGJlIGZvdW5kIGluIFNwYW5pc2ggb24gaHR0cDovL2VzLndpa2lwZWRpYS5vcmcvd2lraS9DJUMzJUIzZGlnb19kZV9pZGVudGlmaWNhY2klQzMlQjNuX2Zpc2NhbFxyXG4gKlxyXG4gKiBTcGFuaXNoIENJRiBzdHJ1Y3R1cmU6XHJcbiAqXHJcbiAqIFsgVCBdWyBQIF1bIFAgXVsgTiBdWyBOIF1bIE4gXVsgTiBdWyBOIF1bIEMgXVxyXG4gKlxyXG4gKiBXaGVyZTpcclxuICpcclxuICogVDogMSBjaGFyYWN0ZXIuIEtpbmQgb2YgT3JnYW5pemF0aW9uIExldHRlcjogW0FCQ0RFRkdISktMTU5QUVJTVVZXXVxyXG4gKiBQOiAyIGNoYXJhY3RlcnMuIFByb3ZpbmNlLlxyXG4gKiBOOiA1IGNoYXJhY3RlcnMuIFNlY3VlbmNpYWwgTnVtYmVyIHdpdGhpbiB0aGUgcHJvdmluY2UuXHJcbiAqIEM6IDEgY2hhcmFjdGVyLiBDb250cm9sIERpZ2l0OiBbMC05QS1KXS5cclxuICpcclxuICogWyBUIF06IEtpbmQgb2YgT3JnYW5pemF0aW9ucy4gUG9zc2libGUgdmFsdWVzOlxyXG4gKlxyXG4gKiAgIEEuIENvcnBvcmF0aW9uc1xyXG4gKiAgIEIuIExMQ3NcclxuICogICBDLiBHZW5lcmFsIHBhcnRuZXJzaGlwc1xyXG4gKiAgIEQuIENvbXBhbmllcyBsaW1pdGVkIHBhcnRuZXJzaGlwc1xyXG4gKiAgIEUuIENvbW11bml0aWVzIG9mIGdvb2RzXHJcbiAqICAgRi4gQ29vcGVyYXRpdmUgU29jaWV0aWVzXHJcbiAqICAgRy4gQXNzb2NpYXRpb25zXHJcbiAqICAgSC4gQ29tbXVuaXRpZXMgb2YgaG9tZW93bmVycyBpbiBob3Jpem9udGFsIHByb3BlcnR5IHJlZ2ltZVxyXG4gKiAgIEouIENpdmlsIFNvY2lldGllc1xyXG4gKiAgIEsuIE9sZCBmb3JtYXRcclxuICogICBMLiBPbGQgZm9ybWF0XHJcbiAqICAgTS4gT2xkIGZvcm1hdFxyXG4gKiAgIE4uIE5vbnJlc2lkZW50IGVudGl0aWVzXHJcbiAqICAgUC4gTG9jYWwgYXV0aG9yaXRpZXNcclxuICogICBRLiBBdXRvbm9tb3VzIGJvZGllcywgc3RhdGUgb3Igbm90LCBhbmQgdGhlIGxpa2UsIGFuZCBjb25ncmVnYXRpb25zIGFuZCByZWxpZ2lvdXMgaW5zdGl0dXRpb25zXHJcbiAqICAgUi4gQ29uZ3JlZ2F0aW9ucyBhbmQgcmVsaWdpb3VzIGluc3RpdHV0aW9ucyAoc2luY2UgMjAwOCBPUkRFUiBFSEEvNDUxLzIwMDgpXHJcbiAqICAgUy4gT3JnYW5zIG9mIFN0YXRlIEFkbWluaXN0cmF0aW9uIGFuZCByZWdpb25zXHJcbiAqICAgVi4gQWdyYXJpYW4gVHJhbnNmb3JtYXRpb25cclxuICogICBXLiBQZXJtYW5lbnQgZXN0YWJsaXNobWVudHMgb2Ygbm9uLXJlc2lkZW50IGluIFNwYWluXHJcbiAqXHJcbiAqIFsgQyBdOiBDb250cm9sIERpZ2l0LiBJdCBjYW4gYmUgYSBudW1iZXIgb3IgYSBsZXR0ZXIgZGVwZW5kaW5nIG9uIFQgdmFsdWU6XHJcbiAqIFsgVCBdICAtLT4gIFsgQyBdXHJcbiAqIC0tLS0tLSAgICAtLS0tLS0tLS0tXHJcbiAqICAgQSAgICAgICAgIE51bWJlclxyXG4gKiAgIEIgICAgICAgICBOdW1iZXJcclxuICogICBFICAgICAgICAgTnVtYmVyXHJcbiAqICAgSCAgICAgICAgIE51bWJlclxyXG4gKiAgIEsgICAgICAgICBMZXR0ZXJcclxuICogICBQICAgICAgICAgTGV0dGVyXHJcbiAqICAgUSAgICAgICAgIExldHRlclxyXG4gKiAgIFMgICAgICAgICBMZXR0ZXJcclxuICpcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJjaWZFU1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHR2YXIgY2lmUmVnRXggPSBuZXcgUmVnRXhwKCAvXihbQUJDREVGR0hKS0xNTlBRUlNVVlddKShcXGR7N30pKFswLTlBLUpdKSQvZ2kgKTtcclxuXHR2YXIgbGV0dGVyICA9IHZhbHVlLnN1YnN0cmluZyggMCwgMSApLCAvLyBbIFQgXVxyXG5cdFx0bnVtYmVyICA9IHZhbHVlLnN1YnN0cmluZyggMSwgOCApLCAvLyBbIFAgXVsgUCBdWyBOIF1bIE4gXVsgTiBdWyBOIF1bIE4gXVxyXG5cdFx0Y29udHJvbCA9IHZhbHVlLnN1YnN0cmluZyggOCwgOSApLCAvLyBbIEMgXVxyXG5cdFx0YWxsX3N1bSA9IDAsXHJcblx0XHRldmVuX3N1bSA9IDAsXHJcblx0XHRvZGRfc3VtID0gMCxcclxuXHRcdGksIG4sXHJcblx0XHRjb250cm9sX2RpZ2l0LFxyXG5cdFx0Y29udHJvbF9sZXR0ZXI7XHJcblxyXG5cdGZ1bmN0aW9uIGlzT2RkKCBuICkge1xyXG5cdFx0cmV0dXJuIG4gJSAyID09PSAwO1xyXG5cdH1cclxuXHJcblx0Ly8gUXVpY2sgZm9ybWF0IHRlc3RcclxuXHRpZiAoIHZhbHVlLmxlbmd0aCAhPT0gOSB8fCAhY2lmUmVnRXgudGVzdCggdmFsdWUgKSApIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGZvciAoIGkgPSAwOyBpIDwgbnVtYmVyLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0biA9IHBhcnNlSW50KCBudW1iZXJbIGkgXSwgMTAgKTtcclxuXHJcblx0XHQvLyBPZGQgcG9zaXRpb25zXHJcblx0XHRpZiAoIGlzT2RkKCBpICkgKSB7XHJcblxyXG5cdFx0XHQvLyBPZGQgcG9zaXRpb25zIGFyZSBtdWx0aXBsaWVkIGZpcnN0LlxyXG5cdFx0XHRuICo9IDI7XHJcblxyXG5cdFx0XHQvLyBJZiB0aGUgbXVsdGlwbGljYXRpb24gaXMgYmlnZ2VyIHRoYW4gMTAgd2UgbmVlZCB0byBhZGp1c3RcclxuXHRcdFx0b2RkX3N1bSArPSBuIDwgMTAgPyBuIDogbiAtIDk7XHJcblxyXG5cdFx0Ly8gRXZlbiBwb3NpdGlvbnNcclxuXHRcdC8vIEp1c3Qgc3VtIHRoZW1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGV2ZW5fc3VtICs9IG47XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhbGxfc3VtID0gZXZlbl9zdW0gKyBvZGRfc3VtO1xyXG5cdGNvbnRyb2xfZGlnaXQgPSAoIDEwIC0gKCBhbGxfc3VtICkudG9TdHJpbmcoKS5zdWJzdHIoIC0xICkgKS50b1N0cmluZygpO1xyXG5cdGNvbnRyb2xfZGlnaXQgPSBwYXJzZUludCggY29udHJvbF9kaWdpdCwgMTAgKSA+IDkgPyBcIjBcIiA6IGNvbnRyb2xfZGlnaXQ7XHJcblx0Y29udHJvbF9sZXR0ZXIgPSBcIkpBQkNERUZHSElcIi5zdWJzdHIoIGNvbnRyb2xfZGlnaXQsIDEgKS50b1N0cmluZygpO1xyXG5cclxuXHQvLyBDb250cm9sIG11c3QgYmUgYSBkaWdpdFxyXG5cdGlmICggbGV0dGVyLm1hdGNoKCAvW0FCRUhdLyApICkge1xyXG5cdFx0cmV0dXJuIGNvbnRyb2wgPT09IGNvbnRyb2xfZGlnaXQ7XHJcblxyXG5cdC8vIENvbnRyb2wgbXVzdCBiZSBhIGxldHRlclxyXG5cdH0gZWxzZSBpZiAoIGxldHRlci5tYXRjaCggL1tLUFFTXS8gKSApIHtcclxuXHRcdHJldHVybiBjb250cm9sID09PSBjb250cm9sX2xldHRlcjtcclxuXHR9XHJcblxyXG5cdC8vIENhbiBiZSBlaXRoZXJcclxuXHRyZXR1cm4gY29udHJvbCA9PT0gY29udHJvbF9kaWdpdCB8fCBjb250cm9sID09PSBjb250cm9sX2xldHRlcjtcclxuXHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBDSUYgbnVtYmVyLlwiICk7XHJcblxyXG4vKlxyXG4gKiBCcmF6aWxsaWFuIENQRiBudW1iZXIgKENhZGFzdHJhZG8gZGUgUGVzc29hcyBGw61zaWNhcykgaXMgdGhlIGVxdWl2YWxlbnQgb2YgYSBCcmF6aWxpYW4gdGF4IHJlZ2lzdHJhdGlvbiBudW1iZXIuXHJcbiAqIENQRiBudW1iZXJzIGhhdmUgMTEgZGlnaXRzIGluIHRvdGFsOiA5IG51bWJlcnMgZm9sbG93ZWQgYnkgMiBjaGVjayBudW1iZXJzIHRoYXQgYXJlIGJlaW5nIHVzZWQgZm9yIHZhbGlkYXRpb24uXHJcbiAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiY3BmQlJcIiwgZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cclxuXHQvLyBSZW1vdmluZyBzcGVjaWFsIGNoYXJhY3RlcnMgZnJvbSB2YWx1ZVxyXG5cdHZhbHVlID0gdmFsdWUucmVwbGFjZSggLyhbfiFAIyQlXiYqKClfKz1ge31cXFtcXF1cXC18XFxcXDo7Jzw+LC5cXC8/IF0pKy9nLCBcIlwiICk7XHJcblxyXG5cdC8vIENoZWNraW5nIHZhbHVlIHRvIGhhdmUgMTEgZGlnaXRzIG9ubHlcclxuXHRpZiAoIHZhbHVlLmxlbmd0aCAhPT0gMTEgKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHR2YXIgc3VtID0gMCxcclxuXHRcdGZpcnN0Q04sIHNlY29uZENOLCBjaGVja1Jlc3VsdCwgaTtcclxuXHJcblx0Zmlyc3RDTiA9IHBhcnNlSW50KCB2YWx1ZS5zdWJzdHJpbmcoIDksIDEwICksIDEwICk7XHJcblx0c2Vjb25kQ04gPSBwYXJzZUludCggdmFsdWUuc3Vic3RyaW5nKCAxMCwgMTEgKSwgMTAgKTtcclxuXHJcblx0Y2hlY2tSZXN1bHQgPSBmdW5jdGlvbiggc3VtLCBjbiApIHtcclxuXHRcdHZhciByZXN1bHQgPSAoIHN1bSAqIDEwICkgJSAxMTtcclxuXHRcdGlmICggKCByZXN1bHQgPT09IDEwICkgfHwgKCByZXN1bHQgPT09IDExICkgKSB7XHJcblx0XHRcdHJlc3VsdCA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKCByZXN1bHQgPT09IGNuICk7XHJcblx0fTtcclxuXHJcblx0Ly8gQ2hlY2tpbmcgZm9yIGR1bXAgZGF0YVxyXG5cdGlmICggdmFsdWUgPT09IFwiXCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjAwMDAwMDAwMDAwXCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjExMTExMTExMTExXCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjIyMjIyMjIyMjIyXCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjMzMzMzMzMzMzMzXCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjQ0NDQ0NDQ0NDQ0XCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjU1NTU1NTU1NTU1XCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjY2NjY2NjY2NjY2XCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjc3Nzc3Nzc3Nzc3XCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjg4ODg4ODg4ODg4XCIgfHxcclxuXHRcdHZhbHVlID09PSBcIjk5OTk5OTk5OTk5XCJcclxuXHQpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8vIFN0ZXAgMSAtIHVzaW5nIGZpcnN0IENoZWNrIE51bWJlcjpcclxuXHRmb3IgKCBpID0gMTsgaSA8PSA5OyBpKysgKSB7XHJcblx0XHRzdW0gPSBzdW0gKyBwYXJzZUludCggdmFsdWUuc3Vic3RyaW5nKCBpIC0gMSwgaSApLCAxMCApICogKCAxMSAtIGkgKTtcclxuXHR9XHJcblxyXG5cdC8vIElmIGZpcnN0IENoZWNrIE51bWJlciAoQ04pIGlzIHZhbGlkLCBtb3ZlIHRvIFN0ZXAgMiAtIHVzaW5nIHNlY29uZCBDaGVjayBOdW1iZXI6XHJcblx0aWYgKCBjaGVja1Jlc3VsdCggc3VtLCBmaXJzdENOICkgKSB7XHJcblx0XHRzdW0gPSAwO1xyXG5cdFx0Zm9yICggaSA9IDE7IGkgPD0gMTA7IGkrKyApIHtcclxuXHRcdFx0c3VtID0gc3VtICsgcGFyc2VJbnQoIHZhbHVlLnN1YnN0cmluZyggaSAtIDEsIGkgKSwgMTAgKSAqICggMTIgLSBpICk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hlY2tSZXN1bHQoIHN1bSwgc2Vjb25kQ04gKTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG5cclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIENQRiBudW1iZXJcIiApO1xyXG5cclxuLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9jcmVkaXRjYXJkLW1ldGhvZC9cclxuLy8gYmFzZWQgb24gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTHVobl9hbGdvcml0aG1cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImNyZWRpdGNhcmRcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xyXG5cdFx0cmV0dXJuIFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiO1xyXG5cdH1cclxuXHJcblx0Ly8gQWNjZXB0IG9ubHkgc3BhY2VzLCBkaWdpdHMgYW5kIGRhc2hlc1xyXG5cdGlmICggL1teMC05IFxcLV0rLy50ZXN0KCB2YWx1ZSApICkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0dmFyIG5DaGVjayA9IDAsXHJcblx0XHRuRGlnaXQgPSAwLFxyXG5cdFx0YkV2ZW4gPSBmYWxzZSxcclxuXHRcdG4sIGNEaWdpdDtcclxuXHJcblx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCAvXFxEL2csIFwiXCIgKTtcclxuXHJcblx0Ly8gQmFzaW5nIG1pbiBhbmQgbWF4IGxlbmd0aCBvblxyXG5cdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLmVhbi5jb20vZ2VuZXJhbF9pbmZvL1ZhbGlkX0NyZWRpdF9DYXJkX1R5cGVzXHJcblx0aWYgKCB2YWx1ZS5sZW5ndGggPCAxMyB8fCB2YWx1ZS5sZW5ndGggPiAxOSApIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGZvciAoIG4gPSB2YWx1ZS5sZW5ndGggLSAxOyBuID49IDA7IG4tLSApIHtcclxuXHRcdGNEaWdpdCA9IHZhbHVlLmNoYXJBdCggbiApO1xyXG5cdFx0bkRpZ2l0ID0gcGFyc2VJbnQoIGNEaWdpdCwgMTAgKTtcclxuXHRcdGlmICggYkV2ZW4gKSB7XHJcblx0XHRcdGlmICggKCBuRGlnaXQgKj0gMiApID4gOSApIHtcclxuXHRcdFx0XHRuRGlnaXQgLT0gOTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdG5DaGVjayArPSBuRGlnaXQ7XHJcblx0XHRiRXZlbiA9ICFiRXZlbjtcclxuXHR9XHJcblxyXG5cdHJldHVybiAoIG5DaGVjayAlIDEwICkgPT09IDA7XHJcbn0sIFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgY3JlZGl0IGNhcmQgbnVtYmVyLlwiICk7XHJcblxyXG4vKiBOT1RJQ0U6IE1vZGlmaWVkIHZlcnNpb24gb2YgQ2FzdGxlLkNvbXBvbmVudHMuVmFsaWRhdG9yLkNyZWRpdENhcmRWYWxpZGF0b3JcclxuICogUmVkaXN0cmlidXRlZCB1bmRlciB0aGUgdGhlIEFwYWNoZSBMaWNlbnNlIDIuMCBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICogVmFsaWQgVHlwZXM6IG1hc3RlcmNhcmQsIHZpc2EsIGFtZXgsIGRpbmVyc2NsdWIsIGVucm91dGUsIGRpc2NvdmVyLCBqY2IsIHVua25vd24sIGFsbCAob3ZlcnJpZGVzIGFsbCBvdGhlciBzZXR0aW5ncylcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJjcmVkaXRjYXJkdHlwZXNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcclxuXHRpZiAoIC9bXjAtOVxcLV0rLy50ZXN0KCB2YWx1ZSApICkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCAvXFxEL2csIFwiXCIgKTtcclxuXHJcblx0dmFyIHZhbGlkVHlwZXMgPSAweDAwMDA7XHJcblxyXG5cdGlmICggcGFyYW0ubWFzdGVyY2FyZCApIHtcclxuXHRcdHZhbGlkVHlwZXMgfD0gMHgwMDAxO1xyXG5cdH1cclxuXHRpZiAoIHBhcmFtLnZpc2EgKSB7XHJcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDAwMjtcclxuXHR9XHJcblx0aWYgKCBwYXJhbS5hbWV4ICkge1xyXG5cdFx0dmFsaWRUeXBlcyB8PSAweDAwMDQ7XHJcblx0fVxyXG5cdGlmICggcGFyYW0uZGluZXJzY2x1YiApIHtcclxuXHRcdHZhbGlkVHlwZXMgfD0gMHgwMDA4O1xyXG5cdH1cclxuXHRpZiAoIHBhcmFtLmVucm91dGUgKSB7XHJcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDAxMDtcclxuXHR9XHJcblx0aWYgKCBwYXJhbS5kaXNjb3ZlciApIHtcclxuXHRcdHZhbGlkVHlwZXMgfD0gMHgwMDIwO1xyXG5cdH1cclxuXHRpZiAoIHBhcmFtLmpjYiApIHtcclxuXHRcdHZhbGlkVHlwZXMgfD0gMHgwMDQwO1xyXG5cdH1cclxuXHRpZiAoIHBhcmFtLnVua25vd24gKSB7XHJcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDA4MDtcclxuXHR9XHJcblx0aWYgKCBwYXJhbS5hbGwgKSB7XHJcblx0XHR2YWxpZFR5cGVzID0gMHgwMDAxIHwgMHgwMDAyIHwgMHgwMDA0IHwgMHgwMDA4IHwgMHgwMDEwIHwgMHgwMDIwIHwgMHgwMDQwIHwgMHgwMDgwO1xyXG5cdH1cclxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwMDEgJiYgL14oNVsxMjM0NV0pLy50ZXN0KCB2YWx1ZSApICkgeyAvLyBNYXN0ZXJjYXJkXHJcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNjtcclxuXHR9XHJcblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDAyICYmIC9eKDQpLy50ZXN0KCB2YWx1ZSApICkgeyAvLyBWaXNhXHJcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNjtcclxuXHR9XHJcblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDA0ICYmIC9eKDNbNDddKS8udGVzdCggdmFsdWUgKSApIHsgLy8gQW1leFxyXG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMTU7XHJcblx0fVxyXG5cdGlmICggdmFsaWRUeXBlcyAmIDB4MDAwOCAmJiAvXigzKDBbMDEyMzQ1XXxbNjhdKSkvLnRlc3QoIHZhbHVlICkgKSB7IC8vIERpbmVyc2NsdWJcclxuXHRcdHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDE0O1xyXG5cdH1cclxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwMTAgJiYgL14oMigwMTR8MTQ5KSkvLnRlc3QoIHZhbHVlICkgKSB7IC8vIEVucm91dGVcclxuXHRcdHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDE1O1xyXG5cdH1cclxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwMjAgJiYgL14oNjAxMSkvLnRlc3QoIHZhbHVlICkgKSB7IC8vIERpc2NvdmVyXHJcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNjtcclxuXHR9XHJcblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDQwICYmIC9eKDMpLy50ZXN0KCB2YWx1ZSApICkgeyAvLyBKY2JcclxuXHRcdHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDE2O1xyXG5cdH1cclxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwNDAgJiYgL14oMjEzMXwxODAwKS8udGVzdCggdmFsdWUgKSApIHsgLy8gSmNiXHJcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNTtcclxuXHR9XHJcblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDgwICkgeyAvLyBVbmtub3duXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59LCBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGNyZWRpdCBjYXJkIG51bWJlci5cIiApO1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlcyBjdXJyZW5jaWVzIHdpdGggYW55IGdpdmVuIHN5bWJvbHMgYnkgQGphbWVzbG91aXpcclxuICogU3ltYm9scyBjYW4gYmUgb3B0aW9uYWwgb3IgcmVxdWlyZWQuIFN5bWJvbHMgcmVxdWlyZWQgYnkgZGVmYXVsdFxyXG4gKlxyXG4gKiBVc2FnZSBleGFtcGxlczpcclxuICogIGN1cnJlbmN5OiBbXCLCo1wiLCBmYWxzZV0gLSBVc2UgZmFsc2UgZm9yIHNvZnQgY3VycmVuY3kgdmFsaWRhdGlvblxyXG4gKiAgY3VycmVuY3k6IFtcIiRcIiwgZmFsc2VdXHJcbiAqICBjdXJyZW5jeTogW1wiUk1cIiwgZmFsc2VdIC0gYWxzbyB3b3JrcyB3aXRoIHRleHQgYmFzZWQgc3ltYm9scyBzdWNoIGFzIFwiUk1cIiAtIE1hbGF5c2lhIFJpbmdnaXQgZXRjXHJcbiAqXHJcbiAqICA8aW5wdXQgY2xhc3M9XCJjdXJyZW5jeUlucHV0XCIgbmFtZT1cImN1cnJlbmN5SW5wdXRcIj5cclxuICpcclxuICogU29mdCBzeW1ib2wgY2hlY2tpbmdcclxuICogIGN1cnJlbmN5SW5wdXQ6IHtcclxuICogICAgIGN1cnJlbmN5OiBbXCIkXCIsIGZhbHNlXVxyXG4gKiAgfVxyXG4gKlxyXG4gKiBTdHJpY3Qgc3ltYm9sIGNoZWNraW5nIChkZWZhdWx0KVxyXG4gKiAgY3VycmVuY3lJbnB1dDoge1xyXG4gKiAgICAgY3VycmVuY3k6IFwiJFwiXHJcbiAqICAgICAvL09SXHJcbiAqICAgICBjdXJyZW5jeTogW1wiJFwiLCB0cnVlXVxyXG4gKiAgfVxyXG4gKlxyXG4gKiBNdWx0aXBsZSBTeW1ib2xzXHJcbiAqICBjdXJyZW5jeUlucHV0OiB7XHJcbiAqICAgICBjdXJyZW5jeTogXCIkLMKjLMKiXCJcclxuICogIH1cclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJjdXJyZW5jeVwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG4gICAgdmFyIGlzUGFyYW1TdHJpbmcgPSB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIsXHJcbiAgICAgICAgc3ltYm9sID0gaXNQYXJhbVN0cmluZyA/IHBhcmFtIDogcGFyYW1bIDAgXSxcclxuICAgICAgICBzb2Z0ID0gaXNQYXJhbVN0cmluZyA/IHRydWUgOiBwYXJhbVsgMSBdLFxyXG4gICAgICAgIHJlZ2V4O1xyXG5cclxuICAgIHN5bWJvbCA9IHN5bWJvbC5yZXBsYWNlKCAvLC9nLCBcIlwiICk7XHJcbiAgICBzeW1ib2wgPSBzb2Z0ID8gc3ltYm9sICsgXCJdXCIgOiBzeW1ib2wgKyBcIl0/XCI7XHJcbiAgICByZWdleCA9IFwiXltcIiArIHN5bWJvbCArIFwiKFsxLTldezF9WzAtOV17MCwyfShcXFxcLFswLTldezN9KSooXFxcXC5bMC05XXswLDJ9KT98WzEtOV17MX1bMC05XXswLH0oXFxcXC5bMC05XXswLDJ9KT98MChcXFxcLlswLTldezAsMn0pP3woXFxcXC5bMC05XXsxLDJ9KT8pJFwiO1xyXG4gICAgcmVnZXggPSBuZXcgUmVnRXhwKCByZWdleCApO1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCByZWdleC50ZXN0KCB2YWx1ZSApO1xyXG5cclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIGN1cnJlbmN5XCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJkYXRlRkFcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bMS00XVxcZHszfVxcLygoMD9bMS02XVxcLygoM1swLTFdKXwoWzEtMl1bMC05XSl8KDA/WzEtOV0pKSl8KCgxWzAtMl18KDA/WzctOV0pKVxcLygzMHwoWzEtMl1bMC05XSl8KDA/WzEtOV0pKSkpJC8udGVzdCggdmFsdWUgKTtcclxufSwgJC52YWxpZGF0b3IubWVzc2FnZXMuZGF0ZSApO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlLCBpZiB0aGUgdmFsdWUgaXMgYSB2YWxpZCBkYXRlLCBhbHNvIG1ha2luZyB0aGlzIGZvcm1hbCBjaGVjayBkZC9tbS95eXl5LlxyXG4gKlxyXG4gKiBAZXhhbXBsZSAkLnZhbGlkYXRvci5tZXRob2RzLmRhdGUoXCIwMS8wMS8xOTAwXCIpXHJcbiAqIEByZXN1bHQgdHJ1ZVxyXG4gKlxyXG4gKiBAZXhhbXBsZSAkLnZhbGlkYXRvci5tZXRob2RzLmRhdGUoXCIwMS8xMy8xOTkwXCIpXHJcbiAqIEByZXN1bHQgZmFsc2VcclxuICpcclxuICogQGV4YW1wbGUgJC52YWxpZGF0b3IubWV0aG9kcy5kYXRlKFwiMDEuMDEuMTkwMFwiKVxyXG4gKiBAcmVzdWx0IGZhbHNlXHJcbiAqXHJcbiAqIEBleGFtcGxlIDxpbnB1dCBuYW1lPVwicGlwcG9cIiBjbGFzcz1cIntkYXRlSVRBOnRydWV9XCIgLz5cclxuICogQGRlc2MgRGVjbGFyZXMgYW4gb3B0aW9uYWwgaW5wdXQgZWxlbWVudCB3aG9zZSB2YWx1ZSBtdXN0IGJlIGEgdmFsaWQgZGF0ZS5cclxuICpcclxuICogQG5hbWUgJC52YWxpZGF0b3IubWV0aG9kcy5kYXRlSVRBXHJcbiAqIEB0eXBlIEJvb2xlYW5cclxuICogQGNhdCBQbHVnaW5zL1ZhbGlkYXRlL01ldGhvZHNcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJkYXRlSVRBXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHR2YXIgY2hlY2sgPSBmYWxzZSxcclxuXHRcdHJlID0gL15cXGR7MSwyfVxcL1xcZHsxLDJ9XFwvXFxkezR9JC8sXHJcblx0XHRhZGF0YSwgZ2csIG1tLCBhYWFhLCB4ZGF0YTtcclxuXHRpZiAoIHJlLnRlc3QoIHZhbHVlICkgKSB7XHJcblx0XHRhZGF0YSA9IHZhbHVlLnNwbGl0KCBcIi9cIiApO1xyXG5cdFx0Z2cgPSBwYXJzZUludCggYWRhdGFbIDAgXSwgMTAgKTtcclxuXHRcdG1tID0gcGFyc2VJbnQoIGFkYXRhWyAxIF0sIDEwICk7XHJcblx0XHRhYWFhID0gcGFyc2VJbnQoIGFkYXRhWyAyIF0sIDEwICk7XHJcblx0XHR4ZGF0YSA9IG5ldyBEYXRlKCBEYXRlLlVUQyggYWFhYSwgbW0gLSAxLCBnZywgMTIsIDAsIDAsIDAgKSApO1xyXG5cdFx0aWYgKCAoIHhkYXRhLmdldFVUQ0Z1bGxZZWFyKCkgPT09IGFhYWEgKSAmJiAoIHhkYXRhLmdldFVUQ01vbnRoKCkgPT09IG1tIC0gMSApICYmICggeGRhdGEuZ2V0VVRDRGF0ZSgpID09PSBnZyApICkge1xyXG5cdFx0XHRjaGVjayA9IHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjaGVjayA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGVjayA9IGZhbHNlO1xyXG5cdH1cclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IGNoZWNrO1xyXG59LCAkLnZhbGlkYXRvci5tZXNzYWdlcy5kYXRlICk7XHJcblxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiZGF0ZU5MXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKDA/WzEtOV18WzEyXVxcZHwzWzAxXSlbXFwuXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwuXFwvXFwtXShbMTJdXFxkKT8oXFxkXFxkKSQvLnRlc3QoIHZhbHVlICk7XHJcbn0sICQudmFsaWRhdG9yLm1lc3NhZ2VzLmRhdGUgKTtcclxuXHJcbi8vIE9sZGVyIFwiYWNjZXB0XCIgZmlsZSBleHRlbnNpb24gbWV0aG9kLiBPbGQgZG9jczogaHR0cDovL2RvY3MuanF1ZXJ5LmNvbS9QbHVnaW5zL1ZhbGlkYXRpb24vTWV0aG9kcy9hY2NlcHRcclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImV4dGVuc2lvblwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdHBhcmFtID0gdHlwZW9mIHBhcmFtID09PSBcInN0cmluZ1wiID8gcGFyYW0ucmVwbGFjZSggLywvZywgXCJ8XCIgKSA6IFwicG5nfGpwZT9nfGdpZlwiO1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUubWF0Y2goIG5ldyBSZWdFeHAoIFwiXFxcXC4oXCIgKyBwYXJhbSArIFwiKSRcIiwgXCJpXCIgKSApO1xyXG59LCAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGEgdmFsdWUgd2l0aCBhIHZhbGlkIGV4dGVuc2lvbi5cIiApICk7XHJcblxyXG4vKipcclxuICogRHV0Y2ggZ2lybyBhY2NvdW50IG51bWJlcnMgKG5vdCBiYW5rIG51bWJlcnMpIGhhdmUgbWF4IDcgZGlnaXRzXHJcbiAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiZ2lyb2FjY291bnROTFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlswLTldezEsN30kLy50ZXN0KCB2YWx1ZSApO1xyXG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgZ2lybyBhY2NvdW50IG51bWJlclwiICk7XHJcblxyXG4vKipcclxuICogSUJBTiBpcyB0aGUgaW50ZXJuYXRpb25hbCBiYW5rIGFjY291bnQgbnVtYmVyLlxyXG4gKiBJdCBoYXMgYSBjb3VudHJ5IC0gc3BlY2lmaWMgZm9ybWF0LCB0aGF0IGlzIGNoZWNrZWQgaGVyZSB0b29cclxuICpcclxuICogVmFsaWRhdGlvbiBpcyBjYXNlLWluc2Vuc2l0aXZlLiBQbGVhc2UgbWFrZSBzdXJlIHRvIG5vcm1hbGl6ZSBpbnB1dCB5b3Vyc2VsZi5cclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJpYmFuXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHJcblx0Ly8gU29tZSBxdWljayBzaW1wbGUgdGVzdHMgdG8gcHJldmVudCBuZWVkbGVzcyB3b3JrXHJcblx0aWYgKCB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8vIFJlbW92ZSBzcGFjZXMgYW5kIHRvIHVwcGVyIGNhc2VcclxuXHR2YXIgaWJhbiA9IHZhbHVlLnJlcGxhY2UoIC8gL2csIFwiXCIgKS50b1VwcGVyQ2FzZSgpLFxyXG5cdFx0aWJhbmNoZWNrZGlnaXRzID0gXCJcIixcclxuXHRcdGxlYWRpbmdaZXJvZXMgPSB0cnVlLFxyXG5cdFx0Y1Jlc3QgPSBcIlwiLFxyXG5cdFx0Y09wZXJhdG9yID0gXCJcIixcclxuXHRcdGNvdW50cnljb2RlLCBpYmFuY2hlY2ssIGNoYXJBdCwgY0NoYXIsIGJiYW5wYXR0ZXJuLCBiYmFuY291bnRyeXBhdHRlcm5zLCBpYmFucmVnZXhwLCBpLCBwO1xyXG5cclxuXHQvLyBDaGVjayBmb3IgSUJBTiBjb2RlIGxlbmd0aC5cclxuXHQvLyBJdCBjb250YWluczpcclxuXHQvLyBjb3VudHJ5IGNvZGUgSVNPIDMxNjYtMSAtIHR3byBsZXR0ZXJzLFxyXG5cdC8vIHR3byBjaGVjayBkaWdpdHMsXHJcblx0Ly8gQmFzaWMgQmFuayBBY2NvdW50IE51bWJlciAoQkJBTikgLSB1cCB0byAzMCBjaGFyc1xyXG5cdHZhciBtaW5pbWFsSUJBTmxlbmd0aCA9IDU7XHJcblx0aWYgKCBpYmFuLmxlbmd0aCA8IG1pbmltYWxJQkFObGVuZ3RoICkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0Ly8gQ2hlY2sgdGhlIGNvdW50cnkgY29kZSBhbmQgZmluZCB0aGUgY291bnRyeSBzcGVjaWZpYyBmb3JtYXRcclxuXHRjb3VudHJ5Y29kZSA9IGliYW4uc3Vic3RyaW5nKCAwLCAyICk7XHJcblx0YmJhbmNvdW50cnlwYXR0ZXJucyA9IHtcclxuXHRcdFwiQUxcIjogXCJcXFxcZHs4fVtcXFxcZEEtWl17MTZ9XCIsXHJcblx0XHRcIkFEXCI6IFwiXFxcXGR7OH1bXFxcXGRBLVpdezEyfVwiLFxyXG5cdFx0XCJBVFwiOiBcIlxcXFxkezE2fVwiLFxyXG5cdFx0XCJBWlwiOiBcIltcXFxcZEEtWl17NH1cXFxcZHsyMH1cIixcclxuXHRcdFwiQkVcIjogXCJcXFxcZHsxMn1cIixcclxuXHRcdFwiQkhcIjogXCJbQS1aXXs0fVtcXFxcZEEtWl17MTR9XCIsXHJcblx0XHRcIkJBXCI6IFwiXFxcXGR7MTZ9XCIsXHJcblx0XHRcIkJSXCI6IFwiXFxcXGR7MjN9W0EtWl1bXFxcXGRBLVpdXCIsXHJcblx0XHRcIkJHXCI6IFwiW0EtWl17NH1cXFxcZHs2fVtcXFxcZEEtWl17OH1cIixcclxuXHRcdFwiQ1JcIjogXCJcXFxcZHsxN31cIixcclxuXHRcdFwiSFJcIjogXCJcXFxcZHsxN31cIixcclxuXHRcdFwiQ1lcIjogXCJcXFxcZHs4fVtcXFxcZEEtWl17MTZ9XCIsXHJcblx0XHRcIkNaXCI6IFwiXFxcXGR7MjB9XCIsXHJcblx0XHRcIkRLXCI6IFwiXFxcXGR7MTR9XCIsXHJcblx0XHRcIkRPXCI6IFwiW0EtWl17NH1cXFxcZHsyMH1cIixcclxuXHRcdFwiRUVcIjogXCJcXFxcZHsxNn1cIixcclxuXHRcdFwiRk9cIjogXCJcXFxcZHsxNH1cIixcclxuXHRcdFwiRklcIjogXCJcXFxcZHsxNH1cIixcclxuXHRcdFwiRlJcIjogXCJcXFxcZHsxMH1bXFxcXGRBLVpdezExfVxcXFxkezJ9XCIsXHJcblx0XHRcIkdFXCI6IFwiW1xcXFxkQS1aXXsyfVxcXFxkezE2fVwiLFxyXG5cdFx0XCJERVwiOiBcIlxcXFxkezE4fVwiLFxyXG5cdFx0XCJHSVwiOiBcIltBLVpdezR9W1xcXFxkQS1aXXsxNX1cIixcclxuXHRcdFwiR1JcIjogXCJcXFxcZHs3fVtcXFxcZEEtWl17MTZ9XCIsXHJcblx0XHRcIkdMXCI6IFwiXFxcXGR7MTR9XCIsXHJcblx0XHRcIkdUXCI6IFwiW1xcXFxkQS1aXXs0fVtcXFxcZEEtWl17MjB9XCIsXHJcblx0XHRcIkhVXCI6IFwiXFxcXGR7MjR9XCIsXHJcblx0XHRcIklTXCI6IFwiXFxcXGR7MjJ9XCIsXHJcblx0XHRcIklFXCI6IFwiW1xcXFxkQS1aXXs0fVxcXFxkezE0fVwiLFxyXG5cdFx0XCJJTFwiOiBcIlxcXFxkezE5fVwiLFxyXG5cdFx0XCJJVFwiOiBcIltBLVpdXFxcXGR7MTB9W1xcXFxkQS1aXXsxMn1cIixcclxuXHRcdFwiS1pcIjogXCJcXFxcZHszfVtcXFxcZEEtWl17MTN9XCIsXHJcblx0XHRcIktXXCI6IFwiW0EtWl17NH1bXFxcXGRBLVpdezIyfVwiLFxyXG5cdFx0XCJMVlwiOiBcIltBLVpdezR9W1xcXFxkQS1aXXsxM31cIixcclxuXHRcdFwiTEJcIjogXCJcXFxcZHs0fVtcXFxcZEEtWl17MjB9XCIsXHJcblx0XHRcIkxJXCI6IFwiXFxcXGR7NX1bXFxcXGRBLVpdezEyfVwiLFxyXG5cdFx0XCJMVFwiOiBcIlxcXFxkezE2fVwiLFxyXG5cdFx0XCJMVVwiOiBcIlxcXFxkezN9W1xcXFxkQS1aXXsxM31cIixcclxuXHRcdFwiTUtcIjogXCJcXFxcZHszfVtcXFxcZEEtWl17MTB9XFxcXGR7Mn1cIixcclxuXHRcdFwiTVRcIjogXCJbQS1aXXs0fVxcXFxkezV9W1xcXFxkQS1aXXsxOH1cIixcclxuXHRcdFwiTVJcIjogXCJcXFxcZHsyM31cIixcclxuXHRcdFwiTVVcIjogXCJbQS1aXXs0fVxcXFxkezE5fVtBLVpdezN9XCIsXHJcblx0XHRcIk1DXCI6IFwiXFxcXGR7MTB9W1xcXFxkQS1aXXsxMX1cXFxcZHsyfVwiLFxyXG5cdFx0XCJNRFwiOiBcIltcXFxcZEEtWl17Mn1cXFxcZHsxOH1cIixcclxuXHRcdFwiTUVcIjogXCJcXFxcZHsxOH1cIixcclxuXHRcdFwiTkxcIjogXCJbQS1aXXs0fVxcXFxkezEwfVwiLFxyXG5cdFx0XCJOT1wiOiBcIlxcXFxkezExfVwiLFxyXG5cdFx0XCJQS1wiOiBcIltcXFxcZEEtWl17NH1cXFxcZHsxNn1cIixcclxuXHRcdFwiUFNcIjogXCJbXFxcXGRBLVpdezR9XFxcXGR7MjF9XCIsXHJcblx0XHRcIlBMXCI6IFwiXFxcXGR7MjR9XCIsXHJcblx0XHRcIlBUXCI6IFwiXFxcXGR7MjF9XCIsXHJcblx0XHRcIlJPXCI6IFwiW0EtWl17NH1bXFxcXGRBLVpdezE2fVwiLFxyXG5cdFx0XCJTTVwiOiBcIltBLVpdXFxcXGR7MTB9W1xcXFxkQS1aXXsxMn1cIixcclxuXHRcdFwiU0FcIjogXCJcXFxcZHsyfVtcXFxcZEEtWl17MTh9XCIsXHJcblx0XHRcIlJTXCI6IFwiXFxcXGR7MTh9XCIsXHJcblx0XHRcIlNLXCI6IFwiXFxcXGR7MjB9XCIsXHJcblx0XHRcIlNJXCI6IFwiXFxcXGR7MTV9XCIsXHJcblx0XHRcIkVTXCI6IFwiXFxcXGR7MjB9XCIsXHJcblx0XHRcIlNFXCI6IFwiXFxcXGR7MjB9XCIsXHJcblx0XHRcIkNIXCI6IFwiXFxcXGR7NX1bXFxcXGRBLVpdezEyfVwiLFxyXG5cdFx0XCJUTlwiOiBcIlxcXFxkezIwfVwiLFxyXG5cdFx0XCJUUlwiOiBcIlxcXFxkezV9W1xcXFxkQS1aXXsxN31cIixcclxuXHRcdFwiQUVcIjogXCJcXFxcZHszfVxcXFxkezE2fVwiLFxyXG5cdFx0XCJHQlwiOiBcIltBLVpdezR9XFxcXGR7MTR9XCIsXHJcblx0XHRcIlZHXCI6IFwiW1xcXFxkQS1aXXs0fVxcXFxkezE2fVwiXHJcblx0fTtcclxuXHJcblx0YmJhbnBhdHRlcm4gPSBiYmFuY291bnRyeXBhdHRlcm5zWyBjb3VudHJ5Y29kZSBdO1xyXG5cclxuXHQvLyBBcyBuZXcgY291bnRyaWVzIHdpbGwgc3RhcnQgdXNpbmcgSUJBTiBpbiB0aGVcclxuXHQvLyBmdXR1cmUsIHdlIG9ubHkgY2hlY2sgaWYgdGhlIGNvdW50cnljb2RlIGlzIGtub3duLlxyXG5cdC8vIFRoaXMgcHJldmVudHMgZmFsc2UgbmVnYXRpdmVzLCB3aGlsZSBhbG1vc3QgYWxsXHJcblx0Ly8gZmFsc2UgcG9zaXRpdmVzIGludHJvZHVjZWQgYnkgdGhpcywgd2lsbCBiZSBjYXVnaHRcclxuXHQvLyBieSB0aGUgY2hlY2tzdW0gdmFsaWRhdGlvbiBiZWxvdyBhbnl3YXkuXHJcblx0Ly8gU3RyaWN0IGNoZWNraW5nIHNob3VsZCByZXR1cm4gRkFMU0UgZm9yIHVua25vd25cclxuXHQvLyBjb3VudHJpZXMuXHJcblx0aWYgKCB0eXBlb2YgYmJhbnBhdHRlcm4gIT09IFwidW5kZWZpbmVkXCIgKSB7XHJcblx0XHRpYmFucmVnZXhwID0gbmV3IFJlZ0V4cCggXCJeW0EtWl17Mn1cXFxcZHsyfVwiICsgYmJhbnBhdHRlcm4gKyBcIiRcIiwgXCJcIiApO1xyXG5cdFx0aWYgKCAhKCBpYmFucmVnZXhwLnRlc3QoIGliYW4gKSApICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7IC8vIEludmFsaWQgY291bnRyeSBzcGVjaWZpYyBmb3JtYXRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIE5vdyBjaGVjayB0aGUgY2hlY2tzdW0sIGZpcnN0IGNvbnZlcnQgdG8gZGlnaXRzXHJcblx0aWJhbmNoZWNrID0gaWJhbi5zdWJzdHJpbmcoIDQsIGliYW4ubGVuZ3RoICkgKyBpYmFuLnN1YnN0cmluZyggMCwgNCApO1xyXG5cdGZvciAoIGkgPSAwOyBpIDwgaWJhbmNoZWNrLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0Y2hhckF0ID0gaWJhbmNoZWNrLmNoYXJBdCggaSApO1xyXG5cdFx0aWYgKCBjaGFyQXQgIT09IFwiMFwiICkge1xyXG5cdFx0XHRsZWFkaW5nWmVyb2VzID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoICFsZWFkaW5nWmVyb2VzICkge1xyXG5cdFx0XHRpYmFuY2hlY2tkaWdpdHMgKz0gXCIwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIi5pbmRleE9mKCBjaGFyQXQgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIENhbGN1bGF0ZSB0aGUgcmVzdWx0IG9mOiBpYmFuY2hlY2tkaWdpdHMgJSA5N1xyXG5cdGZvciAoIHAgPSAwOyBwIDwgaWJhbmNoZWNrZGlnaXRzLmxlbmd0aDsgcCsrICkge1xyXG5cdFx0Y0NoYXIgPSBpYmFuY2hlY2tkaWdpdHMuY2hhckF0KCBwICk7XHJcblx0XHRjT3BlcmF0b3IgPSBcIlwiICsgY1Jlc3QgKyBcIlwiICsgY0NoYXI7XHJcblx0XHRjUmVzdCA9IGNPcGVyYXRvciAlIDk3O1xyXG5cdH1cclxuXHRyZXR1cm4gY1Jlc3QgPT09IDE7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBJQkFOXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJpbnRlZ2VyXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eLT9cXGQrJC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJBIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIG5vbi1kZWNpbWFsIG51bWJlciBwbGVhc2VcIiApO1xyXG5cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImlwdjRcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oMjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KVxcLigyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKDI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPylcXC4oMjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KSQvaS50ZXN0KCB2YWx1ZSApO1xyXG59LCBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIElQIHY0IGFkZHJlc3MuXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJpcHY2XCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKCgoWzAtOUEtRmEtZl17MSw0fTopezd9WzAtOUEtRmEtZl17MSw0fSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Nn06WzAtOUEtRmEtZl17MSw0fSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NX06KFswLTlBLUZhLWZdezEsNH06KT9bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXs0fTooWzAtOUEtRmEtZl17MSw0fTopezAsMn1bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXszfTooWzAtOUEtRmEtZl17MSw0fTopezAsM31bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXsyfTooWzAtOUEtRmEtZl17MSw0fTopezAsNH1bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXs2fSgoXFxiKCgyNVswLTVdKXwoMVxcZHsyfSl8KDJbMC00XVxcZCl8KFxcZHsxLDJ9KSlcXGIpXFwuKXszfShcXGIoKDI1WzAtNV0pfCgxXFxkezJ9KXwoMlswLTRdXFxkKXwoXFxkezEsMn0pKVxcYikpfCgoWzAtOUEtRmEtZl17MSw0fTopezAsNX06KChcXGIoKDI1WzAtNV0pfCgxXFxkezJ9KXwoMlswLTRdXFxkKXwoXFxkezEsMn0pKVxcYilcXC4pezN9KFxcYigoMjVbMC01XSl8KDFcXGR7Mn0pfCgyWzAtNF1cXGQpfChcXGR7MSwyfSkpXFxiKSl8KDo6KFswLTlBLUZhLWZdezEsNH06KXswLDV9KChcXGIoKDI1WzAtNV0pfCgxXFxkezJ9KXwoMlswLTRdXFxkKXwoXFxkezEsMn0pKVxcYilcXC4pezN9KFxcYigoMjVbMC01XSl8KDFcXGR7Mn0pfCgyWzAtNF1cXGQpfChcXGR7MSwyfSkpXFxiKSl8KFswLTlBLUZhLWZdezEsNH06OihbMC05QS1GYS1mXXsxLDR9Oil7MCw1fVswLTlBLUZhLWZdezEsNH0pfCg6OihbMC05QS1GYS1mXXsxLDR9Oil7MCw2fVswLTlBLUZhLWZdezEsNH0pfCgoWzAtOUEtRmEtZl17MSw0fTopezEsN306KSkkL2kudGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBJUCB2NiBhZGRyZXNzLlwiICk7XHJcblxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibGV0dGVyc29ubHlcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bYS16XSskL2kudGVzdCggdmFsdWUgKTtcclxufSwgXCJMZXR0ZXJzIG9ubHkgcGxlYXNlXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJsZXR0ZXJzd2l0aGJhc2ljcHVuY1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlthLXpcXC0uLCgpJ1wiXFxzXSskL2kudGVzdCggdmFsdWUgKTtcclxufSwgXCJMZXR0ZXJzIG9yIHB1bmN0dWF0aW9uIG9ubHkgcGxlYXNlXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJtb2JpbGVOTFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigoXFwrfDAwKFxcc3xcXHM/XFwtXFxzPyk/KTMxKFxcc3xcXHM/XFwtXFxzPyk/KFxcKDBcXClbXFwtXFxzXT8pP3wwKTYoKFxcc3xcXHM/XFwtXFxzPyk/WzAtOV0pezh9JC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIG1vYmlsZSBudW1iZXJcIiApO1xyXG5cclxuLyogRm9yIFVLIHBob25lIGZ1bmN0aW9ucywgZG8gdGhlIGZvbGxvd2luZyBzZXJ2ZXIgc2lkZSBwcm9jZXNzaW5nOlxyXG4gKiBDb21wYXJlIG9yaWdpbmFsIGlucHV0IHdpdGggdGhpcyBSZWdFeCBwYXR0ZXJuOlxyXG4gKiBeXFwoPyg/Oig/OjAwXFwpP1tcXHNcXC1dP1xcKD98XFwrKSg0NClcXCk/W1xcc1xcLV0/XFwoPyg/OjBcXCk/W1xcc1xcLV0/XFwoPyk/fDApKFsxLTldXFxkezEsNH1cXCk/W1xcc1xcZFxcLV0rKSRcclxuICogRXh0cmFjdCAkMSBhbmQgc2V0ICRwcmVmaXggdG8gJys0NDxzcGFjZT4nIGlmICQxIGlzICc0NCcsIG90aGVyd2lzZSBzZXQgJHByZWZpeCB0byAnMCdcclxuICogRXh0cmFjdCAkMiBhbmQgcmVtb3ZlIGh5cGhlbnMsIHNwYWNlcyBhbmQgcGFyZW50aGVzZXMuIFBob25lIG51bWJlciBpcyBjb21iaW5lZCAkcHJlZml4IGFuZCAkMi5cclxuICogQSBudW1iZXIgb2YgdmVyeSBkZXRhaWxlZCBHQiB0ZWxlcGhvbmUgbnVtYmVyIFJlZ0V4IHBhdHRlcm5zIGNhbiBhbHNvIGJlIGZvdW5kIGF0OlxyXG4gKiBodHRwOi8vd3d3LmFhLWFzdGVyaXNrLm9yZy51ay9pbmRleC5waHAvUmVndWxhcl9FeHByZXNzaW9uc19mb3JfVmFsaWRhdGluZ19hbmRfRm9ybWF0dGluZ19HQl9UZWxlcGhvbmVfTnVtYmVyc1xyXG4gKi9cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcIm1vYmlsZVVLXCIsIGZ1bmN0aW9uKCBwaG9uZV9udW1iZXIsIGVsZW1lbnQgKSB7XHJcblx0cGhvbmVfbnVtYmVyID0gcGhvbmVfbnVtYmVyLnJlcGxhY2UoIC9cXCh8XFwpfFxccyt8LS9nLCBcIlwiICk7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBwaG9uZV9udW1iZXIubGVuZ3RoID4gOSAmJlxyXG5cdFx0cGhvbmVfbnVtYmVyLm1hdGNoKCAvXig/Oig/Oig/OjAwXFxzP3xcXCspNDRcXHM/fDApNyg/OlsxMzQ1Nzg5XVxcZHsyfXw2MjQpXFxzP1xcZHszfVxccz9cXGR7M30pJC8gKTtcclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIG1vYmlsZSBudW1iZXJcIiApO1xyXG5cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcIm5ldG1hc2tcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigyNTR8MjUyfDI0OHwyNDB8MjI0fDE5MnwxMjgpXFwuMFxcLjBcXC4wfDI1NVxcLigyNTR8MjUyfDI0OHwyNDB8MjI0fDE5MnwxMjh8MClcXC4wXFwuMHwyNTVcXC4yNTVcXC4oMjU0fDI1MnwyNDh8MjQwfDIyNHwxOTJ8MTI4fDApXFwuMHwyNTVcXC4yNTVcXC4yNTVcXC4oMjU0fDI1MnwyNDh8MjQwfDIyNHwxOTJ8MTI4fDApL2kudGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBuZXRtYXNrLlwiICk7XHJcblxyXG4vKlxyXG4gKiBUaGUgTklFIChOw7ptZXJvIGRlIElkZW50aWZpY2FjacOzbiBkZSBFeHRyYW5qZXJvKSBpcyBhIFNwYW5pc2ggdGF4IGlkZW50aWZpY2F0aW9uIG51bWJlciBhc3NpZ25lZCBieSB0aGUgU3BhbmlzaFxyXG4gKiBhdXRob3JpdGllcyB0byBhbnkgZm9yZWlnbmVyLlxyXG4gKlxyXG4gKiBUaGUgTklFIGlzIHRoZSBlcXVpdmFsZW50IG9mIGEgU3BhbmlhcmRzIE7Dum1lcm8gZGUgSWRlbnRpZmljYWNpw7NuIEZpc2NhbCAoTklGKSB3aGljaCBzZXJ2ZXMgYXMgYSBmaXNjYWxcclxuICogaWRlbnRpZmljYXRpb24gbnVtYmVyLiBUaGUgQ0lGIG51bWJlciAoQ2VydGlmaWNhZG8gZGUgSWRlbnRpZmljYWNpw7NuIEZpc2NhbCkgaXMgZXF1aXZhbGVudCB0byB0aGUgTklGLCBidXQgYXBwbGllcyB0b1xyXG4gKiBjb21wYW5pZXMgcmF0aGVyIHRoYW4gaW5kaXZpZHVhbHMuIFRoZSBOSUUgY29uc2lzdHMgb2YgYW4gJ1gnIG9yICdZJyBmb2xsb3dlZCBieSA3IG9yIDggZGlnaXRzIHRoZW4gYW5vdGhlciBsZXR0ZXIuXHJcbiAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibmllRVNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHRpZiAoIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0dmFyIG5pZVJlZ0V4ID0gbmV3IFJlZ0V4cCggL15bTVhZWl17MX1bMC05XXs3LDh9W1RSV0FHTVlGUERYQk5KWlNRVkhMQ0tFVF17MX0kL2dpICk7XHJcblx0dmFyIHZhbGlkQ2hhcnMgPSBcIlRSV0FHTVlGUERYQk5KWlNRVkhMQ0tFVFwiLFxyXG5cdFx0bGV0dGVyID0gdmFsdWUuc3Vic3RyKCB2YWx1ZS5sZW5ndGggLSAxICkudG9VcHBlckNhc2UoKSxcclxuXHRcdG51bWJlcjtcclxuXHJcblx0dmFsdWUgPSB2YWx1ZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdC8vIFF1aWNrIGZvcm1hdCB0ZXN0XHJcblx0aWYgKCB2YWx1ZS5sZW5ndGggPiAxMCB8fCB2YWx1ZS5sZW5ndGggPCA5IHx8ICFuaWVSZWdFeC50ZXN0KCB2YWx1ZSApICkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0Ly8gWCBtZWFucyBzYW1lIG51bWJlclxyXG5cdC8vIFkgbWVhbnMgbnVtYmVyICsgMTAwMDAwMDBcclxuXHQvLyBaIG1lYW5zIG51bWJlciArIDIwMDAwMDAwXHJcblx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCAvXltYXS8sIFwiMFwiIClcclxuXHRcdC5yZXBsYWNlKCAvXltZXS8sIFwiMVwiIClcclxuXHRcdC5yZXBsYWNlKCAvXltaXS8sIFwiMlwiICk7XHJcblxyXG5cdG51bWJlciA9IHZhbHVlLmxlbmd0aCA9PT0gOSA/IHZhbHVlLnN1YnN0ciggMCwgOCApIDogdmFsdWUuc3Vic3RyKCAwLCA5ICk7XHJcblxyXG5cdHJldHVybiB2YWxpZENoYXJzLmNoYXJBdCggcGFyc2VJbnQoIG51bWJlciwgMTAgKSAlIDIzICkgPT09IGxldHRlcjtcclxuXHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBOSUUgbnVtYmVyLlwiICk7XHJcblxyXG4vKlxyXG4gKiBUaGUgTsO6bWVybyBkZSBJZGVudGlmaWNhY2nDs24gRmlzY2FsICggTklGICkgaXMgdGhlIHdheSB0YXggaWRlbnRpZmljYXRpb24gdXNlZCBpbiBTcGFpbiBmb3IgaW5kaXZpZHVhbHNcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJuaWZFU1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHR2YWx1ZSA9IHZhbHVlLnRvVXBwZXJDYXNlKCk7XHJcblxyXG5cdC8vIEJhc2ljIGZvcm1hdCB0ZXN0XHJcblx0aWYgKCAhdmFsdWUubWF0Y2goIFwiKCheW0EtWl17MX1bMC05XXs3fVtBLVowLTldezF9JHxeW1RdezF9W0EtWjAtOV17OH0kKXxeWzAtOV17OH1bQS1aXXsxfSQpXCIgKSApIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8vIFRlc3QgTklGXHJcblx0aWYgKCAvXlswLTldezh9W0EtWl17MX0kLy50ZXN0KCB2YWx1ZSApICkge1xyXG5cdFx0cmV0dXJuICggXCJUUldBR01ZRlBEWEJOSlpTUVZITENLRVwiLmNoYXJBdCggdmFsdWUuc3Vic3RyaW5nKCA4LCAwICkgJSAyMyApID09PSB2YWx1ZS5jaGFyQXQoIDggKSApO1xyXG5cdH1cclxuXHJcblx0Ly8gVGVzdCBzcGVjaWFscyBOSUYgKHN0YXJ0cyB3aXRoIEssIEwgb3IgTSlcclxuXHRpZiAoIC9eW0tMTV17MX0vLnRlc3QoIHZhbHVlICkgKSB7XHJcblx0XHRyZXR1cm4gKCB2YWx1ZVsgOCBdID09PSBcIlRSV0FHTVlGUERYQk5KWlNRVkhMQ0tFXCIuY2hhckF0KCB2YWx1ZS5zdWJzdHJpbmcoIDgsIDEgKSAlIDIzICkgKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBmYWxzZTtcclxuXHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBOSUYgbnVtYmVyLlwiICk7XHJcblxyXG4vKlxyXG4gKiBOdW1lciBpZGVudHlmaWthY2ppIHBvZGF0a293ZWogKCBOSVAgKSBpcyB0aGUgd2F5IHRheCBpZGVudGlmaWNhdGlvbiB1c2VkIGluIFBvbGFuZCBmb3IgY29tcGFuaWVzXHJcbiAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibmlwUExcIiwgZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoIC9bXjAtOV0vZywgXCJcIiApO1xyXG5cclxuXHRpZiAoIHZhbHVlLmxlbmd0aCAhPT0gMTAgKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHR2YXIgYXJyU3RlcHMgPSBbIDYsIDUsIDcsIDIsIDMsIDQsIDUsIDYsIDcgXTtcclxuXHR2YXIgaW50U3VtID0gMDtcclxuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCA5OyBpKysgKSB7XHJcblx0XHRpbnRTdW0gKz0gYXJyU3RlcHNbIGkgXSAqIHZhbHVlWyBpIF07XHJcblx0fVxyXG5cdHZhciBpbnQyID0gaW50U3VtICUgMTE7XHJcblx0dmFyIGludENvbnRyb2xOciA9ICggaW50MiA9PT0gMTAgKSA/IDAgOiBpbnQyO1xyXG5cclxuXHRyZXR1cm4gKCBpbnRDb250cm9sTnIgPT09IHBhcnNlSW50KCB2YWx1ZVsgOSBdLCAxMCApICk7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBOSVAgbnVtYmVyLlwiICk7XHJcblxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibm90RXF1YWxUb1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgISQudmFsaWRhdG9yLm1ldGhvZHMuZXF1YWxUby5jYWxsKCB0aGlzLCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKTtcclxufSwgXCJQbGVhc2UgZW50ZXIgYSBkaWZmZXJlbnQgdmFsdWUsIHZhbHVlcyBtdXN0IG5vdCBiZSB0aGUgc2FtZS5cIiApO1xyXG5cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcIm5vd2hpdGVzcGFjZVwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlxcUyskL2kudGVzdCggdmFsdWUgKTtcclxufSwgXCJObyB3aGl0ZSBzcGFjZSBwbGVhc2VcIiApO1xyXG5cclxuLyoqXHJcbiogUmV0dXJuIHRydWUgaWYgdGhlIGZpZWxkIHZhbHVlIG1hdGNoZXMgdGhlIGdpdmVuIGZvcm1hdCBSZWdFeHBcclxuKlxyXG4qIEBleGFtcGxlICQudmFsaWRhdG9yLm1ldGhvZHMucGF0dGVybihcIkFSMTAwNFwiLGVsZW1lbnQsL15BUlxcZHs0fSQvKVxyXG4qIEByZXN1bHQgdHJ1ZVxyXG4qXHJcbiogQGV4YW1wbGUgJC52YWxpZGF0b3IubWV0aG9kcy5wYXR0ZXJuKFwiQlIxMDA0XCIsZWxlbWVudCwvXkFSXFxkezR9JC8pXHJcbiogQHJlc3VsdCBmYWxzZVxyXG4qXHJcbiogQG5hbWUgJC52YWxpZGF0b3IubWV0aG9kcy5wYXR0ZXJuXHJcbiogQHR5cGUgQm9vbGVhblxyXG4qIEBjYXQgUGx1Z2lucy9WYWxpZGF0ZS9NZXRob2RzXHJcbiovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwYXR0ZXJuXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XHJcblx0aWYgKCB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0aWYgKCB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRwYXJhbSA9IG5ldyBSZWdFeHAoIFwiXig/OlwiICsgcGFyYW0gKyBcIikkXCIgKTtcclxuXHR9XHJcblx0cmV0dXJuIHBhcmFtLnRlc3QoIHZhbHVlICk7XHJcbn0sIFwiSW52YWxpZCBmb3JtYXQuXCIgKTtcclxuXHJcbi8qKlxyXG4gKiBEdXRjaCBwaG9uZSBudW1iZXJzIGhhdmUgMTAgZGlnaXRzIChvciAxMSBhbmQgc3RhcnQgd2l0aCArMzEpLlxyXG4gKi9cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInBob25lTkxcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oKFxcK3wwMChcXHN8XFxzP1xcLVxccz8pPykzMShcXHN8XFxzP1xcLVxccz8pPyhcXCgwXFwpW1xcLVxcc10/KT98MClbMS05XSgoXFxzfFxccz9cXC1cXHM/KT9bMC05XSl7OH0kLy50ZXN0KCB2YWx1ZSApO1xyXG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcGhvbmUgbnVtYmVyLlwiICk7XHJcblxyXG4vKiBGb3IgVUsgcGhvbmUgZnVuY3Rpb25zLCBkbyB0aGUgZm9sbG93aW5nIHNlcnZlciBzaWRlIHByb2Nlc3Npbmc6XHJcbiAqIENvbXBhcmUgb3JpZ2luYWwgaW5wdXQgd2l0aCB0aGlzIFJlZ0V4IHBhdHRlcm46XHJcbiAqIF5cXCg/KD86KD86MDBcXCk/W1xcc1xcLV0/XFwoP3xcXCspKDQ0KVxcKT9bXFxzXFwtXT9cXCg/KD86MFxcKT9bXFxzXFwtXT9cXCg/KT98MCkoWzEtOV1cXGR7MSw0fVxcKT9bXFxzXFxkXFwtXSspJFxyXG4gKiBFeHRyYWN0ICQxIGFuZCBzZXQgJHByZWZpeCB0byAnKzQ0PHNwYWNlPicgaWYgJDEgaXMgJzQ0Jywgb3RoZXJ3aXNlIHNldCAkcHJlZml4IHRvICcwJ1xyXG4gKiBFeHRyYWN0ICQyIGFuZCByZW1vdmUgaHlwaGVucywgc3BhY2VzIGFuZCBwYXJlbnRoZXNlcy4gUGhvbmUgbnVtYmVyIGlzIGNvbWJpbmVkICRwcmVmaXggYW5kICQyLlxyXG4gKiBBIG51bWJlciBvZiB2ZXJ5IGRldGFpbGVkIEdCIHRlbGVwaG9uZSBudW1iZXIgUmVnRXggcGF0dGVybnMgY2FuIGFsc28gYmUgZm91bmQgYXQ6XHJcbiAqIGh0dHA6Ly93d3cuYWEtYXN0ZXJpc2sub3JnLnVrL2luZGV4LnBocC9SZWd1bGFyX0V4cHJlc3Npb25zX2Zvcl9WYWxpZGF0aW5nX2FuZF9Gb3JtYXR0aW5nX0dCX1RlbGVwaG9uZV9OdW1iZXJzXHJcbiAqL1xyXG5cclxuLy8gTWF0Y2hlcyBVSyBsYW5kbGluZSArIG1vYmlsZSwgYWNjZXB0aW5nIG9ubHkgMDEtMyBmb3IgbGFuZGxpbmUgb3IgMDcgZm9yIG1vYmlsZSB0byBleGNsdWRlIG1hbnkgcHJlbWl1bSBudW1iZXJzXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwaG9uZXNVS1wiLCBmdW5jdGlvbiggcGhvbmVfbnVtYmVyLCBlbGVtZW50ICkge1xyXG5cdHBob25lX251bWJlciA9IHBob25lX251bWJlci5yZXBsYWNlKCAvXFwofFxcKXxcXHMrfC0vZywgXCJcIiApO1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgcGhvbmVfbnVtYmVyLmxlbmd0aCA+IDkgJiZcclxuXHRcdHBob25lX251bWJlci5tYXRjaCggL14oPzooPzooPzowMFxccz98XFwrKTQ0XFxzP3wwKSg/OjFcXGR7OCw5fXxbMjNdXFxkezl9fDcoPzpbMTM0NTc4OV1cXGR7OH18NjI0XFxkezZ9KSkpJC8gKTtcclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHVrIHBob25lIG51bWJlclwiICk7XHJcblxyXG4vKiBGb3IgVUsgcGhvbmUgZnVuY3Rpb25zLCBkbyB0aGUgZm9sbG93aW5nIHNlcnZlciBzaWRlIHByb2Nlc3Npbmc6XHJcbiAqIENvbXBhcmUgb3JpZ2luYWwgaW5wdXQgd2l0aCB0aGlzIFJlZ0V4IHBhdHRlcm46XHJcbiAqIF5cXCg/KD86KD86MDBcXCk/W1xcc1xcLV0/XFwoP3xcXCspKDQ0KVxcKT9bXFxzXFwtXT9cXCg/KD86MFxcKT9bXFxzXFwtXT9cXCg/KT98MCkoWzEtOV1cXGR7MSw0fVxcKT9bXFxzXFxkXFwtXSspJFxyXG4gKiBFeHRyYWN0ICQxIGFuZCBzZXQgJHByZWZpeCB0byAnKzQ0PHNwYWNlPicgaWYgJDEgaXMgJzQ0Jywgb3RoZXJ3aXNlIHNldCAkcHJlZml4IHRvICcwJ1xyXG4gKiBFeHRyYWN0ICQyIGFuZCByZW1vdmUgaHlwaGVucywgc3BhY2VzIGFuZCBwYXJlbnRoZXNlcy4gUGhvbmUgbnVtYmVyIGlzIGNvbWJpbmVkICRwcmVmaXggYW5kICQyLlxyXG4gKiBBIG51bWJlciBvZiB2ZXJ5IGRldGFpbGVkIEdCIHRlbGVwaG9uZSBudW1iZXIgUmVnRXggcGF0dGVybnMgY2FuIGFsc28gYmUgZm91bmQgYXQ6XHJcbiAqIGh0dHA6Ly93d3cuYWEtYXN0ZXJpc2sub3JnLnVrL2luZGV4LnBocC9SZWd1bGFyX0V4cHJlc3Npb25zX2Zvcl9WYWxpZGF0aW5nX2FuZF9Gb3JtYXR0aW5nX0dCX1RlbGVwaG9uZV9OdW1iZXJzXHJcbiAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicGhvbmVVS1wiLCBmdW5jdGlvbiggcGhvbmVfbnVtYmVyLCBlbGVtZW50ICkge1xyXG5cdHBob25lX251bWJlciA9IHBob25lX251bWJlci5yZXBsYWNlKCAvXFwofFxcKXxcXHMrfC0vZywgXCJcIiApO1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgcGhvbmVfbnVtYmVyLmxlbmd0aCA+IDkgJiZcclxuXHRcdHBob25lX251bWJlci5tYXRjaCggL14oPzooPzooPzowMFxccz98XFwrKTQ0XFxzPyl8KD86XFwoPzApKSg/OlxcZHsyfVxcKT9cXHM/XFxkezR9XFxzP1xcZHs0fXxcXGR7M31cXCk/XFxzP1xcZHszfVxccz9cXGR7Myw0fXxcXGR7NH1cXCk/XFxzPyg/OlxcZHs1fXxcXGR7M31cXHM/XFxkezN9KXxcXGR7NX1cXCk/XFxzP1xcZHs0LDV9KSQvICk7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwaG9uZSBudW1iZXJcIiApO1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoZXMgVVMgcGhvbmUgbnVtYmVyIGZvcm1hdFxyXG4gKlxyXG4gKiB3aGVyZSB0aGUgYXJlYSBjb2RlIG1heSBub3Qgc3RhcnQgd2l0aCAxIGFuZCB0aGUgcHJlZml4IG1heSBub3Qgc3RhcnQgd2l0aCAxXHJcbiAqIGFsbG93cyAnLScgb3IgJyAnIGFzIGEgc2VwYXJhdG9yIGFuZCBhbGxvd3MgcGFyZW5zIGFyb3VuZCBhcmVhIGNvZGVcclxuICogc29tZSBwZW9wbGUgbWF5IHdhbnQgdG8gcHV0IGEgJzEnIGluIGZyb250IG9mIHRoZWlyIG51bWJlclxyXG4gKlxyXG4gKiAxKDIxMiktOTk5LTIzNDUgb3JcclxuICogMjEyIDk5OSAyMzQ0IG9yXHJcbiAqIDIxMi05OTktMDk4M1xyXG4gKlxyXG4gKiBidXQgbm90XHJcbiAqIDExMS0xMjMtNTQzNFxyXG4gKiBhbmQgbm90XHJcbiAqIDIxMiAxMjMgNDU2N1xyXG4gKi9cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInBob25lVVNcIiwgZnVuY3Rpb24oIHBob25lX251bWJlciwgZWxlbWVudCApIHtcclxuXHRwaG9uZV9udW1iZXIgPSBwaG9uZV9udW1iZXIucmVwbGFjZSggL1xccysvZywgXCJcIiApO1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgcGhvbmVfbnVtYmVyLmxlbmd0aCA+IDkgJiZcclxuXHRcdHBob25lX251bWJlci5tYXRjaCggL14oXFwrPzEtPyk/KFxcKFsyLTldKFswMi05XVxcZHwxWzAyLTldKVxcKXxbMi05XShbMDItOV1cXGR8MVswMi05XSkpLT9bMi05XShbMDItOV1cXGR8MVswMi05XSktP1xcZHs0fSQvICk7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwaG9uZSBudW1iZXJcIiApO1xyXG5cclxuLypcclxuKiBWYWxpZGEgQ0VQcyBkbyBicmFzaWxlaXJvczpcclxuKlxyXG4qIEZvcm1hdG9zIGFjZWl0b3M6XHJcbiogOTk5OTktOTk5XHJcbiogOTkuOTk5LTk5OVxyXG4qIDk5OTk5OTk5XHJcbiovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwb3N0YWxjb2RlQlJcIiwgZnVuY3Rpb24oIGNlcF92YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkezJ9LlxcZHszfS1cXGR7M30/JHxeXFxkezV9LT9cXGR7M30/JC8udGVzdCggY2VwX3ZhbHVlICk7XHJcbn0sIFwiSW5mb3JtZSB1bSBDRVAgdsOhbGlkby5cIiApO1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoZXMgYSB2YWxpZCBDYW5hZGlhbiBQb3N0YWwgQ29kZVxyXG4gKlxyXG4gKiBAZXhhbXBsZSBqUXVlcnkudmFsaWRhdG9yLm1ldGhvZHMucG9zdGFsQ29kZUNBKCBcIkgwSCAwSDBcIiwgZWxlbWVudCApXHJcbiAqIEByZXN1bHQgdHJ1ZVxyXG4gKlxyXG4gKiBAZXhhbXBsZSBqUXVlcnkudmFsaWRhdG9yLm1ldGhvZHMucG9zdGFsQ29kZUNBKCBcIkgwSDBIMFwiLCBlbGVtZW50IClcclxuICogQHJlc3VsdCBmYWxzZVxyXG4gKlxyXG4gKiBAbmFtZSBqUXVlcnkudmFsaWRhdG9yLm1ldGhvZHMucG9zdGFsQ29kZUNBXHJcbiAqIEB0eXBlIEJvb2xlYW5cclxuICogQGNhdCBQbHVnaW5zL1ZhbGlkYXRlL01ldGhvZHNcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwb3N0YWxDb2RlQ0FcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bQUJDRUdISktMTU5QUlNUVlhZXVxcZFtBQkNFR0hKS0xNTlBSU1RWV1hZWl0gKlxcZFtBQkNFR0hKS0xNTlBSU1RWV1hZWl1cXGQkL2kudGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlXCIgKTtcclxuXHJcbi8qIE1hdGNoZXMgSXRhbGlhbiBwb3N0Y29kZSAoQ0FQKSAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicG9zdGFsY29kZUlUXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkezV9JC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwb3N0YWxjb2RlTkxcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bMS05XVswLTldezN9XFxzP1thLXpBLVpdezJ9JC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlXCIgKTtcclxuXHJcbi8vIE1hdGNoZXMgVUsgcG9zdGNvZGUuIERvZXMgbm90IG1hdGNoIHRvIFVLIENoYW5uZWwgSXNsYW5kcyB0aGF0IGhhdmUgdGhlaXIgb3duIHBvc3Rjb2RlcyAobm9uIHN0YW5kYXJkIFVLKVxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicG9zdGNvZGVVS1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigoKFtBLVBSLVVXWVpdWzAtOV0pfChbQS1QUi1VV1laXVswLTldWzAtOV0pfChbQS1QUi1VV1laXVtBLUhLLVldWzAtOV0pfChbQS1QUi1VV1laXVtBLUhLLVldWzAtOV1bMC05XSl8KFtBLVBSLVVXWVpdWzAtOV1bQS1ISktTVFVXXSl8KFtBLVBSLVVXWVpdW0EtSEstWV1bMC05XVtBQkVITU5QUlZXWFldKSlcXHM/KFswLTldW0FCRC1ISkxOUC1VVy1aXXsyfSl8KEdJUilcXHM/KDBBQSkpJC9pLnRlc3QoIHZhbHVlICk7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBVSyBwb3N0Y29kZVwiICk7XHJcblxyXG4vKlxyXG4gKiBMZXRzIHlvdSBzYXkgXCJhdCBsZWFzdCBYIGlucHV0cyB0aGF0IG1hdGNoIHNlbGVjdG9yIFkgbXVzdCBiZSBmaWxsZWQuXCJcclxuICpcclxuICogVGhlIGVuZCByZXN1bHQgaXMgdGhhdCBuZWl0aGVyIG9mIHRoZXNlIGlucHV0czpcclxuICpcclxuICpcdDxpbnB1dCBjbGFzcz1cInByb2R1Y3RpbmZvXCIgbmFtZT1cInBhcnRudW1iZXJcIj5cclxuICpcdDxpbnB1dCBjbGFzcz1cInByb2R1Y3RpbmZvXCIgbmFtZT1cImRlc2NyaXB0aW9uXCI+XHJcbiAqXHJcbiAqXHQuLi53aWxsIHZhbGlkYXRlIHVubGVzcyBhdCBsZWFzdCBvbmUgb2YgdGhlbSBpcyBmaWxsZWQuXHJcbiAqXHJcbiAqIHBhcnRudW1iZXI6XHR7cmVxdWlyZV9mcm9tX2dyb3VwOiBbMSxcIi5wcm9kdWN0aW5mb1wiXX0sXHJcbiAqIGRlc2NyaXB0aW9uOiB7cmVxdWlyZV9mcm9tX2dyb3VwOiBbMSxcIi5wcm9kdWN0aW5mb1wiXX1cclxuICpcclxuICogb3B0aW9uc1swXTogbnVtYmVyIG9mIGZpZWxkcyB0aGF0IG11c3QgYmUgZmlsbGVkIGluIHRoZSBncm91cFxyXG4gKiBvcHRpb25zWzFdOiBDU1Mgc2VsZWN0b3IgdGhhdCBkZWZpbmVzIHRoZSBncm91cCBvZiBjb25kaXRpb25hbGx5IHJlcXVpcmVkIGZpZWxkc1xyXG4gKi9cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInJlcXVpcmVfZnJvbV9ncm91cFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIG9wdGlvbnMgKSB7XHJcblx0dmFyICRmaWVsZHMgPSAkKCBvcHRpb25zWyAxIF0sIGVsZW1lbnQuZm9ybSApLFxyXG5cdFx0JGZpZWxkc0ZpcnN0ID0gJGZpZWxkcy5lcSggMCApLFxyXG5cdFx0dmFsaWRhdG9yID0gJGZpZWxkc0ZpcnN0LmRhdGEoIFwidmFsaWRfcmVxX2dycFwiICkgPyAkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9yZXFfZ3JwXCIgKSA6ICQuZXh0ZW5kKCB7fSwgdGhpcyApLFxyXG5cdFx0aXNWYWxpZCA9ICRmaWVsZHMuZmlsdGVyKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHZhbGlkYXRvci5lbGVtZW50VmFsdWUoIHRoaXMgKTtcclxuXHRcdH0gKS5sZW5ndGggPj0gb3B0aW9uc1sgMCBdO1xyXG5cclxuXHQvLyBTdG9yZSB0aGUgY2xvbmVkIHZhbGlkYXRvciBmb3IgZnV0dXJlIHZhbGlkYXRpb25cclxuXHQkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9yZXFfZ3JwXCIsIHZhbGlkYXRvciApO1xyXG5cclxuXHQvLyBJZiBlbGVtZW50IGlzbid0IGJlaW5nIHZhbGlkYXRlZCwgcnVuIGVhY2ggcmVxdWlyZV9mcm9tX2dyb3VwIGZpZWxkJ3MgdmFsaWRhdGlvbiBydWxlc1xyXG5cdGlmICggISQoIGVsZW1lbnQgKS5kYXRhKCBcImJlaW5nX3ZhbGlkYXRlZFwiICkgKSB7XHJcblx0XHQkZmllbGRzLmRhdGEoIFwiYmVpbmdfdmFsaWRhdGVkXCIsIHRydWUgKTtcclxuXHRcdCRmaWVsZHMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhbGlkYXRvci5lbGVtZW50KCB0aGlzICk7XHJcblx0XHR9ICk7XHJcblx0XHQkZmllbGRzLmRhdGEoIFwiYmVpbmdfdmFsaWRhdGVkXCIsIGZhbHNlICk7XHJcblx0fVxyXG5cdHJldHVybiBpc1ZhbGlkO1xyXG59LCAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGZpbGwgYXQgbGVhc3QgezB9IG9mIHRoZXNlIGZpZWxkcy5cIiApICk7XHJcblxyXG4vKlxyXG4gKiBMZXRzIHlvdSBzYXkgXCJlaXRoZXIgYXQgbGVhc3QgWCBpbnB1dHMgdGhhdCBtYXRjaCBzZWxlY3RvciBZIG11c3QgYmUgZmlsbGVkLFxyXG4gKiBPUiB0aGV5IG11c3QgYWxsIGJlIHNraXBwZWQgKGxlZnQgYmxhbmspLlwiXHJcbiAqXHJcbiAqIFRoZSBlbmQgcmVzdWx0LCBpcyB0aGF0IG5vbmUgb2YgdGhlc2UgaW5wdXRzOlxyXG4gKlxyXG4gKlx0PGlucHV0IGNsYXNzPVwicHJvZHVjdGluZm9cIiBuYW1lPVwicGFydG51bWJlclwiPlxyXG4gKlx0PGlucHV0IGNsYXNzPVwicHJvZHVjdGluZm9cIiBuYW1lPVwiZGVzY3JpcHRpb25cIj5cclxuICpcdDxpbnB1dCBjbGFzcz1cInByb2R1Y3RpbmZvXCIgbmFtZT1cImNvbG9yXCI+XHJcbiAqXHJcbiAqXHQuLi53aWxsIHZhbGlkYXRlIHVubGVzcyBlaXRoZXIgYXQgbGVhc3QgdHdvIG9mIHRoZW0gYXJlIGZpbGxlZCxcclxuICpcdE9SIG5vbmUgb2YgdGhlbSBhcmUuXHJcbiAqXHJcbiAqIHBhcnRudW1iZXI6XHR7c2tpcF9vcl9maWxsX21pbmltdW06IFsyLFwiLnByb2R1Y3RpbmZvXCJdfSxcclxuICogZGVzY3JpcHRpb246IHtza2lwX29yX2ZpbGxfbWluaW11bTogWzIsXCIucHJvZHVjdGluZm9cIl19LFxyXG4gKiBjb2xvcjpcdFx0e3NraXBfb3JfZmlsbF9taW5pbXVtOiBbMixcIi5wcm9kdWN0aW5mb1wiXX1cclxuICpcclxuICogb3B0aW9uc1swXTogbnVtYmVyIG9mIGZpZWxkcyB0aGF0IG11c3QgYmUgZmlsbGVkIGluIHRoZSBncm91cFxyXG4gKiBvcHRpb25zWzFdOiBDU1Mgc2VsZWN0b3IgdGhhdCBkZWZpbmVzIHRoZSBncm91cCBvZiBjb25kaXRpb25hbGx5IHJlcXVpcmVkIGZpZWxkc1xyXG4gKlxyXG4gKi9cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInNraXBfb3JfZmlsbF9taW5pbXVtXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgb3B0aW9ucyApIHtcclxuXHR2YXIgJGZpZWxkcyA9ICQoIG9wdGlvbnNbIDEgXSwgZWxlbWVudC5mb3JtICksXHJcblx0XHQkZmllbGRzRmlyc3QgPSAkZmllbGRzLmVxKCAwICksXHJcblx0XHR2YWxpZGF0b3IgPSAkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9za2lwXCIgKSA/ICRmaWVsZHNGaXJzdC5kYXRhKCBcInZhbGlkX3NraXBcIiApIDogJC5leHRlbmQoIHt9LCB0aGlzICksXHJcblx0XHRudW1iZXJGaWxsZWQgPSAkZmllbGRzLmZpbHRlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB2YWxpZGF0b3IuZWxlbWVudFZhbHVlKCB0aGlzICk7XHJcblx0XHR9ICkubGVuZ3RoLFxyXG5cdFx0aXNWYWxpZCA9IG51bWJlckZpbGxlZCA9PT0gMCB8fCBudW1iZXJGaWxsZWQgPj0gb3B0aW9uc1sgMCBdO1xyXG5cclxuXHQvLyBTdG9yZSB0aGUgY2xvbmVkIHZhbGlkYXRvciBmb3IgZnV0dXJlIHZhbGlkYXRpb25cclxuXHQkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9za2lwXCIsIHZhbGlkYXRvciApO1xyXG5cclxuXHQvLyBJZiBlbGVtZW50IGlzbid0IGJlaW5nIHZhbGlkYXRlZCwgcnVuIGVhY2ggc2tpcF9vcl9maWxsX21pbmltdW0gZmllbGQncyB2YWxpZGF0aW9uIHJ1bGVzXHJcblx0aWYgKCAhJCggZWxlbWVudCApLmRhdGEoIFwiYmVpbmdfdmFsaWRhdGVkXCIgKSApIHtcclxuXHRcdCRmaWVsZHMuZGF0YSggXCJiZWluZ192YWxpZGF0ZWRcIiwgdHJ1ZSApO1xyXG5cdFx0JGZpZWxkcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFsaWRhdG9yLmVsZW1lbnQoIHRoaXMgKTtcclxuXHRcdH0gKTtcclxuXHRcdCRmaWVsZHMuZGF0YSggXCJiZWluZ192YWxpZGF0ZWRcIiwgZmFsc2UgKTtcclxuXHR9XHJcblx0cmV0dXJuIGlzVmFsaWQ7XHJcbn0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZWl0aGVyIHNraXAgdGhlc2UgZmllbGRzIG9yIGZpbGwgYXQgbGVhc3QgezB9IG9mIHRoZW0uXCIgKSApO1xyXG5cclxuLyogVmFsaWRhdGVzIFVTIFN0YXRlcyBhbmQvb3IgVGVycml0b3JpZXMgYnkgQGpkZm9yc3l0aGVcclxuICogQ2FuIGJlIGNhc2UgaW5zZW5zaXRpdmUgb3IgcmVxdWlyZSBjYXBpdGFsaXphdGlvbiAtIGRlZmF1bHQgaXMgY2FzZSBpbnNlbnNpdGl2ZVxyXG4gKiBDYW4gaW5jbHVkZSBVUyBUZXJyaXRvcmllcyBvciBub3QgLSBkZWZhdWx0IGRvZXMgbm90XHJcbiAqIENhbiBpbmNsdWRlIFVTIE1pbGl0YXJ5IHBvc3RhbCBhYmJyZXZpYXRpb25zIChBQSwgQUUsIEFQKSAtIGRlZmF1bHQgZG9lcyBub3RcclxuICpcclxuICogTm90ZTogXCJTdGF0ZXNcIiBhbHdheXMgaW5jbHVkZXMgREMgKERpc3RyaWN0IG9mIENvbG9tYmlhKVxyXG4gKlxyXG4gKiBVc2FnZSBleGFtcGxlczpcclxuICpcclxuICogIFRoaXMgaXMgdGhlIGRlZmF1bHQgLSBjYXNlIGluc2Vuc2l0aXZlLCBubyB0ZXJyaXRvcmllcywgbm8gbWlsaXRhcnkgem9uZXNcclxuICogIHN0YXRlSW5wdXQ6IHtcclxuICogICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlLFxyXG4gKiAgICAgaW5jbHVkZVRlcnJpdG9yaWVzOiBmYWxzZSxcclxuICogICAgIGluY2x1ZGVNaWxpdGFyeTogZmFsc2VcclxuICogIH1cclxuICpcclxuICogIE9ubHkgYWxsb3cgY2FwaXRhbCBsZXR0ZXJzLCBubyB0ZXJyaXRvcmllcywgbm8gbWlsaXRhcnkgem9uZXNcclxuICogIHN0YXRlSW5wdXQ6IHtcclxuICogICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlXHJcbiAqICB9XHJcbiAqXHJcbiAqICBDYXNlIGluc2Vuc2l0aXZlLCBpbmNsdWRlIHRlcnJpdG9yaWVzIGJ1dCBub3QgbWlsaXRhcnkgem9uZXNcclxuICogIHN0YXRlSW5wdXQ6IHtcclxuICogICAgIGluY2x1ZGVUZXJyaXRvcmllczogdHJ1ZVxyXG4gKiAgfVxyXG4gKlxyXG4gKiAgT25seSBhbGxvdyBjYXBpdGFsIGxldHRlcnMsIGluY2x1ZGUgdGVycml0b3JpZXMgYW5kIG1pbGl0YXJ5IHpvbmVzXHJcbiAqICBzdGF0ZUlucHV0OiB7XHJcbiAqICAgICBjYXNlU2Vuc2l0aXZlOiB0cnVlLFxyXG4gKiAgICAgaW5jbHVkZVRlcnJpdG9yaWVzOiB0cnVlLFxyXG4gKiAgICAgaW5jbHVkZU1pbGl0YXJ5OiB0cnVlXHJcbiAqICB9XHJcbiAqXHJcbiAqL1xyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwic3RhdGVVU1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIG9wdGlvbnMgKSB7XHJcblx0dmFyIGlzRGVmYXVsdCA9IHR5cGVvZiBvcHRpb25zID09PSBcInVuZGVmaW5lZFwiLFxyXG5cdFx0Y2FzZVNlbnNpdGl2ZSA9ICggaXNEZWZhdWx0IHx8IHR5cGVvZiBvcHRpb25zLmNhc2VTZW5zaXRpdmUgPT09IFwidW5kZWZpbmVkXCIgKSA/IGZhbHNlIDogb3B0aW9ucy5jYXNlU2Vuc2l0aXZlLFxyXG5cdFx0aW5jbHVkZVRlcnJpdG9yaWVzID0gKCBpc0RlZmF1bHQgfHwgdHlwZW9mIG9wdGlvbnMuaW5jbHVkZVRlcnJpdG9yaWVzID09PSBcInVuZGVmaW5lZFwiICkgPyBmYWxzZSA6IG9wdGlvbnMuaW5jbHVkZVRlcnJpdG9yaWVzLFxyXG5cdFx0aW5jbHVkZU1pbGl0YXJ5ID0gKCBpc0RlZmF1bHQgfHwgdHlwZW9mIG9wdGlvbnMuaW5jbHVkZU1pbGl0YXJ5ID09PSBcInVuZGVmaW5lZFwiICkgPyBmYWxzZSA6IG9wdGlvbnMuaW5jbHVkZU1pbGl0YXJ5LFxyXG5cdFx0cmVnZXg7XHJcblxyXG5cdGlmICggIWluY2x1ZGVUZXJyaXRvcmllcyAmJiAhaW5jbHVkZU1pbGl0YXJ5ICkge1xyXG5cdFx0cmVnZXggPSBcIl4oQVtLTFJaXXxDW0FPVF18RFtDRV18Rkx8R0F8SEl8SVtBRExOXXxLW1NZXXxMQXxNW0FERUlOT1NUXXxOW0NERUhKTVZZXXxPW0hLUl18UEF8Ukl8U1tDRF18VFtOWF18VVR8VltBVF18V1tBSVZZXSkkXCI7XHJcblx0fSBlbHNlIGlmICggaW5jbHVkZVRlcnJpdG9yaWVzICYmIGluY2x1ZGVNaWxpdGFyeSApIHtcclxuXHRcdHJlZ2V4ID0gXCJeKEFbQUVLTFBSU1pdfENbQU9UXXxEW0NFXXxGTHxHW0FVXXxISXxJW0FETE5dfEtbU1ldfExBfE1bQURFSU5PUFNUXXxOW0NERUhKTVZZXXxPW0hLUl18UFtBUl18Ukl8U1tDRF18VFtOWF18VVR8VltBSVRdfFdbQUlWWV0pJFwiO1xyXG5cdH0gZWxzZSBpZiAoIGluY2x1ZGVUZXJyaXRvcmllcyApIHtcclxuXHRcdHJlZ2V4ID0gXCJeKEFbS0xSU1pdfENbQU9UXXxEW0NFXXxGTHxHW0FVXXxISXxJW0FETE5dfEtbU1ldfExBfE1bQURFSU5PUFNUXXxOW0NERUhKTVZZXXxPW0hLUl18UFtBUl18Ukl8U1tDRF18VFtOWF18VVR8VltBSVRdfFdbQUlWWV0pJFwiO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZWdleCA9IFwiXihBW0FFS0xQUlpdfENbQU9UXXxEW0NFXXxGTHxHQXxISXxJW0FETE5dfEtbU1ldfExBfE1bQURFSU5PU1RdfE5bQ0RFSEpNVlldfE9bSEtSXXxQQXxSSXxTW0NEXXxUW05YXXxVVHxWW0FUXXxXW0FJVlldKSRcIjtcclxuXHR9XHJcblxyXG5cdHJlZ2V4ID0gY2FzZVNlbnNpdGl2ZSA/IG5ldyBSZWdFeHAoIHJlZ2V4ICkgOiBuZXcgUmVnRXhwKCByZWdleCwgXCJpXCIgKTtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHJlZ2V4LnRlc3QoIHZhbHVlICk7XHJcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBzdGF0ZVwiICk7XHJcblxyXG4vLyBUT0RPIGNoZWNrIGlmIHZhbHVlIHN0YXJ0cyB3aXRoIDwsIG90aGVyd2lzZSBkb24ndCB0cnkgc3RyaXBwaW5nIGFueXRoaW5nXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJzdHJpcHBlZG1pbmxlbmd0aFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xyXG5cdHJldHVybiAkKCB2YWx1ZSApLnRleHQoKS5sZW5ndGggPj0gcGFyYW07XHJcbn0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgezB9IGNoYXJhY3RlcnNcIiApICk7XHJcblxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwidGltZVwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXihbMDFdXFxkfDJbMC0zXXxbMC05XSkoOlswLTVdXFxkKXsxLDJ9JC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCB0aW1lLCBiZXR3ZWVuIDAwOjAwIGFuZCAyMzo1OVwiICk7XHJcblxyXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwidGltZTEyaFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XHJcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigoMD9bMS05XXwxWzAxMl0pKDpbMC01XVxcZCl7MSwyfShcXCA/W0FQXU0pKSQvaS50ZXN0KCB2YWx1ZSApO1xyXG59LCBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIHRpbWUgaW4gMTItaG91ciBhbS9wbSBmb3JtYXRcIiApO1xyXG5cclxuLy8gU2FtZSBhcyB1cmwsIGJ1dCBUTEQgaXMgb3B0aW9uYWxcclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInVybDJcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oaHR0cHM/fGZ0cCk6XFwvXFwvKCgoKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDopKkApPygoKFxcZHxbMS05XVxcZHwxXFxkXFxkfDJbMC00XVxcZHwyNVswLTVdKVxcLihcXGR8WzEtOV1cXGR8MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC01XSlcXC4oXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pXFwuKFxcZHxbMS05XVxcZHwxXFxkXFxkfDJbMC00XVxcZHwyNVswLTVdKSl8KCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikqKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuPykoOlxcZCopPykoXFwvKCgoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OnxAKSsoXFwvKChbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6fEApKikqKT8pPyhcXD8oKChbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6fEApfFtcXHVFMDAwLVxcdUY4RkZdfFxcL3xcXD8pKik/KCMoKChbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6fEApfFxcL3xcXD8pKik/JC9pLnRlc3QoIHZhbHVlICk7XHJcbn0sICQudmFsaWRhdG9yLm1lc3NhZ2VzLnVybCApO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlLCBpZiB0aGUgdmFsdWUgaXMgYSB2YWxpZCB2ZWhpY2xlIGlkZW50aWZpY2F0aW9uIG51bWJlciAoVklOKS5cclxuICpcclxuICogV29ya3Mgd2l0aCBhbGwga2luZCBvZiB0ZXh0IGlucHV0cy5cclxuICpcclxuICogQGV4YW1wbGUgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgc2l6ZT1cIjIwXCIgbmFtZT1cIlZlaGljbGVJRFwiIGNsYXNzPVwie3JlcXVpcmVkOnRydWUsdmluVVM6dHJ1ZX1cIiAvPlxyXG4gKiBAZGVzYyBEZWNsYXJlcyBhIHJlcXVpcmVkIGlucHV0IGVsZW1lbnQgd2hvc2UgdmFsdWUgbXVzdCBiZSBhIHZhbGlkIHZlaGljbGUgaWRlbnRpZmljYXRpb24gbnVtYmVyLlxyXG4gKlxyXG4gKiBAbmFtZSAkLnZhbGlkYXRvci5tZXRob2RzLnZpblVTXHJcbiAqIEB0eXBlIEJvb2xlYW5cclxuICogQGNhdCBQbHVnaW5zL1ZhbGlkYXRlL01ldGhvZHNcclxuICovXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJ2aW5VU1wiLCBmdW5jdGlvbiggdiApIHtcclxuXHRpZiAoIHYubGVuZ3RoICE9PSAxNyApIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHZhciBMTCA9IFsgXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCIsIFwiSFwiLCBcIkpcIiwgXCJLXCIsIFwiTFwiLCBcIk1cIiwgXCJOXCIsIFwiUFwiLCBcIlJcIiwgXCJTXCIsIFwiVFwiLCBcIlVcIiwgXCJWXCIsIFwiV1wiLCBcIlhcIiwgXCJZXCIsIFwiWlwiIF0sXHJcblx0XHRWTCA9IFsgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgMSwgMiwgMywgNCwgNSwgNywgOSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSBdLFxyXG5cdFx0RkwgPSBbIDgsIDcsIDYsIDUsIDQsIDMsIDIsIDEwLCAwLCA5LCA4LCA3LCA2LCA1LCA0LCAzLCAyIF0sXHJcblx0XHRycyA9IDAsXHJcblx0XHRpLCBuLCBkLCBmLCBjZCwgY2R2O1xyXG5cclxuXHRmb3IgKCBpID0gMDsgaSA8IDE3OyBpKysgKSB7XHJcblx0XHRmID0gRkxbIGkgXTtcclxuXHRcdGQgPSB2LnNsaWNlKCBpLCBpICsgMSApO1xyXG5cdFx0aWYgKCBpID09PSA4ICkge1xyXG5cdFx0XHRjZHYgPSBkO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCAhaXNOYU4oIGQgKSApIHtcclxuXHRcdFx0ZCAqPSBmO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yICggbiA9IDA7IG4gPCBMTC5sZW5ndGg7IG4rKyApIHtcclxuXHRcdFx0XHRpZiAoIGQudG9VcHBlckNhc2UoKSA9PT0gTExbIG4gXSApIHtcclxuXHRcdFx0XHRcdGQgPSBWTFsgbiBdO1xyXG5cdFx0XHRcdFx0ZCAqPSBmO1xyXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggY2R2ICkgJiYgbiA9PT0gOCApIHtcclxuXHRcdFx0XHRcdFx0Y2R2ID0gTExbIG4gXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cnMgKz0gZDtcclxuXHR9XHJcblx0Y2QgPSBycyAlIDExO1xyXG5cdGlmICggY2QgPT09IDEwICkge1xyXG5cdFx0Y2QgPSBcIlhcIjtcclxuXHR9XHJcblx0aWYgKCBjZCA9PT0gY2R2ICkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufSwgXCJUaGUgc3BlY2lmaWVkIHZlaGljbGUgaWRlbnRpZmljYXRpb24gbnVtYmVyIChWSU4pIGlzIGludmFsaWQuXCIgKTtcclxuXHJcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJ6aXBjb2RlVVNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xyXG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGR7NX0oLVxcZHs0fSk/JC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJUaGUgc3BlY2lmaWVkIFVTIFpJUCBDb2RlIGlzIGludmFsaWRcIiApO1xyXG5cclxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInppcHJhbmdlXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcclxuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eOTBbMi01XVxcZFxcezJcXH0tXFxkezR9JC8udGVzdCggdmFsdWUgKTtcclxufSwgXCJZb3VyIFpJUC1jb2RlIG11c3QgYmUgaW4gdGhlIHJhbmdlIDkwMnh4LXh4eHggdG8gOTA1eHgteHh4eFwiICk7XHJcbnJldHVybiAkO1xyXG59KSk7Il19