import Image from "next/image";
import { BadgeCheck, Calendar, Mail, User } from "lucide-react";
import type { Leader } from "@/types/profile";

export function LeadershipCard({
  name,
  position,
  nip,
  photo,
  bio,
  email,
  term,
}: Leader) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative shrink-0">
          <div className="size-24 overflow-hidden rounded-full ring-4 ring-blue-100 sm:size-28">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                width={112}
                height={112}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-[#003459]/50">
                <User className="size-10" />
              </div>
            )}
          </div>
          <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-white text-[#003459] ring-2 ring-white">
            <BadgeCheck className="size-6" />
          </span>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-6">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#003459]">
            {position}
          </span>
          <h3 className="mt-3 text-xl font-bold text-gray-900">{name}</h3>
          <p className="mt-0.5 text-sm text-gray-400">{nip}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">{bio}</p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <span className="flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
              <Mail className="size-4 shrink-0 text-[#003459]" />
              {email}
            </span>
            <span className="flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
              <Calendar className="size-4 shrink-0 text-[#003459]" />
              {term}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
