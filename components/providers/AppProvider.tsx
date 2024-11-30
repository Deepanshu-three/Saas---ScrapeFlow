'use client'

import { ThemeProvider } from 'next-themes'
import React from 'react'

const AppProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider defaultTheme='system' attribute="class" enableSystem>
        {children}
    </ThemeProvider>
  )
}

export default AppProvider