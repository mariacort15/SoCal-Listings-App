

document.addEventListener("DOMContentLoaded", () => {
  initDeleteButtons();
  initEditToggles();
});

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  if (!deleteButtons.length) return;

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const propertyId = btn.dataset.id;
      if (!propertyId) {
        console.error("Delete button missing data-id");
        return;
      }

      const confirmed = confirm(
        "Are you sure you want to delete this property?"
      );
      if (!confirmed) return;

      try {
        const res = await fetch(`/properties/${propertyId}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        });

        if (res.ok) {
          alert("Property deleted successfully.");
          window.location.reload();
        } else {
          let data = {};
          try {
            data = await res.json();
          } catch (err) {
          
          }
          alert(data.message || "Error deleting property.");
        }
      } catch (err) {
        console.error("Error deleting property:", err);
        alert("Network error while deleting property.");
      }
    });
  });
}


function initEditToggles() {
  const editButtons = document.querySelectorAll(".edit-btn");
  if (!editButtons.length) return;

  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const card = btn.closest(".card, .property-card");
      if (!card) return;

      const form = card.querySelector(".edit-form");
      if (!form) return;

      const isVisible =
        form.style.display === "block" || form.style.display === "";
      form.style.display = isVisible ? "none" : "block";
    });
  });
}