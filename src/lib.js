export const PRI = {
  low: { label: 'ต่ำ', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500', bar: 'bg-emerald-400' },
  mid: { label: 'กลาง', badge: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500', bar: 'bg-amber-400' },
  high: { label: 'สูง', badge: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-500', bar: 'bg-rose-400' },
}
export const PRI_ORDER = ['low', 'mid', 'high']

export const CATS = {
  work: { label: 'งาน', chip: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-500' },
  personal: { label: 'ส่วนตัว', chip: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' },
  shopping: { label: 'ช้อปปิ้ง', chip: 'bg-pink-50 text-pink-700 ring-pink-200', dot: 'bg-pink-500' },
  health: { label: 'สุขภาพ', chip: 'bg-teal-50 text-teal-700 ring-teal-200', dot: 'bg-teal-500' },
}
export const CAT_ORDER = ['work', 'personal', 'shopping', 'health']

export const STATUS_TABS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ยังไม่เสร็จ'],
  ['done', 'เสร็จแล้ว'],
]

const pad = (n) => String(n).padStart(2, '0')
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISO(new Date())
export const offsetISO = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toISO(d)
}
export const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

// 'overdue' | 'today' | 'plain' | 'none'
export function dueState(t, today) {
  if (!t.due) return 'none'
  if (t.done) return 'plain'
  if (t.due < today) return 'overdue'
  if (t.due === today) return 'today'
  return 'plain'
}

export const DUE_STYLE = {
  overdue: 'bg-red-50 text-red-700 ring-red-200',
  today: 'bg-yellow-50 text-yellow-800 ring-yellow-300',
  plain: 'bg-slate-50 text-slate-600 ring-slate-200',
}
