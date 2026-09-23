import "./App.css";
import { data } from "./lib/timeline/data";
import TimelineMap from "./lib/timeline/components/TimelineMap";

function App() {
  return (
    <>
      <main className="main">
        <TimelineMap data={data} />
      </main>
    </>
  );
}

export default App;
