export const ELEMENTOS = {
    admins: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'nombre',
            placeholder: 'Nombre',
            valor: ''
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'apellido',
            placeholder: 'Apellido',
            valor: ''
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'email',
            placeholder: 'Email',
            valor: ''
        },
        {
            element: 'list',
            nombre: 'ID_Comercio',
            placeholder: "comercios",
            tipo: 'checkbox'
        },
        {
            element: 'permisos',
            nombre: 'permisos',
            placeholder: "Permisos",
        },
        {
            element: "input",
            tipo: "password", 
            nombre: "password",
            placeholder: "Contraseña",
            valor: ''
        },
  ],
  clientes: [
    {
        element: 'input',
        tipo: 'number',
        nombre: 'dni',
        placeholder: 'Nº DNI',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'nombre',
        placeholder: 'Nombre',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'apellido',
        placeholder: 'Apellido',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'direccion_principal',
        placeholder: 'Direccion',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'email',
        placeholder: 'Email',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'Id',
        placeholder: 'Id',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'codigo',
        placeholder: 'Codigo',
        valor: ''
    }
  ],
  comercios: [
    {
        element: 'input',
        tipo: 'text',
        nombre: 'nombre_comercio',
        placeholder: 'Nombre comercio',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'nombre_completo',
        placeholder: 'Nombre y apellido',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'rubro',
        placeholder: 'Rubro',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'telefono',
        placeholder: 'Telefono',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'email',
        placeholder: 'Email',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'text',
        nombre: 'ubicacion',
        placeholder: 'Ubicacion',
        valor: ''
    },
    {
        element: 'input',
        tipo: 'number',
        nombre: 'porcentaje',
        placeholder: 'Porcentaje',
        valor: ''
    },
    {
        element: "input",
        tipo: "password",
        nombre: "password",
        placeholder: "Cambiar Contraseña",
        valor: ''
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
        placeholder: 'Monto',
        valor: ''
    },
    // {
    //     element: 'input',
    //     tipo: 'number',
    //     nombre: 'puntos_pago',
    //     placeholder: 'Pago con puntos'
    // },    
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
        placeholder: 'Monto pagado',
        valor: ''
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
    historial: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'message',
            placeholder: 'Mensaje',
            valor: ''
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'fecha',
            placeholder: 'Fecha',
            valor: ''
        }
    ]
}