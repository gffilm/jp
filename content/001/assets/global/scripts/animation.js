this.activate = function() {

  this.updateSlider = function() {
    //$("#slider").slider("value", jp.getCurrentTimeline().progress() *100);
  }


  this.timeLine_.set("#demoWrapper", {visibility:"visible", delay: .01, onUpdate:this.updateSlider})
    .from("#bg", .5, {autoAlpha:0, delay: -.5}, .5)
    .from("h1", 0.5, {left:100, autoAlpha:0})
    .from("h2", 0.5, {left:-100, autoAlpha:0}, "-=0.25") 
    .from("#feature", 0.5, {scale:0.5, autoAlpha:0}, "feature")
    .from("#description", 0.75, {left:100, autoAlpha:0}, "description")
    .staggerFrom("#nav img", 0.5, {scale:0, rotation:-180, autoAlpha:0}, 0.2);


  $("#slider").slider({
  range: false,
  min: 0,
  max: 100,
  step:.1,
  slide: function ( event, ui ) {
    jp.getCurrentTimeline().pause();
    //adjust the timeline's progress() based on slider value
    jp.getCurrentTimeline().progress( ui.value/100 );
    }
});

  jp.base(this, 'activate');
};
