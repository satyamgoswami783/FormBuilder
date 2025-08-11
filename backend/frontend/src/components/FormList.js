import React, { useEffect, useState } from 'react';
import { getForms } from '../api';
import { Link, useHistory } from 'react-router-dom';

export default function FormList() {
  const [forms, setForms] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchForms = async () => {
      const response = await getForms();
      // console.log(response.data);
      setForms(response.data);
    };
    fetchForms();
  }, []);
  console.log(forms);

  return (
    <div className="container">
      <h2>Forms List</h2>
      <ul className="list-group">
        {forms.map(form => (
          <li key={form._id} className="list-group-item">
            <h5>{form.title}</h5>
            <p>{form.description}</p>
            <Link to={`/fill/${form._id}`} className="btn btn-primary ml-2">Fill</Link>
          </li>
        ))}
      </ul>
      <button onClick={() => history.push('/edit')}>Create New Form</button>
    </div>
  );
}