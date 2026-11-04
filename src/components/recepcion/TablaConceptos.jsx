import React, { useState, useEffect } from 'react'

export default function TablaConceptos({ 
  onConceptosChange, 
  conceptosIniciales = [
    { id: 1, descripcion: 'Mantenimiento mayor preventivo', cantidad: 1, precio: 1800 },
    { id: 2, descripcion: 'Cambio de balatas Delanteras', cantidad: 1, precio: 650 }
  ],
  onGuardarOrden, 
  cargando 
}) {
  // Estado autónomo local
  const [conceptos, setConceptos] = useState(conceptosIniciales)

  // Cálculo del total en tiempo real
  const total = conceptos.reduce((acc, curr) => {
    const cant = Number(curr.cantidad) || 0
    const prec = Number(curr.precio) || 0
    return acc + (cant * prec)
  }, 0)

  // Notificar cambios al Padre
  useEffect(() => {
    if (onConceptosChange) {
      onConceptosChange({
        conceptos,
        total
      })
    }
  }, [conceptos, total])

  // Agregar una nueva fila interactiva
  const handleAgregarConcepto = () => {
    const nuevoId = conceptos.length > 0 ? Math.max(...conceptos.map(c => c.id)) + 1 : 1
    const nuevoConcepto = {
      id: nuevoId,
      descripcion: '',
      cantidad: 1,
      precio: 0
    }
    setConceptos([...conceptos, nuevoConcepto])
  }

  // Actualizar cualquier campo de una fila específica (descripción, cantidad, precio)
  const handleConceptoChange = (id, field, value) => {
    setConceptos(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  // Eliminar una fila por su ID
  const handleEliminarConcepto = (id) => {
    setConceptos(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
      <h3 className="text-sm font-bold text-slate-800">Servicios y Refacciones Solicitadas</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
              <th className="p-3 min-w-[200px]">Concepto / Trabajo</th>
              <th className="p-3 text-center w-24">Cant.</th>
              <th className="p-3 text-right w-32">Precio Unit.</th>
              <th className="p-3 text-right w-32">Subtotal</th>
              <th className="p-3 text-center w-16">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {conceptos.map((item) => {
              const cantidad = Number(item.cantidad) || 0
              const precio = Number(item.precio) || 0
              const subtotal = cantidad * precio

              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  {/* Descripción editable */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={(e) => handleConceptoChange(item.id, 'descripcion', e.target.value)}
                      placeholder="Ej. Cambio de aceite 5W30"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>

                  {/* Cantidad editable */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleConceptoChange(item.id, 'cantidad', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-center font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>

                  {/* Precio Unitario editable */}
                  <td className="p-2 text-right">
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-slate-400 text-sm font-semibold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precio}
                        onChange={(e) => handleConceptoChange(item.id, 'precio', e.target.value)}
                        className="w-full p-2 pl-6 bg-slate-50 border border-slate-300 rounded-lg text-sm text-right font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>

                  {/* Subtotal dinámico */}
                  <td className="p-3 text-right font-bold text-slate-800">
                    ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Eliminar fila */}
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleEliminarConcepto(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Eliminar concepto"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            })}

            {conceptos.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-xs text-slate-400 italic">
                  No hay servicios ni refacciones agregadas a esta orden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de Tabla: Agregar Concepto y Mostrar Total */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleAgregarConcepto}
          className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 cursor-pointer"
        >
          <span className="text-base">➕</span> Agregar Concepto
        </button>

        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase font-semibold">TOTAL</div>
          <div className="text-xl font-black text-slate-800">
            ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Botón Principal Guardar Orden */}
      <div className="flex justify-end pt-2">
        <button 
          type="button"
          onClick={onGuardarOrden}
          disabled={cargando}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>💾</span> {cargando ? 'Guardando Orden...' : 'Guardar Orden'}
        </button>
      </div>
    </div>
  )
}