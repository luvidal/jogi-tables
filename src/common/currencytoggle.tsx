const CurrencyToggle = ({ value, onChange }: { value: 'uf' | 'clp', onChange: (v: 'uf' | 'clp') => void }) => (
    <span className="inline-flex rounded-md overflow-hidden border border-amber-200 ml-2 text-[10px] leading-none align-middle">
        <button
            className={`px-1.5 py-0.5 font-medium transition-colors ${value === 'uf' ? 'bg-amber-200 text-amber-800' : 'text-amber-500 hover:text-amber-700'}`}
            onClick={() => onChange('uf')}
        >UF</button>
        <button
            className={`px-1.5 py-0.5 font-medium transition-colors ${value === 'clp' ? 'bg-amber-200 text-amber-800' : 'text-amber-500 hover:text-amber-700'}`}
            onClick={() => onChange('clp')}
        >$</button>
    </span>
)

export default CurrencyToggle
