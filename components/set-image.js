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

    // when page loads, check current link to see if it's the appropriate link for the current photosphere
    if(data.src===data.target.attributes[2].value){
      // for each link, check if it's the forward or backward link
      for(var i = 0; i<data.links.children.length; i++){
        var forward = (data.links.children[i].dataset.src===data.forward)
        var back = (data.links.children[i].dataset.src===data.back)
        if(forward||back){
          // if so, shows link and puts it in correct position
          data.links.children[i].setAttribute('visible', true);
          data.links.children[i].setAttribute('position', (back) ? "-1.5 -1 -4" : "0 -1 -4");
        }
        else{
          // otherwise hides the link
          data.links.children[i].setAttribute('visible', false);
          // this next line is super hacky and just moves the links far away so they don't cause the flickering issue
          // ideally setting interactable to be false would be a thing but by the looks of things it isn'y
          data.links.children[i].setAttribute('position', (back) ? "-15 -10 -40" : "0 -10 -40");
        }
      }
    }

    this.setupFadeAnimation();

    el.addEventListener(data.on, function () {
      // does the same as above but doesn't need to check if clicked link matches photosphere
      // as a) the photosphere wont have loaded yet and b) we only want the forward and backward links
      // for the photosphere attached to the clicked link to show
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
