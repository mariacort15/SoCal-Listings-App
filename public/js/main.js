
document.addEventListener("DOMContentLoaded", () => {
    
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const propertyId = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this property?")) {
          const res = await fetch(`/properties/${propertyId}`, { method: "DELETE" });
          if (res.ok) {
            alert("Property deleted!");
            window.location.reload();
          } else {
            alert("Error deleting property.");
          }
        }
      });
    });
  
    // Edit property
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        const form = card.querySelector(".edit-form");
        form.style.display = form.style.display === "block" ? "none" : "block";
      });
    });
  });