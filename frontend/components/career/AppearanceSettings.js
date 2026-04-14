// components/career/AppearanceSettings.js
'use client'
import { useState } from 'react';
import { resumeTemplates, templateLayouts } from '@/frontend/data/resumeTemplates';

export default function AppearanceSettings({ layout, setLayout, currentTemplate, setTemplate, templates, templateLayouts: tl }) {
    const [expandedSection, setExpandedSection] = useState('colors');
    
    const colors = ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#6366f1', '#1f2937', '#7c3aed', '#ec4899', '#06b6d4'];
    const fonts = [
        { value: 'Inter', label: 'Inter (Moderne)' },
        { value: 'Georgia', label: 'Georgia (Classique)' },
        { value: 'Courier New', label: 'Courier (Technique)' },
        { value: 'Garamond', label: 'Garamond (Élégant)' }
    ];

    // Valeurs par défaut si layout est vide
    const safeLayout = {
        fontSize: layout?.fontSize ?? 11,
        lineHeight: layout?.lineHeight ?? 1.6,
        marginV: layout?.marginV ?? 50,
        marginH: layout?.marginH ?? 55,
        sectionSpacing: layout?.sectionSpacing ?? 32,
        primaryColor: layout?.primaryColor ?? '#000000',
        fontFamily: layout?.fontFamily ?? 'Inter',
        headerStyle: layout?.headerStyle ?? 'line-bottom',
        layout: layout?.layout ?? 'single-column',
        ...layout
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleSliderChange = (field, value) => {
        setLayout({ ...safeLayout, [field]: parseFloat(value) });
    };

    return (
        <div className="space-y-3 pb-20">
            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest px-4 py-3">
                Personnalisation du Design
            </h4>

            {/* TEMPLATES */}
            <CollapsibleSection
                title="🎨 Templates"
                isExpanded={expandedSection === 'templates'}
                onToggle={() => toggleSection('templates')}
            >
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {resumeTemplates && Object.values(resumeTemplates).map((t) => (
                        <button
                            key={t.name}
                            onClick={() => setTemplate(t.layout)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                currentTemplate === t.layout
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {t.icon} {t.name}
                        </button>
                    ))}
                </div>
            </CollapsibleSection>

            {/* COULEURS */}
            <CollapsibleSection
                title="🎨 Couleurs"
                isExpanded={expandedSection === 'colors'}
                onToggle={() => toggleSection('colors')}
            >
                <div className="space-y-4">
                    {/* Couleur primaire */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-3">
                            Couleur Thématique
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setLayout({...safeLayout, primaryColor: c})}
                                    className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${safeLayout.primaryColor === c ? 'border-gray-800 shadow-md' : 'border-gray-200'}`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                            <input 
                                type="color" 
                                value={safeLayout.primaryColor}
                                onChange={(e) => setLayout({...safeLayout, primaryColor: e.target.value})}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Preview couleur */}
                    <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                        <p className="text-[10px] font-bold text-gray-600 mb-2">APERÇU</p>
                        <div className="h-8 rounded-lg" style={{ backgroundColor: safeLayout.primaryColor }} />
                    </div>
                </div>
            </CollapsibleSection>

            {/* TYPOGRAPHIE */}
            <CollapsibleSection
                title="✍️ Typographie"
                isExpanded={expandedSection === 'typography'}
                onToggle={() => toggleSection('typography')}
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-2">
                            Police d'écriture
                        </label>
                        <select 
                            className="w-full text-xs border border-gray-200 p-2.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100"
                            value={safeLayout.fontFamily}
                            onChange={(e) => setLayout({...safeLayout, fontFamily: e.target.value})}
                        >
                            {fonts.map(f => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Taille de police */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-2">
                            Taille de police: {safeLayout.fontSize}pt
                        </label>
                        <input 
                            type="range" 
                            min="8" 
                            max="14" 
                            step="0.5"
                            value={safeLayout.fontSize}
                            onChange={(e) => handleSliderChange('fontSize', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Hauteur de ligne */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-2">
                            Interligne: {safeLayout.lineHeight.toFixed(1)}
                        </label>
                        <input 
                            type="range" 
                            min="1" 
                            max="2" 
                            step="0.1"
                            value={safeLayout.lineHeight}
                            onChange={(e) => handleSliderChange('lineHeight', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Preview */}
                    <div className="p-3 rounded-xl border border-gray-200 bg-gray-50" style={{ fontFamily: layout.fontFamily }}>
                        <p className="text-[10px] font-bold text-gray-600 mb-2">APERÇU</p>
                        <p style={{ fontSize: `${layout.fontSize}pt`, lineHeight: layout.lineHeight }}>
                            Voici un texte d'aperçu avec vos paramètres typographiques.
                        </p>
                    </div>
                </div>
            </CollapsibleSection>

            {/* ESPACEMENT */}
            <CollapsibleSection
                title="📐 Espacement"
                isExpanded={expandedSection === 'spacing'}
                onToggle={() => toggleSection('spacing')}
            >
                <div className="space-y-4">
                    {/* Marges verticales */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-2">
                            Marges verticales: {layout.marginV}px
                        </label>
                        <input 
                            type="range" 
                            min="20" 
                            max="80" 
                            step="5"
                            value={layout.marginV}
                            onChange={(e) => handleSliderChange('marginV', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Marges horizontales */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-2">
                            Marges horizontales: {layout.marginH}px
                        </label>
                        <input 
                            type="range" 
                            min="30" 
                            max="80" 
                            step="5"
                            value={layout.marginH}
                            onChange={(e) => handleSliderChange('marginH', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Espacement entre sections */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-700 block mb-2">
                            Espacement sections: {layout.sectionSpacing}px
                        </label>
                        <input 
                            type="range" 
                            min="12" 
                            max="40" 
                            step="3"
                            value={layout.sectionSpacing}
                            onChange={(e) => handleSliderChange('sectionSpacing', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Affichage compact */}
                    <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-[9px] text-gray-600">
                        <p className="font-bold mb-1">ZONES DE CONTENU</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Top: {layout.marginV}px</div>
                            <div>Côtés: {layout.marginH}px</div>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* RÉINITIALISER */}
            <button
                onClick={() => {
                    setLayout({
                        fontSize: 11,
                        lineHeight: 1.5,
                        marginV: 45,
                        marginH: 50,
                        sectionSpacing: 25,
                        primaryColor: '#2563eb',
                        fontFamily: 'Inter'
                    });
                }}
                className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
            >
                ↻ Réinitialiser les paramètres
            </button>
        </div>
    );
}

function CollapsibleSection({ title, isExpanded, onToggle, children }) {
    return (
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <span className="text-xs font-black uppercase tracking-widest text-gray-900">
                    {title}
                </span>
                <span className={`text-lg transition-transform flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isExpanded && (
                <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
                    {children}
                </div>
            )}
        </div>
    );
}