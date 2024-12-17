const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')

const route = require('./routes')
const db = require('./config/db')
const app = express()
const port = 3000

db.connect()

//Thu vien chuyen tu GET POST sang phuong thuc khac vido nhu PUT PATCH
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

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
app.set('views', path.join(__dirname, 'resources', 'views'))

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

/* Thiet lap backend ket noi voi trang create*/
const Story = require('./models/story')
const generateStoryId = (storyCount) => {
    const storyIdNumber = storyCount + 1;
    return `S${storyIdNumber.toString().padStart(3, '0')}`;
};
app.get('/story-create', (req, res) => {
    res.render('story/create')
})

app.post('/story-store', (req, res) => {
    const formData = {
        name: req.body.name,
        author: req.body.author,
        image: req.body.image || 'http://example.com/coverimage.jpg', // Giá trị mặc định nếu không có ảnh
        description: req.body.description,
        type: 'Tiên Hiệp', // Lấy thể loại hoặc đặt giá trị mặc định
        status: 'Đang ra', // Trạng thái mặc định
    };
    //console.log(formData)
    const countStoriesSql = 'SELECT COUNT(*) as count FROM story'
    db.query(countStoriesSql, (countErr, countData) => {
        //console.log(countData)
        //console.log(countErr)
        if (countErr) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        const storyId = generateStoryId(countData[0].count);
        const insertSql = 'INSERT INTO story (story_id, name, author, type, status, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const values = [
            storyId,
            formData.name,
            formData.author,
            formData.type,
            formData.status,
            formData.image,
            formData.description,
        ];
        db.query(insertSql, values, (insertErr, result) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({ message: "Lỗi server khi thêm truyện" });
            }

            return res.status(201).json({ message: "Truyện đã được đăng thành công", storyId });
        })
    })
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})