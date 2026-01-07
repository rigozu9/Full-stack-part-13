const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    return res.status(204).end()
  } else {
    res.status(404).end()
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