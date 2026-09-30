import { useState, useRef, useEffect } from 'react'
import { Check, Trash2, CalendarDays } from 'lucide-react'
import { PRI, CATS, DUE_STYLE, dueState, fmtDate } from '../lib.js'

export default function TodoItem({ t, today, onToggle, onDelete, onSave, onCyclePri, onCycleCat }) {
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
  const c = CATS[t.cat]
  const ds = dueState(t, today)
  const dueLabel =
    ds === 'overdue' ? `เลยกำหนด ${fmtDate(t.due)}` : ds === 'today' ? 'ครบกำหนดวันนี้' : ds === 'plain' ? `ครบ ${fmtDate(t.due)}` : ''

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
              t.done ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent hover:border-blue-500'
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
                className={`block cursor-text select-none break-words py-0.5 ${
                  t.done ? 'text-slate-400 line-through' : 'text-slate-800'
                }`}
              >
                {t.text}
              </span>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onCycleCat(t.id)}
                title="กดเพื่อเปลี่ยนหมวดหมู่"
                className={`rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${c.chip}`}
              >
                {c.label}
              </button>
              {ds !== 'none' && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${DUE_STYLE[ds]}`}>
                  <CalendarDays size={12} />
                  {dueLabel}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onCyclePri(t.id)}
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
