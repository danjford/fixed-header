(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FixedHeader = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };
  babelHelpers;

  // Getting the scroll top of the passed string element i.e. wouldn't work if you had multiple header elements in the page.
  var getScrollTop = function getScrollTop(el) {
    return document.querySelector(el).scrollTop;
  };

  /**
   * Checks if the configured minWidth or the maxWidth has been exceeded and
   * calls the relevant events
   * @param  {Object} _this, the configured instace of FixedHeader
   * @param  {Object} event, the scroll event object
   * @return {Boolean}, whether or not a bound has been exceeded
   */
  var boundsExceeded = function boundsExceeded(_this, event) {

    var windowWidth = window.innerWidth,
        minExceeded = _this.config.minWidth !== null && windowWidth < _this.config.minWidth,
        maxExceeded = _this.config.maxWidth !== null && windowWidth > _this.config.maxWidth;

    if (maxExceeded && typeof _this.instance.maxWidthEvent === 'function') _this.instance.maxWidthEvent.call(_this, event);
    if (minExceeded && typeof _this.instance.minWidthEvent === 'function') _this.instance.minWidthEvent.call(_this, event);

    return minExceeded || maxExceeded;
  };

  /**
   * The event which is called on scroll which switched the header between it's normal styling
   * and the fixed styling.
   * @param  {Object} e, the event object
   * @return {Void}, nothing is returned
   */
  function scrollEvent(e) {

    var header = this.instance.element;

    // If the bounds are exceeded, cancel!
    if (boundsExceeded(this, e)) return;

    var isAbsolute = this.instance.isAbsolute,
        previousScroll = this.instance.previousScroll;

    // The new scrolling position
    var newScroll = getScrollTop('body'),
        headerClientHeight = header.clientHeight,
        headerOffsetTop = header.offsetTop,
        fixedClass = this.config.fixedClass !== null ? this.config.fixedClass : 'fixed';

    if (newScroll < previousScroll && headerClientHeight + headerOffsetTop < newScroll && isAbsolute) {

      // If we are scrolling up, place it above the viewport so that it can slide and reveal
      header.style.top = newScroll - headerClientHeight + 'px';
    } else if (newScroll <= headerOffsetTop && isAbsolute) {

      // We have reached the top of the header, so fix it!
      header.style.top = 0;
      header.classList.add(fixedClass);
      this.instance.isAbsolute = false;
    } else if (newScroll > previousScroll && !isAbsolute) {

      // We are scrolling down again so add the top position to be the current scroll
      // and remove fixed. This gives the appearance that we are just leaving it there
      // as it slides out of view.
      header.style.top = newScroll + 'px';
      header.classList.remove(fixedClass);
      this.instance.isAbsolute = true;
    }

    // Set the scroll for comparison on the next scroll event
    this.instance.previousScroll = newScroll;
  };

  /**
   * Sets up the called instance with default configs and sets up the scroll and touch events
   * @return {Void}, nothing is returned
   */
  function setupScrollEvent() {

    var conf = this.config;

    this.instance = {
      isAbsolute: true,
      previousScroll: getScrollTop('body'),
      element: typeof conf.element === 'string' ? document.querySelector(conf.element) : conf.element
    };

    document.addEventListener('scroll', scrollEvent.bind(this));
    document.addEventListener('touchmove', scrollEvent.bind(this));
  }

  /**
   * Sets up the events on the object such as onMaxWidth or onMinWidth
   * @return {Void}, nothing is returned
   */
  function setupEvents() {

    for (var key in eventConfig) {

      this[key] = eventConfig[key];
    }
  }

  /**
   * Used by the user to set up their maxWidthEvent
   * @param  {Function} callback, the function they want called.
   * @return {Void}, nothing is returned
   */
  function onMaxWidth(callback) {
    if (typeof callback === 'function') this.instance.maxWidthEvent = callback;
  }

  /**
   * Used by the user to set up their minWidthEvent
   * @param  {Function} callback, the function they want called.
   * @return {Void}, nothing is returned
   */
  function onMinWidth(callback) {
    if (typeof callback === 'function') this.instance.minWidthEvent = callback;
  }

  var defaultConfig = {

    type: '',
    element: '', // The Class or ID to attach the event to
    offsetTop: 0,
    minWidth: null, // The minimum width the header should activate on
    maxWidth: null, // The maximum width the current instance should activate on
    useStyles: true, // Default - By default inserts styles
    fixedClass: null, // Add the a CSS class when conditions are met
    stickToElement: null, // Stick to the specified element
    dynamicPadding: false // Dynamic padding
  };

  var eventConfig = {
    onMinWidth: onMinWidth, // The event to happen when the minimum width is reached
    onMaxWidth: onMaxWidth // the event to happen when the maximum width is reached
  };

  /*
   * The full function for extending an array of objects into a new object,
   * can be optionally deep which will recursively go through properties.
   *
   * @param {Object} dest, the new object to write to
   * @param {Array} objs, the array of objects to extend
   * @param {Boolean} deep, decides if copy should be recursive
   * @return {Object} the new written object
  */
  var fullExtend = function fullExtend(dest, objs, deep) {
    for (var i = 0, ii = objs.length; i < ii; i++) {
      var obj = objs[i];

      if (!isObject(obj)) return;

      var objKeys = Object.keys(obj);

      for (var j = 0, jj = objKeys.length; j < jj; j++) {
        var key = objKeys[j];
        var val = obj[key];

        if (isObject(val) && deep) {
          if (!isObject(dest[key])) dest[key] = Array.isArray(val) ? [] : {};
          fullExtend(dest[key], [val], true);
        } else {
          dest[key] = val;
        }
      }
    }

    return dest;
  };

  /**
   * Deep extend the object i.e. recursive copy
   *
   * @param  {Object} dest, the object that will have properties copied to it
   * @param  {Object|Array} val, the second object with the properties to copy or an array of elements
   * @return {Object} the new object with properties copied to it
   */
  var deepExtend = function deepExtend(dest, val) {
    return fullExtend(dest, Array.isArray(val) ? val : [val], true);
  };

  /**
   * @param  {Object} val, the parameter to check if it is a object
   * @return {Boolean} whether or not the parameter is an object
   */
  function isObject(val) {
    return val !== null && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object';
  }

  /**
   * Constructor for the library.
   * @param {Object} options, the configuration options for the lib.
   * @returns {Void}, nothing returned
   */
  function FixedHeader(options) {

    this.config = options ? deepExtend(defaultConfig, options) : defaultConfig;
    this.instance = {};
    setupEvents.call(this);
    setupScrollEvent.call(this);
  };

  return FixedHeader;

}));
//# sourceMappingURL=fixed-header.js.map