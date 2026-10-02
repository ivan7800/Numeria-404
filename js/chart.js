import { meaning } from "./numerology.js";

export function numerologyChartSVG(profile){
  const nodes=[
    {key:"Camino",value:profile.lifePath.value,angle:-90},
    {key:"Expresión",value:profile.expression.value,angle:-30},
    {key:"Alma",value:profile.soul.value,angle:30},
    {key:"Personalidad",value:profile.personality.value,angle:90},
    {key:"Madurez",value:profile.maturity,angle:150},
    {key:"Actitud",value:profile.attitude,angle:210}
  ];
  const cx=250,cy=250,r=170;
  const points=nodes.map(n=>{
    const a=n.angle*Math.PI/180;
    return {...n,x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r};
  });
  const polygon=points.map(p=>`${p.x},${p.y}`).join(" ");
  return `<svg class="numerology-wheel" viewBox="0 0 500 500" role="img" aria-label="Carta numerológica visual">
    <circle class="wheel-ring" cx="250" cy="250" r="190"/>
    <circle class="wheel-ring wheel-ring-inner" cx="250" cy="250" r="112"/>
    ${points.map(p=>`<line class="wheel-line" x1="250" y1="250" x2="${p.x}" y2="${p.y}"/>`).join("")}
    <polygon class="wheel-polygon" points="${polygon}"/>
    <circle class="wheel-core" cx="250" cy="250" r="62"/>
    <text class="wheel-core-number" x="250" y="247" text-anchor="middle">${profile.lifePath.value}</text>
    <text class="wheel-core-label" x="250" y="274" text-anchor="middle">CAMINO</text>
    ${points.map(p=>`<g class="wheel-node">
      <circle cx="${p.x}" cy="${p.y}" r="34"/>
      <text class="wheel-node-number" x="${p.x}" y="${p.y+5}" text-anchor="middle">${p.value}</text>
      <text class="wheel-node-label" x="${p.x}" y="${p.y+54}" text-anchor="middle">${p.key.toUpperCase()}</text>
    </g>`).join("")}
  </svg>`;
}

export function chartLegend(profile){
  return [
    ["Camino de Vida",profile.lifePath.value,meaning(profile.lifePath.value).title],
    ["Expresión",profile.expression.value,meaning(profile.expression.value).title],
    ["Alma",profile.soul.value,meaning(profile.soul.value).title],
    ["Personalidad",profile.personality.value,meaning(profile.personality.value).title],
    ["Madurez",profile.maturity,meaning(profile.maturity).title],
    ["Actitud",profile.attitude,meaning(profile.attitude).title]
  ];
}
