interface AuthButtonProps {
  loading: boolean
  label: string
  type?: 'submit' | 'button'
  onClick?: () => void
}

export function AuthButton({
  loading,
  label,
  type = 'submit',
  onClick,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 px-4 bg-[#01696f] hover:bg-[#0c4e54] active:bg-[#0f3638]
        text-white text-sm font-medium rounded-lg
        transition-colors duration-150
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2"
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {label}
    </button>
  )
}
