import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToastProvider } from "@/shared/components/ui/toast"

// import { ChatButton, ChatModal } from "@/modules/shared/chat"              --------chat bot desactivado
import { MotionConfig } from "motion/react"
import { ThemeProvider } from "./core/providers/theme-provider"

// import { CheckAuthProvider } from "@/core/providers/auth-provider"

const queryClient = new QueryClient()

export default function App() {
  return (

    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ToastProvider>
            {/* <CheckAuthProvider> */}
            <RouterProvider router={appRouter} />
            {/* </CheckAuthProvider> */}
            {/* Temporarily disabled for landing
            <ChatButton />
            <ChatModal />
            */}
            <ReactQueryDevtools initialIsOpen={false} />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MotionConfig>

  )
}
