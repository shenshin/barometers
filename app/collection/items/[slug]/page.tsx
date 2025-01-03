import { type Metadata } from 'next'
import capitalize from 'lodash/capitalize'
import { Container, Title, Text, Box, Divider, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { googleStorageImagesFolder, barometerRoute } from '@/app/constants'
import { ImageCarousel } from './components/carousel'
import { Condition } from './components/condition'
import { TextFieldEdit } from './components/edit-fields/textfield-edit'
import { DescriptionEdit } from './components/edit-fields/description-edit'
import { ConditionEdit } from './components/edit-fields/condition-edit'
import { ManufacturerEdit } from './components/edit-fields/manufacturer-edit'
import { BreadcrumbsComponent } from './components/breadcrumbs'
import sx from './styles.module.scss'
import DimensionEdit from './components/edit-fields/dimensions-edit'
import { DescriptionText } from '@/app/components/description-text'
import { title, openGraph, twitter } from '@/app/metadata'
import { Dimensions } from '@/app/types'
import { withPrisma } from '@/prisma/prismaClient'
import { getBarometer } from '@/app/api/v2/barometers/[slug]/getters'
import { IsAdmin } from '@/app/components/is-admin'
import { DateEdit } from './components/edit-fields/date-edit'
import { DeleteBarometer } from './components/delete-barometer'

export const dynamic = 'force-static'

interface Slug {
  slug: string
}
interface BarometerItemProps {
  params: Slug
}

export async function generateMetadata({
  params: { slug },
}: BarometerItemProps): Promise<Metadata> {
  const { description, name, images } = await getBarometer(slug)
  const barometerTitle = `${title}: ${capitalize(name)}`
  const barometerImages =
    images &&
    images.map(image => ({
      url: googleStorageImagesFolder + image.url,
      alt: name,
    }))
  const url = barometerRoute + slug
  return {
    title: barometerTitle,
    description,
    openGraph: {
      ...openGraph,
      title: barometerTitle,
      description,
      url,
      images: barometerImages,
    },
    twitter: {
      ...twitter,
      title: name,
      description,
      images: barometerImages?.map(image => ({
        url: image.url,
        alt: image.alt,
      })),
    },
  }
}

/**
 * This function fetches all barometers from the API and maps their slugs
 * to be used as static parameters for Next.js static generation.
 */
export const generateStaticParams = withPrisma(prisma =>
  prisma.barometer.findMany({ select: { slug: true } }),
)

export default async function BarometerItem({ params: { slug } }: BarometerItemProps) {
  const barometer = await getBarometer(slug)

  const dimensions = barometer.dimensions as Dimensions
  return (
    <Container size="xl">
      <Box px={{ base: 'none', sm: 'xl' }} pb={{ base: 'xl', sm: '5rem' }}>
        <BreadcrumbsComponent catId={barometer.collectionId} type={barometer.category.name} />
        <ImageCarousel barometer={barometer} />
        <Box mb="md">
          <Title
            className={sx.title}
          >{`${barometer.name.split(' ').slice(0, -1).join(' ')} `}</Title>
          <Title className={sx.title} style={{ whiteSpace: 'nowrap' }}>
            {barometer.name.split(' ').at(-1)}
            <IsAdmin>
              <TextFieldEdit barometer={barometer} property="name" size={22} />
            </IsAdmin>
          </Title>
          <Tooltip label="Collection ID">
            <Text className={sx.collectionId}>{barometer.collectionId}</Text>
          </Tooltip>
        </Box>

        <IsAdmin>
          <DeleteBarometer size="compact-md" mb="sm" barometer={barometer} />
        </IsAdmin>

        {barometer.manufacturer && (
          <Box>
            <Title className={sx.heading} order={3}>
              Manufacturer/Retailer:&nbsp;
            </Title>
            <Text c="dark.3" fw={400} display="inline">
              {`${barometer.manufacturer.name}${barometer.manufacturer.city ? `, ${barometer.manufacturer.city}` : ''}`}
              <IsAdmin>
                <ManufacturerEdit barometer={barometer} />
              </IsAdmin>
            </Text>
          </Box>
        )}

        <IsAdmin>
          <Title className={sx.heading} order={3}>
            Year:&nbsp;
          </Title>
          <Text c="dark.3" fw={400} display="inline">
            {dayjs(barometer.date).format('YYYY')}
            <DateEdit barometer={barometer} />
          </Text>
        </IsAdmin>

        <Box>
          <Title className={sx.heading} order={3}>
            Dating:&nbsp;
          </Title>
          <Text c="dark.3" fw={400} display="inline">
            {barometer.dateDescription}
            <IsAdmin>
              <TextFieldEdit barometer={barometer} property="dateDescription" />
            </IsAdmin>
          </Text>
        </Box>

        {dimensions && dimensions.length > 0 && (
          <Box>
            <Title className={sx.heading} fw={500} order={3}>
              Dimensions:{' '}
              {dimensions.map((dimension, index, arr) => (
                <Text c="dark.3" display="inline" key={index}>
                  {dimension.dim} {dimension.value}
                  {index < arr.length - 1 ? ', ' : ''}
                </Text>
              ))}
              <IsAdmin>
                <DimensionEdit barometer={barometer} />
              </IsAdmin>
            </Title>
          </Box>
        )}

        <Condition
          condition={barometer.condition}
          editButton={
            <IsAdmin>
              <ConditionEdit barometer={barometer} />
            </IsAdmin>
          }
        />

        <Divider
          mx="lg"
          my="lg"
          labelPosition="right"
          label={
            <IsAdmin>
              <DescriptionEdit barometer={barometer} />
            </IsAdmin>
          }
        />
        {barometer.description ? (
          <DescriptionText description={barometer.description} />
        ) : (
          <IsAdmin>
            <Text>Add description</Text>
          </IsAdmin>
        )}
      </Box>
    </Container>
  )
}
