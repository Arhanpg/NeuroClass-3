import type { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
}

export function AuthInput({ id, label, ...props }: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#28251d] mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full px-3 py-2.5 text-sm bg-[#f9f8f5] border border-[#d4d1ca] rounded-lg
          text-[#28251d] placeholder:text-[#bab9b4]
          focus:outline-none focus:ring-2 focus:ring-[#01696f] focus:border-transparent
          transition-all duration-150"
        {...props}
      />
    </div>
  )
}
