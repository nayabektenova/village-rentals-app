'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Search } from 'lucide-react'

type Category = {
  id: number
  description: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ id: '', description: '' })
  const [search, setSearch] = useState('')

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: parseInt(form.id),
        description: form.description,
      }),
    })
    resetForm()
    fetchCategories()
  }

  const handleUpdate = async () => {
    await fetch(`/api/categories/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: form.description }),
    })
    resetForm()
    fetchCategories()
  }

  const handleRemove = async (id: number) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    resetForm()
    fetchCategories()
  }

  const handleSelect = (cat: Category) => {
    setForm({ id: cat.id.toString(), description: cat.description })
  }

  const resetForm = () => {
    setForm({ id: '', description: '' })
  }

  const filtered = categories.filter((cat) =>
    cat.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
        {/* Category List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Categories List:</h2>
          <div className="bg-[#E5E4E9] p-6 rounded-xl shadow space-y-4">
            

            {/* Search */}
            <div className="mb-4 flex items-center gap-4">
              <input
                className="border border-gray-300 p-2 rounded w-full max-w-sm"
                placeholder="Search by description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-600" />
            </div>

            {filtered.map((cat) => (
              <div key={cat.id} className="flex justify-between items-start bg-white p-4 rounded-md shadow-sm hover:shadow-md transition">
                <div>
                  <p className="font-semibold text-lg">Category ID: {cat.id}</p>
                  <p className="text-sm text-gray-700">Description: {cat.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSelect(cat)}
                    className="bg-[#3F3751] text-white text-sm px-3 py-1 rounded hover:opacity-90"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleRemove(cat.id)}
                    className="bg-[#3F3751] text-white text-sm px-3 py-1 rounded hover:opacity-90"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Category Form */}
        <div className="bg-[#E5E4E9] p-6 rounded-xl shadow-md w-full md:w-[90%] max-w-2xl mx-auto self-start">
          <h2 className="text-lg font-semibold mb-3 text-center">Category Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-left">Category ID:</label>
              <input
                className="w-full p-2 rounded border border-gray-400 bg-E5E4E9"
                type="number"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={categories.some((c) => c.id === Number(form.id))}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-left">Category Description:</label>
              <input
                className="w-full p-2 rounded border border-gray-400 bg-E5E4E9"
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4 justify-center pt-2">
              {categories.some((c) => c.id === Number(form.id)) ? (
                <button
                  onClick={handleUpdate}
                  className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Add
                </button>
              )}
              <button
                onClick={resetForm}
                className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
