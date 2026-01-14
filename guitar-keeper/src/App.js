import React, { useState, useEffect, useRef } from 'react';

const FloatingDots = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#5F7358', '#E8D98D', '#3D2E1E'];
    const particleCount = 50;

    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F4E9] shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <div
          onClick={() => setCurrentPage('home')}
          className="text-2xl font-light text-[#5F7358] cursor-pointer hover:opacity-80 transition-opacity"
        >
          Guitar Keeper
        </div>
        <div className="flex gap-6">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentPage === 'home'
                ? 'bg-[#5F7358] text-white'
                : 'text-[#3D2E1E] hover:bg-[#EDE6D6]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('fretboard')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentPage === 'fretboard'
                ? 'bg-[#5F7358] text-white'
                : 'text-[#3D2E1E] hover:bg-[#EDE6D6]'
            }`}
          >
            Fretboard Tools
          </button>
          <button
            onClick={() => setCurrentPage('circle')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentPage === 'circle'
                ? 'bg-[#5F7358] text-white'
                : 'text-[#3D2E1E] hover:bg-[#EDE6D6]'
            }`}
          >
            Circle of Fifths
          </button>
        </div>
      </div>
    </nav>
  );
};

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-8">
      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-7xl font-light text-[#5F7358] mb-6">
          Guitar Keeper
        </h1>
        <p className="text-xl text-[#3D2E1E] mb-12 leading-relaxed">
          Your comprehensive tool for mastering guitar theory, visualizing chords, scales, and progressions across the fretboard
        </p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => setCurrentPage('fretboard')}
            className="px-10 py-4 bg-[#5F7358] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Explore Fretboard
          </button>
          <button
            onClick={() => setCurrentPage('circle')}
            className="px-10 py-4 bg-[#E8D98D] text-[#3D2E1E] rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Circle of Fifths
          </button>
        </div>
      </div>
    </div>
  );
};

const NoteSelector = ({ label, selectedNote, onSelect }) => {
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
        {label}
      </label>
      <div className="grid grid-cols-12 gap-2">
        {notes.map(note => (
          <button
            key={note}
            onClick={() => onSelect(note)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedNote === note
                ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
            }`}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};

const Fretboard = ({ highlightedNotes }) => {
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
    const width = 1200;
    const height = 400;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const fretCount = 15;
    const stringCount = 6;
    const leftMargin = 50;
    const rightMargin = 50;
    const topMargin = 40;
    const bottomMargin = 40;
    const fretboardWidth = width - leftMargin - rightMargin;
    const fretboardHeight = height - topMargin - bottomMargin;
    const stringSpacing = fretboardHeight / (stringCount - 1);
    const fretSpacing = fretboardWidth / fretCount;

    ctx.fillStyle = '#EDE6D6';
    ctx.fillRect(leftMargin, topMargin - 20, fretboardWidth, fretboardHeight + 40);

    ctx.strokeStyle = '#3D2E1E';
    ctx.lineWidth = 2;
    for (let i = 0; i < stringCount; i++) {
      const y = topMargin + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(leftMargin + fretboardWidth, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#3D2E1E';
    ctx.lineWidth = 3;
    for (let i = 0; i <= fretCount; i++) {
      const x = leftMargin + i * fretSpacing;
      ctx.beginPath();
      ctx.moveTo(x, topMargin - 20);
      ctx.lineTo(x, topMargin + fretboardHeight + 20);
      ctx.stroke();
    }

    const fretMarkers = [3, 5, 7, 9, 12, 15];
    ctx.fillStyle = '#3D2E1E';
    fretMarkers.forEach(fret => {
      const x = leftMargin + (fret - 0.5) * fretSpacing;
      const y = topMargin + fretboardHeight / 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let string = 0; string < stringCount; string++) {
      for (let fret = 0; fret <= fretCount; fret++) {
        const note = fretboardMap[string][fret];
        const highlight = highlightedNotes.find(h => h.note === note);

        if (highlight) {
          const x = fret === 0 ? leftMargin : leftMargin + (fret - 0.5) * fretSpacing;
          const y = topMargin + string * stringSpacing;

          ctx.fillStyle = highlight.isRoot ? '#5F7358' : '#E8D98D';
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = highlight.isRoot ? '#FFFFFF' : '#3D2E1E';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note, x, y);
        }
      }
    }
  }, [highlightedNotes]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
};

const TriadsVisualizer = () => {
  const [rootNote, setRootNote] = useState('C');
  const [chordType, setChordType] = useState('major');
  const [inversionFilter, setInversionFilter] = useState('all');

  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getNoteIndex = (note) => notes.indexOf(note);

  const getChordNotes = (root, type) => {
    const rootIndex = getNoteIndex(root);
    let intervals = [];

    switch (type) {
      case 'major':
        intervals = [0, 4, 7];
        break;
      case 'minor':
        intervals = [0, 3, 7];
        break;
      case 'diminished':
        intervals = [0, 3, 6];
        break;
      case 'power':
        intervals = [0, 7, 12];
        break;
      default:
        intervals = [0, 4, 7];
    }

    return intervals.map((interval, index) => ({
      note: notes[(rootIndex + interval) % 12],
      isRoot: index === 0
    }));
  };

  const chordNotes = getChordNotes(rootNote, chordType);
  const highlightedNotes = inversionFilter === 'all' ? chordNotes : chordNotes;

  return (
    <div>
      <NoteSelector
        label="Root Note"
        selectedNote={rootNote}
        onSelect={setRootNote}
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
          Chord Type
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'major', label: 'Major Triad' },
            { id: 'minor', label: 'Minor Triad' },
            { id: 'diminished', label: 'Diminished Triad' },
            { id: 'power', label: 'Power Chord' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setChordType(type.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                chordType === type.id
                  ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                  : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
          Inversion Filter
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'all', label: 'Show All Positions' },
            { id: 'root', label: 'Root Position Only' },
            { id: 'first', label: '1st Inversion Only' },
            { id: 'second', label: '2nd Inversion Only' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setInversionFilter(filter.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                inversionFilter === filter.id
                  ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                  : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <Fretboard highlightedNotes={highlightedNotes} />
    </div>
  );
};

const ScalesVisualizer = () => {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [octaveRange, setOctaveRange] = useState('all');

  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getNoteIndex = (note) => notes.indexOf(note);

  const getScaleNotes = (root, type) => {
    const rootIndex = getNoteIndex(root);
    let intervals = [];

    switch (type) {
      case 'major':
        intervals = [0, 2, 4, 5, 7, 9, 11];
        break;
      case 'minor':
        intervals = [0, 2, 3, 5, 7, 8, 10];
        break;
      case 'minor-b3':
        intervals = [0, 2, 3, 5, 7, 9, 11];
        break;
      case 'minor-b7':
        intervals = [0, 2, 4, 5, 7, 9, 10];
        break;
      default:
        intervals = [0, 2, 4, 5, 7, 9, 11];
    }

    return intervals.map((interval, index) => ({
      note: notes[(rootIndex + interval) % 12],
      isRoot: index === 0
    }));
  };

  const scaleNotes = getScaleNotes(rootNote, scaleType);

  return (
    <div>
      <NoteSelector
        label="Root Note"
        selectedNote={rootNote}
        onSelect={setRootNote}
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
          Scale Type
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'major', label: 'Major' },
            { id: 'minor', label: 'Natural Minor' },
            { id: 'minor-b3', label: 'Minor with b3' },
            { id: 'minor-b7', label: 'Minor with b7' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setScaleType(type.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                scaleType === type.id
                  ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                  : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
          Octave Range
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'all', label: 'All Frets' },
            { id: 'first', label: '1st Octave (0-12)' },
            { id: 'second', label: '2nd Octave (13-15)' }
          ].map(range => (
            <button
              key={range.id}
              onClick={() => setOctaveRange(range.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                octaveRange === range.id
                  ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                  : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <Fretboard highlightedNotes={scaleNotes} />
    </div>
  );
};

const ProgressionsVisualizer = () => {
  const [rootKey, setRootKey] = useState('C');
  const [progression, setProgression] = useState('I-V-vi-IV');
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getNoteIndex = (note) => notes.indexOf(note);

  const getProgressionChords = (root, prog) => {
    const rootIndex = getNoteIndex(root);
    let chordData = [];

    switch (prog) {
      case 'I-V-vi-IV':
        chordData = [
          { offset: 0, type: 'major', name: 'I' },
          { offset: 7, type: 'major', name: 'V' },
          { offset: 9, type: 'minor', name: 'vi' },
          { offset: 5, type: 'major', name: 'IV' }
        ];
        break;
      case 'I-IV-V':
        chordData = [
          { offset: 0, type: 'major', name: 'I' },
          { offset: 5, type: 'major', name: 'IV' },
          { offset: 7, type: 'major', name: 'V' }
        ];
        break;
      case 'I-vi-II-V':
        chordData = [
          { offset: 0, type: 'major', name: 'I' },
          { offset: 9, type: 'minor', name: 'vi' },
          { offset: 2, type: 'minor', name: 'II' },
          { offset: 7, type: 'major', name: 'V' }
        ];
        break;
      case 'II-V-I':
        chordData = [
          { offset: 2, type: 'minor', name: 'II' },
          { offset: 7, type: 'major', name: 'V' },
          { offset: 0, type: 'major', name: 'I' }
        ];
        break;
      default:
        chordData = [
          { offset: 0, type: 'major', name: 'I' },
          { offset: 7, type: 'major', name: 'V' },
          { offset: 9, type: 'minor', name: 'vi' },
          { offset: 5, type: 'major', name: 'IV' }
        ];
    }

    return chordData.map(chord => {
      const chordRoot = notes[(rootIndex + chord.offset) % 12];
      const chordRootIndex = getNoteIndex(chordRoot);
      const intervals = chord.type === 'major' ? [0, 4, 7] : [0, 3, 7];

      return {
        name: `${chord.name} (${chordRoot})`,
        root: chordRoot,
        notes: intervals.map((interval, index) => ({
          note: notes[(chordRootIndex + interval) % 12],
          isRoot: index === 0
        }))
      };
    });
  };

  const progressionChords = getProgressionChords(rootKey, progression);
  const currentChord = progressionChords[currentChordIndex];

  return (
    <div>
      <NoteSelector
        label="Root Key"
        selectedNote={rootKey}
        onSelect={(note) => {
          setRootKey(note);
          setCurrentChordIndex(0);
        }}
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
          Progression
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'I-V-vi-IV', label: 'I-V-vi-IV' },
            { id: 'I-IV-V', label: 'I-IV-V' },
            { id: 'I-vi-II-V', label: 'I-vi-II-V' },
            { id: 'II-V-I', label: 'II-V-I' }
          ].map(prog => (
            <button
              key={prog.id}
              onClick={() => {
                setProgression(prog.id);
                setCurrentChordIndex(0);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                progression === prog.id
                  ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                  : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
              }`}
            >
              {prog.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3">
          Current Chord
        </label>
        <div className="flex gap-3">
          {progressionChords.map((chord, index) => (
            <button
              key={index}
              onClick={() => setCurrentChordIndex(index)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 ${
                currentChordIndex === index
                  ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                  : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
              }`}
            >
              {chord.name}
            </button>
          ))}
        </div>
      </div>

      <Fretboard highlightedNotes={currentChord.notes} />
    </div>
  );
};

const FretboardToolsPage = () => {
  const [activeTool, setActiveTool] = useState('triads');

  return (
    <div className="relative min-h-screen pt-24 px-8 pb-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setActiveTool('triads')}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTool === 'triads'
                ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
            }`}
          >
            Triads
          </button>
          <button
            onClick={() => setActiveTool('scales')}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTool === 'scales'
                ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
            }`}
          >
            Scales
          </button>
          <button
            onClick={() => setActiveTool('progressions')}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTool === 'progressions'
                ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
            }`}
          >
            Progressions
          </button>
        </div>

        <div className="bg-[#EDE6D6] rounded-2xl p-8 shadow-lg">
          {activeTool === 'triads' && <TriadsVisualizer />}
          {activeTool === 'scales' && <ScalesVisualizer />}
          {activeTool === 'progressions' && <ProgressionsVisualizer />}
        </div>
      </div>
    </div>
  );
};

const CircleOfFifthsPage = () => {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [progression, setProgression] = useState('none');
  const canvasRef = useRef(null);

  const circleNotes = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const getProgressionNotes = (root, prog) => {
    const rootIndex = notes.indexOf(root);
    
    if (prog === 'ii-V-I') {
      return [
        notes[(rootIndex + 2) % 12],
        notes[(rootIndex + 7) % 12],
        root
      ];
    } else if (prog === 'I-IV-V') {
      return [
        root,
        notes[(rootIndex + 5) % 12],
        notes[(rootIndex + 7) % 12]
      ];
    }
    return [];
  };

  const progressionNotes = progression !== 'none' ? getProgressionNotes(selectedRoot, progression) : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const height = 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;

    ctx.strokeStyle = '#3D2E1E';
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

      ctx.fillStyle = isSelected ? '#5F7358' : isInProgression ? '#E8D98D' : '#EDE6D6';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3D2E1E';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isSelected ? '#FFFFFF' : '#3D2E1E';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note, x, y);
    });

    if (progressionNotes.length > 0) {
      ctx.strokeStyle = '#E8D98D';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      for (let i = 0; i < progressionNotes.length; i++) {
        const noteIndex1 = circleNotes.indexOf(progressionNotes[i]);
        const noteIndex2 = circleNotes.indexOf(progressionNotes[(i + 1) % progressionNotes.length]);

        if (noteIndex1 !== -1 && noteIndex2 !== -1) {
          const angle1 = (noteIndex1 * 30 - 90) * (Math.PI / 180);
          const angle2 = (noteIndex2 * 30 - 90) * (Math.PI / 180);
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
  }, [selectedRoot, progression, progressionNotes]);

  return (
    <div className="relative min-h-screen pt-24 px-8 pb-8">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-[#EDE6D6] rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-light text-[#5F7358] text-center mb-8">
            Circle of Fifths
          </h2>

          <div className="flex justify-center mb-8">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#3D2E1E] uppercase mb-3 text-center">
              Progression Type
            </label>
            <div className="flex gap-3 justify-center">
              {[
                { id: 'none', label: 'None' },
                { id: 'ii-V-I', label: 'ii-V-I' },
                { id: 'I-IV-V', label: 'I-IV-V' }
              ].map(prog => (
                <button
                  key={prog.id}
                  onClick={() => setProgression(prog.id)}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    progression === prog.id
                      ? 'bg-[#5F7358] text-white shadow-lg scale-105'
                      : 'bg-[#EDE6D6] text-[#3D2E1E] hover:bg-[#E8D98D]'
                  }`}
                >
                  {prog.label}
                </button>
              ))}
            </div>
          </div>

          <NoteSelector
            label="Root Note"
            selectedNote={selectedRoot}
            onSelect={setSelectedRoot}
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="bg-[#F8F4E9] min-h-screen">
      <FloatingDots />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'fretboard' && <FretboardToolsPage />}
      {currentPage === 'circle' && <CircleOfFifthsPage />}
    </div>
  );
}