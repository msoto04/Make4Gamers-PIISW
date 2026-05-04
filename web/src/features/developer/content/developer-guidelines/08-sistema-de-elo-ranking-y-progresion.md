# 📈 Sistema de ELO, ranking y progresión

Cada juego integrado en la plataforma debe implementar un sistema de **puntuación, ranking o progresión** que permita medir el rendimiento del jugador y fomentar la mejora continua.

Aunque cada desarrollador tiene cierta libertad para adaptar el sistema de **ELO** a las características de su juego, este debe seguir unas pautas comunes para mantener la coherencia general de la plataforma.

> [!IMPORTANT]
> El sistema debe representar el progreso del jugador de forma clara, justa y coherente con la experiencia global de **M4G**.

## 🎯 Objetivo del sistema de ELO

El sistema de ELO debe servir para representar de forma clara el **progreso**, la **habilidad** o el **rendimiento** del jugador dentro de un juego.

Su finalidad no es únicamente mostrar una puntuación, sino:

* Motivar al usuario a seguir jugando.
* Incentivar la mejora de resultados.
* Promover una competición sana con otros jugadores.

## Libertad de implementación

Cada desarrollador podrá definir cómo se calculan los puntos en función del tipo de juego.

Por ejemplo, el sistema puede valorar:

* Victoria o derrota.
* Tiempo empleado.
* Precisión.
* Número de intentos.
* Dificultad seleccionada.
* Rendimiento frente a otros jugadores.
* Récords personales.

> [!IMPORTANT]
> El cálculo debe ser **comprensible**, **coherente** y no debe generar ventajas injustas.

## 📋 Reglas mínimas del sistema

Todo sistema de ELO o puntuación debe cumplir, como mínimo, las siguientes reglas:

| Regla                                  | Descripción                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| **Comprensión**                        | El jugador debe entender por qué gana o pierde puntos.                          |
| **Relación con el rendimiento**        | La puntuación debe estar relacionada con el rendimiento real.                   |
| **Prevención de abuso**                | No deben existir formas fáciles de farmear puntos de manera abusiva.            |
| **Partidas abandonadas o manipuladas** | El sistema debe evitar premiar partidas abandonadas o manipuladas.              |
| **Documentación**                      | Las reglas de puntuación deben estar documentadas en el manual del juego.       |
| **Validación**                         | La puntuación debe ser validada por el sistema, no únicamente desde el cliente. |

> [!IMPORTANT]
> La puntuación debe validarse desde el sistema para evitar manipulaciones desde el cliente.

## Rankings y clasificación

Los juegos que implementen ranking deben mostrar la **posición del jugador** de forma clara.

El ranking puede ser:

* Global.
* Por juego.
* Por temporada.
* Por modo de juego.

Siempre que sea posible, se recomienda mostrar:

* Posición actual.
* Nombre del jugador.
* Puntuación.
* Liga o rango.
* Progreso hacia el siguiente rango.

## 🏆 Ligas o rangos

Para reforzar la gamificación, se recomienda agrupar a los jugadores en **ligas o rangos** según su puntuación.

### Ejemplo de estructura

* Iniciado.
* Bronce.
* Plata.
* Oro.
* Platino.
* Diamante.
* Ray-Tracing.

> [!NOTE]
> Los rangos deben funcionar como objetivos progresivos, ayudando al usuario a visualizar su avance dentro de la plataforma.

## Temporadas

El sistema puede organizarse por **temporadas** para renovar la competición y mantener el interés de los usuarios.

Una temporada permite:

* Reiniciar o ajustar rankings.
* Crear nuevas metas competitivas.
* Comparar el rendimiento en periodos concretos.
* Fomentar la participación continua.

## Ejemplo aplicado en M4G

En la plataforma **M4G**, los juegos propios utilizan un sistema de progresión basado en **puntos globales y rankings**.

Los usuarios acumulan puntos al jugar y mejorar sus resultados. Estos puntos contribuyen a:

* Su posición en el ranking global.
* Su avance dentro de los rangos de la plataforma.

El sistema muestra elementos como:

* Ranking global de jugadores.
* Posición actual del usuario.
* Puntuación total.
* Liga o rango alcanzado.
* Progreso hacia el siguiente rango.
* Temporada actual.

> [!NOTE]
> Por ejemplo, un jugador puede aparecer en el ranking con una puntuación determinada y una liga asociada, como **PS4**, **PS5** o rangos superiores. Además, el sistema indica cuánto progreso le falta para alcanzar el siguiente rango, reforzando la sensación de avance y reto.

Este modelo sirve como referencia para los desarrolladores, que podrán adaptar sus propios sistemas de puntuación manteniendo siempre los principios de **claridad, justicia y motivación**.
