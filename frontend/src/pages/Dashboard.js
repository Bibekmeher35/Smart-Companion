import { saveUser } from "../utils/storage";

export default function Dashboard({ session }) {
  const { username, key, userData } = session;

  function completeTask() {
    userData.progress.tasksCompleted += 1;
    userData.progress.currentStreak += 1;

    saveUser(username, key, userData);
  }

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <button onClick={completeTask}>Mark Step Done</button>
    </div>
  );
}