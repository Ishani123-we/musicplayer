# Five Track Lofi Radio

Built an aesthetic music player using ONLY plain HTML, CSS, and vanilla JavaScript (no React, no frameworks, no Tailwind). Three files: index.html, style.css, script.js.

Aesthetic: "Lo-fi late night". A warm dusk gradient background (peach, mauve, deep indigo) with a subtle grain overlay. The player is a centered card with a vinyl record that spins while playing (CSS animation, pauses when paused), rounded corners, soft glow, and retro typography (Space Grotesk plus a pixel or monospace accent font for the time).

Features:

1. Playlist of 5 songs with title, artist, cover art, and duration. Use royalty-free audio URLs (for example from Pixabay or free lo-fi sample links), and structure the songs in a JS array so I can easily replace them.

2. Controls: play/pause, next, previous, shuffle, and repeat, with icon buttons.

3. Display the current song title, artist, current time, and total duration.

4. A custom-styled progress bar (clickable to seek) and a volume slider with a mute icon.

5. Playlist panel: click a track to play it, with the active track highlighted. Autoplay the next song when one ends.

6. Smooth hover and transition effects, and responsive layout for mobile.

7. Keyboard support: Space to play/pause, arrow keys for next/prev and volume.

Add clear comments in the code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://five-track-lofi-radio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/353d88e4-1455-4e71-a830-f20df6e66feb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
