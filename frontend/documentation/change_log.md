# Changelog

## [0.0.1] - Initial Setup

- Initialized React (Vite) + Tailwind CSS.
- Defined Folder Structure.
- Implemented Design System colors.

## [Unreleased]

- Implemented Home hero section + navbar with a clean `components/` + `pages/` structure and CSS modules.
- Added hero background blob + dot grid decorations, rule chip icons, widened layout to 1500px, and loaded Inter font.
- Replaced hero CTAs and feature bullets with proper SVG icons, improved button hover/press/focus interactions, and scaled up the hero graphic.
- Updated hero feature checkmarks to solid `#084619` circles with white checks to match the target UI.
- Switched hero action/icons from inline SVGs to `react-icons` (Ionicons community set) and added `react-icons` to frontend deps.
- Migrated icon usage to Ionic’s `IonIcon` + `ionicons/icons` (removed inline SVG + removed `react-icons` dependency).
- Reverted icon rendering to dependency-free unicode glyphs to restore UI rendering without installing new icon packages.
- Re-added `react-icons` and wired Hero icons (book/arrow/check-circle) plus a slide-up/pop-in entrance animation on the hero content (using `react-icons/fa` to avoid missing `fa6` subpath).
- Fixed hero feature check icon styling by rendering `RiCheckboxCircleFill` directly and setting it to `#084619` so it’s visible.
- Removed hover `scale()`/brightness filter on hero buttons to prevent blurred text while keeping a crisp hover lift + color change.
- Slowed down hero entrance animations and applied the same crisp hover/press/focus behavior to the navbar “Go to Workspace” button.
- Updated the hero graphic example text (before/after + stats) and centered the “SYMMETRY · Live Correction” pill.
- Adjusted hero graphic token highlighting so specific words/phrases are grouped and marked exactly as in the target (before vs after).
- Made navbar responsive under 768px with a hamburger menu that drops links below the header, adds smoother transitions, and uses bold green active styling without underline.
- Refined the mobile navbar UX: long hamburger/close glyphs without button boxes, an overlay menu that doesn’t shift page content, and a dimmed black backdrop (20%) while open.
- Moved the mobile-menu backdrop to cover only the page area (below the sticky navbar) and kept the “Morphism.” brand text visible on mobile.
- Removed the mobile menu’s translucent/blur background so it renders as solid white (no gray haze behind the links).
- Removed the mobile menu backdrop entirely and removed the divider line between the header and expanded mobile menu.
- Matched the open navbar + menu panel backgrounds (no seam) and improved hamburger/X micro-interactions with subtle hover/press transforms without adding visible button chrome.
- Removed hover/press transforms from the hamburger/X and added a clean `:focus-visible` ring to avoid the default blue focus highlight.
- Improved hero-section responsiveness across breakpoints and centered left-side content when the layout stacks with the hero graphic below.
- Tightened hero mobile responsiveness: stats stay in one row, feature checks stay inline/aligned while centered, text and pill scale down by breakpoint, and horizontal margins are preserved on all screen sizes.
- Fixed navbar height for mobile (<=560px) and refined hero section responsiveness with better margins, typography, and graphic scaling.
- Moved hero stacking breakpoint to 1023px, fixed uneven margins, shortened mobile CTA buttons, and scaled down hero graphic internal elements for better fitting.
- Aligned feature list typography with subtitle, forced metrics into a single row, prevented text wrapping in graphic chips/pills, and expanded graphic height to prevent content clipping.
- Centered metrics, increased gap between metrics and hero graphic, expanded graphic height further to avoid tag overlap, and removed live pill background on mobile.
- Refined metrics centering using flexbox and reduced vertical spacing between metrics and hero graphic for a tighter layout.
- Finalized metrics centering by forcing 100% width on parent containers and eliminating all potential side margin/padding offsets.
- Reverted the full-width metrics row; restored the section border-top within the left hero column and adjusted desktop title font-size/grid-ratio to ensure a clean two-line wrap.
