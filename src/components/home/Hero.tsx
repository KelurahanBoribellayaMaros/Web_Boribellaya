"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { heroImages } from "@/lib/home-data";

const SWIPE_THRESHOLD_RATIO = 0.15;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);

  const slideCount = heroImages.length;
  const hasMultipleSlides = slideCount > 1;

  function goTo(nextIndex: number) {
    setIndex((nextIndex + slideCount) % slideCount);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!hasMultipleSlides) return;
    if ((event.target as HTMLElement).closest("button, a")) return;
    dragStartX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setDragOffset(event.clientX - dragStartX.current);
  }

  function endDrag() {
    if (!isDragging) return;
    const width = trackRef.current?.offsetWidth ?? 1;
    if (dragOffset < -width * SWIPE_THRESHOLD_RATIO) goTo(index + 1);
    else if (dragOffset > width * SWIPE_THRESHOLD_RATIO) goTo(index - 1);
    setDragOffset(0);
    setIsDragging(false);
  }

  return (
    <section id="beranda" className="-mt-16 scroll-mt-0">
      <div
        className="relative touch-pan-y overflow-hidden select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={trackRef}
          className={`flex ${isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
          }}
        >
          {heroImages.map((image, i) => (
            <div key={i} className="relative h-[70dvh] w-full shrink-0 sm:h-dvh">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={i === 0}
                draggable={false}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-14 sm:pb-20 lg:pb-28">
          <div className="mx-auto max-w-6xl px-2 sm:px-3 lg:px-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-[#fdd85d]" />
                <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
                  Portal Resmi Pemerintah Kelurahan
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Kelurahan Boribellaya
              </h1>
              <p className="mt-4 max-w-lg text-sm text-white/80 sm:text-base">
                Selamat datang di portal resmi kami. Akses layanan publik,
                informasi terkini, dan administrasi kependudukan dengan lebih
                cepat, mudah, dan transparan.
              </p>
              <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
                <Link
                  href="#layanan"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-green-900 transition-colors hover:bg-green-50"
                >
                  <FileText className="size-4" />
                  Informasi Publik
                </Link>
                <Link
                  href="#berita"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Baca Berita
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {hasMultipleSlides && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ke foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}