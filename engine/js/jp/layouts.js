


/*
 * The layouts class
*/
jp.layouts = function() {

   
 /*
 * The current layout.
 * @type {string}
 */
  this.layout_ = null;

 /*
 * The canvas.
 * @type {element}
 */
  this.canvas_ = null;

  /*
 * The style queue to load.
 * @type {array}
 */
  this.layoutQueue_ = [];
};


/*
 * Adds the layouts from the model
 * @param {array} layouts the layouts to add
*/
jp.layouts.prototype.addLayouts = function(layouts) {
  var totalLayouts,
      paths,
      i,
      p;

  if (!layouts || layouts.length === 0) {
    jp.error(jp.errorCodes['layoutMissingFromConfig']);
    return;
  }
  totalLayouts = layouts.length;

  // Load the layouts
  for (i = 0; i < totalLayouts; i++) {
    // Add highest priority first
    paths = jp.assets.getAssetPacks(['layouts/' + layouts[i]], false, 'html');
    for (p in paths) {
      this.addLayout(paths[p]);
    }
  }
};


/*
 * Adds a style to the queue
 * @param {string} layout the uri of the layout to load.
*/
jp.layouts.prototype.addLayout = function(layout) {
  this.layoutQueue_.push(layout);
};


/*
 * Creates the canvas
 * @param {string} id the id for the canvas
 * @param {string} className the className for the canvas
*/
jp.layouts.prototype.createCanvas = function(id, className) {
  if (!this.canvas_) {
    this.canvas_ = document.createElement('div');
    this.canvas_.className = className;
    this.canvas_.id = id;
    jp.canvas = this.canvas_;
    jp.events.listen(jp.engineInstance, jp.events.reboot, this.deleteCanvas, this);
  }
};


/*
 * Removes the canvas
*/
jp.layouts.prototype.deleteCanvas = function() {
  if (this.canvas_) {
    $(this.canvas_).remove();
    this.canvas_ = null;
  }
};


/*
 * Append the canvas
*/
jp.layouts.prototype.appendCanvas = function() {
  document.body.appendChild(this.canvas_);
};


/*
 * Loads all layout from the queue in order
*/
jp.layouts.prototype.loadLayouts = function() {
  var layout;
  if (this.layoutQueue_.length > 0) {
    // Get the last item in the queue (lowest priority first)
    layout = this.layoutQueue_[this.layoutQueue_.length -1];
    this.loadLayout(layout);
    this.layoutQueue_.pop();
  } else {
    jp.events.talk(this, jp.events.allLayoutsLoaded);
  }
};


/*
 * Loads a style
 * @param {string} path the uri of the style to load.
*/
jp.layouts.prototype.loadLayout = function(path) {
  success = function(data) {
    this.addLayoutText(data);
    this.loadLayouts();
  }.bind(this);

  $.get(path, success).fail(function() {
    jp.error(jp.errorCodes['layoutMissing'], path);
    this.loadLayouts();
  }.bind(this));
};


/**
 * Adds CSS text to the dom's <head>
 * @param {string} layoutText CSS to add to the end of the document.
 */
jp.layouts.prototype.addLayoutText = function(layoutText) {
  var match,
      value,
      canvas;

  if (!layoutText) {
    return;
  }

  // Handles Defining Values from the layout to the context
  if (/{#.+}/g.test(layoutText)) {
    layoutText = this.interpretLayout(layoutText);
  }

  // Handles Defining Values from the context to the localization
  if (/{#.+}/g.test(layoutText)) {
    layoutText = this.interpretLocalization(layoutText);
  }
  this.canvas_.innerHTML += layoutText;
};


/**
 * Interprets Context Definitions for the layout
 * @param {string} layout the layout to interpret
 * @return {string} the interpreted layout.
 */
jp.layouts.prototype.interpretLayout = function(layout) {
  var value,
      match,
      interpreted,
      pattern = /{#.+}/g,
      context = jp.getContext();

  interpreted = layout.replace(pattern, function(match) {
      // Context Definitions
      match = match.replace('{#', '');
      match = match.replace(' /}', '');
      value = context[match] ? context[match] : '';
      return value;
    }.bind(this));

  return interpreted;
};


/**
 * Interprets Localization Definitions for the context
 * @param {string} layout the layout to interpret
 * @return {string} the interpreted layout.
 */
jp.layouts.prototype.interpretLocalization = function(layout) {
  var value,
      match,
      interpreted,
      pattern = /{#.+}/g,
      localization = jp.getLocalization();

  interpreted = layout.replace(pattern, function(match) {
      match = match.replace('{#', '');
      match = match.replace(' /}', '');
      matches = match.split('.');
      value = localization;
      for (i in matches) {
        value = value[matches[i]];
      }
      return value;
    }.bind(this));

  return interpreted;
};
