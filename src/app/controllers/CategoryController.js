class CategoryController {
    //[Get /category]
    show(req, res) {
        res.render('category' , { layout: 'main', showHeader: true })
    }
}

module.exports = new CategoryController()