import { Overlay, AspectRatio, BackgroundImage, Title, Anchor, Box } from '@mantine/core'
import NextLink from 'next/link'
import { FC } from 'react'
import type { Category } from './types'
import styles from './category-card.module.scss'

export const CategoryCard: FC<Category> = ({ name, link, image }) => {
  return (
    <Anchor component={NextLink} href={link}>
      <AspectRatio ratio={1}>
        <Box className={styles.container}>
          <Overlay
            zIndex={2}
            gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 100%)"
          />
          <BackgroundImage className={styles.bg_image} src={image} />
          <Title className={styles.title}>{name}</Title>
        </Box>
      </AspectRatio>
    </Anchor>
  )
}