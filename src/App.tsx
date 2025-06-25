import Castle from "./components/castle";
import ControlPanel from "./components/control-panel";

function App() {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Castle />
      <ControlPanel />
    </div>
  );
}

export default App;
