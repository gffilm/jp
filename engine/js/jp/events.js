
/*
 * All event types
*/

jp.events = {
  layoutLoad: 'layoutLoad',
  allLayoutsLoaded: 'allLayoutsLoaded',
  allStylesLoaded: 'allStylesLoaded',
  allScriptsLoaded: 'allScriptsLoaded',
  elementRendered: 'elementRendered',
  readyToActivate: 'readyToActivate',
  activated: 'activated',
  reboot: 'reboot',
  removeCss: 'removeCss',
  pageCompleted: 'pageCompleted'
};

/*
* Stores the listeners
* @type {array}
*/
jp.events.listeners_ = [];

/*
 * Listens for an event, using anthropomorphic metaphors to descripe the listener
 * @param {string} ear the listening device.
 * @param {string} sound the specific sound the ear is listening for.
 * @param {string} reaction what to do once the event has been heard.
 * @param {string} self the instance that is listening/
 * @param {*=} backpack any parameters to carry with it to handle the reaction.
*/
jp.events.listen = function(ear, sound, reaction, self, backpack) {
  jp.events.listeners_.push(ear);
  $(ear).bind(sound, jp.bind(reaction, self, backpack));
};

/*
 * Calls out an event, using anthropomorphic metaphors to descripe the talker.
 * @param {*} self the instance that is talking.
 * @param {string} voice the specific sound the voice is saying.
 */
jp.events.talk = function(self, voice) {
  $(self).trigger(voice);
};


/*
 * Unlistens to all listeners
*/
jp.events.unlisten = function() {
  var listeners = jp.events.listeners_,
      total = listeners.length,
      i = 0;
  for (i in listeners) {
    $(listeners[i]).unbind();
  }
  jp.events.listeners_ = [];
};
