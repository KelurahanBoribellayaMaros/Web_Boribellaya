import { Skeleton } from "@/components/ui/Skeleton";

function DocCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
    </div>
  );
}

export default function PpidLoading() {
  return (
    <div className="mx-auto max-w-5xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>

        <section>
          <Skeleton className="h-6 w-32" />
          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-44 rounded-xl" />
              <Skeleton className="h-6 w-px" />
              <Skeleton className="h-16 w-44 rounded-xl" />
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3.5 w-56" />
            </div>
            <Skeleton className="h-9 w-48 rounded-full" />
          </div>
          <div className="mx-auto mt-4 max-w-2xl">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Skeleton className="h-9 w-16 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <DocCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
