(function () {
  const NS = "http://www.w3.org/2000/svg";

  function seeded(seed) {
    let h = 2166136261;
    String(seed).split("").forEach((char) => {
      h ^= char.charCodeAt(0);
      h = Math.imul(h, 16777619);
    });
    return () => {
      h += h << 13;
      h ^= h >>> 7;
      h += h << 3;
      h ^= h >>> 17;
      h += h << 5;
      return ((h >>> 0) % 1000) / 1000;
    };
  }

  function profilePath(points, width, height, offset) {
    return points.map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - point * height * 0.62 - offset;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  }

  function topoThumb({ tint = "#8a9d5e", seed = "trail", profile, width = 620, height = 380 } = {}) {
    const rand = seeded(seed);
    const base = profile || Array.from({ length: 9 }, (_, index) => {
      const slope = Math.sin((index / 8) * Math.PI) * 0.38;
      return 0.22 + slope + rand() * 0.18;
    });
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Abstract trail elevation and contour illustration");
    svg.classList.add("topo-thumb");

    const defs = document.createElementNS(NS, "defs");
    defs.innerHTML = `
      <linearGradient id="g-${seed}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${tint}" stop-opacity=".86"/>
        <stop offset=".58" stop-color="#fff7e8" stop-opacity=".82"/>
        <stop offset="1" stop-color="#234332" stop-opacity=".82"/>
      </linearGradient>
      <pattern id="p-${seed}" width="52" height="52" patternUnits="userSpaceOnUse">
        <path d="M -12 28 C 5 9, 24 9, 52 28 S 84 47, 104 28" fill="none" stroke="#1d3326" stroke-opacity=".13" stroke-width="1.2"/>
      </pattern>
    `;
    svg.appendChild(defs);

    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("width", width);
    bg.setAttribute("height", height);
    bg.setAttribute("fill", `url(#g-${seed})`);
    svg.appendChild(bg);

    const pattern = document.createElementNS(NS, "rect");
    pattern.setAttribute("width", width);
    pattern.setAttribute("height", height);
    pattern.setAttribute("fill", `url(#p-${seed})`);
    svg.appendChild(pattern);

    [28, 64, 102].forEach((offset, i) => {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", profilePath(base, width, height, offset));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", i === 0 ? "#fffdf8" : "#18231c");
      path.setAttribute("stroke-opacity", i === 0 ? ".92" : ".2");
      path.setAttribute("stroke-width", i === 0 ? "5" : "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
    });

    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", width * (0.68 + rand() * 0.12));
    dot.setAttribute("cy", height * (0.34 + rand() * 0.18));
    dot.setAttribute("r", "8");
    dot.setAttribute("fill", "#fffdf8");
    dot.setAttribute("opacity", ".94");
    svg.appendChild(dot);

    return svg;
  }

  window.Topo = { topoThumb };
})();
