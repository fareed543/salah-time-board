# SalahTimeBoard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Mobile APK Build Instructions

Follow these steps to generate a signed APK for your Angular + Capacitor project.

## 1. Build Angular App
Run the following command to build your Angular project:    ` npm run build`

## 2. Copy Web Assets to Capacitor
Copy the web assets to Capacitor:    `npx cap copy`


## 3. Add Android Platform (Only Once)
Add the Android platform to your project:      `npx cap add android`
⚠️ Skip this step if Android platform is already added to avoid overwriting changes.

---

## 4. Copy Again After Adding Platform
Copy assets specifically for Android: `npx cap copy android`

---

## 5. Open Android Project in Android Studio
Open the Android project:`npx cap open android`

---

## 6. (Optional) Build Unsigned Release APK via Command Line
Navigate to the Android folder:    `cd android`
Run Gradle to assemble the release APK: `gradlew assembleRelease`

This generates `app-release-unsigned.apk` at: `cd D:\salah-time-board\android\app\build\outputs\apk\release `

## 7. Sign the APK
Sign the unsigned APK using `apksigner`:
    `apksigner sign --ks "D:\salah-time-board\android\app\my-release-key.keystore" --out salahtime.apk app-release-unsigned.apk`

Notes:
- Ensure `apksigner` is in your system PATH (comes with Android SDK build-tools).
- Verify the unsigned APK path if you get a "no such file" error.

## 8. Verify the Signed APK (Recommended)
Verify the APK signature:   `apksigner verify app-release-signed.apk`

---

## 9. Install or Share APK
You can now install the APK on a device:    `adb install app-release-signed.apk`

---

## Common Gotchas
- In `android/app/build.gradle`, ensure `minifyEnabled false` under release config if you don't want code shrinking.
- Keystore path and alias must match the ones used during signing.
- Always build from a clean state if assets are changed:

    npx cap clean
    npm run build
    npx cap copy android



Genere abb 
cd android   
>gradlew bundleRelease


issue : app-release.aab All uploaded bundles must be signed.

>keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000


issue : Remove conflicts from the manifest before uploading. The following content provider authorities are in use by other developers: com.example.app.androidx-startup, com.example.app.fileprovider. You need to use a different package name because "com.example" is restricted.




3. Build Release APK or AAB

cd android
Run one of the following (inside android folder):

➡ For APK: `./gradlew assembleRelease`
➡ For AAB (recommended for Play Store):`./gradlew bundleRelease`