'use client'

import { useState, useCallback, useEffect} from 'react'
import { NavButton } from '@/app/ui/nav-button'
import { Card, CardProps } from '@/app/ui/card'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/app/lib/utils'
import Autoplay from 'embla-carousel-autoplay'

interface InfiniteSliderProps {
  items: CardProps[]
  className?: string
  showNavigation?: boolean
  slideDivClassName?: string
  onActiveSlideChange?: (activeSlide: CardProps, index: number) => void
  loop?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  align?: 'start' | 'center' | 'end'
  dragFree?: boolean
  showActiveCard?: boolean
  slidesToShow?: number | { base: number; sm: number; md: number; lg: number; xl: number }
}

export function InfiniteSlider({ 
  items, 
  className,
  showNavigation = true,
  slideDivClassName = "",
  onActiveSlideChange ,
  loop = false,
  autoplay = false,
  autoplayDelay = 5000,
  align = 'start',
  showActiveCard = false,
  dragFree = true ,
  slidesToShow = { base: 1, sm: 2, md: 3, lg: 4, xl: 5 }
}: InfiniteSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align,
    loop,
    skipSnaps: false,
    dragFree ,
  }, autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true })] : [])

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const updateButtonState = useCallback(() => {
    if (!emblaApi) return
    
    requestAnimationFrame(() => {
      setPrevBtnEnabled(emblaApi.canScrollPrev())
      setNextBtnEnabled(emblaApi.canScrollNext())
      
      const newActiveIndex = emblaApi.selectedScrollSnap()
      setActiveIndex(newActiveIndex)
      
      if (onActiveSlideChange) {
        onActiveSlideChange(items[newActiveIndex], newActiveIndex)
      }
    })
  }, [emblaApi, items, onActiveSlideChange])

  useEffect(() => {
    if (!emblaApi) return
    
    updateButtonState()

    emblaApi.on('select', updateButtonState)
    emblaApi.on('reInit', updateButtonState)

    return () => {
      emblaApi.off('select', updateButtonState)
      emblaApi.off('reInit', updateButtonState)
    }
  }, [emblaApi, updateButtonState])

    const getResponsiveSlideClass = () => {
    if (typeof slidesToShow === 'number') {
      return `flex-[0_0_${100 / slidesToShow}%] px-2`
    }
    
    return cn(
      'flex-[0_0_100%] px-3',
      'sm:flex-[0_0_50%] sm:px-17',
      'md:flex-[0_0_35%] md:px-9',
      'lg:flex-[0_0_25%] lg:px-8',
      'xl:flex-[0_0_20%] xl:px-7'
    )
  }

  return (
    <div className={cn('relative', className)}>
        <section className="overflow-hidden" ref={emblaRef}>
            <div className= {cn('flex', slideDivClassName)}>
            {items.map((item, index) => (
                <div 
                key={index} 
                className={cn(
                  getResponsiveSlideClass(),
                  'transition-transform duration-300',
                  showActiveCard && index === activeIndex && 'scale-109'
                )}
                >
                <Card {...item} />
                </div>
            ))}
            </div>
        </section>
      
        {showNavigation && (
          <>
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <NavButton
                variant="left"
                size="sm"
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                />
            </span>
            
            <span className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <NavButton
                variant="right"
                size="sm"
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                />
            </span>
          </>
        )}
    </div>
  )
}