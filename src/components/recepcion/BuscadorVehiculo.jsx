import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function BuscadorVehiculo({ vehiculoSeleccionado, onVehiculoSelect }) {
  // Estados locales para la responsabilidad autónoma del hijo
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState(null)

  // Estados para Alta Rápida cuando la unidad no existe
  const [modoRegistro, setModoRegistro] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_empresa_o_cliente: '',
    telefono_whatsapp: '',
    correo: ''
  })

  const [nuevoVehiculo, setnuevoVehiculo] = useState ({
    vin_serie: '',
    placas: '',
    marca: '',
    tipo: '',
    modelo: '',
    num_economico: '',
  })

  // Función para buscar por Placa o VIN en Supabase
  const handleBuscar = async (e) => {
    e.preventDefault()
    if (!busqueda.trim()) return

    try {
      setCargando(true)
      setErrorBusqueda(null)
      setModoRegistro(false)

      const termino = busqueda.trim()

  // Consulta a la BD de Supabase
      const { data, error } = await supabase
        .from('vehiculos')
        .select(`
          vin_serie,
          placas,
          marca,
          tipo,
          modelo,
          num_economico,
          id_cliente,
          clientes (
            id_cliente,
            nombre_empresa_o_cliente,
            telefono_whatsapp,
            correo
          )
        `)
        .or(`placas.ilike.%${termino}%,vin_serie.ilike.%${termino}%`)
        .limit(1)

      if (error) throw error

      const vehiculo = data && data.length > 0 ? data[0] : null

      if (vehiculo) {
        // Concatenamos las partes existentes de la marca, tipo y modelo
        const partes = [vehiculo.marca, vehiculo.tipo, vehiculo.modelo].filter(Boolean)
        const descripcionVehiculo = partes.length > 0 
          ? partes.join(' ') 
          : `Placa: ${vehiculo.placas || vehiculo.vin_serie}`

        // Resultado estructurado para enviarla al componente Padre
        onVehiculoSelect({
          vin_serie: vehiculo.vin_serie,
          placas: vehiculo.placas,
          marca_tipo: descripcionVehiculo || 'Vehículo sin descripción',
          marca: vehiculo.marca,
          tipo: vehiculo.tipo,
          modelo: vehiculo.modelo,
          num_economico: vehiculo.num_economico,
          id_cliente: vehiculo.clientes?.id_cliente,
          cliente_nombre: vehiculo.clientes?.nombre_empresa_o_cliente || 'Cliente General',
          telefono: vehiculo.clientes?.telefono_whatsapp || '',
          correo: vehiculo.clientes?.correo || ''
        })
      } else {
        setErrorBusqueda('Unidad no encontrada en la base de datos.')
        onVehiculoSelect(null)
      }
    } catch (err) {
      console.error('Error en búsqueda:', err.message)
      setErrorBusqueda('Error al realizar la consulta.')
    } finally {
      setCargando(false)
    }
  }

  // 2. Función para registrar Cliente y Vehículo sobre la marcha
  const handleGuardarNuevoClienteVehiculo = async (e) => {
    e.preventDefault()

    if (!nuevoCliente.nombre_empresa_o_cliente.trim()) {
      return
    }

    if (!nuevoVehiculo.vin_serie.trim() && !nuevoVehiculo.placas.trim()) {
      alert('Debes ingresar al menos el VIN (Serie) o la Placa del vehículo.')
    }

    try {
      setCargando(true)

      // Paso A: Insertar Cliente en la tabla 'clientes'
      const { data: clienteCreado, error: errCliente } = await supabase
      .from('clientes')
      .insert([nuevoCliente])
      .select()
      .single()

      if (errCliente) throw errCliente

       // Paso B: Insertar Vehículo asociado al id_cliente generado
       const vehiculoPayload = {
        ...nuevoVehiculo,
        id_cliente: clienteCreado.id_cliente
       }

       const { data: vehiculoCreado, error: errVehiculo } = await supabase
        .from('vehiculos')
        .insert([vehiculoPayload])
        .select(`
          vin_serie,
          placas,
          marca,
          tipo,
          modelo,
          num_economico,
          id_cliente,
          clientes (
            id_cliente,
            nombre_empresa_o_cliente,
            telefono_whatsapp,
            correo
          )
        `)
        .single()

        if (errVehiculo) throw errVehiculo

        // Paso C: Formatear la descripción y seleccionar automáticamente
      const partes = [vehiculoCreado.marca, vehiculoCreado.tipo, vehiculoCreado.modelo].filter(Boolean)
      const descripcionVehiculo = partes.length > 0 
        ? partes.join(' ') 
        : `Placa: ${vehiculoCreado.placas || vehiculoCreado.vin_serie}`

      onVehiculoSelect({
        vin_serie: vehiculoCreado.vin_serie,
        placas: vehiculoCreado.placas,
        marca_tipo: descripcionVehiculo || 'Vehículo sin descripción',
        marca: vehiculoCreado.marca,
        tipo: vehiculoCreado.tipo,
        modelo: vehiculoCreado.modelo,
        num_economico: vehiculoCreado.num_economico,
        id_cliente: clienteCreado.id_cliente,
        cliente_nombre: clienteCreado.nombre_empresa_o_cliente,
        telefono: clienteCreado.telefono_whatsapp || '',
        correo: clienteCreado.correo || ''
      })

      // Limpiar estados de registro
      setModoRegistro(false)
      setErrorBusqueda(null)
      alert('¡Cliente y vehículo registrados con éxito!')

    } catch (err) {
    alert('Error al registrar nuevo cliente/vehículo: ' + err.message)
      console.error(err)
    
    } finally {
      setCargando(false)
    }
  }  
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      {/* Formulario de Búsqueda de 3 columnas */}
      <form onSubmit={handleBuscar} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Columna 1: Cliente/Empresa */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Cliente / Empresa
          </label>
          <input 
            type="text" 
            readOnly 
            value={vehiculoSeleccionado?.cliente_nombre || ''} 
            placeholder="Cliente / Empresa ..."
            className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none cursor-not-allowed font-medium"
          />
        </div>

        {/* Columna 2: Búsqueda por Placa o VIN */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Placas o VIN (Serie)
          </label>
          <div className="relative">
            <input 
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)} 
              placeholder="Ej: ABC-1234 o Serie VIN..."
              className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button 
              type="submit"
              disabled={cargando}
              title="Buscar en base de datos"
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              {cargando ? '⌛' : '🔍'}
            </button>
          </div>
          {errorBusqueda && (
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-red-600 font-semibold">{errorBusqueda}</p>
              {!modoRegistro && (
                <button
                  type="button"
                  onClick={() => setModoRegistro(true)}
                  className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
                >
                  + Registrar unidad
                </button>
              )}
            </div>
          )}
        </div>

        {/* Columna 3: Tarjeta de Vehículo Detectado */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Vehículo Detectado
          </label>
          <div className="p-2.5 bg-[#a61c30] text-white font-bold text-center rounded-lg text-sm shadow-sm truncate">
            {vehiculoSeleccionado ? vehiculoSeleccionado.marca_tipo : 'Sin selección'}
          </div>
        </div>
      </form>

      {/* Formulario de Alta Rápida si la unidad no existe */}
      {modoRegistro && (
        <form onSubmit={handleGuardarNuevoClienteVehiculo} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Alta Rápida de Cliente y Vehículo
            </h4>
            <button
              type="button"
              onClick={() => setModoRegistro(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕ Cancelar
            </button>
          </div>

          {/* Datos del Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Cliente / Empresa *</label>
              <input
                type="text"
                required
                placeholder="Nombre completo o Empresa"
                value={nuevoCliente.nombre_empresa_o_cliente}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre_empresa_o_cliente: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">WhatsApp / Teléfono</label>
              <input
                type="text"
                placeholder="Ej. 5512345678"
                value={nuevoCliente.telefono_whatsapp}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono_whatsapp: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="cliente@correo.com"
                value={nuevoCliente.correo}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Datos del Vehículo */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">VIN / Serie *</label>
              <input
                type="text"
                placeholder="VIN123456789"
                value={nuevoVehiculo.vin_serie}
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, vin_serie: e.target.value.toUpperCase() })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Placas</label>
              <input
                type="text"
                placeholder="ABC-123"
                value={nuevoVehiculo.placas}
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, placas: e.target.value.toUpperCase() })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Marca</label>
              <input
                type="text"
                placeholder="Ej. Nissan"
                value={nuevoVehiculo.marca}
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Tipo</label>
              <input
                type="text"
                placeholder="Ej. Sedan / SUV"
                value={nuevoVehiculo.tipo}
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, tipo: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Modelo</label>
              <input
                type="text"
                placeholder="Ej. Versa 2020"
                value={nuevoVehiculo.modelo}
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Nº Económico</label>
              <input
                type="text"
                placeholder="Ej. ECO-01"
                value={nuevoVehiculo.num_economico}
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, num_economico: e.target.value })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setModoRegistro(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : '💾 Registrar y Seleccionar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}