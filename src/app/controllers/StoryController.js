class StoryController {
    // [Get /story]
    show(req, res) {
        res.render('story/story')
    }

    // [Get] /story/create
    create(req, res) {
        res.render('story/create')
    }
}

module.exports = new StoryController()