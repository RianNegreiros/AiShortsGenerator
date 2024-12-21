import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { BrainCircuit } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BrainCircuit />
          <span className="text-xl font-bold md:text-2xl">AI Shorts Generator</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button asChild>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
