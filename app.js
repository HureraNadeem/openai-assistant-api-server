const express = require('express'); 
const assistantRoutes = require('./routes')

const app = express(); 
const port = 5000; 

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!'); 
});

app.use('/api/assistant', assistantRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});