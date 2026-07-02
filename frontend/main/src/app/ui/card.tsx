import { ElementType, ReactNode } from 'react'
import { cn } from "@/app/lib/utils"
import Image from 'next/image'

type CardVariant = 'elevated' | 'outlined' | 'neutral'
type CardSize = 'sm' | 'md' | 'lg' | 'xl'
type CardTone = 'primary' | 'secondary'

export interface CardProps {
  as?: 'article' | 'aside' | 'section'
  title?: string
  description?: string
  imgSrc?: string
  imgAlt?: string
  imgWidth?: number
  imgHeight?: number
  children?: ReactNode
  imageChildren?: ReactNode
  variant?: CardVariant
  size?: CardSize
  tone?: CardTone
  className?: string
  onClick?: () => void
}


const base =
  'relative isolate rounded-xl overflow-hidden bg-neutral-950/45 transition-all duration-400 ease-in-out font-mono'

const variants: Record<CardVariant, string> = {
  elevated: 'shadow-xl/40 shadow-blue-500/50 ',
  outlined: 'ring-1 ring-insert ring-blue-900/30 hover:ring-blue-900/90 ',
  neutral:'bg-neutral-950/0 hover:backdrop-blur-md'
}

const sizes: Record<CardSize, string> = {
  sm: 'min-h-[4.4rem] h-[10.2vw] min-w-[4.4rem] w-[10.2vw] p-3 gap-1',
  md: 'min-h-[8.4rem] h-[12.8vw] min-w-[6.8rem] w-[10.6vw] pt-1 pl-1 pr-1',
  lg: 'min-h-[10.4rem] h-[15.2vw] min-w-[10.4rem] w-[22.2vw] p-2 gap-4',
  xl: 'min-h-[20.4rem] h-[26.2vw]'
}

const tones: Record<CardTone, string> = {
  primary:
    'opacity-100',
  secondary:
    'opacity-85 hover:opacity-100',
}

export function Card({
  as = 'article',
  title,
  description,
  imgSrc,
  imgAlt,
  imgWidth = 1500,
  imgHeight = 1000,
  children,
  imageChildren,
  variant = 'elevated',
  size = 'md',
  tone = 'primary',
  className,
  onClick,
}: CardProps) {
  const Wrapper: ElementType = as
  const hasTitel = !!title
  const hasText =!!description && !!title
  return (
    <Wrapper
      className={cn(base, variants[variant], sizes[size], tones[tone], className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {imgSrc && (
        <figure className={cn('w-full overflow-hidden',
        size === 'xl' && 'brightness-220 contrast-109 saturate-75 ')} >
          <Image
            src={imgSrc}
            alt={imgAlt || (title ? `Image of ${title}` : 'Card image')}
            width={imgWidth}
            height={imgHeight}
            className={cn(
              'w-full h-58 object-convert',
              hasTitel && 'h-48',
              hasText && 'h-40',
              size === 'sm' && 'w-[6vw] h-[6vw] rounded-[20rem] ml-[1.2vw]',
              size === 'lg' && 'h-[9vw] ',
              size === 'xl' && ' w-[95%] lg:w-[60%] h-dvh',
              variant === 'outlined' && 'border-b border-inherit'
            )}
            priority={variant === 'elevated'}
          />
           {imageChildren && (
            <div className="absolute inset-0 flex flex-row justify-items-start bg-linear-to-r from-transparent via-black/80 to-black">
              {imageChildren}
            </div>
          )}
        </figure>
      )}
      <div className="flex w-full flex-col">
        {title && (
          <h3
            className={cn(
              'font-semibold tracking-tight flex justify-center mt-1.5',
              size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm ml-[3.5vw] mt-[1vh]' : 'text-[12px]'
            )}
          >
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-neutral-400">
            {description}
          </p>
        )}
        {children}
      </div>
    </Wrapper>
  )
}