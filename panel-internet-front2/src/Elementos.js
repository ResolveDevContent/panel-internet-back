export const ELEMENTOS = {
    admins: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'email',
            placeholder: 'Email'
        },
        {
            element: 'list',
            nombre: 'ID_Comercio',
            placeholder: "comercios",
            tipo: 'checkbox'
        },
        {
            element: "input",
            tipo: "password",
            nombre: "password",
            placeholder: "Contraseña"
        }
  ],
  clientes: [
    {
        element: 'input',
        tipo: 'number',
        nombre: 'dni',
        placeholder: 'Nº DNI'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'nombre_completo',
        placeholder: 'Nombre y apellido'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'direccion_principal',
        placeholder: 'Direccion'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'ubicacion',
        placeholder: 'Ubicacion'
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'telefono_fijo',
        placeholder: 'Telefono fijo'
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'telefono_movil',
        placeholder: 'Telefono movil'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'email',
        placeholder: 'Email'
    },
    {
        element: 'input',
        tipo: 'password',
        nombre: 'password',
        placeholder: 'Contraseña'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'Id',
        placeholder: 'Id'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'Codigo',
        placeholder: 'Codigo'
    },
  ],
  comercios: [
    {
        element: 'input',
        tipo: 'text',
        nombre: 'nombre_comercio',
        placeholder: 'Nombre comercio'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'nombre_completo',
        placeholder: 'Nombre y apellido'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'rubro',
        placeholder: 'Rubro'
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'telefono',
        placeholder: 'Telefono'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'email',
        placeholder: 'Email'
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'ubicacion',
        placeholder: 'Ubicacion'
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'porcentaje',
        placeholder: 'Porcentaje'
    },
    {
        element: "input",
        tipo: "password",
        nombre: "password",
        placeholder: "Cambiar Contraseña"
    }
  ],
  transacciones: [
    {
        element: 'multiple',
        nombre: 'ID_Comercio',
        placeholder: 'comercios',
        otherNombre: 'ID_Cliente',
        otherPlaceholder: 'clientes',
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'monto_parcial',
        placeholder: 'Monto'
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'puntos_pago',
        placeholder: 'Pago con puntos'
    },    
  ],
  pagos: [
    {
        element: 'list',
        nombre: 'ID_Comercio',
        placeholder: "comercios",
        tipo: 'radio'
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'monto_parcial',
        placeholder: 'Monto pagado'
    },
  ],
  asociacionesClientes: [
    {
        element: 'list',
        nombre: 'ID_Cliente',
        placeholder: "clientes",
        tipo: 'checkbox'
    },
    {
        element: 'list',
        nombre: 'ID_Comercio',
        placeholder: "comercios",
        tipo: 'radio'
    },
  ],
  asociacionesComercios: [
    {
        element: 'list',
        nombre: 'ID_Cliente',
        placeholder: "clientes",
        tipo: 'radio'
    },
    {
        element: 'list',
        nombre: 'ID_Comercio',
        placeholder: "comercios",
        tipo: 'checkbox'
    },
  ],
}