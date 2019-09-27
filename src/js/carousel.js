'use strict';
(function ($) {
  /**
   * Private fields
   */
  let instance = {
    root: null,
    template: null,
    options: {}
  };
  let animations = {};
  let interval = null;

  /**
   * Plugin
   */
  $.fn.carousel = function (options) {
    instance.root = $(this);

    // Extend defaults with provided options.
    instance.options = $.extend($.fn.carousel.defaults, options);

    return this.each(() => {
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
      animations.in = elm => {
        elm[currentAnimation['in']]();
      };
      animations.out = elm => {
        return elm[currentAnimation['out']]();
      };

      // Render UI.
      render();
    });
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
  const render = () => {
    const container = $('<div>', { class: 'c-container' });
    const item = $('<div/>', { id: 'c-item', class: 'c-item' });
    const img = $('<img/>', {
      id: 'c-img',
      class: 'c-img',
      src: instance.options.items[instance.options.coverIndex].src
    });
    const next = $('<div/>', {
      id: 'c-next',
      class: 'c-arrow c-next',
      'data-op': 'next'
    });
    const previous = $('<div/>', {
      id: 'c-previous',
      class: 'c-arrow c-previous',
      'data-op': 'previous'
    });

    item.append(img);
    instance.template = container.append(item, next, previous);

    setEvents();
    instance.root.html(instance.template);
  };

  const setEvents = () => {
    const tmpl = instance.template;
    const operation = op => {
      switch (op) {
        case 'contextmenu':
        case 'previous':
          return $.fn.carousel.previous;
        case 'click':
        case 'next':
          return $.fn.carousel.next;
        default:
          return () => { };
      }
    };

    // Icons.
    tmpl.find('#c-next, #c-previous').on('click', e => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      operation(e.type)();
    });

    // Frame.
    tmpl.on('click contextmenu', e => {
      e.preventDefault();
      stop();
      operation(e.type)();
    });
  };

  const play = () => {
    interval = setInterval(() => {
      $.fn.carousel.next();
    }, 3000);
  };

  const stop = () => {
    clearTimeout(interval);
  };

  const shift = () => {
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
        .one('load', () => {
          item.append(img);
          animations.in(img);
        });
      $.fn.carousel.cover = instance.options.coverIndex;
    });
  };

  /**
   * Exposed methods/properties
   */
  $.fn.carousel.next = () => {
    const opts = instance.options;
    const len = (opts.items || []).length;
    instance.options.coverIndex = (opts.coverIndex + 1) % len;
    shift();
  };

  $.fn.carousel.previous = () => {
    const opts = instance.options;
    const len = (opts.items || []).length;
    instance.options.coverIndex = len - ((len - opts.coverIndex) % len) - 1;
    shift();
  };

  $.fn.carousel.cover = instance.options.coverIndex;
})(jQuery);
