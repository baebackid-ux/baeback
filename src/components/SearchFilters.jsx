import { Filter, Search } from 'lucide-react';
import { categories, itemConditions, pickupMethods } from '../lib/constants';

export default function SearchFilters({ filters, onChange }) {
  function updateFilter(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <section className="filters-panel">
      <div className="search-field">
        <Search size={19} />
        <input
          value={filters.query}
          onChange={(event) => updateFilter('query', event.target.value)}
          placeholder="Cari buku, pakaian, elektronik, perlengkapan bayi..."
        />
      </div>
      <div className="filter-grid">
        <label>
          <span>Kategori</span>
          <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">Semua kategori</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Kondisi</span>
          <select value={filters.condition} onChange={(event) => updateFilter('condition', event.target.value)}>
            <option value="">Semua kondisi</option>
            {itemConditions.map((condition) => (
              <option key={condition}>{condition}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Metode ambil</span>
          <select value={filters.pickup} onChange={(event) => updateFilter('pickup', event.target.value)}>
            <option value="">Semua metode</option>
            {pickupMethods.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="filter-hint">
        <Filter size={15} />
        Pilih yang paling sesuai—semua barang di BaeBack dibagikan tanpa biaya.
      </div>
    </section>
  );
}
