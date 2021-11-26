const path = require('path');
const express = require('express');
const quiz = require('./questions.json');

const app = express();
const port = 80;

app.use(express.static("./client/build"));
app.use(express.json());

// LOAD PAGE


// QUIZ
app.get('/quiz', (req, res) => {
    let questions = quiz.map(
        q => 
            ({
                stem: q.stem,
                options: [...q.options]
            })
        )
    res.send(JSON.stringify(questions));
})

app.post('/quiz/answer', (req, res) => {
    let q = req.body.question;
    let a = req.body.answer;
    if (quiz[q].answerIndex == a) res.send(true);
    else res.send(JSON.stringify(false));
})

app.post('/quiz/submit', (req, res) => {
    let answers = req.body.answers;
    let count = 0;
    for (let i = 0; i < quiz.length; i++) {
        try {
            let a = quiz[i].answerIndex;
            if (answers[i] == a) count++;
        } catch {
            break;
        }
    }
    res.send(JSON.stringify(count));
})

app.listen(port, () => console.log("Server listening at port " + port));