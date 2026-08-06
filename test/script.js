// Interactive effects for the digital business card

document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animate the card on load
    const card = document.querySelector('.card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
    
    // Add smooth scroll behavior for email link
    const emailLink = document.querySelector('.email');
    emailLink.addEventListener('click', function(e) {
        // Allow default behavior but add a visual feedback
        this.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
        setTimeout(() => {
            this.style.textShadow = 'none';
        }, 300);
    });
    
    // Avatar animation on click
    const avatar = document.querySelector('.avatar');
    avatar.style.cursor = 'pointer';
    
    avatar.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'glow 3s ease-in-out infinite';
        }, 10);
    });
    
    avatar.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    avatar.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Parallax effect on card
    document.addEventListener('mousemove', function(e) {
        const card = document.querySelector('.card');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const rotateX = (mouseY - 0.5) * 5;
        const rotateY = (mouseX - 0.5) * 5;
        
        // Optional subtle 3D effect (uncomment to enable)
        // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

// Prevent context menu if desired (optional)
// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
// });
