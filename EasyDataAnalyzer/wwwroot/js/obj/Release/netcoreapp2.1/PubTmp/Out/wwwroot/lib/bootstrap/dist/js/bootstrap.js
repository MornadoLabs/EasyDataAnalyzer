/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */
if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery');
}
+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
    }
}(jQuery);
/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
    // ============================================================
    function transitionEnd() {
        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] };
            }
        }
        return false; // explicit for ie8 (  ._.)
    }
    // https://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('bsTransitionEnd', function () { called = true; });
        var callback = function () { if (!called)
            $($el).trigger($.support.transition.end); };
        setTimeout(callback, duration);
        return this;
    };
    $(function () {
        $.support.transition = transitionEnd();
        if (!$.support.transition)
            return;
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this))
                    return e.handleObj.handler.apply(this, arguments);
            }
        };
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // ALERT CLASS DEFINITION
    // ======================
    var dismiss = '[data-dismiss="alert"]';
    var Alert = function (el) {
        $(el).on('click', dismiss, this.close);
    };
    Alert.VERSION = '3.4.1';
    Alert.TRANSITION_DURATION = 150;
    Alert.prototype.close = function (e) {
        var $this = $(this);
        var selector = $this.attr('data-target');
        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }
        selector = selector === '#' ? [] : selector;
        var $parent = $(document).find(selector);
        if (e)
            e.preventDefault();
        if (!$parent.length) {
            $parent = $this.closest('.alert');
        }
        $parent.trigger(e = $.Event('close.bs.alert'));
        if (e.isDefaultPrevented())
            return;
        $parent.removeClass('in');
        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove();
        }
        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement();
    };
    // ALERT PLUGIN DEFINITION
    // =======================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.alert');
            if (!data)
                $this.data('bs.alert', (data = new Alert(this)));
            if (typeof option == 'string')
                data[option].call($this);
        });
    }
    var old = $.fn.alert;
    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;
    // ALERT NO CONFLICT
    // =================
    $.fn.alert.noConflict = function () {
        $.fn.alert = old;
        return this;
    };
    // ALERT DATA-API
    // ==============
    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================
    var Button = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Button.DEFAULTS, options);
        this.isLoading = false;
    };
    Button.VERSION = '3.4.1';
    Button.DEFAULTS = {
        loadingText: 'loading...'
    };
    Button.prototype.setState = function (state) {
        var d = 'disabled';
        var $el = this.$element;
        var val = $el.is('input') ? 'val' : 'html';
        var data = $el.data();
        state += 'Text';
        if (data.resetText == null)
            $el.data('resetText', $el[val]());
        // push to event loop to allow forms to submit
        setTimeout($.proxy(function () {
            $el[val](data[state] == null ? this.options[state] : data[state]);
            if (state == 'loadingText') {
                this.isLoading = true;
                $el.addClass(d).attr(d, d).prop(d, true);
            }
            else if (this.isLoading) {
                this.isLoading = false;
                $el.removeClass(d).removeAttr(d).prop(d, false);
            }
        }, this), 0);
    };
    Button.prototype.toggle = function () {
        var changed = true;
        var $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find('input');
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked'))
                    changed = false;
                $parent.find('.active').removeClass('active');
                this.$element.addClass('active');
            }
            else if ($input.prop('type') == 'checkbox') {
                if (($input.prop('checked')) !== this.$element.hasClass('active'))
                    changed = false;
                this.$element.toggleClass('active');
            }
            $input.prop('checked', this.$element.hasClass('active'));
            if (changed)
                $input.trigger('change');
        }
        else {
            this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
            this.$element.toggleClass('active');
        }
    };
    // BUTTON PLUGIN DEFINITION
    // ========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.button');
            var options = typeof option == 'object' && option;
            if (!data)
                $this.data('bs.button', (data = new Button(this, options)));
            if (option == 'toggle')
                data.toggle();
            else if (option)
                data.setState(option);
        });
    }
    var old = $.fn.button;
    $.fn.button = Plugin;
    $.fn.button.Constructor = Button;
    // BUTTON NO CONFLICT
    // ==================
    $.fn.button.noConflict = function () {
        $.fn.button = old;
        return this;
    };
    // BUTTON DATA-API
    // ===============
    $(document)
        .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        var $btn = $(e.target).closest('.btn');
        Plugin.call($btn, 'toggle');
        if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
            // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
            e.preventDefault();
            // The target component still receive the focus
            if ($btn.is('input,button'))
                $btn.trigger('focus');
            else
                $btn.find('input:visible,button:visible').first().trigger('focus');
        }
    })
        .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // CAROUSEL CLASS DEFINITION
    // =========================
    var Carousel = function (element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find('.carousel-indicators');
        this.options = options;
        this.paused = null;
        this.sliding = null;
        this.interval = null;
        this.$active = null;
        this.$items = null;
        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));
        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
    };
    Carousel.VERSION = '3.4.1';
    Carousel.TRANSITION_DURATION = 600;
    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    };
    Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName))
            return;
        switch (e.which) {
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default: return;
        }
        e.preventDefault();
    };
    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false);
        this.interval && clearInterval(this.interval);
        this.options.interval
            && !this.paused
            && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
        return this;
    };
    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item');
        return this.$items.index(item || this.$active);
    };
    Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (this.$items.length - 1));
        if (willWrap && !this.options.wrap)
            return active;
        var delta = direction == 'prev' ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex);
    };
    Carousel.prototype.to = function (pos) {
        var that = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));
        if (pos > (this.$items.length - 1) || pos < 0)
            return;
        if (this.sliding)
            return this.$element.one('slid.bs.carousel', function () { that.to(pos); }); // yes, "slid"
        if (activeIndex == pos)
            return this.pause().cycle();
        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
    };
    Carousel.prototype.pause = function (e) {
        e || (this.paused = true);
        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }
        this.interval = clearInterval(this.interval);
        return this;
    };
    Carousel.prototype.next = function () {
        if (this.sliding)
            return;
        return this.slide('next');
    };
    Carousel.prototype.prev = function () {
        if (this.sliding)
            return;
        return this.slide('prev');
    };
    Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active');
        var $next = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == 'next' ? 'left' : 'right';
        var that = this;
        if ($next.hasClass('active'))
            return (this.sliding = false);
        var relatedTarget = $next[0];
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented())
            return;
        this.sliding = true;
        isCycling && this.pause();
        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass('active');
        }
        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type);
            if (typeof $next === 'object' && $next.length) {
                $next[0].offsetWidth; // force reflow
            }
            $active.addClass(direction);
            $next.addClass(direction);
            $active
                .one('bsTransitionEnd', function () {
                $next.removeClass([type, direction].join(' ')).addClass('active');
                $active.removeClass(['active', direction].join(' '));
                that.sliding = false;
                setTimeout(function () {
                    that.$element.trigger(slidEvent);
                }, 0);
            })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION);
        }
        else {
            $active.removeClass('active');
            $next.addClass('active');
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }
        isCycling && this.cycle();
        return this;
    };
    // CAROUSEL PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.carousel');
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action = typeof option == 'string' ? option : options.slide;
            if (!data)
                $this.data('bs.carousel', (data = new Carousel(this, options)));
            if (typeof option == 'number')
                data.to(option);
            else if (action)
                data[action]();
            else if (options.interval)
                data.pause().cycle();
        });
    }
    var old = $.fn.carousel;
    $.fn.carousel = Plugin;
    $.fn.carousel.Constructor = Carousel;
    // CAROUSEL NO CONFLICT
    // ====================
    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old;
        return this;
    };
    // CAROUSEL DATA-API
    // =================
    var clickHandler = function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        if (href) {
            href = href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
        }
        var target = $this.attr('data-target') || href;
        var $target = $(document).find(target);
        if (!$target.hasClass('carousel'))
            return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr('data-slide-to');
        if (slideIndex)
            options.interval = false;
        Plugin.call($target, options);
        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex);
        }
        e.preventDefault();
    };
    $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);
    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        });
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/* jshint latedef: false */
+function ($) {
    'use strict';
    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================
    var Collapse = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
            '[data-toggle="collapse"][data-target="#' + element.id + '"]');
        this.transitioning = null;
        if (this.options.parent) {
            this.$parent = this.getParent();
        }
        else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        }
        if (this.options.toggle)
            this.toggle();
    };
    Collapse.VERSION = '3.4.1';
    Collapse.TRANSITION_DURATION = 350;
    Collapse.DEFAULTS = {
        toggle: true
    };
    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width');
        return hasWidth ? 'width' : 'height';
    };
    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in'))
            return;
        var activesData;
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');
        if (actives && actives.length) {
            activesData = actives.data('bs.collapse');
            if (activesData && activesData.transitioning)
                return;
        }
        var startEvent = $.Event('show.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented())
            return;
        if (actives && actives.length) {
            Plugin.call(actives, 'hide');
            activesData || actives.data('bs.collapse', null);
        }
        var dimension = this.dimension();
        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true);
        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true);
        this.transitioning = 1;
        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('');
            this.transitioning = 0;
            this.$element
                .trigger('shown.bs.collapse');
        };
        if (!$.support.transition)
            return complete.call(this);
        var scrollSize = $.camelCase(['scroll', dimension].join('-'));
        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    };
    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in'))
            return;
        var startEvent = $.Event('hide.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented())
            return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false);
        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false);
        this.transitioning = 1;
        var complete = function () {
            this.transitioning = 0;
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse');
        };
        if (!$.support.transition)
            return complete.call(this);
        this.$element[dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION);
    };
    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
    };
    Collapse.prototype.getParent = function () {
        return $(document).find(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function (i, element) {
            var $element = $(element);
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
        }, this))
            .end();
    };
    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in');
        $element.attr('aria-expanded', isOpen);
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen);
    };
    function getTargetFromTrigger($trigger) {
        var href;
        var target = $trigger.attr('data-target')
            || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
        return $(document).find(target);
    }
    // COLLAPSE PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.collapse');
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data && options.toggle && /show|hide/.test(option))
                options.toggle = false;
            if (!data)
                $this.data('bs.collapse', (data = new Collapse(this, options)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.collapse;
    $.fn.collapse = Plugin;
    $.fn.collapse.Constructor = Collapse;
    // COLLAPSE NO CONFLICT
    // ====================
    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old;
        return this;
    };
    // COLLAPSE DATA-API
    // =================
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this = $(this);
        if (!$this.attr('data-target'))
            e.preventDefault();
        var $target = getTargetFromTrigger($this);
        var data = $target.data('bs.collapse');
        var option = data ? 'toggle' : $this.data();
        Plugin.call($target, option);
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // DROPDOWN CLASS DEFINITION
    // =========================
    var backdrop = '.dropdown-backdrop';
    var toggle = '[data-toggle="dropdown"]';
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle);
    };
    Dropdown.VERSION = '3.4.1';
    function getParent($this) {
        var selector = $this.attr('data-target');
        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }
        var $parent = selector !== '#' ? $(document).find(selector) : null;
        return $parent && $parent.length ? $parent : $this.parent();
    }
    function clearMenus(e) {
        if (e && e.which === 3)
            return;
        $(backdrop).remove();
        $(toggle).each(function () {
            var $this = $(this);
            var $parent = getParent($this);
            var relatedTarget = { relatedTarget: this };
            if (!$parent.hasClass('open'))
                return;
            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target))
                return;
            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));
            if (e.isDefaultPrevented())
                return;
            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
        });
    }
    Dropdown.prototype.toggle = function (e) {
        var $this = $(this);
        if ($this.is('.disabled, :disabled'))
            return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');
        clearMenus();
        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus);
            }
            var relatedTarget = { relatedTarget: this };
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));
            if (e.isDefaultPrevented())
                return;
            $this
                .trigger('focus')
                .attr('aria-expanded', 'true');
            $parent
                .toggleClass('open')
                .trigger($.Event('shown.bs.dropdown', relatedTarget));
        }
        return false;
    };
    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName))
            return;
        var $this = $(this);
        e.preventDefault();
        e.stopPropagation();
        if ($this.is('.disabled, :disabled'))
            return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');
        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27)
                $parent.find(toggle).trigger('focus');
            return $this.trigger('click');
        }
        var desc = ' li:not(.disabled):visible a';
        var $items = $parent.find('.dropdown-menu' + desc);
        if (!$items.length)
            return;
        var index = $items.index(e.target);
        if (e.which == 38 && index > 0)
            index--; // up
        if (e.which == 40 && index < $items.length - 1)
            index++; // down
        if (!~index)
            index = 0;
        $items.eq(index).trigger('focus');
    };
    // DROPDOWN PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.dropdown');
            if (!data)
                $this.data('bs.dropdown', (data = new Dropdown(this)));
            if (typeof option == 'string')
                data[option].call($this);
        });
    }
    var old = $.fn.dropdown;
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;
    // DROPDOWN NO CONFLICT
    // ====================
    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };
    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================
    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation(); })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // MODAL CLASS DEFINITION
    // ======================
    var Modal = function (element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$dialog = this.$element.find('.modal-dialog');
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;
        this.ignoreBackdropClick = false;
        this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom';
        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function () {
                this.$element.trigger('loaded.bs.modal');
            }, this));
        }
    };
    Modal.VERSION = '3.4.1';
    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;
    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };
    Modal.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented())
            return;
        this.isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass('modal-open');
        this.escape();
        this.resize();
        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));
        this.$dialog.on('mousedown.dismiss.bs.modal', function () {
            that.$element.one('mouseup.dismiss.bs.modal', function (e) {
                if ($(e.target).is(that.$element))
                    that.ignoreBackdropClick = true;
            });
        });
        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');
            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body); // don't move modals dom position
            }
            that.$element
                .show()
                .scrollTop(0);
            that.adjustDialog();
            if (transition) {
                that.$element[0].offsetWidth; // force reflow
            }
            that.$element.addClass('in');
            that.enforceFocus();
            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });
            transition ?
                that.$dialog // wait for modal to slide in
                    .one('bsTransitionEnd', function () {
                    that.$element.trigger('focus').trigger(e);
                })
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e);
        });
    };
    Modal.prototype.hide = function (e) {
        if (e)
            e.preventDefault();
        e = $.Event('hide.bs.modal');
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented())
            return;
        this.isShown = false;
        this.escape();
        this.resize();
        $(document).off('focusin.bs.modal');
        this.$element
            .removeClass('in')
            .off('click.dismiss.bs.modal')
            .off('mouseup.dismiss.bs.modal');
        this.$dialog.off('mousedown.dismiss.bs.modal');
        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal();
    };
    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
            if (document !== e.target &&
                this.$element[0] !== e.target &&
                !this.$element.has(e.target).length) {
                this.$element.trigger('focus');
            }
        }, this));
    };
    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide();
            }, this));
        }
        else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal');
        }
    };
    Modal.prototype.resize = function () {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
        }
        else {
            $(window).off('resize.bs.modal');
        }
    };
    Modal.prototype.hideModal = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.$body.removeClass('modal-open');
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger('hidden.bs.modal');
        });
    };
    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };
    Modal.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            this.$backdrop = $(document.createElement('div'))
                .addClass('modal-backdrop ' + animate)
                .appendTo(this.$body);
            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return;
                }
                if (e.target !== e.currentTarget)
                    return;
                this.options.backdrop == 'static'
                    ? this.$element[0].focus()
                    : this.hide();
            }, this));
            if (doAnimate)
                this.$backdrop[0].offsetWidth; // force reflow
            this.$backdrop.addClass('in');
            if (!callback)
                return;
            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback();
        }
        else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');
            var callbackRemove = function () {
                that.removeBackdrop();
                callback && callback();
            };
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove();
        }
        else if (callback) {
            callback();
        }
    };
    // these following methods are used to handle overflowing modals
    Modal.prototype.handleUpdate = function () {
        this.adjustDialog();
    };
    Modal.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        });
    };
    Modal.prototype.resetAdjustments = function () {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        });
    };
    Modal.prototype.checkScrollbar = function () {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar();
    };
    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        this.originalBodyPad = document.body.style.paddingRight || '';
        var scrollbarWidth = this.scrollbarWidth;
        if (this.bodyIsOverflowing) {
            this.$body.css('padding-right', bodyPad + scrollbarWidth);
            $(this.fixedContent).each(function (index, element) {
                var actualPadding = element.style.paddingRight;
                var calculatedPadding = $(element).css('padding-right');
                $(element)
                    .data('padding-right', actualPadding)
                    .css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px');
            });
        }
    };
    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', this.originalBodyPad);
        $(this.fixedContent).each(function (index, element) {
            var padding = $(element).data('padding-right');
            $(element).removeData('padding-right');
            element.style.paddingRight = padding ? padding : '';
        });
    };
    Modal.prototype.measureScrollbar = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };
    // MODAL PLUGIN DEFINITION
    // =======================
    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.modal');
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data)
                $this.data('bs.modal', (data = new Modal(this, options)));
            if (typeof option == 'string')
                data[option](_relatedTarget);
            else if (options.show)
                data.show(_relatedTarget);
        });
    }
    var old = $.fn.modal;
    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;
    // MODAL NO CONFLICT
    // =================
    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };
    // MODAL DATA-API
    // ==============
    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var target = $this.attr('data-target') ||
            (href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        var $target = $(document).find(target);
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());
        if ($this.is('a'))
            e.preventDefault();
        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented())
                return; // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus');
            });
        });
        Plugin.call($target, option, this);
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
    var uriAttrs = [
        'background',
        'cite',
        'href',
        'itemtype',
        'longdesc',
        'poster',
        'src',
        'xlink:href'
    ];
    var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    var DefaultWhitelist = {
        // Global attributes allowed on any supplied element below.
        '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
        a: ['target', 'href', 'title', 'rel'],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ['src', 'alt', 'title', 'width', 'height'],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
    };
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
    var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
    /**
     * A pattern that matches safe data URLs. Only matches image, video and audio types.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
    var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;
    function allowedAttribute(attr, allowedAttributeList) {
        var attrName = attr.nodeName.toLowerCase();
        if ($.inArray(attrName, allowedAttributeList) !== -1) {
            if ($.inArray(attrName, uriAttrs) !== -1) {
                return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
            }
            return true;
        }
        var regExp = $(allowedAttributeList).filter(function (index, value) {
            return value instanceof RegExp;
        });
        // Check if a regular expression validates the attribute.
        for (var i = 0, l = regExp.length; i < l; i++) {
            if (attrName.match(regExp[i])) {
                return true;
            }
        }
        return false;
    }
    function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
        if (unsafeHtml.length === 0) {
            return unsafeHtml;
        }
        if (sanitizeFn && typeof sanitizeFn === 'function') {
            return sanitizeFn(unsafeHtml);
        }
        // IE 8 and below don't support createHTMLDocument
        if (!document.implementation || !document.implementation.createHTMLDocument) {
            return unsafeHtml;
        }
        var createdDocument = document.implementation.createHTMLDocument('sanitization');
        createdDocument.body.innerHTML = unsafeHtml;
        var whitelistKeys = $.map(whiteList, function (el, i) { return i; });
        var elements = $(createdDocument.body).find('*');
        for (var i = 0, len = elements.length; i < len; i++) {
            var el = elements[i];
            var elName = el.nodeName.toLowerCase();
            if ($.inArray(elName, whitelistKeys) === -1) {
                el.parentNode.removeChild(el);
                continue;
            }
            var attributeList = $.map(el.attributes, function (el) { return el; });
            var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
            for (var j = 0, len2 = attributeList.length; j < len2; j++) {
                if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
                    el.removeAttribute(attributeList[j].nodeName);
                }
            }
        }
        return createdDocument.body.innerHTML;
    }
    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================
    var Tooltip = function (element, options) {
        this.type = null;
        this.options = null;
        this.enabled = null;
        this.timeout = null;
        this.hoverState = null;
        this.$element = null;
        this.inState = null;
        this.init('tooltip', element, options);
    };
    Tooltip.VERSION = '3.4.1';
    Tooltip.TRANSITION_DURATION = 150;
    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        },
        sanitize: true,
        sanitizeFn: null,
        whiteList: DefaultWhitelist
    };
    Tooltip.prototype.init = function (type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
        this.inState = { click: false, hover: false, focus: false };
        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
        }
        var triggers = this.options.trigger.split(' ');
        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
            }
            else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }
        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle();
    };
    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS;
    };
    Tooltip.prototype.getOptions = function (options) {
        var dataAttributes = this.$element.data();
        for (var dataAttr in dataAttributes) {
            if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
                delete dataAttributes[dataAttr];
            }
        }
        options = $.extend({}, this.getDefaults(), dataAttributes, options);
        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }
        if (options.sanitize) {
            options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
        }
        return options;
    };
    Tooltip.prototype.getDelegateOptions = function () {
        var options = {};
        var defaults = this.getDefaults();
        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value)
                options[key] = value;
        });
        return options;
    };
    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('bs.' + this.type, self);
        }
        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
        }
        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in';
            return;
        }
        clearTimeout(self.timeout);
        self.hoverState = 'in';
        if (!self.options.delay || !self.options.delay.show)
            return self.show();
        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in')
                self.show();
        }, self.options.delay.show);
    };
    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key])
                return true;
        }
        return false;
    };
    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data('bs.' + this.type, self);
        }
        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
        }
        if (self.isInStateTrue())
            return;
        clearTimeout(self.timeout);
        self.hoverState = 'out';
        if (!self.options.delay || !self.options.delay.hide)
            return self.hide();
        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out')
                self.hide();
        }, self.options.delay.hide);
    };
    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom)
                return;
            var that = this;
            var $tip = this.tip();
            var tipId = this.getUID(this.type);
            this.setContent();
            $tip.attr('id', tipId);
            this.$element.attr('aria-describedby', tipId);
            if (this.options.animation)
                $tip.addClass('fade');
            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement;
            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace)
                placement = placement.replace(autoToken, '') || 'top';
            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('bs.' + this.type, this);
            this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
            this.$element.trigger('inserted.bs.' + this.type);
            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {
                var orgPlacement = placement;
                var viewportDim = this.getPosition(this.$viewport);
                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                    placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                        placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                            placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                                placement;
                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement);
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            var complete = function () {
                var prevHoverState = that.hoverState;
                that.$element.trigger('shown.bs.' + that.type);
                that.hoverState = null;
                if (prevHoverState == 'out')
                    that.leave(that);
            };
            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one('bsTransitionEnd', complete)
                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete();
        }
    };
    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;
        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10);
        var marginLeft = parseInt($tip.css('margin-left'), 10);
        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))
            marginTop = 0;
        if (isNaN(marginLeft))
            marginLeft = 0;
        offset.top += marginTop;
        offset.left += marginLeft;
        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                });
            }
        }, offset), 0);
        $tip.addClass('in');
        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;
        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
        if (delta.left)
            offset.left += delta.left;
        else
            offset.top += delta.top;
        var isVertical = /top|bottom/.test(placement);
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';
        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
    };
    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '');
    };
    Tooltip.prototype.setContent = function () {
        var $tip = this.tip();
        var title = this.getTitle();
        if (this.options.html) {
            if (this.options.sanitize) {
                title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
            }
            $tip.find('.tooltip-inner').html(title);
        }
        else {
            $tip.find('.tooltip-inner').text(title);
        }
        $tip.removeClass('fade in top bottom left right');
    };
    Tooltip.prototype.hide = function (callback) {
        var that = this;
        var $tip = $(this.$tip);
        var e = $.Event('hide.bs.' + this.type);
        function complete() {
            if (that.hoverState != 'in')
                $tip.detach();
            if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                that.$element
                    .removeAttr('aria-describedby')
                    .trigger('hidden.bs.' + that.type);
            }
            callback && callback();
        }
        this.$element.trigger(e);
        if (e.isDefaultPrevented())
            return;
        $tip.removeClass('in');
        $.support.transition && $tip.hasClass('fade') ?
            $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete();
        this.hoverState = null;
        return this;
    };
    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element;
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
        }
    };
    Tooltip.prototype.hasContent = function () {
        return this.getTitle();
    };
    Tooltip.prototype.getPosition = function ($element) {
        $element = $element || this.$element;
        var el = $element[0];
        var isBody = el.tagName == 'BODY';
        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
        }
        var isSvg = window.SVGElement && el instanceof window.SVGElement;
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset());
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;
        return $.extend({}, elRect, scroll, outerDims, elOffset);
    };
    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } :
            placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
    };
    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        if (!this.$viewport)
            return delta;
        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);
        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset;
            }
            else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        }
        else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset;
            }
            else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }
        return delta;
    };
    Tooltip.prototype.getTitle = function () {
        var title;
        var $e = this.$element;
        var o = this.options;
        title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);
        return title;
    };
    Tooltip.prototype.getUID = function (prefix) {
        do
            prefix += ~~(Math.random() * 1000000);
        while (document.getElementById(prefix));
        return prefix;
    };
    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
            }
        }
        return this.$tip;
    };
    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'));
    };
    Tooltip.prototype.enable = function () {
        this.enabled = true;
    };
    Tooltip.prototype.disable = function () {
        this.enabled = false;
    };
    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled;
    };
    Tooltip.prototype.toggle = function (e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data('bs.' + this.type, self);
            }
        }
        if (e) {
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue())
                self.enter(self);
            else
                self.leave(self);
        }
        else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
        }
    };
    Tooltip.prototype.destroy = function () {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type);
            if (that.$tip) {
                that.$tip.detach();
            }
            that.$tip = null;
            that.$arrow = null;
            that.$viewport = null;
            that.$element = null;
        });
    };
    Tooltip.prototype.sanitizeHtml = function (unsafeHtml) {
        return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
    };
    // TOOLTIP PLUGIN DEFINITION
    // =========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.tooltip');
            var options = typeof option == 'object' && option;
            if (!data && /destroy|hide/.test(option))
                return;
            if (!data)
                $this.data('bs.tooltip', (data = new Tooltip(this, options)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.tooltip;
    $.fn.tooltip = Plugin;
    $.fn.tooltip.Constructor = Tooltip;
    // TOOLTIP NO CONFLICT
    // ===================
    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    };
}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================
    var Popover = function (element, options) {
        this.init('popover', element, options);
    };
    if (!$.fn.tooltip)
        throw new Error('Popover requires tooltip.js');
    Popover.VERSION = '3.4.1';
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    Popover.prototype.constructor = Popover;
    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS;
    };
    Popover.prototype.setContent = function () {
        var $tip = this.tip();
        var title = this.getTitle();
        var content = this.getContent();
        if (this.options.html) {
            var typeContent = typeof content;
            if (this.options.sanitize) {
                title = this.sanitizeHtml(title);
                if (typeContent === 'string') {
                    content = this.sanitizeHtml(content);
                }
            }
            $tip.find('.popover-title').html(title);
            $tip.find('.popover-content').children().detach().end()[typeContent === 'string' ? 'html' : 'append'](content);
        }
        else {
            $tip.find('.popover-title').text(title);
            $tip.find('.popover-content').children().detach().end().text(content);
        }
        $tip.removeClass('fade top bottom left right in');
        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html())
            $tip.find('.popover-title').hide();
    };
    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent();
    };
    Popover.prototype.getContent = function () {
        var $e = this.$element;
        var o = this.options;
        return $e.attr('data-content')
            || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content);
    };
    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'));
    };
    // POPOVER PLUGIN DEFINITION
    // =========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.popover');
            var options = typeof option == 'object' && option;
            if (!data && /destroy|hide/.test(option))
                return;
            if (!data)
                $this.data('bs.popover', (data = new Popover(this, options)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.popover;
    $.fn.popover = Plugin;
    $.fn.popover.Constructor = Popover;
    // POPOVER NO CONFLICT
    // ===================
    $.fn.popover.noConflict = function () {
        $.fn.popover = old;
        return this;
    };
}(jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // SCROLLSPY CLASS DEFINITION
    // ==========================
    function ScrollSpy(element, options) {
        this.$body = $(document.body);
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector = (this.options.target || '') + ' .nav li > a';
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
        this.refresh();
        this.process();
    }
    ScrollSpy.VERSION = '3.4.1';
    ScrollSpy.DEFAULTS = {
        offset: 10
    };
    ScrollSpy.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };
    ScrollSpy.prototype.refresh = function () {
        var that = this;
        var offsetMethod = 'offset';
        var offsetBase = 0;
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position';
            offsetBase = this.$scrollElement.scrollTop();
        }
        this.$body
            .find(this.selector)
            .map(function () {
            var $el = $(this);
            var href = $el.data('target') || $el.attr('href');
            var $href = /^#./.test(href) && $(href);
            return ($href
                && $href.length
                && $href.is(':visible')
                && [[$href[offsetMethod]().top + offsetBase, href]]) || null;
        })
            .sort(function (a, b) { return a[0] - b[0]; })
            .each(function () {
            that.offsets.push(this[0]);
            that.targets.push(this[1]);
        });
    };
    ScrollSpy.prototype.process = function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        var scrollHeight = this.getScrollHeight();
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;
        if (this.scrollHeight != scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
        }
        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null;
            return this.clear();
        }
        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
                && scrollTop >= offsets[i]
                && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
                && this.activate(targets[i]);
        }
    };
    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target;
        this.clear();
        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]';
        var active = $(selector)
            .parents('li')
            .addClass('active');
        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active');
        }
        active.trigger('activate.bs.scrollspy');
    };
    ScrollSpy.prototype.clear = function () {
        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active');
    };
    // SCROLLSPY PLUGIN DEFINITION
    // ===========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.scrollspy');
            var options = typeof option == 'object' && option;
            if (!data)
                $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.scrollspy;
    $.fn.scrollspy = Plugin;
    $.fn.scrollspy.Constructor = ScrollSpy;
    // SCROLLSPY NO CONFLICT
    // =====================
    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old;
        return this;
    };
    // SCROLLSPY DATA-API
    // ==================
    $(window).on('load.bs.scrollspy.data-api', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            Plugin.call($spy, $spy.data());
        });
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // TAB CLASS DEFINITION
    // ====================
    var Tab = function (element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element);
        // jscs:enable requireDollarBeforejQueryAssignment
    };
    Tab.VERSION = '3.4.1';
    Tab.TRANSITION_DURATION = 150;
    Tab.prototype.show = function () {
        var $this = this.element;
        var $ul = $this.closest('ul:not(.dropdown-menu)');
        var selector = $this.data('target');
        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }
        if ($this.parent('li').hasClass('active'))
            return;
        var $previous = $ul.find('.active:last a');
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        });
        $previous.trigger(hideEvent);
        $this.trigger(showEvent);
        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented())
            return;
        var $target = $(document).find(selector);
        this.activate($this.closest('li'), $ul);
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            });
        });
    };
    Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active');
        var transition = callback
            && $.support.transition
            && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);
        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false);
            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true);
            if (transition) {
                element[0].offsetWidth; // reflow for transition
                element.addClass('in');
            }
            else {
                element.removeClass('fade');
            }
            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true);
            }
            callback && callback();
        }
        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next();
        $active.removeClass('in');
    };
    // TAB PLUGIN DEFINITION
    // =====================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.tab');
            if (!data)
                $this.data('bs.tab', (data = new Tab(this)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.tab;
    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;
    // TAB NO CONFLICT
    // ===============
    $.fn.tab.noConflict = function () {
        $.fn.tab = old;
        return this;
    };
    // TAB DATA-API
    // ============
    var clickHandler = function (e) {
        e.preventDefault();
        Plugin.call($(this), 'show');
    };
    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);
/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // AFFIX CLASS DEFINITION
    // ======================
    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options);
        var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);
        this.$target = target
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));
        this.$element = $(element);
        this.affixed = null;
        this.unpin = null;
        this.pinnedOffset = null;
        this.checkPosition();
    };
    Affix.VERSION = '3.4.1';
    Affix.RESET = 'affix affix-top affix-bottom';
    Affix.DEFAULTS = {
        offset: 0,
        target: window
    };
    Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        var targetHeight = this.$target.height();
        if (offsetTop != null && this.affixed == 'top')
            return scrollTop < offsetTop ? 'top' : false;
        if (this.affixed == 'bottom') {
            if (offsetTop != null)
                return (scrollTop + this.unpin <= position.top) ? false : 'bottom';
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom';
        }
        var initializing = this.affixed == null;
        var colliderTop = initializing ? scrollTop : position.top;
        var colliderHeight = initializing ? targetHeight : height;
        if (offsetTop != null && scrollTop <= offsetTop)
            return 'top';
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom))
            return 'bottom';
        return false;
    };
    Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset)
            return this.pinnedOffset;
        this.$element.removeClass(Affix.RESET).addClass('affix');
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        return (this.pinnedOffset = position.top - scrollTop);
    };
    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1);
    };
    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible'))
            return;
        var height = this.$element.height();
        var offset = this.options.offset;
        var offsetTop = offset.top;
        var offsetBottom = offset.bottom;
        var scrollHeight = Math.max($(document).height(), $(document.body).height());
        if (typeof offset != 'object')
            offsetBottom = offsetTop = offset;
        if (typeof offsetTop == 'function')
            offsetTop = offset.top(this.$element);
        if (typeof offsetBottom == 'function')
            offsetBottom = offset.bottom(this.$element);
        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);
        if (this.affixed != affix) {
            if (this.unpin != null)
                this.$element.css('top', '');
            var affixType = 'affix' + (affix ? '-' + affix : '');
            var e = $.Event(affixType + '.bs.affix');
            this.$element.trigger(e);
            if (e.isDefaultPrevented())
                return;
            this.affixed = affix;
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;
            this.$element
                .removeClass(Affix.RESET)
                .addClass(affixType)
                .trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
        }
        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            });
        }
    };
    // AFFIX PLUGIN DEFINITION
    // =======================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.affix');
            var options = typeof option == 'object' && option;
            if (!data)
                $this.data('bs.affix', (data = new Affix(this, options)));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.affix;
    $.fn.affix = Plugin;
    $.fn.affix.Constructor = Affix;
    // AFFIX NO CONFLICT
    // =================
    $.fn.affix.noConflict = function () {
        $.fn.affix = old;
        return this;
    };
    // AFFIX DATA-API
    // ==============
    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this);
            var data = $spy.data();
            data.offset = data.offset || {};
            if (data.offsetBottom != null)
                data.offset.bottom = data.offsetBottom;
            if (data.offsetTop != null)
                data.offset.top = data.offsetTop;
            Plugin.call($spy, data);
        });
    });
}(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vb2JqL1JlbGVhc2UvbmV0Y29yZWFwcDIuMS9QdWJUbXAvT3V0L3d3d3Jvb3QvbGliL2Jvb3RzdHJhcC9kaXN0L2pzL2Jvb3RzdHJhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7SUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO0NBQzNEO0FBRUQsQ0FBQyxVQUFVLENBQUM7SUFDVixZQUFZLENBQUM7SUFDYixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDcEgsTUFBTSxJQUFJLEtBQUssQ0FBQywyRkFBMkYsQ0FBQyxDQUFBO0tBQzdHO0FBQ0gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRVY7Ozs7Ozs4RUFNOEU7QUFHOUUsQ0FBQyxVQUFVLENBQUM7SUFDVixZQUFZLENBQUM7SUFFYiw0REFBNEQ7SUFDNUQsK0RBQStEO0lBRS9ELFNBQVMsYUFBYTtRQUNwQixJQUFJLEVBQUUsR0FBRyxRQUFR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QyxDQUFBO0lBR0QsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUVqQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUNuQixDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDM0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUV0QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFBO1lBRS9CLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJO2dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUE7WUFDckUsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFPLElBQUk7Z0JBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQTtZQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUosQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIEJvb3RzdHJhcCB2My40LjEgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8pXHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICovXHJcblxyXG5pZiAodHlwZW9mIGpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnknKVxyXG59XHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcbiAgdmFyIHZlcnNpb24gPSAkLmZuLmpxdWVyeS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJylcclxuICBpZiAoKHZlcnNpb25bMF0gPCAyICYmIHZlcnNpb25bMV0gPCA5KSB8fCAodmVyc2lvblswXSA9PSAxICYmIHZlcnNpb25bMV0gPT0gOSAmJiB2ZXJzaW9uWzJdIDwgMSkgfHwgKHZlcnNpb25bMF0gPiAzKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5IHZlcnNpb24gMS45LjEgb3IgaGlnaGVyLCBidXQgbG93ZXIgdGhhbiB2ZXJzaW9uIDQnKVxyXG4gIH1cclxufShqUXVlcnkpO1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIEJvb3RzdHJhcDogdHJhbnNpdGlvbi5qcyB2My40LjFcclxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RyYW5zaXRpb25zXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBDU1MgVFJBTlNJVElPTiBTVVBQT1JUIChTaG91dG91dDogaHR0cHM6Ly9tb2Rlcm5penIuY29tLylcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcclxuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Jvb3RzdHJhcCcpXHJcblxyXG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcclxuICAgICAgV2Via2l0VHJhbnNpdGlvbiA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcclxuICAgICAgTW96VHJhbnNpdGlvbiAgICA6ICd0cmFuc2l0aW9uZW5kJyxcclxuICAgICAgT1RyYW5zaXRpb24gICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXHJcbiAgICAgIHRyYW5zaXRpb24gICAgICAgOiAndHJhbnNpdGlvbmVuZCdcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xyXG4gICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiB7IGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZSAvLyBleHBsaWNpdCBmb3IgaWU4ICggIC5fLilcclxuICB9XHJcblxyXG4gIC8vIGh0dHBzOi8vYmxvZy5hbGV4bWFjY2F3LmNvbS9jc3MtdHJhbnNpdGlvbnNcclxuICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XHJcbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcclxuICAgIHZhciAkZWwgPSB0aGlzXHJcbiAgICAkKHRoaXMpLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkgeyBjYWxsZWQgPSB0cnVlIH0pXHJcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IGlmICghY2FsbGVkKSAkKCRlbCkudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpIH1cclxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gICQoZnVuY3Rpb24gKCkge1xyXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kKClcclxuXHJcbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm5cclxuXHJcbiAgICAkLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kID0ge1xyXG4gICAgICBiaW5kVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxyXG4gICAgICBkZWxlZ2F0ZVR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcclxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGlzKSkgcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbn0oalF1ZXJ5KTtcclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IGFsZXJ0LmpzIHYzLjQuMVxyXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWxlcnRzXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBBTEVSVCBDTEFTUyBERUZJTklUSU9OXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgZGlzbWlzcyA9ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXHJcbiAgdmFyIEFsZXJ0ICAgPSBmdW5jdGlvbiAoZWwpIHtcclxuICAgICQoZWwpLm9uKCdjbGljaycsIGRpc21pc3MsIHRoaXMuY2xvc2UpXHJcbiAgfVxyXG5cclxuICBBbGVydC5WRVJTSU9OID0gJzMuNC4xJ1xyXG5cclxuICBBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXHJcblxyXG4gIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgJHRoaXMgICAgPSAkKHRoaXMpXHJcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXHJcblxyXG4gICAgaWYgKCFzZWxlY3Rvcikge1xyXG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxyXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0b3IgICAgPSBzZWxlY3RvciA9PT0gJyMnID8gW10gOiBzZWxlY3RvclxyXG4gICAgdmFyICRwYXJlbnQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxyXG5cclxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICBpZiAoISRwYXJlbnQubGVuZ3RoKSB7XHJcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxyXG4gICAgfVxyXG5cclxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcclxuXHJcbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgJHBhcmVudC5yZW1vdmVDbGFzcygnaW4nKVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XHJcbiAgICAgIC8vIGRldGFjaCBmcm9tIHBhcmVudCwgZmlyZSBldmVudCB0aGVuIGNsZWFuIHVwIGRhdGFcclxuICAgICAgJHBhcmVudC5kZXRhY2goKS50cmlnZ2VyKCdjbG9zZWQuYnMuYWxlcnQnKS5yZW1vdmUoKVxyXG4gICAgfVxyXG5cclxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICRwYXJlbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XHJcbiAgICAgICRwYXJlbnRcclxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCByZW1vdmVFbGVtZW50KVxyXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxyXG4gIH1cclxuXHJcblxyXG4gIC8vIEFMRVJUIFBMVUdJTiBERUZJTklUSU9OXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcclxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuYWxlcnQnKVxyXG5cclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLmFsZXJ0XHJcblxyXG4gICQuZm4uYWxlcnQgICAgICAgICAgICAgPSBQbHVnaW5cclxuICAkLmZuLmFsZXJ0LkNvbnN0cnVjdG9yID0gQWxlcnRcclxuXHJcblxyXG4gIC8vIEFMRVJUIE5PIENPTkZMSUNUXHJcbiAgLy8gPT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5hbGVydC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi5hbGVydCA9IG9sZFxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG5cclxuICAvLyBBTEVSVCBEQVRBLUFQSVxyXG4gIC8vID09PT09PT09PT09PT09XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5hbGVydC5kYXRhLWFwaScsIGRpc21pc3MsIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSlcclxuXHJcbn0oalF1ZXJ5KTtcclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IGJ1dHRvbi5qcyB2My40LjFcclxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2J1dHRvbnNcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8vIEJVVFRPTiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxyXG4gICAgdGhpcy5vcHRpb25zICAgPSAkLmV4dGVuZCh7fSwgQnV0dG9uLkRFRkFVTFRTLCBvcHRpb25zKVxyXG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gIH1cclxuXHJcbiAgQnV0dG9uLlZFUlNJT04gID0gJzMuNC4xJ1xyXG5cclxuICBCdXR0b24uREVGQVVMVFMgPSB7XHJcbiAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXHJcbiAgfVxyXG5cclxuICBCdXR0b24ucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICB2YXIgZCAgICA9ICdkaXNhYmxlZCdcclxuICAgIHZhciAkZWwgID0gdGhpcy4kZWxlbWVudFxyXG4gICAgdmFyIHZhbCAgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xyXG4gICAgdmFyIGRhdGEgPSAkZWwuZGF0YSgpXHJcblxyXG4gICAgc3RhdGUgKz0gJ1RleHQnXHJcblxyXG4gICAgaWYgKGRhdGEucmVzZXRUZXh0ID09IG51bGwpICRlbC5kYXRhKCdyZXNldFRleHQnLCAkZWxbdmFsXSgpKVxyXG5cclxuICAgIC8vIHB1c2ggdG8gZXZlbnQgbG9vcCB0byBhbGxvdyBmb3JtcyB0byBzdWJtaXRcclxuICAgIHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRlbFt2YWxdKGRhdGFbc3RhdGVdID09IG51bGwgPyB0aGlzLm9wdGlvbnNbc3RhdGVdIDogZGF0YVtzdGF0ZV0pXHJcblxyXG4gICAgICBpZiAoc3RhdGUgPT0gJ2xvYWRpbmdUZXh0Jykge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxyXG4gICAgICAgICRlbC5hZGRDbGFzcyhkKS5hdHRyKGQsIGQpLnByb3AoZCwgdHJ1ZSlcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTG9hZGluZykge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoZCkucmVtb3ZlQXR0cihkKS5wcm9wKGQsIGZhbHNlKVxyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKSwgMClcclxuICB9XHJcblxyXG4gIEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNoYW5nZWQgPSB0cnVlXHJcbiAgICB2YXIgJHBhcmVudCA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScpXHJcblxyXG4gICAgaWYgKCRwYXJlbnQubGVuZ3RoKSB7XHJcbiAgICAgIHZhciAkaW5wdXQgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2lucHV0JylcclxuICAgICAgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ3JhZGlvJykge1xyXG4gICAgICAgIGlmICgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSBjaGFuZ2VkID0gZmFsc2VcclxuICAgICAgICAkcGFyZW50LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICB9IGVsc2UgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgIGlmICgoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgIT09IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBjaGFuZ2VkID0gZmFsc2VcclxuICAgICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICB9XHJcbiAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXHJcbiAgICAgIGlmIChjaGFuZ2VkKSAkaW5wdXQudHJpZ2dlcignY2hhbmdlJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1wcmVzc2VkJywgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxyXG4gICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vIEJVVFRPTiBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXHJcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYnV0dG9uJylcclxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxyXG5cclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5idXR0b24nLCAoZGF0YSA9IG5ldyBCdXR0b24odGhpcywgb3B0aW9ucykpKVxyXG5cclxuICAgICAgaWYgKG9wdGlvbiA9PSAndG9nZ2xlJykgZGF0YS50b2dnbGUoKVxyXG4gICAgICBlbHNlIGlmIChvcHRpb24pIGRhdGEuc2V0U3RhdGUob3B0aW9uKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLmJ1dHRvblxyXG5cclxuICAkLmZuLmJ1dHRvbiAgICAgICAgICAgICA9IFBsdWdpblxyXG4gICQuZm4uYnV0dG9uLkNvbnN0cnVjdG9yID0gQnV0dG9uXHJcblxyXG5cclxuICAvLyBCVVRUT04gTk8gQ09ORkxJQ1RcclxuICAvLyA9PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5idXR0b24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm4uYnV0dG9uID0gb2xkXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIEJVVFRPTiBEQVRBLUFQSVxyXG4gIC8vID09PT09PT09PT09PT09PVxyXG5cclxuICAkKGRvY3VtZW50KVxyXG4gICAgLm9uKCdjbGljay5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciAkYnRuID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpXHJcbiAgICAgIFBsdWdpbi5jYWxsKCRidG4sICd0b2dnbGUnKVxyXG4gICAgICBpZiAoISgkKGUudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkpIHtcclxuICAgICAgICAvLyBQcmV2ZW50IGRvdWJsZSBjbGljayBvbiByYWRpb3MsIGFuZCB0aGUgZG91YmxlIHNlbGVjdGlvbnMgKHNvIGNhbmNlbGxhdGlvbikgb24gY2hlY2tib3hlc1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIC8vIFRoZSB0YXJnZXQgY29tcG9uZW50IHN0aWxsIHJlY2VpdmUgdGhlIGZvY3VzXHJcbiAgICAgICAgaWYgKCRidG4uaXMoJ2lucHV0LGJ1dHRvbicpKSAkYnRuLnRyaWdnZXIoJ2ZvY3VzJylcclxuICAgICAgICBlbHNlICRidG4uZmluZCgnaW5wdXQ6dmlzaWJsZSxidXR0b246dmlzaWJsZScpLmZpcnN0KCkudHJpZ2dlcignZm9jdXMnKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLm9uKCdmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKS50b2dnbGVDbGFzcygnZm9jdXMnLCAvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpXHJcbiAgICB9KVxyXG5cclxufShqUXVlcnkpO1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIEJvb3RzdHJhcDogY2Fyb3VzZWwuanMgdjMuNC4xXHJcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjYXJvdXNlbFxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXHJcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgLy8gQ0FST1VTRUwgQ0xBU1MgREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgICAgPSAkKGVsZW1lbnQpXHJcbiAgICB0aGlzLiRpbmRpY2F0b3JzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuY2Fyb3VzZWwtaW5kaWNhdG9ycycpXHJcbiAgICB0aGlzLm9wdGlvbnMgICAgID0gb3B0aW9uc1xyXG4gICAgdGhpcy5wYXVzZWQgICAgICA9IG51bGxcclxuICAgIHRoaXMuc2xpZGluZyAgICAgPSBudWxsXHJcbiAgICB0aGlzLmludGVydmFsICAgID0gbnVsbFxyXG4gICAgdGhpcy4kYWN0aXZlICAgICA9IG51bGxcclxuICAgIHRoaXMuJGl0ZW1zICAgICAgPSBudWxsXHJcblxyXG4gICAgdGhpcy5vcHRpb25zLmtleWJvYXJkICYmIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpXHJcblxyXG4gICAgdGhpcy5vcHRpb25zLnBhdXNlID09ICdob3ZlcicgJiYgISgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpICYmIHRoaXMuJGVsZW1lbnRcclxuICAgICAgLm9uKCdtb3VzZWVudGVyLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLnBhdXNlLCB0aGlzKSlcclxuICAgICAgLm9uKCdtb3VzZWxlYXZlLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcclxuICB9XHJcblxyXG4gIENhcm91c2VsLlZFUlNJT04gID0gJzMuNC4xJ1xyXG5cclxuICBDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gNjAwXHJcblxyXG4gIENhcm91c2VsLkRFRkFVTFRTID0ge1xyXG4gICAgaW50ZXJ2YWw6IDUwMDAsXHJcbiAgICBwYXVzZTogJ2hvdmVyJyxcclxuICAgIHdyYXA6IHRydWUsXHJcbiAgICBrZXlib2FyZDogdHJ1ZVxyXG4gIH1cclxuXHJcbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxyXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XHJcbiAgICAgIGNhc2UgMzc6IHRoaXMucHJldigpOyBicmVha1xyXG4gICAgICBjYXNlIDM5OiB0aGlzLm5leHQoKTsgYnJlYWtcclxuICAgICAgZGVmYXVsdDogcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgfVxyXG5cclxuICBDYXJvdXNlbC5wcm90b3R5cGUuY3ljbGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSBmYWxzZSlcclxuXHJcbiAgICB0aGlzLmludGVydmFsICYmIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWxcclxuICAgICAgJiYgIXRoaXMucGF1c2VkXHJcbiAgICAgICYmICh0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoJC5wcm94eSh0aGlzLm5leHQsIHRoaXMpLCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwpKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgIHRoaXMuJGl0ZW1zID0gaXRlbS5wYXJlbnQoKS5jaGlsZHJlbignLml0ZW0nKVxyXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmluZGV4KGl0ZW0gfHwgdGhpcy4kYWN0aXZlKVxyXG4gIH1cclxuXHJcbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhY3RpdmUpIHtcclxuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGFjdGl2ZSlcclxuICAgIHZhciB3aWxsV3JhcCA9IChkaXJlY3Rpb24gPT0gJ3ByZXYnICYmIGFjdGl2ZUluZGV4ID09PSAwKVxyXG4gICAgICAgICAgICAgICAgfHwgKGRpcmVjdGlvbiA9PSAnbmV4dCcgJiYgYWN0aXZlSW5kZXggPT0gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpKVxyXG4gICAgaWYgKHdpbGxXcmFwICYmICF0aGlzLm9wdGlvbnMud3JhcCkgcmV0dXJuIGFjdGl2ZVxyXG4gICAgdmFyIGRlbHRhID0gZGlyZWN0aW9uID09ICdwcmV2JyA/IC0xIDogMVxyXG4gICAgdmFyIGl0ZW1JbmRleCA9IChhY3RpdmVJbmRleCArIGRlbHRhKSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxyXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmVxKGl0ZW1JbmRleClcclxuICB9XHJcblxyXG4gIENhcm91c2VsLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgIHZhciB0aGF0ICAgICAgICA9IHRoaXNcclxuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJykpXHJcblxyXG4gICAgaWYgKHBvcyA+ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSB8fCBwb3MgPCAwKSByZXR1cm5cclxuXHJcbiAgICBpZiAodGhpcy5zbGlkaW5nKSAgICAgICByZXR1cm4gdGhpcy4kZWxlbWVudC5vbmUoJ3NsaWQuYnMuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoKSB7IHRoYXQudG8ocG9zKSB9KSAvLyB5ZXMsIFwic2xpZFwiXHJcbiAgICBpZiAoYWN0aXZlSW5kZXggPT0gcG9zKSByZXR1cm4gdGhpcy5wYXVzZSgpLmN5Y2xlKClcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zbGlkZShwb3MgPiBhY3RpdmVJbmRleCA/ICduZXh0JyA6ICdwcmV2JywgdGhpcy4kaXRlbXMuZXEocG9zKSlcclxuICB9XHJcblxyXG4gIENhcm91c2VsLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IHRydWUpXHJcblxyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCgnLm5leHQsIC5wcmV2JykubGVuZ3RoICYmICQuc3VwcG9ydC50cmFuc2l0aW9uKSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpXHJcbiAgICAgIHRoaXMuY3ljbGUodHJ1ZSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmludGVydmFsID0gY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICBDYXJvdXNlbC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxyXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ25leHQnKVxyXG4gIH1cclxuXHJcbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cclxuICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcclxuICB9XHJcblxyXG4gIENhcm91c2VsLnByb3RvdHlwZS5zbGlkZSA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XHJcbiAgICB2YXIgJGFjdGl2ZSAgID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKVxyXG4gICAgdmFyICRuZXh0ICAgICA9IG5leHQgfHwgdGhpcy5nZXRJdGVtRm9yRGlyZWN0aW9uKHR5cGUsICRhY3RpdmUpXHJcbiAgICB2YXIgaXNDeWNsaW5nID0gdGhpcy5pbnRlcnZhbFxyXG4gICAgdmFyIGRpcmVjdGlvbiA9IHR5cGUgPT0gJ25leHQnID8gJ2xlZnQnIDogJ3JpZ2h0J1xyXG4gICAgdmFyIHRoYXQgICAgICA9IHRoaXNcclxuXHJcbiAgICBpZiAoJG5leHQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm4gKHRoaXMuc2xpZGluZyA9IGZhbHNlKVxyXG5cclxuICAgIHZhciByZWxhdGVkVGFyZ2V0ID0gJG5leHRbMF1cclxuICAgIHZhciBzbGlkZUV2ZW50ID0gJC5FdmVudCgnc2xpZGUuYnMuY2Fyb3VzZWwnLCB7XHJcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsXHJcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXHJcbiAgICB9KVxyXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRlRXZlbnQpXHJcbiAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgdGhpcy5zbGlkaW5nID0gdHJ1ZVxyXG5cclxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLnBhdXNlKClcclxuXHJcbiAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy4kaW5kaWNhdG9ycy5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgIHZhciAkbmV4dEluZGljYXRvciA9ICQodGhpcy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoaXMuZ2V0SXRlbUluZGV4KCRuZXh0KV0pXHJcbiAgICAgICRuZXh0SW5kaWNhdG9yICYmICRuZXh0SW5kaWNhdG9yLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KCdzbGlkLmJzLmNhcm91c2VsJywgeyByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9KSAvLyB5ZXMsIFwic2xpZFwiXHJcbiAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnc2xpZGUnKSkge1xyXG4gICAgICAkbmV4dC5hZGRDbGFzcyh0eXBlKVxyXG4gICAgICBpZiAodHlwZW9mICRuZXh0ID09PSAnb2JqZWN0JyAmJiAkbmV4dC5sZW5ndGgpIHtcclxuICAgICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcclxuICAgICAgfVxyXG4gICAgICAkYWN0aXZlLmFkZENsYXNzKGRpcmVjdGlvbilcclxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxyXG4gICAgICAkYWN0aXZlXHJcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoWydhY3RpdmUnLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSlcclxuICAgICAgICAgIHRoYXQuc2xpZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcclxuICAgICAgICAgIH0sIDApXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgICRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICB0aGlzLnNsaWRpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxyXG4gICAgfVxyXG5cclxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxyXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcclxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ2Fyb3VzZWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXHJcbiAgICAgIHZhciBhY3Rpb24gID0gdHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyA/IG9wdGlvbiA6IG9wdGlvbnMuc2xpZGVcclxuXHJcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnLCAoZGF0YSA9IG5ldyBDYXJvdXNlbCh0aGlzLCBvcHRpb25zKSkpXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdudW1iZXInKSBkYXRhLnRvKG9wdGlvbilcclxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxyXG4gICAgICBlbHNlIGlmIChvcHRpb25zLmludGVydmFsKSBkYXRhLnBhdXNlKCkuY3ljbGUoKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLmNhcm91c2VsXHJcblxyXG4gICQuZm4uY2Fyb3VzZWwgICAgICAgICAgICAgPSBQbHVnaW5cclxuICAkLmZuLmNhcm91c2VsLkNvbnN0cnVjdG9yID0gQ2Fyb3VzZWxcclxuXHJcblxyXG4gIC8vIENBUk9VU0VMIE5PIENPTkZMSUNUXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5jYXJvdXNlbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG5cclxuICAvLyBDQVJPVVNFTCBEQVRBLUFQSVxyXG4gIC8vID09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXHJcbiAgICB2YXIgaHJlZiAgICA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxyXG4gICAgaWYgKGhyZWYpIHtcclxuICAgICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGFyZ2V0ICA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHwgaHJlZlxyXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcclxuXHJcbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxyXG5cclxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXHJcbiAgICB2YXIgc2xpZGVJbmRleCA9ICR0aGlzLmF0dHIoJ2RhdGEtc2xpZGUtdG8nKVxyXG4gICAgaWYgKHNsaWRlSW5kZXgpIG9wdGlvbnMuaW50ZXJ2YWwgPSBmYWxzZVxyXG5cclxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbnMpXHJcblxyXG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcclxuICAgICAgJHRhcmdldC5kYXRhKCdicy5jYXJvdXNlbCcpLnRvKHNsaWRlSW5kZXgpXHJcbiAgICB9XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgfVxyXG5cclxuICAkKGRvY3VtZW50KVxyXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZV0nLCBjbGlja0hhbmRsZXIpXHJcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlLXRvXScsIGNsaWNrSGFuZGxlcilcclxuXHJcbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkY2Fyb3VzZWwgPSAkKHRoaXMpXHJcbiAgICAgIFBsdWdpbi5jYWxsKCRjYXJvdXNlbCwgJGNhcm91c2VsLmRhdGEoKSlcclxuICAgIH0pXHJcbiAgfSlcclxuXHJcbn0oalF1ZXJ5KTtcclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IGNvbGxhcHNlLmpzIHYzLjQuMVxyXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY29sbGFwc2VcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbi8qIGpzaGludCBsYXRlZGVmOiBmYWxzZSAqL1xyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBDT0xMQVBTRSBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBDb2xsYXBzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgPSAkKGVsZW1lbnQpXHJcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsIG9wdGlvbnMpXHJcbiAgICB0aGlzLiR0cmlnZ2VyICAgICAgPSAkKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXSwnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXScpXHJcbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSBudWxsXHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcclxuICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCwgdGhpcy4kdHJpZ2dlcilcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkgdGhpcy50b2dnbGUoKVxyXG4gIH1cclxuXHJcbiAgQ29sbGFwc2UuVkVSU0lPTiAgPSAnMy40LjEnXHJcblxyXG4gIENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzNTBcclxuXHJcbiAgQ29sbGFwc2UuREVGQVVMVFMgPSB7XHJcbiAgICB0b2dnbGU6IHRydWVcclxuICB9XHJcblxyXG4gIENvbGxhcHNlLnByb3RvdHlwZS5kaW1lbnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXHJcbiAgICByZXR1cm4gaGFzV2lkdGggPyAnd2lkdGgnIDogJ2hlaWdodCdcclxuICB9XHJcblxyXG4gIENvbGxhcHNlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cclxuXHJcbiAgICB2YXIgYWN0aXZlc0RhdGFcclxuICAgIHZhciBhY3RpdmVzID0gdGhpcy4kcGFyZW50ICYmIHRoaXMuJHBhcmVudC5jaGlsZHJlbignLnBhbmVsJykuY2hpbGRyZW4oJy5pbiwgLmNvbGxhcHNpbmcnKVxyXG5cclxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XHJcbiAgICAgIGFjdGl2ZXNEYXRhID0gYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScpXHJcbiAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMuY29sbGFwc2UnKVxyXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXHJcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcclxuICAgICAgUGx1Z2luLmNhbGwoYWN0aXZlcywgJ2hpZGUnKVxyXG4gICAgICBhY3RpdmVzRGF0YSB8fCBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJywgbnVsbClcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXHJcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpW2RpbWVuc2lvbl0oMClcclxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxyXG5cclxuICAgIHRoaXMuJHRyaWdnZXJcclxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxyXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXHJcblxyXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxyXG5cclxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZSBpbicpW2RpbWVuc2lvbl0oJycpXHJcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcclxuICAgICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAgIC50cmlnZ2VyKCdzaG93bi5icy5jb2xsYXBzZScpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcclxuXHJcbiAgICB2YXIgc2Nyb2xsU2l6ZSA9ICQuY2FtZWxDYXNlKFsnc2Nyb2xsJywgZGltZW5zaW9uXS5qb2luKCctJykpXHJcblxyXG4gICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcclxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pW2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFswXVtzY3JvbGxTaXplXSlcclxuICB9XHJcblxyXG4gIENvbGxhcHNlLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXHJcblxyXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLmNvbGxhcHNlJylcclxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxyXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxyXG5cclxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXHJcblxyXG4gICAgdGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSgpKVswXS5vZmZzZXRIZWlnaHRcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpXHJcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKVxyXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxyXG5cclxuICAgIHRoaXMuJHRyaWdnZXJcclxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKVxyXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxyXG5cclxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcclxuXHJcbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcclxuICAgICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXHJcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZScpXHJcbiAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy5jb2xsYXBzZScpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgIFtkaW1lbnNpb25dKDApXHJcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxyXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilcclxuICB9XHJcblxyXG4gIENvbGxhcHNlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzW3RoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykgPyAnaGlkZScgOiAnc2hvdyddKClcclxuICB9XHJcblxyXG4gIENvbGxhcHNlLnByb3RvdHlwZS5nZXRQYXJlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMucGFyZW50KVxyXG4gICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInICsgdGhpcy5vcHRpb25zLnBhcmVudCArICdcIl0nKVxyXG4gICAgICAuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxyXG4gICAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGdldFRhcmdldEZyb21UcmlnZ2VyKCRlbGVtZW50KSwgJGVsZW1lbnQpXHJcbiAgICAgIH0sIHRoaXMpKVxyXG4gICAgICAuZW5kKClcclxuICB9XHJcblxyXG4gIENvbGxhcHNlLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICR0cmlnZ2VyKSB7XHJcbiAgICB2YXIgaXNPcGVuID0gJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJylcclxuXHJcbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxyXG4gICAgJHRyaWdnZXJcclxuICAgICAgLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnLCAhaXNPcGVuKVxyXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFRhcmdldEZyb21UcmlnZ2VyKCR0cmlnZ2VyKSB7XHJcbiAgICB2YXIgaHJlZlxyXG4gICAgdmFyIHRhcmdldCA9ICR0cmlnZ2VyLmF0dHIoJ2RhdGEtdGFyZ2V0JylcclxuICAgICAgfHwgKGhyZWYgPSAkdHJpZ2dlci5hdHRyKCdocmVmJykpICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcclxuXHJcbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ09MTEFQU0UgUExVR0lOIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXHJcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnKVxyXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcclxuXHJcbiAgICAgIGlmICghZGF0YSAmJiBvcHRpb25zLnRvZ2dsZSAmJiAvc2hvd3xoaWRlLy50ZXN0KG9wdGlvbikpIG9wdGlvbnMudG9nZ2xlID0gZmFsc2VcclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScsIChkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIG9wdGlvbnMpKSlcclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdmFyIG9sZCA9ICQuZm4uY29sbGFwc2VcclxuXHJcbiAgJC5mbi5jb2xsYXBzZSAgICAgICAgICAgICA9IFBsdWdpblxyXG4gICQuZm4uY29sbGFwc2UuQ29uc3RydWN0b3IgPSBDb2xsYXBzZVxyXG5cclxuXHJcbiAgLy8gQ09MTEFQU0UgTk8gQ09ORkxJQ1RcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAkLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENPTExBUFNFIERBVEEtQVBJXHJcbiAgLy8gPT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmNvbGxhcHNlLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxyXG5cclxuICAgIGlmICghJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgdmFyICR0YXJnZXQgPSBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdGhpcylcclxuICAgIHZhciBkYXRhICAgID0gJHRhcmdldC5kYXRhKCdicy5jb2xsYXBzZScpXHJcbiAgICB2YXIgb3B0aW9uICA9IGRhdGEgPyAndG9nZ2xlJyA6ICR0aGlzLmRhdGEoKVxyXG5cclxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbilcclxuICB9KVxyXG5cclxufShqUXVlcnkpO1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIEJvb3RzdHJhcDogZHJvcGRvd24uanMgdjMuNC4xXHJcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNkcm9wZG93bnNcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8vIERST1BET1dOIENMQVNTIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBiYWNrZHJvcCA9ICcuZHJvcGRvd24tYmFja2Ryb3AnXHJcbiAgdmFyIHRvZ2dsZSAgID0gJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJ1xyXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAkKGVsZW1lbnQpLm9uKCdjbGljay5icy5kcm9wZG93bicsIHRoaXMudG9nZ2xlKVxyXG4gIH1cclxuXHJcbiAgRHJvcGRvd24uVkVSU0lPTiA9ICczLjQuMSdcclxuXHJcbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XHJcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXHJcblxyXG4gICAgaWYgKCFzZWxlY3Rvcikge1xyXG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxyXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIC8jW0EtWmEtel0vLnRlc3Qoc2VsZWN0b3IpICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRwYXJlbnQgPSBzZWxlY3RvciAhPT0gJyMnID8gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcikgOiBudWxsXHJcblxyXG4gICAgcmV0dXJuICRwYXJlbnQgJiYgJHBhcmVudC5sZW5ndGggPyAkcGFyZW50IDogJHRoaXMucGFyZW50KClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsZWFyTWVudXMoZSkge1xyXG4gICAgaWYgKGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuXHJcbiAgICAkKGJhY2tkcm9wKS5yZW1vdmUoKVxyXG4gICAgJCh0b2dnbGUpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRoaXMgICAgICAgICA9ICQodGhpcylcclxuICAgICAgdmFyICRwYXJlbnQgICAgICAgPSBnZXRQYXJlbnQoJHRoaXMpXHJcbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cclxuXHJcbiAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnb3BlbicpKSByZXR1cm5cclxuXHJcbiAgICAgIGlmIChlICYmIGUudHlwZSA9PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucygkcGFyZW50WzBdLCBlLnRhcmdldCkpIHJldHVyblxyXG5cclxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdoaWRlLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXHJcblxyXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgICAkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcclxuICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJC5FdmVudCgnaGlkZGVuLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXHJcblxyXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cclxuXHJcbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXHJcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcclxuXHJcbiAgICBjbGVhck1lbnVzKClcclxuXHJcbiAgICBpZiAoIWlzQWN0aXZlKSB7XHJcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgISRwYXJlbnQuY2xvc2VzdCgnLm5hdmJhci1uYXYnKS5sZW5ndGgpIHtcclxuICAgICAgICAvLyBpZiBtb2JpbGUgd2UgdXNlIGEgYmFja2Ryb3AgYmVjYXVzZSBjbGljayBldmVudHMgZG9uJ3QgZGVsZWdhdGVcclxuICAgICAgICAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxyXG4gICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1iYWNrZHJvcCcpXHJcbiAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoJCh0aGlzKSlcclxuICAgICAgICAgIC5vbignY2xpY2snLCBjbGVhck1lbnVzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XHJcbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnc2hvdy5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxyXG5cclxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxyXG5cclxuICAgICAgJHRoaXNcclxuICAgICAgICAudHJpZ2dlcignZm9jdXMnKVxyXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxyXG5cclxuICAgICAgJHBhcmVudFxyXG4gICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpXHJcbiAgICAgICAgLnRyaWdnZXIoJC5FdmVudCgnc2hvd24uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmICghLygzOHw0MHwyN3wzMikvLnRlc3QoZS53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXHJcblxyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXHJcblxyXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxyXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXHJcblxyXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBlLndoaWNoICE9IDI3IHx8IGlzQWN0aXZlICYmIGUud2hpY2ggPT0gMjcpIHtcclxuICAgICAgaWYgKGUud2hpY2ggPT0gMjcpICRwYXJlbnQuZmluZCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJylcclxuICAgICAgcmV0dXJuICR0aGlzLnRyaWdnZXIoJ2NsaWNrJylcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGVzYyA9ICcgbGk6bm90KC5kaXNhYmxlZCk6dmlzaWJsZSBhJ1xyXG4gICAgdmFyICRpdGVtcyA9ICRwYXJlbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnICsgZGVzYylcclxuXHJcbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgIHZhciBpbmRleCA9ICRpdGVtcy5pbmRleChlLnRhcmdldClcclxuXHJcbiAgICBpZiAoZS53aGljaCA9PSAzOCAmJiBpbmRleCA+IDApICAgICAgICAgICAgICAgICBpbmRleC0tICAgICAgICAgLy8gdXBcclxuICAgIGlmIChlLndoaWNoID09IDQwICYmIGluZGV4IDwgJGl0ZW1zLmxlbmd0aCAtIDEpIGluZGV4KysgICAgICAgICAvLyBkb3duXHJcbiAgICBpZiAoIX5pbmRleCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDBcclxuXHJcbiAgICAkaXRlbXMuZXEoaW5kZXgpLnRyaWdnZXIoJ2ZvY3VzJylcclxuICB9XHJcblxyXG5cclxuICAvLyBEUk9QRE9XTiBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXHJcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJylcclxuXHJcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nLCAoZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSkpXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB2YXIgb2xkID0gJC5mbi5kcm9wZG93blxyXG5cclxuICAkLmZuLmRyb3Bkb3duICAgICAgICAgICAgID0gUGx1Z2luXHJcbiAgJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3RvciA9IERyb3Bkb3duXHJcblxyXG5cclxuICAvLyBEUk9QRE9XTiBOTyBDT05GTElDVFxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZm4uZHJvcGRvd24gPSBvbGRcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAkKGRvY3VtZW50KVxyXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGNsZWFyTWVudXMpXHJcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93biBmb3JtJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9KVxyXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcclxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXHJcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duLW1lbnUnLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcclxuXHJcbn0oalF1ZXJ5KTtcclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IG1vZGFsLmpzIHYzLjQuMVxyXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jbW9kYWxzXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBNT0RBTCBDTEFTUyBERUZJTklUSU9OXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgTW9kYWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gICAgdGhpcy4kYm9keSA9ICQoZG9jdW1lbnQuYm9keSlcclxuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXHJcbiAgICB0aGlzLiRkaWFsb2cgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5tb2RhbC1kaWFsb2cnKVxyXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXHJcbiAgICB0aGlzLmlzU2hvd24gPSBudWxsXHJcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IG51bGxcclxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAwXHJcbiAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxyXG4gICAgdGhpcy5maXhlZENvbnRlbnQgPSAnLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tJ1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3RlKSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAuZmluZCgnLm1vZGFsLWNvbnRlbnQnKVxyXG4gICAgICAgIC5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsICQucHJveHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQuYnMubW9kYWwnKVxyXG4gICAgICAgIH0sIHRoaXMpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgTW9kYWwuVkVSU0lPTiA9ICczLjQuMSdcclxuXHJcbiAgTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDMwMFxyXG4gIE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcclxuXHJcbiAgTW9kYWwuREVGQVVMVFMgPSB7XHJcbiAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgc2hvdzogdHJ1ZVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KF9yZWxhdGVkVGFyZ2V0KVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxyXG5cclxuICAgIGlmICh0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgdGhpcy5pc1Nob3duID0gdHJ1ZVxyXG5cclxuICAgIHRoaXMuY2hlY2tTY3JvbGxiYXIoKVxyXG4gICAgdGhpcy5zZXRTY3JvbGxiYXIoKVxyXG4gICAgdGhpcy4kYm9keS5hZGRDbGFzcygnbW9kYWwtb3BlbicpXHJcblxyXG4gICAgdGhpcy5lc2NhcGUoKVxyXG4gICAgdGhpcy5yZXNpemUoKVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKVxyXG5cclxuICAgIHRoaXMuJGRpYWxvZy5vbignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoYXQuJGVsZW1lbnQub25lKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGF0LiRlbGVtZW50KSkgdGhhdC5pZ25vcmVCYWNrZHJvcENsaWNrID0gdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRyYW5zaXRpb24gPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGF0LiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJylcclxuXHJcbiAgICAgIGlmICghdGhhdC4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGgpIHtcclxuICAgICAgICB0aGF0LiRlbGVtZW50LmFwcGVuZFRvKHRoYXQuJGJvZHkpIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGF0LiRlbGVtZW50XHJcbiAgICAgICAgLnNob3coKVxyXG4gICAgICAgIC5zY3JvbGxUb3AoMClcclxuXHJcbiAgICAgIHRoYXQuYWRqdXN0RGlhbG9nKClcclxuXHJcbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgdGhhdC4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC4kZWxlbWVudC5hZGRDbGFzcygnaW4nKVxyXG5cclxuICAgICAgdGhhdC5lbmZvcmNlRm9jdXMoKVxyXG5cclxuICAgICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93bi5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcclxuXHJcbiAgICAgIHRyYW5zaXRpb24gP1xyXG4gICAgICAgIHRoYXQuJGRpYWxvZyAvLyB3YWl0IGZvciBtb2RhbCB0byBzbGlkZSBpblxyXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBNb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgZSA9ICQuRXZlbnQoJ2hpZGUuYnMubW9kYWwnKVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxyXG5cclxuICAgIGlmICghdGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxyXG5cclxuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXHJcblxyXG4gICAgdGhpcy5lc2NhcGUoKVxyXG4gICAgdGhpcy5yZXNpemUoKVxyXG5cclxuICAgICQoZG9jdW1lbnQpLm9mZignZm9jdXNpbi5icy5tb2RhbCcpXHJcblxyXG4gICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2luJylcclxuICAgICAgLm9mZignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcpXHJcbiAgICAgIC5vZmYoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcpXHJcblxyXG4gICAgdGhpcy4kZGlhbG9nLm9mZignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnKVxyXG5cclxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KHRoaXMuaGlkZU1vZGFsLCB0aGlzKSlcclxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxyXG4gICAgICB0aGlzLmhpZGVNb2RhbCgpXHJcbiAgfVxyXG5cclxuICBNb2RhbC5wcm90b3R5cGUuZW5mb3JjZUZvY3VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJChkb2N1bWVudClcclxuICAgICAgLm9mZignZm9jdXNpbi5icy5tb2RhbCcpIC8vIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxyXG4gICAgICAub24oJ2ZvY3VzaW4uYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50ICE9PSBlLnRhcmdldCAmJlxyXG4gICAgICAgICAgdGhpcy4kZWxlbWVudFswXSAhPT0gZS50YXJnZXQgJiZcclxuICAgICAgICAgICF0aGlzLiRlbGVtZW50LmhhcyhlLnRhcmdldCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJylcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMpKVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLndoaWNoID09IDI3ICYmIHRoaXMuaGlkZSgpXHJcbiAgICAgIH0sIHRoaXMpKVxyXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duKSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmlzU2hvd24pIHtcclxuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYnMubW9kYWwnLCAkLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLCB0aGlzKSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZS5icy5tb2RhbCcpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBNb2RhbC5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICB0aGlzLiRlbGVtZW50LmhpZGUoKVxyXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoYXQuJGJvZHkucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKVxyXG4gICAgICB0aGF0LnJlc2V0QWRqdXN0bWVudHMoKVxyXG4gICAgICB0aGF0LnJlc2V0U2Nyb2xsYmFyKClcclxuICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRkZW4uYnMubW9kYWwnKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIE1vZGFsLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuJGJhY2tkcm9wICYmIHRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpXHJcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcclxuICB9XHJcblxyXG4gIE1vZGFsLnByb3RvdHlwZS5iYWNrZHJvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICB2YXIgYW5pbWF0ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/ICdmYWRlJyA6ICcnXHJcblxyXG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMuYmFja2Ryb3ApIHtcclxuICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcclxuXHJcbiAgICAgIHRoaXMuJGJhY2tkcm9wID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcclxuICAgICAgICAuYWRkQ2xhc3MoJ21vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlKVxyXG4gICAgICAgIC5hcHBlbmRUbyh0aGlzLiRib2R5KVxyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrKSB7XHJcbiAgICAgICAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm5cclxuICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYydcclxuICAgICAgICAgID8gdGhpcy4kZWxlbWVudFswXS5mb2N1cygpXHJcbiAgICAgICAgICA6IHRoaXMuaGlkZSgpXHJcbiAgICAgIH0sIHRoaXMpKVxyXG5cclxuICAgICAgaWYgKGRvQW5pbWF0ZSkgdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XHJcblxyXG4gICAgICB0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcygnaW4nKVxyXG5cclxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuXHJcblxyXG4gICAgICBkb0FuaW1hdGUgP1xyXG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXHJcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFjaylcclxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgICAgY2FsbGJhY2soKVxyXG5cclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93biAmJiB0aGlzLiRiYWNrZHJvcCkge1xyXG4gICAgICB0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcygnaW4nKVxyXG5cclxuICAgICAgdmFyIGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoYXQucmVtb3ZlQmFja2Ryb3AoKVxyXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcclxuICAgICAgfVxyXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xyXG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXHJcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFja1JlbW92ZSlcclxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgICAgY2FsbGJhY2tSZW1vdmUoKVxyXG5cclxuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgY2FsbGJhY2soKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdGhlc2UgZm9sbG93aW5nIG1ldGhvZHMgYXJlIHVzZWQgdG8gaGFuZGxlIG92ZXJmbG93aW5nIG1vZGFsc1xyXG5cclxuICBNb2RhbC5wcm90b3R5cGUuaGFuZGxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5hZGp1c3REaWFsb2coKVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLmFkanVzdERpYWxvZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBtb2RhbElzT3ZlcmZsb3dpbmcgPSB0aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XHJcbiAgICAgIHBhZGRpbmdMZWZ0OiAhdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiBtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJycsXHJcbiAgICAgIHBhZGRpbmdSaWdodDogdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiAhbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XHJcbiAgICAgIHBhZGRpbmdMZWZ0OiAnJyxcclxuICAgICAgcGFkZGluZ1JpZ2h0OiAnJ1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIE1vZGFsLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgaWYgKCFmdWxsV2luZG93V2lkdGgpIHsgLy8gd29ya2Fyb3VuZCBmb3IgbWlzc2luZyB3aW5kb3cuaW5uZXJXaWR0aCBpbiBJRThcclxuICAgICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgZnVsbFdpbmRvd1dpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdClcclxuICAgIH1cclxuICAgIHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpbmRvd1dpZHRoXHJcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5tZWFzdXJlU2Nyb2xsYmFyKClcclxuICB9XHJcblxyXG4gIE1vZGFsLnByb3RvdHlwZS5zZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYm9keVBhZCA9IHBhcnNlSW50KCh0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcpIHx8IDApLCAxMClcclxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgJydcclxuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGhcclxuICAgIGlmICh0aGlzLmJvZHlJc092ZXJmbG93aW5nKSB7XHJcbiAgICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgYm9keVBhZCArIHNjcm9sbGJhcldpZHRoKVxyXG4gICAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBhY3R1YWxQYWRkaW5nID0gZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHRcclxuICAgICAgICB2YXIgY2FsY3VsYXRlZFBhZGRpbmcgPSAkKGVsZW1lbnQpLmNzcygncGFkZGluZy1yaWdodCcpXHJcbiAgICAgICAgJChlbGVtZW50KVxyXG4gICAgICAgICAgLmRhdGEoJ3BhZGRpbmctcmlnaHQnLCBhY3R1YWxQYWRkaW5nKVxyXG4gICAgICAgICAgLmNzcygncGFkZGluZy1yaWdodCcsIHBhcnNlRmxvYXQoY2FsY3VsYXRlZFBhZGRpbmcpICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCB0aGlzLm9yaWdpbmFsQm9keVBhZClcclxuICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgIHZhciBwYWRkaW5nID0gJChlbGVtZW50KS5kYXRhKCdwYWRkaW5nLXJpZ2h0JylcclxuICAgICAgJChlbGVtZW50KS5yZW1vdmVEYXRhKCdwYWRkaW5nLXJpZ2h0JylcclxuICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nID8gcGFkZGluZyA6ICcnXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgTW9kYWwucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7IC8vIHRoeCB3YWxzaFxyXG4gICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJ1xyXG4gICAgdGhpcy4kYm9keS5hcHBlbmQoc2Nyb2xsRGl2KVxyXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoXHJcbiAgICB0aGlzLiRib2R5WzBdLnJlbW92ZUNoaWxkKHNjcm9sbERpdilcclxuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aFxyXG4gIH1cclxuXHJcblxyXG4gIC8vIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbiwgX3JlbGF0ZWRUYXJnZXQpIHtcclxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXHJcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnYnMubW9kYWwnKVxyXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNb2RhbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcclxuXHJcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMubW9kYWwnLCAoZGF0YSA9IG5ldyBNb2RhbCh0aGlzLCBvcHRpb25zKSkpXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oX3JlbGF0ZWRUYXJnZXQpXHJcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuc2hvdykgZGF0YS5zaG93KF9yZWxhdGVkVGFyZ2V0KVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLm1vZGFsXHJcblxyXG4gICQuZm4ubW9kYWwgPSBQbHVnaW5cclxuICAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yID0gTW9kYWxcclxuXHJcblxyXG4gIC8vIE1PREFMIE5PIENPTkZMSUNUXHJcbiAgLy8gPT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi5tb2RhbCA9IG9sZFxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG5cclxuICAvLyBNT0RBTCBEQVRBLUFQSVxyXG4gIC8vID09PT09PT09PT09PT09XHJcblxyXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5tb2RhbC5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXHJcbiAgICB2YXIgaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxyXG4gICAgdmFyIHRhcmdldCA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHxcclxuICAgICAgKGhyZWYgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vIHN0cmlwIGZvciBpZTdcclxuXHJcbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxyXG4gICAgdmFyIG9wdGlvbiA9ICR0YXJnZXQuZGF0YSgnYnMubW9kYWwnKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoeyByZW1vdGU6ICEvIy8udGVzdChocmVmKSAmJiBocmVmIH0sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXHJcblxyXG4gICAgaWYgKCR0aGlzLmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICR0YXJnZXQub25lKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKHNob3dFdmVudCkge1xyXG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm4gLy8gb25seSByZWdpc3RlciBmb2N1cyByZXN0b3JlciBpZiBtb2RhbCB3aWxsIGFjdHVhbGx5IGdldCBzaG93blxyXG4gICAgICAkdGFyZ2V0Lm9uZSgnaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICR0aGlzLmlzKCc6dmlzaWJsZScpICYmICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJylcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24sIHRoaXMpXHJcbiAgfSlcclxuXHJcbn0oalF1ZXJ5KTtcclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IHRvb2x0aXAuanMgdjMuNC4xXHJcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0b29sdGlwXHJcbiAqIEluc3BpcmVkIGJ5IHRoZSBvcmlnaW5hbCBqUXVlcnkudGlwc3kgYnkgSmFzb24gRnJhbWVcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbitmdW5jdGlvbiAoJCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgdmFyIERJU0FMTE9XRURfQVRUUklCVVRFUyA9IFsnc2FuaXRpemUnLCAnd2hpdGVMaXN0JywgJ3Nhbml0aXplRm4nXVxyXG5cclxuICB2YXIgdXJpQXR0cnMgPSBbXHJcbiAgICAnYmFja2dyb3VuZCcsXHJcbiAgICAnY2l0ZScsXHJcbiAgICAnaHJlZicsXHJcbiAgICAnaXRlbXR5cGUnLFxyXG4gICAgJ2xvbmdkZXNjJyxcclxuICAgICdwb3N0ZXInLFxyXG4gICAgJ3NyYycsXHJcbiAgICAneGxpbms6aHJlZidcclxuICBdXHJcblxyXG4gIHZhciBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2lcclxuXHJcbiAgdmFyIERlZmF1bHRXaGl0ZWxpc3QgPSB7XHJcbiAgICAvLyBHbG9iYWwgYXR0cmlidXRlcyBhbGxvd2VkIG9uIGFueSBzdXBwbGllZCBlbGVtZW50IGJlbG93LlxyXG4gICAgJyonOiBbJ2NsYXNzJywgJ2RpcicsICdpZCcsICdsYW5nJywgJ3JvbGUnLCBBUklBX0FUVFJJQlVURV9QQVRURVJOXSxcclxuICAgIGE6IFsndGFyZ2V0JywgJ2hyZWYnLCAndGl0bGUnLCAncmVsJ10sXHJcbiAgICBhcmVhOiBbXSxcclxuICAgIGI6IFtdLFxyXG4gICAgYnI6IFtdLFxyXG4gICAgY29sOiBbXSxcclxuICAgIGNvZGU6IFtdLFxyXG4gICAgZGl2OiBbXSxcclxuICAgIGVtOiBbXSxcclxuICAgIGhyOiBbXSxcclxuICAgIGgxOiBbXSxcclxuICAgIGgyOiBbXSxcclxuICAgIGgzOiBbXSxcclxuICAgIGg0OiBbXSxcclxuICAgIGg1OiBbXSxcclxuICAgIGg2OiBbXSxcclxuICAgIGk6IFtdLFxyXG4gICAgaW1nOiBbJ3NyYycsICdhbHQnLCAndGl0bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10sXHJcbiAgICBsaTogW10sXHJcbiAgICBvbDogW10sXHJcbiAgICBwOiBbXSxcclxuICAgIHByZTogW10sXHJcbiAgICBzOiBbXSxcclxuICAgIHNtYWxsOiBbXSxcclxuICAgIHNwYW46IFtdLFxyXG4gICAgc3ViOiBbXSxcclxuICAgIHN1cDogW10sXHJcbiAgICBzdHJvbmc6IFtdLFxyXG4gICAgdTogW10sXHJcbiAgICB1bDogW11cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEEgcGF0dGVybiB0aGF0IHJlY29nbml6ZXMgYSBjb21tb25seSB1c2VmdWwgc3Vic2V0IG9mIFVSTHMgdGhhdCBhcmUgc2FmZS5cclxuICAgKlxyXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcclxuICAgKi9cclxuICB2YXIgU0FGRV9VUkxfUEFUVEVSTiA9IC9eKD86KD86aHR0cHM/fG1haWx0b3xmdHB8dGVsfGZpbGUpOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvZ2lcclxuXHJcbiAgLyoqXHJcbiAgICogQSBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBzYWZlIGRhdGEgVVJMcy4gT25seSBtYXRjaGVzIGltYWdlLCB2aWRlbyBhbmQgYXVkaW8gdHlwZXMuXHJcbiAgICpcclxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXHJcbiAgICovXHJcbiAgdmFyIERBVEFfVVJMX1BBVFRFUk4gPSAvXmRhdGE6KD86aW1hZ2VcXC8oPzpibXB8Z2lmfGpwZWd8anBnfHBuZ3x0aWZmfHdlYnApfHZpZGVvXFwvKD86bXBlZ3xtcDR8b2dnfHdlYm0pfGF1ZGlvXFwvKD86bXAzfG9nYXxvZ2d8b3B1cykpO2Jhc2U2NCxbYS16MC05Ky9dKz0qJC9pXHJcblxyXG4gIGZ1bmN0aW9uIGFsbG93ZWRBdHRyaWJ1dGUoYXR0ciwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpIHtcclxuICAgIHZhciBhdHRyTmFtZSA9IGF0dHIubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxyXG5cclxuICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSAhPT0gLTEpIHtcclxuICAgICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgdXJpQXR0cnMpICE9PSAtMSkge1xyXG4gICAgICAgIHJldHVybiBCb29sZWFuKGF0dHIubm9kZVZhbHVlLm1hdGNoKFNBRkVfVVJMX1BBVFRFUk4pIHx8IGF0dHIubm9kZVZhbHVlLm1hdGNoKERBVEFfVVJMX1BBVFRFUk4pKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHZhciByZWdFeHAgPSAkKGFsbG93ZWRBdHRyaWJ1dGVMaXN0KS5maWx0ZXIoZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHBcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgYSByZWd1bGFyIGV4cHJlc3Npb24gdmFsaWRhdGVzIHRoZSBhdHRyaWJ1dGUuXHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZ0V4cC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgaWYgKGF0dHJOYW1lLm1hdGNoKHJlZ0V4cFtpXSkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgd2hpdGVMaXN0LCBzYW5pdGl6ZUZuKSB7XHJcbiAgICBpZiAodW5zYWZlSHRtbC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2FuaXRpemVGbiAmJiB0eXBlb2Ygc2FuaXRpemVGbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gc2FuaXRpemVGbih1bnNhZmVIdG1sKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElFIDggYW5kIGJlbG93IGRvbid0IHN1cHBvcnQgY3JlYXRlSFRNTERvY3VtZW50XHJcbiAgICBpZiAoIWRvY3VtZW50LmltcGxlbWVudGF0aW9uIHx8ICFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY3JlYXRlZERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdzYW5pdGl6YXRpb24nKVxyXG4gICAgY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gdW5zYWZlSHRtbFxyXG5cclxuICAgIHZhciB3aGl0ZWxpc3RLZXlzID0gJC5tYXAod2hpdGVMaXN0LCBmdW5jdGlvbiAoZWwsIGkpIHsgcmV0dXJuIGkgfSlcclxuICAgIHZhciBlbGVtZW50cyA9ICQoY3JlYXRlZERvY3VtZW50LmJvZHkpLmZpbmQoJyonKVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXVxyXG4gICAgICB2YXIgZWxOYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxyXG5cclxuICAgICAgaWYgKCQuaW5BcnJheShlbE5hbWUsIHdoaXRlbGlzdEtleXMpID09PSAtMSkge1xyXG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXHJcblxyXG4gICAgICAgIGNvbnRpbnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBhdHRyaWJ1dGVMaXN0ID0gJC5tYXAoZWwuYXR0cmlidXRlcywgZnVuY3Rpb24gKGVsKSB7IHJldHVybiBlbCB9KVxyXG4gICAgICB2YXIgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KHdoaXRlTGlzdFsnKiddIHx8IFtdLCB3aGl0ZUxpc3RbZWxOYW1lXSB8fCBbXSlcclxuXHJcbiAgICAgIGZvciAodmFyIGogPSAwLCBsZW4yID0gYXR0cmlidXRlTGlzdC5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcclxuICAgICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXSwgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzKSkge1xyXG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0ubm9kZU5hbWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTFxyXG4gIH1cclxuXHJcbiAgLy8gVE9PTFRJUCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy50eXBlICAgICAgID0gbnVsbFxyXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxyXG4gICAgdGhpcy5lbmFibGVkICAgID0gbnVsbFxyXG4gICAgdGhpcy50aW1lb3V0ICAgID0gbnVsbFxyXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxyXG4gICAgdGhpcy4kZWxlbWVudCAgID0gbnVsbFxyXG4gICAgdGhpcy5pblN0YXRlICAgID0gbnVsbFxyXG5cclxuICAgIHRoaXMuaW5pdCgndG9vbHRpcCcsIGVsZW1lbnQsIG9wdGlvbnMpXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLlZFUlNJT04gID0gJzMuNC4xJ1xyXG5cclxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcclxuXHJcbiAgVG9vbHRpcC5ERUZBVUxUUyA9IHtcclxuICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgIHBsYWNlbWVudDogJ3RvcCcsXHJcbiAgICBzZWxlY3RvcjogZmFsc2UsXHJcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXHJcbiAgICB0aXRsZTogJycsXHJcbiAgICBkZWxheTogMCxcclxuICAgIGh0bWw6IGZhbHNlLFxyXG4gICAgY29udGFpbmVyOiBmYWxzZSxcclxuICAgIHZpZXdwb3J0OiB7XHJcbiAgICAgIHNlbGVjdG9yOiAnYm9keScsXHJcbiAgICAgIHBhZGRpbmc6IDBcclxuICAgIH0sXHJcbiAgICBzYW5pdGl6ZSA6IHRydWUsXHJcbiAgICBzYW5pdGl6ZUZuIDogbnVsbCxcclxuICAgIHdoaXRlTGlzdCA6IERlZmF1bHRXaGl0ZWxpc3RcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy5lbmFibGVkICAgPSB0cnVlXHJcbiAgICB0aGlzLnR5cGUgICAgICA9IHR5cGVcclxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxyXG4gICAgdGhpcy5vcHRpb25zICAgPSB0aGlzLmdldE9wdGlvbnMob3B0aW9ucylcclxuICAgIHRoaXMuJHZpZXdwb3J0ID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmICQoZG9jdW1lbnQpLmZpbmQoJC5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy52aWV3cG9ydCkgPyB0aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLCB0aGlzLiRlbGVtZW50KSA6ICh0aGlzLm9wdGlvbnMudmlld3BvcnQuc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLnZpZXdwb3J0KSlcclxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cclxuXHJcbiAgICBpZiAodGhpcy4kZWxlbWVudFswXSBpbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yICYmICF0aGlzLm9wdGlvbnMuc2VsZWN0b3IpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcclxuXHJcbiAgICBmb3IgKHZhciBpID0gdHJpZ2dlcnMubGVuZ3RoOyBpLS07KSB7XHJcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cclxuXHJcbiAgICAgIGlmICh0cmlnZ2VyID09ICdjbGljaycpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxyXG4gICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT0gJ21hbnVhbCcpIHtcclxuICAgICAgICB2YXIgZXZlbnRJbiAgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VlbnRlcicgOiAnZm9jdXNpbidcclxuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXHJcblxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRJbiAgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmVudGVyLCB0aGlzKSlcclxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wdGlvbnMuc2VsZWN0b3IgP1xyXG4gICAgICAodGhpcy5fb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHsgdHJpZ2dlcjogJ21hbnVhbCcsIHNlbGVjdG9yOiAnJyB9KSkgOlxyXG4gICAgICB0aGlzLmZpeFRpdGxlKClcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFRvb2x0aXAuREVGQVVMVFNcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdmFyIGRhdGFBdHRyaWJ1dGVzID0gdGhpcy4kZWxlbWVudC5kYXRhKClcclxuXHJcbiAgICBmb3IgKHZhciBkYXRhQXR0ciBpbiBkYXRhQXR0cmlidXRlcykge1xyXG4gICAgICBpZiAoZGF0YUF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoZGF0YUF0dHIpICYmICQuaW5BcnJheShkYXRhQXR0ciwgRElTQUxMT1dFRF9BVFRSSUJVVEVTKSAhPT0gLTEpIHtcclxuICAgICAgICBkZWxldGUgZGF0YUF0dHJpYnV0ZXNbZGF0YUF0dHJdXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgZGF0YUF0dHJpYnV0ZXMsIG9wdGlvbnMpXHJcblxyXG4gICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgdHlwZW9mIG9wdGlvbnMuZGVsYXkgPT0gJ251bWJlcicpIHtcclxuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcclxuICAgICAgICBzaG93OiBvcHRpb25zLmRlbGF5LFxyXG4gICAgICAgIGhpZGU6IG9wdGlvbnMuZGVsYXlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnNhbml0aXplKSB7XHJcbiAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBzYW5pdGl6ZUh0bWwob3B0aW9ucy50ZW1wbGF0ZSwgb3B0aW9ucy53aGl0ZUxpc3QsIG9wdGlvbnMuc2FuaXRpemVGbilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9uc1xyXG4gIH1cclxuXHJcbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVsZWdhdGVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG9wdGlvbnMgID0ge31cclxuICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdHMoKVxyXG5cclxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgIGlmIChkZWZhdWx0c1trZXldICE9IHZhbHVlKSBvcHRpb25zW2tleV0gPSB2YWx1ZVxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gb3B0aW9uc1xyXG4gIH1cclxuXHJcbiAgVG9vbHRpcC5wcm90b3R5cGUuZW50ZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xyXG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxyXG5cclxuICAgIGlmICghc2VsZikge1xyXG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXHJcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcclxuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c2luJyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSB8fCBzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykge1xyXG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXHJcblxyXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xyXG5cclxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdykgcmV0dXJuIHNlbGYuc2hvdygpXHJcblxyXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykgc2VsZi5zaG93KClcclxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxyXG4gIH1cclxuXHJcbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmluU3RhdGUpIHtcclxuICAgICAgaWYgKHRoaXMuaW5TdGF0ZVtrZXldKSByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgVG9vbHRpcC5wcm90b3R5cGUubGVhdmUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xyXG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxyXG5cclxuICAgIGlmICghc2VsZikge1xyXG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXHJcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcclxuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXHJcblxyXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcclxuXHJcbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnb3V0J1xyXG5cclxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXHJcblxyXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXHJcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSlcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMuJyArIHRoaXMudHlwZSlcclxuXHJcbiAgICBpZiAodGhpcy5oYXNDb250ZW50KCkgJiYgdGhpcy5lbmFibGVkKSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxyXG5cclxuICAgICAgdmFyIGluRG9tID0gJC5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB0aGlzLiRlbGVtZW50WzBdKVxyXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCAhaW5Eb20pIHJldHVyblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcclxuXHJcbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxyXG5cclxuICAgICAgdmFyIHRpcElkID0gdGhpcy5nZXRVSUQodGhpcy50eXBlKVxyXG5cclxuICAgICAgdGhpcy5zZXRDb250ZW50KClcclxuICAgICAgJHRpcC5hdHRyKCdpZCcsIHRpcElkKVxyXG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSAkdGlwLmFkZENsYXNzKCdmYWRlJylcclxuXHJcbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cclxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcywgJHRpcFswXSwgdGhpcy4kZWxlbWVudFswXSkgOlxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnRcclxuXHJcbiAgICAgIHZhciBhdXRvVG9rZW4gPSAvXFxzP2F1dG8/XFxzPy9pXHJcbiAgICAgIHZhciBhdXRvUGxhY2UgPSBhdXRvVG9rZW4udGVzdChwbGFjZW1lbnQpXHJcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXHJcblxyXG4gICAgICAkdGlwXHJcbiAgICAgICAgLmRldGFjaCgpXHJcbiAgICAgICAgLmNzcyh7IHRvcDogMCwgbGVmdDogMCwgZGlzcGxheTogJ2Jsb2NrJyB9KVxyXG4gICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXHJcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXHJcblxyXG4gICAgICB0aGlzLm9wdGlvbnMuY29udGFpbmVyID8gJHRpcC5hcHBlbmRUbygkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5jb250YWluZXIpKSA6ICR0aXAuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudClcclxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxyXG5cclxuICAgICAgdmFyIHBvcyAgICAgICAgICA9IHRoaXMuZ2V0UG9zaXRpb24oKVxyXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxyXG4gICAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcclxuXHJcbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcclxuICAgICAgICB2YXIgb3JnUGxhY2VtZW50ID0gcGxhY2VtZW50XHJcbiAgICAgICAgdmFyIHZpZXdwb3J0RGltID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcclxuXHJcbiAgICAgICAgcGxhY2VtZW50ID0gcGxhY2VtZW50ID09ICdib3R0b20nICYmIHBvcy5ib3R0b20gKyBhY3R1YWxIZWlnaHQgPiB2aWV3cG9ydERpbS5ib3R0b20gPyAndG9wJyAgICA6XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgICYmIHBvcy50b3AgICAgLSBhY3R1YWxIZWlnaHQgPCB2aWV3cG9ydERpbS50b3AgICAgPyAnYm90dG9tJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgICYmIHBvcy5sZWZ0ICAgLSBhY3R1YWxXaWR0aCAgPCB2aWV3cG9ydERpbS5sZWZ0ICAgPyAncmlnaHQnICA6XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50XHJcblxyXG4gICAgICAgICR0aXBcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhvcmdQbGFjZW1lbnQpXHJcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcclxuXHJcbiAgICAgIHRoaXMuYXBwbHlQbGFjZW1lbnQoY2FsY3VsYXRlZE9mZnNldCwgcGxhY2VtZW50KVxyXG5cclxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcmV2SG92ZXJTdGF0ZSA9IHRoYXQuaG92ZXJTdGF0ZVxyXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcclxuICAgICAgICB0aGF0LmhvdmVyU3RhdGUgPSBudWxsXHJcblxyXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XHJcbiAgICAgICAgJHRpcFxyXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXHJcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgICAgY29tcGxldGUoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgVG9vbHRpcC5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQgPSBmdW5jdGlvbiAob2Zmc2V0LCBwbGFjZW1lbnQpIHtcclxuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXHJcbiAgICB2YXIgd2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxyXG4gICAgdmFyIGhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XHJcblxyXG4gICAgLy8gbWFudWFsbHkgcmVhZCBtYXJnaW5zIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGluY2x1ZGVzIGRpZmZlcmVuY2VcclxuICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLXRvcCcpLCAxMClcclxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxyXG5cclxuICAgIC8vIHdlIG11c3QgY2hlY2sgZm9yIE5hTiBmb3IgaWUgOC85XHJcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXHJcbiAgICBpZiAoaXNOYU4obWFyZ2luTGVmdCkpIG1hcmdpbkxlZnQgPSAwXHJcblxyXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXHJcbiAgICBvZmZzZXQubGVmdCArPSBtYXJnaW5MZWZ0XHJcblxyXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcclxuICAgIC8vIHNvIHdlIHVzZSBzZXRPZmZzZXQgZGlyZWN0bHkgd2l0aCBvdXIgb3duIGZ1bmN0aW9uIEItMFxyXG4gICAgJC5vZmZzZXQuc2V0T2Zmc2V0KCR0aXBbMF0sICQuZXh0ZW5kKHtcclxuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xyXG4gICAgICAgICR0aXAuY3NzKHtcclxuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChwcm9wcy50b3ApLFxyXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0sIG9mZnNldCksIDApXHJcblxyXG4gICAgJHRpcC5hZGRDbGFzcygnaW4nKVxyXG5cclxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBwbGFjaW5nIHRpcCBpbiBuZXcgb2Zmc2V0IGNhdXNlZCB0aGUgdGlwIHRvIHJlc2l6ZSBpdHNlbGZcclxuICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXHJcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcclxuXHJcbiAgICBpZiAocGxhY2VtZW50ID09ICd0b3AnICYmIGFjdHVhbEhlaWdodCAhPSBoZWlnaHQpIHtcclxuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcclxuXHJcbiAgICBpZiAoZGVsdGEubGVmdCkgb2Zmc2V0LmxlZnQgKz0gZGVsdGEubGVmdFxyXG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxyXG5cclxuICAgIHZhciBpc1ZlcnRpY2FsICAgICAgICAgID0gL3RvcHxib3R0b20vLnRlc3QocGxhY2VtZW50KVxyXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxyXG4gICAgdmFyIGFycm93T2Zmc2V0UG9zaXRpb24gPSBpc1ZlcnRpY2FsID8gJ29mZnNldFdpZHRoJyA6ICdvZmZzZXRIZWlnaHQnXHJcblxyXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxyXG4gICAgdGhpcy5yZXBsYWNlQXJyb3coYXJyb3dEZWx0YSwgJHRpcFswXVthcnJvd09mZnNldFBvc2l0aW9uXSwgaXNWZXJ0aWNhbClcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLnJlcGxhY2VBcnJvdyA9IGZ1bmN0aW9uIChkZWx0YSwgZGltZW5zaW9uLCBpc1ZlcnRpY2FsKSB7XHJcbiAgICB0aGlzLmFycm93KClcclxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXHJcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnLCAnJylcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJHRpcCAgPSB0aGlzLnRpcCgpXHJcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xyXG4gICAgICAgIHRpdGxlID0gc2FuaXRpemVIdG1sKHRpdGxlLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcclxuICAgICAgfVxyXG5cclxuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLmh0bWwodGl0bGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykudGV4dCh0aXRsZSlcclxuICAgIH1cclxuXHJcbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIGluIHRvcCBib3R0b20gbGVmdCByaWdodCcpXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXHJcbiAgICB2YXIgZSAgICA9ICQuRXZlbnQoJ2hpZGUuYnMuJyArIHRoaXMudHlwZSlcclxuXHJcbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcclxuICAgICAgaWYgKHRoYXQuaG92ZXJTdGF0ZSAhPSAnaW4nKSAkdGlwLmRldGFjaCgpXHJcbiAgICAgIGlmICh0aGF0LiRlbGVtZW50KSB7IC8vIFRPRE86IENoZWNrIHdoZXRoZXIgZ3VhcmRpbmcgdGhpcyBjb2RlIHdpdGggdGhpcyBgaWZgIGlzIHJlYWxseSBuZWNlc3NhcnkuXHJcbiAgICAgICAgdGhhdC4kZWxlbWVudFxyXG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknKVxyXG4gICAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy4nICsgdGhhdC50eXBlKVxyXG4gICAgICB9XHJcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcclxuXHJcbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnaW4nKVxyXG5cclxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XHJcbiAgICAgICR0aXBcclxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcclxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgIGNvbXBsZXRlKClcclxuXHJcbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLmZpeFRpdGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxyXG4gICAgaWYgKCRlLmF0dHIoJ3RpdGxlJykgfHwgdHlwZW9mICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSAhPSAnc3RyaW5nJykge1xyXG4gICAgICAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgJGUuYXR0cigndGl0bGUnKSB8fCAnJykuYXR0cigndGl0bGUnLCAnJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xyXG4gICAgJGVsZW1lbnQgICA9ICRlbGVtZW50IHx8IHRoaXMuJGVsZW1lbnRcclxuXHJcbiAgICB2YXIgZWwgICAgID0gJGVsZW1lbnRbMF1cclxuICAgIHZhciBpc0JvZHkgPSBlbC50YWdOYW1lID09ICdCT0RZJ1xyXG5cclxuICAgIHZhciBlbFJlY3QgICAgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgaWYgKGVsUmVjdC53aWR0aCA9PSBudWxsKSB7XHJcbiAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgYXJlIG1pc3NpbmcgaW4gSUU4LCBzbyBjb21wdXRlIHRoZW0gbWFudWFsbHk7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0MDkzXHJcbiAgICAgIGVsUmVjdCA9ICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHsgd2lkdGg6IGVsUmVjdC5yaWdodCAtIGVsUmVjdC5sZWZ0LCBoZWlnaHQ6IGVsUmVjdC5ib3R0b20gLSBlbFJlY3QudG9wIH0pXHJcbiAgICB9XHJcbiAgICB2YXIgaXNTdmcgPSB3aW5kb3cuU1ZHRWxlbWVudCAmJiBlbCBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50XHJcbiAgICAvLyBBdm9pZCB1c2luZyAkLm9mZnNldCgpIG9uIFNWR3Mgc2luY2UgaXQgZ2l2ZXMgaW5jb3JyZWN0IHJlc3VsdHMgaW4galF1ZXJ5IDMuXHJcbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8yMDI4MFxyXG4gICAgdmFyIGVsT2Zmc2V0ICA9IGlzQm9keSA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAoaXNTdmcgPyBudWxsIDogJGVsZW1lbnQub2Zmc2V0KCkpXHJcbiAgICB2YXIgc2Nyb2xsICAgID0geyBzY3JvbGw6IGlzQm9keSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgOiAkZWxlbWVudC5zY3JvbGxUb3AoKSB9XHJcbiAgICB2YXIgb3V0ZXJEaW1zID0gaXNCb2R5ID8geyB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpIH0gOiBudWxsXHJcblxyXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHNjcm9sbCwgb3V0ZXJEaW1zLCBlbE9mZnNldClcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcclxuICAgIHJldHVybiBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQsICAgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxyXG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICA/IHsgdG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XHJcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0IC0gYWN0dWFsV2lkdGggfSA6XHJcbiAgICAgICAgLyogcGxhY2VtZW50ID09ICdyaWdodCcgKi8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIH1cclxuXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcclxuICAgIHZhciBkZWx0YSA9IHsgdG9wOiAwLCBsZWZ0OiAwIH1cclxuICAgIGlmICghdGhpcy4kdmlld3BvcnQpIHJldHVybiBkZWx0YVxyXG5cclxuICAgIHZhciB2aWV3cG9ydFBhZGRpbmcgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgdGhpcy5vcHRpb25zLnZpZXdwb3J0LnBhZGRpbmcgfHwgMFxyXG4gICAgdmFyIHZpZXdwb3J0RGltZW5zaW9ucyA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXHJcblxyXG4gICAgaWYgKC9yaWdodHxsZWZ0Ly50ZXN0KHBsYWNlbWVudCkpIHtcclxuICAgICAgdmFyIHRvcEVkZ2VPZmZzZXQgICAgPSBwb3MudG9wIC0gdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbFxyXG4gICAgICB2YXIgYm90dG9tRWRnZU9mZnNldCA9IHBvcy50b3AgKyB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsICsgYWN0dWFsSGVpZ2h0XHJcbiAgICAgIGlmICh0b3BFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLnRvcCkgeyAvLyB0b3Agb3ZlcmZsb3dcclxuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wIC0gdG9wRWRnZU9mZnNldFxyXG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCkgeyAvLyBib3R0b20gb3ZlcmZsb3dcclxuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCAtIGJvdHRvbUVkZ2VPZmZzZXRcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGxlZnRFZGdlT2Zmc2V0ICA9IHBvcy5sZWZ0IC0gdmlld3BvcnRQYWRkaW5nXHJcbiAgICAgIHZhciByaWdodEVkZ2VPZmZzZXQgPSBwb3MubGVmdCArIHZpZXdwb3J0UGFkZGluZyArIGFjdHVhbFdpZHRoXHJcbiAgICAgIGlmIChsZWZ0RWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0KSB7IC8vIGxlZnQgb3ZlcmZsb3dcclxuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgLSBsZWZ0RWRnZU9mZnNldFxyXG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0RWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy5yaWdodCkgeyAvLyByaWdodCBvdmVyZmxvd1xyXG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCArIHZpZXdwb3J0RGltZW5zaW9ucy53aWR0aCAtIHJpZ2h0RWRnZU9mZnNldFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRlbHRhXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRUaXRsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0aXRsZVxyXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxyXG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXHJcblxyXG4gICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcclxuICAgICAgfHwgKHR5cGVvZiBvLnRpdGxlID09ICdmdW5jdGlvbicgPyBvLnRpdGxlLmNhbGwoJGVbMF0pIDogIG8udGl0bGUpXHJcblxyXG4gICAgcmV0dXJuIHRpdGxlXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRVSUQgPSBmdW5jdGlvbiAocHJlZml4KSB7XHJcbiAgICBkbyBwcmVmaXggKz0gfn4oTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApXHJcbiAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcclxuICAgIHJldHVybiBwcmVmaXhcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLnRpcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghdGhpcy4kdGlwKSB7XHJcbiAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxyXG4gICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZSArICcgYHRlbXBsYXRlYCBvcHRpb24gbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgMSB0b3AtbGV2ZWwgZWxlbWVudCEnKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy4kdGlwXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy50b29sdGlwLWFycm93JykpXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2VcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkXHJcbiAgfVxyXG5cclxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICBpZiAoZSkge1xyXG4gICAgICBzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXHJcbiAgICAgIGlmICghc2VsZikge1xyXG4gICAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXHJcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoZSkge1xyXG4gICAgICBzZWxmLmluU3RhdGUuY2xpY2sgPSAhc2VsZi5pblN0YXRlLmNsaWNrXHJcbiAgICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgc2VsZi5lbnRlcihzZWxmKVxyXG4gICAgICBlbHNlIHNlbGYubGVhdmUoc2VsZilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgPyBzZWxmLmxlYXZlKHNlbGYpIDogc2VsZi5lbnRlcihzZWxmKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgVG9vbHRpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcclxuICAgIHRoaXMuaGlkZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoYXQuJGVsZW1lbnQub2ZmKCcuJyArIHRoYXQudHlwZSkucmVtb3ZlRGF0YSgnYnMuJyArIHRoYXQudHlwZSlcclxuICAgICAgaWYgKHRoYXQuJHRpcCkge1xyXG4gICAgICAgIHRoYXQuJHRpcC5kZXRhY2goKVxyXG4gICAgICB9XHJcbiAgICAgIHRoYXQuJHRpcCA9IG51bGxcclxuICAgICAgdGhhdC4kYXJyb3cgPSBudWxsXHJcbiAgICAgIHRoYXQuJHZpZXdwb3J0ID0gbnVsbFxyXG4gICAgICB0aGF0LiRlbGVtZW50ID0gbnVsbFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIFRvb2x0aXAucHJvdG90eXBlLnNhbml0aXplSHRtbCA9IGZ1bmN0aW9uICh1bnNhZmVIdG1sKSB7XHJcbiAgICByZXR1cm4gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxyXG4gIH1cclxuXHJcbiAgLy8gVE9PTFRJUCBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxyXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnKVxyXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXHJcblxyXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50b29sdGlwJywgKGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBvcHRpb25zKSkpXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLnRvb2x0aXBcclxuXHJcbiAgJC5mbi50b29sdGlwICAgICAgICAgICAgID0gUGx1Z2luXHJcbiAgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxyXG5cclxuXHJcbiAgLy8gVE9PTFRJUCBOTyBDT05GTElDVFxyXG4gIC8vID09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuLnRvb2x0aXAgPSBvbGRcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxufShqUXVlcnkpO1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIEJvb3RzdHJhcDogcG9wb3Zlci5qcyB2My40LjFcclxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3BvcG92ZXJzXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICB2YXIgUG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLmluaXQoJ3BvcG92ZXInLCBlbGVtZW50LCBvcHRpb25zKVxyXG4gIH1cclxuXHJcbiAgaWYgKCEkLmZuLnRvb2x0aXApIHRocm93IG5ldyBFcnJvcignUG9wb3ZlciByZXF1aXJlcyB0b29sdGlwLmpzJylcclxuXHJcbiAgUG9wb3Zlci5WRVJTSU9OICA9ICczLjQuMSdcclxuXHJcbiAgUG9wb3Zlci5ERUZBVUxUUyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMsIHtcclxuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcclxuICAgIHRyaWdnZXI6ICdjbGljaycsXHJcbiAgICBjb250ZW50OiAnJyxcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXHJcbiAgfSlcclxuXHJcblxyXG4gIC8vIE5PVEU6IFBPUE9WRVIgRVhURU5EUyB0b29sdGlwLmpzXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgUG9wb3Zlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSlcclxuXHJcbiAgUG9wb3Zlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3BvdmVyXHJcblxyXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFBvcG92ZXIuREVGQVVMVFNcclxuICB9XHJcblxyXG4gIFBvcG92ZXIucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJHRpcCAgICA9IHRoaXMudGlwKClcclxuICAgIHZhciB0aXRsZSAgID0gdGhpcy5nZXRUaXRsZSgpXHJcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XHJcbiAgICAgIHZhciB0eXBlQ29udGVudCA9IHR5cGVvZiBjb250ZW50XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XHJcbiAgICAgICAgdGl0bGUgPSB0aGlzLnNhbml0aXplSHRtbCh0aXRsZSlcclxuXHJcbiAgICAgICAgaWYgKHR5cGVDb250ZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgY29udGVudCA9IHRoaXMuc2FuaXRpemVIdG1sKGNvbnRlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCh0aXRsZSlcclxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKVtcclxuICAgICAgICB0eXBlQ29udGVudCA9PT0gJ3N0cmluZycgPyAnaHRtbCcgOiAnYXBwZW5kJ1xyXG4gICAgICBdKGNvbnRlbnQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykudGV4dCh0aXRsZSlcclxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKS50ZXh0KGNvbnRlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxyXG5cclxuICAgIC8vIElFOCBkb2Vzbid0IGFjY2VwdCBoaWRpbmcgdmlhIHRoZSBgOmVtcHR5YCBwc2V1ZG8gc2VsZWN0b3IsIHdlIGhhdmUgdG8gZG9cclxuICAgIC8vIHRoaXMgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhlIGNvbnRlbnRzLlxyXG4gICAgaWYgKCEkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCgpKSAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaGlkZSgpXHJcbiAgfVxyXG5cclxuICBQb3BvdmVyLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKSB8fCB0aGlzLmdldENvbnRlbnQoKVxyXG4gIH1cclxuXHJcbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcclxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xyXG5cclxuICAgIHJldHVybiAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxyXG4gICAgICB8fCAodHlwZW9mIG8uY29udGVudCA9PSAnZnVuY3Rpb24nID9cclxuICAgICAgICBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOlxyXG4gICAgICAgIG8uY29udGVudClcclxuICB9XHJcblxyXG4gIFBvcG92ZXIucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUE9QT1ZFUiBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxyXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInKVxyXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXHJcblxyXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJywgKGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBvcHRpb25zKSkpXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLnBvcG92ZXJcclxuXHJcbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXHJcbiAgJC5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yID0gUG9wb3ZlclxyXG5cclxuXHJcbiAgLy8gUE9QT1ZFUiBOTyBDT05GTElDVFxyXG4gIC8vID09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5wb3BvdmVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuLnBvcG92ZXIgPSBvbGRcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxufShqUXVlcnkpO1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIEJvb3RzdHJhcDogc2Nyb2xsc3B5LmpzIHYzLjQuMVxyXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jc2Nyb2xsc3B5XHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBTQ1JPTExTUFkgQ0xBU1MgREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIGZ1bmN0aW9uIFNjcm9sbFNweShlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLiRib2R5ICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxyXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudCA9ICQoZWxlbWVudCkuaXMoZG9jdW1lbnQuYm9keSkgPyAkKHdpbmRvdykgOiAkKGVsZW1lbnQpXHJcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgID0gJC5leHRlbmQoe30sIFNjcm9sbFNweS5ERUZBVUxUUywgb3B0aW9ucylcclxuICAgIHRoaXMuc2VsZWN0b3IgICAgICAgPSAodGhpcy5vcHRpb25zLnRhcmdldCB8fCAnJykgKyAnIC5uYXYgbGkgPiBhJ1xyXG4gICAgdGhpcy5vZmZzZXRzICAgICAgICA9IFtdXHJcbiAgICB0aGlzLnRhcmdldHMgICAgICAgID0gW11cclxuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ICAgPSBudWxsXHJcbiAgICB0aGlzLnNjcm9sbEhlaWdodCAgID0gMFxyXG5cclxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQub24oJ3Njcm9sbC5icy5zY3JvbGxzcHknLCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpXHJcbiAgICB0aGlzLnJlZnJlc2goKVxyXG4gICAgdGhpcy5wcm9jZXNzKClcclxuICB9XHJcblxyXG4gIFNjcm9sbFNweS5WRVJTSU9OICA9ICczLjQuMSdcclxuXHJcbiAgU2Nyb2xsU3B5LkRFRkFVTFRTID0ge1xyXG4gICAgb2Zmc2V0OiAxMFxyXG4gIH1cclxuXHJcbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5nZXRTY3JvbGxIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpXHJcbiAgfVxyXG5cclxuICBTY3JvbGxTcHkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgdGhhdCAgICAgICAgICA9IHRoaXNcclxuICAgIHZhciBvZmZzZXRNZXRob2QgID0gJ29mZnNldCdcclxuICAgIHZhciBvZmZzZXRCYXNlICAgID0gMFxyXG5cclxuICAgIHRoaXMub2Zmc2V0cyAgICAgID0gW11cclxuICAgIHRoaXMudGFyZ2V0cyAgICAgID0gW11cclxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxyXG5cclxuICAgIGlmICghJC5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKSkge1xyXG4gICAgICBvZmZzZXRNZXRob2QgPSAncG9zaXRpb24nXHJcbiAgICAgIG9mZnNldEJhc2UgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRib2R5XHJcbiAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXHJcbiAgICAgIC5tYXAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkZWwgICA9ICQodGhpcylcclxuICAgICAgICB2YXIgaHJlZiAgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxyXG4gICAgICAgIHZhciAkaHJlZiA9IC9eIy4vLnRlc3QoaHJlZikgJiYgJChocmVmKVxyXG5cclxuICAgICAgICByZXR1cm4gKCRocmVmXHJcbiAgICAgICAgICAmJiAkaHJlZi5sZW5ndGhcclxuICAgICAgICAgICYmICRocmVmLmlzKCc6dmlzaWJsZScpXHJcbiAgICAgICAgICAmJiBbWyRocmVmW29mZnNldE1ldGhvZF0oKS50b3AgKyBvZmZzZXRCYXNlLCBocmVmXV0pIHx8IG51bGxcclxuICAgICAgfSlcclxuICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGFbMF0gLSBiWzBdIH0pXHJcbiAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGF0Lm9mZnNldHMucHVzaCh0aGlzWzBdKVxyXG4gICAgICAgIHRoYXQudGFyZ2V0cy5wdXNoKHRoaXNbMV0pXHJcbiAgICAgIH0pXHJcbiAgfVxyXG5cclxuICBTY3JvbGxTcHkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSArIHRoaXMub3B0aW9ucy5vZmZzZXRcclxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXHJcbiAgICB2YXIgbWF4U2Nyb2xsICAgID0gdGhpcy5vcHRpb25zLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcclxuICAgIHZhciBvZmZzZXRzICAgICAgPSB0aGlzLm9mZnNldHNcclxuICAgIHZhciB0YXJnZXRzICAgICAgPSB0aGlzLnRhcmdldHNcclxuICAgIHZhciBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFxyXG4gICAgdmFyIGlcclxuXHJcbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT0gc2Nyb2xsSGVpZ2h0KSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaCgpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcclxuICAgICAgcmV0dXJuIGFjdGl2ZVRhcmdldCAhPSAoaSA9IHRhcmdldHNbdGFyZ2V0cy5sZW5ndGggLSAxXSkgJiYgdGhpcy5hY3RpdmF0ZShpKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhY3RpdmVUYXJnZXQgJiYgc2Nyb2xsVG9wIDwgb2Zmc2V0c1swXSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG51bGxcclxuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IG9mZnNldHMubGVuZ3RoOyBpLS07KSB7XHJcbiAgICAgIGFjdGl2ZVRhcmdldCAhPSB0YXJnZXRzW2ldXHJcbiAgICAgICAgJiYgc2Nyb2xsVG9wID49IG9mZnNldHNbaV1cclxuICAgICAgICAmJiAob2Zmc2V0c1tpICsgMV0gPT09IHVuZGVmaW5lZCB8fCBzY3JvbGxUb3AgPCBvZmZzZXRzW2kgKyAxXSlcclxuICAgICAgICAmJiB0aGlzLmFjdGl2YXRlKHRhcmdldHNbaV0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTY3JvbGxTcHkucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgPSB0YXJnZXRcclxuXHJcbiAgICB0aGlzLmNsZWFyKClcclxuXHJcbiAgICB2YXIgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yICtcclxuICAgICAgJ1tkYXRhLXRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCJdLCcgK1xyXG4gICAgICB0aGlzLnNlbGVjdG9yICsgJ1tocmVmPVwiJyArIHRhcmdldCArICdcIl0nXHJcblxyXG4gICAgdmFyIGFjdGl2ZSA9ICQoc2VsZWN0b3IpXHJcbiAgICAgIC5wYXJlbnRzKCdsaScpXHJcbiAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHJcbiAgICBpZiAoYWN0aXZlLnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcclxuICAgICAgYWN0aXZlID0gYWN0aXZlXHJcbiAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlLnRyaWdnZXIoJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScpXHJcbiAgfVxyXG5cclxuICBTY3JvbGxTcHkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJCh0aGlzLnNlbGVjdG9yKVxyXG4gICAgICAucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsICcuYWN0aXZlJylcclxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gIH1cclxuXHJcblxyXG4gIC8vIFNDUk9MTFNQWSBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXHJcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JylcclxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxyXG5cclxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknLCAoZGF0YSA9IG5ldyBTY3JvbGxTcHkodGhpcywgb3B0aW9ucykpKVxyXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB2YXIgb2xkID0gJC5mbi5zY3JvbGxzcHlcclxuXHJcbiAgJC5mbi5zY3JvbGxzcHkgICAgICAgICAgICAgPSBQbHVnaW5cclxuICAkLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweVxyXG5cclxuXHJcbiAgLy8gU0NST0xMU1BZIE5PIENPTkZMSUNUXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICQuZm4uc2Nyb2xsc3B5Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuLnNjcm9sbHNweSA9IG9sZFxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG5cclxuICAvLyBTQ1JPTExTUFkgREFUQS1BUElcclxuICAvLyA9PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJCh3aW5kb3cpLm9uKCdsb2FkLmJzLnNjcm9sbHNweS5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcclxuICAgICQoJ1tkYXRhLXNweT1cInNjcm9sbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcclxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgJHNweS5kYXRhKCkpXHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG59KGpRdWVyeSk7XHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogQm9vdHN0cmFwOiB0YWIuanMgdjMuNC4xXHJcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0YWJzXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBUQUIgQ0xBU1MgREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBUYWIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgLy8ganNjczpkaXNhYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XHJcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpXHJcbiAgICAvLyBqc2NzOmVuYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxyXG4gIH1cclxuXHJcbiAgVGFiLlZFUlNJT04gPSAnMy40LjEnXHJcblxyXG4gIFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXHJcblxyXG4gIFRhYi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkdGhpcyAgICA9IHRoaXMuZWxlbWVudFxyXG4gICAgdmFyICR1bCAgICAgID0gJHRoaXMuY2xvc2VzdCgndWw6bm90KC5kcm9wZG93bi1tZW51KScpXHJcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5kYXRhKCd0YXJnZXQnKVxyXG5cclxuICAgIGlmICghc2VsZWN0b3IpIHtcclxuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcclxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkdGhpcy5wYXJlbnQoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm5cclxuXHJcbiAgICB2YXIgJHByZXZpb3VzID0gJHVsLmZpbmQoJy5hY3RpdmU6bGFzdCBhJylcclxuICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLnRhYicsIHtcclxuICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cclxuICAgIH0pXHJcbiAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCgnc2hvdy5icy50YWInLCB7XHJcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxyXG4gICAgfSlcclxuXHJcbiAgICAkcHJldmlvdXMudHJpZ2dlcihoaWRlRXZlbnQpXHJcbiAgICAkdGhpcy50cmlnZ2VyKHNob3dFdmVudClcclxuXHJcbiAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8IGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXHJcblxyXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxyXG5cclxuICAgIHRoaXMuYWN0aXZhdGUoJHRoaXMuY2xvc2VzdCgnbGknKSwgJHVsKVxyXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRwcmV2aW91cy50cmlnZ2VyKHtcclxuICAgICAgICB0eXBlOiAnaGlkZGVuLmJzLnRhYicsXHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cclxuICAgICAgfSlcclxuICAgICAgJHRoaXMudHJpZ2dlcih7XHJcbiAgICAgICAgdHlwZTogJ3Nob3duLmJzLnRhYicsXHJcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgVGFiLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgJGFjdGl2ZSAgICA9IGNvbnRhaW5lci5maW5kKCc+IC5hY3RpdmUnKVxyXG4gICAgdmFyIHRyYW5zaXRpb24gPSBjYWxsYmFja1xyXG4gICAgICAmJiAkLnN1cHBvcnQudHJhbnNpdGlvblxyXG4gICAgICAmJiAoJGFjdGl2ZS5sZW5ndGggJiYgJGFjdGl2ZS5oYXNDbGFzcygnZmFkZScpIHx8ICEhY29udGFpbmVyLmZpbmQoJz4gLmZhZGUnKS5sZW5ndGgpXHJcblxyXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgJGFjdGl2ZVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAuZmluZCgnPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmUnKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAuZW5kKClcclxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcclxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxyXG5cclxuICAgICAgZWxlbWVudFxyXG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcclxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXHJcblxyXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xyXG4gICAgICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gcmVmbG93IGZvciB0cmFuc2l0aW9uXHJcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnaW4nKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhZGUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XHJcbiAgICAgICAgZWxlbWVudFxyXG4gICAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcclxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAgIC5lbmQoKVxyXG4gICAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXHJcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcclxuICAgIH1cclxuXHJcbiAgICAkYWN0aXZlLmxlbmd0aCAmJiB0cmFuc2l0aW9uID9cclxuICAgICAgJGFjdGl2ZVxyXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIG5leHQpXHJcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XHJcbiAgICAgIG5leHQoKVxyXG5cclxuICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2luJylcclxuICB9XHJcblxyXG5cclxuICAvLyBUQUIgUExVR0lOIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcclxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMudGFiJylcclxuXHJcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudGFiJywgKGRhdGEgPSBuZXcgVGFiKHRoaXMpKSlcclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdmFyIG9sZCA9ICQuZm4udGFiXHJcblxyXG4gICQuZm4udGFiICAgICAgICAgICAgID0gUGx1Z2luXHJcbiAgJC5mbi50YWIuQ29uc3RydWN0b3IgPSBUYWJcclxuXHJcblxyXG4gIC8vIFRBQiBOTyBDT05GTElDVFxyXG4gIC8vID09PT09PT09PT09PT09PVxyXG5cclxuICAkLmZuLnRhYi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi50YWIgPSBvbGRcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gVEFCIERBVEEtQVBJXHJcbiAgLy8gPT09PT09PT09PT09XHJcblxyXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBQbHVnaW4uY2FsbCgkKHRoaXMpLCAnc2hvdycpXHJcbiAgfVxyXG5cclxuICAkKGRvY3VtZW50KVxyXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJywgY2xpY2tIYW5kbGVyKVxyXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsIGNsaWNrSGFuZGxlcilcclxuXHJcbn0oalF1ZXJ5KTtcclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBCb290c3RyYXA6IGFmZml4LmpzIHYzLjQuMVxyXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWZmaXhcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxyXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcblxyXG4rZnVuY3Rpb24gKCQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8vIEFGRklYIENMQVNTIERFRklOSVRJT05cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQWZmaXguREVGQVVMVFMsIG9wdGlvbnMpXHJcblxyXG4gICAgdmFyIHRhcmdldCA9IHRoaXMub3B0aW9ucy50YXJnZXQgPT09IEFmZml4LkRFRkFVTFRTLnRhcmdldCA/ICQodGhpcy5vcHRpb25zLnRhcmdldCkgOiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpXHJcblxyXG4gICAgdGhpcy4kdGFyZ2V0ID0gdGFyZ2V0XHJcbiAgICAgIC5vbignc2Nyb2xsLmJzLmFmZml4LmRhdGEtYXBpJywgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpKVxyXG4gICAgICAub24oJ2NsaWNrLmJzLmFmZml4LmRhdGEtYXBpJywgICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCwgdGhpcykpXHJcblxyXG4gICAgdGhpcy4kZWxlbWVudCAgICAgPSAkKGVsZW1lbnQpXHJcbiAgICB0aGlzLmFmZml4ZWQgICAgICA9IG51bGxcclxuICAgIHRoaXMudW5waW4gICAgICAgID0gbnVsbFxyXG4gICAgdGhpcy5waW5uZWRPZmZzZXQgPSBudWxsXHJcblxyXG4gICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcclxuICB9XHJcblxyXG4gIEFmZml4LlZFUlNJT04gID0gJzMuNC4xJ1xyXG5cclxuICBBZmZpeC5SRVNFVCAgICA9ICdhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tJ1xyXG5cclxuICBBZmZpeC5ERUZBVUxUUyA9IHtcclxuICAgIG9mZnNldDogMCxcclxuICAgIHRhcmdldDogd2luZG93XHJcbiAgfVxyXG5cclxuICBBZmZpeC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XHJcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXHJcbiAgICB2YXIgcG9zaXRpb24gICAgID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxyXG4gICAgdmFyIHRhcmdldEhlaWdodCA9IHRoaXMuJHRhcmdldC5oZWlnaHQoKVxyXG5cclxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiB0aGlzLmFmZml4ZWQgPT0gJ3RvcCcpIHJldHVybiBzY3JvbGxUb3AgPCBvZmZzZXRUb3AgPyAndG9wJyA6IGZhbHNlXHJcblxyXG4gICAgaWYgKHRoaXMuYWZmaXhlZCA9PSAnYm90dG9tJykge1xyXG4gICAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwpIHJldHVybiAoc2Nyb2xsVG9wICsgdGhpcy51bnBpbiA8PSBwb3NpdGlvbi50b3ApID8gZmFsc2UgOiAnYm90dG9tJ1xyXG4gICAgICByZXR1cm4gKHNjcm9sbFRvcCArIHRhcmdldEhlaWdodCA8PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID8gZmFsc2UgOiAnYm90dG9tJ1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbml0aWFsaXppbmcgICA9IHRoaXMuYWZmaXhlZCA9PSBudWxsXHJcbiAgICB2YXIgY29sbGlkZXJUb3AgICAgPSBpbml0aWFsaXppbmcgPyBzY3JvbGxUb3AgOiBwb3NpdGlvbi50b3BcclxuICAgIHZhciBjb2xsaWRlckhlaWdodCA9IGluaXRpYWxpemluZyA/IHRhcmdldEhlaWdodCA6IGhlaWdodFxyXG5cclxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiBzY3JvbGxUb3AgPD0gb2Zmc2V0VG9wKSByZXR1cm4gJ3RvcCdcclxuICAgIGlmIChvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAoY29sbGlkZXJUb3AgKyBjb2xsaWRlckhlaWdodCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pKSByZXR1cm4gJ2JvdHRvbSdcclxuXHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIEFmZml4LnByb3RvdHlwZS5nZXRQaW5uZWRPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5waW5uZWRPZmZzZXQpIHJldHVybiB0aGlzLnBpbm5lZE9mZnNldFxyXG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVCkuYWRkQ2xhc3MoJ2FmZml4JylcclxuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcclxuICAgIHZhciBwb3NpdGlvbiAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXHJcbiAgICByZXR1cm4gKHRoaXMucGlubmVkT2Zmc2V0ID0gcG9zaXRpb24udG9wIC0gc2Nyb2xsVG9wKVxyXG4gIH1cclxuXHJcbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2V0VGltZW91dCgkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcyksIDEpXHJcbiAgfVxyXG5cclxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkgcmV0dXJuXHJcblxyXG4gICAgdmFyIGhlaWdodCAgICAgICA9IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KClcclxuICAgIHZhciBvZmZzZXQgICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0XHJcbiAgICB2YXIgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcFxyXG4gICAgdmFyIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b21cclxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSBNYXRoLm1heCgkKGRvY3VtZW50KS5oZWlnaHQoKSwgJChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSlcclxuXHJcbiAgICBpZiAodHlwZW9mIG9mZnNldCAhPSAnb2JqZWN0JykgICAgICAgICBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgPSBvZmZzZXRcclxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0VG9wID09ICdmdW5jdGlvbicpICAgIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3AodGhpcy4kZWxlbWVudClcclxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0Qm90dG9tID09ICdmdW5jdGlvbicpIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b20odGhpcy4kZWxlbWVudClcclxuXHJcbiAgICB2YXIgYWZmaXggPSB0aGlzLmdldFN0YXRlKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSlcclxuXHJcbiAgICBpZiAodGhpcy5hZmZpeGVkICE9IGFmZml4KSB7XHJcbiAgICAgIGlmICh0aGlzLnVucGluICE9IG51bGwpIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCAnJylcclxuXHJcbiAgICAgIHZhciBhZmZpeFR5cGUgPSAnYWZmaXgnICsgKGFmZml4ID8gJy0nICsgYWZmaXggOiAnJylcclxuICAgICAgdmFyIGUgICAgICAgICA9ICQuRXZlbnQoYWZmaXhUeXBlICsgJy5icy5hZmZpeCcpXHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcclxuXHJcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuYWZmaXhlZCA9IGFmZml4XHJcbiAgICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHRoaXMuZ2V0UGlubmVkT2Zmc2V0KCkgOiBudWxsXHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKVxyXG4gICAgICAgIC5hZGRDbGFzcyhhZmZpeFR5cGUpXHJcbiAgICAgICAgLnRyaWdnZXIoYWZmaXhUeXBlLnJlcGxhY2UoJ2FmZml4JywgJ2FmZml4ZWQnKSArICcuYnMuYWZmaXgnKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhZmZpeCA9PSAnYm90dG9tJykge1xyXG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZnNldCh7XHJcbiAgICAgICAgdG9wOiBzY3JvbGxIZWlnaHQgLSBoZWlnaHQgLSBvZmZzZXRCb3R0b21cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLyBBRkZJWCBQTFVHSU4gREVGSU5JVElPTlxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcclxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5hZmZpeCcpXHJcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cclxuXHJcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWZmaXgnLCAoZGF0YSA9IG5ldyBBZmZpeCh0aGlzLCBvcHRpb25zKSkpXHJcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHZhciBvbGQgPSAkLmZuLmFmZml4XHJcblxyXG4gICQuZm4uYWZmaXggICAgICAgICAgICAgPSBQbHVnaW5cclxuICAkLmZuLmFmZml4LkNvbnN0cnVjdG9yID0gQWZmaXhcclxuXHJcblxyXG4gIC8vIEFGRklYIE5PIENPTkZMSUNUXHJcbiAgLy8gPT09PT09PT09PT09PT09PT1cclxuXHJcbiAgJC5mbi5hZmZpeC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJC5mbi5hZmZpeCA9IG9sZFxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG5cclxuICAvLyBBRkZJWCBEQVRBLUFQSVxyXG4gIC8vID09PT09PT09PT09PT09XHJcblxyXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICQoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxyXG4gICAgICB2YXIgZGF0YSA9ICRzcHkuZGF0YSgpXHJcblxyXG4gICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IHt9XHJcblxyXG4gICAgICBpZiAoZGF0YS5vZmZzZXRCb3R0b20gIT0gbnVsbCkgZGF0YS5vZmZzZXQuYm90dG9tID0gZGF0YS5vZmZzZXRCb3R0b21cclxuICAgICAgaWYgKGRhdGEub2Zmc2V0VG9wICAgICE9IG51bGwpIGRhdGEub2Zmc2V0LnRvcCAgICA9IGRhdGEub2Zmc2V0VG9wXHJcblxyXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCBkYXRhKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxufShqUXVlcnkpO1xyXG4iXX0=