import { useEffect, useState } from 'react';
import api from '../../api';
import AppLogo from '../../components/AppLogo';

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
  const [cvFile, setCvFile] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [modalStatus, setModalStatus] = useState('Applied');

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

  useEffect(() => {
    if (selectedJob) {
      setModalStatus(selectedJob.status || 'Applied');
    }
  }, [selectedJob]);

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
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to delete job.';
      setError(message);
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedJob) return;
    try {
      setError('');
      const response = await api.patch(`/jobs/${selectedJob.id}`, {
        status: modalStatus,
      });

      const updated = response.data;

      setJobs((prev) =>
        prev.map((job) => (job.id === updated.id ? updated : job))
      );
      setSelectedJob(updated);
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

      const token = localStorage.getItem('token');
      const headers = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await api.post(`/jobs/${jobId}/cv`, formData, { headers });

      const updatedJob = response.data;

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updatedJob : job))
      );

      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(updatedJob);
      }

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

  const formatDate = (value) => {
    if (!value) return 'Unknown';
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  };

  const renderAiField = (label, value) => (
    <div style={{ marginBottom: '0.35rem' }}>
      <span style={{ fontWeight: 600 }}>{label}: </span>
      <span>{value || '—'}</span>
    </div>
  );

  const renderAiTags = (value) => {
    if (!value) return '—';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <AppLogo />
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
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeaderCell}>Company</th>
                <th style={styles.tableHeaderCell}>Position</th>
                <th style={styles.tableHeaderCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  style={styles.tableRow}
                  onClick={() => setSelectedJob(job)}
                >
                  <td style={styles.tableCell}>{job.companyName}</td>
                  <td style={styles.tableCell}>{job.positionTitle}</td>
                  <td style={styles.tableCell}>
                    <span style={getStatusStyle(job.status)}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedJob && (
            <div
              style={styles.modalBackdrop}
              onClick={() => setSelectedJob(null)}
            >
              <div
                style={styles.modalCard}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.modalHeaderRow}>
                  <div>
                    <div style={styles.modalTitle}>
                      {selectedJob.positionTitle || 'Job'}
                    </div>
                    <div style={styles.modalSubtitle}>
                      {selectedJob.companyName || '—'}
                    </div>
                  </div>
                  <button
                    style={styles.modalCloseIcon}
                    onClick={() => setSelectedJob(null)}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <div style={styles.modalMetaRow}>
                  <span style={getStatusStyle(selectedJob.status || 'Applied')}>
                    {selectedJob.status || 'Applied'}
                  </span>
                  <span style={styles.modalDate}>
                    {formatDate(selectedJob.createdAt)}
                  </span>
                </div>

                <div style={styles.modalSection}>
                  <div style={styles.modalSectionTitle}>Job link</div>
                  <div style={styles.modalSectionBody}>
                    {selectedJob.link ? (
                      <a
                        href={selectedJob.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open job posting
                      </a>
                    ) : (
                      'No link'
                    )}
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <div style={styles.modalSectionTitle}>CV</div>
                  <div style={styles.modalSectionBody}>
                    {selectedJob.cvUrl ? (
                      <a
                        href={selectedJob.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View uploaded CV
                      </a>
                    ) : (
                      'No CV uploaded'
                    )}
                  </div>
                </div>

                {/* AI fields */}
                <div style={styles.modalSection}>
                  <div style={styles.modalSectionTitle}>AI Insights</div>
                  <div style={styles.modalDescriptionBox}>
                    {renderAiField('AI Level', selectedJob.aiLevel)}
                    {renderAiField('AI Tags', renderAiTags(selectedJob.aiTags))}
                    {renderAiField('Job Type', selectedJob.aiJobType)}
                    {renderAiField('Role Summary', selectedJob.aiSummaryRole)}
                    {renderAiField('Tech Summary', selectedJob.aiSummaryTech)}
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <div style={styles.modalSectionTitle}>Status</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      style={styles.modalSelect}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      type="button"
                      style={styles.modalSaveButton}
                      onClick={handleSaveStatus}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    style={styles.modalDeleteButton}
                    onClick={async () => {
                      await handleDelete(selectedJob.id);
                      setSelectedJob(null);
                    }}
                  >
                    Delete job
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2.5rem 1.5rem 3rem',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    maxWidth: '960px',
    margin: '0 auto',
    background:
      'radial-gradient(circle at top left, #f3e8ff 0, #faf5ff 35%, #ffffff 70%)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  logoutButton: {
    padding: '0.5rem 1.1rem',
    borderRadius: '999px',
    border: '1px solid #e5defc',
    backgroundColor: '#f5f3ff',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.85rem',
    color: '#4c1d95',
    boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.04)',
  },

  form: {
    marginTop: '1.5rem',
    marginBottom: '2rem',
    padding: '1.75rem 1.5rem',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.12)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.45rem',
    fontWeight: 500,
    fontSize: '0.85rem',
    color: '#4b3b81',
  },
  input: {
    width: '100%',
    padding: '0.55rem 0.7rem',
    borderRadius: '10px',
    border: '1px solid #e2e0f5',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    backgroundColor: '#fdfbff',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.7rem 1.6rem',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    boxShadow: '0 12px 30px rgba(124, 58, 237, 0.35)',
  },
  error: {
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '10px',
    border: '1px solid #fecaca',
    fontSize: '0.85rem',
  },
  jobsTitle: {
    marginBottom: '0.35rem',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '0.75rem',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
    backgroundColor: '#ffffff',
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '0.7rem 0.9rem',
    borderBottom: '1px solid #e5defc',
    fontSize: '0.8rem',
    fontWeight: 600,
    background: 'linear-gradient(to right, #f5f3ff, #ede9fe)',
    color: '#5b21b6',
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  tableCell: {
    padding: '0.7rem 0.9rem',
    borderBottom: '1px solid #f3f0ff',
    fontSize: '0.88rem',
    verticalAlign: 'top',
  },

  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '1.7rem 1.6rem',
    width: '90%',
    maxWidth: '560px',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.45)',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.9rem',
  },
  modalTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    color: '#1e1b4b',
  },
  modalSubtitle: {
    fontSize: '0.9rem',
    color: '#6b5ca5',
  },
  modalCloseIcon: {
    border: 'none',
    background: 'transparent',
    fontSize: '1.4rem',
    cursor: 'pointer',
    lineHeight: 1,
    color: '#4c1d95',
  },
  modalMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '0.5rem',
  },
  modalDate: {
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  modalSection: {
    marginBottom: '1rem',
  },
  modalSectionTitle: {
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    color: '#4c1d95',
  },
  modalSectionBody: {
    fontSize: '0.9rem',
    color: '#111827',
    wordBreak: 'break-word',
  },
  modalDescriptionBox: {
    fontSize: '0.85rem',
    color: '#111827',
    backgroundColor: '#f5f3ff',
    borderRadius: '12px',
    padding: '0.75rem 0.8rem',
    maxHeight: '220px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.4,
    border: '1px solid #e5defc',
  },
  modalSelect: {
    padding: '0.35rem 0.6rem',
    borderRadius: '999px',
    border: '1px solid #e2e0f5',
    fontSize: '0.85rem',
    backgroundColor: '#fdfbff',
  },
  modalSaveButton: {
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    boxShadow: '0 10px 25px rgba(124, 58, 237, 0.35)',
  },
  modalFooter: {
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalDeleteButton: {
    padding: '0.45rem 0.9rem',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
};

export default Dashboard;
