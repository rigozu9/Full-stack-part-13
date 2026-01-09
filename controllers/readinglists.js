const router = require('express').Router()

const { ReadingList, User } = require('../models')

const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const readingList = await ReadingList.create({...req.body, userId: user.id })
    res.status(201).json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router