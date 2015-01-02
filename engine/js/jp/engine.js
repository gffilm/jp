
/*
 * The engine object
 * @type {object}
 */
jp.engineInstance = null;

/*
 * The class to setup and load the engine
 * @constructor
 */
 jp.engine = function() {

 /*
 * Set the jsonData
 * @type {Object}
 */
  this.data_ = {};

  /*
 * The course used
 * @type {?string}
 */
  this.course_ = null;

/*
 * The theme used
 * @type {?string}
 */
  this.theme_ = null;

 /*
 * The brand used
 * @type {?string}
 */
  this.brand_ = null;
 };

/*
 * The startup function called from the index file
 * @public
*/
 jp.startup = function() {
  if (!jp.engineInstance) {
    jp.engineInstance = new jp.engine();
    jp.engineInstance.init();
  }
};

/*
 * Restart the engine for debugging purposes
 * @public
*/
 jp.engine.prototype.restart = function() {
  jp.events.talk(this, jp.events.reboot);
  document.body.innerHTML = '';
  jp.engineInstance = null;
  this.currentTimeLine_ = null;
  jp.events.unlisten();
  jp.startup();
 };


/*
 * Initializer after libraries are loaded
*/
jp.engine.prototype.init = function() {
  var paths = jp.assets.getStructurePaths(['structure']);
  this.loadJSON(paths, jp.bind(this.getContentPaths, this));
};


/*
 * Now that the structure is received, get the the content
*/
jp.engine.prototype.getContentPaths = function() {
  var uriPaths = jp.util.getUrlParams('s'),
      structure = this.getData()['structure'],
      contentPaths = [],
      paths,
      i;

  if (structure) {
    this.structure_ = structure;
    for (i in structure) {
      contentPaths.push(i);
    }
  }

  if (uriPaths) {
    uriPaths = uriPaths.split(',');
    console.log(uriPaths);
  }

  this.current_ = 0;
  this.contentPaths_ = uriPaths ? uriPaths: contentPaths;
  this.currentPath_ = this.contentPaths_[this.current_];
  // If there is only one path, then there is not a player model
  if (this.contentPaths_.length > 1) {
    this.loadContent(this.createPlayer);
  } else {
    this.loadContent(this.getNext);
  }
};


/*
 * Determines if there is another model
 * @return {boolean} is there a next model to load?
*/
jp.engine.prototype.hasNext = function() {
  return true;
};


/*
 * Sets the current content to the next item
 * @param {Function} callback the callback function.
*/
jp.engine.prototype.getNext = function(callback) {
  var callbackFunction = callback ? callback : this.loadPage;
  if (this.page_) {
    this.removePage();
  }
  this.current_++;
  this.currentPath_ = this.contentPaths_[this.current_];
  if (!this.currentPath_) {
    this.current_--;
    this.currentPath_ = this.contentPaths_[this.current_];
  }
  this.loadContent(callbackFunction);
};


/*
 * Sets the current content to the previous item
 * @param {Function} callback the callback function.

*/
jp.engine.prototype.getPrevious = function(callback) {
  var callbackFunction = callback ? callback : this.loadPage;
  if (this.page_) {
    this.removePage();
  }
  this.current_--;
  if (this.current_ < 1) {
    this.current_++;
    alert('no previous content');
    return;
  }

  this.currentPath_ = this.contentPaths_[this.current_];
  this.loadContent(this.loadPage);
};



/*
 * Now that the structure is received, get the the content
 * @param {Function} callback the callback function.
*/
jp.engine.prototype.loadContent = function(callback) {
  paths = jp.assets.getAssetPacks(['js/config', 'js/context', 'js/page', 'js/localization'], false);
  this.loaded_ = false;
  this.loadJSON(paths, jp.bind(callback, this));
};


/*
 * Loads the json files one at a time to ensure the json data is cascaded by priority
 * @param {Array} paths we take the first path to load.
 * @param {Function} callback the callback function.
*/
jp.engine.prototype.loadJSON = function(paths, callback) {
  var path = paths[0],
      request;

  // If there are no more paths, callback
  if (!path) {
    callback();
    return;
  }
  // remove the path from the array
  paths.shift();

  // get the json file
  request = $.getJSON(path, function(data) {
    this.loaded_ = true;
    // run the callback with the data
    this.handleJSONLoad(path, data);
    // reload this function until there are no more paths
    this.loadJSON(paths, callback);
  }.bind(this)).fail(function(data, response) {
    // load failure handler only if not a 404
    if (response !== 'error') {
      jp.error(jp.errorCodes['jsonLoad'], path + ' ' + response);
    }
    this.loadJSON(paths, callback);
  }.bind(this));
};


/*
 * Handles json paths loaded
 * @param {string} path the path the data came from.
 * @param {Object} data the json data.
*/
jp.engine.prototype.handleJSONLoad = function(path, data) {
  var fileType = path.split('/')[path.split('/').length -1].split('.')[0],
      path = this.currentPath_;

  if (!path) {
    this.data_[fileType] = data;
    $.extend(this.data_[fileType], data);
    return;
  }

  if (!this.data_[path]) {
    this.data_[path] = {};
  }

  // Extend the jsonData object with the filetype
  if (!this.data_[path][fileType]) {
    this.data_[path][fileType] = data;
  }

  // Extend the jsonData object with the data
  $.extend(this.data_[path][fileType], data);
};


/*
 * The engine is now loaded, start the player
*/
jp.engine.prototype.createPlayer = function() {
  this.playerModel_ = this.getCurrentModel()['page'];
  this.player_ = new jp.page(this.playerModel_);
  jp.events.listen(this.player_, jp.events.readyToActivate, jp.bind(this.getNext, this, this.setCourseInfo), this);
};


/*
 * Set Course Information
*/
jp.engine.prototype.setCourseInfo = function() {
  if (!this.loaded_) {
    jp.error(jp.errorCodes['contentLoadFail'], this.currentPath_, true);
  }
  this.model_ = this.getCurrentModel()['page'];
  this.title_ = this.getCurrentLocalization()['course']['title'];
  document.title = this.title_;
  this.player_.activate();
  this.loadPage();
};


/*
 * Loads the page
*/
jp.engine.prototype.loadPage = function() {
  if (!this.loaded_) {
    jp.error(jp.errorCodes['contentLoadFail'], this.currentPath_ , true);
  }
  this.model_ = this.getCurrentModel()['page'];
  this.page_ = new jp.page(this.model_);
  jp.events.listen(this.page_, jp.events.readyToActivate, this.activatePage, this);
};


/*
 * Activate the page
*/
jp.engine.prototype.activatePage = function() {
  this.currentTimeLine_ = this.page_.getTimeLine();
  jp.events.listen(this.page_, jp.events.pageCompleted, this.handlePageCompleted, this);
  this.page_.activate();
};


/*
 * Activate the page
*/
jp.engine.prototype.handlePageCompleted = function() {
  console.log('page completed');
};


/*
 * Removes the page
*/
jp.engine.prototype.removePage = function() {
  this.currentTimeLine_ = null;
  this.page_.dispose();
  this.page_ = null;
};


/*
 * Gets the content
 * @return {Object} the data object.
*/
jp.engine.prototype.getData = function() {
  return this.data_;
};


/*
 * Gets the content by key
 * @param {string key the key.
 * @return {Object} the data object.
*/
jp.engine.prototype.getDataByKey = function(key) {
  return this.getData()[key];
};


/*
 * Gets the current content
 * @return {Object} the data object.
*/
jp.engine.prototype.getCurrentModel = function() {
  return this.getDataByKey(this.currentPath_);
};


/*
 * Gets the current localization
 * @return {Object} the data object.
*/
jp.engine.prototype.getCurrentLocalization = function() {
  return this.getCurrentModel()['localization'];
};


/*
 * Finds specific jsondata
 * @param {Array} data the data to look for.
 * @param {string} type the type to look for.
 * @return {*} the data or null.
*/
jp.engine.prototype.findDataByType = function(data, type) {
  return jp.util.findJsonData(data, type);
};

/*
 * Gets the timeline
 * @return {Object} the timeline.
*/
jp.engine.prototype.getCurrentTimeline = function() {
  return this.currentTimeLine_;
};
