'use client'
import { resumeTemplates } from '@/frontend/data/resumeTemplates';
import ImportCV from './ImportCV';
import { useState } from 'react';

export default function TemplateSelector({ onSelect }) {
  const [showImport, setShowImport] = useState(false);

  const handleImportCV = (parsedData) => {
    // Sélectionner le premier template par défaut pour l'import
    onSelect('modernBlue', parsedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-3">
            Créer ou Importer Votre CV
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez un template ou importez votre CV existant
          </p>
        </div>

        {/* IMPORT SECTION */}
        {showImport ? (
          <div className="mb-12">
            <ImportCV onImport={handleImportCV} />
            <button
              onClick={() => setShowImport(false)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-bold"
            >
              ← Retour aux templates
            </button>
          </div>
        ) : (
          <div className="mb-12 text-center">
            <button
              onClick={() => setShowImport(true)}
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              📤 Importer un CV Existant
            </button>
          </div>
        )}

        {!showImport && (
          <>
            {/* GRID TEMPLATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(resumeTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => onSelect(key, template.data)}
                  className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 text-left"
                >
                  {/* Background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/10 transition-all duration-300" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {template.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-2">
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Button */}
                    <div className="mt-6 inline-block">
                      <span className="text-xs font-black uppercase tracking-widest text-blue-600 group-hover:text-blue-700 transition-colors">
                        Créer →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* FEATURES */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl mb-3">📝</div>
                <h4 className="font-black uppercase text-gray-900 mb-2">Édition Facile</h4>
                <p className="text-sm text-gray-600">Modifiez chaque section en temps réel</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎨</div>
                <h4 className="font-black uppercase text-gray-900 mb-2">Personnalisation</h4>
                <p className="text-sm text-gray-600">Couleurs, polices, espacement à votre goût</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📄</div>
                <h4 className="font-black uppercase text-gray-900 mb-2">Export Professionnel</h4>
                <p className="text-sm text-gray-600">Téléchargez en PDF immédiatement</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
