describe('Carousel plugin', () => {
  it('should initialize', () => {
    const div = $('<div></div>');
    const plugin = div.carousel();
    expect(plugin).toBeDefined();
  });

  describe('properties', () => {
    it('next should always increase the index or cycle to first item', () => {
      pending('Not implemented');
    });

    it('previous should always decrease the index or cycle to last item', () => {
      pending('Not implemented');
    });

    it('next and previous are opposite effects', () => {
      pending('Not implemented');
    });

    it('the carousel is cyclic in both directions', () => {
      pending('Not implemented');
    })
  });
});
