import React from 'react';
import { VscSearch, VscClose } from 'react-icons/vsc';

const SearchInput = ({ value, onChange, onClear }) => (
  <div className="search-wrapper glass" style={{ display: 'flex', alignItems: 'center', padding: '8px 15px', marginBottom: '15px', borderRadius: '12px', width: 'fit-content' }}>
    <VscSearch size={18} style={{ color: 'var(--color-lime)', marginRight: '10px' }} />
    <input 
      type="text" 
      placeholder="Buscar valor..." 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem' }}
    />
    {value && <VscClose size={18} onClick={onClear} style={{ cursor: 'pointer', marginLeft: '10px' }} />}
  </div>
);

export default SearchInput;
