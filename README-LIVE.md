# Faculty Demo Guide: Live Link Instructions

Follow these steps to show your project to your faculty members.

## 1. Prerequisites
- Ensure your local servers are running. Use `run-all.bat` to start Frontend, Backend, and ML services.
- Find your **Public IP Address**. You can find it here: [https://ipv4.icanhazip.com](https://ipv4.icanhazip.com). You will need this as a "password" for the live links.

## 2. Generate Live Links
1. Run the `generate-live-links.bat` file in the project root.
2. Three terminal windows will open. Each will generate a URL ending in `.loca.lt`.
   - **Frontend URL**: Port 3000
   - **Backend URL**: Port 8080
   - **ML Service URL**: Port 8000

## 3. Accessing the Live Link
When you (or your faculty) open the Frontend URL, you will see a "Friendly Reminder" page from Localtunnel.
1. Scroll down to the **"Tunnel Password"** field.
2. Enter your **Public IP Address** (the one from step 1).
3. Click **"Click to Submit"**.
4. The Hospital Management System will now load!

## 4. Troubleshooting
- **CORS Errors**: I have already updated `SecurityConfig.java` to allow these public URLs.
- **Login**: Use the default admin credentials:
  - **Email**: `admin@nexushealth.com`
  - **Password**: `password123`
- **Video Calls**: Video calls require HTTPS. Localtunnel provides HTTPS URLs by default, so it should work perfectly!

> [!TIP]
> Keep the terminal windows open throughout your demonstration. Closing them will kill the live links.
