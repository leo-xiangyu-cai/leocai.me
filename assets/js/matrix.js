// Matrix rain effect
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters to display
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    
    // Convert the string into an array of single characters
    const charactersArray = characters.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize; // Number of columns for the rain
    
    // An array of drops - one per column
    const drops = [];
    
    // x below is the x coordinate
    // 1 = y coordinate of the drop (same for every drop initially)
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    // Drawing the characters
    function draw() {
        // Black BG for the canvas
        // Translucent to show trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set color and font
        ctx.fillStyle = '#0f0'; // Green text
        ctx.font = fontSize + 'px monospace';
        
        // Loop over drops
        for (let i = 0; i < drops.length; i++) {
            // Get a random character
            const text = charactersArray[Math.floor(Math.random() * charactersArray.length)];
            
            // x = i * fontSize, y = drops[i] * fontSize
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Sending the drop back to the top randomly after it has crossed the screen
            // Adding randomness to the reset to make the drops scattered on the Y axis
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Incrementing Y coordinate
            drops[i]++;
        }
    }
    
    // Set interval to call draw function
    setInterval(draw, 35);
    
    // Resize canvas when window is resized
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
