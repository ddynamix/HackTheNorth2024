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
      <p>Note: Do not press the upload button or reload the page until after the Braille translation is finished.</p>
    </div>
  );
}

export default App;
