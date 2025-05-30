import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = 'https://team-matching-backend.onrender.com'

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const projects = await axios.get(`${API_BASE}/projects`)
      const found = projects.data.find(p => p.id === parseInt(id))
      setProject(found)

      const apps = await axios.get(`${API_BASE}/applications`)
      const related = apps.data.filter(a => a.project_title === found.title)
      setApplicants(related)
    }

    fetch()
  }, [id])

  if (!project) return <p>Loading...</p>

  return (
    <div>
      <button onClick={() => navigate('/')}>← Back</button>
      <h2>{project.title}</h2>
      <p><strong>Category:</strong> {project.category}</p>
      <p>{project.description}</p>

      <h3>Applicants</h3>
      <ul>
        {applicants.map((a, i) => (
          <li key={i}>{a.user_name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectDetails