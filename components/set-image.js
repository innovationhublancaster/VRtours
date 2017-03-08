/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    src: {type: 'string'},
    forward: {type: 'string'},
    back: {type: 'string'},
    links: {type: 'selector'},
    dur: {type: 'number', default: 300}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    this.setupFadeAnimation();

    el.addEventListener(data.on, this.onEvent.bind(this));
  },

  onEvent: function () {
    var data = this.data;
    debugger
    // Fade out image.
    data.target.emit('set-image-fade');
    // Wait for fade to complete.
    setTimeout(function () {
      // Set image.
      data.target.setAttribute('material', 'src', data.src);
    }, data.dur);
    this.alterLinksBasedOnRoute();
  },

  /**
   * Setup fade-in + fade-out.
   */
  setupFadeAnimation: function () {
    var data = this.data;
    var targetEl = this.data.target;
    // Only set up once.
    if (targetEl.dataset.setImageFadeSetup) { return; }
    targetEl.dataset.setImageFadeSetup = true;

    // Create animation.
    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur,
      from: '#FFF',
      to: '#000'
    });
  },

  alterLinksBasedOnRoute: function () {
    var data = this.data;
    var route = ['#main', '#cell', '#well', '#well2'];
    var index = route.indexOf(data.src);
    var next = (index===route.length-1) ? route[0] : route[index+1];
    var previous = (index===0) ? route[route.length-1] : route[index-1]

    data.links.children.forwardLink.setAttribute('data-src', next);
    //data.links.children.forwardLink.children[0].setAttribute('set-image', "on: click; target: #image-360; src: "+next+"; links: #links")
    data.links.children.backwardLink.setAttribute('data-src', previous);
    //data.links.children.backwardLink.children[0].setAttribute('set-image', "on: click; target: #image-360; src: "+previous+"; links: #links")

    debugger
  }
});
