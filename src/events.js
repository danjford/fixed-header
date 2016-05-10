import { eventConfig } from './config';

// Getting the scroll top of the passed string element i.e. wouldn't work if you had multiple header elements in the page.
const getScrollTop = (el) => {
  return document.querySelector(el).scrollTop;
}

/**
 * Checks if the configured minWidth or the maxWidth has been exceeded and
 * calls the relevant events
 * @param  {Object} _this, the configured instace of FixedHeader
 * @param  {Object} event, the scroll event object
 * @return {Boolean}, whether or not a bound has been exceeded
 */
const boundsExceeded = ( _this, event ) => {

  const windowWidth = window.innerWidth,
    minExceeded = _this.config.minWidth !== null && windowWidth < _this.config.minWidth,
    maxExceeded = _this.config.maxWidth !== null && windowWidth > _this.config.maxWidth;

  if ( maxExceeded && typeof _this.instance.maxWidthEvent === 'function' ) _this.instance.maxWidthEvent.call( _this, event );
  if ( minExceeded && typeof _this.instance.minWidthEvent === 'function' ) _this.instance.minWidthEvent.call( _this, event );

  return minExceeded || maxExceeded;

}


/**
 * The event which is called on scroll which switched the header between it's normal styling
 * and the fixed styling.
 * @param  {Object} e, the event object
 * @return {Void}, nothing is returned
 */
function scrollEvent(e) {

  const header = this.instance.element;

  // If the bounds are exceeded, cancel!
  if ( boundsExceeded( this, e ) ) return;

  let isAbsolute = this.instance.isAbsolute,
    previousScroll = this.instance.previousScroll;

  // The new scrolling position
  const newScroll = getScrollTop('body'),
        headerClientHeight = header.clientHeight,
        headerOffsetTop = header.offsetTop,
        fixedClass = this.config.fixedClass !== null ? this.config.fixedClass : 'fixed';

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

/**
 * Sets up the called instance with default configs and sets up the scroll and touch events
 * @return {Void}, nothing is returned
 */
export function setupScrollEvent() {

  const conf = this.config;

  this.instance = {
    isAbsolute: true,
    previousScroll: getScrollTop('body'),
    element: typeof conf.element === 'string' ? document.querySelector( conf.element ) : conf.element
  };

  document.addEventListener( 'scroll', scrollEvent.bind(this) );
  document.addEventListener( 'touchmove', scrollEvent.bind(this) );

}

/**
 * Sets up the events on the object such as onMaxWidth or onMinWidth
 * @return {Void}, nothing is returned
 */
export function setupEvents() {

  for ( var key in eventConfig ) {

    this[ key ] = eventConfig[key];

  }

}

/**
 * Used by the user to set up their maxWidthEvent
 * @param  {Function} callback, the function they want called.
 * @return {Void}, nothing is returned
 */
export function onMaxWidth( callback ) {
  if ( typeof callback === 'function' ) this.instance.maxWidthEvent = callback;
}

/**
 * Used by the user to set up their minWidthEvent
 * @param  {Function} callback, the function they want called.
 * @return {Void}, nothing is returned
 */
export function onMinWidth( callback ) {
  if ( typeof callback === 'function' ) this.instance.minWidthEvent = callback;
}