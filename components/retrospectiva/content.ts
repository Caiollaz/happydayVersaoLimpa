/**
 * Centralized editable content for the retrospective slides. Edit this file
 * (and only this file) to swap the story for your own — names, numbers,
 * places, the song, the captions.
 *
 * Everything else (counters, dates, photos count) is derived from code.
 */

export const RETRO_CONTENT = {
  whereStarted: {
    // One short line of context about the day they met.
    context: "o dia em que a conversa não teve hora pra acabar",
  },
  movie: {
    // The slide about the first in-person date — they went to the movies
    // and picked, by pure bad luck, the worst horror film of the year.
    // Neither of them remembers the plot. Both remember the walk home.
    // Inside joke turned into a slide.
    eyebrow: "ESTREIA MUNDIAL",
    title: "O PORÃO",
    date: "01·03·25",
    tagline1: "o filme era ruim.",
    tagline2: "a companhia não.",
    rating: 2, // out of 10
  },
  messages: {
    // Total messages exchanged in the first year.
    total: 47_312,
  },
  trips: {
    // The two trips taken together in the first year. Each entry carries
    // its own accent color so the ping on the mini-map matches the bullet
    // in the list.
    destinations: [
      { name: "Ilhabela, SP", color: "#FF7A5A" },
      { name: "Paraty, RJ", color: "#FFE07A" },
    ],
    label: "LITORAL SUDESTE",
  },
  song: {
    title: "Harleys in Hawaii",
    artist: "Katy Perry",
    coverSrc: "/covers/harleys-in-hawaii.jpg",
    // A line about the song rather than a lyric quote.
    verse: "a que toca e a gente se olha antes do refrão",
  },
  photos: {
    // Approximate count shown in the "Fotos juntos" slide. Hardcoded so you
    // can drop a curated 12 symbolic photos in the collage below without
    // forcing the count to match any folder size.
    countLabel: "412+",
    // The 12 paths used by the floating collage on PhotosCountStory.
    // Explicit list (not generated) so individual slots can be swapped
    // without renaming files on disk.
    collage: [
      "/photos/dates/photo-1.jpeg",
      "/photos/random/photo-5.jpeg",
      "/photos/first-trip/photo-1.jpeg",
      "/photos/dates/photo-4.jpeg",
      "/photos/random/photo-2.jpeg",
      "/photos/first-trip/photo-2.jpeg",
      "/photos/dates/photo-6.jpeg",
      "/photos/random/photo-9.jpeg",
      "/photos/dates/photo-3.jpeg",
      "/photos/random/photo-7.jpeg",
      "/photos/first-trip/photo-4.jpeg",
      "/photos/dates/photo-9.jpeg",
    ],
  },
  favPhoto: {
    // Path to the single full-bleed photo of the slide.
    src: "/photos/fav-photo.jpeg",
    caption: "café da manhã às três da tarde",
  },
  whatsNext: {
    phrase: "e o melhor ainda nem começou.",
    backLabel: "voltar pro site",
  },
} as const;
