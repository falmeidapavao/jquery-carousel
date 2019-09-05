'use strict';
$.fn.carroussel = function (options) {

  /**
   * Instance(plugin model).
   */
  var instance = {
    // DOM fields.
    id: this.attr('id'),
    root: this,
    template: null,
    // Default plugin options.
    options: {
      items: [{ 'src': '' }],
      coverIndex: 0
    },
    // Internal options.
    interval: null,
    animations: {
      in: null,
      out: null
    }
  };

  /**
   * Engine.
   */
  var run = function () {
    bootstrapOptions();
    render();
  };

  var bootstrapOptions = function () {
    // Replace input options in default options.
    instance.options = $.extend(instance.options, options);

    // Mode.
    if (instance.options.mode === 'auto') {
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
    instance.animations.in = function () {
      this[currentAnimation['in']]();
    };
    instance.animations.out = function () {
      return this[currentAnimation['out']]();
    };
  };
  
  var render = function () {
    let container = $('<div>', { 'class': 'c-container' });
    let item = $('<div/>', { 'id': 'c-item', 'class': 'c-item' });
    let img = $('<img/>', { 'id': 'c-img', 'class': 'c-img', 'src': options.items[instance.options.coverIndex].src });
    let next = $('<div/>', { 'id': 'c-next', 'class': 'c-arrow c-next' });
    let previous = $('<div/>', { 'id': 'c-previous', 'class': 'c-arrow c-previous' });
    item.append(img)
    instance.template = container.append(item, next, previous);;
    setEvents();
    instance.root.html(instance.template);
  };

  var setEvents = function () {
    // Icons.
    instance.template.find('#c-next').on('click', function (e) {
      e.stopPropagation();
      stop();
      next();
    });

    instance.template.find('#c-previous').on('click', function (e) {
      e.stopPropagation();
      stop();
      previous();
    });

    // Frame.
    instance.template.on({
      'click': function () {
        stop();
        next();
      },
      'contextmenu': function (e) {
        e.preventDefault();
        stop();
        previous();
      }
    });
  };

  /**
   * Animations/Shifting.
   */
  var shift = function () {
    let item = instance.template.find('#c-item');
    let img = instance.template.find('#c-img');

    // Wait for out animation to stop before working on DOM.
    // Also wait for next/previous image to be loaded.
    $.when(instance.animations.out.call(img)).done(function () {
      img.detach()
        .attr('src', options.items[instance.options.coverIndex].src)
        .css({ 'display': 'none' })
        .one('load', function () {
          item.append(img);
          instance.animations.in.call(img);
        });
    });
  };

  var next = function () {
    instance.options.coverIndex = instance.options.coverIndex == instance.options.items.length - 1 ?
      0 : instance.options.coverIndex + 1;
    shift();
  };

  var previous = function () {
    instance.options.coverIndex = instance.options.coverIndex == 0 ?
      instance.options.items.length - 1 : instance.options.coverIndex - 1;
    shift();
  };

  var play = function () {
    instance.interval = setInterval(function () {
      next();
    }, 3000);
  };

  var stop = function () {
    clearTimeout(instance.interval);
  };

  /**
   * Run plugin.
   */
  run();
};
