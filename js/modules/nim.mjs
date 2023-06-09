function descomposicion_binaria(numero) {
  const binario = numero.toString(2);
  return binario
    .split("")
    .reverse()
    .map((digito, index) => (digito === "1" ? 2 ** index : 0))
    .reverse();
}

export function preparar_matriz(montones) {
  const matriz = [];
  for (const numero of montones) {
    const monton = descomposicion_binaria(numero);
    matriz.push(monton);
  }

  let num_columnas = 0;
  for (const fila of matriz) {
    if (fila.length > num_columnas) {
      num_columnas = fila.length;
    }
  }

  for (const fila of matriz) {
    if (fila.length < num_columnas) {
      const completar_ceros = Array.from(
        { length: num_columnas - fila.length },
        () => 0
      );
      fila.unshift(...completar_ceros);
    }
  }

  return matriz;
}

function comprobar_paridad_columnas(matriz) {
  let paridad = [];
  for (let i = 0; i < matriz.length; i++) {
    const fila = matriz[i];
    for (let j = 0; j < fila.length; j++) {
      const celda = fila[j];
      if (celda !== 0) {
        paridad[j] = paridad[j] ? paridad[j] + 1 : 1;
      }
    }
  }

  const son_todas_pares = paridad.every((columna) => columna % 2 === 0);
  return [son_todas_pares, paridad];
}

export function simular_nim(montones) {
  let matriz = preparar_matriz(montones);
  const montones_ordenados = [...montones].sort((a, b) => a - b).reverse();

  let retirados = 0;
  let agregados = 0;
  let indice_monton_a_retirar = null;
  const [son_todas_pares, arreglo_paridad] = comprobar_paridad_columnas(matriz);

  if (son_todas_pares) {
    indice_monton_a_retirar = montones.findIndex(
      (monton) => monton === montones_ordenados[0]
    );
    retirados = 1;
  } else {
    const columnas_impares = arreglo_paridad
      .map((columna, index) => (columna % 2 !== 0 ? index : null))
      .filter((columna) => columna !== null);

    for (const columna_impar of columnas_impares) {
      if (indice_monton_a_retirar === null) {
        for (const monton of montones_ordenados) {
          const index = montones.indexOf(monton);
          const celda = matriz[index][columna_impar];
          if (celda !== 0) {
            indice_monton_a_retirar = index;
            break;
          }
        }
      }

      const celda = matriz[indice_monton_a_retirar][columna_impar];
      if (celda !== 0) {
        retirados += celda;
      } else {
        agregados +=
          2 ** (matriz[indice_monton_a_retirar].length - columna_impar - 1);
      }
    }
  }

  const nuevos_montones = montones.map((monton, index) =>
    index === indice_monton_a_retirar ? monton - retirados + agregados : monton
  );
  matriz = preparar_matriz(nuevos_montones);

  return [
    matriz,
    nuevos_montones,
    indice_monton_a_retirar,
    retirados - agregados,
  ];
}
