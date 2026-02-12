import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Private Knowledge Q&A',
    description: 'Upload your documents and ask questions securely.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Toaster position="top-center" reverseOrder={false} />
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white opacity-70"></div>
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    )
}
