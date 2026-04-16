"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, UtensilsCrossed, Loader2 } from "lucide-react";
import { login, signupWithGoogle } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import { getProfile } from "@/api/profiles";
import { createClient } from "@/utils/supabase/client";

// ─── Icons ────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <path d="M17.05 20.28c-.96.95-2.04 1.43-3.23 1.43-1.16 0-2.14-.44-3.15-1.43-1.02.99-2 1.43-3.18 1.43-1.18 0-2.26-.48-3.21-1.43C2.8 18.84 2 16.48 2 13.16c0-3.32.88-5.83 2.65-7.54C6.42 3.91 8.35 3.06 10.45 3.06c1.11 0 2.22.37 3.34 1.1 1.11-.73 2.22-1.1 3.33-1.1 2.11 0 4.04.85 5.79 2.56 1.77 1.71 2.65 4.22 2.65 7.54 0 3.32-.8 5.68-2.51 7.12zM12 3c0-1.1.4-2.04 1.19-2.81C13.98.42 14.92 0 16 0c.04 0 .08 0 .12.01-.01.04-.01.08-.01.12 0 1.04-.4 1.95-1.19 2.73C14.13 3.63 13.2 4 12.11 4c-.03 0-.07 0-.11-.01.01-.04.01-.08.01-.12z" />
    </svg>
  );
}

// ─── Small reusable pieces ────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
        <UtensilsCrossed className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-2xl font-extrabold tracking-tighter text-on-surface uppercase">
        Berlin Food
      </span>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center justify-center gap-3 h-14 rounded-full
        bg-surface-container-high hover:bg-surface-container-highest
        text-sm font-bold text-on-surface
        transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
      ">
      {icon}
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  // user state
  const { setUser } = useUserStore();
  const supbase = createClient();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await login({ email, password });

      toast.success("Login successfuly", {
        description: `welcome ${email.split("@")[0]} `,
      });
      // save user on state
      const profile = await getProfile(supbase, user.id);
      setUser(profile);
      // redirect  the user
      router.push(`/${profile?.role || "customer"}/profile`);
    } catch (err: unknown) {
      toast.error("Access denied", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      await signupWithGoogle();
      console.log('google');
      
      // Try to get the user session
      // const {
      //   data: { user },
      // } = await supbase.auth.getUser();
      // const currentUser = user;

      // if (currentUser) {
      //   // save user on state
      //   const profile = await getProfile(supbase, currentUser.id);

      //   setUser(profile);

      //   // redirect the user
      //   router.push(`/${profile?.role}/profile`);
      // } else {
      //   // For OAuth flows that redirect the page, this serves as a fallback.
      //   toast.info("Redirecting to Google...");
      // }
    } catch (err: unknown) {
      toast.error("Access denied", {
        description:
          err instanceof Error ? err.message : "Google Invalid credentials. Please try again",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <main className="min-h-screen flex overflow-hidden bg-surface text-on-surface antialiased">
      {/* ── Left: Visual Narrative ── */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        {/* Hero image */}
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuB5Q3zYLW0Uv4Hl2CHudRmJQO8CtB9njA7jkTmhcBFp72jaaTGiz04P4Gcru5bq_35MeJgsbi0HCdW63evxn9nlQFNbhOtMIr4yvTM69qS-UZLEanYR2qQEIySd-V1CiJlylepAyDaiAiTeI2OXjyaHrE3O_0AnqNP9x4_NweXHPs_XJEu2HRa71ToDj8nfoMKRzROSyk8VrOEBCfUfvW0yoxPHOnsGq-c6caQrubZJvsKIMYY8GZSlrVPs2MuyqBAa5oX0tRNkevDl)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />

        {/* Text content */}
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <span className="text-white/70 tracking-[0.2em] uppercase text-xs mb-4 block font-bold">
            The Culinary Frontier
          </span>

          <h1 className="text-white text-5xl font-extrabold tracking-tighter leading-tight max-w-md">
            Curating the Art of{" "}
            <span className="text-primary-container">Berlin Dining</span>.
          </h1>

          {/* Slide indicator dots */}
          <div className="mt-8 flex gap-4 items-center">
            <div className="h-1 w-12 bg-primary-container rounded-full" />
            <div className="h-1 w-4 bg-white/30 rounded-full" />
            <div className="h-1 w-4 bg-white/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Right: Interaction Canvas ── */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface">
        <div className="w-full max-w-[440px] space-y-10">
          {/* Branding */}
          <div className="space-y-4">
            <Logo />
            <div className="pt-4">
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
                Welcome Back, Alchemist
              </h2>
              <p className="text-secondary mt-2 text-lg">
                Enter your details to rediscover the city&apos;s finest.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold tracking-wide text-on-surface-variant ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="
                  w-full h-14 px-5 rounded-lg
                  bg-surface-container-low border-none outline-none
                  ring-1 ring-outline-variant/30
                  focus:ring-2 focus:ring-primary-container
                  placeholder:text-outline/50
                  transition-all duration-200
                "
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold tracking-wide text-on-surface-variant">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-bold text-primary hover:text-primary-container transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="
                    w-full h-14 px-5 pr-14 rounded-lg
                    bg-surface-container-low border-none outline-none
                    ring-1 ring-outline-variant/30
                    focus:ring-2 focus:ring-primary-container
                    placeholder:text-outline/50
                    transition-all duration-200
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    text-outline hover:text-on-surface
                    transition-colors duration-200
                  ">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full h-14 rounded-full flex gap-2 items-center justify-center
                bg-gradient-to-br from-primary to-primary-container
                text-on-primary font-bold text-lg
                shadow-lg transition-all duration-200
                hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
                active:scale-[0.98]
                ${isLoading ? "opacity-70 pointer-events-none" : ""}
              `}>
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant/30" />
            <span className="flex-shrink mx-4 text-xs font-bold text-outline uppercase tracking-widest">
              Or continue with
            </span>
            <div className="flex-grow border-t border-outline-variant/30" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={<GoogleIcon />}
              label={
                isLoadingGoogle
                  ? `${(<Loader2 className="animate-spin" />)}`
                  : `Google`
              }
              onClick={handleGoogleLogin}
            />
            <SocialButton icon={<AppleIcon />} label="Apple" />
          </div>

          {/* Footer CTA */}
          <p className="text-center text-secondary text-sm">
            New to the craft?{" "}
            <Link
              href="/auth/register"
              className="text-primary-container font-extrabold hover:underline ml-1">
              Create an Account
            </Link>
          </p>
        </div>
      </section>

      {/* ── Decorative background blobs ── */}
      <div className="fixed top-0 right-0 w-[50vw] h-[512px] bg-primary-container/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-[50vw] w-[30vw] h-[307px] bg-primary/5 blur-[100px] -z-10 rounded-full pointer-events-none" />
    </main>
  );
}
