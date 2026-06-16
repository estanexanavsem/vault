import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../services/settingsService'
import { panelQueryKeys } from './usePanelData'

const customTransferCategoriesKey = 'transfer_custom_categories'

const parseCustomCategories = (value: string | undefined): string[] => {
  if (!value) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

const serializeCustomCategories = (categories: string[]) => JSON.stringify(categories)

const normalizeCategory = (value: string) => value.trim()

const mergeCategory = (categories: string[], category: string) => {
  const nextCategory = normalizeCategory(category)
  if (nextCategory === '') {
    return categories
  }

  return categories.some((item) => item.toLowerCase() === nextCategory.toLowerCase())
    ? categories
    : [...categories, nextCategory]
}

export function useCustomTransferCategories() {
  const queryClient = useQueryClient()
  const settingsQuery = useQuery(
    queryOptions({
      queryKey: panelQueryKeys.settings,
      queryFn: settingsService.getSettings,
    }),
  )
  const customCategories = parseCustomCategories(settingsQuery.data?.[customTransferCategoriesKey])
  const updateMutation = useMutation({
    mutationFn: (categories: string[]) =>
      settingsService.updateSettings({
        [customTransferCategoriesKey]: serializeCustomCategories(categories),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.settings })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: settingsService.deleteTransferCategory,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: panelQueryKeys.settings }),
        queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers }),
      ])
    },
  })

  const addCategory = async (category: string) => {
    const nextCategories = mergeCategory(customCategories, category)
    await updateMutation.mutateAsync(nextCategories)
    return normalizeCategory(category)
  }

  const deleteCategory = async (category: string) => {
    await deleteMutation.mutateAsync(category)
  }

  return {
    customCategories,
    addCategory,
    deleteCategory,
    isLoading: settingsQuery.isPending,
    isSaving: updateMutation.isPending || deleteMutation.isPending,
  }
}
