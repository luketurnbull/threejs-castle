import { Button } from "./button";
import { useAppStore } from "../../store";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const mode = useAppStore((state) => state.mode);
  const setDay = useAppStore((state) => state.setDay);
  const setNight = useAppStore((state) => state.setNight);

  if (mode === "day") {
    return (
      <Button size="icon" onClick={setNight}>
        <Sun />
      </Button>
    );
  }

  return (
    <Button size="icon" onClick={setDay}>
      <Moon />
    </Button>
  );
}
