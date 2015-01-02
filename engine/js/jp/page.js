

/*
 * The page class
 * @type {object} model the model for this page.
*/
jp.page = function(model) {


 /*
 * The model for this page
 * @type {Object}
 */
  this.model_ = model;

 /*
 * The id for this model
 * @type {Object}
 */
  this.id_ = model['id'];

 /*
 * The type of page
 * @type {Object}
 */ this.type_ = model['type'];

 /*
 * The styles associated with this page.
 * @type {array}
 */
  this.styles_ = model['styles'];

/*
 * The layouts associated with this page.
 * @type {array}
 */
  this.layouts_ = model['layouts'];

/*
 * The scripts associated with this page.
 * @type {array}
 */
  this.scripts_ = model['scripts'];

 /*
 * The style helper.
 * @type {jp.Styles}
 */
  this.styleHelper_ = new jp.styles();

 /*
 * The layouts helper.
 * @type {jp.Styles}
 */
  this.layoutHelper_ = new jp.layouts();

 /*
 * The scripts helper.
 * @type {jp.Styles}
 */
  this.scriptHelper_ = new jp.scripts();

  // Add listeners before loading
  this.addListeners();

 /*
 * The styles loaded?
 * @type {boolean}
 */
  this.stylesLoaded_ = false;

 /*
 * The layouts loaded?
 * @type {boolean}
 */
  this.layoutsLoaded_ = false;

 /*
 * The scripts loaded?
 * @type {boolean}
 */
  this.scriptsLoaded_ = false;

 /*
 * The timeline
 * @type {TimelineLite}
 */
  this.timeLine_ = new TimelineLite();

  // Add the styles
  this.styleHelper_.addStyles(this.styles_);

  // Load the Styles
  this.styleHelper_.loadStyles();

  // Add the layouts
  this.layoutHelper_.addLayouts(this.layouts_);

  // Load the layouts
  this.layoutHelper_.loadLayouts();

  // Create the canvas
  this.layoutHelper_.createCanvas(this.id_, this.type_);

  // Add the scripts
  this.scriptHelper_.addScripts(this.scripts_);

  // Load the scripts
  this.scriptHelper_.loadScripts();
};


/*
 * Adds the styles for the model
*/
jp.page.prototype.addListeners = function() {
  jp.events.listen(this.styleHelper_, jp.events.allStylesLoaded, jp.bind(this.setReady, this, 'styles'), this);
  jp.events.listen(this.layoutHelper_, jp.events.allLayoutsLoaded, jp.bind(this.setReady, this, 'layouts'), this);
  jp.events.listen(this.scriptHelper_, jp.events.allScriptsLoaded, jp.bind(this.setReady, this, 'scripts'), this);
};


/*
 * Sets the ready state
 * @param {string} type the required type needed to be ready before animation
*/
jp.page.prototype.setReady = function(type) {
  if (type === 'scripts') {
    this.scriptsLoaded_ = true;
    this.script = this.scriptHelper_.getScript();
    this.activate = eval(this.script);
  }

  if (type === 'styles') {
    this.stylesLoaded_ = true;
  }

  if (type === 'layouts') {
    this.layoutsLoaded_ = true;
    this.layoutHelper_.appendCanvas();
  }
  if (this.stylesLoaded_ && this.layoutsLoaded_ && this.scriptsLoaded_ && !this.isActivated_) {
    this.isActivated_ = true;
    console.log('Activating', this.id_);
    jp.events.talk(this, jp.events.readyToActivate);
  }
};


/*
 * Disposes the page
*/
jp.page.prototype.dispose = function() {
  this.layoutHelper_.deleteCanvas();
  this.styleHelper_.removeCss();
  this.timeLine_.remove();
  this.timeLine_ = null;
  this.isActivated_ = false;
};


/*
 * Base function that is overridden by the loaded scripts
*/
jp.page.prototype.activate = function() {
}

/*
 * Base function that is overridden by the loaded scripts
*/
jp.page.prototype.update = function() {
}


/*
 * Gets the timeline
 * @return {Timeline}
*/
jp.page.prototype.getTimeLine = function() {
  return this.timeLine_;
}
