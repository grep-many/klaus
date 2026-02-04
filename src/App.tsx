import { Canvas } from "@react-three/fiber";
import { Experience } from "./components";

const App = () => (
  <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
    <color attach="background" args={["#ececec"]} />
    <Experience />
  </Canvas>
);

export default App;
