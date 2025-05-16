import localFont from '@next/font/local';

export const fontSans = localFont({
  src: './Inter.woff2',
  variable: '--font-sans',
  weight: '100 800',
});

export const fontMono = localFont({
  src: './JetBrains_Mono.woff2',
  variable: '--font-monospace',
  weight: '100 800',
});

export const satoshi = localFont({
  src: './Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  weight: '300 700',
});
