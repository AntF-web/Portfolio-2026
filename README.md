# Antoine Flament — CV / Portfolio

Static GitHub Pages–ready portfolio with an EN/FR switch and a browser-based content editor.

## Edit the site

Open `editor.html`.

The **PROJECTS** tab can now create new portfolio cards:

- **+ MUSIC** adds a new item to the MUSIC filter.
- **+ WEB** adds a new item to the WEB filter.
- **+ VIDEO** adds a new item to the VIDEO filter.
- Every project can be edited, moved up/down, recategorized, or removed.
- A project can link to any website, YouTube/music page, or internal HTML page.
- Add an image URL or direct video URL for the card visual, or leave it blank for the automatic text visual.

The **VJ / VIDEOS** tab also supports **+ VJ VIDEO**, reordering, and removal of video examples on `videos.html`.

## Preview and publish

1. Make changes in `editor.html`.
2. Click **SAVE PREVIEW**.
3. Open **PREVIEW PORTFOLIO** or **PREVIEW VIDEOS**.
4. When ready, click **EXPORT site-data.js**.
5. Replace the repository's `site-data.js` with the exported file and commit/push it to GitHub Pages.

`editor.html` is intentionally not linked from the public portfolio navigation. It is a client-side convenience editor, not a secure server-side admin panel.
