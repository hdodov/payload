'use client'

import React from 'react'

import { useElement } from '../../providers/ElementProvider'
import './index.scss'

export const UnorderedList: React.FC = () => {
  const { attributes, children } = useElement()

  return (
    <ul className="rich-text-ul" {...attributes}>
      {children}
    </ul>
  )
}
