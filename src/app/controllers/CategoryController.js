class CategoryController {
    //[Get /category]
    show(req, res) {
        res.render('category')
    }
}

module.exports = new CategoryController()