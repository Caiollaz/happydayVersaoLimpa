"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AnchorCard } from "@/components/cards/AnchorCard";
import {
  SpotifyPlayerCard,
  type SpotifyPlayerCardHandle,
} from "@/components/cards/SpotifyPlayerCard";
import { AboutUsCard } from "@/components/cards/AboutUsCard";
import { MessageCard } from "@/components/cards/MessageCard";
import { MiniCardsSection } from "@/components/cards/MiniCardsSection";
import { RetrospectivaCard } from "@/components/cards/RetrospectivaCard";
import { StoryPlayer } from "@/components/retrospectiva/StoryPlayer";

// Relationship started: April 5, 2025
const RELATIONSHIP_START = new Date(2025, 3, 5, 0, 0, 0);

// Rotating cover photos for the Spotify player card
const PLAYER_COVERS = [
  "/photos/player-covers/FOTO1.jpeg",
  "/photos/player-covers/FOTO2.jpeg",
  "/photos/player-covers/FOTO3.jpeg",
  "/photos/player-covers/FOTO4.jpeg",
  "/photos/player-covers/FOTO5.jpeg",
  "/photos/player-covers/FOTO6.jpeg",
  "/photos/player-covers/FOTO7.jpeg",
  "/photos/player-covers/FOTO8.jpeg",
  "/photos/player-covers/FOTO9.jpeg",
];

const ABOUT_PHOTO = "/photos/about-us.jpeg";

const LOVE_LETTER = `Ana,

Um ano atrás eu não fazia ideia de que dava pra sentir tanta falta de alguém que eu tinha acabado de conhecer. Hoje eu não consigo mais lembrar direito de como era o meu dia antes de você aparecer nele.

Cada café que virou almoço, cada filme ruim que a gente jurou que ia ser bom, cada playlist que a gente ouviu até enjoar, cada viagem, cada foto tirada no susto — tudo isso virou matéria-prima de uma história que eu quero continuar escrevendo com você por muitos e muitos anos.

Esse presente é pequeno perto de tudo que você me dá todos os dias só por existir do meu lado. Mas ele é feito com tudo que eu tenho — com o mesmo cuidado com que eu te amo.

Obrigado por ser minha parceira, meu lugar preferido no mundo.

Feliz 1 ano. Daqui 10 anos a gente volta nesse site e vê que já valia a pena desde aqui.`;

const MINI_CARDS = [
  {
    id: "dates",
    title: "Nossos dates",
    thumbnail: "/photos/dates/thumb.jpeg",
    photos: [
      "/photos/dates/photo-1.jpeg",
      "/photos/dates/photo-2.jpeg",
      "/photos/dates/photo-3.jpeg",
      "/photos/dates/photo-4.jpeg",
      "/photos/dates/photo-5.jpeg",
      "/photos/dates/photo-6.jpeg",
      "/photos/dates/photo-7.jpeg",
      "/photos/dates/photo-8.jpeg",
      "/photos/dates/photo-9.jpeg",
      "/photos/dates/photo-10.jpeg",
    ],
  },
  {
    id: "random",
    title: "Fotos aleatórias",
    thumbnail: "/photos/random/thumb.jpeg",
    photos: [
      "/photos/random/photo-1.jpeg",
      "/photos/random/photo-2.jpeg",
      "/photos/random/photo-3.jpeg",
      "/photos/random/photo-4.jpeg",
      "/photos/random/photo-5.jpeg",
      "/photos/random/photo-6.jpeg",
      "/photos/random/photo-7.jpeg",
      "/photos/random/photo-8.jpeg",
      "/photos/random/photo-9.jpeg",
    ],
  },
  {
    id: "first-trip",
    title: "Primeira viagem",
    thumbnail: "/photos/first-trip/thumb.jpeg",
    photos: [
      "/photos/first-trip/photo-1.jpeg",
      "/photos/first-trip/photo-2.jpeg",
      "/photos/first-trip/photo-3.jpeg",
      "/photos/first-trip/photo-4.jpeg",
      "/photos/first-trip/photo-5.jpeg",
    ],
  },
];

export default function Home() {
  const playerRef = useRef<SpotifyPlayerCardHandle>(null);
  const [started, setStarted] = useState(false);
  const [retroOpen, setRetroOpen] = useState(false);

  // Body scroll is locked while the AnchorCard overlay is showing. This makes
  // the landing behave like a separate screen — no peeking, no scrolling. The
  // lock is released the moment `started` flips to true, and since the
  // AnchorCard is a fixed overlay (not part of the document flow), the
  // SpotifyPlayerCard is already positioned at the top of the viewport.
  useEffect(() => {
    if (started) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [started]);

  // CTA click: kick off audio synchronously with the user gesture (required
  // by autoplay policies), then unmount the AnchorCard overlay.
  const handleStart = () => {
    if (started) return;
    playerRef.current?.play();
    setStarted(true);
  };

  return (
    <main className="relative w-full">
      <SpotifyPlayerCard
        ref={playerRef}
        audioSrc="/audio/still-loving-you.mp3"
        title="Still Loving You"
        artist="Scorpions"
        covers={PLAYER_COVERS}
      />

      <AboutUsCard photoSrc={ABOUT_PHOTO} startDate={RELATIONSHIP_START} />

      <MessageCard title="Pra você" message={LOVE_LETTER} />

      <MiniCardsSection items={MINI_CARDS} />

      <RetrospectivaCard onStart={() => setRetroOpen(true)} />

      {/* Full-screen Spotify-Wrapped-style retrospective. Opens on "Vamos lá";
        crossfades the site audio into the retro track while open. */}
      <StoryPlayer
        open={retroOpen}
        onClose={() => setRetroOpen(false)}
        mainPlayerRef={playerRef}
        retroAudioSrc="/audio/harleys-in-hawaii.mp3"
      />

      {/*
        AnchorCard is mounted as a fixed-position overlay ONLY until the user
        starts the experience. Once it unmounts, it is gone from the DOM —
        there is no way to scroll back to it.
      */}
      <AnimatePresence>
        {!started && <AnchorCard key="anchor" onStart={handleStart} />}
      </AnimatePresence>
    </main>
  );
}
