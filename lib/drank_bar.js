var drank_bar
$(() => {
    drank_bar = new ProgressBar.Circle(drank_progressbar, {
    color: '#aaa',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 8,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#aaa', width: 1 },
    to: { color: '#3ca1ff', width: 8 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);

      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText(``);
      } else {
        circle.setText(`${value}`);
      }

    }
  });
  drank_bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  drank_bar.text.style.fontSize = '6rem';
  drank_bar.text.style.color = '#5e5e5e';

})
