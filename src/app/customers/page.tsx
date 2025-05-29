'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Search } from 'lucide-react'

type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  banned: boolean
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [form, setForm] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    banned: false,
  })
  const [search, setSearch] = useState('')

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers')
    const data = await res.json()
    setCustomers(data)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleAdd = async () => {
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    resetForm()
    fetchCustomers()
  }

  const handleUpdate = async () => {
    await fetch(`/api/customers/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    resetForm()
    fetchCustomers()
  }

  const handleSelect = (cust: Customer) => {
    setForm({
      id: cust.id.toString(),
      firstName: cust.firstName,
      lastName: cust.lastName,
      email: cust.email,
      phone: cust.phone,
      banned: cust.banned,
    })
  }

  const resetForm = () => {
    setForm({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      banned: false,
    })
  }

  const filtered = customers.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
        {/* Left - Customer List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Customers:</h2>
          <div className="bg-[#E5E4E9] p-6 rounded-xl shadow space-y-4">
            {/* Search inside list box */}
            <div className="mb-4 flex items-center gap-4">
              <input
                className="border border-gray-300 p-2 rounded w-full max-w-sm"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-600" />
            </div>
            {filtered.map((cust) => (
              <div key={cust.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center hover:shadow-md transition">
                <div>
                  <p className="font-semibold text-lg">
                    {cust.firstName} {cust.lastName}
                  </p>
                  <p className="text-sm text-gray-700">E-mail: {cust.email}</p>
                  <p className="text-sm text-gray-700">Phone Number: {cust.phone}</p>
                </div>
                <button
                  onClick={() => handleSelect(cust)}
                  className="bg-[#3F3751] text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Right - Customer Form */}
        <div className="bg-[#E5E4E9] p-6 rounded-xl shadow-md text-center self-start">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>

          <label className="block text-sm mb-1 text-left">First Name:</label>
          <input
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <label className="block text-sm mb-1 text-left">Last Name:</label>
          <input
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <label className="block text-sm mb-1 text-left">E-mail:</label>
          <input
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block text-sm mb-1 text-left">Phone Number:</label>
          <input
            className="w-full mb-3 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label className="block text-sm mb-1 text-left">Status:</label>
          <select
            className="w-full mb-4 p-2 rounded border border-gray-400 bg-E5E4E9"
            value={form.banned ? 'banned' : 'active'}
            onChange={(e) =>
              setForm({ ...form, banned: e.target.value === 'banned' })
            }
          >
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>

          <div className="flex gap-4 justify-center flex-wrap pt-2">
            {customers.some((c) => c.id === Number(form.id)) ? (
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
  )
}
