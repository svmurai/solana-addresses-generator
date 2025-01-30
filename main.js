const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const path = require("path");
const os = require("os");

// Количество потоков (по умолчанию равно количеству ядер CPU)
const numThreads = os.cpus().length;

// Функция для запуска worker'ов
function runWorker(workerId) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, "worker.js"), {
            workerData: { workerId },
        });

        worker.on("message", (message) => {
            if (message.type === "found") {
                console.log(`\nWorker ${workerId} нашел интересный адрес!`);
                console.log(`Публичный ключ: ${message.publicKey}`);
            } else if (message.type === "progress") {
                console.log(`Worker ${workerId}: ${message.attempts} попыток...`);
            }
        });

        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0) reject(new Error(`Worker ${workerId} остановлен с кодом ${code}`));
            else resolve();
        });
    });
}

// Запуск всех worker'ов
async function main() {
    console.log(`Запуск ${numThreads} worker'ов...`);

    const workerPromises = [];
    for (let i = 0; i < numThreads; i++) {
        workerPromises.push(runWorker(i));
    }

    await Promise.all(workerPromises);
    console.log("Все worker'ы завершили работу.");
}

// Запуск
main().catch((err) => console.error(err));
