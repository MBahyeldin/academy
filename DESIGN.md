---
name: Modern Islamic Academy System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fd'
  surface-container-highest: '#d9e3f7'
  on-surface: '#121c2a'
  on-surface-variant: '#404944'
  inverse-surface: '#273140'
  inverse-on-surface: '#ebf1ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#2d2f2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#444542'
  on-tertiary-container: '#b2b2ae'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c7c7c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#464744'
  background: '#f9f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f7'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 42px
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 80px
---

## Brand & Style

This design system establishes a bridge between venerable tradition and contemporary academic excellence. It is designed for an Arabic-language Quranic and Islamic Studies Academy, targeting a global audience of students, scholars, and spiritual seekers. The aesthetic is **Minimalist and Professional**, utilizing generous whitespace to allow sacred texts and educational content to breathe. 

To honor the heritage of Islamic art without cluttering the UI, we employ subtle geometric patterns (Mashrabiya) at low opacities (3%–5%) as background watermarks or header accents. The emotional response is one of tranquility, trust, and focus—creating a digital environment conducive to deep study and reflection.

## Colors

The palette is rooted in the natural and architectural history of the Islamic world:
- **Primary (Deep Emerald)**: Used for main navigation, primary actions, and branding to symbolize growth and spirituality.
- **Secondary (Rich Gold)**: Reserved for highlights, calls to action, and interactive accents to draw focus without overwhelming.
- **Background (Warm Sand)**: A soft, off-white cream that reduces eye strain during long reading sessions compared to pure white.
- **Text (Slate Gray)**: High-contrast enough for accessibility while being softer on the eyes than pure black.

## Typography

The typography system is dual-natured to handle both the authority of the Quranic script and the clarity required for modern pedagogy:
- **Headlines (Noto Serif)**: Selected for its sophisticated, timeless feel that mimics traditional Arabic calligraphy's weight and elegance. 
- **Body & Labels (IBM Plex Sans)**: A neutral, systematic typeface that ensures maximum legibility across data-heavy student dashboards and long-form articles. 

**RTL Note**: All typesetting must be optimized for Right-to-Left (RTL) reading patterns, ensuring that line heights are slightly increased (1.5x to 1.7x) to accommodate the ascenders and descenders of the Arabic script.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model with native RTL support. The layout is structured around a 12-column grid for desktop and a 4-column grid for mobile devices. 

Spacing is governed by an 8pt rhythm to maintain mathematical harmony. In an Islamic Academy context, "breathing room" is a functional requirement—use `lg` and `xl` spacing tiers to separate major content blocks, such as separating a Quranic verse from its contemporary commentary. Align all logical flow from right to left, ensuring icons and progress bars are mirrored appropriately.

## Elevation & Depth

To maintain a clean and professional aesthetic, depth is communicated through **Tonal Layers** and extremely soft **Ambient Shadows**. 

- **Surface Tiers**: Use subtle shifts in background color (e.g., a slightly darker cream) to distinguish between the main canvas and sidebar containers.
- **Shadows**: Shadows should be "feather-light," using the Primary Emerald or Neutral Slate colors at 5-10% opacity rather than pure black. This prevents the "muddy" look and maintains the spiritual, light-filled atmosphere of the brand.
- **Interactivity**: Use a subtle lift (y-axis shift) on hover for cards and buttons to provide tactile feedback.

## Shapes

The shape language is approachable and modern, characterized by **Rounded** corners. 
- **Base Components**: Buttons and input fields use a `0.5rem` (8px) radius.
- **Containers**: Cards, modals, and featured sections use a `1rem` (16px) radius to create a soft, welcoming frame for educational content.
- **Avatars/Icons**: Use circular or high-radius shapes to contrast against the structured grid.

Avoid sharp 90-degree angles to differentiate the academy from more rigid, "cold" corporate institutions.

## Components

### Buttons
- **Primary**: Solid Emerald Green with white text. Use the Gold highlight for a subtle bottom-border or hover state.
- **Secondary**: Outlined Emerald Green or Gold.
- **Tertiary**: Ghost buttons with Slate Gray text for low-priority actions like "Cancel" or "Read More."

### Cards & Modules
Cards are the primary vessel for Course Titles and Surah selections. They should feature a `1px` stroke in a muted Sand-Gold color. Include a subtle Mashrabiya pattern in the top corner of featured cards at 5% opacity.

### Input Fields
Fields should be clean with a focus state that changes the border color to Emerald Green. Given the RTL nature, labels and placeholder text must be right-aligned, and the focus ring should flow from the right.

### Progress Indicators
For student lesson tracking, use the Gold highlight color. The progress bar should fill from **right to left**, consistent with the language's reading direction.

### Chips & Tags
Use chips for "Topic Tags" (e.g., Tajweed, Fiqh). These should have a very light Emerald tint with Deep Emerald text to signify categorization without competing with buttons.