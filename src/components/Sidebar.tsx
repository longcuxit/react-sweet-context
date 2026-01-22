import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routers } from '../Router';

const examples = Object.entries(routers)

const Sidebar: React.FC = () => {
  const location = useLocation();


  return (
    <div className="sidebar-container">
      <h2>Examples</h2>
      <ul className="examples-list">
        {examples.map(([id, item]) => (
          <li key={id}>
            <Link to={`/${id}`} className={location.pathname === `/${id}` ? 'active' : ''}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;