let noteArray = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

const noteNum = (noteStr) => {
  return noteArray.indexOf(noteStr) + 1;
}

export default noteNum;
