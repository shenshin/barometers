'use client'

import { Box, Image } from '@mantine/core'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Zoom, Navigation, Pagination } from 'swiper/modules'
import NextImage from 'next/image'
import clsx from 'clsx'
import { ImagesEdit } from './edit-fields/images-edit'
import { type BarometerDTO } from '@/app/types'
import { IsAdmin } from '@/app/components/is-admin'
import 'swiper/css'
import 'swiper/css/zoom'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './styles.css'

interface ImageCarouselProps {
  images: string[]
  barometer: BarometerDTO
}

export function ImageCarousel({ images, barometer }: ImageCarouselProps) {
  return (
    <Box style={{ overflow: 'hidden', position: 'relative' }}>
      <IsAdmin>
        <ImagesEdit barometer={barometer} />
      </IsAdmin>
      <Swiper
        zoom
        loop={images.length > 1}
        navigation
        modules={[Zoom, Navigation, Pagination]}
        pagination={{
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${clsx(className)}">${index + 1}</span>`
          },
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={image}>
            <Box className="swiper-zoom-container">
              <Image
                priority={i === 0}
                loading={i === 0 ? 'eager' : 'lazy'}
                quality={60}
                width={200}
                height={200}
                src={image}
                alt={barometer.name}
                component={NextImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}
