const router = require('express').Router()

const { Blog, User } = require('../models')

const { tokenExtractor } = require('../util/middleware')

const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    const query = req.query.search.trim()
    where[Op.or] = [
      { title:  { [Op.iLike]: `%${query}%` } },
      { author: { [Op.iLike]: `%${query}%` } },
    ]
  }
  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['id', 'username'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).end()

    if (blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await blog.destroy()
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).end()

    const likes = Number(req.body.likes)
    if (!Number.isInteger(likes) || likes < 0) {
      const err = new Error('likes must be a non-negative integer')
      err.name = 'BadRequestError'
      return next(err)
    }

    blog.likes = likes
    await blog.save()
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router