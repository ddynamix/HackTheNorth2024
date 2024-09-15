import './App.css';
import SingleFileUploader from './components/fileupload';
import LogoHTN from './assets/LogoHTN.png'; // Make sure to update the path to the actual location of your logo file

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src={LogoHTN} alt="PERCEIV/IO Logo" />
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