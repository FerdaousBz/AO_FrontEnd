import SoutenanceScreen from '@/screens/soutenance/soutenancescreen';
import { useParams } from 'react-router-dom/dist';
import SoutenanceScreenNew from '@/screens/soutenance/soutenancescreenNew.jsx';

export default function SoutenancePage() {
  return <SoutenanceScreen />; // Pass the id as a prop
}
