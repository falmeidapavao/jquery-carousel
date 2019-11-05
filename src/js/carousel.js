'use strict';
(function($) {
  /**
   * Plugin
   */
  $.fn.carousel = function(options) {
    /**
     * Default options
     */
    const defaults = {
      auto: false,
      controls: false,
      index: 0,
      items: [],
      animation: 'fade'
    };

    /**
     * API instance
     */
    const instance = {
      ...defaults,
      ...options,
      root: $(this),
      animations: {}
    };

    let history = [];

    /**
     * Private functions
     */
    const render = instance => {
      const container = $('<div>', { class: 'c-container' });
      const item = $('<div/>', { id: 'c-item', class: 'c-item' });
      const img = src =>
        $('<img/>', {
          id: 'c-img',
          class: 'c-img',
          src: src
        });
      const next = $('<i/>', {
        id: 'c-next',
        class: 'c-arrow c-next fas fa-caret-right fa-3x',
        'data-op': 'next'
      });
      const previous = $('<i/>', {
        id: 'c-previous',
        class: 'c-arrow c-previous fas fa-caret-left fa-3x',
        'data-op': 'previous'
      });

      if ((instance.items || []).length > 0) {
        const currentItem = instance.items[instance.index];
        if (currentItem) {
          item.append(img(currentItem.src));
        }
      }

      // If user has controls enabled, set them.
      if (instance.controls) {
        const controls = $('<div/>', {
          id: 'c-controls',
          class: 'c-controls'
        });
        const action = $('<i/>', {
          id: 'c-action',
          class: 'fas fa-play-circle fa-2x',
          'data-op': 'play'
        });
        controls.append(action);
        item.append(controls);
      }

      // Append to container and set instance template.
      container.append(item, next, previous);
      const instanceWithTemplate = {
        ...instance,
        template: () => $('.c-container', instance.root)
      };

      // Render template effect
      instanceWithTemplate.root.html(container);

      // Instance with template with attached events
      return setEvents(instanceWithTemplate);
    };

    const setEvents = instance => {
      const tmpl = instance.template();
      const operation = op => {
        switch (op) {
          case 'contextmenu':
          case 'previous':
            return previous;
          case 'click':
          case 'next':
            return next;
          case 'play':
            return play;
          case 'pause':
            return pause;
          default:
            return () => currentInstance(instance);
        }
      };

      // Icons.
      tmpl.find('#c-next, #c-previous, #c-action').on('click', e => {
        e.stopPropagation();
        const $this = $(e.currentTarget);
        return operation($this.data('op'))(currentInstance(instance));
      });

      // Frame.
      tmpl.on('click contextmenu', e => {
        e.preventDefault();
        return operation(e.type)(pause(currentInstance(instance)));
      });

      return instance;
    };

    const shift = instance => {
      const tmpl = instance.template();
      const item = tmpl.find('#c-item');
      const img = tmpl.find('#c-img');

      // Wait for out animation to stop before working on DOM.
      // Also wait for next/previous image to be loaded.
      $.when(instance.animations.out(img)).done(function() {
        img
          .detach()
          .attr('src', instance.items[instance.index].src)
          .css({ display: 'none' })
          .one('load', () => {
            item.append(img);
            instance.animations.in(img);
          });
      });

      return instance;
    };

    const setControl = (instance, id, addClass, removeClass, action) => {
      instance
        .template()
        .find(id)
        .removeClass(removeClass)
        .addClass(addClass)
        .data('op', action);
      return instance;
    };

    // Next/previous animations.
    const currentAnimation = animation => {
      switch (animation) {
        case 'slide':
          return { in: 'slideDown', out: 'slideUp' };
        case 'fade':
        default:
          return { in: 'fadeIn', out: 'fadeOut' };
      }
    };

    // Set instance animation callbacks.
    const initAnimations = instance => {
      const animation = currentAnimation(instance.animation);
      return {
        ...instance,
        animations: {
          in: elm => elm[animation.in](),
          out: elm => elm[animation.out]()
        }
      };
    };

    const currentInstance = instance => history[0] || instance;

    const addToHistory = instance => {
      history = [instance, ...history].slice(0, 10);
      return instance;
    };

    /**
     * Exposed methods/properties
     */
    const next = instance => {
      const len = (instance.items || []).length;
      const updatedIndex = (instance.index + 1) % len;
      return addToHistory(shift({ ...instance, index: updatedIndex }));
    };

    const previous = instance => {
      const len = (instance.items || []).length;
      const updatedIndex = len - ((len - instance.index) % len) - 1;
      return addToHistory(shift({ ...instance, index: updatedIndex }));
    };

    const play = instance => {
      const createInterval = instance =>
        addToHistory({
          ...instance,
          interval: setInterval(() => {
            next(currentInstance(instance));
          }, 3000)
        });
      if (instance.controls) {
        return createInterval(
          setControl(instance, '#c-action', 'fa-pause-circle', 'fa-play-circle', 'pause')
        );
      }
      return createInterval(instance);
    };

    const pause = instance => {
      const removeInterval = instance => {
        const { interval, ...instanceWithoutInterval } = instance;
        clearTimeout(interval);
        return addToHistory(instanceWithoutInterval);
      };
      if (instance.controls) {
        return removeInterval(
          setControl(instance, '#c-action', 'fa-play-circle', 'fa-pause-circle', 'play')
        );
      }
      return removeInterval(instance);
    };

    const exposed = api => {
      const latest = history[0] || addToHistory(api);
      return {
        ...latest,
        previous: () => exposed(previous(latest)),
        next: () => exposed(next(latest)),
        play: () => exposed(play(latest)),
        pause: () => exposed(pause(latest))
      };
    };

    // Render UI.
    let api = render(initAnimations(instance));

    // Check for auto shift mode.
    if (instance.auto) {
      api = play(api);
    }

    return exposed(api);
  };
})(jQuery);
