const $form = document.querySelector("form.questionForm");
const $evaluateform = document.querySelector("form.evaluateForm");
const $workfieldInput = document.querySelector("#workfieldInput");
const $interviewTypeInput = document.querySelector("#interviewTypeInput");
const $questionNoInput = document.querySelector("#questionNoInput");
const $introInput = document.querySelector("#introInput");
const $companyInput = document.querySelector("#companyInput");
const $questionAnswer = document.querySelector(".qResponse");
const $evaluateAnswer = document.querySelector(".eResponse");
const $allResetBtn = document.querySelector(".allReset");

let workfield, interviewTypeInput, introInput, questionNoInput, companyInput;

// openAI API
let url = `https://open-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// 질문과 답변 저장
let data = [
    {
        "role": "system",
        "content": "assistant는 면접자에게 질문을 할 면접관입니다. 적합한 질문을 만들어 주세요."
    },
    {
        "role": "user",
        "content": "질문자는 면접자입니다."
    }
]

const getInputData = (evaluate_flag) => {
    workfield = $workfieldInput.value || '';
    interviewTypeInput = $interviewTypeInput.querySelector('option:checked').innerText || '';
    introInput = $introInput.value || '';
    companyInput = $companyInput.value || '';
    questionNoInput = $questionNoInput.value || '';

    if (interviewTypeInput == '기술 면접') {
        interviewTypeInput = '실제 필드에서 사용하는 기술';
    } else {
        interviewTypeInput = '업무할 때 필요한 마음가짐 및 태도와 경험';
    }



    // 면접 질문 - 답변 평가지
    if (evaluate_flag == true) {

      const questionRows = document.querySelectorAll('.qResponse .question-row');
      const qna = [];

      questionRows.forEach(row => {
        const questionText = row.querySelector('.question').textContent.trim();
        const answerText = row.querySelector('.answer textarea').value;
        
        qna.push({
            question: questionText,
            answer: answerText
        });
      });

      const qnaSentence = qna.map(pair => {
        return `면접 질문 "${pair.question}"에 대한 면접자의 답변은 "${pair.answer}"입니다.`;
      });

      const totalQnaSentence = qnaSentence.join(' ');
      console.log(totalQnaSentence);

      question = `채용 지원 면접자의 지원 분야는 ${workfield}입니다. 지원분야의 회사 정보는 다음과 같습니다. ${companyInput} 채용 지원 면접자에 대한 소개는 다음과 같습니다. ${introInput} 다음은 이 정보들을 바탕으로 ${workfield}에 대하여 ${interviewTypeInput} ${questionNoInput}개의 면접 질문을 던졌고 이에 대한 면접자의 답변입니다. ${totalQnaSentence} 이를 바탕으로 면접 답변에 대한 총 평가를 5문장 이하로 내려주세요. 좋은 점과 고쳐야 할 점을 모두 알려주세요.`
      console.log(question);

    } else {  // 면접 질문 생성지
      question = `채용 지원 면접자의 지원 분야는 ${workfield}입니다. 지원분야의 회사 정보는 다음과 같습니다. ${companyInput} 채용 지원 면접자에 대한 소개는 다음과 같습니다. ${introInput} 이 정보들을 바탕으로 ${workfield}에 대하여 ${interviewTypeInput} ${questionNoInput}개의 면접 질문을 json 데이터 형식으로 만들어 주세요. json 데이터의 형태는 각 질문 당 {'asking: '질문'} 입니다. 결과값에 backtick이나 json이라는 string이 포함되지 않게 해주세요.`
      console.log(question); 
    }
    
}

// 모든 form 및 초기화
const formInit = (evaluate_flag) => {
  // 전송 데이터 초기화
  data = [
    {
        "role": "system",
        "content": "assistant는 면접자에게 질문을 할 면접관입니다. 적합한 질문을 만들어 주세요."
    },
    {
        "role": "user",
        "content": "질문자는 면접자입니다."
    }
  ]

  // 평가지 삭제
  if($evaluateAnswer.hasChildNodes) {
    $evaluateAnswer.replaceChildren();
  }

  // 평가지 안 보임 처리
  $evaluateAnswer.parentElement.classList.remove('active');

  if (evaluate_flag != true) {
    // 질문지 삭제
    if($questionAnswer.hasChildNodes) {
      $questionAnswer.replaceChildren();
    }
    
    // 질문지 안 보임 처리
    $questionAnswer.parentElement.classList.remove('active');
  }

}

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 면접 질문 그려주는 함수(for 면접 질문 생성)
const printAnswer = async (answer) => {
    if (!$questionAnswer.parentElement.classList.contains("active")) {
        $questionAnswer.parentElement.classList.add("active");
    }

    let finalData = convertoJson(answer);
    console.log(finalData);
    console.log(typeof(finalData));

    finalData.forEach(questionItem => {
        console.log("질문입니다.")
        const questionRowDiv = document.createElement('div');
        questionRowDiv.className = 'question-row';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.textContent = questionItem.asking;

        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';

        const answerInput = document.createElement('textarea');
        answerInput.placeholder = '면접 질문에 대한 답변을 입력하세요'; 

        answerDiv.appendChild(answerInput);

        questionRowDiv.appendChild(questionDiv);
        questionRowDiv.appendChild(answerDiv);

        $questionAnswer.appendChild(questionRowDiv);
    });
};

// 받은 답변을 json 형태로 변환하는 함수
const convertoJson = (answer) => {

    const cleanAnswer = answer.replace(/'/g, '"').trim();

    let jsonData;
    try {
        jsonData = JSON.parse(cleanAnswer);
        console.log('Json 파싱 성공:', jsonData);
    } catch (error) {
        console.error('Json 파싱 에러:', error);
    }
    return jsonData;
}


// 화면에 면접 평가 그려주는 함수(for 면접 평가 생성)
const printEvaluateAnswer = async (answer) => {
  if (!$evaluateAnswer.parentElement.classList.contains("active")) {
      $evaluateAnswer.parentElement.classList.add("active");
  }

  const evaluateDiv = document.createElement('p');
  evaluateDiv.className = 'evaluate-row';
  evaluateDiv.innerHTML = answer;

  $evaluateAnswer.appendChild(evaluateDiv);
};

// api 요청보내는 함수
const apiPost = async (evaluate_flag) => {
  const result = await axios({
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  });
  try {
    console.log(result.data);
    console.log(result.data.choices[0].message.content);
    if (evaluate_flag == true) {
      printEvaluateAnswer(result.data.choices[0].message.content);
    } else {
      printAnswer(result.data.choices[0].message.content);
    }
    
  } catch (err) {
    console.log(err);
  }
};

// 면접 질문 생성 submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  formInit(false);

  getInputData(false);
  sendQuestion(question);
  apiPost(false);
});

// 면접 평가지 생성 submit
$evaluateform.addEventListener("submit", (e) => {
  e.preventDefault();
  formInit(true);

  getInputData(true);
  sendQuestion(question);
  apiPost(true);
});

// 완전히 다시 하기
$allResetBtn.addEventListener("click", (e) => {
  formInit(false);

  $form.reset()
});
