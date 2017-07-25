const ip = require("ip");
const express = require('express');
const app = express()
const PORT = 3000

app.use(express.static('src'))

app.use((req, res, next) => {
  console.log('someone is coming');
  next()
})

app.get('/', (req, resm, err) => {
  res.sendFile('index.html', {root: 'src' })
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on ${ip.address()}:${process.env.PORT || PORT}`)
})
