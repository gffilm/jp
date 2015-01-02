this.activate = function() {
  this.start = function() {
    this.started = true;
    this.timeLine_.set("#demoWrapper", {visibility:"visible", delay: .01})
    .from("#bg", .5, {autoAlpha:0, delay: -.5}, .5)
    .from("h1", 0.5, {left:100, autoAlpha:0})
    .from("h2", 0.5, {left:-100, autoAlpha:0}, "-=0.25") 
    .from("#feature", 0.5, {scale:0.5, autoAlpha:0}, "feature")
    .from("#description", 0.5, {left:100, autoAlpha:0}, "feature+=0.25")
    .staggerFrom("#nav img", 0.5, {scale:0, rotation:-180, autoAlpha:0}, 0.2, "stagger");
  }

  this.start();
};