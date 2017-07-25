const ip = require("ip");
const express = require('express');
const app = express()
const PORT = 3000

app.use(express.static('./'))

app.use((req, res, next) => {
  console.log('someone is coming');
  next()
})

app.get('/', (req, res) => {
  res.sendFile('index.html',{root: __dirname })
})

app.listen(PORT, () => {
  console.log(`Server started on ${ip.address()}:${process.env.PORT || PORT}`)
})
