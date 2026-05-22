/** Chat sahifasida pastki footer yashiriladi — mobil layout buzilmasin */
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`footer { display: none !important; }`}</style>
      {children}
    </>
  );
}
