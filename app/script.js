const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const TUNING = [
    { note: 'E', octave: 2 },
    { note: 'A', octave: 2 },
    { note: 'D', octave: 3 },
    { note: 'G', octave: 3 },
    { note: 'B', octave: 3 },
    { note: 'E', octave: 4 }
];
const FRETS = 22;

const FRETBOARD_MAP = [
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D']
];

const canvas = document.getElementById('fretboard');
const ctx = canvas.getContext('2d');

const rootNoteSelect = document.getElementById('root-note');
const chordTypeSelect = document.getElementById('chord-type');
const inversionSelect = document.getElementById('inversion');

let currentHighlights = [];

function getNoteIndex(note) {
    return NOTES.indexOf(note);
}

function getNoteAtPosition(stringIndex, fret) {
    return FRETBOARD_MAP[stringIndex][fret];
}

function getInterval(root, note) {
    const rootIndex = getNoteIndex(root);
    const noteIndex = getNoteIndex(note);
    return (noteIndex - rootIndex + 12) % 12;
}

function calculateChordNotes(root, chordType) {
    const rootIndex = getNoteIndex(root);
    let intervals = [];
    
    switch(chordType) {
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
            intervals = [0, 7, 0];
            break;
    }
    
    return intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
}

function getNoteRole(note, chordNotes, root, chordType) {
    const interval = getInterval(root, note);
    
    if (note === root) return 'root';
    
    if (chordType === 'power') {
        if (interval === 7) return 'fifth';
        return null;
    }
    
    if (chordType === 'major') {
        if (interval === 4) return 'third';
        if (interval === 7) return 'fifth';
    } else if (chordType === 'minor' || chordType === 'diminished') {
        if (interval === 3) return 'third';
        if (interval === 7 || interval === 6) return 'fifth';
    }
    
    return null;
}

function findAllNotePositions(root, chordType) {
    const chordNotes = calculateChordNotes(root, chordType);
    const positions = [];
    
    for (let string = 0; string < 6; string++) {
        for (let fret = 0; fret <= FRETS; fret++) {
            const note = getNoteAtPosition(string, fret);
            const role = getNoteRole(note, chordNotes, root, chordType);
            
            if (role) {
                positions.push({
                    string,
                    fret,
                    note,
                    role
                });
            }
        }
    }
    
    return positions;
}

function findTriadShapes(positions, root, chordType, inversionFilter) {
    if (inversionFilter === 'all') {
        return positions;
    }
    
    const shapes = [];
    
    for (let baseString = 0; baseString <= 3; baseString++) {
        const stringSet = [baseString, baseString + 1, baseString + 2];
        
        for (let baseFret = 0; baseFret <= FRETS; baseFret++) {
            const fretRange = [baseFret, baseFret + 1, baseFret + 2, baseFret + 3, baseFret + 4];
            
            const notesInRange = positions.filter(pos => 
                stringSet.includes(pos.string) && fretRange.includes(pos.fret)
            );
            
            const uniqueRoles = new Set(notesInRange.map(n => n.role));
            const hasAllNotes = uniqueRoles.has('root') && uniqueRoles.has('third') && uniqueRoles.has('fifth');
            
            if (!hasAllNotes && chordType !== 'power') continue;
            if (chordType === 'power' && !(uniqueRoles.has('root') && uniqueRoles.has('fifth'))) continue;
            
            const lowestString = Math.max(...notesInRange.map(n => n.string));
            const lowestNotes = notesInRange.filter(n => n.string === lowestString);
            
            if (lowestNotes.length === 0) continue;
            
            const lowestNote = lowestNotes.reduce((prev, curr) => 
                prev.fret < curr.fret ? prev : curr
            );
            
            let isValidInversion = false;
            
            if (inversionFilter === 'root' && lowestNote.role === 'root') {
                isValidInversion = true;
            } else if (inversionFilter === 'first' && lowestNote.role === 'third') {
                isValidInversion = true;
            } else if (inversionFilter === 'second' && lowestNote.role === 'fifth') {
                isValidInversion = true;
            }
            
            if (isValidInversion) {
                notesInRange.forEach(note => {
                    if (!shapes.some(s => s.string === note.string && s.fret === note.fret)) {
                        shapes.push(note);
                    }
                });
            }
        }
    }
    
    return shapes;
}

function drawFretboard() {
    const dpr = window.devicePixelRatio || 1;
    const width = 1200;
    const height = 300;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, width, height);
    
    const fretWidth = (width - 100) / FRETS;
    const stringSpacing = (height - 100) / 5;
    const startX = 50;
    const startY = 50;
    
    ctx.strokeStyle = '#3D2E1E';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 6; i++) {
        const y = startY + i * stringSpacing;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + FRETS * fretWidth, y);
        ctx.stroke();
    }
    
    for (let i = 0; i <= FRETS; i++) {
        const x = startX + i * fretWidth;
        ctx.lineWidth = i === 0 ? 4 : 1.5;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY + 5 * stringSpacing);
        ctx.stroke();
    }
    
    ctx.fillStyle = '#3D2E1E';
    ctx.font = '12px sans-serif';
    const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];
    fretMarkers.forEach(fret => {
        const x = startX + (fret - 0.5) * fretWidth;
        const y = startY + 5 * stringSpacing + 20;
        ctx.fillText(fret.toString(), x - 5, y);
    });
    
    const root = rootNoteSelect.value;
    const chordType = chordTypeSelect.value;
    const inversion = inversionSelect.value;
    
    const allPositions = findAllNotePositions(root, chordType);
    currentHighlights = findTriadShapes(allPositions, root, chordType, inversion);
    
    currentHighlights.forEach(pos => {
        const x = startX + (pos.fret === 0 ? 0 : pos.fret - 0.5) * fretWidth;
        const y = startY + pos.string * stringSpacing;
        
        const isRoot = pos.role === 'root';
        ctx.fillStyle = isRoot ? '#5F7358' : '#E8D98D';
        
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = isRoot ? '#FFFFFF' : '#3D2E1E';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.note, x, y);
    });
}

function updateVisualization() {
    drawFretboard();
}

rootNoteSelect.addEventListener('change', updateVisualization);
chordTypeSelect.addEventListener('change', updateVisualization);
inversionSelect.addEventListener('change', updateVisualization);

window.addEventListener('resize', drawFretboard);

updateVisualization();