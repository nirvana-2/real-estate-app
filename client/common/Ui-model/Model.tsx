import { X, Home } from 'lucide-react'
import type { FC, ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose?: () => void
  title: string
  subTitle: string
  children: ReactNode  // ← this is how you pass form/content dynamically
}

export const Modal: FC<ModalProps> = ({ title, subTitle, open, onClose, children }) => {
  return (
    <>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-[#e51013]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">{title}</h2>
                    <p className="text-xs text-slate-400 font-medium">{subTitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Dynamic Content goes here */}
              <div className="p-6">
                {children}
              </div>

            </div>
          </div>
        </>
      )}
    </>
  )
}