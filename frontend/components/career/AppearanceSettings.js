// components/career/AppearanceSettings.js
export default function AppearanceSettings({ theme, setTheme, currentTemplate, setTemplate }) {
    const colors = ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#6366f1', '#1f2937', '#7c3aed'];

    return (
        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">
                Design du CV
            </h4>
            
            {/* CHOIX DU TEMPLATE */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-gray-700">Modèle</p>
                <div className="grid grid-cols-1 gap-2">
                    {['Moderne', 'Épure', 'Créatif'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTemplate(t)}
                            className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                                currentTemplate === t 
                                ? 'bg-blue-50 border-blue-200 text-blue-700 border shadow-sm' 
                                : 'bg-gray-50 border-transparent border hover:bg-gray-100'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* SÉLECTEUR DE COULEUR */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-gray-700">Couleur thématique</p>
                <div className="flex gap-3 flex-wrap">
                    {colors.map(c => (
                        <button 
                            key={c}
                            onClick={() => setTheme({...theme, primaryColor: c, secondaryColor: c + 'CC'})}
                            className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${theme.primaryColor === c ? 'border-gray-800 shadow-md' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    {/* Sélecteur personnalisé */}
                    <input 
                        type="color" 
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                </div>
            </div>

            {/* SÉLECTEUR DE POLICE */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-gray-700">Typographie</p>
                <select 
                    className="w-full text-xs border border-gray-200 p-2.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100"
                    value={theme.fontFamily}
                    onChange={(e) => setTheme({...theme, fontFamily: e.target.value})}
                >
                    <option value="font-sans">Inter (Moderne)</option>
                    <option value="font-serif">Playfair Display (Classique)</option>
                    <option value="font-mono">Fira Code (Technique)</option>
                </select>
            </div>
        </div>
    );
}