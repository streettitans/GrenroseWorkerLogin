import type { Metadata } from 'next'
import './globals.css'
import '../site/site.css'
export const metadata: Metadata = { title: 'Grenrose Worker Portal', description: 'Shared site attendance for Grenrose workers', robots: { index: false, follow: false } }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{background:'#0a0a0a',color:'#ededed'}}>{children}</body></html>
}
