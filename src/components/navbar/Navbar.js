import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <span
        onClick={() => window.location.reload()}
        className="navbar-brand mb-0 h1 cursor"
      >
        Dictionary manager
      </span>
    </nav>
  );
}
