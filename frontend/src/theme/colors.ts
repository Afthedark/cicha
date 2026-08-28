/**
 * CICHA Design System - Greek Aegean & Santorini Palette
 * Inspirado en la arquitectura de Santorini y las aguas del Mar Egeo y Jónico.
 */

export const THEME_COLORS = {
  // Celestes & Turquesas Egeos (Protagonistas)
  sky: {
    light: '#D4EEFC',    // Cod. AP76-1: Celeste Brisa Marina
    base: '#00AEEF',     // Cod. AP76-3: Celeste Egeo Vibrante
    hover: '#0096CE',
    turquoise: '#00A8CC',// Cod. AP74-3: Turquesa Mediterráneo
  },
  // Azules Griegos de Identidad y Títulos
  blue: {
    aegean: '#0066CC',   // Cod. AP82-4: Azul Cúpula Santorini
    base: '#0066FF',     // Cod. AP160-2: Azul Mar Jónico
    hover: '#0052CC',
    light: '#EFF6FF',
  },
  // Títulos, Headers y Fondos de Alto Contraste
  navy: {
    deep: '#0C1527',     // Noche Helénica
    dark: '#0A3D70',
    base: '#005EAF',     // Greek Aegean Blue Oficial para Títulos y Headers
    light: '#0077D6',
  },
  // Acentos Cálidos (Campanarios y Sol Griego)
  gold: {
    light: '#FEF6E4',
    base: '#F5A623',     // Terracota & Sol
    dark: '#D98200',
    amber: '#FA8C16',
  },
} as const;

export type ThemeColors = typeof THEME_COLORS;
