import React from "react";
import Header69 from "../components/Header69.jsx";
import  Layout1  from "./components/Layout1.jsx";

export default function Page() {
  return (
    <div>
      <Header69
        imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2100&h=900&q=80"
        title="About CAP"
        subtitle="Learn about our mission, vision, and the people behind the Center of Alternative Perspectives."
      />
      <Layout1 />
    </div>
  );
}
