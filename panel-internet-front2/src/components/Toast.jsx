import '../assets/css/toast.css'

export const Toast = ({texto, res = "secondary"}) => {
    return (
        <div className={`toast bg-${res}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex align-center">
                <div className="toast-body">{texto}</div>
            </div>
        </div>
    )
}