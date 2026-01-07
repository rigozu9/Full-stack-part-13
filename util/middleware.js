const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({ error: 'bad request' })
  }

  if (error.name === 'BadRequestError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'internal server error' })
}

module.exports = errorHandler
