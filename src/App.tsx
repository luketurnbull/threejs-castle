import Castle from "./components/castle";
import ControlPanel from "./components/control-panel";
import LoadingOverlay from "./components/loading-overlay";

function App() {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Castle />
      <ControlPanel />
      <LoadingOverlay />
    </div>
  );
}

export default App;
