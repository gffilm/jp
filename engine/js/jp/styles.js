


/*
 * The styles class
*/
jp.styles = function() {

   
 /*
 * The cssNode associated with this style.
 * @type {Node}
 */
  this.cssNode_ = null;

  /*
 * The style queue to load.
 * @type {array}
 */
  this.styleQueue_ = [];
};


/*
 * Adds the styles from the model
 * @param {array} styles to add
*/
jp.styles.prototype.addStyles = function(styles) {
  var totalStyles,
      paths,
      i,
      p;

  if (!styles || styles.length === 0) {
    jp.error(jp.errorCodes['styleMissingFromConfig']);
    return;
  }
  totalStyles = styles.length;

  // Load the styles
  for (i = 0; i < totalStyles; i++) {
    // Add highest priority first
    paths = jp.assets.getAssetPacks(['styles/' + styles[i]], false, 'css');
    for (p in paths) {
      this.addStyle(paths[p]);
    }
  }
};


/*
 * Adds a style to the queue
 * @param {string} path the uri of the layout to load.
*/
jp.styles.prototype.addStyle = function(path) {
  this.styleQueue_.push(path);
};


/*
 * Loads all styles from the queue in order
*/
jp.styles.prototype.loadStyles = function() {
  var style;
  if (this.styleQueue_.length > 0) {
    // Get the last item in the queue (lowest priority first)
    style = this.styleQueue_[this.styleQueue_.length -1];
    this.loadStyle(style);
    this.styleQueue_.pop();
  } else {
    jp.events.talk(this, jp.events.allStylesLoaded);
  }
};


/*
 * Loads a style
 * @param {string} path the uri of the style to load.
*/
jp.styles.prototype.loadStyle = function(path) {
  success = function(data) {
    this.addCssText(data);
    this.loadStyles();
  }.bind(this);

  $.get(path, success).fail(function() {
    jp.error(jp.errorCodes['styleMissing'], path);
    this.loadStyles();
  }.bind(this));
};

/**
 * Writes a CSS node used to add a style to.
 * @return {Element} The cssNode to embed the styles to.
 */
jp.styles.prototype.getCssNode = function() {
  if (this.cssNode_) {
    return this.cssNode_;
  }

  var cssNode = document.createElement('style'),
      head = document.getElementsByTagName('head')[0];

  cssNode.type = 'text/css';
  head.appendChild(cssNode);
  this.cssNode_ = cssNode;

  // Add event listeners for when the page is removed or when the engine reboots
  jp.events.listen(jp.engineInstance, jp.events.reboot, this.removeCss, this);
  jp.events.listen(this, jp.events.removeCss, this.removeCss, this);
  return this.cssNode_;
};


/**
 * Removes the css Node on an event call
 */
jp.styles.prototype.removeCss = function() {
  if (this.cssNode_) {
    jp.ui.removeElement(this.cssNode_);
  }
};



/**
 * Adds CSS text to the dom's <head>
 * @param {string} cssText CSS to add to the end of the document.
 */
jp.styles.prototype.addCssText = function(cssText) {
  var cssNode = this.getCssNode(),
      cssTextNode,
      pattern = /{#.+};/g,
      match,
      value;

  if (!cssText) {
    return;
  }

  // Handles Defining Values from the context
  if (pattern.test(cssText)) {
    cssText = this.interpretCss(cssText);
  }
  // Adds the CSS to the DOM
  if (cssNode.styleSheet) {
    // IE implementation
    cssNode.styleSheet.cssText += cssText;
  } else {
    // Most browsers
    cssTextNode = document.createTextNode(cssText);
    cssNode.appendChild(cssTextNode);
  }
};

/**
 * Interprets Context Definitions for CSS
 * @param {string} cssText CSS to interpret
 * @return {string} the interpreted cssText.
 */
jp.styles.prototype.interpretCss = function(cssText) {
  var value,
      match,
      interpreted,
      pattern = /{#.+};/g,
      context = jp.getContext(),

  interpreted = cssText.replace(pattern, function(match) {
      match = match.replace('{#', '');
      match = match.replace(' /};', '');
      value = context[match] ? context[match] + ';' : '';
      return value;
    }.bind(this));

  return interpreted;
};