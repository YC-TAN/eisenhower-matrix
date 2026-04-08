import MatrixPage from "./pages/MatrixPage";
import Notification from './components/Notification'
import { TaskProvider } from "./context/TaskContext";

function App() {

  return (
    <>
      <TaskProvider>
        <div className="app-main">
          <Notification />
          <MatrixPage/>
        </div>
      </TaskProvider>
    </>
  );
}

export default App;
