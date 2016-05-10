import { onMaxWidth, onMinWidth } from './events';

export const defaultConfig = {

  type: '',
  element: '', // The Class or ID to attach the event to
  offsetTop: 0,
  minWidth: null, // The minimum width the header should activate on
  maxWidth: null, // The maximum width the current instance should activate on
  useStyles: true, // Default - By default inserts styles
  fixedClass: null, // Add the a CSS class when conditions are met
  stickToElement: null, // Stick to the specified element
  dynamicPadding: false // Dynamic padding
}

export const eventConfig = {
  onMinWidth, // The event to happen when the minimum width is reached
  onMaxWidth // the event to happen when the maximum width is reached
}