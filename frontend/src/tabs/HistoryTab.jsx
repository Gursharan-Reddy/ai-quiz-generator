import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Modal from '../components/Modal';
import QuizDisplay from '../components/QuizDisplay';
import './HistoryTab.css';

export default function HistoryTab() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getHistory();
            setHistory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDetailsClick = async (id) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setModalData(null);
        try {
            const data = await api.getQuizById(id);
            setModalData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    return (
        <div className="tab-container">
            <div className="history-header">
                <h2>Quiz History</h2>
                <button
                    onClick={fetchHistory}
                    disabled={isLoading}
                    className="refresh-button"
                >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div className="error-message" role="alert">
                    <strong>Error: </strong>
                    <span>{error}</span>
                </div>
            )}

            {isLoading && !history.length ? (
                <p>Loading history...</p>
            ) : (
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>URL</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            {item.url}
                                        </a>
                                    </td>
                                    <td>
                                        {new Date(item.date_generated).toLocaleString()}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDetailsClick(item.id)}
                                            className="details-button"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {modalLoading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <span className="loading-text">Loading details...</span>
                    </div>
                )}
                {modalData && (
                    <QuizDisplay quizData={modalData} />
                )}
            </Modal>
        </div>
    );
}