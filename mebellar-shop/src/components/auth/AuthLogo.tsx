import Link from "next/link";

/** Auth sahifalari — M monogram + MMEBEL */
export function AuthLogo() {
  return (
    <Link href="/" className="auth-logo mx-auto mb-3 inline-flex" aria-label="MMEBEL — bosh sahifa">
      <span className="auth-logo-inner">
        <span className="auth-logo-m" aria-hidden>
          M
        </span>
        <span className="auth-logo-word">MMEBEL</span>
      </span>
    </Link>
  );
}
