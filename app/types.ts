export type { BarometerListDTO } from './api/v2/barometers/getters'
export type { CategoryListDTO } from './api/v2/categories/getters'
export type { CategoryDTO } from './api/v2/categories/[name]/getters'
export type { BarometerDTO } from './api/v2/barometers/[slug]/getters'
export type { ConditionListDTO } from './api/v2/conditions/getters'
export type { ManufacturerListDTO } from './api/v2/manufacturers/getters'
export type { ManufacturerDTO } from './api/v2/manufacturers/[slug]/getters'
export type { SearchResultsDTO } from './api/v2/search/search'
export type { InaccuracyReportListDTO } from './api/v2/report/getters'
export type { SubcategoryListDTO } from './api/v2/subcategories/getters'
export type { MaterialListDTO } from './api/v2/materials/getters'
export type { CountryListDTO } from './api/v2/countries/getters'
export type { UrlDto, FileProps } from './api/v2/upload/images/types'
/**
 * Barometer dimensions database JSON structure
 */
export type Dimensions = { dim: string; value: string }[]

export interface BarometerFormProps {
  collectionId: string
  name: string
  categoryId: string
  date: string
  dateDescription: string
  manufacturerId: string
  conditionId: string
  description: string
  dimensions: Dimensions
  images: string[]
}

export const SortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Dating' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'last-added', label: 'Last added' },
] as const satisfies { value: string; label: string }[]

export type SortValue = (typeof SortOptions)[number]['value']
export type DynamicOptions = 'auto' | 'force-dynamic' | 'error' | 'force-static'
