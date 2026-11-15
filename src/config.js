// The one place to update when a new version is published.
// Copy version, size and url from the studio's dist/latest.json after running the release script.
export const RELEASE = {
  version: "0.1.1",
  sizeBytes: 5994605,
  url: "https://github.com/thePanda-X/panda-studio-releases/releases/download/v0.1.1/PandaStudio-Setup-0.1.1.exe",
  // Page listing every release (the "All versions" link).
  releasesPage: "https://github.com/thePanda-X/panda-studio-releases/releases",
};

// The page is laid out like a song this many bars long: scrolling to the bottom reaches its end.
export const SONG_BARS = 16;
