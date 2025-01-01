class StoryController {
    // [Get /story]
    show(req, res) {
        res.render('story/story' , { layout: 'main', showHeader: true })
    }

    // [Get] /story/create
    create(req, res) {
        res.render('story/create' , { layout: 'main', showHeader: true })
    }

    store(req, res) {
        res.json(req.body)
    }
}

module.exports = new StoryController()