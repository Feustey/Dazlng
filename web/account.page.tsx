"use client";
import React, { useState } from 'react';
import { User, Bell, ChevronRight, Shield, LogOut, Settings, CircleHelp as HelpCircle } from 'lucide-react';
import Image from 'next/image';

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: () => void;
  hasToggle?: boolean;
  defaultToggle?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function AccountScreen(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // For toggle switches
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const handleLogin = (): void => {
    if (name && email) {
      setIsLoggedIn(true);
    }
  };
  
  const handleLogout = (): void => {
    setIsLoggedIn(false);
    setName('');
    setEmail('');
  };

  const accountMenu: MenuSection[] = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: <User size={22} color="#F7931A" />,
          title: 'My Profile',
          description: 'Manage your personal information',
        },
        {
          icon: <Bell size={22} color="#F7931A" />,
          title: 'Notifications',
          description: 'Configure notification preferences',
          hasToggle: true,
          defaultToggle: notifications,
        },
        {
          icon: <Shield size={22} color="#F7931A" />,
          title: 'Two-Factor Authentication',
          description: 'Additional security for your account',
          hasToggle: true,
          defaultToggle: twoFactor,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={22} color="#F7931A" />,
          title: 'Help Center',
          description: 'Frequently asked questions and guides',
        },
        {
          icon: <Settings size={22} color="#F7931A" />,
          title: 'Node Settings',
          description: 'Advanced configuration options',
        },
      ],
    },
    {
      title: 'Application',
      items: [
        {
          icon: <LogOut size={22} color="#F7931A" />,
          title: 'Logout',
          action: handleLogout,
        },
      ],
    },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen">
      <header className="p-4 bg-blue-900">
        <h1 className="text-2xl font-bold text-white mb-2">My Account</h1>
        <p className="text-base text-white opacity-90">
          Manage your profile and DazBox settings
        </p>
      </header>

      {isLoggedIn ? (
        <>
          <div className="flex items-center p-6 border-b border-gray-200">
            <div className="mr-4">
              <div className="w-16 h-16 rounded-full bg-orange-400 flex justify-center items-center">
                <User size={40} color="#FFFFFF" />
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {name}
              </div>
              <div className="text-base text-gray-500">
                {email}
              </div>
            </div>
          </div>

          <section className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              My DazBox Status
            </h2>
            
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="flex flex-row justify-between items-center mb-4">
                <span className="text-base text-gray-500">Status</span>
                <span className="flex flex-row items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-base font-semibold text-gray-900">Active</span>
                </span>
              </div>
              
              <div className="h-[1px] bg-gray-300 my-4" />
              
              <div className="flex flex-row justify-between items-center">
                <span className="text-base text-gray-500">Channels</span>
                <span className="text-base font-semibold text-gray-900">12</span>
              </div>
              
              <div className="h-[1px] bg-gray-300 my-4" />
              
              <div className="flex flex-row justify-between items-center">
                <span className="text-base text-gray-500">Earnings (30d)</span>
                <span className="text-base font-semibold text-orange-500">0.00042 BTC</span>
              </div>
            </div>
            
            <button className="flex flex-row items-center justify-center mt-4 text-base font-semibold text-orange-500">
              View Details
              <ChevronRight size={16} color="#F7931A" className="ml-2" />
            </button>
          </section>

          {accountMenu.map((section, sectionIndex) => (
            <section key={sectionIndex} className="p-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-row items-center justify-between py-3 border-b border-gray-200"
                >
                  <div className="flex flex-row items-center">
                    <div className="mr-4">{item.icon}</div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-base text-gray-500">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {item.hasToggle ? (
                    <input
                      type="checkbox"
                      checked={item.title === 'Notifications' ? notifications : twoFactor}
                      onChange={e => {
                        if (item.title === 'Notifications') {
                          setNotifications(e.target.checked);
                        } else if (item.title === 'Two-Factor Authentication') {
                          setTwoFactor(e.target.checked);
                        }
                      }}
                      className="accent-orange-500 w-5 h-5"
                    />
                  ) : item.action ? (
                    <button onClick={item.action} className="ml-2">
                      <ChevronRight size={18} color="#999999" />
                    </button>
                  ) : (
                    <ChevronRight size={18} color="#999999" />
                  )}
                </div>
              ))}
            </section>
          ))}
        </>
      ) : (
        <div className="flex-1">
          <div className="w-full h-[180px] relative">
            <Image
              src="https://images.pexels.com/photos/6781008/pexels-photo-6781008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Login background"
              fill
              className="object-cover rounded-b-lg"
              priority
            />
          </div>
          
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In</h2>
            <p className="text-base text-gray-500 mb-8">
              Create or access your DazBox account
            </p>
            
            <div className="mb-4">
              <label className="text-base font-semibold text-gray-900 mb-2 block">Name</label>
              <input
                className="bg-gray-200 rounded-lg p-3 text-gray-900 w-full"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
              />
            </div>
            
            <div className="mb-4">
              <label className="text-base font-semibold text-gray-900 mb-2 block">Email</label>
              <input
                className="bg-gray-200 rounded-lg p-3 text-gray-900 w-full"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
            </div>
            
            <button
              className={`bg-orange-500 rounded-lg p-3 w-full text-base font-semibold text-white ${!(name && email) ? 'bg-orange-300 cursor-not-allowed' : ''}`}
              onClick={handleLogin}
              disabled={!(name && email)}
            >
              Sign In
            </button>
            
            <p className="text-base text-gray-500 text-center mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}
    </div>
  );
}