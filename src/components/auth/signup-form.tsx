"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export function SignupForm() {
  const router = useRouter()
  const { signup, loginWithProvider } = useAuth()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await signup(email, name, password)
      router.replace("/projects/lp/summary")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] rounded-lg border border-[#DFE1E6] bg-white px-6 py-8 shadow-sm sm:px-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded bg-[#0052CC] text-sm font-bold text-white">
            P
          </span>
          <span className="text-lg font-semibold tracking-tight text-[#0052CC]">
            Pulse
          </span>
        </div>
        <h1 className="text-base font-semibold text-[#172B4D]">
          Sign up to continue
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-[#FFE380] bg-[#FFFAE6] px-3 py-2 text-sm text-[#172B4D]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-10 rounded-md"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Full name</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="h-10 rounded-md"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="h-10 rounded-md pr-10"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Password must have at least 8 characters
            </p>
          </Field>
        </FieldGroup>

        <p className="text-xs text-muted-foreground">
          By signing up, you accept the Pulse Terms of Service and Privacy
          Policy.
        </p>

        <Button
          type="submit"
          disabled={pending}
          className="h-10 w-full rounded-md bg-[#0052CC] text-white hover:bg-[#0747A6]"
        >
          {pending ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-[#DFE1E6]" />
        Or continue with:
        <span className="h-px flex-1 bg-[#DFE1E6]" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 w-full rounded-md"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          try {
            await loginWithProvider("Google")
            router.replace("/projects/lp/summary")
          } finally {
            setPending(false)
          }
        }}
      >
        Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-[#0052CC] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
