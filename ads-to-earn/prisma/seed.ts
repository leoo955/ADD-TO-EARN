// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding database ---');

  // --- 1. Création d’un admin ---
  const adminPassword = await hash('Admin1234!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ads-to-earn.com' },
    update: {},
    create: {
      email: 'admin@ads-to-earn.com',
      password: adminPassword,
      username: 'Admin',
      points: 1000,
    },
  });
  console.log(`Admin créé : ${admin.email}`);

  // --- 2. Création des Ads ---
  const ads = [
    { title: 'Ad 1 - Promo Video', videoKey: 'ads/ad1.mp4', durationMs: 30000, rewardPoints: 10 },
    { title: 'Ad 2 - Fun Game', videoKey: 'ads/ad2.mp4', durationMs: 45000, rewardPoints: 15 },
    { title: 'Ad 3 - Product Ad', videoKey: 'ads/ad3.mp4', durationMs: 60000, rewardPoints: 20 },
  ];

  for (const ad of ads) {
    // Find ad by title first
    const existingAd = await prisma.ad.findFirst({
      where: { title: ad.title },
    });

    if (existingAd) {
      await prisma.ad.update({
        where: { id: existingAd.id },
        data: ad,
      });
    } else {
      await prisma.ad.create({
        data: ad,
      });
    }
  }
  console.log('Ads créées.');

  // --- 3. Création des Products ---
  const products = [
    { name: 'Product 1', description: 'Produit génial 1', pricePoints: 50, stock: 100 },
    { name: 'Product 2', description: 'Produit génial 2', pricePoints: 100, stock: 50 },
    { name: 'Product 3', description: 'Produit génial 3', pricePoints: 200, stock: 20 },
  ];

  for (const product of products) {
    // Find product by name first
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: product,
      });
    } else {
      await prisma.product.create({
        data: product,
      });
    }
  }
  console.log('Products créés.');

  console.log('--- Seed terminé ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
