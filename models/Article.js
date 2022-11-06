const mongoose = require('mongoose')
const { readingTime } = require('../utils/utils')

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: String,
    },
    state: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published'],
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: Number,
    tags: [String],
    body: String,
  },
  { timestamps: true }
)

// calculate reading time before saving document
articleSchema.pre('save', function (next) {
  let article = this

  // calculate the time in minutes
  const timeToRead = readingTime(this.body)

  article.reading_time = timeToRead
  next()
})

// calculate reading time before updating document
articleSchema.pre('findOneAndUpdate', function (next) {
  let article = this._update

  // calculate the time in minutes
  if (article.body) {
    const timeToRead = readingTime(article.body)
    article.reading_time = timeToRead
  }

  next()
})

articleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.owner
  },
})

module.exports = mongoose.model('Article', articleSchema)
