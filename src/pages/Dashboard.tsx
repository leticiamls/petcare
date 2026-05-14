import React from "react";
import { Edit, Trash2, X } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Dashboard</h1>
      <section style={{ marginTop: "1.5rem" }}>
        <p>Welcome to your pet care dashboard. Monitor activity, appointments, and updates here.</p>
      </section>
      <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
        <article style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2>Upcoming Appointments</h2>
          <p>No appointments scheduled yet.</p>
        </article>
        <article style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2>Recent Activity</h2>
          <p>Track your pets' latest updates and care history.</p>
        </article>
      </div>
    </main>
  );
};

export default Dashboard;
