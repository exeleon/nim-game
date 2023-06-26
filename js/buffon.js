import { buffonNeedle } from "./modules/buffon.mjs";

const ggbApp1 = setGeogebraElement("vhggrx7u");
const ggbApp2 = setGeogebraElement("hpv763n5");

function setGeogebraElement(id) {
  return new GGBApplet(
    {
      material_id: id,
      width: 800,
      height: 600,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      showFullscreenButton: true,
    },
    true
  );
}

function main() {
  const events = document.getElementById("events");
  const play = document.getElementById("play");
  const cutProb = document.getElementById("cutProb");
  const piAprox = document.getElementById("piAprox");
  const loading = document.getElementsByClassName("loading")[0];
  const results = document.getElementsByClassName("results")[0];
  const error = document.getElementsByClassName("error")[0];

  ggbApp1.inject("ggb-element-1");
  ggbApp2.inject("ggb-element-2");

  function playExperiment() {
    const n = Number(events.value);

    if (!n) {
      error.style.display = "block";
      return;
    }

    error.style.display = "none";
    play.style.display = "none";
    results.style.display = "none";
    loading.style.display = "block";

    setTimeout(() => {
      const [prob, pi, message] = buffonNeedle(n);

      cutProb.innerText = prob.toString();
      piAprox.innerText = pi.toString();
      results.style.display = "block";
      play.style.display = "block";
      loading.style.display = "none";

      if (message) {
        error.innerText = message;
        error.style.display = "block";
      }
    }, 1000);
  }

  play.onclick = playExperiment;
}

window.onload = main;
