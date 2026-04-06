import { useEffect, useState } from 'react'

export interface ToastData {
  baseCoins: number
  bonusCoins: number
  bonusReason: string
  key: number
}

interface Props {
  toast: ToastData | null
}

export default function CoinToast({ toast }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2800)
    return () => clearTimeout(t)
  }, [toast?.key])

  if (!toast || !visible) return null

  const total = toast.baseCoins + toast.bonusCoins

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 toast-enter">
      <div className="flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 shadow-2xl border border-gray-700">
        <span className="text-2xl">🪙</span>
        <div>
          <p className="text-white font-bold text-base">+{total} coins earned!</p>
          {toast.bonusReason && (
            <p className="text-amber-400 text-xs font-medium mt-0.5">
              {toast.bonusReason} +{toast.bonusCoins} bonus
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
