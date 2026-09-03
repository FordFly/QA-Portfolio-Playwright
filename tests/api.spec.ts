import { test, expect } from '@playwright/test';

// --- Data Driven Testing / Dynamic Data ---
// Generamos los datos de forma dinámica en cada ejecución del test en lugar
// de usar payloads estáticos. Esto simula variabilidad "inteligente" en los
// datos de entrada y evita depender siempre del mismo caso exacto de prueba.
function generarDatosSimuladosIA() {
  const adjetivos = ['Premium', 'Pro', 'Ultra', 'Smart', 'Eco'];
  const sustantivos = ['Automatización', 'Testing', 'Pipeline', 'Framework', 'Release'];

  // Título dinámico combinando un adjetivo y un sustantivo aleatorios,
  // más un número aleatorio para garantizar (razonablemente) unicidad.
  const tituloDinamico = `${adjetivos[Math.floor(Math.random() * adjetivos.length)]} ${
    sustantivos[Math.floor(Math.random() * sustantivos.length)]
  } ${Math.floor(Math.random() * 1000)}`;

  // Cuerpo del post generado dinámicamente.
  const cuerpoDinamico = `Contenido generado automáticamente para pruebas E2E - ${Date.now()}`;

  // userId aleatorio entre 1 y 10, rango de usuarios que soporta JSONPlaceholder.
  const userIdDinamico = Math.floor(Math.random() * 10) + 1;

  return {
    title: tituloDinamico,
    body: cuerpoDinamico,
    userId: userIdDinamico,
  };
}

test('Obtener un post por ID desde JSONPlaceholder', async ({ request }) => {
  // Petición GET a un recurso fijo y conocido de la API.
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  // Validamos que el servidor respondió correctamente (status 200 = OK).
  expect(response.status()).toBe(200);

  // Extraemos y parseamos el cuerpo de la respuesta como JSON.
  const responseBody = await response.json();

  // Validamos que el "id" devuelto sea de tipo numérico...
  expect(typeof responseBody.id).toBe('number');
  // ...y que su valor sea exactamente 1, confirmando que la API
  // devolvió el recurso correcto.
  expect(responseBody.id).toBe(1);

  // Validamos que el objeto JSON contiene las propiedades esperadas
  // en su estructura (contrato de la API), independientemente de su valor.
  expect(responseBody).toHaveProperty('title');
  expect(responseBody).toHaveProperty('body');
  expect(responseBody).toHaveProperty('userId');
});

test('Crear un post con datos dinámicos (POST)', async ({ request }) => {
  // Generamos un payload distinto en cada ejecución del test.
  const nuevoPost = generarDatosSimuladosIA();

  // Enviamos la petición POST con el objeto JSON en el "data".
  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: nuevoPost,
  });

  // Validamos que el servidor confirmó la creación del recurso.
  // JSONPlaceholder sí respeta el estándar RESTful y devuelve 201 Created.
  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  // Validamos que el servidor devolvió un "id" numérico para el recurso creado.
  expect(responseBody).toHaveProperty('id');
  expect(typeof responseBody.id).toBe('number');

  // Validamos que el título devuelto coincide exactamente con el título
  // dinámico enviado, confirmando que la API respetó el payload de la petición.
  expect(responseBody.title).toBe(nuevoPost.title);
});