const EVENT = {
  title: "Lễ tốt nghiệp của Phạm Viết Dũng Minh",
  start: new Date("2026-11-25T07:00:00+07:00"),
  end: new Date("2026-11-25T11:30:00+07:00"),
  location: "Trường Đại học Công nghiệp TP.HCM, 12 Nguyễn Văn Bảo, phường Hạnh Thông, TP.HCM",
  description: "Lễ trao bằng từ 07:00–09:30, chụp hình từ 09:30–11:30. Cùng Dũng Minh lưu lại một dấu mốc thật đẹp trong ngày lễ tốt nghiệp."
};

const pad = (value) => String(Math.max(0, value)).padStart(2, "0");

const graduateAvatar = document.getElementById("graduateAvatar");
const hideMissingAvatar = () => {
  graduateAvatar.hidden = true;
};
graduateAvatar.addEventListener("error", hideMissingAvatar);
if (graduateAvatar.complete && graduateAvatar.naturalWidth === 0) hideMissingAvatar();

function updateCountdown() {
  const distance = EVENT.start.getTime() - Date.now();
  if (distance <= 0) {
    document.getElementById("countdown-title").textContent = "Hôm nay là ngày đặc biệt!";
    ["days", "hours", "minutes", "seconds"].forEach((id) => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  document.getElementById("days").textContent = pad(Math.floor(distance / 86400000));
  document.getElementById("hours").textContent = pad(Math.floor((distance / 3600000) % 24));
  document.getElementById("minutes").textContent = pad(Math.floor((distance / 60000) % 60));
  document.getElementById("seconds").textContent = pad(Math.floor((distance / 1000) % 60));
}

function toCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

document.getElementById("calendarButton").addEventListener("click", () => {
  const calendarUrl = new URL("https://calendar.google.com/calendar/render");
  calendarUrl.searchParams.set("action", "TEMPLATE");
  calendarUrl.searchParams.set("text", EVENT.title);
  calendarUrl.searchParams.set("dates", `${toCalendarDate(EVENT.start)}/${toCalendarDate(EVENT.end)}`);
  calendarUrl.searchParams.set("details", EVENT.description);
  calendarUrl.searchParams.set("location", EVENT.location);
  window.open(calendarUrl, "_blank", "noopener,noreferrer");
});

const toast = document.getElementById("toast");
document.getElementById("shareButton").addEventListener("click", async () => {
  try {
    if (navigator.share) {
      await navigator.share({ title: EVENT.title, text: EVENT.description, url: window.location.href });
      toast.textContent = "Cảm ơn bạn đã chia sẻ ngày vui này ♡";
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.textContent = "Đã sao chép đường dẫn thiệp!";
    }
  } catch (error) {
    if (error.name !== "AbortError") toast.textContent = "Bạn có thể sao chép đường dẫn trên thanh địa chỉ.";
  }
});

document.querySelector(".sound-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const paused = button.classList.toggle("paused");
  document.body.classList.toggle("effects-paused", paused);
  button.setAttribute("aria-pressed", String(paused));
  button.setAttribute("aria-label", paused ? "Bật hiệu ứng" : "Tạm dừng hiệu ứng");
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const particleLayer = document.getElementById("waterParticles");

function createWaterParticles() {
  const particleCount = window.innerWidth <= 600 ? 20 : 34;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const isSpark = index % 6 === 0;
    const size = 3 + Math.random() * 7;

    particle.className = `water-particle${isSpark ? " spark" : ""}`;
    if (isSpark) particle.textContent = "✦";
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--spark-size", `${size + 5}px`);
    particle.style.setProperty("--duration", `${11 + Math.random() * 13}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 22}s`);
    particle.style.setProperty("--drift", `${-55 + Math.random() * 110}px`);
    particle.style.setProperty("--particle-opacity", `${0.28 + Math.random() * 0.42}`);
    fragment.appendChild(particle);
  }

  particleLayer.appendChild(fragment);
}

if (!reducedMotion) createWaterParticles();

if (reducedMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

updateCountdown();
setInterval(updateCountdown, 1000);
