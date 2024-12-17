const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const route = require('./routes')
const db = require('./config/db')
const app = express()
const port = 3000

db.connect()
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use(morgan('combined'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources\\views'))

route(app)  
// app.get('/', (req, res) => {
//     res.render('home')
// })

// app.get('/the-loai', (req, res) => {
//   res.render('category')
// })

// app.get('/chapter', (req, res) => {
//   res.render('chapter')
// })

// app.get('/story', (req, res) => {
//   res.render('story')
// })
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})