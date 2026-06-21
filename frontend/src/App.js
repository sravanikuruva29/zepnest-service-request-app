import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [requests, setRequests] = useState([]);

  // Fetch requests
  const fetchRequests = () => {
    fetch("http://localhost:5000/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Add request
  const addRequest = async () => {
    await fetch("http://localhost:5000/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        address,
        preferredTime,
      }),
    });

    fetchRequests();

    setTitle("");
    setDescription("");
    setCategory("");
    setAddress("");
    setPreferredTime("");
  };

  // Delete request
  const deleteRequest = async (id) => {
    await fetch(`http://localhost:5000/requests/${id}`, {
      method: "DELETE",
    });

    fetchRequests();
  };

  // Update status
  const markCompleted = async (id) => {
    await fetch(`http://localhost:5000/requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Completed",
      }),
    });

    fetchRequests();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Service Request Application</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Preferred Time"
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
      />
      <br />
      <br />

      <button onClick={addRequest}>Create Request</button>

      <hr />

      <h1>All Requests</h1>

      {requests.map((r) => (
        <div key={r.id}>
          <h2>{r.title}</h2>

          <p>{r.description}</p>

          <p>
            <b>Category:</b> {r.category}
          </p>

          <p>
            <b>Address:</b> {r.address}
          </p>

          <p>
            <b>Preferred Time:</b> {r.preferredTime}
          </p>

          <p>
            <b>Status:</b> {r.status}
          </p>

          <button onClick={() => markCompleted(r.id)}>
            Mark Completed
          </button>

          <button
            onClick={() => deleteRequest(r.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;