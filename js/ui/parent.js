import { sanitizeName } from "../core/phrases.js";
import { hasViVoice } from "../audio/speak.js";

export function openParentModal(modalRoot, { progress, t, onUpdate, onReset }) {
  const s = progress.settings;
  const totalStars = Object.values(progress.stars || {}).reduce((a, b) => a + b, 0);
  const doneCount = Object.keys(progress.stars || {}).length;
  const viNotice = !hasViVoice() ? `<p style="background:var(--amber-bg);padding:10px;border-radius:12px;margin:0">${t("parent.noViVoice")}</p>` : "";

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="margin:0">${t("parent.title")}</h2>
        <button id="p-close" class="btn-pill" style="min-height:56px;font-size:20px">${t("parent.close")}</button>
      </div>
      ${viNotice}
      <label>${t("parent.lang")}
        <select id="p-lang" style="font-size:20px;padding:8px;width:100%">
          <option value="vi" ${s.lang === "vi" ? "selected" : ""}>Tiếng Việt</option>
          <option value="ja" ${s.lang === "ja" ? "selected" : ""}>日本語</option>
        </select>
      </label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <label>${t("parent.nameVi")}<input id="p-nvi" value="${s.nameVi}" maxlength="12" style="font-size:18px;padding:8px;width:100%"></label>
        <label>${t("parent.nameJa")}<input id="p-nja" value="${s.nameJa}" maxlength="8" style="font-size:18px;padding:8px;width:100%"></label>
        <label>${t("parent.speakVi")}<input id="p-svi" value="${s.speakVi || ""}" style="font-size:18px;padding:8px;width:100%"></label>
        <label>${t("parent.speakJa")}<input id="p-sja" value="${s.speakJa || ""}" style="font-size:18px;padding:8px;width:100%"></label>
      </div>
      <label>${t("parent.gender")}
        <select id="p-gender" style="font-size:18px;padding:8px;width:100%">
          <option value="f" ${s.gender === "f" ? "selected" : ""}>${t("parent.genderF")}</option>
          <option value="m" ${s.gender === "m" ? "selected" : ""}>${t("parent.genderM")}</option>
          <option value="n" ${s.gender === "n" ? "selected" : ""}>${t("parent.genderN")}</option>
        </select>
      </label>
      <label>${t("parent.volume")}
        <input id="p-vol" type="range" min="0" max="1" step="0.1" value="${s.volume ?? 0.9}" style="width:100%">
      </label>
      <label>${t("parent.dailyLimit")}
        <select id="p-limit" style="font-size:18px;padding:8px;width:100%">
          <option value="0" ${s.dailyLimit === 0 ? "selected" : ""}>${t("parent.limitOff")}</option>
          <option value="10" ${s.dailyLimit === 10 ? "selected" : ""}>${t("parent.limit10")}</option>
          <option value="20" ${s.dailyLimit === 20 ? "selected" : ""}>${t("parent.limit20")}</option>
          <option value="30" ${s.dailyLimit === 30 ? "selected" : ""}>${t("parent.limit30")}</option>
        </select>
      </label>
      <label style="display:flex;align-items:center;gap:10px;">
        <input id="p-eyes" type="checkbox" ${s.showSignEyes !== false ? "checked" : ""} style="width:24px;height:24px;">
        <span>${t("parent.signEyes")}</span>
      </label>
      <div><strong>${t("parent.progress")}:</strong> ${doneCount} / 82 (${totalStars} ★)</div>
      <button id="p-reset" class="btn-pill" style="background:var(--amber-bg);border-color:var(--amber);font-size:20px;">${t("parent.reset")}</button>
    </div>
  `;

  const apply = () => {
    onUpdate({
      lang: backdrop.querySelector("#p-lang").value,
      nameVi: sanitizeName(backdrop.querySelector("#p-nvi").value, "vi"),
      nameJa: sanitizeName(backdrop.querySelector("#p-nja").value, "ja"),
      speakVi: backdrop.querySelector("#p-svi").value.trim(),
      speakJa: backdrop.querySelector("#p-sja").value.trim(),
      gender: backdrop.querySelector("#p-gender").value,
      volume: Number(backdrop.querySelector("#p-vol").value),
      dailyLimit: Number(backdrop.querySelector("#p-limit").value),
      showSignEyes: backdrop.querySelector("#p-eyes").checked
    });
  };

  backdrop.querySelectorAll("input, select").forEach((el) => el.addEventListener("change", apply));
  backdrop.querySelector("#p-reset").addEventListener("click", () => {
    if (window.confirm(t("parent.resetConfirm").replace(/<[^>]+>/g, ""))) {
      onReset();
      backdrop.remove();
    }
  });
  backdrop.querySelector("#p-close").addEventListener("click", () => {
    apply();
    backdrop.remove();
  });

  modalRoot.innerHTML = "";
  modalRoot.appendChild(backdrop);
}
