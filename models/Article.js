const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  author: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: 'draft', enum: ['draft', 'published']
  },
  readCount: {
    type: Number,
    default: 0
  },
  readingTime: Number,
  tags: [ String ]
})

module.exports = mongoose.model('Article', articleSchema)
