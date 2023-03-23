import { PrismaClient } from "@prisma/client";
import { randEmail, randFullName, randAddress, randPhoneNumber, randUserName, randPassword, randUuid } from '@ngneat/falso';
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  for (let i = 0; i < 1000; i++) {
    let address = randAddress()
    let item = {
      id: randUuid(),
      name: randFullName(),
      password: bcrypt.hashSync(randPassword(), 10),
      password2: bcrypt.hashSync(randPassword(), 10),
      username: randUserName(),
      email: randEmail(),
      phone: randPhoneNumber(),
      addressStreet: String(address.street),
      city: String(address.city),
      zipCode: String(address.zipCode),
      token: '',
      county: String(address.county),
      country: String(address.country)
    }
    const group = await prisma.user.create({
      data: item,
    })
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })