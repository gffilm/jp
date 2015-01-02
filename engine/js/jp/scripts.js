


/*
 * The scripts class
*/
jp.scripts = function() {

   
 /*
 * The current script.
 * @type {string}
 */
  this.script_ = null;

  /*
 * The style queue to load.
 * @type {array}
 */
  this.scriptQueue_ = [];
};


/*
 * Adds the scripts from the model
 * @param {array} scripts the scripts to add
*/
jp.scripts.prototype.addScripts = function(scripts) {
    var totalScripts,
      paths,
      i,
      p;

  if (!scripts || scripts.length === 0) {
    return;
  }
  totalScripts = scripts.length;

  // Load the scripts
  for (i = 0; i < totalScripts; i++) {
    // Add highest priority first
    paths = jp.assets.getAssetPacks(['scripts/' + scripts[i]], false);
    for (p in paths) {
      this.addScript(paths[p]);
    }
  }
};


/*
 * Adds a style to the queue
 * @param {string} script the uri of the script to load.
*/
jp.scripts.prototype.addScript = function(script) {
  this.scriptQueue_.push(script);
};

/*
 * Gets a script
 * @return {Function} the script.
*/
jp.scripts.prototype.getScript = function() {
  return this.script_;
};

/*
 * Loads all script from the queue in order
*/
jp.scripts.prototype.loadScripts = function() {
  var script;
  if (this.scriptQueue_.length > 0) {
    // Get the last item in the queue (lowest priority first)
    script = this.scriptQueue_[this.scriptQueue_.length -1];
    this.loadScript(script);
    this.scriptQueue_.pop();
  } else {
    jp.events.talk(this, jp.events.allScriptsLoaded);
  }
};


/*
 * Loads a style
 * @param {string} path the uri of the style to load.
*/
jp.scripts.prototype.loadScript = function(path) {
  success = function(data) {
    this.script_ = data;
    this.loadScripts();
  }.bind(this);

  $.get(path, success).fail(function() {
    jp.error(jp.errorCodes['scriptMissing'], path);
    this.loadScripts();
  }.bind(this));
};
