import { RouterProvider } from "react-router"
import { ThemeProvider } from "./core/providers/theme-provider"
import { appRouter } from "./app.router"
import { Toaster } from "sonner"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModeToggle } from "./shared/components/mode-toggle"



const queryClient = new QueryClient()
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster position="top-right" richColors expand={true} closeButton toastOptions={{
          duration: 4000,
          classNames: {
            error: 'text-red-400 border-red-400',
            success: 'text-green-400 border-green-400',
            warning: 'text-yellow-400 border-yellow-400',
            info: 'text-blue-400 border-blue-400'
          }
        }} />
        <>
          <h1>Hello Word and Test CodeRabbit and test</h1>
          <ModeToggle />
        </>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}
