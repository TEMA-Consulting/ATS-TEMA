# Matching y FIT%

El FIT% es determinístico. Gemini participa únicamente en la extracción de
skills del CV.

## Entradas

- `Candidate.technicalSkills`;
- `Job.skills`;
- tipo de skill: obligatoria o deseable;
- peso configurado en la posición.

## Flujo

```text
skills del candidato
  → normalización
  → comparación exacta de nombres canónicos
  → ponderación
  → Application.fitScore
  → Application.skillMatchStats
```

No se aplican equivalencias semánticas automáticas entre tecnologías distintas.
La normalización reduce diferencias de mayúsculas, espacios y aliases
controlados.

## Recalculado

- al crear una aplicación;
- cuando cambian insumos relevantes del candidato;
- cuando cambian skills o pesos de la posición.

Los triggers están en `onMatchingInputsUpdated.ts`.

## Interpretación

- score ausente: no existe cálculo válido;
- `0`: cálculo válido sin coincidencias;
- `100`: cobertura ponderada completa.

El score es una ayuda de priorización y no una decisión automática.

## Archivos

- `skillNormalizer.ts`;
- `skillMatchCalculator.ts`;
- `skillMatchService.ts`;
- `onMatchingInputsUpdated.ts`;
- modelos `skillMatch.ts`.

## Pruebas

Cubrir normalización, pesos, skills obligatorias/deseables, datos vacíos,
recalculado y diferencia entre score ausente y cero.
