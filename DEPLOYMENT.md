# Deployment Guide

This guide covers how to deploy the MERN Wallet App to production.

## 1. Backend Deployment (Render)

We will use [Render](https://render.com) to host the Node.js backend.

1.  **Push Code to GitHub:** Ensure your latest code is pushed to a GitHub repository.
2.  **Create Web Service on Render:**
    -   Log in to Render and click **New +** -> **Web Service**.
    -   Connect your GitHub repository.
3.  **Configure Service:**
    -   **Name:** `easypay-backend` (or similar)
    -   **Root Directory:** `.` (leave empty or set to root)
    -   **Environment:** `Node`
    -   **Build Command:** `npm install` (This installs root dependencies including `concurrently`, but we need to ensure backend deps are installed. Render installs from root `package.json`. Make sure your root `package.json` has a `postinstall` script or similar if needed, OR simply set Root Directory to `backend` if you only want to deploy backend here. **Recommended: Set Root Directory to `backend`**).
    -   **Start Command:** `node index.js`
4.  **Environment Variables:**
    Add the following environment variables in the Render dashboard:
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A strong secret key for JWT.
    -   `PORT`: `8080` (or let Render assign one, usually it sets `PORT`).
    -   `NODE_ENV`: `production`
5.  **Deploy:** Click **Create Web Service**.
6.  **Copy URL:** Once deployed, copy the service URL (e.g., `https://easypay-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

We will use [Vercel](https://vercel.com) to host the React frontend.

1.  **Create Project on Vercel:**
    -   Log in to Vercel and click **Add New...** -> **Project**.
    -   Import your GitHub repository.
2.  **Configure Project:**
    -   **Framework Preset:** `Vite`
    -   **Root Directory:** `frontend` (Important: Click "Edit" and select the `frontend` folder).
3.  **Environment Variables:**
    -   Add `VITE_API_URL` and set it to your Backend URL from Step 1 (e.g., `https://easypay-backend.onrender.com`).
    -   **Note:** Do NOT add a trailing slash.
4.  **Deploy:** Click **Deploy**.
5.  **Verify:** Open the deployed URL. The app should load and connect to the backend.

## 3. Android Deployment (APK)

To generate an APK file for Android devices:

1.  **Build Frontend:**
    Run the following command in the project root to build the latest frontend assets:
    ```bash
    npm run build --prefix frontend
    ```

2.  **Sync Capacitor:**
    Sync the web assets to the Android project:
    ```bash
    npx cap sync
    ```

3.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```

4.  **Build APK:**
    -   In Android Studio, go to **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
    -   Once finished, a notification will appear. Click **locate** to find the `app-debug.apk` file.
    -   You can send this APK to your client or install it on your device.

## Troubleshooting

-   **CORS Issues:** If the frontend cannot talk to the backend, check the Browser Console. If you see CORS errors, ensure your Backend is running and `cors` is enabled (it is enabled by default in `backend/index.js`).
-   **White Screen on Android:** Ensure you ran `npx cap sync` after building the frontend.
-   **API Errors:** Check if `VITE_API_URL` is set correctly in Vercel.
