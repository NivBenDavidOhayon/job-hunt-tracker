// client/src/components/AppLogo.jsx
function AppLogo({ align = 'left', size = 'md' }) {
    const mainFontSize =
      size === 'lg' ? '1.75rem' : size === 'sm' ? '1.1rem' : '1.4rem';
  
    const subtitleFontSize =
      size === 'lg' ? '0.9rem' : size === 'sm' ? '0.75rem' : '0.8rem';
  
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
          alignItems: align === 'center' ? 'center' : 'flex-start',
        }}
      >
        <span
          style={{
            fontSize: mainFontSize,
            fontWeight: 800,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            background:
              'linear-gradient(120deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Job Hunt Tracker
        </span>
        <span
          style={{
            fontSize: subtitleFontSize,
            color: '#6b21a8',
            opacity: 0.8,
          }}
        >
          Stay on top of your applications
        </span>
      </div>
    );
  }
  
  export default AppLogo;
  