const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

User.hasMany(Note)
User.hasMany(Blog)

Blog.belongsTo(User)
Note.belongsTo(User)

module.exports = {
  Note,
  Blog,
  User
}