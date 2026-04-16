import Image from "next/image";
import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-pivot-text/5 bg-white sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Image
            src="/pivot-logo.svg"
            alt="Pivot"
            width={90}
            height={28}
            priority
          />
          <a
            href="https://www.pivotapp.ai/request-a-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-pivot-text/70 hover:text-pivot-text transition-colors"
          >
            Book a demo →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-pivot-dark text-pivot-dark-text py-12 sm:py-16 no-print">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-pivot-primary/70 mb-3">
            Spend management business value assessment
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            How much could you save{" "}
            <span className="text-pivot-primary">with Pivot?</span>
          </h1>
          <p className="mt-4 text-base text-pivot-dark-text/60 max-w-xl mx-auto">
            Enter your organization&apos;s procurement metrics to see projected
            savings across Procure-to-Pay, Sourcing, and Expense Management.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="border-t border-pivot-text/5 py-6 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pivot-text/40">
          <p>
            Powered by{" "}
            <a
              href="https://www.pivotapp.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pivot-text/60 hover:text-pivot-text underline"
            >
              Pivot
            </a>{" "}
            &middot; Full-Suite Source-to-Pay Platform
          </p>
          <p>
            Benchmarks: Aberdeen, Hackett Group, Ardent Partners, ACFE, Deloitte
          </p>
        </div>
      </footer>
    </div>
  );
}
