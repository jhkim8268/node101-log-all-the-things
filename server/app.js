const express = require('express');
const fs = require('fs');
const app = express();
const csvFilePath='./data/log.csv';
const csv=require('csvtojson');

app.use((req, res, next) => {
  let data = [];
  let date = new Date();
  let isoDate = date.toISOString();

  data.push(req.header('user-agent'));
  data.push(isoDate);
  data.push(req.method);
  data.push(req.url);
  data.push('HTTP/'+req.httpVersion);
  data.push(res.statusCode);

  var csvData = data.join() + '\n';
  
  fs.appendFile('./data/log.csv', csvData, (err) => {
    if (err) throw err;
  });

  console.log(csvData);
  
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('ok')
});

app.get('/logs', (req, res) => {
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      res.send(jsonObj);
    })
});

module.exports = app;
