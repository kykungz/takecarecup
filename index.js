$(() => {
  const root = 'http://158.108.165.223/data/8/'
  const db = 'http://158.108.165.192/api/list.php'

  let volume = 0
  let temp = 0
  let drank_amount = 0
  let suggestion = ''

  let temp_type = 0
  let volume_type = 0

  drank_bar.animate(drank_amount);  // Number from 0.0 to 1.0
  weekly_graph.update()
  overall_graph.update()
  updateSuggestion()

  function getFromServer(link, callback) {
    $.ajax({
      url: root + link,
    }).done((data) => {
      callback(data)
    }).fail((data) => {
      console.log('fail');
    })
  }

  function getFromDB(param, callback) {
    $.ajax({
      url: db,
      data: param
    }).done((data) => {
      callback(data)
    }).fail((data) => {
      console.log('fail');
    })
  }

  function sendToServer(link, value) {
    $.ajax({
      url: root + link +"/set/" + value,
    })
  }

  function updateTemp() {
    switch (temp_type) {
      case 0: // Celcius
        $('#temp').html(`${temp} °C`)
        break;
      case 1: // Fahrenheit
        $('#temp').html(`${parseFloat(Math.round((temp * 1.8000 + 32.00) * 100) / 100).toFixed(2)} °F`)
        break;
      case 2: // Kelvin
        $('#temp').html(`${parseFloat(temp) + 273} °K`)
        break;
      case 3: // Feeling
        if (temp >= 100) {
          $('#temp').html(`Boiled`)
        } else if (temp > 60) {
          $('#temp').html(`Hot`)
        } else if (temp > 35) {
          $('#temp').html(`Warm`)
        } else if (temp > 20) {
          $('#temp').html(`Normal`)
        } else {
          $('#temp').html(`Cold`)
        }
        break;
    }
  }
  function updateBar() {
    drank_bar.animate(drank_amount);  // Number from 0.0 to 1.0
  }
  function updateVolume() {
    if (volume <= 0) {
      $('#volume_icon').attr('class', 'mdi mdi-cup-off')
      $('#volume').html(`Empty`)
    } else {
      $('#volume_icon').attr('class', 'mdi mdi-cup-water')
      switch (volume_type) {
        case 0: // ml
          $('#volume').html(`${volume} mL`)
          break;
        case 1: // liter
          $('#volume').html(`${volume / 1000} Liter`)
          break;
        case 2: // cups
          $('#volume').html(`${volume / 250} Cups`)
          break;
      }
    }
  }
  function updateSuggestion() {
    const today = new Date()
    if (drank_amount >= 0.9) {
      suggestion = `Wow! Keep up this good work!`
    } else if (drank_amount >= 0.7) {
      suggestion = `You are healthy!`
    } else if (drank_amount >= 0.6) {
      suggestion = `Don't forget to drink some more when you're free`
    } else if (drank_amount >= 0.5) {
      suggestion = `Get some water when you are thirsty`
    } else {
      if (today.getHours() > 21) {
        suggestion = `Your day is ending, yet you haven't drink enough water!`
      } else {
        if (drank_amount >= 0.4) {
          suggestion = `8 cups of water a day keeps the doctors away!`
        } else if (drank_amount >= 0.3) {
          suggestion = `Maybe you want a cup of water?`
        } else if (drank_amount >= 0.2) {
          suggestion = `Get hydrated!`
        } else if (drank_amount >= 0.1) {
          suggestion = `Your body needs water!`
        } else if (drank_amount >= 0.0) {
          suggestion = `Get some water!`
        }
      }
    }
    $('#suggestion').html(suggestion)
  }

  function convertToWeeklyData(data) {
    let week = [[], [], [], [], [], [] ,[]]
    data.forEach(element => {
      let day = new Date(element.timestamp).getDay()
      week[day].push(element.volume)
    })
    week = week.map((array) => {
      let lastAmount
      let drankAmount = 0
      array.forEach((amount, i) => {
        if (i !== 0) {
          if (amount < lastAmount) {
            drankAmount += (lastAmount - amount)
          }
        }
        lastAmount = amount
      })
      return drankAmount
    })
    console.log(week)
    return week
  }

  function convertToOverallData(data) {
    return data.map((day) => {
      return day.volume / 1000
    })
  }

  function convertToOverallLabels(data) {
    return data.map((day) => {
      let date = new Date(day.timestamp)
      let hours = date.getHours()
      var ampm = hours >= 12 ? 'PM' : 'AM';
      return `${hours}:${date.getMinutes()} ${ampm}`
    })
  }

  function convertToDrankAmount(data) {
    let today = new Date().toDateString()
    let drankAmount = 0
    let lastAmount
    data.forEach((day, i) => {
      if (new Date(day.timestamp).toDateString() === today) {
        let amount = day.volume
        if (i !== 0) {
          if (amount < lastAmount) {
            drankAmount += (lastAmount - amount)
          }
        }
        lastAmount = amount
      }
    })
    return drankAmount / 2000
  }

  $('#drank_progressbar').css( 'cursor', 'pointer' );
  $('#temp-block').css( 'cursor', 'pointer' );
  $('#volume-block').css( 'cursor', 'pointer' );
  $('#stir').css( 'cursor', 'pointer' );
  $('#warm').css( 'cursor', 'pointer' );

  $('#stir').on('click touch', () => {
    sendToServer('stir', 1)
  })

  $('#warm').on('click touch', () => {
    sendToServer('warm', 1)
  })

  $('#drank_progressbar').on('click touch', () => {
    drank_bar_type++
    if (drank_bar_type > 2) {
      drank_bar_type = 0
    }
    updateBar()
  })

  $('#temp-block').on('click touch', () => {
    temp_type++
    if (temp_type > 3) {
      temp_type = 0
    }
    updateTemp()
  })

  $('#volume-block').on('click touch', () => {
    volume_type++
    if (volume_type > 2) {
      volume_type = 0
    }
    updateVolume()
  })

  setInterval(() => {
    getFromServer('temp', (data) => {
      console.log('temp(old):', data)
      temp = data
      updateTemp()
    })

    getFromDB({cup: 'srakrn'}, (data) => {
      weekly_graph.data.datasets[0].data = convertToWeeklyData(data)
      overall_graph.data.datasets[0].data = convertToOverallData(data)
      overall_graph.data.labels = convertToOverallLabels(data)

      weekly_graph.update()
      overall_graph.update()

      drank_amount = convertToDrankAmount(data)
      volume = data[data.length-1].volume
      // temp = data[data.length-1].temp

      console.log('volume:', volume);
      console.log('drank_amount:', drank_amount * 2000);
      console.log('temp:', temp);

      updateVolume()
      updateBar()
      updateSuggestion()
      // updateTemp()
    })
  }, 1000 * 2)

})
