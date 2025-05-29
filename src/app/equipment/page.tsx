'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { Search } from 'lucide-react'

type Equipment = {
  id: number
  name: string
  category: string
  description: string
  dailyCost: number
}
const categoryOptions = [
  { id: '10', label: 'Power Tools' },
  { id: '20', label: 'Yard Equipment' },
  { id: '30', label: 'Compressors' },
  { id: '40', label: 'Generators' },
  { id: '50', label: 'Air Tools' },
]

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    dailyCost: '',
  })

  const fetchEquipment = async () => {
    const res = await fetch('/api/equipment')
    const data = await res.json()
    setEquipmentList(data)
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        description: form.description,
        dailyCost: parseFloat(form.dailyCost),
      }),
    })
    resetForm()
    fetchEquipment()
  }

  const handleSelect = (item: Equipment) => {
    setForm({
      id: item.id.toString(),
      name: item.name,
      category: item.category,
      description: item.description,
      dailyCost: item.dailyCost.toString(),
    })
  }

  const handleUpdate = async () => {
    const res = await fetch(`/api/equipment/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        description: form.description,
        dailyCost: parseFloat(form.dailyCost),
      }),
    })
    if (res.ok) {
      alert('Updated successfully')
      resetForm()
      fetchEquipment()
    }
  }

  const handleRemove = async (id: number, reason: 'working' | 'damaged') => {
    const res = await fetch(`/api/equipment/${id}`, {
      method: 'DELETE',
      headers: { 'x-remove-reason': reason },
    })
    if (res.ok) {
      alert(`Removed item as ${reason}`)
      fetchEquipment()
    } else {
      const err = await res.json()
      alert(`Error: ${err.error}`)
    }
  }

  const resetForm = () => {
    setForm({ id: '', name: '', category: '', description: '', dailyCost: '' })
  }

  const filteredEquipment = equipmentList.filter((eq) =>
    eq.name.toLowerCase().includes(search.toLowerCase()) ||
    eq.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-8 items-start">
        {/* Equipment List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Equipment List:</h2>
          <div className="bg-[#E5E4E9] p-6 rounded-xl shadow space-y-4">
            {/* Search inside the list */}
            <div className="mb-4 flex items-center gap-4">
              <input
                className="border border-gray-300 p-2 rounded w-full max-w-sm"
                placeholder="Search by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-600" />
            </div>

            {filteredEquipment.map((eq) => (
              <div key={eq.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center hover:shadow-md transition">
                <div>
                  <p className="font-semibold text-lg">{eq.name}</p>
                  <p className="text-sm text-gray-700">Description: {eq.description}</p>
                  <p className="text-sm text-gray-700">Category ID: {eq.category}</p>
                </div>
                <div className="flex flex-col gap-2 w-28">
                  <button
                    onClick={() => handleSelect(eq)}
                    className="bg-[#3F3751] text-white px-3 py-1 rounded text-sm w-full hover:opacity-90"
                  >
                    Select
                  </button>
                  <div className="relative">
                    <button
                      className="bg-[#3F3751] text-white px-3 py-1 rounded text-sm w-full hover:opacity-90"
                      onClick={() => {
                        const el = document.getElementById(`dropdown-${eq.id}`)
                        el?.classList.toggle('hidden')
                      }}
                    >
                      Remove ▼
                    </button>
                    <div
                      id={`dropdown-${eq.id}`}
                      className="absolute z-10 mt-1 w-40 bg-white border rounded shadow hidden"
                    >
                      <button
                        onClick={() => handleRemove(eq.id, 'working')}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-sm"
                      >
                        Working (Sold)
                      </button>
                      <button
                        onClick={() => handleRemove(eq.id, 'damaged')}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-sm"
                      >
                        Damaged
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Form */}
        <div className="bg-[#E5E4E9] p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">Equipment Information</h2>

          <label className="block mb-1 text-sm">Name:</label>
          <input
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="block mb-1 text-sm">Description:</label>
          <textarea
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label className="block mb-1 text-sm">Category ID:</label>
          <select
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.id} - {cat.label}
              </option>
            ))}
          </select>

          <label className="block mb-1 text-sm">Equipment ID:</label>
          <input
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9 text-gray-600"
            type="text"
            value={form.id}
            readOnly
          />

          <label className="block mb-1 text-sm">Daily Rate:</label>
          <input
            className="w-full mb-4 p-2 rounded border border-gray-400 bg-E5E4E9"
            type="number"
            value={form.dailyCost}
            onChange={(e) => setForm({ ...form, dailyCost: e.target.value })}
          />

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={form.id ? handleUpdate : handleAdd}
              className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90"
            >
              {form.id ? 'Update' : 'Add'}
            </button>
            <button
              onClick={resetForm}
              className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90"
            >
              Clear
            </button>
            <Link href="/reports">
              <button className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90">
                Reports
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
