import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal, Home } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

// Enhanced breadcrumb item interface
interface EnhancedBreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

// Hook for automatic breadcrumb generation based on current route
const useBreadcrumbs = () => {
  const location = useLocation()

  const generateBreadcrumbs = React.useCallback((): EnhancedBreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(segment => segment)

    // Route mappings for Finnish labels
    const routeLabels: Record<string, string> = {
      'calculator': 'Ruokalaskuri',
      'weight-tracker': 'Painonseuranta',
      'puppy-book': 'Pentupäiväkirja',
      'guides': 'Oppaat',
      'safety': 'Turvallisuus',
      'info': 'Tietoa',
      'login': 'Kirjaudu sisään',
      'register': 'Rekisteröidy',
      'onboarding': 'Aloitus',
      'settings': 'Asetukset',
      'profile': 'Profiili',
      'food-types': 'Ruokatyypit',
      'feeding-data': 'Ruokintadata',
      'socialization': 'Sosialisaatio',
      'puppy-guide': 'Pentuopas',
      'auth': 'Tunnistautuminen'
    }

    const breadcrumbs: EnhancedBreadcrumbItem[] = []
    let currentPath = ''

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        current: isLast
      })
    })

    return breadcrumbs
  }, [location.pathname])

  return generateBreadcrumbs()
}

// Auto breadcrumb component that generates breadcrumbs from route
const AutoBreadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    showHome?: boolean
    className?: string
  }
>(({ showHome = true, className, ...props }, ref) => {
  const breadcrumbs = useBreadcrumbs()

  if (breadcrumbs.length === 0) return null

  const items = showHome
    ? [{ label: "Etusivu", href: "/", icon: <Home className="w-4 h-4" /> }, ...breadcrumbs]
    : breadcrumbs

  return (
    <Breadcrumb ref={ref} className={cn("py-2", className)} {...props}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <div className="flex items-center space-x-1">
                {item.icon && (
                  <span className={cn(
                    "flex items-center",
                    item.current ? "text-[var(--color-primary-500)]" : "text-[var(--color-text-secondary)]"
                  )}>
                    {item.icon}
                  </span>
                )}
                {item.href && !item.current ? (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.href}
                      className="hover:text-[var(--color-primary-500)] transition-colors touch-target-small"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-[var(--color-primary-500)]">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </div>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
})
AutoBreadcrumb.displayName = "AutoBreadcrumb"

// Mobile optimized breadcrumb - shows only parent > current
const BreadcrumbMobile = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    className?: string
  }
>(({ className, ...props }, ref) => {
  const breadcrumbs = useBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  const currentItem = breadcrumbs[breadcrumbs.length - 1]
  const parentItem = breadcrumbs[breadcrumbs.length - 2]

  return (
    <Breadcrumb ref={ref} className={cn("md:hidden py-2", className)} {...props}>
      <BreadcrumbList className="text-body-sm">
        {parentItem && parentItem.href && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={parentItem.href}
                  className="flex items-center space-x-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition-colors touch-target-small"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 flex-shrink-0" />
                  <span className="truncate max-w-[120px]">{parentItem.label}</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage className="text-[var(--color-primary-500)] font-medium truncate max-w-[180px]">
            {currentItem.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
})
BreadcrumbMobile.displayName = "BreadcrumbMobile"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  AutoBreadcrumb,
  BreadcrumbMobile,
  useBreadcrumbs,
}

export type { EnhancedBreadcrumbItem }
