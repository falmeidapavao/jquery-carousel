import * as fc from 'fast-check';

describe('Carousel plugin', () => {
  it('should initialize', () => {
    const div = $('<div></div>');
    const plugin = div.carousel();
    expect(plugin).toBeDefined();
  });

  describe('next and previous properties', () => {
    const imageUrl = fc.record({
      src: fc.webUrl()
    });
    const testParams = { verbose: true };

    it('next should always increase the index or cycle to first item', () => {
      const gen = fc.record({
        items: fc.array(imageUrl, 1, 100)
      });

      fc.assert(
        fc.property(gen, options => {
          const div = $('<div></div>');
          const current = div.carousel(options);
          const next = current.next();
          return current.index < next.index || next.index === 0;
        }),
        testParams
      );
      expect().nothing();
    });

    it('previous should always decrease the index or cycle to last item', () => {
      const gen = fc.record({
        items: fc.array(imageUrl, 1, 100)
      });

      fc.assert(
        fc.property(gen, options => {
          const div = $('<div></div>');
          const current = div.carousel(options);
          const previous = current.previous();
          const count = current.items.length;
          return current.index > previous.index || previous.index === count - 1;
        }),
        testParams
      );
      expect().nothing();
    });

    it('next and previous are opposite effects', () => {
      const gen = fc.record({
        items: fc.array(imageUrl, 1, 100)
      });

      fc.assert(
        fc.property(gen, options => {
          const div = $('<div></div>');
          const api = div.carousel(options);
          return (
            api.next().previous().index === api.index && api.previous().next().index === api.index
          );
        }),
        testParams
      );
      expect().nothing();
    });

    it('the carousel is cyclic in both directions', () => {
      const gen = fc.array(imageUrl, 1, 100).chain(items =>
        fc.record({
          items: fc.constant(items),
          index: fc.integer(0, items.length - 1)
        })
      );

      fc.assert(
        fc.property(gen, options => {
          const div = $('<div></div>');
          const api = div.carousel(options);

          const n = options.items.length;
          const range = Array.from(Array(n).keys());

          const backward = range.reduce(acc => acc.previous(), api);
          const forward = range.reduce(acc => acc.next(), api);

          return backward.index === api.index && forward.index === api.index;
        }),
        testParams
      );
      expect().nothing();
    });
  });
});
