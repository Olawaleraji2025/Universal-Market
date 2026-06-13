import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SupabaseTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [noteInput, setNoteInput] = useState('');

  async function fetchTasks() {
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('NewNotes')
      .select('Notes')

    if (error) {
      setErrorMsg(error.message);
      setTasks([]);
      setLoading(false);
      return;
    }

    setTasks(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await fetchTasks();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTask(noteText) {
    const note = (noteText ?? '').trim();
    if (!note) {
      setErrorMsg('Please type a note');
      return;
    }

    setErrorMsg('');

    const { error } = await supabase
      .from('NewNotes')
      .insert({ Notes: note });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setNoteInput('');
    await fetchTasks();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Supabase tasks</h2>

      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          addTask(noteInput);
        }}
      >
        <input
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Type a note..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : errorMsg ? (
        <p className="text-red-600">Error: {errorMsg}</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No rows found in table: tasks</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(tasks[0]).map((key) => (
                  <th
                    key={key}
                    className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-4 py-3 border-b"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((row, idx) => (
                <tr key={row.id ?? idx} className="hover:bg-gray-50">
                  {Object.keys(tasks[0]).map((key) => (
                    <td key={key} className="px-4 py-2 border-b text-sm text-gray-800">
                      {String(row[key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

