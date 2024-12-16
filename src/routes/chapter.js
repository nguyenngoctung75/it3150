const express = require('express')
const router = express.Router()

const chapterController = require('../app/controllers/ChapterController')

router.get('/', chapterController.show)

module.exports = router