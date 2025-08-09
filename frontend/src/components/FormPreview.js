import React from "react";

export default function FormPreview({
  title,
  description,
  questions,
  onBack,
  onSubmit,
}) {
  return (
    <div className="container mt-4">
      <div style={{ borderBottom: "2px solid #673ab7", paddingBottom: 8, marginBottom: 16 }}>
        <span style={{ fontWeight: "bold", fontSize: 22 }}>{title || "Untitled Quiz"}</span>
        <button
          className="btn btn-link float-end"
          onClick={onBack}
          style={{ marginRight: 10 }}
        >
          Edit
        </button>
        <button
          className="btn btn-primary float-end"
          onClick={onSubmit}
          style={{ marginRight: 10 }}
        >
          Save & Proceed
        </button>
        <button
          className="btn btn-outline-secondary float-end"
          onClick={onSubmit}
          style={{ marginRight: 10 }}
        >
          Save
        </button>
      </div>

      {description && <p>{description}</p>}

      {/* Categorize Preview */}
      <div className="mb-4" style={{ background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 20 }}>
        <b>Question 1</b>
        <span className="badge bg-info mx-2">Categorize</span>
        <div style={{ margin: "10px 0" }}>{questions[0]?.text}</div>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Belongs To</th>
            </tr>
          </thead>
          <tbody>
            {questions[0]?.items?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.value}</td>
                <td>{item.belongsTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cloze Preview */}
      <div className="mb-4" style={{ background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 20 }}>
        <b>Question 2</b>
        <span className="badge bg-info mx-2">Cloze</span>
        <div>
          <b>Sentence:</b> {questions[1]?.clozeSentence}
        </div>
        <div>
          <b>Answers:</b> {questions[1]?.clozeAnswers?.join(", ")}
        </div>
      </div>

      {/* Comprehension Preview */}
      <div className="mb-4" style={{ background: "#fff", borderRadius: 10, border: "1px solid #eee", padding: 20 }}>
        <b>Question 3</b>
        <span className="badge bg-info mx-2">Comprehension</span>
        <div style={{ whiteSpace: "pre-wrap" }}>{questions[2]?.passage}</div>
        {questions[2]?.mcqs?.map((mcq, idx) => (
          <div key={idx} className="mt-3">
            <b>Q3.{idx + 1} {mcq.question}</b>
            <ul>
              {mcq.options.map((opt, oidx) => (
                <li key={oidx} style={{ color: mcq.correct === oidx ? "green" : undefined }}>
                  {opt} {mcq.correct === oidx ? "(correct)" : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}