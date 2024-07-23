require('dotenv-safe').config({
    allowEmptyValues: true
  });
  
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});