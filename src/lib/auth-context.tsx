"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { users } from "@/lib/data"

const AUTH_STORAGE_KEY = "pulse-auth-v1"

export type AuthUser = {
  id: string
  name: string
  email: string
  initials: string
  color: string
}

type AuthContextValue = {
  user: AuthUser | null
  hydrated: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  loginWithProvider: (provider: string) => Promise<void>
  signup: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_PASSWORD = "password"

function emailToUser(email: string, name?: string): AuthUser {
  const known = users.find(
    (u) =>
      email.toLowerCase().includes(u.name.split(" ")[0].toLowerCase()) ||
      email.toLowerCase().startsWith(u.initials[0].toLowerCase())
  )
  if (known) {
    return {
      id: known.id,
      name: known.name,
      email,
      initials: known.initials,
      color: known.color,
    }
  }

  const derived =
    name?.trim() ||
    email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const parts = derived.split(/\s+/).filter(Boolean)
  const initials = (
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : derived.slice(0, 2)
  ).toUpperCase()

  return {
    id: `u-${Date.now()}`,
    name: derived,
    email,
    initials,
    color: "#6554C0",
  }
}

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw =
      window.localStorage.getItem(AUTH_STORAGE_KEY) ||
      window.sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setUser(loadUser())
    setHydrated(true)
  }, [])

  const persist = useCallback((next: AuthUser | null, remember = true) => {
    setUser(next)
    if (!next) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }
    if (remember) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    } else {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string, remember = true) => {
      await new Promise((r) => setTimeout(r, 400))
      const trimmed = email.trim().toLowerCase()
      if (!trimmed.includes("@")) {
        throw new Error("Enter a valid email address.")
      }
      if (password !== DEMO_PASSWORD && password.length < 6) {
        throw new Error(
          "Incorrect email address and/or password. Try again or reset your password."
        )
      }
      persist(emailToUser(trimmed), remember)
    },
    [persist]
  )

  const loginWithProvider = useCallback(
    async (_provider: string) => {
      await new Promise((r) => setTimeout(r, 350))
      const sam = users[0]
      persist(
        {
          id: sam.id,
          name: sam.name,
          email: "samlee@pulse.app",
          initials: sam.initials,
          color: sam.color,
        },
        true
      )
    },
    [persist]
  )

  const signup = useCallback(
    async (email: string, name: string, password: string) => {
      await new Promise((r) => setTimeout(r, 400))
      const trimmed = email.trim().toLowerCase()
      if (!trimmed.includes("@")) {
        throw new Error("Enter a valid email address.")
      }
      if (!name.trim()) {
        throw new Error("Enter your full name.")
      }
      if (password.length < 8) {
        throw new Error("Password must have at least 8 characters.")
      }
      persist(emailToUser(trimmed, name), true)
    },
    [persist]
  )

  const logout = useCallback(() => {
    setUser(null)
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      hydrated,
      login,
      loginWithProvider,
      signup,
      logout,
    }),
    [user, hydrated, login, loginWithProvider, signup, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export const AUTH_DEMO = {
  email: "samlee@pulse.app",
  password: DEMO_PASSWORD,
}
