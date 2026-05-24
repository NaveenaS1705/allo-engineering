import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create products
  const product1 = await prisma.product.upsert({
    where: { sku: 'SKU-001' },
    update: {},
    create: {
      sku: 'SKU-001',
      name: 'Wireless Headphones',
      description: 'High quality wireless headphones',
    },
  })

  const product2 = await prisma.product.upsert({
    where: { sku: 'SKU-002' },
    update: {},
    create: {
      sku: 'SKU-002',
      name: 'Smart Watch',
      description: 'Fitness tracker with heart monitor',
    },
  })

  // Create warehouses
  const warehouse1 = await prisma.warehouse.upsert({
    where: { id: 'wh-1' },
    update: {},
    create: {
      id: 'wh-1',
      name: 'North Warehouse',
      location: 'New York, USA',
    },
  })

  const warehouse2 = await prisma.warehouse.upsert({
    where: { id: 'wh-2' },
    update: {},
    create: {
      id: 'wh-2',
      name: 'South Warehouse',
      location: 'Austin, USA',
    },
  })

  // Add stock
  await prisma.stockLevel.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      totalUnits: 10,
      reservedUnits: 0,
    },
  })

  await prisma.stockLevel.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse2.id,
      totalUnits: 5,
      reservedUnits: 0,
    },
  })

  console.log('Database seeded!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())