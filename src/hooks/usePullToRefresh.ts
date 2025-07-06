import { useEffect, useRef, useState } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
}

export function usePullToRefresh({ 
  onRefresh, 
  threshold = 80, 
  disabled = false 
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startTouchRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || disabled) return

    let startY = 0
    let currentY = 0
    let isPulling = false

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop > 0) return
      startY = e.touches[0].clientY
      startTouchRef.current = startY
      isPulling = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || !startTouchRef.current) return
      if (container.scrollTop > 0) {
        isPulling = false
        return
      }

      currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)
      
      if (distance > 0) {
        e.preventDefault()
        const dampedDistance = Math.min(distance * 0.5, threshold * 1.5)
        setPullDistance(dampedDistance)
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return
      
      isPulling = false
      
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      
      setPullDistance(0)
      startTouchRef.current = null
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh, threshold, disabled, pullDistance, isRefreshing])

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    shouldShowIndicator: pullDistance > 0
  }
}