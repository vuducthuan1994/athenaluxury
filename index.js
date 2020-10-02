const express = require('express')
const app = express()
const port = 3000
var exphbs = require('express-handlebars');
app.get('/', function(req, res) {
    res.render('home');
});
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})