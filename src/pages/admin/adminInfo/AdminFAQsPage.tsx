import FAQsManager from "./FAQsManager";

const AdminFAQsPage = () => {
  return (
    <div style={{ padding: '2rem', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: 0 }}>
          FAQs Management
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Manage frequently asked questions organized by category
        </p>
      </div>
      <FAQsManager />
    </div>
  );
};

export default AdminFAQsPage;

