class HomeController {
    //[Get /]
    show(req, res) {
        res.render('home', { layout: 'main', showHeader: true })
    }
}

module.exports = new HomeController()