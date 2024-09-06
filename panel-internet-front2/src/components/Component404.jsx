import Logo from '../assets/images/logo.png'

export const Component404 = () => {
    return (
        <section className="notFound d-flex flex-column align-center justify-center">
            <h1 className="fw-bolder">Error 404</h1>
            <p>Esta página no existe</p>
            <img src={Logo} alt=""/>
        </section>
    )
}