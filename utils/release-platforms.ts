export type ReleasePlatform = {
  id: string;
  name: string;
  group: "stream" | "ugc";
};

/**
 * Main release package for the UI. CIS stores come first, then the world.
 * A live distributor catalog can be 100+; this list mirrors the usual YourTunes-style set
 * so a person from СНГ can still aim at Spotify, Apple and the rest in one draft.
 */
export const RELEASE_PLATFORMS: ReleasePlatform[] = [
  { id: "yandex", name: "Яндекс Музыка", group: "stream" },
  { id: "vk", name: "VK Музыка", group: "stream" },
  { id: "zvuk", name: "Звук", group: "stream" },
  { id: "kion", name: "KION Music", group: "stream" },
  { id: "adv", name: "ADV Music", group: "stream" },
  { id: "spotify", name: "Spotify", group: "stream" },
  { id: "apple", name: "Apple Music", group: "stream" },
  { id: "youtube", name: "YouTube Music", group: "stream" },
  { id: "amazon", name: "Amazon Music", group: "stream" },
  { id: "deezer", name: "Deezer", group: "stream" },
  { id: "tidal", name: "TIDAL", group: "stream" },
  { id: "pandora", name: "Pandora", group: "stream" },
  { id: "qobuz", name: "Qobuz", group: "stream" },
  { id: "anghami", name: "Anghami", group: "stream" },
  { id: "hungama", name: "Hungama", group: "stream" },
  { id: "jiosaavn", name: "JioSaavn", group: "stream" },
  { id: "joox", name: "Joox", group: "stream" },
  { id: "kkbox", name: "KKBOX", group: "stream" },
  { id: "netease", name: "NetEase Cloud Music", group: "stream" },
  { id: "tencent", name: "Tencent Music", group: "stream" },
  { id: "shazam", name: "Shazam", group: "stream" },
  { id: "touchtunes", name: "TouchTunes", group: "stream" },
  { id: "meplaylist", name: "MePlaylist", group: "stream" },
  { id: "lyricfind", name: "LyricFind", group: "stream" },
  { id: "kuack", name: "Kuack Media", group: "stream" },
  { id: "nuuday", name: "Nuuday", group: "stream" },
  { id: "facebook-video", name: "Facebook Video", group: "stream" },
  { id: "tiktok", name: "TikTok", group: "ugc" },
  { id: "instagram", name: "Instagram / Facebook", group: "ugc" },
  { id: "youtube-content-id", name: "YouTube Content ID", group: "ugc" },
  { id: "soundcloud", name: "SoundCloud", group: "ugc" },
  { id: "musixmatch", name: "Musixmatch", group: "ugc" },
  { id: "facebook-fingerprint", name: "Facebook Fingerprinting", group: "ugc" },
];

export const STREAM_PLATFORMS = RELEASE_PLATFORMS.filter((item) => item.group === "stream");
export const UGC_PLATFORMS = RELEASE_PLATFORMS.filter((item) => item.group === "ugc");
