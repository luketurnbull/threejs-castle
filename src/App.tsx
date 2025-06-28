import Castle from "./components/castle";
import ControlPanel from "./components/control-panel";
import LoadingOverlay from "./components/loading-overlay";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Castle />
      <ControlPanel />
      <LoadingOverlay />
    </div>
  );
}

export default App;
