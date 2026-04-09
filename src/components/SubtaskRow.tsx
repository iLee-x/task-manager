import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { renameSubtask, toggleSubtask, setSubtaskPriority } from '@/store/tasksSlice'
import { applyCoins } from '@/store/gameSlice'
import { calcCoins } from '@/lib/gameData'
import { toggleToday } from '@/store/todaySlice'
import type { Subtask } from '@/types'
import type { ToastData } from './CoinToast'
import { useT } from '@/i18n/LanguageContext'

interface Props {
  taskId: string
  subtask: Subtask
  onToast?: (t: ToastData) => void
}

export default function SubtaskRow({ taskId, subtask, onToast }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const todaySubtaskIds = useSelector((s: RootState) => s.today.subtaskIds)
  const game = useSelector((s: RootState) => s.game)
  const isToday = todaySubtaskIds.includes(subtask._id)
  const { t } = useT()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(subtask.title)
  const [openMenu, setOpenMenu] = useState(false)

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== subtask.title) {
      dispatch(renameSubtask({ taskId, subtaskId: subtask._id, title: trimmed }))
    }
    setEditing(false)
  }

  return (
    <li className={`flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/40 transition-colors ${openMenu ? 'subtask-menu-open z-50 relative' : ''}`}>
      <button
        onClick={() => {
          if (!subtask.done) {
            const result = calcCoins(game)
            dispatch(applyCoins({
              baseCoins: result.baseCoins,
              bonusCoins: result.bonusCoins,
              streak: result.streak,
              todayKey: result.todayKey,
              lastStreakBonus: result.bonusCoins > 0 ? result.streak : game.lastStreakBonus,
            }))
            onToast?.({ baseCoins: result.baseCoins, bonusCoins: result.bonusCoins, bonusReason: result.bonusReason, key: Date.now() })
          }
          dispatch(toggleSubtask({ taskId, subtaskId: subtask._id }))
        }}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          subtask.done
            ? 'border-emerald-400 bg-emerald-400 text-white'
            : 'border-gray-300/70 hover:border-indigo-400 bg-white/50'
        }`}
      >
        {subtask.done && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="flex-1 min-w-0 rounded-lg border border-indigo-300/50 bg-indigo-50/60 px-2 py-0.5 text-sm outline-none ring-1 ring-indigo-100"
        />
      ) : (
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span
            onClick={() => !subtask.done && setEditing(true)}
            className={`truncate text-sm select-none transition-colors ${
              subtask.done ? 'text-gray-300 line-through' : 'text-gray-600 cursor-pointer hover:text-indigo-600'
            }`}
          >
            {subtask.title}
          </span>

          {/* Badges */}
          <div className="flex items-center gap-1.5 shrink-0">
            {subtask.priority === 'high' && <span className="flex items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 border border-red-200/50">{t.subtaskRow.high}</span>}
            {subtask.priority === 'medium' && <span className="flex items-center rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 border border-orange-200/50">{t.subtaskRow.med}</span>}
            {subtask.priority === 'low' && <span className="flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200/50">{t.subtaskRow.low}</span>}
            {isToday && (
              <span className="flex items-center justify-center text-amber-500" title={t.subtaskRow.todaysFocus}>
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Subtask Menu Toggle */}
      <div className="relative">
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100/50 hover:text-gray-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        {openMenu && (
          <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40 p-1 flex flex-col">
            <div className="px-2 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">{t.subtaskRow.priority}</div>
            <button
              onClick={() => { dispatch(setSubtaskPriority({ taskId, subtaskId: subtask._id, priority: 'high' })); setOpenMenu(false); }}
              className={`text-left px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${subtask.priority === 'high' ? 'bg-red-50 text-red-600' : 'text-gray-600'}`}
            >{t.subtaskRow.high}</button>
            <button
              onClick={() => { dispatch(setSubtaskPriority({ taskId, subtaskId: subtask._id, priority: 'medium' })); setOpenMenu(false); }}
              className={`text-left px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors ${subtask.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'text-gray-600'}`}
            >{t.subtaskRow.medium}</button>
            <button
              onClick={() => { dispatch(setSubtaskPriority({ taskId, subtaskId: subtask._id, priority: 'low' })); setOpenMenu(false); }}
              className={`text-left px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors ${subtask.priority === 'low' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >{t.subtaskRow.low}</button>
            <button
              onClick={() => { dispatch(setSubtaskPriority({ taskId, subtaskId: subtask._id, priority: undefined })); setOpenMenu(false); }}
              className="text-left px-2 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >{t.subtaskRow.clearPriority}</button>

            <div className="my-1 h-px bg-gray-100 mx-1" />

            <button
              onClick={() => { dispatch(toggleToday(subtask._id)); setOpenMenu(false); }}
              className="text-left px-2 py-1.5 text-xs font-semibold rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
            >
              {isToday ? t.subtaskRow.removeFromToday : t.subtaskRow.addToToday}
            </button>

            <div className="fixed inset-0 z-[-1]" onClick={(e) => { e.stopPropagation(); setOpenMenu(false); }} />
          </div>
        )}
      </div>
    </li>
  )
}
