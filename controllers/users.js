const router = require('express').Router()

const { User } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({
    where: { username: req.params.username }
  })
  next()
}
router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// router.post('/', tokenExtractor, async (req, res) => {
//   try {
//     // const user = await User.findByPk(req.decodedToken.id)
//     const user = await User.create(...req.body)
//     // const note = await Note.create({...req.body, userId: user.id, date: new Date()})
//     res.json(user)
//   } catch(error) {
//     return res.status(400).json({ error })
//   }
// })

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})


router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', userFinder, async (req, res) => {
  if (req.user) {
    req.user.username = req.body.username
    await req.user.save()
    res.json(req.user)
  } else {
    res.status(404).end()
  }
})

module.exports = router