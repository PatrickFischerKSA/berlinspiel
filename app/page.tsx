import type { Metadata } from "next";
import { GameApp } from "./GameApp";

export const metadata: Metadata = {
  title: "Berlin-Akte 2040",
  description:
    "Ein kollaborativer historischer Ermittlungsparcours durch neun Stationen der Berliner Geschichte.",
};

export default function Home() {
  return <GameApp />;
}
