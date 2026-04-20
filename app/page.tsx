import Image from "next/image";
import { Button } from "@/components/ui/button";
import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-pivot-secondary/50 bg-pivot-accent sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Image
            src="/pivot-logo-on-light.svg"
            alt="Pivot"
            width={103}
            height={24}
            className="h-6 w-auto"
            priority
          />
          <Button
            size="sm"
            nativeButton={false}
            render={
              <a
                href="https://www.pivotapp.ai/book-a-demo"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Book a demo
          </Button>
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
      <footer className="bg-pivot-dark border-t border-pivot-dark-border py-8 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pivot-dark-text/70">
          <p>
            Powered by{" "}
            <a
              href="https://www.pivotapp.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pivot-primary hover:text-pivot-dark-text underline"
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
