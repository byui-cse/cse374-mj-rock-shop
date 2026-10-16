function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
  element.hidden = false;
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
    error.hidden = true;
  });
  form.querySelectorAll(".input-error").forEach((input) => input.classList.remove("input-error"));
}

function validateForm(form) {
  clearErrors(form);
  const invalidFields = [];
  form.querySelectorAll("[required]").forEach((field) => {
    let message = "";
    if (!field.value.trim()) {
      message = "This field is required.";
    } else if (field.type === "email" && !field.validity.valid) {
      message = "Enter an email address in a format like name@example.com.";
    }
    if (message) {
      const error = document.querySelector(`#${field.id}-error`);
      error.textContent = message;
      error.hidden = false;
      field.classList.add("input-error");
      field.setAttribute("aria-invalid", "true");
      invalidFields.push(field);
    } else {
      field.removeAttribute("aria-invalid");
    }
  });
  if (invalidFields.length) invalidFields[0].focus();
  return invalidFields.length === 0;
}

function clearFormFields(form) {
  form.querySelectorAll("input, textarea").forEach((field) => { field.value = ""; });
  clearErrors(form);
}

function setupContactForm(formId, statusId, recordType, successMessage) {
  const form = document.querySelector(`#${formId}`);
  const status = document.querySelector(`#${statusId}`);
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.hidden = true;
    if (!validateForm(form)) {
      setStatus(status, "Please correct the highlighted fields before submitting.", true);
      return;
    }
    const values = Object.fromEntries(new FormData(form).entries());
    form.setAttribute("aria-busy", "true");
    try {
      await apiFetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: recordType, ...values }),
      });
      clearFormFields(form);
      setStatus(status, successMessage);
    } catch (error) {
      setStatus(status, error.message || "The message could not be saved. Try again.", true);
    } finally {
      form.removeAttribute("aria-busy");
    }
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearErrors(form);
      status.hidden = true;
    }, 0);
  });
}

setupContactForm("contact-form", "message-status", "message", "Your mock message was accepted and saved in the local classroom database.");
setupContactForm("interest-form", "interest-status", "interest", "Your mock contact information and interest were saved in the local classroom database.");

