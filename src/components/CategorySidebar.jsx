import { CATS, CAT_ORDER } from '../lib.js'

export default function CategorySidebar({ counts, total, active, onSelect }) {
  const item = (key, label, count, dot) => (
    <button
      key={key}
      onClick={() => onSelect(key)}
      aria-pressed={active === key}
      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors lg:w-full ${
        active === key ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      <span className="flex-1 text-left">{label}</span>
      <span className={`rounded-full px-1.5 text-xs tabular-nums ${active === key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    </button>
  )

  return (
    <nav aria-label="หมวดหมู่" className="card rounded-2xl p-2 lg:col-start-1 lg:row-start-1">
      <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {item('all', 'ทุกหมวดหมู่', total, null)}
        {CAT_ORDER.map((k) => item(k, CATS[k].label, counts[k] || 0, CATS[k].dot))}
      </div>
    </nav>
  )
}
