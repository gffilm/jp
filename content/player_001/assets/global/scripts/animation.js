this.activate = function() {
  $("#play").click(function() {
    $("#pause").prop("disabled", false);
    $("#reverse").prop("disabled", false);
    $("#play").prop("disabled", true);
    if (jp.getCurrentTimeline().progress() != 1) {
      jp.getCurrentTimeline().play();
    } else {
      jp.getCurrentTimeline().restart();
    }
  }.bind(this));

  $("#pause").click(function() {
    $("#play").prop("disabled", false);
    $("#pause").prop("disabled", true);
    jp.getCurrentTimeline().pause();
  }.bind(this));

  $("#reverse").click(function() {
    $("#reverse").prop("disabled", true);
    $("#play").prop("disabled", false);
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

this.update = function() {
  $("#next").prop("disabled", !jp.hasNext() || !jp.isCurrentCompleted());
  $("#previous").prop("disabled", !jp.hasPrevious());
  if (jp.getCurrentTimeline() && jp.getCurrentTimeline().progress() == 1) {
    $("#play").prop("disabled", true);
    $("#pause").prop("disabled", true);
  }
};

