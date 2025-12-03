import { useEffect, useState } from 'react';
import api from '../../api';

function Dashboard({ onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    positionTitle: '',
    link: '',
    status: 'Applied',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/jobs');
        setJobs(response.data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to load jobs.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await api.post('/jobs', form);
      setJobs((prev) => [response.data, ...prev]);
      setForm({
        companyName: '',
        positionTitle: '',
        link: '',
        status: 'Applied',
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create job.';
      setError(message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Dashboard</h1>
        {onLogout && (
          <button style={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        )}
      </div>

      <p>Welcome to your Job Hunt Tracker Dashboard!</p>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Add Job</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Company Name</label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            style={styles.input}
            placeholder="Company"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Position Title</label>
          <input
            name="positionTitle"
            value={form.positionTitle}
            onChange={handleChange}
            style={styles.input}
            placeholder="Role"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Link</label>
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            style={styles.input}
            placeholder="Job posting URL"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>
          Add Job
        </button>
      </form>

      <h2 style={styles.jobsTitle}>Your Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs yet. Add your first one!</p>
      ) : (
        <ul style={styles.jobsList}>
          {jobs.map((job) => (
            <li key={job.id} style={styles.jobItem}>
              <div style={styles.jobHeader}>
                <strong>{job.positionTitle}</strong> @ {job.companyName}
              </div>
              {job.link && (
                <div>
                  <a href={job.link} target="_blank" rel="noreferrer">
                    View posting
                  </a>
                </div>
              )}
              <div>Status: {job.status}</div>
              <div>
                Created:{' '}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleString()
                  : 'Unknown'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    fontWeight: '500',
  },
  form: {
    marginTop: '1.5rem',
    marginBottom: '2rem',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  error: {
    padding: '0.75rem',
    marginBottom: '1rem',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    border: '1px solid #fcc',
  },
  jobsTitle: {
    marginBottom: '0.75rem',
  },
  jobsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  jobItem: {
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '6px',
    marginBottom: '0.75rem',
    backgroundColor: '#fafafa',
  },
  jobHeader: {
    marginBottom: '0.25rem',
  },
};

export default Dashboard;
