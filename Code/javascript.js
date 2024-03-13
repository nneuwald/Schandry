    const subjectIdSubmitButton = document.getElementById("subject-id-submit");
    const subjectIdInput = document.getElementById("subject-id-input");
    const trialInfo = document.getElementById("trial-info");
    const startStopPrompt = document.getElementById("start-stop-prompt");
    const inputContainer = document.getElementById("input-container");
    const valueInput = document.getElementById("value-input");
    const submitValueButton = document.getElementById("submit-value");
    const recordResponseButton = document.getElementById("record-response-button");
    const confirmationMessage = document.getElementById("confirmation-message");
    const confidenceScaleContainer = document.getElementById("confidence-scale-container");
    const submitConfidenceButton = document.getElementById("submit-confidence");
    const startTaskButton = document.getElementById("start-task-button");
const validationMessage = document.getElementById("validation-message");

submitConfidenceButton.disabled = true;
  const confidenceScale = document.getElementById("confidence-scale");
// Add the event listener
  confidenceScale.addEventListener("input", () => {
    submitConfidenceButton.disabled = false;
  });

    let currentTrial = 0;
let trialData = [];
let globalSubjectId = ""; // This will store the entered subject ID
let isBreakTime = false; // Add this line globally to keep track of the break time

    const trials = ['Seated 1', 'Seated 2', 'Seated 3', 'Tilted 1', 'Tilted 2', 'Tilted 3'];
const trialNameMapping = {
    'Seated 1': 'Seated 25',
    'Seated 2': 'Seated 35',
    'Seated 3': 'Seated 45',
    'Tilted 1': 'Tilted 25',
    'Tilted 2': 'Tilted 35',
    'Tilted 3': 'Tilted 45',
};
    const trialDurations = [25000, 35000, 45000]; // Milliseconds for each trial type

    // Event listener for the "Instructions Audio" button
document.getElementById('instructions-audio-button').addEventListener('click', function() {
  document.getElementById('instructions-audio').play();
});


document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") { // Check if the pressed key is Escape
        // Assuming `trialData` holds your data and 'trial_data.csv' is the desired filename
        downloadCSV(trialData, "trial_data.csv");
    }
});


// Updated event listener for 'subjectIdSubmitButton'
subjectIdSubmitButton.addEventListener('click', function() {
console.log("Submit ID button clicked"); // Debugging line
  const subjectId = subjectIdInput.value.trim();
  if (subjectId !== "") {
    globalSubjectId = subjectId; // Store the subject ID globally
    subjectIdInput.style.display = 'none';
    this.style.display = 'none';
    startTaskButton.style.display = 'inline-block'; // Ensure this matches the ID
    console.log("Should show the Start Task button now"); // Debugging line
    
    // Show the instructions after the ID has been submitted
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('instructions-audio-button').style.display = 'inline-block';

    
  } else {
    alert('Please enter a valid Subject ID.');
  }
});
// New event listener for 'start-task-button'
document.getElementById('start-task-button').addEventListener('click', function() {
  document.getElementById('instructions').style.display = 'none';
  document.getElementById('instructions-audio-button').style.display = 'none';
  document.getElementById('title-container').style.display = 'none';
  
  // You can also hide the "Start" button itself if not needed anymore
  this.style.display = 'none';
  // Then start the trial
  startTrial();
    document.getElementById('ding-sound').play();
});

submitValueButton.addEventListener('click', function() {
  const valueEntered = valueInput.value.trim(); // Get the trimmed value from the input

  // Check if the value entered is actually a number and is not just an empty string
  if (valueEntered && !isNaN(valueEntered)) {
    // If the input is valid, hide the validation message
    validationMessage.style.display = "none";

    // Hide the input elements since a valid number has been entered
    trialInfo.style.display = "none";
    startStopPrompt.style.display = "none";
    inputContainer.style.display = "none";

    // Now, proceed with showing the confidence scale question
    confidenceScaleContainer.style.display = 'block';
  } else {
    // If the input is invalid, show the validation message
    validationMessage.style.display = "block";
    // Show the input container again so the user can correct their input
    inputContainer.style.display = "block";
    // Optionally, you can clear the input field or keep the invalid entry for the user to correct
    valueInput.value = ""; // Clear the input field
  }
    });

    submitConfidenceButton.addEventListener('click', function() {
    document.getElementById('beep-sound').play();
      recordResponse();
    });

   function startTrial() {
if (isBreakTime) {
        // Show the break message and wait for spacebar press
        trialInfo.innerHTML = "<strong style='color: green;'>Please await further instructions from the researcher</strong>";
        trialInfo.style.display = "block";
        document.addEventListener('keydown', function(event) {
            if (event.code === "Space") {

                isBreakTime = false; // Reset the flag
                document.removeEventListener('keydown', arguments.callee); // Remove this event listener to prevent it from triggering again
 trialInfo.style.color = ""; // Reset text color to default
                trialInfo.style.fontWeight = ""; // Reset font weight to default
                currentTrial++; // Move to the next trial, which should be "Tilted 1"
                startTrial(); // Start the next trial
            }
        });
        return; // Exit the function to not proceed with the normal trial start
    }
    resetForNextTrial();
submitConfidenceButton.disabled = true;
    document.getElementById('trial-label').textContent = trials[currentTrial];
    document.getElementById('trial-label').style.display = "block"; // Make sure it's visible
    // Include initial instructions and prepare for countdown
    const initialInstruction = "When you are prompted to start, begin counting how many heart beats you feel";
    trialInfo.innerHTML = `${initialInstruction}<br><br>Trial will begin in 20`; // Use innerHTML for line breaks
    trialInfo.style.display = "block";

let countdown = 19; // Start countdown from 19 since 20 is immediately displayed
const countdownInterval = setInterval(() => {
    trialInfo.innerHTML = `${initialInstruction}<br><br>Trial will begin in ${countdown}`; 
    countdown--;
    if (countdown < 0) {
        clearInterval(countdownInterval);

            trialInfo.textContent = "Start"; // Change to start instruction
            document.getElementById('trial-start-audio').play(); // Start audio cue
            const durationIndex = currentTrial % 3; // Determines which duration to use based on the trial number
            const duration = trialDurations[durationIndex];
            
            // After the trial duration, change instructions to "Stop. Enter how many heartbeats you counted"
            setTimeout(() => {
                document.getElementById('trial-end-audio').play(); // End audio cue
                startStopPrompt.style.display = "block";
                trialInfo.textContent = "Stop. Enter how many heartbeats you counted"; // Update the instructions for the end of trial
                inputContainer.style.display = "block"; // Show input container for entering the count
            }, duration);
        }
    }, 1000); // Update countdown every 1 second
}



    function recordResponse() {
      // Ensure the confidence question has been answered before moving on
      confidenceScaleContainer.style.display = 'none';
       const valueEntered = valueInput.value;
  const confidenceValue = document.getElementById('confidence-scale').value;
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1; // getMonth() is zero-based
const day = now.getDate();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


   // Use the mapping to get the CSV name
    const csvTrialName = trialNameMapping[trials[currentTrial]];

    // Store the current trial's data with the mapped name for CSV output
    trialData.push({
        trial: csvTrialName, // Use the mapped name here
        value: valueEntered,
        confidence: confidenceValue,
        timestamp: timestamp
    });
if (currentTrial === 2) { // This specific check seems to be for a break after a certain trial, adjust as necessary
    isBreakTime = true; // Indicate that it's break time
} else if (currentTrial < trials.length - 1) {
    // Move to the next trial if not the last one
    currentTrial++;
} else {
    // If none of the above conditions are met, this must be the last trial
    // Proceed to finish the trials
    finishTrials();
    return; // Exit the function to prevent further execution
}

// This checks for a break time or continues to the next trial
if (isBreakTime) {
    startTrial(); // If it's break time, show the break message
    // Ensure that you reset `isBreakTime` at the appropriate moment to continue trials after the break
} else {
    startTrial(); // Proceed with the next trial
}
}

function downloadCSV(data) {
    let csvContent = "Trial,Beats Counted,Confidence Value,Timestamp\n"; // Column headers
    data.forEach(function(rowArray) {
        let row = rowArray.trial + ',' + rowArray.value + ',' + rowArray.confidence + ',' + rowArray.timestamp;
        csvContent += row + "\r\n"; // Add row data
    });

    // Create a Blob with CSV content
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);

    // Use the globalSubjectId in the filename
var filename = `Schandry_Data_${globalSubjectId}.csv`;

    // Create a download link and trigger the download
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename); // Use the dynamic filename
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function finishTrials() {
  // Hide any elements that are not needed at the end of the task
  document.getElementById('trial-info').style.display = "none";
  document.getElementById('start-stop-prompt').style.display = "none";
  document.getElementById('input-container').style.display = "none";
  document.getElementById('record-response-button').style.display = "none";
  document.getElementById('confidence-scale-container').style.display = "none";
  document.getElementById('trial-label').style.display = "none";

  // Ensure the confirmation message element is visible and updated with the completion message
  const confirmationMessage = document.getElementById('confirmation-message');
  confirmationMessage.textContent = "All trials completed. Thank you for your participation!";
  confirmationMessage.style.display = "block";
  downloadCSV(trialData, "trial_data.csv");


  // Optionally, you can add a button or link for participants to proceed to the next steps (if any),
  // like a debriefing page or a form to collect additional data.
  
  // Example: Show a "Finish" button that redirects to another page
  // Adjust or remove this part according to your specific requirements
  const finishButton = document.createElement('button');
  finishButton.textContent = 'Finish';
  finishButton.onclick = function() {
    window.location.href = 'thankyou_page.html'; // Redirect to a thank you page or any next step
  };
  document.body.appendChild(finishButton);
  
  // Download the CSV file with the collected data
  downloadCSV(trialData, "trial_data.csv");
}




    function resetForNextTrial() {
      startStopPrompt.style.display = "none";
    inputContainer.style.display = "none";
    recordResponseButton.style.display = "none";
    valueInput.value = ""; // Clear the input value
    document.getElementById('confidence-scale').value = 50; // Reset the slider to 50
    // No need to hide confidenceScaleContainer here as it's handled in recordResponse
  }

  function finishTrials() {
    // Hide any elements that are not needed at the end of the task
    document.getElementById('trial-info').style.display = "none";
    document.getElementById('start-stop-prompt').style.display = "none";
    document.getElementById('input-container').style.display = "none";
    document.getElementById('record-response-button').style.display = "none";
    document.getElementById('confidence-scale-container').style.display = "none";
    document.getElementById('trial-label').style.display = "none";

    // Ensure the confirmation message element is visible and updated with the completion message
    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.textContent = "All trials completed. Thank you for your participation!";
    confirmationMessage.style.display = "block";

    // Create the "Download Data" button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Data';
    downloadButton.style.display = 'block'; // Ensure the button is visible
    downloadButton.style.margin = '20px auto'; // Add some margin for aesthetics
    downloadButton.style.padding = '10px 20px'; // Add some padding for aesthetics
    downloadButton.style.fontSize = '16px'; // Set font size for visibility
    downloadButton.onclick = function() {
        downloadCSV(trialData, "trial_data.csv");
    };

    // Append the button to the body or to a specific container
    document.body.appendChild(downloadButton);

   // Add the new code here, right after appending the Download Data button
  const copyrightNotice = document.createElement('p');
  copyrightNotice.textContent = "Copyright (c) 2024 Nicholas Neuwald. All rights reserved";
  copyrightNotice.style.fontSize = "12px"; // Smaller font size for copyright text
  copyrightNotice.style.textAlign = "center"; // Center the text, if desired
  copyrightNotice.style.marginTop = "50px"; // Space between the button and copyright notice
  
  document.body.appendChild(copyrightNotice); // Append the copyright notice to the body
    // });
}
