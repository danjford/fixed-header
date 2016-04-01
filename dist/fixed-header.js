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

  var defaults = {

    type: '',
    element: '', // The Class or ID to attach the event to
    offsetTop: 0,
    useStyles: true, // Default - By default inserts styles
    fixedClass: null, // Add the a CSS class when conditions are met
    stickToElement: null, // Stick to the specified element
    dynamicPadding: false // Dynamic padding

  };

  function setupEvent() {

    var conf = this.config;

    this.instance = {
      isAbsolute: true,
      previousScroll: getScrollTop('body'),
      element: typeof conf.element === 'string' ? document.querySelector(conf.element) : conf.element
    };

    document.addEventListener('scroll', scrollEvent.bind(this));
    document.addEventListener('touchmove', scrollEvent.bind(this));
  }

  // Getting the scroll top of the passed string element i.e. wouldn't work if you had multiple header elements in the page.
  var getScrollTop = function getScrollTop(el) {
    return document.querySelector(el).scrollTop;
  };

  function scrollEvent(e) {

    var header = this.instance.element;

    var isAbsolute = this.instance.isAbsolute,
        previousScroll = this.instance.previousScroll;

    // The new scrolling position
    var newScroll = getScrollTop('body'),
        headerClientHeight = header.clientHeight,
        headerOffsetTop = header.offsetTop,
        fixedClass = 'fixed';

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

    this.config = options ? deepExtend(defaults, options) : defaults;
    this.instance = {};
    setupEvent.call(this);
  };

  return FixedHeader;

}));
//# sourceMappingURL=fixed-header.js.map