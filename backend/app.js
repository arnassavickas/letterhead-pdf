const express = require('express');
var path = require('path');

const app = express();
const port = 3000;

app.use(express.static('build'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`app listening on port ${port}`));
