
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { useSwipeable } from "react-swipeable"
import { useIsMobile } from "@/hooks/use-mobile"

import { cn } from "@/lib/utils"

// Enhanced Tabs with swipe support for mobile
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    onSwipe?: (direction: 'left' | 'right') => void
  }
>(({ className, onSwipe, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && onSwipe?.('left'),
    onSwipedRight: () => isMobile && onSwipe?.('right'),
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  })

  return (
    <TabsPrimitive.Root
      className={className}
      {...(isMobile ? swipeHandlers : {})}
      {...props}
      ref={ref}
    >
      {children}
    </TabsPrimitive.Root>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 md:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 md:px-3 py-2 md:py-1.5 text-base md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] md:min-h-auto",
      // Remove default active background to allow custom gradients to work
      "data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
