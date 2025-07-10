import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-300 shadow-md p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center space-x-3">
        <img
          src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/logo-umpa-loompa.png"
          alt="Home"
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <span className="text-xl font-bold text-gray-800">
          Oompa Loompa's Crew
        </span>
      </div>
    </header>
  );
}
