require('dotenv').config()
const config = require('./config');
const app = require('./api')


app.listen(config.port, () => {
  console.log(`Server is listening on port! ${config.port}`);
});