"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductEdit({ params }) {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [form, setForm] = useState({ _id: params.id, code: "", name: "", description: "", price: 0, category: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/product/${params.id}`, { cache: "no-store" }),
          fetch(`${API_BASE}/category`),
        ]);
        const p = await pRes.json();
        const c = await cRes.json();
        setCategories(c);
        setForm({
          _id: p._id,
          code: p.code ?? "",
          name: p.name ?? "",
          description: p.description ?? "",
          price: p.price ?? 0,
          category: typeof p.category === "object" ? p.category._id : p.category ?? "",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [API_BASE, params.id]);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/product`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert("Update failed");
      return;
    }
    router.push("/product");
  }

  if (loading) return <div className="m-4">Loading...</div>;

  return (
    <div className="m-4">
      <h1 className="text-2xl mb-4">Edit Product</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4 max-w-xl">
        <label>Code</label>
        <input className="border border-black p-1" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />

        <label>Name</label>
        <input className="border border-black p-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label>Description</label>
        <textarea className="border border-black p-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <label>Price</label>
        <input type="number" className="border border-black p-1" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />

        <label>Category</label>
        <select className="border border-black p-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div className="col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
          <button type="button" onClick={() => router.push("/product")} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
