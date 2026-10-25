import { useEffect, useState } from "react";

export default function AdminPanel({ onList, onAdd, onDelete, onResponses }) {
  const [key, setKey] = useState("");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("multiple-choice");
  const [optionsText, setOptionsText] = useState("Option 1\nOption 2");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  async function refresh(adminKey = key) {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const [questionData, responseData] = await Promise.all([
        onList(adminKey),
        onResponses(adminKey)
      ]);
      setQuestions(questionData);
      setResponses(responseData);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // No key is stored in the browser; admin must enter it for each session.
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const options = type === "multiple-choice"
      ? optionsText.split("\n").map((option) => option.trim()).filter(Boolean)
      : [];
    try {
      await onAdd(key, { text, type, options });
      setText("");
      setMessage("Question added successfully.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this question?")) return;
    setError("");
    setMessage("");
    try {
      await onDelete(key, id);
      setMessage("Question deleted.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="admin-wrap">
      <div className="admin-intro">
        <span className="eyebrow">SURVEYSPACE TOOLS</span>
        <h1>Admin panel</h1>
        <p>Manage your question bank and review recent responses.</p>
      </div>

      <div className="survey-card admin-card">
        <form className="admin-login" onSubmit={(event) => { event.preventDefault(); refresh(); }}>
          <label htmlFor="admin-key">Admin key</label>
          <div className="admin-key-row">
            <input id="admin-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Enter ADMIN_KEY from backend/.env" required />
            <button className="primary-button" disabled={busy}>{busy ? "Checking…" : "Unlock"}</button>
          </div>
          <p className="field-hint">For security, use a unique key in your backend .env file. This demo uses a shared admin key, not full user accounts.</p>
        </form>

        {error && <div className="inline-error" role="alert">{error}</div>}
        {message && <div className="inline-success" role="status">{message}</div>}

        {authenticated && (
          <>
            <div className="admin-section">
              <h2>Add a question</h2>
              <form onSubmit={handleAdd} className="admin-form">
                <label htmlFor="question-text">Question text</label>
                <textarea id="question-text" rows="2" value={text} onChange={(event) => setText(event.target.value)} required maxLength={1000} placeholder="Enter your question…" />
                <label htmlFor="question-type">Question type</label>
                <select id="question-type" value={type} onChange={(event) => setType(event.target.value)}>
                  <option value="multiple-choice">Multiple choice</option>
                  <option value="short-answer">Short answer</option>
                </select>
                {type === "multiple-choice" && (
                  <>
                    <label htmlFor="question-options">Answer options (one per line)</label>
                    <textarea id="question-options" rows="4" value={optionsText} onChange={(event) => setOptionsText(event.target.value)} required />
                  </>
                )}
                <button className="primary-button" type="submit">Add question</button>
              </form>
            </div>

            <div className="admin-section">
              <div className="admin-section-heading">
                <h2>Question bank <span className="count-pill">{questions.length}</span></h2>
                <button className="secondary-button" onClick={() => refresh()}>Refresh</button>
              </div>
              {questions.length === 0 ? <p className="muted">No questions yet. Add at least five.</p> : (
                <div className="question-bank">
                  {questions.map((question) => (
                    <div className="bank-item" key={question._id}>
                      <div>
                        <strong>{question.text}</strong>
                        <p>{question.type === "multiple-choice" ? question.options.join(" · ") : "Short answer"}</p>
                      </div>
                      <button className="delete-button" onClick={() => handleDelete(question._id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-section">
              <div className="admin-section-heading">
                <h2>Recent responses <span className="count-pill">{responses.length}</span></h2>
                <button className="secondary-button" onClick={() => refresh()}>Refresh</button>
              </div>
              {responses.length === 0 ? <p className="muted">No submitted responses yet.</p> : (
                <div className="responses-list">
                  {responses.map((response) => (
                    <details className="response-item" key={response._id}>
                      <summary>
                        <span>Response · {new Date(response.createdAt).toLocaleString()}</span>
                        <span>{response.answers.length} answers</span>
                      </summary>
                      <ol>
                        {response.answers.map((answer, index) => (
                          <li key={`${response._id}-${index}`}>
                            <strong>{answer.questionText}</strong>
                            <p>{answer.answer}</p>
                          </li>
                        ))}
                      </ol>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
