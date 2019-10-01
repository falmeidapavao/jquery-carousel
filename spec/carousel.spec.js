import * as fc from 'fast-check';

describe('Carousel plugin', () => {
  it('should initialize', () => {
    const div = $('<div></div>');
    const plugin = div.carousel();
    expect(plugin).toBeDefined();
  });

  describe('properties', () => {
    it('next should always increase the index or cycle to first item', () => {
      const imageUrl = fc.record({
        src: fc.webUrl()
      });
      const gen = fc.record({
        items: fc.array(imageUrl, 1, 100)
      });

      fc.assert(
        fc.property(gen, options => {
          const div = $('<div></div>');
          div.carousel(options);
          const currentIndex = $.fn.carousel.cover;
          $.fn.carousel.next();
          const nextIndex = $.fn.carousel.cover;
          return currentIndex < nextIndex || nextIndex === 0;
        }),
        { verbose: true }
      );
    });

    it('previous should always decrease the index or cycle to last item', () => {
      pending('Not implemented');
    });

    it('next and previous are opposite effects', () => {
      pending('Not implemented');
    });

    it('the carousel is cyclic in both directions', () => {
      pending('Not implemented');
    });
  });
});
