const express = require('express')
const router = express.Router()

const storyController = require('../app/controllers/StoryController')

router.get('/create', storyController.create)
router.get('/', storyController.show)

module.exports = router