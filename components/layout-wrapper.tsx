"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export default function LayoutWrapper({
  children,
  navbar,
  footer,
}: {
  children: ReactNode
  navbar: ReactNode
  footer: ReactNode
}) {
  const pathname = usePathname()
  const isChatPage = pathname?.startsWith("/chat")

  if (isChatPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {navbar}
      <main className="flex-1">
        {children}
      </main>
      {footer}
    </div>
  )
}
