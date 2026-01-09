const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { Session, User } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors?.map(e => e.message) ?? [error.message]
    return res.status(400).json({ error: messages.join(', ') })
  }
  if (
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({ error: 'bad request' })
  }

  if (error.name === 'BadRequestError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'internal server error' })
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const token = authorization.substring(7)
  req.token = token

  try {
    req.decodedToken = jwt.verify(token, SECRET)

    const session = await Session.findOne({ where: { token } })
    if (!session) {
      return res.status(401).json({ error: 'token expired' })
    }

    const user = await User.findByPk(req.decodedToken.id)
    if (!user || user.disabled) {
      return res.status(401).json({ error: 'account disabled' })
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

module.exports = { errorHandler, tokenExtractor }
