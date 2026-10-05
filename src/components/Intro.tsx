"use client";

import { useState } from "react";
import Envelope from "./Envelope";
import Hero from "./Hero";
import MusicButton from "./MusicButton";
import { useBackgroundMusic } from "./useBackgroundMusic";

/** Ties the envelope to the hero and the music, so both begin as the envelope opens. */
export default function Intro() {
  const [opened, setOpened] = useState(false);
  const music = useBackgroundMusic();

  // Runs inside the envelope's click handler — the user gesture browsers require before audio can start.
  const handleOpen = () => {
    setOpened(true);
    music.play();
  };

  return (
    <>
      <Envelope onOpen={handleOpen} />
      <Hero active={opened} />
      <MusicButton visible={opened && music.available} playing={music.playing} onToggle={music.toggle} />
    </>
  );
}
