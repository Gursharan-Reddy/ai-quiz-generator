import React from 'react';
import './QuizDisplay.css';

export default function QuizDisplay({ quizData }) {
    if (!quizData) {
        return null;
    }

    const { title, summary, key_entities, quiz, related_topics } = quizData;

    return (
        <div className="quiz-display-container">
            <h2 className="quiz-title">{title}</h2>
            
            <div className="quiz-section">
                <h3 className="quiz-section-title">Summary</h3>
                <p className="quiz-summary">{summary}</p>
            </div>

            {quiz && quiz.length > 0 && (
                <div className="quiz-section">
                    <h3 className="quiz-section-title">Quiz Questions</h3>
                    <div className="quiz-questions-list">
                        {quiz.map((item, index) => (
                            <div key={index} className="quiz-question-card">
                                <p className="question-text">{index + 1}. {item.question}</p>
                                <div className="question-options">
                                    {item.options.map((option, i) => (
                                        <div 
                                          key={i} 
                                          className={`option-item ${item.answer === option ? 'correct-answer' : ''}`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                                <div className="question-details">
                                    <p><strong>Difficulty:</strong> {item.difficulty}</p>
                                    <p className="question-explanation"><strong>Explanation:</strong> {item.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {key_entities && (
                <div className="quiz-section">
                    <h3 className="quiz-section-title">Key Entities</h3>
                    <div className="key-entities-grid">
                        {Object.entries(key_entities).map(([type, entities]) => (
                            <div key={type} className="entity-card">
                                <h4 className="entity-type">{type}</h4>
                                <ul className="entity-list">
                                    {entities.map((entity, i) => <li key={i}>{entity}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {related_topics && related_topics.length > 0 && (
                <div className="quiz-section">
                    <h3 className="quiz-section-title">Related Topics</h3>
                    <div className="related-topics-list">
                        {related_topics.map((topic, index) => (
                            <span key={index} className="topic-badge">
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}