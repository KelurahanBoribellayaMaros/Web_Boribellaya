import type { SopStep } from "@/types/layanan";

export function SopSteps({ steps }: { steps: SopStep[] }) {
  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        SOP Pelayanan
      </h2>

      {/* Mobile: vertical timeline */}
      <div className="relative mt-6 space-y-8 lg:hidden">
        <div
          aria-hidden
          className="absolute top-6 bottom-6 left-6 w-px bg-green-100"
        />
        {steps.map((step) => (
          <div key={step.step} className="relative flex gap-4">
            <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 ring-4 ring-white">
              <step.icon className="size-5" />
            </span>
            <div className="pt-2.5">
              <h3 className="font-semibold text-gray-900">
                {step.step}. {step.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="mt-8 hidden grid-cols-4 gap-6 lg:grid">
        {steps.map((step, i) => (
          <div key={step.step} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute top-6 left-1/2 h-px w-full bg-green-100"
              />
            )}
            <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700 ring-4 ring-white">
              <step.icon className="size-5" />
            </span>
            <h3 className="mt-3 font-semibold text-gray-900">
              {step.step}. {step.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
