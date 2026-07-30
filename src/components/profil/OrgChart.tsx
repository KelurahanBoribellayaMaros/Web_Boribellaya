import type { OrgNode } from "@/types/profile";

type Variant = "green" | "blue";

function NodeBox({
  name,
  position,
  isRoot,
  variant,
}: {
  name: string;
  position: string;
  isRoot?: boolean;
  variant: Variant;
}) {
  const rootBoxClass =
    variant === "blue"
      ? "border-[#003459] bg-[#003459] text-white"
      : "border-green-700 bg-green-700 text-white";
  const rootLabelClass = variant === "blue" ? "text-[#2b9348]" : "text-green-100";
  const childLabelClass = variant === "blue" ? "text-[#2b9348]" : "text-green-700";

  return (
    <div
      className={`w-44 shrink-0 rounded-xl border px-4 py-3 text-center shadow-sm ${
        isRoot ? rootBoxClass : "border-gray-100 bg-white text-gray-900"
      }`}
    >
      <p
        className={`text-xs font-semibold tracking-wide uppercase ${
          isRoot ? rootLabelClass : childLabelClass
        }`}
      >
        {position}
      </p>
      <p className="mt-1 text-sm font-bold">{name}</p>
    </div>
  );
}

export function OrgChart({
  root,
  variant = "green",
}: {
  root: OrgNode;
  variant?: Variant;
}) {
  const children = root.children ?? [];

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max flex-col items-center px-2 py-2">
        <NodeBox name={root.name} position={root.position} isRoot variant={variant} />

        {children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-start gap-6">
              {children.map((child) => (
                <NodeBox
                  key={child.name}
                  name={child.name}
                  position={child.position}
                  variant={variant}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
