import { Metadata } from 'next'
import capitalize from 'lodash/capitalize'
import { Container, Grid, GridCol, Stack, Title } from '@mantine/core'
import { barometerRoute, googleStorageImagesFolder, barometerTypesRoute } from '@/app/constants'
import { BarometerCard } from './components/barometer-card'
import { slug } from '@/utils/misc'
import { SortValue } from './types'
import Sort from './sort'
import { fetchBarometers, fetchTypes } from '@/utils/fetch'
import { DescriptionText } from '@/app/components/description-text'
import { title, openGraph, twitter } from '@/app/metadata'

interface CollectionProps {
  params: {
    type: string
  }
  searchParams: {
    sort?: SortValue
  }
}

export async function generateMetadata({ params: { type } }: CollectionProps): Promise<Metadata> {
  const { description } = await fetchTypes({ type })
  const barometersOfType = await fetchBarometers({ type, limit: '5' })
  const collectionTitle = `${title}: ${capitalize(type)} Barometers Collection`
  const barometerImages = barometersOfType
    .filter(({ images }) => images && images.length > 0)
    .map(({ images, name }) => ({
      url: googleStorageImagesFolder + images!.at(0),
      alt: name,
    }))
  const url = barometerTypesRoute + type
  return {
    title: collectionTitle,
    description,
    openGraph: {
      ...openGraph,
      url,
      title: collectionTitle,
      description,
      images: barometerImages,
    },
    twitter: {
      ...twitter,
      title: collectionTitle,
      description,
      images: barometerImages,
    },
  }
}

export default async function Collection({ params: { type }, searchParams }: CollectionProps) {
  const sortBy = searchParams.sort ?? 'date'
  const barometersOfType = await fetchBarometers({ type, sort: sortBy })
  // selected barometer type details
  const { description } = await fetchTypes({ type })
  return (
    <Container py="xl" size="xl">
      <Stack gap="xs">
        <Title mb="sm" fw={500} order={2} tt="capitalize">
          {type}
        </Title>
        {description && <DescriptionText size="sm" description={description} />}
        <Sort sortBy={sortBy} style={{ alignSelf: 'flex-end' }} />
        <Grid justify="center" gutter="xl">
          {barometersOfType.map(({ name, _id, images, manufacturer }, i) => (
            <GridCol span={{ base: 6, xs: 3, lg: 3 }} key={String(_id)}>
              <BarometerCard
                priority={i < 8}
                image={googleStorageImagesFolder + images![0]}
                name={name}
                link={barometerRoute + slug(name)}
                manufacturer={manufacturer?.name}
              />
            </GridCol>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}

export async function generateStaticParams() {
  const barometerTypes = await fetchTypes()
  return barometerTypes.map(({ name }) => ({
    type: name.toLowerCase(),
  }))
}
