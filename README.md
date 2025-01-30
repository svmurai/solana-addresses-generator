# Solana Addresses Generator

Этот проект позволяет генерировать адреса на блокчейне Solana, которые начинаются с определенного префикса или содержат интересные комбинации символов (например, `SVMURAI`, `samurai` и т.д.). Адреса сохраняются в файл, а приватные ключи преобразуются в формат Base58 для удобного импорта в кошельки, такие как Phantom.

---

## Оглавление

1. [Установка](#установка)
2. [Запуск](#запуск)
3. [Настройка нагрузки на процессор](#настройка-нагрузки-на-процессор)
4. [Изменение критериев поиска](#изменение-критериев-поиска)

---

## Установка

1. Убедись, что у тебя установлен [Node.js](https://nodejs.org/) (версия 12 или выше).
2. Клонируй репозиторий:
   ```bash
   git clone https://github.com/svmurai/solana-addresses-generator.git
   cd solana-addresses-generator
   ```

## Запуск

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите приложение:
   ```bash
   node main.js
   ```
3. Сгенерированные по мере работы программы адреса будут сохранены в файл `interesting_addresses.txt`.
4. Для удобства чтения адресов есть скрипт `readAddresses.js`, который читает и выводит адреса в удобном формате.

   ```bash
   node readAddresses.js
   ```

## Настройка нагрузки на процессор

1. Измените количество потоков в константе `numThreads` в файле `main.js` (по умолчанию равно количеству ядер CPU).
2. Увеличьте задержку в константе `delay` в файле `worker.js` (по умолчанию равно 1500 миллисекунд).

## Изменение критериев поиска

1. Измените критерии поиска в функции `isInterestingAddress` в файле `worker.js`.
