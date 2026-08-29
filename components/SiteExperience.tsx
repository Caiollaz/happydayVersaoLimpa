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
import { useSiteConfig } from "@/lib/config/context";

/**
 * The published site, top to bottom.
 *
 * Takes no props: everything it renders comes from the SiteConfig in
 * context, which is what makes one codebase serve every couple. The only
 * state here is the two things a config can't express — whether the
 * visitor has started, and whether the retrospective is open.
 */
export function SiteExperience() {
  const { player, retro } = useSiteConfig();
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
        audioSrc={player.audioSrc}
        title={player.trackTitle}
        artist={player.trackArtist}
        covers={player.covers}
      />

      <AboutUsCard />

      <MessageCard />

      <MiniCardsSection />

      {retro.enabled && (
        <>
          <RetrospectivaCard onStart={() => setRetroOpen(true)} />

          {/* Full-screen Wrapped-style retrospective. Opens on the card's
            CTA; crossfades the site audio into the retro track while open. */}
          <StoryPlayer
            open={retroOpen}
            onClose={() => setRetroOpen(false)}
            mainPlayerRef={playerRef}
            retroAudioSrc={retro.audioSrc}
          />
        </>
      )}

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
