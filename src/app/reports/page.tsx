'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import * as XLSX from 'xlsx'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('')
  const [reportData, setReportData] = useState<any[]>([])

  const fetchReport = async (type: string) => {
    let endpoint = ''
    if (type === 'removed-sale') endpoint = '/api/reports/removed-sale'
    if (type === 'removed-damaged') endpoint = '/api/reports/removed-damaged'
    if (type === 'by-category') endpoint = '/api/reports/by-category'

    const res = await fetch(endpoint)
    const data = await res.json()
    setReportData(data)
  }
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
  
    XLSX.writeFile(workbook, `${selectedReport || 'report'}.xlsx`)
  }
  



  
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Reports</h1>

        <select
          className="w-full border border-gray-300 p-3 rounded"
          value={selectedReport}
          onChange={(e) => {
            const type = e.target.value
            setSelectedReport(type)
            fetchReport(type)
          }}
        >
          <option value="">Select a report type</option>
          <option value="removed-sale">Removed Items (For Sale)</option>
          <option value="removed-damaged">Removed Items (Damaged)</option>
          <option value="by-category">Items by Category</option>
        </select>

        {reportData.length > 0 && (
          <>
            <div className="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded border">
              <pre className="text-sm">{JSON.stringify(reportData, null, 2)}</pre>
            </div>
            {reportData.length > 0 && (
            <button
                onClick={downloadExcel}
                className="bg-[#3F3751] text-white px-6 py-2 rounded hover:opacity-90"
            >
                Download Excel
            </button>
            )}

          </>
        )}
      </div>
    </div>
  )
}
