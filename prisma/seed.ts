import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");

  const users = [];

  for (let i = 0; i < 50; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(" ")[0] });
    const password = await bcrypt.hash("password", 10);

    users.push({
      name,
      email,
      password,
      image: faker.image.avatar(),
      emailVerified: faker.date.recent({ days: 30 }),
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("✅ 50 users created.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });