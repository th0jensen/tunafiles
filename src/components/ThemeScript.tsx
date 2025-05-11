// app/components/theme-script.tsx
import React from "react";

export function ThemeScript() {
  const script = `
    (function() {
      function getThemePreference() {
        if (window.localStorage.getItem('theme')) {
          return window.localStorage.getItem('theme');
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      document.documentElement.classList.add(getThemePreference());
    })()
  `;

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
