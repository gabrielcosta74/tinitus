"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">Tinni.</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-base font-medium">
            How it works
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-base font-medium">
            Science
          </Button>
          <Button size="sm" className="rounded-full px-6 text-base">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
