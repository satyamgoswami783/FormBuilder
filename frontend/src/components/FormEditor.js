import React, { useState } from "react";
import FormPreview from "./FormPreview";
import { createForm } from "../api";
import { useHistory } from "react-router-dom";

export default function FormEditor() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [headerImg, setHeaderImg] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Categorize question states
  const [catText, setCatText] = useState("");
  const [catImg, setCatImg] = useState("");
  const [categories, setCategories] = useState([{ name: "" }]);
  const [items, setItems] = useState([{ text: "", category: "" }]);
  
  // Cloze question states
  const [sentence, setSentence] = useState("");
  const [blanks, setBlanks] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState({ word: "", index: null });
  
  // Comprehension states
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([
    { 
      question: "", 
      choices: ["", ""],
      answer: 0
    }
  ]);

  const [showCategoryVideo, setShowCategoryVideo] = useState(false);
  const history = useHistory();

  const uploadImage = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => callback(event.target.result);
    reader.readAsDataURL(file);
  };

  // Category functions
  const updateCategory = (idx, val) => {
    const updated = [...categories];
    updated[idx] = { ...updated[idx], name: val };
    setCategories(updated);
  };

  const addNewCategory = () => {
    setCategories([...categories, { name: "" }]);
  };

  const removeCategory = (idx) => {
    const newItems = items.map(item => {
      if (item.category === categories[idx].name) {
        return { ...item, category: "" };
      }
      return item;
    });
    setItems(newItems);
    setCategories(categories.filter((_, i) => i !== idx));
  };

  // Item functions
  function handleItemTextChange(idx, val) {
    const newItems = [...items];
    newItems[idx].text = val;
    setItems(newItems);
  }

  function handleItemCategory(idx, cat) {
    const updated = [...items];
    updated[idx].category = cat;
    setItems(updated);
  }

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Cloze functions
  const markBlank = () => {
    if (selected.word && selected.index !== null) {
      if (!blanks.includes(selected.index)) {
        setBlanks([...blanks, selected.index].sort((a, b) => a - b));
      }
      setAnswers([...answers, { 
        word: selected.word, 
        position: selected.index,
        id: `${selected.word}-${selected.index}-${Date.now()}`
      }]);
    }
    setSelected({ word: "", index: null });
  };

  const removeBlank = (id) => {
    const answerToRemove = answers.find(a => a.id === id);
    if (!answerToRemove) return;
    
    setBlanks(blanks.filter(pos => pos !== answerToRemove.position));
    setAnswers(answers.filter(a => a.id !== id));
  };

  const getGroupedAnswers = () => {
    const grouped = {};
    answers.forEach(answer => {
      if (!grouped[answer.word]) {
        grouped[answer.word] = [];
      }
      grouped[answer.word].push(answer);
    });
    return grouped;
  };

  const renderClozePreview = () => {
    if (!sentence) return <span className="text-muted">No sentence yet...</span>;
    
    return sentence.split(" ").map((word, i) => {
      if (blanks.includes(i)) {
        const answer = answers.find(a => a.position === i);
        return (
          <b key={i}>
            [<span className="text-primary">{answer?.word || '____'}</span>]
          </b>
        );
      }
      return <span key={i}> {word} </span>;
    });
  };

  // Comprehension functions
  const changeQuestion = (qIdx, field, val) => {
    setQuestions(
      questions.map((q, i) => 
        i === qIdx ? { ...q, [field]: val } : q
      )
    );
  };

  function addNewQuestion() {
    setQuestions([
      ...questions,
      { question: "", choices: ["", ""], answer: 0 }
    ]);
  }

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const removeOption = (qIdx, optIdx) => {
    const question = questions[qIdx];
    const newChoices = question.choices.filter((_, i) => i !== optIdx);
    let newAnswer = question.answer;
    
    if (optIdx === question.answer) {
      newAnswer = 0;
    } else if (optIdx < question.answer) {
      newAnswer = question.answer - 1;
    }
    
    changeQuestion(qIdx, "choices", newChoices);
    changeQuestion(qIdx, "answer", newAnswer);
  };

  const getFormData = () => ({
    title,
    description: desc,
    headerImage: headerImg,
    questions: [
      {
        type: "categorize",
        text: catText,
        image: catImg,
        categories: categories.map(c => c.name).filter(Boolean),
        items: items.filter(i => i.text.trim()).map(i => ({
          value: i.text,
          belongsTo: i.category
        }))
      },
      {
        type: "cloze",
        clozeSentence: sentence,
        clozeAnswers: answers.map(a => a.word),
        blankPositions: blanks
      },
      {
        type: "comprehension",
        passage,
        mcqs: questions
          .filter(q => q.question.trim() && q.choices.filter(c => c.trim()).length >= 2)
          .map(q => ({
            question: q.question,
            options: q.choices,
            answer: q.answer
          }))
      }
    ]
  });

  const showFormPreview = () => {
    if (!title.trim()) {
      alert("Please add a title first!");
      return;
    }
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <FormPreview
        data={getFormData()}
        onBack={() => setShowPreview(false)}
        onSubmit={async () => {
          try {
            await createForm(getFormData());
            history.push("/");
          } catch (err) {
            console.error("Save error:", err);
            alert("Oops! Couldn't save. Try again?");
          }
        }}
      />
    );
  }

  const groupedAnswers = getGroupedAnswers();

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Create New Form</h2>
      
      {/* Basic Info Section */}
      <div className="mb-4">
        <label className="form-label">Form Title*</label>
        <input
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Description</label>
        <textarea
          className="form-control mb-2"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
        />
      </div>

      {/* Header Image */}
      <div className="mb-4">
        <label className="form-label">Header Image (Optional)</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => uploadImage(e, setHeaderImg)}
        />
      </div>

      <hr />

      {/* Categorize Section */}
      <div className="mb-4">
        <h4>1. Categorization Question</h4>
        {!showCategoryVideo && (
          <button 
            className="btn btn-outline-info mb-3"
            onClick={() => setShowCategoryVideo(!showCategoryVideo)}
          >
            Know about Categorization question
          </button>
        )}
        {showCategoryVideo && (
          <>
            <button 
              onClick={() => setShowCategoryVideo(!showCategoryVideo)} 
              className="btn btn-sm btn-danger mb-2"
            >
              Close Video
            </button>
            <div className="ratio ratio-16x9 mb-3">
              <video controls style={{ borderRadius: 10, border: "1px solid #eee" }}>
                <source src="/media/demoCat.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </>
        )}
        
        <div className="mb-3">
          <label className="form-label">Question Text</label>
          <input
            className="form-control"
            value={catText}
            onChange={(e) => setCatText(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image (Optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => uploadImage(e, setCatImg)}
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Categories</label>
              {categories.map((cat, i) => (
                <div key={i} className="input-group mb-2">
                  <input
                    className="form-control"
                    value={cat.name}
                    onChange={(e) => updateCategory(i, e.target.value)}
                    placeholder={`Category ${i+1}`}
                  />
                  {categories.length > 1 && (
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeCategory(i)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button 
                className="btn btn-outline-primary"
                onClick={addNewCategory}
              >
                Add Category
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Items</label>
              {items.map((item, i) => (
                <div key={i} className="mb-2">
                  <div className="input-group">
                    <input
                      className="form-control"
                      value={item.text}
                      onChange={(e) => handleItemTextChange(i, e.target.value)}
                      placeholder={`Item ${i+1}`}
                    />
                    {items.length > 1 && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => removeItem(i)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <select
                    className="form-select mt-1"
                    value={item.category}
                    onChange={(e) => handleItemCategory(i, e.target.value)}
                  >
                    <option value="">Select category...</option>
                    {categories
                      .filter(c => c.name.trim())
                      .map((cat, j) => (
                        <option key={j} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              ))}
              <button 
                className="btn btn-outline-primary"
                onClick={() => setItems([...items, { text: "", category: "" }])}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Cloze Section */}
      <div className="mb-4">
        <h4>2. Fill-in-the-Blanks</h4>
        
        <div className="mb-3 p-3 bg-light rounded">
          <label className="form-label">Preview:</label>
          <div className="p-2">
            {renderClozePreview()}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Enter Sentence</label>
          <textarea
            className="form-control"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Select Words to Blank Out</label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {sentence.split(" ").filter(w => w.trim()).map((word, i) => (
              <button
                key={i}
                type="button"
                className={`btn btn-sm ${blanks.includes(i) ? "btn-secondary" : "btn-outline-primary"}`}
                onClick={() => setSelected({ word, index: i })}
              >
                {word}
              </button>
            ))}
          </div>

          {selected.word && (
            <div className="alert alert-info p-2 d-flex align-items-center">
              <span className="me-2">Mark "<b>{selected.word}</b>" as blank?</span>
              <button 
                className="btn btn-sm btn-success me-1"
                onClick={markBlank}
              >
                Yes
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelected({ word: "", index: null })}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Blank Answers</label>
          {answers.length > 0 ? (
            <div>
              {Object.entries(groupedAnswers).map(([word, wordAnswers]) => (
                <div key={word} className="mb-3 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{word}</strong>
                    <span className="badge bg-primary">
                      {wordAnswers.length} blank{wordAnswers.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="ms-3">
                    {wordAnswers.map(answer => (
                      <div key={answer.id} className="d-flex justify-content-between align-items-center mb-1">
                        <span>Position {answer.position + 1}</span>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeBlank(answer.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No blanks added yet</p>
          )}
        </div>
      </div>

      <hr />

      {/* Comprehension Section */}
      <div className="mb-4">
        <h4>3. Reading Comprehension</h4>
        
        <div className="mb-3">
          <label className="form-label">Reading Passage</label>
          <textarea
            className="form-control"
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            rows={5}
          />
        </div>

        <label className="form-label">Questions</label>
        {questions.map((q, i) => (
          <div key={i} className="mb-3 p-3 border rounded">
            <div className="d-flex justify-content-between mb-2">
              <h5>Question {i+1}</h5>
              {questions.length > 1 && (
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeQuestion(i)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Question Text</label>
              <input
                className="form-control"
                value={q.question}
                onChange={(e) => changeQuestion(i, "question", e.target.value)}
              />
            </div>

            <label className="form-label">Options</label>
            {q.choices.map((opt, j) => (
              <div key={j} className="input-group mb-2">
                <div className="input-group-text">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={q.answer === j}
                    onChange={() => changeQuestion(i, "answer", j)}
                  />
                </div>
                <input
                  className="form-control"
                  value={opt}
                  onChange={(e) => changeQuestion(i, "choices", 
                    q.choices.map((o, k) => k === j ? e.target.value : o)
                  )}
                />
                {q.choices.length > 2 && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => removeOption(i, j)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              className="btn btn-outline-secondary"
              onClick={() => changeQuestion(i, "choices", [...q.choices, ""])}
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          className="btn btn-outline-primary"
          onClick={addNewQuestion}
        >
          Add Question
        </button>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button 
          className="btn btn-primary px-4 py-2"
          onClick={showFormPreview}
        >
          Preview Form
        </button>
      </div>
    </div>
  );
}