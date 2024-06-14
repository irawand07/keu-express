const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany(); // Clear existing users

  const user = await prisma.user.create({
    data: {
      name: 'Dedi',
      email: 'irawand07@gmail.com',
    },
  });
  console.log(user);
}

main()
  .then(() => {
    console.log('Seeding complete');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });