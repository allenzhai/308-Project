import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import ResultsSearchbar from '../components/ResultsSearchbar';
import ResultList from '../components/ResultList';

import SortMenu from '../components/SortMenu';
import TagList from '../components/TagList';
import useFetch from '../hooks/useFetch';

import '../style/SearchResults.css';

function SearchResults() {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  if (!params.has('terms')) {
    throw new Error('No search terms specified.');
  }
  const initTerms = params.get('terms');

  const sortByList = ['Name', 'Alias', 'Sub-Category', 'Category'];
  const [sortBy, setSortBy] = useState('Name');
  const [selectedTag, setSelectedTag] = useState(null);
  const [terms, setTerms] = useState(initTerms);

  const escapedSortBy = sortBy.toLowerCase().replace('-', '_');
  const endPoint = `/api/disorder/search?terms=${initTerms}&sortBy=${escapedSortBy}`;

  const [isLoading, data, error] = useFetch(endPoint);

  const handleSortUpdate = (value) => {
    setSelectedTag(null);
    setSortBy(value);
    history.push({
      pathname: '/results',
      search: `?terms=${terms}&sortBy=${value}`,
    });
  };

  const handleSearchbarSubmit = (value) => {
    setTerms(value);
    history.push({
      pathname: '/results',
      search: `?terms=${value}&sortBy=${sortBy}`,
    });
  };

  const resultList = data || [];

  const sortedBy = (
    <p className="sortedBy">
      {`${resultList.length} entries sorted by ${sortBy}`}
    </p>
  );

  if (error) {
    console.log(error);
  }


  const tagChange = (tagName) => {
    setSelectedTag(tagName);
  };

  return (
    <div className="results">
      <div className="search-results-container">
        <div className="search-margin">
          <h2 className="search-results-title">Search Results</h2>
          <SortMenu list={sortByList} onSortUpdate={handleSortUpdate} sortBy={sortBy} />
        </div>
        <ResultsSearchbar terms={terms} onSubmit={handleSearchbarSubmit} />
        {sortedBy}
        <TagList datasource={resultList} filterKey={escapedSortBy} onSelectionChange={tagChange} />
        <ResultList datasource={resultList} filterKey={escapedSortBy} filter={selectedTag} isLoading={isLoading}/>
      </div>
    </div>
  );
}

export default SearchResults;
