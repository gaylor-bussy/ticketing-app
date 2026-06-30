export default function SearchBar({ search, setSearch }) {
    return (
        <label className="input w-full md:max-w-md">
            <input
                className="w-full text-sm sm:text-base"
                type="search"
                placeholder="Recherche par numéro ou description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </label>
    );
}
