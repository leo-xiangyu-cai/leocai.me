// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Command input handling
    const commandInput = document.getElementById('command-input');
    const terminalOutput = document.getElementById('terminal-output');
    let commandHistory = [];
    let historyIndex = -1;

    if (commandInput) {
        // Update cursor position
        function updateCursor() {
            const cursor = document.querySelector('.cursor');
            const currentLine = document.querySelector('.current-line');
            if (cursor && currentLine) {
                const text = commandInput.value;
                const cursorPosition = commandInput.selectionStart;
                currentLine.textContent = text;
                
                // Create a temporary span to measure text width
                const measureSpan = document.createElement('span');
                measureSpan.style.font = window.getComputedStyle(currentLine).font;
                measureSpan.style.visibility = 'hidden';
                measureSpan.style.position = 'absolute';
                measureSpan.style.whiteSpace = 'pre';
                measureSpan.textContent = text.substring(0, cursorPosition);
                currentLine.appendChild(measureSpan);
                
                // Position cursor - account for the terminal prompt width
                const promptWidth = document.querySelector('.terminal-prompt').getBoundingClientRect().width;
                const textWidth = measureSpan.getBoundingClientRect().width;
                cursor.style.left = `${promptWidth + textWidth + 10}px`; // 10px for spacing
                
                // Clean up
                currentLine.removeChild(measureSpan);
            }
        }

        // Handle input changes
        commandInput.addEventListener('input', function(e) {
            updateCursor();
            const currentLine = document.querySelector('.current-line');
            if (currentLine) {
                currentLine.textContent = this.value;
            }
        });

        // Handle cursor movement and key events
        commandInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const command = commandInput.value.trim();
                if (command) {
                    processCommand(command);
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    commandInput.value = '';
                    const currentLine = document.querySelector('.current-line');
                    if (currentLine) {
                        currentLine.textContent = '';
                    }
                    updateCursor();
                    
                    // Scroll to bottom after command execution
                    setTimeout(() => {
                        const terminalBody = document.querySelector('.terminal-body');
                        if (terminalBody) {
                            terminalBody.scrollTop = terminalBody.scrollHeight;
                        }
                    }, 10);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    commandInput.value = commandHistory[historyIndex];
                    const currentLine = document.querySelector('.current-line');
                    if (currentLine) {
                        currentLine.textContent = commandHistory[historyIndex];
                    }
                    // Set cursor to end of input
                    commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length;
                    updateCursor();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    commandInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    commandInput.value = '';
                }
                const currentLine = document.querySelector('.current-line');
                if (currentLine) {
                    currentLine.textContent = commandInput.value;
                }
                // Set cursor to end of input
                commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length;
                updateCursor();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
                setTimeout(updateCursor, 0);
            }
        });

        // Update cursor on mouse clicks within input
        commandInput.addEventListener('mouseup', updateCursor);
        commandInput.addEventListener('mousedown', updateCursor);
        commandInput.addEventListener('click', updateCursor);

        // Keep focus on input when clicking anywhere in the terminal
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) {
            terminalBody.addEventListener('click', function(e) {
                // Check if we're clicking on an interactive element
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
                    e.target.closest('a') || e.target.closest('button')) {
                    // Don't focus input when clicking links or buttons
                    return;
                }
                
                // Store current scroll position
                const scrollPosition = terminalBody.scrollTop;
                
                // Focus the input without scrolling
                commandInput.focus({preventScroll: true});
                
                // Update cursor
                updateCursor();
                
                // Ensure scroll position is maintained
                terminalBody.scrollTop = scrollPosition;
            });
        }

        // Initial focus and cursor position
        commandInput.focus();
        updateCursor();
    }

    // Process commands
    function processCommand(command) {
        addToTerminal(`<div class="terminal-line">
            <span class="terminal-prompt">leo@redshift</span>
            <span class="terminal-command">${command}</span>
        </div>`);

        // Process different commands
        if (command === 'help') {
            showHelp();
        } else if (command === 'about') {
            showAbout();
        } else if (command === 'skills') {
            showSkills();
        } else if (command === 'contact') {
            showContact();
        } else if (command === 'blog') {
            window.location.href = '/blog';
        } else if (command === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (command === 'motto') {
            showMotto();
        } else if (command.startsWith('echo ')) {
            const message = command.substring(5);
            addToTerminal(`<div class="terminal-output">${message}</div>`);
        } else {
            addToTerminal(`<div class="terminal-output">Command not found: ${command}. Type 'help' for available commands.</div>`);
        }

        // Scroll to bottom after adding content
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    function addToTerminal(html) {
        terminalOutput.innerHTML += html;
    }

    function showHelp() {
        addToTerminal(`<div class="terminal-output">
            <p>Available commands:</p>
            <p><span class="help-command">help</span> <span class="help-description">- Show this help message</span></p>
            <p><span class="help-command">about</span> <span class="help-description">- Learn about Leo Cai</span></p>
            <p><span class="help-command">skills</span> <span class="help-description">- View technical skills</span></p>
            <p><span class="help-command">contact</span> <span class="help-description">- Get contact information</span></p>
            <p><span class="help-command">blog</span> <span class="help-description">- Visit the blog</span></p>
            <p><span class="help-command">motto</span> <span class="help-description">- Display personal motto</span></p>
            <p><span class="help-command">clear</span> <span class="help-description">- Clear the terminal</span></p>
            <p><span class="help-command">echo [message]</span> <span class="help-description">- Display a message</span></p>
        </div>`);
    }

    function showAbout() {
        addToTerminal(`<div class="terminal-output">
            <p>Hello, I'm Leo Cai!</p>
            <p>I'm a Software Engineer at AWS Redshift, passionate about database engineering,
            distributed systems, and finding elegant solutions to complex problems.</p>
            <p>My philosophy is "Best coding is no coding" - sometimes the best solution
            isn't adding more code, but finding simpler ways to solve problems.</p>
        </div>`);
    }

    function showSkills() {
        addToTerminal(`<div class="terminal-output">
            <div class="terminal-grid">
                <div class="terminal-card">
                    <h3>Programming</h3>
                    <ul class="terminal-list">
                        <li>Java</li>
                        <li>Kotlin</li>
                        <li>Python</li>
                        <li>C#</li>
                        <li>JS/TS</li>
                    </ul>
                </div>

                <div class="terminal-card">
                    <h3>Frontend</h3>
                    <ul class="terminal-list">
                        <li>Angular</li>
                        <li>React</li>
                    </ul>
                </div>

                <div class="terminal-card">
                    <h3>Backend</h3>
                    <ul class="terminal-list">
                        <li>Spring</li>
                        <li>.NET Core</li>
                        <li>Flask</li>
                    </ul>
                </div>

                <div class="terminal-card">
                    <h3>Mobile</h3>
                    <ul class="terminal-list">
                        <li>Android</li>
                        <li>Compose</li>
                    </ul>
                </div>

                <div class="terminal-card">
                    <h3>Databases</h3>
                    <ul class="terminal-list">
                        <li>PostgreSQL</li>
                        <li>MongoDB</li>
                        <li>DynamoDB</li>
                    </ul>
                </div>

                <div class="terminal-card">
                    <h3>Cloud</h3>
                    <ul class="terminal-list">
                        <li>AWS</li>
                    </ul>
                </div>
            </div>
        </div>`);
    }

    function showContact() {
        addToTerminal(`<div class="terminal-output">
            <div class="terminal-social">
                <a href="https://github.com/leo-xiangyu-cai" target="_blank">github.com/leo-xiangyu-cai</a>
                <a href="https://www.linkedin.com/in/xiangyu-cai-27b6a4a5/" target="_blank">linkedin.com/in/xiangyu-cai</a>
            </div>
        </div>`);
    }

    function showMotto() {
        addToTerminal(`<div class="terminal-output">
            <p class="ascii-art">
  ____           _     ____          _ _                 _          _   _          ____          _ _             
 | __ )  ___  __| |_  / ___|___   __| (_)_ __   __ _   (_)___     | \\ | | ___    / ___|___   __| (_)_ __   __ _ 
 |  _ \\ / _ \\/ _\` | |/ /   / _ \\ / _\` | | '_ \\ / _\` |  | / __|    |  \\| |/ _ \\  / /   / _ \\ / _\` | | '_ \\ / _\` |
 | |_) |  __/ (_| |   <   | (_) | (_| | | | | | (_| |_ | \\__ \\    | |\\  | (_) |/ /___| (_) | (_| | | | | | (_| |
 |____/ \\___|\\__,_|_|\\_\\   \\___/ \\__,_|_|_| |_|\\__, (_)/ |___/    |_| \\_|\\___/ \\____/\\___/ \\__,_|_|_| |_|\\__, |
                                                |___/ |__/                                                |___/ 
            </p>
            <p>Sometimes the best solution isn't adding more code, but finding simpler ways to solve problems.</p>
        </div>`);
    }

    // Handle terminal tabs
    const tabs = document.querySelectorAll('.terminal-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            // If it's not the active tab and not the blog tab (which should navigate)
            if (!this.classList.contains('active') && this.getAttribute('href') !== '/blog') {
                e.preventDefault();
                
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
            }
        });
    });

    // Show welcome message
    if (terminalOutput) {
        addToTerminal(`<div class="terminal-output">
            <p>Welcome to Leo Cai's terminal. Type 'help' to see available commands.</p>
        </div>`);
    }
});
