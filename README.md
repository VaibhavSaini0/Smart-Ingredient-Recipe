# Smart Ingredient Recipe — Mobile App

Expo React Native app for the **Smart Ingredient Recipe** project. Enter ingredients you have at home, generate AI-powered recipes, follow step-by-step cooking instructions with timers, and browse your saved recipe history.

Pairs with the backend API in [`smart-ingredient-recipe-backend`](https://github.com/VaibhavSaini0/Smart-Ingredient-Recipe-backend).

---

## Features

- Sign up / log in with JWT auth
- Generate recipes from 3+ comma-separated ingredients (Google Gemini)
- View recipe details — ingredients, steps, prep time, servings
- Follow recipe mode with step-by-step navigation
- Per-step cooking timers with sound alerts
- Recipe history saved to your account
- Drawer navigation — Home, Recipe History, Profile, Logout

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 54 |
| UI | React Native 0.81 |
| Navigation | React Navigation (Drawer + Native Stack) |
| State | React Context (Auth + Recipe) |
| Storage | AsyncStorage (auth token) |
| API | REST backend |

---

## Prerequisites

- **Node.js** 20+
- **Backend API** running — see [backend README](https://github.com/VaibhavSaini0/Smart-Ingredient-Recipe-backend/README.md)
- **Expo Go** (SDK 54) on your phone, or Android/iOS emulator

---

## Getting Started

### 1. Start the backend

```bash
cd ../smart-ingredient-recipe-backend
npm install
cp .env.example .env
npm run dev
```

Backend should be running at `http://localhost:3000`.

### 2. Install and configure the app

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `EXPO_PUBLIC_API_URL`:

```env
# Physical phone (same Wi-Fi as your PC)
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000

# Web browser or emulator
# EXPO_PUBLIC_API_URL=http://localhost:3000

# Production
# EXPO_PUBLIC_API_URL=https://your-api.vercel.app
```

Replace `192.168.x.x` with your computer's LAN IP (`ipconfig` on Windows, `ifconfig` on Mac/Linux).

### 3. Start Expo

```bash
npm start
```

Or with a clean cache after env changes:

```bash
npx expo start -c
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Yes (prod) | Backend API base URL |

| Scenario | URL |
|----------|-----|
| Phone on Wi-Fi | `http://<your-pc-lan-ip>:3000` |
| Web / emulator | `http://localhost:3000` |
| Production | `https://your-api.vercel.app` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in browser |

---

## App Flow

1. **Auth** — Sign up or log in
2. **Home** — Enter ingredients and tap **Generate Recipe**
3. **Recipe Detail** — Review ingredients and steps; tap **Follow Recipe**
4. **Follow Recipe** — Step through instructions; start timers when prompted
5. **Recipe History** — Open drawer → view past recipes
6. **Profile** — View account details

---

## Project Structure

```
smart-ingredient-recipe/
├── App.tsx                 # Root providers + navigation
├── assets/                 # Icons, sounds
├── src/
│   ├── api/                # HTTP client, auth, recipes
│   ├── components/         # Button, Input, StepTimer, etc.
│   ├── constants/          # Theme, API config
│   ├── context/            # AuthContext, RecipeContext
│   ├── navigation/         # Drawer, stacks, types
│   ├── screens/
│   │   ├── auth/           # Login, Signup
│   │   ├── recipe/         # Home, Detail, Follow, History
│   │   └── profile/        # User profile
│   ├── types/
│   └── utils/              # Timers, validation, formatting
└── .env.example
```

---

## Production Checklist

- [ ] Deploy backend to Vercel with env vars set
- [ ] Set `EXPO_PUBLIC_API_URL` to your HTTPS Vercel URL
- [ ] Update `app.json` — Android package name / iOS bundle ID
- [ ] Build with EAS: `npx eas build`
- [ ] Never commit `.env` with real API keys

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Cannot reach server | Check backend is running; use LAN IP on phone |
| `EXPO_PUBLIC_API_URL is not set` | Create `.env` and restart with `npx expo start -c` |
| Module not found errors | Clear Metro cache: `npx expo start -c` |
| Recipe generation fails | Check backend logs; verify Gemini API key |
| Timer sound not playing | Grant audio permissions; test on physical device |

---

## Related

Backend API repo: [`smart-ingredient-recipe-backend`](../smart-ingredient-recipe-backend/)
