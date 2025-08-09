import React, { useState } from "react";
import FormPreview from "./FormPreview";
import { createForm } from "../api";
import { useHistory } from "react-router-dom";

export default function FormEditor() {
  // Form meta
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");

  // Preview mode
  const [showPreview, setShowPreview] = useState(false);

  // Categorize
  const [catText, setCatText] = useState("");
  const [catImage, setCatImage] = useState("");
  const [categories, setCategories] = useState([{ value: "" }]);
  const [items, setItems] = useState([{ value: "", belongsTo: "" }]);

  // Cloze
  const [clozeSentence, setClozeSentence] = useState("");
  const [clozeAnswers, setClozeAnswers] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [showAddAnswer, setShowAddAnswer] = useState(false);
  const [manualAnswer, setManualAnswer] = useState("");
  const [blankPositions, setBlankPositions] = useState([]);

  // Comprehension
  const [passage, setPassage] = useState("");
  const [compQuestions, setCompQuestions] = useState([
    { question: "", options: ["", ""], correct: 0 },
  ]);

  const history = useHistory();

  // Image handler
  const handleImage = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  // ========== Categorize ==========
  const handleCategoryChange = (idx, value) => {
    setCategories(categories.map((cat, i) => (i === idx ? { value } : cat)));
  };
  const addCategory = () => setCategories([...categories, { value: "" }]);
  const removeCategory = (idx) => setCategories(categories.filter((_, i) => i !== idx));
  const safeCategory = (catVal) => categories.find((cat) => cat.value === catVal) ? catVal : "";
  const handleItemChange = (idx, value) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, value } : it)));
  };
  const handleItemBelongsToChange = (idx, belongsTo) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, belongsTo } : it)));
  };
  const addItem = () => setItems([...items, { value: "", belongsTo: "" }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  // ========== Cloze ==========
  const handleClozeWordSelect = () => {
    if (selectedWord && selectedWordIndex !== null) {
      if (!blankPositions.includes(selectedWordIndex)) {
        setBlankPositions([...blankPositions, selectedWordIndex]);
      }
      if (!clozeAnswers.includes(selectedWord)) {
        setClozeAnswers([...clozeAnswers, selectedWord]);
      }
    }
    setSelectedWord("");
    setSelectedWordIndex(null);
  };

  const handleAddManualAnswer = () => {
    const word = manualAnswer.trim();
    if (word) {
      const words = clozeSentence.split(" ");
      const index = words.findIndex(w => w === word);
      if (index !== -1) {
        if (!blankPositions.includes(index)) {
          setBlankPositions([...blankPositions, index]);
        }
        if (!clozeAnswers.includes(word)) {
          setClozeAnswers([...clozeAnswers, word]);
        }
      }
      setManualAnswer("");
      setShowAddAnswer(false);
    }
  };

  const handleRemoveClozeAnswer = (idx) => {
    const word = clozeAnswers[idx];
    setClozeAnswers(clozeAnswers.filter((_, i) => i !== idx));
    setBlankPositions(blankPositions.filter(pos => {
      return clozeSentence.split(" ")[pos] !== word;
    }));
  };

  const clozePreview = clozeSentence
    ? clozeSentence.split(" ").map((word, idx) => {
        return blankPositions.includes(idx)
          ? <b key={idx}> ____ </b>
          : <span key={idx}> {word} </span>;
      })
    : null;

  // ========== Comprehension ==========
  const handleCompQuestionChange = (idx, field, value) => {
    setCompQuestions(
      compQuestions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };
  const handleCompOptionChange = (qIdx, optIdx, value) => {
    setCompQuestions(
      compQuestions.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optIdx ? value : opt
              ),
            }
          : q
      )
    );
  };
  const handleCompCorrectChange = (qIdx, correctIdx) => {
    setCompQuestions(
      compQuestions.map((q, i) =>
        i === qIdx ? { ...q, correct: correctIdx } : q
      )
    );
  };
  const addCompQuestion = () => {
    setCompQuestions([
      ...compQuestions,
      { question: "", options: ["", ""], correct: 0 },
    ]);
  };
  const removeCompQuestion = (idx) => {
    setCompQuestions(compQuestions.filter((_, i) => i !== idx));
  };
  const addCompOption = (qIdx) => {
    setCompQuestions(
      compQuestions.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  // ========== Preview and Save ==========
  const formQuestions = [
    {
      type: "categorize",
      text: catText,
      image: catImage,
      categories: categories.map((c) => c.value).filter((v) => v.trim()),
      items: items.filter((it) => it.value.trim()).map((it) => ({
        value: it.value,
        belongsTo: safeCategory(it.belongsTo),
      })),
    },
    {
      type: "cloze",
      clozeSentence,
      clozeAnswers,
      blankPositions,
    },
    {
      type: "comprehension",
      passage,
      mcqs: compQuestions
        .filter(
          (subq) =>
            subq.question.trim() &&
            subq.options.filter((o) => o.trim()).length >= 2
        )
        .map((subq) => ({
          question: subq.question,
          options: subq.options,
          correct: subq.correct,
        })),
    },
  ];

  const handlePreview = () => {
    if (!title.trim()) return alert("Form Title is required!");
    setShowPreview(true);
  };

  const handleFinalSave = async () => {
    try {
      await createForm({
        title,
        description,
        headerImage,
        questions: formQuestions,
      });
      history.push("/");
    } catch (err) {
      alert(
        "Error saving form: " + (err.response?.data?.error || err.message)
      );
    }
  };

  if (showPreview) {
    return (
      <FormPreview
        title={title}
        description={description}
        questions={formQuestions}
        onBack={() => setShowPreview(false)}
        onSubmit={handleFinalSave}
      />
    );
  }

  return (
    <div className="container mt-5">
      <h2>Create Form</h2>
      <input
        className="form-control mb-2"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImage(e, setHeaderImage)}
      />
      {headerImage && (
        <img
          src={headerImage}
          alt="Header"
          style={{ maxWidth: 200, display: "block", margin: "10px 0" }}
        />
      )}
      <hr />

      {/* ================== CATEGORIZE ================== */}
      <h4>1. Categorize</h4>
      <input
        className="form-control mb-2"
        placeholder="Question Text"
        value={catText}
        onChange={(e) => setCatText(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImage(e, setCatImage)}
      />
      {catImage && (
        <img
          src={catImage}
          alt="Q"
          style={{ maxWidth: 150, margin: "8px 0" }}
        />
      )}
      <div className="row">
        <div className="col-md-6">
          <b>Categories</b>
          {categories.map((cat, i) => (
            <div key={i} className="input-group mb-1">
              <input
                className="form-control"
                value={cat.value}
                placeholder={`Category ${i + 1}${i > 1 ? " (Optional)" : ""}`}
                onChange={(e) => handleCategoryChange(i, e.target.value)}
              />
              {categories.length > 1 && (
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => removeCategory(i)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="btn btn-link" type="button" onClick={addCategory}>
            + Add Category
          </button>
        </div>
        <div className="col-md-6">
          <b>Items</b>
          {items.map((it, i) => (
            <div key={i} className="input-group mb-1">
              <input
                className="form-control"
                value={it.value}
                placeholder={`Item ${i + 1}${i > 1 ? " (Optional)" : ""}`}
                onChange={(e) => handleItemChange(i, e.target.value)}
              />
              <select
                className="form-select"
                value={it.belongsTo}
                onChange={(e) =>
                  handleItemBelongsToChange(i, e.target.value)
                }
              >
                <option value="">Belongs To...</option>
                {categories
                  .filter((c) => c.value.trim())
                  .map((cat, j) => (
                    <option key={j} value={cat.value}>
                      {cat.value}
                    </option>
                  ))}
              </select>
              {items.length > 1 && (
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => removeItem(i)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="btn btn-link" type="button" onClick={addItem}>
            + Add Item
          </button>
        </div>
      </div>
      <hr />

      {/* ================== CLOZE ================== */}
      <h4>2. Cloze</h4>
      <div className="mb-3" style={{ border: "1px solid #e3e3e3", borderRadius: 8, padding: 16, background: "#fafbfd" }}>
        <div>
          <b>Preview:</b>
          <div style={{ background: "#fff", border: "1px solid #eee", padding: 8, borderRadius: 6, marginBottom: 6 }}>
            {clozePreview}
          </div>
        </div>
        <div>
          <label className="form-label">Sentence*</label>
          <textarea
            className="form-control mb-2"
            value={clozeSentence}
            onChange={e => setClozeSentence(e.target.value)}
            rows={2}
            placeholder="Type the full sentence here"
          />
        </div>
        <div>
          <label className="form-label">Select a word in the sentence to mark as blank:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {clozeSentence.split(" ").filter(w => !!w).map((word, i) => (
              <button
                key={i}
                type="button"
                className={`btn btn-sm ${blankPositions.includes(i) ? "btn-secondary" : "btn-outline-primary"}`}
                onClick={() => {
                  setSelectedWord(word);
                  setSelectedWordIndex(i);
                }}
                style={{ marginBottom: 4 }}
              >
                {word}
              </button>
            ))}
          </div>
          {selectedWord && selectedWordIndex !== null && (
            <div className="mt-2">
              <span>Mark "<b>{selectedWord}</b>" (position: {selectedWordIndex + 1}) as blank?</span>
              <button type="button" className="btn btn-success btn-sm mx-2" onClick={handleClozeWordSelect}>
                Yes
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {
                setSelectedWord("");
                setSelectedWordIndex(null);
              }}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="mt-3">
          <b>Blanks/Answers:</b>
          <ul>
            {clozeAnswers.map((word, idx) => (
              <li key={idx}>
                <span>{word}</span>
                <button className="btn btn-link btn-sm text-danger" type="button" onClick={() => handleRemoveClozeAnswer(idx)}>Remove</button>
              </li>
            ))}
          </ul>
          {!showAddAnswer && (
            <button className="btn btn-link" type="button" onClick={() => setShowAddAnswer(true)}>
              + Add Answer Manually
            </button>
          )}
          {showAddAnswer && (
            <div className="input-group mb-2">
              <input
                className="form-control"
                value={manualAnswer}
                onChange={e => setManualAnswer(e.target.value)}
                placeholder="Type answer word"
              />
              <button className="btn btn-success" type="button" onClick={handleAddManualAnswer}>Add</button>
              <button className="btn btn-outline-danger" type="button" onClick={() => setShowAddAnswer(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
      <hr />

      {/* ================== COMPREHENSION ================== */}
      <h4>3. Comprehension</h4>
      <div className="mb-3" style={{ border: "1px solid #e3e3e3", borderRadius: 8, padding: 16, background: "#fafbfd" }}>
        <div>
          <label className="form-label"><b>Passage/Paragraph</b></label>
          <textarea
            className="form-control mb-3"
            value={passage}
            onChange={e => setPassage(e.target.value)}
            rows={5}
            placeholder="Paste or type the passage here"
          />
        </div>
        <div>
          <b>MCQ Questions</b>
          {compQuestions.map((q, i) => (
            <div key={i} className="mb-3" style={{ border: "1px solid #eee", borderRadius: 6, padding: 12, background: "#fff" }}>
              <div className="d-flex justify-content-between align-items-center">
                <span><b>Q{i + 1}.</b></span>
                {compQuestions.length > 1 && (
                  <button className="btn btn-link text-danger" onClick={() => removeCompQuestion(i)}>Remove</button>
                )}
              </div>
              <input
                className="form-control mb-2"
                value={q.question}
                onChange={e => handleCompQuestionChange(i, "question", e.target.value)}
                placeholder="Type the question"
              />
              <div>
                {q.options.map((opt, j) => (
                  <div key={j} className="input-group mb-1">
                    <span className="input-group-text">
                      <input
                        type="radio"
                        name={`correct${i}`}
                        checked={q.correct === j}
                        onChange={() => handleCompCorrectChange(i, j)}
                      />
                    </span>
                    <input
                      className="form-control"
                      value={opt}
                      placeholder={`Option ${j + 1}${j > 1 ? " (Optional)" : ""}`}
                      onChange={e => handleCompOptionChange(i, j, e.target.value)}
                    />
                  </div>
                ))}
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => addCompOption(i)}
                >
                  + Add Option
                </button>
              </div>
            </div>
          ))}
          <button
            className="btn btn-link"
            type="button"
            onClick={addCompQuestion}
          >
            + Add MCQ
          </button>
        </div>
      </div>
      <hr />

      <button className="btn btn-primary" onClick={handlePreview}>
        Save
      </button>
    </div>
  );
}