import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seed() {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  const kyle = await prisma.user.create({ data: { name: "Kyle" , password: "123", emailId:"kyle@nigga.com", intrest:"jojo"} })
  const sally = await prisma.user.create({ data: { name: "Sally" , password: "321", emailId:"sally@nigga.com", intrest:"bbc"} })

}

seed()