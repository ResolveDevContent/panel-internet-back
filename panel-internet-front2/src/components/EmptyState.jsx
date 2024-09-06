import { Info } from "../assets/icons/icons"

export const EmptyState = ({texto}) => {
    return (
        <div className="empty-state-card mt-3">
            <div className="empty-state">
                <Info />
                <span>{texto}</span>
            </div>
        </div>
    )
}