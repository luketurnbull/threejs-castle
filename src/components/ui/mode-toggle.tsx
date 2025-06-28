import { useAppStore } from "../../store";

export function ModeToggle() {
  const mode = useAppStore((state) => state.mode);
  const setDay = useAppStore((state) => state.setDay);
  const setNight = useAppStore((state) => state.setNight);

  if (mode === "day") {
    return <button onClick={setNight}>Night</button>;
  }

  return <button onClick={setDay}>Day</button>;
}
