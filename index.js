const express = require('express');

const app = express();

app.use(() => {
    console.log('Hello Server....');
    console.log('Nodemon');
    console.log('Hai Alwin Dev');
})


app.listen(4000);

