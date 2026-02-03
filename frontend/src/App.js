import logo from './logo.svg';
import './App.css';
function App() {
  const [task, setTask] = useState("");
  const [response, setResponse] = useState("");

  const sendTask = async () => {
    const res = await fetch("http://localhost:5000/decompose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    });
    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <>
      <input onChange={e => setTask(e.target.value)} />
      <button onClick={sendTask}>Break Task</button>
      <p>{response}</p>
    </>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
