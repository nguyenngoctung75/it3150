class ChapterController {
    //[Get /chapter]
    show(req, res) {
        return res.render('chapter')
    }
}

module.exports = new ChapterController()