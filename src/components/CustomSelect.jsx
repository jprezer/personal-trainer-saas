import { useState, useRef, useEffect } from 'react'
import './CustomSelect.css'

export default function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find((o) => String(o.value) === String(value))
  const label = selected ? selected.label : (placeholder || 'Selecionar')

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(val) {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className={`cselect ${open ? 'cselect-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="cselect-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cselect-label">{label}</span>
        <svg
          className="cselect-chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="cselect-dropdown">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`cselect-option ${String(opt.value) === String(value) ? 'cselect-option-active' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {String(opt.value) === String(value) && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="cselect-check">
                  <path
                    d="M2.5 7l3.5 3.5 5.5-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
