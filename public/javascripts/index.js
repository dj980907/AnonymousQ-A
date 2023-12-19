document.addEventListener('DOMContentLoaded', () => {

  // Fetch existing questions on page load
  fetchQuestions();

  // =======================================================================
  // Open the question modal
  const showModalButton = document.getElementById('btn-show-modal-question');
  const questionModal = document.getElementById('modal-question');
  
  showModalButton.addEventListener('click', () => {
    questionModal.showModal();
  });
  // =======================================================================
  // close the question modal
  const closeQuestionModalButton = document.querySelector('#modal-question .modal-content .close');
  closeQuestionModalButton.addEventListener('click', () => {
    console.log('clicked');
    questionModal.close();
  });
  // =======================================================================
  // Handle form submission for adding a new question
  const questionSubmitButton = document.querySelector('.modal-content .submit');
  questionSubmitButton.addEventListener('click', handleQuestionFormSubmit);
  // =======================================================================
  // Function to handle form submission for adding a new question
  async function handleQuestionFormSubmit(event) {
    event.preventDefault();

    const questionInput = document.getElementById('question-text');
    const questionText = questionInput.value;

    try {
      // Submit the new question to the server
      const response = await fetch('/questions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionText }),
      });

      const newQuestion = await response.json();

      // Check for errors in the response for debugging purpose
      if (newQuestion.error) {
        console.error('Error submitting question:', newQuestion.error);
      } else {
        // Add the new question to the DOM
        const mainElement = document.querySelector('main');
        const questionElement = createQuestionElement(newQuestion);
        mainElement.appendChild(questionElement);

        const answerButton = document.createElement('input');
        answerButton.type = 'button';
        answerButton.id = 'btn-show-modal-answer';
        answerButton.value = 'Add an Answer';
        answerButton.setAttribute('data-question-id', newQuestion._id);
        questionElement.appendChild(answerButton);

        // when the answer button is clicked
        answerButton.addEventListener('click', () => {
          const answerModal = document.getElementById('modal-answer');
          const answerText = document.getElementById('answer-text');
          answerText.value = '';
          const questionIdInput = document.getElementById('question-id');
          questionIdInput.value = newQuestion._id;
          answerModal.showModal();
        });

        // Close the modal and clear the input field
        const questionModal = document.getElementById('modal-question');
        questionModal.close();
        questionInput.value = '';
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  }
  // =======================================================================
  // Function to create question elements
  function createQuestionElement(question) {
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.setAttribute('data-id', question._id);

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = question.question;

    const answerList = document.createElement('ul');
    question.answers.forEach((answer) => {
      const answerItem = document.createElement('li');
      answerItem.textContent = answer;
      answerList.appendChild(answerItem);
    });

    questionElement.appendChild(questionTitle);
    questionElement.appendChild(answerList);

    return questionElement;
  }
  // =======================================================================
  // close button for answer modal
  const closeAnswerModalButton = document.querySelector('#modal-answer .modal-content .close');
  closeAnswerModalButton.addEventListener('click', () => {
    const answerModal = document.getElementById('modal-answer');
    answerModal.close();
  });
  // =======================================================================
  // submit button for answer modal
  const answerSubmitButton = document.querySelector('#modal-answer .modal-content .submit');
  answerSubmitButton.addEventListener('click', () => {
    const answerText = document.getElementById('answer-text').value;
    const questionId = document.getElementById('question-id').value;
    handleAnswerFormSubmit(questionId, answerText);
  });
  // =======================================================================
  // function for handling answer submission
  async function handleAnswerFormSubmit(questionId, answer) {
    try {
      // Submit the new answer to the server
      const response = await fetch(`/questions/${questionId}/answers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });
  
      // console.log(response);
  
      const result = await response.json();
  
      // Update the DOM with the new answer
      const questionElement = document.querySelector(`.question[data-id="${questionId}"]`);
      
      if (!questionElement) {
        console.error(`Question element with ID ${questionId} not found.`);
        return;
      }
  
      const answerList = questionElement.querySelector('ul');
  
      if (!answerList) {
        console.error('Answer list not found in the question element.');
        return;
      }
  
      const answerItem = document.createElement('li');
      answerItem.textContent = answer;
      answerList.appendChild(answerItem);
  
      // Close the modal and clear the input field
      const answerModal = document.getElementById('modal-answer');
      answerModal.close();
      const answerText = document.getElementById('answer-text');
      answerText.value = '';
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }

  // Function to fetch questions from the server
  async function fetchQuestions() {
    try {
      const response = await fetch('/questions/');
      const questions = await response.json();

      // Display the fetched questions
      const mainElement = document.querySelector('main');
      questions.forEach((question) => {
        const questionElement = createQuestionElement(question);
        mainElement.appendChild(questionElement);

        const answerButton = document.createElement('input');
        answerButton.type = 'button';
        answerButton.id = 'btn-show-modal-answer';
        answerButton.value = 'Add an Answer';
        answerButton.setAttribute('data-question-id', question._id);
        questionElement.appendChild(answerButton);

        // Handle the click event for the answer button
        answerButton.addEventListener('click', () => {
          const answerModal = document.getElementById('modal-answer');
          const answerText = document.getElementById('answer-text');
          answerText.value = '';
          const questionIdInput = document.getElementById('question-id');
          questionIdInput.value = question._id;
          answerModal.showModal();
        });
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }
  
});
