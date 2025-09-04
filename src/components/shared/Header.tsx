"use client";

import { useState } from "react";
import { Drawer, Button } from "antd";
import Link from "next/link";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { usePathname } from "next/navigation";

const Header = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create-event", label: "Create Event" },
    { href: "/my-events", label: "My Events" },
  ];

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 h-12 w-full bg-white shadow">
      <div className="flex items-center h-full">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="Logo"
            height={32}
            width={100}
            className="h-8 w-24"
          />
        </Link>
      </div>
      <nav className="hidden md:flex gap-8 h-full items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors font-medium px-2 py-1 rounded ${
              pathname === link.href
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="md:hidden flex items-center">
        <Button
          type="text"
          icon={<IoMdMenu size={25} />}
          onClick={() => setOpen(true)}
        />
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
        >
          <nav className="flex flex-col gap-4 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors font-medium px-2 py-1 rounded ${
                  pathname === link.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Drawer>
      </div>
    </header>
  );
};

export default Header;
