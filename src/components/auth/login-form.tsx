"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, KeyRound, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AUTH_DEMO, useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const PROVIDERS = ["Google", "Microsoft", "Apple", "Slack"] as const

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/projects/lp/summary"
  const { login, loginWithProvider } = useAuth()

  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState(AUTH_DEMO.email)
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const canContinueEmail = useMemo(
    () => email.trim().includes("@"),
    [email]
  )

  async function handleContinueEmail(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!canContinueEmail) {
      setError("Enter a valid email address.")
      return
    }
    setStep("password")
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await login(email, password, remember)
      router.replace(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.")
    } finally {
      setPending(false)
    }
  }

  async function handleProvider(provider: string) {
    setError(null)
    setPending(true)
    try {
      await loginWithProvider(provider)
      router.replace(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.")
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
          Log in to continue
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-[#FFE380] bg-[#FFFAE6] px-3 py-2 text-sm text-[#172B4D]">
          {error}{" "}
          <Link href="/signup" className="text-[#0052CC] hover:underline">
            Sign up for a Pulse account
          </Link>
          .
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleContinueEmail} className="flex flex-col gap-4">
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel>
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-10 rounded-md"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-[#172B4D]">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
              />
              Remember me
            </label>
          </FieldGroup>
          <Button
            type="submit"
            disabled={!canContinueEmail || pending}
            className="h-10 w-full rounded-md bg-[#0052CC] text-white hover:bg-[#0747A6]"
          >
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel>
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="h-10 rounded-md bg-[#FAFBFC] pr-10"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStep("email")
                    setPassword("")
                    setError(null)
                  }}
                  aria-label="Edit email"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
            </Field>
            <Field>
              <FieldLabel>
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-10 rounded-md pr-10"
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
                Demo: <code className="rounded bg-muted px-1">{AUTH_DEMO.password}</code>
              </p>
            </Field>
            <label className="flex items-center gap-2 text-sm text-[#172B4D]">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
              />
              Remember me
            </label>
          </FieldGroup>
          <Button
            type="submit"
            disabled={!password || pending}
            className="h-10 w-full rounded-md bg-[#0052CC] text-white hover:bg-[#0747A6]"
          >
            {pending ? "Logging in…" : "Log in"}
          </Button>
        </form>
      )}

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-[#DFE1E6]" />
        Or login with:
        <span className="h-px flex-1 bg-[#DFE1E6]" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="mb-4 h-10 w-full rounded-md"
        disabled={pending}
        onClick={() => handleProvider("Passkey")}
      >
        <KeyRound data-icon="inline-start" />
        Passkey
      </Button>

      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-[#DFE1E6]" />
        Or continue with:
        <span className="h-px flex-1 bg-[#DFE1E6]" />
      </div>

      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className={cn("h-10 w-full justify-start rounded-md gap-3")}
            disabled={pending}
            onClick={() => handleProvider(provider)}
          >
            <ProviderMark provider={provider} />
            {provider}
          </Button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm">
        <button
          type="button"
          className="text-[#0052CC] hover:underline"
          onClick={() => setError("Use the demo password or create an account.")}
        >
          Can&apos;t log in?
        </button>
        <span className="mx-2 text-muted-foreground">·</span>
        <Link href="/signup" className="text-[#0052CC] hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 border-t border-[#DFE1E6] pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          One account for Pulse projects, boards, and more
        </p>
      </div>
    </div>
  )
}

function ProviderMark({ provider }: { provider: string }) {
  const colors: Record<string, string> = {
    Google: "#EA4335",
    Microsoft: "#00A4EF",
    Apple: "#111111",
    Slack: "#E01E5A",
  }
  return (
    <span
      className="flex size-5 items-center justify-center rounded text-[10px] font-bold text-white"
      style={{ backgroundColor: colors[provider] ?? "#0052CC" }}
    >
      {provider[0]}
    </span>
  )
}
