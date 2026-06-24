export default function SearchBar({ search, setSearch }) {
    return (
        <label className="input">
            <input
                type="search"
                placeholder="Recherche par numéro ou description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </label>
    );
}