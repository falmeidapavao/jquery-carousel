(function ($) {
    /**
     * Private fields
     */
    var instance = {
        root: null,
        template: null,
        options: {}
    };
    var animations = {};
    var interval = null;

    /**
     * Plugin
     */
    $.fn.carousel = function (options) {
        return this.each(function () {
            instance.root = $(this);

            // Extend defaults with provided options.
            instance.options = $.extend($.fn.carousel.defaults, options);

            // Check for auto shift mode.
            if (instance.options) {
                play();
            }

            // Next/previous animations.
            let currentAnimation = null;
            switch (instance.options.animation) {
                case 'slide':
                    currentAnimation = { in: 'slideDown', out: 'slideUp' };
                    break;
                case 'fade':
                default:
                    currentAnimation = { in: 'fadeIn', out: 'fadeOut' };
                    break;
            }

            // Set instance animation callbacks.
            animations.in = function (elm) {
                elm[currentAnimation['in']]();
            };
            animations.out = function (elm) {
                return elm[currentAnimation['out']]();
            };

            // Render UI.
            render();
        })
    };

    /**
     * Default options
     */
    $.fn.carousel.defaults = {
        items: [{ src: '' }],
        coverIndex: 0,
        auto: false
    };

    /**
     * Private functions
     */
    function render() {
        var container = $('<div>', { 'class': 'c-container' });
        var item = $('<div/>', { 'id': 'c-item', 'class': 'c-item' });
        var img = $('<img/>', {
            'id': 'c-img',
            'class': 'c-img',
            'src': instance.options.items[instance.options.coverIndex].src
        });
        var next = $('<div/>', {
            'id': 'c-next',
            'class': 'c-arrow c-next',
            'data-op': 'next'
        });
        var previous = $('<div/>', {
            'id': 'c-previous',
            'class': 'c-arrow c-previous',
            'data-op': 'previous'
        });

        item.append(img);
        instance.template = container.append(item, next, previous);

        setEvents();
        instance.root.html(instance.template);
    }

    function setEvents() {
        var tmpl = instance.template;
        var operation = function (op) {
            switch (op) {
                case 'contextmenu':
                case 'previous':
                    return previous;
                case 'click':
                case 'next':
                    return next;
                default:
                    return function () { };
            }
        };

        // Icons.
        tmpl.find('#c-next, #c-previous').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            stop();
            operation($(this).data('op'))();
        });

        // Frame.
        tmpl.on('click contextmenu', function (e) {
            e.preventDefault();
            stop();
            operation(e.type)();
        });
    };

    function play() {
        interval = setInterval(function () { next(); }, 3000);
    }

    function stop() {
        clearTimeout(interval);
    }

    function next() {
        var opts = instance.options;
        var len = (opts.items || []).length;
        instance.options.coverIndex = (opts.coverIndex + 1) % len;
        shift();
    }

    function previous() {
        var opts = instance.options;
        var len = (opts.items || []).length;
        instance.options.coverIndex = len - ((len - opts.coverIndex) % len) - 1;
        shift();
    }

    function shift() {
        const tmpl = instance.template;
        const item = tmpl.find('#c-item');
        const img = tmpl.find('#c-img');

        // Wait for out animation to stop before working on DOM.
        // Also wait for next/previous image to be loaded.
        $.when(animations.out(img)).done(function () {
            img
                .detach()
                .attr('src', options.items[instance.options.coverIndex].src)
                .css({ display: 'none' })
                .one('load', function () {
                    item.append(img);
                    animations.in(img);
                });
        });
    }

    /**
     * Exposed methods/properties
     */
    $.fn.carousel.next = next;
    $.fn.carousel.previous = previous;
    $.fn.carousel.cover = instance.options.coverIndex; 

})(jQuery);