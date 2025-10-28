// Prevent redefining if script runs multiple times
if (!customElements.get("wishlist-button")) {
  class WishlistButton extends HTMLElement {
    constructor() {
      super();
      this.apiBaseUrl = "https://brainxtest-wishlist-app-backend.vercel.app";
      this.button = this.querySelector("button");
      this.productId = this.button?.dataset.productId;
      this.customerId = this.button?.dataset.customerId;
      this.isInWishlist = false;
    }

    async connectedCallback() {
      // Redirect to login if not logged in
      if (!this.customerId || this.customerId === "") {
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
        if (this.isInWishlist) {
          await this.removeFromWishlist();
          this.isInWishlist = false;
        } else {
          await this.addToWishlist();
          this.isInWishlist = true;
        }
      // this.updateButton();
      });
    }

    updateButton() {
      this.button.textContent = this.isInWishlist
        ? "Remove from Wishlist"
        : "Add to Wishlist";
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
        this.updateButton();
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
        this.updateButton();
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }
    }
  }

  customElements.define("wishlist-button", WishlistButton);
}
