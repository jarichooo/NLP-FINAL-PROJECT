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
