import React, { useState } from 'react'

// Importación de Sidebar
import Sidebar from '../components/Sidebar'

// Importación de los 4 subcomponentes de recepción
import BuscadorVehiculo from '../components/recepcion/BuscadorVehiculo'
import DatosIngreso from '../components/recepcion/DatosIngreso'
import CargaEvidencias from '../components/recepcion/CargaEvidencias'
import TablaConceptos from '../components/recepcion/TablaConceptos'

// Importación del servicio externo de órdenes
import { guardarOrdenCompleta } from '../services/ordenesService'

export default function RecepcionVehiculo() {
  const [cargando, setCargando] = useState(false)

  // 1. Vehículo y Cliente seleccionado
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)

  // 2. Datos de Ingreso
  const [datosIngreso, setDatosIngreso] = useState({
    kilometraje: 0,
    kilometrajeFormateado: '',
    estatusOrden: 'Pendiente'
  })

  // 3. Evidencias Fotográficas
  const [fotos, setFotos] = useState([])

  // 4. Servicios y Refacciones
  const [datosConceptos, setDatosConceptos] = useState({
    conceptos: [],
    total: 0
  })

  // Función Principal conectada al servicio externo
  const handleGuardarOrden = async () => {
    if (!vehiculoSeleccionado) {
      alert('Por favor busca y selecciona un vehículo antes de guardar.')
      return
    }

    if (!datosConceptos.conceptos || datosConceptos.conceptos.length === 0) {
      alert('Debes incluir al menos un servicio o refacción en la orden.')
      return
    }

    try {
      setCargando(true)

      // Llamada limpia al servicio externo
      const idOrdenGenerado = await guardarOrdenCompleta(
        vehiculoSeleccionado,
        datosIngreso,
        datosConceptos,
        fotos
      )

      alert(`¡Orden #${idOrdenGenerado} creada con éxito en la base de datos!`)

    } catch (err) {
      alert('Error al procesar la orden: ' + err.message)
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F6F8]">
      {/* 1. Menú Lateral con la sesión y botón de salida integrados */}
      <Sidebar />

      {/* 2. Área de Trabajo Principal */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto w-full">
        {/* Encabezado Superior Limpio */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">
            Recepción de Vehículo / Crear Orden
          </h1>
        </div>

        {/* Submódulos */}
        <BuscadorVehiculo 
          vehiculoSeleccionado={vehiculoSeleccionado} 
          onVehiculoSelect={setVehiculoSeleccionado} 
        />

        <DatosIngreso 
          onDatosChange={setDatosIngreso}
        />

        <CargaEvidencias 
          onFotosChange={setFotos} 
        />

        <TablaConceptos 
          onConceptosChange={setDatosConceptos} 
          onGuardarOrden={handleGuardarOrden} 
          cargando={cargando} 
        />
      </main>
    </div>
  )
}