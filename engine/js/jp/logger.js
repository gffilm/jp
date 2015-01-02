
/*
 * The logger class
*/
jp.logger = function() {};


/*
 * The Error objects wih a code and detail
 */
jp.errorCodes = {
  'libraryLoad': {'code': 'loader-001', 'detail': 'Error loading libraries'},
  'jsonLoad': {'code': 'loader-002', 'detail': 'Error loading json files'},
  'styleError': {'code': 'css-001', 'detail': 'Error parsing css file'},
  'styleMissing': {'code': 'css-002', 'detail': 'CSS stylesheet missing'},
  'styleMissingFromConfig': {'code': 'css-003', 'detail': 'Styles missing from config'},
  'layoutMissingFromConfig': {'code': 'layout-001', 'detail': 'Styles missing from config'},
  'layoutMissing':  {'code': 'layout-002', 'detail': 'Layout not found for id'},
  'localizedStringMissing': {'code': 'local-004', 'detail': 'Localized text not found for id'},
  'parentMissing': {'code': 'model-001', 'detail': 'Parent element not found'},
  'childMissing': {'code': 'model-001', 'detail': 'Child element not found'},
  'contentLoadFail': {'code': 'content-001', 'detail': 'Content failed to load'}
};


/*
 * Logs an error
 * @param {jp.errorCodes} error the error object.
 * @param {string=} optInfo optional error information.
 * @param {boolean=} critical errors throw an alert and stops script execution
*/
jp.error = function(error, optInfo, critical) {
  if (optInfo) {
    if (!error) {
      console.log('error', optInfo);
    } else {
      console.log(error['detail'] + ' - ', optInfo);
    }
    
  } else {
    console.log(error['detail']);
  }
  if (critical) {
    alert(error['detail'] + '\n\nErrorCode:' + error['code']);
    throw Error('Critical error occurred');
  }
};


/*
 * Logs an entry
 * @param {string} name the logging name.
 * @param {string} value the logging value.
*/
jp.log = function(name, value) {
  if (window.console) {
    console.log(name, value);
  } else {
    alert('console logging not enabled');
  }
};
