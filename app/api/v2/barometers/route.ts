import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { withPrisma } from '@/prisma/prismaClient'
import { cleanObject, slug as slugify } from '@/utils/misc'
import { type SortValue } from '@/app/collection/categories/[category]/types'
import { DEFAULT_PAGE_SIZE } from '../parameters'
import { getAllBarometers, getBarometersByParams } from './getters'

/**
 * Get barometer list
 *
 * GET /api/barometers?category=aneroid
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sort') as SortValue | null
    const size = Math.max(Number(searchParams.get('size')) || DEFAULT_PAGE_SIZE, 1)
    const page = Math.max(Number(searchParams.get('page')) || 1, 1)
    // if `type` search param was not passed return all barometers list
    if (!category || !category.trim()) {
      const barometers = await getAllBarometers()
      return NextResponse.json(barometers, { status: 200 })
    }
    // type was passed
    const dbResponse = await getBarometersByParams(category, page, size, sortBy)
    return NextResponse.json(dbResponse, { status: dbResponse.barometers.length > 0 ? 200 : 404 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Could not retrieve barometer list' },
      { status: 500 },
    )
  }
}

//! Protect this function
/**
 * Add new barometer
 *
 * POST /api/barometers
 */
export const POST = withPrisma(async (prisma, req: NextRequest) => {
  try {
    const barometerData = await req.json()
    const { images, ...barometer } = cleanObject(barometerData)
    const { id } = await prisma.barometer.create({
      data: {
        ...barometer,
        images: {
          create: images,
        },
      },
    })
    revalidatePath('/')
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error adding new barometer' },
      { status: 500 },
    )
  }
})

//! Protect this function
/**
 * Update barometer data
 *
 * PUT /api/barometers
 */
export const PUT = withPrisma(async (prisma, req: NextRequest) => {
  try {
    const barometerData = await req.json()
    const { images, id, ...barometer } = cleanObject(barometerData)
    const { slug } = await prisma.barometer.findUniqueOrThrow({ where: { id } })
    // modify slug if name has changed
    const newData = { ...barometer, slug: barometer.name ? slugify(barometer.name) : slug }
    // transaction will prevent deleting images in case barometer update fails
    await prisma.$transaction(async tx => {
      if (images && images.length > 0) {
        // delete old images
        await tx.image.deleteMany({ where: { barometers: { some: { id } } } })
        await tx.barometer.update({
          where: { id },
          data: {
            ...newData,
            // attach new images
            images: {
              create: images,
            },
          },
        })
      } else {
        // images are not updated
        await tx.barometer.update({
          where: { id },
          data: newData,
        })
      }
    })
    revalidatePath(`/collection/items/${newData.slug}`)
    return NextResponse.json({ slug: newData.slug }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error updating barometer' },
      { status: 500 },
    )
  }
})
