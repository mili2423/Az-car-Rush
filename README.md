# 🎂 Azúcar Rush

Juego web 3D de gestión y cocina en primera persona (*First-Person Cooker*), inspirado en las mecánicas táctiles de **Job Simulator** y la encantadora estética pastel de **Purble Place**.

---

## 🎮 Acerca del juego

En **Azúcar Rush**, el jugador hereda una antigua pastelería de pueblo y debe levantarla día a día preparando pedidos para los clientes antes de que se acabe el tiempo o la paciencia:

- **Perspectiva en Primera Persona:** Muévete libremente por la cocina con controles clásicos WASD y ratón con bloqueo de puntero (*Pointer Lock*).
- **Mano Virtual 3D y Bandeja:** Sostén y transporta los ingredientes, masas y dulces directamente en tus manos mientras caminas entre estaciones.
- **Estaciones Interactivas:**
  - 🌾 **Estantería de Ingredientes:** Harina, huevo, leche, azúcar, chocolate y frutilla.
  - 🥣 **Batidora:** Bate los ingredientes en tiempo real con aspas giratorias y medidor de consistencia.
  - 🔥 **Horno Pastelero:** Ventana visible, luces interiores, temporizador y alarma de quemado.
  - 🎨 **Mesa de Decoración:** Glaseados, cerezas y toppings para sumar puntos extra.
  - 🛎️ **Mostrador:** Entrega pedidos directamente a los clientes, cobra monedas y gana estrellas.
  - 🗑️ **Basura:** Para descartar bandejas quemadas o errores.
- **5 Niveles de Historia y Progresión:** Desde el *Primer Día* hasta la *Gran Apertura*.
- **Tienda de Mejoras:** Compra hornos más rápidos, mayor velocidad de movimiento, vidas extra y tiempo adicional entre niveles.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Motor 3D:** [Three.js](https://threejs.org/) a través de [@react-three/fiber](https://r3f.docs.pmnd.rs/) y [@react-three/drei](https://github.com/pmndrs/drei)
- **Estilos e Interfaz 2D:** [Tailwind CSS](https://tailwindcss.com/)
- **Audio:** Web Audio API procedural con efectos de sonido dinámicos
- **Efectos:** Canvas Confetti

---

## 🚀 Instalación y Ejecución Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/mili2423/azucar-rush-.git
   cd azucar-rush-
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para jugar.

---

## 🕹️ Controles

| Tecla / Acción | Función |
| -------------- | ------- |
| **W, A, S, D** | Moverse por la pastelería |
| **Mouse** | Mirar en 360° en primera persona |
| **E** o **Clic Izquierdo** | Agarrar, batir, hornear, decorar y entregar |
| **ESC** | Pausar y liberar el cursor |
