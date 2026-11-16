// The one place to update when a new version is published.
//
// Each platform has its own version: a Windows-only release leaves macOS and Linux on their
// last build. After a release, set each platform's `version` to what its update file says
// (dist/latest.json for Windows, latest-macos.json, latest-linux.json), and `sizeBytes` to its
// "size" (leave it out to hide the size). File names follow the release script's patterns.

const REPO = "https://github.com/thePanda-X/panda-studio-releases";

export const PLATFORMS = {
  windows: {
    name: "Windows",
    version: "1.2.0",
    sizeBytes: 6994044,
    file: (v) => `PandaStudio-Setup-${v}.exe`,
    requires: "Windows 10 & 11 (64-bit)",
    experimental: false,
  },
  macos: {
    name: "macOS",
    version: "1.2.0",
    sizeBytes: 15953728,
    file: (v) => `PandaStudio-${v}-macos.dmg`,
    requires: "macOS 11 or newer · Apple silicon & Intel",
    experimental: true,
  },
  linux: {
    name: "Linux",
    version: "1.2.0",
    sizeBytes: 8829432,
    file: (v) => `PandaStudio-${v}-linux-x86_64.AppImage`,
    requires: "x86-64 · AppImage",
    experimental: true,
  },
};

export const downloadUrl = (p) => `${REPO}/releases/download/v${p.version}/${p.file(p.version)}`;
export const RELEASES_PAGE = `${REPO}/releases`;

// Where the "Support on Ko-fi" links go.
export const KOFI_URL = "https://ko-fi.com/pandaxiro";

// The page is laid out like a song this many bars long: scrolling to the bottom reaches its end.
export const SONG_BARS = 16;
