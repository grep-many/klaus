import { Canvas } from "@react-three/fiber";
import { Experience, UI } from "./components";

const App = () => (
  <>
    <UI />
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  </>
);

export default App;
