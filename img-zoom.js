/* Click a lesson figure to enlarge it. Second click shows the original size. Esc or backdrop closes. */
(function () {
  if (document.getElementById("img-zoom")) return;

  var style = document.createElement("style");
  style.textContent = [
    "figure img { cursor: zoom-in; touch-action: manipulation; }",
    "figure img:hover { border-color: var(--accent, #8ab4f8); }",
    "#img-zoom {",
    "  position: fixed; inset: 0; z-index: 80;",
    "  background: rgba(8, 10, 14, .93);",
    "  display: flex; align-items: center; justify-content: center;",
    "  padding: 1.15rem 1rem 2.6rem;",
    "  overflow: auto;",
    "  cursor: zoom-out;",
    "  -webkit-overflow-scrolling: touch;",
    "}",
    "#img-zoom[hidden] { display: none; }",
    "#img-zoom img {",
    "  display: block;",
    "  max-width: min(96vw, 100%);",
    "  max-height: calc(100vh - 3.6rem);",
    "  width: auto; height: auto;",
    "  border-radius: 8px;",
    "  cursor: zoom-in;",
    "  user-select: none;",
    "  box-shadow: 0 8px 40px rgba(0,0,0,.45);",
    "}",
    "#img-zoom.native { align-items: flex-start; justify-content: safe center; }",
    "#img-zoom.native img { max-width: none; max-height: none; cursor: zoom-out; }",
    "#img-zoom .hint {",
    "  position: fixed; bottom: .5rem; left: 0; right: 0;",
    "  text-align: center; color: #9aa0a6;",
    "  font-size: .78rem; pointer-events: none;",
    "}"
  ].join("\n");
  document.head.appendChild(style);

  var box = document.createElement("div");
  box.id = "img-zoom";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "放大图片");
  box.tabIndex = -1;

  var pic = document.createElement("img");
  pic.alt = "";
  var hint = document.createElement("div");
  hint.className = "hint";
  box.appendChild(pic);
  box.appendChild(hint);
  document.body.appendChild(box);

  var native = false;

  function setHint() {
    hint.textContent = native
      ? "单击缩小 · 可滚动查看原图 · 点击空白处或按 Esc 关闭"
      : "再单击看原图大小 · 点击空白处或按 Esc 关闭";
  }

  function open(src, alt) {
    pic.src = src;
    pic.alt = alt || "";
    native = false;
    box.classList.remove("native");
    box.hidden = false;
    document.body.style.overflow = "hidden";
    setHint();
    box.focus();
  }

  function close() {
    if (box.hidden) return;
    box.hidden = true;
    pic.removeAttribute("src");
    pic.alt = "";
    box.classList.remove("native");
    document.body.style.overflow = "";
    native = false;
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.matches && t.matches("figure img") && !box.contains(t)) {
      e.preventDefault();
      open(t.currentSrc || t.src, t.alt);
    }
  });

  box.addEventListener("click", function (e) {
    if (e.target === pic) {
      if (!native && pic.naturalWidth && pic.naturalWidth <= pic.clientWidth + 4) {
        close();
        return;
      }
      native = !native;
      box.classList.toggle("native", native);
      setHint();
      if (native) {
        box.scrollTop = 0;
        box.scrollLeft = 0;
      }
    } else if (e.target !== hint) {
      close();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) {
      e.preventDefault();
      close();
    }
  });
})();
