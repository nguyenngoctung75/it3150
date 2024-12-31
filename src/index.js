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
const generateStoryId = (storyCount) => {
    const storyIdNumber = storyCount + 1;
    return `S${storyIdNumber.toString().padStart(3, '0')}`;
};
app.get('/story-create', (req, res) => {
    res.render('story/create')
})

app.post('/story-store', (req, res) => {
    let statusText = req.body.status == 1 ? 'Hoàn Thành' : 'Đang ra'
    const formData = {
        name: req.body.name,
        author: req.body.author,
        image: req.body.image || 'http://example.com/coverimage.jpg', // Giá trị mặc định nếu không có ảnh
        description: req.body.description,
        type: req.body.type,
        status: statusText,
    };
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

app.get('/me-stored-story', (req, res) => {
    const sql = `SELECT * FROM story`
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.render('./me/stored-story', { stories: result })
    })
})

app.get('/story-list', (req, res) => {
    const sql = 'SELECT * FROM story'
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.render('./story/list', { stories: result })
    })
})

app.get('/story-show', (req, res) => {
    const storyId = req.query.storyId;

    const sqlStory = 'SELECT * FROM story WHERE story_id = ?';
    const sqlChapters = 'SELECT * FROM chapter WHERE story_id = ? ORDER BY num_chap ASC';

    db.query(sqlStory, [storyId], (err, storyResult) => {
        if (err || storyResult.length === 0) {
            console.error(err || "Story not found");
            return res.status(404).json({ message: "Truyện không tồn tại" });
        }

        db.query(sqlChapters, [storyId], (err, chaptersResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Lỗi server" });
            }

            res.render('./story/show', { 
                story: storyResult[0], 
                chapters: chaptersResult 
            });
        });
    });
});

app.get('/story-edit', (req, res) => {
    const storyId = req.query.storyId;
    const sql = 'SELECT * FROM story WHERE story_id = ?';

    db.query(sql, [storyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Truyện không tồn tại" });
        }

        res.render('./story/edit', { story: result[0] });
    });
});

app.get('/story-detail-edit', (req, res) => {
    const storyId = req.query.storyId;
    const sql = 'SELECT * FROM chapter WHERE story_id = ?';

    db.query(sql, [storyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Truyện chưa có chương" });
        }
        res.render('./me/stored-chapter', { storyId, chapters: result });
    });
});

app.post('/story-edit', (req, res) => {
    const storyId = req.query.storyId;
    const { name, author, type, status, image } = req.body;

    const sql = `
        UPDATE story 
        SET name = ?, author = ?, type = ?, status = ?, image = ? 
        WHERE story_id = ?`;

    db.query(sql, [name, author, type, status, image, storyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }

        res.redirect('/story-list'); // Quay lại danh sách truyện
    });
});

app.get('/chapter-create', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM chapter WHERE story_id = ?';
    const storyId = req.query.storyId;

    db.query(sql, [storyId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }

        const chapterNumber = result[0].count + 1;
        const sql = 'SELECT name FROM story WHERE story_id = ?';
        db.query(sql, [storyId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Lỗi server" });
            }
            const storyName = result[0].name;
            res.render('chapter/create', { storyId, storyName, chapterNumber });
        });;
    });
});

const generateChapterId = (chapterCount) => {
    const chapterIdNumber = chapterCount + 1;
    return `C${chapterIdNumber.toString().padStart(3, '0')}`;
};
app.post('/chapter-store', (req, res) => {
    const formData = {
        story_id: req.body.storyId,
        content: req.body.content,
        num_chap: req.body.number,
        name_chap: req.body.name,
    };
    const countChaptersSql = 'SELECT COUNT(*) as count FROM chapter'
    db.query(countChaptersSql, (countErr, countData) => {
        //console.log(countData)
        //console.log(countErr)
        if (countErr) {
            return res.status(500).json({ message: "Lỗi server" });
        }
        const chapterId = generateChapterId(countData[0].count);
        const insertSql = 'INSERT INTO chapter (chapter_id, story_id, content, num_chap, name_chap) VALUES (?, ?, ?, ?, ?)'
        const values = [
            chapterId,
            formData.story_id,
            formData.content,
            formData.num_chap,
            formData.name_chap,
        ];
        db.query(insertSql, values, (insertErr, result) => {
            if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({ message: "Lỗi server khi thêm chương" });
            }

            return res.status(201).json({ message: "chương đã được đăng thành công", chapterId });
        })
    })
})

app.get('/chapter-show', (req, res) => {
    const chapterId = req.query.chapterId;
    const sql = 'SELECT * FROM chapter WHERE chapter_id = ?';
    db.query(sql, [chapterId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        const sql = 'SELECT name FROM story WHERE story_id = ?';
        chapterResult = result[0];
        db.query(sql, [result[0].story_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Lỗi server" });
            }
            storyName = result[0].name;
            res.render('chapter/show', { chapterResult, storyName });
        });
    });
})

app.get('/chapter-edit', (req, res) => {
    const chapterId = req.query.chapterId;
    const sql = 'SELECT * FROM chapter WHERE chapter_id = ?';

    db.query(sql, [chapterId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Chương không tồn tại" });
        }
        res.render('./chapter/edit', { chapter: result[0] });
    });
});

app.post('/chapter-edit', (req, res) => {
    const chapterId = req.query.chapterId;
    const { name_chap, content } = req.body;

    const sql = 'UPDATE chapter SET name_chap = ?, content = ? WHERE chapter_id = ?';
    db.query(sql, [name_chap, content, chapterId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.redirect(`/story-detail-edit?storyId=${req.query.storyId}`); // Quay lại danh sách chương
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})