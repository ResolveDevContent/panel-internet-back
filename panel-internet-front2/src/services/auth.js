import Cookies from "js-cookie"

export const LoginAuth = async (credentials, setAuth, setState, signal) => {
    try {
        const response = await fetch('http://vps-4375167-x.dattaweb.com/auth/login', {
            signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            setState({text: data.error, res: "secondary"})
            return
        }

        const token = data.token;

        setAuth(true);

        // Store static values in Cookies
        Cookies.set('token', token, { expires: 5 });
    } catch (err) {
        console.log(err)
        setState({text: "Error al Logearse." , res: "secondary"})
    }
};

export const LoginCliente = async (credentials, setAuth, setState, signal) => {
    try {
        const response = await fetch('http://vps-4375167-x.dattaweb.com/auth/login/cliente', {
            signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            setState({text: data.error, res: "secondary"})
            return
        }

        const token = data.token;

        setAuth(true);

        // Store static values in Cookies
        Cookies.set('token', token, { expires: 5 });
    } catch (err) {
        setState({text: "Error al Logearse" , res: "secondary"})
    }
};

export const LogoutAuth = async (setAuth, setState, signal) => {
    try {
        const response = await fetch('http://vps-4375167-x.dattaweb.com/auth/logout', {
            signal,
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            setState({text: data.error, res: "secondary"})
            return
        }

        setAuth(false);

        Cookies.remove("token");
    } catch (err) {
        setState({text: "Error al cerrar sesion" , res: "secondary"})
    }
}

export const PerfilAuth = (signal) => {
    const token = Cookies.get("token");

    return (
        fetch('http://vps-4375167-x.dattaweb.com/auth/perfil', {
            signal,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).then(res => res.json())
    )
}

export const RegisterAuth = async (credentials, setAuth, setState, signal) => {
    try {
        const response = await fetch('http://vps-4375167-x.dattaweb.com/auth/register', {
            signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            setState({text: data.error , res: "secondary"})
            return
        }

        const token = data.token;

        setAuth(true);

        // Store static values in Cookies
        Cookies.set('token', token, { expires: 5 });
    } catch (err) {
        setState({text: "Error al Logearse" , res: "secondary"})
    }
}

export const CambiarContraseña = async (credentials, setAuth, setState, signal) => {
    try {
        const response = await fetch('http://vps-4375167-x.dattaweb.com/auth/changepassword', {
            signal,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            setState({text: data.error, res: "secondary"})
            return
        }

        const token = data.token;

        setAuth(true);

        // Store static values in Cookies
        Cookies.set('token', token, { expires: 5 });
    } catch (err) {
        console.log(err)
        setState({text: "Error al Logearse." , res: "secondary"})
    }
};