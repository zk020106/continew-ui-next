import * as React from 'react'

import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { useShallow } from 'zustand/react/shallow'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSiteOptions } from '@/hooks/use-site-options'
import type { MenuRoot } from '@/navigation/menu'
import { usePreferencesStore } from '@/stores/preferences/preferences-provider'

import { AppBreadcrumb } from './app-breadcrumb'
import { FullscreenToggle } from './fullscreen-toggle'
import { GithubHelp } from './github-help'
import { HeaderMenu } from './header-menu'
import { LockScreenButton, NotificationButton, PreferencesButton, RefreshButton, UserMenu } from './header-widgets'
import { SearchTrigger } from './search-dialog'
import { ThemeSwitcher } from './theme-switcher'

function HeaderBrand({ wide }: { wide: boolean }) {
  const { title, logo } = useSiteOptions()

  return (
    <Link
      to="/dashboard"
      aria-label={title || '返回仪表盘'}
      className={cn('flex shrink-0 items-center gap-2 font-semibold', wide && 'md:w-[calc(var(--app-sidebar-width)-1rem)]')}
    >
      <img src={logo} alt="" className="size-8 shrink-0 object-contain" />
      <span className="hidden truncate sm:inline">{title}</span>
    </Link>
  )
}

export interface AdminHeaderProps {
  /** Full-width header layouts show the brand in the header instead of the sidebar. */
  showBrand: boolean
  /** Brand box as wide as the sidebar under it (header-sidebar layout). */
  brandAlignsSidebar: boolean
  showSidebarToggle: boolean
  menu?: {
    roots: readonly MenuRoot[]
    mode: 'navigate' | 'select'
    selectedId?: string
    onSelect?: (root: MenuRoot) => void
  }
  showPreferences: boolean
  /** Scroll-driven hide for the `auto` and `auto-scroll` navbar styles. */
  hidden: boolean
}

export const AdminHeader = React.memo(function AdminHeader({
  showBrand,
  brandAlignsSidebar,
  showSidebarToggle,
  menu,
  showPreferences,
  hidden
}: AdminHeaderProps) {
  const w = usePreferencesStore(
    useShallow(state => ({
      search: state.values.widget_global_search,
      notification: state.values.widget_notification,
      refresh: state.values.widget_refresh,
      fullscreen: state.values.widget_fullscreen,
      theme: state.values.widget_theme_toggle,
      lock: state.values.widget_lock_screen,
      breadcrumb: state.values.breadcrumb_enable,
      menuAlign: state.values.header_menu_align,
      navbarStyle: state.values.navbar_style
    }))
  )
  const showBreadcrumb = w.breadcrumb && !menu

  return (
    <header
      data-slot="app-header"
      data-hidden={hidden || undefined}
      className={cn(
        'z-40 flex h-(--app-header-height) shrink-0 items-center gap-2 border-b bg-background px-3 transition-transform duration-200 lg:px-4',
        w.navbarStyle !== 'scroll' && 'sticky top-0 bg-background/80 backdrop-blur-md',
        hidden && '-translate-y-full'
      )}
    >
      <div className="flex shrink-0 items-center gap-1 lg:gap-2">
        {showBrand && <HeaderBrand wide={brandAlignsSidebar} />}
        {showSidebarToggle && <SidebarTrigger className="-ml-1" />}
        {(showSidebarToggle || showBrand) && (showBreadcrumb || w.search) && (
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center" />
        )}
        {showBreadcrumb && <AppBreadcrumb className="hidden md:flex" />}
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 items-center',
          w.menuAlign === 'center' && 'justify-center',
          w.menuAlign === 'end' && 'justify-end'
        )}
      >
        {menu && <HeaderMenu {...menu} />}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {w.search && <SearchTrigger />}
        {w.refresh && <RefreshButton />}
        {w.notification && <NotificationButton />}
        {showPreferences && <PreferencesButton />}
        {w.lock && <LockScreenButton />}
        <GithubHelp />
        {w.theme && <ThemeSwitcher />}
        {w.fullscreen && <FullscreenToggle />}
        <UserMenu showPreferences={!showPreferences} />
      </div>
    </header>
  )
})
