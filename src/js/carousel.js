'use strict';

$.fn.carousel = function(options) {
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
			items: [{ src: '' }],
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
	const run = () => {
		bootstrapOptions();
		render();
	};

	const bootstrapOptions = () => {
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
		instance.animations.in = function() {
			this[currentAnimation['in']]();
		};
		instance.animations.out = function() {
			return this[currentAnimation['out']]();
		};
	};

	const render = () => {
		const container = $('<div>', { class: 'c-container' });
		const item = $('<div/>', { id: 'c-item', class: 'c-item' });
		const img = $('<img/>', {
			id: 'c-img',
			class: 'c-img',
			src: options.items[instance.options.coverIndex].src
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
    
    const operation = (op) => {
      switch (op) {
        case 'contextmenu': return previous;
        case 'previous': return previous;
        case 'click': return next;
        case 'next': return next;
        default: return () => {};
      }
    };

		// Icons.
		tmpl.find('#c-next, #c-previous').on('click', function (e) {
      e.preventDefault();
			e.stopPropagation();
			stop();
      // Must be function instead of lambda because of $(this)
			operation($(this).data('op'))();
		});

    // Frame.
    tmpl.on('click contextmenu', (e) => {
      e.preventDefault();
      stop();
      operation(e.type)();
    });
	};

	/**
	 * Animations/Shifting.
	 */
	const shift = () => {
		const tmpl = instance.template;
		const item = tmpl.find('#c-item');
		const img = tmpl.find('#c-img');

		// Wait for out animation to stop before working on DOM.
		// Also wait for next/previous image to be loaded.
		$.when(instance.animations.out.call(img)).done(function() {
			img
				.detach()
				.attr('src', options.items[instance.options.coverIndex].src)
				.css({ display: 'none' })
				.one('load', function() {
					item.append(img);
					instance.animations.in.call(img);
				});
		});
	};

	const next = () => {
		const opts = instance.options;
		instance.options.coverIndex =
			(opts.coverIndex + 1) % (opts.items || []).length;
		shift();
	};

	const previous = () => {
		const opts = instance.options;
		const len = (opts.items || []).length;
		instance.options.coverIndex = len - ((len - opts.coverIndex) % len) - 1;
		shift();
	};

	const play = () => {
		instance.interval = setInterval(() => next(), 3000);
	};

	const stop = () => clearTimeout(instance.interval);

	/**
	 * Run plugin.
	 */
	run();
};
