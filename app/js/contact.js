function saveMockRecord(type, record) {
  const storageKey = "mjs-rock-shop-contact-records";
  try {
    const existingRecords = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    existingRecords.push({ type, ...record, submittedAt: new Date().toISOString() });
    sessionStorage.setItem(storageKey, JSON.stringify(existingRecords));
  } catch (error) {
    // The prototype can still demonstrate a successful submission if storage
    // is unavailable, such as when a browser blocks session storage.
  }
}

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

function setupMockForm(formId, statusId, recordType, successMessage) {
  const form = document.querySelector(`#${formId}`);
  const status = document.querySelector(`#${statusId}`);
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.hidden = true;
    if (!validateForm(form)) {
      setStatus(status, "Please correct the highlighted fields before submitting.", true);
      return;
    }
    const values = Object.fromEntries(new FormData(form).entries());
    saveMockRecord(recordType, values);
    form.querySelectorAll("input, textarea").forEach((field) => {
      field.value = "";
    });
    clearErrors(form);
    setStatus(status, successMessage);
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearErrors(form);
      status.hidden = true;
    }, 0);
  });
}

setupMockForm("contact-form", "message-status", "message", "Your mock message was accepted. MJ would be able to review it in a connected version of the site.");
setupMockForm("interest-form", "interest-status", "interest", "Your mock contact information and interest were recorded for this browser session.");
