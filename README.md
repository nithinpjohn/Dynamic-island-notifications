# Dynamic Island Notifications

<div align="center">

  <img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,react" />

  <h3>iPhone-inspired Dynamic Island notification system for the web</h3>

  <p align="center">
    A floating, animated notification widget built with Next.js 15 and Framer Motion, mimicking Apple's Dynamic Island transitions.
    <br />
    <a href="https://evalogical.com"><strong>evalogical.com »</strong></a>
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![Sonner](https://img.shields.io/badge/Sonner-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sonner.emilkowal.ski)

</div>

---

## Overview

This project implements a **Dynamic Island**-style notification widget for the web, inspired by Apple's iPhone Dynamic Island. The component floats at the top center of the screen and smoothly expands on hover to reveal the three most recent notifications, with the latest shown at the bottom.

Built as part of Evalogical's component library, this demonstrates how native mobile UI patterns can be translated into delightful web experiences using modern animation tooling.

---

## Features

- **Floating pill widget** — fixed at the top center of the viewport, always accessible
- **Smooth morphing animations** — spring-physics transitions powered by Framer Motion mimic the iPhone's Dynamic Island expand/collapse behavior
- **Hover to expand** — reveals the 3 most recent notifications; latest notification at the bottom
- **Notification queue** — context-based store manages incoming notifications, capped at 3 visible at once
- **Sonner toast integration** — secondary toast feedback via the Sonner plugin (shadcn)
- **Relative timestamps** — "Just now", "5m ago", "2h ago" for each notification
- **Clear all** — dismiss all notifications from the expanded panel
- **Pulsing indicator** — subtle animation signals unread notifications in collapsed state
- **Dark mode support** — fully adapts to system color scheme via `next-themes`

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Animations | Framer Motion 12 / Motion |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Notifications | Sonner |
| State | React Context API |
| Package Manager | Bun |

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nithinpjohn/dynamic-island-notifications.git
   cd dynamic-island-notifications
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with NotificationProvider
│   └── page.tsx            # Demo page with notification triggers
├── components/
│   └── DynamicIsland.tsx   # Core animated Dynamic Island component
├── contexts/
│   └── NotificationContext.tsx  # Notification state management
└── components/ui/          # shadcn/ui base components
```

---

## How It Works

### Dynamic Island Component

The `DynamicIsland` component uses Framer Motion's `AnimatePresence` and layout animations to morph between two states:

```tsx
// Collapsed state — compact pill
<motion.div layout style={{ width: 160, height: 42, borderRadius: 999 }} />

// Expanded state — notification panel
<motion.div layout style={{ width: 380, borderRadius: 24 }} />
```

Spring physics are used for all transitions to replicate the natural feel of Apple's implementation:

```tsx
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### Triggering Notifications

Use the `useNotifications` hook anywhere in your app:

```tsx
import { useNotifications } from '@/contexts/NotificationContext';

const { addNotification } = useNotifications();

addNotification({
  title: "New Message",
  message: "Hey! How are you doing?",
  icon: "💬",
});
```

---

## Customization

| Option | Where to change |
| :--- | :--- |
| Max visible notifications | `NotificationContext.tsx` — `MAX_NOTIFICATIONS` constant |
| Animation spring values | `DynamicIsland.tsx` — `transition` props |
| Collapsed pill size | `DynamicIsland.tsx` — collapsed state dimensions |
| Toast position | `layout.tsx` — `<Toaster position="..." />` |

---

## License

MIT License. Feel free to use and adapt this component in your own projects.

---

## Author

**Nithin**
Evalogical — [evalogical.com](https://evalogical.com)

---

<div align="center">
  <sub>Built with care by <a href="https://evalogical.com">Evalogical</a></sub>
</div>
