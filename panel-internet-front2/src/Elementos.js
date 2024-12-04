export const ELEMENTOS = {
    admins: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'nombre',
            placeholder: 'Nombre',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'apellido',
            placeholder: 'Apellido',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'email',
            placeholder: 'Email',
            valor: '',
            mensaje: "",
        },
        {
            element: 'list',
            nombre: 'ID_Comercio',
            placeholder: "comercios",
            tipo: 'checkbox',
            lista: true
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
            valor: '',
            mensaje: "Volve a escribir la contraseña o inserte una nueva."
        }
    ],
    cobradores: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'nombre',
            placeholder: 'Nombre',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'apellido',
            placeholder: 'Apellido',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'email',
            placeholder: 'Email',
            valor: '',
            mensaje: "",
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
            valor: '',
            mensaje: "Volve a escribir la contraseña o inserte una nueva."
        }
    ],
    zonas: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'zona',
            placeholder: 'Zona',
            valor: '',
            mensaje: "",
        }
    ],
    clientes: [
        {
            element: 'input',
            tipo: 'number',
            nombre: 'dni',
            placeholder: 'Nº DNI',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'nombre',
            placeholder: 'Nombre',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'apellido',
            placeholder: 'Apellido',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'direccion_principal',
            placeholder: 'Direccion',
            valor: '',
            mensaje: "",
        },
        {
            element: 'list',
            nombre: 'zona',
            placeholder: "zonas",
            tipo: 'radio',
            lista: true,
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'email',
            placeholder: 'Email',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'Id',
            placeholder: 'Id',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'Codigo',
            placeholder: 'Codigo',
            valor: '',
            mensaje: "",
        }
    ],
    comercios: [
        {
            element: 'input',
            tipo: 'text',
            nombre: 'nombre_comercio',
            placeholder: 'Nombre comercio',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'nombre_completo',
            placeholder: 'Nombre y apellido',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'rubro',
            placeholder: 'Rubro',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'number',
            nombre: 'telefono',
            placeholder: 'Telefono',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'email',
            placeholder: 'Email',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'ubicacion',
            placeholder: 'Ubicacion',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'number',
            nombre: 'porcentaje',
            placeholder: 'Porcentaje',
            valor: '',
            mensaje: "",
        },
        {
            element: "input",
            tipo: "password",
            nombre: "password",
            placeholder: "Cambiar Contraseña",
            valor: '',
            mensaje: "",
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
            valor: '',
            mensaje: "",
        }
        // {
        //     element: 'input',
        //     tipo: 'number',
        //     nombre: 'puntos_pago',
        //     placeholder: 'Pago con puntos'
        // },    
    ],
    transaccionesComercio: [
        {
            element: 'filtroCliente',
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
            valor: '',
            mensaje: "",
        }
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
            tipo: 'radio',
            lista: false,
        },
        {
            element: 'input',
            tipo: 'number',
            nombre: 'monto_parcial',
            placeholder: 'Monto pagado',
            valor: '',
            mensaje: "",
        }
    ],
    asociacionesClientes: [
        {
            element: 'list',
            nombre: 'ID_Cliente',
            placeholder: "clientes",
            tipo: 'checkbox',
            lista: false,
        },
        {
            element: 'zonas',
        },
        {
            element: 'list',
            nombre: 'ID_Comercio',
            placeholder: "comercios",
            tipo: 'radio',
            lista: false,
        }
    ],
    asociacionesComercios: [
        {
            element: 'list',
            nombre: 'ID_Cliente',
            placeholder: "clientes",
            tipo: 'radio',
            lista: false,
        },
        {
            element: 'list',
            nombre: 'ID_Comercio',
            placeholder: "comercios",
            tipo: 'checkbox',
            lista: false,
        }
    ],
    historial: [
        {
            element: 'textarea',
            tipo: 'text',
            nombre: 'message',
            placeholder: 'Mensaje',
            valor: '',
            mensaje: "",
        },
        {
            element: 'input',
            tipo: 'text',
            nombre: 'fecha',
            placeholder: 'Fecha',
            valor: '',
            mensaje: "",
        }
    ]
}