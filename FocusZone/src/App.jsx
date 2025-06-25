import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const appRef = useRef();

  useEffect(() => {
    const timer = isRunning && timeLeft > 0 ? setInterval(() => setTimeLeft(t => t - 1), 1000) : null;
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { text: taskInput.trim(), done: false }]);
    setTaskInput("");
  };

  const toggleTaskStatus = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const clearTasks = () => setTasks([]);

  const takeScreenshot = async () => {
    const canvas = await html2canvas(appRef.current);
    const link = document.createElement("a");
    link.download = "focuszone.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div ref={appRef} className={`container ${darkMode ? "dark" : ""}`}>
      <div className="top-bar">
        <div className="logo">FocusZone</div>
        <div className="nav-actions">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>


          <button onClick={takeScreenshot} className="screenshot-btn">📸</button>
        </div>

      </div>

      <section className="section">
        <h2>Today's Tasks</h2>
        <div className="input-box">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add a task..."
          />
          <button onClick={addTask}>Add</button>
        </div>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={task.done ? "done" : ""}
              onClick={() => toggleTaskStatus(index)}
            >
              {task.done ? "✔️" : "⏳"} {task.text}
            </li>
          ))}
        </ul>
        {tasks.length > 0 && (
          <button onClick={clearTasks} style={{ marginTop: "10px" }}>Clear All</button>
        )}
      </section>

      <section className="section">
        <h2>Focus Timer</h2>
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="buttons">
          <button onClick={() => setIsRunning(true)}>Start</button>
          <button onClick={() => setIsRunning(false)}>Pause</button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(1500);
            }}
          >Reset</button>
        </div>
      </section>
    </div>
  );
}

export default App;
