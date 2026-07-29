export function toastRedirectUrl(
  path: string,
  message: string,
  type: "success" | "error" = "success"
): string {
  const params = new URLSearchParams({ toast: message });
  if (type === "error") {
    params.set("toastType", "error");
  }
  return `${path}?${params.toString()}`;
}
