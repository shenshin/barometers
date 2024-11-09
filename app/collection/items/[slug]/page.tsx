import { type Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Container, Title, Text, Box, Divider, Tooltip } from '@mantine/core'
import { authConfig, getUserByEmail } from '@/utils/auth'
import { IBarometer } from '@/models/barometer'
import { googleStorageImagesFolder, barometerRoute, twitterAccount } from '@/app/constants'
import { ShowError } from '@/app/components/show-error'
import { ImageCarousel } from './components/carousel'
import { Condition } from './components/condition'
import { AccessRole } from '@/models/user'
import { TextFieldEdit } from './components/edit-fields/textfield-edit'
import { DescriptionEdit } from './components/edit-fields/description-edit'
import { ConditionEdit } from './components/edit-fields/condition-edit'
import { ManufacturerEdit } from './components/edit-fields/manufacturer-edit'
import { BreadcrumbsComponent } from './components/breadcrumbs'
import sx from './styles.module.scss'
import { fetchBarometers } from '@/utils/fetch'
import DimensionEdit from './components/edit-fields/dimensions-edit'
import { slug as slugify } from '@/utils/misc'
import { DescriptionText } from '@/app/components/description-text'

interface Slug {
  slug: string
}
interface BarometerItemProps {
  params: Slug
}

export async function generateMetadata({
  params: { slug },
}: BarometerItemProps): Promise<Metadata> {
  try {
    const barometer = await fetchBarometers(slug)

    const images =
      barometer.images?.map(image => ({
        url: googleStorageImagesFolder + image,
        alt: barometer.name,
      })) ?? []

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
      title: barometer.name,
      description: barometer.description,
      keywords: ['barometer', ...barometer.name.split(' ')],
      openGraph: {
        title: barometer.name,
        description: barometer.description,
        url: barometerRoute + slug,
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title: barometer.name,
        description: barometer.description,
        images: images.map(image => ({
          url: image.url,
          alt: image.alt,
        })),
        site: twitterAccount,
      },
    }
  } catch (error) {
    return {
      title: 'Barometers Error',
    }
  }
}

/**
 * This function fetches all barometers from the API and maps their slugs
 * to be used as static parameters for Next.js static generation.
 */
export async function generateStaticParams(): Promise<Slug[]> {
  const barometers = await fetchBarometers()
  return barometers.map(({ slug, name }) => ({
    slug: slug ?? slugify(name),
  }))
}

async function isAuthorized(): Promise<boolean> {
  try {
    const session = await getServerSession(authConfig)
    const { role } = await getUserByEmail(session?.user?.email)
    return role === AccessRole.ADMIN
  } catch (error) {
    return false
  }
}

export default async function BarometerItem({ params: { slug } }: BarometerItemProps) {
  try {
    const isAdmin = await isAuthorized()
    const barometer: IBarometer = await fetchBarometers(slug)
    const { name, images, description, manufacturer, dating, dimensions, condition, collectionId } =
      barometer

    return (
      <Container size="xl">
        <Box px={{ base: 'none', sm: 'xl' }} pb={{ base: 'xl', sm: '5rem' }}>
          <BreadcrumbsComponent catId={barometer.collectionId} type={barometer.type.name} />
          <ImageCarousel
            isAdmin={isAdmin}
            barometer={barometer}
            images={images?.map(image => googleStorageImagesFolder + image) ?? []}
          />
          <Box>
            <Title className={sx.title}>{`${name.split(' ').slice(0, -1).join(' ')} `}</Title>
            <Title className={sx.title} style={{ whiteSpace: 'nowrap' }}>
              {name.split(' ').at(-1)}
              {isAdmin && <TextFieldEdit barometer={barometer} property="name" size={22} />}
            </Title>
            <Tooltip label="Collection ID">
              <Text className={sx.collectionId}>{collectionId}</Text>
            </Tooltip>
          </Box>

          {manufacturer && (
            <Box>
              <Title fw={500} display="inline" order={3}>
                Manufacturer:&nbsp;
              </Title>
              <Title c="dark.3" fw={400} display="inline" order={3}>
                {`${manufacturer.name}${manufacturer.city ? `, ${manufacturer.city}` : ''}`}
                {isAdmin && <ManufacturerEdit barometer={barometer} />}
              </Title>
            </Box>
          )}

          <Box>
            <Title fw={500} display="inline" order={3}>
              Dating:&nbsp;
            </Title>
            <Title c="dark.3" fw={400} display="inline" order={3}>
              {dating}
              {isAdmin && <TextFieldEdit barometer={barometer} property="dating" />}
            </Title>
          </Box>

          {dimensions && dimensions.length > 0 && (
            <Box>
              <Title fw={500} order={3}>
                Dimensions:{' '}
                {dimensions.map((dimension, index, arr) => (
                  <Text c="dark.3" display="inline" key={index}>
                    {dimension.dim} {dimension.value}
                    {index < arr.length - 1 ? ', ' : ''}
                  </Text>
                ))}
                {isAdmin && <DimensionEdit barometer={barometer} />}
              </Title>
            </Box>
          )}

          <Condition
            condition={condition}
            editButton={isAdmin && <ConditionEdit barometer={barometer} />}
          />

          {description && (
            <>
              <Divider
                mx="lg"
                my="lg"
                {...(isAdmin && {
                  label: <DescriptionEdit barometer={barometer} />,
                  labelPosition: 'right',
                })}
              />
              <DescriptionText description={description} />
            </>
          )}
        </Box>
      </Container>
    )
  } catch (error) {
    return (
      <ShowError message={error instanceof Error ? error.message : 'Error fetching barometer'} />
    )
  }
}
