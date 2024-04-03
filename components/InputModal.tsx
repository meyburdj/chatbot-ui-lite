import React, { useState } from 'react';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (gradeLevel: string, academicTopic: string) => void;
}

const gradeOptions = ["12th", "11th", "10th", "9th", "8th", "7th", "6th", "5th", "4th", "3rd", "2nd", "1st"];

function InputModal({ isOpen, onClose, onSubmit }: InputModalProps) {
    const [gradeLevel, setGradeLevel] = useState('');
    const [academicTopic, setAcademicTopic] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg space-y-4 max-w-lg mx-auto">
                <h2 className="text-center font-bold mb-4">Welcome to Concept Bot!</h2>
                <p>Please enter your grade level and academic topic. This information will help Concept Bot assist you.</p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="block w-full sm:min-w-[9rem] p-2 border border-gray-300 rounded mb-3 sm:mb-0 sm:flex-1"
                    >
                        <option value="" disabled>Select Grade</option>
                        {gradeOptions.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Academic Topic"
                        value={academicTopic}
                        onChange={(e) => setAcademicTopic(e.target.value)}
                        className="input w-full p-2 border border-gray-300 rounded mb-3 sm:flex-3"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={() => onSubmit(gradeLevel, academicTopic)}
                        className={`button ${!gradeLevel || !academicTopic ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!gradeLevel || !academicTopic}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InputModal;
