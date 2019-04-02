import NoteFormationMidi from './noteFormationMidi';

const NoteForMidi = (stave_note) => {
    let notes = stave_note.split(' ');
    let notesTone = notes.map((note) => {
      let noteObject = NoteFormationMidi(note)
      return(
        noteObject
      )

    })

    return(notesTone);
}

export default NoteForMidi
