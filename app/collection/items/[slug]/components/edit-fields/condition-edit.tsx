'use client'

import {
  Modal,
  UnstyledButton,
  UnstyledButtonProps,
  Button,
  Stack,
  Select,
  Tooltip,
  Box,
} from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { BarometerDTO } from '@/app/types'
import { useEditField } from './useEditField'
import { useBarometers } from '@/app/hooks/useBarometers'

interface TextFieldEditProps extends UnstyledButtonProps {
  size?: string | number | undefined
  barometer: BarometerDTO
}

const property = 'conditionId'

export function ConditionEdit({ size = 18, barometer, ...props }: TextFieldEditProps) {
  const { condition } = useBarometers()
  const { open, close, opened, form, update } = useEditField({ property, barometer })
  return (
    <>
      <Tooltip label="Edit condition">
        <UnstyledButton {...props} onClick={open}>
          <IconEdit color="brown" size={size} />
        </UnstyledButton>
      </Tooltip>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Edit condition"
        size="md"
        tt="capitalize"
        styles={{ title: { fontSize: '1.5rem', fontWeight: 500 } }}
      >
        <Box component="form" onSubmit={form.onSubmit(update)}>
          <Stack>
            <Select
              data={condition.data.map(({ name, id }) => ({
                label: name,
                value: id,
              }))}
              value={form.values.conditionId}
              onChange={id => {
                const newCondition = condition.data.find(c => c.id === id)
                form.setValues({ conditionId: newCondition?.id })
              }}
              allowDeselect={false}
            />
            <Button fullWidth color="dark" variant="outline" type="submit">
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}
