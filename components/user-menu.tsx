"use client"

import Link from "next/link"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import type { User } from "@clerk/nextjs/server"

interface UserMenuProps {
  isSignedIn: boolean | undefined
  user: User | null | undefined
}

export default function UserMenu({ isSignedIn, user }: UserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm font-mono rounded border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-colors">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 text-sm font-mono rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <Link
          href="/saved"
          className="px-4 py-2 text-sm font-mono rounded border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          Saved
        </Link>
        <UserButton
          appearance={{
            elements: {
              userButtonTrigger: "focus:shadow-none ring-0",
              userButtonAvatarBox: "w-10 h-10",
            },
          }}
        />
      </SignedIn>
    </div>
  )
}
