'use strict';

var drank_bar;
var drank_amount = 0;
var drank_bar_type = 0;

$(function () {
  drank_bar = new ProgressBar.Circle(drank_progressbar, {
    color: '#aaa',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 10,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#ff7171', width: 1 },
    to: { color: '#0084ff', width: 10 },
    // Set default step function for all animate calls
    step: function step(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText('<i class="mdi mdi-cup-off"></i>');
      } else {
        switch (drank_bar_type) {
          case 0:
            // ml
            // circle.setText(`${parseInt(circle.value() * 2000)} ml`);
            circle.setText(drank_amount + ' ml');
            break;
          case 1:
            // cups
            circle.setText(round(drank_amount / 250) + ' cups');
            break;
          case 2:
            // percent
            circle.setText(round(drank_amount / 2000 * 100) + ' %');
            break;
        }
      }
    }
  });

  drank_bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  drank_bar.text.style.fontSize = '40px';
  drank_bar.text.style.color = '#5e5e5e';
});