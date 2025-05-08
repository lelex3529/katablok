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
          className='p-3 rounded-xl bg-white shadow-lg text-katalyx-primary hover:text-katalyx-primary-light transition-all duration-300 hover:shadow-xl'
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
        className={`fixed inset-y-0 left-0 w-72 bg-gradient-card backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='p-6 border-b border-gray-100'>
            <div className='flex justify-center'>
              {/* Logo with gradient background */}
              <div className='px-4 py-3 rounded-xl bg-gradient-primary text-xl font-bold font-sora text-white shadow-button'>
                Katalyx Proposals
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 pt-8 pb-4 px-6 overflow-y-auto'>
            <ul className='space-y-4'>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-primary text-white shadow-button'
                        : 'text-katalyx-neutral-gray hover:bg-white hover:shadow-card hover:text-katalyx-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className='ml-3 font-medium'>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile at bottom */}
          <div className='p-6 border-t border-gray-100'>
            <div className='flex items-center p-3 bg-white rounded-xl shadow-card'>
              <div className='shrink-0'>
                <div className='h-12 w-12 rounded-xl bg-gradient-secondary flex items-center justify-center shadow-secondary-button'>
                  <UserCircleIcon className='h-8 w-8 text-white' />
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-katalyx-text'>
                  Utilisateur
                </p>
                <button className='text-xs text-katalyx-secondary hover:text-katalyx-secondary-light flex items-center mt-1 transition-colors'>
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
          className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
