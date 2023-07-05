require('dotenv').config();
const app = require('./app');
const {db} = require('./database/config');
const initModel = require('./models/init.model');

db.authenticate()
  .then(() => console.log('database aunthenticated...'))
  .catch((err) => console.log(err));

  initModel();

db.sync()
  .then(() => console.log('database connected...'))
  .catch((err) => console.log(err));
  
  
const PORT = process.env.PORT;
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}! 👾`);
});

