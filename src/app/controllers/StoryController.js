class StoryController {
    // [Get /story]
    show(req, res) {
        res.render('story')
    }
}

module.exports = new StoryController()