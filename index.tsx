import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const initialData = {
  personalInfo: {
    firstName: 'Deniz',
    lastName: 'Aydin',
    birthDate: '1988-04-21',
    address: 'Arbentalstrasse 156, 8045 Zürich',
    phone: '+41 79 907 12 89',
    email: 'denizaydin23@hotmail.com',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  profile: 'Motivierte Arbeitskraft mit einer ausgeprägten Fähigkeit zur präzisen und effizienten Arbeit. Schnelle Auffassungsgabe und die Fähigkeit, unter Druck zu arbeiten, zeichnen meine Arbeitsweise aus. Ich bringe vielseitige Kenntnisse und Fähigkeiten mit, die es mir ermöglichen, mich schnell in neue Aufgabenbereiche einzuarbeiten und qualitativ hochwertige Ergebnisse zu liefern.',
  education: [
    { id: 1, school: 'COIFFEURE, BERUFSSCHULE MODE UND GESTALTUNG', location: 'Zürich', degree: 'Eidgenössisches Fähigkeitszeugnis', startDate: '2008-08', endDate: '2011-07', isCurrent: false, description: '' }
  ],
  experience: [
    { id: 1, company: 'AYDIN SIMIT EXPRESS GMBH', location: 'Zürich', position: 'Produktion Qualitätssicherung & Administration', startDate: '2023-05', endDate: '', isCurrent: true, tasks: '- Durchführung und Dokumentation von Qualitätskontrollen\n- Einleitung von Sofortmassnahmen bei Abweichungen\n- Herstellung von Teigen für Brot, Brötchen und Gebäck\n- Einhaltung der Hygienevorschriften (HACCP)' },
    { id: 2, company: 'WALTER BUCHMANN', location: 'Zürich', position: 'Verkäuferin', startDate: '2019-10', endDate: '2023-05', isCurrent: false, tasks: '- Präsentieren eines einwandfreien Ladenbildes.\n- Zubereiten von Kaffeespezialitäten Barista-Style\n- Abrechnen der Kasse und Erstellen von Tagesabschlüssen\n- Entgegennehmen von Kundenbestellungen' },
  ],
  languages: [
    { id: 1, name: 'Deutsch', level: 'Muttersprache' },
    { id: 2, name: 'Türkisch', level: 'Muttersprache' },
    { id: 3, name: 'Englisch', level: 'A2' },
  ],
  competences: {
    social: '- Wohlwollende und wertschätzende Grundhaltung.\n- Empathischer und verantwortungsbewusster Umgang Menschen.\n- Offene und transparente Kommunikation auf Sachebene.',
    individual: '- Engagiert und präsent bei meinen Aktivitäten.\n- Dynamische Einstellung gegenüber neuen Situationen.\n- Die Fähigkeit, auch unter Druck eine gute Arbeit zu leisten.'
  },
  hobbies: [
    { id: 1, name: 'Reisen', icon: '✈️' },
    { id: 2, name: 'Fotografieren', icon: '📸' },
    { id: 3, name: 'Musik hören', icon: '🎵' },
    { id: 4, name: 'Schwimmen', icon: '🏊' },
  ],
  design: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#4A90E2',
  }
};

const App = () => {
  const [data, setData] = useState(initialData);
  const previewRef = useRef(null);
  const [activeView, setActiveView] = useState('editor'); // 'editor' or 'preview'
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (isMenuOpen) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
    return () => {
      body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleChange = (section, field, value, id = null) => {
    if (id !== null) {
      setData(prev => ({
        ...prev,
        [section]: prev[section].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }));
    } else if (typeof data[section] === 'object' && data[section] !== null) {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    } else {
      setData(prev => ({ ...prev, [section]: value }));
    }
  };
  
  const handleAddItem = (section) => {
    const newItem = {
      id: Date.now(),
      ...(section === 'education' && { school: '', location: '', degree: '', startDate: '', endDate: '', isCurrent: false, description: '' }),
      ...(section === 'experience' && { company: '', location: '', position: '', startDate: '', endDate: '', isCurrent: false, tasks: '' }),
      ...(section === 'languages' && { name: '', level: 'A1' }),
      ...(section === 'hobbies' && { name: '', icon: '✨' }),
    };
    setData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const handleRemoveItem = (section, id) => {
    setData(prev => ({ ...prev, [section]: prev[section].filter(item => item.id !== id) }));
  };
  
  const handlePhotoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
              handleChange('personalInfo', 'photo', loadEvent.target.result);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleExportPdf = () => {
    const input = previewRef.current;
    
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save("lebenslauf.pdf");
    });
  };
  
  const handleFocus = (e, section, field = null, id = null) => {
    const currentValue = e.target.value;
    let initialValue;

    if (id !== null) {
      const initialItem = initialData[section].find(item => item.id === id);
      if (initialItem && initialItem[field] !== undefined) {
        initialValue = initialItem[field];
      }
    } else if (field !== null && typeof data[section] === 'object' && data[section] !== null) {
      initialValue = initialData[section][field];
    } else {
      initialValue = initialData[section];
    }
    
    if (initialValue !== undefined && currentValue === initialValue) {
      handleChange(section, field, '', id);
    }
  };
  
  const formatDate = (dateString) => {
      if (!dateString) return '';
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
  };

  const fonts = ['Roboto', 'Lato', 'Merriweather', 'Times New Roman', 'Arial', 'Helvetica'];
  const fontSizes = ['12px', '14px', '16px'];
  const languageLevels = ['Muttersprache', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];
  
  const menuItems = [
    { id: 'design-section', label: 'Design' },
    { id: 'personal-info-section', label: 'Persönliche Informationen' },
    { id: 'profile-section', label: 'Profil' },
    { id: 'education-section', label: 'Ausbildung' },
    { id: 'experience-section', label: 'Berufserfahrung' },
    { id: 'competences-section', label: 'Kompetenzen' },
    { id: 'languages-section', label: 'Sprachen' },
    { id: 'hobbies-section', label: 'Hobbys' },
  ];

  const handleMenuClick = (targetId) => {
    setActiveView('editor');
    setIsMenuOpen(false);
    setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
  };


  return (
    <>
      <header className="mobile-nav">
          <button aria-label="Menü öffnen" className="hamburger-btn" onClick={() => setIsMenuOpen(true)}>
              &#9776;
          </button>
          <div className="view-toggle">
              <button className={activeView === 'editor' ? 'active' : ''} onClick={() => setActiveView('editor')}>Bearbeiten</button>
              <button className={activeView === 'preview' ? 'active' : ''} onClick={() => setActiveView('preview')}>Vorschau</button>
          </div>
          <div className="hamburger-placeholder" />
      </header>

      {isMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />}
      <aside className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">Menü</div>
          <nav>
              {menuItems.map(item => (
                  <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); handleMenuClick(item.id); }}>
                      {item.label}
                  </a>
              ))}
          </nav>
      </aside>
      
      <div className="app-container">
        <div className={`editor ${activeView !== 'editor' ? 'hidden-on-mobile' : ''}`}>
          <h1>Lebenslauf Gestalter</h1>
          
          {/* Design Section */}
          <div id="design-section" className="editor-section">
              <h2>Design</h2>
              <div className="form-group">
                  <label>Schriftart</label>
                  <select value={data.design.fontFamily} onChange={(e) => handleChange('design', 'fontFamily', e.target.value)}>
                      {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
              </div>
              <div className="form-group">
                  <label>Schriftgröße</label>
                  <select value={data.design.fontSize} onChange={(e) => handleChange('design', 'fontSize', e.target.value)}>
                      {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
              </div>
              <div className="form-group color-picker-group">
                  <label>Hintergrundfarbe</label>
                  <input type="color" value={data.design.backgroundColor} onChange={(e) => handleChange('design', 'backgroundColor', e.target.value)} />
              </div>
              <div className="form-group color-picker-group">
                  <label>Textfarbe</label>
                  <input type="color" value={data.design.textColor} onChange={(e) => handleChange('design', 'textColor', e.target.value)} />
              </div>
              <div className="form-group color-picker-group">
                  <label>Akzentfarbe</label>
                  <input type="color" value={data.design.accentColor} onChange={(e) => handleChange('design', 'accentColor', e.target.value)} />
              </div>
          </div>
          
          {/* Personal Info */}
          <div id="personal-info-section" className="editor-section">
            <h2>Persönliche Informationen</h2>
            <div className="form-group"><label>Vorname</label><input type="text" value={data.personalInfo.firstName} onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)} onFocus={(e) => handleFocus(e, 'personalInfo', 'firstName')} /></div>
            <div className="form-group"><label>Nachname</label><input type="text" value={data.personalInfo.lastName} onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)} onFocus={(e) => handleFocus(e, 'personalInfo', 'lastName')} /></div>
            <div className="form-group"><label>Profilbild</label><input type="file" accept="image/png, image/jpeg" onChange={handlePhotoUpload} /></div>
            <div className="form-group"><label>Geburtsdatum</label><input type="date" value={data.personalInfo.birthDate} onChange={(e) => handleChange('personalInfo', 'birthDate', e.target.value)} /></div>
            <div className="form-group"><label>Adresse</label><input type="text" value={data.personalInfo.address} onChange={(e) => handleChange('personalInfo', 'address', e.target.value)} onFocus={(e) => handleFocus(e, 'personalInfo', 'address')} /></div>
            <div className="form-group"><label>Telefonnummer</label><input type="tel" value={data.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} onFocus={(e) => handleFocus(e, 'personalInfo', 'phone')} /></div>
            <div className="form-group"><label>E-Mail</label><input type="email" value={data.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} onFocus={(e) => handleFocus(e, 'personalInfo', 'email')} /></div>
          </div>

          {/* Profile */}
          <div id="profile-section" className="editor-section">
              <h2>Profil</h2>
              <div className="form-group">
                  <textarea placeholder="Ich bin eine motivierte, zuverlässige Person..." value={data.profile} onChange={(e) => handleChange('profile', null, e.target.value)} onFocus={(e) => handleFocus(e, 'profile')} />
              </div>
          </div>
          
          {/* Education */}
          <div id="education-section" className="editor-section">
            <h2>Ausbildung</h2>
            {data.education.map(edu => (
              <div key={edu.id} className="dynamic-entry">
                <button className="remove-btn" onClick={() => handleRemoveItem('education', edu.id)}>X</button>
                <div className="form-group"><label>Schule/Institution</label><input type="text" value={edu.school} onChange={(e) => handleChange('education', 'school', e.target.value, edu.id)} onFocus={(e) => handleFocus(e, 'education', 'school', edu.id)}/></div>
                <div className="form-group"><label>Ort</label><input type="text" value={edu.location} onChange={(e) => handleChange('education', 'location', e.target.value, edu.id)} onFocus={(e) => handleFocus(e, 'education', 'location', edu.id)} /></div>
                <div className="form-group"><label>Abschluss</label><input type="text" value={edu.degree} onChange={(e) => handleChange('education', 'degree', e.target.value, edu.id)} onFocus={(e) => handleFocus(e, 'education', 'degree', edu.id)} /></div>
                <div className="form-group"><label>Start (Monat/Jahr)</label><input type="month" value={edu.startDate} onChange={(e) => handleChange('education', 'startDate', e.target.value, edu.id)} /></div>
                <div className="form-group"><label>Ende (Monat/Jahr)</label><input type="month" value={edu.endDate} onChange={(e) => handleChange('education', 'endDate', e.target.value, edu.id)} disabled={edu.isCurrent} /></div>
                <div className="form-group"><label><input type="checkbox" checked={edu.isCurrent} onChange={(e) => handleChange('education', 'isCurrent', e.target.checked, edu.id)} /> Bis heute</label></div>
              </div>
            ))}
            <button className="add-btn" onClick={() => handleAddItem('education')}>+ Ausbildung hinzufügen</button>
          </div>

          {/* Experience */}
          <div id="experience-section" className="editor-section">
            <h2>Berufserfahrung</h2>
            {data.experience.map(exp => (
              <div key={exp.id} className="dynamic-entry">
                <button className="remove-btn" onClick={() => handleRemoveItem('experience', exp.id)}>X</button>
                <div className="form-group"><label>Firma</label><input type="text" value={exp.company} onChange={(e) => handleChange('experience', 'company', e.target.value, exp.id)} onFocus={(e) => handleFocus(e, 'experience', 'company', exp.id)} /></div>
                <div className="form-group"><label>Ort</label><input type="text" value={exp.location} onChange={(e) => handleChange('experience', 'location', e.target.value, exp.id)} onFocus={(e) => handleFocus(e, 'experience', 'location', exp.id)} /></div>
                <div className="form-group"><label>Position</label><input type="text" value={exp.position} onChange={(e) => handleChange('experience', 'position', e.target.value, exp.id)} onFocus={(e) => handleFocus(e, 'experience', 'position', exp.id)} /></div>
                <div className="form-group"><label>Start (Monat/Jahr)</label><input type="month" value={exp.startDate} onChange={(e) => handleChange('experience', 'startDate', e.target.value, exp.id)} /></div>
                <div className="form-group"><label>Ende (Monat/Jahr)</label><input type="month" value={exp.endDate} onChange={(e) => handleChange('experience', 'endDate', e.target.value, exp.id)} disabled={exp.isCurrent} /></div>
                <div className="form-group"><label><input type="checkbox" checked={exp.isCurrent} onChange={(e) => handleChange('experience', 'isCurrent', e.target.checked, exp.id)} /> Bis heute</label></div>
                <div className="form-group"><label>Aufgaben</label><textarea value={exp.tasks} onChange={(e) => handleChange('experience', 'tasks', e.target.value, exp.id)} onFocus={(e) => handleFocus(e, 'experience', 'tasks', exp.id)} placeholder="- Aufgabe 1..."></textarea></div>
              </div>
            ))}
            <button className="add-btn" onClick={() => handleAddItem('experience')}>+ Erfahrung hinzufügen</button>
          </div>

          {/* Competences */}
          <div id="competences-section" className="editor-section">
              <h2>Kompetenzen</h2>
              <div className="form-group">
                  <label>Sozialkompetenz</label>
                  <textarea placeholder="Beispiel: Empathie, Teamfähigkeit..." value={data.competences.social} onChange={(e) => handleChange('competences', 'social', e.target.value)} onFocus={(e) => handleFocus(e, 'competences', 'social')} />
              </div>
              <div className="form-group">
                  <label>Individualkompetenz</label>
                  <textarea placeholder="Beispiel: Belastbarkeit, Lernbereitschaft..." value={data.competences.individual} onChange={(e) => handleChange('competences', 'individual', e.target.value)} onFocus={(e) => handleFocus(e, 'competences', 'individual')} />
              </div>
          </div>

          {/* Languages */}
          <div id="languages-section" className="editor-section">
              <h2>Sprachen</h2>
              {data.languages.map(lang => (
                <div key={lang.id} className="dynamic-entry">
                  <button className="remove-btn" onClick={() => handleRemoveItem('languages', lang.id)}>X</button>
                  <div className="form-group"><label>Sprache</label><input type="text" value={lang.name} onChange={(e) => handleChange('languages', 'name', e.target.value, lang.id)} onFocus={(e) => handleFocus(e, 'languages', 'name', lang.id)} /></div>
                  <div className="form-group">
                      <label>Niveau</label>
                      <select value={lang.level} onChange={(e) => handleChange('languages', 'level', e.target.value, lang.id)}>
                          {languageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={() => handleAddItem('languages')}>+ Sprache hinzufügen</button>
          </div>
          {/* Hobbies */}
          <div id="hobbies-section" className="editor-section">
              <h2>Hobbys</h2>
              {data.hobbies.map(hobby => (
                <div key={hobby.id} className="dynamic-entry">
                  <button className="remove-btn" onClick={() => handleRemoveItem('hobbies', hobby.id)}>X</button>
                  <div className="form-group"><label>Hobby</label><input type="text" value={hobby.name} onChange={(e) => handleChange('hobbies', 'name', e.target.value, hobby.id)} onFocus={(e) => handleFocus(e, 'hobbies', 'name', hobby.id)} /></div>
                  <div className="form-group"><label>Icon (Emoji)</label><input type="text" value={hobby.icon} onChange={(e) => handleChange('hobbies', 'icon', e.target.value, hobby.id)} onFocus={(e) => handleFocus(e, 'hobbies', 'icon', hobby.id)} /></div>
                </div>
              ))}
              <button className="add-btn" onClick={() => handleAddItem('hobbies')}>+ Hobby hinzufügen</button>
          </div>
        </div>
        <div className={`preview-container ${activeView !== 'preview' ? 'hidden-on-mobile' : ''}`}>
          <button className="export-btn" onClick={handleExportPdf}>Export to PDF</button>
          <div 
            className="preview" 
            ref={previewRef}
            style={{
              fontFamily: data.design.fontFamily,
              fontSize: data.design.fontSize,
              backgroundColor: data.design.backgroundColor,
              color: data.design.textColor,
            }}
          >
            <div className="resume-header" style={{ borderColor: data.design.accentColor }}>
              <div className="resume-header-info">
                <h1 style={{ color: data.design.accentColor }}>{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
                {data.personalInfo.birthDate && <p>Geburtsdatum: {new Date(data.personalInfo.birthDate).toLocaleDateString('de-DE')}</p>}
                {data.personalInfo.address && <p>Adresse: {data.personalInfo.address}</p>}
                {data.personalInfo.phone && <p>Telefonnummer: {data.personalInfo.phone}</p>}
                {data.personalInfo.email && <p>E-Mail-Adresse: {data.personalInfo.email}</p>}
              </div>
              {data.personalInfo.photo && <img src={data.personalInfo.photo} alt="Profilbild" className="resume-photo" style={{ borderColor: data.design.accentColor }} />}
            </div>
            
            <div className="resume-section resume-profile">
              <h2 style={{ color: data.design.accentColor, borderColor: data.design.accentColor }}>Profil</h2>
              <p>{data.profile}</p>
            </div>
            
            <div className="resume-section">
              <h2 style={{ color: data.design.accentColor, borderColor: data.design.accentColor }}>Ausbildung</h2>
              {data.education.map(edu => (
                <div key={edu.id} className="resume-item-grid">
                  <div className="resume-item-left">
                    <p className="date-range">
                       {formatDate(edu.startDate)}
                        - 
                       {edu.isCurrent ? 'Heute' : formatDate(edu.endDate)}
                     </p>
                    <p>{edu.location}</p>
                  </div>
                  <div className="resume-item-right">
                    <h3>{edu.school}</h3>
                    <p className="resume-item-subheader">{edu.degree}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h2 style={{ color: data.design.accentColor, borderColor: data.design.accentColor }}>Berufserfahrung</h2>
              {data.experience.map(exp => (
                <div key={exp.id} className="resume-item-grid">
                  <div className="resume-item-left">
                     <p className="date-range">
                       {formatDate(exp.startDate)}
                        - 
                       {exp.isCurrent ? 'Heute' : formatDate(exp.endDate)}
                     </p>
                     <p>{exp.location}</p>
                  </div>
                  <div className="resume-item-right">
                    <h3>{exp.company}</h3>
                    <p className="resume-item-subheader">{exp.position}</p>
                    <ul>{exp.tasks.split('\n').map((task, i) => task && <li key={i}>{task.replace('-', '').trim()}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h2 style={{ color: data.design.accentColor, borderColor: data.design.accentColor }}>Sprachkenntnisse</h2>
              <div className="language-grid">
                {data.languages.map(lang => (
                  <div key={lang.id} className="language-item">
                    <p><b>{lang.name}</b></p>
                    <p>{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="resume-section">
              <h2 style={{ color: data.design.accentColor, borderColor: data.design.accentColor }}>Kompetenzprofil</h2>
              <div className="competence-section">
                <h3>Sozialkompetenz</h3>
                <ul>{data.competences.social.split('\n').map((item, i) => item && <li key={i}>{item.replace('-', '').trim()}</li>)}</ul>
              </div>
              <div className="competence-section">
                  <h3>Individualkompetenz</h3>
                  <ul>{data.competences.individual.split('\n').map((item, i) => item && <li key={i}>{item.replace('-', '').trim()}</li>)}</ul>
              </div>
            </div>

            <div className="resume-section">
              <h2 style={{ color: data.design.accentColor, borderColor: data.design.accentColor }}>Fähigkeiten und Interessen – Hobbys</h2>
              <div className="hobbies-list">
                {data.hobbies.map(hobby => <p key={hobby.id}>{hobby.icon} {hobby.name}</p>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);