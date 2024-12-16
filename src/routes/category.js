const express = require('express')
const router = express.Router()

const categoryController = require('../app/controllers/CategoryController')

router.get('/', categoryController.show)

module.exports = router