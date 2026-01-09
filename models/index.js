const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_notes')
const ReadingList = require('./reading_list')

User.hasMany(Note)
User.hasMany(Blog)

Blog.belongsTo(User)
Note.belongsTo(User)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })

User.belongsToMany(Blog, { through: ReadingList, as: 'reading_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })

User.hasMany(ReadingList)
ReadingList.belongsTo(User)

Blog.hasMany(ReadingList)
ReadingList.belongsTo(Blog)

module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership,
  UserNotes,
  ReadingList
}