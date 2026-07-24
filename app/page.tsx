import type { Metadata } from "next";
import { GameApp } from "./GameApp";

export const metadata: Metadata = {
  title: "Berlin-Akte 2040",
  description:
    "Ein kollaborativer historischer Ermittlungsparcours durch fünf Epochen Berlins.",
};

export default function Home() {
  return <GameApp />;
}
