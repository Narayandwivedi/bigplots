import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const MobileBottomNav = () => {
  const location = useLocation()

  const navItems = [
    {
      path: '/',
      name: 'Home',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/contact',
      name: 'Sell Plot',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 7v10m5-5H7" />
        </svg>
      )
    },
    {
      path: '/account',
      name: 'Account',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg overflow-visible">
      <div className="flex justify-evenly items-end py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const isSellItem = item.path === '/contact'
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center rounded-lg relative ${
                isSellItem
                  ? 'px-3 py-1 text-cyan-700 transition-all duration-200'
                  : `py-1 px-3 transition-colors duration-200 ${
                      isActive 
                        ? 'text-cyan-500 bg-cyan-50' 
                      : 'text-gray-600 hover:text-cyan-500 hover:bg-gray-50'
                    }`
              }`}
            >
              <div className={isSellItem ? 'relative h-4 w-4' : 'relative'}>
                {isSellItem ? (
                  <span
                    className={`absolute -top-5 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white border-2 border-white shadow-[0_6px_16px_rgba(5,150,105,0.35)] flex items-center justify-center ${
                      isActive ? 'ring-2 ring-cyan-200' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                ) : (
                  item.icon
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isSellItem ? 'font-semibold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomNav
