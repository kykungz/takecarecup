$(() => {
  const api = 'https://exceed.srakrn.me/api/'

  let volume = 0 // in mL
  let temp = 0 // in Celcius
  let drank_percent = 0 // Number from 0.0 to 1.0 (1.0 = 2 liter)
  let suggestion = '' // String

  let temp_type = 0 // Celcius (0), Fahrenheit (1), Kelvin (2), Feeling (3)
  let volume_type = 0 // mL (0), Liter (1), Cups (2)

  function getFromAPI(target, param, callback) {
    $.ajax({
      url: api + target,
      data: param
    }).done((data) => {
      callback(data)
    }).fail((data) => {
      console.log('fail')
    })
  }

  function sendToAPI(param) {
    $.ajax({
      url: api + 'write.php',
      data: param
    }).done((data) => {
      console.log('sent', api+'write.php', JSON.stringify(param))
    }).fail((data) => {
      console.log('fail')
    })
  }

  function updateAll() {
    updateWeeklyGraph()
    updateOverallGraph()
    updateSuggestion()
    updateBar()
    updateVolume()
  }

  function updateTemp() {
    switch (temp_type) {
      case 0: // Celcius
        $('#temp').html(`${temp} °C`)
        break
      case 1: // Fahrenheit
        $('#temp').html(`${parseFloat(Math.round((temp * 1.8000 + 32.00) * 100) / 100).toFixed(2)} °F`)
        break
      case 2: // Kelvin
        $('#temp').html(`${parseFloat(temp) + 273} °K`)
        break
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
        break
    }
  }

  function updateBar() {
    if (drank_percent > 1) {
      drank_percent = 1
    }
    drank_bar.animate(drank_percent)
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
          break
        case 1: // liter
          $('#volume').html(`${volume / 1000} Liter`)
          break
        case 2: // cups
          $('#volume').html(`${volume / 250} Cups`)
          break
      }
    }
  }

  function updateSuggestion() {
    const today = new Date()
    if (drank_amount > 3000) {
      suggestion = `You drink too much!`
    } else if (drank_percent >= 0.9) {
      suggestion = `Wow! Keep up this good work!`
    } else if (drank_percent >= 0.7) {
      suggestion = `You are healthy!`
    } else if (drank_percent >= 0.6) {
      suggestion = `Don't forget to drink some more when you're free`
    } else if (drank_percent >= 0.5) {
      suggestion = `Get some water when you are thirsty`
    } else {
      if (today.getHours() > 21) {
        suggestion = `Your day is ending, yet you haven't drink enough water!`
      } else {
        if (drank_percent >= 0.4) {
          suggestion = `Try to get some warm water`
        } else if (drank_percent >= 0.3) {
          suggestion = `Maybe you want a cup of water?`
        } else if (drank_percent >= 0.2) {
          suggestion = `Get hydrated!`
        } else if (drank_percent >= 0.1) {
          suggestion = `Your body needs water!`
        } else if (drank_percent >= 0.0) {
          suggestion = `Get some water!`
        }
      }
    }
    $('#suggestion').html(suggestion)
  }

  function updateWeeklyGraph() {
    weekly_graph.update()
  }

  function updateOverallGraph() {
    overall_graph.update()
  }

  function convertToWeeklyData(data) {
    let week = [[], [], [], [], [], [] ,[]]
    data.forEach(day => {
      let date = new Date(day.timestamp).getDay()
      week[date].push(parseInt(day.volume))
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
    let overallData = data.map((day) => {
      return day.volume / 1000
    })
    return overallData.splice(overallData.length - 25, overallData.length)
  }

  function convertToOverallLabels(data) {
    let overallLabels = data.map((day) => {
      let date = new Date(day.timestamp)
      let hours = date.getHours()
      var ampm = hours >= 12 ? 'PM' : 'AM'
      return `${hours}:${date.getMinutes()} ${ampm}`
    })
    return overallLabels.splice(overallLabels.length - 25, overallLabels.length)
  }

  function convertToDrankAmount(data) {
    let today = new Date().toDateString()
    let drankAmount = 0
    let lastAmount
    data.forEach((day, i) => {
      if (new Date(day.timestamp).toDateString() === today) {
        let amount = parseInt(day.volume)
        if (i !== 0) {
          if (amount < lastAmount) {
            drankAmount += (lastAmount - amount)
          }
        }
        lastAmount = amount
      }
    })
    return drankAmount
  }

  // settings
  $('#drank_progressbar').css( 'cursor', 'pointer' )
  $('#temp-block').css( 'cursor', 'pointer' )
  $('#volume-block').css( 'cursor', 'pointer' )
  $('#stir').css( 'cursor', 'pointer' )
  $('#warm').css( 'cursor', 'pointer' )

  $('#stir').on('click touch', () => {
    sendToAPI({key: 'stir', value: 1})
  })

  $('#warm').on('click touch', () => {
    sendToAPI({key: 'warm', value: 1})
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

  // init
  updateAll()
  updateTemp()

  // main loop
  setInterval(() => {
    getFromAPI('list.php', {cup: 'srakrn'}, (data) => {
      weekly_graph.data.datasets[0].data = convertToWeeklyData(data)
      overall_graph.data.datasets[0].data = convertToOverallData(data)
      overall_graph.data.labels = convertToOverallLabels(data)

      drank_amount = convertToDrankAmount(data)
      drank_percent = drank_amount / 2000
      volume = data[data.length-1].volume

      console.log('volume:', volume)
      console.log('drank_amount:', drank_amount)
      console.log('drank_percent:', drank_percent * 2000)

      updateAll()
    })
    getFromAPI('read.php', {key: 'temp'}, (data) => {
      temp = data
      console.log('temp:', temp)
      updateTemp()
    })
  }, 1000 * 2)

})
