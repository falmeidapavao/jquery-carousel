'use strict';
(function ($) {
  /**
   * Private fields
   */
  const instance = {
    root: null,
    template: null,
    options: {}
  };
  const animations = {};
  let interval = null;

  /**
   * Plugin
   */
  $.fn.carousel = function (options) {
    instance.root = $(this);

    // Extend defaults with provided options.
    instance.options = $.extend($.fn.carousel.defaults, options);

    return this.each(() => {
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

      // Check for auto shift mode.
      if (instance.options.auto) {
        $.fn.carousel.play();
      }
    });
  };

  /**
   * Default options
   */
  $.fn.carousel.defaults = {
    items: [{ src: '' }],
    coverIndex: 0,
    auto: false,
    controls: false
  };

  /**
   * Private functions
   */
  const render = () => {
    const container = $('<div>', { class: 'c-container' });
    const item = $('<div/>', { id: 'c-item', class: 'c-item' });
    const img = $('<img/>', {
      'id': 'c-img',
      'class': 'c-img',
      'src': instance.options.items[instance.options.coverIndex].src
    });
    const next = $('<i/>', {
      'id': 'c-next',
      'class': 'c-arrow c-next fas fa-caret-right fa-3x',
      'data-op': 'next'
    });
    const previous = $('<i/>', {
      'id': 'c-previous',
      'class': 'c-arrow c-previous fas fa-caret-left fa-3x',
      'data-op': 'previous'
    });

    item.append(img);

    // If user has controls enabled, set them.
    if (instance.options.controls) {
      const controls = $('<div/>', {
        'id': 'c-controls',
        'class': 'c-controls'
      });
      const action = $('<i/>', {
        'id': 'c-action',
        'class': 'fas fa-play-circle fa-2x',
        'data-op': 'play'
      });
      controls.append(action);
      item.append(controls);
    }

    // Append to container and set instance template.
    container.append(item, next, previous);
    instance.template = container;

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
        case 'play':
          return $.fn.carousel.play;
        case 'pause':
          return $.fn.carousel.pause;
        default:
          return () => { };
      }
    };

    // Icons.
    tmpl.find('#c-next, #c-previous, #c-action').on('click', e => {
      e.stopPropagation();
      const $this = $(e.currentTarget);
      operation($this.data('op'))();
    });

    // Frame.
    tmpl.on('click contextmenu', e => {
      e.preventDefault();
      $.fn.carousel.pause();
      operation(e.type)();
    });
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

  const setControl = (id, addClass, removeClass, action) => {
    instance.template
      .find(id)
      .removeClass(removeClass)
      .addClass(addClass)
      .data('op', action);
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

  $.fn.carousel.play = (provider) => {
    if (instance.options.controls)
      setControl(
        '#c-action',
        'fa-pause-circle',
        'fa-play-circle',
        'pause');
    interval = setInterval(() => {
      $.fn.carousel.next();
    }, 3000);
  };

  $.fn.carousel.pause = () => {
    if (instance.options.controls)
      setControl(
        '#c-action',
        'fa-play-circle', 
        'fa-pause-circle', 
        'play');
    clearTimeout(interval);
  };

  $.fn.carousel.cover = instance.options.coverIndex;
})(jQuery);
