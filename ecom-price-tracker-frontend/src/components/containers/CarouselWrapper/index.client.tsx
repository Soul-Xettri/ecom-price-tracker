'use client'

import { Carousel } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'

export function CarouselWrapper({
  children,
  autoplaySpeed = 5000,
  className,
}: {
  children: React.ReactNode
  autoplaySpeed?: number
  className?: string
}) {
  return (
    <Carousel
      className={cn('w-full', className)}
      plugins={[
        Autoplay({
          delay: autoplaySpeed,
        }),
      ]}
    >
      {children}
    </Carousel>
  )
}
