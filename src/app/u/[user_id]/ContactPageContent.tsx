import { OpenInAppButton } from "@/components/OpenInAppButton";
import { SupportForm } from "@/components/SupportForm";
import { env } from "@/lib/env";

export function ContactPageContent() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6 sm:py-10">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Official Contact Page
          </h1>
          <p className="mt-3 text-[var(--muted-foreground)]">
            This is my official contact and support page.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            I work in cybersecurity in the United States, focusing on protecting
            systems, preventing fraud, and improving digital security for users
            and businesses.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            I have experience identifying vulnerabilities, monitoring threats,
            and supporting secure online communication.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            My goal is to help make digital platforms safer and more reliable.
          </p>
        </section>

        <section className="mb-10">
          <OpenInAppButton />
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            For the fastest and most secure communication, please use the app.
          </p>
        </section>

        {(env.whatsappUrl || env.telegramUrl) && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold">Other Contact Options</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            These options are provided for convenience. Messages sent through the
            app are prioritized.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {env.whatsappUrl ? (
              <li>
                <a
                  href={env.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]/50 hover:bg-[var(--muted)]/50"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
            {env.telegramUrl ? (
              <li>
                <a
                  href={env.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]/50 hover:bg-[var(--muted)]/50"
                >
                  Telegram
                </a>
              </li>
            ) : null}
          </ul>
        </section>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold">Support</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            If you have a question or need assistance, you can access support
            below.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            <li>
              <a
                href="#faq"
                className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]/50 hover:bg-[var(--muted)]/50"
              >
                View FAQ
              </a>
            </li>
            <li>
              <a
                href="#support-form"
                className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]/50 hover:bg-[var(--muted)]/50"
              >
                Submit a support request
              </a>
            </li>
          </ul>
        </section>

        <section id="support-form" className="mb-12 scroll-mt-8">
          <SupportForm />
        </section>

        <footer className="border-t border-[var(--border)] pt-8">
          <p className="text-sm text-[var(--muted-foreground)]">
            This is the only official contact page. To avoid spam and impersonation, communication is handled through official channels only.
          </p>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]/80">
            © {env.appName}
          </p>
        </footer>
      </div>
    </div>
  );
}
