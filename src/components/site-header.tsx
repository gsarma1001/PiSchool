"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link aria-label="The Pi School home" className="brand" href="/">
            <span aria-hidden="true" className="brand-mark">
              π
            </span>
            <span className="brand-name">
              <span>The Pi School</span>
              <span className="brand-tagline">A place to grow through math</span>
            </span>
          </Link>
          <button
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="menu-toggle"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
          <nav
            aria-label="Main navigation"
            className={`main-nav${menuOpen ? " is-open" : ""}`}
            id="main-navigation"
          >
            <Link href="/tutoring" onClick={closeMenu}>
              Tutoring
            </Link>
            <Link href="/#explore" onClick={closeMenu}>
              Explore
            </Link>
            <Link href="/daily-challenge" onClick={closeMenu}>
              Daily challenge
            </Link>
            <Link href="/events" onClick={closeMenu}>
              Events
            </Link>
            <Link href="/#testimonials" onClick={closeMenu}>
              Testimonials
            </Link>
            <Link className="nav-cta" href="/contact" onClick={closeMenu}>
              Get started <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
