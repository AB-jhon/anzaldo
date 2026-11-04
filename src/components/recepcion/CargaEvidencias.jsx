import React, { useState, useEffect, useRef } from 'react'

export default function CargaEvidencias({ onfotosChange, fotosIniciales = [] }) {
  // Estado local autónomo para las fotos
  const [fotos, setFotos] = useState (fotosIniciales)

  // Referencia a los inputs invisibles
  const inputCamaraRef = useRef(null)
  const inputGaleriaRef = useRef(null)

  // Notificar al padre cada vez que cambien las fotos
  useEffect( () => {
    if (onfotosChange) {
      onfotosChange (fotos)
    }
  }, [fotos])

  // Manejador unificado para procesar imágenes capturadas o seleccionadas
  const handleProcesarFotos = (e) => {
    const archivos = Array.from(e.target.files)
    if (archivos.length === 0) return

    // Limitamos a un máximo de 6 fotos en total
    const fotosDisponibles = 6 - fotos.length
    const archivosAceptados = archivos.slice(0, fotosDisponibles)
    const etiquetasPorDefecto = ['Frente', 'Lado Izq', 'Lado Der', 'Tablero', 'Trasera', 'Extra']

    const nuevasFotos = archivosAceptados.map((archivo, index) => {
      // Asignación de etiqueta por defecto según la posición
      const posicionActual = fotos.length + index

      return {
        id: Date.now() + index,
        file: archivo,
        previewUrl: URL.createObjectURL(archivo),
        etiqueta: etiquetasPorDefecto[posicionActual] || `Foto ${posicionActual + 1}`
      }
    })

    setFotos((prevFotos) => [...prevFotos, ...nuevasFotos])
    // Limpia el input para permitir volver a seleccionar la misma imagen
    e.target.value = ''
  }

  // Eliminar una foto y liberar memoria de su URL de objeto
  const handleEliminarFoto = (id) => {
    setFotos((prevFotos) => {
      const fotoAEliminar = prevFotos.find((f) => f.id === id)
      if (fotoAEliminar?.previewUrl) {
        URL.revokeObjectURL(fotoAEliminar.previewUrl)
      }
      return prevFotos.filter((f) => f.id !== id)
    })
  }

    return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 text-center">
        Evidencia Fotográfica de Ingreso (Recepción)
      </h3>

      {/* Controles de Selección y Cámara */}
      {fotos.length < 6 && (
        <div className="flex flex-wrap justify-center gap-3">
          {/* Botón 1: Tomar foto directamente con la Cámara Trasera del Celular/Tablet */}
          <button
            type="button"
            onClick={() => inputCamaraRef.current?.click()}
            className="flex-1 min-w-[140px] max-w-[200px] bg-blue-700 hover:bg-blue-700 text-white font-bold p-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <span className="text-base">📸</span>
            <span>Tomar Foto</span>
          </button>

          {/* Botón 2: Abrir Galería o Archivos guardados */}
          <button
            type="button"
            onClick={() => inputGaleriaRef.current?.click()}
            className="flex-1 min-w-[140px] max-w-[200px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold p-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <span className="text-base">🖼️</span>
            <span>Subir Galería</span>
          </button>

          {/* Input Oculto 1: Dispara la Cámara Trasera en Móviles */}
          <input
            ref={inputCamaraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleProcesarFotos}
            className="hidden"
          />

          {/* Input Oculto 2: Dispara el Selector de Archivos / Galería */}
          <input
            ref={inputGaleriaRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleProcesarFotos}
            className="hidden"
          />
        </div>
      )}

      {/* Galería de miniaturas capturadas */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {fotos.map((foto) => (
          <div 
            key={foto.id} 
            className="relative w-28 h-28 bg-slate-100 border border-slate-300 rounded-lg overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <img 
              src={foto.previewUrl} 
              alt={foto.etiqueta} 
              className="w-full h-full object-cover absolute inset-0"
            />

            <div className="relative z-10 flex justify-between items-start p-1.5 bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-[10px] text-white font-bold px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                {foto.etiqueta}
              </span>
              <button
                type="button"
                onClick={() => handleEliminarFoto(foto.id)}
                className="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition"
                title="Eliminar foto"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {fotos.length === 0 && (
          <p className="text-xs text-slate-400 italic">No se han adjuntado fotos de evidencia.</p>
        )}
      </div>
    </div>
  )
}