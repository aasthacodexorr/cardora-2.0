/* =========================
   Global Color Palette
   Single source of truth for all colors used throughout the application.
   
   Usage:
   - Import specific colors: import { COLORS } from '@/lib/colors'
   - Use in components: className={`bg-[${COLORS.primary.green}]`}
   - Use in Tailwind config: Add to theme.extend.colors
   
   All colors centralized here to enable easy theming and brand color updates.
========================= */

export const COLORS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY / BRAND COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  primary: {
    // Main brand green - used for CTAs, buttons, and primary actions
    green: '#00af66',
    greenLight: '#A8E5CC',    // Light variant for gradients
    greenMedium: '#85DBB8',   // Medium variant for gradients  
    greenDark: '#05B169',     // Dark variant for hover states
    green2: '#00b074',        // Secondary green variant
    green3: '#00b872',        // Tertiary green variant (SVG stroke)
    greenAlt: '#01a960',      // Alternative green shade
    greenAlpha: 'rgba(0, 175, 102, 0.65)', // With 65% opacity (#00af66a6)
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEUTRAL / GRAY COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  neutral: {
    white: '#ffffff',         // Pure white
    offWhite: '#f9f9f9',      // Header, light backgrounds
    lightGray: '#efefef',     // Hover states, light backgrounds
    lightGray2: '#f4f4f4',    // Trade-in card backgrounds
    mediumGray: '#dadada',    // Borders, separators
    mediumGray2: '#e2e2e2',   // Review borders
    mediumGray3: '#8c8c8c',   // Secondary text
    mediumDarkGray: '#5f5f5f', // Labels, badges
    darkGray: '#222222',      // Tooltips, dark text
    darkGray2: '#333333',     // Text color
    darkGray3: '#444444',     // Text gray
    darkGray4: '#666666',     // Trade-in text
    charcoal: '#121319',      // Footer background
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKGROUND COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  background: {
    primary: '#ffffff',       // Default white background
    secondary: '#f9f9f9',     // Header, secondary backgrounds
    light: '#efefef',         // Hover states
    
    // Blue variants
    heroBlue: '#c4eafa',       // Hero section background
    lightBlue: '#eaf5ff',      // Vehicle info header, light backgrounds
    prequalifyBlue: '#00573326', // Pre-qualify card backgrounds
    reviewBlue: '#eaeff5',     // Reviews section background
    
    // Green gradient backgrounds
    greenGradientStart: '#dff8ed',   // Trade-in gradient start
    greenGradientMid: '#a8ebc9',     // Trade-in gradient middle
    greenGradientEnd: '#7ee0af',     // Trade-in gradient end
    greenGradientBorder: '#b2edd1',  // Trade-in border
    greenCard: '#cdf5e3',            // Valuation card background
    greenTrack: '#DCEBE6',           // Finance slider track
    
    // Light backgrounds
    lightBeige: '#faf9f8',            // Finance calculator section
    
    // Dark backgrounds
    darkBg: 'hsl(0 0% 7%)',    // Dark mode primary background
    darkCard: 'hsl(0 0% 10%)', // Dark mode card background
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDER / DIVIDER COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  border: {
    light: '#dadada',         // Light borders, separators
    lightGray: '#cfcfcf',     // Input borders
    standard: '#ddd',         // Standard borders
    darkCharcoal: '#2a2b30',  // Dark theme borders
    system: 'hsl(214.3 31.8% 91.4%)', // System border from Tailwind
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEMANTIC COLORS (Status, Feedback, Messages)
  // ═══════════════════════════════════════════════════════════════════════════
  semantic: {
    // Success
    success: '#00af66',
    successLight: '#A8E5CC',
    
    // Error
    error: 'hsl(0 84.2% 60.2%)',
    errorDark: 'hsl(0 62.8% 30.6%)',
    
    // Info / Blue
    info: '#005dff',
    infoAlt: '#0090FF',
    
    // Warning
    warning: '#FFA500',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  text: {
    primary: '#000000',       // Main text
    secondary: '#666666',     // Secondary text
    light: '#999999',         // Light text
    white: '#ffffff',         // White text on dark backgrounds
    muted: 'hsl(215.4 16.3% 46.9%)', // Muted text
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIAL COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  special: {
    // Price display
    price: 'hsl(145 75% 40%)', // Price green
    
    // Rating / Stars
    star: 'hsl(45 100% 51%)',  // Gold/yellow for star ratings
    starAmber: '#fbbf24',      // Amber star color (Tailwind amber-400)
    
    // Avatar
    avatar: 'hsl(270 60% 50%)', // Purple for review avatars
    avatarPurple: '#512da8',   // Deep purple avatar background
    
    // Accents
    accent: '#005dff',         // Blue accent color
    accentAlt: '#0090FF',      // Alternative blue accent
    
    // Indicators
    indicatorGreen: '#1D8B68', // Slider dot indicator
    
    // Sold Overlay
    sold: '#5f5f5f',           // Sold ribbon background
    soldRed: '#dc2626',        // Sold badge red
    
    // Dark overlay
    darkOverlay: '#2f413936',  // Dark semi-transparent overlay
    
    // Special highlights
    highlightYellow: '#ffde5b', // Skip-the-dealership banner
    inputText: '#999999',       // Input placeholder text
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPONENT-SPECIFIC COLORS
  // ═══════════════════════════════════════════════════════════════════════════
  component: {
    // Header
    header: {
      background: '#fffdfdff',
      navSeparator: 'rgba(181, 180, 180, 0.35)', // #b5b4b459
      phoneText: '#00af66',
    },
    
    // Footer
    footer: {
      background: '#121319',
      text: '#ffffff',
    },
    
    // Buttons
    button: {
      primary: '#00af66',
      primaryHover: '#00af66',
      border: '#00b066',
      secondary: '#ffffff',
      secondaryBorder: 'rgba(0, 175, 102, 0.65)',
    },
    
    // Cards
    card: {
      background: '#ffffff',
      border: '#ddd',
      hover: 'rgba(0, 175, 102, 0.1)',
    },
    
    // Accordion / FAQ
    accordion: {
      header: '#00a651',
      checkmark: '#00a651',
      text: '#ffffff',
    },
    
    // Modals / Tooltips
    tooltip: {
      background: '#222222',
      text: '#ffffff',
    },
    
    // Shadows
    shadow: {
      light: 'rgba(0, 0, 0, 0.05)',
      lightAlt: 'rgba(0, 0, 0, 0.06)',
      medium: 'rgba(0, 0, 0, 0.1)',
      mediumHeavy: 'rgba(0, 0, 0, 0.12)',
      subtle: 'rgba(0, 0, 0, 0.01)',
      hover: 'rgba(0, 0, 0, 0.03)',
      buttonPress: '0 4px 0 0 #00af66',
      lightBlue: 'rgba(244, 249, 252, 1.3)',
      brandGreen: 'rgba(16, 185, 129, 0.2)', // Finance slider shadow
      brandGreenDark: 'rgba(16, 185, 129, 0.1)', // Lighter green shadow
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TAILWIND CONFIG MAPPING
  // Use these when updating tailwind.config.ts
  // ═══════════════════════════════════════════════════════════════════════════
  tailwind: {
    'brand-green': '#00af66',
    'brand-green-light': '#A8E5CC',
    'brand-green-medium': '#85DBB8',
    'brand-green-dark': '#05B169',
    'hero-bg': '#c4eafa',
    'light-blue': '#eaf5ff',
    'review-blue': '#eaeff5',
    'prequalify-blue': '#e6f4ff',
    'header-bg': '#f9f9f9',
    'footer-bg': '#121319',
    'light-gray': '#efefef',
    'border-gray': '#dadada',
    'dark-gray': '#222222',
    'sold-overlay': '#5f5f5f',
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// CSS VARIABLE HELPERS (for use with CSS modules or inline styles)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Generate CSS variable definitions for use in stylesheets
 * Usage: in globals.css or a CSS module
 * 
 * :root {
 *   // CSS variables auto-generated from lib/colors.ts
 *   // --color-primary-green: #00af66;
 *   // --color-primary-green-light: #A8E5CC;
 *   // ...
 * }
 */
export const generateCSSVariables = (): string => {
  const vars: string[] = [];
  
  Object.entries(COLORS).forEach(([category, colors]) => {
    if (typeof colors === 'object') {
      Object.entries(colors).forEach(([colorName, colorValue]) => {
        if (typeof colorValue === 'string') {
          const varName = `--color-${category}-${colorName}`.replace(/([A-Z])/g, '-$1').toLowerCase();
          vars.push(`${varName}: ${colorValue};`);
        }
      });
    }
  });
  
  return vars.join('\n  ');
};

/**
 * Create a color alias map for common use cases
 * Helpful for finding the right color when you know its purpose
 */
export const colorAliases = {
  // Primary actions
  'cta-primary': COLORS.primary.green,
  'cta-primary-hover': COLORS.primary.greenDark,
  
  // Buttons
  'button-success': COLORS.primary.green,
  'button-secondary': COLORS.neutral.white,
  'button-secondary-border': COLORS.primary.greenAlpha,
  'button-disabled': 'rgba(0, 0, 0, 0.1)',
  
  // Links
  'link-text': COLORS.primary.green,
  'link-hover': COLORS.primary.greenDark,
  
  // Text
  'text-primary': COLORS.text.primary,
  'text-secondary': COLORS.text.secondary,
  'text-muted': COLORS.text.muted,
  
  // Backgrounds
  'bg-light': COLORS.neutral.offWhite,
  'bg-dark': COLORS.background.darkBg,
  
  // Borders
  'border-light': COLORS.border.light,
  'border-primary': COLORS.primary.green,
  
  // Status
  'status-success': COLORS.semantic.success,
  'status-error': COLORS.semantic.error,
  'status-info': COLORS.semantic.info,
  'status-warning': COLORS.semantic.warning,
};
