import React from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data/apiCategories';
import ApiCard from '../components/ApiCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">找不到該分類</h2>
        <p className="text-gray-600 mt-2">請選擇其他分類查看</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h2>
        <p className="text-gray-600">{category.description}</p>
      </div>

      <div className="space-y-6">
        {category.apis.map(api => (
          <ApiCard key={api.id} api={api} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage; 