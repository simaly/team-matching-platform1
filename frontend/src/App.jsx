import { Routes, Route, useNavigate } from 'react-router-dom'
import ProjectDetails from './ProjectDetails'
import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = 'https://team-matching-backend.onrender.com'

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </div>
  )
}

function MainPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creatorId, setCreatorId] = useState('')
  const [category, setCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const fetchProjects = async () => {
    const res = await axios.get(`${API_BASE}/projects`)
    setProjects(res.data)
  }

  const handleSubmit = async () => {
    await axios.post(`${API_BASE}/projects`, {
      title,
      description,
      creator_id: creatorId,
      category,
    })
    setTitle('')
    setDescription('')
    setCreatorId('')
    setCategory('')
    fetchProjects()
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div>
      <h1>Team Matching Platform</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><br />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br />
      <input placeholder="Creator ID" value={creatorId} onChange={e => setCreatorId(e.target.value)} /><br />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="AI">AI</option>
        <option value="Web">Web</option>
        <option value="Game">Game</option>
      </select><br />
      <button onClick={handleSubmit}>Add Project</button>

      <h2>Filter by Category</h2>
      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="">All</option>
        <option value="AI">AI</option>
        <option value="Web">Web</option>
        <option value="Game">Game</option>
      </select>

      <h2>Projects</h2>
      {projects
        .filter(p => !selectedCategory || p.category === selectedCategory)
        .map(p => (
          <div className="project-card" key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
            <h3>{p.title} <span style={{ color: '#666' }}>({p.category})</span></h3>
            <p>{p.description}</p>
          </div>
        ))}
    </div>
  )
}

export default App