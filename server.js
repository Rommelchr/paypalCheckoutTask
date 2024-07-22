require('dotenv-safe').config({
    allowEmptyValues: true
  });
  

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
