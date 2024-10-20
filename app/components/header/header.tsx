'use client'

import React from 'react'
import NextLink from 'next/link'
import NextImage from 'next/image'
import { Group, Burger, Anchor, Title, Container, Box, Flex } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Tabs } from './tabs'
import { MobileMenu } from './mobile-menu'
import styles from './header.module.scss'

export function Header() {
  const [opened, { close, open }] = useDisclosure()
  return (
    <>
      <Box className={styles.indent}>
        <Box className={styles.container}>
          <Container h="100%" size="xl">
            <Group h="100%" justify="space-between" gap="0.3rem" wrap="nowrap">
              <Box>
                <Burger size="sm" hiddenFrom="md" opened={opened} onClick={open} />
                <Tabs visibleFrom="md" />
              </Box>
              <Anchor underline="never" component={NextLink} href="/">
                <Flex align="center" gap="xs">
                  {/* Logo image */}
                  <Box className={styles.logo}>
                    <NextImage
                      fill
                      priority
                      quality={40}
                      src="/images/logo-arrow.png"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt="logo"
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Title lh="100%" fz={{ base: 'h3', sm: 'h1' }} c="black" fw={500}>
                    Barometers Realm
                  </Title>
                </Flex>
              </Anchor>
            </Group>
          </Container>
        </Box>
      </Box>
      <MobileMenu opened={opened} onClose={close} />
    </>
  )
}
