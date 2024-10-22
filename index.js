let processes = [];

// Function to validate input
function validateInput(input) {
    if (input.value < 0) {
        input.value = 0;
    }
}



// Function to create input fields for processes
// Function to validate input fields
function validateInput(input) {
    if (input.value < 0) {
        input.value = 0; // Prevent negative values
    }
}

// Function to create input fields for processes
// Function to create input fields for processes
function createProcessInputs() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    const processInputsDiv = document.getElementById('processInputs');
    processInputsDiv.innerHTML = ''; // Clear previous inputs

    for (let i = 0; i < numProcesses; i++) {
        // Create a div for each process
        const processDiv = document.createElement('div');
        processDiv.className = 'process-input';

        // Create input for Arrival Time
        const arrivalInput = document.createElement('input');
        arrivalInput.type = 'number';
        arrivalInput.id = `arrivalTime${i}`;
        arrivalInput.placeholder = `Arrival Time P${i + 1}`;
        arrivalInput.min = 0;
        arrivalInput.oninput = () => validateInput(arrivalInput);
        processDiv.appendChild(arrivalInput);

        // Create input for Burst Time
        const burstInput = document.createElement('input');
        burstInput.type = 'number';
        burstInput.id = `burstTime${i}`;
        burstInput.placeholder = `Burst Time P${i + 1}`;
        burstInput.min = 0;
        burstInput.oninput = () => validateInput(burstInput);
        processDiv.appendChild(burstInput);

        // Create input for Priority if the selected algorithm is Priority Scheduling
        if (document.getElementById('algorithm').value === 'Priority') {
            const priorityInput = document.createElement('input');
            priorityInput.type = 'number';
            priorityInput.id = `priority${i}`;
            priorityInput.placeholder = `Priority P${i + 1}`;
            priorityInput.min = 1; // Assuming priority starts from 1
            priorityInput.oninput = () => validateInput(priorityInput);
            processDiv.appendChild(priorityInput);
        }

        // Append the process div to the main container
        processInputsDiv.appendChild(processDiv);
    }

    // Show the simulate button after creating inputs
    document.getElementById('simulate').style.display = 'inline-block';
}


// Function to simulate the scheduling
function simulate() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    const algorithm = document.getElementById('algorithm').value;
    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
        const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
        const priority = parseInt(document.getElementById(`priority${i}`).value);

        // Create a process object
        processes.push({
            id: `P${i + 1}`,
            arrivalTime,
            burstTime,
            priority,
        });
    }

    // Call the scheduling algorithm based on the selection
    let results;
    switch (algorithm) {
        case 'FCFS':
            results = firstComeFirstServe(processes);
            break;
        case 'SJF':
            results = shortestJobFirst(processes);
            break;
        case 'Priority':
            results = priorityScheduling(processes);
            break;
        default:
            results = [];
    }

    // Display results
    displayResults(results);
}

// Function for First-Come, First-Served (FCFS) scheduling
function firstComeFirstServe(processes) {
    // Sort processes by Arrival Time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    const completionTimes = [];
    let currentTime = 0;

    processes.forEach(process => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime; // Wait for the next process
        }
        currentTime += process.burstTime; // Increment current time by burst time
        completionTimes.push({
            id: process.id,
            completionTime: currentTime,
            turnaroundTime: currentTime - process.arrivalTime,
            waitingTime: currentTime - process.arrivalTime - process.burstTime,
        });
    });

    return completionTimes;
}

// Function for Shortest Job First (SJF) scheduling
function shortestJobFirst(processes) {
    // Sort processes by Arrival Time and Burst Time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    const completionTimes = [];
    let currentTime = 0;
    let remainingProcesses = processes.slice();

    while (remainingProcesses.length > 0) {
        // Get processes that have arrived
        const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);

        if (availableProcesses.length === 0) {
            // If no processes have arrived, increment currentTime
            currentTime++;
            continue;
        }

        // Find the process with the shortest burst time
        const shortestProcess = availableProcesses.reduce((prev, curr) => 
            (prev.burstTime < curr.burstTime) ? prev : curr
        );

        // Update the current time and remove the process from remaining
        currentTime += shortestProcess.burstTime;
        remainingProcesses = remainingProcesses.filter(p => p !== shortestProcess);

        // Calculate completion, turnaround, and waiting times
        completionTimes.push({
            id: shortestProcess.id,
            completionTime: currentTime,
            turnaroundTime: currentTime - shortestProcess.arrivalTime,
            waitingTime: (currentTime - shortestProcess.arrivalTime) - shortestProcess.burstTime,
        });
    }

    return completionTimes;
}

// Function for Priority scheduling
function priorityScheduling(processes) {
    // Sort processes by Arrival Time, then by Priority
    processes.sort((a, b) => {
        if (a.arrivalTime === b.arrivalTime) {
            return a.priority - b.priority; // Lower priority number means higher priority
        }
        return a.arrivalTime - b.arrivalTime; // Sort by Arrival Time
    });

    const completionTimes = [];
    let currentTime = 0;

    processes.forEach(process => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime; // Wait for the next process
        }
        currentTime += process.burstTime; // Increment current time by burst time
        completionTimes.push({
            id: process.id,
            completionTime: currentTime,
            turnaroundTime: currentTime - process.arrivalTime,
            waitingTime: currentTime - process.arrivalTime - process.burstTime,
        });
    });

    return completionTimes;
}

// Function to display results
function displayResults(results) {
    const resultsDiv = document.getElementById('results');

    // Set up the main heading for the results section
    resultsDiv.innerHTML = `
        <h2>Simulation Results</h2>
        <h3>Overview of Process Completion</h3>
        <table id="resultsTable">
            <tr>
                <th>Process</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
            </tr>
        </table>
    `;

    const resultsTable = document.getElementById('resultsTable');

    results.forEach((result) => {
        // Create a new row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td name="resulttext">${result.id}</td>
            <td name="resulttext">${result.completionTime}</td>
            <td name="resulttext">${result.turnaroundTime}</td>
            <td name="resulttext">${result.waitingTime}</td>
        `;

        resultsTable.appendChild(row);
    });
    
  var result=document.getElementsByName("resulttext");
  gsap.from(result, {
    opacity: 0,
    y: 50,
    stagger: 0.10,
    
    ease: "power2.out",
    duration: 3
  });

}







// Function to create processes from input fields
function createProcesses(numProcesses) {
    processes = [];
    for (let i = 0; i < numProcesses; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
        const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
        const priority = document.getElementById(`priority${i}`) ? parseInt(document.getElementById(`priority${i}`).value) : null;
        processes.push({ id: `P${i + 1}`, arrivalTime, burstTime, remainingTime: burstTime, priority });
    }
}

// Function to run FCFS Scheduling
function fcfsScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (let process of processes) {
        if (currentTime < process.arrivalTime) {
            ganttChart.push({ id: "Idle", start: currentTime, end: process.arrivalTime });
            currentTime = process.arrivalTime;
        }
        ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.burstTime });
        currentTime += process.burstTime;
    }

    return ganttChart;
}

// Function to run SJF Scheduling
function sjfScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    const waitingQueue = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length || waitingQueue.length) {
        while (processes.length && processes[0].arrivalTime <= currentTime) {
            waitingQueue.push(processes.shift());
        }

        if (waitingQueue.length) {
            waitingQueue.sort((a, b) => a.burstTime - b.burstTime);
            const process = waitingQueue.shift();
            ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.burstTime });
            currentTime += process.burstTime;
        } else {
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    return ganttChart;
}

// Function to run Preemptive SJF Scheduling
function preemptiveSjfScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    let remainingProcesses = processes.slice();

    while (remainingProcesses.length) {
        const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
        
        if (availableProcesses.length) {
            availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);
            const process = availableProcesses[0];

            ganttChart.push({ id: process.id, start: currentTime, end: currentTime + 1 });
            currentTime++;

            process.remainingTime--;

            if (process.remainingTime === 0) {
                remainingProcesses = remainingProcesses.filter(p => p !== process);
            }
        } else {
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    return ganttChart;
}

// Function to run Priority Scheduling
function priorityScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    const waitingQueue = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length || waitingQueue.length) {
        while (processes.length && processes[0].arrivalTime <= currentTime) {
            waitingQueue.push(processes.shift());
        }

        if (waitingQueue.length) {
            waitingQueue.sort((a, b) => a.priority - b.priority);
            const process = waitingQueue.shift();
            ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.burstTime });
            currentTime += process.burstTime;
        } else {
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    return ganttChart;
}

// Function to run Preemptive Priority Scheduling
function preemptivePriorityScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    let remainingProcesses = processes.slice();

    while (remainingProcesses.length) {
        const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);

        if (availableProcesses.length) {
            availableProcesses.sort((a, b) => a.priority - b.priority);
            const process = availableProcesses[0];

            ganttChart.push({ id: process.id, start: currentTime, end: currentTime + 1 });
            currentTime++;

            process.remainingTime--;

            if (process.remainingTime === 0) {
                remainingProcesses = remainingProcesses.filter(p => p !== process);
            }
        } else {
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    return ganttChart;
}

// Function to simulate the selected scheduling algorithm
function simulate() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    createProcesses(numProcesses);

    const selectedAlgorithm = document.getElementById('algorithm').value;
    let ganttChart;

    switch (selectedAlgorithm) {
        case "FCFS":
            ganttChart = fcfsScheduling();
            break;
        case "SJF":
            ganttChart = sjfScheduling();
            break;
        case "Priority":
            ganttChart = priorityScheduling();
            break;
        default:
            break;
    }

    displayResults(ganttChart);
}

// Function to display Gantt chart results
function getRandomPastelColor() {
    const randomHue = Math.floor(Math.random() * 360); // Random hue
    const pastelColor = `hsl(${randomHue}, 70%, 85%)`; // Light pastel color
    return pastelColor;
}

function displayResults(ganttChart) {
    const resultsDiv = document.getElementById('results');
    const ganttChartDiv = document.getElementById('ganttChart');
    resultsDiv.innerHTML = '';
    ganttChartDiv.innerHTML = '';

    ganttChart.forEach((segment, index) => {
        const { id, start, end } = segment;

        // Add result to resultsDiv immediately
        resultsDiv.innerHTML += `<div>${id}: ${start} - ${end}</div>`;

        // Create the bar but keep it hidden initially
        const bar = document.createElement('div');
        bar.className = 'gantt-bar';
        bar.style.width = `${(end - start) * 10}px`; // Scale the width
        bar.style.backgroundColor = id === "Idle" ? 'gray' : getRandomPastelColor(); // Use random pastel color
        bar.innerText = id;
        bar.style.position = 'relative'; // Position relative for animation
        bar.style.transform = 'translateX(100%)'; // Start from the right
        bar.style.visibility = 'hidden'; // Hide the bar initially
        ganttChartDiv.appendChild(bar);

        // Use setTimeout to display the bar after the delay
        setTimeout(() => {
            bar.style.visibility = 'visible'; // Show the bar
            bar.style.transition = 'transform 0.5s ease'; // Smooth transition
            bar.style.transform = 'translateX(0)'; // Move to original position
        }, index * 500); // Delay of 500 ms for each bar
    });
}








// function checkPriority() {
//     const selectedAlgorithm = document.getElementById('algorithm').value;
//     const isPriority = selectedAlgorithm.includes('Priority');
//     const processInputsDiv = document.getElementById('processInputs');
    
//     // Clear previous inputs
//     processInputsDiv.innerHTML = '';
    
//     // If the selected algorithm is Priority, create priority inputs
//     if (isPriority) {
//         createProcessInputs(true);
//     } else {
//         createProcessInputs(false);
//     }
// }
