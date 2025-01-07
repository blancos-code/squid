import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Squid Game Congo',
  description: 'Jeu de bateaux pour le Congo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}