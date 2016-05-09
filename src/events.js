// Getting the scroll top of the passed string element i.e. wouldn't work if you had multiple header elements in the page.
const getScrollTop = (el) => {
  return document.querySelector(el).scrollTop;
}

function scrollEvent(e) {

  const header = this.instance.element;

  let isAbsolute = this.instance.isAbsolute,
    previousScroll = this.instance.previousScroll;

  // The new scrolling position
  const newScroll = getScrollTop('body'),
        headerClientHeight = header.clientHeight,
        headerOffsetTop = header.offsetTop,
        fixedClass = 'fixed';

  if ( newScroll < previousScroll && (headerClientHeight + headerOffsetTop) < newScroll && isAbsolute ) {

    // If we are scrolling up, place it above the viewport so that it can slide and reveal
    header.style.top = `${newScroll - headerClientHeight}px`;

  } else if ( newScroll <= headerOffsetTop && isAbsolute ) {

    // We have reached the top of the header, so fix it!
    header.style.top = 0;
    header.classList.add( fixedClass );
    this.instance.isAbsolute = false;

  } else if ( newScroll > previousScroll  && !isAbsolute ) {

    // We are scrolling down again so add the top position to be the current scroll
    // and remove fixed. This gives the appearance that we are just leaving it there
    // as it slides out of view.
    header.style.top = `${newScroll}px`;
    header.classList.remove( fixedClass );
    this.instance.isAbsolute = true;

  }

  // Set the scroll for comparison on the next scroll event
  this.instance.previousScroll = newScroll;

};

export function setupEvent() {

  const conf = this.config;

  this.instance = {
    isAbsolute: true,
    previousScroll: getScrollTop('body'),
    element: typeof conf.element === 'string' ? document.querySelector( conf.element ) : conf.element
  };

  document.addEventListener( 'scroll', scrollEvent.bind(this) );
  document.addEventListener( 'touchmove', scrollEvent.bind(this) );

}