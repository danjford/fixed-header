import { defaultConfig } from './config';
import { setupScrollEvent, setupEvents } from './events'
import { deepExtend } from './utils';

/**
 * Constructor for the library.
 * @param {Object} options, the configuration options for the lib.
 * @returns {Void}, nothing returned
 */
function FixedHeader( options ) {

  this.config = options ? deepExtend( defaultConfig, options ) : defaultConfig;
  this.instance = {};
  setupEvents.call( this );
  setupScrollEvent.call( this );

};


// Options
/*
  type: Sticky, SlideReveal, FixedTop
  options: {
    fixedClass: String,
    useStyles: true, // default
    stickToElement: String or Element
  }
*/


export default FixedHeader;