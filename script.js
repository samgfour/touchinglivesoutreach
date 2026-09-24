(function(){
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* mobile menu */
  var header = $("#siteHeader"), menuBtn = $(".menu");
  function closeMenu(){
    header.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function(){
    var open = header.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("#nav a").forEach(function(a){
    a.addEventListener("click", function(){
      closeMenu();
    });
  });
  document.addEventListener("keydown", function(event){
    if (event.key === "Escape" && header.classList.contains("open")) {
      closeMenu();
      menuBtn.focus();
    }
  });
  document.addEventListener("click", function(event){
    if (header.classList.contains("open") && !header.contains(event.target) && event.target !== menuBtn) {
      closeMenu();
    }
  });

  /* placeholder highlight toggle */
  var phBtn = $("#phToggle");
  phBtn.addEventListener("click", function(){
    var on = document.body.classList.toggle("show-ph");
    phBtn.setAttribute("aria-pressed", on ? "true" : "false");
  });

  /* donation form (prototype: nothing is charged) */
  var form = $("#giveForm"), btn = $("#giveBtn"), impactEl = $("#donationImpact"),
      status = $("#giveStatus"), custom = $("#custom");
  var impact = {
    "25": "[What $25 provides]",
    "50": "[What $50 provides]",
    "120": "Sponsors one person's day on the annual trip. Confirm with the client.",
    "250": "[What $250 provides]"
  };
  function fmt(n){ return Math.round(n) === n ? String(n) : n.toFixed(2); }
  function selected(){ return form.querySelector("input[name=amount]:checked"); }
  function amount(){
    var sel = selected();
    if (!sel) return null;
    if (sel.value === "other"){
      var v = parseFloat(custom.value);
      return v > 0 ? v : null;
    }
    return Number(sel.value);
  }
  function update(){
    var a = amount(), sel = selected();
    var f = form.querySelector("input[name=freq]:checked").value;
    impactEl.textContent = sel.value === "other" ? "Any amount is welcome." : impact[sel.value];
    btn.textContent = a ? "Donate $" + fmt(a) + (f === "monthly" ? " every month" : " once") : "Enter an amount";
    btn.disabled = !a;
    status.textContent = "";
  }
  form.addEventListener("change", function(e){
    if (e.target.id === "a-other") custom.focus();
    update();
  });
  custom.addEventListener("input", function(){
    $("#a-other").checked = true;
    update();
  });
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if (btn.disabled) return;
    status.textContent = "Prototype only: payments are not connected, so nothing was charged. On the live site this opens a secure checkout for Touching Lives Outreach, Inc.";
  });
  update();

  /* volunteer form validation */
  function setFieldError(field, message){
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
    field.dataset.error = message || "";
  }
  function clearFieldError(field){
    if (!field) return;
    field.removeAttribute("aria-invalid");
    delete field.dataset.error;
  }
  var volForm = $("#volForm");
  volForm.addEventListener("submit", function(e){
    e.preventDefault();
    var valid = true;
    var nameField = $("#v-name");
    var emailField = $("#v-email");
    var roleChecks = volForm.querySelectorAll('input[name="role"]');
    var anyRole = Array.prototype.some.call(roleChecks, function(item){ return item.checked; });

    clearFieldError(nameField);
    clearFieldError(emailField);
    $("#volStatus").textContent = "";

    if (!nameField.value.trim()) {
      setFieldError(nameField, "Please enter your name.");
      valid = false;
    }

    var email = emailField.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(emailField, "Please enter a valid email address.");
      valid = false;
    }

    if (!anyRole) {
      $("#volStatus").textContent = "Please choose at least one way you’d like to help.";
      valid = false;
    }

    if (!valid) return;

    $("#volStatus").textContent = "Prototype only: this form is not connected yet, so nothing was sent.";
    volForm.reset();
  });

  /* toy drive sign-up (prototype) */
  $("#toyBtn").addEventListener("click", function(){
    $("#toyStatus").textContent = "Prototype only: sign-up is not connected yet.";
  });
})();
