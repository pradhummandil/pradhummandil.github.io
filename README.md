# Pradhum Mandil Portfolio — Production Build

This version keeps the current editorial portfolio design but moves the app to Vite so the production build bundles and minifies the JavaScript and CSS.

## 1. Put images here

`public/images/`

Use these exact names:

- `pradhum.png`
- `study-hub.jpg`
- `india-story-project.jpg`
- `adihat-full-app.jpg`
- `adihat-website.jpg`
- `hostel-management.jpg`

## 2. Configure EmailJS

Create `.env` in the project root:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

The auto-reply stays configured in EmailJS on the template dashboard.

## 3. Install and run

```bash
npm install
npm run dev
```

## 4. Production build

```bash
npm run build
```

Vite writes the production files to `dist/`.

## 5. Preview production output

```bash
npm run preview
```

### Copy-resistance

The build disables source maps and minifies/bundles the JavaScript and CSS. This makes the shipped code much harder to casually read or copy, but it cannot make browser-delivered code completely secret.
