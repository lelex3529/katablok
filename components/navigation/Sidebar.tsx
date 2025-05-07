'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  CubeIcon,
  CogIcon,
  UserCircleIcon,
  Bars4Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      name: 'Tableau de bord',
      icon: <HomeIcon className='h-5 w-5' />,
      path: '/',
    },
    {
      name: 'Propositions',
      icon: <DocumentTextIcon className='h-5 w-5' />,
      path: '/propositions',
    },
    { name: 'Blocks', icon: <CubeIcon className='h-5 w-5' />, path: '/blocks' },
    {
      name: 'Paramètres',
      icon: <CogIcon className='h-5 w-5' />,
      path: '/parametres',
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className='fixed top-4 left-4 z-50 md:hidden'>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-md bg-white shadow-md text-katalyx-dark hover:text-katalyx-primary'
          aria-controls='sidebar-menu'
          aria-expanded={isMobileMenuOpen}
        >
          <span className='sr-only'>
            {isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          </span>
          {isMobileMenuOpen ? (
            <XMarkIcon className='h-6 w-6' />
          ) : (
            <Bars4Icon className='h-6 w-6' />
          )}
        </button>
      </div>

      {/* Sidebar for desktop and mobile */}
      <div
        id='sidebar-menu'
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='p-4 border-b'>
            <div className='flex justify-center'>
              {/* Placeholder for logo, replace with your actual logo */}
              <div className='text-xl font-bold font-sora text-katalyx-primary'>
                Katalyx Proposals
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 pt-6 pb-4 px-4 overflow-y-auto'>
            <ul className='space-y-2'>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-katalyx-primary text-white'
                        : 'text-katalyx-neutral-gray hover:bg-katalyx-off-white hover:text-katalyx-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className='ml-3'>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile at bottom */}
          <div className='p-4 border-t'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='h-10 w-10 rounded-full bg-katalyx-off-white flex items-center justify-center'>
                  <UserCircleIcon className='h-8 w-8 text-katalyx-neutral-gray' />
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-katalyx-text'>
                  Utilisateur
                </p>
                <button className='text-xs text-katalyx-neutral-gray hover:text-katalyx-primary flex items-center mt-1'>
                  <ArrowRightStartOnRectangleIcon className='h-3 w-3 mr-1' />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
