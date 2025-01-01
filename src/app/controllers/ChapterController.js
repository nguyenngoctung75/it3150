class ChapterController {
    //[Get /chapter]
    show(req, res) {
        return res.render('chapter' , { layout: 'main', showHeader: true })
    }
}

module.exports = new ChapterController()