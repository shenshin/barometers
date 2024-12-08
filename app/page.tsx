import { Container, Grid, GridCol } from '@mantine/core'
import { HeadingImage } from './components/heading-image'
import { CategoryCard } from './components/category-card'
import { barometerTypesApiRoute, barometerTypesRoute } from './constants'
import { IBarometerType } from '@/models/type'
import { SearchField } from './components/search-field'

export default async function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) throw new Error('Base URL is not set. Please configure NEXT_PUBLIC_BASE_URL.')
  const barometerTypes: IBarometerType[] = await fetch(baseUrl + barometerTypesApiRoute).then(res =>
    res.json(),
  )
  return (
    <>
      <HeadingImage />
      <Container size="xl" pb="2.3rem">
        <SearchField
          ml="auto"
          w={{ base: '100%', xs: 'calc(50% - 1.25rem)', lg: 'calc(33% - 1.25rem)' }}
        />
        <Grid justify="center" gutter={{ base: '2rem', sm: '2.5rem' }}>
          {barometerTypes.map(({ _id, label, name, image }, i) => (
            <GridCol key={String(_id)} span={{ base: 12, xs: 6, lg: 4 }}>
              <CategoryCard
                priority={i < 3}
                image={image}
                name={label}
                link={barometerTypesRoute + name.toLowerCase()}
              />
            </GridCol>
          ))}
        </Grid>
      </Container>
    </>
  )
}
