import React, { useState, useEffect, useRef } from 'react';

const DiagonalLines = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-0.5 h-[200%] bg-gradient-to-b from-transparent via-red-300 to-transparent transform rotate-45 -translate-x-1/2 left-[15%] top-0 opacity-40"></div>
      <div className="absolute w-0.5 h-[200%] bg-gradient-to-b from-transparent via-orange-300 to-transparent transform rotate-45 -translate-x-1/2 left-[30%] top-0 opacity-40"></div>
      <div className="absolute w-0.5 h-[200%] bg-gradient-to-b from-transparent via-yellow-300 to-transparent transform rotate-45 -translate-x-1/2 left-[45%] top-0 opacity-40"></div>
      <div className="absolute w-0.5 h-[200%] bg-gradient-to-b from-transparent via-green-300 to-transparent transform rotate-45 -translate-x-1/2 left-[60%] top-0 opacity-40"></div>
      <div className="absolute w-0.5 h-[200%] bg-gradient-to-b from-transparent via-blue-300 to-transparent transform rotate-45 -translate-x-1/2 left-[75%] top-0 opacity-40"></div>
      <div className="absolute w-0.5 h-[200%] bg-gradient-to-b from-transparent via-purple-300 to-transparent transform rotate-45 -translate-x-1/2 left-[90%] top-0 opacity-40"></div>
    </div>
  );
};

const HomePage = ({ onExplore }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      <DiagonalLines />
      <div className="relative z-10 text-center max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <svg className="w-16 h-16 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L8 6H4v12h4l4 4V2z" />
            <circle cx="18" cy="12" r="6" />
            <circle cx="18" cy="12" r="2" />
          </svg>
          <h1 className="text-6xl font-light tracking-wide">Guitar Keeper</h1>
        </div>
        <p className="text-xl text-gray-700 mb-12 leading-relaxed font-light">
          Keep Learing with the all in one APP for guitarists
        </p>
        <button
          onClick={onExplore}
          className="px-12 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          Explore features
        </button>
      </div>
    </div>
  );
};

const FeatureSelector = ({ onSelect, onClose }) => {
  const features = [
    { id: 'triads', label: 'Triads/Arpeggios Visualization', icon: '1-3-5' },
    { id: 'scales', label: 'Scales shapes', icon: '♪' },
    { id: 'chords', label: 'Chords library', icon: '|||' },
    { id: 'circle', label: 'Circle of fourths/fifths', icon: '○' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="absolute inset-0 backdrop-blur-md bg-white/30" onClick={onClose}></div>
      <div className="relative z-10 grid grid-cols-2 gap-8 max-w-4xl">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onSelect(feature.id)}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all group border-2 border-gray-200 hover:border-gray-300"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-light group-hover:bg-gray-200 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium text-gray-800">{feature.label}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

const NoteSelector = ({ label, selected, onSelect, notes }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-4 text-center">
        {label}
      </h3>
      <div className="flex justify-center gap-3 flex-wrap">
        {notes.map((note) => (
          <button
            key={note}
            onClick={() => onSelect(note)}
            className={`w-14 h-14 rounded-full font-medium transition-all ${
              selected === note
                ? 'bg-gray-800 text-white shadow-lg scale-110'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};

const Fretboard = ({ highlightedNotes, title }) => {
  const canvasRef = useRef(null);

  const fretboardMap = [
    ['E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'],
    ['B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D'],
    ['G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb'],
    ['D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F'],
    ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C'],
    ['E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G']
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 1100;
    const height = 350;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const leftMargin = 60;
    const rightMargin = 40;
    const topMargin = 40;
    const bottomMargin = 40;
    const fretboardWidth = width - leftMargin - rightMargin;
    const fretboardHeight = height - topMargin - bottomMargin;
    const stringSpacing = fretboardHeight / 5;
    const fretSpacing = fretboardWidth / 15;

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(leftMargin, topMargin - 10, fretboardWidth, fretboardHeight + 20);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const y = topMargin + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(leftMargin + fretboardWidth, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 15; i++) {
      const x = leftMargin + i * fretSpacing;
      ctx.beginPath();
      ctx.moveTo(x, topMargin - 10);
      ctx.lineTo(x, topMargin + fretboardHeight + 10);
      ctx.stroke();
    }

    const fretMarkers = [3, 5, 7, 9, 12, 15];
    ctx.fillStyle = '#999';
    fretMarkers.forEach(fret => {
      const x = leftMargin + (fret - 0.5) * fretSpacing;
      const y = topMargin + fretboardHeight / 2;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 15; i++) {
      const x = leftMargin + i * fretSpacing;
      ctx.fillText(i.toString(), x, topMargin + fretboardHeight + 30);
    }

    for (let string = 0; string < 6; string++) {
      for (let fret = 0; fret <= 15; fret++) {
        const note = fretboardMap[string][fret];
        const highlight = highlightedNotes.find(h => h.note === note);

        if (highlight) {
          const x = fret === 0 ? leftMargin : leftMargin + (fret - 0.5) * fretSpacing;
          const y = topMargin + string * stringSpacing;

          ctx.fillStyle = highlight.isRoot ? '#1f2937' : '#d1d5db';
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = highlight.isRoot ? '#ffffff' : '#1f2937';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note, x, y);
        }
      }
    }
  }, [highlightedNotes]);

  return (
    <div className="flex flex-col items-center">
      {title && <h2 className="text-2xl font-light mb-6 text-gray-800">{title}</h2>}
      <canvas ref={canvasRef} className="max-w-full shadow-lg rounded-lg" />
    </div>
  );
};

const TriadsView = ({ onBack }) => {
  const [rootNote, setRootNote] = useState('C');
  const [selectedType, setSelectedType] = useState('major');
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getTriadNotes = (root, type) => {
    const rootIndex = notes.indexOf(root);
    let intervals = [];

    switch (type) {
      case 'major': intervals = [0, 4, 7]; break;
      case 'minor': intervals = [0, 3, 7]; break;
      case 'augmented': intervals = [0, 4, 8]; break;
      case 'diminished': intervals = [0, 3, 6]; break;
      default: intervals = [0, 4, 7];
    }

    return intervals.map((interval, index) => ({
      note: notes[(rootIndex + interval) % 12],
      isRoot: index === 0
    }));
  };

  const getTriadFormula = (root, type) => {
    const triadNotes = getTriadNotes(root, type);
    return triadNotes.map(n => n.note).join(' - ');
  };

  const triadTypes = [
    { id: 'minor', label: 'Minor', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { id: 'major', label: 'Major', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { id: 'augmented', label: '7', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'diminished', label: 'Diminished', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  ];

  const highlightedNotes = getTriadNotes(rootNote, selectedType);

  return (
    <div className="min-h-screen p-8 relative">
      <DiagonalLines />
      <div className="relative z-10 max-w-6xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-8 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 shadow-md"
        >
          <span>←</span> Back
        </button>

        <NoteSelector
          label="Root Note"
          selected={rootNote}
          onSelect={setRootNote}
          notes={notes}
        />

        <div className="my-12">
          <Fretboard highlightedNotes={highlightedNotes} />
        </div>

        <div className="flex justify-center gap-6 mt-8">
          {triadTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-8 py-4 rounded-2xl font-medium transition-all border-2 ${
                selectedType === type.id
                  ? 'bg-gray-800 text-white shadow-lg scale-105 border-gray-800'
                  : `${type.color} border-2`
              }`}
            >
              <div className="text-lg">{type.label}</div>
              <div className="text-sm opacity-75 mt-1">{getTriadFormula(rootNote, type.id)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChordDiagram = ({ positions, barreFret, rootNote, chordType }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 200;
    const height = 240;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const margin = 20;
    const gridWidth = width - 2 * margin;
    const gridHeight = 180;
    const stringSpacing = gridWidth / 5;
    const fretSpacing = gridHeight / 5;

    ctx.fillStyle = '#000';
    ctx.fillRect(margin, margin, gridWidth, 6);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(margin + i * stringSpacing, margin);
      ctx.lineTo(margin + i * stringSpacing, margin + gridHeight);
      ctx.stroke();
    }

    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(margin, margin + i * fretSpacing);
      ctx.lineTo(margin + gridWidth, margin + i * fretSpacing);
      ctx.stroke();
    }

    if (barreFret) {
      const y = margin + (barreFret - 0.5) * fretSpacing;
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(margin, y - 4, gridWidth, 8);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(barreFret.toString(), margin - 12, y);
    }

    ctx.fillStyle = '#1f2937';
    positions.forEach((pos) => {
      if (pos.fret > 0) {
        const x = margin + pos.string * stringSpacing;
        const y = margin + (pos.fret - 0.5) * fretSpacing;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#666';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    positions.forEach((pos) => {
      const x = margin + pos.string * stringSpacing;
      if (pos.fret === 0) {
        ctx.fillText('o', x, margin - 8);
      }
    });

  }, [positions, barreFret]);

  return <canvas ref={canvasRef} className="mx-auto" />;
};

const ChordsLibrary = ({ onBack }) => {
  const [rootNote, setRootNote] = useState('C');
  const [chordType, setChordType] = useState('major');
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getChordPositions = (root, type) => {
    const rootIndex = notes.indexOf(root);
    const baseShapes = {
      major: {
        normal: [
          { string: 1, fret: 0 },
          { string: 2, fret: 1 },
          { string: 3, fret: 0 },
          { string: 4, fret: 2 },
          { string: 5, fret: 3 }
        ],
        barre: { fret: 3, positions: [
          { string: 1, fret: 3 },
          { string: 2, fret: 5 },
          { string: 3, fret: 5 },
          { string: 4, fret: 5 },
          { string: 5, fret: 3 }
        ]}
      },
      minor: {
        normal: [
          { string: 1, fret: 0 },
          { string: 2, fret: 1 },
          { string: 3, fret: 0 },
          { string: 4, fret: 1 },
          { string: 5, fret: 3 }
        ],
        barre: { fret: 3, positions: [
          { string: 1, fret: 3 },
          { string: 2, fret: 4 },
          { string: 3, fret: 5 },
          { string: 4, fret: 5 },
          { string: 5, fret: 3 }
        ]}
      },
      '7': {
        normal: [
          { string: 1, fret: 0 },
          { string: 2, fret: 1 },
          { string: 3, fret: 3 },
          { string: 4, fret: 2 },
          { string: 5, fret: 3 }
        ],
        barre: { fret: 3, positions: [
          { string: 1, fret: 3 },
          { string: 2, fret: 5 },
          { string: 3, fret: 5 },
          { string: 4, fret: 4 },
          { string: 5, fret: 3 }
        ]}
      },
      maj7: {
        normal: [
          { string: 1, fret: 0 },
          { string: 2, fret: 0 },
          { string: 3, fret: 0 },
          { string: 4, fret: 2 },
          { string: 5, fret: 3 }
        ],
        barre: { fret: 3, positions: [
          { string: 1, fret: 3 },
          { string: 2, fret: 5 },
          { string: 3, fret: 4 },
          { string: 4, fret: 5 },
          { string: 5, fret: 3 }
        ]}
      },
      min7: {
        normal: [
          { string: 1, fret: 0 },
          { string: 2, fret: 1 },
          { string: 3, fret: 3 },
          { string: 4, fret: 1 },
          { string: 5, fret: 3 }
        ],
        barre: { fret: 3, positions: [
          { string: 1, fret: 3 },
          { string: 2, fret: 4 },
          { string: 3, fret: 5 },
          { string: 4, fret: 4 },
          { string: 5, fret: 3 }
        ]}
      }
    };

    const shift = rootIndex;
    const shape = baseShapes[type];
    
    return {
      normal: shape.normal.map(pos => ({
        ...pos,
        fret: pos.fret + shift
      })),
      barre: {
        fret: shape.barre.fret + shift,
        positions: shape.barre.positions.map(pos => ({
          ...pos,
          fret: pos.fret + shift
        }))
      }
    };
  };

  const chordPositions = getChordPositions(rootNote, chordType);

  const chordTypes = [
    { id: 'minor', label: 'Minor', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { id: 'major', label: 'Major', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { id: '7', label: '7', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'maj7', label: 'maj7', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'min7', label: 'min7', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  ];

  return (
    <div className="min-h-screen p-8 relative">
      <DiagonalLines />
      <div className="relative z-10 max-w-6xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-8 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 shadow-md"
        >
          <span>←</span> Back
        </button>

        <NoteSelector
          label="Root Note"
          selected={rootNote}
          onSelect={setRootNote}
          notes={notes}
        />

        <div className="grid grid-cols-2 gap-12 my-12 max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">{rootNote}</h3>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <ChordDiagram 
                positions={chordPositions.normal} 
                barreFret={null}
                rootNote={rootNote}
                chordType={chordType}
              />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">{rootNote}</h3>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <ChordDiagram 
                positions={chordPositions.barre.positions} 
                barreFret={chordPositions.barre.fret}
                rootNote={rootNote}
                chordType={chordType}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-4 text-center">
            Chord Options
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {chordTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setChordType(type.id)}
                className={`px-8 py-3 rounded-full font-medium transition-all border-2 ${
                  chordType === type.id
                    ? 'bg-gray-800 text-white shadow-lg scale-105 border-gray-800'
                    : `${type.color} border-2`
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScalesView = ({ onBack }) => {
  const [rootNote, setRootNote] = useState('G');
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getScaleNotes = (root, type) => {
    const rootIndex = notes.indexOf(root);
    let intervals = [];

    switch (type) {
      case 'pentatonic': intervals = [0, 2, 4, 7, 9]; break;
      case 'major': intervals = [0, 2, 4, 5, 7, 9, 11]; break;
      case 'minor-pentatonic': intervals = [0, 3, 5, 7, 10]; break;
      case 'minor-pentatonic-b3': intervals = [0, 2, 3, 7, 10]; break;
      case 'minor-pentatonic-b7': intervals = [0, 3, 5, 7, 9]; break;
      default: intervals = [0, 2, 4, 7, 9];
    }

    return intervals.map((interval, index) => ({
      note: notes[(rootIndex + interval) % 12],
      isRoot: index === 0
    }));
  };

  const scaleTypes = [
    { id: 'pentatonic', label: 'Pentatonic Scale' },
    { id: 'major', label: 'Major' },
    { id: 'minor-pentatonic', label: 'Minor Pentatonic Scale' },
    { id: 'minor-pentatonic-b3', label: 'Minor Pentatonic Scale from the b3' },
    { id: 'minor-pentatonic-b7', label: 'Minor Pentatonic Scale from the b7' }
  ];

  return (
    <div className="min-h-screen p-8 relative">
      <DiagonalLines />
      <div className="relative z-10 max-w-6xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-8 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 shadow-md"
        >
          <span>←</span> Back
        </button>

        <NoteSelector
          label="Root Note"
          selected={rootNote}
          onSelect={setRootNote}
          notes={notes}
        />

        <div className="space-y-8 mt-12">
          {scaleTypes.map((scale) => {
            const scaleNotes = getScaleNotes(rootNote, scale.id);
            return (
              <div key={scale.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-medium mb-4 text-center text-gray-800">{scale.label}</h3>
                <Fretboard highlightedNotes={scaleNotes} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CircleOfFifths = ({ onBack }) => {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [progression, setProgression] = useState(null);
  const canvasRef = useRef(null);

  const circleNotes = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getProgression = (root, type) => {
    const rootIndex = notes.indexOf(root);
    if (type === 'I-VI-IV-V') {
      return [
        root,
        notes[(rootIndex + 9) % 12],
        notes[(rootIndex + 5) % 12],
        notes[(rootIndex + 7) % 12]
      ];
    } else if (type === 'I-VI-II-V') {
      return [
        root,
        notes[(rootIndex + 9) % 12],
        notes[(rootIndex + 2) % 12],
        notes[(rootIndex + 7) % 12]
      ];
    }
    return [];
  };

  const progressionNotes = progression ? getProgression(selectedRoot, progression) : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 500;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 180;

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    circleNotes.forEach((note, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const isSelected = note === selectedRoot;
      const isInProgression = progressionNotes.includes(note);

      ctx.fillStyle = isSelected ? '#1f2937' : isInProgression ? '#9ca3af' : '#f3f4f6';
      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isSelected ? '#ffffff' : '#1f2937';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note, x, y);
    });

    if (progressionNotes.length > 0) {
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);

      for (let i = 0; i < progressionNotes.length - 1; i++) {
        const note1 = progressionNotes[i];
        const note2 = progressionNotes[i + 1];
        const idx1 = circleNotes.indexOf(note1);
        const idx2 = circleNotes.indexOf(note2);

        if (idx1 !== -1 && idx2 !== -1) {
          const angle1 = (idx1 * 30 - 90) * (Math.PI / 180);
          const angle2 = (idx2 * 30 - 90) * (Math.PI / 180);
          const x1 = centerX + radius * Math.cos(angle1);
          const y1 = centerY + radius * Math.sin(angle1);
          const x2 = centerX + radius * Math.cos(angle2);
          const y2 = centerY + radius * Math.sin(angle2);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }
  }, [selectedRoot, progressionNotes]);

  const handleNoteClick = (note) => {
    setSelectedRoot(note);
    setProgression(null);
  };

  return (
    <div className="min-h-screen p-8 relative">
      <DiagonalLines />
      <div className="relative z-10 max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-8 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 shadow-md"
        >
          <span>←</span> Back
        </button>

        <h2 className="text-3xl font-light text-center mb-12">Circle of Fourths/Fifths</h2>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <canvas ref={canvasRef} className="cursor-pointer" onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const x = e.clientX - rect.left - 250;
              const y = e.clientY - rect.top - 250;
              const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
              const normalizedAngle = (angle + 360) % 360;
              const index = Math.round(normalizedAngle / 30) % 12;
              handleNoteClick(circleNotes[index]);
            }} />
          </div>
        </div>

        {!progression && (
          <div className="text-center mb-8">
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-4">
              Select a progression
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setProgression('I-VI-IV-V')}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-all"
              >
                I - VI - IV - V
              </button>
              <button
                onClick={() => setProgression('I-VI-II-V')}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-all"
              >
                I - VI - II - V
              </button>
            </div>
          </div>
        )}

        {progression && (
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3">
              Progression
            </h3>
            <p className="text-3xl font-light text-gray-800">
              {progressionNotes.join(' - ')}
            </p>
            <button
              onClick={() => setProgression(null)}
              className="mt-6 px-6 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition-all"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [showFeatures, setShowFeatures] = useState(false);

  const handleFeatureSelect = (feature) => {
    setShowFeatures(false);
    setScreen(feature);
  };

  return (
    <div className="min-h-screen bg-white">
      {screen === 'home' && <HomePage onExplore={() => setShowFeatures(true)} />}
      {screen === 'triads' && <TriadsView onBack={() => setScreen('home')} />}
      {screen === 'scales' && <ScalesView onBack={() => setScreen('home')} />}
      {screen === 'chords' && <ChordsLibrary onBack={() => setScreen('home')} />}
      {screen === 'circle' && <CircleOfFifths onBack={() => setScreen('home')} />}
      
      {showFeatures && (
        <FeatureSelector
          onSelect={handleFeatureSelect}
          onClose={() => setShowFeatures(false)}
        />
      )}
    </div>
  );
}