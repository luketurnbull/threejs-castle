import Castle from "./components/castle";
import { useAppStore } from "./store";
import ControlPanel from "./components/control-panel";
import { LoadingStep } from "./store/app-store";

function App() {
  const loadingStep = useAppStore((state) => state.loadingStep);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Castle />

      {loadingStep >= LoadingStep.LOADING_COMPLETE && <ControlPanel />}
    </div>
  );
}

export default App;
