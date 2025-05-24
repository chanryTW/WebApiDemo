import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data/apiCategories';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md rounded-lg p-4 mb-6">
      <ul className="flex flex-wrap gap-4">
        <li>
          <Link
            to="/"
            className={`px-4 py-2 rounded-md transition-colors hover:bg-blue-100 ${
              location.pathname === '/' 
                ? 'bg-blue-500 text-white' 
                : ''
            }`}
          >
            首頁
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/category/${category.id}`}
              className={`px-4 py-2 rounded-md transition-colors hover:bg-blue-100 ${
                location.pathname === `/category/${category.id}`
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 