import { cn } from "@/app/lib/utils"
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

type NavButtonVariant = 'left' | 'right'
type NavButtonSize = 'sm' | 'md'
type NavButtonTone = 'primary' | 'secondary'

export interface NavButtonProps {
  variant: NavButtonVariant
  size?: NavButtonSize
  tone?: NavButtonTone
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const base = 'inline-flex items-center justify-center rounded-[5rem] transition-allduration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-1 ring-1 ring-inset ring-blue-900/30  hover:ring-blue-800  bg-blue-950/10 text-blue-300/80 hover:bg-blue-950/40'

const sizes: Record<NavButtonSize, string> = {
  sm: 'p-3 gap-2 text-sm ',
  md: 'p-4 gap-3 text-base',
}

const tones: Record<NavButtonTone, string> = {
  primary:
    'opacity-100 hover:opacity-90',
  secondary:
    'opacity-70 hover:opacity-100',
}

const iconSizes: Record<NavButtonSize, number> = {
  sm: 16,
  md: 20,
}

export function NavButton({
  variant,
  size = 'sm',
  tone = 'primary',
  className,
  onClick,
  disabled = false,
}: NavButtonProps) {
  const Icon = variant === 'left' ? ChevronLeft : ChevronRight
  const iconSize = iconSizes[size]

  return (
    <button
      className={cn(base, sizes[size], tones[tone], className)} 
      onClick={onClick}
      disabled={disabled}
      aria-label={variant === 'left' ? 'Previous' : 'Next'}
    >
      <Icon size={iconSize} />
    </button>
  )
}