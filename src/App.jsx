import { useState, useRef, useEffect } from 'react'
import { Plus, Check, Trash2, ClipboardList } from 'lucide-react'

const PRI = {
  low: { label: 'ต่ำ', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500', bar: 'bg-emerald-400' },
  mid: { label: 'กลาง', badge: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500', bar: 'bg-amber-400' },
  high: { label: 'สูง', badge: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-500', bar: 'bg-rose-400' },
}
const ORDER = ['low', 'mid', 'high']
const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ยังไม่เสร็จ'],
  ['done', 'เสร็จแล้ว'],
]

let uid = 4
const seed = [
  { id: 1, text: 'ส่งรายงานให้อาจารย์', done: false, pri: 'high', out: false },
  { id: 2, text: 'ซื้อของเข้าบ้าน', done: false, pri: 'mid', out: false },
  { id: 3, text: 'อ่านหนังสือหนึ่งบท', done: true, pri: 'low', out: false },
]

function TodoItem({ t, onToggle, onDelete, onSave, onCycle }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(t.text)
  const ref = useRef(null)

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      ref.current.select()
    }
  }, [editing])

  const commit = () => {
    const v = val.trim()
    if (v) onSave(t.id, v)
    else setVal(t.text)
    setEditing(false)
  }

  const p = PRI[t.pri]

  return (
    <li className={`row ${t.out ? 'out' : ''}`}>
      <div className="pb-2.5">
        <div className="card relative flex items-center gap-3 overflow-hidden rounded-xl py-2.5 pl-0 pr-2 sm:pr-3">
          <span className={`w-1 self-stretch rounded-r ${p.bar}`} />
          <button
            onClick={() => onToggle(t.id)}
            aria-pressed={t.done}
            aria-label={t.done ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
              t.done
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 text-transparent hover:border-blue-500'
            }`}
          >
            <Check size={14} strokeWidth={3} />
          </button>

          <div className="min-w-0 flex-1">
            {editing ? (
              <input
                ref={ref}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit()
                  if (e.key === 'Escape') {
                    setVal(t.text)
                    setEditing(false)
                  }
                }}
                className="w-full rounded-md border border-blue-300 bg-white px-2 py-1 text-base"
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setVal(t.text)
                  setEditing(true)
                }}
                title="ดับเบิลคลิกเพื่อแก้ไข"
                className={`block cursor-text select-none break-words py-1 ${
                  t.done ? 'text-slate-400 line-through' : 'text-slate-800'
                }`}
              >
                {t.text}
              </span>
            )}
          </div>

          <button
            onClick={() => onCycle(t.id)}
            title="กดเพื่อเปลี่ยนความสำคัญ"
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${p.badge}`}
          >
            {p.label}
          </button>

          <button
            onClick={() => onDelete(t.id)}
            aria-label="ลบงาน"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  )
}

export default function App() {
  const [todos, setTodos] = useState(seed)
  const [text, setText] = useState('')
  const [pri, setPri] = useState('mid')
  const [filter, setFilter] = useState('all')

  const add = () => {
    const v = text.trim()
    if (!v) return
    setTodos((ts) => [{ id: uid++, text: v, done: false, pri, out: false }, ...ts])
    setText('')
  }
  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const save = (id, v) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, text: v } : t)))
  const cycle = (id) =>
    setTodos((ts) =>
      ts.map((t) => (t.id === id ? { ...t, pri: ORDER[(ORDER.indexOf(t.pri) + 1) % 3] } : t))
    )
  const remove = (id) => {
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, out: true } : t)))
    setTimeout(() => setTodos((ts) => ts.filter((t) => t.id !== id)), 300)
  }
  const clearDone = () => {
    setTodos((ts) => ts.map((t) => (t.done ? { ...t, out: true } : t)))
    setTimeout(() => setTodos((ts) => ts.filter((t) => !t.done)), 300)
  }

  const remaining = todos.filter((t) => !t.done).length
  const doneCount = todos.length - remaining
  const shown = todos.filter((t) => filter === 'all' || (filter === 'active' ? !t.done : t.done))

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">รายการงานของฉัน</h1>
      <p className="mt-1 text-sm text-slate-500">ดับเบิลคลิกที่ข้อความเพื่อแก้ไข</p>

      <div className="card mt-6 rounded-2xl p-3 sm:p-4">
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
        <div className="mt-3 flex items-center gap-2">
          <span className="mr-1 text-sm text-slate-500">ความสำคัญ</span>
          {ORDER.map((k) => (
            <button
              key={k}
              onClick={() => setPri(k)}
              aria-pressed={pri === k}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ring-1 ring-inset transition-colors ${
                pri === k ? `${PRI[k].badge} font-medium` : 'text-slate-500 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${PRI[k].dot}`} />
              {PRI[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-1 rounded-xl bg-slate-200/60 p-1" role="tablist">
        {FILTERS.map(([k, l]) => (
          <button
            key={k}
            role="tab"
            aria-selected={filter === k}
            onClick={() => setFilter(k)}
            className={`flex-1 rounded-lg py-2 text-sm transition-colors ${
              filter === k ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <ul className="m-0 mt-4 list-none p-0">
        {shown.map((t) => (
          <TodoItem key={t.id} t={t} onToggle={toggle} onDelete={remove} onSave={save} onCycle={cycle} />
        ))}
      </ul>

      {shown.length === 0 && (
        <div className="card rounded-xl py-10 text-center text-slate-400">
          <div className="mb-2 flex justify-center">
            <ClipboardList size={28} />
          </div>
          <p className="text-sm">{todos.length === 0 ? 'ยังไม่มีงาน เริ่มเพิ่มงานแรกได้เลย' : 'ไม่มีงานในหมวดนี้'}</p>
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
  )
}
