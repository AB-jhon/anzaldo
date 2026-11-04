import React, { useState, useEffect } from 'react'

export default function DatosIngreso({ onDatosChange, valoresIniciales = {} }) {
  // Estados locales para la responsabilidad autónoma del hijo
  const [kilometraje, setKilometraje] = useState(valoresIniciales.kilometraje || '')
  const [estatusOrden, setEstatusOrden] = useState(valoresIniciales.estatusOrden || 'Pendiente')

  // Formateador visual: Solo permite dígitos y aplica formato con comas de millar
  const handleKilometrajeChange = (e) => {
    const valorLimpio = e.target.value.replace(/\D/g, '') //Elimina letras / simbolos
    if (valorLimpio === '') {
      setKilometraje('')
      return
    }
    const numero = parseInt(valorLimpio, 10)
    setKilometraje(numero.toLocaleString('es-MX'))
  }

  // Notifica al Padre cada vez que hay un cambio en el estado local
  useEffect(() => {
    // Extrae el valor puramente numérico para guardar directo en la BD
    const kilometrajeNumerico = parseInt(kilometraje.toString().replace(/\D/g, ''), 10) || 0

    if (onDatosChange) {
      onDatosChange({
        kilometraje: kilometrajeNumerico,
        kilometrajeFormateado: kilometraje,
        estatusOrden
      })
    }
  }, [kilometraje, estatusOrden])

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

      {/* Columna 1: Kilometraje de Ingreso */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 text-center">
          Kilometraje de Ingreso
        </label>
        <div className='relative'>
        <input 
            type="text" 
            value={kilometraje}
            onChange={handleKilometrajeChange}
            placeholder="Ej: 150,500 km"
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-center font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold pointer-events-none">
            KM
          </span>
        </div>
      </div>

      {/* Columna 2: Estatus de la Orden */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 text-center">
          Estatus de la Orden
        </label>
        <select 
          value={estatusOrden}
          onChange={(e) => setEstatusOrden(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-center font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="Pendiente">🟡 Pendiente (Recepción)</option>
          <option value="Proceso">🔵 En Proceso (Taller)</option>
          <option value="Completado">🟢 Completado (Entrega)</option>
        </select>
      </div>
    </div>
    </div>
  )
}