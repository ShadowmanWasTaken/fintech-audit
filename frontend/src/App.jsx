import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    LIMIT_BAL_USD: 1500,
    SEX: 2,
    EDUCATION: 2,     
    MARRIAGE: 1,      
    AGE: 35,
    PAY_1: 0, PAY_2: 0, PAY_3: 0, PAY_4: 0, PAY_5: 0, PAY_6: 0,
    BILL_AMT1_USD: 0, BILL_AMT2_USD: 0, BILL_AMT3_USD: 0, BILL_AMT4_USD: 0, BILL_AMT5_USD: 0, BILL_AMT6_USD: 0,
    PAY_AMT1_USD: 0, PAY_AMT2_USD: 0, PAY_AMT3_USD: 0, PAY_AMT4_USD: 0, PAY_AMT5_USD: 0, PAY_AMT6_USD: 0
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : parseInt(e.target.value)
    setFormData({ ...formData, [e.target.name]: val })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Convert USD to NTD before sending to the AI
      const EXCHANGE_RATE_2005 = 32.0;
      const apiPayload = { ...formData };
      
      // Convert Credit Limit
      apiPayload.LIMIT_BAL = apiPayload.LIMIT_BAL_USD * EXCHANGE_RATE_2005;
      delete apiPayload.LIMIT_BAL_USD;

      // Convert all 6 Bill Amounts
      for (let i = 1; i <= 6; i++) {
        apiPayload[`BILL_AMT${i}`] = apiPayload[`BILL_AMT${i}_USD`] * EXCHANGE_RATE_2005;
        delete apiPayload[`BILL_AMT${i}_USD`];
      }

      // Convert all 6 Payment Amounts
      for (let i = 1; i <= 6; i++) {
        apiPayload[`PAY_AMT${i}`] = apiPayload[`PAY_AMT${i}_USD`] * EXCHANGE_RATE_2005;
        delete apiPayload[`PAY_AMT${i}_USD`];
      }

      // Send the localized payload to FastAPI
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("API Error:", error)
      alert("Ensure FastAPI is running on port 8000.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* LARGE PROJECT HEADER */}
      <header className="bg-slate-900 text-white py-12 px-8 mb-12 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <p className="text-lime-400 font-bold tracking-widest text-sm mb-2 uppercase">Fintech</p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            AI <span className="text-lime-400">AUDIT</span> SYSTEM
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
            Real-time credit risk assessment powered by XGBoost with a SHAP-based interpretability layer for regulatory compliance.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* INPUT FORM SECTION */}
          <section className="lg:col-span-7">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-8 border-b pb-4">Applicant Profile</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Core Financials & Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Credit Limit (LIMIT_BAL)</label>
                    <input type="number" name="LIMIT_BAL_USD" value={formData.LIMIT_BAL_USD} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                    <p className="text-[10px] text-slate-400 font-mono">Input is in USD. Model sees: NT$ {(formData.LIMIT_BAL_USD * 32).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Age</label>
                    <input type="number" name="AGE" value={formData.AGE} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Education</label>
                    <select name="EDUCATION" value={formData.EDUCATION} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                      <option value="1">Graduate School</option>
                      <option value="2">University</option>
                      <option value="3">High School</option>
                      <option value="4">Others</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Marriage Status</label>
                    <select name="MARRIAGE" value={formData.MARRIAGE} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                      <option value="1">Married</option>
                      <option value="2">Single</option>
                      <option value="3">Others</option>
                    </select>
                  </div>
                </div>

                {/* Repayment History (PAY_1 to PAY_6) */}
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Repayment Status (Past 6 Months)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(m => (
                      <div key={`pay_${m}`} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Month {m} (PAY_{m})</label>
                        <select name={`PAY_${m}`} value={formData[`PAY_${m}`]} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none">
                          <option value="-1">On Time</option>
                          <option value="1">1 Month Late</option>
                          <option value="2">2 Months Late</option>
                          <option value="3">3+ Months Late</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Statements (Mapped dynamically) */}
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Billed Amounts (USD)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(m => (
                      <div key={`bill_${m}`} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Month {m} Bill (BILL_AMT{m})</label>
                        <input type="number" name={`BILL_AMT${m}_USD`} value={formData[`BILL_AMT${m}_USD`]} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-slate-900" />
                        <p className="text-[9px] text-slate-400 font-mono">NT$ {(formData[`BILL_AMT${m}_USD`] * 32).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Payments (Mapped dynamically) */}
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Amount Paid (USD)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(m => (
                      <div key={`payamt_${m}`} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Month {m} Paid (PAY_AMT{m})</label>
                        <input type="number" name={`PAY_AMT${m}_USD`} value={formData[`PAY_AMT${m}_USD`]} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-slate-900" />
                        <p className="text-[9px] text-slate-400 font-mono">NT$ {(formData[`PAY_AMT${m}_USD`] * 32).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-[0.98]">
                  {loading ? 'ANALYZING RISK ARCHITECTURE...' : 'RUN AUDIT ENGINE'}
                </button>
              </form>
            </div>
          </section>

          {/* RESULTS SECTION */}
          <section className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[500px]">
                <h2 className="text-2xl font-bold mb-8 border-b pb-4">Audit Output</h2>
                
                {!result ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-slate-300">?</span>
                    </div>
                    <p className="text-slate-400 italic">Submit applicant data to generate explanation.</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-6 rounded-2xl mb-8 text-center border-2 ${result.default_probability > 0.5 ? 'bg-red-50 border-red-200' : 'bg-lime-50 border-lime-200'}`}>
                      <p className="text-xs uppercase font-bold text-slate-500 mb-1">Decision Score</p>
                      <h3 className={`text-4xl font-black ${result.default_probability > 0.5 ? 'text-red-600' : 'text-lime-700'}`}>
                        {(result.default_probability * 100).toFixed(1)}%
                      </h3>
                      <p className="font-bold mt-2">{result.default_probability > 0.5 ? 'DENIAL RECOMMENDED' : 'APPROVAL RECOMMENDED'}</p>
                    </div>

                    <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                      <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded mr-2 uppercase">XAI</span>
                      Primary Risk Drivers
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(result.explanation)
                        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                        .slice(0, 6)
                        .map(([feature, value]) => (
                          <div key={feature} className="flex flex-col">
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-600 uppercase tracking-tighter">{feature}</span>
                              <span className={value > 0 ? 'text-red-500' : 'text-blue-600'}>
                                {value > 0 ? 'RISK +' : 'TRUST -'}{Math.abs(value).toFixed(3)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${value > 0 ? 'bg-red-400' : 'bg-blue-400'}`} 
                                style={{ width: `${Math.min(Math.abs(value) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

export default App