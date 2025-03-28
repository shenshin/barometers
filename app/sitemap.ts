import { MetadataRoute } from 'next'
import { FrontRoutes } from '@/utils/routes-front'
import { withPrisma } from '@/prisma/prismaClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  return [
    {
      url: baseUrl + FrontRoutes.Home,
      priority: 1,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    ...(await getCategoryPages(baseUrl)),
    {
      url: baseUrl + FrontRoutes.About,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: baseUrl + FrontRoutes.History,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...(await getItemPages(baseUrl)),
    ...(await getBrandPages(baseUrl)),
    {
      url: baseUrl + FrontRoutes.Terms,
      priority: 0.3,
      lastModified: new Date(),
    },
  ]
}
export const getItemPages = withPrisma(
  async (prisma, baseUrl: string): Promise<MetadataRoute.Sitemap> => {
    const barometers = await prisma.barometer.findMany({ select: { slug: true } })
    return barometers.map(({ slug }) => ({
      url: baseUrl + FrontRoutes.Barometer + slug,
      priority: 0.8,
      lastModified: new Date(),
    }))
  },
)
export const getCategoryPages = withPrisma(
  async (prisma, baseUrl: string): Promise<MetadataRoute.Sitemap> => {
    const categories = await prisma.category.findMany({ select: { name: true } })
    return categories.map(({ name }) => ({
      url: baseUrl + FrontRoutes.Categories + name,
      priority: 0.9,
      lastModified: new Date(),
    }))
  },
)
export const getBrandPages = withPrisma(async (prisma, baseUrl: string) => {
  const brands = await prisma.manufacturer.findMany({ select: { slug: true } })
  return brands.map(({ slug }) => ({
    url: baseUrl + FrontRoutes.Brands + slug,
    priority: 0.8,
    lastModified: new Date(),
  }))
})
