'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Search } from 'lucide-react'


type Rental = {
  id: number
  customerId: number
  equipmentId: number
  date: string
  rentalDate: string
  returnDate: string
  totalCost: number
}

type Equipment = {
  id: number
  name: string
  category: string
  description: string
  dailyCost: number
}

type Customer = {
  id: number
  name: string
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [form, setForm] = useState({
    id: '',
    customerId: '',
    equipmentId: '',
    date: '',
    rentalDate: '',
    returnDate: '',
    totalCost: '',
  })
  const [search, setSearch] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const fetchRentals = async () => {
    const res = await fetch('/api/rentals')
    const data = await res.json()
    setRentals(data)
  }

  const fetchEquipment = async () => {
    const res = await fetch('/api/equipment')
    const data = await res.json()
    setEquipmentList(data)
  }

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers')
    const data = await res.json()
    setCustomerList(data)
  }

  useEffect(() => {
    fetchRentals()
    fetchEquipment()
    fetchCustomers()
  }, [])

  useEffect(() => {
    const start = new Date(form.rentalDate)
    const end = new Date(form.returnDate)
    const equipment = equipmentList.find(eq => eq.id === Number(form.equipmentId))

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && equipment) {
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      const cost = days * equipment.dailyCost
      setForm(prev => ({ ...prev, totalCost: cost.toFixed(2) }))
    }
  }, [form.rentalDate, form.returnDate, form.equipmentId, equipmentList])

  const validateForm = () => {
    const newErrors = []
    const customerExists = customerList.some(c => c.id === Number(form.customerId))
    if (!form.customerId) newErrors.push('Customer ID is required')
    else if (!customerExists) newErrors.push('Customer ID does not exist')
    if (!form.equipmentId) newErrors.push('Equipment ID is required')
    if (!form.date) newErrors.push('Date is required')
    if (!form.rentalDate) newErrors.push('Rental Date is required')
    if (!form.returnDate) newErrors.push('Return Date is required')
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleAdd = async () => {
    if (!validateForm()) return
    await fetch('/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        customerId: parseInt(form.customerId),
        equipmentId: parseInt(form.equipmentId),
        totalCost: parseFloat(form.totalCost),
      }),
    })
    resetForm()
    fetchRentals()
  }
  const handleUpdate = async () => {
    if (!validateForm()) return
    await fetch(`/api/rentals/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        customerId: parseInt(form.customerId),
        equipmentId: parseInt(form.equipmentId),
        totalCost: parseFloat(form.totalCost),
      }),
    })
    resetForm()
    fetchRentals()
  }
  const handleSelect = (rental: Rental) => {
    setForm({
      id: rental.id.toString(),
      customerId: rental.customerId.toString(),
      equipmentId: rental.equipmentId.toString(),
      date: rental.date?.slice(0, 10) || '',
      rentalDate: rental.rentalDate?.slice(0, 10) || '',
      returnDate: rental.returnDate?.slice(0, 10) || '',
      totalCost: rental.totalCost.toFixed(2),
    })
  }

  const resetForm = () => {
    setForm({ id: '', customerId: '', equipmentId: '', date: '', rentalDate: '', returnDate: '', totalCost: '' })
    setErrors([])
  }

  const filtered = rentals.filter((r) =>
    r.customerId.toString().includes(search) || r.equipmentId.toString().includes(search)
  )

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-4">Rental Records:</h2>
            <div className="bg-[#E5E4E9] p-6 rounded-xl shadow space-y-4">
              <div className="mb-4 flex items-center gap-4">
                <input
                  className="border border-gray-300 p-2 rounded w-full max-w-sm"
                  placeholder="Search by Customer or Equipment ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-600" />
              </div>

              {filtered.map((rental) => (
                <div key={rental.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="font-semibold">Rental ID: {rental.id}</p>
                    <p className="text-sm">Customer: {rental.customerId} | Equipment: {rental.equipmentId}</p>
                    <p className="text-sm">{rental.rentalDate.slice(0, 10)} → {rental.returnDate.slice(0, 10)}</p>
                    <p className="text-sm">Cost: ${rental.totalCost.toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleSelect(rental)} className="bg-[#3F3751] text-white px-3 py-1 rounded-md hover:opacity-90">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#E5E4E9] p-6 rounded-xl shadow-md h-full flex flex-col justify-between">
            <h2 className="text-lg font-semibold mb-4 text-center">Rental Form</h2>

            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {errors.map((err, idx) => <p key={idx}>• {err}</p>)}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm mb-1">Customer ID <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="w-full p-2 rounded border border-gray-400"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                placeholder="Type customer ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Equipment ID <span className="text-red-500">*</span></label>
              <select
                className="w-full p-2 rounded border border-gray-400"
                value={form.equipmentId}
                onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
              >
                <option value="">Select Equipment</option>
                {equipmentList.map((e) => (
                  <option key={e.id} value={e.id}>{e.id} - {e.name}</option>
                ))}
              </select>
            </div>

            {[['Date', 'date'], ['Rental Date', 'rentalDate'], ['Return Date', 'returnDate']].map(([label, key]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm mb-1">{label} <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  className="w-full p-2 rounded border border-gray-400"
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm mb-1">Total Cost</label>
              <input
                className="w-full p-2 rounded border border-gray-400 bg-gray-100 text-gray-600"
                type="number"
                value={form.totalCost}
                readOnly
              />
            </div>

            <div className="flex gap-4 justify-center flex-wrap mt-6">
              {rentals.some((r) => r.id === Number(form.id)) ? (
                <button onClick={handleUpdate} className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90">
                  Update
                </button>
              ) : (
                <button onClick={handleAdd} className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90">
                  Add
                </button>
              )}
              <button onClick={resetForm} className="bg-[#3F3751] text-white px-4 py-2 rounded hover:opacity-90">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
