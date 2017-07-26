const ip = require("ip");
const express = require('express');
const app = express()
const PORT = 8080
const root = process.env.NODE_ENV === 'production' ? 'build' : 'src'

app.use(express.static(root))

app.get('/', (req, resm, err) => {
  res.sendFile('index.html', {root})
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on ${ip.address()}:${process.env.PORT || PORT}`)
})
