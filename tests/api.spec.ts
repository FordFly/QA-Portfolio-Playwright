import { test, expect } from '@playwright/test';

test('Obtener un producto por ID desde la Fake Store API', async ({ request }) => {
  // Realizamos una petición GET al endpoint del producto con id=1.
  // El fixture "request" de Playwright permite hacer llamadas HTTP
  // sin necesidad de levantar un navegador, ideal para tests de API puros.
  const response = await request.get('https://fakestoreapi.com/products/1');

  // 1. Validamos que el servidor respondió correctamente (status 200 = OK).
  //    Si la API devolviera un error (4xx/5xx), el test fallaría aquí.
  expect(response.status()).toBe(200);

  // 2. Extraemos el cuerpo de la respuesta y lo parseamos como JSON
  //    para poder trabajar con sus propiedades como un objeto TypeScript.
  const responseBody = await response.json();

  // 3. Validamos que el "id" devuelto sea de tipo numérico...
  expect(typeof responseBody.id).toBe('number');
  // ...y que su valor sea exactamente 1, confirmando que la API
  // devolvió el recurso correcto (no otro producto).
  expect(responseBody.id).toBe(1);

  // 4. Validamos que el objeto JSON contiene las propiedades esperadas
  //    en su estructura (contrato de la API), independientemente de su valor.
  expect(responseBody).toHaveProperty('title');
  expect(responseBody).toHaveProperty('price');
  expect(responseBody).toHaveProperty('category');
});

// --- Data Driven Testing / Dynamic Data ---
// En vez de "hardcodear" un objeto de producto fijo (datos estáticos),
// generamos los datos de forma dinámica en cada ejecución del test.
// Esto simula el concepto de datos "generados de forma inteligente/variable"
// y aporta dos ventajas clave:
// 1. Evita falsos positivos por caché o duplicados si la API guardara estado real.
// 2. Aumenta la cobertura al no probar siempre el mismo caso exacto.
function generarDatosSimuladosIA() {
  // Arrays de valores posibles: la función elige uno de forma aleatoria
  // en cada llamada, simulando variabilidad "inteligente" en los datos de prueba.
  const categorias = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  const adjetivos = ['Premium', 'Pro', 'Ultra', 'Smart', 'Eco'];
  const sustantivos = ['Backpack', 'Watch', 'Jacket', 'Headphones', 'Sneakers'];

  // Título dinámico combinando un adjetivo y un sustantivo aleatorios,
  // más un número aleatorio para garantizar (razonablemente) unicidad.
  const tituloDinamico = `${adjetivos[Math.floor(Math.random() * adjetivos.length)]} ${
    sustantivos[Math.floor(Math.random() * sustantivos.length)]
  } ${Math.floor(Math.random() * 1000)}`;

  // Precio aleatorio entre 10 y 500, con 2 decimales.
  const precioDinamico = parseFloat((Math.random() * (500 - 10) + 10).toFixed(2));

  return {
    title: tituloDinamico,
    price: precioDinamico,
    description: 'Producto generado dinámicamente para pruebas automatizadas de API.',
    image: 'https://i.pravatar.cc/300',
    category: categorias[Math.floor(Math.random() * categorias.length)],
  };
}

test('Crear un producto con datos dinámicos (POST)', async ({ request }) => {
  // Generamos un payload distinto en cada ejecución del test.
  const nuevoProducto = generarDatosSimuladosIA();

  // Enviamos la petición POST con el objeto JSON en el "data".
  // Playwright serializa automáticamente el objeto a JSON.
  const response = await request.post('https://fakestoreapi.com/products', {
    data: nuevoProducto,
  });

  // 4. Validamos que el servidor aceptó la creación correctamente.
  //    Fake Store API simula la creación devolviendo status 201.
  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  // 5. Validamos que el servidor devolvió un "id" nuevo para el recurso creado,
  //    confirmando que la simulación de creación generó una entidad.
  expect(responseBody).toHaveProperty('id');
  expect(typeof responseBody.id).toBe('number');

  // Validamos que el título devuelto coincide exactamente con el título
  // dinámico que enviamos, confirmando que la API respetó el payload enviado
  // en lugar de devolver datos fijos o mockeados sin relación con la petición.
  expect(responseBody.title).toBe(nuevoProducto.title);
});