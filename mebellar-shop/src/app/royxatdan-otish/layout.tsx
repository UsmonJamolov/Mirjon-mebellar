export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        footer { display: none !important; }
        nav.fixed.bottom-0 { display: none !important; }
        @media (max-width: 1023px) {
          html, body { overflow: hidden; overscroll-behavior: none; }
        }
      `}</style>
      {children}
    </>
  );
}
