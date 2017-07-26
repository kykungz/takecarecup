const ip = require("ip");
const express = require('express');
const app = express()
const PORT = 3000
const root = process.env.NODE_ENV ? 'build' : 'src'

app.use(express.static(root))

app.use((req, res, next) => {
  console.log('someone is coming');
  next()
})

app.get('/', (req, resm, err) => {
  res.sendFile('index.html', {root})
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on ${ip.address()}:${process.env.PORT || PORT}`)
})
