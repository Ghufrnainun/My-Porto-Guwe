# OS63 reference and local shell map

**Reference:** [OS63](https://os.atom63.io/)  
**Implementation:** Original Ghufron OS shell, inspired by the reference's desktop metaphor. The user later steered the work away from pixel replication.  
**Workflow:** user-provided `clone-website` skill; followed the existing Vite/React app conventions rather than copying its Next.js scaffold.

## Route and ownership map

| Source route | Local route | Owner |
|---|---|---|
| OS63 home desktop | `/` | `OsShell` + `Index` desktop widgets |
| Profile/about app | `/about` | `OsShell` window + About page |
| Finder/project list and details | `/projects`, `/projects/:slug` | `OsShell` window + project pages/data |
| Writing app | `/blog`, `/blog/:id` | `OsShell` window + Blog/BlogPost pages |
| Resume app | `/resume` | `OsShell` window + Resume page |
| OS utility apps | `/` utility windows | `OsShell` |

`OsShell` persists across navigation, so deep links and browser history render inside the same window frame. Auth/admin and unrelated routes stay on their existing layout.

## Observed reference states

- Chrome desktop was observed at 1920×1080. The page had Notes and Timeline windows already open, so that capture was not pristine.
- The 40px system bar spans the top; it has home/app controls at left and date/time/system controls at right.
- The desktop has a full-screen wallpaper, framed profile/local-time/listening/weather/note/GitHub widgets, and a centered translucent dock. Widgets expose drag/menu affordances.
- Window surfaces use a dark title bar with three circular actions and a scrollable content area. The observed Timeline window was large and did not dim the desktop.
- Wallpaper changed during interaction. The observed wallpaper inventory included a bright green checker texture; another screenshot showed a teal Windows-style wave. There is no fixed wallpaper claim in the clone.
- The page exposed real music, GitHub and weather data. The local implementation uses actual portfolio content and intentionally does not invent those service readings.
- A source mobile viewport was not available through this browser session; local mobile behavior is covered by the responsive shell and still requires the final browser check.

## Current local asset map

| Asset | Local path | Use |
|---|---|---|
| Existing portfolio brand mark | `public/brand-logo.svg` | Copper identity in the system bar |
| Existing portfolio portrait | `public/Photo.webp` | Profile card and guest unlock |
| Original vector artwork | `public/ghufron-os-wallpaper.svg` | Navy/cobalt technical wallpaper with bright-blue circuit paths |
| Generated icon artwork | `public/ghufron-os-dock-sprite.png` | Eight original dock/launcher icons, cropped by the shared dock component |
| Existing `lucide-react` dependency | `src/components/os/OsShell.tsx` | Window and utility controls |

## Palette decision and verification

The user selected a blue OS palette after comparing the earlier copper version with the vivid OS63 screenshot. The shell now maps wallpaper navy `#071C33`, cobalt `#0B64B6`, and bright blue `#1789E8` to the wallpaper; panel `#17191D`, raised/window `#202329`, and border `#424853` to surfaces; `#F5F7FA` and `#B7C0CB` to text; and `#176FC0`, `#2385D9`, and `#123A5C` to solid, hover, and soft accent roles. The accessible link color is `#56A8ED`; hover labels use deep navy `#041426` for contrast. Warm copper/teal remains only as decorative identity material in the existing brand mark and generated icon sheet. The physical yellow note keeps its paper palette.

Contrast measurements are recorded with the color pass verification; rendered image gradients and mobile viewport remain visual checks rather than a single flat color pair.

The initial draft temporarily bundled OS63's wallpaper and dock icons. They were removed after the brand direction changed; no copied OS63 image remains in use. The original wallpaper uses a restrained grid/circuit pattern, not the source wallpaper. No reference avatar or service data is reused.

## Shell interactions

| Trigger | Result |
|---|---|
| Click or keyboard-activate guest unlock on `/` | Enters desktop; no credentials or auth state are collected |
| Home icon, dock launcher, or `Ctrl/⌘+K` | Opens categorized app launcher |
| Launcher search and app selection | Filters apps; routes to public app windows or opens Notes/Contact/Settings utility windows |
| Route link or browser back/forward | Updates the active OS window while the shell stays mounted |
| Window title-bar close/minimize/maximize | Returns to desktop, hides window, or expands it |
| Escape/backdrop/close on utility window | Closes utility dialog |
| Sticky note edit | Shares note state between desktop and Notes window |
