import { useState } from 'react'
import { Plus, ClipboardList, Search, X } from 'lucide-react'
import TodoItem from './components/TodoItem.jsx'
import CategorySidebar from './components/CategorySidebar.jsx'
import StatsCard from './components/StatsCard.jsx'
import { PRI, PRI_ORDER, CATS, CAT_ORDER, STATUS_TABS, todayISO, offsetISO, dueState } from './lib.js'

let uid = 6
const seed = () => [
  { id: 1, text: 'ส่งรายงานให้อาจารย์', done: false, pri: 'high', cat: 'work', due: offsetISO(-2), out: false },
  { id: 2, text: 'ประชุมทีมโปรเจกต์', done: false, pri: 'mid', cat: 'work', due: offsetISO(0), out: false },
  { id: 3, text: 'ซื้อของเข้าบ้าน', done: false, pri: 'mid', cat: 'shopping', due: offsetISO(3), out: false },
  { id: 4, text: 'วิ่งออกกำลังกาย 30 นาที', done: false, pri: 'low', cat: 'health', due: '', out: false },
  { id: 5, text: 'โทรหาครอบครัว', done: true, pri: 'low', cat: 'personal', due: offsetISO(-1), out: false },
]

export default function App() {
  const [todos, setTodos] = useState(seed)
  const [text, setText] = useState('')
  const [pri, setPri] = useState('mid')
  const [cat, setCat] = useState('work')
  const [due, setDue] = useState('')
  const [status, setStatus] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [query, setQuery] = useState('')

  const today = todayISO()
  const patch = (id, fn) => setTodos((ts) => ts.map((t) => (t.id === id ? fn(t) : t)))

  const add = () => {
    const v = text.trim()
    if (!v) return
    setTodos((ts) => [{ id: uid++, text: v, done: false, pri, cat, due, out: false }, ...ts])
    setText('')
    setDue('')
  }
  const toggle = (id) => patch(id, (t) => ({ ...t, done: !t.done }))
  const save = (id, v) => patch(id, (t) => ({ ...t, text: v }))
  const cyclePri = (id) => patch(id, (t) => ({ ...t, pri: PRI_ORDER[(PRI_ORDER.indexOf(t.pri) + 1) % 3] }))
  const cycleCat = (id) => patch(id, (t) => ({ ...t, cat: CAT_ORDER[(CAT_ORDER.indexOf(t.cat) + 1) % CAT_ORDER.length] }))
  const remove = (id) => {
    patch(id, (t) => ({ ...t, out: true }))
    setTimeout(() => setTodos((ts) => ts.filter((t) => t.id !== id)), 300)
  }
  const clearDone = () => {
    setTodos((ts) => ts.map((t) => (t.done ? { ...t, out: true } : t)))
    setTimeout(() => setTodos((ts) => ts.filter((t) => !t.done)), 300)
  }

  // stats & counts use all todos (not affected by filters)
  const counts = todos.reduce((m, t) => ({ ...m, [t.cat]: (m[t.cat] || 0) + 1 }), {})
  const doneCount = todos.filter((t) => t.done).length
  const overdueCount = todos.filter((t) => dueState(t, today) === 'overdue').length
  const remaining = todos.length - doneCount

  const q = query.trim().toLowerCase()
  const shown = todos.filter(
    (t) =>
      (status === 'all' || (status === 'active' ? !t.done : t.done)) &&
      (catFilter === 'all' || t.cat === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  )
  const filtering = q || status !== 'all' || catFilter !== 'all'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">รายการงานของฉัน</h1>
        <p className="mt-1 text-sm text-slate-500">ดับเบิลคลิกที่ข้อความเพื่อแก้ไข</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:grid-rows-[auto_1fr] lg:items-start">
        <CategorySidebar counts={counts} total={todos.length} active={catFilter} onSelect={setCatFilter} />

        <main className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* add form */}
          <div className="card rounded-2xl p-3 sm:p-4">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && add()}
                placeholder="เพิ่มงานใหม่..."
                aria-label="เพิ่มงานใหม่"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base placeholder:text-slate-400"
              />
              <button
                onClick={add}
                aria-label="เพิ่มงาน"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">เพิ่ม</span>
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="mr-0.5 text-slate-500">ความสำคัญ</span>
                {PRI_ORDER.map((k) => (
                  <button
                    key={k}
                    onClick={() => setPri(k)}
                    aria-pressed={pri === k}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-inset transition-colors ${
                      pri === k ? `${PRI[k].badge} font-medium` : 'text-slate-500 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${PRI[k].dot}`} />
                    {PRI[k].label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-1.5 text-slate-500">
                หมวดหมู่
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
                >
                  {CAT_ORDER.map((k) => (
                    <option key={k} value={k}>
                      {CATS[k].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-slate-500">
                กำหนดส่ง
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
                />
              </label>
            </div>
          </div>

          {/* search */}
          <div className="relative mt-4">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหางาน..."
              aria-label="ค้นหางาน"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-base placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="ล้างคำค้นหา"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* status tabs */}
          <div className="mt-4 flex gap-1 rounded-xl bg-slate-200/60 p-1" role="tablist">
            {STATUS_TABS.map(([k, l]) => (
              <button
                key={k}
                role="tab"
                aria-selected={status === k}
                onClick={() => setStatus(k)}
                className={`flex-1 rounded-lg py-2 text-sm transition-colors ${
                  status === k ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <ul className="m-0 mt-4 list-none p-0">
            {shown.map((t) => (
              <TodoItem
                key={t.id}
                t={t}
                today={today}
                onToggle={toggle}
                onDelete={remove}
                onSave={save}
                onCyclePri={cyclePri}
                onCycleCat={cycleCat}
              />
            ))}
          </ul>

          {shown.length === 0 && (
            <div className="card rounded-xl py-10 text-center text-slate-400">
              <div className="mb-2 flex justify-center">
                <ClipboardList size={28} />
              </div>
              <p className="text-sm">
                {todos.length === 0 ? 'ยังไม่มีงาน เริ่มเพิ่มงานแรกได้เลย' : filtering ? 'ไม่พบงานที่ตรงกับเงื่อนไข' : 'ไม่มีงาน'}
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              เหลืออีก <b className="text-slate-800">{remaining}</b> งาน
            </span>
            <button
              onClick={clearDone}
              disabled={doneCount === 0}
              className="rounded-lg px-3 py-1.5 text-rose-600 transition-colors hover:bg-rose-50 disabled:text-slate-300 disabled:hover:bg-transparent"
            >
              ล้างงานที่เสร็จแล้ว{doneCount > 0 ? ` (${doneCount})` : ''}
            </button>
          </div>
        </main>

        <StatsCard total={todos.length} done={doneCount} overdue={overdueCount} />
      </div>
    </div>
  )
}
