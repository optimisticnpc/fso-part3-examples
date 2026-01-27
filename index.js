require('dotenv').config()
const Note = require('./models/note')

const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Helladsfasdfo World!</h1>')
})

app.get('/api/notes', (request, response) => {
Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

// Create
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

// Update
app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  // Find the existing note
  const existingNote = notes.find(n => n.id === id)
  if (!existingNote) {
    return response.status(404).json({ error: 'note not found' })
  }

  // Build updated note (keep old values if not provided)
  const updatedNote = {
    ...existingNote,
    content: body.content ?? existingNote.content,
    important: body.important ?? existingNote.important,
  }

  // Replace in the array
  notes = notes.map(n => n.id === id ? updatedNote : n)

  response.json(updatedNote)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

