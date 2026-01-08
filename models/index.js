const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

User.hasMany(Note)
User.hasMany(Blog)

Blog.belongsTo(User)
Note.belongsTo(User)

Blog.sync({ alter: true })
Note.sync({ alter: true })
User.sync({ alter: true })

Note.sync()
Blog.sync()
User.sync()

module.exports = {
  Note,
  Blog,
  User
}