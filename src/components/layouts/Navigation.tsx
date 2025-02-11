import React from "react"
import Link from "next/link"

const Navigation = () => {
  const menuItems = [
    { href: "/company-settings", label: "企業設定" },
    { href: "/candidates", label: "候補者一覧" },
    { href: "/interview-sheets", label: "面接シート" },
  ]

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="heading text-xl flex items-center gap-2 hover:text-primary-light transition-smooth"
          >
            <span className="bg-primary text-background px-2 py-1 rounded">H</span>
            <span>HireMate</span>
          </Link>
          <div className="flex gap-8">
            {menuItems.map((item) => (
              <div key={item.href} className="group">
                <Link
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                  <span className="nav-link-underline" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
