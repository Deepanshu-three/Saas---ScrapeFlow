'use client'

import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import NextTopLoader from "nextjs-toploader"

const AppProvider = ({children}: {children: React.ReactNode}) => {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider defaultTheme='system' attribute="class" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default AppProvider