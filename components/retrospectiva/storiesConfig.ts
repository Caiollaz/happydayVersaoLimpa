import type { ComponentType } from "react";
import { IntroStory } from "./stories/IntroStory";
import { WhereStartedStory } from "./stories/WhereStartedStory";
import { MovieStory } from "./stories/MovieStory";
import { DaysTogetherStory } from "./stories/DaysTogetherStory";
import { MessagesStory } from "./stories/MessagesStory";
import { TripsStory } from "./stories/TripsStory";
import { OurSongStory } from "./stories/OurSongStory";
import { PhotosCountStory } from "./stories/PhotosCountStory";
import { FavPhotoStory } from "./stories/FavPhotoStory";
import { PosterStory } from "./stories/PosterStory";
import { WhatsNextStory } from "./stories/WhatsNextStory";

export interface StoryProps {
  isActive: boolean;
  /** Called by the final slide's "voltar" button to dismiss the player. */
  onClose?: () => void;
}

export interface StoryConfig {
  id: string;
  Component: ComponentType<StoryProps>;
  durationMs: number;
}

export const STORIES: StoryConfig[] = [
  { id: "intro",         Component: IntroStory,        durationMs: 6000 },
  { id: "where-started", Component: WhereStartedStory, durationMs: 6000 },
  { id: "movie",         Component: MovieStory,        durationMs: 6000 },
  { id: "days",          Component: DaysTogetherStory, durationMs: 5000 },
  { id: "messages",      Component: MessagesStory,     durationMs: 5000 },
  { id: "trips",         Component: TripsStory,        durationMs: 5000 },
  { id: "song",          Component: OurSongStory,      durationMs: 6000 },
  { id: "photos",        Component: PhotosCountStory,  durationMs: 5000 },
  { id: "fav-photo",     Component: FavPhotoStory,     durationMs: 7000 },
  { id: "poster",        Component: PosterStory,       durationMs: 7000 },
  { id: "whats-next",    Component: WhatsNextStory,    durationMs: 7000 },
];
