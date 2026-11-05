import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Importación de Sidebar
import Sidebar from '../components/Sidebar'

// Importación de los 4 subcomponentes de recepción
import BuscadorVehiculo from '../components/recepcion/BuscadorVehiculo'
import DatosIngreso from '../components/recepcion/DatosIngreso'
import CargaEvidencias from '../components/recepcion/CargaEvidencias'
import TablaConceptos from '../components/recepcion/TablaConceptos'

export default function RecepcionVehiculo() {
  const [cargando, setCargando] = useState(false)

  // 1. Vehículo y Cliente seleccionado (desde BuscadorVehiculo.jsx)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)

  // 2. Datos de Ingreso (desde DatosIngreso.jsx)
  const [datosIngreso, setDatosIngreso] = useState({
    kilometraje: 0,
    kilometrajeFormateado: '',
    estatusOrden: 'Pendiente'
  })

  // 3. Evidencias Fotográficas (desde CargaEvidencias.jsx)
  const [fotos, setFotos] = useState([])

  // 4. Servicios y Refacciones (desde TablaConceptos.jsx)
  const [datosConceptos, setDatosConceptos] = useState({
    conceptos: [],
    total: 0
  })

  // Función Principal para Guardar la Orden completa
  const handleGuardarOrden = async () => {
    // Validaciones
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

      // Paso A: Insertar Cabecera de la Orden
      const { data: ordenGuardada, error: errOrden } = await supabase
        .from('ordenes_servicio')
        .insert([{
          vin_serie: vehiculoSeleccionado.vin_serie,
          id_cliente: vehiculoSeleccionado.id_cliente,
          kilometraje_ingreso: datosIngreso.kilometraje,
          estatus_orden: datosIngreso.estatusOrden,
          total: datosConceptos.total
        }])
        .select()
        .single()

      if (errOrden) throw errOrden

      const idOrdenGenerado = ordenGuardada.id_orden

      // Paso B: Insertar el Desglose de Conceptos (Servicios / Refacciones)
      const conceptosAInsertar = datosConceptos.conceptos.map((c) => ({
        id_orden: idOrdenGenerado,
        descripcion: c.descripcion,
        cantidad: Number(c.cantidad),
        precio_unitario: Number(c.precio),
        subtotal: Number(c.cantidad) * Number(c.precio)
      }))

      const { error: errConceptos } = await supabase
        .from('detalles_orden')
        .insert(conceptosAInsertar)

      if (errConceptos) throw errConceptos

      // Paso C: Subir Fotos de Evidencia a Supabase Storage (si existen)
      if (fotos.length > 0) {
        for (const foto of fotos) {
          const fileExt = foto.file.name.split('.').pop()
          const fileName = `${idOrdenGenerado}/${foto.etiqueta}_${Date.now()}.${fileExt}`

          const { error: errStorage } = await supabase
            .storage
            .from('evidencias')
            .upload(fileName, foto.file)

          if (errStorage) {
            console.error(`Error al subir imagen ${foto.etiqueta}:`, errStorage.message)
          }
        }
      }

      alert(`¡Orden #${idOrdenGenerado} creada con éxito en la base de datos!`)

    } catch (err) {
      alert('Error al procesar la orden: ' + err.message)
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F4F6F8]">
      {/* 1. Menú Lateral */}
      <Sidebar />

      {/* 2. Área de Trabajo Principal */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Encabezado Superior */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">
            Recepción de Vehículo / Crear Orden
          </h1>
          <div className="text-sm font-bold text-slate-700">
            Usuario / Admin
          </div>
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