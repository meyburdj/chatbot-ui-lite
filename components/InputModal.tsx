import React, { useState } from 'react';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (gradeLevel: string, academicTopic: string) => void;
}

function InputModal({ isOpen, onClose, onSubmit }: InputModalProps) {
    const [gradeLevel, setGradeLevel] = useState('');
    const [academicTopic, setAcademicTopic] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded">
                <input
                    type="text"
                    placeholder="Grade Level"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="Academic Topic"
                    value={academicTopic}
                    onChange={(e) => setAcademicTopic(e.target.value)}
                    className="input"
                />
                <button onClick={() => onSubmit(gradeLevel, academicTopic)} className="button">
                    Submit
                </button>
            </div>
        </div>
    );
}

export default InputModal;
