import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {OpenAI} from 'openai';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';
import { franc } from 'franc';
import dotenv from 'dotenv';
dotenv.config(); // Esto carga las variables del archivo .env al process.env

const app = express();
const server = http.createServer(app);  



app.use(cors());
app.use(express.json());
const io = new Server(server, {
    cors: {
      origin: '*',
    },
    transports: ['websocket', 'polling'], // Asegúrate de incluir 'websocket'
  });

const openai = new OpenAI({
    baseURL: process.env.URLDEPSEEK,
    apiKey: process.env.DEPSEEK
  });


const contexto = 'Actuas como el chef Alessandro Dolfi, propietario de Trattoria La Pasta, lugar autentico con recetas originales de la abuela Anna. No tomas orden de nada solo informas sobre todo lo que puedas.Respondes sin mentir, si no tenes informacion sobre alguna pregunta, pedis disculpas. Respondes en el mismo idioma que te escriba el cliente, de forma breve y amable. ' +
    'Si te escriben exactamente "Quiero ver el menu": respondes exactamente esto: Aqui esta el menu trattorialapasta.com/menu' +
    'Si te escriben exactamente "Necesito ayuda": te presentas y te pones disposicion de lo que el cliente requiera ' +
    'El horario de atencion al cliente es de Lunes a Domingo de 13hs a 23hs' +
    'No tomas reservas, solo informas que aceptamos reservas solamente de Lunes a Jueves al siguiente numero de telefono: 999000999' +
'Manten el contexto de las ultimas 6 preguntas a menos que el usuario cambie de tema. ' +
    'Si el usuario cambia de tema, responde unicamente a la ultima pregunta. ' +
    'No repitas el menu completo. solo sugeri sabores o platos si el cliente lo pide. Aqui esta le menu: ' +
'Gnocchi al Tartufo: Gnocchi de papas, arugula, nueces de castilla y crema de trufa. 325 MXN. ' +
'Gnocchi al Pistacchio: Gnocchi de pistache y burrata. 315 MXN. ' +
'Pizza Coppa: Salsa de tomate, mozzarella, jamon Bondiola, queso provolone y aceitunas Kalamatas. 305 MXN. ' +
'Carpaccio di Pere: Peras, queso gorgonzola, nueces caramelizadas, arugula y tomates deshidratados. 229 MXN. ' +
'Crostini di Salmone: Salmón ahumado y queso Philadelphia. 249 MXN. ' +
'Banana Split: Plátano, helado Napolitano, crema batida, Nutella y almendras rebanadas. 160 MXN. ' +
'Pizza Carbonara: Mozzarella rallada, huevos orgánicos, tocino italiano y parmesano. 265 MXN. ' +
'Pizza frita Pulcinella: Salsa de tomate, mozzarella fresca, queso provolone y salami italiano. 335 MXN. ' +
'Pizza Prosciutto Parmigiano e Rucola: Salsa de tomate, mozzarella, jamón serrano, arugula, Parmesano y tomates cherries. 305 MXN. ' +
'Pizza al Tartufo: Queso mozzarella, gorgonzola, salsa de trufa negra y hongos portobellos. 305 MXN. ' +
'Pizza Margherita: Salsa de tomate, mozzarella fresca y albahaca. 235 MXN. ' +
'Pizza Quattro Formaggi: Salsa de tomate, mozzarella, Parmesano, gorgonzola y cheddar. 275 MXN. ' +
'Pizza Vegetariana: Salsa de tomate, mozzarella, tomates cherries, calabacines, pimientos y cebolla morada. 250 MXN. ' +
'Mozzarella e Coppa: Mozzarella burrata con jamón Bondiola, arugula y crema de vinagre balsámico. 249 MXN. ' +
'Bruschetta ai Funghi: Pan tostado con champiñones al romero y trufa. 179 MXN. ' +
'Carpaccio di Pere: Peras, queso gorgonzola, nueces caramelizadas, arugula y tomates deshidratados. 229 MXN. ' +
'Crostini di Salmone: Salmón ahumado y queso Philadelphia. 249 MXN. ' +
'Pane allAglio: Panecillos de ajo con queso fundido y perejil. 139 MXN. ' +
'Bruschetta al Pomodoro: Pan tostado con tomate, aceite de oliva y albahaca. 169 MXN. ' +
'Provolone: Queso provolone fundido con orégano y salsa de tomate. 219 MXN. ' +
'Carpaccio di Manzo: Carne de res con aderezo de alcaparras, Parmesano y arugula. 229 MXN. ' +
'Insalata Gallipoli: Lechuga, arugula, aceitunas kalamatas, tomates deshidratados, bondiola y burrata. 245 MXN. ' +
'Insalata Melinda: Lechuga, manzanas, queso Feta, arándanos, gorgonzola, nueces y vinagreta. 225 MXN. ' +
'Insalata Caprese: Tomate, mozzarella fresca, albahaca y vinagre balsámico. 205 MXN. ' +
'Insalata Greca: Lechuga, queso feta, aceitunas negras, cebolla morada, tomates cherry y pepino. 209 MXN. ' +
'Insalata Fragolina: Espinaca, fresas, queso de cabra, almendras y aderezo de frambuesa con chipotle. 235 MXN. ' +
'Insalata Mari e Monti: Lechuga, tocino, cebolla morada, camarones, champiñones y cacahuates. 249 MXN. ' +
'Insalata Cesar: Lechuga, tomate, crutones, pollo asado y salsa Cesar. 215 MXN. ' +
'Insalata Formaggio e Pere: Lechuga, espinaca, peras, Parmesano, nueces y vinagre balsámico. 219 MXN. ' +
'Spaghetti allo Scoglio: Almejas, mejillones, pulpo, calamares y tomates frescos picados con picante. 285 MXN. ' +
'Penne al Vodka: Salmón salteado con vodka y almendras en salsa rosada. 305 MXN. ' +
'Fettuccini Mari e Monti: Camarones, tocino y champiñones salteados en ajo, aceite de oliva y crema. 295 MXN. ' +
'Linguine Gamberetti e Limone: Camarones en salsa de limón y vino blanco con picante. 295 MXN. ' +
'Fettuccine al Nero di Seppia: Fettuccine de tinta de calamar con camarones, mejillones y tomates cherries. 315 MXN. ' +
'Lasagne: 6 pisos de carne boloñesa, parmesano, salsa bechamel y mozzarella fresca. 245 MXN. ' +
'Gnocchi al Tartufo: Gnocchi de papas, arugula, nueces de castilla y crema de trufa. 325 MXN. ' +
'Gnocchi al Pistacchio: Gnocchi de pistache y burrata. 315 MXN. ' +
'Fettuccine alle Salsicce: Hongos portobellos y chorizo italiano en salsa de tomate. 285 MXN. ' +
'Linguine Gorgonzola e Pere: Salsa de gorgonzola, peras a la mantequilla y nueces. 255 MXN. ' +
'Fettuccine Salame e Provola: Salami italiano y provolone en salsa de tomate. 265 MXN. ' +
'Fettuccine al Cacao: Fettuccine de cacao con piñones, tocino, hongos, arándanos y Torres. 295 MXN. ' +
'Farfalle al Pesto Genovese: Pasta mariposa con salsa de albahaca, ajo, nueces y Parmesano. 255 MXN. ' +
'Gnocchi alla Sorrentina: El preferido del chef! 320 MXN.';


const SIMILARITY_THRESHOLD = 0.7;
let extractor;

async function initializeEmbeddings() {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

initializeEmbeddings();

async function calculateSimilarity(message1, message2) {
    const output1 = await extractor(message1, { pooling: 'mean', normalize: true });
    const output2 = await extractor(message2, { pooling: 'mean', normalize: true });

    const embeddings1 = output1.data;
    const embeddings2 = output2.data;

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embeddings1.length; i++) {
        dotProduct += embeddings1[i] * embeddings2[i];
        magnitude1 += embeddings1[i] * embeddings1[i];
        magnitude2 += embeddings2[i] * embeddings2[i];
    }

    const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    return similarity;
}

const mensajes = new Map(); // Usaremos un Map para almacenar el estado de cada socket
const initialResponseMessage = JSON.stringify({
    text: "¡Hola! ¿Qué te gustaría hacer?",
    options: [
        { label: "Ver el menú", value: "Quiero ver el menu" },
        { label: "Ayuda con algunas preguntas", value: "Necesito ayuda" }
    ]
});

io.on('connection', async (socket) => {
    console.log('--- NUEVA CONEXIÓN DETECTADA ---'); // Agregamos este log al inicio
    console.log('Socket ID:', socket.id);
    console.log('Dirección IP del cliente:', socket.handshake.address);
    try {
        mensajes.set(socket.id, { hasSentInitialResponse: false, history: [] });

        socket.on('mensajeUsuario', async (message) => {
            try {
                if (typeof message !== 'string') {
                    throw new Error("El mensaje del usuario debe ser una cadena de texto.");
                }
                const startTime = Date.now();
                const socketData = mensajes.get(socket.id);
                const history = socketData.history;

                if (!socketData.hasSentInitialResponse) {
                    socket.emit('respuestaBot', initialResponseMessage);
                    socketData.hasSentInitialResponse = true;
                    history.push({ role: 'user', content: message });
                    mensajes.set(socket.id, socketData);
                    return; // No procesar con IA el primer mensaje
                }

                // Después de enviar el mensaje inicial, verifica la respuesta del usuario (opción elegida)
                if (history.length === 1 && socketData.hasSentInitialResponse) {
                    if (message === 'MENU') {
                        socket.emit('respuestaBot', contexto.split('Aqui esta le menu: ')[1]); // Enviar el menú
                        return;
                    } else if (message === 'AYUDA') {
                        socket.emit('respuestaBot', '¡Claro! ¿Con qué necesitas ayuda?');
                        return;
                    }
                }

                let cambioTema = false;

                if (history.length > 0) {
                    const ultimoMensaje = history[history.length - 1].content;
                    const similaridad = await calculateSimilarity(message, ultimoMensaje);

                    if (similaridad < SIMILARITY_THRESHOLD) {
                        cambioTema = true;
                    }
                }

                history.push({ role: 'user', content: message });

                if (history.length > 6) {
                    history.shift();
                }

                let mensajesEnviar = history;

                if (cambioTema) {
                    mensajesEnviar = history.slice(-1);
                }

                const detectedLanguage = franc(message);

                const response = await openai.chat.completions.create({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: contexto,
                        },
                        ...mensajesEnviar,
                    ],
                    max_tokens: 250,
                });

                const endTime = Date.now();
                const duration = endTime - startTime;
                console.log(`Duración de la solicitud: ${duration} ms`);
                const botResponse = response.choices[0].message.content.trim();
                socket.emit('respuestaBot', botResponse);
                history.push({ role: 'assistant', content: botResponse });
                mensajes.set(socket.id, socketData);

            } catch (error) {
                console.error('Error al procesar mensajeUsuario:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
            mensajes.delete(socket.id);
        });

    } catch (error) {
        console.error('Error en la conexión del socket:', error); // Capturamos errores en la conexión
    }
});


const PORT = process.env.URL || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});



process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});