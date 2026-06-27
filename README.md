# Smart Ingredient Recipe

Expo app I built for turning whatever is in your fridge into a recipe. You log in, type a few ingredients, get a recipe from Gemini, and can follow it step-by-step with timers.

Backend lives in a separate repo: [Smart-Ingredient-Recipe-backend](https://github.com/VaibhavSaini0/Smart-Ingredient-Recipe-backend).

**Production API:** `https://smart-ingredient-recipe-backend.onrender.com`

---

## What it does

- Sign up / login (JWT stored in AsyncStorage)
- Generate a recipe from 3+ comma-separated ingredients
- View ingredients, steps, prep time, servings
- Follow mode with per-step timers and a sound when time is up
- Recipe history per account
- Drawer nav: Home, History, Profile, Logout

---

## Stack

Expo 54, React Native, React Navigation (drawer + stack), Context for auth/recipe state, REST API on Render.

---

## Run locally

```bash
npm install
cp .env.example .env
npm start
```

`.env` should point at the deployed backend unless you are running the API yourself:

```env
EXPO_PUBLIC_API_URL=https://smart-ingredient-recipe-backend.onrender.com
```

If you change `.env`, restart with a cleared cache:

```bash
npx expo start -c
```

### Optional: local backend

```bash
cd ../smart-ingredient-recipe-backend
npm install
cp .env.example .env
npm run dev
```

Then use `http://localhost:3000` (web/emulator) or `http://<your-lan-ip>:3000` (phone on same Wi-Fi).

---

## Scripts

| Command | What it does |
|---------|----------------|
| `npm start` | Expo dev server |
| `npm run android` | Android |
| `npm run ios` | iOS simulator |
| `npm run web` | Browser |

---

## Building for release

`eas.json` already sets `EXPO_PUBLIC_API_URL` for preview/production builds.

```bash
npx eas build -p android --profile preview
```

Update `app.json` bundle IDs before shipping to stores.

---

## Troubleshooting

- **Old API URL still showing** — kill anything on port 8081, run `npx expo start -c`, hard-refresh the browser.
- **First request slow** — Render free tier sleeps; give it ~30s to wake up.
- **Recipe fails** — check Render logs and `GEMINI_API_KEY` on the backend.

---

## Layout

```
src/
  api/          fetch wrapper, auth + recipe calls
  components/   Button, Input, StepTimer, etc.
  context/      Auth + recipe/timer state
  navigation/   drawer + stacks
  screens/      auth, recipe flow, profile
  constants/    theme + API URL
  utils/        validation, timer helpers
```
