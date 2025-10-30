import React from 'react'
export default function Dashboard(){
  return (
    <main className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Clientes: <strong>--</strong></div>
        <div className="p-4 bg-white rounded shadow">Facturas: <strong>--</strong></div>
        <div className="p-4 bg-white rounded shadow">Contratos: <strong>--</strong></div>
      </div>
      <section className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Acciones</h3>
        <ul className="list-disc ml-6 mt-2">
          <li>Ver y administrar Clientes</li>
          <li>Ver Facturas, Pagos, Movimientos, Contratos</li>
        </ul>
      </section>
    </main>
  )
}
