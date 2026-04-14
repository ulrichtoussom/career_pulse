// CareerResumePreview.js
// layout.layout = 'sidebar'       → colonne gauche colorée + colonne droite blanche
// layout.layout = 'single-column' → colonne unique classique

// ── Composants hors du render principal (évite les remontages) ──────────────

function SectionTitle({ name, label, sectionTitles, layout }) {
    return (
        <h2 style={{
            fontSize: '9px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: layout.primaryColor,
            borderBottom: `1.5px solid ${layout.accentColor}`,
            paddingBottom: '4px',
            marginBottom: '10px',
            marginTop: 0,
            fontFamily: layout.fontFamily
        }}>
            {sectionTitles?.[name] || label}
        </h2>
    );
}

function SideTitle({ children, accentColor }) {
    return (
        <h2 style={{
            fontSize: '8px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: accentColor,
            borderBottom: `1px solid ${accentColor}50`,
            paddingBottom: '4px',
            marginBottom: '10px',
            marginTop: '18px'
        }}>
            {children}
        </h2>
    );
}

// ── Helpers purs (pas des composants React) ──────────────────────────────────

function renderBold(text) {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/).map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : part
    );
}

function formatDate(d) {
    if (!d) return '';
    const s = String(d).trim();
    // YYYY-MM → MM/YYYY
    const m1 = s.match(/^(\d{4})-(\d{2})$/);
    if (m1) return `${m1[2]}/${m1[1]}`;
    // YYYY-MM-DD → MM/YYYY
    const m2 = s.match(/^(\d{4})-(\d{2})-\d{2}$/);
    if (m2) return `${m2[2]}/${m2[1]}`;
    return s;
}

function dateRange(start, end) {
    const s = formatDate(start);
    const e = formatDate(end);
    return [s, e || 'Présent'].filter(Boolean).join(' → ');
}

function Bullets({ items, color }) {
    const filtered = items?.filter(i => i?.trim()) || [];
    if (!filtered.length) return null;
    return (
        <div style={{ marginTop: '4px' }}>
            {filtered.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '6px', fontSize: '9px', marginBottom: '2px' }}>
                    <span style={{ color, flexShrink: 0 }}>▸</span>
                    <span>{renderBold(item)}</span>
                </div>
            ))}
        </div>
    );
}

// ── Helper initiales ────────────────────────────────────────────────────────
function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

// ── Composant principal ──────────────────────────────────────────────────────

export default function ResumePreview({ data, layout, sectionTitles }) {
    if (!data) return null;

    const basics = data.basics || {};
    const lc = layout.primaryColor;
    const la = layout.accentColor || layout.primaryColor;
    const lf = layout.fontFamily;

    // ── En-tête colonne unique ───────────────────────────────────────────────

    const renderSingleHeader = () => {
        switch (layout.headerStyle) {
            case 'colored-bg':
                return (
                    <header style={{ backgroundColor: lc, color: '#fff', padding: '28px 24px', marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 4px 0', fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9, margin: '0 0 12px 0' }}>{basics.label}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '9px', opacity: 0.85 }}>
                            {basics.email && <span>{basics.email}</span>}
                            {basics.phone && <span>{basics.phone}</span>}
                            {basics.location?.city && <span>{basics.location.city}</span>}
                            {basics.url && <span>{basics.url.replace(/^https?:\/\//, '')}</span>}
                        </div>
                    </header>
                );

            case 'gradient-bg':
                return (
                    <header style={{ background: `linear-gradient(135deg, ${lc} 0%, ${la} 100%)`, color: '#fff', padding: '28px 24px', marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 4px 0', fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9, margin: '0 0 12px 0' }}>{basics.label}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '9px', opacity: 0.9 }}>
                            {basics.email && <span>{basics.email}</span>}
                            {basics.phone && <span>{basics.phone}</span>}
                            {basics.location?.city && <span>{basics.location.city}</span>}
                            {basics.url && <span>{basics.url.replace(/^https?:\/\//, '')}</span>}
                        </div>
                    </header>
                );

            case 'luxury-line':
                return (
                    <header style={{ marginBottom: '28px', paddingBottom: '16px', borderBottom: `3px solid ${lc}` }}>
                        <h1 style={{ fontSize: '26px', fontWeight: 900, color: lc, margin: '0 0 2px 0', fontFamily: lf, letterSpacing: '1px', textTransform: 'uppercase' }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '9px', color: la, fontWeight: 600, margin: '0 0 10px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>{basics.label}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '9px', color: '#555' }}>
                            {basics.email && <span>{basics.email}</span>}
                            {basics.phone && <span>{basics.phone}</span>}
                            {basics.location?.city && <span>{basics.location.city}</span>}
                            {basics.url && <span>{basics.url.replace(/^https?:\/\//, '')}</span>}
                        </div>
                    </header>
                );

            case 'minimal':
                return (
                    <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: '0 0 2px 0', fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '10px', color: '#777', margin: '0 0 8px 0' }}>{basics.label}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '9px', color: '#888' }}>
                            {basics.email && <span>{basics.email}</span>}
                            {basics.phone && <span>{basics.phone}</span>}
                            {basics.location?.city && <span>{basics.location.city}</span>}
                        </div>
                    </header>
                );

            case 'classic-line':
                return (
                    <header style={{ marginBottom: '24px', paddingBottom: '14px', borderBottom: `2px double ${lc}`, textAlign: 'center' }}>
                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: lc, margin: '0 0 4px 0', fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '11px', fontStyle: 'italic', color: '#555', margin: '0 0 10px 0' }}>{basics.label}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', fontSize: '9px', color: '#666' }}>
                            {basics.email && <span>{basics.email}</span>}
                            {basics.phone && <span>{basics.phone}</span>}
                            {basics.location?.city && <span>{basics.location.city}</span>}
                        </div>
                    </header>
                );

            default: // line-bottom (classicPro)
                return (
                    <header style={{ marginBottom: '24px', paddingBottom: '14px', borderBottom: `2px solid ${lc}` }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, color: lc, margin: '0 0 2px 0', fontFamily: lf, textTransform: 'uppercase', letterSpacing: '1px' }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '11px', color: '#666', margin: '0 0 10px 0', fontWeight: 500 }}>{basics.label}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '9px', color: '#555' }}>
                            {basics.email && <span>{basics.email}</span>}
                            {basics.phone && <span>{basics.phone}</span>}
                            {basics.location?.city && <span>{basics.location.city}</span>}
                            {basics.url && <span>{basics.url.replace(/^https?:\/\//, '')}</span>}
                        </div>
                    </header>
                );
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // LAYOUT TIMELINE (Template 1 — Navy Timeline)
    // ════════════════════════════════════════════════════════════════════════

    if (layout.layout === 'timeline') {
        const navy = lc;
        const blue = la;
        const secTitle = {
            fontSize: '8px', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.2em', color: navy,
            borderBottom: `1.5px solid ${blue}`,
            paddingBottom: '3px', marginBottom: '12px', marginTop: 0,
            fontFamily: lf,
        };
        const tlRow = (left, right) => (
            <div style={{ display: 'flex', marginBottom: '14px' }}>
                <div style={{ width: '22%', textAlign: 'right', paddingRight: '14px', borderRight: `1px solid #ddd`, flexShrink: 0, fontSize: '8px', color: '#666', lineHeight: 1.4 }}>
                    {left}
                </div>
                <div style={{ flex: 1, paddingLeft: '14px' }}>{right}</div>
            </div>
        );
        const profiles = basics.profiles?.filter(p => p.network && p.url) || [];
        const linkedin = profiles.find(p => p.network?.toLowerCase().includes('linkedin'));
        const github = profiles.find(p => p.network?.toLowerCase().includes('github'));

        return (
            <div style={{ fontFamily: lf, fontSize: `${layout.fontSize}px`, backgroundColor: '#fff', minHeight: '842px' }}>
                {/* ── HEADER navy ── */}
                <header style={{ backgroundColor: navy, color: '#fff', padding: '22px 32px 18px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 3px 0', letterSpacing: '0.3px', fontFamily: lf }}>{basics.name}</h1>
                    {basics.label && (
                        <p style={{ fontSize: '9px', fontWeight: 600, margin: '0 0 10px 0', opacity: 0.88, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{basics.label}</p>
                    )}
                    <div style={{ height: '1px', backgroundColor: `${blue}70`, marginBottom: '10px' }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '8px', opacity: 0.85 }}>
                        {basics.email && <span>✉ {basics.email}</span>}
                        {basics.phone && <span>☎ {basics.phone}</span>}
                        {basics.location?.city && <span>⌖ {basics.location.city}</span>}
                        {linkedin && <span>in {linkedin.url.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {github && <span>⌥ {github.url.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </header>

                {/* ── BODY ── */}
                <div style={{ padding: '20px 32px', lineHeight: layout.lineHeight }}>

                    {/* Summary — blockquote */}
                    {basics.summary && (
                        <div style={{ borderLeft: `3px solid ${blue}`, paddingLeft: '14px', marginBottom: '20px', backgroundColor: `${blue}08` }}>
                            <p style={{ fontSize: '9.5px', lineHeight: 1.6, fontStyle: 'italic', margin: '6px 0', color: '#333', textAlign: 'justify' }}>{basics.summary}</p>
                        </div>
                    )}

                    {/* Expérience */}
                    {data.work?.length > 0 && (
                        <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
                            <h2 style={secTitle}>{sectionTitles?.work || 'Parcours Professionnel'}</h2>
                            {data.work.map((job, i) => tlRow(
                                <><div style={{ marginBottom: '3px' }}>{dateRange(job.startDate, job.endDate)}</div><div style={{ fontWeight: 700, color: navy }}>{job.name}</div></>,
                                <><div style={{ fontSize: '10px', fontWeight: 900 }}>{job.position}</div>{job.summary && <p style={{ fontSize: '9px', margin: '3px 0 0 0', textAlign: 'justify', color: '#444' }}>{job.summary}</p>}<Bullets items={job.highlights} color={blue} /></>
                            ))}
                        </section>
                    )}

                    {/* Formation */}
                    {data.education?.length > 0 && (
                        <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
                            <h2 style={secTitle}>{sectionTitles?.education || 'Formation'}</h2>
                            {data.education.map((edu, i) => tlRow(
                                <div>{dateRange(edu.startDate, edu.endDate)}</div>,
                                <div style={{ fontSize: '10px', fontWeight: 900 }}>{[edu.studyType, edu.area].filter(Boolean).join(' ')}{edu.institution ? <span style={{ fontWeight: 400 }}> — {edu.institution}</span> : null}</div>
                            ))}
                        </section>
                    )}

                    {/* Projets */}
                    {data.projects?.length > 0 && (
                        <section style={{ marginBottom: `${layout.sectionSpacing}px` }}>
                            <h2 style={secTitle}>{sectionTitles?.projects || 'Projets Stratégiques'}</h2>
                            {data.projects.map((proj, i) => tlRow(
                                <div>{proj.startDate ? formatDate(proj.startDate) : ''}</div>,
                                <><div style={{ fontSize: '10px', fontWeight: 900 }}>{proj.name}</div>{proj.description && <p style={{ fontSize: '9px', margin: '3px 0 4px 0', color: '#444' }}>{proj.description}</p>}{proj.highlights?.length > 0 && (<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>{proj.highlights.map((h, j) => <span key={j} style={{ fontSize: '7.5px', color: '#666', border: '1px solid #ccc', borderRadius: '3px', padding: '1px 5px' }}>{h}</span>)}</div>)}{proj.url && <div style={{ fontSize: '8px', color: blue, marginTop: '3px' }}>{proj.url.replace(/^https?:\/\//, '')}</div>}</>
                            ))}
                        </section>
                    )}

                    {/* Compétences + Langues — ligne du bas */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: `${layout.sectionSpacing}px` }}>
                        {data.skills?.length > 0 && (
                            <div style={{ flex: 2 }}>
                                <h2 style={secTitle}>{sectionTitles?.skills || 'Compétences Clés'}</h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {data.skills.map((skill, i) => (
                                        <span key={i} style={{ fontSize: '8px', fontWeight: 600, backgroundColor: `${navy}12`, color: navy, border: `1px solid ${navy}28`, borderRadius: '3px', padding: '2px 7px' }}>{skill.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.languages?.length > 0 && (
                            <div style={{ flex: 1 }}>
                                <h2 style={secTitle}>{sectionTitles?.languages || 'Langues'}</h2>
                                {data.languages.map((lang, i) => (
                                    <div key={i} style={{ fontSize: '9px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700 }}>{lang.language}</span>
                                        {lang.fluency && <span style={{ color: '#888' }}> — {lang.fluency}</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Centres d'intérêt */}
                    {data.interests?.length > 0 && (
                        <section>
                            <h2 style={secTitle}>{sectionTitles?.interests || "Centres d'Intérêt"}</h2>
                            <p style={{ fontSize: '9px', color: '#555', margin: 0 }}>{data.interests.map(i => i.name || i).filter(Boolean).join(' · ')}</p>
                        </section>
                    )}
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // SIDEBAR — DARK INITIALS (Template 3)
    // ════════════════════════════════════════════════════════════════════════

    if (layout.layout === 'sidebar' && layout.sidebarStyle === 'dark-initials') {
        const initials = getInitials(basics.name);
        const sideColor = lc;   // #1e293b
        const sideAccent = la;  // #94a3b8
        const mainSecTitle = (label) => ({
            fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: sideColor,
            borderBottom: `1.5px solid ${sideColor}30`,
            paddingBottom: '3px', marginBottom: '10px', marginTop: 0, fontFamily: lf,
        });

        return (
            <div style={{ display: 'flex', minHeight: '842px', fontFamily: lf, fontSize: `${layout.fontSize}px` }}>
                {/* ── SIDEBAR gauche sombre ── */}
                <div style={{ width: '33%', backgroundColor: sideColor, color: '#fff', padding: '28px 16px', boxSizing: 'border-box', flexShrink: 0 }}>
                    {/* Initiales */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: sideAccent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 900, color: sideColor, letterSpacing: '-1px' }}>{initials}</span>
                        </div>
                    </div>
                    {/* Nom & titre */}
                    <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${sideAccent}40` }}>
                        <h1 style={{ fontSize: '13px', fontWeight: 900, margin: '0 0 4px 0', lineHeight: 1.2, fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '8px', opacity: 0.75, margin: 0, lineHeight: 1.3 }}>{basics.label}</p>}
                    </div>
                    {/* Contact */}
                    <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: 0 }}>Contact</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                        {basics.email && <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', opacity: 0.85 }}>{basics.email}</p>}
                        {basics.phone && <p style={{ fontSize: '8px', margin: 0, opacity: 0.85 }}>{basics.phone}</p>}
                        {basics.location?.city && <p style={{ fontSize: '8px', margin: 0, opacity: 0.85 }}>{basics.location.city}</p>}
                        {basics.url && <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', opacity: 0.7 }}>{basics.url.replace(/^https?:\/\//, '')}</p>}
                    </div>
                    {/* Compétences */}
                    {data.skills?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>Compétences</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {data.skills.map((skill, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: sideAccent, flexShrink: 0 }} />
                                        <span style={{ fontSize: '8.5px', opacity: 0.9 }}>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {/* Langues */}
                    {data.languages?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>Langues</h2>
                            {data.languages.map((lang, i) => (
                                <div key={i} style={{ marginBottom: '5px' }}>
                                    <p style={{ fontSize: '9px', margin: 0, fontWeight: 600 }}>{lang.language}</p>
                                    {lang.fluency && <p style={{ fontSize: '8px', margin: 0, opacity: 0.7 }}>{lang.fluency}</p>}
                                </div>
                            ))}
                        </>
                    )}
                    {/* Profils */}
                    {basics.profiles?.filter(p => p.url).length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>Profils</h2>
                            {basics.profiles.filter(p => p.url).map((p, i) => (
                                <p key={i} style={{ fontSize: '8px', margin: '0 0 4px 0', wordBreak: 'break-all', opacity: 0.8 }}>{p.network}: {p.url.replace(/^https?:\/\//, '')}</p>
                            ))}
                        </>
                    )}
                </div>
                {/* ── COLONNE DROITE ── */}
                <div style={{ flex: 1, backgroundColor: '#fff', padding: '28px 22px', boxSizing: 'border-box' }}>
                    {basics.summary && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Profil</h2><p style={{ fontSize: '9.5px', lineHeight: layout.lineHeight, textAlign: 'justify', margin: 0 }}>{basics.summary}</p></section>}
                    {data.work?.length > 0 && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Expériences Professionnelles</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{data.work.map((job, i) => (<div key={i}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}><div><div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>{job.position}</div><div style={{ fontSize: '9px', color: sideColor, fontWeight: 600 }}>{job.name}</div></div><div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(job.startDate, job.endDate)}</div></div>{job.summary && <p style={{ fontSize: '9px', lineHeight: '1.45', textAlign: 'justify', margin: '4px 0 0 0' }}>{job.summary}</p>}<Bullets items={job.highlights} color={sideColor} /></div>))}</div></section>}
                    {data.education?.length > 0 && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Formations</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{data.education.map((edu, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: '10px', fontWeight: 900 }}>{[edu.studyType, edu.area].filter(Boolean).join(' — ')}</div><div style={{ fontSize: '9px', color: '#666' }}>{edu.institution}</div></div><div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(edu.startDate, edu.endDate)}</div></div>))}</div></section>}
                    {data.projects?.length > 0 && <section><h2 style={mainSecTitle()}>Projets</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{data.projects.map((proj, i) => (<div key={i}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ fontSize: '10px', fontWeight: 900 }}>{proj.name}</div>{(proj.startDate || proj.endDate) && <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(proj.startDate, proj.endDate)}</div>}</div>{proj.description && <p style={{ fontSize: '9px', margin: '2px 0 0 0' }}>{proj.description}</p>}<Bullets items={proj.highlights} color={sideColor} /></div>))}</div></section>}
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // SIDEBAR — LIGHT INITIALS (Template 4)
    // ════════════════════════════════════════════════════════════════════════

    if (layout.layout === 'sidebar' && layout.sidebarStyle === 'light-initials') {
        const initials = getInitials(basics.name);
        const sideBg = layout.sidebarBg || '#f1f5f9';
        const sideText = '#1e293b';
        const accent = la; // #6366f1
        const mainSecTitle = () => ({
            fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: sideText,
            borderBottom: `1.5px solid ${accent}50`,
            paddingBottom: '3px', marginBottom: '10px', marginTop: 0, fontFamily: lf,
        });

        return (
            <div style={{ display: 'flex', minHeight: '842px', fontFamily: lf, fontSize: `${layout.fontSize}px` }}>
                {/* ── SIDEBAR gauche claire ── */}
                <div style={{ width: '32%', backgroundColor: sideBg, color: sideText, padding: '28px 16px', boxSizing: 'border-box', flexShrink: 0, borderRight: '1px solid #e2e8f0' }}>
                    {/* Initiales dans cercle accent */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${accent}40` }}>
                            <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{initials}</span>
                        </div>
                    </div>
                    {/* Nom & titre */}
                    <div style={{ textAlign: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: `1px solid #e2e8f0` }}>
                        <h1 style={{ fontSize: '12px', fontWeight: 900, margin: '0 0 3px 0', lineHeight: 1.2, color: sideText, fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '8px', color: '#64748b', margin: 0, lineHeight: 1.3 }}>{basics.label}</p>}
                    </div>
                    {/* Contact */}
                    <h2 style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}30`, paddingBottom: '3px', marginBottom: '8px', marginTop: 0 }}>Informations</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                        {basics.email && <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', color: '#475569' }}>{basics.email}</p>}
                        {basics.phone && <p style={{ fontSize: '8px', margin: 0, color: '#475569' }}>{basics.phone}</p>}
                        {basics.location?.city && <p style={{ fontSize: '8px', margin: 0, color: '#475569' }}>{basics.location.city}</p>}
                        {basics.url && <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', color: accent }}>{basics.url.replace(/^https?:\/\//, '')}</p>}
                    </div>
                    {/* Compétences */}
                    {data.skills?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}30`, paddingBottom: '3px', marginBottom: '8px', marginTop: '12px' }}>Compétences</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {data.skills.map((skill, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
                                        <span style={{ fontSize: '8.5px', color: sideText }}>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {/* Langues */}
                    {data.languages?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}30`, paddingBottom: '3px', marginBottom: '8px', marginTop: '12px' }}>Langues</h2>
                            {data.languages.map((lang, i) => (
                                <div key={i} style={{ marginBottom: '5px' }}>
                                    <p style={{ fontSize: '9px', margin: 0, fontWeight: 600, color: sideText }}>{lang.language}</p>
                                    {lang.fluency && <p style={{ fontSize: '8px', margin: 0, color: '#64748b' }}>{lang.fluency}</p>}
                                </div>
                            ))}
                        </>
                    )}
                    {/* Profils */}
                    {basics.profiles?.filter(p => p.url).length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, borderBottom: `1px solid ${accent}30`, paddingBottom: '3px', marginBottom: '8px', marginTop: '12px' }}>Profils</h2>
                            {basics.profiles.filter(p => p.url).map((p, i) => (
                                <p key={i} style={{ fontSize: '8px', margin: '0 0 4px 0', wordBreak: 'break-all', color: accent }}>{p.network}: {p.url.replace(/^https?:\/\//, '')}</p>
                            ))}
                        </>
                    )}
                </div>
                {/* ── COLONNE DROITE ── */}
                <div style={{ flex: 1, backgroundColor: '#fff', padding: '28px 22px', boxSizing: 'border-box' }}>
                    {basics.summary && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Profil</h2><p style={{ fontSize: '9.5px', lineHeight: layout.lineHeight, textAlign: 'justify', margin: 0 }}>{basics.summary}</p></section>}
                    {data.work?.length > 0 && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Expériences Professionnelles</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{data.work.map((job, i) => (<div key={i}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}><div><div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>{job.position}</div><div style={{ fontSize: '9px', color: accent, fontWeight: 600 }}>{job.name}</div></div><div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(job.startDate, job.endDate)}</div></div>{job.summary && <p style={{ fontSize: '9px', lineHeight: '1.45', textAlign: 'justify', margin: '4px 0 0 0' }}>{job.summary}</p>}<Bullets items={job.highlights} color={accent} /></div>))}</div></section>}
                    {data.education?.length > 0 && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Formations</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{data.education.map((edu, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: '10px', fontWeight: 900 }}>{[edu.studyType, edu.area].filter(Boolean).join(' — ')}</div><div style={{ fontSize: '9px', color: '#666' }}>{edu.institution}</div></div><div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(edu.startDate, edu.endDate)}</div></div>))}</div></section>}
                    {data.projects?.length > 0 && <section><h2 style={mainSecTitle()}>Projets</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{data.projects.map((proj, i) => (<div key={i}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ fontSize: '10px', fontWeight: 900 }}>{proj.name}</div>{(proj.startDate || proj.endDate) && <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(proj.startDate, proj.endDate)}</div>}</div>{proj.description && <p style={{ fontSize: '9px', margin: '2px 0 0 0' }}>{proj.description}</p>}<Bullets items={proj.highlights} color={accent} /></div>))}</div></section>}
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // SIDEBAR — GRADIENT LEFT (Template 2 — Purple Gradient)
    // ════════════════════════════════════════════════════════════════════════

    if (layout.layout === 'sidebar' && layout.sidebarStyle === 'gradient-left') {
        const gradStart = '#4c1d95';
        const gradEnd = lc;    // #6d28d9
        const sideAccent = la; // #c4b5fd
        const mainAccent = lc;
        const mainSecTitle = () => ({
            fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: gradEnd,
            borderBottom: `1.5px solid ${gradEnd}40`,
            paddingBottom: '3px', marginBottom: '10px', marginTop: 0, fontFamily: lf,
        });
        const profiles = basics.profiles?.filter(p => p.network && p.url) || [];
        const linkedin = profiles.find(p => p.network?.toLowerCase().includes('linkedin'));
        const github = profiles.find(p => p.network?.toLowerCase().includes('github'));

        return (
            <div style={{ display: 'flex', minHeight: '842px', fontFamily: lf, fontSize: `${layout.fontSize}px` }}>
                {/* ── SIDEBAR gradient ── */}
                <div style={{ width: '32%', background: `linear-gradient(160deg, ${gradStart} 0%, ${gradEnd} 100%)`, color: '#fff', padding: '28px 16px', boxSizing: 'border-box', flexShrink: 0 }}>
                    {/* Nom & titre */}
                    <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${sideAccent}40` }}>
                        <h1 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 5px 0', lineHeight: 1.2, fontFamily: lf }}>{basics.name}</h1>
                        {basics.label && <p style={{ fontSize: '8.5px', opacity: 0.85, margin: 0, lineHeight: 1.4, color: sideAccent }}>{basics.label}</p>}
                    </div>
                    {/* Contact chips */}
                    <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: 0 }}>Contact</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                        {basics.email && <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', opacity: 0.9 }}>{basics.email}</p>}
                        {basics.phone && <p style={{ fontSize: '8px', margin: 0, opacity: 0.9 }}>{basics.phone}</p>}
                        {basics.location?.city && <p style={{ fontSize: '8px', margin: 0, opacity: 0.9 }}>{basics.location.city}</p>}
                        {linkedin && <p style={{ fontSize: '8px', margin: 0, opacity: 0.8, wordBreak: 'break-all' }}>in {linkedin.url.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                        {github && <p style={{ fontSize: '8px', margin: 0, opacity: 0.8, wordBreak: 'break-all' }}>⌥ {github.url.replace(/^https?:\/\/(www\.)?/, '')}</p>}
                    </div>
                    {/* Compétences */}
                    {data.skills?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>Compétences</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {data.skills.map((skill, i) => (
                                    <div key={i}>
                                        <p style={{ fontSize: '9px', margin: '0 0 2px 0', fontWeight: 600 }}>{skill.name}</p>
                                        <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                                            <div style={{ height: '3px', borderRadius: '2px', backgroundColor: sideAccent, width: ['Expert', 'Avancé', 'Advanced'].includes(skill.level) ? '90%' : ['Intermédiaire', 'Intermediate'].includes(skill.level) ? '60%' : '40%' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {/* Formation dans sidebar */}
                    {data.education?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>Formation</h2>
                            {data.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <p style={{ fontSize: '9px', fontWeight: 700, margin: '0 0 1px 0' }}>{[edu.studyType, edu.area].filter(Boolean).join(' ')}</p>
                                    <p style={{ fontSize: '8px', margin: 0, opacity: 0.75 }}>{edu.institution}</p>
                                    <p style={{ fontSize: '7.5px', margin: 0, opacity: 0.6 }}>{dateRange(edu.startDate, edu.endDate)}</p>
                                </div>
                            ))}
                        </>
                    )}
                    {/* Langues */}
                    {data.languages?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>Langues</h2>
                            {data.languages.map((lang, i) => (
                                <div key={i} style={{ marginBottom: '5px' }}>
                                    <p style={{ fontSize: '9px', fontWeight: 600, margin: 0 }}>{lang.language}</p>
                                    {lang.fluency && <p style={{ fontSize: '8px', margin: 0, opacity: 0.7 }}>{lang.fluency}</p>}
                                </div>
                            ))}
                        </>
                    )}
                    {/* Centres d'intérêt */}
                    {data.interests?.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '7.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: sideAccent, borderBottom: `1px solid ${sideAccent}40`, paddingBottom: '3px', marginBottom: '8px', marginTop: '14px' }}>{"Centres d'Intérêt"}</h2>
                            {data.interests.map((interest, i) => (
                                <p key={i} style={{ fontSize: '8.5px', margin: '0 0 3px 0', opacity: 0.85 }}>{interest.name || interest}</p>
                            ))}
                        </>
                    )}
                </div>
                {/* ── COLONNE DROITE ── */}
                <div style={{ flex: 1, backgroundColor: '#fff', padding: '28px 22px', boxSizing: 'border-box' }}>
                    {basics.summary && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Profil</h2><p style={{ fontSize: '9.5px', lineHeight: layout.lineHeight, textAlign: 'justify', margin: 0 }}>{basics.summary}</p></section>}
                    {data.work?.length > 0 && <section style={{ marginBottom: `${layout.sectionSpacing}px` }}><h2 style={mainSecTitle()}>Expériences</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{data.work.map((job, i) => (<div key={i}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}><div><div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>{job.position}</div><div style={{ fontSize: '9px', color: mainAccent, fontWeight: 600 }}>{job.name}</div></div><div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(job.startDate, job.endDate)}</div></div>{job.summary && <p style={{ fontSize: '9px', lineHeight: '1.45', textAlign: 'justify', margin: '4px 0 0 0' }}>{job.summary}</p>}<Bullets items={job.highlights} color={mainAccent} /></div>))}</div></section>}
                    {data.projects?.length > 0 && <section><h2 style={mainSecTitle()}>Projets</h2><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{data.projects.map((proj, i) => (<div key={i}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ fontSize: '10px', fontWeight: 900 }}>{proj.name}</div>{(proj.startDate || proj.endDate) && <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(proj.startDate, proj.endDate)}</div>}</div>{proj.description && <p style={{ fontSize: '9px', margin: '2px 0 0 0' }}>{proj.description}</p>}<Bullets items={proj.highlights} color={mainAccent} /></div>))}</div></section>}
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // LAYOUT SIDEBAR
    // ════════════════════════════════════════════════════════════════════════

    if (layout.layout === 'sidebar') {
        return (
            <div style={{ display: 'flex', minHeight: '842px', fontFamily: lf, fontSize: `${layout.fontSize}px` }}>

                {/* ── COLONNE GAUCHE colorée ───────────────────────────── */}
                <div style={{ width: '31%', backgroundColor: lc, color: '#fff', padding: '28px 16px', boxSizing: 'border-box', flexShrink: 0 }}>

                    {/* Nom & titre */}
                    <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${la}60` }}>
                        <h1 style={{ fontSize: '15px', fontWeight: 900, margin: '0 0 4px 0', lineHeight: 1.2, wordBreak: 'break-word', fontFamily: lf }}>
                            {basics.name}
                        </h1>
                        {basics.label && (
                            <p style={{ fontSize: '9px', opacity: 0.85, margin: 0, lineHeight: 1.3, color: la }}>
                                {basics.label}
                            </p>
                        )}
                    </div>

                    {/* Contact */}
                    <SideTitle accentColor={la}>Contact</SideTitle>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {basics.email && <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', opacity: 0.9 }}>{basics.email}</p>}
                        {basics.phone && <p style={{ fontSize: '8px', margin: 0, opacity: 0.9 }}>{basics.phone}</p>}
                        {(basics.location?.city || basics.location?.postalCode) && (
                            <p style={{ fontSize: '8px', margin: 0, opacity: 0.9 }}>
                                {[basics.location.postalCode, basics.location.city].filter(Boolean).join(' ')}
                            </p>
                        )}
                        {basics.url && (
                            <p style={{ fontSize: '8px', margin: 0, wordBreak: 'break-all', opacity: 0.8 }}>
                                {basics.url.replace(/^https?:\/\//, '')}
                            </p>
                        )}
                    </div>

                    {/* Compétences */}
                    {data.skills?.length > 0 && (
                        <>
                            <SideTitle accentColor={la}>Compétences</SideTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {data.skills.map((skill, i) => (
                                    <div key={i}>
                                        <p style={{ fontSize: '9px', margin: '0 0 2px 0', fontWeight: 600 }}>{skill.name}</p>
                                        <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                                            <div style={{
                                                height: '3px', borderRadius: '2px', backgroundColor: la,
                                                width: ['Expert', 'Avancé', 'Advanced'].includes(skill.level) ? '90%'
                                                     : ['Intermédiaire', 'Intermediate'].includes(skill.level) ? '60%'
                                                     : '40%'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Langues */}
                    {data.languages?.length > 0 && (
                        <>
                            <SideTitle accentColor={la}>Langues</SideTitle>
                            {data.languages.map((lang, i) => (
                                <div key={i} style={{ marginBottom: '5px' }}>
                                    <p style={{ fontSize: '9px', margin: '0', fontWeight: 600 }}>{lang.language}</p>
                                    {lang.fluency && <p style={{ fontSize: '8px', margin: 0, opacity: 0.75 }}>{lang.fluency}</p>}
                                </div>
                            ))}
                        </>
                    )}

                    {/* Profils */}
                    {basics.profiles?.filter(p => p.network && p.url).length > 0 && (
                        <>
                            <SideTitle accentColor={la}>Profils</SideTitle>
                            {basics.profiles.filter(p => p.network && p.url).map((p, i) => (
                                <p key={i} style={{ fontSize: '8px', margin: '0 0 4px 0', wordBreak: 'break-all' }}>
                                    <span style={{ fontWeight: 700, color: la }}>{p.network}:</span>{' '}
                                    {p.url.replace(/^https?:\/\//, '')}
                                </p>
                            ))}
                        </>
                    )}
                </div>

                {/* ── COLONNE DROITE blanche ───────────────────────────── */}
                <div style={{ flex: 1, backgroundColor: '#fff', padding: '28px 22px', boxSizing: 'border-box' }}>

                    {basics.summary && (
                        <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                            <SectionTitle name="basics" label="Profil" sectionTitles={sectionTitles} layout={layout} />
                            <p style={{ fontSize: '9.5px', lineHeight: layout.lineHeight, textAlign: 'justify', margin: 0 }}>{basics.summary}</p>
                        </section>
                    )}

                    {data.work?.length > 0 && (
                        <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                            <SectionTitle name="work" label="Expérience" sectionTitles={sectionTitles} layout={layout} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {data.work.map((job, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>{job.position}</div>
                                                <div style={{ fontSize: '9px', color: lc, fontWeight: 600 }}>{job.name}</div>
                                            </div>
                                            <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(job.startDate, job.endDate)}</div>
                                        </div>
                                        {job.summary && <p style={{ fontSize: '9px', lineHeight: '1.45', textAlign: 'justify', margin: '4px 0 0 0' }}>{job.summary}</p>}
                                        <Bullets items={job.highlights} color={lc} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education?.length > 0 && (
                        <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                            <SectionTitle name="education" label="Formation" sectionTitles={sectionTitles} layout={layout} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {data.education.map((edu, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: 900 }}>{[edu.studyType, edu.area].filter(Boolean).join(' — ')}</div>
                                            <div style={{ fontSize: '9px', color: '#666' }}>{edu.institution}</div>
                                        </div>
                                        <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(edu.startDate, edu.endDate)}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects?.length > 0 && (
                        <section>
                            <SectionTitle name="projects" label="Projets" sectionTitles={sectionTitles} layout={layout} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ fontSize: '10px', fontWeight: 900 }}>{proj.name}</div>
                                            {(proj.startDate || proj.endDate) && (
                                                <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(proj.startDate, proj.endDate)}</div>
                                            )}
                                        </div>
                                        {proj.description && <p style={{ fontSize: '9px', margin: '2px 0 0 0' }}>{proj.description}</p>}
                                        <Bullets items={proj.highlights} color={lc} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // LAYOUT SINGLE-COLUMN (défaut)
    // ════════════════════════════════════════════════════════════════════════

    return (
        <div style={{
            fontFamily: lf,
            fontSize: `${layout.fontSize}px`,
            lineHeight: layout.lineHeight,
            color: '#1a1a1a',
            padding: `${layout.marginV || 40}px ${layout.marginH || 48}px`,
            maxWidth: '880px',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: '#fff'
        }}>
            {renderSingleHeader()}

            {/* Profil */}
            {basics.summary && (
                <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <SectionTitle name="basics" label="Profil" sectionTitles={sectionTitles} layout={layout} />
                    <p style={{ fontSize: '10px', lineHeight: layout.lineHeight, textAlign: 'justify', margin: 0 }}>{basics.summary}</p>
                </section>
            )}

            {/* Expérience */}
            {data.work?.length > 0 && (
                <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <SectionTitle name="work" label="Expérience" sectionTitles={sectionTitles} layout={layout} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {data.work.map((job, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{job.position}</div>
                                        <div style={{ fontSize: '9px', color: lc, fontWeight: 600 }}>{job.name}</div>
                                    </div>
                                    <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(job.startDate, job.endDate)}</div>
                                </div>
                                {job.summary && <p style={{ fontSize: '9px', lineHeight: '1.45', textAlign: 'justify', margin: '4px 0 0 0' }}>{job.summary}</p>}
                                <Bullets items={job.highlights} color={lc} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Formation */}
            {data.education?.length > 0 && (
                <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <SectionTitle name="education" label="Formation" sectionTitles={sectionTitles} layout={layout} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {data.education.map((edu, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '10px', fontWeight: 900 }}>{[edu.studyType, edu.area].filter(Boolean).join(' — ')}</div>
                                    <div style={{ fontSize: '9px', color: '#666' }}>{edu.institution}</div>
                                </div>
                                <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(edu.startDate, edu.endDate)}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Compétences — chips/tags */}
            {data.skills?.length > 0 && (
                <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <SectionTitle name="skills" label="Compétences" sectionTitles={sectionTitles} layout={layout} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {data.skills.map((skill, i) => (
                            <span key={i} style={{
                                fontSize: '9px', fontWeight: 600,
                                backgroundColor: `${lc}18`,
                                color: lc,
                                border: `1px solid ${lc}35`,
                                borderRadius: '4px',
                                padding: '2px 8px'
                            }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Langues */}
            {data.languages?.length > 0 && (
                <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <SectionTitle name="languages" label="Langues" sectionTitles={sectionTitles} layout={layout} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {data.languages.map((lang, i) => (
                            <div key={i} style={{ fontSize: '9px' }}>
                                <span style={{ fontWeight: 700 }}>{lang.language}</span>
                                {lang.fluency && <span style={{ color: '#888', marginLeft: '4px' }}>— {lang.fluency}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projets */}
            {data.projects?.length > 0 && (
                <section style={{ marginBottom: `${layout.sectionSpacing}px`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <SectionTitle name="projects" label="Projets" sectionTitles={sectionTitles} layout={layout} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {data.projects.map((proj, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 900 }}>{proj.name}</div>
                                    {(proj.startDate || proj.endDate) && (
                                        <div style={{ fontSize: '8px', color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>{dateRange(proj.startDate, proj.endDate)}</div>
                                    )}
                                </div>
                                {proj.description && <p style={{ fontSize: '9px', margin: '2px 0 0 0' }}>{proj.description}</p>}
                                <Bullets items={proj.highlights} color={lc} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {data.certificates?.length > 0 && (
                <section>
                    <SectionTitle name="certificates" label="Certifications" sectionTitles={sectionTitles} layout={layout} />
                    {data.certificates.map((cert, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700 }}>{cert.name}</div>
                            <div style={{ fontSize: '8px', color: '#888' }}>{cert.issuer}{cert.date ? ` • ${cert.date}` : ''}</div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
