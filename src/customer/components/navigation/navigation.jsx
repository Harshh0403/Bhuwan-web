import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../../assets/BELOGO.jpg";

const navigation = {
  categories: [
    { id: "Home", name: "Home", href: "/" },
    { id: "About", name: "About", href: "/about" },
  ],
  pages: [
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact" },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Bhuwan Enterprise Logo"
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Bhuwan Enterprise
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {navigation.categories.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {category.name}
              </Link>
            ))}
            {navigation.pages.map((page) => (
              <Link
                key={page.name}
                to={page.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {page.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <DialogPanel className="fixed top-0 left-0 w-full max-w-xs bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Bhuwan Enterprise Logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Bhuwan Enterprise
              </span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">
            {navigation.categories.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className="block text-gray-800 font-medium mb-2"
              >
                {category.name}
              </Link>
            ))}
            {navigation.pages.map((page) => (
              <Link
                key={page.name}
                to={page.href}
                className="block text-gray-800 font-medium mb-2"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
