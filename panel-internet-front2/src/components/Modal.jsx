import '../assets/css/modal.css'

export const Modal = ({titulo, texto, show, children}) => {
    return (
        <div className={`modal fade d-block ${show}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" >{titulo}</h1>
                    </div>
                    <div className="modal-body">
                        {texto}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}