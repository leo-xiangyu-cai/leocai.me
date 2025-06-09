// Terminal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for intro text
    const introText = document.querySelector('.intro-text');
    if (introText) {
        introText.innerHTML = '';
        const text = "Software Engineer @ AWS Redshift";
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                introText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Add blinking cursor after typing is complete
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                introText.appendChild(cursor);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    // Command history functionality
    const commandInput = document.getElementById('command-input');
    const terminalOutput = document.getElementById('terminal-output');
    let commandHistory = [];
    let historyIndex = -1;

    if (commandInput) {
        commandInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const command = commandInput.value.trim();
                if (command) {
                    processCommand(command);
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    commandInput.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    commandInput.value = commandHistory[historyIndex];
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
            }
        });
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
    }

    function addToTerminal(html) {
        terminalOutput.innerHTML += html;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
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
            <p class="terminal-section-title">Technical Skills:</p>
            <p><span class="command-keyword">Programming Languages:</span> Java, Kotlin, Python, C#, JavaScript/TypeScript</p>
            <p><span class="command-keyword">Frontend Development:</span> Angular, React</p>
            <p><span class="command-keyword">Backend Development:</span> Spring, .NET Core, Flask</p>
            <p><span class="command-keyword">Mobile Development:</span> Android Jetpack Compose</p>
            <p><span class="command-keyword">Databases:</span> PostgreSQL, MongoDB, DynamoDB</p>
            <p><span class="command-keyword">Cloud Services:</span> AWS Infrastructure</p>
            <p><span class="command-keyword">Languages:</span> Chinese (Native), English (Professional)</p>
        </div>`);
    }

    function showContact() {
        addToTerminal(`<div class="terminal-output">
            <p>Connect with me:</p>
            <p><span class="command-keyword">GitHub:</span> <a href="https://github.com/leo-xiangyu-cai" target="_blank">github.com/leo-xiangyu-cai</a></p>
            <p><span class="command-keyword">LinkedIn:</span> <a href="https://www.linkedin.com/in/xiangyu-cai-27b6a4a5/" target="_blank">linkedin.com/in/xiangyu-cai-27b6a4a5</a></p>
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

    // Auto-focus command input
    if (commandInput) {
        commandInput.focus();
        
        // Keep focus on input when clicking anywhere in the terminal
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) {
            terminalBody.addEventListener('click', function() {
                commandInput.focus();
            });
        }
    }

    // Show welcome message
    if (terminalOutput) {
        addToTerminal(`<div class="terminal-output">
            <p>Welcome to Leo Cai's terminal. Type 'help' to see available commands.</p>
        </div>`);
    }
});
