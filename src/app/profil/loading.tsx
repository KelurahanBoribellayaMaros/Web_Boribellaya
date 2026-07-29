import { Skeleton } from "@/components/ui/Skeleton";

function ProfileCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProfilLoading() {
  return (
    <div className="mx-auto max-w-5xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">
        <ProfileCardSkeleton lines={3} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProfileCardSkeleton lines={2} />
          <ProfileCardSkeleton lines={3} />
        </div>

        <section>
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Skeleton className="size-24 shrink-0 rounded-full sm:size-28" />
              <div className="w-full space-y-2.5">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-56" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-3.5 w-64 max-w-full" />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-44 rounded-xl" />
              <Skeleton className="h-6 w-px" />
              <div className="flex gap-6">
                <Skeleton className="h-16 w-44 rounded-xl" />
                <Skeleton className="h-16 w-44 rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
