import { Skeleton } from "@/components/ui/Skeleton";

export default function BeritaDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <Skeleton className="h-4 w-48" />

      <div className="mt-6">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="mt-2 h-8 w-full" />
        <Skeleton className="mt-2 h-8 w-2/3" />
      </div>

      <Skeleton className="mt-6 aspect-video w-full rounded-2xl" />

      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
