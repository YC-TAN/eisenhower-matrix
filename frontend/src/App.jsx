import MatrixPage from "./pages/MatrixPage";
import { TaskProvider } from "./context/TaskContext";

function App() {

  return (
    <>
      <TaskProvider>
        <div className="app-main">
          <MatrixPage/>
        </div>
      </TaskProvider>
    </>
  );
}

export default App;
