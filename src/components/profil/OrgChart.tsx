import type { OrgNode } from "@/types/profile";

function NodeBox({
  name,
  position,
  isRoot,
}: {
  name: string;
  position: string;
  isRoot?: boolean;
}) {
  return (
    <div
      className={`w-44 shrink-0 rounded-xl border px-4 py-3 text-center shadow-sm ${
        isRoot
          ? "border-green-700 bg-green-700 text-white"
          : "border-gray-100 bg-white text-gray-900"
      }`}
    >
      <p
        className={`text-xs font-semibold tracking-wide uppercase ${
          isRoot ? "text-green-100" : "text-green-700"
        }`}
      >
        {position}
      </p>
      <p className="mt-1 text-sm font-bold">{name}</p>
    </div>
  );
}

export function OrgChart({ root }: { root: OrgNode }) {
  const children = root.children ?? [];

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max flex-col items-center px-2 py-2">
        <NodeBox name={root.name} position={root.position} isRoot />

        {children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-start gap-6">
              {children.map((child) => (
                <NodeBox
                  key={child.name}
                  name={child.name}
                  position={child.position}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}