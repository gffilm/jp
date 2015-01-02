
/*
 * The Global deps object
 */
var deps = {};

/*
 * Define if production mode
 * @define Production mode
 */
deps.PRODUCTION_MODE = false;


/*
 * Define if logging mode
 * @define Log mode
 */
deps.LOG = false;

/*
 * The currently load scripts
 * @type {number}
 */
deps.loadedScripts = 0;

/*
 * The interval used for ensuring a script is loaded
 * @type {window.interval}
 */
deps.interval = [];


/*
 * The startup function called from the index file
 * @public
 * @return {array} scripts to load
*/
deps.getScripts = function() {
  // Set the scripts
  if (deps.PRODUCTION_MODE) {
    scripts = [
      //'js/lib/min/modernizr.min.js',
      'js/lib/min/gsap/TweenMax.min.js',
      //'js/lib/min/gsap/TimelineMax.min.js',
      'js/compiled.js'
    ];
  } else {
    scripts = [
      //'js/lib/modernizr.js',
      'js/lib/gsap/TweenMax.js',
      //'js/lib/jquery-ui.js',
      //'js/lib/gsap/TimelineMax.js',
      'js/lib/gsap/utils/SplitText.min.js',
      'js/jp/base.js',
      'js/jp/assets.js',
      'js/jp/api.js',
      'js/jp/engine.js',
      'js/jp/logger.js',
      'js/jp/events.js',
      'js/jp/ui.js',
      'js/jp/utility.js',
      'js/jp/page.js',
      'js/jp/styles.js',
      'js/jp/layouts.js',
      'js/jp/scripts.js'
    ];
  }
  return scripts;
};


/*
 * Gets the current script to load
 * @return {string} the script to load
*/
deps.getCurrentScript = function() {
  return deps.getScripts()[deps.loadedScripts];
};

/**
 * Loads the scripts
 * @public
 */
deps.loadScripts = function() {
  var script = deps.getCurrentScript();
  if (script) {
    deps.loadScript(script);
  } else {
    if (deps.LOG) {
      console.log('Finished loading all scripts, starting engine');
    }
    jp.startup();
  }
}


/**
 * Creates the header script required for the scripts to load
 * {string} scriptName the script to load
 */
deps.loadScript = function(scriptFileName) {
  $.getScript(scriptFileName)
    .done(deps.loadScriptSuccess)
    .fail(deps.loadScriptFailure);
};





/**
 * Handles a succesful loaded script
 */
deps.loadScriptSuccess = function() {
  if (deps.LOG) {
    console.log('successfully loaded', deps.getCurrentScript());
  }
  deps.loadedScripts++;
  deps.loadScripts();
}


/**
 * Handles a failed loaded script
 */
deps.loadScriptFailure = function(a, b, c) {
  alert('Script failed to load:' + deps.getCurrentScript());
}