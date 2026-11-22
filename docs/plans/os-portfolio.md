# Ghufron OS portfolio

## Final direction

Build a sparse Mac/Linux-inspired desktop portfolio with an original blue/indigo visual language. Keep the desktop immediately usable: no mandatory boot or guest-unlock step. The reference audit of [Roshish Shrestha’s macOS portfolio](https://macos.rosh.sh/) informed the familiar menu bar, desktop shortcuts, app windows, and dock pattern; use original layout, icons, wallpaper, and copy rather than copying its assets or exact screen.

The desktop has four shortcuts: **Projects**, **Widgets**, **About**, and **Resume**. Projects opens the Finder-like project route as a folder grid. About opens a Contacts-style profile view. The Widgets app presents six draggable cards: profile, recent projects, local time, GitHub, sticky note, and work base. Other public routes open in floating windows and remain addressable by their existing URLs. The dock magnifies neighboring apps on desktop and becomes an **Apps** popover on mobile.

Keep the interaction set focused: windows can be moved, minimized, maximized, or closed; the launcher supports search and keyboard access; routes continue to work with browser history and direct links. Preserve existing admin/auth layouts outside the public OS shell. Use the existing project assets only where they already belong to Ghufron’s brand.

## Call graph

Production:

```ts
BrowserRouter
  → AnimatedAppContent
    → public OS route
      → OsShell
        → desktop shortcuts / launcher / dock
        → route window
          → Projects Finder-like folder grid
          → Contacts-style About
          → Resume / Writing / project detail content
        → Widgets app
          → profile / recent projects / local time / GitHub / sticky note / work base cards
    → auth / admin / other route
      → existing non-OS layout
```

Tests:

```ts
Browser interaction checks
  → open each desktop shortcut
    → verify Finder project grid / About / Resume / Widgets
  → drag and manage route windows
  → search and open launcher apps
  → verify direct routes and browser back/forward
  → verify desktop dock magnification
  → verify mobile Apps popover and usable window content
  → verify admin/auth remain outside the OS shell
```

## Validation scope and status

Validation should cover the production build and lint, public route rendering, window and launcher interactions, six widget drag behavior, keyboard focus and Escape handling, reduced-motion behavior, mobile Apps popover, and admin/auth route boundaries. Browser checks should use desktop and narrow mobile viewports. The external reference sweep did not establish mobile, accessibility, or drag behavior for every reference site; validate these in this implementation. No commits or pushes are part of this plan.
