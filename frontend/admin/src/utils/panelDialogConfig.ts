import type { SelectOption } from '../types/panel'

export const modalClassNames = {
  content: '!bg-[#171717] !text-neutral-100 !border !border-[#2a2a2a] !rounded-[18px] !shadow-2xl',
  header: '!bg-[#171717] !border-b !border-[#2a2a2a] !px-4 !py-3',
  title: '!text-base !font-semibold !text-neutral-100',
  body: '!p-0',
  close: '!text-neutral-300 hover:!bg-[#242424]',
}

export const darkInputClassNames = {
  input:
    '!bg-[#0f0f0f] !border-[#303030] !text-neutral-100 placeholder:!text-neutral-500 focus:!border-blue-500',
}

export const moneyInputProps = {
  decimalScale: 2,
  fixedDecimalScale: true,
  thousandSeparator: ',',
  decimalSeparator: '.',
  allowedDecimalSeparators: ['.', ','],
  prefix: '$ ',
  hideControls: true,
  selectAllOnFocus: true,
  classNames: darkInputClassNames,
}

export const dialogRowClass = 'grid grid-cols-[160px_minmax(0,1fr)] items-center gap-3'
export const dialogLabelClass = 'text-sm text-neutral-400'

export const transferCategoryOptions: SelectOption[] = [
  { value: 'Taxes & Fees', label: 'Налоги и сборы' },
  { value: 'Other', label: 'Другое' },
  { value: 'Deposits', label: 'Депозиты' },
  { value: 'Professional & Legal Services', label: 'Профессиональные и юридические услуги' },
]

export const transferTypeOptions: SelectOption[] = [
  { value: 'Deposit', label: 'Депозит' },
  { value: 'Other', label: 'Другое' },
  { value: 'Check', label: 'Чек' },
  { value: 'Intuit', label: 'Intuit' },
]
