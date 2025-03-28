import { withPrisma } from '@/prisma/prismaClient'

export const getSubcategories = withPrisma(async prisma => {
  const subCats = await prisma.subCategory.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  })
  // case insensitive sorting is not supported in Prisma on the DB level
  return subCats.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
})

export type SubcategoryListDTO = Awaited<ReturnType<typeof getSubcategories>>
