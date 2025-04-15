import React, { useEffect, useState } from 'react';
import DashboardScreen from '@/screens/dashboard/DashboardScreen';

/*
import { getAllOpportunities } from '@/service/opportunitieService';
import Cookies from 'js-cookie';
*/
export default function DashboardPage() {
  return <DashboardScreen />;
  //TODO: supprimé le commentaire
/*
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  useEffect(() =>{
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
    const fetchOpportunities = async () =>{
      try {
        setLoading(true);
        const data = await getAllOpportunities(page, limit,accessToken);
        console.log("data opp:", data);
        if(Array.isArray(data)){
          setOpportunities(data);
        }else{
          console.error('Expected an array but got' , data);
        }
      } catch (error) {
        setError('Error fetching opportunities');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  },[]);
  if (loading) {
    return <div>Loading opportunities...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (<DashboardScreen opportunities={opportunities}  />); */
}
