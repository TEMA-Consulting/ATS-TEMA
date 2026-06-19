# Firebase Storage

Las reglas vigentes están en `storage.rules`.

## Ruta de CV

```text
cvs/{candidateId}/{fileName}
```

## Comportamiento actual

- escritura: cualquier usuario autenticado;
- tamaño máximo: menor a 10 MiB;
- MIME type: `application/pdf`;
- lectura: roles `admin`, `recruiter`, `hr` o `area_leader`;
- todo otro path: denegado.

La regla actual no comprueba que `request.auth.uid == candidateId`. El backend y
el flujo de postulación deben asegurar la asociación correcta. Si se requiere
aislamiento estricto por candidato, cambiar reglas, modelo de identidad y
pruebas en conjunto.

## Trigger

`onCVUploaded` procesa objetos PDF bajo `cvs/{candidateId}/...`.

- En alta manual solo registra el path y no ejecuta parsing.
- En alta por CV marca estados y ejecuta parsing mock o real.
- Archivos fuera del patrón o no PDF se ignoran.

## Pruebas pendientes

No hay suite automatizada de reglas. Antes de endurecerlas, cubrir:

- anónimo;
- candidato autenticado;
- usuario interno por rol;
- PDF válido;
- MIME inválido;
- archivo mayor a 10 MiB;
- lectura y escritura fuera de `cvs/`.
