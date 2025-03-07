window.onload = main;

function main() {
  const slider = document.getElementById("triplets");
  run(slider.value);
  slider.oninput = function () {
    run(this.value);
  };
}

function run(tripletsAmount) {
  const triplets = generate_triplets_v2(tripletsAmount);
  const sliderValue = document.getElementById("slider_value");
  const tripletsNumber = document.getElementsByClassName("triplets_number");
  const dataTable = document.getElementById("data_table");

  sliderValue.innerHTML = tripletsAmount;

  Array.from(tripletsNumber).forEach(
    (element) => (element.innerHTML = tripletsAmount)
  );

  dataTable.innerHTML = triplets
    .map(
      (d, i) =>
        `<tr><td>${i + 1}</td><td>${d.a}</td><td>${d.b}</td><td>${
          d.c
        }</td></tr>`
    )
    .join("");

  const tree = build_tree_recursive(triplets.reverse());
  draw_graph(tree);
}

/**
 * Implementado a partir de la teoría expuesta en las páginas 16-17
 * de https://www.redalyc.org/pdf/6079/607972920002.pdf
 */
function generate_triplets_v2(tripletsAmount = 5) {
  let last = pythagorean_triplets_v2(1);
  const triplets = [last];
  while (triplets.length < tripletsAmount) {
    const n = (last.c - 1) / 2;
    const triplet = pythagorean_triplets_v2(n);
    triplets.push(triplet);
    last = triplet;
  }
  return triplets;
}

function pythagorean_triplets_v2(n) {
  return {
    a: 2 * n + 1,
    b: 2 * Math.pow(n, 2) + 2 * n,
    c: 2 * Math.pow(n, 2) + 2 * n + 1,
  };
}

/**
 * Muy ineficiente, no se puede generar más de 6 ternas
 */
function generate_triplets_v1() {
  let m = 2;
  let last = pythagorean_triplets_v1(1, 2);
  const triplets = [last];

  while (triplets.length < 6) {
    const triplet = pythagorean_triplets_v1(m, m + 1);
    if (last.c === triplet.a) {
      triplets.push(triplet);
      last = triplet;
      m = Math.floor(Math.sqrt(last.c));
    } else {
      m++;
    }
  }

  return triplets;
}

function pythagorean_triplets_v1(m, n) {
  if (n <= m) return null;
  return {
    a: Math.pow(n, 2) - Math.pow(m, 2),
    b: 2 * m * n,
    c: Math.pow(m, 2) + Math.pow(n, 2),
  };
}

function build_tree_recursive(triplets) {
  if (triplets.length === 1) {
    return {
      name: triplets[0].c,
      children: [{ name: triplets[0].a }, { name: triplets[0].b }],
    };
  }
  const [first_triplet, ...rest_triplets] = triplets;
  return {
    name: first_triplet.c,
    children: [build_tree_recursive(rest_triplets), { name: first_triplet.b }],
  };
}

function draw_graph(data) {
  const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg.selectAll("*").remove();

  const treeLayout = d3.tree().size([width - 160, height - 100]);
  const root = d3.hierarchy(data);
  const g = svg.append("g").attr("transform", "translate(80,40)");

  treeLayout(root);

  const link = g
    .selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      d3
        .linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    );

  const node = g
    .selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  node.append("circle").attr("r", 10);

  node
    .append("text")
    .attr("dy", 3)
    .attr("x", (d) => (d.children ? -12 : 12))
    .style("text-anchor", (d) => (d.children ? "end" : "start"))
    .text((d) => d.data.name);
}
