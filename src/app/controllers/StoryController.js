class StoryController {
    // [Get /story]
    show(req, res) {
        res.render('story/story')
    }

    // [Get] /story/create
    create(req, res) {
        res.render('story/create')
    }

    store(req, res) {
        res.json(req.body)
    }
}

module.exports = new StoryController()