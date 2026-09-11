
document.querySelectorAll('.cart-form').forEach((cartForm) => {
    cartForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = cartForm.querySelector('button');
        const cartComponent = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        const formData = new FormData(cartForm);

        // Set loading state
        cartForm.classList.add('loading');
        submitButton.disabled = true;

        // Prepare sections data for cart component
        if (cartComponent) {
            formData.append(
                'sections',
                cartComponent.getSectionsToRender().map((section) => section.id)
            );
            formData.append('sections_url', location.pathname);
            cartComponent.setActiveElement(submitButton);
        }

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                body: formData,
            });

            const responseData = await response.json();

            if (responseData.status) {
                alert(responseData.description || 'Error adding to cart');
            } else if (cartComponent) {
                cartComponent.renderContents(responseData);
            } else {
                location.href = '/cart';
            }
        } catch (error) {
            alert('Error adding to cart');
        } finally {
            // Reset loading state
            cartForm.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
});

const wishlistLoginBtn = document.querySelector('.wishlist-login');
wishlistLoginBtn.addEventListener('click', (event) => {
    if (!window.location.pathname.includes('/account/login') && !window.location.pathname.includes('/account/register')) {
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
    }
});
