interface JQuery {
  carousel(): Carousel;
}

interface Carousel {
  cover: number;
  previous(): void;
  next(): void;
}
