import React, { useState } from 'react';
import * as api from '../services/api';
import QuizDisplay from '../components/QuizDisplay';
import './GenerateQuizTab.css';

export default function GenerateQuizTab() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizResult, setQuizResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setQuizResult(null);

        try {
            const result = await api.generateQuiz(url);
            setQuizResult(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tab-container">
            <h2>Generate New Quiz</h2>
            <form onSubmit={handleSubmit} className="generate-form">
                <div className="form-group">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter Wikipedia URL..."
                        required
                        className="url-input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Generating quiz, please wait...</span>
                </div>
            )}

            {error && (
                <div className="error-message" role="alert">
                    <strong>Error: </strong>
                    <span>{error}</span>
                </div>
            )}

            {quizResult && (
                <div className="quiz-result-container">
                    <QuizDisplay quizData={quizResult} />
                </div>
            )}
        </div>
    );
}