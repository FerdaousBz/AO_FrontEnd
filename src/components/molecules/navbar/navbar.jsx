import React, { useEffect, useState, useRef } from 'react';
import Search from '@/components/atoms/icons/search';
import styles from './navbar.module.scss';
import { getValueFromDict } from '@/service/filterNavbarService';

export default function Navbar({ opportunities, onFilterChange }) {
  const [isTypeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [isExpertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    expertiseArea: [],
    typeOfProject: [],
  });
  const [selectedExpertiseArea, setSelectedExpertiseArea] = useState('');
  const [selectedTypeOfProject, setSelectedTypeOfProject] = useState('');

  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filterData = await getValueFromDict();
        setFilters({
          expertiseArea: filterData.expertiseArea || [],
          typeOfProject: filterData.typeOfProject || [],
        });
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    const filteredSuggestions = opportunities.filter((item) =>
      item.opportunityDetails.title.toLowerCase().includes(input.toLowerCase()),
    );
    setSuggestions(filteredSuggestions);
    onFilterChange(selectedExpertiseArea, input, selectedTypeOfProject);
  };

  const handleExpertiseAreaFilterChange = (value) => {
    console.log('handleExpertiseAreaFilterChange.value', value);
    setSelectedExpertiseArea(value);
    onFilterChange(value, searchTerm, selectedTypeOfProject);
    setExpertiseDropdownOpen(false);
  };

  const handleTypeOfProjectFilterChange = (value) => {
    console.log('handleTypeOfProjectFilterChange.value', value);
    setSelectedTypeOfProject(value);
    onFilterChange(selectedExpertiseArea, searchTerm, value);
    setTypeDropdownOpen(false);
  };

  const handleInputBlur = (e) => {
    const popupElement = suggestionsRef.current;
    if (popupElement && !popupElement.contains(document.activeElement)) {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm(item.opportunityDetails.title);
    setSuggestions([]);
    onFilterChange(selectedExpertiseArea, item.opportunityDetails.title, selectedTypeOfProject);
  };

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.filters}>
        <div className={styles.dropdownWrapper}>
          <div
            className={styles.transportBox}
            onClick={() => setTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            <div className={styles.selectedValue}>
              {selectedTypeOfProject || 'Tous les types de projet'}
            </div>
            {isTypeDropdownOpen && (
              <ul className={styles.dropdownList}>
                <li onClick={() => handleTypeOfProjectFilterChange('')}>Tous</li>
                {filters.typeOfProject.map((item) => (
                  <li key={item.id} onClick={() => handleTypeOfProjectFilterChange(item.value)}>
                    {item.value}
                  </li>
                ))}
                <li onClick={() => handleTypeOfProjectFilterChange('hybride')}>Hybride</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.actions}>
          <div className={styles.searchBox} ref={suggestionsRef}>
            <Search className={styles.vue} />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleInputBlur}
            />
            {suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item.opportunityDetails.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.dropdownWrapper}>
            <div
              className={styles.transportBox}
              onClick={() => setExpertiseDropdownOpen(!isExpertiseDropdownOpen)}
            >
              <div className={styles.selectedValue}>
                {selectedExpertiseArea || 'Tous les domaines'}
              </div>
              {isExpertiseDropdownOpen && (
                <ul className={styles.dropdownList}>
                  <li onClick={() => handleExpertiseAreaFilterChange('')}>Tous les domaines</li>
                  {filters.expertiseArea.map((item) => (
                    <li key={item.id} onClick={() => handleExpertiseAreaFilterChange(item.value)}>
                      {item.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
