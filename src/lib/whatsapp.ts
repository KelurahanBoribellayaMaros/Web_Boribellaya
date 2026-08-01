export function toWhatsAppHref(phone: string, message?: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  const normalized = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("62")
      ? digits
      : `62${digits}`;

  const url = `https://wa.me/${normalized}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
