import { User } from "lucide-react";
import type { OrgNode } from "@/types/profile";

function NodeBox({
  name,
  position,
  nip,
  photo,
  isRoot,
}: {
  name: string;
  position: string;
  nip?: string;
  photo?: string;
  isRoot?: boolean;
}) {
  return (
    <div
      className={`w-60 shrink-0 rounded-2xl border px-5 py-5 text-center shadow-sm ${
        isRoot
          ? "border-[#003459] bg-[#003459] text-white"
          : "border-gray-100 bg-white text-gray-900"
      }`}
    >
      <div
        className={`mx-auto flex size-16 items-center justify-center overflow-hidden rounded-full ring-2 ${
          isRoot ? "bg-white/20 ring-white/40" : "bg-blue-50 ring-blue-100"
        }`}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="size-full object-cover" />
        ) : (
          <User className={`size-7 ${isRoot ? "text-white/70" : "text-[#003459]/40"}`} />
        )}
      </div>
      <p
        className={`mt-3 text-xs font-semibold tracking-wide uppercase ${
          isRoot ? "text-[#fdd85d]" : "text-[#003459]"
        }`}
      >
        {position}
      </p>
      <p className="mt-1 text-sm font-bold">{name}</p>
      {nip && (
        <p className={`mt-0.5 text-xs ${isRoot ? "text-white/70" : "text-gray-400"}`}>
          NIP. {nip}
        </p>
      )}
    </div>
  );
}

// Genuinely recursive — a node's children render in a row beneath it, and
// each of those children can have their own children beneath them, and so
// on. No fixed number of tiers, so admin can nest positions as deep as the
// real structure needs without any code changes.
function Tree({ node, isRoot }: { node: OrgNode; isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <NodeBox
        name={node.name}
        position={node.position}
        nip={node.nip}
        photo={node.photo}
        isRoot={isRoot}
      />

      {node.children.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-start gap-6">
            {node.children.map((child) => (
              <Tree key={child.id} node={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrgChart({ root }: { root: OrgNode }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max px-2 py-2">
        <Tree node={root} isRoot />
      </div>
    </div>
  );
}
