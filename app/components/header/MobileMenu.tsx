import { FC, useState, Fragment } from 'react'
import {
  Drawer,
  DrawerProps,
  Box,
  ActionIcon,
  Stack,
  Anchor,
  Collapse,
  List,
  UnstyledButton,
  Text,
  Divider,
  Group,
  Center,
} from '@mantine/core'
import Link from 'next/link'
import * as motion from 'framer-motion/client'
import { SiMaildotru, SiInstagram } from 'react-icons/si'
import { IoIosArrowForward as Arrow } from 'react-icons/io'
import { instagram, email } from '@/app/constants'
import { menuData, hasChildren } from './menu'

export const MobileMenu: FC<DrawerProps> = props => {
  const [opened, setOpened] = useState<Record<number, boolean>>({})
  const toggle = (index: number) => setOpened(old => ({ ...old, [index]: !old[index] }))

  return (
    <Drawer
      size="sm"
      transitionProps={{
        duration: 500,
      }}
      styles={{
        body: {
          padding: 0,
          height: 'calc(100% - 4rem)',
        },
      }}
      {...props}
    >
      <Stack h="100%" justify="space-between">
        {/* Menu */}
        <Box
          component={motion.div}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <List px="xl" listStyleType="none">
            {menuData.map((outer, i, arr) => (
              <Fragment key={outer.id}>
                {hasChildren(outer) ? (
                  <>
                    <List.Item py="md">
                      <UnstyledButton onClick={() => toggle(i)}>
                        <Group gap="sm">
                          <Text size="sm" tt="uppercase" lts="0.15rem" fw={500}>
                            {outer.label}
                          </Text>
                          <Center
                            component={motion.div}
                            animate={{ rotate: opened[i] ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Arrow />
                          </Center>
                        </Group>
                      </UnstyledButton>
                    </List.Item>
                    <Collapse transitionDuration={500} in={opened[i]}>
                      <List px="xl" listStyleType="none">
                        {outer.children.map(inner => (
                          <List.Item pb="sm" key={inner.id}>
                            <Anchor
                              c="inherit"
                              component={Link}
                              href={`/${outer.link}/${inner.link}`}
                            >
                              <Text size="xs" tt="capitalize" lts="0.1rem" fw={400}>
                                {inner.label}
                              </Text>
                            </Anchor>
                          </List.Item>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <List.Item py="md">
                    <Anchor c="inherit" component={Link} href={outer.link}>
                      <Text size="sm" tt="uppercase" lts="0.15rem" fw={500}>
                        {outer.label}
                      </Text>
                    </Anchor>
                  </List.Item>
                )}
                {i < arr.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box
          component={motion.div}
          initial={{ y: 70 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Divider />
          <Group h="4rem" align="center" justify="space-evenly">
            <Anchor aria-label="Instagram" target="_blank" href={instagram} lh={0}>
              <ActionIcon variant="default" size="sm" bd="none">
                <SiInstagram size="100%" />
              </ActionIcon>
            </Anchor>
            <Anchor aria-label="Email" target="_blank" href={`mailto:${email}`} lh={0}>
              <ActionIcon variant="default" size="sm" bd="none">
                <SiMaildotru size="100%" />
              </ActionIcon>
            </Anchor>
          </Group>
        </Box>
      </Stack>
    </Drawer>
  )
}