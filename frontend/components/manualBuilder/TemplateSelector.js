'use client'
import { resumeTemplates } from '@/frontend/data/resumeTemplates';

export default function TemplateSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-3">
            Choisissez Votre Template
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez un design pour commencer à éditer votre CV
          </p>
        </div>

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
                    Choisir →
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
      </div>
    </div>
  );
}
