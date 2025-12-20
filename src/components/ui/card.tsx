import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <div className={`bg-gray-100 p-4 rounded-xl shadow ${className}`}>{children}</div>
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
