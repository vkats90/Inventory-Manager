import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="relative mx-aut flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}

export default Card
