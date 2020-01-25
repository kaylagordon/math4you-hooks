import React, { useState } from 'react';
import './MathCard.scss';
import { problemSets } from '../../problemSets';
import { connect } from 'react-redux';
import { getAnswer } from '../../apiCalls/apiCalls';
import { increaseCorrect, increaseIncorrect } from '../../actions';

export const MathCard = ({ currentProblemSet, increaseCorrect, increaseIncorrect }) => {
  const [ expression, setExpression ] = useState(problemSets[currentProblemSet]());
  const [ answer, setAnswer ] = useState('');
  const [ evaluatedTo, setEvaluatedTo ] = useState('waiting');


  const updateAnswer = event => {
    let answer = event.target.value
    setAnswer(() => answer)
  };

  const checkAnswer = () => {
    getAnswer(currentProblemSet, expression)
    .then(data => {
      if(data.result.split(' ').join('') === answer) {
        increaseCorrect();
        setEvaluatedTo(() => 'correct')
        setTimeout(getNewCard, 2500)
      } else {
        increaseIncorrect();
        setEvaluatedTo(() => 'incorrect')
      }
    })
  }

  const getNewCard = () => {
    setExpression(() => problemSets[currentProblemSet]());
    setAnswer(() => '');
    setEvaluatedTo(() => 'waiting');
  }

  return (
    <div className={`mathCard ${evaluatedTo}`}>
      <p className='expression-text'>{expression}</p>
      <input
        type='text'
        value={answer}
        onChange={(event) => updateAnswer(event)}
      />
      <button
        onClick={checkAnswer}
      >CHECK</button>
    </div>
  );
};

export const mapStateToProps = state => ({
  currentProblemSet: state.currentProblemSet
})

export const mapDispatchToProps = dispatch => ({
  increaseCorrect: () => dispatch(increaseCorrect()),
  increaseIncorrect: () => dispatch(increaseIncorrect())
})

export default connect(mapStateToProps, mapDispatchToProps)(MathCard);
