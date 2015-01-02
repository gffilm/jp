this.activate = function() {
  $("#play").click(function() {
    if(jp.getCurrentTimeline().progress() != 1){
      jp.getCurrentTimeline().play();
    } else {
      jp.getCurrentTimeline().restart();
    }
  }.bind(this));

  $("#pause").click(function() {
    jp.getCurrentTimeline().pause();
  }.bind(this));

  $("#reverse").click(function() {
    jp.getCurrentTimeline().reverse();
  }.bind(this));

  $("#resume").click(function() {
    jp.getCurrentTimeline().resume();
  }.bind(this));

  $("#restart").click(function() {
    this.started = false;
    jp.restart();
  }.bind(this));

  $("#next").click(function() {
    this.started = false;
    jp.getNext();
  }.bind(this));

  $("#previous").click(function() {
    this.started = false;
    jp.getPrevious();
  }.bind(this));
};