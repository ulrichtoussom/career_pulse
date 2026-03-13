// Ce composant contient toute la logique du formulaire et de l'import PDF.
// components/career/CareerForm.js

export default function CareerForm({ 
    generate, 
    loading, 
    templates, 
    selectedTemplate, 
    setSelectedTemplate, 
    fileName, 
    setFileName 
}) {
    return (
        <div className="w-full md:w-[350px] bg-white border-r p-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold mb-6 italic">Career Studio</h2>
            
            <div className="mb-8">
                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">1. Style du CV</label>
                <div className="grid grid-cols-3 gap-2">
                    {Object.keys(templates).map((t) => (
                        <button
                            key={t}
                            type="button" 
                            onClick={() => setSelectedTemplate(t)}
                            className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border-2 transition-all ${
                                selectedTemplate === t 
                                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                : 'border-gray-100 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={generate} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Optionnel : Ancien CV (PDF)</label>
                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-gray-50">
                        <input 
                            type="file" 
                            name="cv_file" 
                            accept=".pdf"
                            onChange={(e) => setFileName(e.target.files[0]?.name)} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                            {fileName ? (
                                <div className="flex flex-col items-center animate-bounce-short">
                                    <span className="text-blue-600 font-bold text-xs">📄 {fileName}</span>
                                    <p className="text-[10px] text-gray-400 mt-1">Fichier prêt !</p>
                                </div>
                            ) : (
                                <p className="text-[10px] text-gray-500 mt-1">Cliquez pour importer un PDF</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">2. Mon Profil</label>
                    <textarea 
                        name="profile_summary" 
                        placeholder="Ou décrivez brièvement votre parcours ici..." 
                        className="w-full h-32 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">3. L'Annonce</label>
                    <textarea 
                        name="job_description" 
                        placeholder="Collez l'offre ici..." 
                        className="w-full h-32 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none" 
                    />
                </div>

                <button 
                    disabled={loading} 
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {loading ? "IA en cours..." : "Générer le dossier"}
                </button>
            </form>
        </div>
    );
}