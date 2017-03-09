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

    if(data.src===data.target.attributes[2].value){
      for(var i = 0; i<data.links.children.length; i++){
        var forward = (data.links.children[i].dataset.src===data.forward)
        var back = (data.links.children[i].dataset.src===data.back)
        if(forward||back){
          data.links.children[i].setAttribute('visible', true);
          data.links.children[i].setAttribute('position', (back) ? "-1.5 -1 -4" : "0 -1 -4");
        }
        else{
          data.links.children[i].setAttribute('visible', false);
        }
      }
    }

    this.setupFadeAnimation();

    el.addEventListener(data.on, function () {
      for(var i = 0; i<data.links.children.length; i++){
        var forward = (data.links.children[i].dataset.src===data.forward)
        var back = (data.links.children[i].dataset.src===data.back)
        if(forward||back){
          data.links.children[i].setAttribute('visible', true);
          data.links.children[i].setAttribute('position', (back) ? "-1.5 -1 -4" : "0 -1 -4");
        }
        else{
          data.links.children[i].setAttribute('visible', false);
          data.links.children[i].setAttribute('position', (back) ? "-15 -10 -40" : "0 -10 -40");
        }
      }

      // Fade out image.
      data.target.emit('set-image-fade');
      // Wait for fade to complete.
      debugger;
      setTimeout(function () {
        // Set image.
        data.target.setAttribute('material', 'src', data.src);
      }, data.dur);
    });
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
  }
});
