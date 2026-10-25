import { useCallback, useEffect, useState } from "react";
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  getRandomQuestions,
  getResponses,
  submitSurvey
} from "./api";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const loadSurvey = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setCompleted(false);
    setAnswers({});
    try {
      const data = await getRandomQuestions();
      setQuestions(data);
    } catch (err) {
      setQuestions([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSurvey(); }, [loadSurvey]);

  function updateAnswer(questionId, answer) {
    setAnswers((previous) => ({ ...previous, [questionId]: answer }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const missing = questions.some((question) => !String(answers[question._id] || "").trim());
    if (questions.length !== 5 || missing) {
      setError("Please answer all five questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitSurvey(
        questions.map((question) => ({
          questionId: question._id,
          answer: String(answers[question._id]).trim()
        }))
      );
      setMessage(result.message);
      setCompleted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setShowAdmin(false)}>
          <span className="brand-mark">S</span>
          <span>Survey<span className="brand-light">Space</span></span>
        </a>
        <button className="nav-button" onClick={() => setShowAdmin((value) => !value)}>
          {showAdmin ? "Take survey" : "Admin panel"}
        </button>
      </header>

      <main className="main-content" id="home">
        {showAdmin ? (
          <AdminPanel
            onList={getQuestions}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onResponses={getResponses}
          />
        ) : (
          <>
            <section className="hero">
              <span className="eyebrow">YOUR VOICE MATTERS</span>
              <h1>A few questions.<br /><span>A better understanding.</span></h1>
              <p>Share your thoughts in this short five-question survey. It only takes a couple of minutes.</p>
              <div className="survey-meta">
                <span><span className="meta-icon">◷</span> About 2 minutes</span>
                <span><span className="meta-icon">☷</span> 5 questions</span>
              </div>
            </section>

            <section className="survey-card">
              <div className="card-heading">
                <div>
                  <p className="section-kicker">ONLINE SURVEY</p>
                  <h2>Tell us what you think</h2>
                </div>
                {questions.length > 0 && !completed && (
                  <span className="question-count">{Object.values(answers).filter((value) => String(value).trim()).length} of 5 answered</span>
                )}
              </div>

              {loading ? (
                <div className="state-message"><span className="spinner" /> Loading your questions…</div>
              ) : completed ? (
                <div className="success-panel">
                  <div className="success-icon">✓</div>
                  <h3>Response submitted!</h3>
                  <p>{message}</p>
                  <button className="primary-button" onClick={loadSurvey}>Take another survey</button>
                </div>
              ) : error && questions.length === 0 ? (
                <div className="error-panel">
                  <p>{error}</p>
                  <button className="primary-button" onClick={loadSurvey}>Try again</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {questions.map((question, index) => (
                    <fieldset className="question-block" key={question._id}>
                      <legend>
                        <span className="question-number">{String(index + 1).padStart(2, "0")}</span>
                        <span>{question.text}<span className="required-star"> *</span></span>
                      </legend>
                      {question.type === "multiple-choice" ? (
                        <div className="options-list">
                          {question.options.map((option) => (
                            <label className={`option ${answers[question._id] === option ? "selected" : ""}`} key={option}>
                              <input
                                type="radio"
                                name={question._id}
                                value={option}
                                checked={answers[question._id] === option}
                                onChange={() => updateAnswer(question._id, option)}
                              />
                              <span className="radio-custom" />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          rows="3"
                          value={answers[question._id] || ""}
                          onChange={(event) => updateAnswer(question._id, event.target.value)}
                          placeholder="Type your answer here…"
                          maxLength={2000}
                          required
                        />
                      )}
                    </fieldset>
                  ))}

                  {error && <div className="inline-error" role="alert">{error}</div>}
                  {questions.length > 0 && (
                    <div className="form-footer">
                      <p><span className="lock-icon">●</span> Your response will be saved securely.</p>
                      <button className="primary-button" type="submit" disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit survey"} <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  )}
                </form>
              )}
            </section>
            <p className="page-footnote">Thank you for taking the time to share your feedback.</p>
          </>
        )}
      </main>
      <footer className="footer"><span>SurveySpace</span><span>Simple surveys, meaningful insights.</span></footer>
    </div>
  );
}
