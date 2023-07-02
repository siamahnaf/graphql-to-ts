import "@/styles/globals.css"
import type { AppProps } from "next/app"

//Fonts
import { inter } from "@/Fonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}