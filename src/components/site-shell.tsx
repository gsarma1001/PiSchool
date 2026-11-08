import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link aria-label="The Pi School home" className="footer-brand" href="/">
          <span aria-hidden="true" className="footer-mark">
            π
          </span>
          <span>The Pi School</span>
        </Link>
        <p>Thoughtful math learning, one idea at a time.</p>
        <Link className="back-to-top" href="/#home">
          Back to top <span aria-hidden="true">↑</span>
        </Link>
      </div>
    </footer>
  );
}
