const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.use('/info', (req, res) => {
    res.json("Hello it`s server");
  });

module.exports=app



