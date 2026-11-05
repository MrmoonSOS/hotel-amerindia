// Contenido de la página "BPMN" (/bpmn, entregable académico), tomado de la guía (GUIA SIMON.docx).

export const problem = 'Actualmente, las reservas del Hotel Amerindia dependen casi por completo de la llamada telefónica y de la atención del personal de recepción. Como el hotel está en un pueblo, la señal y la línea telefónica fallan con frecuencia, y los recepcionistas, que además hacen el registro, los cobros y la atención presencial, muchas veces están ocupados y no alcanzan a contestar. Esto afecta a los turistas que quieren reservar y al personal de recepción, y ocurre en la etapa inicial del proceso. Como consecuencia, cerca del 30 % de las llamadas no se contestan o se cortan, cada reserva toma en promedio 10 minutos y se presentan unos 4 reprocesos al mes por datos mal anotados o dobles reservas, lo que genera pérdida de clientes, quejas de los huéspedes y menores ingresos, sobre todo en temporada baja.';

export const scope = [
 'La solución cubre la etapa inicial del proceso de reservas del Hotel Amerindia, desde que el turista contacta al hotel hasta que su reserva queda registrada y confirmada. Un chatbot, disponible las 24 horas, responde consultas frecuentes (precios, disponibilidad, servicios y ubicación), recibe la solicitud de reserva, guarda los datos del huésped e informa cómo hacer el depósito. Si no puede resolver una consulta, la pasa a recepción.',
 'Quedan por fuera las actividades posteriores a la llegada del huésped (check-in, entrega de llaves, limpieza, consumos y check-out), un sistema completo de gestión hotelera y los pagos en línea automatizados.',
];

export const generalObjective = 'Implementar un chatbot de atención disponible las 24 horas que agilice y automatice la etapa inicial del proceso de reservas del Hotel Amerindia, reduciendo las consultas sin respuesta y la carga operativa del personal de recepción.';

export const strategicAlignment = 'La solución se alinea con los objetivos estratégicos del hotel de digitalizar sus procesos de atención y reserva y aumentar la ocupación, sobre todo en temporada baja, al ofrecer un canal de atención disponible las 24 horas. Responde a las debilidades identificadas en la matriz DOFA (poca presencia digital y procesos manuales)';

export const asIsToBe = [
 {asIs:'El turista llama por teléfono; si la línea falla o recepción está ocupada, no hay respuesta.',toBe:'El turista escribe al chatbot a cualquier hora y recibe respuesta inmediata.'},
 {asIs:'Recepción revisa la disponibilidad y explica precios y habitaciones por teléfono.',toBe:'El chatbot consulta la disponibilidad y muestra tipos de habitación y precios automáticamente.'},
 {asIs:'El recepcionista anota los datos del huésped a mano, con errores y dobles reservas.',toBe:'El chatbot valida y registra los datos de la reserva.'},
 {asIs:'La confirmación se da por llamada, cuando se puede.',toBe:'El chatbot confirma la reserva de inmediato e informa cómo pagar el depósito.'},
 {asIs:'Recepción atiende todas las consultas, incluso las repetitivas.',toBe:'Recepción solo atiende las que el chatbot no resuelve y verifica el depósito.'},
 {asIs:'Cada reserva toma unos 10 minutos.',toBe:'Cada reserva toma unos 3 minutos.'},
];

export type Criterion = { dado: string; cuando: string; entonces: string };
export type UserStory = { id: string; title: string; epic: string; priority: string; story: [string, string, string]; criteria: Criterion[] };

export const userStories: UserStory[] = [
 {id:'HU-01',title:'Consultar disponibilidad de habitación',epic:'Reservar habitación',priority:'Must',
  story:['Como huésped potencial del Hotel Amerindia,','quiero consultar la disponibilidad de habitaciones según mis fechas de estadía y número de personas,','para saber si hay espacio y poder decidir si hago mi reserva.'],
  criteria:[
   {dado:'que el usuario inicia la consulta',cuando:'indica fecha de llegada, fecha de salida y número de huéspedes (adultos y niños)',entonces:'el chatbot muestra las habitaciones disponibles con tipo, capacidad, precio por noche, precio total y fotos.'},
   {dado:'que el usuario escribe una fecha de salida anterior a la de llegada o una fecha pasada',cuando:'envía los datos',entonces:'el chatbot le indica el error y le pide corregir las fechas.'},
   {dado:'que no hay habitaciones disponibles en ese rango',cuando:'el usuario consulta',entonces:'el chatbot informa que no hay disponibilidad y le ofrece cambiar las fechas o hablar con recepción.'},
  ]},
 {id:'HU-02',title:'Ver tipos de habitación',epic:'Reservar habitación',priority:'Must',
  story:['Como huésped potencial del Hotel Amerindia,','quiero ver los tipos de habitación con sus características y precios,','para escoger la que mejor se ajuste a mis necesidades y a mi presupuesto.'],
  criteria:[
   {dado:'que el usuario pide ver las habitaciones',cuando:'el chatbot responde',entonces:'muestra cada tipo con capacidad, camas, servicios incluidos, precio por noche y fotos.'},
   {dado:'que el usuario ve los tipos',cuando:'selecciona uno',entonces:'el chatbot muestra su detalle y le ofrece continuar con la reserva.'},
   {dado:'que el chatbot no logra cargar la información',cuando:'el usuario la solicita',entonces:'muestra un mensaje de error y le ofrece comunicarse con recepción.'},
  ]},
 {id:'HU-03',title:'Reservar habitación',epic:'Reservar habitación',priority:'Must',
  story:['Como huésped potencial del Hotel Amerindia,','quiero reservar la habitación que escogí desde el chatbot,','para asegurar mi hospedaje sin tener que llamar al hotel.'],
  criteria:[
   {dado:'que el usuario eligió una habitación disponible',cuando:'envía su nombre, documento, teléfono y correo',entonces:'el chatbot registra la solicitud de reserva con un código único.'},
   {dado:'que faltan datos obligatorios o el correo tiene formato inválido',cuando:'el usuario intenta continuar',entonces:'el chatbot le indica qué dato corregir y no registra la reserva.'},
   {dado:'que la habitación fue reservada por otra persona mientras el usuario decidía',cuando:'intenta reservarla',entonces:'el chatbot le avisa que ya no está disponible y le propone otras opciones.'},
  ]},
 {id:'HU-04',title:'Anticipo en línea',epic:'Confirmar reserva',priority:'Should',
  story:['Como huésped potencial del Hotel Amerindia,','quiero conocer cómo pagar el anticipo de mi reserva y enviar el comprobante,','para dejar mi reserva asegurada sin ir hasta el hotel.'],
  criteria:[
   {dado:'que el usuario tiene una reserva pendiente de anticipo',cuando:'el chatbot le informa los medios de pago',entonces:'muestra el valor del anticipo, los medios disponibles y la fecha límite para pagar.'},
   {dado:'que el usuario envía el comprobante de pago',cuando:'el chatbot lo recibe',entonces:'lo registra y notifica a recepción para su verificación.'},
   {dado:'que pasa la fecha límite sin recibir el anticipo',cuando:'se cumple el plazo',entonces:'el chatbot avisa al usuario que la reserva fue liberada.'},
  ]},
 {id:'HU-05',title:'Confirmar reserva',epic:'Confirmar reserva',priority:'Must',
  story:['Como huésped potencial del Hotel Amerindia,','quiero recibir la confirmación de mi reserva,','para tener la certeza de que mi habitación quedó asegurada.'],
  criteria:[
   {dado:'que el usuario completó los datos de la reserva',cuando:'el chatbot la registra',entonces:'envía un mensaje con el código, fechas, tipo de habitación, valor total e instrucciones del anticipo.'},
   {dado:'que el usuario ya recibió una confirmación',cuando:'vuelve a pedirla',entonces:'el chatbot muestra los mismos datos sin crear una reserva duplicada.'},
   {dado:'que ocurre un error al registrar la reserva',cuando:'el chatbot no puede confirmarla',entonces:'informa que la reserva no fue confirmada y notifica a recepción.'},
  ]},
 {id:'HU-06',title:'Consultar estado de la reserva',epic:'Confirmar reserva',priority:'Should',
  story:['Como huésped con una reserva en el Hotel Amerindia,','quiero consultar el estado de mi reserva con mi código,','para saber si está pendiente, confirmada o cancelada.'],
  criteria:[
   {dado:'que el usuario tiene una reserva registrada',cuando:'escribe su código de reserva',entonces:'el chatbot muestra el estado (pendiente de anticipo, confirmada o cancelada) y los datos principales.'},
   {dado:'que el usuario escribe un código inexistente',cuando:'consulta',entonces:'el chatbot le indica que no lo encontró y le permite intentar de nuevo o hablar con recepción.'},
   {dado:'que el estado cambió',cuando:'el usuario consulta de nuevo',entonces:'el chatbot muestra el estado actualizado.'},
  ]},
 {id:'HU-07',title:'Confirmación por correo',epic:'Confirmar reserva',priority:'Could',
  story:['Como huésped potencial del Hotel Amerindia,','quiero recibir la confirmación de mi reserva por correo electrónico,','para conservar un comprobante y consultarlo cuando lo necesite.'],
  criteria:[
   {dado:'que la reserva fue confirmada',cuando:'el sistema la registra',entonces:'envía un correo con el código, fechas, habitación, valor y datos del hotel.'},
   {dado:'que el correo no puede enviarse (dirección inválida o error del servicio)',cuando:'falla el envío',entonces:'el chatbot avisa al usuario y le pide verificar su correo.'},
   {dado:'que el usuario no recibe el correo',cuando:'lo solicita de nuevo',entonces:'el chatbot lo reenvía.'},
  ]},
 {id:'HU-08',title:'Recibir recordatorio de la reserva',epic:'Confirmar reserva',priority:'Could',
  story:['Como huésped con una reserva en el Hotel Amerindia,','quiero recibir un recordatorio antes de mi llegada,','para no olvidar la fecha, la hora de ingreso ni los documentos que debo llevar.'],
  criteria:[
   {dado:'que existe una reserva confirmada',cuando:'faltan 48 horas para la llegada',entonces:'el chatbot envía un recordatorio con la fecha, la hora de check-in, la dirección y los documentos requeridos.'},
   {dado:'que la reserva fue cancelada',cuando:'llega la fecha del recordatorio',entonces:'el chatbot no envía ningún mensaje.'},
   {dado:'que el mensaje no puede entregarse',cuando:'falla el envío',entonces:'el sistema lo registra y notifica a recepción para contactar al huésped.'},
  ]},
 {id:'HU-09',title:'Cancelar reserva',epic:'Reservar habitación',priority:'Should',
  story:['Como huésped con una reserva en el Hotel Amerindia,','quiero cancelar mi reserva desde el chatbot,','para liberar la habitación y conocer las condiciones del reembolso.'],
  criteria:[
   {dado:'que el usuario tiene una reserva activa',cuando:'pide cancelarla e ingresa su código',entonces:'el chatbot le muestra la política de cancelación y le pide confirmar.'},
   {dado:'que el usuario confirma la cancelación',cuando:'el chatbot la procesa',entonces:'cambia el estado a "cancelada", libera la habitación y envía un mensaje de confirmación.'},
   {dado:'que la reserva ya fue cancelada o la fecha de llegada ya pasó',cuando:'el usuario intenta cancelar',entonces:'el chatbot le informa que no es posible y le ofrece hablar con recepción.'},
  ]},
 {id:'HU-10',title:'Registro del cliente',epic:'Realizar check-in',priority:'Should',
  story:['Como recepcionista del Hotel Amerindia,','quiero que los datos del huésped queden registrados desde su reserva,','para agilizar el check-in y evitar volver a anotarlos a mano.'],
  criteria:[
   {dado:'que el huésped llega con una reserva confirmada',cuando:'el recepcionista busca su código',entonces:'el sistema muestra los datos ya registrados (nombre, documento, contacto y fechas).'},
   {dado:'que algún dato está incompleto o es incorrecto',cuando:'el recepcionista lo revisa',entonces:'puede corregirlo y el cambio queda guardado.'},
   {dado:'que no existe una reserva con ese código',cuando:'el recepcionista la busca',entonces:'el sistema indica que no hay registro y permite crear uno nuevo.'},
  ]},
 {id:'HU-11',title:'Registro de entrega de la habitación',epic:'Realizar check-in',priority:"Won't (esta versión)",
  story:['Como recepcionista del Hotel Amerindia,','quiero registrar la entrega de la habitación y de las llaves al huésped,','para llevar control de qué habitaciones están ocupadas.'],
  criteria:[
   {dado:'que el huésped completó el check-in',cuando:'el recepcionista registra la entrega',entonces:'la habitación queda marcada como "ocupada" con fecha y hora.'},
   {dado:'que la habitación aún no está lista',cuando:'el recepcionista intenta registrar la entrega',entonces:'el sistema bloquea el registro e indica el motivo.'},
   {dado:'que la entrega ya fue registrada',cuando:'el recepcionista intenta registrarla de nuevo',entonces:'el sistema muestra el registro existente sin duplicarlo.'},
  ]},
 {id:'HU-12',title:'Confirmar recepción de la habitación',epic:'Realizar check-in',priority:"Won't",
  story:['Como huésped del Hotel Amerindia,','quiero confirmar que recibí mi habitación en buen estado,','para dejar constancia de las condiciones en que la recibí.'],
  criteria:[
   {dado:'que el huésped ya recibió la habitación',cuando:'confirma la recepción',entonces:'el sistema guarda la confirmación con fecha y hora.'},
   {dado:'que el huésped encuentra un problema (limpieza, daños o servicios)',cuando:'lo reporta',entonces:'el sistema lo registra y notifica a recepción para atenderlo.'},
   {dado:'que el huésped no confirma en un plazo definido',cuando:'pasa el tiempo',entonces:'el sistema deja la recepción como "pendiente de confirmar".'},
  ]},
 {id:'HU-13',title:'Modificar fecha de reserva',epic:'Reservar habitación',priority:'Should',
  story:['Como huésped con una reserva en el Hotel Amerindia,','quiero modificar las fechas de mi reserva desde el chatbot,','para ajustar mi estadía si cambian mis planes sin tener que cancelar y volver a reservar.'],
  criteria:[
   {dado:'que el usuario tiene una reserva activa',cuando:'ingresa su código e indica las nuevas fechas de llegada y salida',entonces:'el chatbot verifica la disponibilidad y le muestra el nuevo valor total para que confirme el cambio.'},
   {dado:'que el usuario confirma el cambio',cuando:'el chatbot lo procesa',entonces:'actualiza las fechas de la reserva, libera las fechas anteriores y envía un mensaje con los nuevos datos.'},
   {dado:'que no hay disponibilidad en las nuevas fechas o la fecha de llegada ya pasó',cuando:'el usuario intenta modificar',entonces:'el chatbot le informa que no es posible, mantiene la reserva original y le ofrece otras fechas o hablar con recepción.'},
  ]},
];

export const expectedBenefits = 'La implementación del chatbot de reservas permitirá al Hotel Amerindia atender a los turistas a cualquier hora, sin depender de la línea telefónica ni de que un recepcionista esté libre. Con esto se espera aumentar las reservas concretadas, reducir los errores en el registro de datos y liberar tiempo del personal para otras tareas, mejorando la experiencia del turista y la competitividad del hotel frente a las plataformas en línea.';

// Integrantes del equipo que desarrolla el proyecto. La sección se muestra en /bpmn en cuanto haya al menos un nombre.
// Formato: { name: 'Nombre Apellido', role: 'Rol opcional' }
export const teamMembers: { name: string; role?: string }[] = [];
