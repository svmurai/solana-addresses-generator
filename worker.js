const { workerData, parentPort } = require("worker_threads");
const { Keypair } = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");
const { Mutex } = require("async-mutex");
const bs58 = require("bs58");

// Мьютекс для синхронизации записи в файл
const mutex = new Mutex();

// Функция для проверки, подходит ли адрес
function isInterestingAddress(publicKey) {
    const lowerPublicKey = publicKey.toLowerCase();

    // Проверяем, начинается ли адрес на SVM (регистр важен)
    if (publicKey.startsWith("SVM")) {
        return true;
    }

    // Проверяем, содержит ли адрес что-то похожее на "svmurai" или "samurai"
    const variants = [
        "svmurai", "sVmUrAi", "samurai", "svmural", "svmur4i", "svmur41", "svmur4l",
        "5vmur41", "5vmurai", "svmura1", "svmura!", "svmur@i", "samur@i", "samur@1",
        "samura1", "samura!", "svmura1", "svmur@1", "samur@1"
    ];

    // Проверяем, начинается ли адрес на что-то похожее на "svmurai" (регистр не важен)
    for (const variant of variants) {
        if (lowerPublicKey.startsWith(variant)) {
            return true;
        }
    }

    return false;
}

// Функция для генерации и поиска адресов
async function generateAndSearchAddresses(workerId) {
    const filePath = path.join(__dirname, "interesting_addresses.txt"); // Один файл для всех worker'ов

    // Создаем файл, если он не существует
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, ""); // Создаем пустой файл
    }

    let attempts = 0;
    const batchSize = 1000; // Размер пакета
    const pauseDuration = 1500; // Пауза между пакетами (в миллисекундах)

    while (true) {
        for (let i = 0; i < batchSize; i++) {
            attempts++;

            // Генерация новой ключевой пары
            const keypair = Keypair.generate();
            const publicKey = keypair.publicKey.toBase58();
            const privateKey = bs58.default.encode(keypair.secretKey); // Преобразуем приватный ключ в Base58

            // Проверка, подходит ли адрес
            if (isInterestingAddress(publicKey)) {
                // Сообщаем основному потоку о найденном адресе
                parentPort.postMessage({
                    type: "found",
                    publicKey,
                });

                // Используем мьютекс для синхронизации записи
                const release = await mutex.acquire();
                try {
                    fs.appendFileSync(filePath, `${publicKey},${privateKey}\n`);
                } catch (err) {
                    console.error(`Worker ${workerId}: Ошибка записи адреса:`, err);
                } finally {
                    release(); // Освобождаем мьютекс
                }
            }
        }

        // Отправляем прогресс основному потоку
        parentPort.postMessage({
            type: "progress",
            attempts,
        });

        // Пауза между пакетами
        await new Promise((resolve) => setTimeout(resolve, pauseDuration));
    }
}

// Запуск генерации
generateAndSearchAddresses(workerData.workerId);
