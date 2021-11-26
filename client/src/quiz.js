import React, { useEffect, useState } from 'react';
import './index.css';

export const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [reset, setReset] = useState(false);

    useEffect(() => {
        let getQuiz = new XMLHttpRequest();
        getQuiz.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let out = JSON.parse(this.responseText);
                setQuestions(out);
                let emptyArr = out.map(o => ({answer:null, result:null}));
                setAnswers(emptyArr);
            }
        };
        getQuiz.open('GET', '/quiz', true);
        getQuiz.send();
    }, [,reset]);

    const changeAnswer = (index, answer) => {
        let getFeedback = new XMLHttpRequest();
        let feedback = null;
        getFeedback.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                feedback = JSON.parse(this.responseText);
                console.log(feedback);

                let out = [...answers];
                out[index] = {answer:answer, result:feedback};
                setAnswers(out);
            }
        }
        getFeedback.open('POST', 'quiz/answer', true);
        getFeedback.setRequestHeader('Content-type', 'application/json');
        let packet = {};
        packet.answer = Number(answer);
        packet.question = Number(index);
        getFeedback.send(JSON.stringify(packet));
    }

    const displayFeedback = (index) => {
        if (answers.length==0) return false;
        return (answers[index].result != null);
    }

    const resetSelection = (index) => {
        let ele = document.getElementsByName("option-"+index);
        for(let i=0;i<ele.length;i++)
            ele[i].checked = false;
        let out = [...answers];
        out[index] = {answer:null, result:null};
        setAnswers(out);
    }

    const submitQuiz = () => {
        let submit = new XMLHttpRequest();
        submit.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let newScore = JSON.parse(this.responseText);
                setScore(newScore);
            }
        }
        submit.open('POST', 'quiz/submit', true);
        submit.setRequestHeader('Content-type', 'application/json');
        let indexes = {};
        indexes.answers = [...answers.map(x=>x.answer)];
        console.log(indexes);
        submit.send(JSON.stringify(indexes));
    }

    const resetQuiz = () => {
        setScore(null);
        for (let i = 0; i < answers.length; i++) 
            resetSelection(i);

        setReset(!reset);
    }

    return (
        <div>
            <h1>SE3316 Quiz</h1>
            {score!=null && 
                <h3>Score: {score}/{answers.length}</h3>
            }
            {
                questions.map((q,i) => 
                    <div key={"question"+i}>
                        <div>
                        <label key={"label"+i}>{q.stem}</label>
                        {q.options.map((o,k) => 
                            <React.Fragment key={"fragment"+i+"-"+k}>
                            <br/>
                            <input type="radio" value={k} name={"option-"+i} id={"option-"+i+"-"+k} onChange={() => changeAnswer(i, k)}></input>
                            <label id={"label-"+i+"-"+k} htmlFor={"option-"+i+"-"+k}>{o}</label> 
                            </React.Fragment>
                        )}
                        </div>
                        {displayFeedback(i) && 
                            <div>
                            <br/>
                            <label>{answers[i].result?"Correct":"Incorrect"}</label>
                            <span className="resetlink" onClick={() => resetSelection(i)}> Reset</span>
                            </div>
                        }
                        <br/>
                    </div>   
                )
            }
            <button onClick={submitQuiz}>Submit</button>
            <button onClick={resetQuiz}>RESET</button>
        </div>
    );
}
