'use strict';
$.fn.carroussel = function (options) {
  /**
   * Instance(plugin model).
   */
  var instance = {
    id: this.attr('id'),
    root: this,
    template: null,
    options: {
      items: [{ 'src': '' }],
      coverIndex: 0
    },
    interval: null,
    animationIn: function () { },
    animationOut: function () { }
  };

  /**
   * Engine.
   */
  var run = function () {
    bootstrapOptions();
    render();
  };

  var bootstrapOptions = function () {
    instance.options = $.extend(instance.options, options);

    // Mode.
    if (instance.options.mode === 'auto') {
      play();
    }

    // Next/previous animations.
    let animation = { 'in': null, 'out': null };
    switch (instance.options.animation) {
      case 'slide':
        animation['in'] = 'slideDown';
        animation['out'] = 'slideUp';
        break;
      case 'fade':
        animation['in'] = 'fadeIn';
        animation['out'] = 'fadeOut';
        break;
      default:
        break;
    }

    instance.animationIn = function () {
      this[animation['in']]();
    };
    instance.animationOut = function () {
      return this[animation['out']]();
    };
  };

  var events = function () {
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

  var render = function () {
    let container = $('<div>', { 'class': 'c-container' });
    let item = $('<div/>', { 'id': 'c-item', 'class': 'c-item' });
    let img = $('<img/>', { 'id': 'c-img', 'class': 'c-img', 'src': options.items[instance.options.coverIndex].src });
    let next = $('<div/>', { 'id': 'c-next', 'class': 'c-arrow c-next' });
    let previous = $('<div/>', { 'id': 'c-previous', 'class': 'c-arrow c-previous' });
    item.append(img)
    container.append(item, next, previous);
    instance.template = container;

    events();

    instance.root.html(instance.template);
  };

  /**
   * Animations/Shifting.
   */
  var shift = function () {
    let item = instance.template.find('#c-item');
    let img = instance.template.find('#c-img');

    // Wait for out animation to stop before working on DOM.
    // Also wait for next/previous image to be loaded.
    $.when(instance.animationOut.call(img)).done(function () {
      img.detach()
        .attr('src', options.items[instance.options.coverIndex].src)
        .css({ 'display': 'none' })
        .one('load', function () {
          item.append(img);
          instance.animationIn.call(img);
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
