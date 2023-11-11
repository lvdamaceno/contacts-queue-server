import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { number, z } from 'zod'

const prisma = new PrismaClient()
const app = fastify()
// CORS
app.register(cors, { 
  // put your options here
})

// Get Remaining Contacts
app.get('/remaining', async () => {
  const remainingContacts = await prisma.$queryRaw`
  SELECT COUNT(id) FROM "contactsNumbers" WHERE "isUsed"=False
  `
  return remainingContacts
})

// Get
app.get('/contacts', async () => {
  // const contacts = await prisma.contactsNumbers.findFirst({
  //   where: {
  //     isUsed: false,
  //   },
  // })
  const contacts = await prisma.$queryRaw`
  SELECT id FROM "contactsNumbers" ORDER BY random() limit 1
  `
  return contacts
})

// Get Details
app.get('/contacts/:id', async (request) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = paramsSchema.parse(request.params)
  const contact = await prisma.contactsNumbers.findUniqueOrThrow({
    where: {
      id,
    },
  })
  return contact.contactNumber
})

// Post
app.post('/contacts', async (request) => {
  const bodySchema = z.object({
    contactNumber: z.string(),
    isUsed: z.coerce.boolean().default(false),
  })
  const { contactNumber } = bodySchema.parse(request.body)
  const contact = await prisma.contactsNumbers.create({
    data: {
      contactNumber,
    },
  })
  return contact
})

// Update
app.put('/contacts/:id', async (request) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = paramsSchema.parse(request.params)

  const bodySchema = z.object({
    isUsed: z.coerce.boolean().default(true),
  })
  const { isUsed } = bodySchema.parse(request.body)

  const contact = await prisma.contactsNumbers.update({
    where: {
      id,
    },
    data: {
      isUsed,
    },
  })

  return contact
})

// Delete
app.delete('/contacts/:id', async (request) => {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = paramsSchema.parse(request.params)
  await prisma.contactsNumbers.delete({
    where: {
      id,
    },
  })
})

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP server running')
})
