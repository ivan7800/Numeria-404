# Metodología de cálculo · Numeria 404 v2.2.0

Este documento describe exactamente qué reglas aplica la aplicación. La numerología no es una disciplina científica; estas reglas pertenecen a marcos simbólicos tradicionales y pueden variar entre escuelas.

## Sistema pitagórico

### Tabla de letras

Se usa la correspondencia cíclica clásica 1–9:

- 1: A, J, S
- 2: B, K, T
- 3: C, L, U
- 4: D, M, V
- 5: E, N, W
- 6: F, O, X
- 7: G, P, Y
- 8: H, Q, Z
- 9: I, R

Las tildes y diacríticos se normalizan a su letra base. La `Y` se trata como consonante en el cálculo de Alma/Personalidad de esta implementación.

### Reducción

La reducción suma dígitos hasta obtener 1–9. Se conservan 11, 22 y 33 cuando `keepMasters=true`.

### Camino de Vida

Se suman todos los dígitos de la fecha ISO `AAAA-MM-DD` y después se reduce conservando números maestros. Esta es una convención concreta; otras escuelas reducen día, mes y año por separado.

### Expresión / Destino

Se suman los valores pitagóricos de todas las letras del nombre normalizado y se reduce conservando 11/22/33.

### Alma

Se suman solo A, E, I, O, U.

### Personalidad

Se suman las consonantes restantes.

### Madurez

`Camino de Vida + Expresión`, con reducción y conservación de maestros.

### Actitud

`mes + día`, con reducción y conservación de maestros.

### Año Personal

`mes + día + suma de dígitos del año`, con reducción y conservación de maestros.

### Mes Personal

`Año Personal + número de mes`, con reducción y conservación de maestros.

### Pináculos y desafíos

Mes, día y año se reducen primero a una cifra para las bases. Los pináculos se calculan con las combinaciones implementadas en `js/numerology.js`; los desafíos usan diferencias absolutas. Los rangos de edad parten de `36 - Camino de Vida reducido a una cifra`.

### Deudas kármicas

Se muestran 13, 14, 16 o 19 solo si aparecen exactamente como totales brutos en Camino de Vida, Expresión, Alma o Personalidad. No se infieren por otras reglas.

## Sistema caldeo

Se mantiene completamente separado del motor pitagórico. Usa la tabla de `js/chaldean.js`, suma el valor compuesto del nombre y muestra tanto el total compuesto como su reducción a 1–9.

## Compatibilidad

Los porcentajes son una escala interna de visualización basada en distancia circular entre números reducidos. No representan probabilidad, evidencia científica ni predicción de la relación.

## Bioenergía

Los siete centros son una correspondencia simbólica propia de la aplicación a partir de números núcleo y frecuencias. No mide energía física, chakras, salud ni parámetros clínicos.
