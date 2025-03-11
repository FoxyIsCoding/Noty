
# Noty - Elevate Your Note-Taking Experience! 📝✨

Welcome to Noty, your modern and elegant note-taking companion! Designed to help you stay organized, productive, and inspired, Noty is a sleek web app that offers a seamless and secure way to manage your thoughts and ideas right from your browser.

## Features

- 🗂️ **Organize Your Notes**: Keep your notes neatly categorized with folders, making it easy to find and manage your information.
- ✨ **Clean Design**: Enjoy a modern, minimalistic user interface that’s intuitive and visually appealing.
- 💡 **Lightweight & Fast**: Built for speed, Noty ensures a smooth experience without heavy dependencies.
- 🔒 **Privacy First**: Your notes are yours alone. Noty prioritizes your privacy with secure Firebase integration.
- 🌙 **Dark Mode**: Switch between light and dark themes to match your style and preference.

## Getting Started

To set up and run Noty locally or deploy it, follow these simple steps:

### 1. Clone the Repository:

```bash
git clone https://github.com/FoxyIsCoding/Noty

```

### 2. Open the Project:

Navigate to the cloned directory:

```bash
cd Noty

```

Open the `index.html` file in your preferred web browser to preview the app locally. For example:

-   On Windows: Double-click `index.html` or drag it into a browser.
-   On macOS/Linux: Use `open index.html` (macOS) or `xdg-open index.html` (Linux).

### 3. Set Up Firebase:

1.  Create a Firebase project at [firebase.google.com](https://firebase.google.com).
2.  Enable Authentication and Firestore Database in the Firebase Console.
3.  Copy your Firebase configuration (API key, auth domain, project ID, etc.).
4.  Update the `auth.js` file in the project with your Firebase configuration details. It should look something like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

```

### 4. Test Locally:

Reload the `index.html` file in your browser to ensure Firebase connects properly. You should now be able to use Noty’s features locally.

### 5. Deploy (Optional):

To make Noty accessible online:

-   Host the files on a web server (e.g., GitHub Pages, Netlify, or Firebase Hosting).
-   For Firebase Hosting:
    -   Install the Firebase CLI: `npm install -g firebase-tools` (requires Node.js).
    -   Log in: `firebase login`.
    -   Initialize hosting: `firebase init hosting`.
    -   Deploy: `firebase deploy`.
-   Visit the provided URL to access your live Noty app.

## Contributing

We’d love your help to make Noty even better! To contribute:

1.  Fork the repository.
2.  Create a new branch for your changes.
3.  Submit a pull request with a clear description of your updates.
4.  Our team will review and merge contributions that align with the project’s goals.

## License

Noty is licensed under the MIT License.

## Support

Need help? Open an issue on GitHub and we’ll assist you as soon as possible.


