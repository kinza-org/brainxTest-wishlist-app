if (!customElements.get("wishlist-button")) {
  class WishlistButton extends HTMLElement {
    constructor() {
      super();
      this.apiBaseUrl = "https://brainx-test-wishlist-app-backend.vercel.app/";
      this.button = this.querySelector("button");
      this.spinner = this.querySelector(".loading__spinner");
      this.productId = this.button?.dataset.productId;
      this.customerId = this.button?.dataset.customerId;
      this.isInWishlist = false;
      this.buttonText = this.button.querySelector("span");
    }

    async connectedCallback() {
      // Redirect to login if not logged in
      if (!this.customerId || this.customerId === "") {
       if (!window.location.pathname.includes('/account/login') && !window.location.pathname.includes('/account/register')) {
              sessionStorage.setItem('redirectAfterLogin', window.location.href);
        }
        this.button.addEventListener("click", () => {
          window.location.href = "/account/login";
        });
        return;
      }

      // Load current wishlist and set state
      const wishlist = await this.getWishlist();

      this.isInWishlist = wishlist.includes(this.productId);
     // this.updateButton();

      // Toggle wishlist state on click
      this.button.addEventListener("click", async () => {
        this.spinner.classList.remove("hidden");
        this.buttonText.classList.add("hidden");
        this.spinner.classList.add("loading");

        try {
          if (this.button.classList.contains("remove-wishlist")) {
              await this.removeFromWishlist();
          } else {
              await this.addToWishlist();
          }
        } finally {
            this.spinner.classList.remove("loading");
            this.spinner.classList.add("hidden");
            this.buttonText.classList.remove("hidden");
        }
      });
    }

    updateButton() {
      if (this.buttonText) {
        this.buttonText.textContent = this.button.classList.contains("remove-wishlist")
        ? "Remove from Wishlist"
        : "Add to Wishlist";
      }
    }

    async getWishlist() {
      try {
        const res = await fetch(`${this.apiBaseUrl}/api/wishlist/${this.customerId}`);
        const data = await res.json();
        return data.wishlist || [];
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        return [];
      }
    }

    async addToWishlist() {
      try {
        await fetch(`${this.apiBaseUrl}/api/wishlist/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: this.customerId,
            productId: this.productId,
          }),
        });
        this.button.classList.remove("add-wishlist");
        this.button.classList.add("remove-wishlist");
        this.updateButton();
        this.isInWishlist = true;
      } catch (err) {
        console.error("Error adding to wishlist:", err);
      }
    }

    async removeFromWishlist() {
      try {
        await fetch(`${this.apiBaseUrl}/api/wishlist/remove`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: this.customerId,
            productId: this.productId,
          }),
        });
        this.button.classList.remove("remove-wishlist");
        this.button.classList.add("add-wishlist");
        this.updateButton();
        this.isInWishlist = false;
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }
    }
  }

  customElements.define("wishlist-button", WishlistButton);
}
