import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const sample = [
  { id:1, nombre:'Acme S.A.', tipoDocumento:'RUC', documento:'20123456789', direccion:'Av. Siempreviva 123', telefono:'987654321', email:'contacto@acme.com', estado:'Activo' },
  { id:2, nombre:'Empresa XYZ', tipoDocumento:'DNI', documento:'12345678', direccion:'Calle Falsa 456', telefono:'912345678', email:'info@xyz.com', estado:'Activo' },
]

export default function Clients(){
  const [data, setData] = useState([])
  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem('mock_clients') || 'null')
    if(saved) setData(saved)
    else { setData(sample); localStorage.setItem('mock_clients', JSON.stringify(sample)) }
  },[])

  const del = (id) => {
    if(!confirm('Eliminar cliente?')) return;
    const next = data.filter(d=>d.id!==id)
    setData(next)
    localStorage.setItem('mock_clients', JSON.stringify(next))
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Clientes</h2>
        <Link to="/clients/new" className="bg-blue-600 text-white px-3 py-1 rounded">Agregar Cliente</Link>
      </div>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1">ID</th><th>Nombre</th><th>Tipo Doc</th><th>Documento</th><th>Email</th><th>Tel</th><th>Dirección</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c=> (
              <tr key={c.id} className="border-t">
                <td className="px-2 py-2">{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.tipoDocumento}</td>
                <td>{c.documento}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td>{c.direccion}</td>
                <td>{c.estado}</td>
                <td className="py-2">
                  <button onClick={()=>del(c.id)} className="px-2 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
