import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDetails.css'; // Import CSS file for styling

import { faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';

const StudentDetails = () => {
    const [regNo, setRegNo] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [error, setError] = useState('');
    const [cgpa, setCGPA] = useState(0);
    const [studentName, setStudentName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(() => {
        // Calculate CGPA whenever student data changes
        calculateCGPA();
    }, [studentData]);

    const handleChange = (e) => {
        setRegNo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://cutm-result-backend.onrender.com/api/students/${regNo}`);
            setStudentData(response.data); // Update studentData state with response data
            setStudentName(response.data[0]?.Name || '');
            setRegistrationNumber(response.data[0]?.Reg_No || '');
            setError('');
        } catch (error) {
            setStudentData([]);
            setError('Student not found or an error occurred');
        }
    };

    const calculateCGPA = () => {
        if (studentData.length === 0) {
            setCGPA(0);
            return;
        }

        let totalGradePoints = 0;
        let totalCredits = 0;

        studentData.forEach((student) => {
            // Calculate grade points for each subject
            let gradePoint = 0;
            switch (student.Grade) {
                case 'O':
                    gradePoint = 10;
                    break;
                case 'E':
                    gradePoint = 9;
                    break;
                case 'A':
                    gradePoint = 8;
                    break;
                case 'B':
                    gradePoint = 7;
                    break;
                case 'C':
                    gradePoint = 6;
                    break;
                case 'D':
                    gradePoint = 5;
                    break;
                default:
                    gradePoint = 0;
            }

            // Add grade points multiplied by credits to the total
            totalGradePoints += gradePoint * parseFloat(student.Credits);
            totalCredits += parseFloat(student.Credits);
        });

        // Calculate CGPA
        const cgpa = totalGradePoints / totalCredits;
        setCGPA(cgpa);

        // Show congratulatory message if CGPA > 8
        if (cgpa > 8) {
            setShowCongrats(true);
            // Hide the message after 5 seconds
            setTimeout(() => {
                setShowCongrats(false);
            }, 5000);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
        <div className="student-details-container">
            <h1 className="title">Student Report Card</h1>
            <form onSubmit={handleSubmit} className="search-form">
                <label>
                    
                    <input type="text" value={regNo} onChange={handleChange} className="input-field" placeholder='Enter Registration Number:' />
                </label>
                <button type="submit" className="submit-button">Search</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {studentName && (
                <div className="student-info">
                    <p><strong>Name:</strong> {studentName}</p>
                    <p><strong>Registration Number:</strong> {registrationNumber}</p>
                </div>
            )}
            {showCongrats && (
                <div className="congrats-message">
                   🎉 Congratulations 🎉{studentName} for achieving a CGPA of {cgpa.toFixed(2)}!
                    
                </div>
                
            )}
            {studentData.length > 0 && (
                <div>
                    <button className="print-button" onClick={handlePrint}>Print</button>
                    <h2 className="details-title">Student Details</h2>
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                {/* <th>Reg No</th>
                                <th>Name</th> */}
                                <th>Subject Name</th>
                                <th>Subject Code</th>
                                
                                <th>Type</th>
                                <th>Credits</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student, index) => (
                                <tr key={index}>
                                    <td>{student["Sl No"]}</td>
                                    {/* <td>{student.Reg_No}</td>
                                    <td>{student.Name}</td> */}
                                    <td>{student.Subject_Name}</td>
                                    <td>{student.Subject_Code}</td>
                                    
                                    <td>{student.Type}</td>
                                    <td>{student.Credits}</td>
                                    <td>{student.Grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="cgpa">CGPA: {cgpa.toFixed(2)}</p>
                    
                    
                </div>
            )}
            
            
        </div>
        <div id='footer'>
               <p> Designed & Developed by Madhav Sameer</p>
               <p> Copyright @2024 | All Rights Reserved</p>
               <ul className="footer__links">
          <li className="footer__link-item">
            <a href="https://www.instagram.com/aditya.exeeeee" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="footer__icon" />
            </a>
          </li>
          <li className="footer__link-item">
            <a href="https://www.linkedin.com/in/madhavsameer" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className="footer__icon" />
            </a>
          </li>
          <li className="footer__link-item">
            <a href="https://github.com/madhavsameer" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} className="footer__icon" />
            </a>
          </li>
          {/* Add more social media links as needed */}
        </ul>
        
               
            </div>
        
        </div>
    );
};

export default StudentDetails;
