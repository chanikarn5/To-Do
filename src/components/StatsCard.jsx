const R = 15.9155 // circumference = 100

export default function StatsCard({ total, done, overdue }) {
  const active = total - done - overdue
  const pct = total ? Math.round((done / total) * 100) : 0
  const segs = [
    { key: 'done', label: 'เสร็จแล้ว', value: done, color: '#10b981' },
    { key: 'active', label: 'กำลังทำ', value: active, color: '#3b82f6' },
    { key: 'overdue', label: 'เลยกำหนด', value: overdue, color: '#ef4444' },
  ]
  let acc = 0

  return (
    <section aria-label="สถิติ" className="card rounded-2xl p-4 lg:col-start-1 lg:row-start-2">
      <h2 className="text-sm font-semibold text-slate-900">สถิติ</h2>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full" role="img" aria-label={`เสร็จแล้ว ${pct}%`}>
            <circle cx="18" cy="18" r={R} fill="none" stroke="#f1f5f9" strokeWidth="4" />
            {total > 0 &&
              segs.map((s) => {
                const len = (s.value / total) * 100
                const el = (
                  <circle
                    key={s.key}
                    cx="18"
                    cy="18"
                    r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="4"
                    strokeDasharray={`${len} ${100 - len}`}
                    strokeDashoffset={25 - acc}
                    style={{ transition: 'stroke-dasharray .4s ease, stroke-dashoffset .4s ease' }}
                  />
                )
                acc += len
                return el
              })}
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-lg font-bold tabular-nums text-slate-900">{pct}%</span>
          </div>
        </div>
        <ul className="m-0 min-w-0 flex-1 list-none space-y-1.5 p-0 text-sm">
          {segs.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 text-slate-600">{s.label}</span>
              <span className="font-medium tabular-nums text-slate-900">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
        งานทั้งหมด <b className="text-slate-800">{total}</b> รายการ
      </p>
    </section>
  )
}
