import { useEffect, useState } from 'react';
import api from '../../api';

const getStatusStyle = (status) => {
  const base = {
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 500,
  };

  switch (status) {
    case 'Interview':
      return { ...base, backgroundColor: '#e3f2fd', color: '#1565c0' };
    case 'Offer':
      return { ...base, backgroundColor: '#e8f5e9', color: '#2e7d32' };
    case 'Rejected':
      return { ...base, backgroundColor: '#ffebee', color: '#c62828' };
    default:
      return { ...base, backgroundColor: '#ede7f6', color: '#4527a0' };
  }
};

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
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('Applied');
  const [cvFile, setCvFile] = useState(null);

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
    if (!cvFile) {
      setError('Please upload a CV file for this job.');
      return;
    }

    try {
      setError('');
      const response = await api.post('/jobs', form);
      const createdJob = response.data;

      const updatedJob = await handleUploadCv(createdJob.id, cvFile);

      setJobs((prev) => [updatedJob || createdJob, ...prev]);

      setForm({
        companyName: '',
        positionTitle: '',
        link: '',
        status: 'Applied',
      });
      setCvFile(null);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create job.';
      setError(message);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    try {
      setError('');
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      if (editingJobId === jobId) {
        setEditingJobId(null);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to delete job.';
      setError(message);
    }
  };

  const handleUpdate = async (jobId) => {
    try {
      setError('');
      const response = await api.patch(`/jobs/${jobId}`, {
        status: editingStatus,
      });

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? response.data : job))
      );
      setEditingJobId(null);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update job.';
      setError(message);
    }
  };

  const handleUploadCv = async (jobId, file) => {
    if (!file) return null;
  
    try {
      setError('');
      const formData = new FormData();
      formData.append('cv', file);
  
      // נוודא שיש טוקן שנשלח ב-Authorization
      const token = localStorage.getItem('token'); // או השם שבו את שומרת את ה-JWT
  
      const headers = {};
  
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
  
      // לא מגדירים Content-Type ידנית – axios יעשה את זה לבד עבור FormData
      const response = await api.post(`/jobs/${jobId}/cv`, formData, { headers });
  
      const updatedJob = response.data;
  
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updatedJob : job))
      );
  
      return updatedJob;
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const apiDetails = err.response?.data?.details || err.response?.data?.error;
      const message =
        (apiDetails ? `${apiMessage || 'Error'}: ${apiDetails}` : apiMessage) ||
        err.message ||
        'Failed to upload CV.';
      setError(message);
      return null;
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
          <label style={styles.label}>CV File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setCvFile(file);
            }}
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
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeaderCell}>Company</th>
              <th style={styles.tableHeaderCell}>Position</th>
              <th style={styles.tableHeaderCell}>Status</th>
              <th style={styles.tableHeaderCell}>CV</th>
              <th style={styles.tableHeaderCell}>Link</th>
              <th style={styles.tableHeaderCell}>Created</th>
              <th style={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const formattedDate = job.createdAt
                ? new Date(job.createdAt).toLocaleString()
                : 'Unknown';

              return (
                <tr key={job.id}>
                  {/* Company */}
                  <td style={styles.tableCell}>{job.companyName}</td>

                  {/* Position */}
                  <td style={styles.tableCell}>{job.positionTitle}</td>

                  {/* Status */}
                  <td style={styles.tableCell}>
                    {editingJobId === job.id ? (
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span style={getStatusStyle(job.status)}>
                        {job.status}
                      </span>
                    )}
                  </td>

                  {/* CV */}
                  <td style={styles.tableCell}>
                    {editingJobId === job.id ? (
                      <>
                        {job.cvUrl && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            <a
                              href={job.cvUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View current CV
                            </a>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadCv(job.id, file);
                            }
                          }}
                        />
                      </>
                    ) : job.cvUrl ? (
                      <a href={job.cvUrl} target="_blank" rel="noreferrer">
                        View CV
                      </a>
                    ) : (
                      <span style={{ opacity: 0.6 }}>No CV</span>
                    )}
                  </td>

                  {/* Link */}
                  <td style={styles.tableCell}>
                    {job.link ? (
                      <a href={job.link} target="_blank" rel="noreferrer">
                        View posting
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Created */}
                  <td style={styles.tableCell}>{formattedDate}</td>

                  {/* Actions */}
                  <td style={styles.actionsCell}>
                    {editingJobId === job.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(job.id)}
                          style={styles.actionButton}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingJobId(null)}
                          style={styles.actionButton}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingJobId(job.id);
                            setEditingStatus(job.status || 'Applied');
                          }}
                          style={styles.actionButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          style={styles.actionButton}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '0.5rem',
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
    fontSize: '0.9rem',
    fontWeight: 600,
    backgroundColor: '#f7f7f7',
  },
  tableCell: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
    fontSize: '0.9rem',
    verticalAlign: 'top',
  },
  actionsCell: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
    fontSize: '0.9rem',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
  },
  actionButton: {
    marginRight: '0.4rem',
    padding: '0.25rem 0.6rem',
    fontSize: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
};

export default Dashboard;
