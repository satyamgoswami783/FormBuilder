import React from "react";

export default function FormPreview({ data, onBack, onSubmit }) {
  const getGroupedClozeAnswers = () => {
    const grouped = {};
    const clozeQ = data.questions[1];
    if (!clozeQ) return grouped;
    
    clozeQ.blankPositions.forEach((pos, i) => {
      const word = clozeQ.clozeAnswers[i];
      if (!grouped[word]) {
        grouped[word] = [];
      }
      grouped[word].push(pos + 1);
    });
    return grouped;
  };

  const renderClozeSentence = () => {
    const clozeQ = data.questions[1];
    if (!clozeQ) return null;
    
    return clozeQ.clozeSentence.split(" ").map((word, i) => {
      if (clozeQ.blankPositions.includes(i)) {
        const answerIndex = clozeQ.blankPositions.indexOf(i);
        const answer = clozeQ.clozeAnswers[answerIndex];
        return (
          <b key={i}>
            [<span className="text-primary">{answer}</span>]
          </b>
        );
      }
      return <span key={i}> {word} </span>;
    });
  };

  const groupedClozeAnswers = getGroupedClozeAnswers();

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Form Preview</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          {data.headerImage && (
            <img 
              src={data.headerImage} 
              alt="Header" 
              className="img-fluid mb-3 rounded"
              style={{ maxHeight: "200px" }}
            />
          )}
          <h3>{data.title}</h3>
          <p className="text-muted">{data.description}</p>
        </div>
      </div>

      {/* Categorize Preview */}
      {data.questions[0] && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Categorization Question</h4>
            <p>{data.questions[0].text}</p>
            
            {data.questions[0].image && (
              <img 
                src={data.questions[0].image} 
                alt="Question" 
                className="img-fluid mb-3 rounded"
                style={{ maxHeight: "200px" }}
              />
            )}
            
            <table className="table table-bordered">
              <thead>
                <tr>
                  {data.questions[0].categories.map((cat, i) => (
                    <th key={i}>{cat}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {data.questions[0].categories.map((cat, i) => (
                    <td key={i}>
                      <ul className="list-unstyled">
                        {data.questions[0].items
                          .filter(item => item.belongsTo === cat)
                          .map((item, j) => (
                            <li key={j}>{item.value}</li>
                          ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cloze Preview */}
      {data.questions[1] && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Fill-in-the-Blanks</h4>
            <div className="p-3 bg-light rounded mb-3">
              {renderClozeSentence()}
            </div>
            <div>
              <h5>Blank Answers:</h5>
              {Object.entries(groupedClozeAnswers).length > 0 ? (
                <div className="mt-3">
                  {Object.entries(groupedClozeAnswers).map(([word, positions]) => (
                    <div key={word} className="mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>{word}</strong>
                        <span className="badge bg-primary">
                          {positions.length} blank{positions.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="ms-3">
                        {positions.map((pos, i) => (
                          <div key={i} className="mb-1">
                            Position {pos}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No blanks added</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehension Preview */}
      {data.questions[2] && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Reading Comprehension</h4>
            <div className="p-3 bg-light rounded mb-3">
              {data.questions[2].passage}
            </div>
            
            {data.questions[2].mcqs.map((mcq, i) => (
              <div key={i} className="mb-3 p-3 border rounded">
                <p><strong>{mcq.question}</strong></p>
                <ul className="list-unstyled">
                  {mcq.options.map((opt, j) => (
                    <li key={j} className={mcq.answer === j ? "text-success fw-bold" : ""}>
                      {opt} {mcq.answer === j && "✓"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button 
          className="btn btn-outline-secondary px-4 py-2"
          onClick={onBack}
        >
          Back to Editor
        </button>
        <button 
          className="btn btn-primary px-4 py-2"
          onClick={onSubmit}
        >
          Save Form
        </button>
      </div>
    </div>
  );
} 