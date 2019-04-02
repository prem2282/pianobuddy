import NoteMassage from './noteMassage';

const NoteForVex = (stave_note) => {
    let notes = stave_note.split(' ');
    let noteChanged = notes.map((note) => {
      let noteStr = NoteMassage(note)
      return(
        noteStr
      )

    })
    let noteString = noteChanged.join(' ')
    return(noteString);
}

export default NoteForVex

