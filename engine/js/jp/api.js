/*
 * @fileOverview
 * This is the API calls that the content can make
*/

/*
 * Convenience call to reboot the engine
 * @return {*} the data or null.
*/
jp.restart = function() {
  if (jp.getEngine()) {
    jp.getEngine().restart();
  }
};

/*
 * Convenience call to get the engine
 * @return {jp.engine} the engine
*/
jp.getEngine = function() {
  return jp.engineInstance;
};


/*
 * Convenience call to get the structure
 * @return {string} the course id.
*/
jp.getStructure = function() {
  return jp.getEngine().structure_;
};


/*
 * Convenience call to get the engine's current content number
 * @return {string} the content path
*/
jp.getCurrent = function() {
  return jp.getEngine().current_;
}



/*
 * Convenience call to get the engine's current content path
 * @return {string} the content path
*/
jp.getCurrentPath = function() {
  return jp.getEngine().currentPath_;
}


/*
 * Convenience call to get the engine data
 * @return {*} the data or null.
*/
jp.getData = function() {
  return jp.getEngine().getData();
};


/*
 * Convenience call to get the engine data
 * @return {*} the data or null.
*/
jp.getCurrentModel = function() {
  return jp.getEngine().getCurrentModel();
};



/*
 * Convenience call to get the engine config
 * @return {*} the data or null.
*/
jp.getConfig = function() {
  return jp.getCurrentModel()['config'];
};

/*
 * Convenience call to get the engine models
 * @return {*} the data or null.
*/
jp.getModels = function() {
  return jp.getCurrentModel()['model'];
};

/*
 * Convenience call to get the context (css)
 * @return {*} the data or null.
*/
jp.getContext = function() {
  return jp.getCurrentModel()['context'];
};


/*
 * Convenience call to get the engine localization
 * @return {*} the data or null.
*/
jp.getLocalization = function() {
  return jp.getCurrentModel()['localization'];
};

/*
 * Convenience call to get the next page
*/
jp.getNext = function() {
  jp.getEngine().getNext();
};


/*
 * Convenience call to get the previous page
*/
jp.getPrevious = function() {
  jp.getEngine().getPrevious();
};

/*
 * Base function for when the engine is activated
*/
jp.getCurrentTimeline = function() {
  return jp.getEngine().getCurrentTimeline();
};
