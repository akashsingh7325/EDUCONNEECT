export const getStudentId = () => {
  try {
    const current = JSON.parse(localStorage.getItem("educonnectCurrentUser") || "null");
    const profile = JSON.parse(localStorage.getItem("educonnectProfile") || "null");
    const student = current || profile;
    return student?.username || student?.email || "guest-student";
  } catch {
    return "guest-student";
  }
};

export const getNotesHubKey = () => `educonnectNotesHub:${getStudentId()}`;
export const getStudentNotes = () => {
  try { return JSON.parse(localStorage.getItem(getNotesHubKey()) || "[]"); }
  catch { return []; }
};
export const saveStudentNote = (note) => {
  const notes = getStudentNotes();
  if (notes.some((item) => String(item.id) === String(note.id))) return notes;
  const next = [{ ...note, savedAt: new Date().toISOString() }, ...notes];
  localStorage.setItem(getNotesHubKey(), JSON.stringify(next));
  window.dispatchEvent(new Event("educonnect-notes-updated"));
  return next;
};
export const removeStudentNote = (noteId) => {
  const next = getStudentNotes().filter((item) => String(item.id) !== String(noteId));
  localStorage.setItem(getNotesHubKey(), JSON.stringify(next));
  window.dispatchEvent(new Event("educonnect-notes-updated"));
  return next;
};
