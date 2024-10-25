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
    processInputsDiv.innerHTML = ''; 


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
    
        // Create input for Priority if the selected algorithm is Priority Scheduling or Preemptive Priority
        if (document.getElementById('algorithm').value === 'Priority' || document.getElementById('algorithm').value === 'prePriority') {
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
    
    // Check if the selected algorithm is Round Robin
    if (document.getElementById('algorithm').value === 'timeSlice') {
        const timeQuantumDiv = document.createElement('div');
        timeQuantumDiv.className = 'time-quantum-input';
    
        // Create input for Time Quantum
        const timeQuantumInput = document.createElement('input');
        timeQuantumInput.type = 'number';
        timeQuantumInput.id = 'timeQuantum';
        timeQuantumInput.placeholder = 'Enter Time Quantum';
        timeQuantumInput.min = 1; // Time quantum must be at least 1
        timeQuantumInput.oninput = () => validateInput(timeQuantumInput);
        timeQuantumDiv.appendChild(timeQuantumInput);
    
        // Append the Time Quantum div to the main container
        processInputsDiv.appendChild(timeQuantumDiv);
    }
    
    if(numProcesses>0){
    // Show the simulate button after creating inputs
    document.getElementById('simulate').style.display = 'inline-block';
    }
}


// Function to simulate the scheduling
// function simulate() {
//     const numProcesses = parseInt(document.getElementById('numProcesses').value);
//     const algorithm = document.getElementById('algorithm').value;
//     const processes = [];

//     for (let i = 0; i < numProcesses; i++) {
//         const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
//         const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
//         const priority = parseInt(document.getElementById(`priority${i}`).value);

//         // Create a process object
//         processes.push({
//             id: `P${i + 1}`,
//             arrivalTime,
//             burstTime,
//             priority,
//         });
//     }

//     // Call the scheduling algorithm based on the selection
//     let results;
//     switch (algorithm) {
//         case 'FCFS':
//             results = firstComeFirstServe(processes);
//             break;
//         case 'SJF':
//             results = shortestJobFirst(processes);
//             break;
//         case 'Priority':
//             results = priorityScheduling(processes);
//             break;
//         default:
//             results = [];
//     }

// }

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

// Function for Priority scheduling 1


// Function to display results








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

    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length || waitingQueue.length) {
        // Add processes to the waiting queue as they arrive
        while (processes.length && processes[0].arrivalTime <= currentTime) {
            waitingQueue.push(processes.shift());
        }

        if (waitingQueue.length) {
            // Sort the waiting queue by burst time (Shortest Job First)
            waitingQueue.sort((a, b) => a.burstTime - b.burstTime);
            const process = waitingQueue.shift();
            ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.burstTime });
            currentTime += process.burstTime;
        } else {
            // If no process is ready, the CPU is idle
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    // Merge continuous "Idle" states into a single entry
    return mergeContinuousIdleStates(ganttChart);
}

function mergeContinuousIdleStates(ganttChart) {
    const mergedGanttChart = [];

    for (let i = 0; i < ganttChart.length; i++) {
        const currentEntry = ganttChart[i];

        // If the current entry is "Idle" and the previous one was also "Idle", merge them
        if (mergedGanttChart.length && mergedGanttChart[mergedGanttChart.length - 1].id === "Idle" && currentEntry.id === "Idle") {
            mergedGanttChart[mergedGanttChart.length - 1].end = currentEntry.end;
        } else {
            // Otherwise, push the current entry to the merged Gantt chart
            mergedGanttChart.push(currentEntry);
        }
    }

    return mergedGanttChart;
}


// Function to run Premptive SJF Scheduling

function preemptiveSjfScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    const waitingQueue = [];
    const remainingProcesses = processes.map(process => ({ ...process, remainingTime: process.burstTime }));

    // Sort processes by arrival time
    remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentProcess = null;

    while (remainingProcesses.length || waitingQueue.length || currentProcess) {
        // Add processes to the waiting queue as they arrive
        while (remainingProcesses.length && remainingProcesses[0].arrivalTime <= currentTime) {
            waitingQueue.push(remainingProcesses.shift());
        }

        // Handle the currently executing process
        if (currentProcess) {
            // Decrease the remaining time for the current process
            ganttChart.push({ id: currentProcess.id, start: currentTime, end: currentTime + 1 });
            currentProcess.remainingTime--;

            // Check for completion
            if (currentProcess.remainingTime === 0) {
                currentProcess = null;
            }
        }

        // Check for new processes that may preempt
        if (waitingQueue.length) {
            // Sort the waiting queue by remaining time
            waitingQueue.sort((a, b) => a.remainingTime - b.remainingTime);
            const nextProcess = waitingQueue[0];

            // If there is a new process with a shorter remaining time
            if (!currentProcess || nextProcess.remainingTime < currentProcess.remainingTime) {
                // Preempt the current process if necessary
                if (currentProcess) {
                    waitingQueue.push(currentProcess);
                }
                currentProcess = waitingQueue.shift(); // Start the new process
            }
        }

        // If there's no current process and no new arrivals, add an extended Idle state
        if (!currentProcess && waitingQueue.length === 0) {
            let idleStart = currentTime;

            // Increment currentTime to find how long the idle time lasts
            while (!currentProcess && waitingQueue.length === 0 && remainingProcesses.length) {
                currentTime++;
                // Check for arriving processes during the idle time
                while (remainingProcesses.length && remainingProcesses[0].arrivalTime <= currentTime) {
                    waitingQueue.push(remainingProcesses.shift());
                }
            }

            // Create an Idle entry that spans the full duration
            ganttChart.push({ id: "Idle", start: idleStart, end: currentTime });
            currentTime--; // Decrement to adjust for the next loop iteration
        }

        // Increment the current time
        currentTime++;
    }

    // Merge continuous entries in the Gantt chart
    return mergeContinuousEntries(ganttChart);
}

// Function to merge continuous entries in the Gantt chart
function mergeContinuousEntries(ganttChart) {
    const mergedChart = [];
    for (let i = 0; i < ganttChart.length; i++) {
        const current = ganttChart[i];
        if (mergedChart.length > 0) {
            const last = mergedChart[mergedChart.length - 1];
            // Check if the current entry is the same as the last merged entry
            if (current.id === last.id) {
                // Merge the time intervals
                last.end = current.end; // Update the end time of the last merged entry
            } else {
                // Push a new entry if it's different
                mergedChart.push({ ...current });
            }
        } else {
            // First entry, just add it
            mergedChart.push({ ...current });
        }
    }
    mergedChart.pop();
    if (mergedChart.length > 0) {
        for (let i = 0; i < mergedChart.length; i++) {
            if(!(i==0)){
            mergedChart[i].start -= 1; // Decrease start time by 1
            }
            mergedChart[i].end -= 1;   // Decrease end time by 1
        }
    }
    
    

    return mergedChart;
}


// function priorityScheduling(processes) {
//     // Sort processes by Arrival Time, then by Priority
//     processes.sort((a, b) => {
//         if (a.arrivalTime === b.arrivalTime) {
//             return a.priority - b.priority; // Lower priority number means higher priority
//         }
//         return a.arrivalTime - b.arrivalTime; // Sort by Arrival Time
//     });

//     const completionTimes = [];
//     let currentTime = 0;

//     processes.forEach(process => {
//         if (currentTime < process.arrivalTime) {
//             currentTime = process.arrivalTime; // Wait for the next process
//         }
//         currentTime += process.burstTime; // Increment current time by burst time
//         completionTimes.push({
//             id: process.id,
//             completionTime: currentTime,
//             turnaroundTime: currentTime - process.arrivalTime,
//             waitingTime: currentTime - process.arrivalTime - process.burstTime,
//         });
//     });

//     return completionTimes;
// }







// Function to run Priority Scheduling 2
function priorityScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    const waitingQueue = [];

    // Sort processes by arrival time first
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length || waitingQueue.length) {
        // Add processes to the waiting queue as they arrive
        while (processes.length && processes[0].arrivalTime <= currentTime) {
            waitingQueue.push(processes.shift());
        }

        if (waitingQueue.length) {
            // Sort the waiting queue by priority (lower value means higher priority)
            waitingQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
            
            // Get the process with the highest priority (lowest number)
            const process = waitingQueue.shift();
            
            // Push the process to the Gantt chart with its start and end time
            ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.burstTime });
            
            // Update the current time based on the burst time of the selected process
            currentTime += process.burstTime;
        } else {
            // If no process is ready, the CPU is idle
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    // Merge continuous "Idle" states into a single entry before returning the chart
    return mergeContinuousIdleStates(ganttChart);
}

function preemptivePriorityScheduling() {
    let currentTime = 0;
    const ganttChart = [];
    const waitingQueue = [];
    const remainingProcesses = processes.map(process => ({ ...process, remainingTime: process.burstTime }));

    // Sort processes by arrival time first
    remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentProcess = null;

    while (remainingProcesses.length || waitingQueue.length || currentProcess) {
        // Add processes to the waiting queue as they arrive
        while (remainingProcesses.length && remainingProcesses[0].arrivalTime <= currentTime) {
            waitingQueue.push(remainingProcesses.shift());
        }

        // Sort the waiting queue by priority (lower value means higher priority)
        waitingQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);

        // Preempt if there's a new process with a higher priority
        if (currentProcess) {
            if (waitingQueue.length && waitingQueue[0].priority < currentProcess.priority) {
                ganttChart.push({ id: currentProcess.id, start: currentTime - 1, end: currentTime });
                currentProcess.remainingTime--;

                if (currentProcess.remainingTime > 0) {
                    waitingQueue.push(currentProcess); // Put the preempted process back in the queue
                }

                currentProcess = waitingQueue.shift(); // Switch to the higher priority process
            }
        } else if (waitingQueue.length) {
            // If there's no current process, pick the next process with the highest priority
            currentProcess = waitingQueue.shift();
        }

        // If no process is ready, the CPU is idle
        if (!currentProcess && !waitingQueue.length && remainingProcesses.length) {
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
            continue;
        }

        // Execute the current process for one unit of time (preemptive, step by step)
        if (currentProcess) {
            ganttChart.push({ id: currentProcess.id, start: currentTime, end: currentTime + 1 });
            currentProcess.remainingTime--;
            currentTime++;

            // If the current process finishes, set it to null
            if (currentProcess.remainingTime === 0) {
                currentProcess = null;
            }
        }
    }

    // Merge continuous "Idle" states into a single entry before returning the chart
    return mergePreemptivePriorityStates(ganttChart);
}

function mergePreemptivePriorityStates(ganttChart) {
    const mergedGanttChart = [];

    for (let i = 0; i < ganttChart.length; i++) {
        const currentEntry = ganttChart[i];

        // If the current entry and the last merged entry are the same process, merge them
        if (mergedGanttChart.length && mergedGanttChart[mergedGanttChart.length - 1].id === currentEntry.id) {
            mergedGanttChart[mergedGanttChart.length - 1].end = currentEntry.end;
        } 
        // If the current entry is "Idle" and the previous entry is also "Idle", merge them
        else if (mergedGanttChart.length && mergedGanttChart[mergedGanttChart.length - 1].id === "Idle" && currentEntry.id === "Idle") {
            mergedGanttChart[mergedGanttChart.length - 1].end = currentEntry.end;
        } 
        // If it's a new process or an idle period, add it to the merged chart
        else {
            mergedGanttChart.push(currentEntry);
        }
    }

    return mergedGanttChart;
}


// Function to get a random time quantum between 2 and 7
function getRandomTimeQuantum() {

    return Math.floor(Math.random() * 6) + 2; // Generates a random number between 2 and 7
}

function roundRobinScheduling() {
    // Get time quantum from the input field
    let timeQuantum = parseInt(document.getElementById('timeQuantum').value);

    // Check if the value is valid, if not use a default value
    if (isNaN(timeQuantum) || timeQuantum <= 0) {
        timeQuantum = getRandomTimeQuantum();
        console.log(`Invalid input! Using random time quantum: ${timeQuantum}`);
    }

    let currentTime = 0;
    const ganttChart = [];
    const waitingQueue = [];
    const remainingProcesses = processes.map(process => ({ ...process, remainingTime: process.burstTime }));

    while (remainingProcesses.length || waitingQueue.length) {
        // Add processes to the waiting queue as they arrive
        while (remainingProcesses.length && remainingProcesses[0].arrivalTime <= currentTime) {
            waitingQueue.push(remainingProcesses.shift());
        }

        // If there's a process in the waiting queue, execute it
        if (waitingQueue.length) {
            const process = waitingQueue.shift();
            
            if (process.remainingTime <= timeQuantum) {
                // If the process can finish within the time quantum, execute it fully
                ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.remainingTime });
                currentTime += process.remainingTime;
                process.remainingTime = 0;  // Process is completed
            } else {
                // If the process cannot finish within the time quantum, execute for timeQuantum
                ganttChart.push({ id: process.id, start: currentTime, end: currentTime + timeQuantum });
                currentTime += timeQuantum;
                process.remainingTime -= timeQuantum;
                
                // Re-add the process to the end of the waiting queue
                waitingQueue.push(process);
            }
        } else {
            // If no process is ready, the CPU is idle
            ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
            currentTime++;
        }
    }

    // Merge continuous "Idle" states into a single entry
    return mergeGanttChartForRoundRobin(ganttChart);
}





// function roundRobinSchedulingWithTimeQuantum(timeQuantum) {
//     console.log(`Time Quantum: ${timeQuantum}`);

//     let currentTime = 0;
//     const ganttChart = [];
//     const waitingQueue = [];
//     const remainingProcesses = processes.map(process => ({ ...process, remainingTime: process.burstTime }));

//     while (remainingProcesses.length || waitingQueue.length) {
//         // Add processes to the waiting queue as they arrive
//         while (remainingProcesses.length && remainingProcesses[0].arrivalTime <= currentTime) {
//             waitingQueue.push(remainingProcesses.shift());
//         }

//         // If there's a process in the waiting queue, execute it
//         if (waitingQueue.length) {
//             const process = waitingQueue.shift();
            
//             // Log the current process being executed
//             console.log(`Executing Process: ${process.id} at Time: ${currentTime}`);

//             if (process.remainingTime <= timeQuantum) {
//                 // If the process can finish within the time quantum, execute it fully
//                 ganttChart.push({ id: process.id, start: currentTime, end: currentTime + process.remainingTime });
//                 currentTime += process.remainingTime;
//                 process.remainingTime = 0;  // Process is completed
//             } else {
//                 // If the process cannot finish within the time quantum, execute for timeQuantum
//                 ganttChart.push({ id: process.id, start: currentTime, end: currentTime + timeQuantum });
//                 currentTime += timeQuantum;
//                 process.remainingTime -= timeQuantum;
                
//                 // Re-add the process to the end of the waiting queue
//                 waitingQueue.push(process);
//             }
//         } else {
//             // If no process is ready, the CPU is idle
//             ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
//             currentTime++;
//         }
//     }

//     // Merge continuous "Idle" states into a single entry
//     return mergeGanttChartForRoundRobin(ganttChart);
// }






function mergeGanttChartForRoundRobin(ganttChart) {
    const mergedGanttChart = [];

    for (let i = 0; i < ganttChart.length; i++) {
        const currentEntry = ganttChart[i];

        // If the current entry is "Idle" and the previous one was also "Idle", merge them
        if (mergedGanttChart.length && mergedGanttChart[mergedGanttChart.length - 1].id === "Idle" && currentEntry.id === "Idle") {
            mergedGanttChart[mergedGanttChart.length - 1].end = currentEntry.end;
        } else if (mergedGanttChart.length && mergedGanttChart[mergedGanttChart.length - 1].id === currentEntry.id) {
            // If the current process is the same as the previous one, merge their time periods
            mergedGanttChart[mergedGanttChart.length - 1].end = currentEntry.end;
        } else {
            // Otherwise, push the current entry to the merged Gantt chart
            mergedGanttChart.push(currentEntry);
        }
    }

    return mergedGanttChart;
}


// Function to run Preemptive Priority Scheduling
// function preemptivePriorityScheduling() {
//     let currentTime = 0;
//     const ganttChart = [];
//     let remainingProcesses = processes.slice();

//     while (remainingProcesses.length) {
//         const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);

//         if (availableProcesses.length) {
//             availableProcesses.sort((a, b) => a.priority - b.priority);
//             const process = availableProcesses[0];

//             ganttChart.push({ id: process.id, start: currentTime, end: currentTime + 1 });
//             currentTime++;

//             process.remainingTime--;

//             if (process.remainingTime === 0) {
//                 remainingProcesses = remainingProcesses.filter(p => p !== process);
//             }
//         } else {
//             ganttChart.push({ id: "Idle", start: currentTime, end: currentTime + 1 });
//             currentTime++;
//         }
//     }

//     return ganttChart;
// }

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
        case "preSJF":
            ganttChart = preemptiveSjfScheduling();
            break;
        case "Priority":
            ganttChart = priorityScheduling();
            break;
        case "prePriority":
            ganttChart = preemptivePriorityScheduling();
            break; 
        case "roundRobbin":
            ganttChart = roundRobinScheduling();
            break;
        case "timeSlice":
            ganttChart = roundRobinScheduling();
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

// function displayResults(ganttChart) {
//     const resultsDiv = document.getElementById('results');
//     const ganttChartDiv = document.getElementById('ganttChart');
//     resultsDiv.innerHTML = '';
//     ganttChartDiv.innerHTML = '';

//     ganttChart.forEach((segment, index) => {
//         const { id, start, end } = segment;

//         // Add result to resultsDiv immediately
//         resultsDiv.innerHTML += `<div>${id}: ${start} - ${end}</div>`;
//         resultsDiv.style.fontSize = "20px";

//         // Create the bar but keep it hidden initially
//         const bar = document.createElement('div');
//         bar.className = 'gantt-bar';
//         bar.style.width = `${(end - start) * 10}px`; // Scale the width
//         bar.style.backgroundColor = id === "Idle" ? 'gray' : getRandomPastelColor(); // Use random pastel color
//         bar.innerText = id;
//         bar.style.position = 'relative'; // Position relative for animation
//         bar.style.transform = 'translateX(100%)'; // Start from the right
//         bar.style.visibility = 'hidden'; // Hide the bar initially
//         ganttChartDiv.appendChild(bar);

//         // Use setTimeout to display the bar after the delay
//         setTimeout(() => {
//             bar.style.visibility = 'visible'; // Show the bar
//             bar.style.transition = 'transform 0.5s ease'; // Smooth transition
//             bar.style.transform = 'translateX(0)'; // Move to original position
//         }, index * 1000); // Delay of 500 ms for each bar
//     });
// }

function displayResults(ganttChart) {
    const resultsDiv = document.getElementById('results');
    const ganttChartDiv = document.getElementById('ganttChart');
    resultsDiv.innerHTML = '';
    ganttChartDiv.innerHTML = '';

    // Create a table element for the results
    const table = document.createElement('table');
    table.style.width = '60%';
    table.style.borderCollapse = 'collapse';
    table.style.margin = '0 auto'; // This will center the table


    // Style the table cells
    table.querySelectorAll('td, th').forEach(cell => {
        cell.style.border = '1px solid white'; 
        cell.style.color = '#1d1d1d'; 
    });

    // Create header row
    const headerRow = document.createElement('tr');
    const headers = ['ID', 'Start', 'End'];

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.style.border = '1px solid white';
        header.style.padding = '8px';
        header.style.fontSize = '20px';
        header.style.color = 'white'; 
        header.innerText = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    // Fill table with Gantt chart data
    ganttChart.forEach((segment, index) => {
        const { id, start, end } = segment;

        const row = document.createElement('tr');

        [id, start, end].forEach(cellText => {
            const cell = document.createElement('td');
            cell.style.border = '1px solid white';
            cell.style.padding = '8px';
            cell.style.fontSize = '18px';
            cell.style.color = 'white'; 
            cell.innerText = cellText;
            row.appendChild(cell);
        });

        table.appendChild(row);

        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.style.position = 'relative';
        barContainer.style.margin = '10px 0';

        const bar = document.createElement('div');
        bar.className = 'gantt-bar';
        bar.style.width = `${(end - start) * 10}px`; 
        // if(id=='Idle' && ((start+1)==end)){
        //     bar.style.width = `${(end - start) * 35}px`;
        // }
        bar.style.backgroundColor = id === "Idle" ? 'gray' : getRandomPastelColor(); 
        bar.innerText = id;
        bar.style.height = '40px';
        bar.style.textAlign = 'center';
        bar.style.position = 'relative'; 
        bar.style.transform = 'translateX(100%)'; 
        bar.style.visibility = 'hidden'; 

        bar.addEventListener('mouseover', function() {
            bar.style.transform = 'translateY(-10px)';
            timeLabel.style.transform = 'translateY(-10px)';
            bar.style.borderRadius = '5px';

        });
        
        // Optional: Reset the scale back to normal when the mouse leaves
        bar.addEventListener('mouseout', function() {
            bar.style.transform = 'translateY(0px)';
            timeLabel.style.transform = 'translateY(0px)';
            bar.style.borderRadius = '5px 0 0 0';
        });
        

        const timeLabel = document.createElement('div');
        timeLabel.style.display = 'flex';
        timeLabel.style.justifyContent = 'space-between';
        timeLabel.style.width = `${(end - start) * 10}px`; 
        timeLabel.style.visibility = 'hidden'; 

        const startTimeLabel = document.createElement('span');
        startTimeLabel.innerText = start;
        const endTimeLabel = document.createElement('span');
        endTimeLabel.innerText = end;

        timeLabel.appendChild(startTimeLabel);
        timeLabel.appendChild(endTimeLabel);

        barContainer.appendChild(bar);
        barContainer.appendChild(timeLabel);

        ganttChartDiv.appendChild(barContainer);

        setTimeout(() => {
            bar.style.visibility = 'visible'; 
            timeLabel.style.visibility = 'visible'; 
            bar.style.transition = 'transform 0.5s ease'; 
            timeLabel.style.transition = 'transform 0.5s ease'; 
            bar.style.transform = 'translateX(0)'; 
            timeLabel.style.transform = 'translateX(0)'; 
        }, index * 1000); 
    });

    resultsDiv.appendChild(table);

    // Calculate average waiting time and turnaround time
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const numProcesses = ganttChart.length;

    ganttChart.forEach(segment => {
        const waitingTime = segment.start; // Assuming start is the waiting time
        const turnaroundTime = segment.end - segment.start;
        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
    });

    const avgWaitingTime = totalWaitingTime / numProcesses;
    const avgTurnaroundTime = totalTurnaroundTime / numProcesses;

    // Create a new table for average times
    const avgTable = document.createElement('table');
    avgTable.style.width = '100%';
    avgTable.style.borderCollapse = 'collapse';

    const avgHeaders = ['Average Waiting Time', 'Average Turnaround Time'];

    const avgHeaderRow = document.createElement('tr');
    avgHeaders.forEach(headerText => {
        const avgHeader = document.createElement('th');
        avgHeader.style.border = '1px solid white';
        avgHeader.style.padding = '8px';
        avgHeader.style.fontSize = '20px';
        avgHeader.style.color = 'white';
        avgHeader.innerText = headerText;
        avgHeaderRow.appendChild(avgHeader);
    });
    avgTable.appendChild(avgHeaderRow);

    const avgRow = document.createElement('tr');
    const avgValues = [avgWaitingTime.toFixed(2), avgTurnaroundTime.toFixed(2)];
    avgValues.forEach(value => {
        const avgCell = document.createElement('td');
        avgCell.style.border = '1px solid white';
        avgCell.style.padding = '8px';
        avgCell.style.fontSize = '18px';
        avgCell.style.color = 'white';
        avgCell.innerText = value;
        avgRow.appendChild(avgCell);
    });
    avgTable.appendChild(avgRow);

    // Append the average table to the ganttChartDiv instead of resultsDiv
    ganttChartDiv.appendChild(avgTable);
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

