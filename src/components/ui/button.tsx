import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
}

export function Button({ className = '', variant = 'default', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 hover:bg-gray-50',
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
