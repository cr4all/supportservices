import Image from "next/image";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { SupportForm } from "@/components/SupportForm";
import { env } from "@/lib/env";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero — full impact */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,var(--accent)/.15,transparent_50%)]" />
        <div className="page-pattern absolute inset-0" />
        <div className="relative mx-auto max-w-2xl px-5 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-[var(--border)] shadow-md sm:size-36">
              <Image
                src="/profile.jpg"
                alt="Profile"
                width={144}
                height={144}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                <ShieldIcon className="size-3.5" />
                Official
              </span>
              <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl font-bold tracking-tight text-[var(--foreground)] sm:mt-6 sm:text-5xl sm:leading-[1.1]">
                Support services
              </h1>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-[var(--muted-foreground)] sm:mt-4">
                This is my official contact page. Use the app or the options below to get in touch.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-5 sm:px-6">
        {/* Trust — card with accent edge */}
        <section className="-mt-6 sm:-mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg shadow-black/5 sm:p-8 dark:shadow-none">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/60" />
            <div className="pl-4 sm:pl-5">
              <h2 className="sr-only">About</h2>
              <div className="space-y-4 text-[var(--muted-foreground)]">
                <p className="leading-relaxed">
                  I work in cybersecurity in the United States, focusing on protecting
                  systems, preventing fraud, and improving digital security for users
                  and businesses.
                </p>
                <p className="leading-relaxed">
                  I have experience identifying vulnerabilities, monitoring threats,
                  and supporting secure online communication. My goal is to help make
                  digital platforms safer and more reliable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Primary CTA — full-width band */}
        <section className="mt-12 rounded-2xl bg-[var(--accent)] px-6 py-10 text-center text-[var(--accent-fg)] sm:px-8 sm:py-12">
          <p className="text-sm font-medium opacity-90">Fastest &amp; most secure</p>
          <div className="mt-3">
            <OpenInAppButton variant="inverted" />
          </div>
          <p className="mt-4 text-sm opacity-80">
            Opens the app or takes you to the store
          </p>
        </section>

        {/* Bento: Other contact + Support */}
        <section className={`mt-12 grid gap-5 ${env.whatsappUrl || env.telegramUrl ? "sm:grid-cols-2" : "grid-cols-1"}`}>
          {(env.whatsappUrl || env.telegramUrl) && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:scale-[1.01] hover:border-[var(--accent)]/30 hover:shadow-md">
              <h2 className="text-lg font-semibold">Other contact</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Convenience options. App messages are prioritized.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {env.whatsappUrl ? (
                  <a
                    href={env.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366]/10 px-4 py-2.5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                ) : null}
                {env.telegramUrl ? (
                  <a
                    href={env.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0088cc]/10 px-4 py-2.5 text-sm font-semibold text-[#0088cc] transition hover:bg-[#0088cc]/20 dark:text-[#54a9eb] dark:bg-[#0088cc]/20 dark:hover:bg-[#0088cc]/30"
                  >
                    <TelegramIcon />
                    Telegram
                  </a>
                ) : null}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:scale-[1.01] hover:border-[var(--accent)]/30 hover:shadow-md">
            <h2 className="text-lg font-semibold">Support</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Questions or need help? Use the links below.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href="#faq"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]/50 hover:bg-[var(--muted)]/50"
              >
                <FaqIcon />
                View FAQ
              </a>
              <a
                href="#support-form"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]/50 hover:bg-[var(--muted)]/50"
              >
                <SendIcon />
                Submit request
              </a>
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="support-form" className="mt-12 scroll-mt-8 pb-6">
          <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight">
            Send a message
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Optional name and contact; message is required.
          </p>
          <div className="mt-5">
            <SupportForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] py-8">
          <p className="text-sm text-[var(--muted-foreground)]">
            This is the only official contact page. Communication is through official channels only to avoid spam and impersonation.
          </p>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]/70">
            © {env.appName}
          </p>
        </footer>
      </main>
    </div>
  );
}
