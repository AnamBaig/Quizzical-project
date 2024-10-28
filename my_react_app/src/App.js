import './App.css';
import React from 'react';
import {nanoid} from 'nanoid';
import Answer from './Answer.js';
import Question from './Question.js';

function App() {
  const [questionData, setQuestionData] = React.useState()
  const [started, setStarted] = React.useState(false)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [isChecked, setIsChecked] = React.useState(false)
  const [qCount, setQCount] = React.useState(0)
  const [mode, setMode] = React.useState("")

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

  React.useEffect(() => {
    async function getQuestion() {
      const res = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${mode}`)
      const data = await res.json()

      const question_array = []
      data.results.forEach(question => {

        const shuffledAnswers = shuffle([...question.incorrect_answers, question.correct_answer])

        const answersWithIds = shuffledAnswers.map(x => ({
          text: x,
          isSelected: false,
          id: nanoid()
        }))

        question_array.push(
          { 
            id: nanoid(),
            question: question.question,
            correct: question.correct_answer,
            answers: answersWithIds
          })
      })
      setQuestionData(question_array)
  } 
  getQuestion()
    }, [qCount])

  console.log(questionData)

  const answerElements = questionData ? questionData.map(q => (
    <div className="container"key={q.id}>
      
      <p><Question question={q.question}/></p>
      <ul>
        {q.answers.map((answer, index) => (
          <Answer 
            key={answer.id}
            isSelected={answer.isSelected}
            answerId={answer.id}
            questionId={q.id} // Correctly passing the question ID - check why the before didnt work. GPT has full explanation.
            handleClick={handleClick}
            answer={answer.text}
            isCorrect={answer.text === q.correct}
            selected={answer.isSelected}
            //backgroundColor={answer.backgroundColor} 
            isChecked={isChecked}
            notCorrect={answer.text !== q.correct}
            />
        ))}
      </ul>
      </div>
    
  )) : null;
  

  function startGame() {
    setStarted(prevStart => !prevStart)
  }

  function handleClick(answerId, questionId) {
    setQuestionData(prevQuestionData => {
      return prevQuestionData.map((question) => {
        if (question && question.id === questionId) {
        return {
          ...question,
          answers: question.answers.map(answer => {
            return answer && answer.id === answerId ? 
            {...answer, isSelected: !answer.isSelected} : 
            {...answer, isSelected: false} //ensures only one answer can be selected.
          })}
        } else {
          return question
        }
      })
    })
  }
  
  function handleCheck() {
    setIsChecked(true);

    setQuestionData(prevQuestionData => {
      
      let correctCount = 0 
      const updatedQuestions = prevQuestionData.map(question => {
        const updatedAnswers = question.answers.map(answer => {
          
         //const notCorrect = answer.text !== question.correct
          const isCorrect = answer.text === question.correct;
          if (answer.isSelected && isCorrect) {
            correctCount +=1
          }
          return {
            ...answer, 
            //backgroundColor: answer.isSelected && isCorrect ? 'green' 
            //: answer.isSelected && notCorrect ? 'red' 
            ///: isCorrect ? 'black'
            //: 'transparent'
           
          }
        })
        return {
          ...question, 
          answers: updatedAnswers
        }
      })
      setCorrectCount(correctCount)
      return updatedQuestions
    })
  }

  function playAgain() {
    setQCount(prevQCount => prevQCount + 1)
    setStarted(false)
    setIsChecked(false) 
    setCorrectCount(0)
    setMode("")
  }
  
  function handleEasy() {
  setMode("easy") 
  }

  function handleMedium() {
    setMode("medium") 
    }

  function handleHard() {
      setMode("hard") 
      }
 

return (
  <main>

    {!started ? 
      <div className="parent--start"> 
      <div className="components--start">
      <h2 className="title">Quizzical</h2>
      <p className="info">Select difficulty</p>

      <div className="buttons--container">
        <div className="modes--container">
      <button className="easy" onClick={handleEasy}>Easy</button>
      <button className="medium" onClick={handleMedium}>Medium</button>
      <button className="hard" onClick={handleHard}>Hard</button>
      </div>
      {mode && <button className="start--game" onClick={startGame}>Start quiz</button>}
        </div>
        </div> 
        </div> : 

      <div>
    {answerElements}

    <p>Total correct: {correctCount}/ 10 </p>
    <button onClick={handleCheck}>Check</button>
    </div>}

    {isChecked && <button onClick={playAgain}>Play again?</button>}
  </main>
)
};

export default App;


//const answerElements = questionData ? questionData.map(q => {
  //return <p key={q.answers.id}>
    //<Question question={q.question}/>
    //<Answer isSelected={q.answers[0].isSelected} 
      //      answerId={q.answers[0].id} 
        //    questionId={q[0].id} 
          //  handleClick={handleClick} 
            //answer={q.answers[0].text}/>

    //<Answer isSelected={q.answers[1].isSelected} 
    //        answerId={q.answers[1].id} 
     //       questionId={q[1].id} 
       //     handleClick={handleClick} 
         //   answer={q.answers[1].text}/>
   // {q.answers[2] && <Answer 
    // isSelected={q.answers[2].isSelected} 
    // answerId={q.answers[2].id} 
    // questionId={q[2].id}  
    // handleClick={handleClick} 
    // answer={q.answers[2].text}/>}
    // {q.answers[3] && <Answer 
    // isSelected={q.answers[3].isSelected} 
    // answerId={q.answers[3].id} 
    // questionId={q[3].id} 
    // handleClick={handleClick} 
    //answer={q.answers[3].text}/>}
  // </p>
//}) : null

//function handleCheck() {
  //setQuestionData(prevQuestionData => {
    //return prevQuestionData.map(question => {
      //question.answers.map(answer => {
        //if (answer.isSelected && answer.text === question.correct) {
          //setCorrectCount(prevCorrectCount => prevCorrectCount + 0.5)
        //}
        //return answer;
      //})
    //return {...question}
    //})
  ///})
//}