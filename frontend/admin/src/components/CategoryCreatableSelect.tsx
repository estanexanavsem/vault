import { ActionIcon, Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import { Save, Trash2 } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { useCustomTransferCategories } from '../hooks/useCustomTransferCategories'
import type { SelectOption } from '../types/panel'
import { darkInputClassNames, transferCategoryOptions } from '../utils/panelDialogConfig'

const createCategoryValue = '__create_category__'
const createCategoryOption: SelectOption = {
  value: createCategoryValue,
  label: '+ создать',
}

interface CategoryCreatableSelectProps {
  id: string
  name: string
  value: string
  onBlur: () => void
  onChange: (value: string) => void
}

export function CategoryCreatableSelect({
  id,
  name,
  value,
  onBlur,
  onChange,
}: CategoryCreatableSelectProps) {
  const [isCreating, setCreating] = useState(false)
  const [draft, setDraft] = useState('')
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const { customCategories, addCategory, deleteCategory, isSaving } = useCustomTransferCategories()
  const customOptions = customCategories.map((category) => ({
    value: category,
    label: category,
  }))
  const knownOptions = [...transferCategoryOptions, ...customOptions]
  const selectedCustomOption =
    value !== '' && !knownOptions.some((option) => option.value === value)
      ? [{ value, label: value }]
      : []
  const options = [...knownOptions, ...selectedCustomOption, createCategoryOption]

  const saveDraft = () => {
    const nextValue = draft.trim()
    if (nextValue === '') {
      return
    }

    const existingOption = knownOptions.find(
      (option) => option.value.toLowerCase() === nextValue.toLowerCase(),
    )
    if (existingOption) {
      onChange(existingOption.value)
      setCreating(false)
      setDropdownOpen(false)
      setDraft('')
      return
    }

    void addCategory(nextValue).then((savedCategory) => {
      onChange(savedCategory)
      setCreating(false)
      setDropdownOpen(false)
      setDraft('')
    })
  }

  const startCreating = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setCreating(true)
    setDropdownOpen(true)
  }

  const requestDeleteCategory = (event: MouseEvent, category: string) => {
    event.preventDefault()
    event.stopPropagation()
    setDropdownOpen(false)
    setCategoryToDelete(category)
  }

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) {
      return
    }

    void deleteCategory(categoryToDelete).then(() => {
      if (value.toLowerCase() === categoryToDelete.toLowerCase()) {
        onChange('')
      }
      setCategoryToDelete(null)
    })
  }

  return (
    <>
      <Select
        id={id}
        name={name}
        data={options}
        value={value}
        dropdownOpened={isDropdownOpen}
        onDropdownOpen={() => setDropdownOpen(true)}
        onDropdownClose={() => {
          setDropdownOpen(false)
          setCreating(false)
          setDraft('')
        }}
        onChange={(nextValue) => {
          if (nextValue === createCategoryValue) {
            setCreating(true)
            setDropdownOpen(true)
            return
          }
          onChange(nextValue ?? '')
          setDropdownOpen(false)
        }}
        onBlur={onBlur}
        renderOption={({ option }) => {
          if (option.value !== createCategoryValue) {
            const isCustomOption = customCategories.some(
              (category) => category.toLowerCase() === option.value.toLowerCase(),
            )

            return (
              <span className="flex w-full min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate">{option.label}</span>
                {isCustomOption ? (
                  <ActionIcon
                    aria-label={`Удалить категорию ${option.label}`}
                    size="sm"
                    variant="transparent"
                    onMouseDown={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onClick={(event) => requestDeleteCategory(event, option.value)}
                  >
                    <Trash2 className="text-red-500" size={14} aria-hidden="true" />
                  </ActionIcon>
                ) : null}
              </span>
            )
          }

          if (!isCreating) {
            return (
              <button
                type="button"
                className="w-full bg-transparent p-0 text-left text-inherit [font:inherit]"
                onMouseDown={startCreating}
                onClick={startCreating}
              >
                {createCategoryOption.label}
              </button>
            )
          }

          return (
            <div className="-mx-2.5 -my-2 w-[calc(100%+1.25rem)]">
              <TextInput
                className="w-full"
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  event.stopPropagation()
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    saveDraft()
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    setCreating(false)
                    setDraft('')
                  }
                }}
                rightSection={
                  <ActionIcon
                    aria-label="Создать категорию"
                    variant="subtle"
                    color="gray"
                    loading={isSaving}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onClick={(event) => {
                      event.stopPropagation()
                      saveDraft()
                    }}
                  >
                    <Save size={16} aria-hidden="true" />
                  </ActionIcon>
                }
                autoFocus
                classNames={{
                  ...darkInputClassNames,
                  input: `${darkInputClassNames.input} !pr-9`,
                  root: 'w-full',
                  wrapper: 'w-full',
                }}
              />
            </div>
          )
        }}
        allowDeselect
        classNames={darkInputClassNames}
      />
      <Modal
        opened={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        title={`Удалить категорию "${categoryToDelete}"?`}
        centered
      >
        <Stack>
          <Text size="sm">
            Все переводы с этой категорией будут перенесены в категорию "Other".
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setCategoryToDelete(null)}>
              Отмена
            </Button>
            <Button color="red" loading={isSaving} onClick={confirmDeleteCategory}>
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
