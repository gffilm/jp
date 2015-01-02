jp.assets = {};

/*
 * Gets the asset packs to load each page
 * @param {Array} files the files to grab
 * @param {boolean} localized should we get localized paths?
 * @param {?string} fileType the file type.
 * @return {Array} the asset paths.
*/
jp.assets.getAssetPacks = function(files, localized, fileType) {
  // Get the set language
  var language = jp.util.getUrlParams('l') || 'en',
      courseId = jp.util.getUrlParams('c'),
      brand = jp.util.getUrlParams('b'),
      content = jp.getCurrentPath(),
      type = fileType ? fileType : 'js',
      assetPaths = [],
      i;

  // The Content asset paths to load
  for (i in files) {
    assetPaths.push('../content/' + content + '/assets/global/' + files[i] + '.' + type);
    if (localized) {
      assetPaths.push('../content/' + content + '/assets/' + language + '/' + files[i] + '.' + type);
    }
  }


  // The Course asset paths to load
  /*if (courseId) {
    for (i in files) {
      assetPaths.push('../courses/' + courseId + '/content/' + content + '/global/' + files[i] + '.' + type);
      if (localized) {
        assetPaths.push('../courses/' + courseId + '/content/' + content + '/assets/' + language + '/' + files[i] + '.' + type);
      }
    }
  }

  //The Brand Asset paths to load
  if (brand) {
    for (i in files) {
      assetPaths.push('../brands/' + brand + '/content/' + content + '/global/' + files[i] + '.' + type);
      if (localized) {
        assetPaths.push('../brands/' + brand + '/content/' + content + '/' + language + '/' + files[i] + '.' + type);
      }
    }
  }*/


  return assetPaths;
};



/*
 * Gets the initial asset paths to load the course, theme and brand
 * @param {Array} files the files to grab
 * @param {string} fileType the file type
 * @return {Array} the asset paths.
*/
jp.assets.getStructurePaths = function(files, fileType) {
  // Get the set language
  var courseId = jp.util.getUrlParams('c'),
      brand = jp.util.getUrlParams('b'),
      assetPaths = [],
      type = fileType ? fileType : 'js',
      i;

  // The Course Asset paths to load
  if (courseId) {
    this.course_ = courseId;
    for (i in files) {
      assetPaths.push('../courses/' + courseId + '/assets/global/js/' + files[i] + '.' + type);
    }
  }

  //The Brand Asset paths to load
  if (brand) {
    this.brand_ = brand;
    for (i in files) {
      assetPaths.push('../brands/' + brand + '/assets/global/js/' + files[i] + '.' + type);
    }
  }

  return assetPaths;
};