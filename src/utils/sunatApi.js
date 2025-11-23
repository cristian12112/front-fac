// API 1: apiperu.dev (Más confiable)
export const consultarRUC_API1 = async (ruc) => {
  try {
    const response = await fetch(`https://apiperu.dev/api/ruc/${ruc}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('API 1 no disponible');
    }

    const result = await response.json();

    if (result && result.data) {
      const data = result.data;
      return {
        success: true,
        razonSocial: data.nombre_o_razon_social || '',
        estado: data.estado || '',
        condicion: data.condicion || '',
        direccion: data.direccion_completa || data.direccion || '',
        ubigeo: data.ubigeo || '',
        departamento: data.departamento || '',
        provincia: data.provincia || '',
        distrito: data.distrito || '',
        ciiu: '', // Esta API no siempre tiene CIIU
        actividadEconomica: ''
      };
    }

    return {
      success: false,
      message: 'RUC no encontrado en API 1'
    };

  } catch (error) {
    console.error('Error en API 1:', error);
    return {
      success: false,
      message: 'Error en API 1',
      error: error.message
    };
  }
};

// API 2: api.apis.net.pe
export const consultarRUC_API2 = async (ruc) => {
  try {
    const response = await fetch(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('API 2 no disponible');
    }

    const data = await response.json();

    if (data && data.nombre) {
      return {
        success: true,
        razonSocial: data.nombre || '',
        estado: data.estado || '',
        condicion: data.condicion || '',
        direccion: data.direccion || '',
        ubigeo: data.ubigeo || '',
        departamento: data.departamento || '',
        provincia: data.provincia || '',
        distrito: data.distrito || '',
        ciiu: data.actividadEconomica ? data.actividadEconomica.split('-')[0].trim() : '',
        actividadEconomica: data.actividadEconomica || ''
      };
    }

    return {
      success: false,
      message: 'RUC no encontrado en API 2'
    };

  } catch (error) {
    console.error('Error en API 2:', error);
    return {
      success: false,
      message: 'Error en API 2',
      error: error.message
    };
  }
};

// API 3: dniruc.apisperu.com
export const consultarRUC_API3 = async (ruc) => {
  try {
    const response = await fetch(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('API 3 no disponible');
    }

    const data = await response.json();

    if (data && data.razonSocial) {
      return {
        success: true,
        razonSocial: data.razonSocial || '',
        estado: data.estado || '',
        condicion: data.condicion || '',
        direccion: data.direccion || '',
        ubigeo: data.ubigeo ? `${data.ubigeo[0]} - ${data.ubigeo[1]} - ${data.ubigeo[2]}` : '',
        departamento: data.ubigeo ? data.ubigeo[0] : '',
        provincia: data.ubigeo ? data.ubigeo[1] : '',
        distrito: data.ubigeo ? data.ubigeo[2] : '',
        ciiu: data.ciiu || '',
        actividadEconomica: data.actividadEconomica || ''
      };
    }

    return {
      success: false,
      message: 'RUC no encontrado en API 3'
    };

  } catch (error) {
    console.error('Error en API 3:', error);
    return {
      success: false,
      message: 'Error en API 3',
      error: error.message
    };
  }
};

// API 4: consulta.api-peru.com
export const consultarRUC_API4 = async (ruc) => {
  try {
    const response = await fetch(`https://consulta.api-peru.com/api/ruc/${ruc}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('API 4 no disponible');
    }

    const result = await response.json();

    if (result && result.data) {
      const data = result.data;
      return {
        success: true,
        razonSocial: data.razon_social || data.nombre || '',
        estado: data.estado || '',
        condicion: data.condicion || '',
        direccion: data.direccion || '',
        ubigeo: data.ubigeo || '',
        departamento: data.departamento || '',
        provincia: data.provincia || '',
        distrito: data.distrito || '',
        ciiu: data.ciiu || '',
        actividadEconomica: data.actividad_economica || ''
      };
    }

    return {
      success: false,
      message: 'RUC no encontrado en API 4'
    };

  } catch (error) {
    console.error('Error en API 4:', error);
    return {
      success: false,
      message: 'Error en API 4',
      error: error.message
    };
  }
};

// Función principal que intenta múltiples APIs en orden
export const buscarDatosRUC = async (ruc) => {
  // Validar formato RUC (11 dígitos)
  if (!ruc || ruc.length !== 11 || !/^\d+$/.test(ruc)) {
    return {
      success: false,
      message: 'RUC debe tener 11 dígitos numéricos'
    };
  }

  // Array de APIs para probar en orden
  const apis = [
    { nombre: 'API Peru Dev', funcion: consultarRUC_API1 },
    { nombre: 'APIs.net.pe', funcion: consultarRUC_API2 },
    { nombre: 'DNI RUC Peru', funcion: consultarRUC_API3 },
    { nombre: 'API Peru', funcion: consultarRUC_API4 }
  ];

  // Intentar cada API en orden hasta encontrar una que funcione
  for (const api of apis) {
    console.log(`Intentando con ${api.nombre}...`);
    const resultado = await api.funcion(ruc);

    if (resultado.success) {
      console.log(`✓ Datos obtenidos exitosamente desde ${api.nombre}`);
      return resultado;
    }
  }

  // Si ninguna API funcionó
  console.error('No se pudo consultar el RUC en ninguna API');
  return {
    success: false,
    message: 'No se pudo consultar el RUC. Por favor, intente nuevamente más tarde o ingrese los datos manualmente.'
  };
};
