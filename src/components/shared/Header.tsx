"use client";

import { useState } from "react";
import { Drawer, Button, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create-event", label: "Create Event" },
    { href: "/my-events", label: "My Events" },
  ];

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: user?.name || user?.email,
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      onClick: handleLogout,
    },
  ];

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

      <div className="flex items-center gap-4">
        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center">
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button type="text" className="flex items-center gap-2 h-10 px-3">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="text-sm font-medium">{user.name}</span>
              </Button>
            </Dropdown>
          ) : (
            <Link href="/sign-in">
              <Button type="primary" size="small">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            type="text"
            icon={<IoMdMenu size={25} />}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
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

          {/* Mobile User Section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 py-1">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full text-left justify-start"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button type="primary" block>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
