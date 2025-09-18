import { useState, useEffect } from 'react';
import { Button, Form, Card, Modal } from 'react-bootstrap';

export default function Workout() {
  const [workouts, setWorkouts] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');

  const token = localStorage.getItem('token');

  // ✅ fetch workouts (GET /workouts/getMyWorkouts)
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:4000/workouts/getMyWorkouts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch workouts");
        return res.json();
      })
      .then(data => {
        console.log("Fetched workouts:", data); // 👀 debug response

        // ✅ Normalize data into an array
        if (Array.isArray(data)) {
          setWorkouts(data);
        } else if (data.workouts && Array.isArray(data.workouts)) {
          setWorkouts(data.workouts);
        } else if (data) {
          setWorkouts([data]);
        } else {
          setWorkouts([]);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, [token]);

  // ✅ add workout (POST /workouts/addWorkout)
  function addWorkout(e) {
    e.preventDefault();

    fetch('http://localhost:4000/workouts/addWorkout', {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, duration, status })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save workout");
        return res.json();
      })
      .then(data => {
        console.log("Workout added:", data); // 👀 debug
        setWorkouts(prev => [...prev, data]); // append new workout
        setShow(false);
        setName('');
        setDuration('');
        setStatus('');
      })
      .catch(err => console.error("Add workout error:", err));
  }

  return (
    <div>
      <h1 className="my-4 text-center">My Workouts</h1>
      <Button id="addWorkout" onClick={() => setShow(true)}>Add Workout</Button>

      <div className="mt-4">
        {workouts.length === 0 ? (
          <p>No workouts yet.</p>
        ) : (
          workouts.map((w, index) => (
            <Card key={index} className="mb-2">
              <Card.Body>
                <Card.Title>{w.name}</Card.Title>
                <Card.Text>
                  Duration: {w.duration} mins <br />
                  Status: {w.status} <br />
                  Date: {w.dateAdded}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addWorkout}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control 
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control 
                value={status}
                onChange={e => setStatus(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
