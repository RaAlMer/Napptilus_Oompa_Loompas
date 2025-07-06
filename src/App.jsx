import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListView from './features/list/ListView';
import DetailView from './features/detail/DetailView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/:id" element={<DetailView />} />
    </Routes>
  );
}
