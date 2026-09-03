# Framework de Automatización QA – Playwright & TypeScript

Repositorio de portfolio que demuestra un framework de automatización de pruebas robusto, combinando **pruebas End-to-End (UI)** y **pruebas de API**, integrado en un pipeline de **Integración Continua (CI/CD)**.

## Tecnologías empleadas

- **Playwright**: framework de automatización end-to-end multi-navegador.
- **TypeScript**: tipado estático para un código más robusto y mantenible.
- **Node.js**: entorno de ejecución del proyecto.
- **GitHub Actions**: orquestación del pipeline de CI/CD.

## Pruebas E2E (Interfaz Gráfica)

Suite de pruebas automatizadas sobre la plataforma de e-commerce **SauceDemo**, cubriendo un flujo de usuario completo:

- **Login de usuario**: validación del acceso mediante credenciales válidas.
- **Gestión del carrito de compras**: añadir un producto y verificar que el contador del carrito refleja la cantidad correcta.

**Buenas prácticas aplicadas:**

- Modularización del flujo de autenticación mediante el hook `test.beforeEach`, evitando la duplicación de código entre los distintos escenarios de prueba.
- Uso de aserciones asíncronas (`await expect(...)`) siguiendo las recomendaciones oficiales de Playwright.
- Tests independientes entre sí, sin dependencia del orden de ejecución.

## Pruebas de API

### Migración estratégica a JSONPlaceholder

Durante la integración del pipeline en la nube, la suite de API (originalmente apuntando a Fake Store API) comenzó a fallar en **GitHub Actions** con un error **HTTP 403 (Forbidden)**, provocado por el firewall de la API, que bloqueaba las direcciones IP de los servidores de CI/CD.

Como solución, la suite se migró estratégicamente a **JSONPlaceholder**, una API pública diseñada específicamente para ser amigable con entornos de integración continua. Esta decisión demuestra capacidad de **diagnóstico de fallos en pipelines** y de adaptación del framework a las restricciones reales de un entorno de ejecución en la nube.

### Test GET

- Petición a un recurso conocido, validando el código de respuesta **200 OK**.
- Extracción y tipado estricto del cuerpo de la respuesta en formato JSON.
- Verificación del contrato de la API mediante `toHaveProperty` (`title`, `body`, `userId`).

### Test POST

- Implementación de **Data-Driven Testing**: en lugar de payloads estáticos, se utiliza una función de generación dinámica de datos que simula estrategias de creación inteligente de casos de prueba, produciendo un payload único en cada ejecución.
- Validación estricta del código de respuesta **201 Created**, demostrando conocimiento del estándar **RESTful** para operaciones de creación de recursos.
- Verificación de que el `id` devuelto es numérico y que el `title` de la respuesta coincide exactamente con el dato dinámico enviado.

## CI/CD (Integración Continua)

El proyecto cuenta con un pipeline configurado en **GitHub Actions** que se ejecuta automáticamente en cada `push` a la rama `main`:

- Ejecución de la suite completa en modo **headless** sobre un runner de **Ubuntu**.
- Instalación automática de dependencias (`npm ci`) y navegadores de Playwright (`--with-deps`).
- Generación y publicación del **reporte HTML** de Playwright como artefacto descargable, facilitando el análisis de fallos (trazas, capturas de pantalla y vídeo).

## Instrucciones de uso local

**1. Clonar el repositorio:**

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

**2. Instalar las dependencias del proyecto:**

```bash
npm install
```

**3. Instalar los navegadores necesarios para Playwright:**

```bash
npx playwright install --with-deps
```

**4. Ejecutar la suite de pruebas:**

```bash
npx playwright test
```

**5. Visualizar el último reporte HTML generado:**

```bash
npx playwright show-report
```