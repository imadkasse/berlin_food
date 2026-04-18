"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRegisterStore } from "@/stores/register";
import { useRouter } from "next/navigation";

// ─── Progress Header ──────────────────────────────────────────────────────────

function OnboardingHeader({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <header className="fixed top-12 start-0 w-full flex justify-center pointer-events-none z-50">
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-black italic text-on-surface tracking-tighter">
          Berlin Food
        </span>

        {/* Step dots */}
        <div className="flex items-center gap-2 mt-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="h-1 w-8 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i < currentStep
                    ? "var(--color-primary)"
                    : "var(--color-surface-container-highest)",
              }}
            />
          ))}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-2">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </header>
  );
}

// ─── Reusable Label ───────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ms-1">
      {children}
    </label>
  );
}

// ─── Reusable Text Input ──────────────────────────────────────────────────────

function TextInput({
  id,
  type = "text",
  placeholder,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`
        w-full bg-surface-container-low border-none rounded-md
        px-6 py-4 text-on-surface placeholder:text-outline
        outline-none focus:ring-2 focus:ring-primary-container
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
}

// ─── Editorial Avatar Row ─────────────────────────────────────────────────────

const EDITORIAL_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHACG752m5fwcvgqQFaBwdx6Ca-2XF1dUPJ5Ig4ZpZ5Q3BY4wDvDPTLntjtD3pbfGJ2YLfQLczd0Z8C9vaGL8RxN5q_gmRZznXaK8u9yt7nMSpuoDeLIqmeImfFtLt66S6wUfwLH9c_zrc_Pr1yXsRIhM8EbGblo9N3J3wOgmTYUfOVEJnsE4IMx1m0io5EsDJxu-m5FP3Vh0kAeZPcEiLWjKwPnFvRc4iBZyyNb_dG-Hs8S6xHGBoljEsNaU5P_3v9okYwzYkppp7",
    alt: "Artisanal plating with microgreens",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd2ivg2ijHSj8yBzcKC7TTZbrwy_gEcLP0oHoIidAKCvpOuTORXxz2qb-ih6pCXL6Ilmo-287yN08AIUIFaZsMgKSAMR4pgXHRBtRxe3SE3rfNMldCtNYI_Jxc_bQu8bgM5R4XWjmIqTAkr1Gq3xxgBlRP3LLkjJvSD8GicRBbRKhh0u3QbZkswuR9aELIwjVuv2ag_qqYcR8Yy7j_-aD5TiIlnuYUYEIvU2pqBH41gTI8FSCJKW0uO9FM3dXBFp7egquO3xg8zEOv",
    alt: "Chef arranging ingredients",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL-6KW9xoL7l1DOe7V8B6qPxln9wHUoRkwOOJOpq8vWgbBkj3SydGEtHKTVHT8uD9tSeZryQ9ETh3hkz2U9MnSeKVzDFHOSYijEQZi4-lMcJxDrOxoodntY7Un7-SqIRXiVDmINS9OQER6puJoJxJl5h599XVEfk73fFkVFVuCaOHvRi65r-nWBfBSqtihUBICKRqGnzZzYa_PtsH8fapdU8-4JNWc4fkVQVP0F-91Uq9a6yXJBQN6mSxroI4aK9-xClEDwWfdBPlM",
    alt: "Berlin restaurant interior",
  },
];

function EditorialAvatarRow() {
  return (
    <div className="mt-12 flex items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
      {/* Left line */}
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant to-transparent" />

      {/* Stacked avatars */}
      <div className="flex -space-x-4">
        {EDITORIAL_IMAGES.map((img) => (
          <div
            key={img.src}
            className="relative w-12 h-12 rounded-full border-4 border-background overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              unoptimized
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Right line */}
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OnboardingStep1Page() {
  const router = useRouter();
  const { setProfileData } = useRegisterStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: validate & navigate to step 2
    if (!form.lastName || !form.firstName || !form.phone) {
      // toast.error(`fileds error`, {
      //   description: "Plase provide all the informations",
      // });
      console.log("error");

      return;
    }
    setProfileData({
      full_name: form.firstName + "" + form.lastName,
      phone_number: form.phone,
    });
    router.push("/auth/register/contact");
  };

  return (
    <div className="bg-mesh text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container">
      {/* Fixed header */}
      <OnboardingHeader currentStep={1} totalSteps={3} />

      {/* Card */}
      <main className="w-full max-w-xl mt-24 mb-16">
        <div className="bg-surface-container-lowest rounded-lg p-10 md:p-16 shadow-[40px_0_40px_-20px_rgba(28,27,27,0.04)] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

          <section className="relative z-10">
            {/* Headline */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4 leading-tight">
                The journey to <br />
                <span className="text-primary italic">exceptional</span> dining.
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                Tell us a bit about yourself so we can curate your Berlin
                culinary experience.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <TextInput
                    id="firstName"
                    name="firstName"
                    placeholder="Lukas"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <TextInput
                    id="lastName"
                    name="lastName"
                    placeholder="Schmidt"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <div className="relative">
                  {/* Country code divider */}
                  <div className="absolute start-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pe-4 border-e border-outline-variant/30 pointer-events-none">
                    <span className="text-on-surface-variant font-medium text-sm">
                      +49
                    </span>
                  </div>
                  <TextInput
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="176 1234 5678"
                    className="ps-24"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-[11px] text-outline mt-1 ms-1 leading-tight">
                  We&apos;ll send a secure verification code to this number.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* <Link
                  href="/login"
                  className="text-on-surface-variant font-medium hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowLeft
                    className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1"
                    strokeWidth={2}
                  />
                  Back to Intro
                </Link> */}

                <button
                  type="submit"
                  className="
                    w-full md:w-auto px-10 py-4
                    bg-gradient-to-br from-primary to-primary-container
                    text-on-primary font-bold rounded-full
                    shadow-lg shadow-primary-container/20
                    flex items-center justify-center gap-3
                    transition-all duration-200
                    hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
                    active:scale-95
                  ">
                  Continue
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Editorial decoration */}
        <EditorialAvatarRow />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 text-outline text-xs tracking-wide">
        © 2024 Berlin Food · Secure Onboarding · Privacy First
      </footer>
    </div>
  );
}
