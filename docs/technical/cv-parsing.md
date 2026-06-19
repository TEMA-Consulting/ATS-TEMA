# Parsing de CV con Gemini

## Implementación actual

`CvParsingService` recibe un `Buffer`.

1. Intenta extraer texto con `pdf-parse`.
2. Si obtiene texto suficiente, envía texto truncado.
3. Si no, envía el PDF como entrada multimodal.
4. Gemini devuelve JSON conforme al schema.
5. La respuesta se parsea, sanea y normaliza.
6. El resultado se persiste como perfil editable.

Modelo por defecto:

```env
CV_PARSER_MODEL=gemini-2.5-flash
```

## Modo mock

En emuladores el parser usa mock salvo que se fuerce IA real:

```env
CV_PARSING_USE_MOCK=true
CV_PARSING_FORCE_REAL_AI=false
```

El mock es el modo esperado para tests y desarrollo cotidiano.

## Vertex AI real en local

1. Autenticarse con una identidad autorizada:

   ```bash
   gcloud auth application-default login
   ```

2. Configurar:

   ```env
   CV_PARSING_USE_MOCK=false
   CV_PARSING_FORCE_REAL_AI=true
   GCP_PROJECT=<proyecto-dev>
   VERTEX_LOCATION=us-central1
   ```

3. Iniciar Functions Emulator y cargar un PDF no sensible.

No usar una service account descargada si ADC o impersonación están
disponibles.

## Producción

La identidad de ejecución debe tener permisos mínimos para Vertex AI. No se
requieren claves JSON dentro del deployment.

Configurar cuotas, presupuesto, logging y tratamiento de datos. Confirmar que el
procesamiento de CVs por un servicio de IA cumple las políticas de la
organización.

## Límites

- timeout del trigger: 120 segundos;
- memoria: 512 MiB;
- dos intentos para errores reintentables;
- texto de entrada truncado;
- salida limitada y validada;
- la IA no calcula el FIT% ni toma decisiones de contratación.
