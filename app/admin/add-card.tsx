'use client'

import {
  Box,
  Title,
  Button,
  FileInput,
  TextInput,
  Select,
  Textarea,
  Fieldset,
  ActionIcon,
  Group,
  Stack,
} from '@mantine/core'
import { IconTrash, IconSquareRoundedPlus, IconPhotoPlus } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { isLength } from 'validator'
import { showInfo, showError } from '@/utils/notification'
import { useBarometers } from '../hooks/useBarometers'

interface FormProps {
  collectionId: string
  name: string
  type: string
  dating: string
  manufacturer: string
  condition: string
  image: string
  description: string
  dimensions: { dim: string; value: string }[]
}

export function AddCard() {
  const [uploadedImage, setUploadedImage] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const { condition, types, manufacturers } = useBarometers()

  const form = useForm<FormProps>({
    initialValues: {
      collectionId: '',
      name: '',
      type: '',
      dating: '',
      manufacturer: '',
      condition: '',
      image: '',
      description: '',
      dimensions: [],
    },
    validate: {
      collectionId: val => (isLength(val, { max: 100 }) ? null : 'Too long catalogue ID (<100)'),
      name: val => (isLength(val, { max: 200 }) ? null : 'Too long name (<200)'),
    },
  })

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (values: FormProps) =>
      axios
        .post('/api/barometers', values, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(({ data }) => data),
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries({
        queryKey: ['barometers'],
      })
      form.reset()
      showInfo(`Added ${name} to the database`)
    },
    onError: (error: AxiosError) => {
      showError(
        (error.response?.data as { message: string })?.message ||
          error.message ||
          'Error adding barometer',
      )
    },
  })

  useEffect(() => {
    if (types.data.length === 0) return
    form.setFieldValue('type', String(types.data[0]._id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types.data])

  useEffect(() => {
    if (condition.data.length === 0) return
    form.setFieldValue('condition', String(condition.data.at(-1)?._id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.data])

  const addDimension = () => {
    form.insertListItem('dimensions', { dim: '', value: '' })
  }

  // delete key-value pair by index
  const removeDimension = (index: number) => {
    form.removeListItem('dimensions', index)
  }

  return (
    <Box flex={1}>
      <Title mb="lg" order={3} tt="capitalize">
        Add barometer
      </Title>
      <Box component="form" onSubmit={form.onSubmit(values => mutate(values))}>
        <TextInput label="Catalogue No." required {...form.getInputProps('collectionId')} />
        <TextInput label="Title" required id="barometer-name" {...form.getInputProps('name')} />
        <TextInput label="Dating" key={form.key('dating')} {...form.getInputProps('dating')} />
        <Select
          data={types.data.map(({ name, _id }) => ({
            label: name,
            value: String(_id),
          }))}
          label="Type"
          required
          {...form.getInputProps('type')}
        />
        <Select
          data={manufacturers.data.map(({ name, _id }) => ({
            label: name,
            value: String(_id),
          }))}
          label="Manufacturer"
          {...form.getInputProps('manufacturer')}
        />
        <Select
          label="Condition"
          data={condition.data.map(({ name, _id }) => ({
            label: name,
            value: String(_id),
          }))}
          {...form.getInputProps('condition')}
        />
        <Fieldset mt="0.2rem" p="sm" pt="0.3rem" variant="filled" legend="Dimensions">
          <Stack gap="xs" align="flex-end">
            {form.values.dimensions?.map((_, i) => (
              <Group gap="xs" wrap="nowrap" key={form.key(`dimensions.${i}`)}>
                <TextInput placeholder="Unit" {...form.getInputProps(`dimensions.${i}.dim`)} />
                <TextInput placeholder="Value" {...form.getInputProps(`dimensions.${i}.value`)} />
                <ActionIcon variant="default" onClick={() => removeDimension(i)}>
                  <IconTrash color="grey" size={20} />
                </ActionIcon>
              </Group>
            ))}
            <ActionIcon variant="default" onClick={addDimension}>
              <IconSquareRoundedPlus color="grey" size={20} />
            </ActionIcon>
          </Stack>
        </Fieldset>

        <FileInput label="Load image" rightSection={<IconPhotoPlus />} />
        <Textarea label="Description" autosize minRows={2} {...form.getInputProps('description')} />
        <Button mt="lg" type="submit" variant="outline" color="dark">
          Add new barometer
        </Button>
      </Box>
    </Box>
  )
}
