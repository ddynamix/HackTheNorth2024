import './App.css';
import SingleFileUploader from './components/fileupload';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PERCEIV/IO</h1>
      </header>
      
      <main className="app-main">
      <h2>Upload your MP4 File</h2>
        <SingleFileUploader />
      </main>
      <footer className="app-footer">
      </footer>
    </div>
  );
}

export default App;
