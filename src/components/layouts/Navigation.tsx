'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/company-settings', label: '企業設定' },
  { href: '/candidates', label: '候補者一覧' },
  { href: '/interview-sheets', label: '面接シート一覧' },
  { href: '/interview-sheets/generate', label: '面接質問生成' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-white hover:text-accent transition-colors duration-200"
              >
                HireMate
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'border-accent text-white'
                      : 'border-transparent text-gray-200 hover:border-accent-light hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
