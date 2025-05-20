import { Route, Routes } from "react-router";
import "./App.css";
import { GeneralAnalysis } from "./components/pages/general-analysis/general-analysis";
import { MainMenu } from "./components/pages/main-menu/main-menu";
import { ReversalAnalysis } from "./components/pages/reversal-analysis/reversal-analysis";
import { ReversaReclassificationAnalysis } from "./components/pages/reversal-reclassification-analysis/reversal-reclassification-analysis";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainMenu />} path="/" />
        <Route element={<GeneralAnalysis />} path="/general-analysis" />
        <Route element={<ReversalAnalysis />} path="/reversal-analysis" />
        <Route
          element={<ReversaReclassificationAnalysis />}
          path="/reversal-reclassification-analysis"
        />
      </Routes>
    </>
  );
}

export default App;
