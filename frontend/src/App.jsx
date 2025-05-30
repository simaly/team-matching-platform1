import { Routes, Route, useNavigate } from 'react-router-dom'
import ProjectDetails from './ProjectDetails'
import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = 'https://team-matching-backend1.onrender.com'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
  }, [darkMode])

  return (
    <div className="container">
      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button onClick={() => setDarkMode(!darkMode)}>
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

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
  const [userInterest, setUserInterest] = useState('')

  const fetchProjects = async () => {
    const res = await axios.get(`${API_BASE}/projects`)
    setProjects(res.data)
  }

  const handleSubmit = async () => {
    console.log("Yeni proje gönderiliyor:", {
      title,
      description,
      creator_id: creatorId,
      category
    })

    await axios.post(`${API_BASE}/projects`, {
      title,
      description,
      creator_id: creatorId,
      category
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

  const recommendedProjects = projects.filter(
    (p) =>
      userInterest &&
      p.category &&
      p.category.toLowerCase().includes(userInterest.toLowerCase())
  )

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects

  return (
    <div>
      <h1>Team Matching Platform</h1>

      <h2>Your Interest Area</h2>
      <select
        value={userInterest}
        onChange={e => setUserInterest(e.target.value)}
      >
        <option value="">Select your interest</option>
        <option value="AI">AI</option>
        <option value="Web">Web</option>
        <option value="Game">Game</option>
      </select>

      {userInterest && (
        <div>
          <h2>Recommended Projects for You</h2>
          {recommendedProjects.length > 0 ? (
            recommendedProjects.map(p => (
              <div
                className="project-card"
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <h3>{p.title} <span style={{ color: '#aaa' }}>({p.category})</span></h3>
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            <p>No matching projects found.</p>
          )}
        </div>
      )}

      <h2>Create Project</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
        placeholder="Creator User ID"
        value={creatorId}
        onChange={e => setCreatorId(e.target.value)}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="AI">AI</option>
        <option value="Web">Web</option>
        <option value="Game">Game</option>
      </select>
      <button onClick={handleSubmit}>Add Project</button>

      <h2>Filter by Category</h2>
      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="">All</option>
        <option value="AI">AI</option>
        <option value="Web">Web</option>
        <option value="Game">Game</option>
      </select>

      <h2>Projects</h2>
      {filteredProjects.map(p => (
        <div
          className="project-card"
          key={p.id}
          onClick={() => navigate(`/projects/${p.id}`)}
        >
          <h3>{p.title} <span style={{ color: '#aaa' }}>({p.category})</span></h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  )
}

export default App