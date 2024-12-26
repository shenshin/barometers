import { Box, Text, Anchor } from '@mantine/core'
import Link from 'next/link'
import NextImage from 'next/image'
import styles from './styles.module.scss'

interface BarometerCardProps {
  image: string
  name: string
  link: string
  manufacturer?: string
  priority: boolean
}

export async function BarometerCard({
  name,
  image,
  link,
  manufacturer,
  priority,
}: BarometerCardProps) {
  return (
    <Box>
      <Anchor underline="never" c="dark" className={styles.anchor} component={Link} href={link}>
        <Box className={styles.bg_gradient}>
          <NextImage
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            quality={50}
            src={image}
            alt={name}
            fill
            sizes="(max-width: 575px) 50vw, (max-width: 1350px) 25vw, 20vw"
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <Text mb="0.2rem" size="xs" fw={500} lts={1} tt="uppercase" ta="center">
          {name}
        </Text>
        {manufacturer && manufacturer.toLowerCase() !== 'unknown' && (
          <Text c="inherit" size="8px" fw={500} lts={1} tt="uppercase" ta="center" lh="xs">
            {manufacturer}
          </Text>
        )}
      </Anchor>
    </Box>
  )
}