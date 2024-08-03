const $form = document.querySelector("form.questionForm");
const $evaluateform = document.querySelector("form.evaluateForm");
const $workfieldInput = document.querySelector("#workfieldInput");
const $interviewTypeInput = document.querySelector("#interviewTypeInput");
const $questionNoInput = document.querySelector("#questionNoInput");
const $introInput = document.querySelector("#introInput");
const $companyInput = document.querySelector("#companyInput");
const $chatList = document.querySelector(".response");

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

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

let quesionandanswer = [];

// input에 입력된 질문 받아오는 함수
// $input.addEventListener("input", (e) => {
//   question = e.target.value;
// });
const getInputData = (evaulate) => {
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

    question = `채용 지원 면접자의 지원 분야는 ${workfield}입니다. 지원분야의 회사 정보는 다음과 같습니다. ${companyInput} 채용 지원 면접자에 대한 소개는 다음과 같습니다. ${introInput} 이 정보들을 바탕으로 ${workfield}에 대하여 ${interviewTypeInput} ${questionNoInput}개의 면접 질문을 json 데이터 형식으로 만들어 주세요. json 데이터의 형태는 각 질문 당 {'asking: '질문'} 입니다. 결과값에 backtick이나 json이라는 string이 포함되지 않게 해주세요.`
    console.log(question);
}

const clearInput = () => {
    $form.reset();
    $chatList.classList.remove("active");
}


// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
    questionData.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 질문 그려주는 함수
const printQuestion = async () => {
  if (question) {
    
    let li = document.createElement("li");
    li.classList.add("question");
    questionData.map((el) => {
      li.innerText = el.content;
    });
    $chatList.appendChild(li);
    questionData = [];
    question = false;
  }
};

// 화면에 답변 그려주는 함수
const printAnswer = async (answer) => {
    if (!$chatList.parentElement.classList.contains("active")) {
        $chatList.parentElement.classList.add("active");
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

        const answerInput = document.createElement('input');
        answerInput.type = 'textarea';
        answerInput.placeholder = '답변을 입력하세요'; 

        answerDiv.appendChild(answerInput);

        questionRowDiv.appendChild(questionDiv);
        questionRowDiv.appendChild(answerDiv);

        $chatList.appendChild(questionRowDiv);
    });

    // let li = document.createElement("li");
    // li.classList.add("answer");
    // li.innerText = answer;
    // $chatList.appendChild(li);
    
    clearInput();
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

// api 요청보내는 함수
const apiPost = async () => {
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
    printAnswer(result.data.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
};

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();

  getInputData();
//   $input.value = null;
  sendQuestion(question);
  apiPost();
});

/*
$evaluateform.addEventListener("submit", (e) => {
    e.preventDefault();
  
    getInputData();
  //   $input.value = null;
    sendQuestion(question);
    apiPost();
  });
*/