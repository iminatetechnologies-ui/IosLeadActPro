import {useState, useEffect} from 'react';
import {_get} from '../api/apiClient';

export const useResources = () => {
  const [budget, setBudget] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sources, setSources] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourceError, setResourceError] = useState('');

  const fetchResources = async () => {
    setLoadingResources(true);
    setResourceError('');

    try {
      const response = await _get('/getresources');

      if (response.status === 200) {
        const data = response.data.data;

        // Project list
        if (data.project) {
          setProjects(
            data.project.map(item => ({
              label: item.title,
              value: item.id,
              id: item.id,
            })),
          );
        }

        // Budget list
        if (data.budget) {
          setBudget(
            data.budget.map(item => ({
              label: item.name,
              value: item.id,
              id: item.id,
            })),
          );
        }

        // Lead Sources
        if (data.leadsources) {
          setSources(
            data.leadsources.map(item => ({
              label: item.name,
              value: item.id,
              id: item.id,
            })),
          );
        }

        // Lead Status
        if (data.lead_status) {
          setLeadStatus(
            data.lead_status.map(item => ({
              label: item.name,
              value: item.id,
              id: item.id,
            })),
          );
        }
      } else {
        setResourceError(response.data?.message || 'Unable to load data');
      }
    } catch (error) {
      console.log('Resources API Error:', error);
      setResourceError('Something went wrong');
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    loadingResources,
    resourceError,
    budget,
    projects,
    sources,
    leadStatus,
    fetchResources,
  };
};
