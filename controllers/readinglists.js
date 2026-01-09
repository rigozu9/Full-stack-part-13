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

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const entry = await ReadingList.findByPk(id)
    if (!entry) return res.status(404).end()

    if (entry.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'not allowed' })
    }
    entry.read = req.body.read
    await entry.save()

    return res.json(entry)

  } catch (error) {
    next(error)
  }
})

module.exports = router