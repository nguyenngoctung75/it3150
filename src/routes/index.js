const homeRouter = require('./home')
const storyRouter = require('./story')
const chapterRouter = require('./chapter')
const categoryRouter = require('./category')
function route(app) {
    app.use('/story', storyRouter)
    app.use('/chapter', chapterRouter)
    app.use('/category', categoryRouter)
    app.use('/', homeRouter)
}

module.exports = route