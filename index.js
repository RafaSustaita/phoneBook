const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  } else {
    return '';
  }
});

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number:"39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
  ]

app.get('/api/info', (request, response) => {
  response.send(`<h4>Phonebook has info for ${persons.length} people</h4><h4>${new Date}</h4>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const minRange = 100000
  const maxRange = 999999
  const newId = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
  return newId;
}

app.post('/api/persons/', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
        error: 'name and number are required'
      })
  } 
  
  const nameExists = persons.some(person => person.name === body.name);
  if (nameExists) {
    return response.status(409).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const updatedPerson = {
    name: request.body.name,
    number: request.body.number,
  };

  persons = persons.map(person => (person.id === id ? updatedPerson : person));

  response.json(updatedPerson); 
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})