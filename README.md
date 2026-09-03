# CCT PWA

CCT PWA is a phone-first Cognitive Control Training application. It uses adaptive auditory pacing and a built-in touch keypad.

The application stores settings, session history, and trial data on the device. It does not require an account or a server database.

## Main phone features

- A 3-by-4 answer keypad replaces the software keyboard.
- The full gameplay surface uses `touch-action: manipulation`.
- Correct answers submit automatically.
- The application supports signed subtraction with a minus key.
- A screen wake lock is requested during an active session.
- A hidden or locked application ends the active session as interrupted.
- Audio uses preloaded Web Audio buffers when the browser supports them.
- A service worker caches the application and voice files for offline use.

## Run locally

Serve this directory through a local web server. Do not open `index.html` directly from the file system.

```text
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Publish with GitHub Pages

1. Push this repository to `https://github.com/revaporated/CCT_pwa`.
2. Open the repository on GitHub.
3. Select **Settings**.
4. Select **Pages** under **Code and automation**.
5. Set **Source** to **Deploy from a branch**.
6. Select the `main` branch and the `/(root)` folder.
7. Select **Save**.
8. Wait for GitHub to show the published address.

The expected address is `https://revaporated.github.io/CCT_pwa/`.

## Install on an iPhone

1. Open the published address in Safari.
2. Wait for the first complete load.
3. Select the Share button.
4. Select **Add to Home Screen**.
5. Keep **Open as Web App** enabled if iOS shows that option.
6. Select **Add**.
7. Start CCT from the new Home Screen icon.

Open the application once while online before you test offline use.

## Publish an update

Increase `CACHE_NAME` in `service-worker.js` when application files or audio files change. Then commit and push the update.

The installed application checks for an updated service worker when it opens. Close and reopen the application if an update does not appear immediately.

## Data limits

Browser storage belongs to the website address. A different domain starts with a different local data store.

Deleting the Home Screen application or its website data can remove saved training data. Export important history before you delete the application.

## License

See `LICENSE` for the source license and attribution requirements.
