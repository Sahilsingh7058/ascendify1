import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch {
      setStatus("Failed to send message.");
    }
  };

  return (
    <div
      className="container py-20 flex flex-col items-center justify-center min-h-[70vh]"
      style={{ backgroundColor: "#020817" }}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 shadow-2xl rounded-2xl p-10">
        {/* Contact Info Section */}
        <div className="flex flex-col justify-center items-start px-2 text-white">
          <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Get in Touch With Us
          </h1>
          <p className="mb-6 text-blue-100 text-lg">
            We’d love to hear from you! Whether you’re a student, parent, or partner, our team is here to answer your questions and guide you with your career.
          </p>
          <div className="space-y-4 text-base">
            <div>
              <span className="font-semibold text-cyan-300">📍 Address:</span><br />
              Nashik, Maharashtra, India
            </div>
            <div>
              <span className="font-semibold text-cyan-300">📞 Phone:</span><br />
              <a href="tel:+918904503023" className="hover:underline text-blue-300">+91 8904503023</a>
            </div>
            <div>
              <span className="font-semibold text-cyan-300">✉️ Email:</span><br />
              <a href="mailto:support@ascendify.com" className="hover:underline text-blue-300">support@ascendify.com</a>
            </div>
          </div>
        </div>
        {/* Contact Form Section */}
        <div className="rounded-xl p-6 shadow-lg bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
          <h2 className="text-2xl font-bold text-center mb-2 text-cyan-300">Contact Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-4 py-2 border border-cyan-700 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition placeholder:text-cyan-400"
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full px-4 py-2 border border-cyan-700 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition placeholder:text-cyan-400"
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="w-full px-4 py-2 border border-cyan-700 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition placeholder:text-cyan-400"
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
            <button
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition"
              type="submit"
              disabled={status === "Sending..."}
            >
              {status === "Sending..." ? "Sending..." : "Send Message"}
            </button>
          </form>
          {status && (
            <div className="mt-4 text-center text-green-300 font-medium">{status}</div>
          )}
        </div>
      </div>
    </div>
  );
}