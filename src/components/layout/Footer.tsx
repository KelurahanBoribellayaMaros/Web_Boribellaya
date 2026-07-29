const footerLinks = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat & Ketentuan", href: "#" },
  { label: "Peta Situs", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#293241] px-2 py-10 text-center sm:px-3 lg:px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg font-bold text-white">Kelurahan Boribellaya</h2>
        <p className="mt-2 text-sm text-blue-200">
          © {year} Kelurahan Boribellaya. Melayani dengan Sepenuh Hati.
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-blue-200 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
