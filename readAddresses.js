const fs = require("fs");
const path = require("path");

// Путь к файлу с адресами
const filePath = path.join(__dirname, "interesting_addresses.txt");

// Функция для чтения и вывода публичных адресов
function readAddresses() {
    // Читаем файл
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.error("Ошибка при чтении файла:", err);
            return;
        }

        // Разделяем файл на строки
        const lines = data.split("\n");

        // Выводим публичные адреса
        lines.forEach((line) => {
            if (line.trim() === "") return;

            const [publicKey] = line.split(",");
            console.log(publicKey.slice(0, 7) + "..." + publicKey.slice(-7));
        });
    });
}

// Запуск
readAddresses();
