import { useEffect, useState } from "react";
import { getAllApplicationsAdmin } from "../../services/application.service";
import type{ Application } from "../../auth-types/application.types";

const AdminApplicationsPage = () => {
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllApplicationsAdmin();
        setAllApps(data.applications);
      } catch (error) {
        console.error("Admin fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div>Loading System-wide Applications...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>System Oversight: All Applications</h2>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#333", color: "white" }}>
            <th>ID</th>
            <th>Tenant</th>
            <th>Property</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {allApps.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.tenant?.name}</td>
              <td>{app.property?.title}</td>
              <td>{app.status}</td>
              <td>{new Date(app.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminApplicationsPage;