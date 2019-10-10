const express = require('express');
const fs = require('fs');
const app = express();
const csvFilePath='./data/log.csv';
const csv=require('csvtojson');

app.use((req, res, next) => {
  let originData = [];

  let date = new Date();
  let isoDate = date.toISOString();

  originData.push(req.header('user-agent'));
  originData.push(isoDate);
  originData.push(req.method);
  originData.push(req.url);
  originData.push('HTTP/'+req.httpVersion);
  originData.push(res.statusCode);

  var csvData = originData.join() + '\n';
  
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
