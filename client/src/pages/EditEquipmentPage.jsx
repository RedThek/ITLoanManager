import { useParams } from 'react-router-dom';

export default function EditEquipmentPage() {

    const { id } = useParams(); // Capture l'identifiant unique directement depuis l'URL

    return(
        <div>
            {id}
        </div>
    )
}