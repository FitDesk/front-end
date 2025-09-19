import { RouterProvider } from "react-router"
import { ThemeProvider } from "@/core/providers/theme-provider"
import { appRouter } from "./app.router"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastProvider, Toaster } from "@/shared/components/ui/toast"
import { ChatButton, ChatModal } from "@/features/chat"
// import { CheckAuthProvider } from "@/core/providers/auth-provider"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastProvider>
          {/* <CheckAuthProvider> */}
          <RouterProvider router={appRouter} />
          {/* </CheckAuthProvider> */}
          <Toaster />
          <ChatButton />
          <ChatModal />
          <ReactQueryDevtools initialIsOpen={false} />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
