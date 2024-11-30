'use client'

import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const AppProvider = ({children}: {children: React.ReactNode}) => {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='system' attribute="class" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default AppProvider