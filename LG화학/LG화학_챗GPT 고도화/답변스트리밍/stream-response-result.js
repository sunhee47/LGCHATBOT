/**
 * This code demonstrates how to use the OpenAI API to generate chat completions.
 * The generated completions are received as a stream of data from the API and the
 * code includes functionality to handle errors and abort requests using an AbortController.
 * The API_KEY variable needs to be updated with the appropriate value from OpenAI for successful API communication.
 */

const API_URL = "https://ussc-coo-gpt-prd-oai1.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2023-03-15-preview"; //"https://api.openai.com/v1/chat/completions";
const API_KEY = "7f07d1322e56418e899979908f609db8";

const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const stopBtn = document.getElementById("stopBtn");
const resultText = document.getElementById("resultText");

let controller = null; // Store the AbortController instance

const generate = async () => {
  // Alert the user if no prompt value
  if (!promptInput.value) {
    alert("Please enter a prompt.");
    return;
  }

  // Disable the generate button and enable the stop button
  generateBtn.disabled = true;
  stopBtn.disabled = false;
  resultText.innerText = "Generating...";

  // Create a new AbortController instance
  controller = new AbortController();
  const signal = controller.signal;

  try {
    // Fetch the response from the OpenAI API with the signal from AbortController
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": `${API_KEY}`,
      },
      body: JSON.stringify({
        //model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptInput.value }],
        //max_tokens: 100,
        stream: true, // For streaming responses
      }),
      signal, // Pass the signal to the fetch request
    });

      // Read the response as a stream of data
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      resultText.innerText = "";
  
      var no = 0;
      //var arrResult = [];
      var textVal = "";
      var contentMap = new Map(); 
      const cursorHtml = '<span class="blinking-cursor">●</span>';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('done : '+done);
          break;
        }
        console.log('no : '+no);
  
        if(no == 0) {
          $("#hide_result").empty();
        }
  
        // Massage and parse the chunk of data
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
  
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
          .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
          .map((line) => JSON.parse(line)); // Parse the JSON string
  
          
          let forIdx = 0;
          var arrResult = [];
          for (const parsedLine of parsedLines) {
            const { choices } = parsedLine;
            const { delta } = choices[0];
            const { content } = delta;
            
            // Update the UI with the new content
            if (content) {
              //console.log(content);
                arrResult.push(content);
                $("#hide_result").append(content);
              }
            forIdx++;
          }
              
          //console.log('arrResult length : '+arrResult.length);
          
          console.log('before tiem : '+ new Date());

          const wait = await printResponse(arrResult);
          console.log('wait > '+wait);

          console.log('after tiem : '+ new Date());
          no++;
  
      } // end while.
  

  } catch (error) {
    // Handle fetch request errors
    if (signal.aborted) {
      resultText.innerText = "Request aborted.";
    } else {
      console.error("Error:", error);
      resultText.innerText = "Error occurred while generating.";
    }
  } finally {
    // Enable the generate button and disable the stop button
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    controller = null; // Reset the AbortController instance
  }
};

const stop = () => {
  // Abort the fetch request by calling abort() on the AbortController instance
  if (controller) {
    controller.abort();
    controller = null;
  }
};

promptInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    generate();
  }
});
generateBtn.addEventListener("click", generate);
stopBtn.addEventListener("click", stop);

/////////////////////////////////////////////////////////////////
let object = {};
//var textVal = "";
const cursorHtml = '<span class="blinking-cursor">●</span>';
var row = 0;

var languageArr = ["python", "java", "javascript"];     // highlight language 배열
var codeStart = false;                                  // code start
var codeIndex = 0, chasu = 1;                           // code Index, code chasu
var codeLang = "";                                      // code language 
var codeId = "";                                        // code ID
async function printResponse(arrResult) {

  return new Promise(resolve => {
    
    var col = 0;
    var val = arrResult; 
    var len = val.length;
    var textVal = "";
    var bfCode = "";                                    // 코드 시작을 알리는 ``` 이 잘려서 오는 경우 앞부분.

    const interval = setInterval ( () => {

      $(".blinking-cursor").remove();

      //textVal = textVal + val[col];
      //$("#resultText").html(textVal+cursorHtml);    /// 1.
      //  $("#resultText").empty().append(textVal);
      if(val[col] == "```" || val[col] == "``" || $.trim(val[col]) == "`") {  // 코드 시작 또는 끝 부분인 경우.

        //console.log('code ... '+val[col]+', bfCode .. '+bfCode);
        if(bfCode == "``" || $.trim(bfCode) == "`") {     // ``` 표시가 잘려서 오는 경우. 뒷부분 처리. 
          //console.log('bfCode = '+bfCode);
          bfCode = "";
        }
        else{
          if(codeStart==false) {          // 코드 시작일 경우.
            codeId = "code-result"+chasu;
            $("#resultText").append('<pre><code id="'+codeId+'"></code></pre>');
            hljs.highlightAll();
            $("#"+codeId).removeClass("language-undefined");
            codeStart = true;
          }
          else if(codeStart==true) {      // 코드 끝일 경우.
            codeStart = false;
            codeIndex = 0;
          }
          //console.log('highlight : '+codeStart);
          bfCode = val[col];
          chasu++;
        }
  
      }
      else if(codeStart==true) {        // 코드 내용 처리.
        if(codeIndex == 0) {            // 언어를 체크하기 위하여. 
          let lang = String(val[col]).toLowerCase();
          if(languageArr.includes(lang)) {        // 선언된 언어에 포함이 된다면 해당 값으로 세팅.
            codeLang = val[col];
            $("#"+codeId).addClass("language-"+codeLang);       // highlight language 세팅
          }
          else{                                   // 기본값으로 자바스크립트로 세팅.
            codeLang = "javascript";        // 기본적으로 자바스크립트 언어.
            let highValue = hljs.highlight(val[col],  { language: codeLang }).value;
            $("#"+codeId).addClass("language-"+codeLang);
            $("#"+codeId).append(highValue+cursorHtml); 
          }
          //console.log('language : '+codeLang);
        }
        else{
          let highValue = hljs.highlight(val[col],  { language: codeLang }).value;
          $("#"+codeId).append(highValue+cursorHtml); 
        }
        codeIndex++;
      }
      else{                 // 코드가 아닌 경우. 
        $("#resultText").append(val[col]+cursorHtml);               /// 최종
      }

      descendScroll();

      col++;
      if (col == len) {
        $(".blinking-cursor").remove();
          clearInterval(interval);
          console.log('done!'+ new Date());
          resolve('done');
      }
    }, 100);

    row++;
});

}

/**
 * '화면 스크롤 최하단으로 내리기' 함수
 */
function descendScroll() {
	setTimeout(function() {
        var e = document.getElementById("resultContainer");
        //var he = document.getElementById("resultContainer");
        e.scrollTop = e.scrollHeight;
        //he.scrollTop = he.scrollHeight;
  }, 50)
}

/////////////////////////////////////////////////////////////////
